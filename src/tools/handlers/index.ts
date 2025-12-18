/**
 * Tool Handlers
 *
 * Handler for grouped tools with action parameter
 * Includes response transformation for optimized token usage
 */

import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import { WavixApiError, type WavixClient } from "../../api/client.js"
import { logger } from "../../helpers/logger.js"
import { maskSensitiveData } from "../../helpers/masking.js"
import { type ActionMeta, toolMeta } from "../generated/tools.js"
import { applyDefaultParams, formatResponse } from "../response-transformer.js"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface ToolArgs {
  action: string
  [key: string]: unknown
}

/**
 * Execute a grouped tool call against the Wavix API
 *
 * @param client - Wavix API client
 * @param toolName - Name of the grouped tool (e.g., "sip_trunks")
 * @param args - Arguments including "action" and other parameters
 */
export async function handleToolCall(client: WavixClient, toolName: string, args: unknown): Promise<CallToolResult> {
  const typedArgs = (args ?? {}) as ToolArgs
  const { action, ...params } = typedArgs

  const log = logger.child({ tool: toolName, action })
  log.info("Executing tool", { args: maskSensitiveData(params as Record<string, unknown>) })

  // Validate action
  if (!action) {
    return {
      content: [{ type: "text", text: 'Error: "action" parameter is required' }],
      isError: true
    }
  }

  // Get tool metadata
  const meta = toolMeta[toolName]
  if (!meta) {
    return {
      content: [{ type: "text", text: `Error: Unknown tool "${toolName}"` }],
      isError: true
    }
  }

  // Get action metadata
  const actionMeta: ActionMeta | undefined = meta.actions[action]
  if (!actionMeta) {
    const availableActions = Object.keys(meta.actions).join(", ")
    return {
      content: [{ type: "text", text: `Error: Unknown action "${action}". Available actions: ${availableActions}` }],
      isError: true
    }
  }

  // Handle config actions specially
  if (actionMeta.path.startsWith("__config__")) {
    return handleConfigAction(client, action, params)
  }

  // Validate required parameters
  const missingParams = actionMeta.requiredParams.filter(p => params[p] === undefined || params[p] === null)
  if (missingParams.length > 0) {
    return {
      content: [
        {
          type: "text",
          text: `Error: Missing required parameters for action "${action}": ${missingParams.join(", ")}`
        }
      ],
      isError: true
    }
  }

  try {
    let path = actionMeta.path
    // Apply default params from response config (e.g., default pagination)
    const requestParams = applyDefaultParams(toolName, action, { ...params })

    // Replace path parameters like {id}, {uuid}, {brand_id}
    const pathParamRegex = /\{([^}]+)\}/g
    let match
    while ((match = pathParamRegex.exec(actionMeta.path)) !== null) {
      const paramName = match[1]
      if (paramName && paramName in requestParams) {
        path = path.replace(`{${paramName}}`, String(requestParams[paramName]))
        delete requestParams[paramName]
      }
    }

    // Build query string for GET/DELETE requests
    let queryString = ""
    if ((actionMeta.method === "GET" || actionMeta.method === "DELETE") && Object.keys(requestParams).length > 0) {
      const query = new URLSearchParams()
      for (const [key, value] of Object.entries(requestParams)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
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
    const body =
      ["POST", "PUT", "PATCH"].includes(actionMeta.method) && Object.keys(requestParams).length > 0
        ? requestParams
        : undefined

    // Make the API request
    const result = await client.request(actionMeta.method as HttpMethod, path, body)

    // Transform and format response (applies truncation, field selection, compact JSON)
    const formattedResponse = formatResponse(toolName, action, result)

    log.info("Tool executed successfully")
    return {
      content: [
        {
          type: "text",
          text: formattedResponse
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

/**
 * Handle config actions (get/set API URL)
 */
function handleConfigAction(
  client: WavixClient,
  action: string,
  params: Record<string, unknown>
): CallToolResult {
  if (action === "get_api_url") {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ api_url: client.getBaseUrl() }, null, 2)
        }
      ]
    }
  }

  if (action === "set_api_url") {
    const url = params.url as string
    if (!url) {
      return {
        content: [{ type: "text", text: 'Error: "url" parameter is required for set_api_url action' }],
        isError: true
      }
    }
    client.setBaseUrl(url)
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ success: true, api_url: url }, null, 2)
        }
      ]
    }
  }

  return {
    content: [{ type: "text", text: `Error: Unknown config action "${action}"` }],
    isError: true
  }
}
