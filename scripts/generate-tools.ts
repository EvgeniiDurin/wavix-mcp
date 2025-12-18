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

interface OpenApiSpec {
  info: { title: string; version: string }
  paths: Record<string, Record<string, OpenApiOperation>>
  components?: {
    schemas?: Record<string, OpenApiSchema>
  }
}

interface OpenApiOperation {
  operationId: string
  summary?: string
  description?: string
  tags?: string[]
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
  $ref?: string
  type?: string
  properties?: Record<string, OpenApiSchema>
  required?: string[]
  description?: string
  enum?: string[]
  items?: OpenApiSchema
  allOf?: OpenApiSchema[]
  oneOf?: OpenApiSchema[]
  anyOf?: OpenApiSchema[]
  format?: string
  example?: unknown
}

// Global reference to spec for resolving $refs
let globalSpec: OpenApiSpec

/**
 * Resolve $ref to actual schema
 */
function resolveRef(ref: string): OpenApiSchema | undefined {
  if (!ref.startsWith("#/components/schemas/")) {
    return undefined
  }
  const schemaName = ref.replace("#/components/schemas/", "")
  return globalSpec.components?.schemas?.[schemaName]
}

/**
 * Resolve schema with $ref support
 */
function resolveSchema(schema: OpenApiSchema | undefined): OpenApiSchema | undefined {
  if (!schema) return undefined

  if (schema.$ref) {
    return resolveRef(schema.$ref)
  }

  if (schema.allOf) {
    // Merge all schemas in allOf
    const merged: OpenApiSchema = { type: "object", properties: {}, required: [] }
    for (const subSchema of schema.allOf) {
      const resolved = resolveSchema(subSchema)
      if (resolved?.properties) {
        merged.properties = { ...merged.properties, ...resolved.properties }
      }
      if (resolved?.required) {
        merged.required = [...(merged.required || []), ...resolved.required]
      }
    }
    return merged
  }

  return schema
}

/**
 * Convert operationId to snake_case tool name
 */
function toSnakeCase(str: string): string {
  return str
    // Insert underscore before uppercase letters
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    // Insert underscore before sequences of uppercase followed by lowercase
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    // Replace spaces and special chars with underscore
    .replace(/[\s\-\.]+/g, "_")
    // Remove non-alphanumeric except underscore
    .replace(/[^a-zA-Z0-9_]/g, "")
    // Convert to lowercase
    .toLowerCase()
    // Remove duplicate underscores
    .replace(/_+/g, "_")
    // Remove leading/trailing underscores
    .replace(/^_|_$/g, "")
}

/**
 * Explicit path+method to tool name mappings
 */
const TOOL_NAME_MAP: Record<string, Record<string, string>> = {
  // SIP Trunks
  "/trunks": { get: "sip_trunks_list", post: "sip_trunk_create" },
  "/trunks/{id}": { get: "sip_trunk_get", put: "sip_trunk_update", delete: "sip_trunk_delete" },

  // Buy Numbers
  "/buy/countries": { get: "buy_countries_list" },
  "/buy/countries/{country}/regions": { get: "buy_regions_list" },
  "/buy/countries/{country}/cities": { get: "buy_cities_list" },
  "/buy/countries/{country}/regions/{region}/cities": { get: "buy_region_cities_list" },
  "/buy/countries/{country}/cities/{city}/dids": { get: "buy_numbers_available" },

  // Cart
  "/buy/cart": { get: "cart_get", post: "cart_add", delete: "cart_clear" },
  "/buy/cart/checkout": { post: "cart_checkout" },

  // My Numbers (DIDs)
  "/mydids": { get: "numbers_list", delete: "numbers_bulk_delete" },
  "/mydids/{id}": { get: "number_get", delete: "number_delete" },
  "/mydids/update-sms-enabled": { put: "numbers_sms_update" },
  "/mydids/update-destinations": { put: "numbers_destinations_update" },
  "/mydids/papers": { post: "numbers_papers_upload" },

  // CDRs
  "/cdr": { get: "cdr_list", post: "cdr_export" },
  "/cdr/{cdr_uuid}/retranscribe": { post: "cdr_retranscribe" },
  "/cdr/{cdr_uuid}/transcription": { get: "cdr_transcription_get" },
  "/cdr/{uuid}": { get: "cdr_get" },
  "/cdr/all": { get: "cdr_list_all" },

  // Recordings
  "/recordings": { get: "recordings_list" },
  "/recordings/{cdr_uuid}": { get: "recording_get_by_cdr" },
  "/recordings/{id}": { get: "recording_get" },

  // Speech Analytics
  "/speech-analytics": { get: "speech_analytics_list" },
  "/speech-analytics/{uuid}": { get: "speech_analytics_get", put: "speech_analytics_update" },
  "/speech-analytics/{uuid}/file": { get: "speech_analytics_file_download" },

  // Call Webhooks
  "/call/webhooks": { get: "call_webhooks_get", put: "call_webhooks_update", delete: "call_webhooks_delete" },

  // Call Control
  "/call": { post: "call_create", get: "calls_list" },
  "/call/{uuid}": { get: "call_get", delete: "call_hangup" },
  "/call/{uuid}/answer": { post: "call_answer" },
  "/call/{uuid}/streams": { post: "call_stream_start" },
  "/call/{uuid}/streams/{stream_uuid}": { delete: "call_stream_stop" },
  "/call/{uuid}/play": { post: "call_play" },
  "/call/{uuid}/audio": { post: "call_audio_inject" },
  "/call/{uuid}/collect": { post: "call_dtmf_collect" },

  // WebRTC
  "/webrtc/tokens": { get: "webrtc_tokens_list", post: "webrtc_token_create" },
  "/webrtc/tokens/{uuid}": { get: "webrtc_token_get", put: "webrtc_token_update", delete: "webrtc_token_delete" },

  // SMS/MMS
  "/messages/sender_ids": { get: "sms_sender_ids_list", post: "sms_sender_id_create" },
  "/messages/sender_ids/{id}": { get: "sms_sender_id_get", delete: "sms_sender_id_delete" },
  "/messages/opt_outs": { post: "sms_opt_out_add" },
  "/messages": { get: "sms_list", post: "sms_send" },
  "/messages/{id}": { get: "sms_get" },
  "/messages/all": { get: "sms_list_all" },

  // 10DLC (TCR)
  "/10dlc/brands": { get: "tcr_brands_list", post: "tcr_brand_create" },
  "/10dlc/brands/{brand_id}": { get: "tcr_brand_get", put: "tcr_brand_update", delete: "tcr_brand_delete" },
  "/10dlc/brands/{brand_id}/appeals": { get: "tcr_brand_appeals_list", post: "tcr_brand_appeal_create" },
  "/10dlc/brands/{brand_id}/evidence": { get: "tcr_evidence_list", post: "tcr_evidence_upload" },
  "/10dlc/brands/{brand_id}/evidence/{uuid}": { get: "tcr_evidence_get", delete: "tcr_evidence_delete" },
  "/10dlc/brands/{brand_id}/vettings": { get: "tcr_vettings_list", post: "tcr_vetting_create" },
  "/10dlc/brands/{brand_id}/vettings/appeals": { post: "tcr_vetting_appeal_create" },
  "/10dlc/brands/{brand_id}/usecases/{use_case}": { get: "tcr_usecase_get", post: "tcr_usecase_create", put: "tcr_usecase_update" },

  // Number Validator
  "/validate/caller_id": { get: "validate_caller_id_status", post: "validate_caller_id_start", delete: "validate_caller_id_cancel" },

  // Voice Campaigns
  "/voice-campaigns": { get: "voice_campaigns_list" },
  "/voice-campaigns/{id}": { get: "voice_campaign_get" },

  // Link Shortener
  "/link-shortener": { get: "links_list", post: "link_create" },

  // 2FA
  "/2fa/templates": { get: "twofa_templates_list", post: "twofa_template_create" },
  "/2fa/templates/{id}": { get: "twofa_template_get", put: "twofa_template_update", delete: "twofa_template_delete" },
  "/2fa/send": { post: "twofa_send" },

  // Billing
  "/billing/balance": { get: "billing_balance_get" },
  "/billing/history": { get: "billing_history_list" },
  "/billing/invoices": { get: "billing_invoices_list" },

  // Profile
  "/profile": { get: "profile_get" },
  "/profile/sender_ids": { get: "profile_sender_ids_list" },
  "/profile/supported_countries": { get: "profile_countries_list" },

  // Sub-accounts
  "/sub_accounts": { get: "subaccounts_list", post: "subaccount_create" },
  "/sub_accounts/{id}": { get: "subaccount_get", put: "subaccount_update", delete: "subaccount_delete" }
}

/**
 * Generate semantic tool name from path and method
 */
function generateToolName(apiPath: string, method: string, _operation: OpenApiOperation): string {
  // Check explicit mapping first
  const pathMap = TOOL_NAME_MAP[apiPath]
  if (pathMap && pathMap[method]) {
    return pathMap[method]
  }

  // Fallback: construct from path and method
  const pathParts = apiPath
    .split("/")
    .filter(Boolean)
    .map((p) => {
      if (p.startsWith("{") && p.endsWith("}")) return ""
      return p.replace(/[^a-zA-Z0-9]/g, "_")
    })
    .filter(Boolean)

  const resource = pathParts.join("_").toLowerCase()
  const action = method === "get" ? (apiPath.includes("{") ? "get" : "list") : method === "post" ? "create" : method === "put" ? "update" : method

  return `${resource}_${action}`
}

/**
 * Convert OpenAPI schema to JSON Schema for MCP tool
 */
function convertToJsonSchema(
  operation: OpenApiOperation,
  apiPath: string
): { type: string; properties: Record<string, object>; required?: string[] } {
  const properties: Record<string, object> = {}
  const required: string[] = []

  // Add path parameters
  const pathParams = apiPath.match(/\{([^}]+)\}/g)?.map((p) => p.slice(1, -1)) || []

  // Add path/query parameters
  for (const param of operation.parameters || []) {
    const schema = resolveSchema(param.schema)
    const prop: Record<string, unknown> = {
      type: schema?.type || "string",
      description: param.description
    }
    if (schema?.enum) {
      prop.enum = schema.enum
    }
    if (schema?.format) {
      prop.format = schema.format
    }
    properties[param.name] = prop

    if (param.required || pathParams.includes(param.name)) {
      required.push(param.name)
    }
  }

  // Add request body properties
  const bodyContent = operation.requestBody?.content?.["application/json"]
  if (bodyContent?.schema) {
    const bodySchema = resolveSchema(bodyContent.schema)
    if (bodySchema?.properties) {
      for (const [key, value] of Object.entries(bodySchema.properties)) {
        const resolved = resolveSchema(value)
        const prop: Record<string, unknown> = {
          type: resolved?.type || "string",
          description: resolved?.description || value.description
        }
        if (resolved?.enum) {
          prop.enum = resolved.enum
        }
        if (resolved?.format) {
          prop.format = resolved.format
        }
        if (resolved?.type === "array" && resolved.items) {
          const itemSchema = resolveSchema(resolved.items)
          prop.items = { type: itemSchema?.type || "string" }
        }
        properties[key] = prop
      }
      if (bodySchema.required) {
        for (const req of bodySchema.required) {
          if (!required.includes(req)) {
            required.push(req)
          }
        }
      }
    }
  }

  return {
    type: "object",
    properties,
    ...(required.length > 0 ? { required } : {})
  }
}

/**
 * Group tools by category for better organization
 */
function categorizeTools(
  tools: Array<{ name: string; category: string }>
): Record<string, string[]> {
  const categories: Record<string, string[]> = {}
  for (const tool of tools) {
    if (!categories[tool.category]) {
      categories[tool.category] = []
    }
    categories[tool.category].push(tool.name)
  }
  return categories
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
  const spec = yaml.parse(specContent) as OpenApiSpec
  globalSpec = spec

  console.log(`API: ${spec.info.title} v${spec.info.version}`)

  const tools: Array<{
    name: string
    description: string
    inputSchema: object
  }> = []

  const metas: Array<[string, { path: string; method: string; operationId: string }]> = []
  const toolCategories: Array<{ name: string; category: string }> = []
  const seenNames = new Set<string>()

  for (const [apiPath, methods] of Object.entries(spec.paths || {})) {
    for (const [method, operation] of Object.entries(methods)) {
      if (method === "parameters" || !operation.operationId) continue

      let toolName = generateToolName(apiPath, method, operation)

      // Ensure unique names
      if (seenNames.has(toolName)) {
        const suffix = method === "get" ? "_get" : method === "post" ? "_create" : `_${method}`
        toolName = `${toolName}${suffix}`
      }
      seenNames.add(toolName)

      const description = [operation.summary, operation.description].filter(Boolean).join(". ").trim()
      const category = operation.tags?.[0] || "Other"

      tools.push({
        name: toolName,
        description: description || `${method.toUpperCase()} ${apiPath}`,
        inputSchema: convertToJsonSchema(operation, apiPath)
      })

      metas.push([
        toolName,
        {
          path: apiPath,
          method: method.toUpperCase(),
          operationId: operation.operationId
        }
      ])

      toolCategories.push({ name: toolName, category })
    }
  }

  const categories = categorizeTools(toolCategories)

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

/**
 * Tool categories for organization
 */
export const toolCategories: Record<string, string[]> = ${JSON.stringify(categories, null, 2)}

/**
 * All generated MCP tools
 */
export const generatedTools: Tool[] = ${JSON.stringify(tools, null, 2)}

/**
 * Metadata mapping tool names to API endpoints
 */
export const toolMeta = new Map<string, ToolMetaInfo>(${JSON.stringify(metas, null, 2)})

/**
 * Get tool by name
 */
export function getTool(name: string): Tool | undefined {
  return generatedTools.find(t => t.name === name)
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): Tool[] {
  const names = toolCategories[category] || []
  return generatedTools.filter(t => names.includes(t.name))
}
`

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(OUTPUT_PATH, output)

  console.log(`\nGenerated ${tools.length} tools in ${Object.keys(categories).length} categories:`)
  for (const [cat, names] of Object.entries(categories)) {
    console.log(`  - ${cat}: ${names.length} tools`)
  }
  console.log(`\nOutput: ${OUTPUT_PATH}`)
  console.log("\n=== Generation complete ===")
}

main().catch(console.error)
