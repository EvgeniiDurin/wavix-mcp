---
title: "2FA API Overview"
description: "How to implement two-factor authentication using the Wavix 2FA API."
sidebarTitle: "Two-factor authentication"
keywords: ["two-factor authentication", "2FA", "one-time passwords", "OTP", "Wavix 2FA API"]
---

import createAccount from '/snippets/create-wavix-account.mdx';
import findApiKey from '/snippets/find-api-key.mdx';

<Note>
    The 2FA API is available exclusively for Flex Pro users.
</Note>

The Wavix 2FA API allows customers to generate one-time passwords (OTPs), send them via voice or SMS, validate the OTPs, and confirm if the validation was successful. Wavix also supports automatic channel failover to ensure OTP delivery. This means that if a verification code cannot be delivered via SMS, the platform would automatically place a call to deliver the code. Similarly, if a call fails, the platform would send an SMS with the OTP.  

By implementing the Wavix 2FA API, customers can add an extra security layer to their applications and services, helping to protect against fraud and unauthorized access. 

## How Wavix 2FA works

In order to use the Wavix 2FA API, you must create a Wavix 2FA Service. Each 2FA Service has the following parameters:
- The length of one-time passwords
- Active delivery channels: voice, SMS, or both
- Automatic failover which can be enabled or disabled
- End user's phone number validation can be enabled or disabled

You only need to create the Wavix 2FA Service once. You can use the same service to send and verify as many OTPs as needed.

<Note>
  When sending the OTP via voice, Wavix initiates an automated phone call to the end user's number. The end user must pick up the call to receive the OTP. Once the call is answered, the Wavix robot reads a message with the OTP in English.
</Note>

The general flow of how the Wavix 2FA works is outlined below:
1. An end user registers at or accesses your website or application and enters his or her phone number.
2. Your backend system initiates a call to the Wavix 2FA API to create a new 2FA Verification. You must specify the phone number to which the verification code will be sent and whether the code needs to be sent via a voice call or an SMS.
3. Once the 2FA Verification is created, the Wavix platform performs the following actions:
    * Generates a unique one-time password and sends it to the end user's phone number via the specified channel.
    * Generates a unique 2FA Verification ID and sends it back in the response.
5. The end user enters the received code on your website or app. 
6. To verify it, your backend system triggers another call to the Wavix 2FA API and passes the code along with the 2FA Verification ID.
7. The Wavix platform checks whether the code matches the latest OTP sent to the end user's phone number and sends back the verification results (success or failure).
8. In cases when the verification is successful, your backend system authorizes registration or access to the website or application.
9. In cases when the verification fails, your backend system should check the active 2FA Verification status using this API: 
    * If the status is either `expired` or `failed`, any further attempts to validate OTPs will result in an error. You must create a new 2FA Verification to send a new code. See point #2. 
    * Otherwise, request the end user to re-enter the code. You can also give him or her an option to request a new code using the same or a different communication channel.  

## Prerequisites
Before creating a Wavix 2FA Service and sending and verifying OTPs, you need to sign up for Wavix.

### Create a Wavix account

<createAccount />

### Find your API key

<findApiKey />

## How to create a 2FA service
Follow the below steps to create a Wavix 2FA Service:
1. [Sign in](https://app.wavix.com/) to your Wavix account.
2. Go to **Solutions** → **2FA**.
3. Select **Create new** to create a new 2FA Service:
     - Enter the **Service name** and choose the **code length**. Minimum code length is 4 digits, maximum is 10. The default value is 6 digits. 
     - Choose if you'd like to allow automatic phone number validation and channel failover. Wavix recommends allowing both options to improve code deliverability.
     - Choose the delivery channels you're planning to use, by enabling SMS, Voice, or both.
        * In order to use SMS as a delivery channel, select a Sender ID provisioned for the countries where you plan to send messages.
        * In cases when you plan to use voice calls, you must select a Caller ID. 
10. Select **Next** and then **Save and close** to complete the 2FA configuration.

<Info>
  If you want to fallback to voice calls when SMS delivery fails, you must enable **Channel failover** and select **Voice** as a delivery channel.
</Info>

<img
      src="./images/2fa/2fa-create-service.png"
      alt="2FA Service creation screenshot"
      title="2FA Service creation"
      style={{ width:"50%" }}
      className="mx-auto"
    />

Once the 2FA Service is created, you can optionally preview it in the app.

<Note>
  2FA Service ID is required for sending and verifying OTPs via the 2FA API. You can copy Service ID when creating a new 2FA Service or you can find it later in the list of 2FA Services on your account.
</Note>

## Wavix 2FA Service restrictions

The following limitations apply:

1. Each verification code is valid only for 5 minutes after being sent. Any attempt to validate the code after this 5-minute window will fail. 
2. After sending a verification code, you have a maximum of 5 attempts to validate it. In cases when you exceed this limit, 2FA Verification would fail. Additional attempts to validate the code or resend a new one within a failed 2FA Verification would not be permitted. 
3. Regardless of the communication channel used, you can send a maximum of 5 codes within a single 2FA Verification. Any attempt to send a 6th OTP will result in the ‘failed’ 2FA Verification status. 

## Step-by-step instructions

### How to send a verification code

To send a verification code, you must [create a 2FA Verification](/api-reference/2fa/create-a-new-2fa-verification) using the method below.  Once the 2FA Verification is created, Wavix automatically generates and sends an OTP to the specified phone number.

```http
POST https://api.wavix.com/v1/two-fa/verification
```

Request body example:
```json
{
   "service_id": "7204a030201211ee9fb47d093f2f127c",
   "to": "37128782931",
   "channel": "sms"
}
```

- `service_id` - unique identifier of the Wavix 2FA Service
- `to` - the end user's phone number to which the verification code will be sent
- `channel` - use `sms` to send the verification code via SMS or `voice` to trigger a voice call with the code

If successful, the method returns `HTTP 200 OK`. The response contains the created 2FA Verification details.

```json
{
   "success": true,
   "service_id": "7204a030201211ee9fb47d093f2f127c",
   "destination": "37128782931",
   "session_url": "https://api.wavix.com/v1/two-fa/verification/5f1a8680201511eeafdfcfc3dedfac51",
   "session_id": "5f1a8680201511eeafdfcfc3dedfac51",
   "created_at": "2023-07-11T18:04:25.786Z",
   "number_lookup": {
      "number_type": "mobile",
      "country": "LV",
       "current_carrier": "Latvijas Mobilais Telefons"
   }
}

```
- `success` - indicates whether 2FA Verification was successfully created
- `service_id` - unique identifier of the Wavix 2FA Service
- `destination` - the end user's phone number
- `session_url` - automatically generated 2FA Verification URL. You can use the URL to validate the OTP and, optionally, to resend the verification code.
- `session_id` - unique identifier of the Wavix 2FA Verification
- `created_at` - date and time the 2FA Verification was created
- `number_lookup` - extended information about the destination phone number:
    - `number_type` - the destination phone number type
    - `country` - the destination phone number's 2-letter ISO country code
    - `current_carrier` - the carrier network the phone number currently belongs to

<Note> 
  The `number_lookup` details are only returned if the **Number validation** option is activated for the 2FA Service.
</Note>

When an end user requests to [resend the verification code](/api-reference/2fa/resend-a-2fa-verification) to the same phone number, use the method below

```http
POST https://api.wavix.com/v1/two-fa/verification/uuid
```
- `uuid` - Wavix 2FA Verification ID

Request body example:
```json
{
   "channel": "voice"
}
```
- `channel` - use `sms` to resend the verification code via SMS or `voice` to trigger a voice call with a new code

If successful, the method returns `HTTP 200 OK`. The response indicates whether the code was successfully sent, the date and time the code was sent, and the communication channel used.  

```json
{
   "success": true,
   "channel": "voice",
   "destination": "37128782931",
   "created_at": "2023-07-11T18:10:14.106Z"
}
```
- `success` - indicates whether the OTP successfully sent
- `channel` - contains `sms` in cases when the code was sent via an SMS or `voice` when a voice call with the code was placed
- `destination` - the end user's phone number
- `created_at` - date and time the code was sent

### How to validate an OTP
In order to [validate an OTP](/api-reference/2fa/validate-a-code) entered by an end user, use the method below

```http
POST https://api.wavix.com/v1/two-fa/verification/{uuid}/check
```
- `uuid` - Wavix 2FA Verification ID

Request body example:
```json
{
   "code": "749503"
}
```

- `code` - the code entered by the end user

If successful, the method returns `HTTP 200 OK`. The response contains the validation results.  

```json
{
    "is_valid": true
}
```
- `is_valid` - indicates whether the verification code was successfully validated

### How to cancel a 2FA Verification
You can [explicitly cancel the 2FA Verification](/api-reference/2fa/cancel-a-2fa-verification). Once the verification is canceled, no further codes would be sent and you wouldn’t be able to validate any of the codes sent previously. To send a new code you’d need to create a new Verification.

In order to cancel the 2FA Verification use the method below

```http
PATCH https://api.wavix.com/v1/two-fa/verification/{uuid}/cancel
```
- `uuid` - Wavix 2FA Verification ID

The method takes no parameters. 

If successful, the method returns an empty response with the “HTTP 204 No content” status code. 

### How to query 2FA service logs
The Wavix 2FA API allows customers to [retrieve a list of active 2FA Verifications](/api-reference/2fa/list-active-2fa-verifications) and events associated with each 2FA Verification.

To get a list of active 2FA Verifications, use the method below

```http
GET https://api.wavix.com/v1/two-fa/service/{service_id}/sessions?from=start_date&to=end_date
```
- `service_id` - unique identifier of the Wavix 2FA Service
- `from` - start date of the search time range in the `yyyy-mm-dd` format
- `to` - end date of the search time range in the `yyyy-mm-dd` format


All parameters are mandatory and cannot be blank. 

If successful, the method returns the “HTTP 200 OK” status code. The response contains a list of 2FA Verifications associated with the 2FA Service that match the filter criteria. 
```json
[
  {
     "created_at": "2023-07-11T18:04:25.000Z",
     "session_id": "5f1a8680201511eeafdfcfc3dedfac51",
     "phone_number": "37128782931",
     "destination_country": "LV",
     "status": "expired",
     "charge": "0.0840",
     "service_id": "7204a030201211ee9fb47d093f2f127c",
     "service_name": "2FA Service"
   },
   {
     "created_at": "2023-07-11T18:23:40.000Z",
     "session_id": "0f808950201811ee80150bc974caeda3",
     "phone_number": "37128782931",
     "destination_country": "LV",
     "status": "verified",
     "charge": "0.1061",
     "service_id": "7204a030201211ee9fb47d093f2f127c",
     "service_name": "2FA Service"
   },
   {
     "created_at": "2023-07-11T18:24:42.000Z",
     "session_id": "34246b50201811eeafdfcfc3dedfac51",
     "phone_number": "37128782931",
     "destination_country": "LV",
     "status": "canceled",
     "charge": "0.0562",
     "service_id": "7204a030201211ee9fb47d093f2f127c",
     "service_name": "2FA Service"
   }
]
```
- created_at - date and time the Wavix 2FA Verification was created
- session_id - unique identifier of the Wavix 2FA Verification
- phone_number - an end user's phone number
- destination_country - 2-letter ISO code of a country the destination phone number belongs to
- status - 2FA Verification status. Can be one of the below:
    - `verified` - indicates the sent code was successfully verified
    - `expired` - indicates the 2FA Verification expired
    - `canceled` - indicates the 2FA Verification was explicitly canceled
    - `failed` - indicates that all validation attempts were unsuccessful 
- charge - total charge for the 2FA Verification, in USD
- service_id - unique identifier of the Wavix 2FA Services the Verification is associated with 
- service_name - the Wavix 2FA Service name

To get [a list of events associated with a 2FA Verification](/api-reference/2fa/list-wavix-2fa-verification-events), use the method below:
```http
GET https://api.wavix.com/v1/two-fa/session/{session_uuid}/events
```
- `session_uuid` - Wavix 2FA Verification ID

If successful, the method returns `HTTP 200 OK`. The response contains a list of events associated with the 2FA Verification

```json
[
   {
      "created_at": "2023-07-11T18:23:40.000Z",
      "event": "Number lookup",
      "status": "success",
      "charge": "0.0040",
      "error": null
   },
   {
      "created_at": "2023-07-11T18:23:47.000Z",
      "event": "Code sent via SMS",
      "status": "delivered",
      "charge": "0.0522",
      "error": null
   },
   {
      "created_at": "2023-07-11T18:24:33.000Z",
      "event": "Verification",
      "status": "success",
      "charge": "0.0500",
      "error": null
   }
]
```
- `created_at` - date and time of the event
- `event` - human readable event description. Can contain one of the below values:
    - `Number lookup` - indicates that the Wavix platform checked if the destination phone number was valid. You'd only see the event when the **Number validation** option was activated for your 2FA Service
    - `Code sent via SMS` - indicates the OTP was sent using SMS as a communication channel
    - `Code sent via voice` -  indicates the OTP was sent using voice as a communication channel
    - `Verification` - indicates the OTP verification attempt
- `status` - status of the event. It can be any of the following: `delivered`, `success`, `failed`, or `pending`.
- `charge` - the cost of an action associated with the event, in USD
- `error` - error description, if any
