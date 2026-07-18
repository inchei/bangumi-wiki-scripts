# 阶段 1：构建前端
FROM node:24-alpine AS frontend
WORKDIR /app/frontend
COPY bgq/frontend/package.json bgq/frontend/pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY bgq/frontend/ .
RUN pnpm build

# 阶段 2：编译 Go
FROM golang:1.26-alpine AS builder
WORKDIR /app
COPY bgq/go.mod bgq/go.sum ./
RUN go mod download
COPY bgq/ .
COPY --from=frontend /app/frontend/dist/ internal/server/dist/
RUN CGO_ENABLED=0 go build -o bin/bgq ./cmd/bgq/

# 阶段 3：运行（需要 glibc 运行 DuckDB CLI）
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends curl unzip ca-certificates && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://github.com/duckdb/duckdb/releases/download/v1.2.0/duckdb_cli-linux-amd64.zip -o /tmp/duckdb.zip \
    && unzip /tmp/duckdb.zip -d /usr/local/bin/ \
    && chmod +x /usr/local/bin/duckdb \
    && rm /tmp/duckdb.zip
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
COPY --from=builder /app/bin/bgq /usr/local/bin/bgq
COPY person_alias.py /
COPY bgq/download-archive.sh /download-archive.sh
COPY bgq/docker-entrypoint.sh /entrypoint.sh
COPY bgq/update-data.sh /update-data.sh
RUN chmod +x /download-archive.sh /entrypoint.sh /update-data.sh
ENV DUCKDB_PATH=/usr/local/bin/duckdb
ENV PATH="/root/.local/bin:${PATH}"
CMD ["/entrypoint.sh"]
