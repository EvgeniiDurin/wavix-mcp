---
title: "Receiving message delivery reports"
description: "How to set up and handle SMS and MMS delivery report webhooks with the Wavix Messaging API."
sidebarTitle: "Message delivery reports"
---

A delivery report (DLR) is a confirmation message sent by a mobile carrier to the sender, indicating whether an SMS or MMS message was successfully delivered to the recipient.

Wavix supports delivery report (DLR) webhooks and sends delivery status updates to your specified endpoint. Set a default webhook URL in the Wavix portal, or include a `callback_url` parameter in your [Send SMS or MMS Message](/api-reference/sms-and-mms/send-sms-or-mms-message) API request. If you provide a `callback_url` in the API request, Wavix sends the DLR to that URL. Otherwise, Wavix sends the DLR to the default webhook in your account settings.

<Info>
If you need to allow Wavix IP addresses in your firewall settings, please refer to [Wavix IP addreeses](/getting-started/ip-allowlisting) page.
</Info>

## Set up your DLR webhook URL

### Using the app

To set a default DLR webhook:
1. [Sign in](https://app.wavix.com) to your account.
2. Go to **Account & billing**, then select **My account**.
3. Select the **Default destinations** tab.
4. Enter your callback URL in the **DLR webhook** field.
5. Select **Save changes**.

### In each API request

You can also include the `callback_url` parameter in your API request when sending a message. If you specify this parameter, Wavix uses it for the DLR instead of the account default.

Request example:
```json
{
  "from": "SenderID",
  "to": "1686xxxxxxx",
  "message_body": {
    "text": "Your message text",
    "media": []
  },
  "callback_url": "https://service.com/callbacks/wavix/dlr"
}
```

## Handling the callbacks

Wavix sends delivery reports as POST requests to your webhook URL. These updates are triggered when a message status changes:

1. The first report is sent when the message is sent or fails to send.
2. The second report is sent when the final delivery status is known (e.g. delivered, undelivered, rejected).

Sample payload:
```json
{
  "delivered": null,
  "error": null,
  "from": "SenderID",
  "message_id": "62845007-931a-4c3c-a581-6bdeffec75dc",
  "message_type": "sms",
  "segments_count": 1,
  "sent": "2025-03-21T08:09:02",
  "status": "sent",
  "to": "1686xxxxxxx",
  "tag": "Message tag"
}
```

### Delivery report attributes

| Attribute        | Description |
|------------------|-------------|
| status           | The message's interim or final status.<br />• `sent` - Submitted for delivery (interim)<br />• `delivered` - Successfully delivered (final)<br />• `undelivered` - Couldn't be delivered (final)<br />• `rejected` - Rejected by a carrier, mobile device, or Wavix (final) |
| sent             | Timestamp when Wavix submitted the message for delivery |
| delivered        | Timestamp when final status was received |
| from             | Sender ID |
| to               | Recipient's phone number |
| message_id       | Unique identifier for the message |
| message_type     | `sms` or `mms` |
| segments_count   | Number of SMS segments sent |
| tag              | Custom tag from the original request |
| error            | Error details, if any |
