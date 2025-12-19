/**
 * Troubleshooting Tools
 *
 * Provides diagnostic tools to help resolve issues:
 * - diagnose_error: Explains error codes and provides solutions
 * - check_prerequisites: Validates setup before using a feature
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import { getResource, readResourceContent, searchResources } from "../resources/loader.js"

/**
 * Error database with codes, descriptions, causes, and solutions
 */
export const errorDatabase: Record<
  string,
  {
    code: string
    title: string
    description: string
    causes: Array<string>
    solutions: Array<string>
    relatedTools: Array<string>
    docsUri: string
    severity: "low" | "medium" | "high" | "critical"
    category: "sms" | "voice" | "validation" | "auth" | "billing" | "config"
  }
> = {
  "5": {
    code: "5",
    title: "Sender ID not provisioned for country",
    description: "The Sender ID is not approved for the destination country.",
    causes: ["Sender ID not registered for this country", "Country requires manual approval", "Sender ID expired"],
    solutions: [
      "Check allowed countries for your Sender ID using sms_sender_ids.get",
      "Register Sender ID for the destination country",
      "Use a different Sender ID that's approved for this country"
    ],
    relatedTools: ["sms_sender_ids.list", "sms_sender_ids.create"],
    docsUri: "wavix://api/messaging/errors/5",
    severity: "medium",
    category: "sms"
  },
  "7": {
    code: "7",
    title: "Potential SMS flooding attack",
    description: "The system detected unusual message patterns that may indicate a flooding attack.",
    causes: ["Too many messages to same number", "Suspicious traffic pattern", "Rate limit exceeded"],
    solutions: [
      "Implement rate limiting in your application",
      "Add delays between messages to same recipient",
      "Contact support if this is legitimate traffic"
    ],
    relatedTools: ["sms.list", "profile.config"],
    docsUri: "wavix://api/messaging/errors/7",
    severity: "high",
    category: "sms"
  },
  "9": {
    code: "9",
    title: "Unsubscribed recipient",
    description: "The recipient has opted out of receiving SMS messages.",
    causes: ["Recipient replied STOP", "Number in opt-out list", "Previous unsubscribe request"],
    solutions: [
      "Remove number from your contact list",
      "Respect opt-out preferences",
      "User must re-subscribe to receive messages"
    ],
    relatedTools: ["sms.opt_out"],
    docsUri: "wavix://api/messaging/errors/9",
    severity: "low",
    category: "sms"
  },
  "12": {
    code: "12",
    title: "MMS only available for US and CA",
    description: "MMS messages can only be sent to US and Canadian phone numbers.",
    causes: ["Destination country doesn't support MMS", "Trying to send media to international number"],
    solutions: [
      "Send SMS without media attachment",
      "Use a link to media instead of attachment",
      "Verify destination is US or CA number"
    ],
    relatedTools: ["sms.send", "validation.list"],
    docsUri: "wavix://api/messaging/errors/12",
    severity: "low",
    category: "sms"
  },
  "17": {
    code: "17",
    title: "Destination forbidden",
    description: "Messages to this destination are blocked.",
    causes: ["Premium rate number", "Blocked destination", "High-risk destination"],
    solutions: [
      "Verify the destination number",
      "Check if destination is a premium rate number",
      "Contact support for destination whitelist"
    ],
    relatedTools: ["validation.list"],
    docsUri: "wavix://api/messaging/errors/17",
    severity: "medium",
    category: "sms"
  },
  "18": {
    code: "18",
    title: "Invalid or non-mobile number",
    description: "The destination is invalid or not a mobile phone number.",
    causes: ["Landline number", "Invalid phone format", "Number doesn't exist"],
    solutions: [
      "Validate number format (E.164)",
      "Use validation.list to check number type",
      "Ensure destination is a mobile number"
    ],
    relatedTools: ["validation.list"],
    docsUri: "wavix://api/messaging/errors/18",
    severity: "medium",
    category: "sms"
  },
  "19": {
    code: "19",
    title: "Destination blocked",
    description: "This specific destination number is blocked.",
    causes: ["Number in blocklist", "Previous complaint", "Fraud prevention"],
    solutions: ["Remove from your sending list", "Check blocklist status", "Contact support if needed"],
    relatedTools: ["sms.list"],
    docsUri: "wavix://api/messaging/errors/19",
    severity: "medium",
    category: "sms"
  },
  "22": {
    code: "22",
    title: "Sender ID not found",
    description: "The Sender ID used is not registered on your account.",
    causes: ["Typo in Sender ID", "Sender ID deleted", "Using unregistered number"],
    solutions: [
      "List your Sender IDs with sms_sender_ids.list",
      "Register a new Sender ID",
      "Use an active number from your account"
    ],
    relatedTools: ["sms_sender_ids.list", "sms_sender_ids.create", "numbers.list"],
    docsUri: "wavix://api/messaging/errors/22",
    severity: "high",
    category: "sms"
  },
  "23": {
    code: "23",
    title: "Rejected by carrier",
    description: "The far-end carrier rejected the message.",
    causes: ["Carrier filtering", "Content blocked", "Sender reputation issue"],
    solutions: [
      "Review message content for spam triggers",
      "Check carrier guidelines",
      "Improve sender reputation over time"
    ],
    relatedTools: ["sms.get"],
    docsUri: "wavix://api/messaging/errors/23",
    severity: "medium",
    category: "sms"
  },
  "26": {
    code: "26",
    title: "Rate limit exceeded",
    description: "You've exceeded the allowed SMS sending rate.",
    causes: ["Too many SMS per second", "Account rate limit hit", "Burst traffic"],
    solutions: [
      "Implement rate limiting (check profile.config for limits)",
      "Spread messages over time",
      "Contact support to increase limits"
    ],
    relatedTools: ["profile.config"],
    docsUri: "wavix://api/messaging/errors/26",
    severity: "medium",
    category: "sms"
  },
  "31": {
    code: "31",
    title: "Number inactive or lacks credits",
    description: "The sending number is inactive, has no credits, or recipient opted out.",
    causes: ["Sender number inactive", "Insufficient balance", "Recipient opted out"],
    solutions: [
      "Check sender number status with numbers.get",
      "Verify account balance with billing.transactions",
      "Check if recipient opted out"
    ],
    relatedTools: ["numbers.get", "billing.transactions", "sms.opt_out"],
    docsUri: "wavix://api/messaging/errors/31",
    severity: "high",
    category: "sms"
  },
  "33": {
    code: "33",
    title: "Message rejected as SPAM or inactive 10DLC Campaign",
    description: "Message blocked due to spam detection or inactive 10DLC campaign.",
    causes: [
      "10DLC campaign not approved",
      "Content flagged as spam",
      "Sender ID not linked to active campaign",
      "Content doesn't match registered use case"
    ],
    solutions: [
      "Verify 10DLC campaign status with 10dlc_campaigns.get",
      "Review message content for compliance",
      "Ensure content matches registered use case",
      "Wait for campaign approval before sending"
    ],
    relatedTools: ["10dlc_campaigns.get", "10dlc_brands.get", "sms_sender_ids.list"],
    docsUri: "wavix://api/messaging/errors/33",
    severity: "critical",
    category: "sms"
  },
  "34": {
    code: "34",
    title: "10DLC messaging limit exceeded",
    description: "You've exceeded the messaging throughput for your 10DLC Brand or Campaign.",
    causes: ["Daily limit reached", "Throughput cap hit", "Brand trust score too low"],
    solutions: [
      "Wait for limit reset",
      "Request external vetting for higher limits",
      "Spread messages across multiple campaigns"
    ],
    relatedTools: ["10dlc_brands.get", "10dlc_brands.vetting_create"],
    docsUri: "wavix://api/messaging/errors/34",
    severity: "high",
    category: "sms"
  },
  "36": {
    code: "36",
    title: "Daily quota exceeded (T-Mobile)",
    description: "T-Mobile daily sending quota reached for your campaign.",
    causes: ["T-Mobile daily limit", "Low trust score campaign", "High volume to T-Mobile"],
    solutions: ["Wait 24 hours for reset", "Request external vetting", "Distribute traffic across carriers"],
    relatedTools: ["10dlc_brands.vetting_create"],
    docsUri: "wavix://api/messaging/errors/36",
    severity: "high",
    category: "sms"
  },
  "37": {
    code: "37",
    title: "Spam detected (AT&T)",
    description: "AT&T flagged message as spam.",
    causes: ["Content triggers spam filter", "URL/link in message", "Pattern matching spam"],
    solutions: [
      "Remove or shorten URLs",
      "Avoid spam trigger words",
      "Use registered short links",
      "Review AT&T content guidelines"
    ],
    relatedTools: ["short_links.create"],
    docsUri: "wavix://api/messaging/errors/37",
    severity: "high",
    category: "sms"
  },
  "41": {
    code: "41",
    title: "Message too long",
    description: "The message exceeds the maximum allowed length.",
    causes: ["Message over 1600 characters", "Too many segments", "Special characters increasing length"],
    solutions: [
      "Shorten message to under 160 chars for single segment",
      "Use URL shortener for links",
      "Split into multiple messages"
    ],
    relatedTools: ["short_links.create"],
    docsUri: "wavix://api/messaging/errors/41",
    severity: "low",
    category: "sms"
  },
  "43": {
    code: "43",
    title: "Blocked by Verizon content filter",
    description: "Verizon's content filtering blocked the message.",
    causes: ["Content policy violation", "Suspicious links", "Known spam patterns"],
    solutions: ["Review Verizon content policies", "Remove or change flagged content", "Use approved short links"],
    relatedTools: ["short_links.create"],
    docsUri: "wavix://api/messaging/errors/43",
    severity: "high",
    category: "sms"
  },
  "44": {
    code: "44",
    title: "Destination number no longer active",
    description: "The recipient's number is disconnected or inactive.",
    causes: ["Number disconnected", "Number recycled", "Temporary disconnection"],
    solutions: [
      "Remove from contact list",
      "Validate numbers periodically with validation.list",
      "Update your database"
    ],
    relatedTools: ["validation.list"],
    docsUri: "wavix://api/messaging/errors/44",
    severity: "low",
    category: "sms"
  },
  "46": {
    code: "46",
    title: "Non-compliant content or URLs detected",
    description: "Message contains content or URLs that violate policies.",
    causes: ["Prohibited content", "Malicious URL detected", "Phishing patterns"],
    solutions: ["Remove non-compliant content", "Use approved/whitelisted URLs", "Use short_links for tracking"],
    relatedTools: ["short_links.create"],
    docsUri: "wavix://api/messaging/errors/46",
    severity: "critical",
    category: "sms"
  },
  "47": {
    code: "47",
    title: "Destination blocked for 60 minutes",
    description: "Temporary block due to too many messages to this number.",
    causes: ["Rate limiting per recipient", "Spam prevention", "Too frequent messages"],
    solutions: ["Wait 60 minutes", "Implement per-recipient rate limiting", "Batch messages appropriately"],
    relatedTools: [],
    docsUri: "wavix://api/messaging/errors/47",
    severity: "medium",
    category: "sms"
  },
  "55": {
    code: "55",
    title: "Idempotency violation",
    description: "Duplicate message detected within idempotency window.",
    causes: ["Same message sent twice", "Retry without new idempotency key", "Client-side retry"],
    solutions: [
      "Use unique idempotency keys for each message",
      "Check if message was already sent",
      "Implement proper retry logic"
    ],
    relatedTools: ["sms.get"],
    docsUri: "wavix://api/messaging/errors/55",
    severity: "low",
    category: "sms"
  }
}

/**
 * Prerequisites for different features
 */
export const featurePrerequisites: Record<
  string,
  {
    name: string
    description: string
    requirements: Array<{
      name: string
      description: string
      checkTool?: string
      checkAction?: string
      required: boolean
      docsUri?: string
    }>
    warnings?: Array<string>
  }
> = {
  sms_us: {
    name: "SMS to US Numbers",
    description: "Send SMS messages to United States phone numbers",
    requirements: [
      {
        name: "10DLC Brand Registration",
        description: "Register your business as a 10DLC Brand",
        checkTool: "10dlc_brands",
        checkAction: "list",
        required: true,
        docsUri: "wavix://product/guides/10dlc"
      },
      {
        name: "10DLC Campaign",
        description: "Create and get approval for a 10DLC Campaign",
        checkTool: "10dlc_campaigns",
        checkAction: "list",
        required: true,
        docsUri: "wavix://api/messaging/10dlc-api"
      },
      {
        name: "Registered Sender ID",
        description: "Register a phone number as Sender ID",
        checkTool: "sms_sender_ids",
        checkAction: "list",
        required: true,
        docsUri: "wavix://api/messaging/send-sms"
      },
      {
        name: "SMS-enabled Number",
        description: "Have an SMS-enabled phone number on your account",
        checkTool: "numbers",
        checkAction: "list",
        required: true,
        docsUri: "wavix://api/numbers/numbers"
      }
    ],
    warnings: [
      "10DLC Brand registration may take 1-2 weeks for vetting",
      "Campaign approval typically takes 1-5 business days",
      "Non-compliant traffic will be blocked and may result in suspension"
    ]
  },
  sms_international: {
    name: "International SMS",
    description: "Send SMS messages to non-US numbers",
    requirements: [
      {
        name: "Registered Sender ID",
        description: "Sender ID approved for destination countries",
        checkTool: "sms_sender_ids",
        checkAction: "list",
        required: true,
        docsUri: "wavix://api/messaging/send-sms"
      },
      {
        name: "Country Allowlist",
        description: "Destination country must be in your Sender ID allowlist",
        checkTool: "sms_sender_ids",
        checkAction: "get",
        required: true
      }
    ],
    warnings: ["Some countries require additional registration", "Pricing varies by destination"]
  },
  two_fa: {
    name: "Two-Factor Authentication",
    description: "Implement 2FA verification via SMS or Voice",
    requirements: [
      {
        name: "2FA Service",
        description: "Create a 2FA Service in the Wavix portal",
        required: true,
        docsUri: "wavix://api/messaging/2fa"
      },
      {
        name: "SMS or Voice capability",
        description: "Have SMS-enabled numbers or SIP trunk for voice",
        checkTool: "numbers",
        checkAction: "list",
        required: true
      }
    ],
    warnings: ["Store service_id securely", "Implement rate limiting to prevent abuse"]
  },
  voice_calls: {
    name: "Voice Calls",
    description: "Make and receive voice calls via API",
    requirements: [
      {
        name: "SIP Trunk",
        description: "Create and configure a SIP trunk",
        checkTool: "sip_trunks",
        checkAction: "list",
        required: true,
        docsUri: "wavix://api/sip-trunking/sip-trunks"
      },
      {
        name: "Phone Number",
        description: "Have a voice-enabled phone number",
        checkTool: "numbers",
        checkAction: "list",
        required: true
      }
    ],
    warnings: ["Configure inbound routing for receiving calls"]
  },
  voice_ai: {
    name: "Voice AI Integration",
    description: "Connect AI voice agents (LiveKit, OpenAI Realtime)",
    requirements: [
      {
        name: "SIP Trunk",
        description: "SIP trunk with WebSocket streaming enabled",
        checkTool: "sip_trunks",
        checkAction: "list",
        required: true,
        docsUri: "wavix://api/sip-trunking/guides/livekit"
      },
      {
        name: "Phone Number",
        description: "Phone number for inbound/outbound calls",
        checkTool: "numbers",
        checkAction: "list",
        required: true
      },
      {
        name: "WebSocket Endpoint",
        description: "Your AI service WebSocket URL",
        required: true
      }
    ],
    warnings: ["Ensure low latency connection", "Test with short calls first"]
  },
  call_recording: {
    name: "Call Recording",
    description: "Record voice calls for quality assurance",
    requirements: [
      {
        name: "SIP Trunk with Recording",
        description: "Enable call recording on SIP trunk",
        checkTool: "sip_trunks",
        checkAction: "get",
        required: true
      },
      {
        name: "Storage",
        description: "Recordings are stored automatically",
        required: false
      }
    ],
    warnings: ["Ensure compliance with recording consent laws", "Recordings incur storage costs"]
  }
}

/**
 * Troubleshooting tools
 */
export const troubleshootingTools: Array<Tool> = [
  {
    name: "troubleshoot",
    description: `Universal troubleshooting tool for any Wavix issue. 

Automatically diagnoses:
- Error codes from failed API calls
- SMS delivery problems  
- Call failures
- 10DLC registration issues
- Configuration problems

Just provide what you know:
- error_code: The error number (e.g., "33", "5")
- message_id: SMS message ID that failed
- call_uuid: Call ID that had issues
- description: Plain text description of the problem

Returns:
- What went wrong
- Why it happened
- Step-by-step fix instructions
- Related tools to resolve the issue`,
    inputSchema: {
      type: "object",
      properties: {
        error_code: {
          type: "string",
          description: "Error code from API response (e.g., '33', '5', '22')"
        },
        message_id: {
          type: "string",
          description: "Message ID for SMS delivery issues"
        },
        call_uuid: {
          type: "string",
          description: "Call UUID for voice call issues"
        },
        description: {
          type: "string",
          description: "Plain text description of the problem"
        },
        category: {
          type: "string",
          description: "Category of issue (auto-detected if not provided)",
          enum: ["sms", "call", "10dlc", "number", "billing", "sip", "2fa"]
        }
      }
    }
  },
  {
    name: "diagnose_error",
    description:
      "Diagnose a Wavix API error code. Returns the error explanation, possible causes, solutions, and related tools to fix the issue. Use this when you encounter an error code in API responses.",
    inputSchema: {
      type: "object",
      properties: {
        error_code: {
          type: "string",
          description: "The error code to diagnose (e.g., '33', '5', '22')"
        },
        context: {
          type: "string",
          description: "Optional context about what you were trying to do",
          enum: ["sms_send", "sms_receive", "call", "validation", "2fa", "other"]
        }
      },
      required: ["error_code"]
    }
  },
  {
    name: "check_prerequisites",
    description:
      "Check what's required before using a Wavix feature. Returns a checklist of prerequisites with tools to verify each one. Use this before implementing SMS, 2FA, voice calls, etc.",
    inputSchema: {
      type: "object",
      properties: {
        feature: {
          type: "string",
          description: "The feature you want to use",
          enum: ["sms_us", "sms_international", "two_fa", "voice_calls", "voice_ai", "call_recording"]
        }
      },
      required: ["feature"]
    }
  },
  {
    name: "search_errors",
    description: "Search for error information by keyword. Use when you have an error message but not the code.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (e.g., 'spam', '10DLC', 'blocked', 'carrier')"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "explain",
    description: `Explain how something works in Wavix. Ask about any feature, error, or concept.

Examples:
- "10DLC" - What is 10DLC and why do I need it
- "error 33" - What does error 33 mean
- "SIP trunk" - What is a SIP trunk and how to use it
- "sender ID" - How sender IDs work
- "SMS delivery" - How SMS delivery works
- "webhooks" - How to set up webhooks`,
    inputSchema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "What do you want to understand?"
        }
      },
      required: ["topic"]
    }
  }
]

/**
 * Handle troubleshooting tool calls
 */
export function handleTroubleshootingTool(
  toolName: string,
  args: Record<string, unknown>
): { content: Array<{ type: "text"; text: string }> } {
  switch (toolName) {
    case "troubleshoot":
      return handleUnifiedTroubleshoot(args)
    case "diagnose_error":
      return handleDiagnoseError(args)
    case "check_prerequisites":
      return handleCheckPrerequisites(args)
    case "search_errors":
      return handleSearchErrors(args)
    case "explain":
      return handleExplain(args)
    default:
      throw new Error(`Unknown troubleshooting tool: ${toolName}`)
  }
}

/**
 * Unified troubleshooting handler
 */
function handleUnifiedTroubleshoot(args: Record<string, unknown>): {
  content: Array<{ type: "text"; text: string }>
} {
  const errorCode = args.error_code as string | undefined
  const messageId = args.message_id as string | undefined
  const callUuid = args.call_uuid as string | undefined
  const description = args.description as string | undefined
  let category = args.category as string | undefined

  const response: Record<string, unknown> = {
    diagnosis: {}
  }

  if (!category) {
    if (errorCode) {
      const error = errorDatabase[errorCode]
      category = error?.category || "unknown"
    } else if (messageId) {
      category = "sms"
    } else if (callUuid) {
      category = "call"
    } else if (description) {
      const desc = description.toLowerCase()
      if (desc.includes("sms") || desc.includes("message") || desc.includes("text")) {
        category = "sms"
      } else if (desc.includes("call") || desc.includes("voice") || desc.includes("dial")) {
        category = "call"
      } else if (desc.includes("10dlc") || desc.includes("brand") || desc.includes("campaign")) {
        category = "10dlc"
      } else if (desc.includes("number") || desc.includes("did") || desc.includes("phone")) {
        category = "number"
      } else if (desc.includes("sip") || desc.includes("trunk")) {
        category = "sip"
      } else if (desc.includes("2fa") || desc.includes("verification") || desc.includes("otp")) {
        category = "2fa"
      }
    }
  }

  response.detected_category = category || "unknown"

  if (errorCode) {
    const diagnosisResult = handleDiagnoseError({ error_code: errorCode, context: category })
    const diagnosisText = diagnosisResult.content[0]?.text
    if (diagnosisText) {
      try {
        response.error_diagnosis = JSON.parse(diagnosisText)
      } catch {
        response.error_diagnosis = diagnosisText
      }
    }
  }

  const actionableSteps: Array<string> = []

  if (category === "sms") {
    if (errorCode === "33") {
      actionableSteps.push("1. Check 10DLC campaign status with 10dlc_campaigns.get")
      actionableSteps.push("2. Verify campaign is ACTIVE (not pending)")
      actionableSteps.push("3. Ensure your sender number is linked to the campaign")
      actionableSteps.push("4. Review message content matches registered use case")
    } else if (errorCode === "5") {
      actionableSteps.push("1. Check sender ID countries with sms_sender_ids.get")
      actionableSteps.push("2. Register sender ID for destination country")
      actionableSteps.push("3. Wait for approval if required")
    } else if (!errorCode) {
      actionableSteps.push("1. Use sms.get to check message status")
      actionableSteps.push("2. Look for error_code in the response")
      actionableSteps.push("3. Use diagnose_error with the error code")
    }

    response.common_sms_issues = {
      "No delivery": "Check message status with sms.get",
      "Error 33": "10DLC campaign not active or content mismatch",
      "Error 5": "Sender ID not approved for country",
      "Error 22": "Sender ID not found on account",
      "Error 9": "Recipient opted out"
    }
  } else if (category === "call") {
    if (!errorCode) {
      actionableSteps.push("1. Use cdrs.get with the call UUID to check status")
      actionableSteps.push("2. Check disposition (answered, noanswer, busy, failed)")
      actionableSteps.push("3. Verify SIP trunk configuration")
    }

    response.common_call_issues = {
      "No answer": "Destination didn't pick up",
      Busy: "Destination is on another call",
      Failed: "Call couldn't be connected - check number validity",
      "No audio": "Check SIP trunk codec settings"
    }
  } else if (category === "10dlc") {
    actionableSteps.push("1. Check brand status with 10dlc_brands.get")
    actionableSteps.push("2. Check campaign status with 10dlc_campaigns.get")
    actionableSteps.push("3. Brand should be VERIFIED, Campaign should be ACTIVE")
    actionableSteps.push("4. Ensure phone number is linked to campaign")

    response.common_10dlc_issues = {
      "Brand pending": "Wait 1-7 business days for verification",
      "Campaign pending": "Wait 1-5 business days for carrier approval",
      "Low throughput": "Request external vetting with 10dlc_brands.vetting_create",
      "Content rejection": "Review sample messages match your use case"
    }
  }

  if (actionableSteps.length > 0) {
    response.actionable_steps = actionableSteps
  }

  if (description && !errorCode) {
    const searchResult = handleSearchErrors({ query: description })
    const searchText = searchResult.content[0]?.text
    if (searchText) {
      try {
        const searchData = JSON.parse(searchText)
        if (searchData.database_matches?.length > 0) {
          response.possibly_related_errors = searchData.database_matches.slice(0, 3)
        }
      } catch {
        // ignore parse errors
      }
    }
  }

  response.need_more_help = {
    "Get step-by-step guide": "Use get_recipe with appropriate recipe",
    "Check prerequisites": "Use quick_check with feature name",
    "Search documentation": "Use list_endpoints or integration_example"
  }

  return {
    content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
  }
}

/**
 * Explain a topic
 */
function handleExplain(args: Record<string, unknown>): {
  content: Array<{ type: "text"; text: string }>
} {
  const topic = (args.topic as string)?.toLowerCase() || ""

  const explanations: Record<
    string,
    { title: string; explanation: string; key_points: Array<string>; related: Array<string> }
  > = {
    "10dlc": {
      title: "10DLC (10-Digit Long Code)",
      explanation:
        "10DLC is a system for sending Application-to-Person (A2P) SMS messages in the United States using standard 10-digit phone numbers. It was introduced by US carriers (AT&T, T-Mobile, Verizon) in 2021 to reduce spam and improve deliverability.",
      key_points: [
        "Required for all A2P SMS to US numbers",
        "Two-step registration: Brand + Campaign",
        "Brand verification takes 1-7 business days",
        "Campaign approval takes 1-5 business days",
        "Higher throughput available with external vetting",
        "Non-compliant traffic will be blocked"
      ],
      related: ["get_recipe('sms_campaign_us')", "check_prerequisites('sms_us')", "10dlc_brands.create"]
    },
    "sender id": {
      title: "Sender ID",
      explanation:
        "A Sender ID is the name or number that appears as the sender when recipients receive your SMS. It can be alphanumeric (like 'MyBrand') or numeric (a phone number).",
      key_points: [
        "Alphanumeric: 3-11 characters, cannot receive replies",
        "Numeric: Uses your phone number, can receive replies",
        "Must be registered per country",
        "Some countries require pre-approval",
        "US requires numeric sender ID linked to 10DLC campaign"
      ],
      related: ["sms_sender_ids.create", "sms_sender_ids.list"]
    },
    "sip trunk": {
      title: "SIP Trunk",
      explanation:
        "A SIP (Session Initiation Protocol) trunk connects your phone system or application to the Wavix voice network. It enables you to make and receive phone calls over the internet.",
      key_points: [
        "Required for voice calls via API",
        "Supports both inbound and outbound calls",
        "Can be used with PBX systems (3CX, Asterisk, FreeSWITCH)",
        "Supports call streaming for Voice AI integration",
        "IP authentication or username/password authentication available"
      ],
      related: ["sip_trunks.create", "get_recipe('voice_ai_livekit')"]
    },
    webhooks: {
      title: "Webhooks",
      explanation:
        "Webhooks are HTTP callbacks that notify your application when events occur. Wavix sends POST requests to your URL when messages are delivered, calls complete, etc.",
      key_points: [
        "SMS webhooks: delivery reports, inbound messages",
        "Call webhooks: call status updates",
        "Must respond with 200 OK quickly",
        "Configure at account level or per-message",
        "Retry logic built-in for failed deliveries"
      ],
      related: ["profile.update (dlr_relay_url, sms_relay_url)", "call_webhooks.create"]
    },
    "2fa": {
      title: "Two-Factor Authentication (2FA)",
      explanation:
        "Wavix 2FA is a service for sending verification codes via SMS or voice call. It handles code generation, delivery, and verification automatically.",
      key_points: [
        "Create 2FA Service in Wavix portal first",
        "Send codes via SMS or voice",
        "Codes auto-expire after configured time",
        "Built-in rate limiting",
        "Session tracking for verification flow"
      ],
      related: ["get_recipe('setup_2fa')", "two_fa.send", "two_fa.check"]
    },
    "sms delivery": {
      title: "SMS Delivery Process",
      explanation:
        "When you send an SMS via Wavix, it goes through several stages: accepted by Wavix, sent to carrier network, delivered to recipient's device.",
      key_points: [
        "accepted: Wavix received your request",
        "sent: Message sent to carrier",
        "delivered: Confirmed delivered to device",
        "undelivered: Failed with error code",
        "Use delivery webhooks or sms.get for status"
      ],
      related: ["sms.get", "diagnose_error", "profile.update (dlr_relay_url)"]
    },
    "voice ai": {
      title: "Voice AI Integration",
      explanation:
        "Wavix supports integrating AI voice agents using SIP trunking and WebSocket audio streaming. Popular integrations include LiveKit, OpenAI Realtime API, and Vapi.",
      key_points: [
        "Connect via SIP trunk for call handling",
        "Use WebSocket streaming for real-time audio",
        "Support for both inbound and outbound calls",
        "Call recording and transcription available",
        "Low latency optimized"
      ],
      related: ["get_recipe('voice_ai_livekit')", "sip_trunks.create", "calls.stream_start"]
    }
  }

  let matchedTopic: string | undefined

  for (const key of Object.keys(explanations)) {
    if (topic.includes(key) || key.includes(topic)) {
      matchedTopic = key
      break
    }
  }

  if (topic.match(/error\s*(\d+)/)) {
    const errorCode = topic.match(/error\s*(\d+)/)?.[1]
    if (errorCode) {
      return handleDiagnoseError({ error_code: errorCode })
    }
  }

  if (matchedTopic) {
    const info = explanations[matchedTopic]
    if (info) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                topic: info.title,
                explanation: info.explanation,
                key_points: info.key_points,
                learn_more: info.related
              },
              null,
              2
            )
          }
        ]
      }
    }
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            topic,
            message: "Topic not found in quick reference",
            suggestion: "Try one of these topics or search documentation",
            available_topics: Object.keys(explanations),
            search_tip: "Use list_endpoints to browse all API endpoints"
          },
          null,
          2
        )
      }
    ]
  }
}

/**
 * Diagnose an error code
 */
function handleDiagnoseError(args: Record<string, unknown>): {
  content: Array<{ type: "text"; text: string }>
} {
  const errorCode = String(args.error_code).replace(/^error_?/i, "")
  const context = args.context as string | undefined

  const error = errorDatabase[errorCode]

  if (!error) {
    // Try to find in documentation
    const docUri = `wavix://api/messaging/errors/${errorCode}`
    const resource = getResource(docUri)

    if (resource) {
      const content = readResourceContent(resource)
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error_code: errorCode,
                found_in_docs: true,
                documentation: content,
                docsUri: docUri,
                tip: "This error is documented but not in our quick reference. See documentation above."
              },
              null,
              2
            )
          }
        ]
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error_code: errorCode,
              found: false,
              message: `Error code "${errorCode}" not found in database`,
              suggestions: [
                "Check if the error code is correct",
                "Search by keyword using search_errors tool",
                "Check the full error message for more context"
              ],
              available_codes: Object.keys(errorDatabase)
            },
            null,
            2
          )
        }
      ]
    }
  }

  // Build response with context-aware suggestions
  const response = {
    error_code: error.code,
    title: error.title,
    severity: error.severity,
    category: error.category,
    description: error.description,
    possible_causes: error.causes,
    solutions: error.solutions,
    related_tools: error.relatedTools.map(t => {
      const [tool, action] = t.split(".")
      return { tool, action, description: `Use ${tool}.${action} to investigate` }
    }),
    documentation: error.docsUri,
    context_tips: getContextTips(error, context)
  }

  return {
    content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
  }
}

/**
 * Get context-specific tips
 */
function getContextTips(error: (typeof errorDatabase)[string], context: string | undefined): Array<string> {
  const tips: Array<string> = []

  if (context === "sms_send" && error.category === "sms") {
    tips.push("Check your message content for compliance")
    tips.push("Verify sender ID is registered and active")
  }

  if (error.severity === "critical") {
    tips.push("This is a critical error - resolve before continuing")
  }

  if (error.relatedTools.some(t => t.includes("10dlc"))) {
    tips.push("10DLC issues often require waiting for approval")
  }

  return tips
}

/**
 * Check prerequisites for a feature
 */
function handleCheckPrerequisites(args: Record<string, unknown>): {
  content: Array<{ type: "text"; text: string }>
} {
  const feature = args.feature as string

  const prereqs = featurePrerequisites[feature]

  if (!prereqs) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: `Unknown feature: ${feature}`,
              available_features: Object.entries(featurePrerequisites).map(([k, v]) => ({
                id: k,
                name: v.name
              }))
            },
            null,
            2
          )
        }
      ]
    }
  }

  const response = {
    feature: prereqs.name,
    description: prereqs.description,
    requirements: prereqs.requirements.map(req => ({
      name: req.name,
      description: req.description,
      required: req.required,
      how_to_check: req.checkTool ? `Use ${req.checkTool}.${req.checkAction}` : "Manual verification",
      documentation: req.docsUri
    })),
    warnings: prereqs.warnings,
    next_steps: [
      "Check each requirement using the suggested tools",
      "Complete missing requirements in order",
      "Test with a small volume first"
    ]
  }

  return {
    content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
  }
}

/**
 * Search errors by keyword
 */
function handleSearchErrors(args: Record<string, unknown>): {
  content: Array<{ type: "text"; text: string }>
} {
  const query = (args.query as string).toLowerCase()

  // Search in error database
  const matches = Object.values(errorDatabase).filter(
    error =>
      error.title.toLowerCase().includes(query) ||
      error.description.toLowerCase().includes(query) ||
      error.causes.some(c => c.toLowerCase().includes(query)) ||
      error.solutions.some(s => s.toLowerCase().includes(query))
  )

  // Also search in documentation
  const docMatches = searchResources(query).filter(r => r.uri.includes("/errors/"))

  const response = {
    query,
    database_matches: matches.map(e => ({
      code: e.code,
      title: e.title,
      severity: e.severity,
      description: e.description
    })),
    documentation_matches: docMatches.map(d => ({
      title: d.name,
      uri: d.uri
    })),
    tip:
      matches.length > 0 && matches[0]
        ? `Use diagnose_error with code "${matches[0].code}" for full details`
        : "Try different keywords or check the error code directly"
  }

  return {
    content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
  }
}

/**
 * Check if tool is a troubleshooting tool
 */
export function isTroubleshootingTool(name: string): boolean {
  return ["troubleshoot", "diagnose_error", "check_prerequisites", "search_errors", "explain"].includes(name)
}
