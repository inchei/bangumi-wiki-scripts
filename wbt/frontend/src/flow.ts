import { state } from './core';
import { fetchNextItem, extendLock } from './api';
import { showLoadingOverlay, hideLoadingOverlay, showRemaining, showStatusMessage } from './ui';
import { switchToProcessingView, switchToProcessingErrorView, switchToCompletedView } from './views';
import { resetProcessingState } from './utils';
import { destroyDiffEditor } from './cm-diff';
import type { HistoryEntry, WikiData } from './core';

let fetchLock = false;

let lockTimer: number | null = null;

export function startLockExtender(): void {
    stopLockExtender();
    lockTimer = window.setInterval(() => {
        if (state.currentItem && state.currentView === 'processing') {
            void extendLock(state.currentItem.id).catch(() => {
                showStatusMessage('锁定已失效，请注意可能被他人同时处理');
                stopLockExtender();
            });
        }
    }, 30000);
}

export function stopLockExtender(): void {
    if (lockTimer !== null) {
        window.clearInterval(lockTimer);
        lockTimer = null;
    }
}

export function enterWorkgroup(scope: 'error' | 'source', sourceId?: number, sourceName?: string): void {
    state.currentItem = null;
    state.processedCount = 0;
    state.previousItem = null;
    state.scope = { scope, sourceId, sourceName, after: 0, prevAfter: 0 };
    continueProcessing();
}

async function fetchWikiData(entityType: string, id: string): Promise<{ wikiData: WikiData; historyData: HistoryEntry[] }> {
    const wikiRel = wikiRelPath(entityType, id);
    const historyRel = wikiRelPath(entityType, id) + '/history-summary';
    const [wikiResp, historyResp] = await Promise.all([
        fetch(`/api/proxy/wiki/${wikiRel}`, { headers: { 'Accept': 'application/json' } }),
        fetch(`/api/proxy/wiki/${historyRel}`, { headers: { 'Accept': 'application/json' } }),
    ]);
    if (!wikiResp.ok || !historyResp.ok) {
        throw new Error(`HTTP ${!wikiResp.ok ? wikiResp.status : historyResp.status}`);
    }
    const wikiData = await wikiResp.json() as WikiData;
    const historyData = await historyResp.json() as HistoryEntry[];
    return { wikiData, historyData };
}

function wikiRelPath(entityType: string, id: string): string {
    switch (entityType) {
        case 'person':
            return `persons/${id}`;
        case 'character':
            return `characters/${id}`;
        default:
            return `subjects/${id}`;
    }
}

export function continueProcessing(): void {
    if (fetchLock) return;
    if (!state.scope) {
        switchToCompletedView('工作组上下文已丢失，请返回首页重新进入');
        return;
    }
    state.processing = true;
    const scope = state.scope;

    if (fetchLock) return;
    fetchLock = true;
    (async () => {
        const prevAfter = scope.after;
        try {
            showLoadingOverlay('正在领取条目...');
            const next = await fetchNextItem(scope.scope, scope.sourceId, scope.after);
            hideLoadingOverlay();
            if (next.done || !next.item) {
                switchToCompletedView('所有条目处理完毕');
                return;
            }
            state.currentItem = next.item;
            // advance the cursor past the claimed item so skipping later
            // never hands this item back to the same session
            if (state.scope) {
                state.scope.after = Math.max(state.scope.after, next.item.id);
                state.scope.prevAfter = prevAfter;
            }
            if (next.remaining !== undefined) {
                showRemaining(next.remaining);
            }
            state.processedCount++;
            showLoadingOverlay('正在获取条目信息...');
            const { wikiData, historyData } = await fetchWikiData(next.item.entityType, next.item.csvId);
            hideLoadingOverlay();
            startLockExtender();
            switchToProcessingView({ currentItem: next.item, wikiData, historyData });
        } catch (error) {
            hideLoadingOverlay();
            // move the cursor back so retry re-fetches the same item
            if (state.scope) {
                state.scope.after = prevAfter;
            }
            switchToProcessingErrorView((error as Error).message);
        } finally {
            fetchLock = false;
        }
    })();
}

export function resetToHome(): void {
    resetProcessingState();
    stopLockExtender();
    destroyDiffEditor();
    state.currentItem = null;
    state.scope = null;
    state.processing = false;
}
