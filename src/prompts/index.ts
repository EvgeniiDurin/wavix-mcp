/**
 * MCP Prompts
 *
 * Pre-defined prompts for common Wavix operations
 * TODO: Implement by agents
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { GetPromptRequestSchema, ListPromptsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { logger } from "../helpers/logger.js"

export function registerPrompts(server: Server): void {
  const log = logger.child({ module: "prompts" })

  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    log.debug("Listing prompts")
    return {
      prompts: [
        {
          name: "send_sms",
          description: "Send an SMS message to a phone number",
          arguments: [
            { name: "to", description: "Destination phone number", required: true },
            { name: "message", description: "Message content", required: true }
          ]
        },
        {
          name: "check_balance",
          description: "Check account balance and usage",
          arguments: []
        }
      ]
    }
  })

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params
    log.debug("Getting prompt", { name, args })

    switch (name) {
      case "send_sms":
        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Send SMS to ${args?.to}: "${args?.message}"`
              }
            }
          ]
        }

      case "check_balance":
        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: "Check my Wavix account balance and show recent transactions"
              }
            }
          ]
        }

      default:
        throw new Error(`Unknown prompt: ${name}`)
    }
  })
}
