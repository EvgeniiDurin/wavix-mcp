# Two-Factor Authentication (2FA) - Node.js

## Quick Start

```javascript
const WAVIX_API_KEY = process.env.WAVIX_API_KEY
const WAVIX_API_URL = process.env.WAVIX_API_URL || "https://api.wavix.com"
const WAVIX_2FA_SERVICE_ID = process.env.WAVIX_2FA_SERVICE_ID

async function send2FA(phoneNumber, channel = "sms") {
  const url = `${WAVIX_API_URL}/v1/2fa/verification?appid=${WAVIX_API_KEY}`

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: WAVIX_2FA_SERVICE_ID,
      to: phoneNumber,
      channel // "sms" or "voice"
    })
  })

  return response.json()
}

async function verify2FA(sessionId, code) {
  const url = `${WAVIX_API_URL}/v1/2fa/verification/${sessionId}/check?appid=${WAVIX_API_KEY}`

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  })

  return response.json()
}

// Usage
const session = await send2FA("+14155551234")
console.log("Session ID:", session.session_uuid)

// User enters code...
const result = await verify2FA(session.session_uuid, "123456")
console.log("Valid:", result.valid)
```

## Full Example with Express Server

```javascript
import "dotenv/config"
import express from "express"

const app = express()
app.use(express.json())

const WAVIX_API_KEY = process.env.WAVIX_API_KEY
const WAVIX_API_URL = process.env.WAVIX_API_URL || "https://api.wavix.com"
const WAVIX_2FA_SERVICE_ID = process.env.WAVIX_2FA_SERVICE_ID

class Wavix2FA {
  constructor(apiKey, serviceId, apiUrl = "https://api.wavix.com") {
    this.apiKey = apiKey
    this.serviceId = serviceId
    this.apiUrl = apiUrl
  }

  async send(phoneNumber, channel = "sms") {
    const url = `${this.apiUrl}/v1/2fa/verification?appid=${this.apiKey}`

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: this.serviceId,
        to: phoneNumber,
        channel
      })
    })

    return response.json()
  }

  async verify(sessionId, code) {
    const url = `${this.apiUrl}/v1/2fa/verification/${sessionId}/check?appid=${this.apiKey}`

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    })

    return response.json()
  }

  async resend(sessionId, channel = "sms") {
    const url = `${this.apiUrl}/v1/2fa/verification/${sessionId}/resend?appid=${this.apiKey}`

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel })
    })

    return response.json()
  }

  async cancel(sessionId) {
    const url = `${this.apiUrl}/v1/2fa/verification/${sessionId}?appid=${this.apiKey}`
    return fetch(url, { method: "DELETE" })
  }
}

const twoFA = new Wavix2FA(WAVIX_API_KEY, WAVIX_2FA_SERVICE_ID, WAVIX_API_URL)

// Send verification code
app.post("/auth/send-code", async (req, res) => {
  try {
    const { phone, channel = "sms" } = req.body
    const result = await twoFA.send(phone, channel)
    res.json({ sessionId: result.session_uuid })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Verify code
app.post("/auth/verify", async (req, res) => {
  try {
    const { sessionId, code } = req.body
    const result = await twoFA.verify(sessionId, code)
    res.json({ valid: result.valid, status: result.status })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3000, () => console.log("Server running on :3000"))
```

## Environment Variables

```bash
WAVIX_API_KEY=your_api_key
WAVIX_API_URL=https://api.wavix.com
WAVIX_2FA_SERVICE_ID=your_2fa_service_id
```

## Response Examples

### Send Verification
```json
{
  "session_uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "pending",
  "channel": "sms",
  "to": "+14155551234"
}
```

### Verify Code
```json
{
  "valid": true,
  "status": "approved"
}
```
