/**
 * Wavix Smart Assistant
 *
 * Unified entry point that understands natural language requests
 * and routes to appropriate tools with context and guidance.
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import { featurePrerequisites } from "../troubleshooting.js"
import { workflowRecipes } from "../workflow-recipes.js"

interface IntentResult {
  intent: string
  category: "sms" | "call" | "number" | "2fa" | "10dlc" | "sip" | "billing" | "help" | "unknown"
  action: string
  params: Record<string, string>
  requiresApiKey: boolean
  prerequisites?: Array<string>
  suggestedRecipe?: string
  quickGuide: Array<string>
}

interface BusinessScenario {
  pattern: RegExp
  scenario: string
  title: string
  description: string
  questions: Array<string>
  recipes: Array<string>
  quickStart: Array<string>
}

const businessScenarios: Array<BusinessScenario> = [
  {
    pattern: /(?:crm|salesforce|hubspot|zoho|pipedrive|customer\s*relationship)|(?:connect|integrat).*crm/i,
    scenario: "crm_integration",
    title: "CRM Integration",
    description: "Connect your CRM system with Wavix for automated messaging",
    questions: ["Which CRM platform?", "What triggers should send SMS?", "Do you need inbound message handling?"],
    recipes: ["sms_campaign_us", "sms_delivery_webhooks"],
    quickStart: [
      "1. Get Wavix API key from app.wavix.com",
      "2. Set up 10DLC for US (or Sender ID for international)",
      "3. Use webhook endpoints for delivery status",
      "4. Integrate sms.send into your CRM workflows",
      "5. Optional: Set up inbound SMS relay URL"
    ]
  },
  {
    pattern:
      /(?:bulk|mass|broadcast|campaign|marketing|newsletter).*(?:sms|message|text)|(?:sms|message|text).*(?:bulk|mass|broadcast|campaign|marketing|newsletter)|(?:mailing|messaging).*system|system.*(?:mailing|messaging)/i,
    scenario: "bulk_sms",
    title: "Bulk SMS / Marketing Campaigns",
    description: "Send SMS messages at scale for marketing, notifications, or alerts",
    questions: [
      "What country/countries will you send to?",
      "Expected monthly volume?",
      "Transactional or promotional messages?",
      "Do you need delivery reports?"
    ],
    recipes: ["sms_campaign_us", "international_sms", "sms_delivery_webhooks"],
    quickStart: [
      "1. For US: Register 10DLC Brand and Campaign (required, 1-2 weeks)",
      "2. For International: Register Sender IDs per country",
      "3. Purchase SMS-enabled phone numbers",
      "4. Set up delivery webhooks for status tracking",
      "5. Use sms.send API or send_message tool"
    ]
  },
  {
    pattern:
      /(?:verify|verification|otp|one.?time|login|auth|sign.?in|sign.?up|password|security\s*code)|2fa|two.?factor/i,
    scenario: "verification",
    title: "User Verification / 2FA",
    description: "Send OTP codes for user authentication and verification",
    questions: ["SMS or Voice verification?", "What code length and expiry?", "Expected verification volume?"],
    recipes: ["setup_2fa"],
    quickStart: [
      "1. Create 2FA Service in Wavix portal (get service_id)",
      "2. Integrate two_fa.send to send codes",
      "3. Integrate two_fa.check to verify codes",
      "4. Implement rate limiting in your app",
      "Use quick_check('two_fa') to verify setup"
    ]
  },
  {
    pattern:
      /(?:voice|ivr|pbx|contact.?center|call.?center)|(?:make|receive|inbound|outbound).*call|(?:ai|bot|agent).*(?:voice|call)/i,
    scenario: "voice_integration",
    title: "Voice Calls / Contact Center",
    description: "Make and receive voice calls via API or connect to PBX/AI agents",
    questions: [
      "Inbound, outbound, or both?",
      "Need call recording/transcription?",
      "Integrating with AI voice agent?"
    ],
    recipes: ["voice_ai_livekit", "buy_phone_number"],
    quickStart: [
      "1. Create SIP Trunk for voice traffic",
      "2. Purchase phone number(s)",
      "3. Configure inbound routing to your system",
      "4. Use calls.create for outbound calls",
      "5. For AI agents: see voice_ai_livekit recipe"
    ]
  },
  {
    pattern: /(?:order|shipping|delivery|appointment|booking|reservation|reminder).*(?:notif|sms|alert)|transactional/i,
    scenario: "transactional_sms",
    title: "Transactional Notifications",
    description: "Send order updates, appointment reminders, delivery alerts",
    questions: ["What types of notifications?", "Which countries?", "Need delivery confirmation?"],
    recipes: ["sms_campaign_us", "sms_delivery_webhooks"],
    quickStart: [
      "1. For US: Register 10DLC with 'CUSTOMER_CARE' use case",
      "2. Purchase SMS-enabled number",
      "3. Integrate sms.send into your backend",
      "4. Set up delivery webhooks for status",
      "5. Handle failed deliveries gracefully"
    ]
  },
  {
    pattern:
      /(?:integrat|connect|setup|implement|add|use).*(?:wavix|sms|api)|(?:wavix|sms|api).*(?:integrat|connect|setup|implement)/i,
    scenario: "general_integration",
    title: "General Wavix Integration",
    description: "Connect your system with Wavix messaging and voice APIs",
    questions: [
      "What's your primary use case? (SMS, Voice, 2FA)",
      "Which countries will you operate in?",
      "What's your tech stack?"
    ],
    recipes: ["sms_campaign_us", "setup_2fa", "buy_phone_number"],
    quickStart: [
      "1. Get API key from app.wavix.com/api-keys",
      "2. For US SMS: Complete 10DLC registration",
      "3. For Voice: Create SIP Trunk",
      "4. Purchase phone numbers",
      "5. Use list_endpoints to explore APIs"
    ]
  }
]

const intentPatterns: Array<{
  pattern: RegExp
  intent: string
  category: IntentResult["category"]
  action: string
  extractParams?: (match: RegExpMatchArray, text: string) => Record<string, string>
  prerequisites?: Array<string>
  suggestedRecipe?: string
}> = [
  {
    pattern: /send\s+(sms|text|message)/i,
    intent: "send_sms",
    category: "sms",
    action: "sms.send",
    extractParams: (_match, text) => {
      const toMatch = text.match(/to\s+(\+?\d[\d\s-]{8,})/i)
      const msgMatch = text.match(/[:"']([^"']+)[:"']|message[:\s]+(.+?)(?:\s+to|\s+from|$)/i)
      return {
        to: toMatch?.[1]?.replace(/[\s-]/g, "") || "",
        message: msgMatch?.[1] || msgMatch?.[2] || ""
      }
    },
    prerequisites: ["sms_us"],
    suggestedRecipe: "sms_campaign_us"
  },
  {
    pattern: /check.*(sms|message).*(status|delivery)/i,
    intent: "check_sms_status",
    category: "sms",
    action: "sms.get",
    extractParams: (_match, text) => {
      const idMatch = text.match(/(?:id|message)[:\s]+([a-f0-9-]+)/i)
      return { message_id: idMatch?.[1] || "" }
    }
  },
  {
    pattern: /(why|troubleshoot|debug|fix|error|failed|not.*(work|deliver))/i,
    intent: "troubleshoot",
    category: "help",
    action: "troubleshoot",
    extractParams: (_match, text) => {
      const errorMatch = text.match(/error[:\s]+(\d+)/i)
      const idMatch = text.match(/(?:id|message|call)[:\s]+([a-f0-9-]+)/i)
      return {
        error_code: errorMatch?.[1] || "",
        id: idMatch?.[1] || ""
      }
    }
  },
  {
    pattern: /make|start|initiate.*call/i,
    intent: "make_call",
    category: "call",
    action: "calls.create",
    extractParams: (_match, text) => {
      const toMatch = text.match(/to\s+(\+?\d[\d\s-]{8,})/i)
      const fromMatch = text.match(/from\s+(\+?\d[\d\s-]{8,})/i)
      return {
        to: toMatch?.[1]?.replace(/[\s-]/g, "") || "",
        from: fromMatch?.[1]?.replace(/[\s-]/g, "") || ""
      }
    },
    prerequisites: ["voice_calls"]
  },
  {
    pattern: /buy|purchase|get.*(?:phone\s*)?number/i,
    intent: "buy_number",
    category: "number",
    action: "buy_numbers.available",
    extractParams: (_match, text) => {
      const countryMatch = text.match(/in\s+(\w+)/i)
      const areaMatch = text.match(/area\s*code\s+(\d+)/i)
      return {
        country: countryMatch?.[1] || "",
        area_code: areaMatch?.[1] || ""
      }
    },
    suggestedRecipe: "buy_phone_number"
  },
  {
    pattern: /list|show|get.*(?:my\s+)?numbers/i,
    intent: "list_numbers",
    category: "number",
    action: "numbers.list"
  },
  {
    pattern: /set\s*up|configure|register.*10dlc|brand/i,
    intent: "setup_10dlc",
    category: "10dlc",
    action: "10dlc_brands.create",
    suggestedRecipe: "sms_campaign_us"
  },
  {
    pattern: /create.*campaign/i,
    intent: "create_campaign",
    category: "10dlc",
    action: "10dlc_campaigns.create",
    prerequisites: ["sms_us"],
    suggestedRecipe: "sms_campaign_us"
  },
  {
    pattern: /send.*(?:verification|2fa|otp|code)/i,
    intent: "send_2fa",
    category: "2fa",
    action: "two_fa.send",
    extractParams: (_match, text) => {
      const toMatch = text.match(/to\s+(\+?\d[\d\s-]{8,})/i)
      return { to: toMatch?.[1]?.replace(/[\s-]/g, "") || "" }
    },
    prerequisites: ["two_fa"],
    suggestedRecipe: "setup_2fa"
  },
  {
    pattern: /verify.*code/i,
    intent: "verify_2fa",
    category: "2fa",
    action: "two_fa.check",
    extractParams: (_match, text) => {
      const codeMatch = text.match(/code[:\s]+(\d+)/i)
      return { code: codeMatch?.[1] || "" }
    }
  },
  {
    pattern: /balance|credits?|how much.*left/i,
    intent: "check_balance",
    category: "billing",
    action: "profile.config"
  },
  {
    pattern: /create.*sip.*trunk/i,
    intent: "create_sip_trunk",
    category: "sip",
    action: "sip_trunks.create",
    prerequisites: ["voice_calls"]
  },
  {
    pattern: /list.*sip.*trunk/i,
    intent: "list_sip_trunks",
    category: "sip",
    action: "sip_trunks.list"
  },
  {
    pattern: /voice\s*ai|livekit|openai.*realtime/i,
    intent: "setup_voice_ai",
    category: "sip",
    action: "sip_trunks.create",
    prerequisites: ["voice_ai"],
    suggestedRecipe: "voice_ai_livekit"
  },
  {
    pattern: /how\s+(do|to|can)|what\s+is|explain|help|guide/i,
    intent: "get_help",
    category: "help",
    action: "explain"
  }
]

function matchBusinessScenario(request: string): BusinessScenario | null {
  const normalized = request.toLowerCase()
  for (const scenario of businessScenarios) {
    if (scenario.pattern.test(normalized)) {
      return scenario
    }
  }
  return null
}

function parseIntent(request: string): IntentResult {
  const normalizedRequest = request.toLowerCase().trim()

  for (const { pattern, intent, category, action, extractParams, prerequisites, suggestedRecipe } of intentPatterns) {
    const match = normalizedRequest.match(pattern)
    if (match) {
      const params = extractParams ? extractParams(match, request) : {}
      const quickGuide = buildQuickGuide(intent, category, params, prerequisites)

      return {
        intent,
        category,
        action,
        params,
        requiresApiKey: category !== "help",
        prerequisites,
        suggestedRecipe,
        quickGuide
      }
    }
  }

  return {
    intent: "unknown",
    category: "unknown",
    action: "help",
    params: {},
    requiresApiKey: false,
    quickGuide: [
      "I couldn't understand your request. Try one of these:",
      "• 'Send SMS to +15551234567: Hello!'",
      "• 'Check my account balance'",
      "• 'Buy a phone number in New York'",
      "• 'Set up 10DLC for US messaging'",
      "• 'Why is my SMS not delivering?'"
    ]
  }
}

function buildQuickGuide(
  intent: string,
  _category: string,
  params: Record<string, string>,
  prerequisites?: Array<string>
): Array<string> {
  const guide: Array<string> = []

  switch (intent) {
    case "send_sms":
      guide.push("📱 **Sending SMS**")
      if (params.to) {
        const isUS = params.to.startsWith("+1") || params.to.startsWith("1")
        if (isUS) {
          guide.push("")
          guide.push("⚠️ **US SMS requires 10DLC registration:**")
          guide.push("1. Register your business as a 10DLC Brand")
          guide.push("2. Create and get approval for a Campaign")
          guide.push("3. Link your phone number to the Campaign")
          guide.push("")
          guide.push("📋 Ask for the SMS Campaign setup guide for full instructions")
        }
      }
      guide.push("")
      guide.push("**Ready to send?** Just provide the recipient number and your message.")
      break

    case "check_sms_status":
      guide.push("📊 **Checking SMS Status**")
      guide.push("")
      guide.push("Provide the message ID to check its delivery status.")
      guide.push("")
      guide.push("**Status meanings:**")
      guide.push("• accepted → Message received by Wavix")
      guide.push("• sent → Sent to carrier")
      guide.push("• delivered → Confirmed delivered")
      guide.push("• undelivered → Failed (check error_code)")
      break

    case "troubleshoot":
      guide.push("🔧 **Troubleshooting**")
      guide.push("")
      if (params.error_code) {
        guide.push(`I can help diagnose error ${params.error_code}`)
      } else {
        guide.push("Provide the error code from your failed operation")
        guide.push("Or describe the issue you're experiencing")
      }
      break

    case "buy_number":
      guide.push("📞 **Buying Phone Numbers**")
      guide.push("")
      guide.push("1. Tell me which country you need a number in")
      guide.push("2. I'll show you available cities/regions")
      guide.push("3. Browse available numbers")
      guide.push("4. Select and purchase the number you want")
      break

    case "setup_10dlc":
      guide.push("🏢 **10DLC Registration**")
      guide.push("")
      guide.push("10DLC is required for A2P SMS in the US.")
      guide.push("")
      guide.push("Ask for the SMS Campaign setup guide for complete instructions")
      break

    case "send_2fa":
      guide.push("🔐 **Two-Factor Authentication**")
      guide.push("")
      guide.push("1. First, create a 2FA Service in Wavix portal")
      guide.push("2. Send verification code to user's phone")
      guide.push("3. User enters the code")
      guide.push("4. Verify the code is correct")
      guide.push("")
      guide.push("Ask for the 2FA implementation guide for full instructions")
      break

    case "check_balance":
      guide.push("💰 **Account Balance**")
      guide.push("")
      guide.push("I can show you your current balance and account limits.")
      break

    case "setup_voice_ai":
      guide.push("🤖 **Voice AI Integration**")
      guide.push("")
      guide.push("Connect AI voice agents (LiveKit, OpenAI Realtime) with Wavix")
      guide.push("")
      guide.push("Ask for the Voice AI integration guide for complete instructions")
      break

    case "get_help":
      guide.push("ℹ️ **Need Help?**")
      guide.push("")
      guide.push("You can ask about:")
      guide.push("• Available guides and recipes")
      guide.push("• What's needed before using a feature")
      guide.push("• Troubleshooting error codes")
      guide.push("• How specific features work")
      break

    default:
      if (prerequisites && prerequisites.length > 0) {
        guide.push("**Prerequisites:**")
        for (const prereq of prerequisites) {
          const info = featurePrerequisites[prereq]
          if (info) {
            guide.push(`• ${info.name}: ${info.description}`)
          }
        }
      }
  }

  return guide
}

export const assistantTool: Tool = {
  name: "wavix_assistant",
  description: `Smart assistant for Wavix integration. Understands business scenarios and guides you step-by-step.

**Business scenarios:**
- "I have a mailing system and need Wavix integration"
- "Set up bulk SMS for marketing campaigns"
- "Add 2FA verification to my app"
- "Connect my CRM with SMS notifications"
- "Build a voice AI agent with phone calls"

**Direct commands:**
- "Send SMS to +15551234567: Hello!"
- "Check my account balance"
- "Buy a phone number"
- "Why is my SMS failing?"

Returns: clarifying questions, quick-start guide, recommended recipes, and next steps.`,
  inputSchema: {
    type: "object",
    properties: {
      request: {
        type: "string",
        description: "Describe your integration need or what you want to do"
      }
    },
    required: ["request"]
  }
}

export function handleAssistant(args: Record<string, unknown>): { content: Array<{ type: "text"; text: string }> } {
  const request = args.request as string

  if (!request) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: "Please provide a request describing what you want to do",
              examples: [
                "I have a mailing system and need Wavix integration",
                "Set up bulk SMS for marketing campaigns",
                "Integrate 2FA verification into my app",
                "Connect my CRM with SMS notifications",
                "Send SMS to +15551234567: Hello!"
              ]
            },
            null,
            2
          )
        }
      ]
    }
  }

  const businessScenario = matchBusinessScenario(request)

  if (businessScenario) {
    const response = {
      scenario: businessScenario.title,
      description: businessScenario.description,
      clarifying_questions: businessScenario.questions,
      quick_start_guide: businessScenario.quickStart,
      recommended_guides: businessScenario.recipes
        .map(id => {
          const recipe = workflowRecipes[id]
          return recipe?.name
        })
        .filter(Boolean),
      next_steps: [
        "1. Answer the clarifying questions above to narrow down your needs",
        "2. Ask to check if your account is ready for this feature",
        "3. Follow the recommended guide for step-by-step instructions"
      ]
    }

    return {
      content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
    }
  }

  const intent = parseIntent(request)

  const response: Record<string, unknown> = {}

  if (Object.keys(intent.params).some(k => intent.params[k])) {
    response.extracted_info = Object.fromEntries(Object.entries(intent.params).filter(([, v]) => v))
  }

  if (intent.prerequisites && intent.prerequisites.length > 0) {
    response.check_first = "Make sure your account is ready for this feature before proceeding"
  }

  if (intent.suggestedRecipe) {
    const recipe = workflowRecipes[intent.suggestedRecipe]
    if (recipe) {
      response.recommended_guide = recipe.name
    }
  }

  response.guide = intent.quickGuide

  if (intent.intent === "unknown") {
    response.available_scenarios = [
      "Bulk SMS / Marketing campaigns",
      "User verification / 2FA",
      "Order updates, reminders, alerts",
      "Voice calls / Contact center / AI agents",
      "Connect CRM with SMS"
    ]
    response.example_requests = [
      "Send SMS to +15551234567: Hello!",
      "Make a call to +15551234567",
      "Buy a phone number",
      "Set up 10DLC for US messaging",
      "Send verification code",
      "Check my account balance",
      "Why is my SMS failing?"
    ]
  }

  return {
    content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
  }
}

export function isAssistantTool(name: string): boolean {
  return name === "wavix_assistant"
}
