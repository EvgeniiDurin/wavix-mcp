/**
 * MCP Server Setup
 *
 * TODO: Implement by ServerAgent
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

export interface ServerConfig {
  name: string
  version: string
}

export class WavixMcpServer {
  private server: Server
  private transport: StdioServerTransport

  constructor(config: ServerConfig) {
    this.server = new Server(
      { name: config.name, version: config.version },
      { capabilities: { tools: {}, resources: {}, prompts: {} } }
    )
    this.transport = new StdioServerTransport()
  }

  async start(): Promise<void> {
    // TODO: Register tools
    // TODO: Register resources
    // TODO: Register prompts
    await this.server.connect(this.transport)
  }

  async stop(): Promise<void> {
    await this.server.close()
  }
}
