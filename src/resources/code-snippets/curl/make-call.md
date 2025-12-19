# Make Call - cURL

## Initiate Call

```bash
curl -X POST "https://api.wavix.com/v2/calls?appid=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+15551234567",
    "to": "+14155551234"
  }'
```

## Call with Recording

```bash
curl -X POST "https://api.wavix.com/v2/calls?appid=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+15551234567",
    "to": "+14155551234",
    "call_recording": true,
    "call_transcription": true,
    "max_duration": 600,
    "status_callback": "https://your-server.com/webhooks/call"
  }'
```

## Get Call Status

```bash
curl "https://api.wavix.com/v2/calls/CALL_UUID?appid=YOUR_API_KEY"
```

## List Active Calls

```bash
curl "https://api.wavix.com/v2/calls?appid=YOUR_API_KEY"
```

## Hang Up Call

```bash
curl -X POST "https://api.wavix.com/v2/calls/CALL_UUID/hangup?appid=YOUR_API_KEY"
```

## Play Audio

```bash
curl -X POST "https://api.wavix.com/v2/calls/CALL_UUID/audio?appid=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "audio_file": "https://example.com/audio.mp3"
  }'
```

## Collect DTMF

```bash
curl -X POST "https://api.wavix.com/v2/calls/CALL_UUID/dtmf?appid=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "max_digits": 4,
    "timeout": 10,
    "callback_url": "https://your-server.com/dtmf"
  }'
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
  "status": "answered",
  "duration": 45,
  "direction": "outbound"
}
```
