#!/bin/sh
set -e

DATA_DIR="${1:-./bangumi_archive}"

echo "=== Downloading Bangumi Archive ==="
mkdir -p "$DATA_DIR"

# Resolve to absolute path (handle relative paths before cd)
DATA_DIR=$(cd "$DATA_DIR" && pwd)

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT
cd "$TMP_DIR"

# Get download info from latest.json
# LATEST_JSON=$(curl -s https://ghfast.top/https://raw.githubusercontent.com/bangumi/Archive/master/aux/latest.json)
LATEST_JSON=$(curl -s https://raw.githubusercontent.com/bangumi/Archive/master/aux/latest.json)
ZIP_URL=$(echo "$LATEST_JSON" | grep -o '"browser_download_url": *"[^"]*"' | head -1 | cut -d'"' -f4)
EXPECTED_HASH=$(echo "$LATEST_JSON" | grep -o '"digest": *"[^"]*"' | head -1 | cut -d'"' -f4 | sed 's/sha256://')
CREATED_AT=$(echo "$LATEST_JSON" | grep -o '"created_at": *"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$ZIP_URL" ]; then
  echo "Failed to get download URL"
  exit 1
fi

# ZIP_URL="https://ghfast.top/$ZIP_URL"

echo "Downloading ${ZIP_URL}..."
if [ -t 1 ]; then
    curl -L --fail -o archive.zip "$ZIP_URL"
else
    curl -sL --fail -o archive.zip "$ZIP_URL"
fi

# Verify integrity
if [ -n "$EXPECTED_HASH" ]; then
  echo "Verifying integrity..."
  ACTUAL_HASH=$(sha256sum archive.zip | cut -d' ' -f1)
  if [ "$ACTUAL_HASH" != "$EXPECTED_HASH" ]; then
    echo "Integrity check failed!"
    echo "Expected: $EXPECTED_HASH"
    echo "Actual:   $ACTUAL_HASH"
    exit 1
  fi
  echo "Integrity check passed"
fi

echo "Extracting to ${DATA_DIR}..."
unzip -o archive.zip -d "$DATA_DIR"

# Save data version metadata
if [ -n "$CREATED_AT" ]; then
  echo "{\"created_at\":\"$CREATED_AT\"}" > "$DATA_DIR/data_version.json"
  echo "Data version: $CREATED_AT"
fi

echo "Done! Archive saved to ${DATA_DIR}"
