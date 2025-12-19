/**
 * MCP Server Tests
 *
 * Basic tests for the WavixMcpServer class.
 */

import { describe, expect, it } from "@jest/globals"
import { WavixMcpServer, type ServerConfig } from "./server.js"
import { setupConsoleMocks } from "./test-utils.js"

describe("WavixMcpServer", () => {
  const testConfig: ServerConfig = {
    name: "test-server",
    version: "1.0.0"
  }

  setupConsoleMocks()

  it("should create server instance with correct interface", () => {
    const server = new WavixMcpServer(testConfig)

    expect(server).toBeInstanceOf(WavixMcpServer)
    expect(typeof server.start).toBe("function")
    expect(typeof server.stop).toBe("function")
  })

  it("should allow stop without start", async () => {
    const server = new WavixMcpServer(testConfig)

    await expect(server.stop()).resolves.not.toThrow()
  })

  it("should be safe to stop multiple times", async () => {
    const server = new WavixMcpServer(testConfig)

    await server.stop()
    await server.stop()
    // No error should be thrown
  })

  it("should create independent server instances", () => {
    const server1 = new WavixMcpServer({ name: "server1", version: "1.0.0" })
    const server2 = new WavixMcpServer({ name: "server2", version: "2.0.0" })

    expect(server1).not.toBe(server2)
  })
})
