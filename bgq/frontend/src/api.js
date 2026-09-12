// API client — all fetch calls to the Go backend

export async function runQuery(
  filters,
  columns,
  target,
  limit,
  sort,
  assocLimit,
) {
  const body = JSON.stringify({
    target,
    filters,
    columns,
    limit,
    sort,
    assoc_limit: assocLimit,
  });
  const r = await fetch("/api/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    let message;
    try {
      const err = JSON.parse(text);
      message = err.error || err.message;
    } catch {
      // non-JSON error response
    }
    throw new Error(message || text || `HTTP ${r.status}`);
  }
  return r.json();
}
