/**
 * Global Type Declarations
 */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test"
    WAVIX_API_KEY: string
    WAVIX_API_URL?: string
    LOG_LEVEL?: "debug" | "info" | "warn" | "error"
    MCP_SERVER_NAME?: string
    MCP_SERVER_VERSION?: string
  }
}
