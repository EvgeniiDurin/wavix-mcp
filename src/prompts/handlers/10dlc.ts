/**
 * 10DLC Prompt Handlers
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const tenDlcHandlers: PromptHandlerMap = {
  register_10dlc_brand: args =>
    createTextPrompt(
      `Register 10DLC brand "${args?.brand_name}"${args?.ein ? ` with EIN ${args.ein}` : " (Quick registration)"}${args?.website ? `, website: ${args.website}` : ""}.\n\nUse tcr_brand_create tool.`
    ),

  create_10dlc_campaign: args =>
    createTextPrompt(
      `Create 10DLC campaign for brand ${args?.brand_id}: use case "${args?.use_case}", description: "${args?.description}".\n\nUse 10dlc_brands_campaigns_create tool. Brand must be verified first.`
    ),

  check_10dlc_status: args =>
    createTextPrompt(
      `Check 10DLC status for brand ${args?.brand_id}${args?.campaign_id ? `, campaign ${args.campaign_id}` : ""}.\n\nUse tcr_brand_get${args?.campaign_id ? " and 10dlc_brands_campaigns_get_get" : ""} tools.`
    ),

  update_10dlc_brand: args =>
    createTextPrompt(
      `Update 10DLC brand ${args?.brand_id}${args?.company_name ? `: company name "${args.company_name}"` : ""}${args?.website ? `, website: ${args.website}` : ""}.\n\nUse tcr_brand_update tool. Note: updating company_name or EIN will reset brand status to UNVERIFIED.`
    ),

  update_10dlc_campaign: args =>
    createTextPrompt(
      `Update 10DLC campaign ${args?.campaign_id} for brand ${args?.brand_id}${args?.description ? `: description "${args.description}"` : ""}${args?.sample_messages ? `, sample messages: ${args.sample_messages}` : ""}.\n\nUse 10dlc_brands_campaigns_update tool.`
    ),

  attach_number_to_campaign: args =>
    createTextPrompt(
      `Attach phone number ${args?.number} to 10DLC campaign ${args?.campaign_id} (brand ${args?.brand_id}).\n\nUse 10dlc_brands_campaigns_numbers_create tool. Wavix will automatically create a Sender ID for this number once approved.`
    ),

  detach_number_from_campaign: args =>
    createTextPrompt(
      `Remove phone number ${args?.number} from 10DLC campaign ${args?.campaign_id} (brand ${args?.brand_id}).\n\nUse 10dlc_brands_campaigns_numbers_delete tool. The associated Sender ID will also be deleted.`
    ),

  list_campaign_numbers: args =>
    createTextPrompt(
      `List all phone numbers associated with 10DLC campaign ${args?.campaign_id} (brand ${args?.brand_id}).\n\nUse 10dlc_brands_campaigns_numbers_get tool.`
    ),

  list_10dlc_brands: () =>
    createTextPrompt(
      "List all 10DLC brands on your account.\n\nUse tcr_brands_list tool. Show brand status, verification status, and registration date."
    ),

  list_10dlc_campaigns: args =>
    createTextPrompt(
      `List 10DLC campaigns${args?.brand_id ? ` for brand ${args.brand_id}` : " on your account"}.\n\nUse ${args?.brand_id ? "10dlc_brands_campaigns_get" : "10dlc_brands_campaigns_list"} tool. Show campaign status, use case, and approval status.`
    ),

  delete_10dlc_brand: args =>
    createTextPrompt(
      `Delete 10DLC brand ${args?.brand_id}.\n\nUse tcr_brand_delete tool. Warning: All campaigns must be deleted first. This action cannot be undone.`
    ),

  delete_10dlc_campaign: args =>
    createTextPrompt(
      `Delete 10DLC campaign ${args?.campaign_id} for brand ${args?.brand_id}.\n\nUse 10dlc_brands_campaigns_delete tool. Warning: All associated phone numbers will lose their Sender ID status. This action cannot be undone.`
    )
}
