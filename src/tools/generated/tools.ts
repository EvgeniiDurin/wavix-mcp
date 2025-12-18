/**
 * Generated MCP Tools from OpenAPI
 *
 * AUTO-GENERATED - DO NOT EDIT
 * Run: pnpm generate:tools
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js"

export interface ToolMetaInfo {
  path: string
  method: string
  operationId: string
}

// Placeholder - will be generated from OpenAPI spec
export const generatedTools: Tool[] = [
  // {
  //   name: "sms_send",
  //   description: "Send SMS message",
  //   inputSchema: {
  //     type: "object",
  //     properties: {
  //       to: { type: "string", description: "Destination phone number in E.164 format" },
  //       message: { type: "string", description: "Message text" }
  //     },
  //     required: ["to", "message"]
  //   }
  // }
]

export const toolMeta = new Map<string, ToolMetaInfo>([
  // ["sms_send", { path: "/messages", method: "POST", operationId: "sendMessage" }]
])
