---
title: "Getting started"
description: "Step-by-step Wavix API onboarding: prerequisites, authentication, versioning, and first calls."
keywords: ["wavix api", "authentication", "api versioning", "api onboarding"]
sidebarTitle: "Getting started"
---

## Prerequisites

- Before you can use the Wavix API, you need to [create a Wavix account](/getting-started/create-account).
- You also need to [create or get your API key](/api-reference/get-your-api-key).

## Versioning

All endpoints and examples are designated with a specific version. Versions vary per endpoint and are not global.

Endpoint versions follow the base URL and come before the endpoint. For example:

```http
https://api.wavix.com/v3/messages
```

This example shows the v3 endpoint for [sending messages](/api-reference/sms-and-mms/send-sms-or-mms-message).

<Tip>
    For new projects, use the latest version. If you have existing integrations on v1, plan to migrate to v3 for full feature support and future compatibility.
</Tip>

## Authentication

Wavix APIs use API keys for secure authentication. You must include your API key in every request to access all endpoints.

### How to use your API key

1. Retrieve your API key from your Wavix account profile (see "Find your API key" above).
2. Add the `appid` query parameter to your API requests, setting its value to your API key.

Example request:
```http
GET https://api.wavix.com/v3/messages?appid=your_api_key
```
Replace `your_api_key` with your actual API key.

<Tip>
    Keep your API key confidential. Do not share it or expose it in public repositories, client-side code, or unsecured environments.
</Tip>

If your API key is compromised, revoke it immediately in your Wavix account and generate a new one.

## Next steps

- Explore the API reference for available endpoints and usage details.
- Review guides for specific messaging use cases:
  - [Send an SMS message](/messaging/send-sms)
  - [10DLC API](/messaging/10dlc-api)
- Subscribe to webhooks to receive real-time updates on your account and messaging events.
- Start building and testing your integration using your API key.
