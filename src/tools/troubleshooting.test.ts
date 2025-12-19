/**
 * Troubleshooting Tools Tests
 */

import { describe, expect, it } from "@jest/globals"
import {
  errorDatabase,
  featurePrerequisites,
  troubleshootingTools,
  handleTroubleshootingTool,
  isTroubleshootingTool
} from "./troubleshooting.js"

describe("Troubleshooting Tools", () => {
  describe("errorDatabase", () => {
    it("should have error entries with required fields", () => {
      Object.entries(errorDatabase).forEach(([code, error]) => {
        expect(error.code).toBe(code)
        expect(error.title).toBeTruthy()
        expect(error.description).toBeTruthy()
        expect(error.causes.length).toBeGreaterThan(0)
        expect(error.solutions.length).toBeGreaterThan(0)
        expect(error.relatedTools).toBeDefined()
        expect(["low", "medium", "high", "critical"]).toContain(error.severity)
        expect(["sms", "voice", "validation", "auth", "billing", "config"]).toContain(error.category)
      })
    })

    it("should have common SMS error codes", () => {
      expect(errorDatabase["5"]).toBeDefined() // Sender ID not provisioned
      expect(errorDatabase["9"]).toBeDefined() // Unsubscribed
      expect(errorDatabase["33"]).toBeDefined() // 10DLC required
    })
  })

  describe("featurePrerequisites", () => {
    it("should have prerequisites for all features", () => {
      const expectedFeatures = ["sms_us", "sms_international", "two_fa", "voice_calls", "voice_ai", "call_recording"]

      expectedFeatures.forEach(feature => {
        expect(featurePrerequisites[feature]).toBeDefined()
      })
    })

    it("each prerequisite should have required fields", () => {
      Object.values(featurePrerequisites).forEach(prereq => {
        expect(prereq.name).toBeTruthy()
        expect(prereq.description).toBeTruthy()
        expect(prereq.requirements.length).toBeGreaterThan(0)
        prereq.requirements.forEach(req => {
          expect(req.name).toBeTruthy()
          expect(typeof req.required).toBe("boolean")
        })
      })
    })
  })

  describe("troubleshootingTools", () => {
    it("should define all expected tools", () => {
      const toolNames = troubleshootingTools.map(t => t.name)

      expect(toolNames).toContain("troubleshoot")
      expect(toolNames).toContain("explain")
      expect(toolNames).toHaveLength(2)
    })

    it("each tool should have valid schema", () => {
      troubleshootingTools.forEach(tool => {
        expect(tool.name).toBeTruthy()
        expect(tool.description).toBeTruthy()
        expect(tool.inputSchema).toBeDefined()
        expect(tool.inputSchema.type).toBe("object")
        expect(tool.inputSchema.properties).toBeDefined()
      })
    })
  })

  describe("isTroubleshootingTool", () => {
    it("should return true for troubleshooting tools", () => {
      expect(isTroubleshootingTool("troubleshoot")).toBe(true)
      expect(isTroubleshootingTool("explain")).toBe(true)
    })

    it("should return false for non-troubleshooting tools", () => {
      expect(isTroubleshootingTool("sms")).toBe(false)
      expect(isTroubleshootingTool("profile")).toBe(false)
      expect(isTroubleshootingTool("unknown")).toBe(false)
      expect(isTroubleshootingTool("diagnose_error")).toBe(false)
      expect(isTroubleshootingTool("check_prerequisites")).toBe(false)
      expect(isTroubleshootingTool("search_errors")).toBe(false)
    })
  })

  describe("handleTroubleshootingTool", () => {
    describe("explain", () => {
      it("should explain known topics", () => {
        const result = handleTroubleshootingTool("explain", { topic: "10DLC" })
        const data = JSON.parse(result.content[0].text)

        expect(data.topic).toBeTruthy()
        expect(data.explanation).toBeTruthy()
      })

      it("should return suggestion for unknown topics", () => {
        const result = handleTroubleshootingTool("explain", { topic: "random topic" })
        const data = JSON.parse(result.content[0].text)

        expect(data.topic).toBe("random topic")
        expect(data.suggestion).toBeTruthy()
      })
    })

    describe("troubleshoot", () => {
      it("should diagnose by error code", () => {
        const result = handleTroubleshootingTool("troubleshoot", { error_code: "33" })
        const data = JSON.parse(result.content[0].text)

        expect(data.detected_category).toBeDefined()
        expect(data.error_diagnosis).toBeDefined()
      })

      it("should handle description-based troubleshooting", () => {
        const result = handleTroubleshootingTool("troubleshoot", { description: "SMS not delivered" })
        const data = JSON.parse(result.content[0].text)

        expect(data.detected_category).toBe("sms")
      })

      it("should detect 10DLC category from description", () => {
        const result = handleTroubleshootingTool("troubleshoot", { description: "10DLC campaign issue" })
        const data = JSON.parse(result.content[0].text)

        expect(data.detected_category).toBe("10dlc")
      })

      it("should detect call category from description", () => {
        const result = handleTroubleshootingTool("troubleshoot", { description: "call failed" })
        const data = JSON.parse(result.content[0].text)

        expect(data.detected_category).toBe("call")
      })
    })
  })
})
