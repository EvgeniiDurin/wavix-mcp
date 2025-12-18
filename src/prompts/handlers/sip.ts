/**
 * SIP Trunking Prompt Handlers
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const sipHandlers: PromptHandlerMap = {
  list_sip_trunks: () => createTextPrompt("List SIP trunks.\n\nUse sip_trunks_list tool. Show credentials and status."),

  create_sip_trunk: args =>
    createTextPrompt(
      `Create SIP trunk "${args?.name}"${args?.ip_whitelist ? ` with IP whitelist: ${args.ip_whitelist}` : ""}.\n\nUse sip_trunk_create tool. Save credentials securely.`
    ),

  get_sip_trunk: args =>
    createTextPrompt(
      `Get SIP trunk ${args?.trunk_id} details.\n\nUse sip_trunk_get tool. Show configuration, credentials, and status.`
    ),

  update_sip_trunk: args =>
    createTextPrompt(
      `Update SIP trunk ${args?.trunk_id}${args?.name ? `: name "${args.name}"` : ""}${args?.ip_whitelist ? `, IP whitelist: ${args.ip_whitelist}` : ""}.\n\nUse sip_trunk_update tool.`
    ),

  delete_sip_trunk: args =>
    createTextPrompt(
      `Delete SIP trunk ${args?.trunk_id}.\n\nUse sip_trunk_delete tool. Warning: This action cannot be undone.`
    )
}
