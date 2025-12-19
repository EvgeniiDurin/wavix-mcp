# Two-Factor Authentication - cURL

## Send Verification Code

```bash
curl -X POST "https://api.wavix.com/v1/2fa/verification?appid=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": "YOUR_2FA_SERVICE_ID",
    "to": "+14155551234",
    "channel": "sms"
  }'
```

## Send via Voice Call

```bash
curl -X POST "https://api.wavix.com/v1/2fa/verification?appid=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": "YOUR_2FA_SERVICE_ID",
    "to": "+14155551234",
    "channel": "voice"
  }'
```

## Verify Code

```bash
curl -X POST "https://api.wavix.com/v1/2fa/verification/SESSION_UUID/check?appid=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456"
  }'
```

## Resend Code

```bash
curl -X POST "https://api.wavix.com/v1/2fa/verification/SESSION_UUID/resend?appid=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "sms"
  }'
```

## Cancel Verification

```bash
curl -X DELETE "https://api.wavix.com/v1/2fa/verification/SESSION_UUID?appid=YOUR_API_KEY"
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
