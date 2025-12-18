---
title: "3CX SMS Integration"
description: "Enable SMS messaging in 3CX using Wavix"
category: guides
tags: [3cx-sms, integration, guide, wavix]
source: wavix.com
---

# 3CX SMS Integration

Enable SMS messaging in 3CX using Wavix

## Overview

This guide explains how to enable SMS messaging in your 3CX phone system using Wavix SMS services.

**Prerequisites:**
- 3CX phone system with SMS support
- Wavix account with SMS-enabled numbers
- API credentials from Wavix

## Enable SMS on Your Number

1. Log in to your Wavix account
2. Navigate to **Numbers & Trunks** > **My Numbers**
3. Select the number you want to enable for SMS
4. Enable **SMS** capability
5. Click **Save**

## Create SMS Sender ID

1. Navigate to **SMS** > **Sender IDs**
2. Click **Create Sender ID**
3. Select your SMS-enabled number
4. Configure messaging preferences
5. Click **Create**

## Configure 3CX SMS Settings

1. In 3CX Management Console, go to **SMS**
2. Select **Wavix** as the SMS provider (or Generic HTTP)
3. Enter your Wavix API credentials:
   - API Key
   - API Secret
4. Configure webhook URL for inbound SMS
5. Test the configuration

## Enable SMS on SIP Trunk

1. Open your 3CX SIP trunk settings
2. Navigate to the **SMS** tab
3. Enable SMS for this trunk
4. Associate your SMS-enabled Wavix numbers
5. Save the configuration

---

*Need help? Contact [support@wavix.com](mailto:support@wavix.com)*
