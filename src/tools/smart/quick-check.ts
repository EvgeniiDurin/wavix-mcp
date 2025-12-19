/**
 * Quick Check Tool
 *
 * Fast readiness check before any operation.
 * Returns what's missing and how to fix it.
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WavixClient } from "../../api/client.js"
import { featurePrerequisites } from "../troubleshooting.js"

interface CheckResult {
  ready: boolean
  feature: string
  description: string
  checks: Array<{
    name: string
    status: "pass" | "fail" | "unknown" | "manual"
    message: string
    fix?: string
  }>
  next_steps: Array<string>
  recommended_guide?: string
}

interface ApiListResponse<T> {
  data?: Array<T>
}

async function checkSmsUs(client: WavixClient): Promise<CheckResult> {
  const checks: CheckResult["checks"] = []
  let allPassed = true

  if (client.isEnabled) {
    try {
      const brandsResult = await client.get<ApiListResponse<{ status: string }>>("/v3/10dlc/brands")
      const brands = brandsResult?.data || []
      const verifiedBrands = brands.filter(b => b.status === "VERIFIED")

      if (verifiedBrands.length > 0) {
        checks.push({
          name: "10DLC Brand",
          status: "pass",
          message: `Found ${verifiedBrands.length} verified brand(s)`
        })
      } else if (brands.length > 0) {
        checks.push({
          name: "10DLC Brand",
          status: "fail",
          message: "Brand registered but not yet verified",
          fix: "Wait for brand verification (1-7 days) or check status with 10dlc_brands.get"
        })
        allPassed = false
      } else {
        checks.push({
          name: "10DLC Brand",
          status: "fail",
          message: "No 10DLC brand registered",
          fix: "Register a brand using 10dlc_brands.create"
        })
        allPassed = false
      }
    } catch {
      checks.push({
        name: "10DLC Brand",
        status: "unknown",
        message: "Could not check brand status"
      })
    }

    try {
      const campaignsResult = await client.get<ApiListResponse<{ status: string }>>("/v3/10dlc/brands/campaigns")
      const campaigns = campaignsResult?.data || []
      const activeCampaigns = campaigns.filter(c => c.status === "ACTIVE")

      if (activeCampaigns.length > 0) {
        checks.push({
          name: "10DLC Campaign",
          status: "pass",
          message: `Found ${activeCampaigns.length} active campaign(s)`
        })
      } else if (campaigns.length > 0) {
        checks.push({
          name: "10DLC Campaign",
          status: "fail",
          message: "Campaign registered but not yet active",
          fix: "Wait for campaign approval (1-5 days) or use 10dlc_campaigns.nudge to request review"
        })
        allPassed = false
      } else {
        checks.push({
          name: "10DLC Campaign",
          status: "fail",
          message: "No 10DLC campaign registered",
          fix: "Create a campaign using 10dlc_campaigns.create (requires verified brand first)"
        })
        allPassed = false
      }
    } catch {
      checks.push({
        name: "10DLC Campaign",
        status: "unknown",
        message: "Could not check campaign status"
      })
    }

    try {
      const senderIdsResult =
        await client.get<ApiListResponse<{ countries?: Array<string>; status: string }>>("/v3/messages/sender_ids")
      const senderIds = senderIdsResult?.data || []
      const usSenderIds = senderIds.filter(s => s.countries?.includes("US") && s.status === "active")

      if (usSenderIds.length > 0) {
        checks.push({
          name: "US Sender ID",
          status: "pass",
          message: `Found ${usSenderIds.length} active US sender ID(s)`
        })
      } else {
        checks.push({
          name: "US Sender ID",
          status: "fail",
          message: "No active US sender ID",
          fix: "Register a sender ID using sms_sender_ids.create with countries=['US']"
        })
        allPassed = false
      }
    } catch {
      checks.push({
        name: "US Sender ID",
        status: "unknown",
        message: "Could not check sender IDs"
      })
    }

    try {
      const numbersResult = await client.get<ApiListResponse<{ sms_enabled: boolean }>>("/v1/mydids")
      const numbers = numbersResult?.data || []
      const smsNumbers = numbers.filter(n => n.sms_enabled)

      if (smsNumbers.length > 0) {
        checks.push({
          name: "SMS-enabled Number",
          status: "pass",
          message: `Found ${smsNumbers.length} SMS-enabled number(s)`
        })
      } else if (numbers.length > 0) {
        checks.push({
          name: "SMS-enabled Number",
          status: "fail",
          message: "Have numbers but none are SMS-enabled",
          fix: "Enable SMS on a number using numbers.update_sms"
        })
        allPassed = false
      } else {
        checks.push({
          name: "SMS-enabled Number",
          status: "fail",
          message: "No phone numbers on account",
          fix: "Purchase a number using buy_numbers.available and cart.checkout"
        })
        allPassed = false
      }
    } catch {
      checks.push({
        name: "SMS-enabled Number",
        status: "unknown",
        message: "Could not check phone numbers"
      })
    }
  } else {
    checks.push({
      name: "API Access",
      status: "fail",
      message: "API key not configured",
      fix: "Set WAVIX_API_KEY environment variable"
    })
    allPassed = false
  }

  const nextSteps: Array<string> = []
  for (const check of checks) {
    if (check.status === "fail" && check.fix) {
      nextSteps.push(check.fix)
    }
  }

  if (allPassed) {
    nextSteps.push("You're ready to send SMS to US numbers!")
    nextSteps.push("Use sms.send with action='send'")
  }

  return {
    ready: allPassed,
    feature: "US SMS (10DLC)",
    description: "Send A2P SMS messages to United States phone numbers",
    checks,
    next_steps: nextSteps,
    recommended_guide: allPassed ? undefined : "SMS Campaign in USA (10DLC)"
  }
}

async function checkSmsInternational(client: WavixClient): Promise<CheckResult> {
  const checks: CheckResult["checks"] = []
  let allPassed = true

  if (client.isEnabled) {
    try {
      const senderIdsResult = await client.get<ApiListResponse<{ status: string }>>("/v3/messages/sender_ids")
      const senderIds = senderIdsResult?.data || []
      const activeSenderIds = senderIds.filter(s => s.status === "active")

      if (activeSenderIds.length > 0) {
        checks.push({
          name: "Sender ID",
          status: "pass",
          message: `Found ${activeSenderIds.length} active sender ID(s)`
        })
      } else {
        checks.push({
          name: "Sender ID",
          status: "fail",
          message: "No active sender IDs",
          fix: "Register a sender ID using sms_sender_ids.create"
        })
        allPassed = false
      }
    } catch {
      checks.push({
        name: "Sender ID",
        status: "unknown",
        message: "Could not check sender IDs"
      })
    }
  } else {
    checks.push({
      name: "API Access",
      status: "fail",
      message: "API key not configured",
      fix: "Set WAVIX_API_KEY environment variable"
    })
    allPassed = false
  }

  return {
    ready: allPassed,
    feature: "International SMS",
    description: "Send SMS to non-US numbers",
    checks,
    next_steps: allPassed ? ["Ready to send international SMS!"] : ["Register sender ID for target countries"],
    recommended_guide: "International SMS Setup"
  }
}

async function checkTwoFa(client: WavixClient): Promise<CheckResult> {
  const checks: CheckResult["checks"] = []

  checks.push({
    name: "2FA Service",
    status: "manual",
    message: "Create a 2FA Service in Wavix portal (app.wavix.com → 2FA → Create Service)",
    fix: "Cannot be done via API - must use web portal"
  })

  if (client.isEnabled) {
    try {
      const numbersResult = await client.get<ApiListResponse<{ sms_enabled: boolean }>>("/v1/mydids")
      const numbers = numbersResult?.data || []
      const smsNumbers = numbers.filter(n => n.sms_enabled)

      if (smsNumbers.length > 0) {
        checks.push({
          name: "SMS Capability",
          status: "pass",
          message: `Found ${smsNumbers.length} SMS-enabled number(s) for 2FA delivery`
        })
      } else {
        checks.push({
          name: "SMS Capability",
          status: "fail",
          message: "No SMS-enabled numbers for 2FA delivery",
          fix: "Purchase and enable SMS on a phone number"
        })
      }
    } catch {
      checks.push({
        name: "SMS Capability",
        status: "unknown",
        message: "Could not check phone numbers"
      })
    }
  }

  return {
    ready: false,
    feature: "Two-Factor Authentication",
    description: "Send and verify OTP codes via SMS or Voice",
    checks,
    next_steps: [
      "1. Create 2FA Service in Wavix portal",
      "2. Copy your service_id",
      "3. Use two_fa.send to send verification codes",
      "4. Use two_fa.check to verify codes"
    ],
    recommended_guide: "Implement 2FA Verification"
  }
}

async function checkVoiceCalls(client: WavixClient): Promise<CheckResult> {
  const checks: CheckResult["checks"] = []
  let allPassed = true

  if (client.isEnabled) {
    try {
      const trunksResult = await client.get<ApiListResponse<Record<string, unknown>>>("/v1/trunks")
      const trunks = trunksResult?.data || []

      if (trunks.length > 0) {
        checks.push({
          name: "SIP Trunk",
          status: "pass",
          message: `Found ${trunks.length} SIP trunk(s)`
        })
      } else {
        checks.push({
          name: "SIP Trunk",
          status: "fail",
          message: "No SIP trunk configured",
          fix: "Create a SIP trunk using sip_trunks.create"
        })
        allPassed = false
      }
    } catch {
      checks.push({
        name: "SIP Trunk",
        status: "unknown",
        message: "Could not check SIP trunks"
      })
    }

    try {
      const numbersResult = await client.get<ApiListResponse<Record<string, unknown>>>("/v1/mydids")
      const numbers = numbersResult?.data || []

      if (numbers.length > 0) {
        checks.push({
          name: "Phone Number",
          status: "pass",
          message: `Found ${numbers.length} phone number(s)`
        })
      } else {
        checks.push({
          name: "Phone Number",
          status: "fail",
          message: "No phone numbers on account",
          fix: "Purchase a number using buy_numbers and cart.checkout"
        })
        allPassed = false
      }
    } catch {
      checks.push({
        name: "Phone Number",
        status: "unknown",
        message: "Could not check phone numbers"
      })
    }
  } else {
    checks.push({
      name: "API Access",
      status: "fail",
      message: "API key not configured",
      fix: "Set WAVIX_API_KEY environment variable"
    })
    allPassed = false
  }

  return {
    ready: allPassed,
    feature: "Voice Calls",
    description: "Make and receive voice calls via API",
    checks,
    next_steps: allPassed
      ? ["Ready to make calls!", "Use calls.create with from and to parameters"]
      : ["Set up SIP trunk and purchase phone number"]
  }
}

async function checkVoiceAi(client: WavixClient): Promise<CheckResult> {
  const result = await checkVoiceCalls(client)

  result.feature = "Voice AI Integration"
  result.description = "Connect AI voice agents (LiveKit, OpenAI Realtime)"

  result.checks.push({
    name: "WebSocket Endpoint",
    status: "manual",
    message: "You need a WebSocket URL for your AI service",
    fix: "Set up your AI agent server with WebSocket endpoint"
  })

  result.next_steps = result.ready
    ? [
        "Configure SIP trunk for inbound routing",
        "Set up your AI agent with WebSocket endpoint",
        "Use get_recipe('voice_ai_livekit') for detailed guide"
      ]
    : [...result.next_steps, "Use get_recipe('voice_ai_livekit') for complete setup"]

  result.recommended_guide = "Voice AI with LiveKit"

  return result
}

export const quickCheckTool: Tool = {
  name: "quick_check",
  description: `Check if you're ready for a specific Wavix feature. 

Returns:
- Current status of all prerequisites
- What's missing and how to fix it
- Estimated time to complete setup
- Link to step-by-step recipe

Features you can check:
- sms_us: SMS to US numbers (requires 10DLC)
- sms_international: SMS to non-US numbers
- two_fa: Two-factor authentication
- voice_calls: Make and receive calls
- voice_ai: Voice AI integration (LiveKit, OpenAI)`,
  inputSchema: {
    type: "object",
    properties: {
      feature: {
        type: "string",
        description: "Feature to check readiness for",
        enum: ["sms_us", "sms_international", "two_fa", "voice_calls", "voice_ai"]
      }
    },
    required: ["feature"]
  }
}

export async function handleQuickCheck(
  client: WavixClient,
  args: Record<string, unknown>
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const feature = args.feature as string

  if (!feature) {
    const prereqs = featurePrerequisites
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: "Please specify a feature to check",
              available_features: Object.entries(prereqs).map(([k, v]) => ({
                id: k,
                name: v.name,
                description: v.description
              }))
            },
            null,
            2
          )
        }
      ]
    }
  }

  let result: CheckResult

  switch (feature) {
    case "sms_us":
      result = await checkSmsUs(client)
      break
    case "sms_international":
      result = await checkSmsInternational(client)
      break
    case "two_fa":
      result = await checkTwoFa(client)
      break
    case "voice_calls":
      result = await checkVoiceCalls(client)
      break
    case "voice_ai":
      result = await checkVoiceAi(client)
      break
    default:
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: `Unknown feature: ${feature}`,
                available: ["sms_us", "sms_international", "two_fa", "voice_calls", "voice_ai"]
              },
              null,
              2
            )
          }
        ]
      }
  }

  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
  }
}

export function isQuickCheckTool(name: string): boolean {
  return name === "quick_check"
}
