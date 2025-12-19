/**
 * Integration Helper Tools
 *
 * Provides tools to help developers quickly integrate with Wavix API:
 * - get_integration_example: Returns ready-to-use code for specific endpoints
 * - get_endpoint_info: Returns detailed endpoint metadata
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import { getResource, readResourceContent } from "../resources/loader.js"
import { endpointMetadata, getEndpointInfo, getToolInfo, type EndpointInfo } from "./endpoint-metadata.js"

/**
 * Integration helper tools
 */
export const integrationTools: Array<Tool> = [
  {
    name: "integration_example",
    description:
      "Get ready-to-use code examples for Wavix API integration. Returns complete, working code snippets for the specified endpoint and language. Use this to quickly implement SMS sending, phone validation, 2FA, calls, etc.\n\nIMPORTANT: Before calling this tool:\n1. Endpoint name (endpoint) - REQUIRED, ask user\n2. Programming language (language) - OPTIONAL, try to detect from project context (package.json → 'node', requirements.txt → 'python', or ask user)\n3. Specific action (action) - OPTIONAL, ask user if they want a specific action",
    inputSchema: {
      type: "object",
      properties: {
        endpoint: {
          type: "string",
          description:
            "The API endpoint/feature to get code for. Examples: 'sms' (send SMS), 'validation' (validate numbers), 'two_fa' (2FA), 'calls' (voice calls). MUST be requested from user.",
          enum: ["sms", "validation", "two_fa", "calls", "sip_trunks", "numbers", "cdrs"]
        },
        action: {
          type: "string",
          description:
            "Specific action within the endpoint. Examples: 'send' (for sms), 'list' (for validation), 'create' (for calls). Ask user if they want a specific action. Do not auto-select."
        },
        language: {
          type: "string",
          description:
            "Programming language for the code example. OPTIONAL - try to detect from project context first (package.json → 'node', requirements.txt/Pipfile → 'python', or check open files). If cannot determine, use 'node' as default. If user explicitly requests a different language, use that.",
          enum: ["node", "curl", "python"]
        }
      },
      required: ["endpoint"]
    }
  },
  {
    name: "endpoint_info",
    description:
      "Get detailed information about a Wavix API endpoint including: API version, full path, request/response examples, related documentation. Use this to understand the exact API structure before implementing.",
    inputSchema: {
      type: "object",
      properties: {
        endpoint: {
          type: "string",
          description: "The API endpoint/tool name",
          enum: Object.keys(endpointMetadata)
        },
        action: {
          type: "string",
          description: "Specific action to get info for. If not specified, returns all actions for the endpoint."
        }
      },
      required: ["endpoint"]
    }
  },
  {
    name: "list_endpoints",
    description:
      "List all available Wavix API endpoints with their versions and descriptions. Use this to discover what APIs are available.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter by category (optional)",
          enum: [
            "SMS and MMS",
            "Number Validator",
            "2FA",
            "Call control",
            "SIP trunks",
            "My numbers",
            "CDRs",
            "Billing"
          ]
        }
      }
    }
  }
]

/**
 * Handle integration tool calls
 */
export function handleIntegrationTool(
  toolName: string,
  args: Record<string, unknown>
): { content: Array<{ type: "text"; text: string }> } {
  switch (toolName) {
    case "integration_example":
      return handleIntegrationExample(args)
    case "endpoint_info":
      return handleEndpointInfo(args)
    case "list_endpoints":
      return handleListEndpoints(args)
    default:
      throw new Error(`Unknown integration tool: ${toolName}`)
  }
}

/**
 * Get integration code example
 */
function handleIntegrationExample(args: Record<string, unknown>): {
  content: Array<{ type: "text"; text: string }>
} {
  const endpoint = args.endpoint as string
  const language = (args.language as string) || "node"
  const action = args.action as string | undefined

  if (!endpoint) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: "Missing required parameters",
              required: {
                endpoint: "API endpoint name (e.g., 'sms', 'validation', 'two_fa')"
              },
              message: "Endpoint is required. Please ask the user for the endpoint name."
            },
            null,
            2
          )
        }
      ]
    }
  }

  const finalAction = action || getDefaultAction(endpoint)

  // Get endpoint info
  const endpointInfo = getEndpointInfo(endpoint, finalAction)
  const toolInfo = getToolInfo(endpoint)

  if (!toolInfo) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: `Unknown endpoint: ${endpoint}`,
              available: Object.keys(endpointMetadata)
            },
            null,
            2
          )
        }
      ]
    }
  }

  // Try to get code snippet
  const snippetUri = endpointInfo?.codeSnippetUri?.[language as keyof typeof endpointInfo.codeSnippetUri]
  let codeSnippet = ""

  if (snippetUri) {
    const resource = getResource(snippetUri)
    if (resource) {
      try {
        codeSnippet = readResourceContent(resource)
      } catch {
        // Fallback to generated example
      }
    }
  }

  // If no snippet, generate basic example
  if (!codeSnippet) {
    codeSnippet = generateBasicExample(endpoint, finalAction, language, endpointInfo)
  }

  const result = {
    endpoint,
    action: finalAction,
    language,
    apiVersion: endpointInfo?.version || "v1",
    fullPath: endpointInfo?.fullPath || `Unknown path for ${endpoint}.${action}`,
    description: endpointInfo?.description || toolInfo.description,
    code: codeSnippet,
    relatedDocs: endpointInfo?.docsUri,
    exampleRequest: endpointInfo?.exampleRequest,
    exampleResponse: endpointInfo?.exampleResponse
  }

  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
  }
}

/**
 * Get endpoint information
 */
function handleEndpointInfo(args: Record<string, unknown>): {
  content: Array<{ type: "text"; text: string }>
} {
  const endpoint = args.endpoint as string
  const action = args.action as string | undefined

  const toolInfo = getToolInfo(endpoint)

  if (!toolInfo) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: `Unknown endpoint: ${endpoint}`,
              available: Object.keys(endpointMetadata)
            },
            null,
            2
          )
        }
      ]
    }
  }

  if (action) {
    const endpointInfo = getEndpointInfo(endpoint, action)
    if (!endpointInfo) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: `Unknown action: ${action}`,
                available: Object.keys(toolInfo.endpoints)
              },
              null,
              2
            )
          }
        ]
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              tool: endpoint,
              action,
              ...endpointInfo
            },
            null,
            2
          )
        }
      ]
    }
  }

  // Return all endpoints for the tool
  const result = {
    name: toolInfo.name,
    category: toolInfo.category,
    description: toolInfo.description,
    actions: Object.entries(toolInfo.endpoints).map(([name, info]) => ({
      action: name,
      version: info.version,
      path: info.fullPath,
      description: info.description,
      hasCodeSnippet: !!info.codeSnippetUri
    }))
  }

  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
  }
}

/**
 * List all endpoints
 */
function handleListEndpoints(args: Record<string, unknown>): {
  content: Array<{ type: "text"; text: string }>
} {
  const category = args.category as string | undefined

  let tools = Object.values(endpointMetadata)

  if (category) {
    tools = tools.filter(t => t.category === category)
  }

  const result = {
    total: tools.length,
    endpoints: tools.map(tool => ({
      name: tool.name,
      category: tool.category,
      description: tool.description,
      actions: Object.keys(tool.endpoints),
      versions: [...new Set(Object.values(tool.endpoints).map(e => e.version))]
    }))
  }

  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
  }
}

/**
 * Get default action for endpoint
 */
function getDefaultAction(endpoint: string): string {
  const defaults: Record<string, string> = {
    sms: "send",
    validation: "list",
    two_fa: "send",
    calls: "create",
    sip_trunks: "list",
    numbers: "list",
    cdrs: "list"
  }
  return defaults[endpoint] || "list"
}

/**
 * Generate basic code example when no snippet available
 */
function generateBasicExample(
  endpoint: string,
  action: string,
  language: string,
  info: EndpointInfo | undefined
): string {
  const path = info?.fullPath || `/v1/${endpoint}`
  const method = action === "list" || action === "get" ? "GET" : "POST"

  if (language === "curl") {
    if (method === "GET") {
      return `curl "https://api.wavix.com${path}?appid=YOUR_API_KEY"`
    }
    return `curl -X POST "https://api.wavix.com${path}?appid=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(info?.exampleRequest || {}, null, 2)}'`
  }

  // Node.js
  return `const WAVIX_API_KEY = process.env.WAVIX_API_KEY
const WAVIX_API_URL = process.env.WAVIX_API_URL || "https://api.wavix.com"

async function ${action}${capitalize(endpoint)}() {
  const url = \`\${WAVIX_API_URL}${path}?appid=\${WAVIX_API_KEY}\`

  const response = await fetch(url${
    method === "POST"
      ? `, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(${JSON.stringify(info?.exampleRequest || {}, null, 4)})
  }`
      : ""
  })

  return response.json()
}

// Usage
const result = await ${action}${capitalize(endpoint)}()
console.log(result)`
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Check if tool is an integration tool
 */
export function isIntegrationTool(name: string): boolean {
  return ["integration_example", "endpoint_info", "list_endpoints"].includes(name)
}
