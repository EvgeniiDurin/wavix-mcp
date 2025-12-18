/**
 * MCP Resources
 *
 * Provides access to Wavix documentation through MCP resources protocol.
 * Sources:
 * - wavix://api/* - API documentation from docs.wavix.com
 * - wavix://product/* - Product documentation from wavix.com (FAQ, Pricing)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { logger } from "../helpers/logger.js"
import { listResources, getResource, readResourceContent } from "./loader.js"

export function registerResources(server: Server): void {
  const log = logger.child({ module: "resources" })

  server.setRequestHandler(ListResourcesRequestSchema, () => {
    const resources = listResources()
    log.debug("Listing resources", { count: resources.length })

    return Promise.resolve({
      resources: resources.map(r => ({
        uri: r.uri,
        name: r.name,
        description: r.description,
        mimeType: r.mimeType
      }))
    })
  })

  server.setRequestHandler(ReadResourceRequestSchema, request => {
    const { uri } = request.params
    log.debug("Reading resource", { uri })

    const resource = getResource(uri)

    if (!resource) {
      log.warn("Resource not found", { uri })
      return Promise.reject(new Error(`Resource not found: ${uri}`))
    }

    try {
      const content = readResourceContent(resource)

      return Promise.resolve({
        contents: [
          {
            uri,
            mimeType: resource.mimeType,
            text: content
          }
        ]
      })
    } catch (error) {
      log.error("Failed to read resource", { uri, error })
      return Promise.reject(new Error(`Failed to read resource: ${uri}`))
    }
  })

  // Log loaded resources on startup
  const resources = listResources()
  log.info(`Registered ${resources.length} documentation resources`)
}

// Re-export loader functions for external use
export { listResources, getResource, searchResources, getResourcesByCategory } from "./loader.js"
