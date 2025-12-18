---
title: "Asterisk SIP Trunk Configuration"
description: "Configure Asterisk to make and receive calls using Wavix SIP trunks"
category: guides
tags: [asterisk, integration, guide, wavix]
source: wavix.com
---

# Asterisk SIP Trunk Configuration

Configure Asterisk to make and receive calls using Wavix SIP trunks

## Overview

This guide explains how to configure Asterisk PBX to work with Wavix SIP trunks for inbound and outbound calling.

**Prerequisites:**
- Asterisk installed and running
- Wavix account with purchased phone numbers
- Network access to Wavix SIP servers

## Purchase a Phone Number

1. Log in to your Wavix account at app.wavix.com
2. Navigate to **Numbers & Trunks** > **Buy Numbers**
3. Search for available numbers by country, area code, or features
4. Select and purchase your desired numbers
5. Numbers are immediately available for use

## Create a Wavix SIP Trunk

1. Navigate to **Numbers & Trunks** > **Trunks**
2. Click **Create new**
3. Choose authentication method:
   - **Digest**: Username/password authentication
   - **IP Auth**: Whitelist your server IP
4. Enter a trunk name and set credentials
5. Click **Create**

Note your SIP Trunk ID and password for Asterisk configuration.

## Configure chan_sip Module

Navigate to /etc/asterisk/ and edit sip.conf:

```
[general]
register => <YOUR_SIP_TRUNK_ID>:<YOUR_SIP_TRUNK_PASSWORD>@nl.wavix.net/<YOUR_NUMBER>

[Wavix]
type=friend
host=nl.wavix.net
username=<YOUR_SIP_TRUNK_ID>
fromuser=<YOUR_NUMBER>
secret=<YOUR_SIP_TRUNK_PASSWORD>
context=from-siptrunk
insecure=port,invite
disallow=all
allow=ulaw,alaw
nat=force_rport,comedia
canreinvite=no

; ===== SIP devices =====

[11111]
type=friend
username=11111
secret=<EXTENSION_PASSWORD_1>
host=dynamic
context=from-internal
disallow=all
allow=ulaw,alaw
nat=force_rport,comedia
canreinvite=no
qualify=yes
```

## Configure chan_pjsip Module

For newer Asterisk versions using PJSIP, edit pjsip.conf:

```
[transport-udp-main]
type=transport
protocol=udp
bind=0.0.0.0:5060

[auth_wavix]
type=auth
auth_type=userpass
username=<YOUR_SIP_TRUNK_ID>
password=<YOUR_SIP_TRUNK_PASSWORD>

[Wavix_aor]
type=aor
contact=sip:<YOUR_SIP_TRUNK_ID>@nl.wavix.net:5060

[Wavix]
type=endpoint
context=from-siptrunk
disallow=all
allow=ulaw,alaw
direct_media=no
from_user=<YOUR_NUMBER>
from_domain=nl.wavix.net
aors=Wavix_aor
outbound_auth=auth_wavix

[Wavix_identify]
type=identify
endpoint=Wavix
match=nl.wavix.net
match=us.wavix.net
match=sg.wavix.net
match=au.wavix.net

[reg_wavix]
type=registration
transport=transport-udp-main
outbound_auth=auth_wavix
server_uri=sip:nl.wavix.net:5060
client_uri=sip:<YOUR_SIP_TRUNK_ID>@nl.wavix.net
expiration=120
retry_interval=20
max_retries=10
```

## Enable IP Authentication

For IP-based authentication (no password required):

**On Wavix:**
1. Open your SIP trunk settings
2. Select **IP Authentication** in the Authentication method
3. Enter your Asterisk server's public IP
4. Click **Save**

**On Asterisk (chan_sip):**
Remove the register line and secret from sip.conf:

```
[Wavix]
type=peer
host=nl.wavix.net
username=<YOUR_SIP_TRUNK_ID>
fromuser=<YOUR_NUMBER>
context=from-siptrunk
insecure=port,invite
disallow=all
allow=ulaw,alaw
nat=force_rport,comedia
```

## Configure Outbound Calls

Edit extensions.conf to route outbound calls through Wavix:

```
[from-internal]
; Outbound calls - 10+ digits
exten => _X.,1,NoOp(Outbound call to ${EXTEN})
same => n,Set(CALLERID(num)=<YOUR_NUMBER>)
same => n,Dial(SIP/Wavix/${EXTEN},60,Tt)
same => n,Hangup()
```

## Configure Inbound Calls

**On Wavix:**
1. Navigate to **My Numbers**
2. Click Edit on your number
3. Set destination to **SIP URI** or **SIP Trunk**
4. Enter your Asterisk server address

**On Asterisk (extensions.conf):**

```
[from-siptrunk]
exten => <YOUR_NUMBER>,1,NoOp(Inbound call from ${CALLERID(num)})
same => n,Dial(SIP/11111,30)
same => n,Hangup()
```

## Verify Registration

**For chan_sip:**
```
asterisk -x "sip reload"
asterisk -x "sip show registry"
```

**For chan_pjsip:**
```
asterisk -x "pjsip reload"
asterisk -x "pjsip show registrations"
```

You should see "Registered" status for the Wavix trunk.

## Troubleshooting

**603 Decline Error:**
- Verify your Caller ID is a valid number from your Wavix account
- Check that the number is active and not suspended

**Registration Failures:**
- Verify credentials match exactly (case-sensitive)
- Check firewall allows UDP 5060 to Wavix servers
- Ensure NAT settings are correct

**One-way Audio:**
- Enable nat=force_rport,comedia in sip.conf
- Check RTP ports are open (10000-20000 UDP)
- Verify direct_media=no in pjsip.conf

---

*Need help? Contact [support@wavix.com](mailto:support@wavix.com)*
