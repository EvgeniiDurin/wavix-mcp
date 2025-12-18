---
title: "SIP Trunks API overview"
description: "How to manage SIP trunks and DIDs using the Wavix SIP Trunking API."
sidebarTitle: "SIP Trunks API"
---

import createAccount from '/snippets/create-wavix-account.mdx'
import findApiKey from '/snippets/find-api-key.mdx'

Session Initiation Protocol (SIP) is a signaling protocol for starting, ending, and changing user sessions over an IP network. The Wavix platform provides scalable, enterprise-level features for inbound and outbound calls. This guide shows you how to create and configure SIP trunks on your Wavix account using the Wavix API.

<Note>
    The Wavix SIP trunks API is available only for Flex Pro users.
</Note>

## Prerequisites

Before you create your first SIP trunk, sign up for a Wavix account.

### Create a Wavix account

<createAccount />

### Find your API key

<findApiKey />

## List SIP trunks on your Wavix account

To [list SIP trunks](/api-reference/sip-trunks/list-sip-trunks-on-the-account) and view their statuses on your Wavix account, use the following method:

```http
GET https://api.wavix.com/v1/trunks?appid=your_api_key
```

## Create and configure SIP trunks

The Wavix platform supports these authentication methods for SIP trunks:
- **Digest** - SIP devices authenticate with a login and password.
- **IP Authentication** - The SIP trunk authenticates `SIP INVITE` messages sent from specified IP addresses. IP Authentication requires manual approval by Wavix administrators.

<Note>
  For outbound calls, Wavix supports one Caller ID per SIP trunk by default. To use more than one Caller ID, enable Caller ID Passthrough. Caller ID Passthrough requires manual approval by Wavix administrators.
</Note>

To [create a SIP trunk](/api-reference/sip-trunks/create-a-new-sip-trunk) on your account, use this API method:

```http
POST https://api.wavix.com/v1/trunks?appid=your_api_key
```

Response:

```json
{
    "label ": "My SIP trunk",
    "password": "YOUR_SIP_TRUNK_PASSWORD",
    "callerid": "12121234567",
    "ip_restrict": false,
    "didinfo_enabled": true,
    "call_restrict": true,
    "call_limit": 60,
    "cost_limit": true,
    "max_call_cost": 0.18,
    "channels_restrict": true,
    "max_channels": 10,
    "rewrite_enabled": true,
    "rewrite_prefix": "00",
    "rewrite_cond": "1",
    "passthrough": false
}
```

After you create the SIP trunk, you receive a response with the SIP trunk ID and its configuration parameters.

To [update a SIP trunk](/api-reference/sip-trunks/update-a-sip-trunk) configuration, use this API method:

```http
PUT https://api.wavix.com/v1/trunks/trunk_id?appid=your_api_key
```

Paste the following JSON in the request body

```json
{
    "label": "SIP trunk label",
    "password": "YOUR_SIP_TRUNK_PASSWORD",
    "callerid": "12121234567",
    "ip_restrict": true,
    "didinfo_enabled": true,
    "call_restrict": false,
    "call_limit": 60,
    "cost_limit": true,
    "max_call_cost": 0.18,
    "channels_restrict": true,
    "max_channels": 10,
    "rewrite_enabled": true,
    "rewrite_prefix": "00",
    "rewrite_cond": "1",
    "passthrough": false
}
```

## Delete a SIP trunk

To [delete a SIP trunk](/api-reference/sip-trunks/delete-a-sip-trunk) from your account, use this API method:

```http
DELETE https://api.wavix.com/v1/trunks/trunk_id?appid=your_api_key
```