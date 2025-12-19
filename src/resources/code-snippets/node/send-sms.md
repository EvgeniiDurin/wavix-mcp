# Send SMS - Node.js

## Quick Start

```javascript
const WAVIX_API_KEY = process.env.WAVIX_API_KEY
const WAVIX_API_URL = process.env.WAVIX_API_URL || "https://api.wavix.com"

async function sendSms(from, to, message) {
  const url = `${WAVIX_API_URL}/v3/messages?appid=${WAVIX_API_KEY}`

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      message_body: { text: message }
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to send SMS")
  }

  return response.json()
}

// Usage
const result = await sendSms("+15551234567", "+14155551234", "Hello from Wavix!")
console.log("Message ID:", result.message_id)
console.log("Status:", result.status)
```

## Full Example with Error Handling

```javascript
import "dotenv/config"

const WAVIX_API_KEY = process.env.WAVIX_API_KEY
const WAVIX_API_URL = process.env.WAVIX_API_URL || "https://api.wavix.com"

class WavixSMS {
  constructor(apiKey, apiUrl = "https://api.wavix.com") {
    this.apiKey = apiKey
    this.apiUrl = apiUrl
  }

  async send({ from, to, message, media = null, tag = null, callbackUrl = null }) {
    const url = `${this.apiUrl}/v3/messages?appid=${this.apiKey}`

    const body = {
      from,
      to,
      message_body: { text: message }
    }

    if (media) body.message_body.media = media
    if (tag) body.tag = tag
    if (callbackUrl) body.callback_url = callbackUrl

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || "SMS send failed")
      error.status = response.status
      error.code = data.error_code
      throw error
    }

    return data
  }

  async getStatus(messageId) {
    const url = `${this.apiUrl}/v3/messages/${messageId}?appid=${this.apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to get message status")
    }

    return data.message
  }

  async list({ type = "outbound", page = 1, perPage = 30 } = {}) {
    const params = new URLSearchParams({
      appid: this.apiKey,
      type,
      page,
      per_page: perPage
    })

    const url = `${this.apiUrl}/v3/messages?${params}`
    const response = await fetch(url)

    return response.json()
  }
}

// Usage
const sms = new WavixSMS(WAVIX_API_KEY, WAVIX_API_URL)

try {
  const result = await sms.send({
    from: "+15551234567",
    to: "+14155551234",
    message: "Hello from Wavix!"
  })
  console.log("Sent:", result)

  // Check status
  const status = await sms.getStatus(result.message_id)
  console.log("Status:", status.status)
} catch (error) {
  console.error("Error:", error.message)
}
```

## Environment Variables

```bash
WAVIX_API_KEY=your_api_key_here
WAVIX_API_URL=https://api.wavix.com
```

## Response Example

```json
{
  "message_id": "871b4eeb-f798-4105-be23-32df9e991456",
  "message_type": "sms",
  "from": "+15551234567",
  "to": "+14155551234",
  "status": "accepted",
  "segments": 1,
  "charge": "0.01",
  "submitted_at": "2025-01-15T10:30:00.000Z"
}
```
