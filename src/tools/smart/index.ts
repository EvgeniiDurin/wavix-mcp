/**
 * Smart Tools
 *
 * High-level tools that understand natural language and provide guidance
 */

export { assistantTool, handleAssistant, isAssistantTool } from "./assistant.js"
export { quickCheckTool, handleQuickCheck, isQuickCheckTool } from "./quick-check.js"

import { assistantTool } from "./assistant.js"
import { quickCheckTool } from "./quick-check.js"

export const smartTools = [assistantTool, quickCheckTool]
