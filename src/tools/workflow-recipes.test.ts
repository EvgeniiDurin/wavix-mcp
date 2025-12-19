import { describe, expect, it } from "@jest/globals"
import { workflowRecipes, workflowTools, handleWorkflowTool, isWorkflowTool } from "./workflow-recipes.js"

describe("Workflow Recipes", () => {
  describe("workflowRecipes", () => {
    it("should have all expected recipes defined", () => {
      const expectedRecipes = [
        "sms_campaign_us",
        "setup_2fa",
        "voice_ai_livekit",
        "buy_phone_number",
        "sms_delivery_webhooks",
        "international_sms"
      ]

      expectedRecipes.forEach(recipeId => {
        expect(workflowRecipes[recipeId]).toBeDefined()
      })
    })

    it("each recipe should have required fields", () => {
      Object.entries(workflowRecipes).forEach(([id, recipe]) => {
        expect(recipe.id).toBe(id)
        expect(recipe.name).toBeTruthy()
        expect(recipe.description).toBeTruthy()
        expect(recipe.category).toBeTruthy()
        expect(recipe.steps.length).toBeGreaterThan(0)
        expect(recipe.successCriteria.length).toBeGreaterThan(0)
      })
    })

    it("each step should have required fields", () => {
      Object.values(workflowRecipes).forEach(recipe => {
        recipe.steps.forEach((step, index) => {
          expect(step.step).toBe(index + 1)
          expect(step.title).toBeTruthy()
          expect(step.description).toBeTruthy()
        })
      })
    })

    it("relatedRecipes should reference existing recipes", () => {
      Object.values(workflowRecipes).forEach(recipe => {
        if (recipe.relatedRecipes) {
          recipe.relatedRecipes.forEach(relatedId => {
            expect(workflowRecipes[relatedId]).toBeDefined()
          })
        }
      })
    })
  })

  describe("workflowTools", () => {
    it("should define get_recipe tool", () => {
      const tool = workflowTools.find(t => t.name === "get_recipe")
      expect(tool).toBeDefined()
      expect(tool?.inputSchema.properties).toHaveProperty("recipe")
      expect(tool?.inputSchema.properties).toHaveProperty("step")
      expect(tool?.inputSchema.required).toContain("recipe")
    })

    it("should define list_recipes tool", () => {
      const tool = workflowTools.find(t => t.name === "list_recipes")
      expect(tool).toBeDefined()
      expect(tool?.inputSchema.properties).toHaveProperty("category")
    })

    it("should define get_recipe_step tool", () => {
      const tool = workflowTools.find(t => t.name === "get_recipe_step")
      expect(tool).toBeDefined()
      expect(tool?.inputSchema.required).toContain("recipe")
      expect(tool?.inputSchema.required).toContain("step")
    })
  })

  describe("isWorkflowTool", () => {
    it("should return true for workflow tools", () => {
      expect(isWorkflowTool("get_recipe")).toBe(true)
      expect(isWorkflowTool("list_recipes")).toBe(true)
      expect(isWorkflowTool("get_recipe_step")).toBe(true)
    })

    it("should return false for non-workflow tools", () => {
      expect(isWorkflowTool("sms")).toBe(false)
      expect(isWorkflowTool("buy_numbers")).toBe(false)
      expect(isWorkflowTool("unknown")).toBe(false)
    })
  })

  describe("handleWorkflowTool", () => {
    describe("list_recipes", () => {
      it("should return all recipes without filters", async () => {
        const result = handleWorkflowTool("list_recipes", {})
        const data = JSON.parse(result.content[0].text)

        expect(data.total).toBe(Object.keys(workflowRecipes).length)
        expect(data.recipes).toHaveLength(Object.keys(workflowRecipes).length)
      })

      it("should filter by category", async () => {
        const result = handleWorkflowTool("list_recipes", { category: "SMS" })
        const data = JSON.parse(result.content[0].text)

        data.recipes.forEach((recipe: { category: string }) => {
          expect(recipe.category).toBe("SMS")
        })
      })
    })

    describe("get_recipe", () => {
      it("should return full recipe", async () => {
        const result = handleWorkflowTool("get_recipe", { recipe: "setup_2fa" })
        const data = JSON.parse(result.content[0].text)

        expect(data.name).toBe("Implement 2FA Verification")
        expect(data.steps).toBeDefined()
        expect(data.total_steps).toBeGreaterThan(0)
      })

      it("should return specific step when provided", async () => {
        const result = handleWorkflowTool("get_recipe", { recipe: "setup_2fa", step: 1 })
        const data = JSON.parse(result.content[0].text)

        expect(data.step.step).toBe(1)
        expect(data.progress).toBe("1/5")
      })

      it("should return error for non-existent recipe", async () => {
        const result = handleWorkflowTool("get_recipe", { recipe: "nonexistent" })
        const data = JSON.parse(result.content[0].text)

        expect(data.error).toContain("Recipe not found")
        expect(data.available).toBeDefined()
      })

      it("should return error for non-existent step", async () => {
        const result = handleWorkflowTool("get_recipe", { recipe: "setup_2fa", step: 999 })
        const data = JSON.parse(result.content[0].text)

        expect(data.error).toContain("Step 999 not found")
      })
    })

    describe("get_recipe_step", () => {
      it("should return step details with navigation", async () => {
        const result = handleWorkflowTool("get_recipe_step", { recipe: "setup_2fa", step: 2 })
        const data = JSON.parse(result.content[0].text)

        expect(data.recipe_name).toBe("Implement 2FA Verification")
        expect(data.current_step.step).toBe(2)
        expect(data.progress.current).toBe(2)
        expect(data.navigation.previous).toBeDefined()
        expect(data.navigation.next).toBeDefined()
      })

      it("should return error for non-existent recipe", async () => {
        const result = handleWorkflowTool("get_recipe_step", { recipe: "nonexistent", step: 1 })
        const data = JSON.parse(result.content[0].text)

        expect(data.error).toContain("Recipe not found")
      })

      it("should return error for non-existent step", async () => {
        const result = handleWorkflowTool("get_recipe_step", { recipe: "setup_2fa", step: 999 })
        const data = JSON.parse(result.content[0].text)

        expect(data.error).toContain("Step 999 not found")
        expect(data.available_steps).toBeDefined()
      })
    })
  })
})
