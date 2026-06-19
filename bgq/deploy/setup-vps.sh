#!/bin/bash
# BGQ 一键部署脚本（在VPS上运行）
set -e

INSTALL_DIR="${INSTALL_DIR:-$HOME/bgq-server}"
DATA_DIR="${DATA_DIR:-$HOME/bangumi_archive}"
PORT="${PORT:-8080}"
GITHUB_REPO="https://github.com/inchei/bangumi-wiki-scripts.git"

echo "========================================"
echo "  BGQ 服务器部署"
echo "  安装目录: ${INSTALL_DIR}"
echo "  数据目录: ${DATA_DIR}"
echo "  端口:     ${PORT}"
echo "========================================"

# 1. 安装基础依赖
echo ""
echo "[1/5] 安装依赖..."
sudo apt update -qq
sudo apt install -y -qq curl unzip python3 python3-pip git 2>/dev/null || \
  sudo yum install -y curl unzip python3 python3-pip git 2>/dev/null
pip3 install requests tqdm --quiet

# 2. 下载 DuckDB
echo "[2/5] 下载 DuckDB..."
mkdir -p "${INSTALL_DIR}/bin"
curl -fsSL "https://github.com/duckdb/duckdb/releases/download/v1.2.0/duckdb_cli-linux-amd64.zip" \
  -o /tmp/duckdb.zip
unzip -o /tmp/duckdb.zip -d "${INSTALL_DIR}/bin/"
chmod +x "${INSTALL_DIR}/bin/duckdb"
rm /tmp/duckdb.zip

# 3. 下载 bgq 二进制（或从源码编译）
echo "[3/5] 安装 bgq..."
if [ -f /tmp/bgq ]; then
  # Pre-built binary uploaded
  cp /tmp/bgq "${INSTALL_DIR}/bin/bgq"
  chmod +x "${INSTALL_DIR}/bin/bgq"
elif command -v go &>/dev/null; then
  # Build from source
  git clone --depth 1 "${GITHUB_REPO}" /tmp/bangumi-src
  cd /tmp/bangumi-src/bgq
  go build -o "${INSTALL_DIR}/bin/bgq" ./cmd/bgq/
  rm -rf /tmp/bangumi-src
else
  # Download pre-built release
  curl -fsSL "https://github.com/inchei/bangumi-wiki-scripts/releases/latest/download/bgq-linux-amd64" \
    -o "${INSTALL_DIR}/bin/bgq"
  chmod +x "${INSTALL_DIR}/bin/bgq"
fi

# 4. 下载数据
echo "[4/5] 下载数据..."
mkdir -p "${DATA_DIR}"
python3 -c "
import requests, zipfile, io, os
print('获取最新 Archive...')
r = requests.get('https://api.github.com/repos/bangumi/Archive/releases/latest')
release = r.json()
zip_url = None
for asset in release['assets']:
    if 'jsonlines' in asset['name'] and asset['name'].endswith('.zip'):
        zip_url = asset['browser_download_url']
        break
print(f'下载 {zip_url}')
r = requests.get(zip_url, stream=True)
size = int(r.headers.get('content-length', 0))
down = 0
buf = io.BytesIO()
for chunk in r.iter_content(8192):
    buf.write(chunk)
    down += len(chunk)
    if size: print(f'\r  {down//(1024*1024)}MB / {size//(1024*1024)}MB', end='')
print('\n解压...')
z = zipfile.ZipFile(buf)
for name in z.namelist():
    if name.endswith('.jsonlines'):
        z.extract(name, '${DATA_DIR}')
        print(f'  {name}')
print('完成!')
"
ls -lh "${DATA_DIR}/"*.jsonlines

# 5. 创建 systemd 服务（开机自启）
echo "[5/5] 设置后台服务..."
sudo tee /etc/systemd/system/bgq.service > /dev/null << SERVICE
[Unit]
Description=Bangumi Query Server
After=network.target

[Service]
Type=simple
ExecStart=${INSTALL_DIR}/bin/bgq serve --data-dir ${DATA_DIR} --listen :${PORT}
Environment=DUCKDB_PATH=${INSTALL_DIR}/bin/duckdb
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

sudo systemctl daemon-reload
sudo systemctl enable bgq
sudo systemctl start bgq

echo ""
echo "========================================"
echo "  部署完成！"
echo "  地址: http://$(curl -s ifconfig.me):${PORT}"
echo ""
echo "  管理命令:"
echo "    sudo systemctl status bgq   查看状态"
echo "    sudo systemctl restart bgq  重启"
echo "    sudo journalctl -u bgq -f  查看日志"
echo "========================================"
