#!/usr/bin/env tsx
/**
 * Generate MCP Tools from OpenAPI Specification
 *
 * Reads wavix-api.yaml and generates:
 * - src/tools/generated/tools.ts
 */

import fs from "fs"
import path from "path"
import yaml from "yaml"

const OPENAPI_PATH = "./api/wavix-api.yaml"
const OUTPUT_PATH = "./src/tools/generated/tools.ts"

interface OpenApiOperation {
  operationId: string
  summary?: string
  description?: string
  parameters?: OpenApiParameter[]
  requestBody?: {
    content?: {
      "application/json"?: {
        schema?: OpenApiSchema
      }
    }
  }
}

interface OpenApiParameter {
  name: string
  in: string
  required?: boolean
  description?: string
  schema?: OpenApiSchema
}

interface OpenApiSchema {
  type?: string
  properties?: Record<string, OpenApiSchema>
  required?: string[]
  description?: string
  enum?: string[]
  items?: OpenApiSchema
}

// Tool name mappings from operationId or path+method
const TOOL_NAME_MAPPINGS: Record<string, string> = {
  "POST /messages": "sms_send",
  "GET /messages": "sms_list",
  "GET /messages/{id}": "sms_get",
  "POST /call": "call_start",
  "GET /cdr": "cdr_list",
  "GET /cdr/{id}": "cdr_get",
  "GET /did": "numbers_list",
  "GET /did/{id}": "numbers_get",
  "POST /2fa/send": "twofa_send",
  "POST /2fa/verify": "twofa_verify",
  "GET /profile": "account_profile",
  "GET /billing/balance": "account_balance"
}

function generateToolName(path: string, method: string, operationId: string): string {
  const key = `${method.toUpperCase()} ${path}`
  return TOOL_NAME_MAPPINGS[key] || operationId || `${method}_${path.replace(/\//g, "_").replace(/[{}]/g, "")}`
}

function convertToJsonSchema(operation: OpenApiOperation): object {
  const properties: Record<string, object> = {}
  const required: string[] = []

  // Add path/query parameters
  for (const param of operation.parameters || []) {
    properties[param.name] = {
      type: param.schema?.type || "string",
      description: param.description
    }
    if (param.required) {
      required.push(param.name)
    }
  }

  // Add request body properties
  const bodySchema = operation.requestBody?.content?.["application/json"]?.schema
  if (bodySchema?.properties) {
    for (const [key, value] of Object.entries(bodySchema.properties)) {
      properties[key] = {
        type: value.type || "string",
        description: value.description
      }
    }
    if (bodySchema.required) {
      required.push(...bodySchema.required)
    }
  }

  return {
    type: "object",
    properties,
    ...(required.length > 0 ? { required } : {})
  }
}

async function main() {
  console.log("=== Generating MCP Tools from OpenAPI ===\n")

  // Check if OpenAPI file exists
  if (!fs.existsSync(OPENAPI_PATH)) {
    console.log(`OpenAPI spec not found at ${OPENAPI_PATH}`)
    console.log("Run: pnpm sync:openapi")
    process.exit(1)
  }

  const specContent = fs.readFileSync(OPENAPI_PATH, "utf-8")
  const spec = yaml.parse(specContent) as {
    info: { title: string; version: string }
    paths: Record<string, Record<string, OpenApiOperation>>
  }

  console.log(`API: ${spec.info.title} v${spec.info.version}`)

  const tools: object[] = []
  const metas: [string, object][] = []

  for (const [apiPath, methods] of Object.entries(spec.paths || {})) {
    for (const [method, operation] of Object.entries(methods)) {
      if (method === "parameters" || !operation.operationId) continue

      const toolName = generateToolName(apiPath, method, operation.operationId)
      const description = [operation.summary, operation.description].filter(Boolean).join(". ").trim()

      tools.push({
        name: toolName,
        description: description || `${method.toUpperCase()} ${apiPath}`,
        inputSchema: convertToJsonSchema(operation)
      })

      metas.push([
        toolName,
        {
          path: apiPath,
          method: method.toUpperCase(),
          operationId: operation.operationId
        }
      ])
    }
  }

  const output = `/**
 * Generated MCP Tools from OpenAPI
 *
 * AUTO-GENERATED - DO NOT EDIT
 * Generated at: ${new Date().toISOString()}
 * Source: ${OPENAPI_PATH}
 *
 * Run: pnpm generate:tools
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js"

export interface ToolMetaInfo {
  path: string
  method: string
  operationId: string
}

export const generatedTools: Tool[] = ${JSON.stringify(tools, null, 2)}

export const toolMeta = new Map<string, ToolMetaInfo>(${JSON.stringify(metas, null, 2)})
`

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(OUTPUT_PATH, output)

  console.log(`\nGenerated ${tools.length} tools`)
  console.log(`Output: ${OUTPUT_PATH}`)
  console.log("\n=== Generation complete ===")
}

main().catch(console.error)
