import {
    state,
    type EntityType,
    type CsvItem,
    type WikiData,
    type HistoryEntry,
    getEntityApiConfig,
} from './core';
import {
    hideProgressBar,
    showProgressBar,
    updateProgressBar,
} from './ui';
import {
    getFieldUpdates,
    getTagUpdates,
    getSeriesUpdate,
    updateInfobox,
    applyTagUpdates,
    generateCommitMessage,
    updateDiffDisplay,
    updateTagsDiffDisplay,
    updateConfirmButtonState,
} from './diff';
import { isRecentUpdate } from './utils';
import { handleFileUpload } from './csv';

export function switchToSetupView(): void {
    state.currentView = 'setup';
    const coreContent = document.getElementById('core-content');
    const buttonsContainer = document.getElementById('static-buttons-container');

    document.getElementById('edit-regions')!.style.display = 'none';
    hideProgressBar();

    if (coreContent) {
        coreContent.innerHTML = `
            <div>
                <h3 class="section-title">基本设置</h3>

                <div class="form-group">
                    <label>提交方式选择</label>
                    <div class="method-option-group">
                        <span>
                            <input type="radio" id="method-patch" name="submit-method" value="patch" ${state.submitMethod === 'patch' ? 'checked' : ''}>
                            <label for="method-patch">Private API</label>
                        </span>
                        <span style="margin-left: 10px;">
                            <input type="radio" id="method-post" name="submit-method" value="post" ${state.submitMethod === 'post' ? 'checked' : ''}>
                            <label for="method-post">旧 API</label>
                        </span>
                    </div>
                </div>

                <div id="patch-method-options" class="form-group ${state.submitMethod === 'patch' ? '' : 'hidden'}">
                    <label for="setup-access-token">Access Token</label>
                    <input type="password" id="setup-access-token" value="${state.accessToken}">
                    <p class="formhash-hint">
                        你可以在<a href="https://next.bgm.tv/demo/access-token" target="_blank">个人令牌页</a>中获取 Access Token
                    </p>
                </div>

                <div id="post-method-options" class="form-group ${state.submitMethod === 'post' ? '' : 'hidden'}">
                    <label for="setup-formhash">Formhash</label>
                    <input type="text" id="setup-formhash" value="${state.formhash}">
                    <p class="formhash-hint">
                        如何获取formhash：<br>
                        1. 打开条目编辑页面（如 <a href="https://bgm.tv/subject/354667/edit_detail">https://bgm.tv/subject/354667/edit_detail</a>）<br>
                        2. 在浏览器控制台执行：<code>document.querySelector('[name=formhash]').value</code><br>
                        3. 将返回的值复制到上方输入框
                    </p>
                </div>

                <div class="form-group">
                    <label for="setup-csv-file">CSV文件 (包含type、ID、要更新的字段列、tags列或series列)</label>
                    <input type="file" id="setup-csv-file" accept=".csv">
                    ${state.csvData ? `<div style="margin-top: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; font-size: 14px;">已加载CSV: ${state.csvData.length} 条记录</div>` : ''}
                    <p style="font-size: 13px; color: #666; margin-top: 5px;">
                        type列可选值为 subject（条目）、character/crt（角色）、person/prsn（人物），不填默认为subject<br>
                        tags列使用空格分隔标签，前缀带"-"的标签表示删除该标签<br>
                        series列使用true或false表示是否标记为系列<br>
                        角色和人物仅支持 Private API 提交方式
                    </p>
                </div>
                ${state.csvData ? `
                <div class="form-group">
                    <label>处理进度</label>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${(state.currentIndex / state.csvData.length) * 100}%"></div>
                    </div>
                    <div style="margin-top: 8px; color: #666; font-size: 14px;">上次进度: ${state.currentIndex}/${state.csvData.length}</div>
                    <button id="setup-reset-progress" class="secondary" style="margin-top: 10px;">重置进度</button>
                </div>
                ` : ''}
            </div>
        `;
    }

    if (buttonsContainer) {
        buttonsContainer.innerHTML = `
            <button id="setup-start-processing" class="primary">开始处理</button>
        `;
    }

    const accessTokenInput = document.getElementById('setup-access-token') as HTMLInputElement | null;
    if (accessTokenInput) {
        accessTokenInput.addEventListener('input', (e) => {
            state.accessToken = (e.target as HTMLInputElement).value;
            GM_setValue('bgmAccessToken', state.accessToken);
        });
    }

    const formhashInput = document.getElementById('setup-formhash') as HTMLInputElement | null;
    if (formhashInput) {
        formhashInput.addEventListener('input', (e) => {
            state.formhash = (e.target as HTMLInputElement).value;
            GM_setValue('bgmFormhash', state.formhash);
        });
    }

    const methodRadios = document.querySelectorAll('input[name="submit-method"]');
    methodRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.submitMethod = (e.target as HTMLInputElement).value as 'patch' | 'post';
            GM_setValue('bgmSubmitMethod', state.submitMethod);

            const patchOptions = document.getElementById('patch-method-options');
            const postOptions = document.getElementById('post-method-options');
            if (patchOptions) patchOptions.classList.toggle('hidden', state.submitMethod !== 'patch');
            if (postOptions) postOptions.classList.toggle('hidden', state.submitMethod !== 'post');
        });
    });

    const csvFileInput = document.getElementById('setup-csv-file') as HTMLInputElement | null;
    if (csvFileInput) {
        csvFileInput.addEventListener('change', handleFileUpload);
    }
}

export function switchToProcessingView(itemData: {
    currentItem: CsvItem;
    wikiData: WikiData;
    historyData: HistoryEntry[];
}): void {
    state.currentView = 'processing';
    const { currentItem, wikiData, historyData } = itemData;
    state.currentSubjectData = wikiData;
    state.currentItemId = currentItem.id;

    const entityType = currentItem.type || 'subject';

    state.currentWcode = null;
    state.currentTags = null;
    state.currentSeries = null;
    state.currentCommitMessage = null;

    const coreContent = document.getElementById('core-content');
    const buttonsContainer = document.getElementById('static-buttons-container');
    const editRegions = document.getElementById('edit-regions');

    if (editRegions) editRegions.style.display = 'block';
    showProgressBar();
    updateProgressBar(state.currentIndex, state.totalItems);

    const itemName = wikiData.name || '未知名称';
    const oldInfobox = wikiData.infobox || '';
    const oldTags = entityType === 'subject' ? (wikiData.metaTags || []) : [];
    const oldSeries = entityType === 'subject' ? (wikiData.series || false) : false;
    const fieldUpdates = getFieldUpdates(currentItem, oldInfobox);
    const tagUpdates = getTagUpdates(currentItem, oldTags);
    const seriesUpdate = getSeriesUpdate(currentItem, oldSeries);
    state.currentFieldUpdates = fieldUpdates;
    state.currentTagUpdates = tagUpdates;
    state.currentSeriesUpdate = seriesUpdate;

    const TYPE_LABELS: Record<EntityType, string> = {
        subject: '条目',
        character: '角色',
        person: '人物',
    };

    const lastUpdateEl = document.getElementById('static-last-update');
    const lastUpdateTime: number | undefined = historyData[0]?.createdAt;
    const lastUpdateDate = lastUpdateTime ? new Date(lastUpdateTime * 1000) : null;
    const lastCreator: string = historyData[0]?.creator?.username || '';
    const lastCommitMessage2: string = historyData[0]?.commitMessage || '';
    const shouldWarn = isRecentUpdate(lastUpdateTime);

    if (lastUpdateDate && lastUpdateEl) {
        const { editPagePath } = getEntityApiConfig(entityType, currentItem.id);
        lastUpdateEl.innerHTML = `
            <a href="${editPagePath}" target="_blank">
                最后更新: ${lastUpdateDate.toLocaleString()} ${lastCreator} ${lastCommitMessage2}
            </a>
        `;
        lastUpdateEl.style.color = shouldWarn ? '#d9534f' : '';
        lastUpdateEl.style.display = 'block';
    } else if (lastUpdateEl) {
        lastUpdateEl.style.display = 'none';
    }

    const prevLinkEl = document.getElementById('prev-item-link');
    if (prevLinkEl && state.previousItem && state.currentIndex > 0) {
        const prevType = state.previousItem.type as EntityType;
        const { editPagePath: prevEditPath } = getEntityApiConfig(prevType, state.previousItem.id);
        prevLinkEl.innerHTML = `
            <i class="fas fa-arrow-left"></i> 上一个:
            <a href="${prevEditPath}" target="_blank">
                ${state.previousItem.name}（${state.previousItem.id}）
            </a>
        `;
        prevLinkEl.style.display = 'block';
    } else if (prevLinkEl) {
        prevLinkEl.style.display = 'none';
    }

    const commitInput = document.getElementById('static-commit-input') as HTMLInputElement;
    const lockCommitBtn = document.getElementById('static-lock-commit') as HTMLButtonElement;

    const defaultCommitMsg = generateCommitMessage(fieldUpdates, tagUpdates, seriesUpdate, entityType);
    commitInput.value = state.isCommitMessageLocked ? state.lockedCommitMessage : defaultCommitMsg;
    lockCommitBtn.innerHTML = `<i class="fas ${state.isCommitMessageLocked ? 'fa-lock' : 'fa-lock-open'}"></i>`;
    lockCommitBtn.title = state.isCommitMessageLocked ? '解锁编辑摘要' : '固定编辑摘要';

    const wcodeInput = document.getElementById('static-wcode-input') as HTMLTextAreaElement;
    const contentDiffSection = document.getElementById('static-content-diff-container');
    const newInfobox = updateInfobox(oldInfobox, fieldUpdates);
    wcodeInput.value = newInfobox;
    updateDiffDisplay(oldInfobox, newInfobox, 'static-content-diff-container');
    if (contentDiffSection) contentDiffSection.style.display = 'block';

    const tagsArea = document.getElementById('static-tags-area');
    const tagsDiffSection = document.getElementById('static-tags-diff-container');
    if (entityType === 'subject') {
        const tagsInput = document.getElementById('static-tags-input') as HTMLInputElement;
        const newTags = applyTagUpdates(oldTags, tagUpdates);
        tagsInput.value = newTags.join(' ');
        updateTagsDiffDisplay(oldTags, newTags, 'static-tags-diff-container');
        if (tagsArea) tagsArea.style.display = 'block';
        if (tagsDiffSection) tagsDiffSection.style.display = 'block';
    } else {
        if (tagsArea) tagsArea.style.display = 'none';
        if (tagsDiffSection) tagsDiffSection.style.display = 'none';
    }

    const seriesArea = document.getElementById('static-series-area');
    if (entityType === 'subject') {
        const seriesCheckbox = document.getElementById('static-series-checkbox') as HTMLInputElement;
        const finalSeriesValue = seriesUpdate.hasUpdate ? seriesUpdate.newValue! : oldSeries;
        seriesCheckbox.checked = finalSeriesValue;
        state.currentSeries = finalSeriesValue;
        if (seriesArea) seriesArea.style.display = 'block';
    } else if (seriesArea) {
        seriesArea.style.display = 'none';
    }

    const browsePath = getEntityApiConfig(entityType, currentItem.id).editPagePath.replace('/edit', '');
    const typeLabel = TYPE_LABELS[entityType] || '条目';

    if (coreContent) {
        coreContent.innerHTML = `
            <div>
                <div class="item-info">
                    当前${typeLabel}：<a href="${browsePath}" target="_blank">${itemName}</a>（${currentItem.id}）[${typeLabel}]
                </div>
            </div>
        `;
    }

    if (buttonsContainer) {
        buttonsContainer.innerHTML = `
            <button id="process-skip-update" class="secondary">跳过</button>
            <button id="process-confirm-update" class="primary">确认更新</button>
        `;
    }

    updateConfirmButtonState();
}

export function switchToProcessingErrorView(currentItem: CsvItem, errorMsg: string): void {
    state.currentView = 'processing';
    const coreContent = document.getElementById('core-content');
    const buttonsContainer = document.getElementById('static-buttons-container');
    const editRegions = document.getElementById('edit-regions');

    if (editRegions) editRegions.style.display = 'none';
    showProgressBar();
    updateProgressBar(state.currentIndex, state.totalItems);

    const itemId = currentItem.id;
    const entityType = currentItem.type || 'subject';
    const TYPE_LABELS: Record<string, string> = { subject: '条目', character: '角色', person: '人物' };
    const typeLabel = TYPE_LABELS[entityType] || '条目';

    const currentRetryCount = (state.retryCount[itemId] || 0) + 1;
    state.retryCount[itemId] = currentRetryCount;

    if (coreContent) {
        coreContent.innerHTML = `
            <div>
                <div class="item-info">
                    当前${typeLabel}：<a href="https://bgm.tv/${entityType}/${itemId}" target="_blank">查看${typeLabel}</a>（${itemId}）
                </div>
                <div class="status-box error">
                    无法获取${typeLabel}信息: ${errorMsg}
                    ${currentRetryCount > 1 ? `<br>已重试 ${currentRetryCount - 1} 次` : ''}
                </div>
                <p>是否继续处理？</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${(state.currentIndex / state.totalItems) * 100}%"></div>
                </div>
            </div>
        `;
    }

    if (buttonsContainer) {
        buttonsContainer.innerHTML = `
            <button id="process-skip-error" class="secondary">跳过</button>
            <button id="process-retry-error" class="primary">重试</button>
        `;
    }
}

export function switchToUpdateErrorView(errorMsg: string): void {
    state.currentView = 'processing';
    const coreContent = document.getElementById('core-content');
    const buttonsContainer = document.getElementById('static-buttons-container');
    const editRegions = document.getElementById('edit-regions');

    if (editRegions) editRegions.style.display = 'none';
    showProgressBar();
    updateProgressBar(state.currentIndex, state.totalItems);

    const itemId = state.currentItemId || '';
    const currentRetryCount = (state.retryCount[itemId] || 0) + 1;
    state.retryCount[itemId] = currentRetryCount;

    const subjectData = state.currentSubjectData;
    const itemName = subjectData?.name || '未知名称';

    const csvItem = state.csvData ? state.csvData[state.currentIndex] : null;
    const entityType = csvItem?.type || 'subject';
    const TYPE_LABELS: Record<string, string> = { subject: '条目', character: '角色', person: '人物' };
    const typeLabel = TYPE_LABELS[entityType] || '条目';

    if (coreContent) {
        coreContent.innerHTML = `
            <div>
                <div class="item-info">
                    当前${typeLabel}：<a href="https://bgm.tv/${entityType}/${itemId}" target="_blank">${itemName}</a>（${itemId}）
                </div>
                <div class="status-box error">
                    提交更新失败: ${errorMsg}
                </div>
                <p>是否重试更新？</p>
            </div>
        `;
    }

    if (buttonsContainer) {
        buttonsContainer.innerHTML = `
            <button id="process-skip-update-fail" class="secondary">跳过</button>
            <button id="process-retry-update" class="primary">重试</button>
        `;
    }
}

export function switchToCompletedView(): void {
    state.currentView = 'completed';
    const coreContent = document.getElementById('core-content');
    const buttonsContainer = document.getElementById('static-buttons-container');
    const editRegions = document.getElementById('edit-regions');

    if (editRegions) editRegions.style.display = 'none';
    showProgressBar();
    updateProgressBar(state.totalItems, state.totalItems);

    if (coreContent) {
        coreContent.innerHTML = `
            <div>
                <h3 class="section-title">处理完成</h3>
                <div class="status-box info">所有条目处理完毕</div>
                <div class="stats-container">
                    <div class="stats-item">
                        <span class="stats-label">总条目</span>
                        <span class="stats-value">${state.totalItems}</span>
                    </div>
                </div>
            </div>
        `;
    }

    if (buttonsContainer) {
        buttonsContainer.innerHTML = `
            <button id="completed-back-to-setup" class="primary">返回设置</button>
        `;
    }
}
