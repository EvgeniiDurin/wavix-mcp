/**
 * MCP Resources
 *
 * TODO: Implement resources for documentation access
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { logger } from "../helpers/logger.js"

export function registerResources(server: Server): void {
  const log = logger.child({ module: "resources" })

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    log.debug("Listing resources")
    return {
      resources: [
        // {
        //   uri: "wavix://docs/sms",
        //   name: "SMS Documentation",
        //   description: "How to send SMS messages via Wavix API"
        // }
      ]
    }
  })

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params
    log.debug("Reading resource", { uri })

    // TODO: Return documentation content
    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: "# Documentation\n\nResource content not implemented yet."
        }
      ]
    }
  })
}
