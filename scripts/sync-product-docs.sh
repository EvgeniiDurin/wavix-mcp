#!/bin/bash
set -e

# Sync Product documentation from new-wavix-site/mcp-export
# Usage: ./scripts/sync-product-docs.sh [local-path]
#
# If local-path is provided, copies from local directory (dev mode)
# Otherwise clones from GitLab repository (CI mode)

PRODUCT_REPO="${PRODUCT_REPO:-git@ci.unitedline.net:wavix/new-wavix-site.git}"
TEMP_DIR="/tmp/wavix-site"
OUTPUT_DIR="src/resources/product"
LOCAL_PATH="${1:-}"

# Safety check: ensure critical variables are set
if [ -z "$TEMP_DIR" ] || [ -z "$OUTPUT_DIR" ]; then
  echo "Error: TEMP_DIR or OUTPUT_DIR is empty. Aborting for safety."
  exit 1
fi

echo "=== Wavix MCP Server - Product Docs Sync ==="
echo ""

# Determine source
if [ -n "$LOCAL_PATH" ]; then
  SOURCE_DIR="$LOCAL_PATH/mcp-export"
  echo "Mode: Local"
  echo "Source: $SOURCE_DIR"
else
  SOURCE_DIR="$TEMP_DIR/mcp-export"
  echo "Mode: Remote"
  echo "Source: $PRODUCT_REPO"
fi

echo "Output: $OUTPUT_DIR"
echo ""

# Get source files
if [ -n "$LOCAL_PATH" ]; then
  # Local mode - verify path exists
  if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Local mcp-export directory not found at $SOURCE_DIR"
    echo ""
    echo "Run 'pnpm export:mcp' in new-wavix-site first, or provide correct path."
    exit 1
  fi
else
  # Remote mode - clone or pull
  if [ -d "$TEMP_DIR/.git" ]; then
    echo "Updating existing clone..."
    cd "$TEMP_DIR" && git fetch origin && git reset --hard origin/main
    cd - > /dev/null
  else
    echo "Cloning repository..."
    rm -rf "$TEMP_DIR"
    git clone --depth 1 --filter=blob:none --sparse "$PRODUCT_REPO" "$TEMP_DIR"
    cd "$TEMP_DIR"
    git sparse-checkout set mcp-export
    cd - > /dev/null
  fi

  if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: mcp-export directory not found in repository"
    echo ""
    echo "The new-wavix-site repository needs to have mcp-export/ committed."
    echo "Run 'pnpm export:mcp' in new-wavix-site and commit the output."
    exit 1
  fi
fi

# Clean and create output directory
echo "Copying documentation files..."
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Copy all files from mcp-export
cp -r "$SOURCE_DIR"/* "$OUTPUT_DIR/"

# Verify _source.json exists
if [ ! -f "$OUTPUT_DIR/_source.json" ]; then
  echo "Warning: _source.json not found, generating basic one..."

  cat > "$OUTPUT_DIR/_source.json" << EOF
{
  "source": "wavix.com",
  "type": "exported",
  "syncedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "uriPrefix": "wavix://product",
  "documents": []
}
EOF
fi

# Update syncedAt in _source.json
if command -v jq &> /dev/null; then
  # Use jq if available
  jq --arg syncedAt "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" '.syncedAt = $syncedAt' "$OUTPUT_DIR/_source.json" > "$OUTPUT_DIR/_source.tmp.json"
  mv "$OUTPUT_DIR/_source.tmp.json" "$OUTPUT_DIR/_source.json"
fi

# Count files
faq_count=$(find "$OUTPUT_DIR/faq" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
pricing_count=$(find "$OUTPUT_DIR/pricing" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
total_count=$((faq_count + pricing_count))

echo ""
echo "=== Sync complete ==="
echo ""
echo "Documents synced: $total_count"
echo "  - FAQ: $faq_count"
echo "  - Pricing: $pricing_count"
echo ""
echo "Output directory: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "  pnpm build    # Rebuild server"
echo ""
