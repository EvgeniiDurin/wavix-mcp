# Send SMS - cURL

## Send SMS

```bash
curl -X POST "https://api.wavix.com/v3/messages?appid=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+15551234567",
    "to": "+14155551234",
    "message_body": {
      "text": "Hello from Wavix!"
    }
  }'
```

## Send MMS (with media)

```bash
curl -X POST "https://api.wavix.com/v3/messages?appid=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+15551234567",
    "to": "+14155551234",
    "message_body": {
      "text": "Check out this image!",
      "media": ["https://example.com/image.jpg"]
    }
  }'
```

## Get Message Status

```bash
curl "https://api.wavix.com/v3/messages/MESSAGE_ID?appid=YOUR_API_KEY"
```

## List Messages

```bash
# Outbound messages
curl "https://api.wavix.com/v3/messages?appid=YOUR_API_KEY&type=outbound&per_page=10"

# Inbound messages
curl "https://api.wavix.com/v3/messages?appid=YOUR_API_KEY&type=inbound&per_page=10"
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
