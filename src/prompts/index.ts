/**
 * MCP Prompts
 *
 * Pre-defined prompts for common Wavix operations.
 * These prompts help AI assistants guide users through Wavix API operations.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { GetPromptRequestSchema, ListPromptsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { logger } from "../helpers/logger.js"
import { allPrompts } from "./definitions.js"
import { handlePrompt } from "./handlers/index.js"

export function registerPrompts(server: Server): void {
  const log = logger.child({ module: "prompts" })

  server.setRequestHandler(ListPromptsRequestSchema, () => {
    log.debug("Listing prompts")
    return Promise.resolve({ prompts: allPrompts })
  })

  server.setRequestHandler(GetPromptRequestSchema, async request => {
    const { name, arguments: args } = request.params
    log.debug("Getting prompt", { name, args })
    return handlePrompt(name, args)
  })
}
