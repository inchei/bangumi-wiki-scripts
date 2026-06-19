#!/bin/sh
set -e

DATA_DIR="${DATA_DIR:-/data/bangumi_archive}"

# Download archive if not already present
if [ ! -f "${DATA_DIR}/subject.jsonlines" ]; then
  echo "=== Downloading Bangumi Archive ==="
  mkdir -p "${DATA_DIR}"
  cd /tmp

  # Get latest archive
  python3 -c "
import requests, zipfile, io, os
print('Fetching latest release...')
r = requests.get('https://api.github.com/repos/bangumi/Archive/releases/latest')
release = r.json()
zip_url = None
for asset in release['assets']:
    if asset['name'].endswith('.zip'):
        zip_url = asset['browser_download_url']
        break
if not zip_url:
    print('No zip asset found, using default')
    zip_url = f'https://github.com/bangumi/Archive/releases/download/{release[\"tag_name\"]}/archive-full.zip'
print(f'Downloading {zip_url}...')
r = requests.get(zip_url, stream=True)
r.raise_for_status()
total = int(r.headers.get('content-length', 0))
downloaded = 0
chunks = []
for chunk in r.iter_content(chunk_size=8192):
    chunks.append(chunk)
    downloaded += len(chunk)
    if total:
        print(f'\r  {downloaded//(1024*1024)}MB / {total//(1024*1024)}MB', end='')
print()
print('Extracting...')
z = zipfile.ZipFile(io.BytesIO(b''.join(chunks)))
for name in z.namelist():
    if name.endswith('.jsonlines'):
        z.extract(name, '${DATA_DIR}/..')
        print(f'  {name}')
print('Done!')
"

  # Move files if extracted to subdirectory
  if [ -d "${DATA_DIR}/../archive-full" ]; then
    mv "${DATA_DIR}/../archive-full"/*.jsonlines "${DATA_DIR}/" 2>/dev/null || true
  fi

  echo "Archive downloaded to ${DATA_DIR}"
fi

echo "=== Starting bgq server ==="
exec bgq serve --data-dir "${DATA_DIR}" --listen ":7860"
