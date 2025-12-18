/**
 * Wavix MCP Server
 *
 * Main server setup with tools, resources, and prompts registration
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { WavixClient } from "./api/client.js"
import { config } from "./config/index.js"
import { logger } from "./helpers/logger.js"
import { registerPrompts } from "./prompts/index.js"
import { registerResources } from "./resources/index.js"
import { registerTools } from "./tools/index.js"

export interface ServerConfig {
  name: string
  version: string
}

export class WavixMcpServer {
  private server: Server
  private transport: StdioServerTransport
  private client: WavixClient

  constructor(serverConfig: ServerConfig) {
    this.server = new Server(
      { name: serverConfig.name, version: serverConfig.version },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {}
        }
      }
    )
    this.transport = new StdioServerTransport()
    this.client = new WavixClient()
  }

  async start(): Promise<void> {
    const log = logger.child({ module: "server" })

    log.info("Initializing MCP server", {
      name: config.mcp.serverName,
      version: config.mcp.serverVersion,
      mode: config.wavix.hasApiKey ? "Full Mode" : "Documentation Mode"
    })

    // Register tools
    registerTools(this.server, this.client)

    // Register resources (documentation)
    registerResources(this.server)

    // Register prompts (templates)
    registerPrompts(this.server)

    // Connect transport
    await this.server.connect(this.transport)

    log.info("MCP server started successfully")
  }

  async stop(): Promise<void> {
    const log = logger.child({ module: "server" })
    log.info("Stopping MCP server")
    await this.server.close()
    log.info("MCP server stopped")
  }
}
