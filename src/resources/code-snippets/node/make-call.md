# Make Call - Node.js

## Quick Start

```javascript
const WAVIX_API_KEY = process.env.WAVIX_API_KEY
const WAVIX_API_URL = process.env.WAVIX_API_URL || "https://api.wavix.com"

async function makeCall(from, to, options = {}) {
  const url = `${WAVIX_API_URL}/v2/calls?appid=${WAVIX_API_KEY}`

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      ...options
    })
  })

  return response.json()
}

// Usage
const call = await makeCall("+15551234567", "+14155551234", {
  call_recording: true,
  max_duration: 300,
  status_callback: "https://your-server.com/call-status"
})
console.log("Call UUID:", call.uuid)
```

## Full Example with Call Control

```javascript
class WavixCalls {
  constructor(apiKey, apiUrl = "https://api.wavix.com") {
    this.apiKey = apiKey
    this.apiUrl = apiUrl
  }

  async create({ from, to, recording = false, transcription = false, maxDuration, statusCallback }) {
    const url = `${this.apiUrl}/v2/calls?appid=${this.apiKey}`

    const body = { from, to }
    if (recording) body.call_recording = true
    if (transcription) body.call_transcription = true
    if (maxDuration) body.max_duration = maxDuration
    if (statusCallback) body.status_callback = statusCallback

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })

    return response.json()
  }

  async list() {
    const url = `${this.apiUrl}/v2/calls?appid=${this.apiKey}`
    const response = await fetch(url)
    return response.json()
  }

  async get(uuid) {
    const url = `${this.apiUrl}/v2/calls/${uuid}?appid=${this.apiKey}`
    const response = await fetch(url)
    return response.json()
  }

  async hangup(uuid) {
    const url = `${this.apiUrl}/v2/calls/${uuid}/hangup?appid=${this.apiKey}`
    const response = await fetch(url, { method: "POST" })
    return response.json()
  }

  async playAudio(uuid, audioUrl) {
    const url = `${this.apiUrl}/v2/calls/${uuid}/audio?appid=${this.apiKey}`

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audio_file: audioUrl })
    })

    return response.json()
  }

  async collectDtmf(uuid, { maxDigits = 4, timeout = 10, callbackUrl }) {
    const url = `${this.apiUrl}/v2/calls/${uuid}/dtmf?appid=${this.apiKey}`

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        max_digits: maxDigits,
        timeout,
        callback_url: callbackUrl
      })
    })

    return response.json()
  }
}

// Usage
const calls = new WavixCalls(process.env.WAVIX_API_KEY)

// Make a call
const call = await calls.create({
  from: "+15551234567",
  to: "+14155551234",
  recording: true,
  maxDuration: 600,
  statusCallback: "https://your-server.com/webhooks/call"
})

console.log("Call started:", call.uuid)

// Get call status
const status = await calls.get(call.uuid)
console.log("Status:", status.status)

// Hang up
await calls.hangup(call.uuid)
```

## Express Webhook Handler

```javascript
import express from "express"

const app = express()
app.use(express.json())

app.post("/webhooks/call", (req, res) => {
  const { uuid, status, duration, from, to } = req.body

  console.log(`Call ${uuid}: ${status}`)

  switch (status) {
    case "ringing":
      console.log(`Ringing ${to}...`)
      break
    case "answered":
      console.log(`Call answered`)
      break
    case "completed":
      console.log(`Call ended, duration: ${duration}s`)
      break
    case "failed":
      console.log(`Call failed`)
      break
  }

  res.sendStatus(200)
})

app.listen(3000)
```

## Response Examples

### Create Call
```json
{
  "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "from": "+15551234567",
  "to": "+14155551234",
  "status": "initiated",
  "direction": "outbound"
}
```

### Get Call Status
```json
{
  "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "from": "+15551234567",
  "to": "+14155551234",
  "status": "answered",
  "direction": "outbound",
  "duration": 45,
  "recording_url": "https://recordings.wavix.com/..."
}
```
