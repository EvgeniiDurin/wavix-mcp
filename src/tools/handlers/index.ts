/**
 * Tool Handlers
 *
 * Generic handler for OpenAPI-generated tools
 */

import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import { WavixApiError, type WavixClient } from "../../api/client.js"
import { logger } from "../../helpers/logger.js"
import { maskSensitiveData } from "../../helpers/masking.js"

export interface ToolMeta {
  path: string
  method: string
  operationId: string
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

/**
 * Execute a tool call against the Wavix API
 */
export async function handleToolCall(
  client: WavixClient,
  name: string,
  meta: ToolMeta,
  args: unknown
): Promise<CallToolResult> {
  const log = logger.child({ tool: name, operationId: meta.operationId })
  log.info("Executing tool", { args: maskSensitiveData((args ?? {}) as Record<string, unknown>) })

  try {
    let path = meta.path
    const params = { ...((args ?? {}) as Record<string, unknown>) }

    // Replace path parameters like {id}, {uuid}, {brand_id}
    const pathParamRegex = /\{([^}]+)\}/g
    let match
    while ((match = pathParamRegex.exec(meta.path)) !== null) {
      const paramName = match[1]
      if (paramName && paramName in params) {
        path = path.replace(`{${paramName}}`, String(params[paramName]))
        delete params[paramName]
      }
    }

    // Build query string for GET/DELETE requests
    let queryString = ""
    if ((meta.method === "GET" || meta.method === "DELETE") && Object.keys(params).length > 0) {
      const query = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Handle array parameters
            for (const item of value) {
              query.append(`${key}[]`, String(item))
            }
          } else {
            query.append(key, String(value))
          }
        }
      }
      queryString = query.toString()
      if (queryString) {
        path = `${path}${path.includes("?") ? "&" : "?"}${queryString}`
      }
    }

    // Body for POST/PUT/PATCH
    const body = ["POST", "PUT", "PATCH"].includes(meta.method) && Object.keys(params).length > 0 ? params : undefined

    // Make the API request
    const result = await client.request(meta.method as HttpMethod, path, body)

    log.info("Tool executed successfully")
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    }
  } catch (error) {
    log.error("Tool execution failed", { error })

    if (error instanceof WavixApiError) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: true,
                message: error.message,
                statusCode: error.statusCode,
                code: error.code,
                details: error.details
              },
              null,
              2
            )
          }
        ],
        isError: true
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true
    }
  }
}
