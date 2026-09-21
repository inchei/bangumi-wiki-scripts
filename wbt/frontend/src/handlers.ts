import {
    state,
    saveState,
    type PreviousItem,
    type WorkItem,
} from './core';
import {
    submitUpdate,
    markItemError,
    releaseLock,
} from './api';
import { checkForUpdates, generateCommitMessage } from './diff';
import { showStatusMessage, showLoadingOverlay, hideLoadingOverlay } from './ui';
import { switchToHomeView, switchToUpdateErrorView } from './views';
import { resetProcessingState } from './utils';
import { getDoc, TAGS_CONTAINER_ID, WCODE_CONTAINER_ID, destroyDiffEditor } from './cm-diff';
import { continueProcessing, stopLockExtender } from './flow';

// bottom bar left: mark error (moves the item to the global error workgroup)
export function markCurrentItemError(): void {
    const currentItem = state.currentItem;
    if (!currentItem) return;
    document.querySelectorAll('#static-buttons-container button').forEach(btn => {
        (btn as HTMLButtonElement).disabled = true;
    });
    markItemError(currentItem.id)
        .then(() => {
            showStatusMessage('已标记为错误编辑');
            advanceAfter(makePreviousItem(currentItem));
        })
        .catch((error: { error?: string }) => {
            showStatusMessage('标记失败: ' + (error.error || '请重试'));
            document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                (btn as HTMLButtonElement).disabled = false;
            });
        });
}

function makePreviousItem(currentItem: WorkItem | null): PreviousItem | null {
    if (!currentItem) return null;
    return {
        id: currentItem.csvId,
        name: state.currentSubjectData?.name || '未知名称',
        type: currentItem.entityType,
    };
}

// delete the item from the database after a successful proxy submission
async function submitConfirmDelete(
    currentItem: WorkItem,
    done: (error?: Error) => void,
): Promise<void> {
    try {
        const resp = await fetch(`/api/items/${currentItem.id}/confirm`, { method: 'POST' });
        const body = await resp.json().catch(() => ({}));
        if (!resp.ok) {
            throw new Error((body as { error?: string }).error || `HTTP ${resp.status}`);
        }
        hideLoadingOverlay();
        done();
    } catch (error) {
        hideLoadingOverlay();
        done(error instanceof Error ? error : new Error(String(error)));
    }
}

function buildSubmitForm(
    currentItem: WorkItem,
    finalWcode: string,
    finalTags: string[],
    finalSeries: boolean,
): Record<string, string> {
    const entityType = currentItem.entityType;
    const formattedInfobox = finalWcode.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
    const form: Record<string, string> = {};

    if (entityType === 'subject') {
        form.subject_title = state.currentSubjectData?.name || '';
        form.platform = state.currentSubjectData?.platform || '';
        form.subject_infobox = formattedInfobox;
        form.subject_summary = state.currentSubjectData?.summary || '';
        form.subject_meta_tags = finalTags.join(' ');
        form.series = finalSeries ? '1' : '0';
        form.submit = '提交';
    } else {
        form.crt_name = state.currentSubjectData?.name || '';
        form.crt_infobox = formattedInfobox;
        form.crt_summary = state.currentSubjectData?.summary || '';
        const profession = state.currentSubjectData?.profession;
        if (profession) {
            for (const [key, val] of Object.entries(profession)) {
                if (val) form[`prsn_pro[${key}]`] = '1';
            }
        }
        form.picfile = '';
        form.submit = '改好了';
    }
    return form;
}

export function handleProcessingViewButtons(btnId: string): void {
    const currentItem = state.currentItem;

    switch (btnId) {
        case 'process-confirm-update': {
            if (!currentItem) return;
            const entityType = currentItem.entityType;
            const finalWcode = getDoc(WCODE_CONTAINER_ID);
            const finalTags = entityType === 'subject'
                ? getDoc(TAGS_CONTAINER_ID).split(' ').filter(t => t)
                : [];
            const finalSeries = entityType === 'subject'
                ? (document.getElementById('static-series-checkbox') as HTMLInputElement).checked
                : false;

            const commitMessage = (document.getElementById('static-commit-input') as HTMLInputElement).value ||
                generateCommitMessage(state.currentFieldUpdates, state.currentTagUpdates, state.currentSeriesUpdate, entityType);

            const hasUpdates = checkForUpdates();

            document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                (btn as HTMLButtonElement).disabled = true;
            });

            if (!hasUpdates) {
                showStatusMessage('没有检测到实质修改，已确认');
                submitConfirmDelete(currentItem, (err) => {
                    if (err) {
                        switchToUpdateErrorView('更新队列失败: ' + err.message);
                        return;
                    }
                    advanceAfter(makePreviousItem(currentItem));
                });
                return;
            }

            showLoadingOverlay('正在提交更新...');

            const form = buildSubmitForm(currentItem, finalWcode, finalTags, finalSeries);
            submitUpdate(
                currentItem.id,
                currentItem.entityType,
                currentItem.csvId,
                form,
                commitMessage,
                () => {
                    hideLoadingOverlay();
                    submitConfirmDelete(currentItem, (err) => {
                        if (err) {
                            switchToUpdateErrorView('提交成功但更新队列失败: ' + err.message);
                            return;
                        }
                        advanceAfter(makePreviousItem(currentItem));
                    });
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

        case 'process-mark-error':
            markCurrentItemError();
            break;

        case 'process-skip-update':
        case 'process-skip-update-fail':
        case 'process-skip-error':
            skipCurrentItem();
            break;

        case 'process-retry-error':
        case 'process-retry-update':
            // re-claim the same item: move the cursor back before the failed claim
            if (state.scope) {
                state.scope.after = state.scope.prevAfter;
            }
            continueProcessing();
            break;
    }
}

// skip: release our soft lock first, otherwise /next would hand back
// the very same item (own locked items are re-acquirable).
function skipCurrentItem(): void {
    const currentItem = state.currentItem;
    if (!currentItem) {
        advanceAfter(null);
        return;
    }
    document.querySelectorAll('#static-buttons-container button').forEach(btn => {
        (btn as HTMLButtonElement).disabled = true;
    });
    releaseLock(currentItem.id)
        .then(() => advanceAfter(makePreviousItem(currentItem)))
        .catch(() => advanceAfter(null));
}

function advanceAfter(prev: PreviousItem | null): void {
    if (prev) {
        state.previousItem = prev;
        saveState();
    }
    state.currentItem = null;
    stopLockExtender();
    destroyDiffEditor();
    resetProcessingState();
    continueProcessing();
}

export function handleCompletedViewButtons(btnId: string): void {
    switch (btnId) {
        case 'completed-back-to-home':
            void switchToHomeView();
            break;
    }
}

export function handleHomeViewButtons(_btnId: string, _el: HTMLElement): void {
    // entering a workgroup is delegated in dom.ts via workgroup-enter-btn
}
