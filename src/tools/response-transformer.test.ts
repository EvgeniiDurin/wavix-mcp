/**
 * Response Transformer Tests
 */

import { transformResponse, formatResponse, applyDefaultParams, checkResponseSize } from "./response-transformer.js"

describe("Response Transformer", () => {
  describe("transformResponse", () => {
    it("should truncate list items when exceeding maxItems", () => {
      const items = Array.from({ length: 50 }, (_, i) => ({
        id: `id-${i}`,
        sender_id: `sender-${i}`,
        type: "alphanumeric",
        usecase: "promo",
        samples: ["sample text that is very long".repeat(10)],
        allowlisted_in: ["US", "CA", "GB"]
      }))

      const result = transformResponse("sms_sender_ids", "list", { items })

      expect(result.truncated).toBe(true)
      expect(result.meta?.totalItems).toBe(50)
      expect(result.meta?.returnedItems).toBe(25)
      expect(result.meta?.paginationHint).toContain("per_page")
    })

    it("should apply summary fields", () => {
      const items = [
        {
          id: "id-1",
          sender_id: "test",
          type: "alphanumeric",
          usecase: "promo",
          samples: ["very long sample text"],
          allowlisted_in: ["US"],
          extra_field: "should be removed"
        }
      ]

      const result = transformResponse("sms_sender_ids", "list", { items })
      const data = result.data as { items: Array<Record<string, unknown>> }

      expect(data.items[0]).toHaveProperty("id")
      expect(data.items[0]).toHaveProperty("sender_id")
      expect(data.items[0]).toHaveProperty("type")
      expect(data.items[0]).toHaveProperty("usecase")
      expect(data.items[0]).not.toHaveProperty("samples") // excluded
      expect(data.items[0]).not.toHaveProperty("extra_field") // not in summaryFields
    })

    it("should not truncate when items are within limit", () => {
      const items = Array.from({ length: 10 }, (_, i) => ({
        id: `id-${i}`,
        sender_id: `sender-${i}`,
        type: "alphanumeric",
        usecase: "promo"
      }))

      const result = transformResponse("sms_sender_ids", "list", { items })

      expect(result.truncated).toBe(false)
      expect(result.meta?.totalItems).toBeUndefined()
    })

    it("should handle responses without config", () => {
      const data = { some: "data" }
      const result = transformResponse("unknown_tool", "unknown_action", data)

      expect(result.data).toEqual(data)
      expect(result.truncated).toBe(false)
    })

    it("should handle array responses directly", () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        number: `+1555000${i.toString().padStart(4, "0")}`,
        label: `Label ${i}`,
        status: "active",
        extra: "should be filtered"
      }))

      const result = transformResponse("numbers", "list", items)
      const data = result.data as Array<Record<string, unknown>>

      expect(result.truncated).toBe(true)
      expect(data.length).toBe(50)
      expect(data[0]).toHaveProperty("id")
      expect(data[0]).toHaveProperty("number")
      expect(data[0]).not.toHaveProperty("extra")
    })

    it("should use compact JSON for large responses", () => {
      const largeItems = Array.from({ length: 1000 }, (_, i) => ({
        id: `id-${i}`,
        data: "x".repeat(100)
      }))

      const result = transformResponse("unknown_tool", "list", { items: largeItems })

      expect(result.useCompactJson).toBe(true)
    })
  })

  describe("formatResponse", () => {
    it("should add _meta to response when truncated", () => {
      const items = Array.from({ length: 50 }, (_, i) => ({
        id: `id-${i}`,
        sender_id: `sender-${i}`,
        type: "alphanumeric",
        usecase: "promo"
      }))

      const formatted = formatResponse("sms_sender_ids", "list", { items })
      const parsed = JSON.parse(formatted)

      expect(parsed._meta).toBeDefined()
      expect(parsed._meta.totalItems).toBe(50)
      expect(parsed._meta.returnedItems).toBe(25)
      expect(parsed._meta.paginationHint).toContain("per_page")
    })

    it("should not add _meta when no transformation applied", () => {
      const formatted = formatResponse("config", "get_api_url", { api_url: "https://api.wavix.com" })
      const parsed = JSON.parse(formatted)

      expect(parsed._meta).toBeUndefined()
    })

    it("should produce compact JSON for large responses", () => {
      const largeItems = Array.from({ length: 500 }, (_, i) => ({
        id: `id-${i}`,
        data: "x".repeat(50)
      }))

      const formatted = formatResponse("unknown_tool", "list", { items: largeItems })

      // Compact JSON shouldn't have newlines between array items
      expect(formatted.split("\n").length).toBeLessThan(10)
    })
  })

  describe("applyDefaultParams", () => {
    it("should apply default per_page for numbers list", () => {
      const params = applyDefaultParams("numbers", "list", {})

      expect(params.per_page).toBe(50)
    })

    it("should not override user-provided params", () => {
      const params = applyDefaultParams("numbers", "list", { per_page: 100 })

      expect(params.per_page).toBe(100)
    })

    it("should return original params for unknown tools", () => {
      const original = { foo: "bar" }
      const params = applyDefaultParams("unknown", "action", original)

      expect(params).toEqual(original)
    })

    it("should apply defaults for SMS list", () => {
      const params = applyDefaultParams("sms", "list", {})

      expect(params.per_page).toBe(30)
    })

    it("should apply defaults for CDR list", () => {
      const params = applyDefaultParams("cdrs", "list", { from: "2024-01-01", to: "2024-01-31", type: "placed" })

      expect(params.per_page).toBe(50)
    })
  })

  describe("checkResponseSize", () => {
    it("should detect small responses", () => {
      const small = JSON.stringify({ id: 1, name: "test" })
      const result = checkResponseSize(small)

      expect(result.shouldWarn).toBe(false)
      expect(result.shouldCompact).toBe(false)
    })

    it("should detect medium responses needing compact", () => {
      const medium = JSON.stringify({ data: "x".repeat(15000) }) // ~3750 tokens
      const result = checkResponseSize(medium)

      expect(result.shouldWarn).toBe(false)
      expect(result.shouldCompact).toBe(true)
    })

    it("should detect large responses needing warning", () => {
      const large = JSON.stringify({ data: "x".repeat(40000) }) // ~10000 tokens
      const result = checkResponseSize(large)

      expect(result.shouldWarn).toBe(true)
      expect(result.shouldCompact).toBe(true)
    })

    it("should return accurate token estimates", () => {
      const json = "x".repeat(400) // 400 chars = ~100 tokens
      const result = checkResponseSize(json)

      expect(result.tokens).toBe(100)
    })
  })
})
