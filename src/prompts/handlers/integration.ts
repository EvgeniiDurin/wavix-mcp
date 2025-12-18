/**
 * Integration & Code Generation Prompt Handlers
 */

import {
  getFeatureDocPath,
  getFeatureRequirements,
  getQuickstartAction,
  getQuickstartDocPath,
  getQuickstartSpecificInstructions
} from "../helpers.js"
import { createTextPrompt, type PromptHandlerMap } from "./types.js"

export const integrationHandlers: PromptHandlerMap = {
  "wavix-integrate": args =>
    createTextPrompt(
      `Generate ${args?.language} code${args?.framework ? ` (${args.framework})` : ""} for Wavix ${args?.feature} API.

API: https://api.wavix.com (/v1 voice/numbers, /v3 SMS/10DLC, /v2 WebRTC)
Auth: ?appid=WAVIX_API_KEY
Docs: wavix://api/${getFeatureDocPath(args?.feature)}

Include:
${getFeatureRequirements(args?.feature)}

Use env vars, error handling, input validation.`
    ),

  "wavix-webhook-setup": args =>
    createTextPrompt(
      `Generate ${args?.language} webhook handler${args?.framework ? ` (${args.framework})` : ""}.

Events: ${args?.events || "message.received, message.delivered, call.completed"}

Include signature verification (HMAC SHA256), event routing, async processing.
Use WAVIX_WEBHOOK_SECRET env var.`
    ),

  "wavix-quickstart": args =>
    createTextPrompt(
      `Generate ${args?.language} quickstart to ${getQuickstartAction(args?.action)}.

${getQuickstartSpecificInstructions(args?.action)}

Docs: wavix://api/${getQuickstartDocPath(args?.action)}

Keep under 50 lines, use native HTTP client, include error handling.`
    )
}
