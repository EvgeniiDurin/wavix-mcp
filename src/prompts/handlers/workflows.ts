/**
 * Workflow Prompt Handlers
 *
 * Enhanced handlers for complex multi-step workflows
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const workflowHandlers: PromptHandlerMap = {
  setup_new_campaign: args => {
    const country = args?.country || "US"
    const campaignType = args?.campaign_type || "transactional"
    const testNumber = args?.test_number

    const isUS = String(country).toUpperCase() === "US"

    let content = `## Set Up New ${campaignType.charAt(0).toUpperCase() + String(campaignType).slice(1)} Campaign

**Target Country:** ${country}
**Campaign Type:** ${campaignType}
${testNumber ? `**Test Number:** ${testNumber}` : ""}

`

    if (isUS) {
      content += `### US Campaign Setup (10DLC Required)

Setting up SMS messaging in the US requires 10DLC registration. This typically takes **1-2 weeks** for approvals.

**Recommended approach:** Use the step-by-step recipe:
\`\`\`
get_recipe recipe="sms_campaign_us"
\`\`\`

### Quick Overview
1. **Register 10DLC Brand** (1-7 days wait)
   - Your business information
   - Tax ID (EIN)
   - Contact details

2. **Create 10DLC Campaign** (1-5 days wait)
   - Use case description
   - Sample messages
   - Opt-in/opt-out flows

3. **Purchase Phone Number**
   - SMS-enabled US number
   - Local area code recommended

4. **Register Sender ID**
   - Link number to campaign

5. **Send Test Message**

### Check Your Current Status
\`\`\`
quick_check feature="sms_us"
\`\`\`

`
    } else {
      content += `### International Campaign Setup

For countries outside the US, setup is typically faster.

**Recommended approach:**
\`\`\`
get_recipe recipe="international_sms"
\`\`\`

### Steps
1. **Register Sender ID** for ${country}
   - Alphanumeric or numeric depending on country
   - Some countries require pre-approval

2. **Check Country Requirements**
   - Visit wavix.com/coverage for ${country} specifics

3. **Send Test Message**

\`\`\`
quick_check feature="sms_international"
\`\`\`

`
    }

    if (testNumber) {
      content += `### Test After Setup
Once approved, test with:
\`\`\`
send_message to="${testNumber}" text="Test message from new campaign!"
\`\`\`
`
    }

    return createTextPrompt(content)
  },

  troubleshoot_delivery: args => {
    const type = args?.type || "sms"
    const id = args?.id || "[message_id or call_uuid]"

    const isSms = String(type).toLowerCase() === "sms" || String(type).toLowerCase() === "mms"

    let content = `## Troubleshoot ${type.toUpperCase()} Delivery

**ID:** ${id}

### Step 1: Get Status Details

`

    if (isSms) {
      content += `\`\`\`
sms action="get" id="${id}"
\`\`\`

**Look for:**
- \`status\`: "delivered" is success, "undelivered" is failure
- \`error_code\`: The reason for failure
- \`segments\`: Number of message parts
- \`cost\`: Amount charged

### Step 2: Diagnose Error
If you have an error code:
\`\`\`
troubleshoot error_code="[error_code]" message_id="${id}"
\`\`\`

### Common SMS Issues

| Error | Issue | Quick Fix |
|-------|-------|-----------|
| 33 | 10DLC not active | Wait for campaign approval |
| 5 | Sender not registered | Add country to sender ID |
| 9 | Recipient opted out | Remove from list |
| 22 | Sender not found | Check sender ID exists |
| 31 | No credits | Top up balance |
| 37 | AT&T spam filter | Remove URLs or change content |
| 43 | Verizon content filter | Review content policy |

### Step 3: Check Prerequisites
\`\`\`
quick_check feature="sms_us"
\`\`\`

`
    } else {
      content += `\`\`\`
cdrs action="get" uuid="${id}"
\`\`\`

**Look for:**
- \`disposition\`: "answered", "noanswer", "busy", "failed"
- \`duration\`: Call length in seconds
- \`hangup_cause\`: Technical reason for ending

### Common Call Issues

| Disposition | Issue | Solution |
|-------------|-------|----------|
| noanswer | No pickup | Try different time or leave voicemail |
| busy | Line busy | Retry later |
| failed | Connection error | Check number validity |

### Step 3: Check SIP Configuration
\`\`\`
sip_trunks action="list"
\`\`\`

Verify trunk settings and IP authentication.

`
    }

    content += `### Still Having Issues?
Use the unified troubleshooter:
\`\`\`
troubleshoot ${isSms ? `message_id="${id}"` : `call_uuid="${id}"`} description="[describe the problem]"
\`\`\``

    return createTextPrompt(content)
  }
}
