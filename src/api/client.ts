/**
 * Wavix HTTP Client
 *
 * Direct HTTP calls with typed responses
 */

import { config } from "../config/index.js"
import { logger } from "../helpers/logger.js"
import { maskApiKey } from "../helpers/masking.js"

export class WavixApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = "WavixApiError"
  }
}

export interface RequestOptions {
  timeout?: number
  retries?: number
}

export class WavixClient {
  private baseUrl: string
  private apiKey: string | undefined
  private defaultTimeout = 30000
  private maxRetries = 3

  constructor() {
    this.baseUrl = config.wavix.apiUrl
    this.apiKey = config.wavix.apiKey

    logger.debug("WavixClient initialized", {
      baseUrl: this.baseUrl,
      apiKey: this.apiKey ? maskApiKey(this.apiKey) : "(not set - Setup Mode)",
      hasApiKey: config.wavix.hasApiKey
    })
  }

  /**
   * Check if API key is available (Full Mode)
   */
  get isEnabled(): boolean {
    return config.wavix.hasApiKey
  }

  /**
   * Get current API base URL
   */
  getBaseUrl(): string {
    return this.baseUrl
  }

  /**
   * Set API base URL dynamically
   */
  setBaseUrl(url: string): void {
    try {
      new URL(url)
      this.baseUrl = url
      logger.info("API URL updated", { baseUrl: url })
    } catch (error) {
      throw new WavixApiError(`Invalid URL: ${url}`, 400)
    }
  }

  async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    if (!this.apiKey) {
      throw new WavixApiError("API key not configured. Set WAVIX_API_KEY environment variable.", 401)
    }

    const url = `${this.baseUrl}${path}${path.includes("?") ? "&" : "?"}appid=${this.apiKey}`
    const timeout = options?.timeout ?? this.defaultTimeout
    const maxRetries = options?.retries ?? this.maxRetries

    const log = logger.child({ method, path })

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        log.debug("Making request", { attempt, timeout })

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorBody = (await response.json().catch(() => ({}))) as Record<string, unknown>

          // Retry on 429 (rate limit) or 5xx errors
          if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
            const retryAfter = parseInt(response.headers.get("Retry-After") || "1", 10)
            log.warn("Request failed, retrying", {
              status: response.status,
              retryAfter,
              attempt
            })
            await this.sleep(retryAfter * 1000)
            continue
          }

          throw new WavixApiError(
            (errorBody.message as string) || `HTTP ${response.status}`,
            response.status,
            errorBody.code as string | undefined,
            errorBody
          )
        }

        const data = (await response.json()) as T
        log.debug("Request successful")
        return data
      } catch (error) {
        if (error instanceof WavixApiError) {
          throw error
        }

        if (error instanceof Error && error.name === "AbortError") {
          throw new WavixApiError("Request timeout", 408)
        }

        log.error("Request error", { error })
        throw new WavixApiError(error instanceof Error ? error.message : "Unknown error", 500)
      }
    }

    throw new WavixApiError("Max retries exceeded", 500)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Convenience methods - will be typed with generated types
  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, undefined, options)
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("POST", path, body, options)
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PUT", path, body, options)
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, undefined, options)
  }
}

export default WavixClient
