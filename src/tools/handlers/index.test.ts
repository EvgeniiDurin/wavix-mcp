/**
 * Tool Handlers Tests
 */

import { describe, expect, it, beforeEach, jest } from "@jest/globals"
import { handleToolCall, type ToolMeta } from "./index.js"
import { WavixClient, WavixApiError } from "../../api/client.js"

// Mock logger
jest.mock("../../helpers/logger.js", () => ({
  logger: {
    child: () => ({
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn()
    })
  }
}))

// Mock masking helper
jest.mock("../../helpers/masking.js", () => ({
  maskSensitiveData: jest.fn(data => data)
}))

describe("Tool Handlers", () => {
  let mockClient: jest.Mocked<WavixClient>
  let requestMock: jest.Mock

  beforeEach(() => {
    requestMock = jest.fn()
    mockClient = {
      request: requestMock,
      isEnabled: true,
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    } as unknown as jest.Mocked<WavixClient>
  })

  describe("handleToolCall", () => {
    describe("GET requests", () => {
      it("should handle GET request without parameters", async () => {
        const meta: ToolMeta = {
          path: "/v2/profile",
          method: "GET",
          operationId: "profile_get"
        }

        const mockResponse = { id: 123, name: "Test User" }
        mockClient.request.mockResolvedValue(mockResponse)

        const result = await handleToolCall(mockClient, "profile_get", meta, {})

        expect(mockClient.request).toHaveBeenCalledWith("GET", "/v2/profile", undefined)
        expect(result.content).toEqual([
          {
            type: "text",
            text: JSON.stringify(mockResponse, null, 2)
          }
        ])
      })

      it("should handle GET request with query parameters", async () => {
        const meta: ToolMeta = {
          path: "/v2/numbers",
          method: "GET",
          operationId: "numbers_list"
        }

        const args = {
          limit: 10,
          offset: 0,
          search: "test"
        }

        mockClient.request.mockResolvedValue({ data: [] })

        await handleToolCall(mockClient, "numbers_list", meta, args)

        expect(mockClient.request).toHaveBeenCalledWith("GET", "/v2/numbers?limit=10&offset=0&search=test", undefined)
      })

      it("should handle array parameters in query string", async () => {
        const meta: ToolMeta = {
          path: "/v2/numbers",
          method: "GET",
          operationId: "numbers_list"
        }

        const args = {
          ids: [1, 2, 3]
        }

        mockClient.request.mockResolvedValue({ data: [] })

        await handleToolCall(mockClient, "numbers_list", meta, args)

        expect(mockClient.request).toHaveBeenCalledWith(
          "GET",
          "/v2/numbers?ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3",
          undefined
        )
      })

      it("should skip undefined and null query parameters", async () => {
        const meta: ToolMeta = {
          path: "/v2/numbers",
          method: "GET",
          operationId: "numbers_list"
        }

        const args = {
          limit: 10,
          offset: undefined,
          search: null
        }

        mockClient.request.mockResolvedValue({ data: [] })

        await handleToolCall(mockClient, "numbers_list", meta, args)

        expect(mockClient.request).toHaveBeenCalledWith("GET", "/v2/numbers?limit=10", undefined)
      })
    })

    describe("POST requests", () => {
      it("should handle POST request with body", async () => {
        const meta: ToolMeta = {
          path: "/v2/sms/send",
          method: "POST",
          operationId: "sms_send"
        }

        const args = {
          to: "+1234567890",
          text: "Test message",
          from: "+0987654321"
        }

        const mockResponse = { success: true, message_id: "abc123" }
        mockClient.request.mockResolvedValue(mockResponse)

        const result = await handleToolCall(mockClient, "sms_send", meta, args)

        expect(mockClient.request).toHaveBeenCalledWith("POST", "/v2/sms/send", args)
        expect(result.content).toEqual([
          {
            type: "text",
            text: JSON.stringify(mockResponse, null, 2)
          }
        ])
      })

      it("should handle POST with empty body", async () => {
        const meta: ToolMeta = {
          path: "/v2/action",
          method: "POST",
          operationId: "action_trigger"
        }

        mockClient.request.mockResolvedValue({ success: true })

        await handleToolCall(mockClient, "action_trigger", meta, {})

        expect(mockClient.request).toHaveBeenCalledWith("POST", "/v2/action", undefined)
      })
    })

    describe("Path parameters", () => {
      it("should replace single path parameter", async () => {
        const meta: ToolMeta = {
          path: "/v2/numbers/{id}",
          method: "GET",
          operationId: "number_get"
        }

        const args = { id: 12345 }

        mockClient.request.mockResolvedValue({ id: 12345 })

        await handleToolCall(mockClient, "number_get", meta, args)

        expect(mockClient.request).toHaveBeenCalledWith("GET", "/v2/numbers/12345", undefined)
      })

      it("should replace multiple path parameters", async () => {
        const meta: ToolMeta = {
          path: "/v2/accounts/{account_id}/users/{user_id}",
          method: "GET",
          operationId: "user_get"
        }

        const args = {
          account_id: "acc123",
          user_id: "usr456"
        }

        mockClient.request.mockResolvedValue({})

        await handleToolCall(mockClient, "user_get", meta, args)

        expect(mockClient.request).toHaveBeenCalledWith("GET", "/v2/accounts/acc123/users/usr456", undefined)
      })

      it("should handle path params with query params", async () => {
        const meta: ToolMeta = {
          path: "/v2/numbers/{id}",
          method: "GET",
          operationId: "number_get"
        }

        const args = {
          id: 12345,
          include: "details"
        }

        mockClient.request.mockResolvedValue({})

        await handleToolCall(mockClient, "number_get", meta, args)

        expect(mockClient.request).toHaveBeenCalledWith("GET", "/v2/numbers/12345?include=details", undefined)
      })
    })

    describe("PUT and PATCH requests", () => {
      it("should handle PUT request with body", async () => {
        const meta: ToolMeta = {
          path: "/v2/numbers/{id}",
          method: "PUT",
          operationId: "number_update"
        }

        const args = {
          id: 12345,
          name: "Updated Name",
          active: true
        }

        mockClient.request.mockResolvedValue({ success: true })

        await handleToolCall(mockClient, "number_update", meta, args)

        expect(mockClient.request).toHaveBeenCalledWith("PUT", "/v2/numbers/12345", {
          name: "Updated Name",
          active: true
        })
      })

      it("should handle PATCH request", async () => {
        const meta: ToolMeta = {
          path: "/v2/settings",
          method: "PATCH",
          operationId: "settings_update"
        }

        const args = { timezone: "UTC" }

        mockClient.request.mockResolvedValue({ success: true })

        await handleToolCall(mockClient, "settings_update", meta, args)

        expect(mockClient.request).toHaveBeenCalledWith("PATCH", "/v2/settings", args)
      })
    })

    describe("DELETE requests", () => {
      it("should handle DELETE request", async () => {
        const meta: ToolMeta = {
          path: "/v2/numbers/{id}",
          method: "DELETE",
          operationId: "number_delete"
        }

        const args = { id: 12345 }

        mockClient.request.mockResolvedValue({ success: true })

        await handleToolCall(mockClient, "number_delete", meta, args)

        expect(mockClient.request).toHaveBeenCalledWith("DELETE", "/v2/numbers/12345", undefined)
      })

      it("should handle DELETE with query parameters", async () => {
        const meta: ToolMeta = {
          path: "/v2/numbers",
          method: "DELETE",
          operationId: "numbers_bulk_delete"
        }

        const args = { ids: [1, 2, 3] }

        mockClient.request.mockResolvedValue({ deleted: 3 })

        await handleToolCall(mockClient, "numbers_bulk_delete", meta, args)

        expect(mockClient.request).toHaveBeenCalledWith(
          "DELETE",
          "/v2/numbers?ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3",
          undefined
        )
      })
    })

    describe("Error handling", () => {
      it("should handle WavixApiError", async () => {
        const meta: ToolMeta = {
          path: "/v2/test",
          method: "GET",
          operationId: "test"
        }

        const apiError = new WavixApiError("Invalid request", 400, "INVALID_REQUEST", {
          field: "email",
          message: "Email is required"
        })

        mockClient.request.mockRejectedValue(apiError)

        const result = await handleToolCall(mockClient, "test", meta, {})

        expect(result.isError).toBe(true)
        expect(result.content[0]?.type).toBe("text")

        const errorContent = JSON.parse((result.content[0] as { text: string }).text)
        expect(errorContent.error).toBe(true)
        expect(errorContent.message).toBe("Invalid request")
        expect(errorContent.statusCode).toBe(400)
        expect(errorContent.code).toBe("INVALID_REQUEST")
      })

      it("should handle generic Error", async () => {
        const meta: ToolMeta = {
          path: "/v2/test",
          method: "GET",
          operationId: "test"
        }

        mockClient.request.mockRejectedValue(new Error("Network error"))

        const result = await handleToolCall(mockClient, "test", meta, {})

        expect(result.isError).toBe(true)
        expect(result.content).toEqual([{ type: "text", text: "Error: Network error" }])
      })

      it("should handle unknown error", async () => {
        const meta: ToolMeta = {
          path: "/v2/test",
          method: "GET",
          operationId: "test"
        }

        mockClient.request.mockRejectedValue("Unknown error")

        const result = await handleToolCall(mockClient, "test", meta, {})

        expect(result.isError).toBe(true)
        expect(result.content).toEqual([{ type: "text", text: "Error: Unknown error" }])
      })
    })

    describe("Edge cases", () => {
      it("should handle undefined args", async () => {
        const meta: ToolMeta = {
          path: "/v2/profile",
          method: "GET",
          operationId: "profile_get"
        }

        mockClient.request.mockResolvedValue({})

        await handleToolCall(mockClient, "profile_get", meta, undefined)

        expect(mockClient.request).toHaveBeenCalledWith("GET", "/v2/profile", undefined)
      })

      it("should handle path with existing query string", async () => {
        const meta: ToolMeta = {
          path: "/v2/search?type=sms",
          method: "GET",
          operationId: "search"
        }

        const args = { query: "test" }

        mockClient.request.mockResolvedValue({})

        await handleToolCall(mockClient, "search", meta, args)

        expect(mockClient.request).toHaveBeenCalledWith("GET", "/v2/search?type=sms&query=test", undefined)
      })

      it("should convert parameter values to strings", async () => {
        const meta: ToolMeta = {
          path: "/v2/items",
          method: "GET",
          operationId: "items_list"
        }

        const args = {
          count: 5,
          active: true
        }

        mockClient.request.mockResolvedValue({})

        await handleToolCall(mockClient, "items_list", meta, args)

        expect(mockClient.request).toHaveBeenCalledWith("GET", "/v2/items?count=5&active=true", undefined)
      })
    })
  })
})
