---
title: "Call transcription with Speech Analytics API (file upload)"
description: "How to use the Wavix Speech Analytics API to transcribe uploaded call recordings and search transcriptions for keywords."
sidebarTitle: "Call transcription (file upload)"
keywords: ["speech analytics","call transcription","call recording","call search","call keywords"]
---

import createAccount from '/snippets/create-wavix-account.mdx';
import findApiKey from '/snippets/find-api-key.mdx';

<Note>
    The Wavix Speech Analytics API is available exclusively for Flex Pro users.
</Note>

The Wavix Speech Analytics API allows you to upload and transcribe recorded phone calls, even if they were not placed or received through the Wavix platform. 

<Important>
  Wavix only supports the transcription of stereo audio files.
</Important> 

## Prerequisites

Before you can access the Wavix Speech Analytics API, sign up for Wavix.

### Create a Wavix account

<createAccount />

### Find your API key

<findApiKey />

## Submit a file for transcription

To submit a file for transcription, use the method described below:

```http
POST  https://api.wavix.com/v1/speech-analytics?appid=your_api_key
```

The method takes two parameters:
- `file` - binary file content
- `callback_url` - a webhook URL to send the transcription status updates to

All parameters are mandatory and cannot be left blank. 

If successful, the method returns the HTTP 201 status code. The response will include the details of the created transcription request, such as a unique request identifier and the uploaded file name.

```json
{
 "file" : "call.mp3", 
 "request_id" : "e865ea07-25af-4fdd-876e-04b0d41d5ebd", 
 "success" : true
}
```
- `file` - the name of the file uploaded
- `request_id` - unique identifier of the transcription request
- `success` - indicates the file was successfully uploaded and submitted for transcription

The time required for transcription completion varies based on the file's duration and the number of recordings in the queue. Typically, most files are transcribed within 10 minutes.

Once the transcription request's status changes, you'll receive a POST callback to the webhook address specified in the request. Your webhook must respond to the callback with a HTTP 2XX status code. Otherwise, Wavix will make a maximum of 5 attempts to resubmit the status update with 5-second intervals.   

```json
{
 "request_id" : "e865ea07-25af-4fdd-876e-04b0d41d5ebd",
 "status" : "completed",
 "error" : null
}
```

- `request_id` - unique identifier of the transcription request.
- `status` - status of the file transcription.
- `error` - a human-readable error message, or ‘null’ if no errors occurred.

## Query a specific file transcription
You can request a specific file transcription using the method below

```http
GET  https://api.wavix.com/v1/speech-analytics/{uuid}?appid=your_api_key
```

`uuid` - unique identifier of the transcription request

If successful, the method returns the “HTTP 200 OK” status code. The response will contain the full transcription of the submitted file. The transcription will be divided into blocks of text attributed to one of the speakers. Every block includes the start and end time when it was said. The time is provided in milliseconds and calculated from the beginning of the file.

```json
{
 "transcript" :
   {
     "channel_1" : "Hi there",
     "channel_2" : "Hello"
   },
 "turns" : [
   {
     "speaker" : "channel_1",
     "s" : 600,
     "e" : 700,
     "text" : "Hi there",
     "sentiment" : "positive"
  }
 ],
 "request_id" : "e865ea07-25af-4fdd-876e-04b0d41d5ebd",
 "language" : "en",
 "duration" : 102,
 "charge" : "0.01",
 "status" : "completed",
 "transcription_date" : "2023-01-09T10:04:39.734Z",
 "transcription_score" :"3.8",
 "transcription_summary": "The agent and client discussed call recording and call transcription",
 "original_file" : "https://api.wavix.com/v1/files/uuid"
}
```

- `transcript` - complete file transcription, with text attributed to each channel.
- `turns` -  an array of `turn` objects. Each `turn` object contains text attributed to an identified speaker along with the start and end times for that text and identified sentiment.
- `request_id` - unique identifier of the transcription request.
- `language` - a language used in the transcription.
- `duration` - duration of the uploaded file, in seconds.
- `charge` - total charge for the transcription, in USD.
- `status` - transcription status, which can be either ‘completed’ or ‘failed’.
- `transcription_date` - the date and time of the transcription
- `transcription_score` - indicates whether the conversation was positive, negative, or neutral. Scores ranging from 1.0 to 3.0 indicate negative conversation and 4.0 to 5.0 indicate positive.
- `transcription_summary` - a concise summary of the transcribed conversation.
- `original_file` - URL to the uploaded file.

## How to submit a file for re-transcription 
In cases when you need to resubmit a previously submitted file for transcription use the method below

```http
PATCH  https://api.wavix.com/v1/speech-analytics/{uuid}?appid=your_api_key
```
- `uuid` - unique identifier of the transcription request.

Request sample:
```
{
 "callback_url" : "https://webhook.url"
}
```

- `callback_url` - a webhook URL to send the transcription status updates to.

If successful, the method returns the `HTTP 200 OK` status code.

```json
{
 "success" : true
}
```

Once the transcription status changes, you'll receive a POST callback to the webhook address specified in the request. Your webhook must respond to the callback with a HTTP 2XX status code. Otherwise, Wavix will make a maximum of 3 attempts to resubmit the status update with 5-second intervals.

```json
{
 "request_id" : "e865ea07-25af-4fdd-876e-04b0d41d5ebd",
 "status" : "completed",
 "error" : null
}
```

- `request_id` - unique identifier of transcription request.
- `status` - status of file transcription.
- `error` - a human-readable error message, ‘null’ if no errors.

