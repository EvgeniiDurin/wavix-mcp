---
title: "SMPP"
description: "Connect to Wavix messaging platform via SMPP protocol"
sidebarTitle: "SMPP connection"
---
Wavix customers can connect to our SMPP gateway to send and receive SMS messages and delivery reports (DLRs). Wavix supports **SMPP protocol version 3.4**.

## SMPP bind parameters
You can connect to Wavix SMPP host using the following parameters:

| Parameter          | Mandatory       | Description    |
|--------------------|:----------------|:---------------|
| system_id          | Yes             | Your SMPP connection username   |
| password           | Yes             | Your SMPP connection password   |
| host/IP address    | Yes             | Always use `smpp.wavix.net`	|
| port               | Yes             | Use `11337` as the primary port. Use `11338` for the encrypted SSL/TLS endpoint.	|

<Info>
The length of the password required depends on your SMPP library rather than the SMPP v3.4 protocol itself. It is advised to use a library that enables a setup with a password length greater than 8 characters.
</Info>

## IP restrictions
Access to the Wavix SMPP service is limited to pre-registered IP addresses. Be sure to share your IPs in advance to ensure access. 

## Supported PDUs
Wavix supports the following PDUs:
- `bind_transmitter` 
- `bind_receiver`
- `bind_transceiver`
- `unbind`
- `submit_sm`
- `deliver_sm`
- `enquire_link`
- `generic_nack`

Each request to our system gets an acknowledgment, as defined in the SMPP v3.4 standard.

## Submitting messages via SMPP
Submit messages using the **submit_sm** PDU, and include content in either the `short_message` or `message_payload` field. 
If the request is successful, Wavix returns the **submit_sm_resp** with a success status (`ESME_ROK`) and a non-null message ID. 
If the request fails, the response includes an error code.

### Character sets, message class, and data coding

Wavix supports the following data coding schemes:
- **GSM 03.38 (default)**. To use GSM 03.38 encoding, set `data_coding` to `0`.
- **Unicode**. To use UCS2 encoding, set `data_coding` to `0x08`. The message is expected in UTF-16 Big Endian format.

### Message originators and destination
Set the `source_addr_ton` and `source_addr_npi` fields based on your Sender ID type:
- **Alphanumeric**: set the `source_addr_ton` to 5 and `source_addr_npi` to 0
- **Numeric**: set the `source_addr_ton` to 1 and `source_addr_npi` to 1 

The destination phone number must be in international E.164 format. Set the `dest_addr_ton` and `dest_addr_npi` fields to 1. 

### Concatenated messages
You can send messages longer than 160 characters (GSM 03.38) or 70 characters (UCS2). Such messages are automatically concatenated and appear as a single message on the recipient’s device.

To send long messages, use one of these supported methods:
- Use the `message_payload` field of the **submit_sm** PDU. Recommended method.
- Use optional `sar_msg_ref_num`, `sar_segment_seqnum`, and `sar_total_segments` TLVs of the **submit_sm** PDU. 
- Use a UDH for concatenation with 8-bit or 16-bit reference numbers and set `esm_class` to `0x40`.

## Delivery reports
Delivery reports are sent in the `short_message` field of the **deliver_sm** PDU. 
Each delivery report includes these TLVs:
- `receipted_message_id` – the message ID assigned by Wavix.
- `message_state` – the current status of the message delivery.
- `user_message_reference` – A message reference number set by the customer, if included in the **submit_sm** request.
- `network_error_code` – A [Wavix-specific error code](/messaging/smpp#wavix-specific-error-codes), provided only when `message_state` is `REJECTD`.

### Delivery report format
```ini
id:{message_id} sub:{message_sub} dlvrd:{message_dlvrd} submit date:{message_submit_date} done date:{message_done_date} stat:{message_stat} err:{message_err}
```
### Delivery statuses
The delivery report can show one of the following message statuses:
| Status            | Description     | 
|--------------------|:----------------|
| `ENROUTE`          | Submitted for delivery (interim)             |
| `DELIVRD`          | Successfully delivered (final)             |
| `UNDELIV`          | Couldn’t be delivered (final)             | 
| `REJECTD`          | Rejected by a carrier, mobile device, or Wavix (final)  | 
| `EXPIRED`          | Message validity period has expired (final)             | 

### Wavix-specific error codes
To help you troubleshoot your SMPP transaction, here’s what each error code means.
| Delivery status    | Error code       | Description    |
|--------------------|:----------------|:---------------|
| `REJECTD`          | 1005              | [The Sender ID is not provisioned for the country](/messaging/errors/5)	|
| `REJECTD`          | 1007              | [Potential SMS flooding attack](/messaging/errors/7)	|
| `REJECTD`          | 1009              | [Unsubscribed recipient](/messaging/errors/9)	|
| `REJECTD`          | 1017              | [Destination forbidden](/messaging/errors/17)	|
| `REJECTD`          | 1018              | [Destination is invalid or not mobile phone number](/messaging/errors/18)	|
| `REJECTD`          | 1019              | [Destination blocked](/messaging/errors/19)	|
| `REJECTD`          | 1022              | [Sender ID not found](/messaging/errors/22)	|
| `REJECTD`          | 1023              | [Rejected by a far-end carrier](/messaging/errors/23)	|
| `REJECTD`          | 1024              | [Gateway rejected](/messaging/errors/24)	|
| `REJECTD`          | 1029              | [Messaging is not supported by the destination carrier or handset](/messaging/errors/29)	|
| `REJECTD`          | 1031              | [The number is inactive, lacks credits, or opted out of SMS](/messaging/errors/31)	|
| `REJECTD`          | 1033              | [The message was rejected as SPAM or the Sender ID is associated with an inactive 10DLC Campaign](/messaging/errors/33)	|
| `REJECTD`          | 1034              | [10DLC Brand or Campaign messaging limit exceeded](/messaging/errors/34)	|
| `REJECTD`          | 1036              | [Daily quota exceeded (T-Mobile)](/messaging/errors/36)	|
| `REJECTD`          | 1037              | [Spam message detected/rejected (AT&T)](/messaging/errors/37)	|
| `REJECTD`          | 1038              | [Sending limit reached (AT&T)](/messaging/errors/38)	|
| `REJECTD`          | 1041              | [Message too long](/messaging/errors/41)	|
| `REJECTD`          | 1043              | [The message was blocked by the Verizon content filtering mechanism](/messaging/errors/43)	|
| `REJECTD`          | 1044              | [The destination number is no longer active and should be removed from any subscriptions](/messaging/errors/44)	|
| `REJECTD`          | 1045              | [Unsupported carrier](/messaging/errors/45)	|
| `REJECTD`          | 1046              | [Non-compliant content or URL(s) detected and blocked](/messaging/errors/46)	|


## Throughput and throttling
By default, each account is limited to 20 requests per second (RPS).
We recommend setting the SMPP window size (maximum number of open requests) to 10 for optimal performance.

## Enquire link
To maintain a stable connection, send the `enquire_link` request every 30 seconds.