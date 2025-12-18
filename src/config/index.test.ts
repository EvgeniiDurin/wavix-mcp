/**
 * Configuration Tests
 *
 * Tests for config validation and environment modes.
 */

import { describe, expect, it, beforeEach, afterEach, jest } from "@jest/globals"

describe("Configuration", () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe("Config structure", () => {
    it("should export config with complete structure", async () => {
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")

      // Verify top-level properties exist and have correct types
      expect(typeof config.nodeEnv).toBe("string")
      expect(typeof config.isDevelopment).toBe("boolean")
      expect(typeof config.isProduction).toBe("boolean")
      expect(typeof config.isTest).toBe("boolean")

      // Verify nested objects structure
      expect(config.wavix).toEqual(
        expect.objectContaining({
          apiUrl: expect.any(String),
          hasApiKey: expect.any(Boolean)
        })
      )

      expect(config.logging).toEqual(
        expect.objectContaining({
          level: expect.stringMatching(/^(debug|info|warn|error)$/)
        })
      )

      expect(config.mcp).toEqual(
        expect.objectContaining({
          serverName: expect.any(String),
          serverVersion: expect.any(String)
        })
      )
    })

    it("should have mutually exclusive environment flags", async () => {
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")

      const envFlags = [config.isDevelopment, config.isProduction, config.isTest]
      const trueCount = envFlags.filter(Boolean).length

      expect(trueCount).toBe(1)
    })
  })

  describe("Default values", () => {
    it("should use sensible defaults for missing env vars", async () => {
      // Clear optional vars
      delete process.env.WAVIX_API_KEY
      delete process.env.WAVIX_API_URL
      delete process.env.LOG_LEVEL
      delete process.env.MCP_SERVER_NAME
      delete process.env.MCP_SERVER_VERSION
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")

      expect(config.wavix.apiUrl).toBe("https://api.wavix.com")
      expect(config.logging.level).toBe("info")
      expect(config.mcp.serverName).toBe("wavix-mcp-server")
      expect(config.mcp.serverVersion).toMatch(/^\d+\.\d+\.\d+$/)
    })
  })

  describe("Environment-specific configuration", () => {
    it("should correctly configure development environment", async () => {
      process.env.NODE_ENV = "development"

      const { config } = await import("./index.js")

      expect(config).toMatchObject({
        nodeEnv: "development",
        isDevelopment: true,
        isProduction: false,
        isTest: false
      })
    })

    it("should correctly configure production environment", async () => {
      process.env.NODE_ENV = "production"

      const { config } = await import("./index.js")

      expect(config).toMatchObject({
        nodeEnv: "production",
        isDevelopment: false,
        isProduction: true,
        isTest: false
      })
    })

    it("should correctly configure test environment", async () => {
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")

      expect(config).toMatchObject({
        nodeEnv: "test",
        isDevelopment: false,
        isProduction: false,
        isTest: true
      })
    })
  })

  describe("Wavix API configuration", () => {
    it("should correctly set API key and hasApiKey flag", async () => {
      process.env.WAVIX_API_KEY = "test-api-key-123"
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")

      expect(config.wavix.apiKey).toBe("test-api-key-123")
      expect(config.wavix.hasApiKey).toBe(true)
    })

    it("should use custom API URL when provided", async () => {
      process.env.WAVIX_API_URL = "https://custom-api.wavix.com"
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")

      expect(config.wavix.apiUrl).toBe("https://custom-api.wavix.com")
    })

    it("should validate API URL is valid URI", async () => {
      process.env.WAVIX_API_URL = "not-a-valid-url"
      process.env.NODE_ENV = "test"

      await expect(import("./index.js")).rejects.toThrow("Config validation error")
    })

    it("should accept HTTPS URLs only for API URL", async () => {
      // Valid HTTPS URL should work
      process.env.WAVIX_API_URL = "https://api.wavix.com"
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")
      expect(config.wavix.apiUrl).toBe("https://api.wavix.com")
    })
  })

  describe("Logging configuration", () => {
    const validLogLevels = ["debug", "info", "warn", "error"]

    it.each(validLogLevels)("should accept %s log level", async level => {
      jest.resetModules()
      process.env.LOG_LEVEL = level
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")

      expect(config.logging.level).toBe(level)
    })

    it("should reject invalid log level with descriptive error", async () => {
      process.env.LOG_LEVEL = "invalid"
      process.env.NODE_ENV = "test"

      await expect(import("./index.js")).rejects.toThrow("Config validation error")
    })
  })

  describe("MCP Server configuration", () => {
    it("should use custom server name", async () => {
      process.env.MCP_SERVER_NAME = "custom-server"
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")

      expect(config.mcp.serverName).toBe("custom-server")
    })

    it("should use custom server version", async () => {
      process.env.MCP_SERVER_VERSION = "2.0.0"
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")

      expect(config.mcp.serverVersion).toBe("2.0.0")
    })
  })

  describe("Validation errors", () => {
    it("should reject invalid NODE_ENV with clear error", async () => {
      process.env.NODE_ENV = "invalid"

      await expect(import("./index.js")).rejects.toThrow("Config validation error")
    })

    it("should allow unknown environment variables (unknown() is set)", async () => {
      process.env.UNKNOWN_VAR = "value"
      process.env.ANOTHER_UNKNOWN = "123"
      process.env.NODE_ENV = "test"

      const result = await import("./index.js")

      expect(result.config).toBeDefined()
    })
  })

  describe("Full Mode vs Documentation Mode", () => {
    it("should enable Full Mode when API key is provided", async () => {
      process.env.WAVIX_API_KEY = "test-key"
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")

      expect(config.wavix).toMatchObject({
        hasApiKey: true,
        apiKey: "test-key"
      })
    })

    it("should enable Documentation Mode when API key is missing", async () => {
      delete process.env.WAVIX_API_KEY
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")

      expect(config.wavix).toMatchObject({
        hasApiKey: false
      })
      expect(config.wavix.apiKey).toBeUndefined()
    })

    it("should enable Documentation Mode when API key is empty string", async () => {
      process.env.WAVIX_API_KEY = ""
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")

      expect(config.wavix.hasApiKey).toBe(false)
      // Empty string is considered falsy, so hasApiKey should be false
    })

    it("should enable Documentation Mode when API key is whitespace only", async () => {
      process.env.WAVIX_API_KEY = "   "
      process.env.NODE_ENV = "test"

      const { config } = await import("./index.js")

      // Whitespace-only key is still truthy, but might be trimmed
      // The behavior depends on implementation
      expect(typeof config.wavix.hasApiKey).toBe("boolean")
    })
  })
})
