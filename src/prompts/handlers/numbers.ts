/**
 * Phone Numbers Prompt Handlers
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const numbersHandlers: PromptHandlerMap = {
  search_phone_numbers: args =>
    createTextPrompt(
      `Search numbers in ${args?.country}${args?.type ? ` (${args.type})` : ""}${args?.area_code ? `, area ${args.area_code}` : ""}${args?.sms_enabled ? ", SMS-enabled" : ""}.\n\nUse buy_countries_list → buy_numbers_available. Show pricing and capabilities.`
    ),

  buy_phone_number: args =>
    createTextPrompt(`Purchase number ${args?.number}.\n\nUse buy_cart_update → cart_checkout. Confirm purchase details.`),

  list_my_numbers: () =>
    createTextPrompt("List account phone numbers.\n\nUse numbers_list tool. Show status, capabilities, costs."),

  get_number_details: args =>
    createTextPrompt(
      `Get details for number ${args?.number_id}.\n\nUse number_get tool. Show configuration, capabilities, and routing.`
    ),

  configure_number: args =>
    createTextPrompt(
      `Configure ${args?.number}: route calls to ${args?.destination}${args?.sms_webhook ? `, SMS webhook: ${args.sms_webhook}` : ""}.\n\nUse mydids_update_destinations_create${args?.sms_webhook ? " and numbers_sms_update" : ""}.`
    ),

  release_number: args =>
    createTextPrompt(`Release number ${args?.number}. Warning: cannot be undone.\n\nUse numbers_bulk_delete tool.`)
}
