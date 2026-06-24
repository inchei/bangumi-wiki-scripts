// API client — all fetch calls to the Go backend

export async function runQuery(filters, columns, target, limit) {
  const body = JSON.stringify({ target, filters, columns, limit });
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

export function exportCSV(filters, columns, target, limit) {
  fetch("/api/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      target,
      filters,
      columns,
      format: "csv",
      limit: Math.min(limit * 10, 10000),
    }),
  })
    .then((r) => r.blob())
    .then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "bangumi_results.csv";
      a.click();
    });
}
