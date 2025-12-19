# Validate Phone Number - cURL

## Format Validation (basic)

```bash
curl "https://api.wavix.com/v2/lookup?appid=YOUR_API_KEY&phone_number=+14155551234&type=format"
```

## Analysis (HLR Lookup)

```bash
curl "https://api.wavix.com/v2/lookup?appid=YOUR_API_KEY&phone_number=+14155551234&type=analysis"
```

## Full Validation

```bash
curl "https://api.wavix.com/v2/lookup?appid=YOUR_API_KEY&phone_number=+14155551234&type=validation"
```

## Batch Validation

```bash
curl -X POST "https://api.wavix.com/v2/lookup?appid=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_numbers": ["+14155551234", "+380501234567"],
    "type": "format",
    "async": false
  }'
```

## Response Examples

### Format
```json
{
  "phone_number": "+14155551234",
  "valid": true,
  "country_code": "US",
  "e164_format": "+14155551234",
  "national_format": "(415) 555-1234"
}
```

### Analysis
```json
{
  "phone_number": "+14155551234",
  "valid": true,
  "country_code": "US",
  "number_type": "mobile",
  "carrier_name": "T-Mobile USA",
  "mcc": "310",
  "mnc": "260",
  "ported": false
}
```
