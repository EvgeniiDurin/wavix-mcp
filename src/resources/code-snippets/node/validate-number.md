# Validate Phone Number - Node.js

## Quick Start

```javascript
const WAVIX_API_KEY = process.env.WAVIX_API_KEY
const WAVIX_API_URL = process.env.WAVIX_API_URL || "https://api.wavix.com"

async function validateNumber(phoneNumber, type = "format") {
  const params = new URLSearchParams({
    appid: WAVIX_API_KEY,
    phone_number: phoneNumber,
    type // "format" | "analysis" | "validation"
  })

  const url = `${WAVIX_API_URL}/v2/lookup?${params}`
  const response = await fetch(url)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Validation failed")
  }

  return response.json()
}

// Usage
const result = await validateNumber("+14155551234", "analysis")
console.log("Valid:", result.valid)
console.log("Country:", result.country_code)
console.log("Carrier:", result.carrier_name)
```

## Validation Types

| Type | Description | Returns |
|------|-------------|---------|
| `format` | Basic format validation | valid, country_code, e164_format, national_format |
| `analysis` | Carrier lookup (HLR) | + carrier_name, number_type, mcc, mnc, ported |
| `validation` | Live validation | + reachable status |

## Full Example

```javascript
class WavixValidator {
  constructor(apiKey, apiUrl = "https://api.wavix.com") {
    this.apiKey = apiKey
    this.apiUrl = apiUrl
  }

  async validate(phoneNumber, type = "format") {
    const params = new URLSearchParams({
      appid: this.apiKey,
      phone_number: phoneNumber,
      type
    })

    const response = await fetch(`${this.apiUrl}/v2/lookup?${params}`)
    return response.json()
  }

  async validateBatch(phoneNumbers, type = "format") {
    const url = `${this.apiUrl}/v2/lookup?appid=${this.apiKey}`

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_numbers: phoneNumbers,
        type,
        async: false
      })
    })

    return response.json()
  }
}

// Usage
const validator = new WavixValidator(process.env.WAVIX_API_KEY)

// Single validation
const result = await validator.validate("+14155551234", "analysis")
console.log(result)

// Batch validation
const batchResult = await validator.validateBatch([
  "+14155551234",
  "+380501234567"
], "format")
console.log(batchResult)
```

## Response Examples

### Format Validation
```json
{
  "phone_number": "+14155551234",
  "valid": true,
  "country_code": "US",
  "e164_format": "+14155551234",
  "national_format": "(415) 555-1234",
  "charge": "0.001"
}
```

### Analysis (HLR Lookup)
```json
{
  "phone_number": "+14155551234",
  "valid": true,
  "country_code": "US",
  "e164_format": "+14155551234",
  "national_format": "(415) 555-1234",
  "number_type": "mobile",
  "carrier_name": "T-Mobile USA",
  "mcc": "310",
  "mnc": "260",
  "ported": false,
  "risky_destination": false,
  "charge": "0.008"
}
```
