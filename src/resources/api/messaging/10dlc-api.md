---
title: "10DLC API"
description: "Register 10DLC brands and campaigns to send compliant traffic to U.S. subscribers using the Wavix API."
sidebarTitle: "10DLC API"
---

import createAccount from '/snippets/create-wavix-account.mdx';
import findApiKey from '/snippets/find-api-key.mdx';

<Note>
    The Wavix 10DLC API is available for Flex Pro users only.
</Note>

## Prerequisites

### Create a Wavix account

<createAccount />

### Find your API key

<findApiKey />


## What is 10DLC?
10DLC (10-digit long code) allows businesses to send A2P (application-to-person) messages using standard, local U.S. 10-digit phone numbers as sender IDs.

## What is The Campaign Registry (TCR)?
The Campaign Registry (TCR) is the central hub for registering A2P messaging campaigns in the U.S.
- Each brand registration must be pre-approved by mobile carriers.
- Message throughput is determined by carriers after registration and depends on brand details and message content.

<Note>
    You only need to register a 10DLC brand and campaign if you use 10-digit local phone numbers as sender IDs. This does not apply to toll-free numbers or short codes.
</Note>

## Brand and Campaign registration flow
1. Register a brand on your account.
2. After brand verification, register one or more campaigns for the brand.
3. After campaign approval, associate one or more local U.S. phone numbers with the campaigns.

Wavix automatically creates a sender ID for these numbers. You can then send messages to U.S. subscribers.

## Subscribe to 10DLC webhooks
Subscribe to webhooks to be notified about events related to brands, campaigns, and phone numbers.

```http
POST https://api.wavix.com/v3/10dlc/subscriptions
```

Request body:
```json
{
  "subscription_category": "brand",
  "url": "https://your.site"
}
```
- `subscription_category`: Event category to subscribe to (`brand`, `campaign`, or `number`).
- `url`: Webhook URL to send events to.

All parameters are mandatory and cannot be left blank. 

If successful, the method returns the “HTTP 201 OK” status. The response will contain an acknowledgment of the subscription. 

```json
{
  "subscription_category": "brand",
  "url": "https://your.site"
}
```

Wavix will automatically post events to the specified webhooks once your Brand, Campaign, or number status is updated in TCR. Depending on the `subscription_category` the following JSON objects will be sent to the webhook. 

1. If subscription_category is **brand** Brands status updates will be posted to your webhook

```json
{
  "brand_id": "BX12JH90",
  "status": "VERIFIED"
}
```

- `brand_id`: the unique identifier of the Brand
- `status`: the updated status of the Brand

You can use the [Query a specific 10DLC Brand](/api-reference/10dlc/query-a-specific-10dlc-brand-on-your-account) method to retrieve the Brand details, including feedback from TCR, if needed. 

2. If subscription_category is **campaign** Campaigns status updates will be posted to your webhook

```json
{
  "brand_id": "BX12JH90",
  "campaign_id": "CA0DFK10",
  "status": "APPROVED"
}
```

- `brand_id`: the unique identifier of the Brand
- `campaign_id`: the unique identifier of the Campaign
- `status`: the updated status of the Campaign

You can use the [Query a Specific 10DLC Campaign](/api-reference/10dlc/query-a-specific-10dlc-campaign-on-your-account)


## Register a 10DLC brand

Entity types supported: `private-profit`, `public-profit`, `non-profit`, `government`.

<Note>
- `GOVERNMENT`: Only US government agencies can register a brand under this entity type. For government entities outside the US, use the `PRIVATE_PROFIT` entity type.
- `NON_PROFIT`: Only US-based non-profit organizations can register under this entity type. Non-profit organizations outside the US should use the `PRIVATE_PROFIT` entity type.
- `PUBLIC_PROFIT`: When registering a brand under this entity type, you must specify the stock exchange and provide the brand’s stock ticker.
</Note>

To register a 10DLC Brand, use the following method:

```http
POST https://api.wavix.com/v3/10dlc/brands
```

Request body:
```json
{
  "city": "Miami",
  "company_name": "Company legal name",
  "country": "US",
  "dba_name": "New Brand",
  "ein_taxid": "123456789",
  "ein_taxid_country": "US",
  "email": "email@brand.com",
  "entity_type": "PRIVATE_PROFIT",
  "first_name": "John",
  "last_name": "Dow",
  "mock": false,
  "phone_number": "12123450099",
  "status": "VERIFIED",
  "stock_exchange": null,
  "stock_symbol": null,
  "street_address": "10, Street name",
  "vertical": "HEALTHCARE",
  "website": "https://brand.com",
  "zip": "12345"
}
```

<Tip>
    Ensure all brand information is **accurate** and **up-to-date**. The details you submit will be subject to an Identity Verification process conducted by the TCR. Any inconsistencies or mismatches between the submitted information and official records will result in the rejection of the Brand. The TCR specifically verifies the EIN/Tax ID, company legal name, and company legal address.
</Tip>

If successful, the method returns the `HTTP 201 OK` status. The response will include the newly created Brand object.
```json
{
  "brand_id": "BM20QP9",
  "city": "Miami",
  "company_name": "Company legal name",
  "country": "US",
  "created_at": "2024-07-24T08:10:49",
  "dba_name": "New Brand",
  "ein_taxid": "12345",
  "ein_taxid_country": "US",
  "email": "email@brand.com",
  "entity_type": "PRIVATE_PROFIT",
  "feedback": null,
  "first_name": "John",
  "last_name": "Dow",
  "mock": false,
  "phone_number": "12123450099",
  "state_or_province": "FL",
  "status": "REVIEW",
  "stock_exchange": null,
  "stock_symbol": null,
  "street_address": "10, Street name",
  "updated_at": "2024-07-24T08:29:09",
  "vertical": "HEALTHCARE",
  "website": "https://brand.com",
  "zip": "12345"
}
```
Once the status of your Brand’s verification changes in TCR, you’ll receive a callback via your webhook.


## Appeal a brand identity verification
If your brand is `UNVERIFIED`, review and update details. If you believe the information is correct, you can submit an appeal for the Brand identity verifications and optionally upload supporting documents.

```http
POST https://api.wavix.com/v3/10dlc/brands/:brand_id/appeals
```

Request body:
```json
{
  "appeal_categories": ["VERIFY_TAX_ID"],
  "evidence": ["7c27328f-584e-415d-aa21-3a9f9fce2540"],
  "explanation": "Find the company incorporation docs attached and please review the Brand Identity status."
}
```
- `brand_id`: Unique identifier of the brand.
- `appeal_categories`: Array of appeal categories.
- `evidence`: Array of evidence UUIDs (optional).
- `explanation`: Justification for your appeal (optional).

The applicable appeal categories vary based on your entity type and current identity verification status:

- `VERIFY_TAX_ID`: For `PRIVATE_PROFIT`, `PUBLIC_PROFIT`, `NON_PROFIT`, and `GOVERNMENT` entities with an identity verification status of `UNVERIFIED`.
- `VERIFY_NON_PROFIT`: For `NON_PROFIT` entities with an identity verification status of `UNVERIFIED` or `VERIFIED` but missing the `Tax Exempt` status.
- `VERIFY_GOVERNMENT`: For `GOVERNMENT` entities with an identity verification status of `UNVERIFIED` or `VERIFIED` but missing the `Government Entity` status.

## Brand vetting
Apply for brand vetting to access special use cases, improve throughput, or pass verification. You can import external vettings.

Use the following method to request external vetting for the Brand:

```http
POST https://api.wavix.com/v3/10dlc/brands/:brand_id/vettings
```

Request body:
```json
{
  "evp_id": "AEGIS",
  "vetting_class": "STANDARD"
}
```
- `brand_id`: Unique identifier of the brand.
- `evp_id`: External vetting provider code (`AEGIS`, `CV`, `WMC`).
- `vetting_class`: Requested vetting type (`STANDARD`, `ENHANCED`, `POLITICAL`).

## Register a 10DLC campaign
You can register a campaign after your brand is `VERIFIED` or `VETTED_VERIFIED`.

As mandated by US MNOs (Mobile Network Operators), you must declare a use case for your Campaign. Select the most appropriate use case and include additional details in the Сampaign description. Wavix supports two types of use case categories:

- **Standard use cases**: Available for all qualified brands.
- **Special use cases**: Sensitive/critical, may require vetting or approval.

<Warning>
    Once a campaign is created, the use case cannot be changed.
</Warning>

When submitting a Campaign for registration, you must provide the following details:

- **Campaign description** - give a clear, detailed description of the Campaign’s purpose.
- **Opt-in workflow** - describe the process through which consumers opt-in to the Campaign, ensuring they give informed consent to receive messages. This description should be explicit and inform consumers about the nature of the program. If there are multiple opt-in methods, include them all.
- **Message samples** - provide at least one sample message for the Campaign. Some Campaign types require a minimum of two samples. Use the ‘Qualify a 10 DLC Brand for a Use Case’ method to check the required number of samples.
- **Message content attributes** - specify the attributes of the message content to help MNOs better what will be sent.
- **Opt-in, opt-out, and help keywords and acknowledgments**: include keywords for opting in, opting out, and seeking help, along with any required acknowledgments

Use the following method to submit a Campaign for registration.

```http
POST https://api.wavix.com/v3/10dlc/brands/:brand_id/campaigns
```

Request body:
```json
{
  "name": "Customer verification",
  "usecase": "2FA",
  "description": "Our campaign aims to enhance the security and user experience of the registration process by sending …",
  "embedded_links": false,
  "embedded_phones": false,
  "age_gated": false,
  "direct_lending": false,
  "optin": true,
  "optout": true,
  "help": true,
  "sample1": "Your verification code is XXXXXX",
  "optin_workflow": "Our customers explicitly request an SMS code to verify …",
  "help_message": "For help, please visit www.brandname.com. To opt-out, reply STOP.",
  "optin_message": "You are now opted-in. For help please reply HELP, to stop please reply STOP",
  "optout_message": "You are now opted out and will receive no further messages",
  "optin_keywords": "begin,start",
  "optout_keywords": "quit,stop",
  "help_keywords": "help"
}
```

If successful, the method returns the `HTTP 201 OK` status. The response will include the created Campaign object.
```json
{
  "affiliate_marketing": false,
  "age_gated": false,
  "auto_renewal": false,
  "brand_id": "BAL08VM",
  "campaign_id": "C1W1J07",
  "created_at": "2024-08-13T14:45:36",
  "description": "Our campaign aims to enhance the security and user experience of the registration process by sending …",
  "direct_lending": false,
  "embedded_link_sample": null,
  "embedded_links": false,
  "embedded_phones": false,
  "feedback": null,
  "help": true,
  "help_keywords": "help",
  "help_message": "For help, please visit www.brandname.com. To opt-out, reply STOP.",
  "last_bill_date": "2024-08-13T14:45:37",
  "mock": false,
  "monthly_fee": "10.0",
  "name": "Customer verification",
  "next_bill_date": "2024-11-13T00:00:00",
  "optin": true,
  "optin_keywords": "begin,start",
  "optin_message": "You are now opted-in. For help please reply HELP, to stop please reply STOP",
  "optin_workflow": "Our customers explicitly request an SMS code to verify …",
  "optout": true,
  "optout_keywords": "stop,quit,unsubscribe",
  "optout_message": "You are now opted out and will receive no further messages",
  "phone_numbers": [],
  "privacy_policy": null,
  "sample1": "Your verification code is XXXXXX",
  "sample2": null,
  "sample3": null,
  "sample4": null,
  "sample5": null,
  "status": "REVIEW",
  "terms_conditions": null,
  "updated_at": "2024-08-13T14:45:42",
  "usecase": "2FA"
}
```

The time it takes the Campaign to be reviewed depends on multiple factors and the process might take several days. You’ll receive a callback to your webhook once the Campaign status is changed in TCR.

<Info>
    All campaigns require a minimum 3-month commitment. Wavix bills for the first three months upfront. Afterward, campaigns renew monthly. Political campaigns are renewed monthly with no minimum commitment.
</Info>

## Associate phone numbers with a campaign

After campaign registration, associate phone numbers with the campaign. Sender IDs are created automatically once numbers are activated.

<Note>
    You can associate phone numbers before campaign registration is complete, but outbound messaging is only enabled after successful registration.
</Note>

```http
POST https://api.wavix.com/v3/10dlc/brands/:brand_id/campaigns/:campaign_id/:number
```
- `brand_id`: Unique identifier of the brand.
- `campaign_id`: Unique identifier of the campaign.
- `number`: Phone number to associate with the campaign.

Response example:
```json
{
  "success": true,
  "number": "+1234567890",
  "brand_id": "brd_abc123",
  "campaign_id": "cmp_xyz456",
  "status": "pending", // or "active", "failed", etc.
  "message": "Number association request received. Provisioning in progress."
}
```

Provisioning for outbound messaging may take several hours. You’ll receive a webhook callback when the number status is updated in TCR.