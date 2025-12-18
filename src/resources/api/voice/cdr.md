---
title: "Retrieve call logs (CDRs)"
description: "How to retrieve Call Detail Records (CDRs) using the Wavix API."
sidebarTitle: "Retrieve call logs"
keywords: ["CDR","call detail records","call logs","call reports"]
---

import createAccount from '/snippets/create-wavix-account.mdx'
import findApiKey from '/snippets/find-api-key.mdx'


You can use the Wavix API to query and export call detail records (CDRs) from your account with various parameters. CDRs include attributes such as time, duration, origination and destination numbers, and call price.
CDRs have no retention period on the Wavix platform.

This section shows you how to search for CDRs and get call metrics using the Wavix API.

<Note>
    The Wavix CDR API is available for both Flex and Flex Pro users.
</Note>


## Prerequisites

To get started, sign up for a Wavix account and find your API key.

### Create a Wavix account
<createAccount />

### Find your API key
<findApiKey />

## Retrieve CDRs from your account

You can request CDRs in either CSV or JSON format. The response format is defined in the request header. The Wavix platform also supports JSON streaming for CDRs.

With the Wavix API, you can get near real-time:
- Detailed records of every inbound, outbound, and missed call
- Summary information about all inbound or outbound calls, including total duration, total price, and the number of calls received or placed (JSON format only)

You can use CDRs to:
- Monitor service disruptions
- Analyze usage patterns and trends

The following example shows how to [query CDRs](/api-reference/cdrs/get-cdrs-on-the-account) on your Wavix account.

Request example:
```http
GET https://api.wavix.com/v1/cdr?type=placed&from=2021-02-10&to=2021-02-20&per_page=100&appid=your_api_key
```


Response example:
```json
{
  "items": [
    {
      "date": "2021-02-10T10:07:06.376Z",
      "from": 12212123123,
      "to": 18001231233,
      "duration": 72,
      "charge": 0.01,
      "destination": "sip:36465@sip.example.com",
      "sip_trunk": "36465",
      "per_minute": 0.0059,
      "forward_fee": 0.0059
    }
  ],
  "pagination": {
    "total": 100,
    "total_pages": 10,
    "current_page": 2,
    "per_page": 10
  }
}
```

To query CDRs in CSV format, use the following example:
```http
GET https://api.wavix.com/v1/cdr.csv?type=placed&from=2021-02-10&to=2021-02-20&per_page=100&appid=your_api_key
```
