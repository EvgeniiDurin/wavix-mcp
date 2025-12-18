---
title: "3CX SIP Trunk Configuration"
description: "Configure 3CX phone system with Wavix SIP trunks"
category: guides
tags: [3cx-trunks, integration, guide, wavix]
source: wavix.com
---

# 3CX SIP Trunk Configuration

Configure 3CX phone system with Wavix SIP trunks

## Overview

This guide explains how to configure 3CX phone system to use Wavix SIP trunks for voice calls.

**Prerequisites:**
- 3CX phone system installed
- Wavix account with phone numbers
- Static IP address for your 3CX server

## Create SIP Trunk on Wavix

1. Log in to your Wavix account
2. Navigate to **Numbers & Trunks** > **Trunks**
3. Click **Create new**
4. Select **IP Authentication** as the authentication method
5. Name your trunk (e.g., "3CX-Production")
6. Click **Create**

Note the SIP Trunk ID for 3CX configuration.

## Configure 3CX SIP Trunk

1. Open your 3CX **SIP Trunk** settings
2. Select **Worldwide** in the Country list
3. Choose **Generic SIP Trunk (IP Based)** as the Provider
4. In **Account Details**, enter the **SIP trunk ID** from Wavix
5. Enter your Caller ID in the **Main Trunk Number** field
6. Set **Type of authentication** to **Do not require - IP based**
7. In **Server Details**, enter a Wavix regional gateway:
   - nl.wavix.net (Europe)
   - us.wavix.net (US)
   - sg.wavix.net (Asia)
   - au.wavix.net (Australia)
8. Add a name for your trunk
9. Click **Save**

## Enable IP Authentication on Wavix

1. Open your Wavix SIP trunk settings
2. Select **IP Authentication** in the Authentication method
3. Enter your 3CX server's public IP address
4. Click **Submit**
5. Click **Save** to apply changes

## Configure Outbound Rules

1. In 3CX, go to **Outbound Rules**
2. Create a new rule for external calls
3. Set the route to use your Wavix trunk
4. Configure Caller ID presentation:
   - Use Default Trunk Caller ID
   - Or set specific numbers per extension

## Configure Inbound Routing

1. In 3CX, go to **Inbound Rules**
2. Create rules for your Wavix DIDs
3. Set the destination (extension, ring group, IVR, etc.)
4. On Wavix, set the inbound destination to your 3CX server's IP or SIP URI

---

*Need help? Contact [support@wavix.com](mailto:support@wavix.com)*
