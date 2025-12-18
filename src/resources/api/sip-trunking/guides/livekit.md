---
title: "Connect LiveKit AI voice agent with Wavix"
description: "This guide explains connecting LiveKit AI voice agents with Wavix voice infrastructure to place and receive calls."
sidebarTitle: "LiveKit"
keywords: ["LiveKit", "LiveKit AI voice agent", "LiveKit SIP trunk", "Wavix SIP trunking", "Wavix phone numbers", "Wavix inbound calls", "Wavix outbound calls"]
---

import BuyNumber from '/snippets/buy-phone-number.mdx';
import CreateSipTrunk from '/snippets/create-sip-trunk.mdx';

<BuyNumber />

## Receive calls with Wavix and LiveKit

### Create LiveKit inbound trunk

1. **Sign in** to your LiveKit project.
2. In the left-hand side menu, select **Telephony → Configuration**.
3. Select **Create new** and choose **Trunk**.
4. Enter a **comma‑separated list** of Wavix numbers to associate with this trunk.

<img
  src="./images/livekit-img1.png"
  alt="Configure LiveKit telephony screenshot"
  style={{ width:"50%" }}
  className="mx-auto"
/>

<Info>
  For instructions on creating a LiveKit inbound trunk using the CLI or code, see the [LiveKit documentation](https://docs.livekit.io/sip/trunk-inbound/).
</Info>

### Create a dispatch rule

Dispatch rules determine how inbound calls are routed to LiveKit rooms.

1. Click **Create new**  and select **Dispatch rule**.
2. (Optional) Under **Match trunks**, associate the rule with a specific trunk; otherwise, it applies to all inbound calls in the project.

<img
  src="./images/livekit-img2.png"
  alt="LiveKit dispatch rule screenshot"
  title="Create a dispatch rule"
  style={{ width:"50%" }}
  className="mx-auto"
/>

<Info>
  For more information about dispatch rules and instructions for creating them using the LiveKit CLI or code, see the [LiveKit documentation](https://docs.livekit.io/sip/dispatch-rule/).
</Info>

### Set up inbound call routing on Wavix

Wavix can route inbound calls to a SIP trunk on the platform, SIP URI, or forward them to a phone number. LiveKit requires calls to be routed to a **SIP URI**.

1. In your LiveKit project, go to **Settings → Project**.
2. Copy the value from **SIP URI** (e.g., `sip:2mpbww13htk.sip.livekit.cloud`).

<img
  src="./images/livekit-img3.png"
  alt="LiveKit SIP URI screenshot"
  title="LiveKit SIP URI"
  style={{ width:"50%" }}
  className="mx-auto"
/>

To route calls from your Wavix number to the LiveKit platform:

1. In Wavix, open **Numbers & trunks → My numbers**.
2. Select your number by clicking the **⋯** menu → **Edit number**.
3. Set the **inbound call destination type** to **SIP URI**, and enter the destination in the format of:

```bash
[did]@[LIVEKIT_SIP_URI]
```

In the example above, it would be:

```bash
[did]@2mpbww13htk.sip.livekit.cloud
```

4. **Save** your changes.

<Note>
  Make sure you entered the correct LiveKit SIP URI.
</Note>

Now, all calls to your Wavix number are routed to your LiveKit AI project. Deploy a LiveKit agent to answer the calls. Check the [LiveKit recipes](https://docs.livekit.io/recipes/) for voice AI and LiveKit Agent use cases.

<Note>
  You can choose to encrypt call media. To enable encryption on your Wavix numbers, contact [support@wavix.com](mailto:support@wavix.com) and provide a list of numbers.
</Note>

## Place calls with Wavix and LiveKit

To place outbound calls, you need both a **Wavix SIP trunk** and a **LiveKit outbound trunk**.

<CreateSipTrunk />

### Create an outbound trunk on LiveKit

1. **Sign in** to your LiveKit account.
2. Go to **Telephony** → **Configuration**.
3. Select **Create new** and replace the following variables:
   - Replace `YOUR_SIP_TRUNK_ID`  and `YOUR_SIP_TRUNK_PASSWORD`  with the SIP trunk credentials configured at Wavix.
   - Replace `61290597521`  with the phone number purchased at Wavix.

<img
  src="./images/livekit-img5.png"
  alt="LiveKit new trunk screenshot"
  style={{ width:"50%" }}
  title="LiveKit - Create a new trunk"
  className="mx-auto"
/>

<Info>
  For instructions on creating a LiveKit outbound trunk using the CLI or code, see the [LiveKit documentation](https://docs.livekit.io/sip/trunk-outbound/).
</Info>

<Note>
  You can encrypt call media on your Wavix trunk. Contact [support@wavix.com](mailto:support@wavix.com) and provide your SIP trunk ID.
</Note>

You've connected LiveKit with Wavix and now can place outbound calls. Check the [LiveKit recipes](https://docs.livekit.io/recipes/) for voice AI and LiveKit Agent use cases.

## Transfer a call

Wavix supports <Tooltip tip="A cold transfer means the call is transferred without notifying or speaking to the new recipient">cold transfers</Tooltip> using the `SIP REFER` command. To transfer a call, you need two Wavix numbers, one for an active call and one to receive the transferred call. Make sure inbound call routing is set up on the second number.

To transfer an active LiveKit call, use the **TransferSIPParticipant** server API:

```ts
import { SipClient } from 'livekit-server-sdk';
// ...
async function transferParticipant(participant) {
  console.log("transfer participant initiated");
  const sipTransferOptions = {
    playDialtone: false
  };

  const sipClient = new SipClient(process.env.LIVEKIT_URL,
                                  process.env.LIVEKIT_API_KEY,
                                  process.env.LIVEKIT_API_SECRET);

  const transferTo = "sip:+<YOUR_WAVIX_NUMBER>@<WAVIX_SIP_GATEWAY>"; // e.g., sip:+61290597520@au.wavix.net

  await sipClient.transferSipParticipant('open-room', participant.identity,
                                          transferTo, sipTransferOptions);
  console.log('transfer participant');
}
```

Replace transfer_destination with your Wavix number. Use the following format`sip:+[YOUR_WAVIX_NUMBER]@[WAVIX_SIP_GATEWAY]` . Example: `sip:+61290597520@au.wavix.net`

<Tip>
  Choose the primary Wavix gateway with the lowest ping from your location. A list of regional gateways is shown at the bottom of the Trunks page in the [Wavix console](https://app.wavix.com/trunks).
</Tip>

<Info>
  Learn more about LiveKit call transfer in the [LiveKit documentation](https://docs.livekit.io/sip/transfer-cold/).
</Info>

## Troubleshooting

- **603 Declined** can occur if the destination's per‑minute rate is higher than your account's Max call rate (check the value on the Trunks page). Contact [**support@wavix.com**](mailto:support@wavix.com) to request a change if needed.
- **603 Declined** can also occur if there is no active registration on your SIP trunk. Verify registration status as described above.
- **Wrong number format**. Dial the full international E.164 number, e.g. `19085594899` (US) or `4408001218915` (UK). Do not dial local formats like `9085594899`. Strip prefixes like `0`, `00`, or `011` before the dialed number.