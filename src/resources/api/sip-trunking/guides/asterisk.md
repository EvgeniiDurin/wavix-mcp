---
title: "How to configure Asterisk using Wavix SIP trunks"
description: "This guide provides a basic configuration of Asterisk to make inbound and outbound calls over the Wavix network"
date: "Thu Sep 11 2025 01:00:00 GMT+0100 (Western European Summer Time)"
sidebarTitle: "Asterisk"
---

import BuyNumber from '/snippets/buy-phone-number.mdx';
import CreateSipTrunk from '/snippets/create-sip-trunk.mdx';

<BuyNumber />

<CreateSipTrunk />

## Configure a SIP trunk in Asterisk

This guide provides configuration instructions for both the `chan_pjsip` and `chan_sip` modules. Follow the instructions that correspond to the module used on your Asterisk PBX.

<Note>
The `chan_sip` module is deprecated and was officially removed in Asterisk version 21.
</Note>

For the purpose of this guide, we will use:

1. Internal Asterisk extensions: `11111` and `99999`
2. Primary gateway domain name: `nl.wavix.net`
3. Primary gateway IP address: `95.211.82.14`

<Note>
Choose the primary gateway with the lowest ping from your location. A full list of Wavix regional gateways is available at the bottom of the page: [https://app.wavix.com/trunks](https://app.wavix.com/trunks)
</Note>

### Configure the chan_sip module

To configure outbound calls on your Asterisk server:

1. Navigate to the Asterisk configuration directory: `/etc/asterisk/`
2. Open the `sip.conf` file for editing.
3. Add or modify the following configuration:

```ini
[general]
register => <YOUR_SIP_TRUNK_ID>:<YOUR_SIP_TRUNK_PASSWORD>@nl.wavix.net/YOUR_NUMBER

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

[99999]
type=friend
username=99999
secret=<EXTENSION_PASSWORD_2>
host=dynamic
context=from-internal
disallow=all
allow=ulaw
nat=force_rport,comedia
canreinvite=no
qualify=yes
```

<Note>
- Replace `<YOUR_SIP_TRUNK_ID>` and `<YOUR_SIP_TRUNK_PASSWORD>` with the SIP trunk credentials configured on the Wavix platform.
- Replace `<YOUR_NUMBER>` with the phone number purchased on your Wavix account.
- Use strong passwords instead of `<EXTENSION_PASSWORD_1>` and `<EXTENSION_PASSWORD_2>`.
</Note>

Verify the Wavix SIP trunk registration:

1. Reload the `chan_sip` module configuration using the following command: `asterisk -x "sip reload"`
2. Check the SIP trunk registration status using the following command: `asterisk -x "sip show registry"`

### Configure the chan_pjsip module

To configure outbound calls on your Asterisk server:

1. Navigate to the Asterisk configuration directory: `/etc/asterisk/`
2. Open the `pjsip.conf` file for editing.
3. Add or modify the following configuration:

```ini
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


[11111]
type=endpoint
transport=transport-udp-main
context=from-internal
disallow=all
allow=ulaw,alaw
aors=11111
auth=11111

[11111]
type=auth
auth_type=userpass
username=11111
password=<EXTENSION_PASSWORD_1>

[11111]
type=aor
max_contacts=2

[99999]
type=endpoint
transport=transport-udp-main
context=from-internal
disallow=all
allow=ulaw,alaw
aors=99999
auth=99999

[99999]
type=auth
auth_type=userpass
username=99999
password=<EXTENSION_PASSWORD_2>

[99999]
type=aor
max_contacts=2
```

<Note>
- Replace `<YOUR_SIP_TRUNK_ID>` and `<YOUR_SIP_TRUNK_PASSWORD>` with the SIP trunk credentials configured on the Wavix platform.
- Replace `<YOUR_NUMBER>` with the phone number purchased on your Wavix account.
- Use strong passwords instead of `<EXTENSION_PASSWORD_1>` and `<EXTENSION_PASSWORD_2>`.
</Note>

Verify the Wavix SIP trunk registration:

1. Reload the `chan_pjsip` module configuration using the following command: `asterisk -x "module reload chan_pjsip"`
2. Check the SIP trunk registration status using the following command: `asterisk -x "pjsip show registrations"`

## Enable IP Auth for the Wavix SIP trunk

You may wish to enable IP Authentication on Wavix SIP trunks. When IP Authentication is enabled, Wavix will accept all calls originating from a specified IP address without requiring login credentials.

<Note>
You must have a dedicated IP for this option to work correctly.
</Note>

To create a new SIP trunk with IP authentication on the Wavix platform:

1. In the top menu, navigate to Numbers & trunks and select Trunks
2. Click the Create new button
3. Under Authentication Method, select IP Authentication
4. Enter a public static IP address of your Asterisk PBX
5. Enter a SIP trunk Name and choose one of your account’s numbers as the Caller ID
6. Optionally, configure additional limits. If not specified, global account limits apply:
- Max outbound call duration
- Max number of simultaneous calls via the SIP trunk
- Max call cost
7. Click Create

<img
    src="./images/asterisk/fig4.png"
    alt="List of SIP Trunks in 3CX Management Console"
    className="mx-auto"
/>

Once you submit the request, the Wavix Support team will review and enable IP Authentication on the SIP trunk.

<Warning>
    After submitting the IP authentication request, you won’t be able to update your IP address or change the authentication method
</Warning>

<Note>
* When IP Authentication is enabled on a SIP trunk, it cannot be used as a destination for a DID. You must use a SIP URI instead
* After submitting the IP authentication request, you'll not be able to update your IP address or change the authentication method. By default, an IP address can only be mapped to a single SIP trunk. If you need to have several Wavix SIP trunks sharing the same IP address, please contact [support@wavix.com](mailto:support@wavix.com)
</Note>

### Configure IP Auth in Asterisk

This guide provides configuration instructions for both the `chan_pjsip` and `chan_sip` modules. Follow the instructions that correspond to the module used on your Asterisk PBX.

<Note>
The `chan_sip` module is deprecated and was officially removed in Asterisk version 21.
</Note>

For the purpose of this guide, we will use:
1. Internal Asterisk extensions: `11111` and `99999`
2. Primary gateway domain name: `nl.wavix.net`
3. Primary gateway IP address: `95.211.82.14`

<Note>
Choose the primary gateway with the lowest ping from your location. A full list of Wavix regional gateways is available at the bottom of the page:
https://app.wavix.com/trunks
</Note>

#### Configure the chan_sip module

To configure IP authentication on your Asterisk server:

1. Navigate to the Asterisk configuration directory: `/etc/asterisk/`
2. Open the `sip.conf` file for editing.
3. Add or modify the following configuration:

```ini
[general]
; Remove the 'register' line. SIP registration is not used for IP authentication.

disallow=all
allow=ulaw,alaw
nat=force_rport,comedia
canreinvite=no

[Wavix]
type=friend
host=nl.wavix.net
fromuser=<YOUR_NUMBER>
context=from-siptrunk
insecure=port,invite
canreinvite=no
disallow=all
allow=ulaw,alaw
qualify=yes
directmedia=no

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

[99999]
type=friend
username=99999
secret=<EXTENSION_PASSWORD_2>
host=dynamic
context=from-internal
disallow=all
allow=ulaw
nat=force_rport,comedia
canreinvite=no
qualify=yes
```
<Note>
- Replace `<YOUR_NUMBER>` with the phone number purchased on your Wavix account.
- Use strong passwords instead of `<EXTENSION_PASSWORD_1>` and `<EXTENSION_PASSWORD_2>`.
</Note>

Reload the `chan_sip` module configuration using the following command: `asterisk -x "sip reload"`


#### Configure the chan_pjsip module

To configure IP authentication on your Asterisk server:

1. Navigate to the Asterisk configuration directory: `/etc/asterisk/`
2. Open the `pjsip.conf` file for editing.
3. Add or modify the following configuration:

```ini
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
; Static contact for SIP trunk
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
match=sg.wavix.net
match=au.wavix.net
match=us.wavix.net

[reg_wavix]
type=registration
transport=transport-udp-main
outbound_auth=auth_wavix
server_uri=sip:nl.wavix.net:5060
client_uri=sip:<YOUR_SIP_TRUNK_ID>@nl.wavix.net:5060
expiration=120
retry_interval=20
max_retries=10

[11111]
type=endpoint
transport=transport-udp-main
context=from-internal
disallow=all
allow=ulaw,alaw
aors=11111
auth=11111

[11111]
type=auth
auth_type=userpass
username=11111
password=<EXTENSION_PASSWORD_1>

[11111]
type=aor
; Allow dynamic registration for endpoint 11111
max_contacts=2

[99999]
type=endpoint
transport=transport-udp-main
context=from-internal
disallow=all
allow=ulaw,alaw
aors=99999
auth=99999

[99999]
type=auth
auth_type=userpass
username=99999
password=<EXTENSION_PASSWORD_2>

[99999]
type=aor
; Allow dynamic registration for endpoint 99999
max_contacts=2
```
<Note>
- Replace `<YOUR_NUMBER>` with the phone number purchased on your Wavix account.
- Use strong passwords instead of `<EXTENSION_PASSWORD_1>` and `<EXTENSION_PASSWORD_2>`.
</Note>

Reload the `chan_pjsip` module configuration using the following command: `asterisk -x "pjsip reload"`

## Configure outbound calls in Asterisk

To configure outbound calls:

1. Navigate to the Asterisk configuration directory: `/etc/asterisk/`
2. Open the `extensions.conf` file for editing.
3. Depending on the module you use, `chan_sip` or `chan_pjsip`, add or modify the following configuration:

**For `chan_sip`:**

```ini
; Outbound calls via Wavix for chan_sip
exten => _X.,1,NoOp(Outbound call through Wavix SIP trunk)
same => n,Set(CALLERID(num)=<YOUR_NUMBER>)  ; Set the outbound Caller ID
same => n,Dial(SIP/${EXTEN}@Wavix,60)
same => n,Hangup()
```

**For `chan_pjsip`:**

```ini
; Outbound calls via Wavix for chan_pjsip
exten => _X.,1,Set(CALLERID(num)=<YOUR_NUMBER>) ; Set your outbound caller ID
same => n,Dial(PJSIP/${EXTEN}@Wavix,60,g)
same => n,Hangup()
```
<Note>
Provide the number you’ve purchased on your account instead of the `<YOUR_NUMBER>` variable.
</Note>

All destination phone numbers must be in the E.164 international format. This format can handle numbers with up to 15 digits and is usually written as [+][country code][subscriber number including area code]. For example, a US number in E.164 format would be +16561223344. The Wavix platform will reject calls to numbers without a country code or carrying national access codes.

| Country      | Number          | Reason                                      | Number in E.164 format |
|--------------|----------------|--------------------------------------------|-----------------------|
| US           | 6561223344     | No country code                             | +16561223344          |
| UK           | 020 1122 3344  | No country code, national access code with leading 0 | +442011223344         |
| Switzerland  | 0041797000777  | Leading 00 international prefix            | +41797000777          |

<Note>
The Caller ID can also be configured in `sip.conf` or `pjsip.conf`. However, the settings in the `extensions.conf` file will take precedence.
</Note>

To ensure proper audio transmission, **RTP ports 10000-20000** must be allowed from any IP address.:

1. Navigate to the Asterisk configuration directory: `/etc/asterisk/`
2. Open the `rtp.conf` file for editing.
3. Add or modify the following configuration:

```ini
[general]
rtpstart=10000
rtpend=20000
```
4. Save the file and restart your Asterisk using the following command: `sudo systemctl restart asterisk`

<Note>
Ensure that ports 10000-20000 are also allowed in your firewall to avoid connectivity issues.
</Note>

## Configure inbound calls on Wavix

If you have enabled IP authentication for your SIP trunk, scroll down to the [Configure inbound call routing for trunks with IP authentication](## Enable IP Auth for the Wavix SIP trunk) section.

Make sure that your Asterisk SIP trunk is registered with Wavix. If the trunk is not registered, ensure you’ve completed all the steps provided in the "Configure a SIP trunk in Asterisk" section.

1. Log in to your Wavix account
2. Navigate to **My numbers** under the **Numbers & trunks** in the top menu
3. Click on the three dots next to the number you want to edit (right-hand side) and select **Edit number**
4. Select the destination trunk in the **Destination** section
5. Click **Add** to add the destination for the phone number
6. Click **Save** to apply the settings

<img
  src="./images/asterisk/fig5.png"
  alt="Wavix phone number configuration"
  className="mx-auto"
/>

You can also edit multiple numbers simultaneously. To do this, select the multiple numbers you want to modify, then click the **Bulk actions** button. The changes will apply to all selected numbers.

### Configure inbound call routing for trunks with IP authentication

Skip this section if your trunks are configured to use digest authentication.

<Warning>
SIP trunks with IP authentication enabled cannot be used for inbound call routing, as they do not maintain registration with Wavix proxies. To set up inbound routing for your numbers, you must use a valid SIP URI address instead.
</Warning>

To configure inbound call routing to a valid SIP URI:

1. **Log in** to your Wavix account
2. Navigate to **My numbers** under the **Numbers & trunks** in the top menu
3. Click on the three dots next to the number you want to edit (right-hand side) and select **Edit number**
4. Select **SIP URI** in the **Transport** drop-down menu
5. **Enter a valid SIP URI** in the following format: `+[did]@FQDN:port;transport=connection`, where:
   - a. **FQDN** is the fully qualified domain name or IP address of your Asterisk PBX
   - b. **Port** is the SIP port used by the PBX
   - c.  **A connection** can be udp, tcp, or tls, with udp as the default transport
6. Click **Add** to set the destination for the phone number
7. Click **Save** to apply the settings

<Note>
The `[did]` parameter will be automatically updated with the actual dialed phone number when routing the call.
</Note>

## Configure inbound calls in Asterisk

This guide provides configuration instructions for both the `chan_pjsip` and `chan_sip` modules. Follow the instructions that correspond to the module used on your Asterisk PBX.

<Note>
The `chan_sip` module is deprecated and was officially removed in Asterisk version 21.
</Note>

### Configure the chan_sip module

To configure inbound calls on your Asterisk:

1. Navigate to the Asterisk configuration directory `/etc/asterisk/`
2. Open the `extensions.conf` file for editing
3. Add or modify the following configuration

```ini
[general]
static=yes
writeprotect=no
clearglobalvars=no

[globals]
; Define any global variables if needed

[from-internal]
exten => 1001,1,Dial(SIP/11111,20)
exten => 1002,1,Dial(SIP/99999,20)

[from-siptrunk]
; Handle inbound calls without the leading '+' sign
exten => <YOUR_NUMBER>,1,NoOp(Inbound call to <YOUR_NUMBER>)
same => n,Dial(SIP/11111,60)
same => n,Voicemail(1001@default,u)  ; Send to voicemail if the call is not answered
same => n,Hangup()

; Handle inbound calls with the leading '+' sign
exten => +<YOUR_NUMBER>,1,NoOp(Inbound call to <YOUR_NUMBER>)
same => n,Dial(SIP/11111,60)
same => n,Voicemail(1001@default,u)  ; Send to voicemail if the call is not answered
same => n,Hangup()

; Catch-All for Unknown or Invalid Calls
exten => _.,1,NoOp(Unknown inbound call received)
same => n,Hangup()
```

<Note>
Replace `<YOUR_NUMBER>` with the phone number purchased on your Wavix account.
</Note>

Make sure you reload your Asterisk configuration.

### Configure the chan_pjsip module

To configure inbound calls on your Asterisk:

1. Navigate to the Asterisk configuration directory `/etc/asterisk/`
2. Open the `pjsip.conf` file for editing
3. Add or modify the following configuration

```ini
[general]
static=yes
writeprotect=no
clearglobalvars=no

[globals]
; Define any global variables here if needed

[from-internal]
exten => 1001,1,Dial(PJSIP/11111,20)
exten => 1002,1,Dial(PJSIP/99999,20)

; Inbound Call Handling from Wavix
[from-siptrunk]
; Handle inbound calls without the leading '+' sign
exten => <YOUR_NUMBER>,1,Dial(PJSIP/11111,60)
; Send to voicemail if the call is not asnwered
same => n,Voicemail(1001@default,u)
same => n,Hangup()

; Handle inbound calls with the leading '+' sign
exten => +<YOUR_NUMBER>,1,Dial(PJSIP/11111,60)
; Send to voicemail if the call is not asnwered
same => n,Voicemail(1001@default,u)
same => n,Hangup()

; Catch-All for Unhandled Inbound Calls
exten => _X.,1,NoOp(Unknown inbound call received)
same => n,Hangup()
```

<Note>
Replace `<YOUR_NUMBER>` with the phone number purchased on your Wavix account.
</Note>

Make sure you reload your Asterisk configuration.

## Typical problems with outbound calls

* 603 Declined response might be received when calling the destination with the per-minute rate higher than the Max call rate set for your account. You can find your effective Max call rate on the Trunks page. Please contact support@wavix.com to request a change to your Max call rate.
* The destination phone number is in an incorrect format. Please make sure the number is dialed in the international E.164 format. Strip prefixes like 0, 00, or 011 before the dialed number if needed.
