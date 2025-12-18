/**
 * Data Masking Utilities Tests
 */

import { describe, expect, it } from "@jest/globals"
import { maskApiKey, maskPhone, maskEmail, maskSensitiveData } from "./masking.js"

describe("Masking Utilities", () => {
  describe("maskApiKey", () => {
    it("should mask API key showing first 4 and last 4 characters", () => {
      const apiKey = "abcd1234efgh5678ijkl"
      const masked = maskApiKey(apiKey)

      expect(masked).toBe("abcd...ijkl")
    })

    it("should return **** for short API keys", () => {
      const shortKey = "short"
      const masked = maskApiKey(shortKey)

      expect(masked).toBe("****")
    })

    it("should return **** for empty string", () => {
      const masked = maskApiKey("")

      expect(masked).toBe("****")
    })

    it("should handle exactly 12 character key", () => {
      const key = "123456789012"
      const masked = maskApiKey(key)

      expect(masked).toBe("1234...9012")
    })
  })

  describe("maskPhone", () => {
    it("should mask phone number showing last 4 digits", () => {
      const phone = "+1234567890"
      const masked = maskPhone(phone)

      expect(masked).toBe("***7890")
    })

    it("should return **** for short phone numbers", () => {
      const shortPhone = "123"
      const masked = maskPhone(shortPhone)

      expect(masked).toBe("****")
    })

    it("should return **** for empty string", () => {
      const masked = maskPhone("")

      expect(masked).toBe("****")
    })

    it("should handle exactly 4 digit phone", () => {
      const phone = "1234"
      const masked = maskPhone(phone)

      expect(masked).toBe("***1234")
    })
  })

  describe("maskEmail", () => {
    it("should mask email showing first character and domain", () => {
      const email = "test@example.com"
      const masked = maskEmail(email)

      expect(masked).toBe("t***@example.com")
    })

    it("should return **** for invalid email without @", () => {
      const invalidEmail = "notanemail"
      const masked = maskEmail(invalidEmail)

      expect(masked).toBe("****")
    })

    it("should return **** for empty string", () => {
      const masked = maskEmail("")

      expect(masked).toBe("****")
    })

    it("should handle email with single character local part", () => {
      const email = "a@example.com"
      const masked = maskEmail(email)

      expect(masked).toBe("a***@example.com")
    })

    it("should handle email with subdomain", () => {
      const email = "user@mail.example.com"
      const masked = maskEmail(email)

      expect(masked).toBe("u***@mail.example.com")
    })

    it("should handle malformed email with multiple @", () => {
      const email = "user@@example.com"
      const masked = maskEmail(email)

      expect(masked).toBe("u***@")
    })
  })

  describe("maskSensitiveData", () => {
    it("should mask API key fields", () => {
      const data = {
        apiKey: "abcd1234efgh5678ijkl",
        api_key: "test-key-1234567890",
        name: "John Doe"
      }

      const masked = maskSensitiveData(data)

      expect(masked.apiKey).toBe("abcd...ijkl")
      expect(masked.api_key).toBe("test...7890")
      expect(masked.name).toBe("John Doe")
    })

    it("should mask password and secret fields", () => {
      const data = {
        password: "supersecret123",
        secret: "mysecretsecret",
        username: "testuser"
      }

      const masked = maskSensitiveData(data)

      expect(masked.password).toBe("supe...t123")
      expect(masked.secret).toBe("myse...cret")
      expect(masked.username).toBe("testuser")
    })

    it("should mask token fields", () => {
      const data = {
        token: "token1234567890",
        accessToken: "access-token-long"
      }

      const masked = maskSensitiveData(data)

      expect(masked.token).toBe("toke...7890")
      expect(masked.accessToken).toBe("acce...long")
    })

    it("should mask phone number fields", () => {
      const data = {
        phone: "+1234567890",
        from: "+0987654321",
        to: "+1111111111",
        number: "5555555555"
      }

      const masked = maskSensitiveData(data)

      expect(masked.phone).toBe("***7890")
      expect(masked.from).toBe("***4321")
      expect(masked.to).toBe("***1111")
      expect(masked.number).toBe("***5555")
    })

    it("should mask email fields", () => {
      const data = {
        email: "test@example.com",
        userEmail: "user@test.com",
        name: "John Doe"
      }

      const masked = maskSensitiveData(data)

      expect(masked.email).toBe("t***@example.com")
      expect(masked.userEmail).toBe("u***@test.com")
      expect(masked.name).toBe("John Doe")
    })

    it("should handle mixed sensitive and non-sensitive fields", () => {
      const data = {
        apiKey: "abcd1234efgh5678ijkl",
        phone: "+1234567890",
        email: "user@example.com",
        name: "John Doe",
        count: "10"
      }

      const masked = maskSensitiveData(data)

      expect(masked.apiKey).toBe("abcd...ijkl")
      expect(masked.phone).toBe("***7890")
      expect(masked.email).toBe("u***@example.com")
      expect(masked.name).toBe("John Doe")
      expect(masked.count).toBe("10")
    })

    it("should only mask string values", () => {
      const data = {
        apiKey: "abcd1234efgh5678ijkl",
        count: 42,
        active: true,
        items: ["item1", "item2"],
        metadata: { key: "value" }
      }

      const masked = maskSensitiveData(data)

      expect(masked.apiKey).toBe("abcd...ijkl")
      expect(masked.count).toBe(42)
      expect(masked.active).toBe(true)
      expect(masked.items).toEqual(["item1", "item2"])
      expect(masked.metadata).toEqual({ key: "value" })
    })

    it("should handle empty object", () => {
      const data = {}
      const masked = maskSensitiveData(data)

      expect(masked).toEqual({})
    })

    it("should not modify original object", () => {
      const data = {
        apiKey: "abcd1234efgh5678ijkl",
        name: "Test"
      }

      const original = { ...data }
      const masked = maskSensitiveData(data)

      expect(data).toEqual(original)
      expect(masked).not.toEqual(data)
    })

    it("should handle case-insensitive field matching", () => {
      const data = {
        APIKEY: "test12345678901234",
        ApiKey: "test09876543210987",
        apikey: "test11111111111111"
      }

      const masked = maskSensitiveData(data)

      expect(masked.APIKEY).toBe("test...1234")
      expect(masked.ApiKey).toBe("test...0987")
      expect(masked.apikey).toBe("test...1111")
    })

    it("should handle partial field name matches", () => {
      const data = {
        userApiKey: "test12345678901234",
        systemPassword: "password1234567890",
        accountToken: "token1234567890token"
      }

      const masked = maskSensitiveData(data)

      expect(masked.userApiKey).toBe("test...1234")
      expect(masked.systemPassword).toBe("pass...7890")
      expect(masked.accountToken).toBe("toke...oken")
    })
  })
})
