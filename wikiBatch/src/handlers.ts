import { state, type PreviousItem } from './core';
import { startProcessing, processNextItem, submitUpdate } from './api';
import { checkForUpdates, generateCommitMessage } from './diff';
import { showStatusMessage, showLoadingOverlay, hideLoadingOverlay } from './ui';
import { switchToSetupView, switchToUpdateErrorView } from './views';
import { resetProcessingState } from './utils';
import { saveState } from './core';

export function handleSetupViewButtons(btnId: string): void {
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

export function handleProcessingViewButtons(btnId: string): void {
    if (!state.csvData) return;
    const currentItem = state.csvData[state.currentIndex];
    const subjectData = state.currentSubjectData;
    const itemId = currentItem?.id || state.currentItemId || '';
    const itemName = subjectData?.name || '未知名称';
    const entityType = currentItem?.type || 'subject';

    function makePreviousItem(): PreviousItem {
        return { id: itemId, name: itemName, type: entityType };
    }

    switch (btnId) {
        case 'process-confirm-update': {
            const finalWcode = (document.getElementById('static-wcode-input') as HTMLTextAreaElement).value;

            const finalTags = entityType === 'subject'
                ? (document.getElementById('static-tags-input') as HTMLInputElement).value.split(' ').filter(t => t)
                : [];
            const finalSeries = entityType === 'subject'
                ? (document.getElementById('static-series-checkbox') as HTMLInputElement).checked
                : false;

            const commitMessage = (document.getElementById('static-commit-input') as HTMLInputElement).value ||
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
                (btn as HTMLButtonElement).disabled = true;
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
                (error: Error) => {
                    hideLoadingOverlay();
                    document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                        (btn as HTMLButtonElement).disabled = false;
                    });
                    switchToUpdateErrorView(error.message);
                },
            );
            break;
        }

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

        case 'process-retry-error': {
            const currentRetryCount = state.retryCount[itemId] || 0;
            showStatusMessage(`正在重试（${currentRetryCount}次）...`);
            processNextItem();
            break;
        }

        case 'process-skip-update-fail':
            state.previousItem = makePreviousItem();
            state.currentIndex++;
            resetProcessingState();
            saveState();
            processNextItem();
            break;

        case 'process-retry-update': {
            const retryCurrentCount = state.retryCount[itemId] || 0;
            showStatusMessage(`正在重试（${retryCurrentCount}次）...`);
            processNextItem(true);
            break;
        }
    }
}

export function handleCompletedViewButtons(btnId: string): void {
    switch (btnId) {
        case 'completed-back-to-setup':
            switchToSetupView();
            hideProgressBar();
            break;
    }
}

function hideProgressBar(): void {
    const el = document.getElementById('bgm-tool-progress');
    if (el) el.style.display = 'none';
}
