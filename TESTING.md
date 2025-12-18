# Testing Guide for Wavix MCP Server

This document describes the test suite for the Wavix MCP Server project.

## Test Framework

- **Framework**: Jest 29
- **Language**: TypeScript
- **Module System**: ESM (ES Modules)
- **Transformer**: SWC for fast TypeScript compilation

## Running Tests

### Basic Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run specific test file
pnpm test src/resources/loader.test.ts

# Run tests matching pattern
pnpm test --testNamePattern="should load resources"
```

## Test Structure

The test suite is organized to mirror the source code structure:

```
src/
├── api/
│   ├── client.ts
│   └── client.test.ts              # API client tests
├── config/
│   ├── index.ts
│   └── index.test.ts               # Configuration tests
├── helpers/
│   ├── logger.ts
│   ├── logger.test.ts              # Logger tests
│   ├── masking.ts
│   └── masking.test.ts             # Data masking tests
├── resources/
│   ├── loader.ts
│   ├── loader.test.ts              # Resources loader tests
│   ├── index.ts
│   └── index.test.ts               # Resources registration tests
├── tools/
│   ├── handlers/
│   │   ├── index.ts
│   │   └── index.test.ts           # Tool handlers tests
│   ├── index.ts
│   └── index.test.ts               # Tools registration tests
├── server.ts
└── server.test.ts                  # Server initialization tests
```

## Test Coverage

### Current Test Files

1. **Resources Loader** (`src/resources/loader.test.ts`)
   - Tests for loading resources from api/ and product/ directories
   - Tests for getResource(), readResourceContent()
   - Tests for searchResources() and getResourcesByCategory()
   - Tests for cache management

2. **Tool Handlers** (`src/tools/handlers/index.test.ts`)
   - Tests for GET, POST, PUT, PATCH, DELETE requests
   - Tests for path parameter replacement
   - Tests for query string building
   - Tests for error handling (WavixApiError, network errors)
   - Tests for edge cases

3. **API Client** (`src/api/client.test.ts`)
   - Tests for HTTP request methods
   - Tests for retry logic on 429 and 500 errors
   - Tests for timeout handling
   - Tests for WavixApiError class
   - Tests for convenience methods (get, post, put, delete)

4. **Masking Utilities** (`src/helpers/masking.test.ts`)
   - Tests for maskApiKey(), maskPhone(), maskEmail()
   - Tests for maskSensitiveData() with various field types
   - Tests for case-insensitive field matching

5. **Logger** (`src/helpers/logger.test.ts`)
   - Tests for different log levels (debug, info, warn, error)
   - Tests for child logger with default context
   - Tests for production vs development formatting
   - Tests for JSON output in production mode

6. **Configuration** (`src/config/index.test.ts`)
   - Tests for environment-specific configuration
   - Tests for Wavix API configuration
   - Tests for logging configuration
   - Tests for Full Mode vs Documentation Mode
   - Tests for validation

7. **Server** (`src/server.test.ts`)
   - Tests for server initialization
   - Tests for start() and stop() methods
   - Tests for tools registration

8. **Tools Registry** (`src/tools/index.test.ts`)
   - Tests for tool registration
   - Tests for Full Mode vs Documentation Mode filtering
   - Tests for tool execution
   - Tests for error handling when API key not available

9. **Resources Registration** (`src/resources/index.test.ts`)
   - Tests for resources registration
   - Tests for list and read handlers
   - Tests for error handling

## Key Testing Patterns

### Mocking

Tests use Jest mocks extensively to isolate units:

```typescript
// Mock fs for file system operations
jest.mock("fs")
const mockedFs = fs as jest.Mocked<typeof fs>

// Mock logger to suppress output
jest.mock("../helpers/logger.js", () => ({
  logger: {
    child: () => ({
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    })
  }
}))

// Mock config
jest.mock("../config/index.js", () => ({
  config: {
    wavix: {
      apiKey: "test-key",
      hasApiKey: true
    }
  }
}))
```

### ESM Module Testing

Since the project uses ES modules, tests must:

1. Use dynamic imports instead of `require()`:
   ```typescript
   const { registerTools } = await import("./tools/index.js")
   ```

2. Reset modules between tests when needed:
   ```typescript
   beforeEach(() => {
     jest.resetModules()
   })
   ```

### Testing Async Code

Most tests involve async operations:

```typescript
it("should make successful request", async () => {
  const mockData = { id: 1 }
  mockClient.request.mockResolvedValue(mockData)

  const result = await client.request("GET", "/v2/profile")

  expect(result).toEqual(mockData)
})
```

### Error Testing

Tests verify proper error handling:

```typescript
it("should handle API errors", async () => {
  const apiError = new WavixApiError("Invalid", 400)
  mockClient.request.mockRejectedValue(apiError)

  await expect(handler()).rejects.toThrow(WavixApiError)
})
```

## Coverage Goals

The jest.config.js sets coverage thresholds at 80% for:
- Statements
- Branches
- Functions
- Lines

Current coverage:
- **Statements**: ~60%
- **Branches**: ~78%
- **Functions**: ~73%
- **Lines**: ~60%

## Test Best Practices

1. **Isolation**: Each test should be independent
2. **Clear Names**: Use descriptive test names that explain the expected behavior
3. **Arrange-Act-Assert**: Structure tests clearly:
   ```typescript
   it("should do something", async () => {
     // Arrange
     const input = { data: "test" }

     // Act
     const result = await processData(input)

     // Assert
     expect(result).toEqual(expected)
   })
   ```

4. **Mock External Dependencies**: Always mock:
   - File system operations
   - Network requests
   - Logger calls
   - Configuration

5. **Test Both Success and Failure**: Cover happy paths and error cases

6. **Clean Up**: Use beforeEach/afterEach to reset state:
   ```typescript
   beforeEach(() => {
     jest.clearAllMocks()
     clearResourcesCache()
   })
   ```

## Common Issues

### Issue: `require is not defined`
**Solution**: Use dynamic imports instead:
```typescript
// Bad
const { foo } = require("./module.js")

// Good
const { foo } = await import("./module.js")
```

### Issue: Mock not working
**Solution**: Ensure mocks are defined before imports:
```typescript
// Mock BEFORE importing the module
jest.mock("./dependency.js")

// Then import
const { MyClass } = await import("./module.js")
```

### Issue: Tests timeout
**Solution**: Increase timeout or check for unresolved promises:
```typescript
it("slow test", async () => {
  // ...
}, 10000) // 10 second timeout
```

## Future Improvements

1. **Increase Coverage**: Add tests for edge cases and error paths
2. **Integration Tests**: Add tests that verify multiple components working together
3. **E2E Tests**: Test the full MCP server with a real client
4. **Performance Tests**: Measure and track performance metrics
5. **Snapshot Tests**: Use Jest snapshots for complex output validation

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing ESM with Jest](https://jestjs.io/docs/ecmascript-modules)
- [Jest Mock Functions](https://jestjs.io/docs/mock-functions)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
