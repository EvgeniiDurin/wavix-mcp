/**
 * Prompt Definitions
 *
 * All available prompts with their arguments
 */

import type { Prompt } from "@modelcontextprotocol/sdk/types.js"

export const smsPrompts: Array<Prompt> = [
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
    name: "list_sender_ids",
    description: "List all registered sender IDs on your account",
    arguments: []
  },
  {
    name: "delete_sender_id",
    description: "Delete a sender ID from your account",
    arguments: [{ name: "sender_id", description: "Sender ID to delete", required: true }]
  },
  {
    name: "troubleshoot_sms",
    description: "Diagnose SMS delivery issues and suggest solutions",
    arguments: [{ name: "message_id", description: "Message ID with delivery issues", required: true }]
  }
]

export const voicePrompts: Array<Prompt> = [
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
  {
    name: "get_call_transcription",
    description: "Get transcription for a recorded call",
    arguments: [{ name: "cdr_uuid", description: "Call Detail Record UUID", required: true }]
  },
  {
    name: "list_active_calls",
    description: "List all currently active calls on your account",
    arguments: []
  },
  {
    name: "end_call",
    description: "End an active call",
    arguments: [{ name: "call_uuid", description: "Active call UUID", required: true }]
  }
]

export const numbersPrompts: Array<Prompt> = [
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
    name: "get_number_details",
    description: "Get detailed information about a specific phone number",
    arguments: [{ name: "number_id", description: "Phone number ID", required: true }]
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
  }
]

export const twofaPrompts: Array<Prompt> = [
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
  {
    name: "cancel_2fa",
    description: "Cancel an active 2FA verification session",
    arguments: [{ name: "session_id", description: "2FA session ID to cancel", required: true }]
  }
]

export const tenDlcPrompts: Array<Prompt> = [
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
  {
    name: "update_10dlc_brand",
    description: "Update details of a registered 10DLC brand",
    arguments: [
      { name: "brand_id", description: "Brand ID to update", required: true },
      { name: "company_name", description: "Updated company name (optional)", required: false },
      { name: "website", description: "Updated website URL (optional)", required: false }
    ]
  },
  {
    name: "update_10dlc_campaign",
    description: "Update a 10DLC campaign",
    arguments: [
      { name: "brand_id", description: "Brand ID", required: true },
      { name: "campaign_id", description: "Campaign ID to update", required: true },
      { name: "description", description: "Updated campaign description (optional)", required: false },
      { name: "sample_messages", description: "Updated sample messages (optional)", required: false }
    ]
  },
  {
    name: "attach_number_to_campaign",
    description: "Link a phone number to a 10DLC campaign",
    arguments: [
      { name: "brand_id", description: "Brand ID", required: true },
      { name: "campaign_id", description: "Campaign ID", required: true },
      { name: "number", description: "Phone number in E.164 format to attach", required: true }
    ]
  },
  {
    name: "detach_number_from_campaign",
    description: "Remove a phone number from a 10DLC campaign",
    arguments: [
      { name: "brand_id", description: "Brand ID", required: true },
      { name: "campaign_id", description: "Campaign ID", required: true },
      { name: "number", description: "Phone number to remove", required: true }
    ]
  },
  {
    name: "list_campaign_numbers",
    description: "List all phone numbers associated with a 10DLC campaign",
    arguments: [
      { name: "brand_id", description: "Brand ID", required: true },
      { name: "campaign_id", description: "Campaign ID", required: true }
    ]
  },
  {
    name: "list_10dlc_brands",
    description: "List all 10DLC brands on your account",
    arguments: []
  },
  {
    name: "list_10dlc_campaigns",
    description: "List all 10DLC campaigns for a brand or account",
    arguments: [{ name: "brand_id", description: "Brand ID to filter by (optional)", required: false }]
  },
  {
    name: "delete_10dlc_brand",
    description: "Delete a 10DLC brand (campaigns must be deleted first)",
    arguments: [{ name: "brand_id", description: "Brand ID to delete", required: true }]
  },
  {
    name: "delete_10dlc_campaign",
    description: "Delete a 10DLC campaign",
    arguments: [
      { name: "brand_id", description: "Brand ID", required: true },
      { name: "campaign_id", description: "Campaign ID to delete", required: true }
    ]
  }
]

export const billingPrompts: Array<Prompt> = [
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
  }
]

export const sipPrompts: Array<Prompt> = [
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
  {
    name: "get_sip_trunk",
    description: "Get detailed information about a specific SIP trunk",
    arguments: [{ name: "trunk_id", description: "SIP trunk ID", required: true }]
  },
  {
    name: "update_sip_trunk",
    description: "Update an existing SIP trunk configuration",
    arguments: [
      { name: "trunk_id", description: "SIP trunk ID", required: true },
      { name: "name", description: "Updated SIP trunk name (optional)", required: false },
      { name: "ip_whitelist", description: "Updated IP whitelist (optional)", required: false }
    ]
  },
  {
    name: "delete_sip_trunk",
    description: "Delete a SIP trunk from your account",
    arguments: [{ name: "trunk_id", description: "SIP trunk ID to delete", required: true }]
  }
]

export const validationPrompts: Array<Prompt> = [
  {
    name: "validate_phone_number",
    description: "Validate and get information about a phone number",
    arguments: [{ name: "phone_number", description: "Phone number to validate in E.164 format", required: true }]
  }
]

export const workflowPrompts: Array<Prompt> = [
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
  }
]

export const integrationPrompts: Array<Prompt> = [
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
        description: "Comma-separated list of events to handle (message.received, message.delivered, call.completed)",
        required: false
      }
    ]
  },
  {
    name: "wavix-quickstart",
    description: "Generate quickstart code for common Wavix API operations",
    arguments: [
      {
        name: "language",
        description: "Programming language (node, python, php, go, java, csharp)",
        required: true
      },
      {
        name: "action",
        description:
          "Action to perform: sms (send SMS), mms (send MMS with media), call (make call), 2fa (send verification code), validation (validate phone number), numbers (list your numbers), webhook (setup webhooks), balance (check balance)",
        required: true
      }
    ]
  }
]

export const allPrompts: Array<Prompt> = [
  ...smsPrompts,
  ...voicePrompts,
  ...numbersPrompts,
  ...twofaPrompts,
  ...tenDlcPrompts,
  ...billingPrompts,
  ...sipPrompts,
  ...validationPrompts,
  ...workflowPrompts,
  ...integrationPrompts
]
