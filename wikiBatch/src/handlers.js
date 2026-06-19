function handleSetupViewButtons(btnId) {
    switch (btnId) {
        case 'setup-start-processing':
            startProcessing();
            break;
        case 'setup-reset-progress':
            state.currentIndex = 0;
            state.retryCount = {};
            state.previousItem = null;
            localStorage.setItem('bgmCurrentIndex', '0');
            switchToSetupView();
            break;
    }
}

function handleProcessingViewButtons(btnId) {
    const currentItem = state.csvData[state.currentIndex];
    const subjectData = state.currentSubjectData;
    const itemId = currentItem?.id || state.currentItemId;
    const itemName = subjectData?.name || '未知名称';
    const entityType = currentItem?.type || 'subject';

    // Build previous item with entity type info
    function makePreviousItem() {
        return { id: itemId, name: itemName, type: entityType };
    }

    switch (btnId) {
        case 'process-confirm-update':
            const finalWcode = document.getElementById('static-wcode-input').value;

            // Tags and series only apply to subjects
            const finalTags = entityType === 'subject'
                ? document.getElementById('static-tags-input').value.split(' ').filter(t => t)
                : [];
            const finalSeries = entityType === 'subject'
                ? document.getElementById('static-series-checkbox').checked
                : false;

            const commitMessage = document.getElementById('static-commit-input').value ||
                generateCommitMessage(state.currentFieldUpdates, state.currentTagUpdates, state.currentSeriesUpdate, entityType);

            const hasUpdates = checkForUpdates();

            if (!hasUpdates) {
                showStatusMessage('没有检测到实质修改，已跳过更新');

                state.previousItem = makePreviousItem();
                state.currentIndex++;
                resetProcessingState();
                saveState();
                processNextItem();
                return;
            }

            document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                btn.disabled = true;
            });
            showLoadingOverlay('正在提交更新...');

            submitUpdate(
                itemId,
                finalWcode,
                finalTags,
                finalSeries,
                itemName,
                currentItem,
                commitMessage,
                () => {
                    state.previousItem = makePreviousItem();
                    state.currentIndex++;
                    resetProcessingState();
                    saveState();
                    processNextItem();
                },
                (error) => {
                    hideLoadingOverlay();
                    document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                        btn.disabled = false;
                    });
                    switchToUpdateErrorView(error.message);
                }
            );
            break;

        case 'process-skip-update':
            state.previousItem = makePreviousItem();
            state.currentIndex++;
            resetProcessingState();
            saveState();
            processNextItem();
            break;

        case 'process-confirm-continue':
            state.previousItem = makePreviousItem();
            state.currentIndex++;
            resetProcessingState();
            saveState();
            processNextItem();
            break;

        case 'process-skip-error':
            state.currentIndex++;
            resetProcessingState();
            saveState();
            processNextItem();
            break;

        case 'process-retry-error':
            const currentRetryCount = state.retryCount[itemId] || 0;
            showStatusMessage(`正在重试（${currentRetryCount}次）...`);
            processNextItem();
            break;

        case 'process-skip-update-fail':
            state.previousItem = makePreviousItem();
            state.currentIndex++;
            resetProcessingState();
            saveState();
            processNextItem();
            break;

        case 'process-retry-update':
            const retryCurrentCount = state.retryCount[itemId] || 0;
            showStatusMessage(`正在重试（${retryCurrentCount}次）...`);
            processNextItem(true);
            break;
    }
}

function handleCompletedViewButtons(btnId) {
    switch (btnId) {
        case 'completed-back-to-setup':
            switchToSetupView();
            hideProgressBar();
            break;
    }
}
