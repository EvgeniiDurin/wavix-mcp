---
title: "Call transcription with Speech Analytics API"
description: "How to use the Wavix Speech Analytics API to search call transcriptions for keywords."
sidebarTitle: "Call transcription"
keywords: ["speech analytics","call transcription","call recording","call search","call keywords"]
---

import createAccount from '/snippets/create-wavix-account.mdx';
import findApiKey from '/snippets/find-api-key.mdx';

<Note>
    The Wavix Speech Analytics API is available exclusively for Flex Pro users.
</Note>

The Wavix Speech Analytics API supports two ways to transcribe phone calls:

1. Transcribe an active phone call that was initiated or received through Wavix.
2. Transcribe a phone call recorded outside Wavix by uploading an audio file.
For instructions on uploading and transcribing external recordings, see [Call transcription (file upload)](file-transcription).

This guide describes how to transcribe calls that went through Wavix and how to search those transcriptions for keywords and phrases.

To search call transcriptions for keywords or phrases, first enable Call recording and Call transcription services on your SIP trunks and phone numbers. You can do this in the Wavix app or by using the [SIP trunks](/api-reference/sip-trunks/update-a-sip-trunk-configuration) and [DIDs](/api-reference/my-numbers/get-numbers-on-the-account) endpoints.

## Prerequisites

Before you can access the Wavix Speech Analytics API, sign up for Wavix.

### Create a Wavix account

<createAccount />

### Find your API key

<findApiKey />


## How Wavix call transcription works
When you activate transcription on a SIP trunk or phone number, Wavix automatically converts recorded calls into plain text. Most calls are transcribed within 10 minutes, depending on call length and queue size.

After transcription, Wavix detects the call language and labels speakers as `agent` or `client` based on call direction.


## Request transcription for a specific call
To request a transcription for a specific call:
1. Use the [CDR API](/api-reference/cdr/search-for-calls-containing-specific-keywords-or-phrases) to find the call's unique identifier (`uuid`).
2. Request the transcription:

        ```http
        GET https://api.wavix.com/v1/cdr/uuid/transcription?appid=your_api_key
        ```

If successful, you receive an `HTTP 200 OK` response with the full transcription. The transcription is divided into blocks by speaker, with start and end times in milliseconds from call answer.

**Sample response:**
```json
{
    "transcript": {
        "19293741161": "Hello",
        "19293741160": "Hi"
    },
    "turns": [
        {
            "phone_number": "19293741161",
            "s": 600,
            "e": 700,
            "text": "Hi"
        }
    ],
    "uuid": "1234",
    "language": "en",
    "duration": 10,
    "charge": "0.003",
    "status": "completed",
    "transcription_date": "2023-01-09T10:04:39.734Z"
}
```
## Search for calls containing keywords or phrases

To [search for calls with transcription](/api-reference/speech-analytics/search-for-calls-containing-specific-keywords-or-phrases) containing specific keywords or phrases, use the following method

```http
POST https://api.wavix.com/v1/cdr
```

Response sample:
```json
{
   "type": "placed",
   "from": "2023-01-01",
   "to": "2023-01-31",
   "transcription": {
       "status": "completed",
       "language": "en",
       "agent": {
           "must": [
               "Hello",
               "Thank you"
           ],
           "match": [
               "Nope",
               "Maybe"
           ],
           "exclude": [
               "Richard",
               "Issue resolved"
           ]
       },
       "client": {
           "must": [
               "Hello",
               "Bye, Larry"
           ],
           "match": [
               "Nope",
               "Maybe"
           ],
           "exclude": [
               "Richard",
               "Issue resolved"
           ]
       },
       "any": {
           "must": [
               "Hello",
               "Bye, Larry"
           ],
           "match": [
               "Nope",
               "Maybe"
           ],
           "exclude": [
               "Richard",
               "Issue resolved"
           ]
       }
   }
}
```
- `type` - use `placed` for outbound calls or `received` for inbound calls
- `from` - filter results by the lower limit on the date the call was placed or received
- `to` - filter results by the upper limit on the date the call was placed or received
- `transcription` - filter results by the call transcription parameters:
  - `status` - filter results by transcription status
  - `language` - filter results by the language of the call
  - `agent` - filter results based on keywords and phrases said by a speaker labeled as `agent`
    - `must` - find calls with transcription that includes all specified keywords and phrases. The keywords and phrases are combined using logical AND.
    - `match` - find calls with transcription that includes any specified keyword and phrase. The keywords and phrases are combined using logical OR.
    - `exclude` - find calls with transcription that do not include any specified keyword and phrase. The keywords and phrases are combined using logical OR.
  - `client` - filter results based on keywords and phrases said by a speaker labeled as `client`
    - `must` - find calls with transcription that includes all specified keywords and phrases. The keywords and phrases are combined using logical AND.
    - `match` - find calls with transcription that includes any specified keyword and phrase. The keywords and phrases are combined using logical OR.
    - `exclude` - find calls with transcription that do not include any specified keyword and phrase. The keywords and phrases are combined using logical OR.
  - `any` - filter results based on keywords and phrases said by any speaker
    - `must` - find calls with transcription that includes all specified keywords and phrases. The keywords and phrases are combined using logical AND.
    - `match` - find calls with transcription that includes any specified keyword and phrase. The keywords and phrases are combined using logical OR.
    - `exclude` - find calls with transcription that do not include any specified keyword and phrase. The keywords and phrases are combined using logical OR.

The `type`, `from`, and `to` are mandatory parameters and cannot be blank. All other parameters are optional.


If successful, the method returns the `HTTP 200 OK` status code. The response will contain a list of call detail records that match the search criteria. Every call detail record contains the unique identifier of the call and a link to the full call transcription.

**Sample response:**
```json
{
    "items": [
        {
            "uuid": "8891",
            "date": "2022-03-03T13:53:59.000Z",
            "from": "12212123123",
            "to": "18001231233",
            "duration": 72,
            "charge": "0.01",
            "disposition": "ANSWERED",
            "transcription": {
                "uuid": "1234",
                "url": "https://api.wavix.com/v1/cdr/8891/transcription?appid=secret"
            },
            "destination": "United States",
            "sip_trunk": "36465",
            "per_minute": "0.0059"
        }
    ],
    "pagination": {
        "total": 100,
        "total_pages": 10,
        "current_page": 2,
        "per_page": 0
    }
}
```

## Transcribe a single call

To transcribe a specific call:
1. Use the [CDR API](/api-reference/cdrs/search-for-calls-containing-specific-keywords-or-phrases) to find the call's unique identifier (`uuid`).
2. Send a PUT request:
        ```http
        PUT https://api.wavix.com/v1/cdr/uuid/retranscribe
        ```
3. Include the following JSON in the request body:
        ```json
        {
            "language": "en",
            "webhook_url": "https://your-webhook.url"
        }
        ```

**Parameters:**
- `language`: (Optional) Force the language for transcription. Wavix uses this instead of auto-detection.
- `webhook_url`: (Optional) Webhook URL for transcription status updates.

If successful, you receive an empty `HTTP 200 OK` response. When transcription is complete, you receive a POST callback to your webhook:
```json
{
    "uuid": "123",
    "status": "completed"
}
```
- `uuid`: Unique identifier of the recorded call
- `status`: `completed` (success) or `failed` (error)
