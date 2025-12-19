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
import { integrationTools, handleIntegrationTool, isIntegrationTool } from "./integration-tools.js"
import { troubleshootingTools, handleTroubleshootingTool, isTroubleshootingTool } from "./troubleshooting.js"
import { workflowTools, handleWorkflowTool, isWorkflowTool } from "./workflow-recipes.js"
import {
  smartTools,
  isAssistantTool,
  handleAssistant,
  isQuickCheckTool,
  handleQuickCheck,
  isSendMessageTool,
  handleSendMessage
} from "./smart/index.js"

export function registerTools(server: Server, client: WavixClient): void {
  const log = logger.child({ module: "tools" })

  const allTools = [...smartTools, ...generatedTools, ...integrationTools, ...troubleshootingTools, ...workflowTools]

  log.info("Registering tools", {
    smart: smartTools.length,
    generated: generatedTools.length,
    integration: integrationTools.length,
    troubleshooting: troubleshootingTools.length,
    workflow: workflowTools.length,
    total: allTools.length,
    mode: config.wavix.hasApiKey ? "Full" : "Documentation (API key not set)"
  })

  server.setRequestHandler(ListToolsRequestSchema, () => {
    log.debug("Listing tools", { count: allTools.length })
    return Promise.resolve({ tools: allTools })
  })

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const { name, arguments: args } = request.params
    log.info("Tool called", { name })

    if (isAssistantTool(name)) {
      log.debug("Handling assistant tool", { name })
      return handleAssistant(args as Record<string, unknown>)
    }

    if (isQuickCheckTool(name)) {
      log.debug("Handling quick check tool", { name })
      return handleQuickCheck(client, args as Record<string, unknown>)
    }

    if (isSendMessageTool(name)) {
      log.debug("Handling send message tool", { name })
      return handleSendMessage(client, args as Record<string, unknown>)
    }

    if (isIntegrationTool(name)) {
      log.debug("Handling integration tool", { name })
      return handleIntegrationTool(name, args as Record<string, unknown>)
    }

    if (isTroubleshootingTool(name)) {
      log.debug("Handling troubleshooting tool", { name })
      return handleTroubleshootingTool(name, args as Record<string, unknown>)
    }

    if (isWorkflowTool(name)) {
      log.debug("Handling workflow tool", { name })
      return handleWorkflowTool(name, args as Record<string, unknown>)
    }

    const meta = toolMeta[name]
    if (!meta) {
      log.warn("Tool not found", { name })
      return {
        content: [{ type: "text", text: `Error: Tool "${name}" not found` }],
        isError: true
      }
    }

    if (name === "config") {
      return handleToolCall(client, name, args)
    }

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
