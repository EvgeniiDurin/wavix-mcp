/**
 * MCP Server Tests
 *
 * Integration tests for the WavixMcpServer class.
 * Tests actual behavior without ESM module mocking.
 */

import { describe, expect, it } from "@jest/globals"
import { WavixMcpServer, type ServerConfig } from "./server.js"
import { setupConsoleMocks } from "./test-utils.js"

describe("WavixMcpServer", () => {
  const testConfig: ServerConfig = {
    name: "test-server",
    version: "1.0.0"
  }

  // Use shared console mocking utility
  setupConsoleMocks()

  describe("constructor", () => {
    it("should create server instance with correct type", () => {
      const server = new WavixMcpServer(testConfig)

      expect(server).toBeInstanceOf(WavixMcpServer)
      expect(typeof server.start).toBe("function")
      expect(typeof server.stop).toBe("function")
    })

    it("should accept custom config values", () => {
      const customConfig: ServerConfig = {
        name: "custom-server",
        version: "2.0.0"
      }

      const server = new WavixMcpServer(customConfig)

      expect(server).toBeInstanceOf(WavixMcpServer)
    })

    it("should handle edge case configs", () => {
      const edgeCases: Array<ServerConfig> = [
        { name: "", version: "1.0.0" },
        { name: "test", version: "" },
        { name: "test-with-special-chars-123", version: "1.0.0-beta+build.123" }
      ]

      edgeCases.forEach(config => {
        expect(() => new WavixMcpServer(config)).not.toThrow()
      })
    })
  })

  describe("start method", () => {
    it("should return a Promise that can be awaited", async () => {
      const server = new WavixMcpServer(testConfig)

      const startPromise = server.start()

      expect(startPromise).toBeInstanceOf(Promise)

      // Clean up - don't wait for actual start (would block on stdin)
      await server.stop()
    })
  })

  describe("stop method", () => {
    it("should return a Promise that resolves", async () => {
      const server = new WavixMcpServer(testConfig)

      const stopPromise = server.stop()

      expect(stopPromise).toBeInstanceOf(Promise)
      await expect(stopPromise).resolves.not.toThrow()
    })

    it("should be safe to call multiple times", async () => {
      const server = new WavixMcpServer(testConfig)

      await server.stop()
      await server.stop()
      await server.stop()

      // No error should be thrown
    })
  })

  describe("lifecycle", () => {
    it("should allow stop before start", async () => {
      const server = new WavixMcpServer(testConfig)

      // Stop without starting should be safe
      await expect(server.stop()).resolves.not.toThrow()
    })

    it("should create independent server instances", () => {
      const server1 = new WavixMcpServer({ name: "server1", version: "1.0.0" })
      const server2 = new WavixMcpServer({ name: "server2", version: "2.0.0" })

      expect(server1).not.toBe(server2)
      expect(server1).toBeInstanceOf(WavixMcpServer)
      expect(server2).toBeInstanceOf(WavixMcpServer)
    })
  })
})
