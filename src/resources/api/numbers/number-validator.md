---
title: "Number Validator API Overview"
description: "How to validate phone numbers using the Wavix Number Validator API."
sidebarTitle: "Number Validator API"
keywords: ["validate phone numbers", "Wavix Number Validator API"]
---

import createAccount from '/snippets/create-wavix-account.mdx'
import findApiKey from '/snippets/find-api-key.mdx'

The Wavix Number Validator API allows customers to automate the phone number validation process by checking the phone number validity, reachability, and roaming status. Using the API Wavix customers can also get the name of the current carrier of the phone number, check if it was ported, and more.

All phone numbers are validated using the latest international numbering plan databases.

Based on your specific business needs, you can get detailed information about either a single phone number or several numbers with one request. You can also choose one of three validation request types: `format`, `analysis`, or `validation`.

The table below shows phone number details returned depending on the request type.

**Phone number details returned by request type**

| Parameter                   | Format | Analysis | Validation |
|-----------------------------|:-------|:---------|:-----------|
| Phone number validity       | Yes    | Yes      | Yes        |
| Phone number country        | Yes    | Yes      | Yes        |
| Local format                | Yes    | Yes      | Yes        |
| E.164 format                | Yes    | Yes      | Yes        |
| MCC, MNC for mobile numbers | —      | Yes      | Yes        |
| Type (mobile/toll-free/etc.)| —      | Yes      | Yes        |
| Current carrier             | —      | Yes      | Yes        |
| Ported status               | —      | Yes      | Yes        |
| Unallocated range           | —      | Yes      | Yes        |
| Risky destination           | —      | Yes      | Yes        |
| Timezone                    | —      | —        | Yes        |
| Reachability*               | —      | —        | Yes        |
| Roaming status*             | —      | —        | Yes        |

*Reachability and roaming statuses are returned for mobile phone numbers only. The feature is available in selected countries only. Please contact your account manager for more details.

<Note>
  The Wavix Number validator API is available exclusively for Flex Pro users.
</Note>

## Prerequisites
Before you can access the Wavix Number Validator API, you need to sign up for Wavix.

### Create a Wavix account

<createAccount />

### Find your API key

<findApiKey />

## How to validate a single phone number
To get detailed information about [a single phone number]((/api-reference/number-validator/validate-a-single-phone-number)), use the following method:

```http
GET https://api.wavix.com/v1/validation?phone_number=number&type=validation_type&appid=your_api_key
```
Pass the following parameters in the request URL:

- `number` - the phone number to be validated.
- `validation_type` - the Wavix Number validator request type: `format`, `analysis`, or `validation`.

All parameters are mandatory and cannot be blank.

If successful, the method returns the “HTTP 200 OK”. The response body will contain information about the phone number.

```json
{
   "phone_number": "+6288736592000",
   "is_valid": true,
   "country_code": "ID",
   "e164_format": "+6288736592000",
   "national_format": "087-36592-000",
   "ported": false,
   "mcc": "510",
   "mnc": "10",
   "phone_type": "mobile",
   "carrier_name": "PT. Telekomunikasi Selular",
   "risky_destination": false,
   "unallocated_range": false,
   "reachable": true,
   "roaming": false,
   "timezone": "UTC+07:00",
   "cost": "0.015",
   "error_code": "000"
}
```

## How to validate multiple phone numbers

The Wavix Number Validator API allows you to get detailed information about [several phone numbers](/api-reference/number-validator/validate-multiple-phone-numbers) with a single request.

Under most circumstances, it takes about 30 seconds to validate a batch of 500 phone numbers. We recommend you use `async:true` if you're planning to validate more than 500.

```http
POST https://api.wavix.com/v1/validation?appid=your_api_key
```

Request body example:

```json
{
   "async": false,
   "type": "validation",
   "phone_numbers": [
      "+6288736592000",
      "+6288736592001",
      "+6288736592002"
   ]
}
```
* async - indicates whether the request must be executed asynchronously.
* validation_type - the Wavix Number validator request type: `format`, `analysis`, or `validation`.
* phone_numbers - an array of strings, each string contains a single phone number to validate.

All parameters are mandatory and cannot be blank.

Response example

For synchronous requests, if successful, the method returns the “HTTP 200 OK” status code. The response contains detailed information about each phone number.

```json
{
    "status": "success",
    "pending": 0,
    "items": [
        {
            "phone_number": "+6288736592000",
            "is_valid": true,
            "country_code": "ID",
            "e164_format": "+6288736592000",
            "national_format": "087-36592-000",
            "ported": false,
            "mcc": "510",
            "mnc": "10",
            "phone_type": "mobile",
            "carrier_name": "PT. Telekomunikasi Selular",
            "risky_destination": false,
            "unallocated_range": false,
            "reachable": true,
            "roaming": false,
            "timezone": "UTC+07:00",
            "cost": "0.015",
            "error_code": "000"
        },
        {
            "phone_number": "+6288736592001",
            "is_valid": true,
            "country_code": "ID",
            "e164_format": "+6288736592001",
            "national_format": "087-36592-001",
            "ported": false,
            "mcc": "510",
            "mnc": "10",
            "phone_type": "mobile",
            "carrier_name": "PT. Telekomunikasi Selular",
            "risky_destination": false,
            "unallocated_range": false,
            "reachable": true,
            "roaming": false,
            "timezone": "UTC+07:00",
            "cost": "0.015",
            "error_code": "000"
        }
    ]
}
```
For asynchronous requests, if successful, the method returns the “HTTP 201 Created” status code which the validation process has started. The response contains a token that needs to be used to poll the results.

```json
{
  "request_uuid": "12542c5c-1a17-4d12-a163-5b68543e75f6"
}
```
To [poll asynchronous validation results](/api-reference/number-validator/get-asynchronous-validation-results), use the following method:

```http
GET https://api.wavix.com/v1/validation/uuid?appid=your_api_key
```

If successful, the response will contain detailed information about the phone numbers that have already been validated and the status of the asynchronous validation.

```json
{
  "status": "progress",
  "count": 4,
  "pending": 2,
  "items": [
    {
      "phone_number": "+6288736592000",
      "is_valid": true,
      "country_code": "ID",
      "e164_format": "+6288736592000",
      "national_format": "087-36592-000",
      "ported": false,
      "mcc": "510",
      "mnc": "10",
      "phone_type": "mobile",
      "carrier_name": "PT. Telekomunikasi Selular",
      "risky_destination": false,
      "unallocated_range": false,
      "reachable": true,
      "roaming": false,
      "timezone": "UTC+07:00",
      "cost": "0.015",
      "error_code": "000"
    },
    {
      "phone_number": "+6288736592001",
      "is_valid": true,
      "country_code": "ID",
      "e164_format": "+6288736592001",
      "national_format": "087-36592-001",
      "ported": false,
      "mcc": "510",
      "mnc": "10",
      "phone_type": "mobile",
      "carrier_name": "PT. Telekomunikasi Selular",
      "risky_destination": false,
      "unallocated_range": false,
      "reachable": true,
      "roaming": false,
      "timezone": "UTC+07:00",
      "cost": "0.015",
      "error_code": "000"
    }
  ]
}
```