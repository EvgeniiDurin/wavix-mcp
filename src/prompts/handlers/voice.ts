/**
 * Voice/Call Prompt Handlers
 *
 * Enhanced handlers with context, warnings, and guidance
 */

import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const voiceHandlers: PromptHandlerMap = {
  make_call: args => {
    const from = args?.from || "[your_number]"
    const to = args?.to || "[destination]"
    const action = args?.action

    return createTextPrompt(`## Make Outbound Call

**From:** ${from}
**To:** ${to}
${action ? `**Action:** ${action}` : ""}

### Prerequisites
Before making calls, ensure you have:
1. **SIP Trunk** - For voice connectivity
2. **Phone Number** - As your caller ID
3. **Sufficient Balance** - Calls are billed per minute

**Check readiness:**
\`\`\`
quick_check feature="voice_calls"
\`\`\`

### Start the Call
\`\`\`
calls action="create" from="${from}" to="${to}"
\`\`\`

### Optional Parameters
- \`status_callback\`: URL for call status webhooks
- \`call_recording\`: true/false - Record the call
- \`machine_detection\`: true/false - Detect voicemail
- \`max_duration\`: Maximum call length in seconds

### After Call Connects
You can:
- Play audio: \`calls action="play" uuid="[call_id]" audio_file="[url]"\`
- Collect DTMF: \`calls action="collect_dtmf" uuid="[call_id]"\`
- Start streaming: \`calls action="stream_start" uuid="[call_id]" stream_url="[ws_url]"\`

### For Voice AI Integration
Use \`get_recipe\` with recipe="voice_ai_livekit" for AI agent setup.`)
  },

  get_call_logs: args => {
    const days = args?.days || 7
    const type = args?.type || "all"

    const today = new Date().toISOString().split("T")[0]
    const fromDate = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    return createTextPrompt(`## Get Call Detail Records (CDRs)

**Period:** Last ${days} days
**Type:** ${type}

### Query CDRs
\`\`\`
cdrs action="list" from="${fromDate}" to="${today}" type="${type === "all" ? "placed" : type}"
\`\`\`

### Filter Options
- \`type\`: "placed" (outbound) or "received" (inbound)
- \`disposition\`: "answered", "noanswer", "busy", "failed", "all"
- \`from_search\`: Filter by caller number
- \`to_search\`: Filter by destination number
- \`sip_trunk\`: Filter by SIP trunk

### Response Includes
- Call UUID
- Direction (inbound/outbound)
- Duration
- Disposition (answered, noanswer, etc.)
- Cost
- Recording availability
- Transcription status

### Get Specific Call Details
\`\`\`
cdrs action="get" uuid="[call_uuid]"
\`\`\`

### Export All CDRs
For large datasets:
\`\`\`
cdrs action="list_all" from="${fromDate}" to="${today}" type="placed"
\`\`\`
Returns NDJSON format.`)
  },

  get_call_recording: args => {
    const cdrUuid = args?.cdr_uuid || "[cdr_uuid]"

    return createTextPrompt(`## Get Call Recording

**Call UUID:** ${cdrUuid}

### Get Recording
\`\`\`
recordings action="get" cdr_uuid="${cdrUuid}"
\`\`\`

### Response Includes
- Recording URL (time-limited signed URL)
- Duration
- File size
- Format (usually MP3 or WAV)

### Enable Recording for Future Calls
On SIP trunk:
\`\`\`
sip_trunks action="update" id=[trunk_id] call_recording_enabled=true
\`\`\`

Or per-call:
\`\`\`
calls action="create" from="..." to="..." call_recording=true
\`\`\`

### List All Recordings
\`\`\`
recordings action="list" from_date="YYYY-MM-DD" to_date="YYYY-MM-DD"
\`\`\`

### Delete Recording
\`\`\`
recordings action="delete" id=[recording_id]
\`\`\``)
  },

  get_call_transcription: args => {
    const cdrUuid = args?.cdr_uuid || "[cdr_uuid]"

    return createTextPrompt(`## Get Call Transcription

**Call UUID:** ${cdrUuid}

### Get Transcription
\`\`\`
cdrs action="transcription" cdr_uuid="${cdrUuid}"
\`\`\`

### Response Format
- Speaker-separated turns
- Timestamps for each segment
- Full text transcript
- Confidence scores (if available)

### If Not Transcribed
Request transcription:
\`\`\`
cdrs action="retranscribe" cdr_uuid="${cdrUuid}"
\`\`\`

### Enable Auto-Transcription
On SIP trunk:
\`\`\`
sip_trunks action="update" id=[trunk_id] transcription_enabled=true transcription_threshold=30
\`\`\`

\`transcription_threshold\`: Minimum call duration (seconds) for auto-transcription.

### Note
Transcription is available for **Flex Pro** customers only.`)
  },

  list_active_calls: () =>
    createTextPrompt(`## List Active Calls

### Query Active Calls
\`\`\`
calls action="list"
\`\`\`

### Response Includes
- Call UUID
- From/To numbers
- Current status (ringing, answered, etc.)
- Duration so far
- Direction

### Manage Active Calls
**End a call:**
\`\`\`
calls action="hangup" uuid="[call_uuid]"
\`\`\`

**Play audio:**
\`\`\`
calls action="play" uuid="[call_uuid]" audio_file="https://example.com/audio.mp3"
\`\`\`

**Start streaming:**
\`\`\`
calls action="stream_start" uuid="[call_uuid]" stream_url="wss://your-server.com/stream" stream_type="twoway"
\`\`\``),

  end_call: args => {
    const callUuid = args?.call_uuid || "[call_uuid]"

    return createTextPrompt(`## End Active Call

**Call UUID:** ${callUuid}

### Hang Up the Call
\`\`\`
calls action="hangup" uuid="${callUuid}"
\`\`\`

### After Hangup
- Call will be terminated immediately
- CDR will be generated within a few seconds
- Recording (if enabled) will be available shortly

### Get Call Details After
\`\`\`
cdrs action="get" uuid="${callUuid}"
\`\`\``)
  }
}
