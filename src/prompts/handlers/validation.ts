/**
 * Number Validation Prompt Handlers
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const validationHandlers: PromptHandlerMap = {
  validate_phone_number: args =>
    createTextPrompt(
      `Validate number ${args?.phone_number}.\n\nUse validation_list tool with type "validation". Show number type, carrier, and reachability status.`
    )
}
