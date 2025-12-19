/**
 * Shared Test Utilities
 *
 * Common utilities for testing to reduce code duplication.
 */

import { jest, beforeEach, afterEach } from "@jest/globals"

/**
 * Original console methods storage
 */
interface OriginalConsole {
  debug: typeof console.debug
  info: typeof console.info
  warn: typeof console.warn
  error: typeof console.error
}

/**
 * Mocked console methods
 */
export interface MockedConsole {
  debug: jest.MockedFunction<typeof console.debug>
  info: jest.MockedFunction<typeof console.info>
  warn: jest.MockedFunction<typeof console.warn>
  error: jest.MockedFunction<typeof console.error>
}

/**
 * Setup console mocking for tests.
 * Automatically suppresses console output and restores after each test.
 *
 * @returns Object with mocked console methods for assertions
 *
 * @example
 * ```typescript
 * describe("MyTest", () => {
 *   const mocks = setupConsoleMocks()
 *
 *   it("should log info", () => {
 *     logger.info("test")
 *     expect(mocks.info).toHaveBeenCalledWith(expect.stringContaining("test"))
 *   })
 * })
 * ```
 */
export function setupConsoleMocks(): MockedConsole {
  const original: OriginalConsole = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error
  }

  const mocks: MockedConsole = {
    debug: jest.fn() as jest.MockedFunction<typeof console.debug>,
    info: jest.fn() as jest.MockedFunction<typeof console.info>,
    warn: jest.fn() as jest.MockedFunction<typeof console.warn>,
    error: jest.fn() as jest.MockedFunction<typeof console.error>
  }

  beforeEach(() => {
    console.debug = mocks.debug
    console.info = mocks.info
    console.warn = mocks.warn
    console.error = mocks.error
    jest.clearAllMocks()
  })

  afterEach(() => {
    console.debug = original.debug
    console.info = original.info
    console.warn = original.warn
    console.error = original.error
  })

  return mocks
}

/**
 * Mocked stderr interface
 */
export interface MockedStderr {
  write: jest.MockedFunction<typeof process.stderr.write>
  calls: () => Array<string>
}

/**
 * Setup stderr mocking for logger tests.
 * Logger writes to stderr, not console.
 */
export function setupStderrMocks(): MockedStderr {
  const originalWrite = process.stderr.write.bind(process.stderr)
  const mockWrite = jest.fn() as jest.MockedFunction<typeof process.stderr.write>

  beforeEach(() => {
    mockWrite.mockClear()
    process.stderr.write = mockWrite
  })

  afterEach(() => {
    process.stderr.write = originalWrite
  })

  return {
    write: mockWrite,
    calls: () =>
      mockWrite.mock.calls.map(call => {
        const arg = call[0]
        return typeof arg === "string" ? arg : arg.toString()
      })
  }
}

/**
 * Create a mock fetch function with common response patterns.
 */
export function createMockFetch() {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>

  const helpers = {
    /**
     * Mock a successful JSON response
     */
    mockSuccess: (data: unknown) => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(data),
        headers: new Headers()
      } as Response)
    },

    /**
     * Mock an error response
     */
    mockError: (status: number, body: Record<string, unknown> = {}) => {
      mockFetch.mockResolvedValue({
        ok: false,
        status,
        json: () => Promise.resolve(body),
        headers: new Headers()
      } as Response)
    },

    /**
     * Mock a network error
     */
    mockNetworkError: (message = "Network error") => {
      mockFetch.mockRejectedValue(new Error(message))
    },

    /**
     * Mock a timeout that respects AbortSignal
     */
    mockTimeout: () => {
      mockFetch.mockImplementation((_url, options) => {
        return new Promise((_resolve, reject) => {
          const signal = options?.signal as AbortSignal | undefined
          if (signal) {
            signal.addEventListener("abort", () => {
              const error = new Error("The operation was aborted")
              error.name = "AbortError"
              reject(error)
            })
          }
          // Never resolves naturally, waits for abort
        })
      })
    },

    /**
     * Mock rate limit with retry
     */
    mockRateLimitThenSuccess: (data: unknown) => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          json: () => Promise.resolve({ message: "Rate limited" }),
          headers: new Headers({ "Retry-After": "0" })
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(data),
          headers: new Headers()
        } as Response)
    }
  }

  return { mockFetch, ...helpers }
}

/**
 * Handler function type for MCP request handlers
 */
type RequestHandler = (request: { params: Record<string, unknown> }) => Promise<unknown>

/**
 * Mock server interface
 */
export interface MockServer {
  setRequestHandler: (schema: unknown, handler: RequestHandler) => void
  getHandler: (index: number) => RequestHandler | undefined
  reset: () => void
}

/**
 * Create a mock MCP server that captures request handlers.
 */
export function createMockServer(): MockServer {
  let handlerIndex = 0
  const handlers = new Map<string, RequestHandler>()

  // Store reference to avoid circular dependency in reset()
  const setRequestHandlerFn = (schema: unknown, handler: RequestHandler): void => {
    void schema
    handlers.set(`handler_${handlerIndex}`, handler)
    handlerIndex++
  }

  const mockServer: MockServer = {
    setRequestHandler: setRequestHandlerFn,

    getHandler: (index: number) => handlers.get(`handler_${index}`),

    reset: () => {
      handlerIndex = 0
      handlers.clear()
    }
  }

  return mockServer
}

/**
 * Wait for a condition to be true, with timeout.
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return
    }
    await new Promise(resolve => setTimeout(resolve, interval))
  }

  throw new Error(`Timeout waiting for condition after ${timeout}ms`)
}

/**
 * Create multiple concurrent promises and wait for all.
 */
export async function runConcurrently<T>(count: number, factory: (index: number) => Promise<T>): Promise<Array<T>> {
  const promises = Array.from({ length: count }, (_, i) => factory(i))
  return Promise.all(promises)
}
