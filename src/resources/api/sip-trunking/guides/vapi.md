---
title: "Connect Vapi voice AI agents with Wavix"
description: "This guide explains how to connect Vapi AI agents with Wavix voice infrastructure to place and receive calls."
sidebarTitle: "Vapi"
keywords: ["Vapi", "Vapi AI voice agent", "Vapi SIP trunk", "Wavix SIP trunking", "Wavix phone numbers", "Wavix inbound calls", "Wavix outbound calls"]
---

import BuyNumber from '/snippets/buy-phone-number.mdx';
import CreateSipTrunk from '/snippets/create-sip-trunk-lvl3.mdx';

<BuyNumber />

## Receive calls with Wavix and Vapi

<CreateSipTrunk />

### Create SIP trunk credentials in Vapi

1. **Sign in** to your Vapi account.
2. Go to **API Keys**.
3. Copy your **Private Key**.
4. Run the POST request below using your favorite tool, such as Postman or terminal.

```bash
curl -L 'https://api.vapi.ai/credential' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer YOUR_VAPI_PRIVATE_KEY' \
-d '{
    "provider": "byo-sip-trunk",
    "name": "Wavix",
    "gateways": [
        {
            "ip": "95.211.82.14"
        },
        {
            "ip": "209.58.144.243"
        },
        {
            "ip": "173.234.106.26"
        },
        {
            "ip": "23.108.101.90"
        }

    ],
    "outboundLeadingPlusEnabled": true,
    "outboundAuthenticationPlan": {
        "authUsername": "YOUR_SIP_TRUNK_ID",
        "authPassword": "YOUR_SIP_TRUNK_PASSWORD"
    }
}'
```
   - Replace `YOUR_SIP_TRUNK_ID`  and `YOUR_SIP_TRUNK_PASSWORD`  with the SIP trunk credentials configured at Wavix.
   - Replace `YOUR_VAPI_PRIVATE_KEY` with your Vapi Private Key.

<Note>
  Make sure you list all Wavix regional gateway IP addresses in the ‘gateways’ array. Failed to do so may result in your calls being rejected with 401 Unauthorized error.  A full list of regional gateways is shown at the bottom of the Trunks page in the [Wavix Customer portal](https://app.wavix.com/trunks).
</Note>

If successful, the response will contain the SIP trunk credentials `id`. Copy it for later use. 

```bash highlight={2}
{
    "id": "00000000-c5c6-4f68-bb6d-000000000000",
    "orgId": "00000000-b275-4b33-9dd2-000000000000",
    "provider": "byo-sip-trunk",
    "createdAt": "2025-10-13T10:56:17.439Z",
    "updatedAt": "2025-10-13T10:56:17.439Z",
    "gateways": [
    ],
    "name": "Wavix",
    "outboundLeadingPlusEnabled": true
}
```

<Info>
  Learn more about Vapi SIP trunks in the [Vapi SIP trunk documentation](https://docs.vapi.ai/advanced/sip/sip-trunk).
</Info>

### Associate a phone number with the SIP trunk
To link your Wavix phone number to the SIP trunk credential in Vapi, you need to create a Phone Number resource. Run the POST request below using your favorite tool, such as Postman or terminal.
```bash
curl -X POST "https://api.vapi.ai/phone-number" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_VAPI_PRIVATE_KEY" \
  -d '{
    "provider": "byo-phone-number",
    "name": "Wavix Number",
    "number": "YOUR_WAVIX_PHONE_NUMBER",
    "numberE164CheckEnabled": false,
    "credentialId": "YOUR_VAPI_CREDENTIAL_ID"
  }'
'
```
   - Replace `YOUR_WAVIX_PHONE_NUMBER` with a number on your Wavix account and `YOUR_VAPI_CREDENTIAL_ID` with your Vapi SIP trunk credentials created earlier.
   - Replace `YOUR_VAPI_PRIVATE_KEY` with your Vapi Private Key.

<Note>
    Make sure `YOUR_WAVIX_PHONE_NUMBER` contains the leading '+' sign, i.e., `+61290597521`.
</Note>

If successful, the phone number will appear in your Vapi account. 

<img
  src="./images/vapi-number.png"
  alt="Phone numbers in your Vapi account"
  title="Vapi number"
  style={{ width:"100%" }}
  className="mx-auto"
/>

To assign an AI assistant to the phone number:
1. **Sign in** to your Vapi account.
2. Go to **Phone Numbers**.
3. Scroll down to **Inbound Settings** and associate an assistant with the number.

### Setup inbound call routing on Wavix
Wavix can route inbound calls to a SIP trunk on the platform, SIP URI, or forward them to a phone number. Vapi requires calls to be routed to a SIP URI. 

To route calls to your Wavix number to the Vapi SIP URI: 
1. In Wavix, open **Numbers & trunks → My numbers**.
2. Select your number by clicking the **⋯** menu → **Edit number**.
3. Set the **inbound call destination type** to **SIP URI**, and enter the destination in the format of:

```bash
[did]@YOUR_VAPI_CREDENTIAL_ID.sip.vapi.ai
```
In the example above, it would be:
```bash
[did]@00000000-c5c6-4f68-bb6d-000000000000.sip.vapi.ai
```

4. **Save** your changes.


Now, all calls to your Wavix number are routed to your Vapi AI assistant. 

##  Place calls with Wavix and Vapi

To place an outbound call, you'll need a Vapi **Assistant ID** and Vapi **Phone Number ID**.

<AccordionGroup>
  <Accordion title="Assistant ID">
    1. In Vapi, open **Assistants**.
    2. Select an assistant you want to use and copy the assistant ID.
        <img
            src="./images/vapi-assistant-id.png"
            alt="Assistants in your Vapi account"
            title="Vapi Assistant ID"
            style={{ width:"100%" }}
            className="mx-auto"
        />
   </Accordion>
  <Accordion title="Number ID">
    1. In Vapi, open **Phone Numbers**.
    2. Select a number you want to use as Caller ID and copy the number ID.
        <img
            src="./images/vapi-number-id.png"
            alt="Phone numbers in your Vapi account"
            title="Vapi Number ID"
            style={{ width:"100%" }}
            className="mx-auto"
        />
   </Accordion>
</AccordionGroup>   

You can place outbound calls with Vapi using API. Run the POST request below using your favorite tool, such as Postman or terminal.
```bash
curl -L 'https://api.vapi.ai/call/phone' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer YOUR_VAPI_PRIVATE_KEY' \
-d '{
  "assistantId": "YOUR_VAPI_ASSISTANT_ID",
  "customer": {
    "number": "DESTINATION_NUMBER",
    "numberE164CheckEnabled": true
  },
  "phoneNumberId": "YOUR_VAPI_NUMBER_ID"
}
'
```

- Replace `YOUR_VAPI_ASSISTANT_ID` with your **Vapi Assistant ID** and `YOUR_VAPI_NUMBER_ID` with your Vapi **Phone Number ID**.
- Replace `YOUR_VAPI_PRIVATE_KEY` with your Vapi **Private Key**.
- Replace the `DESTINATION_NUMBER` with a phone number you want to call. Make sure the phone number is provided in the international E.164 format with or without the leading `+` sign. 

If successful, the Vapi places a call to the destination number. 

<Info> 
    Learn more about Vapi outbound calls in the [Vapi outbound calling documentation](https://docs.vapi.ai/calls/outbound-calling).
</Info>



## Transfer calls between Vapi and Wavix

Wavix supports <Tooltip tip="A cold transfer means the call is transferred without notifying or speaking to the new recipient">cold transfers</Tooltip> using the `SIP REFER` command. To transfer a call, you need two Wavix numbers, one for an active call and one to receive the transferred call. Make sure inbound call routing is set up on the second number.

To enable call transfers with Vapi, you'll need:
1. Create and configure a **Transfer Call** tool.
2. Associate the tool with your Vapi assistant.

### Configure Transfer Call
To configure the Transfer Call tool:
1. In your Vapi account, select **Tools**.
2. Select **+ Create Tool**, choose **Transfer Call**, and enter a name for the tool.
3. Under **Destinations**, select **+ Add Destination**, then choose **SIP**.
4. In the SIP URI field, enter the address in this format:`[YOUR_WAVIX_NUMBER]@[WAVIX_SIP_GATEWAY]`. Example: `sip:14067704205@us.wavix.net`.
5. In the **Message to Customer** field, enter the message to speak to the customer before the transfer.
6. Provide additional details to help the AI decide when to use this destination.
7. In **Transfer Mode**, make sure **Blind Transfer** is selected.
8. Select **Save**. 


Replace `YOUR_WAVIX_NUMBER` with your Wavix number and `WAVIX_SIP_GATEWAY` with one of the Wavix's SIP gateway.

<Tip>
  Choose the primary Wavix gateway with the lowest ping from your location. A full list of regional gateways is shown at the bottom of the Trunks page in the [Wavix Customer portal](https://app.wavix.com/trunks).
</Tip>

        <img
            src="./images/vapi-transfer.png"
            alt="Configure a Transfer Call tool in your Vapi account"
            title="Transfer Call tool"
            style={{ width:"100%" }}
            className="mx-auto"
        />

<Info>
  Learn more about Vapi call transfer in the [Vapi call forwarding documentation](https://docs.vapi.ai/call-forwarding).
</Info>

## Troubleshooting

- **603 Declined** can occur if the destination's per‑minute rate is higher than your account's Max call rate (check the value on the Trunks page). Contact [**support@wavix.com**](mailto:support@wavix.com) to request a change if needed.
- **Wrong number format**. Dial the full international E.164 number, e.g. `19085594899` (US) or `4408001218915` (UK). Do not dial local formats like `9085594899`. Strip prefixes like `0`, `00`, or `011` before the dialed number.