---
title: "Using webhooks to receive inbound messages"
description: "Using webhooks to receive inbound SMS and MMS messages with the Wavix Messaging API."
sidebarTitle: "Inbound messages"
---

When building Wavix integrations, you might want your applications or services to receive inbound messages as soon as they reach an SMS-enabled phone number on your account. This allows your backend systems to process them accordingly.

To activate this feature, set a webhook URL as the default SMS endpoint for your SMS-enabled DID, or your Wavix account. You can do this using the Wavix GUI, the Wavix Profile API, or the Wavix DID numbers API.

Once a message is received by an SMS-enabled DID on your Wavix account, Wavix will automatically forward the message to a webhook registered to the DID, if one is specified. In cases where no webhook is registered to the DID, the platform will automatically forward the message to a webhook configured in your account.

<Info>
If you need to allow Wavix IP addresses in your firewall settings, please refer to [Wavix IP addreeses](/getting-started/ip-allowlisting) page.
</Info>

## Set up your Inbound SMS webhook

To set a default DLR webhook URL:
1. [Sign in](https://app.wavix.com) to your account.
2. Go to **Account & billing**, then select **My account**.
3. Select the **Default destinations** tab.
4. Enter your callback URL in the **Inbound SMS webhook** field.
5. Select **Save changes**.

## Message object

The message object below is forwarded to a webhook. 

```json
{
  "message_id": "3c7a5a90-43e0-43e0-b006-fdfea30c5a7c",
  "from": "43720115661",
  "to": "447712345661",
  "message_body": {
    "text": "SMS message",
    "media": null
  },
  "received_at": "2022-04-14T13:51:16.096Z"
}
```

