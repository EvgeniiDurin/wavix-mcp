/**
 * MCP Tools Registry
 *
 * Registers all generated tools and routes calls to handlers
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import type { WavixClient } from "../api/client.js"
import { config } from "../config/index.js"
import { logger } from "../helpers/logger.js"
import { generatedTools, toolMeta } from "./generated/tools.js"
import { handleToolCall } from "./handlers/index.js"

export function registerTools(server: Server, client: WavixClient): void {
  const log = logger.child({ module: "tools" })

  // Filter tools based on mode
  const availableTools = config.wavix.hasApiKey
    ? generatedTools // Full mode - all tools
    : generatedTools.filter(t => t.name.startsWith("profile_") || t.name.startsWith("billing_")) // Doc mode - limited

  log.info("Registering tools", {
    total: generatedTools.length,
    available: availableTools.length,
    mode: config.wavix.hasApiKey ? "Full" : "Documentation"
  })

  server.setRequestHandler(ListToolsRequestSchema, () => {
    log.debug("Listing tools", { count: availableTools.length })
    return Promise.resolve({ tools: availableTools })
  })

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const { name, arguments: args } = request.params
    log.info("Tool called", { name })

    // Check if tool exists
    const meta = toolMeta.get(name)
    if (!meta) {
      log.warn("Tool not found", { name })
      return {
        content: [{ type: "text", text: `Error: Tool "${name}" not found` }],
        isError: true
      }
    }

    // Check if API key is available for API tools
    if (!client.isEnabled) {
      return {
        content: [
          {
            type: "text",
            text: "Error: This tool requires API access. Set WAVIX_API_KEY environment variable to enable Full Mode."
          }
        ],
        isError: true
      }
    }

    // Execute the tool
    return handleToolCall(client, name, meta, args)
  })
}
