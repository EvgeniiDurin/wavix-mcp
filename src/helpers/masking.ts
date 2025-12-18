/**
 * Data Masking Utilities
 */

/**
 * Mask API key for logging (show first 4 and last 4 chars)
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 12) {
    return "****"
  }
  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`
}

/**
 * Mask phone number (show last 4 digits)
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) {
    return "****"
  }
  return `***${phone.slice(-4)}`
}

/**
 * Mask email (show first char and domain)
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) {
    return "****"
  }
  const parts = email.split("@")
  const local = parts[0] ?? ""
  const domain = parts[1] ?? ""
  return `${local[0] ?? "*"}***@${domain}`
}

/**
 * Mask sensitive fields in object for logging
 */
export function maskSensitiveData<T extends Record<string, unknown>>(data: T): T {
  const sensitiveFields = ["apikey", "api_key", "password", "secret", "token"]
  const phoneFields = ["phone", "from", "to", "number"]
  const emailFields = ["email"]

  const masked = { ...data }

  for (const [key, value] of Object.entries(masked)) {
    if (typeof value === "string") {
      const keyLower = key.toLowerCase()
      if (sensitiveFields.some(f => keyLower.includes(f))) {
        masked[key as keyof T] = maskApiKey(value) as T[keyof T]
      } else if (phoneFields.some(f => keyLower.includes(f))) {
        masked[key as keyof T] = maskPhone(value) as T[keyof T]
      } else if (emailFields.some(f => keyLower.includes(f))) {
        masked[key as keyof T] = maskEmail(value) as T[keyof T]
      }
    }
  }

  return masked
}
