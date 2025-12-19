/**
 * Workflow Recipes
 *
 * Provides step-by-step guides for common Wavix integration scenarios:
 * - SMS campaigns in US (10DLC)
 * - International SMS setup
 * - 2FA implementation
 * - Voice AI integration
 * - Number provisioning
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js"

export interface WorkflowStep {
  step: number
  title: string
  description: string
  tool?: string
  action?: string
  params?: Record<string, unknown>
  manualAction?: string
  tips?: Array<string>
  codeExample?: string
}

export interface WorkflowRecipe {
  id: string
  name: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  prerequisites?: Array<string>
  steps: Array<WorkflowStep>
  warnings?: Array<string>
  successCriteria: Array<string>
  relatedRecipes?: Array<string>
  codeSnippetUri?: string
  docsUri?: string
}

/**
 * All available workflow recipes
 */
export const workflowRecipes: Record<string, WorkflowRecipe> = {
  sms_campaign_us: {
    id: "sms_campaign_us",
    name: "SMS Campaign in USA (10DLC)",
    description: "Complete guide to set up A2P SMS messaging in the United States with 10DLC compliance",
    category: "SMS",
    difficulty: "intermediate",
    prerequisites: ["Wavix account with verified business", "US phone number or plan to purchase one"],
    steps: [
      {
        step: 1,
        title: "Register 10DLC Brand",
        description: "Register your business as a 10DLC Brand. This establishes your business identity with carriers.",
        tool: "10dlc_brands",
        action: "create",
        params: {
          company_name: "Your Company LLC",
          dba_name: "Your Brand",
          entity_type: "PRIVATE_PROFIT",
          vertical: "TECHNOLOGY",
          ein_taxid: "XX-XXXXXXX",
          ein_taxid_country: "US",
          first_name: "John",
          last_name: "Doe",
          phone_number: "+1XXXXXXXXXX",
          email: "contact@company.com",
          street_address: "123 Main St",
          city: "San Francisco",
          state_or_province: "CA",
          country: "US",
          zip: "94105"
        },
        tips: [
          "Use exact legal business name matching EIN records",
          "Provide accurate contact information",
          "Consider external vetting for higher throughput"
        ]
      },
      {
        step: 2,
        title: "Wait for Brand Approval",
        description: "Monitor brand status until verified",
        tool: "10dlc_brands",
        action: "get",
        tips: [
          "Check status daily with 10dlc_brands.get",
          "Brand status should be 'VERIFIED'",
          "Appeal if rejected with supporting documents"
        ]
      },
      {
        step: 3,
        title: "Create 10DLC Campaign",
        description: "Register your messaging use case as a Campaign",
        tool: "10dlc_campaigns",
        action: "create",
        params: {
          brand_id: "BXXXXXX",
          name: "Customer Notifications",
          usecase: "CUSTOMER_CARE",
          description: "Sending order updates and customer service messages",
          sample1: "Your order #12345 has shipped. Track at example.com/track",
          sample2: "Hi! Your appointment is confirmed for tomorrow at 2pm.",
          sample3: "Your verification code is 123456. Valid for 10 minutes.",
          embedded_links: true,
          embedded_link_sample: "https://example.com/track/12345",
          optin: true,
          optin_workflow: "Users opt-in during checkout by checking a box",
          optin_keywords: "START,YES",
          optin_message: "You are now subscribed to Example notifications. Reply STOP to unsubscribe.",
          optout: true,
          optout_keywords: "STOP,QUIT,UNSUBSCRIBE",
          optout_message: "You have been unsubscribed. Reply START to resubscribe.",
          help: true,
          help_keywords: "HELP,INFO",
          help_message: "Example Notifications. Reply STOP to unsubscribe. Contact support@example.com",
          auto_renewal: true
        },
        tips: [
          "Sample messages should match your actual use case",
          "Include proper opt-in/opt-out messaging",
          "Be specific about how users subscribe"
        ]
      },
      {
        step: 4,
        title: "Wait for Campaign Approval",
        description: "Monitor campaign status across carriers",
        tool: "10dlc_campaigns",
        action: "get",
        tips: [
          "Each carrier (AT&T, T-Mobile, Verizon) approves separately",
          "Some carriers may request additional info",
          "Use nudge action if stuck in pending"
        ]
      },
      {
        step: 5,
        title: "Purchase US Phone Number",
        description: "Buy an SMS-enabled US phone number",
        tool: "buy_numbers",
        action: "available",
        params: {
          country: 1,
          city: 1
        },
        tips: [
          "Choose a local number for better deliverability",
          "Ensure number supports SMS",
          "Add to cart and checkout"
        ]
      },
      {
        step: 6,
        title: "Register Sender ID",
        description: "Register your phone number as an SMS Sender ID",
        tool: "sms_sender_ids",
        action: "create",
        params: {
          sender_id: "+1XXXXXXXXXX",
          type: "numeric",
          countries: ["US"],
          usecase: "transactional"
        },
        tips: ["Sender ID must be linked to your approved 10DLC campaign", "Use the number you purchased"]
      },
      {
        step: 7,
        title: "Send Test Message",
        description: "Send a test SMS to verify everything works",
        tool: "sms",
        action: "send",
        params: {
          from: "+1XXXXXXXXXX",
          to: "+1YYYYYYYYYY",
          message_body: { text: "Test message from Wavix!" }
        },
        tips: ["Start with low volume", "Monitor delivery status", "Check for any errors"]
      }
    ],
    warnings: [
      "Never send messages before 10DLC approval - they will be blocked",
      "Non-compliant content can result in campaign suspension",
      "Carrier throughput limits apply based on trust score"
    ],
    successCriteria: [
      "Brand status is VERIFIED",
      "Campaign status is ACTIVE with carrier approvals",
      "Test message delivered successfully"
    ],
    relatedRecipes: ["sms_delivery_webhooks", "international_sms"],
    docsUri: "wavix://product/guides/10dlc"
  },

  setup_2fa: {
    id: "setup_2fa",
    name: "Implement 2FA Verification",
    description: "Set up two-factor authentication using SMS or Voice verification codes",
    category: "2FA",
    difficulty: "beginner",
    prerequisites: ["SMS-enabled phone number", "Backend server to handle verification"],
    steps: [
      {
        step: 1,
        title: "Create 2FA Service",
        description: "Create a 2FA service in the Wavix portal to get your service_id",
        manualAction: "Go to app.wavix.com → 2FA → Create Service",
        tips: ["Configure code length (4-8 digits)", "Set code expiration time", "Customize message template"]
      },
      {
        step: 2,
        title: "Store Service ID",
        description: "Save your 2FA service_id in environment variables",
        codeExample: `# .env
WAVIX_API_KEY=your_api_key
WAVIX_2FA_SERVICE_ID=your_service_id`,
        tips: ["Never expose service_id in client-side code", "Use environment variables"]
      },
      {
        step: 3,
        title: "Implement Send Verification",
        description: "Create endpoint to send verification code",
        tool: "two_fa",
        action: "send",
        params: {
          service_id: "your_service_id",
          to: "+1XXXXXXXXXX",
          channel: "sms"
        },
        codeExample: `// Send verification code
app.post('/auth/send-code', async (req, res) => {
  const { phone } = req.body

  const result = await wavix.twoFa.send({
    service_id: process.env.WAVIX_2FA_SERVICE_ID,
    to: phone,
    channel: 'sms' // or 'voice'
  })

  // Store session_uuid for verification
  res.json({ sessionId: result.session_uuid })
})`,
        tips: ["Store session_uuid to verify later", "Implement rate limiting"]
      },
      {
        step: 4,
        title: "Implement Verify Code",
        description: "Create endpoint to verify the code entered by user",
        tool: "two_fa",
        action: "check",
        params: {
          session_uuid: "session_id_from_send",
          code: "123456"
        },
        codeExample: `// Verify code
app.post('/auth/verify', async (req, res) => {
  const { sessionId, code } = req.body

  const result = await wavix.twoFa.check({
    session_uuid: sessionId,
    code: code
  })

  if (result.valid) {
    // Grant access
    res.json({ success: true })
  } else {
    res.status(401).json({ error: 'Invalid code' })
  }
})`,
        tips: ["Handle expired codes gracefully", "Limit verification attempts"]
      },
      {
        step: 5,
        title: "Add Resend Capability",
        description: "Allow users to request a new code by calling send again with the same phone number",
        tool: "two_fa",
        action: "send",
        params: {
          service_id: "your_service_id",
          to: "+1XXXXXXXXXX",
          channel: "sms"
        },
        codeExample: `app.post('/auth/resend', async (req, res) => {
  const { phone, previousSessionId } = req.body

  await wavix.twoFa.cancel({ session_uuid: previousSessionId })

  const result = await wavix.twoFa.send({
    service_id: process.env.WAVIX_2FA_SERVICE_ID,
    to: phone,
    channel: 'sms'
  })

  res.json({ sessionId: result.session_uuid })
})`,
        tips: [
          "Cancel previous session before resending",
          "Implement cooldown between resends",
          "Offer voice as alternative channel"
        ]
      }
    ],
    warnings: [
      "Implement rate limiting to prevent abuse",
      "Don't expose session_uuid in URLs",
      "Log verification attempts for security"
    ],
    successCriteria: [
      "Can send verification code via SMS",
      "Can verify code successfully",
      "Invalid codes are rejected"
    ],
    codeSnippetUri: "wavix://code/node/two-fa",
    docsUri: "wavix://api/messaging/2fa"
  },

  voice_ai_livekit: {
    id: "voice_ai_livekit",
    name: "Voice AI with LiveKit",
    description: "Connect LiveKit AI voice agents with Wavix for phone calls",
    category: "Voice AI",
    difficulty: "advanced",
    prerequisites: ["LiveKit Cloud account", "Wavix SIP trunk", "Phone number"],
    steps: [
      {
        step: 1,
        title: "Create SIP Trunk",
        description: "Create a SIP trunk for voice traffic",
        tool: "sip_trunks",
        action: "create",
        params: {
          label: "LiveKit Voice AI",
          password: "secure_password",
          callerid: "+1XXXXXXXXXX",
          ip_restrict: false,
          didinfo_enabled: true,
          call_restrict: false,
          cost_limit: false,
          channels_restrict: false,
          rewrite_enabled: false,
          transcription_enabled: true,
          transcription_threshold: 30
        },
        tips: ["Note the trunk username (login)", "Enable transcription for analytics"]
      },
      {
        step: 2,
        title: "Configure Phone Number",
        description: "Set up inbound routing to your SIP trunk",
        tool: "numbers",
        action: "update_destinations",
        params: {
          ids: [123],
          destinations: [{ type: "sip", value: "trunk_username@sip.wavix.com" }]
        },
        tips: ["Route inbound calls to your SIP trunk", "Test with a simple SIP client first"]
      },
      {
        step: 3,
        title: "Configure LiveKit SIP",
        description: "Set up LiveKit to connect to Wavix SIP trunk",
        manualAction: "Configure LiveKit SIP Trunk with Wavix credentials",
        codeExample: `// livekit-sip-trunk.yaml
sip:
  trunk:
    name: wavix-trunk
    address: sip.wavix.com
    username: your_trunk_username
    password: your_trunk_password

  dispatch:
    rules:
      - match: ".*"
        dispatch:
          room_name: "ai-agent-room"
          participant_identity: "caller"`,
        tips: ["Use secure credentials", "Test connectivity before adding AI agent"]
      },
      {
        step: 4,
        title: "Create AI Agent",
        description: "Deploy your LiveKit AI agent",
        codeExample: `// agent.ts
import { Agent } from '@livekit/agents'
import { OpenAI } from '@livekit/agents-openai'

const agent = new Agent({
  llm: new OpenAI({ model: 'gpt-4' }),
  voice: new OpenAI.TTS({ voice: 'nova' }),
  stt: new OpenAI.STT(),
})

agent.on('call', async (call) => {
  await call.answer()
  await agent.say("Hello! How can I help you today?")
})`,
        tips: ["Start with a simple greeting", "Handle errors gracefully"]
      },
      {
        step: 5,
        title: "Test Inbound Call",
        description: "Call your Wavix number to test the AI agent",
        manualAction: "Dial your Wavix phone number",
        tips: ["Test from a real phone", "Check call quality", "Monitor for errors"]
      },
      {
        step: 6,
        title: "Implement Outbound Calls",
        description: "Make outbound calls from your AI agent",
        tool: "calls",
        action: "create",
        params: {
          from: "+1XXXXXXXXXX",
          to: "+1YYYYYYYYYY",
          call_recording: true,
          status_callback: "https://your-server.com/call-status"
        },
        tips: ["Use status webhooks for call events", "Implement proper error handling"]
      }
    ],
    warnings: [
      "Ensure HIPAA compliance if handling health data",
      "Inform callers they're speaking with AI (legal requirement in some regions)",
      "Monitor call costs closely during testing"
    ],
    successCriteria: [
      "Inbound calls connect to AI agent",
      "AI agent can have conversation",
      "Call recordings are available"
    ],
    relatedRecipes: ["buy_phone_number"],
    docsUri: "wavix://api/sip-trunking/guides/livekit"
  },

  buy_phone_number: {
    id: "buy_phone_number",
    name: "Purchase Phone Number",
    description: "Browse and purchase phone numbers with SMS and voice capabilities",
    category: "Numbers",
    difficulty: "beginner",
    steps: [
      {
        step: 1,
        title: "List Available Countries",
        description: "Get list of countries where numbers are available",
        tool: "buy_numbers",
        action: "countries",
        tips: ["Filter by text_enabled_only if you need SMS"]
      },
      {
        step: 2,
        title: "Select Region/City",
        description: "Browse available regions and cities",
        tool: "buy_numbers",
        action: "cities",
        params: { country: 1 },
        tips: ["Country ID 1 is usually USA", "Choose local area code for better deliverability"]
      },
      {
        step: 3,
        title: "Browse Available Numbers",
        description: "View numbers available for purchase",
        tool: "buy_numbers",
        action: "available",
        params: { country: 1, city: 123 },
        tips: ["Numbers show SMS/voice capabilities", "Check monthly cost"]
      },
      {
        step: 4,
        title: "Add to Cart",
        description: "Add selected numbers to your cart",
        tool: "cart",
        action: "update",
        params: { ids: ["number_id_1", "number_id_2"] }
      },
      {
        step: 5,
        title: "Checkout",
        description: "Complete the purchase",
        tool: "cart",
        action: "checkout",
        params: { ids: ["number_id_1"] },
        tips: ["Ensure sufficient balance", "Numbers are immediately available after purchase"]
      },
      {
        step: 6,
        title: "Configure Number",
        description: "Set up SMS relay URL and voice routing",
        tool: "numbers",
        action: "update",
        params: {
          id: 123,
          sms_relay_url: "https://your-server.com/sms-webhook",
          call_recording_enabled: true
        }
      }
    ],
    successCriteria: ["Number appears in numbers.list", "Can send/receive SMS", "Can make/receive calls"],
    docsUri: "wavix://api/numbers/numbers"
  },

  sms_delivery_webhooks: {
    id: "sms_delivery_webhooks",
    name: "Set Up SMS Delivery Webhooks",
    description: "Receive real-time delivery status updates for your SMS messages",
    category: "SMS",
    difficulty: "beginner",
    steps: [
      {
        step: 1,
        title: "Create Webhook Endpoint",
        description: "Create an endpoint on your server to receive webhooks",
        codeExample: `// Express.js webhook handler
app.post('/webhooks/sms-delivery', (req, res) => {
  const { message_id, status, to, error_code } = req.body

  console.log(\`Message \${message_id} to \${to}: \${status}\`)

  if (error_code) {
    console.error(\`Error: \${error_code}\`)
    // Use diagnose_error to understand the error
  }

  // Update your database
  await db.messages.update(message_id, { status })

  res.sendStatus(200)
})`,
        tips: ["Return 200 quickly to acknowledge", "Process asynchronously if needed"]
      },
      {
        step: 2,
        title: "Configure Account Webhook",
        description: "Set default delivery report URL in account settings",
        tool: "profile",
        action: "update",
        params: {
          dlr_relay_url: "https://your-server.com/webhooks/sms-delivery"
        }
      },
      {
        step: 3,
        title: "Or Use Per-Message Callback",
        description: "Specify callback URL when sending each message",
        tool: "sms",
        action: "send",
        params: {
          from: "+1XXXXXXXXXX",
          to: "+1YYYYYYYYYY",
          message_body: { text: "Hello!" },
          callback_url: "https://your-server.com/webhooks/sms-delivery"
        }
      },
      {
        step: 4,
        title: "Handle Status Updates",
        description: "Process different delivery statuses",
        codeExample: `// Status handling
const statusHandlers = {
  'accepted': () => console.log('Message accepted by Wavix'),
  'sent': () => console.log('Message sent to carrier'),
  'delivered': () => console.log('Message delivered to recipient'),
  'undelivered': (error) => handleError(error),
  'failed': (error) => handleError(error)
}

function handleDeliveryReport(report) {
  const handler = statusHandlers[report.status]
  if (handler) handler(report.error_code)
}`
      }
    ],
    successCriteria: [
      "Webhook endpoint receives delivery reports",
      "Can track message status in real-time",
      "Errors are properly logged"
    ],
    docsUri: "wavix://api/messaging/webhooks-delivery-reports"
  },

  international_sms: {
    id: "international_sms",
    name: "International SMS Setup",
    description: "Send SMS to numbers outside the United States",
    category: "SMS",
    difficulty: "beginner",
    steps: [
      {
        step: 1,
        title: "Check Country Requirements",
        description: "Verify sender ID requirements for destination country",
        manualAction: "Check wavix.com/coverage for country-specific requirements",
        tips: [
          "Some countries require alphanumeric Sender IDs",
          "Some countries require pre-registration",
          "Pricing varies significantly by country"
        ]
      },
      {
        step: 2,
        title: "Create Sender ID",
        description: "Register a Sender ID for your destination countries",
        tool: "sms_sender_ids",
        action: "create",
        params: {
          sender_id: "MyBrand",
          type: "alphanumeric",
          countries: ["GB", "DE", "FR"],
          usecase: "transactional"
        },
        tips: [
          "Alphanumeric IDs: 3-11 characters",
          "Can't receive replies with alphanumeric IDs",
          "Use numeric ID if you need 2-way messaging"
        ]
      },
      {
        step: 3,
        title: "Wait for Approval",
        description: "Some countries require manual approval",
        tool: "sms_sender_ids",
        action: "get",
        tips: ["Self-service countries: instant approval", "Regulated countries: may need documents"]
      },
      {
        step: 4,
        title: "Send Test Message",
        description: "Test delivery to international number",
        tool: "sms",
        action: "send",
        params: {
          from: "MyBrand",
          to: "+44XXXXXXXXXX",
          message_body: { text: "Hello from Wavix!" }
        }
      }
    ],
    warnings: [
      "International SMS costs vary by country",
      "Some countries block certain content types",
      "Time zone considerations for delivery timing"
    ],
    successCriteria: ["Sender ID approved for target countries", "Test message delivered successfully"],
    docsUri: "wavix://api/messaging/send-sms"
  }
}

/**
 * Workflow recipe tools
 */
export const workflowTools: Array<Tool> = [
  {
    name: "get_recipe",
    description:
      "Get a complete step-by-step workflow recipe for implementing common Wavix features. Returns detailed instructions, code examples, and tool commands for each step.",
    inputSchema: {
      type: "object",
      properties: {
        recipe: {
          type: "string",
          description: "The workflow recipe to retrieve",
          enum: Object.keys(workflowRecipes)
        },
        step: {
          type: "number",
          description: "Optional: Get details for a specific step only"
        }
      },
      required: ["recipe"]
    }
  },
  {
    name: "list_recipes",
    description: "List all available workflow recipes with descriptions. Filter by category.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter by category",
          enum: ["SMS", "2FA", "Voice AI", "Numbers", "Voice"]
        }
      }
    }
  },
  {
    name: "get_recipe_step",
    description: "Get detailed information about a specific step in a recipe, including the exact tool call to make.",
    inputSchema: {
      type: "object",
      properties: {
        recipe: {
          type: "string",
          description: "The recipe ID",
          enum: Object.keys(workflowRecipes)
        },
        step: {
          type: "number",
          description: "The step number (1-based)"
        }
      },
      required: ["recipe", "step"]
    }
  }
]

export function handleWorkflowTool(
  toolName: WorkflowToolName,
  args: Record<string, unknown>
): { content: Array<{ type: "text"; text: string }> } {
  switch (toolName) {
    case "get_recipe":
      return handleGetRecipe(args)
    case "list_recipes":
      return handleListRecipes(args)
    case "get_recipe_step":
      return handleGetRecipeStep(args)
  }
}

/**
 * Get a complete recipe
 */
function handleGetRecipe(args: Record<string, unknown>): {
  content: Array<{ type: "text"; text: string }>
} {
  const recipeId = args.recipe as string
  const stepNum = args.step as number | undefined

  const recipe = workflowRecipes[recipeId]

  if (!recipe) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: `Recipe not found: ${recipeId}`,
              available: Object.entries(workflowRecipes).map(([k, v]) => ({
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

  if (stepNum !== undefined) {
    const step = recipe.steps.find(s => s.step === stepNum)
    if (!step) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: `Step ${stepNum} not found`,
                available_steps: recipe.steps.map(s => s.step)
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
              recipe: recipe.name,
              step: step,
              next_step: recipe.steps.find(s => s.step === stepNum + 1)?.title,
              progress: `${stepNum}/${recipe.steps.length}`
            },
            null,
            2
          )
        }
      ]
    }
  }

  const response = {
    name: recipe.name,
    description: recipe.description,
    category: recipe.category,
    prerequisites: recipe.prerequisites,
    total_steps: recipe.steps.length,
    steps: recipe.steps.map(s => ({
      step: s.step,
      title: s.title,
      description: s.description
    })),
    warnings: recipe.warnings,
    success_criteria: recipe.successCriteria
  }

  return {
    content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
  }
}

/**
 * List available recipes
 */
function handleListRecipes(args: Record<string, unknown>): {
  content: Array<{ type: "text"; text: string }>
} {
  const category = args.category as string | undefined

  let recipes = Object.values(workflowRecipes)

  if (category) {
    recipes = recipes.filter(r => r.category === category)
  }

  const response = {
    total: recipes.length,
    recipes: recipes.map(r => ({
      name: r.name,
      description: r.description,
      category: r.category,
      steps_count: r.steps.length
    }))
  }

  return {
    content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
  }
}

/**
 * Get a specific step with full details
 */
function handleGetRecipeStep(args: Record<string, unknown>): {
  content: Array<{ type: "text"; text: string }>
} {
  const recipeId = args.recipe as string
  const stepNum = args.step as number

  const recipe = workflowRecipes[recipeId]
  if (!recipe) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: `Recipe not found: ${recipeId}` }, null, 2)
        }
      ]
    }
  }

  const step = recipe.steps.find(s => s.step === stepNum)
  if (!step) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: `Step ${stepNum} not found`,
              available_steps: recipe.steps.map(s => ({ step: s.step, title: s.title }))
            },
            null,
            2
          )
        }
      ]
    }
  }

  const response = {
    recipe_name: recipe.name,
    current_step: {
      step: step.step,
      title: step.title,
      description: step.description,
      tips: step.tips,
      code_example: step.codeExample
    },
    progress: {
      current: stepNum,
      total: recipe.steps.length,
      percentage: Math.round((stepNum / recipe.steps.length) * 100)
    },
    navigation: {
      previous: recipe.steps.find(s => s.step === stepNum - 1)?.title,
      next: recipe.steps.find(s => s.step === stepNum + 1)?.title
    }
  }

  return {
    content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
  }
}

export type WorkflowToolName = "get_recipe" | "list_recipes" | "get_recipe_step"

const WORKFLOW_TOOL_NAMES: Array<WorkflowToolName> = ["get_recipe", "list_recipes", "get_recipe_step"]

export function isWorkflowTool(name: string): name is WorkflowToolName {
  return WORKFLOW_TOOL_NAMES.includes(name as WorkflowToolName)
}
