/**
 * Integration Tools Tests
 */

import { describe, expect, it } from "@jest/globals"
import { integrationTools, handleIntegrationTool, isIntegrationTool } from "./integration-tools.js"
import { endpointMetadata } from "./endpoint-metadata.js"

describe("Integration Tools", () => {
  describe("integrationTools", () => {
    it("should define all expected tools", () => {
      const toolNames = integrationTools.map(t => t.name)

      expect(toolNames).toContain("integration_example")
      expect(toolNames).toContain("endpoint_info")
      expect(toolNames).toContain("list_endpoints")
    })

    it("each tool should have valid schema", () => {
      integrationTools.forEach(tool => {
        expect(tool.name).toBeTruthy()
        expect(tool.description).toBeTruthy()
        expect(tool.inputSchema).toBeDefined()
        expect(tool.inputSchema.type).toBe("object")
      })
    })
  })

  describe("isIntegrationTool", () => {
    it("should return true for integration tools", () => {
      expect(isIntegrationTool("integration_example")).toBe(true)
      expect(isIntegrationTool("endpoint_info")).toBe(true)
      expect(isIntegrationTool("list_endpoints")).toBe(true)
    })

    it("should return false for non-integration tools", () => {
      expect(isIntegrationTool("sms")).toBe(false)
      expect(isIntegrationTool("profile")).toBe(false)
      expect(isIntegrationTool("unknown")).toBe(false)
    })
  })

  describe("handleIntegrationTool", () => {
    describe("list_endpoints", () => {
      it("should return all endpoints", () => {
        const result = handleIntegrationTool("list_endpoints", {})
        const data = JSON.parse(result.content[0].text)

        expect(data.total).toBeGreaterThan(0)
        expect(data.endpoints).toBeDefined()
        expect(data.endpoints.length).toBe(data.total)
      })

      it("should filter by category", () => {
        const result = handleIntegrationTool("list_endpoints", { category: "SMS and MMS" })
        const data = JSON.parse(result.content[0].text)

        data.endpoints.forEach((endpoint: { category: string }) => {
          expect(endpoint.category).toBe("SMS and MMS")
        })
      })
    })

    describe("endpoint_info", () => {
      it("should return info for valid endpoint", () => {
        const result = handleIntegrationTool("endpoint_info", { endpoint: "sms" })
        const data = JSON.parse(result.content[0].text)

        expect(data.name).toBe("sms")
        expect(data.category).toBeTruthy()
        expect(data.actions).toBeDefined()
        expect(data.actions.length).toBeGreaterThan(0)
      })

      it("should return specific action info", () => {
        const result = handleIntegrationTool("endpoint_info", { endpoint: "sms", action: "send" })
        const data = JSON.parse(result.content[0].text)

        expect(data.tool).toBe("sms")
        expect(data.action).toBe("send")
        expect(data.version).toBeTruthy()
        expect(data.fullPath).toBeTruthy()
      })

      it("should return error for unknown endpoint", () => {
        const result = handleIntegrationTool("endpoint_info", { endpoint: "nonexistent" })
        const data = JSON.parse(result.content[0].text)

        expect(data.error).toBeTruthy()
        expect(data.available).toBeDefined()
      })

      it("should return error for unknown action", () => {
        const result = handleIntegrationTool("endpoint_info", { endpoint: "sms", action: "unknown" })
        const data = JSON.parse(result.content[0].text)

        expect(data.error).toBeTruthy()
        expect(data.available).toBeDefined()
      })
    })

    describe("integration_example", () => {
      it("should return code example for valid endpoint", () => {
        const result = handleIntegrationTool("integration_example", { endpoint: "sms" })
        const data = JSON.parse(result.content[0].text)

        expect(data.endpoint).toBe("sms")
        expect(data.code).toBeTruthy()
        expect(data.apiVersion).toBeTruthy()
      })

      it("should return code in specified language", () => {
        const result = handleIntegrationTool("integration_example", { endpoint: "sms", language: "curl" })
        const data = JSON.parse(result.content[0].text)

        expect(data.language).toBe("curl")
        expect(data.code).toContain("curl")
      })

      it("should return error for unknown endpoint", () => {
        const result = handleIntegrationTool("integration_example", { endpoint: "nonexistent" })
        const data = JSON.parse(result.content[0].text)

        expect(data.error).toBeTruthy()
      })

      it("should return error when endpoint is missing", () => {
        const result = handleIntegrationTool("integration_example", {})
        const data = JSON.parse(result.content[0].text)

        expect(data.error).toBeTruthy()
      })
    })
  })

  describe("endpointMetadata", () => {
    it("should have metadata for main endpoints", () => {
      expect(endpointMetadata.sms).toBeDefined()
      expect(endpointMetadata.validation).toBeDefined()
      expect(endpointMetadata.two_fa).toBeDefined()
      expect(endpointMetadata.calls).toBeDefined()
    })

    it("each endpoint should have required fields", () => {
      Object.entries(endpointMetadata).forEach(([id, meta]) => {
        expect(meta.name).toBe(id)
        expect(meta.category).toBeTruthy()
        expect(meta.description).toBeTruthy()
        expect(Object.keys(meta.endpoints).length).toBeGreaterThan(0)
      })
    })

    it("each action should have version and path", () => {
      Object.values(endpointMetadata).forEach(meta => {
        Object.values(meta.endpoints).forEach(endpoint => {
          expect(endpoint.version).toMatch(/^v[1-3]$/)
          expect(endpoint.fullPath).toMatch(/^\/v[1-3]\//)
          expect(endpoint.description).toBeTruthy()
        })
      })
    })
  })
})
