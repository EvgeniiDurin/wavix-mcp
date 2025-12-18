---
title: "SMS troubleshooting guide"
description: "Troubleshoot common SMS and MMS errors and delivery issues."
sidebarTitle: "Troubleshooting"
keywords: ["SMS errors", "MMS errors", "SMS troubleshooting", "MMS troubleshooting", "SMS delivery issues", "MMS delivery issues" ]
---

Use this guide to troubleshoot common Wavix SMS and MMS API errors. Each error links to detailed steps to help you quickly resolve delivery and configuration issues.

## Generic errors
- [Unsubscribed recipient](/messaging/errors/9): The recipient has opted out of receiving messages.
- [Destination blocked](/messaging/errors/19): The destination is blocked.
- [Destination forbidden](/messaging/errors/17): The destination number is not allowed for messaging.
- [Invalid or non-mobile destination](/messaging/errors/18): The destination number is invalid or not a mobile number.
- [Invalid callback URL](/messaging/errors/25): The callback URL is incorrect.
- [Rate limit exceeded](/messaging/errors/26): You can send only _X_ SMS messages per second.
- [Message too long](/messaging/errors/41): The message exceeds the allowed length.
- [Messaging temporarily blocked](/messaging/errors/47): Messaging to this number is temporarily blocked for 60 minutes.

## Sender ID errors
- [Sender ID not provisioned for country](/messaging/errors/5): The Sender ID is not available in the destination country.
- [Sender ID not found](/messaging/errors/22): The specified Sender ID does not exist.

## Delivery errors
- [Rejected by carrier](/messaging/errors/23): The carrier rejected the message.
- [Gateway rejected](/messaging/errors/24): The gateway did not accept the message.
- [Messaging not supported](/messaging/errors/29): The destination carrier or handset does not support messaging.
- [Unsupported carrier](/messaging/errors/45): The destination carrier or handset does not support messaging.
- [Inactive number, insufficient credits, or opted out](/messaging/errors/31): The destination number is inactive, lacks credits, or has opted out of SMS.
- [Idempotency violation](/messaging/errors/55): A duplicate message was detected.

## 10DLC errors
- [Rejected as spam or inactive campaign](/messaging/errors/33): The message was rejected as spam or the Sender ID is linked to an inactive 10DLC campaign.
- [Inactive destination number](/messaging/errors/44): The destination number is no longer active.
- [Brand or campaign limit exceeded](/messaging/errors/34): The messaging limit for the brand or campaign has been reached.
- [Daily quota exceeded (T-Mobile)](/messaging/errors/36): The daily messaging quota for T-Mobile has been exceeded.
- [Spam detected or rejected (AT&T)](/messaging/errors/37): AT&T detected or rejected the message as spam.
- [Blocked by Verizon content filter](/messaging/errors/43): Verizon blocked the message due to content filtering.
- [Non-compliant content or URLs blocked](/messaging/errors/46): The message contains non-compliant content or URLs.

## MMS errors
- [Media file size exceeds limit](/messaging/errors/13): The media file size must not exceed 1 MB.
- [MMS supported only for US and CA numbers](/messaging/errors/12): You can send MMS only to US and Canada phone numbers.
- [Unsupported media format](/messaging/errors/14): The media format is not supported.
- [Media file URL must be public](/messaging/errors/15): The media file URL must be publicly accessible.
- [Maximum attachments exceeded](/messaging/errors/21): You can include up to five attachments per MMS message.

---

Select any error above for detailed troubleshooting steps.
