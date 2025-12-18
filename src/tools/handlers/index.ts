/**
 * Tool Handlers
 *
 * Generic handler for OpenAPI-generated tools
 * TODO: Implement by ToolsAgent
 */

import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import type { WavixClient } from "../../api/client.js"
import { logger } from "../../helpers/logger.js"
import { maskSensitiveData } from "../../helpers/masking.js"

export interface ToolMeta {
  path: string
  method: string
  operationId: string
}

export async function handleToolCall(
  client: WavixClient,
  name: string,
  meta: ToolMeta,
  args: unknown
): Promise<CallToolResult> {
  const log = logger.child({ tool: name, operationId: meta.operationId })
  log.info("Executing tool", { args: maskSensitiveData(args as Record<string, unknown>) })

  try {
    let path = meta.path
    const params = { ...(args as Record<string, unknown>) }

    // Replace path parameters like {id}
    for (const [key, value] of Object.entries(params)) {
      if (path.includes(`{${key}}`)) {
        path = path.replace(`{${key}}`, String(value))
        delete params[key]
      }
    }

    // Add query parameters for GET
    if (meta.method === "GET" && Object.keys(params).length > 0) {
      const query = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          query.append(key, String(value))
        }
      }
      path = `${path}?${query.toString()}`
    }

    const body = meta.method !== "GET" ? params : undefined
    const result = await client.request(meta.method as "GET" | "POST" | "PUT" | "DELETE", path, body)

    log.info("Tool executed successfully")
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    }
  } catch (error) {
    log.error("Tool execution failed", { error })

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true
    }
  }
}
