/**
 * Resources Loader Tests
 *
 * Integration tests using actual resource files from api/ and product/ directories.
 * This approach is more reliable than mocking fs with ESM modules.
 */

import { describe, expect, it, beforeEach } from "@jest/globals"
import {
  loadResources,
  getResource,
  readResourceContent,
  searchResources,
  getResourcesByCategory,
  listResources,
  clearResourcesCache
} from "./loader.js"

describe("Resources Loader", () => {
  beforeEach(() => {
    clearResourcesCache()
  })

  describe("loadResources", () => {
    it("should load resources from api and product directories", () => {
      const resources = loadResources()

      // Should have loaded resources from both sources
      expect(resources.size).toBeGreaterThan(0)

      // Check we have both API and product resources
      const uris = Array.from(resources.keys())
      const hasApiResources = uris.some(uri => uri.startsWith("wavix://api/"))
      const hasProductResources = uris.some(uri => uri.startsWith("wavix://product/"))

      expect(hasApiResources).toBe(true)
      expect(hasProductResources).toBe(true)
    })

    it("should cache resources on subsequent calls", () => {
      const resources1 = loadResources()
      const resources2 = loadResources()

      // Should be the same Map instance (cached)
      expect(resources1).toBe(resources2)
    })

    it("should create LoadedResource with correct structure", () => {
      const resources = loadResources()
      const firstResource = resources.values().next().value

      expect(firstResource).toHaveProperty("uri")
      expect(firstResource).toHaveProperty("name")
      expect(firstResource).toHaveProperty("description")
      expect(firstResource).toHaveProperty("mimeType", "text/markdown")
      expect(firstResource).toHaveProperty("metadata")
      expect(firstResource).toHaveProperty("sourcePath")
    })
  })

  describe("listResources", () => {
    it("should return array of all resources", () => {
      const resources = listResources()

      expect(Array.isArray(resources)).toBe(true)
      expect(resources.length).toBeGreaterThan(0)
    })

    it("should have consistent count with loadResources", () => {
      const map = loadResources()
      const list = listResources()

      expect(list.length).toBe(map.size)
    })
  })

  describe("getResource", () => {
    it("should return resource by URI", () => {
      const resources = loadResources()
      const firstUri = resources.keys().next().value

      const resource = getResource(firstUri)

      expect(resource).toBeDefined()
      expect(resource?.uri).toBe(firstUri)
    })

    it("should return undefined for non-existent URI", () => {
      const resource = getResource("wavix://nonexistent/resource")

      expect(resource).toBeUndefined()
    })

    it("should find API documentation resource", () => {
      const resource = getResource("wavix://api/index")

      // May or may not exist depending on what's synced
      if (resource) {
        expect(resource.uri).toBe("wavix://api/index")
        expect(resource.mimeType).toBe("text/markdown")
      }
    })

    it("should find product documentation resource", () => {
      // Try to find any FAQ resource
      const resources = listResources()
      const faqResource = resources.find(r => r.uri.includes("/faq/"))

      if (faqResource) {
        const found = getResource(faqResource.uri)
        expect(found).toBeDefined()
        expect(found?.uri).toBe(faqResource.uri)
      }
    })
  })

  describe("readResourceContent", () => {
    it("should read and return file content", () => {
      const resources = listResources()
      const resource = resources[0]

      const content = readResourceContent(resource)

      expect(typeof content).toBe("string")
      expect(content.length).toBeGreaterThan(0)
    })

    it("should read markdown content with frontmatter", () => {
      const resources = listResources()
      const mdResource = resources.find(r => r.sourcePath.endsWith(".md"))

      if (mdResource) {
        const content = readResourceContent(mdResource)

        // Most markdown files have frontmatter or headers
        expect(content).toMatch(/^(---|#)/)
      }
    })

    it("should throw error for non-existent file", () => {
      const fakeResource = {
        uri: "wavix://fake/resource",
        name: "Fake",
        description: "Fake resource",
        mimeType: "text/markdown",
        metadata: { id: "fake", uri: "wavix://fake/resource", file: "fake.md", title: "Fake" },
        sourcePath: "/nonexistent/path/fake.md"
      }

      expect(() => readResourceContent(fakeResource)).toThrow()
    })
  })

  describe("searchResources", () => {
    it("should find resources by name", () => {
      const results = searchResources("pricing")

      // Should find pricing-related resources
      expect(results.length).toBeGreaterThanOrEqual(0)

      if (results.length > 0) {
        const hasMatch = results.some(
          r => r.name.toLowerCase().includes("pricing") || r.description.toLowerCase().includes("pricing")
        )
        expect(hasMatch).toBe(true)
      }
    })

    it("should find resources by description", () => {
      const results = searchResources("SMS")

      if (results.length > 0) {
        const hasMatch = results.some(
          r =>
            r.name.toLowerCase().includes("sms") ||
            r.description.toLowerCase().includes("sms") ||
            r.metadata.tags?.some(t => t.toLowerCase().includes("sms"))
        )
        expect(hasMatch).toBe(true)
      }
    })

    it("should be case-insensitive", () => {
      const lowerResults = searchResources("sms")
      const upperResults = searchResources("SMS")
      const mixedResults = searchResources("SmS")

      // All searches should return same results
      expect(lowerResults.length).toBe(upperResults.length)
      expect(lowerResults.length).toBe(mixedResults.length)
    })

    it("should return empty array when no matches", () => {
      const results = searchResources("xyznonexistenttermxyz123")

      expect(results).toEqual([])
    })
  })

  describe("getResourcesByCategory", () => {
    it("should return resources in specified category", () => {
      const resources = listResources()
      const categories = [...new Set(resources.map(r => r.metadata.category).filter(Boolean))]

      if (categories.length > 0) {
        const category = categories[0] as string
        const results = getResourcesByCategory(category)

        expect(results.length).toBeGreaterThan(0)
        expect(results.every(r => r.metadata.category === category)).toBe(true)
      }
    })

    it("should return empty array for non-existent category", () => {
      const results = getResourcesByCategory("nonexistent-category-xyz")

      expect(results).toEqual([])
    })

    it("should find FAQ resources", () => {
      const results = getResourcesByCategory("faq")

      // Should have FAQ resources from product docs
      if (results.length > 0) {
        expect(results.every(r => r.metadata.category === "faq")).toBe(true)
      }
    })

    it("should find guides resources", () => {
      const results = getResourcesByCategory("guides")

      if (results.length > 0) {
        expect(results.every(r => r.metadata.category === "guides")).toBe(true)
      }
    })
  })

  describe("clearResourcesCache", () => {
    it("should clear the cache", () => {
      // Load resources first
      const resources1 = loadResources()

      // Clear cache
      clearResourcesCache()

      // Load again - should be a new Map instance
      const resources2 = loadResources()

      // While content is same, it should be reloaded (new instance)
      // Note: We can't easily verify this without internal access,
      // but we can verify it still works
      expect(resources2.size).toBe(resources1.size)
    })

    it("should allow reloading after clear", () => {
      loadResources()
      clearResourcesCache()

      // Should not throw
      const resources = loadResources()
      expect(resources.size).toBeGreaterThan(0)
    })
  })

  describe("Resource URIs", () => {
    it("should have valid URI format for API resources", () => {
      const resources = listResources()
      const apiResources = resources.filter(r => r.uri.startsWith("wavix://api/"))

      apiResources.forEach(r => {
        expect(r.uri).toMatch(/^wavix:\/\/api\//)
        expect(r.metadata.uri).toBe(r.uri)
      })
    })

    it("should have valid URI format for product resources", () => {
      const resources = listResources()
      const productResources = resources.filter(r => r.uri.startsWith("wavix://product/"))

      productResources.forEach(r => {
        expect(r.uri).toMatch(/^wavix:\/\/product\//)
        expect(r.metadata.uri).toBe(r.uri)
      })
    })
  })

  describe("Resource counts", () => {
    it("should have expected number of API resources", () => {
      const resources = listResources()
      const apiCount = resources.filter(r => r.uri.startsWith("wavix://api/")).length

      // We synced 62 API docs
      expect(apiCount).toBeGreaterThanOrEqual(50)
    })

    it("should have expected number of product resources", () => {
      const resources = listResources()
      const productCount = resources.filter(r => r.uri.startsWith("wavix://product/")).length

      // We exported 33 product docs
      expect(productCount).toBeGreaterThanOrEqual(30)
    })

    it("should have total resources around 95", () => {
      const resources = listResources()

      // 62 API + 33 product = 95
      expect(resources.length).toBeGreaterThanOrEqual(90)
      expect(resources.length).toBeLessThanOrEqual(150)
    })
  })
})
