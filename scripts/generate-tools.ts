#!/usr/bin/env tsx
/**
 * Generate Grouped MCP Tools from OpenAPI Specification
 *
 * Creates unified tools with "action" parameter from tool-groups.ts config
 * Each group becomes a single MCP tool with multiple actions
 *
 * Reads wavix-api.yaml and generates:
 * - src/tools/generated/tools.ts
 */

import fs from "fs"
import path from "path"
import yaml from "yaml"
import { toolGroups, type ToolGroupConfig } from "./tool-groups.js"

const OPENAPI_PATH = "./api/wavix-api.yaml"
const OUTPUT_PATH = "./src/tools/generated/tools.ts"
const DEFAULT_API_VERSION = "/v1"

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
  servers?: Array<{ url: string }>
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
 * Extract API version prefix from operation's servers block
 */
function getApiVersionPrefix(operation: OpenApiOperation): string {
  if (operation.servers && operation.servers.length > 0) {
    const serverUrl = operation.servers[0].url
    const match = serverUrl.match(/\/v\d+$/)
    if (match) {
      return match[0]
    }
  }
  return DEFAULT_API_VERSION
}

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
    // First, check if any subschema is a scalar type (string, number, etc. with enum)
    // This handles cases like: allOf: [{ $ref: "#/.../EnumType" }, { description: "..." }]
    for (const subSchema of schema.allOf) {
      const resolved = resolveSchema(subSchema)
      // If we find a scalar type with enum, return it (don't merge as object)
      if (resolved && resolved.type && resolved.type !== "object" && resolved.enum) {
        return resolved
      }
    }

    // Otherwise, merge as object (for complex object allOf)
    const merged: OpenApiSchema = { type: "object", properties: {}, required: [] }
    for (const subSchema of schema.allOf) {
      const resolved = resolveSchema(subSchema)
      if (resolved?.properties) {
        merged.properties = { ...merged.properties, ...resolved.properties }
      }
      if (resolved?.required) {
        merged.required = [...(merged.required || []), ...resolved.required]
      }
      // Also merge description if present
      if (resolved?.description && !merged.description) {
        merged.description = resolved.description
      }
    }
    return merged
  }

  return schema
}

/**
 * Find OpenAPI operation by path and method
 */
function findOperation(apiPath: string, method: string): OpenApiOperation | undefined {
  const pathObj = globalSpec.paths[apiPath]
  if (!pathObj) return undefined
  return pathObj[method.toLowerCase()]
}

/**
 * Extract parameters from OpenAPI operation
 */
function extractParameters(
  operation: OpenApiOperation,
  apiPath: string
): { properties: Record<string, object>; required: string[] } {
  const properties: Record<string, object> = {}
  const required: string[] = []

  // Path parameters are always required
  const pathParams = apiPath.match(/\{([^}]+)\}/g)?.map(p => p.slice(1, -1)) || []

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

  return { properties, required }
}

/**
 * Build combined input schema for a grouped tool
 */
function buildGroupedInputSchema(
  group: ToolGroupConfig
): {
  inputSchema: object
  actionMeta: Record<string, { path: string; method: string; operationId: string; requiredParams: string[] }>
} {
  const actionNames = Object.keys(group.actions)
  const allProperties: Record<string, object> = {}
  const actionMeta: Record<string, { path: string; method: string; operationId: string; requiredParams: string[] }> = {}
  const actionInfo: Record<string, { summary: string; required: string[] }> = {}

  // Process each action to collect all possible parameters
  for (const [actionName, actionConfig] of Object.entries(group.actions)) {
    // Handle config actions specially
    if (actionConfig.path.startsWith("__config__")) {
      actionMeta[actionName] = {
        path: actionConfig.path,
        method: actionConfig.method,
        operationId: `config_${actionName}`,
        requiredParams: actionName === "set_api_url" ? ["url"] : []
      }
      // Add url parameter for set_api_url action
      if (actionName === "set_api_url") {
        allProperties["url"] = {
          type: "string",
          description: "The new API base URL (e.g., https://api.wavix.com)"
        }
      }
      actionInfo[actionName] = {
        summary: "Manage configuration",
        required: actionName === "set_api_url" ? ["url"] : []
      }
      continue
    }

    const operation = findOperation(actionConfig.path, actionConfig.method)
    if (!operation) {
      console.warn(`  Warning: Operation not found for ${actionConfig.method} ${actionConfig.path}`)
      continue
    }

    const { properties, required } = extractParameters(operation, actionConfig.path)

    // Merge properties (later actions may add more params)
    for (const [key, value] of Object.entries(properties)) {
      if (!allProperties[key]) {
        allProperties[key] = value
      }
    }

    // Get API version
    const versionPrefix = getApiVersionPrefix(operation)

    actionMeta[actionName] = {
      path: `${versionPrefix}${actionConfig.path}`,
      method: actionConfig.method,
      operationId: operation.operationId,
      requiredParams: required
    }

    // Store action summary and required params from OpenAPI
    actionInfo[actionName] = {
      summary: operation.summary || `${actionConfig.method} ${actionConfig.path}`,
      required
    }
  }

  // Build action description with summaries and required params from OpenAPI
  const actionDescParts = actionNames.map(name => {
    const info = actionInfo[name]
    if (!info) return name

    let desc = `${name} (${info.summary}`
    if (info.required.length > 0) {
      desc += `, requires: ${info.required.join(", ")}`
    }
    desc += ")"
    return desc
  })
  const actionDescription = `Action to perform: ${actionDescParts.join(", ")}`

  // Add the action parameter with detailed descriptions
  allProperties["action"] = {
    type: "string",
    enum: actionNames,
    description: actionDescription
  }

  // Action is always required
  const inputSchema = {
    type: "object",
    properties: allProperties,
    required: ["action"]
  }

  return { inputSchema, actionMeta }
}

/**
 * Generate tools from groups config
 */
function generateGroupedTools(): {
  tools: Array<{ name: string; description: string; inputSchema: object }>
  metas: Record<string, Record<string, { path: string; method: string; operationId: string; requiredParams: string[] }>>
  categories: Record<string, string[]>
} {
  const tools: Array<{ name: string; description: string; inputSchema: object }> = []
  const metas: Record<
    string,
    Record<string, { path: string; method: string; operationId: string; requiredParams: string[] }>
  > = {}
  const categories: Record<string, string[]> = {}

  for (const group of toolGroups) {
    console.log(`Processing group: ${group.name}`)

    const { inputSchema, actionMeta } = buildGroupedInputSchema(group)

    tools.push({
      name: group.name,
      description: group.description,
      inputSchema
    })

    metas[group.name] = actionMeta

    // Add to category
    if (!categories[group.category]) {
      categories[group.category] = []
    }
    categories[group.category].push(group.name)
  }

  return { tools, metas, categories }
}

async function main() {
  console.log("=== Generating Grouped MCP Tools from OpenAPI ===\n")

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
  console.log(`Tool groups defined: ${toolGroups.length}\n`)

  const { tools, metas, categories } = generateGroupedTools()

  const output = `/**
 * Generated Grouped MCP Tools from OpenAPI
 *
 * AUTO-GENERATED - DO NOT EDIT
 * Generated at: ${new Date().toISOString()}
 * Source: ${OPENAPI_PATH}
 *
 * Each tool represents a group of related operations with an "action" parameter
 *
 * Run: pnpm generate:tools
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js"

export interface ActionMeta {
  path: string
  method: string
  operationId: string
  requiredParams: string[]
}

export interface ToolMetaInfo {
  /** Map of action name to endpoint metadata */
  actions: Record<string, ActionMeta>
}

/**
 * Tool categories for organization
 */
export const toolCategories: Record<string, string[]> = ${JSON.stringify(categories, null, 2)}

/**
 * All generated MCP tools (grouped by entity)
 */
export const generatedTools: Tool[] = ${JSON.stringify(tools, null, 2)}

/**
 * Metadata mapping tool names to action endpoints
 */
export const toolMeta: Record<string, ToolMetaInfo> = ${JSON.stringify(
    Object.fromEntries(Object.entries(metas).map(([name, actions]) => [name, { actions }])),
    null,
    2
  )}

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

/**
 * Get action metadata for a tool
 */
export function getActionMeta(toolName: string, action: string): ActionMeta | undefined {
  return toolMeta[toolName]?.actions[action]
}
`

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(OUTPUT_PATH, output)

  // Count total actions
  let totalActions = 0
  for (const group of toolGroups) {
    totalActions += Object.keys(group.actions).length
  }

  console.log(`\nGenerated ${tools.length} grouped tools (from ${totalActions} operations) in ${Object.keys(categories).length} categories:`)
  for (const [cat, names] of Object.entries(categories)) {
    console.log(`  - ${cat}: ${names.length} tools`)
  }
  console.log(`\nOutput: ${OUTPUT_PATH}`)
  console.log("\n=== Generation complete ===")
}

main().catch(console.error)
