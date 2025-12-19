/**
 * 10DLC Prompt Handlers
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const tenDlcHandlers: PromptHandlerMap = {
  register_10dlc_brand: args =>
    createTextPrompt(
      `Register 10DLC brand "${args?.brand_name}"${args?.ein ? ` with EIN ${args.ein}` : ""}${args?.website ? `, website: ${args.website}` : ""}.\n\nUse 10dlc_brands tool with action "create".\n\nIMPORTANT: Before calling the tool, check if all required fields are provided. Required fields for brand registration are:\n- dba_name (from brand_name)\n- company_name\n- entity_type (PRIVATE_PROFIT, NON_PROFIT, GOVERNMENT, PUBLIC_PROFIT, or OTHER)\n- vertical (HEALTHCARE, PROFESSIONAL, RETAIL, TECHNOLOGY, EDUCATION, FINANCIAL, NON_PROFIT, GOVERNMENT, or OTHER)\n- ein_taxid (from ein)\n- ein_taxid_country (2-letter ISO code, e.g., US)\n- first_name\n- last_name\n- phone_number (E.164 format)\n- email\n- street_address\n- city\n- state_or_province\n- country (2-letter ISO code)\n- zip\n\nIf any required field is missing, DO NOT use default values. Instead, ask the user to provide all missing required fields before proceeding.`
    ),

  create_10dlc_campaign: args =>
    createTextPrompt(
      `Create 10DLC campaign for brand ${args?.brand_id}: use case "${args?.use_case}", description: "${args?.description}".\n\nUse 10dlc_campaigns tool with action "create". Brand must be verified first.\n\nIMPORTANT: Before calling the tool, check if all required fields are provided. Required fields include: brand_id, name, usecase, description, sample1-sample5, optin, optout, help, and various campaign settings. If any required field is missing, DO NOT use default values. Instead, ask the user to provide all missing required fields before proceeding.`
    ),

  check_10dlc_status: args =>
    createTextPrompt(
      `Check 10DLC status for brand ${args?.brand_id}${args?.campaign_id ? `, campaign ${args.campaign_id}` : ""}.\n\nUse 10dlc_brands tool with action "get"${args?.campaign_id ? ' and 10dlc_campaigns tool with action "get"' : ""}.`
    ),

  update_10dlc_brand: args =>
    createTextPrompt(
      `Update 10DLC brand ${args?.brand_id}${args?.company_name ? `: company name "${args.company_name}"` : ""}${args?.website ? `, website: ${args.website}` : ""}.\n\nUse 10dlc_brands tool with action "update". Note: updating company_name or EIN will reset brand status to UNVERIFIED.`
    ),

  update_10dlc_campaign: args =>
    createTextPrompt(
      `Update 10DLC campaign ${args?.campaign_id} for brand ${args?.brand_id}${args?.description ? `: description "${args.description}"` : ""}${args?.sample_messages ? `, sample messages: ${args.sample_messages}` : ""}.\n\nUse 10dlc_campaigns tool with action "update".`
    ),

  attach_number_to_campaign: args =>
    createTextPrompt(
      `Attach phone number ${args?.number} to 10DLC campaign ${args?.campaign_id} (brand ${args?.brand_id}).\n\nUse 10dlc_campaigns tool with action to attach number. Wavix will automatically create a Sender ID for this number once approved.`
    ),

  detach_number_from_campaign: args =>
    createTextPrompt(
      `Remove phone number ${args?.number} from 10DLC campaign ${args?.campaign_id} (brand ${args?.brand_id}).\n\nUse 10dlc_campaigns tool with action to detach number. The associated Sender ID will also be deleted.`
    ),

  list_campaign_numbers: args =>
    createTextPrompt(
      `List all phone numbers associated with 10DLC campaign ${args?.campaign_id} (brand ${args?.brand_id}).\n\nUse 10dlc_campaigns tool with action to list numbers.`
    ),

  list_10dlc_brands: () =>
    createTextPrompt(
      "List all 10DLC brands on your account.\n\nUse 10dlc_brands tool with action \"list\". Show brand status, verification status, and registration date."
    ),

  list_10dlc_campaigns: args =>
    createTextPrompt(
      `List 10DLC campaigns${args?.brand_id ? ` for brand ${args.brand_id}` : " on your account"}.\n\nUse 10dlc_campaigns tool with action "${args?.brand_id ? "list_by_brand" : "list"}". Show campaign status, use case, and approval status.`
    ),

  delete_10dlc_brand: args =>
    createTextPrompt(
      `Delete 10DLC brand ${args?.brand_id}.\n\nUse 10dlc_brands tool with action "delete". Warning: All campaigns must be deleted first. This action cannot be undone.`
    ),

  delete_10dlc_campaign: args =>
    createTextPrompt(
      `Delete 10DLC campaign ${args?.campaign_id} for brand ${args?.brand_id}.\n\nUse 10dlc_campaigns tool with action "delete". Warning: All associated phone numbers will lose their Sender ID status. This action cannot be undone.`
    )
}
