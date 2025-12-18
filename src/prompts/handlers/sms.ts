/**
 * SMS/MMS Prompt Handlers
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const smsHandlers: PromptHandlerMap = {
  send_sms: args =>
    createTextPrompt(
      `Send SMS to ${args?.to}${args?.from ? ` from "${args.from}"` : ""}: "${args?.message}"\n\nUse sms_send tool.`
    ),

  send_mms: args =>
    createTextPrompt(
      `Send MMS to ${args?.to}${args?.from ? ` from "${args.from}"` : ""}: "${args?.message}" with media: ${args?.media_urls}\n\nUse sms_send tool with message_body.media. MMS works only for US/Canada.`
    ),

  check_sms_status: args =>
    createTextPrompt(
      `Check delivery status of message ${args?.message_id}.\n\nUse sms_get tool. Show status, timestamps, cost.`
    ),

  list_recent_sms: args =>
    createTextPrompt(
      `List SMS messages from last ${args?.days || 7} days${args?.direction ? ` (${args.direction})` : ""}.\n\nUse sms_list tool. Summarize totals, success rate, costs.`
    ),

  setup_sender_id: args =>
    createTextPrompt(
      `Register sender ID "${args?.sender_id}" (${args?.type}) for countries: ${args?.countries}.\n\nUse sms_sender_id_create tool. For US, 10DLC registration may be required first.`
    ),

  list_sender_ids: () =>
    createTextPrompt("List all registered sender IDs.\n\nUse sms_sender_ids_list tool. Show status and countries."),

  delete_sender_id: args =>
    createTextPrompt(
      `Delete sender ID ${args?.sender_id}.\n\nUse sms_sender_id_delete tool. Warning: Messages with this sender ID will fail.`
    ),

  troubleshoot_sms: args =>
    createTextPrompt(
      `Troubleshoot SMS delivery for message ${args?.message_id}.\n\nUse sms_get to check status and error. Provide fix recommendations.`
    )
}
