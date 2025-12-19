/**
 * MCP Resources Registration Tests
 *
 * Tests for MCP resource handlers registration.
 * Loader functions are tested in loader.test.ts
 */

import { describe, expect, it, beforeEach, jest } from "@jest/globals"
import { registerResources, listResources } from "./index.js"
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

  setupConsoleMocks()

  beforeEach(() => {
    listResourcesHandler = undefined
    readResourceHandler = undefined

    let handlerIndex = 0

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
    it("should register ListResources and ReadResource handlers", () => {
      registerResources(mockServer as unknown as Server)

      expect(mockServer.setRequestHandler).toHaveBeenCalledTimes(2)
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
    })

    it("should throw error for non-existent resource", async () => {
      registerResources(mockServer as unknown as Server)

      await expect(readResourceHandler!({ params: { uri: "wavix://nonexistent/resource" } })).rejects.toThrow(
        "Resource not found"
      )
    })
  })
})
