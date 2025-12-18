/**
 * Prompt Handler Types
 */

import type { GetPromptResult } from "@modelcontextprotocol/sdk/types.js"

export type PromptArgs = Record<string, string> | undefined

export type PromptHandler = (args: PromptArgs) => Promise<GetPromptResult>

export type PromptHandlerMap = Record<string, PromptHandler>

export function createTextPrompt(text: string): Promise<GetPromptResult> {
  return Promise.resolve({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text
        }
      }
    ]
  })
}
