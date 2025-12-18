/**
 * Tools Registry Tests
 *
 * Integration tests for the tools registry module.
 * Uses real generated tools and handlers without ESM mocking.
 */

import { describe, expect, it, beforeEach, jest } from "@jest/globals"
import { registerTools } from "./index.js"
import { generatedTools, toolMeta } from "./generated/tools.js"
import { config } from "../config/index.js"
import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import type { WavixClient } from "../api/client.js"
import { setupConsoleMocks } from "../test-utils.js"

// Types for handlers
type ListToolsHandler = (
  request: object
) => Promise<{ tools: Array<{ name: string; description: string; inputSchema: object }> }>
type CallToolHandler = (request: {
  params: { name: string; arguments: object }
}) => Promise<{ isError?: boolean; content: Array<{ text: string }> }>

describe("Tools Registry", () => {
  let mockServer: {
    setRequestHandler: jest.MockedFunction<Server["setRequestHandler"]>
  }
  let mockClient: Partial<WavixClient>
  let listToolsHandler: ListToolsHandler | undefined
  let callToolHandler: CallToolHandler | undefined

  // Use shared console mocking utility
  setupConsoleMocks()

  beforeEach(() => {
    // Reset handlers
    listToolsHandler = undefined
    callToolHandler = undefined

    let handlerIndex = 0

    // Create mock server that captures handlers
    mockServer = {
      setRequestHandler: jest.fn((schema: unknown, handler: unknown) => {
        void schema
        if (handlerIndex === 0) {
          listToolsHandler = handler as ListToolsHandler
        } else if (handlerIndex === 1) {
          callToolHandler = handler as CallToolHandler
        }
        handlerIndex++
      })
    }

    // Create mock client
    mockClient = {
      isEnabled: config.wavix.hasApiKey,
      request: jest.fn()
    }
  })

  describe("registerTools", () => {
    it("should register exactly two request handlers", () => {
      registerTools(mockServer as unknown as Server, mockClient as WavixClient)

      expect(mockServer.setRequestHandler).toHaveBeenCalledTimes(2)
    })

    it("should register both ListTools and CallTool handlers", () => {
      registerTools(mockServer as unknown as Server, mockClient as WavixClient)

      expect(listToolsHandler).toBeDefined()
      expect(callToolHandler).toBeDefined()
    })
  })

  describe("List Tools Handler", () => {
    it("should return tools with correct MCP structure", async () => {
      registerTools(mockServer as unknown as Server, mockClient as WavixClient)

      const result = await listToolsHandler!({})

      expect(result).toHaveProperty("tools")
      expect(Array.isArray(result.tools)).toBe(true)
      expect(result.tools.length).toBeGreaterThan(0)

      // Verify each tool has required MCP fields
      result.tools.forEach(tool => {
        expect(tool).toEqual(
          expect.objectContaining({
            name: expect.any(String),
            description: expect.any(String),
            inputSchema: expect.any(Object)
          })
        )
      })
    })
  })

  // Use describe.skip for mode-specific tests
  const describeDocMode = config.wavix.hasApiKey ? describe.skip : describe
  const describeFullMode = config.wavix.hasApiKey ? describe : describe.skip

  describeDocMode("Documentation Mode tools filtering", () => {
    it("should only expose profile_ and billing_ tools", async () => {
      registerTools(mockServer as unknown as Server, mockClient as WavixClient)

      const result = await listToolsHandler!({})

      const toolNames = result.tools.map(t => t.name)
      expect(toolNames.length).toBeGreaterThan(0)
      expect(toolNames.every(name => name.startsWith("profile_") || name.startsWith("billing_"))).toBe(true)
    })
  })

  describeFullMode("Full Mode tools availability", () => {
    it("should expose all generated tools", async () => {
      registerTools(mockServer as unknown as Server, mockClient as WavixClient)

      const result = await listToolsHandler!({})

      expect(result.tools.length).toBe(generatedTools.length)
    })
  })

  describe("Call Tool Handler", () => {
    it("should return error for non-existent tool", async () => {
      registerTools(mockServer as unknown as Server, mockClient as WavixClient)

      const request = {
        params: {
          name: "non_existent_tool_xyz",
          arguments: {}
        }
      }

      const result = await callToolHandler!(request)

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain("not found")
    })

    it("should return error when client is disabled", async () => {
      const disabledClient = {
        isEnabled: false,
        request: jest.fn()
      }

      registerTools(mockServer as unknown as Server, disabledClient as WavixClient)

      const request = {
        params: {
          name: "profile_get",
          arguments: {}
        }
      }

      const result = await callToolHandler!(request)

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain("WAVIX_API_KEY")
    })

    it("should accept valid tool request structure", async () => {
      registerTools(mockServer as unknown as Server, mockClient as WavixClient)

      const toolName = generatedTools[0]?.name

      const request = {
        params: {
          name: toolName,
          arguments: {}
        }
      }

      // Should not throw, result structure should be valid
      const result = await callToolHandler!(request)
      expect(result).toHaveProperty("content")
      expect(Array.isArray(result.content)).toBe(true)
    })
  })

  describe("Generated Tools integrity", () => {
    it("should have valid generated tools array", () => {
      expect(Array.isArray(generatedTools)).toBe(true)
      expect(generatedTools.length).toBeGreaterThan(0)
    })

    it("should have metadata for each tool", () => {
      expect(toolMeta).toBeInstanceOf(Map)

      generatedTools.forEach(tool => {
        const meta = toolMeta.get(tool.name)
        expect(meta).toBeDefined()
        expect(meta).toEqual(
          expect.objectContaining({
            path: expect.any(String),
            method: expect.stringMatching(/^(GET|POST|PUT|DELETE|PATCH)$/),
            operationId: expect.any(String)
          })
        )
      })
    })
  })
})
