/**
 * SIP Trunking Prompt Handlers
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const sipHandlers: PromptHandlerMap = {
  list_sip_trunks: () => createTextPrompt("List SIP trunks.\n\nUse sip_trunks tool with action \"list\". Show credentials and status."),

  create_sip_trunk: args =>
    createTextPrompt(
      `Create SIP trunk "${args?.name}"${args?.ip_whitelist ? ` with IP whitelist: ${args.ip_whitelist}` : ""}.\n\nUse sip_trunks tool with action "create".\n\nIMPORTANT: Before calling the tool, check if all required fields are provided. Required fields for SIP trunk creation are:\n- label (trunk name)\n- password (strong password for authentication)\n- callerid (active phone number on your account)\n- ip_restrict (boolean: restrict to specific IPs)\n- didinfo_enabled (boolean: include dialed number info)\n- call_restrict (boolean: enforce call duration limit)\n- cost_limit (boolean: enforce max call cost)\n- channels_restrict (boolean: limit concurrent calls)\n- rewrite_enabled (boolean: enable dial plan)\n- transcription_enabled (boolean: auto-transcribe calls)\n- transcription_threshold (integer: min duration for transcription)\n\nIf any required field is missing, DO NOT use default values. Instead, ask the user to provide all missing required fields before proceeding. Save credentials securely after creation.`
    ),

  get_sip_trunk: args =>
    createTextPrompt(
      `Get SIP trunk ${args?.trunk_id} details.\n\nUse sip_trunks tool with action "get". Show configuration, credentials, and status.`
    ),

  update_sip_trunk: args =>
    createTextPrompt(
      `Update SIP trunk ${args?.trunk_id}${args?.name ? `: name "${args.name}"` : ""}${args?.ip_whitelist ? `, IP whitelist: ${args.ip_whitelist}` : ""}.\n\nUse sip_trunks tool with action "update".\n\nIMPORTANT: The update action requires all the same fields as create (label, password, callerid, ip_restrict, didinfo_enabled, call_restrict, cost_limit, channels_restrict, rewrite_enabled, transcription_enabled, transcription_threshold). If any required field is missing, DO NOT use default values. Instead, ask the user to provide all missing required fields before proceeding.`
    ),

  delete_sip_trunk: args =>
    createTextPrompt(
      `Delete SIP trunk ${args?.trunk_id}.\n\nUse sip_trunks tool with action "delete". Warning: This action cannot be undone.`
    )
}
