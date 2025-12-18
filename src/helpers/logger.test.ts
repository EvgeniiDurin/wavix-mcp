/**
 * Logger Tests
 *
 * Integration tests for the logger module.
 */

import { describe, expect, it } from "@jest/globals"
import { logger } from "./logger.js"
import { setupConsoleMocks } from "../test-utils.js"

describe("Logger", () => {
  const mocks = setupConsoleMocks()

  describe("Basic logging", () => {
    it("should log info messages with correct format", () => {
      logger.info("Test message")

      expect(mocks.info).toHaveBeenCalledTimes(1)
      expect(mocks.info).toHaveBeenCalledWith(expect.stringContaining("Test message"))
      expect(mocks.info).toHaveBeenCalledWith(expect.stringContaining("INFO"))
    })

    it("should log warn messages with correct format", () => {
      logger.warn("Warning message")

      expect(mocks.warn).toHaveBeenCalledTimes(1)
      expect(mocks.warn).toHaveBeenCalledWith(expect.stringContaining("Warning message"))
      expect(mocks.warn).toHaveBeenCalledWith(expect.stringContaining("WARN"))
    })

    it("should log error messages with correct format", () => {
      logger.error("Error message")

      expect(mocks.error).toHaveBeenCalledTimes(1)
      expect(mocks.error).toHaveBeenCalledWith(expect.stringContaining("Error message"))
      expect(mocks.error).toHaveBeenCalledWith(expect.stringContaining("ERROR"))
    })

    it("should include ISO timestamp in log messages", () => {
      logger.info("Test message")

      const logOutput = mocks.info.mock.calls[0]?.[0] as string
      expect(logOutput).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/)
    })

    it("should format log entry with brackets and colon", () => {
      logger.info("Test message")

      const logOutput = mocks.info.mock.calls[0]?.[0] as string
      expect(logOutput).toMatch(/^\[.+\] INFO: Test message/)
    })
  })

  describe("Context logging", () => {
    it("should include all context fields in log output", () => {
      const context = { userId: 123, action: "test", requestId: "abc" }

      logger.info("Action performed", context)

      const logOutput = mocks.info.mock.calls[0]?.[0] as string
      expect(logOutput).toContain("userId")
      expect(logOutput).toContain("123")
      expect(logOutput).toContain("action")
      expect(logOutput).toContain("test")
      expect(logOutput).toContain("requestId")
      expect(logOutput).toContain("abc")
    })

    it("should handle empty context without errors", () => {
      expect(() => logger.info("Message without context")).not.toThrow()
      expect(mocks.info).toHaveBeenCalledWith(expect.stringContaining("Message without context"))
    })

    it("should serialize nested objects in context", () => {
      const context = {
        user: { id: 1, name: "Test" },
        metadata: { tags: ["tag1", "tag2"] }
      }

      logger.info("Complex context", context)

      const logOutput = mocks.info.mock.calls[0]?.[0] as string
      expect(logOutput).toContain("user")
      expect(logOutput).toContain("metadata")
    })

    it("should handle null and undefined values in context", () => {
      const context = { nullVal: null, undefVal: undefined }

      expect(() => logger.info("Message", context as any)).not.toThrow()
      expect(mocks.info).toHaveBeenCalled()
    })

    it("should handle circular references gracefully", () => {
      const context: any = { name: "test" }
      context.self = context

      // Should not throw, may truncate or mark circular
      expect(() => logger.info("Circular", context)).not.toThrow()
    })
  })

  describe("Child logger", () => {
    it("should create child logger with persistent default context", () => {
      const childLogger = logger.child({ module: "test-module" })

      childLogger.info("Message 1")
      childLogger.info("Message 2")

      expect(mocks.info).toHaveBeenCalledTimes(2)
      expect(mocks.info.mock.calls[0]?.[0]).toContain("test-module")
      expect(mocks.info.mock.calls[1]?.[0]).toContain("test-module")
    })

    it("should merge child context with per-call context", () => {
      const childLogger = logger.child({ module: "test-module" })

      childLogger.info("Test message", { requestId: "abc123" })

      const logOutput = mocks.info.mock.calls[0]?.[0] as string
      expect(logOutput).toContain("test-module")
      expect(logOutput).toContain("abc123")
    })

    it("should allow per-call context to override child context", () => {
      const childLogger = logger.child({ module: "original" })

      childLogger.info("Test", { module: "override" })

      const logOutput = mocks.info.mock.calls[0]?.[0] as string
      expect(logOutput).toContain("override")
    })

    it("should support all log levels in child logger", () => {
      const childLogger = logger.child({ module: "test" })

      childLogger.debug("Debug")
      childLogger.info("Info")
      childLogger.warn("Warn")
      childLogger.error("Error")

      expect(mocks.info).toHaveBeenCalledWith(expect.stringContaining("Info"))
      expect(mocks.warn).toHaveBeenCalledWith(expect.stringContaining("Warn"))
      expect(mocks.error).toHaveBeenCalledWith(expect.stringContaining("Error"))
    })

    it("should not affect parent logger context", () => {
      const childLogger = logger.child({ childModule: "child" })

      logger.info("Parent message")
      childLogger.info("Child message")

      const parentCall = mocks.info.mock.calls[0]?.[0] as string
      const childCall = mocks.info.mock.calls[1]?.[0] as string

      expect(parentCall).not.toContain("childModule")
      expect(childCall).toContain("childModule")
    })

    it("should allow multiple independent child loggers", () => {
      const child1 = logger.child({ module: "module1" })
      const child2 = logger.child({ module: "module2" })

      child1.info("Message 1")
      child2.info("Message 2")

      expect(mocks.info.mock.calls[0]?.[0]).toContain("module1")
      expect(mocks.info.mock.calls[0]?.[0]).not.toContain("module2")
      expect(mocks.info.mock.calls[1]?.[0]).toContain("module2")
      expect(mocks.info.mock.calls[1]?.[0]).not.toContain("module1")
    })
  })

  describe("Debug level", () => {
    it("should have debug method that does not throw", () => {
      expect(typeof logger.debug).toBe("function")
      expect(() => logger.debug("Debug message")).not.toThrow()
      expect(() => logger.debug("Debug with context", { key: "value" })).not.toThrow()
    })
  })

  describe("Edge cases", () => {
    it("should handle very long messages", () => {
      const longMessage = "x".repeat(10000)

      expect(() => logger.info(longMessage)).not.toThrow()
      expect(mocks.info).toHaveBeenCalled()
    })

    it("should handle special characters in messages", () => {
      const specialMessage = "Test\nwith\nnewlines\tand\ttabs"

      expect(() => logger.info(specialMessage)).not.toThrow()
      expect(mocks.info).toHaveBeenCalled()
    })

    it("should handle unicode in messages", () => {
      const unicodeMessage = "Test with emojis 🚀 and unicode: こんにちは"

      expect(() => logger.info(unicodeMessage)).not.toThrow()
      expect(mocks.info).toHaveBeenCalled()
    })
  })
})
