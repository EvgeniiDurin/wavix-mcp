/**
 * Prompt Helper Functions
 *
 * Utility functions for generating prompt content
 */

export function getFeatureDocPath(feature: string | undefined): string {
  const paths: Record<string, string> = {
    sms: "messaging/send-sms",
    calls: "voice/make-call",
    "2fa": "messaging/2fa",
    webhooks: "messaging/webhooks",
    cdr: "voice/cdr"
  }
  return paths[feature?.toLowerCase() || ""] || "api-reference/getting-started"
}

export function getFeatureRequirements(feature: string | undefined): string {
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

export function getQuickstartAction(action: string | undefined): string {
  const actions: Record<string, string> = {
    sms: "send your first SMS message",
    call: "make your first call",
    "2fa": "send your first 2FA verification code"
  }
  return actions[action?.toLowerCase() || ""] || "get started with Wavix API"
}

export function getQuickstartDocPath(action: string | undefined): string {
  const paths: Record<string, string> = {
    sms: "messaging/send-sms",
    call: "voice/make-call",
    "2fa": "messaging/2fa"
  }
  return paths[action?.toLowerCase() || ""] || "api-reference/getting-started"
}

export function getQuickstartSpecificInstructions(action: string | undefined): string {
  const actionLower = action?.toLowerCase() || ""

  if (actionLower === "sms") {
    return `## SMS Quickstart Instructions

**API Endpoint:**
POST https://api.wavix.com/v3/messages?appid={WAVIX_API_KEY}

**Request Body:**
\`\`\`json
{
  "from": "YourSenderID",
  "to": "+15551234567",
  "message_body": {
    "text": "Hello from Wavix!"
  }
}
\`\`\`

**Required Fields:**
- \`from\`: Sender ID (must be registered on your account, or use your Wavix phone number)
- \`to\`: Destination phone number in E.164 format (e.g., +15551234567)
- \`message_body.text\`: Message text (max 1600 characters)

**Response (201 Created):**
\`\`\`json
{
  "message_id": "871b4eeb-f798-4105-be23-32df9e991456",
  "status": "accepted",
  "to": "+15551234567",
  "from": "YourSenderID",
  "charge": "0.02",
  "submitted_at": "2024-01-01T12:00:00.000Z"
}
\`\`\`

**Example Code Structure:**
1. Load WAVIX_API_KEY from environment
2. Validate phone number is in E.164 format
3. Make POST request to /v3/messages endpoint
4. Handle response: show message_id and status
5. Handle errors: show error message and status code

**Common Errors:**
- 401: Invalid API key
- 400: Invalid phone number format or missing required fields
- 402: Insufficient balance

**Testing:**
Use a real phone number you control to test. Replace "YourSenderID" with a registered sender ID or your Wavix phone number.`
  }

  if (actionLower === "call") {
    return `## Call Quickstart Instructions

**API Endpoint:**
POST https://api.wavix.com/v1/call?appid={WAVIX_API_KEY}

**Request Body:**
\`\`\`json
{
  "from": "+15551234567",
  "to": "+15559876543",
  "action": {
    "type": "play",
    "media": "https://example.com/audio.mp3"
  }
}
\`\`\`

**Required Fields:**
- \`from\`: Your Wavix phone number (must be active on your account)
- \`to\`: Destination phone number in E.164 format
- \`action\`: What to do when call is answered (play audio, connect to SIP, etc.)

**Simple Action (Play Audio):**
\`\`\`json
{
  "action": {
    "type": "play",
    "media": "https://example.com/audio.mp3"
  }
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "call_uuid": "abc123-def456-ghi789",
  "status": "ringing",
  "from": "+15551234567",
  "to": "+15559876543"
}
\`\`\`

**Example Code Structure:**
1. Load WAVIX_API_KEY from environment
2. Validate both phone numbers are in E.164 format
3. Make POST request to /v1/call endpoint
4. Handle response: show call_uuid and status
5. Handle errors: show error message

**Common Errors:**
- 401: Invalid API key
- 400: Invalid phone number or action format
- 402: Insufficient balance
- 404: From number not found on account

**Testing:**
Use real phone numbers. The "from" number must be a Wavix number on your account. For testing, you can use a simple action like playing a greeting.`
  }

  if (actionLower === "2fa") {
    return `## 2FA Quickstart Instructions

**API Endpoint:**
POST https://api.wavix.com/v1/two-fa/verification?appid={WAVIX_API_KEY}

**Request Body:**
\`\`\`json
{
  "service_id": "your-2fa-service-id",
  "to": "+15551234567",
  "channel": "sms"
}
\`\`\`

**Required Fields:**
- \`service_id\`: Your 2FA Service ID (get from Wavix dashboard)
- \`to\`: Phone number in E.164 format to send code to
- \`channel\`: "sms" or "voice"

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "session_id": "5f1a8680201511eeafdfcfc3dedfac51",
  "destination": "+15551234567",
  "created_at": "2024-01-01T12:00:00.000Z"
}
\`\`\`

**Example Code Structure:**
1. Load WAVIX_API_KEY and 2FA_SERVICE_ID from environment
2. Validate phone number is in E.164 format
3. Make POST request to /v1/two-fa/verification endpoint
4. Handle response: show session_id (needed for verification)
5. Handle errors: show error message

**Common Errors:**
- 401: Invalid API key
- 400: Invalid service_id or phone number
- 404: Service ID not found

**Next Steps:**
After sending code, use session_id to verify the code:
POST https://api.wavix.com/v1/two-fa/verification/{session_id}/check

**Testing:**
You need a 2FA Service ID from Wavix dashboard. Use a real phone number you control to receive the code.`
  }

  return `## General Instructions

Use the Wavix API to ${getQuickstartAction(action)}.

**API Base URL:** https://api.wavix.com (version varies: /v1 for voice/numbers, /v3 for SMS/10DLC, /v2 for WebRTC)
**Authentication:** Add ?appid={WAVIX_API_KEY} to all requests
**Documentation:** wavix://api/${getQuickstartDocPath(action)}

Generate a simple, working example that demonstrates the basic API call.`
}
