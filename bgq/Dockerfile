# 阶段 1：构建前端
FROM node:24-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY frontend/ .
RUN pnpm build

# 阶段 2：编译 Go
FROM golang:1.26-alpine AS builder
WORKDIR /app
# ENV GOPROXY=https://goproxy.cn,direct
COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY --from=frontend /app/frontend/dist/ internal/server/dist/
RUN CGO_ENABLED=0 go build -o bin/bgq ./cmd/bgq/

# 阶段 3：运行（需要 glibc 运行 DuckDB CLI）
FROM debian:bookworm-slim
# RUN sed -i 's|deb.debian.org|mirrors.aliyun.com|g' /etc/apt/sources.list.d/debian.sources 2>/dev/null || \
#     sed -i 's|deb.debian.org|mirrors.aliyun.com|g' /etc/apt/sources.list
RUN apt-get update && apt-get install -y --no-install-recommends curl unzip ca-certificates && rm -rf /var/lib/apt/lists/*
# RUN curl -fsSL https://ghfast.top/https://github.com/duckdb/duckdb/releases/download/v1.2.0/duckdb_cli-linux-amd64.zip -o /tmp/duckdb.zip
RUN curl -fsSL https://github.com/duckdb/duckdb/releases/download/v1.2.0/duckdb_cli-linux-amd64.zip -o /tmp/duckdb.zip \
    && unzip /tmp/duckdb.zip -d /usr/local/bin/ \
    && chmod +x /usr/local/bin/duckdb \
    && rm /tmp/duckdb.zip
COPY --from=builder /app/bin/bgq /usr/local/bin/bgq
COPY download-archive.sh /download-archive.sh
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /download-archive.sh /entrypoint.sh
ENV DUCKDB_PATH=/usr/local/bin/duckdb
CMD ["/entrypoint.sh"]
