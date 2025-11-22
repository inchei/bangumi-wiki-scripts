// ==UserScript==
// @name         bangumi wiki 批量更新工具
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  支持两种提交方式，可在设置页面选择，支持编辑Wcode、标签和系列状态
// @author       You
// @match        https://next.bgm.tv/
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @require      https://cdn.jsdelivr.net/npm/@trim21/gm-fetch
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.2.0/diff.min.js
// @require      https://unpkg.com/diff2html/bundles/js/diff2html-ui.min.js
// @license      MIT
// ==/UserScript==

GM_addStyle(`
#bgm-tool-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 800px;
    height: 80vh;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: box-shadow 0.2s ease;
}

#bgm-tool-header {
    padding: 14px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#bgm-tool-header-actions {
    display: flex;
    gap: 10px;
}

#bgm-tool-header-actions span {
    cursor: pointer;
    color: #666666;
    font-size: 16px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s ease;
}

#bgm-tool-header-actions span:hover {
    background: #e9ecef;
}

#bgm-tool-progress {
    padding: 12px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    display: none;
}

#progress-inner {
    display: flex;
    align-items: center;
    gap: 12px;
}

#progress-text {
    font-size: 14px;
    color: #666666;
    white-space: nowrap;
}

#progress-bar-container {
    flex-grow: 1;
    height: 6px;
    background: #e9ecef;
    border-radius: 3px;
    overflow: hidden;
}

#progress-bar {
    height: 100%;
    background: #6c757d;
    width: 0%;
    transition: width 0.3s ease;
}

#bgm-status-message {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 20px;
    border-radius: 4px;
    background: #343a40;
    color: white;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    line-height: 1.5;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

#bgm-status-message.show {
    opacity: 1;
    visibility: visible;
    animation: fadeIn 0.3s forwards, fadeOut 0.3s 2.7s forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, 20px);
    }
    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translate(-50%, 0);
    }
    to {
        opacity: 0;
        transform: translate(-50%, 20px);
    }
}

#bgm-tool-container button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    outline: none;
}

#bgm-tool-container button.primary {
    background: #6c757d;
    color: white;
}

#bgm-tool-container button.primary:hover {
    background: #5a6268;
}

#bgm-tool-container button.secondary {
    background: #e9ecef;
    color: #495057;
}

#bgm-tool-container button.secondary:hover {
    background: #dde1e3;
}

#bgm-tool-container button.danger {
    background: #e74c3c;
    color: white;
}

#bgm-tool-container button.danger:hover {
    background: #c0392b;
}

#bgm-tool-container button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

#bgm-tool-container .form-group {
    margin-bottom: 20px;
}

#bgm-tool-container label {
    margin-bottom: 8px;
    font-weight: 500;
    color: #495057;
}

#bgm-tool-container input[type="text"],
#bgm-tool-container input[type="password"],
#bgm-tool-container input[type="file"] {
    width: 100%;
    padding: 9px 12px;
    box-sizing: border-box;
    border: 1px solid #ced4da;
    border-radius: 4px;
    background: #ffffff;
    font-size: 14px;
    transition: border-color 0.2s ease;
}

#bgm-tool-container input[type="checkbox"] {
    margin-right: 8px;
}

#bgm-tool-container input[type="text"]:focus,
#bgm-tool-container input[type="password"]:focus {
    border-color: #adb5bd;
    outline: none;
}

.status-box {
    padding: 12px 15px;
    border-radius: 4px;
    margin: 12px 0;
    font-size: 14px;
}

.status-box.info {
    background: #f8f9fa;
    color: #495057;
    border: 1px solid #e9ecef;
}

.status-box.success {
    background: #f0fff4;
    color: #2b6a35;
    border: 1px solid #c3e6c3;
}

.status-box.error {
    background: #fff5f5;
    color: #a72e2e;
    border: 1px solid #ffe3e3;
}

.status-box.warning {
    background: #fffbf0;
    color: #856404;
    border: 1px solid #fff3cd;
}

.progress-bar-container {
    height: 6px;
    background: #e9ecef;
    border-radius: 3px;
    overflow: hidden;
    margin: 15px 0;
}

.progress-bar {
    height: 100%;
    background: #6c757d;
    width: 0%;
    transition: width 0.3s ease;
}

.diff-container {
    margin: 15px 0;
    border-radius: 4px;
}

.log-container {
    border: 1px solid #e9ecef;
    border-radius: 4px;
    margin: 15px 0;
    max-height: calc(100% - 180px);
    overflow-y: auto;
}

.log-entry {
    padding: 10px 12px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 14px;
}

.log-entry:last-child {
    border-bottom: none;
}

.log-success {
    background: #f8fff8;
    color: #2b6a35;
}

.log-error {
    background: #fff8f8;
    color: #a72e2e;
}

.log-info {
    background: #f8f9fa;
    color: #495057;
}

#bgm-tool-container a {
    color: #6c757d;
    text-decoration: none;
    transition: color 0.2s ease;
}

#bgm-tool-container a:hover {
    color: #495057;
    text-decoration: underline;
}

#bgm-tool-container h3 {
    margin: 0 0 15px 0;
    color: #333333;
    font-size: 18px;
    font-weight: 600;
}

#bgm-tool-container p {
    margin: 8px 0;
}

.stats-container {
    margin: 20px 0;
    display: flex;
    gap: 10px;
}

.stats-item {
    flex: 1;
    text-align: center;
    padding: 15px 10px;
    background: #f8f9fa;
    border-radius: 4px;
}

.stats-label {
    font-size: 13px;
    color: #666666;
    margin-bottom: 5px;
    display: block;
}

.stats-value {
    font-size: 22px;
    font-weight: 600;
    color: #333333;
}

.item-info {
    font-size: 16px;
    margin: 0 0 15px 0;
    font-weight: 500;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 15px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
}

.log-search-container {
    margin-bottom: 15px;
}

#log-search {
    padding: 8px 12px;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
}

.log-filter {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 4px 10px;
    font-size: 13px;
    border-radius: 4px;
    border: 1px solid #ced4da;
    background: #ffffff;
    cursor: pointer;
}

.filter-btn.active {
    background: #6c757d;
    color: white;
    border-color: #6c757d;
}

.loading-container {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

#bgm-tool-body {
    padding: 20px;
    flex-grow: 1;
    box-sizing: border-box;
    line-height: 1.6;
    color: #333333;
    overflow-y: auto;
}

#core-content {
    width: 100%;
}

.buttons-container {
    padding: 15px 20px;
    background: #f8f9fa;
    border-top: 1px solid #e0e0e0;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    box-sizing: border-box;
}

#bgm-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255,255,255,0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

#bgm-loading-overlay.active {
    opacity: 1;
    pointer-events: auto;
}

#loading-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #e9ecef;
    border-radius: 50%;
    border-top-color: #6c757d;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 15px;
}

#loading-text {
    color: #666666;
    font-size: 14px;
    text-align: center;
    transition: opacity 0.3s ease;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.edit-area {
    margin: 15px 0;
    display: block;
}

.edit-area textarea {
    width: 90%;
    min-height: 150px;
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-family: monospace;
    font-size: 14px;
    resize: vertical;
}

.tags-edit-area {
    margin: 15px 0;
    display: block;
}

.tags-edit-area input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
}

.series-edit-area {
    margin: 15px 0;
    display: block;
    padding: 10px;
}

.last-update-info {
    font-size: 14px;
    color: #666;
    margin: 10px 0;
    display: none;
}

.commit-message-area {
    margin: 15px 0;
    display: block;
}

.commit-message-area input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
}

.diff-section {
    margin: 20px 0;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
    display: block;
}

.diff-section-title {
    font-weight: 600;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #e0e0e0;
}

.prev-item-link {
    font-size: 14px;
    margin: 10px 0;
    color: #6c757d;
    display: block;
}

.d2h-code-linenumber {
  position: relative !important;
  display: table-cell !important;
}
.d2h-code-line {
  padding: 0 0.5em !important;
}
.d2h-file-header.d2h-sticky-header {
  display: none !important;
}

#bgm-float-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #6c757d;
    color: white;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    cursor: pointer;
    z-index: 9998;
    transition: all 0.2s ease;
}

#bgm-float-button:hover {
    background: #5a6268;
    transform: scale(1.05);
}

#status-container {
    margin: 15px 0;
    display: none;
}

.method-option-group {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 15px;
}

.method-option-title {
    font-weight: 600;
    margin-bottom: 10px;
    display: block;
}

.formhash-hint {
    font-size: 13px;
    color: #666;
    margin-top: 5px;
    padding: 8px;
    background: #fff8f8;
    border-radius: 4px;
    border-left: 3px solid #e74c3c;
}
`);

const diffLink = document.createElement('link');
diffLink.rel = 'stylesheet';
diffLink.href = 'https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css';
document.head.appendChild(diffLink);

const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
document.head.appendChild(fontAwesome);

function createFloatButton() {
    let floatBtn = document.getElementById('bgm-float-button');
    if (!floatBtn) {
        floatBtn = document.createElement('div');
        floatBtn.id = 'bgm-float-button';
        floatBtn.innerHTML = '<i class="fas fa-tools"></i>';
        document.body.appendChild(floatBtn);

        floatBtn.addEventListener('click', () => {
            const container = document.getElementById('bgm-tool-container');
            if (container) {
                container.style.display = 'flex';
                floatBtn.style.display = 'none';
            }
        });
    }
    return floatBtn;
}

(function () {
    'use strict';

    const state = {
        accessToken: GM_getValue('bgmAccessToken') || '',
        formhash: GM_getValue('bgmFormhash') || '',
        submitMethod: GM_getValue('bgmSubmitMethod', 'patch'), // 'patch' 或 'post'
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

    function createStaticDOM() {
        const floatBtn = createFloatButton();
        floatBtn.style.display = 'none';

        if (document.getElementById('bgm-tool-container')) {
            document.getElementById('bgm-tool-container').style.display = 'flex';
            return;
        }

        const container = document.createElement('div');
        container.id = 'bgm-tool-container';
        container.innerHTML = `
            <div id="bgm-tool-header">
                bangumi wiki 批量更新工具
                <div id="bgm-tool-header-actions">
                    <span id="bgm-tool-settings" title="设置"><i class="fas fa-cog"></i></span>
                    <span id="bgm-tool-close">×</span>
                </div>
            </div>
            <div id="bgm-tool-progress">
                <div id="progress-inner">
                    <span id="progress-text">处理进度: 0/0</span>
                    <div id="progress-bar-container">
                        <div id="progress-bar"></div>
                    </div>
                </div>
            </div>
            <div class="loading-container">
                <div id="bgm-tool-body">
                    <div id="core-content"></div>
                    <div id="edit-regions">
                        <div class="prev-item-link" id="prev-item-link"></div>

                        <div class="last-update-info" id="static-last-update"></div>
                        <div class="commit-message-area" id="static-commit-area">
                            <label>编辑摘要:</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="text" id="static-commit-input" placeholder="请输入编辑摘要" style="flex-grow: 1;">
                                <button id="static-lock-commit" class="secondary" title="${state.isCommitMessageLocked ? '解锁编辑摘要' : '固定编辑摘要'}">
                                    <i class="fas ${state.isCommitMessageLocked ? 'fa-lock' : 'fa-lock-open'}"></i>
                                </button>
                            </div>
                        </div>
                        <div class="edit-area" id="static-wcode-area">
                            <label>Wcode:</label>
                            <textarea id="static-wcode-input"></textarea>
                        <div id="static-content-diff-container" class="diff-container"></div>
                        </div>
                        <div class="tags-edit-area" id="static-tags-area">
                            <label>标签 (空格分隔):</label>
                            <input type="text" id="static-tags-input">
                        <div id="static-tags-diff-container" class="diff-container"></div>
                        </div>
                        <div class="series-edit-area" id="static-series-area">
                            <label style="display: inline-flex; align-items: center;">
                                <input type="checkbox" id="static-series-checkbox">
                                标记为系列
                            </label>
                        </div>
                        <div id="diff-error" style="color: #a72e2e; font-size: 14px; margin-top: 8px; display: none;"></div>
                        <div id="status-container" class="status-box"></div>
                    </div>
                </div>
                <div class="buttons-container" id="static-buttons-container"></div>
                <div id="bgm-loading-overlay">
                    <div id="loading-spinner"></div>
                    <div id="loading-text"></div>
                </div>
            </div>
            <div id="bgm-status-message"></div>
        `;
        document.body.appendChild(container);

        bindEventDelegation();

        document.getElementById('bgm-tool-close').addEventListener('click', () => {
            container.style.display = 'none';
            createFloatButton().style.display = 'flex';
            hideStatusMessage();
            saveState();
        });

        document.getElementById('bgm-tool-settings').addEventListener('click', () => {
            switchToSetupView();
        });

        bindEditRegionEvents();

        switchToSetupView();
    }

    function bindEventDelegation() {
        const buttonsContainer = document.getElementById('static-buttons-container');

        buttonsContainer.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('button');
            if (!targetBtn) return;

            const btnId = targetBtn.id;
            const currentView = state.currentView;

            switch (currentView) {
                case 'setup':
                    handleSetupViewButtons(btnId);
                    break;
                case 'processing':
                    handleProcessingViewButtons(btnId);
                    break;
                case 'completed':
                    handleCompletedViewButtons(btnId);
                    break;
            }
        });
    }

    function bindEditRegionEvents() {
        const commitInput = document.getElementById('static-commit-input');
        commitInput.addEventListener('input', (e) => {
            if (state.currentView === 'processing' && state.currentSubjectData) {
                state.currentCommitMessage = e.target.value;
                updateConfirmButtonState();
            }
        });

        const lockCommitBtn = document.getElementById('static-lock-commit');
        lockCommitBtn.addEventListener('click', () => {
            if (state.currentView !== 'processing' || !state.currentSubjectData) return;

            state.isCommitMessageLocked = !state.isCommitMessageLocked;
            const commitInput = document.getElementById('static-commit-input');

            if (state.isCommitMessageLocked) {
                state.lockedCommitMessage = commitInput.value;
                lockCommitBtn.innerHTML = '<i class="fas fa-lock"></i>';
                lockCommitBtn.title = '解锁编辑摘要';
            } else {
                lockCommitBtn.innerHTML = '<i class="fas fa-lock-open"></i>';
                lockCommitBtn.title = '固定编辑摘要';
                state.currentCommitMessage = generateCommitMessage(
                    state.currentFieldUpdates,
                    state.currentTagUpdates,
                    state.currentSeriesUpdate
                );
                commitInput.value = state.currentCommitMessage;
            }
            saveState();
            updateConfirmButtonState();
        });

        const wcodeInput = document.getElementById('static-wcode-input');
        wcodeInput.addEventListener('input', (e) => {
            if (state.currentView === 'processing' && state.currentSubjectData) {
                state.currentWcode = e.target.value;
                updateDiffDisplay(
                    state.currentSubjectData.infobox || '',
                    e.target.value,
                    'static-content-diff-container'
                );
                updateConfirmButtonState();
            }
        });

        const tagsInput = document.getElementById('static-tags-input');
        tagsInput.addEventListener('input', (e) => {
            if (state.currentView === 'processing' && state.currentSubjectData) {
                state.currentTags = e.target.value;
                updateTagsDiffDisplay(
                    state.currentSubjectData.metaTags || [],
                    e.target.value.split(' ').filter(t => t),
                    'static-tags-diff-container'
                );
                updateConfirmButtonState();
            }
        });

        const seriesCheckbox = document.getElementById('static-series-checkbox');
        seriesCheckbox.addEventListener('change', (e) => {
            if (state.currentView === 'processing' && state.currentSubjectData) {
                state.currentSeries = e.target.checked;
                updateConfirmButtonState();
            }
        });
    }

    function updateConfirmButtonState() {
        const confirmBtn = document.querySelector('#static-buttons-container button#process-confirm-update');
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

    function checkForUpdates() {
        if (!state.currentSubjectData) return false;

        const currentWcode = document.getElementById('static-wcode-input').value;
        const currentTags = document.getElementById('static-tags-input').value.split(' ').filter(t => t);
        const currentSeries = document.getElementById('static-series-checkbox').checked;

        const originalWcode = state.currentSubjectData.infobox || '';
        const originalTags = state.currentSubjectData.metaTags || [];
        const originalSeries = state.currentSubjectData.series || false;

        const normalizedCurrentWcode = currentWcode.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
        const normalizedOriginalWcode = originalWcode.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
        const wcodeChanged = normalizedCurrentWcode !== normalizedOriginalWcode;

        const tagsChanged = !arraysEqual(currentTags, originalTags);
        const seriesChanged = currentSeries !== originalSeries;

        return wcodeChanged || tagsChanged || seriesChanged;
    }

    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    function switchToSetupView() {
        state.currentView = 'setup';
        const coreContent = document.getElementById('core-content');
        const buttonsContainer = document.getElementById('static-buttons-container');

        document.getElementById('edit-regions').style.display = 'none';
        hideProgressBar();

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
                    <label for="setup-csv-file">CSV文件 (包含ID、要更新的字段列、tags列或series列)</label>
                    <input type="file" id="setup-csv-file" accept=".csv">
                    ${state.csvData ? `<div style="margin-top: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; font-size: 14px;">已加载CSV: ${state.csvData.length} 条记录</div>` : ''}
                    <p style="font-size: 13px; color: #666; margin-top: 5px;">
                        tags列使用空格分隔标签，前缀带"-"的标签表示删除该标签<br>
                        series列使用true或false表示是否标记为系列
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

        buttonsContainer.innerHTML = `
            <button id="setup-start-processing" class="primary">开始处理</button>
        `;

        const accessTokenInput = document.getElementById('setup-access-token');
        if (accessTokenInput) {
            accessTokenInput.addEventListener('input', (e) => {
                state.accessToken = e.target.value;
                GM_setValue('bgmAccessToken', state.accessToken);
            });
        }

        const formhashInput = document.getElementById('setup-formhash');
        if (formhashInput) {
            formhashInput.addEventListener('input', (e) => {
                state.formhash = e.target.value;
                GM_setValue('bgmFormhash', state.formhash);
            });
        }

        const methodRadios = document.querySelectorAll('input[name="submit-method"]');
        methodRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                state.submitMethod = e.target.value;
                GM_setValue('bgmSubmitMethod', state.submitMethod);

                // 显示/隐藏对应选项
                document.getElementById('patch-method-options').classList.toggle('hidden', state.submitMethod !== 'patch');
                document.getElementById('post-method-options').classList.toggle('hidden', state.submitMethod !== 'post');
            });
        });

        const csvFileInput = document.getElementById('setup-csv-file');
        if (csvFileInput) {
            csvFileInput.addEventListener('change', handleFileUpload);
        }
    }

    function switchToProcessingView(itemData) {
        state.currentView = 'processing';
        const { currentItem, subjectData, historyData } = itemData;
        state.currentSubjectData = subjectData;
        state.currentItemId = currentItem.id;
        state.currentWcode = null;
        state.currentTags = null;
        state.currentSeries = null;
        state.currentCommitMessage = null;

        const coreContent = document.getElementById('core-content');
        const buttonsContainer = document.getElementById('static-buttons-container');
        const editRegions = document.getElementById('edit-regions');

        editRegions.style.display = 'block';
        showProgressBar();
        updateProgressBar(state.currentIndex, state.totalItems);

        const itemName = subjectData.name || '未知名称';
        const oldInfobox = subjectData.infobox || '';
        const oldTags = subjectData.metaTags || [];
        const oldSeries = subjectData.series || false;
        const fieldUpdates = getFieldUpdates(currentItem, oldInfobox);
        const tagUpdates = getTagUpdates(currentItem, oldTags);
        const seriesUpdate = getSeriesUpdate(currentItem, oldSeries);
        state.currentFieldUpdates = fieldUpdates;
        state.currentTagUpdates = tagUpdates;
        state.currentSeriesUpdate = seriesUpdate;

        const lastUpdateEl = document.getElementById('static-last-update');
        const lastUpdateTime = historyData[0]?.createdAt || 0;
        const lastUpdateDate = lastUpdateTime ? new Date(lastUpdateTime * 1000) : null;
        const lastCreator = historyData[0]?.creator.username || '';
        const lastCommitMessage = historyData[0]?.commitMessage || '';
        const shouldWarn = isRecentUpdate(lastUpdateTime);

        if (lastUpdateDate) {
            lastUpdateEl.innerHTML = `
                <a href="https://bgm.tv/subject/${currentItem.id}/edit" target="_blank">
                    最后更新: ${lastUpdateDate.toLocaleString()} ${lastCreator} ${lastCommitMessage}
                </a>
            `;
            lastUpdateEl.style.color = shouldWarn ? '#d9534f' : '';
            lastUpdateEl.style.display = 'block';
        } else {
            lastUpdateEl.style.display = 'none';
        }

        const prevLinkEl = document.getElementById('prev-item-link');
        if (state.previousItem && state.currentIndex > 0) {
            prevLinkEl.innerHTML = `
                <i class="fas fa-arrow-left"></i> 上一条目:
                <a href="https://bgm.tv/subject/${state.previousItem.id}" target="_blank">
                    ${state.previousItem.name}（${state.previousItem.id}）
                </a>
            `;
            prevLinkEl.style.display = 'block';
        } else {
            prevLinkEl.style.display = 'none';
        }

        const commitInput = document.getElementById('static-commit-input');
        const lockCommitBtn = document.getElementById('static-lock-commit');

        const defaultCommitMsg = generateCommitMessage(fieldUpdates, tagUpdates, seriesUpdate);
        commitInput.value = state.isCommitMessageLocked ? state.lockedCommitMessage : defaultCommitMsg;
        lockCommitBtn.innerHTML = `<i class="fas ${state.isCommitMessageLocked ? 'fa-lock' : 'fa-lock-open'}"></i>`;
        lockCommitBtn.title = state.isCommitMessageLocked ? '解锁编辑摘要' : '固定编辑摘要';

        const wcodeInput = document.getElementById('static-wcode-input');
        const contentDiffSection = document.getElementById('static-content-diff-container');

        const newInfobox = updateInfobox(oldInfobox, fieldUpdates);
        wcodeInput.value = newInfobox;
        updateDiffDisplay(oldInfobox, newInfobox, 'static-content-diff-container');
        contentDiffSection.style.display = 'block';

        const tagsInput = document.getElementById('static-tags-input');
        const tagsDiffSection = document.getElementById('static-tags-diff-container');

        const newTags = applyTagUpdates(oldTags, tagUpdates);
        tagsInput.value = newTags.join(' ');
        updateTagsDiffDisplay(oldTags, newTags, 'static-tags-diff-container');
        tagsDiffSection.style.display = 'block';

        const seriesCheckbox = document.getElementById('static-series-checkbox');
        // 应用CSV中的series设置，如果有的话
        const finalSeriesValue = seriesUpdate.hasUpdate ? seriesUpdate.newValue : oldSeries;
        seriesCheckbox.checked = finalSeriesValue;
        state.currentSeries = finalSeriesValue;

        coreContent.innerHTML = `
            <div>
                <div class="item-info">
                    当前条目：<a href="https://bgm.tv/subject/${currentItem.id}" target="_blank">${itemName}</a>（${currentItem.id}）
                </div>
            </div>
        `;

        buttonsContainer.innerHTML = `
            <button id="process-skip-update" class="secondary">跳过</button>
            <button id="process-confirm-update" class="primary">确认更新</button>
        `;

        updateConfirmButtonState();
    }

    function switchToProcessingErrorView(currentItem, errorMsg) {
        state.currentView = 'processing';
        const coreContent = document.getElementById('core-content');
        const buttonsContainer = document.getElementById('static-buttons-container');
        const editRegions = document.getElementById('edit-regions');

        editRegions.style.display = 'none';
        showProgressBar();
        updateProgressBar(state.currentIndex, state.totalItems);

        const itemId = currentItem.id;
        const currentRetryCount = (state.retryCount[itemId] || 0) + 1;
        state.retryCount[itemId] = currentRetryCount;

        coreContent.innerHTML = `
            <div>
                <div class="item-info">
                    当前条目：<a href="https://bgm.tv/subject/${itemId}" target="_blank">查看条目</a>（${itemId}）
                </div>
                <div class="status-box error">
                    无法获取条目信息: ${errorMsg}
                    ${currentRetryCount > 1 ? `<br>已重试 ${currentRetryCount - 1} 次` : ''}
                </div>
                <p>是否继续处理？</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${(state.currentIndex / state.totalItems) * 100}%"></div>
                </div>
            </div>
        `;

        buttonsContainer.innerHTML = `
            <button id="process-skip-error" class="secondary">跳过</button>
            <button id="process-retry-error" class="primary">重试</button>
        `;
    }

    function switchToUpdateErrorView(errorMsg) {
        state.currentView = 'processing';
        const coreContent = document.getElementById('core-content');
        const buttonsContainer = document.getElementById('static-buttons-container');
        const editRegions = document.getElementById('edit-regions');

        editRegions.style.display = 'none';
        showProgressBar();
        updateProgressBar(state.currentIndex, state.totalItems);

        const itemId = state.currentItemId;
        const currentRetryCount = (state.retryCount[itemId] || 0) + 1;
        state.retryCount[itemId] = currentRetryCount;

        const subjectData = state.currentSubjectData;
        const itemName = subjectData?.name || '未知名称';
        coreContent.innerHTML = `
            <div>
                <div class="item-info">
                    当前条目：<a href="https://bgm.tv/subject/${itemId}" target="_blank">${itemName}</a>（${itemId}）
                </div>
                <div class="status-box error">
                    提交更新失败: ${errorMsg}
                </div>
                <p>是否重试更新？</p>
            </div>
        `;

        buttonsContainer.innerHTML = `
            <button id="process-skip-update-fail" class="secondary">跳过</button>
            <button id="process-retry-update" class="primary">重试</button>
        `;
    }

    function switchToCompletedView() {
        state.currentView = 'completed';
        const coreContent = document.getElementById('core-content');
        const buttonsContainer = document.getElementById('static-buttons-container');
        const editRegions = document.getElementById('edit-regions');

        editRegions.style.display = 'none';
        showProgressBar();
        updateProgressBar(state.totalItems, state.totalItems);

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

        buttonsContainer.innerHTML = `
            <button id="completed-back-to-setup" class="primary">返回设置</button>
        `;
    }

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

        switch (btnId) {
            case 'process-confirm-update':
                const oldInfobox = subjectData.infobox || '';
                const oldTags = subjectData.metaTags || [];
                const oldSeries = subjectData.series || false;

                const finalWcode = document.getElementById('static-wcode-input').value;
                const finalTags = document.getElementById('static-tags-input').value.split(' ').filter(t => t);
                const finalSeries = document.getElementById('static-series-checkbox').checked;

                const commitMessage = document.getElementById('static-commit-input').value ||
                    generateCommitMessage(state.currentFieldUpdates, state.currentTagUpdates, state.currentSeriesUpdate);

                const hasUpdates = checkForUpdates();

                if (!hasUpdates) {
                    showStatusMessage('没有检测到实质修改，已跳过更新');

                    state.previousItem = {
                        id: itemId,
                        name: itemName
                    };

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
                        state.previousItem = {
                            id: itemId,
                            name: itemName
                        };

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
                state.previousItem = {
                    id: itemId,
                    name: itemName
                };

                state.currentIndex++;
                resetProcessingState();
                saveState();
                processNextItem();
                break;

            case 'process-confirm-continue':
                state.previousItem = {
                    id: itemId,
                    name: itemName
                };

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
                state.previousItem = {
                    id: itemId,
                    name: itemName
                };

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

    function showProgressBar() {
        document.getElementById('bgm-tool-progress').style.display = 'block';
    }

    function updateProgressBar(current, total) {
        document.getElementById('progress-text').textContent = `处理进度: ${current}/${total}`;
        const percentage = total > 0 ? (current / total) * 100 : 0;
        document.getElementById('progress-bar').style.width = `${percentage}%`;
    }

    function hideProgressBar() {
        document.getElementById('bgm-tool-progress').style.display = 'none';
    }

    function showLoadingOverlay(text) {
        const overlay = document.getElementById('bgm-loading-overlay');
        const textElement = document.getElementById('loading-text');
        textElement.textContent = text;
        overlay.classList.add('active');
    }

    function hideLoadingOverlay() {
        const overlay = document.getElementById('bgm-loading-overlay');
        overlay.classList.remove('active');
    }

    function showStatusMessage(text) {
        const message = document.getElementById('bgm-status-message');
        message.classList.remove('show');
        void message.offsetWidth;
        message.textContent = text;
        message.classList.add('show');

        setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }

    function hideStatusMessage() {
        const message = document.getElementById('bgm-status-message');
        message.classList.remove('show');
    }

    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        document.querySelectorAll('#static-buttons-container button').forEach(btn => {
            btn.disabled = true;
        });
        showLoadingOverlay('正在解析CSV文件...');

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const csvContent = event.target.result;
                state.csvData = parseCSV(csvContent);
                state.currentIndex = 0;
                state.retryCount = {};
                state.previousItem = null;
                localStorage.setItem('bgmCsvData', JSON.stringify(state.csvData));
                localStorage.setItem('bgmCurrentIndex', '0');
                switchToSetupView();
                showStatusMessage('CSV文件加载成功');
            } catch (error) {
                showStatusMessage('CSV解析错误: ' + error.message);
                console.error(error);
            } finally {
                hideLoadingOverlay();
                document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                    btn.disabled = false;
                });
            }
        };
        reader.readAsText(file);
    }

    function parseCSV(csvContent) {
        const lines = csvContent.split('\n')
            .map(line => line.trim())
            .filter(line => line);

        if (lines.length < 2) {
            throw new Error('CSV至少需要标题行和一条数据');
        }

        const headers = lines[0].split(',').map(h => h.trim());
        const idIndex = headers.findIndex(h => h.toLowerCase() === 'id');

        if (idIndex === -1) {
            throw new Error('CSV必须包含"ID"列');
        }

        const fieldNames = headers.filter((h, i) => i !== idIndex);
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const id = values[idIndex]?.trim();

            if (id) {
                const item = { id };
                fieldNames.forEach(fieldName => {
                    const valueIndex = headers.indexOf(fieldName);
                    if (valueIndex !== -1) {
                        item[fieldName] = values[valueIndex]?.trim() || '';
                    }
                });
                data.push(item);
            }
        }

        if (data.length === 0) {
            throw new Error('未找到有效的数据行');
        }

        return data;
    }

    function parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        let quoteChar = '';

        for (let i = 0; i < line.length; i++) {
            const c = line[i];

            if ((c === '"' || c === "'") && (!inQuotes || quoteChar === c)) {
                if (inQuotes && i > 0 && line[i - 1] !== '\\') {
                    inQuotes = false;
                } else if (!inQuotes) {
                    inQuotes = true;
                    quoteChar = c;
                } else {
                    current += c;
                }
                continue;
            }

            if (c === ',' && !inQuotes) {
                values.push(current);
                current = '';
                continue;
            }

            current += c;
        }

        values.push(current);
        return values;
    }

    function startProcessing() {
        // 验证所选提交方式的必要参数
        if (state.submitMethod === 'patch' && !state.accessToken) {
            showStatusMessage('请输入Access Token');
            return;
        }

        if (state.submitMethod === 'post' && !state.formhash) {
            showStatusMessage('请输入Formhash');
            return;
        }

        if (!state.csvData || state.csvData.length === 0) {
            showStatusMessage('请上传有效的CSV文件');
            return;
        }

        state.totalItems = state.csvData.length;
        state.processing = true;
        state.paused = false;

        const coreContent = document.getElementById('core-content');
        coreContent.innerHTML = `
            <div>
                <div class="item-info">准备处理第一个条目...</div>
            </div>
        `;

        const buttonsContainer = document.getElementById('static-buttons-container');
        buttonsContainer.innerHTML = `
            <button id="process-cancel" class="danger">取消</button>
        `;

        processNextItem();
    }

    function processNextItem(isRetry = false) {
        if (state.paused || !state.processing) return;

        if (state.currentIndex >= state.totalItems) {
            switchToCompletedView();
            return;
        }

        const currentItem = state.csvData[state.currentIndex];
        if (!isRetry) {
            updateProgressBar(state.currentIndex, state.totalItems);
        }

        document.querySelectorAll('#static-buttons-container button').forEach(btn => {
            btn.disabled = true;
        });
        showLoadingOverlay('正在获取条目信息...');

        Promise.all([
            GM_fetch(`/p1/wiki/subjects/${currentItem.id}`, {
                headers: state.submitMethod === 'patch' ? {
                    'Authorization': `Bearer ${state.accessToken}`,
                    'Accept': 'application/json'
                } : {
                    'Accept': 'application/json'
                }
            }),
            GM_fetch(`/p1/wiki/subjects/${currentItem.id}/history-summary`, {
                headers: state.submitMethod === 'patch' ? {
                    'Authorization': `Bearer ${state.accessToken}`,
                    'Accept': 'application/json'
                } : {
                    'Accept': 'application/json'
                }
            })
        ])
            .then(async ([subjectResponse, historyResponse]) => {
                if (!subjectResponse.ok) throw new Error(`HTTP ${subjectResponse.status}`);
                if (!historyResponse.ok) throw new Error(`HTTP ${historyResponse.status}`);

                const subjectData = await subjectResponse.json();
                const historyData = await historyResponse.json();
                return { currentItem, subjectData, historyData };
            })
            .then((itemData) => {
                state.retryCount[itemData.currentItem.id] = 0;
                hideLoadingOverlay();
                document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                    btn.disabled = false;
                });

                switchToProcessingView(itemData);
            })
            .catch(error => {
                hideLoadingOverlay();
                document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                    btn.disabled = false;
                });

                switchToProcessingErrorView(currentItem, error.message);
            });
    }

    // 核心修改：支持两种提交方式，series为布尔值
    function submitUpdate(itemId, newWcode, newTags, newSeries, itemName, currentItem, commitMessage, onSuccess, onError) {
        state.processing = true;

        // 根据选择的提交方式处理
        if (state.submitMethod === 'patch') {
            // PATCH API方式
            GM_fetch(`/p1/wiki/subjects/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${state.accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    commitMessage: commitMessage,
                    subject: {
                        infobox: newWcode,
                        metaTags: newTags,
                        series: newSeries // series为布尔值
                    }
                })
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => {
                            throw new Error(`HTTP ${response.status} - ${text || '更新失败'}`);
                        });
                    }
                    return response;
                })
                .then(() => {
                    hideLoadingOverlay();
                    onSuccess();
                })
                .catch(error => {
                    onError(error);
                });
        } else {
            // POST表单提交方式
            // 确保换行符是\r\n
            const formattedInfobox = newWcode.replace(/\n/g, '\r\n');

            // 构建表单数据
            const formData = new FormData();
            formData.append('formhash', state.formhash);
            formData.append('subject_title', state.currentSubjectData.name || '');
            formData.append('platform', state.currentSubjectData.platform || '');
            formData.append('subject_infobox', formattedInfobox);
            formData.append('subject_summary', state.currentSubjectData.summary || '');
            formData.append('subject_meta_tags', newTags.join(' '));
            formData.append('editSummary', commitMessage);
            formData.append('series', newSeries ? '1' : '0'); // 系列状态，1为是，0为否
            formData.append('submit', '提交');

            // 转换为URL编码的字符串
            const formParams = new URLSearchParams();
            formData.forEach((value, key) => {
                formParams.append(key, value);
            });

            GM.xmlHttpRequest({
                method: 'POST',
                url: `https://bgm.tv/subject/${itemId}/new_revision`,
                data: formParams.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: function (response) {
                    hideLoadingOverlay();

                    // 检查标题判断是否成功
                    const successPattern = new RegExp(`${itemName} 的新描述`);
                    if (successPattern.test(response.responseText)) {
                        onError(new Error('更新失败，可能是formhash无效或权限不足'));
                    } else {
                        onSuccess();
                    }
                },
                onerror: function (error) {
                    hideLoadingOverlay();
                    onError(new Error(`网络错误: ${error.message}`));
                },
                onabort: function () {
                    hideLoadingOverlay();
                    onError(new Error('请求已中止'));
                },
                ontimeout: function () {
                    hideLoadingOverlay();
                    onError(new Error('请求超时'));
                }
            });
        }
    }

    function generateCommitMessage(fieldUpdates, tagUpdates, seriesUpdate) {
        const updatedFields = Object.keys(fieldUpdates || {});
        const messages = [];

        if (updatedFields.length) messages.push(`更新${updatedFields.join('、')}`);
        if (tagUpdates?.add.length) messages.push(`添加标签${tagUpdates.add.join('、')}`);
        if (tagUpdates?.remove.length) messages.push(`删除标签${tagUpdates.remove.join('、')}`);
        if (seriesUpdate?.hasUpdate) {
            messages.push(seriesUpdate.newValue ? '标记为系列' : '取消系列标记');
        }

        return messages.filter(s => s).join('；') || '更新条目信息';
    }

    function updateDiffDisplay(oldText, newText, containerId) {
        try {
            const normalizedOld = (oldText || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            const normalizedNew = (newText || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            const fileName = `条目 ${state.currentSubjectData?.name || '未知名称'} - ${state.currentItemId}`;
            const diffString = Diff.createPatch(fileName, normalizedOld, normalizedNew);
            const configuration = {
                drawFileList: false,
                fileListToggle: false,
                fileContentToggle: false,
                matching: 'lines',
                highlight: false
            };

            const container = document.getElementById(containerId);
            const diff2htmlUi = new Diff2HtmlUI(container, diffString, configuration);
            diff2htmlUi.draw();

            const scripts = container.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                newScript.textContent = script.textContent;
                script.parentNode.replaceChild(newScript, script);
            });

            document.getElementById('diff-error').style.display = 'none';
        } catch (e) {
            console.error('Diff generation error:', e);
            document.getElementById('diff-error').textContent = `差异显示错误: ${e.message}`;
            document.getElementById('diff-error').style.display = 'block';
        }
    }

    function updateTagsDiffDisplay(oldTags, newTags, containerId) {
        const oldText = oldTags.join(' ');
        const newText = newTags.join(' ');
        updateDiffDisplay(oldText, newText, containerId);
    }

    function getFieldUpdates(csvItem, oldInfobox) {
        const updates = {};
        Object.keys(csvItem).forEach(key => {
            if (!['id', 'tags', 'series'].includes(key.toLowerCase())) {
                updates[key] = csvItem[key];
            }
        });
        return updates;
    }

    function getTagUpdates(csvItem, oldTags) {
        const tagsStr = csvItem.tags || '';
        const tags = tagsStr.split(' ').filter(t => t);

        const add = [];
        const remove = [];

        tags.forEach(tag => {
            if (tag.startsWith('-')) {
                remove.push(tag.slice(1));
            } else {
                add.push(tag);
            }
        });

        return { add, remove };
    }

    function getSeriesUpdate(csvItem, oldSeries) {
        // 检查CSV中是否有series列
        if (csvItem.series === undefined || csvItem.series === null || csvItem.series === '') {
            return { hasUpdate: false };
        }

        // 解析CSV中的series值，支持true/false, 1/0, yes/no
        const seriesValue = csvItem.series.trim().toLowerCase();
        const newValue = seriesValue === 'true' || seriesValue === '1' || seriesValue === 'yes';

        return {
            hasUpdate: newValue !== oldSeries,
            newValue: newValue
        };
    }

    function updateInfobox(oldInfobox, fieldUpdates) {
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

    function applyTagUpdates(oldTags, tagUpdates) {
        const newTagsSet = new Set(oldTags);
        tagUpdates.add.forEach(tag => newTagsSet.add(tag));
        tagUpdates.remove.forEach(tag => newTagsSet.delete(tag));
        return [...newTagsSet];
    }

    function isRecentUpdate(timestamp) {
        if (!timestamp) return false;
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
        return timestamp * 1000 > twentyFourHoursAgo;
    }

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

    function sanitizeRegExp(str) {
        const regexSpecialChars = /[.*+?^${}()|[\]\\]/g;
        return str.replace(regexSpecialChars, '\\$&');
    }

    createStaticDOM();
})();
