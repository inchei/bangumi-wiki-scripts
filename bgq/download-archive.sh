#!/bin/sh
set -e

DATA_DIR="${1:-./bangumi_archive}"

echo "=== Downloading Bangumi Archive ==="
mkdir -p "$DATA_DIR"
cd /tmp

# Get download info from latest.json
LATEST_JSON=$(curl -s https://raw.githubusercontent.com/bangumi/Archive/master/aux/latest.json)
ZIP_URL=$(echo "$LATEST_JSON" | grep -o '"browser_download_url": *"[^"]*"' | head -1 | cut -d'"' -f4)
EXPECTED_HASH=$(echo "$LATEST_JSON" | grep -o '"digest": *"[^"]*"' | head -1 | cut -d'"' -f4 | sed 's/sha256://')

if [ -z "$ZIP_URL" ]; then
  echo "Failed to get download URL"
  exit 1
fi

echo "Downloading ${ZIP_URL}..."
curl -L -o archive.zip "$ZIP_URL"

# Verify integrity
if [ -n "$EXPECTED_HASH" ]; then
  echo "Verifying integrity..."
  ACTUAL_HASH=$(sha256sum archive.zip | cut -d' ' -f1)
  if [ "$ACTUAL_HASH" != "$EXPECTED_HASH" ]; then
    echo "Integrity check failed!"
    echo "Expected: $EXPECTED_HASH"
    echo "Actual:   $ACTUAL_HASH"
    rm -f archive.zip
    exit 1
  fi
  echo "Integrity check passed"
fi

echo "Extracting to ${DATA_DIR}..."
unzip -o archive.zip -d "$DATA_DIR"
rm -f archive.zip

echo "Done! Archive saved to ${DATA_DIR}"
