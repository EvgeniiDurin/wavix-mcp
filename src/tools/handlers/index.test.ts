/**
 * Tool Handlers Tests
 *
 * Tests for grouped tool handlers with action parameter
 * Uses real generated tools for integration testing
 */

import { describe, expect, it, beforeEach, jest } from "@jest/globals"
import { handleToolCall } from "./index.js"
import { WavixClient, WavixApiError } from "../../api/client.js"
import { setupConsoleMocks } from "../../test-utils.js"

describe("Tool Handlers", () => {
  let mockClient: jest.Mocked<WavixClient>

  // Suppress console output during tests
  setupConsoleMocks()

  beforeEach(() => {
    mockClient = {
      request: jest.fn(),
      isEnabled: true,
      getBaseUrl: jest.fn().mockReturnValue("https://api.wavix.com/v1"),
      setBaseUrl: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    } as unknown as jest.Mocked<WavixClient>
  })

  describe("handleToolCall", () => {
    describe("Action validation", () => {
      it("should return error when action is missing", async () => {
        const result = await handleToolCall(mockClient, "profile", {})

        expect(result.isError).toBe(true)
        expect(result.content[0]).toEqual({
          type: "text",
          text: 'Error: "action" parameter is required'
        })
      })

      it("should return error for unknown tool", async () => {
        const result = await handleToolCall(mockClient, "unknown_tool", { action: "list" })

        expect(result.isError).toBe(true)
        expect(result.content[0]).toEqual({
          type: "text",
          text: 'Error: Unknown tool "unknown_tool"'
        })
      })

      it("should return error for unknown action", async () => {
        const result = await handleToolCall(mockClient, "profile", { action: "unknown" })

        expect(result.isError).toBe(true)
        expect((result.content[0] as { text: string }).text).toContain('Unknown action "unknown"')
        expect((result.content[0] as { text: string }).text).toContain("Available actions")
      })
    })

    describe("Config tool", () => {
      it("should get API URL", async () => {
        const result = await handleToolCall(mockClient, "config", { action: "get_api_url" })

        expect(result.isError).toBeUndefined()
        expect(mockClient.getBaseUrl).toHaveBeenCalled()

        const content = JSON.parse((result.content[0] as { text: string }).text)
        expect(content.api_url).toBe("https://api.wavix.com/v1")
      })

      it("should set API URL", async () => {
        const result = await handleToolCall(mockClient, "config", {
          action: "set_api_url",
          url: "https://api.qa1.wavix.com/v1"
        })

        expect(result.isError).toBeUndefined()
        expect(mockClient.setBaseUrl).toHaveBeenCalledWith("https://api.qa1.wavix.com/v1")

        const content = JSON.parse((result.content[0] as { text: string }).text)
        expect(content.success).toBe(true)
      })

      it("should return error when URL is missing for set_api_url", async () => {
        const result = await handleToolCall(mockClient, "config", { action: "set_api_url" })

        expect(result.isError).toBe(true)
        expect((result.content[0] as { text: string }).text).toContain("url")
      })
    })

    describe("API tool calls", () => {
      it("should call API for GET request", async () => {
        const mockResponse = { first_name: "Test", last_name: "User" }
        mockClient.request.mockResolvedValue(mockResponse)

        const result = await handleToolCall(mockClient, "profile", { action: "get" })

        expect(mockClient.request).toHaveBeenCalledWith("GET", expect.stringContaining("/profile"), undefined)
        expect(result.content).toEqual([
          {
            type: "text",
            text: JSON.stringify(mockResponse, null, 2)
          }
        ])
      })

      it("should call API for PUT request with body", async () => {
        const mockResponse = { success: true }
        mockClient.request.mockResolvedValue(mockResponse)

        const result = await handleToolCall(mockClient, "profile", {
          action: "update",
          first_name: "John",
          last_name: "Doe"
        })

        expect(mockClient.request).toHaveBeenCalledWith(
          "PUT",
          expect.stringContaining("/profile"),
          expect.objectContaining({ first_name: "John", last_name: "Doe" })
        )
        expect(result.isError).toBeUndefined()
      })

      it("should handle API errors", async () => {
        const apiError = new WavixApiError("Invalid request", 400, "INVALID_REQUEST", {
          field: "name",
          message: "Name is required"
        })

        mockClient.request.mockRejectedValue(apiError)

        const result = await handleToolCall(mockClient, "profile", { action: "get" })

        expect(result.isError).toBe(true)
        expect(result.content[0]?.type).toBe("text")

        const errorContent = JSON.parse((result.content[0] as { text: string }).text)
        expect(errorContent.error).toBe(true)
        expect(errorContent.message).toBe("Invalid request")
        expect(errorContent.statusCode).toBe(400)
      })

      it("should handle generic errors", async () => {
        mockClient.request.mockRejectedValue(new Error("Network error"))

        const result = await handleToolCall(mockClient, "profile", { action: "get" })

        expect(result.isError).toBe(true)
        expect(result.content).toEqual([{ type: "text", text: "Error: Network error" }])
      })
    })

    describe("Path parameters", () => {
      it("should replace path parameters in URL", async () => {
        mockClient.request.mockResolvedValue({ id: 123 })

        await handleToolCall(mockClient, "sip_trunks", { action: "get", id: 123 })

        expect(mockClient.request).toHaveBeenCalledWith("GET", expect.stringContaining("/trunks/123"), undefined)
      })
    })

    describe("Query parameters", () => {
      it("should add query parameters for GET requests", async () => {
        mockClient.request.mockResolvedValue({ items: [] })

        await handleToolCall(mockClient, "sip_trunks", { action: "list", page: 1, per_page: 10 })

        const callPath = mockClient.request.mock.calls[0][1]
        expect(callPath).toContain("page=1")
        expect(callPath).toContain("per_page=10")
      })

      it("should skip undefined and null parameters", async () => {
        mockClient.request.mockResolvedValue({ items: [] })

        await handleToolCall(mockClient, "sip_trunks", {
          action: "list",
          page: 1,
          per_page: undefined,
          search: null
        })

        const callPath = mockClient.request.mock.calls[0][1]
        expect(callPath).toContain("page=1")
        expect(callPath).not.toContain("per_page")
        expect(callPath).not.toContain("search")
      })
    })
  })
})
