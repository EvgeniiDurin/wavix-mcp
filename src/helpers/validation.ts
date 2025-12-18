/**
 * Validation Utilities with Joi
 */

import Joi from "joi"

/**
 * E.164 phone number format (+1234567890)
 */
export const e164Schema = Joi.string()
  .pattern(/^\+[1-9]\d{1,14}$/)
  .messages({
    "string.pattern.base": "Phone number must be in E.164 format (e.g., +14155551234)"
  })

/**
 * UUID v4 format
 */
export const uuidSchema = Joi.string().uuid({ version: "uuidv4" }).messages({
  "string.guid": "Must be a valid UUID v4"
})

/**
 * Wavix API key format
 */
export const wavixApiKeySchema = Joi.string()
  .pattern(/^wvx_(live|test|mcp)_[a-zA-Z0-9]{16,}$/)
  .messages({
    "string.pattern.base": "Invalid Wavix API key format"
  })

/**
 * Validate E.164 phone number
 */
export function isValidE164(phone: string): boolean {
  const { error } = e164Schema.validate(phone)
  return !error
}

/**
 * Validate UUID v4
 */
export function isValidUUID(uuid: string): boolean {
  const { error } = uuidSchema.validate(uuid)
  return !error
}

/**
 * Validate Wavix API key
 */
export function isValidWavixApiKey(apiKey: string): boolean {
  const { error } = wavixApiKeySchema.validate(apiKey)
  return !error
}

/**
 * Normalize phone number to E.164
 */
export function normalizePhone(phone: string): string {
  // Remove all non-digit characters except leading +
  let normalized = phone.replace(/[^\d+]/g, "")

  // Add + if missing
  if (!normalized.startsWith("+")) {
    normalized = `+${normalized}`
  }

  return normalized
}
