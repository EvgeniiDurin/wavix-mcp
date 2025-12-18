/**
 * Voice/Call Prompt Handlers
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const voiceHandlers: PromptHandlerMap = {
  make_call: args =>
    createTextPrompt(
      `Call from ${args?.from} to ${args?.to}${args?.action ? ` (action: ${args.action})` : ""}.\n\nUse call_create tool.`
    ),

  get_call_logs: args =>
    createTextPrompt(
      `Get CDRs from last ${args?.days || 7} days${args?.type ? ` (${args.type})` : ""}.\n\nUse cdr_list tool. Summarize calls, duration, costs.`
    ),

  get_call_recording: args =>
    createTextPrompt(`Get recording for call ${args?.cdr_uuid}.\n\nUse recording_get_by_cdr tool.`),

  get_call_transcription: args =>
    createTextPrompt(
      `Get transcription for call ${args?.cdr_uuid}.\n\nUse cdr_transcription_get tool. Show speaker turns and full text.`
    ),

  list_active_calls: () =>
    createTextPrompt("List all active calls on your account.\n\nUse calls_list tool. Show call status and duration."),

  end_call: args =>
    createTextPrompt(`End active call ${args?.call_uuid}.\n\nUse call_hangup tool.`)
}
