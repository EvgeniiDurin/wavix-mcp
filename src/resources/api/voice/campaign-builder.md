---
title: "Voice Campaigns with Campaign Builder API"
description: "How to use the Wavix Campaign Builder API to create and manage voice campaigns."
sidebarTitle: "Campaign Builder API"
keywords: ["voice campaigns", "campaign builder", "outbound calls", "call scenarios"]
---

import createAccount from '/snippets/create-wavix-account.mdx';
import findApiKey from '/snippets/find-api-key.mdx';

Wavix Campaign Builder lets you create custom flows for outbound calls using an intuitive, drag-and-drop interface. With the Wavix Campaign Builder API, you can trigger automatic calls programmed to follow a specific scenario.

<Note>
  The Wavix Campaign Builder API is available exclusively for Flex Pro users.
</Note>

## Prerequisites

Before you can access the Wavix Campaign Builder API, you need to sign up for Wavix.

### Create a Wavix account

<createAccount />

### Find your API key

<findApiKey />

## How to launch a campaign

Before placing an automatic call, sign in to your Wavix account and create a Call Flow using the app at [https://app.wavix.com/calling/flows](https://app.wavix.com/calling/flows). Once the Call Flow is approved, you can use it with the Wavix Campaign Builder API.

To launch a call, get the Call Flow's unique identifier:

1. Go to [https://app.wavix.com/calling/flows](https://app.wavix.com/calling/flows).
2. Find the approved Call Flow you want to launch.
3. The Call Flow ID appears in the ID column.

To [trigger a call](/api-reference/voice-campaigns/trigger-a-scenario), use the following method:

```http
POST https://api.wavix.com/v1/voice-campaigns?appid=your_api_key
```

Request body example:
```json
{
    "voice_campaign": {
        "callflow_id": callflow_id,
        "contact": "contact",
        "caller_id": "caller_id"
    }
}
```

- `callflow_id` - the unique identifier of the Call Flow to launch
- `contact` - a phone number in E.164 format, with or without the leading “+”
- `caller_id` - an active phone number on your Wavix account. This number will be used as the Caller ID

All parameters are required.

If successful, the service returns `HTTP 201 Created`. The response body contains the placed call details.

```json
{
   "voice_campaign": {
       "id": 1,
       "caller_id": "4420xxxxxxxx",
       "contact": "4477xxxxxxxx",
       "status": "in_progress",
       "timestamp": "2021-12-09T09:47:18Z"
   }
}
```

After the call is completed, you can query its details using the [Wavix CDR API](/api-reference/cdrs/get-cdrs-on-the-account).


