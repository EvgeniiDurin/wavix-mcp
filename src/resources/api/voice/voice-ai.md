---
title: "Getting started with Voice AI"
description: "Add artificial intelligence to your voice communications with real-time speech processing, natural conversation, and intelligent call handling."
sidebarTitle: "Getting started"
keywords: ["Voice AI", "AI voice", "AI calls", "conversational agents", "call transcription", "SIP trunking"]
---

## What is Voice AI?

Voice AI lets your applications understand and respond to spoken language automatically. It powers features like interactive voice menus, virtual assistants, and voice-to-text conversion, so you can create apps that talk with customers naturally without needing a person on the line.

## Common use cases

<AccordionGroup>
  <Accordion title="Automated voice agents">
    Handle inbound and outbound calls with AI agents that understand what callers say and respond naturally in real-time. Use them for customer support, scheduling appointments, or collecting information.  
  
  </Accordion>
  
  <Accordion title="Call transcription and analysis">
    Convert speech into text during or after calls. Analyze conversations to understand sentiment, check compliance, or improve quality.
  </Accordion>
  
  <Accordion title="Improved IVR systems">
    Replace traditional touch-tone menus with natural language understanding. Let callers simply say what they need instead of pressing numbered options.
  </Accordion>
  
  <Accordion title="Call screening and routing">
    Use AI to understand what callers want and why they're calling, then route them to the right place with full context.
  </Accordion>
</AccordionGroup>

## How it works

Voice AI integrations connect to Wavix in two ways, depending on your provider and use case.

### SIP trunk integration (Bring your own bot)

Connect a Wavix SIP trunk with to your AI provider, then configure the provider's voice agent to handle calls. Wavix routes calls through the SIP trunk, and the AI agent processes speech and responds in real-time, enabling natural conversations with callers.

**Best for:** Pre-built AI voice platforms with native telephony support

**Flow:** Create a SIP trunk between Wavix and your AI provider. Set up the provider's voice agent to manage calls. Wavix sends inbound and outbound calls over SIP, and the AI agent listens, understands, and replies to callers in real time.

### WebSocket integration (Media streams)

Stream audio in real-time to an AI service through WebSockets. You control the AI processing while Wavix handles the voice infrastructure.

**Best for:** Custom AI implementations or services without native telephony

**Flow:** Initiate calls through the Calls API, receive real-time audio streams via WebSocket connection, process audio with your AI service, and send audio responses back through the WebSocket. See the [call streaming guide](./call-streaming) for implementation details.

<Note>
Both methods support inbound and outbound calls. Choose based on whether you want a managed AI solution (SIP trunk) or custom AI processing (WebSocket).
</Note>

## Next steps

Explore available AI features for your voice workflows. Add [transcription](../call-transcription.md), conversational agents, or intelligent call routing to automate tasks and improve customer interactions.

See the [API reference](/api-reference/getting-started.mdx) and the [Calls API](/api-reference/call-control/start-a-new-call) for more detailed information.