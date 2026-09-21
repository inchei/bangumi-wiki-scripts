import {
    state,
    type WikiData,
    type HistoryEntry,
    type WorkItem,
    type SourceInfo,
    getEntityApiConfig,
} from './core';
import {
    showLoadingOverlay,
    hideLoadingOverlay,
} from './ui';

let fetchLock = false;

class ApiError extends Error {
    constructor(message: string) {
        super(message);
    }
}

async function apiJSON<T>(url: string, options?: RequestInit): Promise<T> {
    const resp = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        ...options,
    });
    const body = await resp.json().catch(() => ({}));
    if (!resp.ok) {
        throw new ApiError((body as { error?: string }).error || `HTTP ${resp.status}`);
    }
    return body as T;
}

export interface MeInfo {
    id: number;
    name: string;
    hasCookie: boolean;
    lockExtendMs: number;
}

export function fetchMe(): Promise<MeInfo> {
    return apiJSON<MeInfo>('/api/me');
}

export function saveCredentials(cookie: string): Promise<{ status: string; formhash: string }> {
    return apiJSON('/api/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie }),
    });
}

interface SourcesResponse {
    sources: SourceInfo[];
    errorCount: number;
}

export function fetchSources(): Promise<SourcesResponse> {
    return apiJSON<SourcesResponse>('/api/sources');
}

interface NextResponse {
    done: boolean;
    item?: WorkItem;
    total: number;
    remaining?: number;
    lockExtendMs?: number;
}

export function fetchNextItem(scope: 'error' | 'source', sourceId?: number, after?: number): Promise<NextResponse> {
    const q = new URLSearchParams();
    if (scope === 'error') {
        q.set('scope', 'error');
    } else if (sourceId !== undefined) {
        q.set('source_id', String(sourceId));
    }
    if (after) {
        q.set('after', String(after));
    }
    return apiJSON<NextResponse>(`/api/work/next?${q.toString()}`);
}

export function confirmItem(itemId: number): Promise<{ status: string }> {
    return apiJSON(`/api/items/${itemId}/confirm`, { method: 'POST' });
}

export function markItemError(itemId: number): Promise<{ status: string }> {
    return apiJSON(`/api/items/${itemId}/error`, { method: 'POST' });
}

export function extendLock(itemId: number): Promise<{ status: string }> {
    return apiJSON(`/api/items/${itemId}/lock/extend`, { method: 'POST' });
}

export function releaseLock(itemId: number): Promise<{ status: string }> {
    return apiJSON(`/api/items/${itemId}/release`, { method: 'POST' });
}

async function fetchWikiData(entityType: string, id: string): Promise<{ wikiData: WikiData; historyData: HistoryEntry[] }> {
    const { wikiPath, historyPath } = getEntityApiConfig(entityType as never, id);
    const [wikiResp, historyResp] = await Promise.all([
        fetch(`/api/proxy/wiki/${wikiPath.replace('/p1/wiki/', '')}`, { headers: { 'Accept': 'application/json' } }),
        fetch(`/api/proxy/wiki/${historyPath.replace('/p1/wiki/', '')}`, { headers: { 'Accept': 'application/json' } }),
    ]);
    if (!wikiResp.ok || !historyResp.ok) {
        throw new ApiError(`HTTP ${!wikiResp.ok ? wikiResp.status : historyResp.status}`);
    }
    const wikiData = await wikiResp.json() as WikiData;
    const historyData = await historyResp.json() as HistoryEntry[];
    return { wikiData, historyData };
}

// Loads the next item: acquires it server-side, then fetches wiki data.
export async function startNextItem(
    scope: 'error' | 'source',
    sourceId: number | undefined,
    renderItem: (itemData: { currentItem: WorkItem; wikiData: WikiData; historyData: HistoryEntry[] }) => void,
    renderEmpty: () => void,
    onError: (msg: string) => void,
): Promise<void> {
    if (fetchLock) return;
    fetchLock = true;
    try {
        showLoadingOverlay('正在领取条目...');
        const next = await fetchNextItem(scope, sourceId);
        hideLoadingOverlay();
        if (next.done || !next.item) {
            renderEmpty();
            return;
        }
        state.currentItem = next.item;
        state.processedCount++;
        showLoadingOverlay('正在获取条目信息...');
        const { wikiData, historyData } = await fetchWikiData(next.item.entityType, next.item.csvId);
        hideLoadingOverlay();
        renderItem({ currentItem: next.item, wikiData, historyData });
    } catch (error) {
        hideLoadingOverlay();
        onError((error as Error).message);
    } finally {
        fetchLock = false;
    }
}

// Submits the edit through the backend legacy-API proxy, then deletes the item.
export async function submitUpdate(
    itemId: number,
    entityType: string,
    apiId: string,
    form: Record<string, string>,
    commitMessage: string,
    onSuccess: () => void,
    onError: (error: Error) => void,
): Promise<void> {
    try {
        const resp = await fetch(`/api/proxy/submit/${entityType}/${apiId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commitMessage, form }),
        });
        const body = await resp.json().catch(() => ({}));
        if (!resp.ok) {
            throw new ApiError((body as { error?: string }).error || `HTTP ${resp.status}`);
        }
        onSuccess();
    } catch (error) {
        onError(error instanceof Error ? error : new Error(String(error)));
    }
}
