/**
 * Workflow Prompt Handlers
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const workflowHandlers: PromptHandlerMap = {
  setup_new_campaign: args =>
    createTextPrompt(
      `Set up ${args?.campaign_type} campaign for ${args?.country}${args?.test_number ? `, test: ${args.test_number}` : ""}.\n\nBuy number, configure sender ID${args?.country === "US" ? ", register 10DLC" : ""}, send test.`
    ),

  troubleshoot_delivery: args =>
    createTextPrompt(
      `Troubleshoot ${args?.type} delivery for ${args?.id}.\n\nUse ${args?.type === "voice" ? "cdr_get" : "sms_get"} to check error. Identify cause and fix.`
    )
}
