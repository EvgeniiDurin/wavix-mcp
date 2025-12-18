---
title: "Receive messages"
description: "Using webhooks to receive inbound SMS and MMS messages with the Wavix Messaging API."
sidebarTitle: "Receive messages"
---

import createAccount from '/snippets/create-wavix-account.mdx';
import enableSms from '/snippets/enable-sms-number.mdx';

When building Wavix integrations, you might want your applications or services to receive inbound messages as soon as they reach an SMS-enabled phone number on your account. This allows your backend systems to process them accordingly.

## Prerequisites

### Create a Wavix account

<createAccount />

### Enable inbound SMS for a number

<enableSms />

### Create a webhook endpoint

To receive inbound messages, you need to create a [webhook endpoint](/messaging/webhooks-inbound-messages) that can accept HTTP POST requests. This endpoint will process the incoming messages sent by Wavix.