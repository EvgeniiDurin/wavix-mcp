---
title: "10DLC Brand and Campaign registration"
description: "This guide explains how to register a 10DLC Brand and Campaign to send messages using US local 10-digit long codes."
date: "Thu Sep 11 2025 01:00:00 GMT+0100 (Western European Summer Time)"
sidebarTitle: "10DLC registration"
---

## What is 10DLC?

10DLC stands for "10-digit long code". It lets businesses send Application-to-Person messages using standard, local 10-digit phone numbers as Sender IDs. In the US, carriers treat all messages (SMS and MMS) sent through a messaging provider like Wavix as Application-to-Person traffic.

This guide covers:

- Registering your Brand
- Registering your Campaign and outbound numbers (also called 10DLCs or Sender IDs)

## What is The Campaign Registry?

The Campaign Registry (TCR) is the central hub for registering application-to-person messaging campaigns in North America.

<Note>
You must register a Brand and a Campaign if you're using 10-digit local phone numbers as sender IDs. This requirement doesn't apply if you use toll-free numbers or short codes.
</Note>

Keep in mind:

- Each Brand registration must be approved by mobile carriers.
- Message throughput is determined by carriers after approval and depends on your Brand details and message content.

## 10DLC Brand and Campaign registration

You can register 10DLC Brands and Campaigns directly from the Wavix platform.

<Warning>
The information you provide during registration affects message throughput. Make sure your details are accurate and up to date.
</Warning>

## Brand registration

### Registration types

Choose either **Quick** or **Standard** Brand registration, depending on your business's legal status.

- **Quick** registration is for sole proprietors without an EIN or Tax ID and requires fewer details. If you select Quick registration, you're limited to a single 10DLC phone number and have low messaging throughput.
- **Standard** registration requires detailed company information and offers higher throughput. Brands can have up to 50 10DLC Campaigns, with up to 45 10DLC phone numbers per Campaign.

<Note>
Mobile carriers automatically allocate message throughput based on your submitted Brand details and message content.
</Note>

### Brand registration process

To register a Brand, provide complete, accurate, and up-to-date information about your organization, including:

- Brand name or DBA name
- Website address (optional for Quick registration)
- Company legal name
- Industry or vertical
- Country of registration
- EIN for US companies or Tax ID for companies in other countries, if applicable
- Company type, if applicable
- Stock exchange and stock symbol (for publicly traded companies only)
- Contact details
- Company support email address and phone number
- Business address (must match the legal address in your registration documents)

If you choose **Quick** registration, provide the business owner's contact details. For **Standard** registration, include the first and last name of the person submitting the Brand registration.

<img
  src="/messaging/images/10dlc/fig1.jpeg"
  alt="Brand registration screenshot"
  className="mx-auto"
/>

After you enter the information, select **Next** to view the Brand registration summary and review your details. To update other fields, select **Back**.

If the information is correct, confirm the non-refundable Brand registration fee and select **Submit**.

### Brand registration status

Your Brand registration status depends on the accuracy of your information. The Campaign Registry (TCR) Administrator will verify your company using several databases and verification software. Make sure your legal company name, address, and EIN or Tax ID are correct to obtain a "Verified" status.

If your Brand can not be verified, update the details and resubmit the form.

Wavix provides feedback to help you identify possible data inaccuracies.

## Campaign registration

### Prerequisites

Before registering a 10DLC Campaign, make sure you have an active US local phone number on your account.

### Campaign registration process

Each 10DLC Campaign should describe your specific use case and the content of the SMS and MMS messages you plan to send.

To register a new 10DLC Campaign, provide the following information:

- Campaign name (for reference)
- Detailed Campaign description
- Use case that describes your messaging scenario
- Exact examples of messages you'll send

<Warning>
The Campaign description, use case, and message samples must be as specific as possible. Mobile carriers may review them to confirm they match the content of your messages.
</Warning>

<img
  src="/messaging/images/10dlc/fig2.jpeg"
  alt="Campaign details and use case screenshot"
  className="mx-auto"
/>

Depending on your selected use case, provide up to five message examples. We recommend using exact samples without placeholders or variables.

<img
  src="/messaging/images/10dlc/fig3.jpeg"
  alt="Message samples screenshot"
  className="mx-auto"
/>

Select all Campaign attributes that apply to your Campaign and message content using the YES/NO toggle.

Select **Next** to specify additional Campaign details.

#### Handling STOP, START, and HELP keywords (optional)

Wavix supports all standard opt-in and opt-out keywords by default. All additional keywords are case-insensitive.

**STOP keywords:**  
Add custom, comma-separated opt-out keywords if needed. US mobile carriers require you to provide a response (acknowledgment) when a person sends any STOP keyword. Enter the acknowledgment message your customers will receive if they opt out.

**START keywords:**  
Add custom, comma-separated opt-in keywords if needed. US mobile carriers require you to provide a response when a person sends any START keyword. Enter the acknowledgment message your customers will receive if they opt in.

**HELP keywords:**  
Your customers might reply with "HELP" or any custom HELP keyword to learn more about your messages. List all comma-separated HELP keywords and specify the message to send when any HELP keyword is received.

<img
  src="/messaging/images/10dlc/fig4.jpeg"
  alt="Additional opt-in, opt-out, and help keywords screenshot"
  className="mx-auto"
/>

### Adding phone numbers to your Campaign

You can add up to five phone numbers to your Campaign, depending on your registration type. Choose the numbers you want to use as sender IDs and select **Next**.

<img
  src="/messaging/images/10dlc/fig5.jpeg"
  alt="10DLCs for the Campaign screenshot"
  className="mx-auto"
/>

<Warning>
Each phone number can be assigned to only one Campaign. If a phone number is grayed out, unassign it from its current Campaign before proceeding.
</Warning>

### Summary and Campaign registration

Review your Campaign details. To make changes, select **Back** and update the necessary fields. Select **Register** to complete the process.

<img
  src="/messaging/images/10dlc/fig6.jpeg"
  alt="Campaign summary screenshot"
  className="mx-auto"
/>

<Note>
Campaign registration and monthly fees for the first three months are deducted from your account automatically.
</Note>

Standard use case Campaigns are automatically approved and become active. Special use case Campaigns may require additional carrier approval before activation. Once your Campaign is active, you can start messaging.