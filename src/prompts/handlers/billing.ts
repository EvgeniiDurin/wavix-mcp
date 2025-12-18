/**
 * Billing Prompt Handlers
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const billingHandlers: PromptHandlerMap = {
  check_balance: () => createTextPrompt("Check account balance.\n\nUse profile_get tool. Show balance and account status."),

  get_transaction_history: args =>
    createTextPrompt(
      `Get transactions for last ${args?.days || 30} days.\n\nUse billing_transactions_list tool. Summarize spending by category.`
    ),

  get_invoices: args =>
    createTextPrompt(
      `List invoices${args?.year ? ` for ${args.year}` : ""}${args?.month ? `/${args.month}` : ""}.\n\nUse billing_invoices_list tool.`
    ),

  estimate_costs: args =>
    createTextPrompt(
      `Estimate ${args?.service} costs to ${args?.destination}${args?.quantity ? ` (${args.quantity} ${args?.service === "voice" ? "min" : "msg"})` : ""}.\n\nLook up rates and calculate total cost.`
    )
}
