/**
 * Prompt Handlers Index
 *
 * Aggregates all prompt handlers and provides routing
 */

import type { GetPromptResult } from "@modelcontextprotocol/sdk/types.js"
import { smsHandlers } from "./sms.js"
import { voiceHandlers } from "./voice.js"
import { numbersHandlers } from "./numbers.js"
import { twofaHandlers } from "./twofa.js"
import { tenDlcHandlers } from "./10dlc.js"
import { billingHandlers } from "./billing.js"
import { sipHandlers } from "./sip.js"
import { validationHandlers } from "./validation.js"
import { workflowHandlers } from "./workflows.js"
import { integrationHandlers } from "./integration.js"
import type { PromptArgs, PromptHandlerMap } from "./types.js"

export type { PromptArgs, PromptHandler, PromptHandlerMap } from "./types.js"
export { createTextPrompt } from "./types.js"

/**
 * All handlers combined
 */
const allHandlers: PromptHandlerMap = {
  ...smsHandlers,
  ...voiceHandlers,
  ...numbersHandlers,
  ...twofaHandlers,
  ...tenDlcHandlers,
  ...billingHandlers,
  ...sipHandlers,
  ...validationHandlers,
  ...workflowHandlers,
  ...integrationHandlers
}

/**
 * Handle a prompt request by name
 */
export async function handlePrompt(name: string, args: PromptArgs): Promise<GetPromptResult> {
  const handler = allHandlers[name]
  if (!handler) {
    throw new Error(`Unknown prompt: ${name}`)
  }
  return handler(args)
}

/**
 * Check if a prompt handler exists
 */
export function hasPromptHandler(name: string): boolean {
  return name in allHandlers
}
