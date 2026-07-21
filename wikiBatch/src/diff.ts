import { generateDiffFile } from '@git-diff-view/file';
import { DiffView, DiffModeEnum } from '@git-diff-view/svelte';
import { mount, unmount } from 'svelte';
import { state, type EntityType, type TagUpdates, type SeriesUpdate, type CsvItem } from './core';
import { sanitizeRegExp, arraysEqual } from './utils';

export function getCurrentEntityType(): EntityType {
    if (!state.csvData || state.currentIndex >= state.csvData.length) return 'subject';
    return state.csvData[state.currentIndex]?.type || 'subject';
}

export function checkForUpdates(): boolean {
    if (!state.currentSubjectData) return false;

    const entityType = getCurrentEntityType();
    const currentWcode = (document.getElementById('static-wcode-input') as HTMLTextAreaElement).value;
    const normalizedCurrentWcode = currentWcode.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const originalWcode = state.currentSubjectData.infobox || '';
    const normalizedOriginalWcode = originalWcode.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const wcodeChanged = normalizedCurrentWcode !== normalizedOriginalWcode;

    if (entityType === 'subject') {
        const tagsInput = document.getElementById('static-tags-input') as HTMLInputElement;
        const currentTags = tagsInput.value.split(' ').filter(t => t);
        const currentSeries = (document.getElementById('static-series-checkbox') as HTMLInputElement).checked;
        const originalTags = state.currentSubjectData.metaTags || [];
        const originalSeries = state.currentSubjectData.series || false;
        const tagsChanged = !arraysEqual(currentTags, originalTags);
        const seriesChanged = currentSeries !== originalSeries;
        return wcodeChanged || tagsChanged || seriesChanged;
    }

    return wcodeChanged;
}

export function updateConfirmButtonState(): void {
    const confirmBtn = document.querySelector(
        '#static-buttons-container button#process-confirm-update',
    ) as HTMLButtonElement | null;
    if (!confirmBtn) return;

    const hasUpdates = checkForUpdates();

    if (hasUpdates) {
        confirmBtn.textContent = '确认更新';
        confirmBtn.disabled = false;
    } else {
        confirmBtn.textContent = '确认更新（无实质修改）';
        confirmBtn.disabled = false;
    }
}

export function generateCommitMessage(
    fieldUpdates: Record<string, string> | null,
    tagUpdates: TagUpdates | null,
    seriesUpdate: SeriesUpdate | null,
    entityType: EntityType | undefined,
): string {
    const updatedFields = Object.keys(fieldUpdates || {});
    const messages: string[] = [];

    if (updatedFields.length) messages.push(`更新${updatedFields.join('、')}`);

    if (entityType === 'subject' || !entityType) {
        if (tagUpdates?.add.length) messages.push(`添加标签${tagUpdates.add.join('、')}`);
        if (tagUpdates?.remove.length) messages.push(`删除标签${tagUpdates.remove.join('、')}`);
        if (seriesUpdate?.hasUpdate) {
            messages.push(seriesUpdate.newValue ? '标记为系列' : '取消系列标记');
        }
    }

    return messages.filter(s => s).join('；') || '更新条目信息';
}

export function updateDiffDisplay(oldText: string, newText: string, containerId: string): void {
    try {
        const normalizedOld = (oldText || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const normalizedNew = (newText || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const oldFileName = '编辑前';
        const newFileName = '编辑后';

        const file = generateDiffFile(oldFileName, normalizedOld, newFileName, normalizedNew, 'text', 'text', { context: 1 });
        file.init();
        file.buildSplitDiffLines();

        const container = document.getElementById(containerId);
        if (!container) return;

        const oldInstance = (container as any)._diffViewInstance;
        if (oldInstance) {
            unmount(oldInstance);
        }

        container.innerHTML = '';

        const instance = mount(DiffView, {
            target: container,
            props: {
                diffFile: file,
                diffViewMode: state.diffViewMode === 'unified' ? DiffModeEnum.Unified : DiffModeEnum.Split,
                diffViewFontSize: 13,
                diffViewTheme: 'light',
                diffViewHighlight: true,
                diffViewWrap: true,
            },
        });
        (container as any)._diffViewInstance = instance;

        if (containerId === 'static-content-diff-container') {
            setTimeout(() => {
                const textarea = document.getElementById('static-wcode-input') as HTMLTextAreaElement | null;
                if (!textarea) return;
                const editRow = textarea.closest('.edit-row') as HTMLElement | null;
                if (!editRow) return;
                const diffSection = editRow.querySelector('.diff-section') as HTMLElement | null;
                if (!diffSection) return;
                textarea.style.height = 'auto';
                textarea.style.height = Math.min(textarea.scrollHeight, diffSection.offsetHeight) + 'px';
            }, 0);
        }

        const diffError = document.getElementById('diff-error');
        if (diffError) diffError.style.display = 'none';
    } catch (e: unknown) {
        console.error('Diff generation error:', e);
        const diffError = document.getElementById('diff-error');
        if (diffError) {
            diffError.textContent = `差异显示错误: ${(e as Error).message}`;
            diffError.style.display = 'block';
        }
    }
}

export function updateTagsDiffDisplay(oldTags: string[], newTags: string[], containerId: string): void {
    const oldText = oldTags.join(' ');
    const newText = newTags.join(' ');
    updateDiffDisplay(oldText, newText, containerId);
}

export function getFieldUpdates(csvItem: CsvItem, _oldInfobox: string): Record<string, string> {
    const updates: Record<string, string> = {};
    Object.keys(csvItem).forEach(key => {
        if (!['id', 'tags', 'series', 'type'].includes(key.toLowerCase())) {
            const val = csvItem[key];
            if (val !== undefined) {
                updates[key] = val;
            }
        }
    });
    return updates;
}

export function getTagUpdates(csvItem: CsvItem, _oldTags: string[]): TagUpdates {
    const entityType = csvItem.type || 'subject';
    if (entityType !== 'subject') {
        return { add: [], remove: [] };
    }

    const tagsStr = csvItem.tags || '';
    const tags = tagsStr.split(' ').filter(t => t);

    const add: string[] = [];
    const remove: string[] = [];

    tags.forEach(tag => {
        if (tag.startsWith('-')) {
            remove.push(tag.slice(1));
        } else {
            add.push(tag);
        }
    });

    return { add, remove };
}

export function getSeriesUpdate(csvItem: CsvItem, oldSeries: boolean): SeriesUpdate {
    const entityType = csvItem.type || 'subject';
    if (entityType !== 'subject') {
        return { hasUpdate: false };
    }

    if (csvItem.series === undefined || csvItem.series === null || csvItem.series === '') {
        return { hasUpdate: false };
    }

    const seriesValue = csvItem.series.trim().toLowerCase();
    const newValue = seriesValue === 'true' || seriesValue === '1' || seriesValue === 'yes';

    return {
        hasUpdate: newValue !== oldSeries,
        newValue: newValue,
    };
}

export function updateInfobox(oldInfobox: string, fieldUpdates: Record<string, string>): string {
    let newInfobox = oldInfobox;

    Object.entries(fieldUpdates).forEach(([field, value]) => {
        value = value.replaceAll('\\n', '\n');
        const regex = new RegExp(`\\|${sanitizeRegExp(field)}\\s*=.*`, 'i');
        if (regex.test(newInfobox)) {
            newInfobox = newInfobox.replace(regex, `|${field}= ${value}`);
        } else {
            const lines = newInfobox.split('\n');
            lines.splice(-1, 0, `|${field}= ${value}`);
            newInfobox = lines.join('\n');
        }
    });

    return newInfobox;
}

export function applyTagUpdates(oldTags: string[], tagUpdates: TagUpdates): string[] {
    const newTagsSet = new Set(oldTags);
    tagUpdates.add.forEach(tag => newTagsSet.add(tag));
    tagUpdates.remove.forEach(tag => newTagsSet.delete(tag));
    return [...newTagsSet];
}
