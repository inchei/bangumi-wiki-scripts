// API client — all fetch calls to the Go backend

import { schema, schemaOptions } from './stores.js';

export async function loadSchema() {
  try {
    const r = await fetch('/api/schema/fields');
    const data = await r.json();
    schema.update(current => ({ ...current, ...data }));
  } catch (e) {
    console.error('loadSchema:', e);
  }
}

export async function loadSchemaOptions(type) {
  try {
    const url = type ? `/api/schema/options?type=${type}` : '/api/schema/options';
    const r = await fetch(url);
    const data = await r.json();
    schemaOptions.update(current => ({ ...current, ...data }));
  } catch (e) {
    console.error('loadSchemaOptions:', e);
  }
}

export async function runQuery(filters, columns, target, limit) {
  const body = JSON.stringify({ target, filters, columns, limit });
  const r = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(text || `HTTP ${r.status}`);
  }
  return r.json();
}


export function exportCSV(filters, columns, target, limit) {
  fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      target,
      filters,
      columns,
      format: 'csv',
      limit: Math.min(limit * 10, 10000),
    }),
  })
    .then((r) => r.blob())
    .then((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'bangumi_results.csv';
      a.click();
    });
}
