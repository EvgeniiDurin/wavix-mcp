/**
 * Send Message Tool
 *
 * SMS/MMS sending that requires all fields from user:
 * - Phone number normalization
 * - Country detection
 * - User-provided sender ID (required, no auto-selection)
 * - Error explanation
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WavixClient } from "../../api/client.js"
import { errorDatabase } from "../troubleshooting.js"

interface SendResult {
  success: boolean
  message_id?: string
  status?: string
  from?: string
  to?: string
  segments?: number
  cost?: number
  error?: string
  error_code?: string
  error_explanation?: string
  how_to_fix?: Array<string>
  warnings?: Array<string>
}

function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[\s\-().]/g, "")

  if (!cleaned.startsWith("+")) {
    if (cleaned.length === 10 && /^[2-9]/.test(cleaned)) {
      cleaned = "+1" + cleaned
    } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
      cleaned = "+" + cleaned
    } else if (!cleaned.startsWith("+")) {
      cleaned = "+" + cleaned
    }
  }

  return cleaned
}

function detectCountry(phone: string): { code: string; name: string; requires10dlc: boolean } {
  const normalized = normalizePhoneNumber(phone)

  if (normalized.startsWith("+1")) {
    const areaCode = normalized.substring(2, 5)
    const canadianAreaCodes = [
      "204",
      "226",
      "236",
      "249",
      "250",
      "289",
      "306",
      "343",
      "365",
      "403",
      "416",
      "418",
      "431",
      "437",
      "438",
      "450",
      "506",
      "514",
      "519",
      "548",
      "579",
      "581",
      "587",
      "604",
      "613",
      "639",
      "647",
      "672",
      "705",
      "709",
      "778",
      "780",
      "782",
      "807",
      "819",
      "825",
      "867",
      "873",
      "902",
      "905"
    ]
    if (canadianAreaCodes.includes(areaCode)) {
      return { code: "CA", name: "Canada", requires10dlc: false }
    }
    return { code: "US", name: "United States", requires10dlc: true }
  }

  if (normalized.startsWith("+44")) return { code: "GB", name: "United Kingdom", requires10dlc: false }
  if (normalized.startsWith("+49")) return { code: "DE", name: "Germany", requires10dlc: false }
  if (normalized.startsWith("+33")) return { code: "FR", name: "France", requires10dlc: false }
  if (normalized.startsWith("+34")) return { code: "ES", name: "Spain", requires10dlc: false }
  if (normalized.startsWith("+39")) return { code: "IT", name: "Italy", requires10dlc: false }
  if (normalized.startsWith("+61")) return { code: "AU", name: "Australia", requires10dlc: false }
  if (normalized.startsWith("+81")) return { code: "JP", name: "Japan", requires10dlc: false }
  if (normalized.startsWith("+86")) return { code: "CN", name: "China", requires10dlc: false }
  if (normalized.startsWith("+91")) return { code: "IN", name: "India", requires10dlc: false }
  if (normalized.startsWith("+55")) return { code: "BR", name: "Brazil", requires10dlc: false }
  if (normalized.startsWith("+52")) return { code: "MX", name: "Mexico", requires10dlc: false }

  return { code: "INTL", name: "International", requires10dlc: false }
}

export const sendMessageTool: Tool = {
  name: "send_message",
  description: `Send SMS or MMS message. ALL fields must be provided by the user - do not auto-select or assume any values.

IMPORTANT: Before calling this tool, you MUST ask the user for:
1. Recipient phone number (to)
2. Message text (text)
3. Sender ID or phone number (from) - REQUIRED, do not auto-select

Examples:
- send_message to="+15551234567" text="Hello!" from="17472340053"
- send_message to="555-123-4567" text="Your code is 123456" from="test4242"
- send_message to="+15551234567" text="Check this out" media=["https://example.com/image.jpg"] from="17472340053"

The tool will:
1. Normalize the phone number to E.164 format
2. Validate all required parameters are provided
3. Send the message with the specified sender ID
4. Explain any errors in plain language`,
  inputSchema: {
    type: "object",
    properties: {
      to: {
        type: "string",
        description: "Recipient phone number (any format, will be normalized). MUST be requested from user."
      },
      text: {
        type: "string",
        description: "Message text. MUST be requested from user."
      },
      media: {
        type: "array",
        items: { type: "string" },
        description: "Media URLs for MMS (optional, US/CA only, max 5)"
      },
      from: {
        type: "string",
        description: "Sender ID or phone number. REQUIRED - MUST be requested from user. Do not auto-select."
      }
    },
    required: ["to", "text", "from"]
  }
}

export async function handleSendMessage(
  client: WavixClient,
  args: Record<string, unknown>
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const to = args.to as string
  const text = args.text as string
  const media = args.media as Array<string> | undefined
  const from = args.from as string | undefined

  if (!to || !text || !from) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "Missing required parameters",
              required: {
                to: "Recipient phone number",
                text: "Message text",
                from: "Sender ID or phone number"
              },
              message: "All fields must be provided by the user. Please ask the user for the missing information."
            },
            null,
            2
          )
        }
      ]
    }
  }

  if (!client.isEnabled) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "API key not configured",
              how_to_fix: [
                "Set WAVIX_API_KEY environment variable",
                "Restart your MCP client",
                "Get API key from https://app.wavix.com/api-keys"
              ]
            },
            null,
            2
          )
        }
      ]
    }
  }

  const normalizedTo = normalizePhoneNumber(to)
  const country = detectCountry(normalizedTo)

  const result: SendResult = {
    success: false,
    to: normalizedTo,
    warnings: []
  }

  if (country.requires10dlc) {
    result.warnings?.push(
      "⚠️ US SMS requires 10DLC registration. Message may fail if not registered. Use quick_check('sms_us') to verify."
    )
  }

  if (media && media.length > 0) {
    if (!["US", "CA"].includes(country.code)) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: false,
                error: "MMS only available for US and Canada",
                detected_country: country,
                how_to_fix: ["Send as SMS without media", "Use a link to media instead"]
              },
              null,
              2
            )
          }
        ]
      }
    }
    if (media.length > 5) {
      result.warnings?.push("⚠️ Max 5 media attachments allowed. Only first 5 will be sent.")
    }
  }

  result.from = from

  try {
    const messageBody: { text: string; media?: Array<string> } = { text }
    if (media && media.length > 0) {
      messageBody.media = media.slice(0, 5)
    }

    interface SendMessageResponse {
      data?: {
        id?: string
        status?: string
        segments?: number
        cost?: number
      }
    }

    const response = await client.post<SendMessageResponse>("/v3/messages", {
      from,
      to: normalizedTo,
      message_body: messageBody
    })

    result.success = true
    result.message_id = response?.data?.id
    result.status = response?.data?.status || "accepted"
    result.segments = response?.data?.segments
    result.cost = response?.data?.cost

    if (result.warnings?.length === 0) {
      delete result.warnings
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    }
  } catch (err) {
    const error = err as { message?: string; code?: string; status?: number }
    result.error = error.message || "Failed to send message"

    const errorCodeMatch = error.message?.match(/error[:\s]*(\d+)/i)
    if (errorCodeMatch && errorCodeMatch[1]) {
      result.error_code = errorCodeMatch[1]
      const errorInfo = errorDatabase[result.error_code]
      if (errorInfo) {
        result.error_explanation = `${errorInfo.title}: ${errorInfo.description}`
        result.how_to_fix = errorInfo.solutions
      }
    }

    if (!result.how_to_fix) {
      result.how_to_fix = [
        "Check if sender ID is registered for destination country",
        "Verify 10DLC registration for US numbers",
        "Check account balance",
        "Use diagnose_error tool for detailed troubleshooting"
      ]
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    }
  }
}

export function isSendMessageTool(name: string): boolean {
  return name === "send_message"
}
