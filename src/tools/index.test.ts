/**
 * Tools Registry Tests
 *
 * Integration tests for the tools registry module.
 * Uses real generated tools and handlers without ESM mocking.
 */

import { describe, expect, it, beforeEach, jest } from "@jest/globals"
import { registerTools } from "./index.js"
import { generatedTools, toolMeta } from "./generated/tools.js"
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

    // Create mock client (enabled by default for most tests)
    mockClient = {
      isEnabled: true,
      request: jest.fn(),
      getBaseUrl: jest.fn().mockReturnValue("https://api.wavix.com/v1"),
      setBaseUrl: jest.fn()
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

    it("should return tools with action parameter in inputSchema", async () => {
      registerTools(mockServer as unknown as Server, mockClient as WavixClient)

      const result = await listToolsHandler!({})

      // Each grouped tool should have action parameter
      result.tools.forEach(tool => {
        expect(tool.inputSchema).toHaveProperty("properties")
        const props = (tool.inputSchema as { properties: object }).properties
        expect(props).toHaveProperty("action")
      })
    })
  })

  describe("Tools availability", () => {
    it("should expose all generated tools regardless of API key presence", async () => {
      registerTools(mockServer as unknown as Server, mockClient as WavixClient)

      const result = await listToolsHandler!({})

      // All tools should be visible, even without API key
      expect(result.tools.length).toBe(generatedTools.length)
    })

    it("should return clear error message when calling tool without API key", async () => {
      const disabledClient = {
        isEnabled: false,
        request: jest.fn(),
        getBaseUrl: jest.fn(),
        setBaseUrl: jest.fn()
      }

      registerTools(mockServer as unknown as Server, disabledClient as WavixClient)

      const request = {
        params: {
          name: "sms",
          arguments: { action: "send" }
        }
      }

      const result = await callToolHandler!(request)

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain('Tool "sms" requires API access')
      expect(result.content[0].text).toContain("WAVIX_API_KEY")
      expect(result.content[0].text).toContain("https://app.wavix.com")
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

    it("should return error when client is disabled for non-config tools", async () => {
      const disabledClient = {
        isEnabled: false,
        request: jest.fn(),
        getBaseUrl: jest.fn(),
        setBaseUrl: jest.fn()
      }

      registerTools(mockServer as unknown as Server, disabledClient as WavixClient)

      const request = {
        params: {
          name: "profile",
          arguments: { action: "get" }
        }
      }

      const result = await callToolHandler!(request)

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain("WAVIX_API_KEY")
    })

    it("should allow config tool when client is disabled", async () => {
      const disabledClient = {
        isEnabled: false,
        request: jest.fn(),
        getBaseUrl: jest.fn().mockReturnValue("https://api.wavix.com/v1"),
        setBaseUrl: jest.fn()
      }

      registerTools(mockServer as unknown as Server, disabledClient as WavixClient)

      const request = {
        params: {
          name: "config",
          arguments: { action: "get_api_url" }
        }
      }

      const result = await callToolHandler!(request)

      expect(result.isError).toBeUndefined()
    })

    it("should return error when action is missing", async () => {
      registerTools(mockServer as unknown as Server, mockClient as WavixClient)

      // Use config tool which doesn't require API key
      const request = {
        params: {
          name: "config",
          arguments: {}
        }
      }

      const result = await callToolHandler!(request)

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain("action")
    })
  })

  describe("Generated Tools integrity", () => {
    it("should have valid generated tools array", () => {
      expect(Array.isArray(generatedTools)).toBe(true)
      expect(generatedTools.length).toBeGreaterThan(0)
    })

    it("should have metadata for each tool", () => {
      expect(typeof toolMeta).toBe("object")

      generatedTools.forEach(tool => {
        const meta = toolMeta[tool.name]
        expect(meta).toBeDefined()
        expect(meta).toHaveProperty("actions")
        expect(typeof meta.actions).toBe("object")

        // Check at least one action exists
        const actionNames = Object.keys(meta.actions)
        expect(actionNames.length).toBeGreaterThan(0)

        // Check action structure
        const firstAction = meta.actions[actionNames[0]]
        expect(firstAction).toEqual(
          expect.objectContaining({
            path: expect.any(String),
            method: expect.stringMatching(/^(GET|POST|PUT|DELETE|PATCH)$/),
            operationId: expect.any(String),
            requiredParams: expect.any(Array)
          })
        )
      })
    })
  })
})
