/**
 * MCP Tools Registry
 *
 * TODO: Implement by ToolsAgent
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import type { WavixClient } from "../api/client.js"
import { logger } from "../helpers/logger.js"

// import { generatedTools, toolMeta } from "./generated/tools.js"
// import { handleToolCall } from "./handlers/index.js"

export function registerTools(server: Server, _client: WavixClient): void {
  const log = logger.child({ module: "tools" })

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    log.debug("Listing tools")
    // TODO: Return generated tools
    return { tools: [] }
  })

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: _args } = request.params
    log.info("Tool called", { name })

    // TODO: Route to handleToolCall with toolMeta
    return {
      content: [{ type: "text", text: `Tool ${name} not implemented yet` }]
    }
  })
}
