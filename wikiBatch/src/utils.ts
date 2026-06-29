import { state } from './core';

export function sanitizeRegExp(str: string): string {
    const regexSpecialChars = /[.*+?^${}()|[\]\\]/g;
    return str.replace(regexSpecialChars, '\\$&');
}

export function arraysEqual<T>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export function isRecentUpdate(timestamp: number | null | undefined): boolean {
    if (!timestamp) return false;
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    return timestamp * 1000 > twentyFourHoursAgo;
}

export function resetProcessingState(): void {
    const s = state;
    s.currentSubjectData = null;
    s.currentItemId = null;
    s.currentWcode = null;
    s.currentTags = null;
    s.currentSeries = null;
    s.currentCommitMessage = null;
    s.currentFieldUpdates = null;
    s.currentTagUpdates = null;
    s.currentSeriesUpdate = null;
}
