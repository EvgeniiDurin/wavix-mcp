---
title: "FreeSwitch SIP Trunk Configuration"
description: "Configure FreeSwitch to work with Wavix SIP trunks"
category: guides
tags: [freeswitch, integration, guide, wavix]
source: wavix.com
---

# FreeSwitch SIP Trunk Configuration

Configure FreeSwitch to work with Wavix SIP trunks

## Overview

This guide explains how to configure FreeSwitch to make and receive calls using Wavix SIP trunks.

**Prerequisites:**
- FreeSwitch installed and running
- Wavix account with phone numbers
- Network access to Wavix SIP servers

## Create SIP Trunk on Wavix

1. Log in to your Wavix account
2. Navigate to **Numbers & Trunks** > **Trunks**
3. Click **Create new**
4. Choose authentication method (Digest or IP Auth)
5. Enter trunk name and credentials
6. Click **Create**

## Configure SIP Profile

Create or edit the external SIP profile in conf/sip_profiles/external/:

```
<include>
  <gateway name="wavix">
    <param name="username" value="YOUR_SIP_TRUNK_ID"/>
    <param name="password" value="YOUR_SIP_TRUNK_PASSWORD"/>
    <param name="realm" value="nl.wavix.net"/>
    <param name="proxy" value="nl.wavix.net"/>
    <param name="register" value="true"/>
    <param name="caller-id-in-from" value="true"/>
    <param name="from-user" value="YOUR_NUMBER"/>
    <param name="from-domain" value="nl.wavix.net"/>
  </gateway>
</include>
```

## Configure Outbound Calls

Add dialplan for outbound calls in conf/dialplan/default/:

```
<extension name="outbound-wavix">
  <condition field="destination_number" expression="^(\d{10,})$">
    <action application="set" data="effective_caller_id_number=YOUR_NUMBER"/>
    <action application="bridge" data="sofia/gateway/wavix/$1"/>
  </condition>
</extension>
```

## Configure Inbound Calls

Add dialplan for inbound calls in conf/dialplan/public/:

```
<extension name="inbound-wavix">
  <condition field="destination_number" expression="^(YOUR_NUMBER)$">
    <action application="transfer" data="1000 XML default"/>
  </condition>
</extension>
```

## Enable IP Authentication

For IP-based authentication, update the gateway config:

```
<gateway name="wavix-ip">
  <param name="username" value="YOUR_SIP_TRUNK_ID"/>
  <param name="realm" value="nl.wavix.net"/>
  <param name="proxy" value="nl.wavix.net"/>
  <param name="register" value="false"/>
  <param name="caller-id-in-from" value="true"/>
  <param name="from-user" value="YOUR_NUMBER"/>
  <param name="from-domain" value="nl.wavix.net"/>
</gateway>
```

## Custom Caller ID

To set custom Caller ID per call:

```
<action application="set" data="effective_caller_id_number=+12025551234"/>
<action application="set" data="effective_caller_id_name=My Company"/>
<action application="bridge" data="sofia/gateway/wavix/$1"/>
```

## Troubleshooting

**Check Gateway Status:**
```
fs_cli -x "sofia status gateway wavix"
```

**Debug SIP Messages:**
```
fs_cli -x "sofia loglevel all 9"
fs_cli -x "console loglevel debug"
```

**Common Issues:**
- Registration failures: Check credentials and network connectivity
- One-way audio: Verify external IP and NAT settings
- 603 Decline: Ensure Caller ID is a valid Wavix number

---

*Need help? Contact [support@wavix.com](mailto:support@wavix.com)*
