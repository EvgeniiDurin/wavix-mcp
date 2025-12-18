/**
 * Configuration module with Joi validation
 * Following Wavix Node.js project conventions
 */

import Joi from "joi"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

/**
 * Environment variables schema
 */
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),

  // Wavix API Configuration
  // API key is OPTIONAL — without it, only Resources (documentation) are available
  // With API key, full Tools functionality (sms_send, call_start, etc.) is enabled
  WAVIX_API_KEY: Joi.string().optional().description("Wavix API key (optional for documentation mode)"),
  WAVIX_API_URL: Joi.string().uri().default("https://api.wavix.com").description("Wavix API base URL"),

  // Logging
  LOG_LEVEL: Joi.string().valid("debug", "info", "warn", "error").default("info").description("Logging level"),

  // MCP Server
  MCP_SERVER_NAME: Joi.string().default("wavix-mcp-server").description("MCP server name"),
  MCP_SERVER_VERSION: Joi.string().default("1.0.0").description("MCP server version")
})
  .unknown()
  .required()

const { error, value: envVars } = envVarsSchema.validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

/**
 * Configuration interface
 */
export interface Config {
  nodeEnv: string
  isDevelopment: boolean
  isProduction: boolean
  isTest: boolean
  wavix: {
    apiKey: string | undefined
    apiUrl: string
    hasApiKey: boolean // true = Full Mode (Tools enabled), false = Documentation Mode only
  }
  logging: {
    level: string
  }
  mcp: {
    serverName: string
    serverVersion: string
  }
}

/**
 * Application configuration
 */
export const config: Config = {
  nodeEnv: envVars.NODE_ENV as string,
  isDevelopment: envVars.NODE_ENV === "development",
  isProduction: envVars.NODE_ENV === "production",
  isTest: envVars.NODE_ENV === "test",
  wavix: {
    apiKey: envVars.WAVIX_API_KEY as string | undefined,
    apiUrl: envVars.WAVIX_API_URL as string,
    hasApiKey: !!envVars.WAVIX_API_KEY // Documentation Mode if false, Full Mode if true
  },
  logging: {
    level: envVars.LOG_LEVEL as string
  },
  mcp: {
    serverName: envVars.MCP_SERVER_NAME as string,
    serverVersion: envVars.MCP_SERVER_VERSION as string
  }
}

export default config
