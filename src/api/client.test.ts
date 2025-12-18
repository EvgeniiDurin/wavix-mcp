/**
 * Wavix API Client Tests
 *
 * Integration tests for the Wavix API client.
 * Uses real config values and mocks only global fetch.
 */

import { describe, expect, it, beforeEach, afterEach, jest } from "@jest/globals"
import { WavixClient, WavixApiError } from "./client.js"
import { config } from "../config/index.js"
import { createMockFetch, setupConsoleMocks, runConcurrently } from "../test-utils.js"

// Store original fetch
const originalFetch = global.fetch

describe("WavixClient", () => {
  let client: WavixClient
  let mockFetch: jest.MockedFunction<typeof fetch>
  let fetchHelpers: ReturnType<typeof createMockFetch>

  // Suppress console logs
  setupConsoleMocks()

  beforeEach(() => {
    fetchHelpers = createMockFetch()
    mockFetch = fetchHelpers.mockFetch
    global.fetch = mockFetch
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  describe("constructor", () => {
    it("should create client instance with expected properties", () => {
      client = new WavixClient()

      expect(client).toBeInstanceOf(WavixClient)
      expect(typeof client.isEnabled).toBe("boolean")
      expect(typeof client.request).toBe("function")
      expect(typeof client.get).toBe("function")
      expect(typeof client.post).toBe("function")
      expect(typeof client.put).toBe("function")
      expect(typeof client.delete).toBe("function")
    })

    it("should reflect config.wavix.hasApiKey in isEnabled", () => {
      client = new WavixClient()
      expect(client.isEnabled).toBe(config.wavix.hasApiKey)
    })
  })

  // Use describe.skip for tests that require API key when not available
  const describeWithApiKey = config.wavix.hasApiKey ? describe : describe.skip
  const describeWithoutApiKey = config.wavix.hasApiKey ? describe.skip : describe

  describeWithApiKey("GET requests (Full Mode)", () => {
    beforeEach(() => {
      client = new WavixClient()
    })

    it("should make successful GET request with correct structure", async () => {
      const mockData = { id: 1, name: "test", items: [1, 2, 3] }
      fetchHelpers.mockSuccess(mockData)

      const result = await client.request("GET", "/v2/profile")

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/v2/profile"),
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: undefined
        })
      )
      expect(result).toEqual(mockData)
    })

    it("should append appid to URL without query string", async () => {
      fetchHelpers.mockSuccess({})

      await client.request("GET", "/v2/profile")

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string
      expect(calledUrl).toMatch(/\/v2\/profile\?appid=.+/)
    })

    it("should append appid to URL with existing query string", async () => {
      fetchHelpers.mockSuccess({})

      await client.request("GET", "/v2/search?query=test&limit=10")

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string
      expect(calledUrl).toContain("query=test")
      expect(calledUrl).toContain("limit=10")
      expect(calledUrl).toContain("&appid=")
    })
  })

  describeWithApiKey("POST requests (Full Mode)", () => {
    beforeEach(() => {
      client = new WavixClient()
    })

    it("should make POST request with JSON body", async () => {
      const requestBody = { to: "+1234567890", text: "Hello", from: "+0987654321" }
      const mockResponse = { success: true, messageId: "msg_123" }
      fetchHelpers.mockSuccess(mockResponse)

      const result = await client.request("POST", "/v2/sms/send", requestBody)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(requestBody)
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it("should make POST request without body", async () => {
      fetchHelpers.mockSuccess({ triggered: true })

      await client.request("POST", "/v2/action/trigger")

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          body: undefined
        })
      )
    })
  })

  describeWithApiKey("Error handling (Full Mode)", () => {
    beforeEach(() => {
      client = new WavixClient()
    })

    it("should throw WavixApiError on 400 with full error details", async () => {
      fetchHelpers.mockError(400, {
        message: "Invalid request",
        code: "INVALID_REQUEST",
        details: { field: "email", reason: "required" }
      })

      await expect(client.request("GET", "/v2/test")).rejects.toThrow(WavixApiError)

      try {
        await client.request("GET", "/v2/test")
      } catch (error) {
        expect(error).toBeInstanceOf(WavixApiError)
        const apiError = error as WavixApiError
        expect(apiError.message).toBe("Invalid request")
        expect(apiError.statusCode).toBe(400)
        expect(apiError.code).toBe("INVALID_REQUEST")
      }
    })

    it("should throw WavixApiError on 401 Unauthorized", async () => {
      fetchHelpers.mockError(401, { message: "Invalid API key" })

      await expect(client.request("GET", "/v2/test")).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid API key"
      })
    })

    it("should throw WavixApiError on 403 Forbidden", async () => {
      fetchHelpers.mockError(403, { message: "Access denied" })

      await expect(client.request("GET", "/v2/test")).rejects.toMatchObject({
        statusCode: 403
      })
    })

    it("should throw WavixApiError on 404 Not Found", async () => {
      fetchHelpers.mockError(404, { message: "Resource not found" })

      await expect(client.request("GET", "/v2/nonexistent")).rejects.toMatchObject({
        statusCode: 404
      })
    })

    it("should handle malformed error response gracefully", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.reject(new Error("Invalid JSON")),
        headers: new Headers()
      } as Response)

      await expect(client.request("GET", "/v2/test")).rejects.toThrow(WavixApiError)
    })
  })

  describeWithApiKey("Retry logic (Full Mode)", () => {
    beforeEach(() => {
      client = new WavixClient()
    })

    it("should retry on 429 rate limit and succeed", async () => {
      fetchHelpers.mockRateLimitThenSuccess({ data: "success" })

      const result = await client.request("GET", "/v2/test")

      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(result).toEqual({ data: "success" })
    })

    it("should retry on 500 server error and succeed", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ message: "Internal error" }),
          headers: new Headers({ "Retry-After": "0" })
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ recovered: true }),
          headers: new Headers()
        } as Response)

      const result = await client.request("GET", "/v2/test")

      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(result).toEqual({ recovered: true })
    })

    it("should exhaust retries and throw on persistent 500", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: "Server error" }),
        headers: new Headers({ "Retry-After": "0" })
      } as Response)

      await expect(client.request("GET", "/v2/test")).rejects.toThrow(WavixApiError)
      expect(mockFetch).toHaveBeenCalledTimes(3) // Default max retries
    })

    it("should respect custom retries option", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: "Error" }),
        headers: new Headers({ "Retry-After": "0" })
      } as Response)

      await expect(client.request("GET", "/v2/test", undefined, { retries: 1 })).rejects.toThrow()
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describeWithApiKey("Timeout handling (Full Mode)", () => {
    beforeEach(() => {
      client = new WavixClient()
    })

    it("should throw timeout error when request exceeds timeout", async () => {
      fetchHelpers.mockTimeout()

      await expect(client.request("GET", "/v2/test", undefined, { timeout: 50 })).rejects.toThrow("Request timeout")
    }, 10000)

    it("should include correct status code for timeout", async () => {
      fetchHelpers.mockTimeout()

      try {
        await client.request("GET", "/v2/test", undefined, { timeout: 50 })
      } catch (error) {
        expect(error).toBeInstanceOf(WavixApiError)
        expect((error as WavixApiError).statusCode).toBe(408)
      }
    }, 10000)
  })

  describeWithApiKey("Network errors (Full Mode)", () => {
    beforeEach(() => {
      client = new WavixClient()
    })

    it("should wrap network errors in WavixApiError", async () => {
      fetchHelpers.mockNetworkError("ECONNREFUSED")

      await expect(client.request("GET", "/v2/test")).rejects.toThrow("ECONNREFUSED")
    })

    it("should handle DNS resolution errors", async () => {
      fetchHelpers.mockNetworkError("ENOTFOUND")

      await expect(client.request("GET", "/v2/test")).rejects.toThrow(WavixApiError)
    })
  })

  describeWithApiKey("Convenience methods (Full Mode)", () => {
    beforeEach(() => {
      client = new WavixClient()
    })

    it("get() should call request with GET method", async () => {
      fetchHelpers.mockSuccess({ data: "get" })

      const result = await client.get("/v2/test")

      expect(result).toEqual({ data: "get" })
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/v2/test"),
        expect.objectContaining({ method: "GET" })
      )
    })

    it("post() should call request with POST method and body", async () => {
      fetchHelpers.mockSuccess({ created: true })
      const body = { name: "test" }

      const result = await client.post("/v2/test", body)

      expect(result).toEqual({ created: true })
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "POST", body: JSON.stringify(body) })
      )
    })

    it("put() should call request with PUT method and body", async () => {
      fetchHelpers.mockSuccess({ updated: true })
      const body = { name: "updated" }

      const result = await client.put("/v2/test", body)

      expect(result).toEqual({ updated: true })
      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: "PUT" }))
    })

    it("delete() should call request with DELETE method", async () => {
      fetchHelpers.mockSuccess({ deleted: true })

      const result = await client.delete("/v2/test")

      expect(result).toEqual({ deleted: true })
      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: "DELETE" }))
    })
  })

  describeWithApiKey("Concurrency (Full Mode)", () => {
    beforeEach(() => {
      client = new WavixClient()
    })

    it("should handle multiple concurrent requests", async () => {
      fetchHelpers.mockSuccess({ data: "success" })

      const results = await runConcurrently(10, i => client.get(`/v2/resource/${i}`))

      expect(results).toHaveLength(10)
      expect(mockFetch).toHaveBeenCalledTimes(10)
      results.forEach(result => {
        expect(result).toEqual({ data: "success" })
      })
    })

    it("should handle mixed success and failure in concurrent requests", async () => {
      let callCount = 0
      mockFetch.mockImplementation(async () => {
        callCount++
        if (callCount % 2 === 0) {
          return {
            ok: false,
            status: 500,
            json: () => Promise.resolve({ message: "Error" }),
            headers: new Headers()
          } as Response
        }
        return {
          ok: true,
          json: () => Promise.resolve({ success: true }),
          headers: new Headers()
        } as Response
      })

      const promises = Array.from({ length: 4 }, (_, i) =>
        client.get(`/v2/resource/${i}`).catch((e: Error) => ({ error: e.message }))
      )

      const results = await Promise.all(promises)

      const successes = results.filter(r => "success" in r)
      const failures = results.filter(r => "error" in r)

      expect(successes.length).toBeGreaterThan(0)
      expect(failures.length).toBeGreaterThan(0)
    })
  })

  describeWithoutApiKey("Documentation Mode (no API key)", () => {
    it("should throw error when making request without API key", async () => {
      client = new WavixClient()

      await expect(client.request("GET", "/v2/profile")).rejects.toThrow("API key not configured")
    })

    it("should have isEnabled = false", () => {
      client = new WavixClient()
      expect(client.isEnabled).toBe(false)
    })
  })

  describeWithApiKey("Negative tests - Input validation (Full Mode)", () => {
    beforeEach(() => {
      client = new WavixClient()
      fetchHelpers.mockSuccess({})
    })

    it("should handle empty path", async () => {
      await expect(client.request("GET", "")).resolves.toBeDefined()
    })

    it("should handle path with special characters", async () => {
      await client.request("GET", "/v2/search?q=hello%20world&tag=test%26value")

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string
      expect(calledUrl).toContain("hello%20world")
    })

    it("should handle very long path", async () => {
      const longPath = "/v2/resource/" + "x".repeat(1000)
      await client.request("GET", longPath)

      expect(mockFetch).toHaveBeenCalled()
    })

    it("should handle body with special characters", async () => {
      const body = { text: "Hello <script>alert('xss')</script> world" }
      await client.request("POST", "/v2/test", body)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(body)
        })
      )
    })

    it("should handle body with unicode", async () => {
      const body = { message: "Привет мир 🌍 こんにちは" }
      await client.request("POST", "/v2/test", body)

      const calledBody = JSON.parse(mockFetch.mock.calls[0]?.[1]?.body as string)
      expect(calledBody.message).toBe("Привет мир 🌍 こんにちは")
    })

    it("should handle deeply nested body", async () => {
      const body = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: { value: "deep" }
              }
            }
          }
        }
      }

      await client.request("POST", "/v2/test", body)
      expect(mockFetch).toHaveBeenCalled()
    })

    it("should handle array body", async () => {
      const body = [1, 2, 3, { nested: true }]
      await client.request("POST", "/v2/test", body as unknown as Record<string, unknown>)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(body)
        })
      )
    })

    it("should handle body with null values", async () => {
      const body = { field1: null, field2: "value", field3: undefined }
      await client.request("POST", "/v2/test", body)

      const calledBody = JSON.parse(mockFetch.mock.calls[0]?.[1]?.body as string)
      expect(calledBody.field1).toBeNull()
      expect(calledBody.field2).toBe("value")
    })
  })
})

describe("WavixApiError", () => {
  it("should create error with all properties", () => {
    const error = new WavixApiError("Test error", 400, "TEST_CODE", { field: "email" })

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(WavixApiError)
    expect(error.message).toBe("Test error")
    expect(error.statusCode).toBe(400)
    expect(error.code).toBe("TEST_CODE")
    expect(error.details).toEqual({ field: "email" })
    expect(error.name).toBe("WavixApiError")
  })

  it("should create error with only required properties", () => {
    const error = new WavixApiError("Minimal error", 500)

    expect(error.message).toBe("Minimal error")
    expect(error.statusCode).toBe(500)
    expect(error.code).toBeUndefined()
    expect(error.details).toBeUndefined()
  })

  it("should preserve stack trace with source location", () => {
    const error = new WavixApiError("Test", 500)

    expect(error.stack).toBeDefined()
    expect(error.stack).toContain("WavixApiError")
    expect(error.stack).toContain("client.test.ts")
  })

  it("should be catchable as Error", () => {
    const throwError = () => {
      throw new WavixApiError("Test", 500)
    }

    expect(throwError).toThrow(Error)
  })
})
