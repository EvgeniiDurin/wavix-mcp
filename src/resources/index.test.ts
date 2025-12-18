/**
 * MCP Resources Tests
 *
 * Integration tests for the resources module.
 * Uses real resources from the synced documentation.
 */

import { describe, expect, it, beforeEach, jest } from "@jest/globals"
import { registerResources, listResources, getResource, searchResources, getResourcesByCategory } from "./index.js"
import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { setupConsoleMocks } from "../test-utils.js"

// Types for test handlers
interface ListResourcesResponse {
  resources: Array<{
    uri: string
    name: string
    description: string
    mimeType: string
  }>
}

interface ReadResourceResponse {
  contents: Array<{
    uri: string
    mimeType: string
    text: string
  }>
}

type ListResourcesHandler = () => Promise<ListResourcesResponse>
type ReadResourcesHandler = (request: { params: { uri: string } }) => Promise<ReadResourceResponse>

describe("Resources Registration", () => {
  let mockServer: {
    setRequestHandler: jest.MockedFunction<Server["setRequestHandler"]>
  }
  let listResourcesHandler: ListResourcesHandler | undefined
  let readResourceHandler: ReadResourcesHandler | undefined

  // Use shared console mocking utility
  setupConsoleMocks()

  beforeEach(() => {
    // Reset handlers
    listResourcesHandler = undefined
    readResourceHandler = undefined

    let handlerIndex = 0

    // Create mock server that captures handlers
    // First call is ListResourcesRequestSchema, second is ReadResourceRequestSchema
    mockServer = {
      setRequestHandler: jest.fn((schema: unknown, handler: unknown) => {
        void schema
        if (handlerIndex === 0) {
          listResourcesHandler = handler as ListResourcesHandler
        } else if (handlerIndex === 1) {
          readResourceHandler = handler as ReadResourcesHandler
        }
        handlerIndex++
      })
    }
  })

  describe("registerResources", () => {
    it("should register exactly two request handlers", () => {
      registerResources(mockServer as unknown as Server)

      expect(mockServer.setRequestHandler).toHaveBeenCalledTimes(2)
    })

    it("should register ListResources and ReadResource handlers", () => {
      registerResources(mockServer as unknown as Server)

      expect(listResourcesHandler).toBeDefined()
      expect(readResourceHandler).toBeDefined()
    })
  })

  describe("List Resources Handler", () => {
    it("should return resources with correct MCP format", async () => {
      registerResources(mockServer as unknown as Server)

      const result = await listResourcesHandler!()

      expect(result).toHaveProperty("resources")
      expect(Array.isArray(result.resources)).toBe(true)
      expect(result.resources.length).toBeGreaterThan(0)

      // Verify each resource has required MCP fields
      result.resources.forEach(resource => {
        expect(resource).toEqual(
          expect.objectContaining({
            uri: expect.stringMatching(/^wavix:\/\//),
            name: expect.any(String),
            description: expect.any(String),
            mimeType: "text/markdown"
          })
        )
      })
    })

    it("should not expose internal fields in response", async () => {
      registerResources(mockServer as unknown as Server)

      const result = await listResourcesHandler!()

      result.resources.forEach(resource => {
        expect(resource).not.toHaveProperty("metadata")
        expect(resource).not.toHaveProperty("sourcePath")
      })
    })

    it("should include both API and product resources", async () => {
      registerResources(mockServer as unknown as Server)

      const result = await listResourcesHandler!()

      const hasApiResources = result.resources.some(r => r.uri.startsWith("wavix://api/"))
      const hasProductResources = result.resources.some(r => r.uri.startsWith("wavix://product/"))

      expect(hasApiResources).toBe(true)
      expect(hasProductResources).toBe(true)
    })
  })

  describe("Read Resource Handler", () => {
    it("should return resource content in MCP format", async () => {
      registerResources(mockServer as unknown as Server)

      const resourcesList = listResources()
      const firstResource = resourcesList[0]

      const result = await readResourceHandler!({
        params: { uri: firstResource.uri }
      })

      expect(result).toHaveProperty("contents")
      expect(result.contents).toHaveLength(1)
      expect(result.contents[0]).toEqual({
        uri: firstResource.uri,
        mimeType: "text/markdown",
        text: expect.any(String)
      })
      expect(result.contents[0].text.length).toBeGreaterThan(0)
    })

    it("should throw descriptive error for non-existent resource", async () => {
      registerResources(mockServer as unknown as Server)

      const request = {
        params: { uri: "wavix://nonexistent/resource" }
      }

      await expect(readResourceHandler!(request)).rejects.toThrow("Resource not found")
    })

    it("should return valid markdown content for API resources", async () => {
      registerResources(mockServer as unknown as Server)

      const apiResource = listResources().find(r => r.uri.startsWith("wavix://api/"))

      if (apiResource) {
        const result = await readResourceHandler!({
          params: { uri: apiResource.uri }
        })

        // API docs should have substantial content
        expect(result.contents[0].text.length).toBeGreaterThan(50)
      }
    })

    it("should return valid markdown content for product resources", async () => {
      registerResources(mockServer as unknown as Server)

      const productResource = listResources().find(r => r.uri.startsWith("wavix://product/"))

      if (productResource) {
        const result = await readResourceHandler!({
          params: { uri: productResource.uri }
        })

        expect(result.contents[0].text.length).toBeGreaterThan(50)
      }
    })
  })
})

describe("Re-exported loader functions", () => {
  it("listResources should return array with expected count", () => {
    const resources = listResources()

    expect(Array.isArray(resources)).toBe(true)
    expect(resources.length).toBeGreaterThanOrEqual(90) // 62 API + 33 product
    expect(resources.length).toBeLessThanOrEqual(150)
  })

  it("getResource should find and return matching resource", () => {
    const resources = listResources()
    const firstResource = resources[0]

    const found = getResource(firstResource.uri)

    expect(found).toEqual(
      expect.objectContaining({
        uri: firstResource.uri,
        name: firstResource.name
      })
    )
  })

  it("getResource should return undefined for non-existent URI", () => {
    const found = getResource("wavix://nonexistent/resource")
    expect(found).toBeUndefined()
  })

  it("searchResources should return matching resources", () => {
    const results = searchResources("sms")

    expect(Array.isArray(results)).toBe(true)
    // SMS is common topic, should have matches
    if (results.length > 0) {
      const allMatch = results.every(
        r =>
          r.name.toLowerCase().includes("sms") ||
          r.description.toLowerCase().includes("sms") ||
          r.metadata.tags?.some((t: string) => t.toLowerCase().includes("sms"))
      )
      expect(allMatch).toBe(true)
    }
  })

  it("searchResources should return empty array for no matches", () => {
    const results = searchResources("xyznonexistentxyz123")
    expect(results).toEqual([])
  })

  it("getResourcesByCategory should return resources in category", () => {
    const faqResults = getResourcesByCategory("faq")

    expect(Array.isArray(faqResults)).toBe(true)
    if (faqResults.length > 0) {
      expect(faqResults.every(r => r.metadata.category === "faq")).toBe(true)
    }
  })

  it("getResourcesByCategory should return empty for non-existent category", () => {
    const results = getResourcesByCategory("nonexistent-category")
    expect(results).toEqual([])
  })
})
