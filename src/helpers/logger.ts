/**
 * Logger - Console with ELK-compatible JSON format
 *
 * TODO: Enhance by HelpersAgent
 */

import dayjs from "dayjs"
import { config } from "../config/index.js"

interface LogContext {
  [key: string]: unknown
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
    return JSON.stringify(entry)
  }

  const contextStr = context ? ` ${JSON.stringify(context)}` : ""
  return `[${entry.timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
}

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (["debug"].includes(config.logging.level)) {
      console.debug(formatLogEntry("debug", message, context))
    }
  },

  info: (message: string, context?: LogContext) => {
    if (["debug", "info"].includes(config.logging.level)) {
      console.info(formatLogEntry("info", message, context))
    }
  },

  warn: (message: string, context?: LogContext) => {
    if (["debug", "info", "warn"].includes(config.logging.level)) {
      console.warn(formatLogEntry("warn", message, context))
    }
  },

  error: (message: string, context?: LogContext) => {
    console.error(formatLogEntry("error", message, context))
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
