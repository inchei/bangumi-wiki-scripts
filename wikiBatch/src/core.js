const state = {
    accessToken: GM_getValue('bgmAccessToken') || '',
    formhash: GM_getValue('bgmFormhash') || '',
    submitMethod: GM_getValue('bgmSubmitMethod', 'patch'), // 'patch' or 'post'
    csvData: JSON.parse(localStorage.getItem('bgmCsvData') || 'null'),
    currentIndex: parseInt(localStorage.getItem('bgmCurrentIndex') || '0'),
    totalItems: 0,
    processing: false,
    paused: false,
    currentView: 'setup',
    currentSubjectData: null,
    currentFieldUpdates: null,
    currentTagUpdates: null,
    currentSeriesUpdate: null,
    currentWcode: null,
    currentTags: null,
    currentSeries: null,
    currentCommitMessage: null,
    isCommitMessageLocked: localStorage.getItem('bgmIsCommitMessageLocked') === 'true' || false,
    lockedCommitMessage: localStorage.getItem('bgmLockedCommitMessage') || '',
    retryCount: {},
    currentItemId: null,
    previousItem: JSON.parse(localStorage.getItem('bgmPreviousItem') || 'null')
};

function saveState() {
    GM_setValue('bgmAccessToken', state.accessToken);
    GM_setValue('bgmFormhash', state.formhash);
    GM_setValue('bgmSubmitMethod', state.submitMethod);
    localStorage.setItem('bgmCsvData', JSON.stringify(state.csvData));
    localStorage.setItem('bgmCurrentIndex', state.currentIndex.toString());
    localStorage.setItem('bgmIsCommitMessageLocked', state.isCommitMessageLocked.toString());
    localStorage.setItem('bgmLockedCommitMessage', state.lockedCommitMessage);
    if (state.previousItem) {
        localStorage.setItem('bgmPreviousItem', JSON.stringify(state.previousItem));
    }
}
