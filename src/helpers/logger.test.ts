/**
 * Logger Tests
 *
 * Tests for the logger module.
 * Logger writes to stderr (not console) for MCP compatibility.
 */

import { describe, expect, it } from "@jest/globals"
import { logger } from "./logger.js"
import { setupStderrMocks } from "../test-utils.js"

describe("Logger", () => {
  const stderr = setupStderrMocks()

  describe("Basic logging", () => {
    it("should log info messages with correct format", () => {
      logger.info("Test message")

      const output = stderr.calls().join("")
      expect(output).toContain("Test message")
      expect(output).toContain("INFO")
    })

    it("should log warn messages", () => {
      logger.warn("Warning message")

      const output = stderr.calls().join("")
      expect(output).toContain("Warning message")
      expect(output).toContain("WARN")
    })

    it("should log error messages", () => {
      logger.error("Error message")

      const output = stderr.calls().join("")
      expect(output).toContain("Error message")
      expect(output).toContain("ERROR")
    })

    it("should include ISO timestamp", () => {
      logger.info("Test message")

      const output = stderr.calls().join("")
      expect(output).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/)
    })
  })

  describe("Context logging", () => {
    it("should include context fields in output", () => {
      logger.info("Action performed", { userId: 123, action: "test" })

      const output = stderr.calls().join("")
      expect(output).toContain("userId")
      expect(output).toContain("123")
      expect(output).toContain("action")
    })

    it("should handle empty context", () => {
      expect(() => logger.info("Message without context")).not.toThrow()
    })

    it("should serialize nested objects", () => {
      logger.info("Complex context", { user: { id: 1, name: "Test" } })

      const output = stderr.calls().join("")
      expect(output).toContain("user")
    })

    it("should handle circular references gracefully", () => {
      const context: Record<string, unknown> = { name: "test" }
      context.self = context

      expect(() => logger.info("Circular", context)).not.toThrow()
    })
  })

  describe("Child logger", () => {
    it("should create child with persistent context", () => {
      const childLogger = logger.child({ module: "test-module" })

      childLogger.info("Message 1")
      childLogger.info("Message 2")

      const calls = stderr.calls()
      expect(calls[0]).toContain("test-module")
      expect(calls[1]).toContain("test-module")
    })

    it("should merge child context with per-call context", () => {
      const childLogger = logger.child({ module: "test-module" })

      childLogger.info("Test message", { requestId: "abc123" })

      const output = stderr.calls().join("")
      expect(output).toContain("test-module")
      expect(output).toContain("abc123")
    })

    it("should not affect parent logger context", () => {
      const childLogger = logger.child({ childModule: "child" })

      logger.info("Parent message")
      childLogger.info("Child message")

      const calls = stderr.calls()
      expect(calls[0]).not.toContain("childModule")
      expect(calls[1]).toContain("childModule")
    })
  })
})
