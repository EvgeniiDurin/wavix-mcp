/**
 * Response Transformer
 *
 * Transforms API responses to optimize token usage in MCP.
 * Implements all optimization strategies:
 * 1. Response truncation with metadata
 * 2. Field selection (summary mode)
 * 3. Compact JSON formatting
 * 4. Size monitoring with auto-truncate
 */

import { logger } from "../helpers/logger.js"
import { getResponseConfig, type ResponseConfig } from "./response-config.js"

/** Approximate characters per token (conservative estimate) */
const CHARS_PER_TOKEN = 4

/** Maximum response size in tokens before triggering compact mode */
const MAX_TOKENS_PRETTY = 3000 // ~12KB with formatting

/** Maximum response size in tokens before truncation warning */
const MAX_TOKENS_TOTAL = 8000 // ~32KB

/** Environment variable to force compact JSON */
const COMPACT_JSON_ENV = process.env.MCP_COMPACT_JSON === "true"

export interface TransformResult {
  /** Transformed data */
  data: unknown
  /** Whether response was truncated */
  truncated: boolean
  /** Whether compact JSON should be used */
  useCompactJson: boolean
  /** Metadata about transformation */
  meta?: ResponseMeta
}

export interface ResponseMeta {
  /** Original item count before truncation */
  totalItems?: number
  /** Items returned after truncation */
  returnedItems?: number
  /** Fields included in summary mode */
  summaryFields?: Array<string>
  /** Pagination hint for user */
  paginationHint?: string
  /** Warning message if any */
  warning?: string
}

/**
 * Pick only specified fields from an object
 */
function pickFields<T extends Record<string, unknown>>(obj: T, fields: Array<string>): Partial<T> {
  const result: Partial<T> = {}
  for (const field of fields) {
    if (field in obj) {
      result[field as keyof T] = obj[field as keyof T]
    }
  }
  return result
}

/**
 * Remove specified fields from an object
 */
function omitFields<T extends Record<string, unknown>>(obj: T, fields: Array<string>): Partial<T> {
  const result = { ...obj }
  for (const field of fields) {
    delete result[field as keyof T]
  }
  return result
}

/**
 * Estimate token count for a JSON string
 */
function estimateTokens(json: string): number {
  return Math.ceil(json.length / CHARS_PER_TOKEN)
}

/**
 * Check if result is a list response with items
 */
function isListResponse(result: unknown): result is { items: Array<unknown> } {
  return (
    typeof result === "object" &&
    result !== null &&
    "items" in result &&
    Array.isArray((result as { items: Array<unknown> }).items)
  )
}

/**
 * Check if result is an array
 */
function isArrayResponse(result: unknown): result is Array<unknown> {
  return Array.isArray(result)
}

/**
 * Transform list items based on config
 */
function transformItems(items: Array<unknown>, config: ResponseConfig): { items: Array<unknown>; meta: ResponseMeta } {
  const meta: ResponseMeta = {}
  let transformed = [...items]

  // Apply field selection (summary mode)
  if (config.summaryFields && config.summaryFields.length > 0) {
    transformed = transformed.map(item => {
      if (typeof item === "object" && item !== null) {
        return pickFields(item as Record<string, unknown>, config.summaryFields!)
      }
      return item
    })
    meta.summaryFields = config.summaryFields
  }

  // Apply field exclusion
  if (config.excludeFields && config.excludeFields.length > 0) {
    transformed = transformed.map(item => {
      if (typeof item === "object" && item !== null) {
        return omitFields(item as Record<string, unknown>, config.excludeFields!)
      }
      return item
    })
  }

  // Apply truncation if needed
  if (config.maxItems && items.length > config.maxItems) {
    meta.totalItems = items.length
    meta.returnedItems = config.maxItems
    meta.paginationHint = `Response truncated. Use page and per_page parameters to paginate (e.g., per_page=${config.maxItems}, page=2)`
    transformed = transformed.slice(0, config.maxItems)
  }

  return { items: transformed, meta }
}

/**
 * Transform response based on tool and action configuration
 */
export function transformResponse(toolName: string, action: string, result: unknown): TransformResult {
  const config = getResponseConfig(toolName, action)
  const log = logger.child({ tool: toolName, action, phase: "transform" })

  // No config - return as-is with size check
  if (!config) {
    const json = JSON.stringify(result)
    const tokens = estimateTokens(json)
    return {
      data: result,
      truncated: false,
      useCompactJson: COMPACT_JSON_ENV || tokens > MAX_TOKENS_PRETTY
    }
  }

  let transformedData: unknown = result
  let meta: ResponseMeta = {}
  let truncated = false

  // Handle list responses with items array
  if (isListResponse(result)) {
    const { items, meta: itemsMeta } = transformItems(result.items, config)
    transformedData = { ...result, items }
    meta = itemsMeta
    truncated = !!itemsMeta.totalItems && itemsMeta.totalItems > (itemsMeta.returnedItems || 0)

    if (truncated) {
      log.info("Response truncated", {
        total: itemsMeta.totalItems,
        returned: itemsMeta.returnedItems
      })
    }
  }
  // Handle direct array responses
  else if (isArrayResponse(result)) {
    const { items, meta: itemsMeta } = transformItems(result, config)
    transformedData = items
    meta = itemsMeta
    truncated = !!itemsMeta.totalItems && itemsMeta.totalItems > (itemsMeta.returnedItems || 0)
  }

  // Check final size
  const json = JSON.stringify(transformedData)
  const tokens = estimateTokens(json)
  const useCompactJson = COMPACT_JSON_ENV || tokens > MAX_TOKENS_PRETTY

  if (tokens > MAX_TOKENS_TOTAL) {
    log.warn("Response exceeds token limit even after transformation", { tokens })
    meta.warning = `Response is large (~${tokens} tokens). Consider using more specific filters or pagination.`
  }

  return {
    data: transformedData,
    truncated,
    useCompactJson,
    meta: Object.keys(meta).length > 0 ? meta : undefined
  }
}

/**
 * Format response for MCP output
 */
export function formatResponse(toolName: string, action: string, result: unknown): string {
  const { data, useCompactJson, meta } = transformResponse(toolName, action, result)

  // Add metadata to response if present
  let output: unknown = data
  if (meta && Object.keys(meta).length > 0) {
    if (typeof data === "object" && data !== null) {
      output = { ...data, _meta: meta }
    } else {
      output = { data, _meta: meta }
    }
  }

  // Format JSON
  return useCompactJson ? JSON.stringify(output) : JSON.stringify(output, null, 2)
}

/**
 * Apply default parameters from config
 */
export function applyDefaultParams(
  toolName: string,
  action: string,
  params: Record<string, unknown>
): Record<string, unknown> {
  const config = getResponseConfig(toolName, action)

  if (!config?.defaultParams) {
    return params
  }

  // Apply defaults only if not already provided
  const merged = { ...params }
  for (const [key, value] of Object.entries(config.defaultParams)) {
    if (!(key in merged) || merged[key] === undefined || merged[key] === null) {
      merged[key] = value
    }
  }

  return merged
}

/**
 * Check response size and return appropriate format
 */
export function checkResponseSize(json: string): { tokens: number; shouldWarn: boolean; shouldCompact: boolean } {
  const tokens = estimateTokens(json)
  return {
    tokens,
    shouldWarn: tokens > MAX_TOKENS_TOTAL,
    shouldCompact: tokens > MAX_TOKENS_PRETTY
  }
}
