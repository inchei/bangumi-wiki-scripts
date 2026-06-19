function sanitizeRegExp(str) {
    const regexSpecialChars = /[.*+?^${}()|[\]\\]/g;
    return str.replace(regexSpecialChars, '\\$&');
}

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function isRecentUpdate(timestamp) {
    if (!timestamp) return false;
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    return timestamp * 1000 > twentyFourHoursAgo;
}

function resetProcessingState() {
    state.currentSubjectData = null;
    state.currentItemId = null;
    state.currentWcode = null;
    state.currentTags = null;
    state.currentSeries = null;
    state.currentCommitMessage = null;
    state.currentFieldUpdates = null;
    state.currentTagUpdates = null;
    state.currentSeriesUpdate = null;
}
