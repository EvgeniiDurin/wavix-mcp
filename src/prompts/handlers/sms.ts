/**
 * SMS/MMS Prompt Handlers
 *
 * Enhanced handlers with context, warnings, and guidance
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const smsHandlers: PromptHandlerMap = {
  send_sms: args => {
    const to = args?.to || "[destination]"
    const message = args?.message || "[message]"
    const from = args?.from

    const isUS = String(to).startsWith("+1") || String(to).startsWith("1")

    let content = `## Send SMS Message

**To:** ${to}
${from ? `**From:** ${from}` : "**From:** Will auto-select available sender"}
**Message:** "${message}"

`

    if (isUS) {
      content += `### ⚠️ US SMS Requirements (10DLC)

Sending to US numbers requires 10DLC registration:
1. **Brand** - Register your business (1-7 days for verification)
2. **Campaign** - Register your use case (1-5 days for approval)
3. **Number linked** - Your sending number must be attached to the campaign

**Quick check:** Use \`quick_check\` with feature="sms_us" to verify you're ready.

**Need setup?** Use \`get_recipe\` with recipe="sms_campaign_us" for step-by-step guide.

`
    }

    content += `### Send the Message

**Option 1 - Simple (recommended):**
\`\`\`
send_message to="${to}" text="${message}"${from ? ` from="${from}"` : ""}
\`\`\`

**Option 2 - Direct API:**
\`\`\`
sms action="send" from="YOUR_NUMBER" to="${to}" message_body={"text": "${message}"}
\`\`\`

### Common Issues
- **Error 33:** 10DLC campaign not active or content mismatch
- **Error 5:** Sender ID not approved for destination country
- **Error 22:** Sender ID not found on account
- **Error 9:** Recipient opted out (replied STOP)

Use \`troubleshoot\` with the error code for help.`

    return createTextPrompt(content)
  },

  send_mms: args => {
    const to = args?.to || "[destination]"
    const message = args?.message || "[message]"
    const mediaUrls = args?.media_urls || "[media URLs]"
    const from = args?.from

    return createTextPrompt(`## Send MMS Message

**To:** ${to}
${from ? `**From:** ${from}` : "**From:** Will auto-select"}
**Message:** "${message}"
**Media:** ${mediaUrls}

### ⚠️ MMS Limitations
- **Only US & Canada** - MMS is not available for other countries
- **Max 5 media files** per message
- **Supported formats:** JPEG, PNG, GIF, MP4, MP3
- **Size limits:** Check Wavix documentation for current limits

### Send the Message

**Simple:**
\`\`\`
send_message to="${to}" text="${message}" media=["${mediaUrls}"]
\`\`\`

**Direct API:**
\`\`\`
sms action="send" from="YOUR_NUMBER" to="${to}" message_body={"text": "${message}", "media": ["${mediaUrls}"]}
\`\`\`

### For International Recipients
If your recipient is outside US/Canada, send a regular SMS with a link to the media instead.`)
  },

  check_sms_status: args => {
    const messageId = args?.message_id || "[message_id]"

    return createTextPrompt(`## Check SMS Delivery Status

**Message ID:** ${messageId}

### Check Status
\`\`\`
sms action="get" id="${messageId}"
\`\`\`

### Status Meanings
| Status | Description |
|--------|-------------|
| \`accepted\` | Received by Wavix, queued for sending |
| \`pending\` | Being processed |
| \`sent\` | Sent to carrier network |
| \`delivered\` | Confirmed delivered to device |
| \`undelivered\` | Failed - check error_code |
| \`expired\` | Validity period expired |

### If Undelivered
Look at the \`error_code\` field and use:
\`\`\`
troubleshoot error_code="[error_code]"
\`\`\`

### Track All Messages
To set up automatic delivery reports, configure webhook:
\`\`\`
profile action="update" dlr_relay_url="https://your-server.com/webhooks/sms-delivery"
\`\`\``)
  },

  list_recent_sms: args => {
    const days = args?.days || 7
    const direction = args?.direction || "all"

    return createTextPrompt(`## List Recent SMS Messages

**Period:** Last ${days} days
**Direction:** ${direction}

### Query Messages
\`\`\`
sms action="list" type="${direction === "all" ? "outbound" : direction}" sent_after="YYYY-MM-DD" sent_before="YYYY-MM-DD"
\`\`\`

### Filter Options
- \`type\`: "inbound" or "outbound"
- \`status\`: "delivered", "undelivered", "pending", etc.
- \`from\`: Filter by sender
- \`to\`: Filter by recipient

### Analyze Results
The response includes:
- Total messages sent/received
- Delivery success rate
- Costs per message
- Error breakdown

### Export for Analysis
For large volumes, use:
\`\`\`
sms action="list_all" type="outbound" sent_after="YYYY-MM-DD"
\`\`\`
Returns NDJSON format for streaming.`)
  },

  setup_sender_id: args => {
    const senderId = args?.sender_id || "[sender_id]"
    const countries = args?.countries || "US"
    const type = args?.type || "numeric"

    const isUS = String(countries).includes("US")

    let content = `## Register Sender ID

**Sender ID:** ${senderId}
**Type:** ${type}
**Countries:** ${countries}

`

    if (isUS) {
      content += `### ⚠️ US Sender ID Requirements

For US messaging, you need:
1. **10DLC Brand** - Registered and verified
2. **10DLC Campaign** - Active and approved
3. **Number** - Linked to the campaign

The sender ID for US must be a phone number (numeric), not alphanumeric.

**Check your readiness:**
\`\`\`
quick_check feature="sms_us"
\`\`\`

`
    }

    content += `### Register the Sender ID
\`\`\`
sms_sender_ids action="create" sender_id="${senderId}" type="${type}" countries=["${countries}"] usecase="transactional"
\`\`\`

**Note:** The \`usecase\` parameter may be required depending on the country. If registration fails, check the error message and ask the user for the correct use case if needed.

### Sender ID Types
- **Numeric:** Uses phone number, can receive replies
- **Alphanumeric:** 3-11 characters (e.g., "MyBrand"), no replies

### After Registration
Some countries require manual approval. Check status:
\`\`\`
sms_sender_ids action="list"
\`\`\``

    return createTextPrompt(content)
  },

  list_sender_ids: () =>
    createTextPrompt(`## List Sender IDs

### Query All Sender IDs
\`\`\`
sms_sender_ids action="list"
\`\`\`

### Response Includes
- Sender ID name/number
- Type (numeric/alphanumeric)
- Approved countries
- Status (active/pending/rejected)
- Use case

### Check Specific Sender ID
\`\`\`
sms_sender_ids action="get" id="[sender_id_uuid]"
\`\`\`

### Need a New Sender ID?
Use the \`setup_sender_id\` prompt or:
\`\`\`
sms_sender_ids action="create" sender_id="YourBrand" type="alphanumeric" countries=["GB","DE"] usecase="transactional"
\`\`\``),

  delete_sender_id: args => {
    const senderId = args?.sender_id || "[sender_id]"

    return createTextPrompt(`## Delete Sender ID

**Sender ID:** ${senderId}

### ⚠️ Warning
Deleting a sender ID will:
- Cause future messages with this sender to fail
- Not affect already sent messages
- Be irreversible

### Delete the Sender ID
\`\`\`
sms_sender_ids action="delete" id="${senderId}"
\`\`\`

### Before Deleting
1. Ensure no active campaigns use this sender
2. Update any applications using this sender
3. Consider deactivating instead if temporary`)
  },

  troubleshoot_sms: args => {
    const messageId = args?.message_id || "[message_id]"

    return createTextPrompt(`## Troubleshoot SMS Delivery

**Message ID:** ${messageId}

### Step 1: Check Message Status
\`\`\`
sms action="get" id="${messageId}"
\`\`\`

Look for:
- \`status\`: Should be "delivered"
- \`error_code\`: If status is "undelivered"
- \`segments\`: Number of message parts
- \`cost\`: Billing amount

### Step 2: Diagnose Error (if any)
\`\`\`
troubleshoot error_code="[error_code_from_step_1]" message_id="${messageId}"
\`\`\`

### Common Issues & Quick Fixes

| Error | Issue | Fix |
|-------|-------|-----|
| 33 | 10DLC not active | Wait for campaign approval |
| 5 | Sender not approved | Register sender for country |
| 9 | Recipient opted out | Remove from list |
| 22 | Sender not found | Check sender ID exists |
| 31 | No credits | Top up account |

### Step 3: Check Prerequisites
\`\`\`
quick_check feature="sms_us"
\`\`\`

### Still Having Issues?
Provide the error details and I'll help diagnose further.`)
  }
}
