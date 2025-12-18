---
title: "Send SMS messages"
description: "Send, manage, and track SMS and MMS messages using the Wavix Messaging API, including sender ID registration and message delivery."
sidebarTitle: "Send messages"
---

## Prerequisites

- Before you can use the Wavix Messaging API, you need to [create a Wavix account](/getting-started/create-account).
- You also need to [create or get your API key](/api-reference/get-your-api-key).

## Sender ID registration

A sender ID is the message sender detail that recipients see on their devices. Sender IDs can be numeric or alphanumeric, presenting a brand or service name. Before you send an SMS message, register a numeric or alphanumeric sender ID on the Wavix platform.

**Alphanumeric sender ID:**
- Must be between 3 and 11 characters long.
- Can contain uppercase and lowercase ASCII letters, digits, hyphen (-), plus (+), underscore (_), ampersand (&), and space.
- Should not contain only digits.

**Numeric sender ID:**
- Must be an SMS-enabled DID on your account.
- Third-party numbers and DIDs that do not support inbound SMS cannot be used as a sender ID.

You can register sender IDs in the [app](https://app.wavix.com) or by using the API.

## Register a sender ID using the app

<Steps>
  <Step title="Access Sender ID registration">
    1. [Sign in](https://app.wavix.com) to your Wavix account.
    2. In the top menu, select **SMS** → **Sender IDs**.
    3. Select **Create new**.
  </Step>
  <Step title="Select Sender ID type">
    - Select **Alphanumeric** to use a brand or service name as your sender ID.
    - Select **Numeric** to use a phone number as your sender ID.
    Then select **Next**.
    <img
      src="./images/sms/sms-create-senderid-type.png"
      alt="Sender ID registration (type) screenshot"
      title="Sender ID registration (type)"
      style={{ width:"70%" }}
      className="mx-auto"
      />
  </Step>
  <Step title="Select destination countries">
    Select your destination countries. Sender ID regulation varies by country and sender ID type; some destinations may be unavailable. Then select **Next**.
    <img
      src="./images/sms/sms-create-senderid-destination.png"
      alt="Sender ID registration (destinations) screenshot"
      title="Sender ID registration (destinations)"
      style={{ width:"70%" }}
      className="mx-auto"
    />
  </Step>
  <Step title="Select use case">
    Select your use case for messaging. Options include Promotional, Transactional, or Authentication. Enter your sender ID name, estimate your monthly message volume, and provide sample messages you plan to send.
    Then select **Next**.
    <img
      src="./images/sms/sms-create-senderid-usecase.png"
      alt="Sender ID registration (use case) screenshot"
      title="Sender ID registration (use case)"
      style={{ width:"70%" }}
      className="mx-auto"
    />
  </Step>
  <Step title="Summary and confirmation">
    Review the sender ID, type, and destination countries. Your sender ID will be automatically allow-listed for countries where no additional paperwork is required. Countries that require manual registration will be highlighted.
    Select **Confirm**.
    You can immediately start sending messages to countries that do not require manual sender ID registration.
  </Step>
</Steps>

## Register a sender ID using the API

Sender ID regulations vary by country. You can register a sender ID using the API only in countries where it can be provisioned in self-service mode. To check if a numeric or alphanumeric sender ID can be registered in self-service mode for a particular country, use:

```http
GET https://api.wavix.com/v3/messages/sender_ids/restrictions?country=country_code&type=sender_type&appid=your_api_key
```

- `country_code`: 2-letter ISO code of the country
- `sender_type`: Sender ID type, can be either numeric or alphanumeric

All parameters are required.

If successful, the method returns the `HTTP 200 OK` status code. The response body indicates if a numeric or an alphanumeric sender ID can be registered in self-service mode in the country.

```json
{
    "self_service": true
}
```

If the `self_service` attribute value is `true`, the sender ID can be registered using this API. Otherwise, the sender ID needs to be created using the [app](https://app.wavix.com) and go through the review or registration procedure.

To [register a new sender ID](/api-reference/sms-and-mms/create-a-new-sender-id), use the following method:

```http
POST https://api.wavix.com/v3/messages/sender_ids?appid=your_api_key
```

Paste the following JSON in the request body:

```json
{
    "sender_id": "1313xxxxxxx",
    "countries": [
        "US"
    ],
    "type": "numeric"
}
```

- `sender_id`: the name of the sender ID
- `countries`: an array of countries the sender ID needs to be registered in
- `type`: sender ID type

If successful, the method returns the `HTTP 200 OK` status code. The response body contains the sender ID details.

```json
{
   "id": "94b319e0-8277-4efa-b7ec-d6e0e255ddaf",
   "allowlisted_in": [
       "US"
   ],
   "sender_id": "1313xxxxxxx",
   "type": "numeric"
}
```

- `id`: system-generated unique ID of the sender ID
- `allowlisted_in`: an array of countries the sender ID is automatically provisioned
- `sender_id`: name of the sender ID
- `type`: sender ID type

## Get a list of sender IDs on the account

To [get a list of sender IDs](/api-reference/sms-and-mms/list-sender-ids), use the following method. This method does not require any parameters.

```http
GET https://api.wavix.com/v3/messages/sender_ids?appid=your_api_key
```

If successful, the method returns the “HTTP 200 OK” status code. The response body contains an array of sender IDs provisioned on the account and their details.

```json
{
   "items": [
       {
           "id": "5108c63f-af4d-4852-88e0-ce06e82db5d3",
           "allowlisted_in": [
               "GB",
               "FR"
           ],
           "sender_id": "Wavix",
           "type": "alphanumeric"
       },
       {
           "id": "94b319e0-8277-4efa-b7ec-d6e0e255ddaf",
           "allowlisted_in": [
               "US",
               "CA" 
           ],
           "sender_id": "1313xxxxxxx",
           "type": "numeric"
       }
   ]
}
```

- `id`: unique ID of the sender ID
- `allowlisted_in`: an array of countries the sender ID is automatically provisioned
- `sender_id`: the name of the sender ID
- `type`: sender ID type

## Delete a sender ID

To [delete a sender ID](/api-reference/sms-and-mms/delete-a-sender-id), use the following method:

```http
DELETE https://api.wavix.com/v3/messages/sender_ids/id?appid=your_api_key
```

- `id`: unique ID of the sender ID

If successful, the method returns the `HTTP 204 No Content` status code without the response body.

## Send a message

To [send an SMS or MMS message](/api-reference/sms-and-mms/send-sms-or-mms-message), use the following method:

```http
POST https://api.wavix.com/v3/messages?appid=your_api_key
```

Paste the following JSON in the request body:

```json
{
   "from": "SenderID",
   "to": "1686xxxxxxx",
   "message_body": {
       "text": "Message text.",
       "media": ["https://publicly-available-resource.com/media"]
   }
}
```

- `from`: the sender ID to be used to send an SMS, must be a registered sender ID on your account.
- `to`: a subscriber to send the message to, must be a properly formatted phone number in E.164 format.
- `message_body.text`: the text of the SMS message to be sent.
- `message_body.media`: an array of URLs to media files to be included in the message attachments. In case the parameter is specified and its value is different from `null`, the message will be sent as MMS. The URLs must point to publicly available resources.

All parameters are required.

If successful, the service returns the `HTTP 201 Created` status code. The response body contains the sent message details.

Response example:

```json
{
  "message_id": "871b4eeb-f798-4105-be23-32df9e991456",
  "message_type": "mms",
  "from": "13137890021",
  "to": "13137890021",
  "mcc": "301",
  "mnc": "204",
  "message_body": {
    "text": "This is an MT message",
    "media": ["https://publicly-available-resource.com"]
  },
  "tag": null,
  "status": "accepted",
  "segments": 1,
  "charge": "0.02",
  "submitted_at": "2022-04-14T13:51:16.096Z",
  "sent_at": null,
  "delivered_at": null,
  "error_message": null
}
```

## Get message details

To get the message details, including delivery status, use the following method:

```http
GET https://api.wavix.com/v3/messages/{{message_id}}?appid=your_api_key
```

- `message_id`: the unique identifier of the message on the Wavix platform for which the details are requested.

If successful, the service returns the `HTTP 200 OK` status code. The response body contains the message details.

Response example:

```json
{
  "message": {
    "direction": "outbound",
    "message_id": "871b4eeb-f798-4105-be23-32df9e991456",
    "message_type": "mms",
    "from": "13137890021",
    "to": "13137890021",
    "mcc": "301",
    "mnc": "204",
    "message_body": {
      "text": "This is an MT message",
      "media": ["https://publicly-available-resource.com"]
    },
    "tag": "1234",
    "status": "delivered",
    "segments": 1,
    "charge": "0.02",
    "submitted_at": "2022-04-14T13:51:16.096Z",
    "sent_at": "2022-04-14T13:51:16.096Z",
    "delivered_at": "2022-04-14T13:51:16.096Z",
    "error_message": null
  }
}
```

For outbound messages, the status attribute indicates the delivery status of the message.

## Unsubscribe a recipient

If you need to [unsubscribe a recipient](/api-reference/sms-and-mms/unsubscribe-a-phone-number-from-sms-messages) from receiving SMS or MMS messages, use the following method:

```http
POST https://api.wavix.com/v3/messages/opt_outs?appid=your_api_key
```

Paste the following JSON in the request body:

```json
{
   "sender_id": "1716xxxxxxx",
   "phone_number": "1686xxxxxxx"
}
```

- `sender_id`: sender ID of which the phone number will be opted out. If not specified, the phone number will be opted out of all SMS messages.
- `phone_number`: the phone number to be opted out

If successful, the service returns the `HTTP 204 No Content` status code.