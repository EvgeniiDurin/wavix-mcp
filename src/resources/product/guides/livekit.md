---
title: "LiveKit AI Voice Agent Integration"
description: "Connect LiveKit AI voice agents with Wavix for telephony"
category: guides
tags: [livekit, integration, guide, wavix]
source: wavix.com
---

# LiveKit AI Voice Agent Integration

Connect LiveKit AI voice agents with Wavix for telephony

## Overview

This guide explains how to connect LiveKit AI voice agents with Wavix voice infrastructure to place and receive phone calls.

**Prerequisites:**
- LiveKit Cloud account with telephony enabled
- Wavix account with phone numbers
- API access to both platforms

## Purchase a Phone Number

1. Log in to your Wavix account
2. Navigate to **Numbers & Trunks** > **Buy Numbers**
3. Search for available numbers (local, toll-free, or mobile)
4. Purchase numbers for your LiveKit integration
5. Ensure SMS capability if needed for your use case

## Receive Calls with LiveKit

**Step 1: Create LiveKit Inbound Trunk**
1. Sign in to your LiveKit project
2. Select **Configuration** under **Telephony** in the menu
3. Click **+Create new** and choose **Trunk**
4. Enter comma-separated list of Wavix numbers to associate

**Step 2: Create a Dispatch Rule**
1. In LiveKit, go to **Telephony** > **Dispatch Rules**
2. Create a rule to route calls to your AI agent
3. Configure the agent endpoint and parameters

**Step 3: Find Your LiveKit SIP URI**
1. Go to **Settings** > **Project**
2. Copy the **SIP URI** (e.g., sip:xxxxx.sip.livekit.cloud)

**Step 4: Configure Wavix Routing**
1. In Wavix, go to **My Numbers**
2. Click Edit on your number
3. Set destination type to **SIP URI**
4. Enter: [did]@xxxxx.sip.livekit.cloud
5. Click **Save**

## Place Calls with LiveKit

**Step 1: Create Wavix SIP Trunk**
1. Navigate to **Numbers & Trunks** > **Trunks**
2. Click **Create new**
3. Select **Digest** authentication
4. Set trunk name, password, and Caller ID
5. Optionally configure limits:
   - Max outbound call duration
   - Max simultaneous calls
   - Max call cost
6. Click **Create**

**Step 2: Create LiveKit Outbound Trunk**
1. Sign in to your LiveKit account
2. Select **Configuration** under **Telephony**
3. Click **+Create new** and choose **SIP Trunk**
4. Configure with Wavix credentials:
   - SIP Server: nl.wavix.net (or regional server)
   - Username: YOUR_SIP_TRUNK_ID
   - Password: YOUR_SIP_TRUNK_PASSWORD
   - From Number: YOUR_WAVIX_NUMBER

## Transfer Calls

LiveKit supports call transfers using SIP REFER:

1. In your agent code, use the transfer API
2. Specify the destination number or SIP URI
3. The call will be transferred through Wavix

Example transfer destinations:
- External number: +12025551234
- Another extension: sip:1000@your-pbx.com
- Queue or IVR: sip:queue@your-system.com

## Troubleshooting

**Inbound calls not reaching LiveKit:**
- Verify the SIP URI is correct on Wavix
- Check LiveKit trunk is associated with the correct numbers
- Verify dispatch rules are configured

**Outbound calls failing:**
- Check SIP trunk credentials
- Verify Caller ID is a valid Wavix number
- Check account balance and limits

**Audio quality issues:**
- Use a regional Wavix gateway closest to your LiveKit region
- Verify network connectivity and latency
- Check codec compatibility (G.711 recommended)

---

*Need help? Contact [support@wavix.com](mailto:support@wavix.com)*
