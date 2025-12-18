---
title: "3CX SMS setup guide"
description: "This document explains how you can configure your 3CX in order to send and receive SMS and MMS messages with Wavix"
date: "Thu Sep 11 2025 01:00:00 GMT+0100 (Western European Summer Time)"
sidebarTitle: "3CX SMS"
---

import BuyNumber from '/snippets/buy-phone-number.mdx';
import enableSms from '/snippets/enable-sms-number.mdx';

## Register a sender ID

Before sending an SMS or MMS message, you need to activate a sender ID on the Wavix platform. A sender ID is the message sender details recipients will see on their devices. Sender IDs can be either numeric or alphanumeric, presenting your brand or service name.

<Warning>
You must use numeric sender IDs if you want to enable 2-way messaging service. For one-way SMS, you can use both numeric and alphanumeric sender IDs.
</Warning>

The steps below are only mandatory if you're planning to send messages using a U.S. or Canadian phone number as sender ID. If you will be using a mobile number from other countries or an alphanumeric sender ID, scroll down to the `Create a sender ID on the Wavix platform` section.

<BuyNumber />

### SMS-enable your number

<enableSms />

## Create a sender ID on the Wavix platform

To create a sender ID:

1. Select **SMS** in the top menu and click on **Sender IDs**
2. Then click add new Sender ID and select the Sender ID type, i.e. Alphanumeric or Numeric

<img
  src="./images/3cx-sms/fig3.png"
  alt="Sender ID name and type"
  className="mx-auto"
/>

An alphanumeric sender ID can be up to 11 characters long and can only include upper- and lower-case letters, digits from 0 through 9, and spaces. A numeric sender ID can be associated with an SMS-enabled number in your account only.

<Warning>
If you have chosen the numeric sender ID type but do not see any of your numbers in the sender ID drop-down list, make sure the number you are looking for is actually SMS-enabled.
</Warning>

3. Select country or countries you will be sending SMS to. Depending on the destination countries, additional restrictions for sender IDs may apply. Hover over the info icon next to the country name to see the details. If the sender ID type you've selected is not supported for the destination, the country will be greyed out.

<Note>
Alphanumeric sender IDs are not supported in a variety of countries, including the US and Canada, and may require pre-registration by local carriers in some others.
</Note>

<img
  src="./images/3cx-sms/fig4.png"
  alt="Destination countries"
  className="mx-auto"
/>

4. Review your sender ID and the list of destinations. Your sender ID will be automatically allow-listed in countries that do not require additional paperwork. A member of the Wavix provisioning team will reach out to you with additional information regarding the process of sender ID registration in countries that do.

## Configure SMS sender ID on your 3CX SIP trunk

<img
  src="./images/3cx-sms/fig5.png"
  alt="Add SMS Sender ID to 3CX SIP Trunk"
  style={{ width: "50%" }}
  className="mx-auto"
/>

To send and receive SMS and MMS messages you must have a 3CX SIP trunk connected to Wavix. See the 3CX SIP trunk setup guide for more details.

<Warning>
When adding a new SIP Trunk in 3CX you need to specify the previously created Sender ID in the field labeled **Main Trunk No.**
</Warning>

## Enable SMS on your 3CX SIP trunk

For your 3CX instance to send and receive messages, you need to add your Wavix account API key in the field labeled **Api Key** and set up **Default SMS endpoint** in your Wavix account.

Click on the registered SIP trunk in 3CX and then on the SMS tab.

<img
  src="./images/3cx-sms/fig6.png"
  alt="SIP Trunk SMS settings"
  className="mx-auto"
/>

1. Log in to your Wavix account at app.wavix.com
2. Click on the **My account** icon in the top-right corner and then click API keys.
3. Copy an active Wavix API key and paste it into the field **Api Key** in your 3CX.

<img
  src="./images/3cx-sms/fig7.png"
  alt="Wavix API key"
  className="mx-auto"
/>

<img
  src="./images/3cx-sms/fig8.png"
  alt="Wavix Default SMS endpoint"
  style={{ width: "50%" }}
  className="mx-auto"
/>

4. Copy Webhook URL from 3CX and paste it into the field **Default SMS endpoint** field in your Wavix account. Click **Save all**.
5. Click OK to save 3CX SIP Trunk configuration.

## Verify configuration

To test your 3CX setup send an SMS to your mobile phone number. Go to Users in the left-hand side menu, click on the default 100 extension and download a mobile application by scanning the QR code on the page. Log in to the app, go to the Chat tab and send an SMS.

<img
  src="./images/3cx-sms/fig9.png"
  alt="3CX extension"
  className="mx-auto"
/>

## Troubleshooting

If outbound SMS fails, check the following:
* You've completed all the steps in this guide
* The destination phone number is in the international E.164 format
* The sender ID you're using is allow-listed for the country you're sending the message to
