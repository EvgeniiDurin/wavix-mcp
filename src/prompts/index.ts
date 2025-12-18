/**
 * MCP Prompts
 *
 * Pre-defined prompts for common Wavix operations
 * These prompts help AI assistants guide users through Wavix API operations
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { GetPromptRequestSchema, ListPromptsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { logger } from "../helpers/logger.js"

export function registerPrompts(server: Server): void {
  const log = logger.child({ module: "prompts" })

  server.setRequestHandler(ListPromptsRequestSchema, () => {
    log.debug("Listing prompts")
    return Promise.resolve({
      prompts: [
        // SMS/MMS Operations
        {
          name: "send_sms",
          description: "Send an SMS message to a phone number",
          arguments: [
            { name: "to", description: "Destination phone number in E.164 format", required: true },
            { name: "message", description: "Message content", required: true },
            { name: "from", description: "Sender ID (optional)", required: false }
          ]
        },
        {
          name: "send_mms",
          description: "Send an MMS message with media attachments (US/CA only)",
          arguments: [
            { name: "to", description: "Destination phone number in E.164 format", required: true },
            { name: "message", description: "Message text", required: true },
            { name: "media_urls", description: "Comma-separated URLs to media files (max 5)", required: true },
            { name: "from", description: "Sender ID (numeric)", required: false }
          ]
        },
        {
          name: "check_sms_status",
          description: "Check delivery status of an SMS/MMS message",
          arguments: [{ name: "message_id", description: "Message ID returned when sending SMS", required: true }]
        },
        {
          name: "list_recent_sms",
          description: "List recent SMS/MMS messages sent or received",
          arguments: [
            { name: "days", description: "Number of days to look back (default: 7)", required: false },
            {
              name: "direction",
              description: "Filter by direction: outbound, inbound, or all (default: all)",
              required: false
            }
          ]
        },
        {
          name: "setup_sender_id",
          description: "Register a new sender ID for SMS messaging",
          arguments: [
            { name: "sender_id", description: "Alphanumeric (3-11 chars) or numeric phone number", required: true },
            { name: "countries", description: "Comma-separated country codes (e.g., US,GB)", required: true },
            { name: "type", description: "Type: alphanumeric or numeric", required: true }
          ]
        },
        {
          name: "troubleshoot_sms",
          description: "Diagnose SMS delivery issues and suggest solutions",
          arguments: [{ name: "message_id", description: "Message ID with delivery issues", required: true }]
        },

        // Voice/Call Operations
        {
          name: "make_call",
          description: "Initiate an outbound call",
          arguments: [
            { name: "to", description: "Destination phone number in E.164 format", required: true },
            { name: "from", description: "Caller ID (your Wavix number)", required: true },
            {
              name: "action",
              description: "What to do when call is answered (play audio, connect to SIP, etc.)",
              required: false
            }
          ]
        },
        {
          name: "get_call_logs",
          description: "Retrieve call detail records (CDRs) for analysis",
          arguments: [
            { name: "days", description: "Number of days to look back (default: 7)", required: false },
            {
              name: "type",
              description: "Filter by type: placed, received, missed, or all (default: all)",
              required: false
            }
          ]
        },
        {
          name: "get_call_recording",
          description: "Get recording for a specific call",
          arguments: [{ name: "cdr_uuid", description: "Call Detail Record UUID", required: true }]
        },

        // Phone Numbers Management
        {
          name: "search_phone_numbers",
          description: "Search for available phone numbers to purchase",
          arguments: [
            { name: "country", description: "Country code (e.g., US, GB)", required: true },
            { name: "type", description: "Number type: local, toll-free, or all (default: all)", required: false },
            { name: "sms_enabled", description: "Filter SMS-enabled numbers only (default: false)", required: false },
            { name: "area_code", description: "Specific area code or city name (optional)", required: false }
          ]
        },
        {
          name: "buy_phone_number",
          description: "Purchase a phone number from Wavix inventory",
          arguments: [{ name: "number", description: "Phone number to purchase", required: true }]
        },
        {
          name: "list_my_numbers",
          description: "List all phone numbers on your account",
          arguments: []
        },
        {
          name: "configure_number",
          description: "Configure inbound call routing and SMS webhooks for a number",
          arguments: [
            { name: "number", description: "Phone number to configure", required: true },
            { name: "destination", description: "Where to route calls (SIP URI or phone number)", required: true },
            { name: "sms_webhook", description: "URL for inbound SMS notifications (optional)", required: false }
          ]
        },
        {
          name: "release_number",
          description: "Release/return a phone number you no longer need",
          arguments: [{ name: "number", description: "Phone number to release", required: true }]
        },

        // 2FA Operations
        {
          name: "send_2fa_code",
          description: "Send a two-factor authentication code via SMS or voice",
          arguments: [
            { name: "to", description: "Destination phone number in E.164 format", required: true },
            { name: "channel", description: "Delivery channel: sms or voice (default: sms)", required: false }
          ]
        },
        {
          name: "verify_2fa_code",
          description: "Verify a 2FA code entered by user",
          arguments: [
            { name: "session_id", description: "2FA session ID returned when sending code", required: true },
            { name: "code", description: "Code entered by user", required: true }
          ]
        },
        {
          name: "check_2fa_status",
          description: "Check status of a 2FA verification session",
          arguments: [{ name: "session_id", description: "2FA session ID", required: true }]
        },

        // 10DLC Campaign Management
        {
          name: "register_10dlc_brand",
          description: "Register your brand for 10DLC messaging in the US",
          arguments: [
            { name: "brand_name", description: "Your brand or company name", required: true },
            { name: "ein", description: "Employer Identification Number (for Standard registration)", required: false },
            { name: "website", description: "Company website URL", required: false }
          ]
        },
        {
          name: "create_10dlc_campaign",
          description: "Create a 10DLC campaign for US messaging",
          arguments: [
            { name: "brand_id", description: "Your registered brand ID", required: true },
            { name: "use_case", description: "Campaign use case (e.g., 2FA, marketing, mixed)", required: true },
            { name: "description", description: "Detailed campaign description", required: true },
            { name: "sample_messages", description: "Example messages you'll send", required: true }
          ]
        },
        {
          name: "check_10dlc_status",
          description: "Check status of your 10DLC brand or campaign registration",
          arguments: [
            { name: "brand_id", description: "Brand ID to check", required: true },
            { name: "campaign_id", description: "Campaign ID to check (optional)", required: false }
          ]
        },

        // Account & Billing
        {
          name: "check_balance",
          description: "Check account balance and recent usage",
          arguments: []
        },
        {
          name: "get_transaction_history",
          description: "Get billing transaction history",
          arguments: [{ name: "days", description: "Number of days to look back (default: 30)", required: false }]
        },
        {
          name: "get_invoices",
          description: "List account invoices",
          arguments: [
            { name: "year", description: "Filter by year (optional)", required: false },
            { name: "month", description: "Filter by month (optional)", required: false }
          ]
        },
        {
          name: "estimate_costs",
          description: "Estimate costs for SMS, calls, or phone numbers",
          arguments: [
            { name: "service", description: "Service type: sms, voice, or numbers", required: true },
            { name: "destination", description: "Destination country code", required: true },
            { name: "quantity", description: "Estimated quantity (messages or minutes)", required: false }
          ]
        },

        // SIP Trunking
        {
          name: "list_sip_trunks",
          description: "List all SIP trunks on your account",
          arguments: []
        },
        {
          name: "create_sip_trunk",
          description: "Create a new SIP trunk for voice connectivity",
          arguments: [
            { name: "name", description: "SIP trunk name", required: true },
            { name: "ip_whitelist", description: "Comma-separated IP addresses to whitelist", required: false }
          ]
        },

        // Number Validation
        {
          name: "validate_phone_number",
          description: "Validate and get information about a phone number",
          arguments: [{ name: "phone_number", description: "Phone number to validate in E.164 format", required: true }]
        },

        // Complex Workflows
        {
          name: "setup_new_campaign",
          description: "Complete setup for a new messaging campaign (buy number, configure sender ID, test SMS)",
          arguments: [
            { name: "country", description: "Target country code (e.g., US)", required: true },
            { name: "campaign_type", description: "Campaign type: marketing, transactional, or 2fa", required: true },
            { name: "test_number", description: "Phone number to send test SMS", required: false }
          ]
        },
        {
          name: "troubleshoot_delivery",
          description: "Comprehensive troubleshooting for message or call delivery issues",
          arguments: [
            { name: "type", description: "Issue type: sms, mms, or voice", required: true },
            { name: "id", description: "Message ID or Call ID", required: true }
          ]
        },

        // Integration & Code Generation
        {
          name: "wavix-integrate",
          description: "Generate Wavix API integration code for your application",
          arguments: [
            {
              name: "language",
              description: "Programming language (node, python, ruby, php, go, java, csharp)",
              required: true
            },
            { name: "feature", description: "Feature to integrate (sms, calls, 2fa, webhooks, cdr)", required: true },
            {
              name: "framework",
              description: "Framework (express, fastify, flask, django, laravel, rails, gin, spring)",
              required: false
            }
          ]
        },
        {
          name: "wavix-webhook-setup",
          description: "Generate webhook handler code for receiving Wavix events",
          arguments: [
            { name: "language", description: "Programming language (node, python, php, go, java)", required: true },
            { name: "framework", description: "Framework (express, flask, laravel, gin, spring)", required: false },
            {
              name: "events",
              description:
                "Comma-separated list of events to handle (message.received, message.delivered, call.completed)",
              required: false
            }
          ]
        },
        {
          name: "wavix-quickstart",
          description: "Generate quickstart code to send your first SMS or make your first call",
          arguments: [
            {
              name: "language",
              description: "Programming language (node, python, php, go, java, csharp)",
              required: true
            },
            { name: "action", description: "Action to perform (sms, call, 2fa)", required: true }
          ]
        }
      ]
    })
  })

  server.setRequestHandler(GetPromptRequestSchema, request => {
    const { name, arguments: args } = request.params
    log.debug("Getting prompt", { name, args })

    switch (name) {
      // SMS/MMS Operations
      case "send_sms":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Send an SMS message to ${args?.to}${args?.from ? ` from sender ID "${args.from}"` : ""} with the following content:\n\n"${args?.message}"\n\nUse the sms_send tool. Make sure the phone number is in E.164 format (e.g., +15551234567).\n\nDocumentation: wavix://api/messaging/send-sms\n\nIf the tool returns an error:\n- Verify phone number format (must be E.164: +[country code][number])\n- Check if sender ID is registered for destination country (if using custom sender ID)\n- Verify message length (max 1600 characters)\n- Check account balance\n- Review error code and message for specific issues\n- See troubleshooting guide: wavix://api/messaging/troubleshooting`
              }
            }
          ]
        })

      case "send_mms":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Send an MMS message to ${args?.to}${args?.from ? ` from "${args.from}"` : ""} with:\n- Text: "${args?.message}"\n- Media URLs: ${args?.media_urls}\n\nNote: MMS is only supported for US and Canada destinations. Use the sms_send tool with message_body.media parameter.\n\nDocumentation: wavix://api/messaging/send-sms\n\nIf sending fails:\n- Verify destination is US or Canada (MMS only works for these countries)\n- Check phone number is in E.164 format (e.g., +15551234567)\n- Ensure media URLs are publicly accessible and valid (max 5 URLs, 1MB per file)\n- Verify media formats are supported (JPEG, PNG, GIF for images)\n- Check account balance\n- Review error message for specific issues`
              }
            }
          ]
        })

      case "check_sms_status":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Check the delivery status of SMS/MMS message with ID: ${args?.message_id}\n\nUse the sms_get tool and show:\n- Message status (sent, delivered, failed, pending)\n- Delivery timestamp (if delivered)\n- Error code and message (if failed)\n- Cost and segments\n\nDocumentation: wavix://api/messaging/send-sms\n\nIf status shows "failed", check the error code and refer to troubleshooting guide: wavix://api/messaging/troubleshooting`
              }
            }
          ]
        })

      case "list_recent_sms":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `List recent SMS/MMS messages from the last ${args?.days || 7} days${args?.direction ? ` (${args.direction} only)` : ""}.\n\nUse the sms_list tool with appropriate date and direction filters. Summarize:\n- Total messages sent/received\n- Success rate and delivery status breakdown\n- Total cost and cost per message\n- Failed messages with error codes\n- Message volume trends\n\nDocumentation: wavix://api/messaging/send-sms\n\nIf you see many failed messages, use the troubleshoot_sms prompt for specific message IDs to diagnose issues.`
              }
            }
          ]
        })

      case "setup_sender_id":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Register a new sender ID with the following details:\n\nRequired parameters:\n- Sender ID: ${args?.sender_id}\n- Type: ${args?.type} (alphanumeric or numeric)\n- Countries: ${args?.countries}\n\nExample: Register "MyBrand" as alphanumeric sender ID for US and GB.\n\nValidation requirements:\n- Sender ID format: alphanumeric (3-11 characters, letters and numbers) OR numeric (phone number in E.164 format)\n- Country codes: Valid ISO country codes (e.g., US, GB, CA) - comma-separated\n- Type: Must be exactly "alphanumeric" or "numeric"\n\nStep-by-step instructions:\n1. Validate input: Check sender ID format and country codes are valid\n2. Check availability: Verify if self-service registration is available for these countries (may need to check restrictions)\n3. Register: Use sms_sender_id_create tool with validated parameters:\n   - sender_id: "${args?.sender_id}"\n   - type: "${args?.type}"\n   - countries: "${args?.countries}"\n4. Check status: Explain the registration status (pending, approved, rejected)\n5. Next steps: Provide actionable next steps based on status\n\nDocumentation: wavix://api/messaging/sender-ids\n\nIf registration fails:\n- Verify sender ID format matches requirements (alphanumeric: 3-11 chars, numeric: E.164 format)\n- Validate country codes are valid ISO codes (e.g., US, GB, CA)\n- Ensure sender ID meets country-specific requirements\n- For US: May require 10DLC brand/campaign registration first\n- Review error message for specific validation failures\n- Check if sender ID is already registered`
              }
            }
          ]
        })

      case "troubleshoot_sms":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Troubleshoot SMS delivery issues for message ID: ${args?.message_id}\n\n1. Get message details using sms_get\n2. Check the error code and status\n3. Look up the error in the documentation (wavix://api/messaging/troubleshooting)\n4. Provide specific recommendations based on the error:\n   - For sender ID issues: Check if sender ID is registered for destination country\n   - For carrier rejections: Review message content for spam triggers\n   - For 10DLC issues: Check brand/campaign status and messaging limits\n   - For rate limits: Suggest implementing backoff or spreading messages\n\nProvide actionable steps to resolve the issue.`
              }
            }
          ]
        })

      // Voice/Call Operations
      case "make_call":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Initiate an outbound call:\n- From: ${args?.from}\n- To: ${args?.to}\n${args?.action ? `- Action: ${args.action}\n` : ""}\nUse the call_create tool. Both numbers must be in E.164 format (e.g., +15551234567). The 'from' number must be an active Wavix number on your account.\n\nDocumentation: wavix://api/voice/make-call\n\nIf the call fails:\n- Verify both numbers are in E.164 format\n- Check that 'from' number is active on your account (use numbers_list to verify)\n- Ensure account has sufficient balance\n- Check destination number is reachable\n- Review error message for specific failure reason`
              }
            }
          ]
        })

      case "get_call_logs":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Retrieve call detail records (CDRs) from the last ${args?.days || 7} days${args?.type ? ` for ${args.type} calls` : ""}.\n\nUse the cdr_list tool with appropriate date filters. Summarize:\n- Total calls and total duration\n- Cost breakdown by call type (outbound, inbound)\n- Top destinations (countries/regions)\n- Success rate (completed vs failed/missed)\n- Average call duration\n- Peak calling hours\n- Any failed or missed calls with reasons\n\nDocumentation: wavix://api/voice/cdr\n\nProvide insights about call patterns, costs, and suggest optimizations if applicable.`
              }
            }
          ]
        })

      case "get_call_recording":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Get the recording for call with CDR UUID: ${args?.cdr_uuid}\n\nUse the recording_get_by_cdr tool to retrieve:\n- Recording URL (download link)\n- Recording format and duration\n- Transcription (if available)\n- Call metadata\n\nDocumentation: wavix://api/voice/cdr\n\nNote: Recordings are only available if call recording was enabled for the call. If no recording is found, verify that recording was enabled in call configuration.`
              }
            }
          ]
        })

      // Phone Numbers Management
      case "search_phone_numbers":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Search for available phone numbers in ${args?.country}.\n\nRequired parameters:\n- Country: ${args?.country} (ISO country code, e.g., US, GB)\n\nOptional filters:\n${args?.type ? `- Type: ${args.type} (local, toll-free, or all)\n` : "- Type: Not specified (will search all types)\n"}${args?.sms_enabled ? "- SMS-enabled: Yes (filtering for SMS-capable numbers only)\n" : "- SMS-enabled: Not specified (will include all numbers)\n"}${args?.area_code ? `- Area code/city: ${args.area_code}\n` : "- Area code/city: Not specified (will search entire country)\n"}\nExample: Search for SMS-enabled local numbers in US, area code 415 (San Francisco).\n\nValidation requirements:\n- Country code: Valid ISO country code (2 letters, e.g., US, GB, CA)\n- Type: If provided, must be "local", "toll-free", or "all"\n- Area code: If provided, must be valid for the country\n\nStep-by-step instructions:\n1. Get country ID: Use buy_countries_list tool to find country ID for "${args?.country}"\n2. Navigate to region/city:${args?.area_code ? `\n   - Use buy_regions_list to find regions in the country\n   - Use buy_cities_list or buy_region_cities_list to find cities matching "${args.area_code}"` : "\n   - Skip this step if no area code specified"}${args?.type || args?.sms_enabled ? `\n3. Apply filters: Prepare filter parameters:\n${args?.type ? `   - type: "${args.type}"\n` : ""}${args?.sms_enabled ? "   - sms_enabled: true\n" : ""}` : ""}\n4. Search numbers: Use buy_numbers_available tool with:\n   - country: (from step 1)\n   - city: (from step 2, if area code provided)${args?.type ? `\n   - type: "${args.type}"` : ""}${args?.sms_enabled ? "\n   - sms_enabled: true" : ""}\n5. Display results: For each number show:\n   - Phone number (E.164 format)\n   - Pricing (setup fee, monthly recurring fee)\n   - Capabilities (SMS, voice, MMS, channels)\n   - Number type (local, toll-free)\n\nDocumentation: wavix://api/numbers/numbers\n\nIf no numbers are found:\n- Remove area code filter and search broader area\n- Try different number types (local vs toll-free)\n- Check if country supports the requested features\n- Expand search to nearby regions or cities`
              }
            }
          ]
        })

      case "buy_phone_number":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Purchase phone number: ${args?.number}\n\nRequired parameters:\n- Number: ${args?.number} (phone number to purchase)\n\nExample: Purchase +15551234567\n\nValidation requirements:\n- Number format: Must be in E.164 format (e.g., +15551234567)\n- Number availability: Number must be available for purchase\n- Account balance: Account must have sufficient balance for setup fee + first month\n\nStep-by-step instructions:\n1. Validate input: Verify number is in E.164 format (${args?.number})\n2. Check balance: Use check_balance tool to verify sufficient funds\n3. Add to cart: Use buy_cart_update tool with:\n   - number: "${args?.number}" (E.164 format)\n4. Verify cart: Use cart_get tool to confirm:\n   - Number is in cart\n   - Total cost (setup fee + first month)\n   - All charges are correct\n5. Complete purchase: Use cart_checkout tool to finalize\n6. Confirm purchase: Display:\n   - Number details and status (should be "active")\n   - Activation fee charged\n   - Monthly recurring fee\n   - Next billing date\n   - Number capabilities (SMS, voice, MMS)\n\nDocumentation: wavix://api/numbers/numbers\n\nIf purchase fails:\n- Validate number format: Must be E.164 (+[country code][number])\n- Check account balance: Use check_balance to verify sufficient funds\n- Verify availability: Number may have been purchased by someone else\n- Check requirements: Some countries require additional documentation\n- Review error: Check error message for specific validation failures\n- Retry: If number is still available, try again`
              }
            }
          ]
        })

      case "list_my_numbers":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: "List all phone numbers on the account.\n\nUse the numbers_list tool and display:\n- Number and status (active/inactive)\n- Capabilities (voice, SMS, MMS)\n- Current configuration (destinations, webhooks)\n- Monthly cost\n- Any numbers requiring additional documentation\n\nDocumentation: wavix://api/numbers/numbers\n\nOrganize by status and type for easy reference. If a number shows as inactive, check if additional documentation or verification is required."
              }
            }
          ]
        })

      case "configure_number":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Configure phone number ${args?.number}.\n\nRequired parameters:\n- Number: ${args?.number} (phone number to configure)\n- Call destination: ${args?.destination} (where to route calls)\n\nOptional parameters:\n${args?.sms_webhook ? `- SMS webhook: ${args.sms_webhook} (URL for inbound SMS notifications)\n` : "- SMS webhook: Not specified (will not update SMS webhook)\n"}\nExample: Configure +15551234567 to route calls to sip:user@pbx.example.com and SMS to https://api.example.com/webhooks/sms\n\nValidation requirements:\n- Number format: Must be in E.164 format (e.g., +15551234567)\n- Number ownership: Number must be active on your account\n- Call destination format: One of:\n  - SIP URI: Must start with "sip:" (e.g., sip:user@domain.com)\n  - Phone number: Must be E.164 format (e.g., +15551234567)\n  - SIP trunk ID: Valid trunk ID from your account\n${args?.sms_webhook ? "- SMS webhook URL: Must be HTTPS (not HTTP), publicly accessible, valid URL format\n" : ""}\nStep-by-step instructions:\n1. Validate input: Verify number format (${args?.number}) and destination format (${args?.destination})\n2. Get current config: Use number_get tool with number "${args?.number}" to:\n   - Verify number is active on your account\n   - Check current configuration\n   - Note any existing settings\n3. Update call destination: Use mydids_update_destinations_create tool with:\n   - number: "${args?.number}"\n   - destination: "${args?.destination}" (validated format)\n${args?.sms_webhook ? `4. Update SMS webhook: Use numbers_sms_update tool with:\n   - number: "${args?.number}"\n   - sms_webhook: "${args.sms_webhook}" (HTTPS URL)\n` : "4. Skip SMS webhook: Not updating SMS webhook (not provided)\n"}5. Verify configuration: Use number_get tool again to confirm:\n   - Call destination matches "${args?.destination}"\n${args?.sms_webhook ? `   - SMS webhook matches "${args.sms_webhook}"\n` : ""}   - Configuration is active\n\nDocumentation: wavix://api/numbers/numbers\n\nIf configuration fails:\n- Validate number: Must be E.164 format and active on your account\n- Validate destination: Check format (SIP URI starts with "sip:", phone numbers are E.164)\n${args?.sms_webhook ? "- Validate webhook: Must be HTTPS, publicly accessible, valid URL\n" : ""}- Check permissions: Verify you have permission to modify this number\n- Review error: Check error message for specific validation failures`
              }
            }
          ]
        })

      case "release_number":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Release phone number ${args?.number} back to inventory.\n\n⚠️ WARNING: This action cannot be undone. The number will be immediately removed from your account.\n\n1. First verify the number details using number_get\n   - Confirm number: ${args?.number}\n   - Check current configuration and any active services\n2. Confirm this is the correct number to release\n3. Use numbers_bulk_delete to return the number\n4. Verify the number has been released\n\nDocumentation: wavix://api/numbers/numbers\n\nBefore releasing:\n- Ensure no active services depend on this number\n- Check if number has any pending charges\n- Verify you won't need this number in the future\n- Consider if you should update any integrations that use this number`
              }
            }
          ]
        })

      // 2FA Operations
      case "send_2fa_code":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Send a 2FA verification code to ${args?.to} via ${args?.channel || "SMS"}.\n\nUse the two_fa_verification_create tool with:\n- service_id: (your 2FA service ID)\n- to: ${args?.to} (must be E.164 format)\n- channel: ${args?.channel || "sms"} (sms or voice)\n\nDocumentation: wavix://api/messaging/2fa\n\nReturn the session_id for verification. If number validation is enabled, show carrier and number type information.\n\nIf sending fails:\n- Verify phone number is in E.164 format\n- Check 2FA service is configured and active\n- Ensure account has sufficient balance\n- Review error message for specific issue`
              }
            }
          ]
        })

      case "verify_2fa_code":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Verify 2FA code for session.\n\nRequired parameters:\n- Session ID: ${args?.session_id} (from send_2fa_code)\n- Code: "${args?.code}" (code entered by user)\n\nValidation requirements:\n- Session ID: Must be valid session ID from active 2FA session\n- Code: Must be the exact code sent (case-sensitive, typically 4-6 digits)\n- Session status: Session must not be expired (typically expires in 5-10 minutes)\n\nStep-by-step instructions:\n1. Validate input: Verify session_id and code are provided\n2. Check session status: Use check_2fa_status or two_fa_service_sessions_get to:\n   - Verify session exists and is active\n   - Check remaining verification attempts\n   - Confirm session hasn't expired\n3. Verify code: Use two_fa_verification_check_create tool with:\n   - session_id: "${args?.session_id}"\n   - code: "${args?.code}"\n4. Report results:\n   - Verification success: "Code verified successfully" or "Code is invalid"\n   - Session status: Show updated status after verification\n   - Remaining attempts: Display if verification failed\n   - Next steps: If successful, session is verified; if failed, show remaining attempts\n\nDocumentation: wavix://api/messaging/2fa\n\nIf verification fails:\n- Validate code: Check if code is correct (case-sensitive, exact match required)\n- Check expiration: Verify session hasn't expired (typically 5-10 minutes)\n- Check attempts: Use check_2fa_status to see remaining attempts (usually 3-5 allowed)\n- Review session: Use check_2fa_status to see full session details\n- If exhausted: If all attempts used, user must request new code with send_2fa_code`
              }
            }
          ]
        })

      case "check_2fa_status":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Check status of 2FA verification session.\n\nRequired parameters:\n- Session ID: ${args?.session_id} (from send_2fa_code)\n\nValidation requirements:\n- Session ID: Must be valid session ID from 2FA session\n\nStep-by-step instructions:\n1. Validate input: Verify session_id is provided\n2. Get session details: Use two_fa_service_sessions_get tool with session_id "${args?.session_id}" to get:\n   - Session status\n   - Phone number\n   - Channel used (SMS or voice)\n   - Creation timestamp\n   - Expiration time\n3. Get session events: Use two_fa_session_events_get tool with session_id "${args?.session_id}" to get:\n   - Delivery events (SMS sent, call placed, code delivered)\n   - Event timestamps\n   - Delivery status\n4. Display comprehensive status:\n   - Session status: verified, expired, failed, canceled, or pending\n   - Verification attempts: Used and remaining (e.g., "2 of 5 attempts used")\n   - Delivery events: Timeline of SMS/call delivery\n   - Delivery timestamps: When code was sent and delivered\n   - Total cost: Cost of SMS or call\n   - Phone number: Destination number (masked for privacy)\n   - Carrier info: Carrier and number type (if available)\n   - Errors: Any delivery or verification errors\n\nDocumentation: wavix://api/messaging/2fa\n\nStatus interpretation:\n- "verified": ✅ Code was successfully verified, session complete\n- "expired": ⏰ Session timed out (typically 5-10 minutes), new code needed\n- "failed": ❌ Too many failed verification attempts, new code needed\n- "canceled": 🚫 Session was canceled, new code needed\n- "pending": ⏳ Waiting for code verification, still active`
              }
            }
          ]
        })

      // 10DLC Campaign Management
      case "register_10dlc_brand":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Register a 10DLC brand for US messaging.\n\nRequired parameters:\n- Brand name: ${args?.brand_name}\n\nOptional parameters:\n${args?.ein ? `- EIN: ${args.ein} (Employer Identification Number)\n` : "- EIN: Not provided (will use Quick registration)\n"}${args?.website ? `- Website: ${args.website}\n` : "- Website: Not provided\n"}\n${!args?.ein ? "⚠️ Note: Without EIN, this will be a Quick registration (limited to 1 number, low throughput). For Standard registration with higher limits, provide EIN.\n" : "✅ Standard registration: EIN provided, will have higher throughput limits.\n"}\nValidation requirements:\n- Brand name: Required, company or brand name\n- EIN: If provided, must be valid 9-digit US EIN format (XX-XXXXXXX)\n- Website: If provided, must be valid URL format\n\nStep-by-step instructions:\n1. Validate input: Check brand name is provided, EIN format if provided\n2. Register brand: Use tcr_brand_create tool with:\n   - brand_name: "${args?.brand_name}"${args?.ein ? `\n   - ein: "${args.ein}"` : ""}${args?.website ? `\n   - website: "${args.website}"` : ""}\n3. Get brand ID: Note the brand_id returned from registration\n4. Explain status: Brand will be in "pending" status initially\n5. Explain timeline:\n   - Quick registration (no EIN): Usually approved within hours, limited to 1 number\n   - Standard registration (with EIN): 1-3 business days for verification, higher limits\n6. Next steps: Explain that brand must be verified before creating campaigns\n\nDocumentation: wavix://api/messaging/10dlc\n\nIf registration fails:\n- Validate brand name: Must be provided and valid company name\n- Validate EIN: If provided, must be 9-digit format (XX-XXXXXXX)\n- Check if brand already exists: May already be registered\n- Review error: Check error message for specific validation failures\n- For US: 10DLC is required for US messaging, ensure all requirements are met`
              }
            }
          ]
        })

      case "create_10dlc_campaign":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Create 10DLC campaign for US messaging.\n\nRequired parameters:\n- Brand ID: ${args?.brand_id} (your registered 10DLC brand ID)\n- Use case: ${args?.use_case} (e.g., 2FA, marketing, mixed, customer care)\n- Description: ${args?.description} (detailed campaign description)\n- Sample messages: ${args?.sample_messages} (example messages you'll send)\n\nValidation requirements:\n- Brand ID: Must be a verified 10DLC brand (check status first)\n- Use case: Must be one of: 2FA, marketing, mixed, customer care, or other valid use case\n- Description: Must be specific and detailed (at least 50 characters recommended)\n- Sample messages: Must be actual examples of messages you'll send (2-3 examples)\n\nStep-by-step instructions:\n1. Verify brand status: Use tcr_brand_get tool with brand_id "${args?.brand_id}" to:\n   - Confirm brand exists\n   - Check brand status is "verified" (cannot create campaign if pending/rejected)\n   - Note brand type (Standard or Quick)\n2. Validate campaign details: Ensure:\n   - Use case matches your actual messaging purpose\n   - Description is specific and detailed\n   - Sample messages are realistic examples\n3. Create campaign: Use 10dlc_brands_campaigns_create tool with:\n   - brand_id: "${args?.brand_id}"\n   - use_case: "${args?.use_case}"\n   - description: "${args?.description}"\n   - sample_messages: "${args?.sample_messages}"\n4. Get campaign ID: Note the campaign_id returned\n5. Explain approval process:\n   - Campaign will be in "pending" status\n   - Carrier approval typically takes 1-2 business days\n   - Throughput limits are allocated based on use case and brand type\n6. Explain next steps: Campaign must be approved before sending messages\n\nDocumentation: wavix://api/messaging/10dlc\n\n⚠️ Important notes:\n- Campaign description and samples must match your actual message content\n- Use case must accurately reflect your messaging purpose\n- Standard brands get higher throughput than Quick brands\n- See wavix://api/messaging/10dlc for best practices\n\nIf creation fails:\n- Verify brand is verified: Use tcr_brand_get to check status\n- Validate use case: Must be valid use case type\n- Check description: Must be detailed and specific (not generic)\n- Validate samples: Must be actual message examples\n- Review error: Check error message for specific validation failures`
              }
            }
          ]
        })

      case "check_10dlc_status":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Check 10DLC brand and campaign status.\n\nRequired parameters:\n- Brand ID: ${args?.brand_id} (your registered 10DLC brand ID)\n\nOptional parameters:\n${args?.campaign_id ? `- Campaign ID: ${args.campaign_id} (specific campaign to check)\n` : "- Campaign ID: Not specified (will check all campaigns for brand)\n"}\nValidation requirements:\n- Brand ID: Must be valid brand ID from your account\n- Campaign ID: If provided, must be valid campaign ID for this brand\n\nStep-by-step instructions:\n1. Validate input: Verify brand_id is provided${args?.campaign_id ? `, campaign_id is "${args.campaign_id}"` : ""}\n2. Get brand details: Use tcr_brand_get tool with brand_id "${args?.brand_id}" to retrieve:\n   - Brand verification status (verified, pending, rejected)\n   - Brand type (Standard or Quick)\n   - Registration date and verification timeline\n   - Brand name and details\n3. Get campaign information:${args?.campaign_id ? `\n   - Use 10dlc_brands_campaigns_get_get tool with:\n     * brand_id: "${args?.brand_id}"\n     * campaign_id: "${args.campaign_id}"\n   - Display:\n     * Campaign approval status (approved, pending, rejected)\n     * Throughput limits and allocation\n     * Associated phone numbers and their status\n     * Any rejection reasons or required actions\n     * Campaign use case and description` : `\n   - Use 10dlc_brands_campaigns_list tool with brand_id "${args?.brand_id}"\n   - Display all campaigns:\n     * Campaign ID and name\n     * Status of each campaign (approved, pending, rejected)\n     * Throughput allocations\n     * Use case for each campaign`}\n4. Explain status meanings:\n   - Brand status: What it means and next steps\n   - Campaign status: What it means and when you can send messages\n   - Timeline: Expected approval times\n   - Actions: Any required actions based on status\n\nDocumentation: wavix://api/messaging/10dlc\n\nStatus meanings:\n- Brand "verified": ✅ Ready to create campaigns, can proceed\n- Brand "pending": ⏳ Waiting for carrier verification (1-3 business days), cannot create campaigns yet\n- Brand "rejected": ❌ Brand registration rejected, check reasons and resubmit\n- Campaign "approved": ✅ Can send messages up to throughput limit\n- Campaign "pending": ⏳ Waiting for carrier approval (1-2 business days), cannot send yet\n- Campaign "rejected": ❌ Campaign rejected, check reasons and update/resubmit`
              }
            }
          ]
        })

      // Account & Billing
      case "check_balance":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: "Check Wavix account balance and recent usage.\n\nNo parameters required.\n\nStep-by-step instructions:\n1. Get account profile: Use profile_get tool to retrieve:\n   - Current account balance\n   - Account status (active, suspended, etc.)\n   - Account limits and settings\n   - Account details\n2. Get recent transactions: Use billing_transactions_list tool with:\n   - Date filter: Last 7 days\n   - To retrieve recent charges\n3. Analyze and summarize:\n   - Current balance: Display current account balance and currency\n   - Account status: Show account status and any warnings\n   - Recent charges: Breakdown by service type:\n     * SMS/MMS charges\n     * Voice/call charges\n     * Number rental fees\n     * Setup fees\n     * Other charges\n   - Spending patterns:\n     * Top spending categories\n     * Daily spending trends (last 7 days)\n     * Weekly spending comparison\n   - Warnings:\n     * Low balance alerts (if applicable)\n     * Recommended minimum balance\n     * Suggested top-up amount\n\nDocumentation: wavix://api/billing/balance\n\nIf balance is low:\n- Calculate minimum: Recommend minimum balance based on average daily spending\n- Suggest top-up: Recommend adding funds to cover 30 days of usage\n- Provide instructions: Explain how to add funds to account\n- Cost optimization: If spending is high, suggest:\n  * Reviewing expensive destinations\n  * Optimizing message/call volumes\n  * Checking for unused numbers\n  * Reviewing service usage patterns"
              }
            }
          ]
        })

      case "get_transaction_history":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Get billing transaction history.\n\nOptional parameters:\n- Days: ${args?.days || 30} (number of days to look back, default: 30)\n\nValidation requirements:\n- Days: Must be positive integer (1-365 recommended)\n\nStep-by-step instructions:\n1. Validate input: Verify days parameter (default to 30 if not provided)\n2. Calculate date range: Determine from_date and to_date for last ${args?.days || 30} days\n3. Get transactions: Use billing_transactions_list tool with:\n   - from_date: (calculated start date)\n   - to_date: (calculated end date)\n   - Optional pagination if needed\n4. Analyze transactions:\n   - Total spending: Calculate total by category:\n     * SMS/MMS charges\n     * Voice/call charges\n     * Number rental fees\n     * Setup and activation fees\n     * Other charges\n   - Trends: Analyze daily/weekly spending patterns\n   - Largest transactions: Identify top 10 largest charges\n   - Averages: Calculate average cost per message/call\n   - Anomalies: Identify unusual charges or spending spikes\n5. Display summary:\n   - Period: Show date range analyzed\n   - Total spending: By category and overall\n   - Trends: Daily/weekly patterns\n   - Top transactions: Largest charges with details\n   - Averages: Cost per unit (message, minute, etc.)\n   - Comparison: Compare with previous period if data available\n\nDocumentation: wavix://api/billing/transactions\n\nCost optimization suggestions (if applicable):\n- High-cost services: Identify services with highest spending\n- Destination analysis: Suggest alternatives for expensive destinations\n- Volume optimization: Recommend bulk purchasing or volume discounts\n- Unused services: Highlight any unused numbers or services\n- Unexpected charges: Flag any unexpected or unusual charges\n- Best practices: Suggest cost-saving strategies`
              }
            }
          ]
        })

      case "get_invoices":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `List account invoices.\n\nOptional parameters:\n${args?.year ? `- Year: ${args.year}\n` : "- Year: Not specified (all years)\n"}${args?.month ? `- Month: ${args.month}\n` : "- Month: Not specified (all months)\n"}\nValidation requirements:\n- Year: If provided, must be valid year (4 digits, e.g., 2024)\n- Month: If provided, must be 1-12\n\nStep-by-step instructions:\n1. Validate filters: Check year and month if provided\n2. Get invoices: Use billing_invoices_list tool${args?.year || args?.month ? ` with filters:\n${args?.year ? `   - year: ${args.year}\n` : ""}${args?.month ? `   - month: ${args.month}\n` : ""}` : " (no filters)"}\n3. Display for each invoice:\n   - Invoice number and date\n   - Billing period (from/to dates)\n   - Total amount and currency\n   - Status (paid, pending, overdue)\n   - Payment method (if paid)\n   - Download link (PDF)\n   - Due date (if not paid)\n4. Summary:\n   - Total invoices found\n   - Total amount (paid and unpaid)\n   - Unpaid invoices count and amount\n   - Overdue invoices count and amount\n\nDocumentation: wavix://api/billing/invoices\n\nHighlight:\n- ⚠️ Unpaid invoices: List all unpaid invoices with due dates\n- 🔴 Overdue invoices: List overdue invoices with days overdue\n- Total due: Calculate total amount due\n- Payment: Provide payment instructions if invoices are overdue`
              }
            }
          ]
        })

      case "estimate_costs":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Estimate costs for ${args?.service} to ${args?.destination}${args?.quantity ? ` (${args.quantity} ${args?.service === "voice" ? "minutes" : "messages"})` : ""}.\n\nExample: Estimate cost for 1000 SMS messages to US, or 100 minutes of voice calls to UK.\n\nUse the pricing documentation (wavix://product/pricing) to:\n1. Look up rates for the destination country (${args?.destination})\n2. Calculate estimated costs:\n   - Per-unit cost (per message or per minute)\n   - Total cost for quantity${args?.quantity ? ` (${args.quantity} ${args?.service === "voice" ? "minutes" : "messages"})` : ""}\n   - Any volume discounts if applicable\n3. Show any applicable fees:\n   - Setup fees (for numbers)\n   - Monthly recurring fees\n   - Additional charges\n4. Compare with alternatives if available (different service types or countries)\n\nDocumentation: wavix://product/pricing\n\nProvide a clear cost breakdown with:\n- Base rate per unit\n- Total estimated cost\n- Any additional fees\n- Cost per day/month if quantity is provided`
              }
            }
          ]
        })

      // SIP Trunking
      case "list_sip_trunks":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: "List all SIP trunks on the account.\n\nNo parameters required.\n\nStep-by-step instructions:\n1. Get trunks: Use sip_trunks_list tool to retrieve all SIP trunks\n2. Display for each trunk:\n   - Trunk name and ID\n   - SIP server hostname and port\n   - SIP credentials:\n     * Username\n     * Password (masked for security)\n   - IP whitelist configuration\n   - Associated phone numbers\n   - Current status (active, inactive)\n   - Registration status\n3. Provide configuration examples for common PBX systems:\n   - Asterisk: Show sip.conf format with trunk details\n   - 3CX: Show SIP trunk settings configuration\n   - FreeSWITCH: Show gateway configuration\n   - Generic: Show standard SIP client settings\n\nDocumentation: wavix://api/sip-trunking/sip-trunks\n\nIf no trunks exist:\n- Suggest creating one using create_sip_trunk prompt\n- Explain benefits of SIP trunking\n- Provide setup guidance"
              }
            }
          ]
        })

      case "create_sip_trunk":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Create a new SIP trunk.\n\nRequired parameters:\n- Name: "${args?.name}" (trunk name/identifier)\n\nOptional parameters:\n${args?.ip_whitelist ? `- IP whitelist: ${args.ip_whitelist} (comma-separated IP addresses)\n` : "- IP whitelist: Not specified (no IP restrictions)\n"}\nValidation requirements:\n- Name: Required, unique trunk identifier\n- IP whitelist: If provided, must be valid IP addresses (IPv4 or IPv6), comma-separated\n\nStep-by-step instructions:\n1. Validate input: Verify name is provided, IP addresses if specified\n2. Create trunk: Use sip_trunk_create tool with:\n   - label: "${args?.name}"${args?.ip_whitelist ? `\n   - ip_whitelist: "${args.ip_whitelist}"` : ""}\n3. Get credentials: After creation, retrieve and display:\n   - SIP server hostname and port\n   - SIP username\n   - SIP password (display clearly, user needs to save this)\n   - IP whitelist configuration\n4. Provide configuration examples:\n   - Asterisk: sip.conf format\n   - 3CX: SIP trunk settings\n   - FreeSWITCH: Gateway configuration\n   - Generic: Standard SIP client settings\n5. Next steps:\n   - Assign phone numbers to trunk\n   - Configure call routing\n   - Test connectivity\n\nDocumentation: wavix://api/sip-trunking/guides\n\n⚠️ Important:\n- Save SIP credentials securely (password is shown only once)\n- Configure IP whitelist in your firewall if specified\n- Test trunk connectivity before assigning numbers`
              }
            }
          ]
        })

      // Number Validation
      case "validate_phone_number":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Validate and lookup information for phone number: ${args?.phone_number}\n\nExample: Validate +15551234567 or +442071234567\n\nUse validation_create tool to get:\n- Number validity and format (valid/invalid, E.164 format)\n- Number type (mobile, landline, toll-free, VoIP)\n- Country and region\n- Carrier/operator name\n- Reachability status (reachable, unreachable, unknown)\n- Roaming information (if applicable)\n- Line type (fixed, mobile, premium)\n\nDocumentation: wavix://api/validation/validate\n\nProvide recommendations based on the results:\n- For mobile numbers: Best for SMS and voice calls\n- For landline numbers: Use voice calls (SMS may not be supported)\n- For toll-free: Good for customer service, may have restrictions\n- For invalid numbers: Suggest correct format or alternative\n- For unreachable numbers: May be disconnected or invalid\n\nIf number is invalid, suggest:\n- Correct E.164 format\n- Adding country code if missing\n- Removing invalid characters`
              }
            }
          ]
        })

      // Complex Workflows
      case "setup_new_campaign":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Set up a complete ${args?.campaign_type} messaging campaign for ${args?.country}.\n\nExecute these steps:\n1. Search for available SMS-enabled numbers in ${args?.country}\n2. Purchase a suitable number (check balance first)\n3. Register a sender ID appropriate for ${args?.campaign_type}\n${args?.country === "US" ? "4. Set up 10DLC brand and campaign (required for US)\n5. Associate number with campaign\n" : ""}${args?.test_number ? `6. Send test SMS to ${args.test_number}\n` : ""}7. Provide campaign configuration summary\n8. Share best practices for ${args?.campaign_type} campaigns\n\nReport progress and any issues at each step.`
              }
            }
          ]
        })

      case "troubleshoot_delivery":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Comprehensive troubleshooting for ${args?.type?.toUpperCase()} delivery issues (ID: ${args?.id}).\n\nAnalyze the problem:\n1. Get detailed record (${args?.type === "voice" ? "cdr_get" : "sms_get"})\n2. Check status and error codes\n3. Review delivery timeline\n4. Identify root cause:\n   ${args?.type === "sms" || args?.type === "mms" ? "- Sender ID registration and allowlisting\n   - Destination number validity and carrier support\n   - Message content (spam filters, URL shorteners)\n   - 10DLC compliance (for US traffic)\n   - Rate limits and daily quotas\n   " : "- Call routing configuration\n   - Destination number format\n   - Codec compatibility\n   - Network connectivity\n   "}5. Provide specific solutions based on the issue\n6. Suggest preventive measures\n\nUse documentation at wavix://api/messaging/troubleshooting and error-specific docs.`
              }
            }
          ]
        })

      // Integration & Code Generation
      case "wavix-integrate":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Generate production-ready ${args?.language} code${args?.framework ? ` using ${args.framework} framework` : ""} to integrate Wavix ${args?.feature} API.

Requirements:
1. Use environment variables for API key (WAVIX_API_KEY)
2. Include proper error handling with try/catch blocks
3. Add input validation (E.164 format for phone numbers, required fields)
4. Include complete usage example
5. Add inline comments explaining the code
6. Use fetch or native HTTP client (not axios unless specifically requested)
7. Follow best practices for the chosen language/framework

API Reference:
- Base URL: https://api.wavix.com/v3
- Authentication: Query parameter "appid" with API key
- Documentation: wavix://api/api-reference/getting-started
- Feature docs: wavix://api/${getFeatureDocPath(args?.feature)}

Please generate:
1. Main integration class/module with all necessary methods
2. Complete example usage code showing how to use the integration
3. Environment setup instructions (.env file format)
4. Installation commands (npm/pip/composer/go get)

For ${args?.feature} feature, include:
${getFeatureRequirements(args?.feature)}

Make sure the code is production-ready and follows security best practices.`
              }
            }
          ]
        })

      case "wavix-webhook-setup":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Generate webhook handler code for Wavix events in ${args?.language}${args?.framework ? ` using ${args.framework} framework` : ""}.

Events to handle: ${args?.events || "message.received, message.delivered, call.completed, call.recording.ready"}

Requirements:
1. Create webhook endpoint handler
2. Verify webhook signature (X-Wavix-Signature header) using HMAC SHA256
3. Parse incoming JSON payload
4. Route events to appropriate handlers
5. Return 200 OK response quickly (process async if needed)
6. Include error handling and logging
7. Use environment variable for webhook secret (WAVIX_WEBHOOK_SECRET)

Webhook Documentation: wavix://api/messaging/webhooks

Generate:
1. Webhook controller/handler class
2. Event routing logic
3. Individual event handlers (stub implementations)
4. Signature verification function
5. Route registration example
6. Environment configuration example

Make the code production-ready with proper error handling and logging.`
              }
            }
          ]
        })

      case "wavix-quickstart":
        return Promise.resolve({
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `Generate a quickstart code example in ${args?.language} to ${getQuickstartAction(args?.action)}.

This should be a simple, complete, runnable example that:
1. Uses environment variable for API key (WAVIX_API_KEY)
2. Includes all necessary imports/dependencies
3. Has minimal code - just what's needed to get started
4. Includes clear comments
5. Shows how to handle success and errors
6. Can be run immediately after setting API key

API Details:
- Base URL: https://api.wavix.com/v3
- Authentication: Add ?appid=YOUR_API_KEY to requests
- Documentation: wavix://api/${getQuickstartDocPath(args?.action)}

Generate:
1. Complete runnable code file
2. .env.example file
3. Installation instructions
4. How to run the example

Keep it simple and focused - this is for first-time users to get started quickly.`
              }
            }
          ]
        })

      default:
        return Promise.reject(new Error(`Unknown prompt: ${name}`))
    }
  })
}

function getFeatureDocPath(feature: string | undefined): string {
  const paths: Record<string, string> = {
    sms: "messaging/send-sms",
    calls: "voice/make-call",
    "2fa": "messaging/2fa",
    webhooks: "messaging/webhooks",
    cdr: "voice/cdr"
  }
  return paths[feature?.toLowerCase() || ""] || "api-reference/getting-started"
}

function getFeatureRequirements(feature: string | undefined): string {
  const requirements: Record<string, string> = {
    sms: "- sendSms method with to, message, from parameters\n- getStatus method to check delivery status\n- E.164 phone number validation\n- Support for both SMS and MMS",
    calls:
      "- makeCall method with to, from parameters\n- Support for call actions (play audio, connect to SIP)\n- getCallStatus method\n- Error handling for call failures",
    "2fa":
      "- startVerification method (phone, channel)\n- verifyCode method (session_id, code)\n- getSessionStatus method\n- Support for both SMS and voice channels",
    webhooks:
      "- Webhook endpoint handler\n- Signature verification\n- Event routing (message.received, message.delivered, call.completed)\n- Async processing support",
    cdr: "- getCdrList method with date filters\n- getCdrDetails method\n- Support for pagination\n- Filter by call type, status"
  }
  return (
    requirements[feature?.toLowerCase() || ""] ||
    "- Complete API client with all methods\n- Error handling\n- Input validation"
  )
}

function getQuickstartAction(action: string | undefined): string {
  const actions: Record<string, string> = {
    sms: "send your first SMS message",
    call: "make your first call",
    "2fa": "send your first 2FA verification code"
  }
  return actions[action?.toLowerCase() || ""] || "get started with Wavix API"
}

function getQuickstartDocPath(action: string | undefined): string {
  const paths: Record<string, string> = {
    sms: "messaging/send-sms",
    call: "voice/make-call",
    "2fa": "messaging/2fa"
  }
  return paths[action?.toLowerCase() || ""] || "api-reference/getting-started"
}
