/**
 * MCP Tools Registry
 *
 * Registers grouped tools and routes calls to handlers
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

  // Show all tools regardless of API key presence
  // Tools that require API access will return a clear error message when called without a key
  const availableTools = generatedTools

  log.info("Registering tools", {
    total: generatedTools.length,
    available: availableTools.length,
    mode: config.wavix.hasApiKey ? "Full" : "Documentation (API key not set)"
  })

  server.setRequestHandler(ListToolsRequestSchema, () => {
    log.debug("Listing tools", { count: availableTools.length })
    return Promise.resolve({ tools: availableTools })
  })

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const { name, arguments: args } = request.params
    log.info("Tool called", { name })

    // Check if tool exists
    const meta = toolMeta[name]
    if (!meta) {
      log.warn("Tool not found", { name })
      return {
        content: [{ type: "text", text: `Error: Tool "${name}" not found` }],
        isError: true
      }
    }

    // Config tool doesn't require API key
    if (name === "config") {
      return handleToolCall(client, name, args)
    }

    // Other tools require API access
    if (!client.isEnabled) {
      return {
        content: [
          {
            type: "text",
            text: `Error: Tool "${name}" requires API access.\n\nTo use this tool, set the WAVIX_API_KEY environment variable:\n1. Get your API key from https://app.wavix.com (Settings → API Keys)\n2. Add to your MCP server config: "env": { "WAVIX_API_KEY": "your-api-key" }\n3. Restart Claude Code to apply changes`
          }
        ],
        isError: true
      }
    }

    return handleToolCall(client, name, args)
  })
}
