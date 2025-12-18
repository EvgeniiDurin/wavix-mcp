/**
 * Logger - Console with ELK-compatible JSON format
 */

import dayjs from "dayjs"
import { config } from "../config/index.js"

interface LogContext {
  [key: string]: unknown
}

/**
 * Safe JSON stringify that handles circular references
 */
function safeStringify(obj: unknown): string {
  const seen = new WeakSet<object>()

  return JSON.stringify(obj, (_, value: unknown) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]"
      }
      seen.add(value)
    }
    return value
  })
}

function formatLogEntry(level: string, message: string, context?: LogContext): string {
  const entry = {
    timestamp: dayjs().toISOString(),
    level,
    service: "wavix-mcp-server",
    message,
    ...context
  }

  if (config.isProduction) {
    return safeStringify(entry)
  }

  const contextStr = context ? ` ${safeStringify(context)}` : ""
  return `[${entry.timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
}

/**
 * Write log to stderr (MCP uses stdout for JSON-RPC protocol)
 */
function writeToStderr(entry: string): void {
  process.stderr.write(entry + "\n")
}

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (["debug"].includes(config.logging.level)) {
      writeToStderr(formatLogEntry("debug", message, context))
    }
  },

  info: (message: string, context?: LogContext) => {
    if (["debug", "info"].includes(config.logging.level)) {
      writeToStderr(formatLogEntry("info", message, context))
    }
  },

  warn: (message: string, context?: LogContext) => {
    if (["debug", "info", "warn"].includes(config.logging.level)) {
      writeToStderr(formatLogEntry("warn", message, context))
    }
  },

  error: (message: string, context?: LogContext) => {
    writeToStderr(formatLogEntry("error", message, context))
  },

  child(defaultContext: LogContext) {
    return {
      debug: (msg: string, ctx?: LogContext) => logger.debug(msg, { ...defaultContext, ...ctx }),
      info: (msg: string, ctx?: LogContext) => logger.info(msg, { ...defaultContext, ...ctx }),
      warn: (msg: string, ctx?: LogContext) => logger.warn(msg, { ...defaultContext, ...ctx }),
      error: (msg: string, ctx?: LogContext) => logger.error(msg, { ...defaultContext, ...ctx })
    }
  }
}

export default logger
