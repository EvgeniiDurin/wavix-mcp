---
title: "Stream calls with WebSocket"
description: "Stream live call audio to your application using WebSocket connections"
sidebarTitle: "Stream calls with WebSocket"
keywords: ["Call media streaming", "WebSocket", "real-time audio", "voice AI", "AI voice assistants"]
---

import createAccount from '/snippets/create-wavix-account.mdx';
import findApiKey from '/snippets/find-api-key.mdx'

Call media streaming lets Wavix customers send live call audio to another application using a WebSocket connection. You can stream inbound and outbound audio in real time for seamless integration with AI voice assistants, large language models (LLMs), and other applications.

Wavix supports **unidirectional** and **bidirectional** call media streaming.

<Warning>
  Wavix call media streaming is exclusively available for the Flex Pro account level.
</Warning>

## Streaming types

### Unidirectional streaming

Your application receives call audio but can't send audio back to Wavix. You can stream:
- Inbound audio (to Wavix)
- Outbound audio (from Wavix)
- Both channels

### Bidirectional streaming

Your application can both receive and send audio over the same WebSocket connection. Wavix plays the audio you send directly into the call, which is useful for real-time AI conversations.

<Warning>
With bidirectional media streaming, your application can only receive the inbound audio stream.
</Warning>

# Prerequisites

### Create a Wavix account

<createAccount />

### Get your API key

<findApiKey />

## Call media streaming flow

To stream raw call audio, follow these steps:

1. Subscribe to call events.
2. Initiate or answer a call programmatically.
3. Start the call media streaming.
4. Stop the call media streaming.

### 1. Subscribe to call events

To receive all call-related events, Wavix recommends subscribing to both inbound and outbound call events.

To subscribe to **outbound** call events, include your webhook URL in the `status_callback` parameter of the Initiate outbound call request. To receive **inbound** call events, assign a call status callback URL to your phone number using the Wavix Phone numbers API or GUI.

### 2. Initiate or answer a call programmatically

To start an **outbound** call, use the following method

```bash Initiate an outbound call
    curl -L -X POST https://api.wavix.com/v1/call?appid=your_api_key 
      -H 'Content-Type: application/json' 
      -d '{
            "from": "Caller ID",
            "to": "Destination number",
            "status_callback": "Call status endpoint URL"
          }'
```

- `your_api_key`: Your Wavix API key.
- `from`: Caller ID the will be used. Must be an active or verified number in your Wavix account.
- `to`: Destination phone number. The number must be present in international E.164 format.
- `status_callback`: A webhook URL to post call events to.

If successful, the method returns `HTTP 200 OK` and a unique call identifier.

To answer an **inbound** call, use the following method

```bash Answer an inbound call
    curl -L -X POST https://api.wavix.com/v1/call/{{call_id}}/answer?appid=your_api_key  
```

- `your_api_key`: Your Wavix API key.
- `call_id`: Unique identifier of the call which you received on your webhook assigned to a phone number.

Optionally, paste the following JSON into the request body to start streaming immediately.

```json
{
  "stream_channel": "The channel you want to stream",
  "stream_type": "oneway or twoway streaming",
  "stream_url": "WebSocket URL"
}
```

- `stream_channel`:  Indicates what call channel should be streamed. Can be`inbound`, `outbound`, or `both`
- `stream_type`:  Can be ‘oneway’ for unidirectional or ‘twoway’ for bidirectional call media streaming.
- `stream_url`: WebSocket URL to which the inbound call media will be streamed (must start with `ws` or `wss`).

If successful, the method returns `HTTP 200 OK` and a success indicator. Streaming starts right away.

### 3. Start call media streaming

Wait until the call is answered before starting media streaming. To start the streaming, use the following method

```bash Start call streaming
    curl -L -X POST https://api.wavix.com/v1/call/{{id}}/streams?appid=your_api_key
      -H 'Content-Type: application/json' 
      -d '{
            "stream_channel": "The channel you want to stream",
            "stream_type": "oneway or twoway streaming",
            "stream_url": "WebSocket URL"
            }'
```

- `your_api_key`: Your Wavix API key.
- `stream_channel`:  Indicates what call channel should be streamed. Can be`inbound`, `outbound`, or `both`
- `stream_type`:  Can be ‘oneway’ for unidirectional or ‘twoway’ for bidirectional call media streaming.
- `stream_url`: WebSocket URL to which the inbound call media will be streamed (must start with `ws` or `wss`).

All parameters are mandatory.

<Note>
  With bidirectional media streaming, your application can only receive the inbound audio stream.
</Note>

If successful, the method returns `HTTP 200 OK`. The response will contain a unique stream identifier.

<Warning>
  You can only have a single bidirectional and up to 5 unidirectional streams for a single call.
</Warning>

### 4. Stop call media streaming

Call media streaming is automatically stopped when the call is completed. To stop it programmatically use the following method

```bash Stop call streaming
    curl -L -g -X DELETE 'https://api.wavix.com/v1/call/answer/{{call_id}}/streams/{{stream_id}}?appid=your_api_key'
```

- `your_api_key`: Your Wavix API key.
- `call_id`:  Unique identifier of the call.
- `stream_id`:  Unique identifier of the stream.

If successful, the method returns `HTTP 200 OK` and a success indicator.

# Call media streaming events

While streaming a call, Wavix sends messages to your WebSocket server. For bidirectional streaming, your server can also send messages back to Wavix.

## WebSocket messages from Wavix

Wavix sends the following message to your WebSocket server while streaming a call.

### `connected`

Sent once the connection is established.

```json
{
  "event": "connected",
  "event_time": "Date and time of the event"
}
```

### `start`

Sent before media streaming begins. Contains stream metadata.

```json
{
  "event": "start",
  "event_time": "Date and time of the event",
  "call_id": "Unique identifier of the call",
  "stream_id": "Unique identifier of the stream",
  "stream_type": "oneway/twoway",
  "channel": "inbound/outbound",
  "sequence_number": "Message order number"
}
```

### `media`

Contains audio chunks streamed to your WebSocket server.

```json
{
  "event": "media",
  "event_time": "Date and time of the event",
  "call_id": "Unique identifier of the call",
  "stream_id": "Unique identifier of the stream",
  "sequence_number": "Message order number",
  "media": {
    "payload": "base64 encoded audio payload",
    "track": "inbound/outbound",
    "timestamp": "Milliseconds from stream start",
    "chunk": "Chunk number"
  }
}
```

### `stop`

Sent when streaming is stopped or the call ends.

```json
{
  "event": "stop",
  "event_time": "Date and time of the event",
  "call_id": "Unique identifier of the call",
  "stream_id": "Unique identifier of the stream",
  "sequence_number": "Message order number"
}
```

### `mark`

Acknowledges that the previous media message finished playing. Only used in bidirectional call streaming.

```json
{
  "event": "mark",
  "event_time": "Date and time of the event",
  "call_id": "Unique identifier of the call",
  "stream_id": "Unique identifier of the stream",
  "sequence_number": "Message order number",
  "mark": {
    "name": "Name of the mark message"
  }
}
```

## WebSocket messages to Wavix

When using bidirectional streaming, your server can send these messages to Wavix to play audio back into the call and control the stream flow.

### `media`

Send audio chunks from your server to Wavix.

```json
{
  "event": "media",
  "stream_id": "Unique identifier of the stream",
  "media": {
    "payload": "base64 encoded audio payload"
  }
}
```

### `mark`

You can send the `mark` message after sending `media` to request notification when the audio chunk has been played. Wavix responds with the `mark` message with a matching name when the audio ends (or if there is no audio buffered).

```json
{
  "event": "mark",
  "stream_id": "Unique identifier of the stream",
  "mark": {
    "name": "Name of the mark message"
  }
}
```

### `clear`

You can send the `clear` message to interrupt previously sent audio and empty all buffered audio. This causes any queued `mark` message to be sent back to your WebSocket server.

```json
{
  "event": "clear",
  "stream_id": "Unique identifier of the stream"
}
```