#!/usr/bin/env node
/**
 * Wavix MCP Server - Entry Point
 *
 * MCP server providing AI assistants access to Wavix Telecom API
 */

// Register module aliases FIRST (before any other imports)
import "./aliases.js"

import "dotenv/config"
import { config } from "./config/index.js"
import { logger } from "./helpers/logger.js"
import { WavixMcpServer } from "./server.js"

async function main() {
  logger.info("Starting Wavix MCP Server", {
    name: config.mcp.serverName,
    version: config.mcp.serverVersion,
    mode: config.wavix.hasApiKey ? "Full Mode (Tools enabled)" : "Documentation Mode",
    env: config.nodeEnv
  })

  const server = new WavixMcpServer({
    name: config.mcp.serverName,
    version: config.mcp.serverVersion
  })

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    logger.info("Received SIGINT, shutting down...")
    void server.stop().then(() => process.exit(0))
  })

  process.on("SIGTERM", () => {
    logger.info("Received SIGTERM, shutting down...")
    void server.stop().then(() => process.exit(0))
  })

  // Handle uncaught errors
  process.on("uncaughtException", error => {
    logger.error("Uncaught exception", { error: error.message, stack: error.stack })
    process.exit(1)
  })

  process.on("unhandledRejection", reason => {
    logger.error("Unhandled rejection", { reason })
    process.exit(1)
  })

  await server.start()
}

main().catch(error => {
  console.error("Failed to start server:", error)
  process.exit(1)
})
