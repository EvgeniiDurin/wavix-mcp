.PHONY: all install build dev start test test-coverage type lint lint-fix format format-check clean sync-api generate ci help

# Variables
OPENAPI_URL=https://raw.githubusercontent.com/Wavix/wavix-openapi/main/docs/wavix-api.yaml

# Default target
all: install build

# Install dependencies
install:
	@echo "Installing dependencies..."
	pnpm install

# Build for production
build:
	@echo "Building..."
	pnpm build

# Run in development mode
dev:
	@echo "Running in development mode..."
	pnpm dev

# Run production build
start:
	@echo "Running production build..."
	pnpm start

# Run tests
test:
	@echo "Running tests..."
	pnpm test

# Run tests with coverage
test-coverage:
	@echo "Running tests with coverage..."
	pnpm test:coverage

# TypeScript type checking
type:
	@echo "Running type check..."
	pnpm type

# Lint code
lint:
	@echo "Running linter..."
	pnpm lint

# Lint and fix
lint-fix:
	@echo "Running linter with fix..."
	pnpm lint:fix

# Format code
format:
	@echo "Formatting code..."
	pnpm format

# Check formatting
format-check:
	@echo "Checking formatting..."
	pnpm format:check

# Sync OpenAPI spec from wavix-openapi repository
sync-api:
	@echo "Syncing OpenAPI spec..."
	./scripts/sync-openapi.sh

# Generate TypeScript types from OpenAPI
generate:
	@echo "Generating TypeScript types from OpenAPI..."
	pnpm generate

# Generate MCP tools from OpenAPI
generate-tools:
	@echo "Generating MCP tools from OpenAPI..."
	pnpm generate:tools

# Clean build artifacts
clean:
	@echo "Cleaning..."
	pnpm clean
	rm -rf node_modules

# Run all checks (CI simulation)
ci: install type lint format-check test build
	@echo "All CI checks passed!"

# Help
help:
	@echo "Wavix MCP Server - Makefile commands:"
	@echo ""
	@echo "  make              - Install and build"
	@echo "  make install      - Install dependencies"
	@echo "  make build        - Build for production (Gulp + SWC)"
	@echo "  make dev          - Run in development mode (nodemon)"
	@echo "  make start        - Run production build"
	@echo "  make test         - Run tests (Jest)"
	@echo "  make test-coverage- Run tests with coverage"
	@echo "  make type         - TypeScript type checking"
	@echo "  make lint         - Run ESLint"
	@echo "  make lint-fix     - Run ESLint with auto-fix"
	@echo "  make format       - Format code with Prettier"
	@echo "  make format-check - Check code formatting"
	@echo "  make sync-api     - Sync OpenAPI spec from wavix-openapi"
	@echo "  make generate     - Generate TypeScript types from OpenAPI"
	@echo "  make generate-tools - Generate MCP tools from OpenAPI"
	@echo "  make clean        - Clean build artifacts and node_modules"
	@echo "  make ci           - Run all CI checks"
	@echo ""
