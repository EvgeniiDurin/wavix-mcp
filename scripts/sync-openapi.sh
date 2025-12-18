#!/bin/bash
set -e

# Sync OpenAPI spec from wavix-openapi repository
# Usage: ./scripts/sync-openapi.sh

OPENAPI_URL="https://raw.githubusercontent.com/Wavix/wavix-openapi/main/docs/wavix-api.yaml"
SPEC_FILE="api/wavix-api.yaml"
TYPES_FILE="src/api/types.ts"

echo "=== Wavix MCP Server - OpenAPI Sync ==="
echo ""

# Create directories if not exist
mkdir -p api src/api

# Download OpenAPI spec
echo "Downloading OpenAPI spec from wavix-openapi..."
curl -sSL -o "$SPEC_FILE" "$OPENAPI_URL"

if [ ! -f "$SPEC_FILE" ]; then
    echo "Error: Failed to download OpenAPI spec"
    exit 1
fi

# Show spec info
echo ""
echo "OpenAPI spec info:"
grep -E "^  title:|^  version:" "$SPEC_FILE" | head -2
echo ""

# Generate TypeScript types using openapi-typescript
echo "Generating TypeScript types..."
npx openapi-typescript "$SPEC_FILE" -o "$TYPES_FILE"

# Show generated files
echo ""
echo "Generated files:"
ls -la "$TYPES_FILE"

# Count operations
PATHS=$(grep -c "^  /" "$SPEC_FILE" 2>/dev/null || echo "0")
echo ""
echo "API paths: $PATHS"

echo ""
echo "=== Sync complete ==="
echo ""
echo "Next steps:"
echo "  pnpm generate:tools  # Generate MCP tools"
echo "  pnpm type            # Type check"
