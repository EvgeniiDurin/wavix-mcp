/**
 * 2FA Prompt Handlers
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const twofaHandlers: PromptHandlerMap = {
  send_2fa_code: args =>
    createTextPrompt(
      `Send 2FA code to ${args?.to} via ${args?.channel || "sms"}.\n\nUse two_fa_verification_create tool. Return session_id.`
    ),

  verify_2fa_code: args =>
    createTextPrompt(
      `Verify code "${args?.code}" for session ${args?.session_id}.\n\nUse two_fa_verification_check_create tool.`
    ),

  check_2fa_status: args =>
    createTextPrompt(
      `Check 2FA session ${args?.session_id} status.\n\nUse two_fa_service_sessions_get tool. Show status and attempts.`
    ),

  cancel_2fa: args =>
    createTextPrompt(`Cancel 2FA session ${args?.session_id}.\n\nUse two_fa_verification_cancel_patch tool.`)
}
