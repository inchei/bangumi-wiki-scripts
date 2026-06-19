FROM alpine:latest

RUN apk add --no-cache curl unzip python3 py3-pip
RUN pip3 install requests tqdm --break-system-packages

# Download DuckDB
RUN curl -fsSL https://github.com/duckdb/duckdb/releases/download/v1.2.0/duckdb_cli-linux-amd64.zip -o /tmp/duckdb.zip \
    && unzip /tmp/duckdb.zip -d /usr/local/bin/ \
    && chmod +x /usr/local/bin/duckdb

# Copy bgq binary (pre-built)
COPY bin/bgq /usr/local/bin/bgq

# Startup script
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 7860
ENV DUCKDB_PATH=/usr/local/bin/duckdb

CMD ["/entrypoint.sh"]
