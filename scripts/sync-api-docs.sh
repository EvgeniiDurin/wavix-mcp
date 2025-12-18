#!/bin/bash
set -e

# Sync API documentation from Wavix/docs (Mintlify)
# Usage: ./scripts/sync-api-docs.sh

DOCS_REPO="${DOCS_REPO:-Wavix/docs}"
TEMP_DIR="/tmp/wavix-docs"
OUTPUT_DIR="src/resources/api"

# Safety check: ensure critical variables are set
if [ -z "$TEMP_DIR" ] || [ -z "$OUTPUT_DIR" ]; then
  echo "Error: TEMP_DIR or OUTPUT_DIR is empty. Aborting for safety."
  exit 1
fi

echo "=== Wavix MCP Server - API Docs Sync ==="
echo ""
echo "Source: $DOCS_REPO (GitHub)"
echo "Output: $OUTPUT_DIR"
echo ""

# Clone or pull using gh CLI (uses authenticated user)
if [ -d "$TEMP_DIR/.git" ]; then
  echo "Updating existing clone..."
  cd "$TEMP_DIR" && git fetch origin && git reset --hard origin/main
  cd - > /dev/null
else
  echo "Cloning repository via gh CLI..."
  rm -rf "$TEMP_DIR"
  gh repo clone "$DOCS_REPO" "$TEMP_DIR" -- --depth 1
fi

# Check if source exists
if [ ! -d "$TEMP_DIR" ]; then
  echo "Error: Failed to clone repository"
  exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Copy MDX files, preserving structure
echo ""
echo "Copying documentation files..."

# Directories to sync
SYNC_DIRS=("api-reference" "getting-started" "messaging" "numbers" "sip-trunking" "voice")

for dir in "${SYNC_DIRS[@]}"; do
  if [ -d "$TEMP_DIR/$dir" ]; then
    echo "  - $dir/"
    mkdir -p "$OUTPUT_DIR/$dir"
    # Copy .mdx files and rename to .md
    find "$TEMP_DIR/$dir" -name "*.mdx" -type f | while read -r file; do
      rel_path="${file#$TEMP_DIR/}"
      dest_path="$OUTPUT_DIR/${rel_path%.mdx}.md"
      mkdir -p "$(dirname "$dest_path")"
      cp "$file" "$dest_path"
    done
  fi
done

# Copy root index if exists
if [ -f "$TEMP_DIR/index.mdx" ]; then
  cp "$TEMP_DIR/index.mdx" "$OUTPUT_DIR/index.md"
fi

# Generate _source.json
echo ""
echo "Generating _source.json..."

cat > "$OUTPUT_DIR/_source.json" << EOF
{
  "source": "docs.wavix.com",
  "type": "mintlify",
  "repo": "$DOCS_REPO",
  "syncedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "uriPrefix": "wavix://api",
  "documents": [
EOF

# Generate document entries
first=true
find "$OUTPUT_DIR" -name "*.md" -type f | sort | while read -r file; do
  rel_path="${file#$OUTPUT_DIR/}"

  # Skip _source.json related
  [ "$rel_path" = "_source.json" ] && continue

  # Extract title from frontmatter or filename
  title=$(grep -m1 "^title:" "$file" 2>/dev/null | sed 's/title: *//' | tr -d '"' || basename "$rel_path" .md)
  [ -z "$title" ] && title=$(basename "$rel_path" .md)

  # Generate ID and URI
  id=$(echo "$rel_path" | sed 's/\.md$//' | tr '/' '-')
  uri="wavix://api/${rel_path%.md}"

  if [ "$first" = true ]; then
    first=false
  else
    echo ","
  fi

  printf '    {"id": "%s", "uri": "%s", "file": "%s", "title": "%s"}' "$id" "$uri" "$rel_path" "$title"
done >> "$OUTPUT_DIR/_source.json"

cat >> "$OUTPUT_DIR/_source.json" << EOF

  ]
}
EOF

# Count files
doc_count=$(find "$OUTPUT_DIR" -name "*.md" -type f | wc -l | tr -d ' ')

echo ""
echo "=== Sync complete ==="
echo ""
echo "Documents synced: $doc_count"
echo "Output directory: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "  pnpm build    # Rebuild server"
