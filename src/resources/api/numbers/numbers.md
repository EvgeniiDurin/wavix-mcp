---
title: "Numbers API Overview"
description: "How to search, buy, configure, and release phone numbers using the Wavix API."
sidebarTitle: "Numbers API"
keywords: ["buy phone numbers", "search phone numbers", "configure phone numbers", "release phone numbers", "Wavix Numbers API"]
---

import createAccount from '/snippets/create-wavix-account.mdx'
import findApiKey from '/snippets/find-api-key.mdx'

The Wavix platform provides access to a global inventory of local, mobile, national, and toll-free numbers in over 140 countries.

In this section, you will learn how to search, purchase, configure, and release phone numbers using the Wavix API.

<Note>
    The Numbers API is available only for Flex Pro users.
</Note>

## Prerequisites

Before you can search for and buy your first phone number, sign up for a Wavix account.

### Create a Wavix account

<createAccount />

### Find your API key

<findApiKey />

## Search for phone numbers

To receive calls from your customers, purchase a phone number from the Wavix global inventory.

<Steps>
    <Step title="Get a list of countries">
        [Get a list of countries](/api-reference/buy/get-a-list-of-countries) with phone numbers available. You can search for geo, toll-free, or both types of phone numbers. You can also filter by SMS-enabled numbers.

        Request sample:
        ```http
        GET https://api.wavix.com/v1/buy/countries?type_filter=all&text_enabled_only=false&appid=your_api_key
        ```

        Response sample:
        ```json
        {
          "countries": [
            {
              "id": 8652,
              "name": "United States",
              "short_name": "US",
              "has_provinces_or_states": true
            }
          ]
        }
        ```

    </Step>
    <Step title="Get a list of provinces or states">
        <Note>
            This step is required only for countries with provinces or states, such as the USA, Canada, and Australia.
        </Note>

        For countries with provinces or states, [get a list of cities in a region](/api-reference/buy/get-cities-in-a-region) or [a list of cities ](/api-reference/buy/get-cities-in-a-country) for countries without regions. Use the `country_id` and, optionally, the `region_id` parameters from the responses above.

        Request sample:
        ```http
        GET https://api.wavix.com/v1/buy/countries/8652/regions/379/cities?appid=your_api_key
        ```

        Response sample:
        ```json
        {
          "cities": [
            {
              "id": 200,
              "name": "LOS ANGELES, CA",
              "area_code": 213568
            }
          ]
        }
        ```

        <Note>
            For USA the `area_code` parameter in the response is in NPA-NXX format.
        </Note>
    </Step>
    <Step title="Get a list of phone numbers">
        [Get a list of phone numbers](/api-reference/buy/countries/city/dids) in the selected city. Use the IDs of the selected country and city from the responses above.

        Request sample:

        ```http
        GET https://api.wavix.com/v1/buy/countries/8652/city/200/dids?type_filter=all&text_enabled_only=true&appid=your_api_key
        ```

        The response will contain phone numbers and their details, such as ID, activation fee, monthly fee, and the number of inbound channels.
    </Step>
</Steps>

## Buy phone numbers

To purchase phone numbers, follow these steps.

<Steps>
    <Step title="Add numbers to cart">
        [Add the selected phone numbers](/api-reference/buy/cart/add) to your cart.

        ```http
        PUT https://api.wavix.com/v1/buy/cart?appid=your_api_key
        ```

        The request body must contain an array of phone numbers you want to purchase.

        ```json
        {
          "ids": ["18022551119"]
        }
        ```

        The response will contain phone numbers successfully added to the cart and their details, such as activation fee, monthly fee, and the number of inbound channels for the number.
    </Step>
    <Step title="Check out numbers from cart">
        Check out numbers from the cart.

        After phone numbers are added to the cart, [check them out](/api-reference/buy/cart/checkout) to finalize the purchase.

        ```http
        POST https://api.wavix.com/v1/buy/cart/checkout?appid=your_api_key
        ```

        Request sample:

        ```json
        {
          "ids": ["18022551119"]
        }
        ```

        <Note>
            Activation fee and monthly fee will be automatically deducted from your balance. Make sure you have enough funds in your account or a primary card linked to your account with sufficient funds.
        </Note>
    </Step>

</Steps>


## List purchased numbers

You can [get a list of purchased numbers](/api-reference/my-dids/get-dids-on-the-account) on your Wavix account by using the following method:

```http
GET https://api.wavix.com/v1/mydids?appid=your_api_key
```

The response will contain numbers and their details, such as status, activation, monthly fees, and the number of inbound channels.

A number status can be one of the following:

- `active` - The number is fully configured and can receive inbound calls.
- `inactive` - Additional documents are required to activate the number. For inactive numbers, the response will contain a description of the documents required to activate the number.

## Update number destination

For active numbers, Wavix can route inbound calls to:
- a SIP trunk
- a SIP URI
- a dedicated PSTN number

To [update inbound call routing and SMS endpoint](/api-reference/my-dids/update-did-destinations) for a number, use the following API method. You can update destinations for several numbers in a single request.

```http
POST https://api.wavix.com/v1/mydids/update-destinations?appid=your_api_key
```

Request body example:
```json
{
  "ids": [
    1,
    2
  ],
  "destinations": [
    {
      "transport": 1,
      "destination": "sip@example.com",
      "priority": 1,
      "callhunt": false,
      "active": true
    }
  ]
}
```

# Return number

Return numbers you no longer use to the Wavix global inventory.

To [return unused numbers](/api-reference/my-dids/return-dids-to-stock), use the following API method:

```http
DELETE https://api.wavix.com/v1/mydids?appid=your_api_key
```