// ==UserScript==
// @name         bangumi wiki 批量更新工具
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  支持更新任意字段和标签，可选择需要修改的CSV列，显示最后更新时间，并提供更新警告
// @author       You
// @match        https://next.bgm.tv/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.2.0/diff.min.js
// @require      https://unpkg.com/diff2html/bundles/js/diff2html-ui.min.js
// @license      MIT
// ==/UserScript==

// 灰白简约风格样式（保持不变）
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

#bgm-tool-view-log {
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

#bgm-tool-view-log:hover {
    background: #e9ecef;
}

#bgm-tool-close {
    cursor: pointer;
    color: #666666;
    font-size: 18px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s ease;
}

#bgm-tool-close:hover {
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

/* 提示条样式和动画 */
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
    display: block;
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
    min-height: 100px;
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

/* 搜索框样式 */
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

/* 过滤按钮组 */
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

/* 布局样式 */
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

/* 核心内容容器：一次性创建，后续只更新内容 */
#core-content {
    width: 100%;
}

/* 按钮容器：一次性创建，事件委托绑定 */
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

/* 编辑区域样式：一次性创建容器 */
.edit-area {
    margin: 15px 0;
    display: none; /* 默认隐藏，按需显示 */
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
    display: none; /* 默认隐藏，按需显示 */
}

.tags-edit-area input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
}

.last-update-info {
    font-size: 14px;
    color: #666;
    margin: 10px 0;
    display: none; /* 默认隐藏，按需显示 */
}

.commit-message-area {
    margin: 15px 0;
    display: none; /* 默认隐藏，按需显示 */
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
    display: none; /* 默认隐藏，按需显示 */
}

.diff-section-title {
    font-weight: 600;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #e0e0e0;
}

/* https://github.com/rtfpessoa/diff2html/issues/381#issuecomment-909260886 */
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

/* 悬浮按钮样式 */
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

/* 状态容器：一次性创建，按需显示 */
#status-container {
    margin: 15px 0;
    display: none;
}

/* 列选择样式 */
.columns-selection {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    margin: 15px 0;
}

.column-item {
    padding: 10px 15px;
    border-bottom: 1px solid #f1f1f1;
    display: flex;
    align-items: center;
}

.column-item:last-child {
    border-bottom: none;
}

.column-item:hover {
    background-color: #f8f9fa;
}

.column-item input {
    margin-right: 10px;
}

.column-item label {
    margin: 0;
    flex-grow: 1;
}

.column-description {
    font-size: 12px;
    color: #666;
    margin-top: 3px;
}

/* 参考信息样式 */
.reference-info {
    margin: 15px 0;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
}

.reference-title {
    font-weight: 600;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #e0e0e0;
}

.reference-fields {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
}

.reference-field {
    font-size: 14px;
}

.reference-field-name {
    color: #666;
    font-weight: 500;
}
`);

// 加载外部资源（保持不变）
const diffLink = document.createElement('link');
diffLink.rel = 'stylesheet';
diffLink.href = 'https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css';
document.head.appendChild(diffLink);

const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
document.head.appendChild(fontAwesome);

// 创建悬浮按钮（保持不变）
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

    // 状态管理（添加列选择相关状态）
    const state = {
        accessToken: localStorage.getItem('bgmAccessToken') || '',
        csvData: JSON.parse(localStorage.getItem('bgmCsvData') || 'null'),
        csvHeaders: JSON.parse(localStorage.getItem('bgmCsvHeaders') || '[]'), // 新增：CSV列头
        selectedColumns: JSON.parse(localStorage.getItem('bgmSelectedColumns') || '[]'), // 新增：选中的列
        currentIndex: parseInt(localStorage.getItem('bgmCurrentIndex') || '0'),
        totalItems: 0,
        results: JSON.parse(localStorage.getItem('bgmResults') || '{"success":0,"failed":0,"logs":[]}'),
        processing: false,
        paused: false,
        currentView: 'setup', // 当前视图: setup, columns-selection, processing, logs, completed
        currentSubjectData: null, // 当前处理的条目数据
        currentFieldUpdates: null, // 当前字段更新
        currentTagUpdates: null, // 当前标签更新
        currentWikitext: null, // 当前编辑的Wikitext
        currentTags: null, // 当前编辑的标签
        currentCommitMessage: null, // 当前编辑摘要
        isCommitMessageLocked: localStorage.getItem('bgmIsCommitMessageLocked') === 'true' || false,
        lockedCommitMessage: localStorage.getItem('bgmLockedCommitMessage') || '',
        retryCount: {}, // 记录每个条目的重试次数
        // 新增：当前处理的条目ID（用于事件委托时定位上下文）
        currentItemId: null
    };

    // --------------------------
    // 核心优化1：一次性创建固定DOM结构
    // --------------------------
    function createStaticDOM() {
        // 先隐藏悬浮按钮
        const floatBtn = createFloatButton();
        floatBtn.style.display = 'none';

        // 主容器：只创建一次
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
                    <span id="bgm-tool-view-log" title="查看日志"><i class="fas fa-history"></i></span>
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
                <!-- 核心内容容器：后续只更新内部HTML -->
                <div id="bgm-tool-body">
                    <div id="core-content"></div>
                    <!-- 编辑区域容器：一次性创建，按需显示/隐藏 -->
                    <div id="edit-regions" style="display: none;">
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
                        <div class="edit-area" id="static-wikitext-area">
                            <label>WikiText:</label>
                            <textarea id="static-wikitext-input"></textarea>
                        <div id="static-content-diff-container" class="diff-container"></div>
                        </div>
                        <div class="tags-edit-area" id="static-tags-area">
                            <label>标签 (空格分隔):</label>
                            <input type="text" id="static-tags-input">
                        <div id="static-tags-diff-container" class="diff-container"></div>
                        </div>
                        <div id="diff-error" style="color: #a72e2e; font-size: 14px; margin-top: 8px; display: none;"></div>
                        <div id="status-container" class="status-box"></div>
                    </div>
                </div>
                <!-- 按钮容器：一次性创建，事件委托绑定 -->
                <div class="buttons-container" id="static-buttons-container"></div>
                <!-- 加载遮罩：只创建一次 -->
                <div id="bgm-loading-overlay">
                    <div id="loading-spinner"></div>
                    <div id="loading-text"></div>
                </div>
            </div>
            <!-- 状态消息：只创建一次 -->
            <div id="bgm-status-message"></div>
        `;
        document.body.appendChild(container);

        // --------------------------
        // 核心优化2：事件委托（只绑定一次）
        // --------------------------
        bindEventDelegation();

        // 头部按钮事件（只绑定一次）
        document.getElementById('bgm-tool-close').addEventListener('click', () => {
            container.style.display = 'none';
            createFloatButton().style.display = 'flex';
            hideStatusMessage();
            saveState();
        });

        document.getElementById('bgm-tool-view-log').addEventListener('click', () => {
            switchToLogsView();
        });

        // 编辑区固定事件（只绑定一次，避免反复绑定）
        bindEditRegionEvents();

        // 初始显示设置视图
        switchToSetupView();
    }

    // --------------------------
    // 核心优化2：事件委托实现（统一处理所有按钮事件）
    // --------------------------
    function bindEventDelegation() {
        const buttonsContainer = document.getElementById('static-buttons-container');

        buttonsContainer.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('button');
            if (!targetBtn) return;

            const btnId = targetBtn.id;
            const currentView = state.currentView;

            // 根据当前视图和按钮ID分发事件
            switch (currentView) {
                case 'setup':
                    handleSetupViewButtons(btnId);
                    break;
                case 'columns-selection': // 新增：列选择视图
                    handleColumnsSelectionViewButtons(btnId);
                    break;
                case 'processing':
                    handleProcessingViewButtons(btnId);
                    break;
                case 'logs':
                    handleLogsViewButtons(btnId);
                    break;
                case 'completed':
                    handleCompletedViewButtons(btnId);
                    break;
            }
        });
    }

    // 编辑区固定事件（只绑定一次，避免反复绑定）
    function bindEditRegionEvents() {
        // 1. 编辑摘要输入事件
        const commitInput = document.getElementById('static-commit-input');
        commitInput.addEventListener('input', (e) => {
            if (state.currentView === 'processing' && state.currentSubjectData) {
                state.currentCommitMessage = e.target.value;
            }
        });

        // 2. 编辑摘要锁定/解锁事件
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
                // 重新生成默认摘要
                state.currentCommitMessage = generateCommitMessage(
                    state.currentFieldUpdates,
                    state.currentTagUpdates
                );
                commitInput.value = state.currentCommitMessage;
            }
            saveState();
        });

        // 3. WikiText编辑事件
        const wikitextInput = document.getElementById('static-wikitext-input');
        wikitextInput.addEventListener('input', (e) => {
            if (state.currentView === 'processing' && state.currentSubjectData) {
                state.currentWikitext = e.target.value;
                updateDiffDisplay(
                    state.currentSubjectData.infobox || '',
                    e.target.value,
                    'static-content-diff-container'
                );
            }
        });

        // 4. 标签编辑事件
        const tagsInput = document.getElementById('static-tags-input');
        tagsInput.addEventListener('input', (e) => {
            if (state.currentView === 'processing' && state.currentSubjectData) {
                state.currentTags = e.target.value;
                updateTagsDiffDisplay(
                    state.currentSubjectData.metaTags || [],
                    e.target.value.split(' ').filter(t => t),
                    'static-tags-diff-container'
                );
            }
        });

        // 5. 日志搜索事件（只绑定一次）
        const logSearch = document.createElement('input');
        logSearch.id = 'log-search';
        logSearch.type = 'text';
        logSearch.placeholder = '搜索日志...';
        logSearch.style.display = 'none'; // 默认隐藏
        document.getElementById('core-content').appendChild(logSearch);

        logSearch.addEventListener('input', (e) => {
            if (state.currentView !== 'logs') return;

            const searchTerm = e.target.value.toLowerCase();
            const logEntries = document.querySelectorAll('.log-entry');
            logEntries.forEach(entry => {
                const content = entry.getAttribute('data-content').toLowerCase();
                entry.style.display = content.includes(searchTerm) ? '' : 'none';
            });
        });

        // 6. 日志过滤事件（委托到核心内容容器）
        document.getElementById('core-content').addEventListener('click', (e) => {
            if (state.currentView !== 'logs') return;

            const filterBtn = e.target.closest('.filter-btn');
            if (!filterBtn) return;

            // 移除所有按钮的active状态
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // 激活当前按钮
            filterBtn.classList.add('active');

            // 过滤日志
            const filter = filterBtn.getAttribute('data-filter');
            const logEntries = document.querySelectorAll('.log-entry');
            logEntries.forEach(entry => {
                entry.style.display = (filter === 'all' || entry.getAttribute('data-status') === filter)
                    ? '' : 'none';
            });
        });
    }

    // --------------------------
    // 视图切换逻辑（只更新内容，不重建DOM）
    // --------------------------
    // 1. 切换到设置视图
    function switchToSetupView() {
        state.currentView = 'setup';
        const coreContent = document.getElementById('core-content');
        const buttonsContainer = document.getElementById('static-buttons-container');

        // 隐藏编辑区和进度条
        document.getElementById('edit-regions').style.display = 'none';
        hideProgressBar();

        // 更新核心内容（只更新HTML，不重建容器）
        coreContent.innerHTML = `
            <div>
                <h3 class="section-title">基本设置</h3>
                <div class="form-group">
                    <label for="setup-access-token">Access Token</label>
                    <input type="password" id="setup-access-token" value="${state.accessToken}">
                    <p style="font-size: 13px; color: #666; margin-top: 5px;">
                        您可以在<a href="https://next.bgm.tv/demo/access-token" target="_blank">个人令牌页</a>中获取 Access Token
                    </p>
                </div>
                <div class="form-group">
                    <label for="setup-csv-file">CSV文件 (包含ID、要更新的字段列或tags列)</label>
                    <input type="file" id="setup-csv-file" accept=".csv">
                    ${state.csvData ? `<div style="margin-top: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; font-size: 14px;">已加载CSV: ${state.csvData.length} 条记录，共 ${state.csvHeaders.length} 列</div>` : ''}
                    <p style="font-size: 13px; color: #666; margin-top: 5px;">
                        tags列使用空格分隔标签，前缀带"-"的标签表示删除该标签
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

        // 更新按钮组（只更新按钮，不重建容器）
        buttonsContainer.innerHTML = `
            <button id="setup-start-processing" class="primary">开始处理</button>
        `;

        // 绑定设置视图独有的输入事件（只绑定一次，后续复用）
        const accessTokenInput = document.getElementById('setup-access-token');
        if (accessTokenInput) {
            accessTokenInput.addEventListener('input', (e) => {
                state.accessToken = e.target.value;
                localStorage.setItem('bgmAccessToken', state.accessToken);
            });
        }

        const csvFileInput = document.getElementById('setup-csv-file');
        if (csvFileInput) {
            csvFileInput.addEventListener('change', handleFileUpload);
        }
    }

    // 新增：2. 切换到列选择视图
    function switchToColumnsSelectionView() {
        state.currentView = 'columns-selection';
        const coreContent = document.getElementById('core-content');
        const buttonsContainer = document.getElementById('static-buttons-container');

        // 隐藏编辑区和进度条
        document.getElementById('edit-regions').style.display = 'none';
        hideProgressBar();

        // 如果没有选择任何列，默认选中tags列（如果存在）
        if (state.selectedColumns.length === 0 && state.csvHeaders.length > 0) {
            state.selectedColumns = state.csvHeaders
                .filter(header => header.toLowerCase() === 'tags')
                .map(header => header);
        }

        // 生成列选择HTML
        const columnsHTML = state.csvHeaders
            .filter(header => header.toLowerCase() !== 'id') // ID列不参与选择，必须包含
            .map(header => {
                const isSelected = state.selectedColumns.includes(header);
                const isTagsColumn = header.toLowerCase() === 'tags';
                return `
                    <div class="column-item">
                        <input type="checkbox" id="column-${header}" ${isSelected ? 'checked' : ''}
                               data-column="${header}">
                        <label for="column-${header}">
                            ${header}
                            ${isTagsColumn ? '<span class="column-description">标签列（空格分隔，-前缀表示删除）</span>' : ''}
                        </label>
                    </div>
                `;
            }).join('');

        // 更新核心内容
        coreContent.innerHTML = `
            <div>
                <h3 class="section-title">选择需要更新的列</h3>
                <p>请选择CSV中需要用于更新的列，未选中的列将仅作为参考信息显示。</p>
                <p style="color: #666; font-size: 14px;">提示：ID列将自动包含，无需选择。</p>

                <div class="columns-selection">
                    ${columnsHTML}
                </div>

                <div style="margin-top: 15px;">
                    <button id="select-all-columns" class="secondary">全选</button>
                    <button id="deselect-all-columns" class="secondary">取消全选</button>
                </div>
            </div>
        `;

        // 更新按钮组
        buttonsContainer.innerHTML = `
            <button id="columns-back" class="secondary">返回</button>
            <button id="columns-continue" class="primary">继续处理</button>
        `;

        // 绑定列选择事件
        document.querySelectorAll('.column-item input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const column = e.target.getAttribute('data-column');
                if (e.target.checked) {
                    if (!state.selectedColumns.includes(column)) {
                        state.selectedColumns.push(column);
                    }
                } else {
                    state.selectedColumns = state.selectedColumns.filter(c => c !== column);
                }
            });
        });

        // 全选/取消全选事件
        document.getElementById('select-all-columns').addEventListener('click', () => {
            const columnsToSelect = state.csvHeaders
                .filter(header => header.toLowerCase() !== 'id');

            state.selectedColumns = [...new Set(columnsToSelect)];
            document.querySelectorAll('.column-item input').forEach(checkbox => {
                checkbox.checked = true;
            });
        });

        document.getElementById('deselect-all-columns').addEventListener('click', () => {
            state.selectedColumns = [];
            document.querySelectorAll('.column-item input').forEach(checkbox => {
                checkbox.checked = false;
            });
        });
    }

    // 3. 切换到处理视图（条目编辑）
    function switchToProcessingView(itemData) {
        state.currentView = 'processing';
        const { currentItem, subjectData, historyData } = itemData;
        state.currentSubjectData = subjectData;
        state.currentItemId = currentItem.id;
        state.currentWikitext = null;
        state.currentTags = null;
        state.currentCommitMessage = null;

        const coreContent = document.getElementById('core-content');
        const buttonsContainer = document.getElementById('static-buttons-container');
        const editRegions = document.getElementById('edit-regions');

        // 显示编辑区和全局进度条
        editRegions.style.display = 'block';
        showProgressBar();
        updateProgressBar(state.currentIndex, state.totalItems);

        // 1. 处理基础数据
        const itemName = subjectData.name || '未知名称';
        const oldInfobox = subjectData.infobox || '';
        const oldTags = subjectData.metaTags || [];
        const fieldUpdates = getFieldUpdates(currentItem, oldInfobox);
        const tagUpdates = getTagUpdates(currentItem, oldTags);
        state.currentFieldUpdates = fieldUpdates;
        state.currentTagUpdates = tagUpdates;

        // 2. 处理最后更新时间（只更新内容，不重建容器）
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

        // 3. 处理编辑摘要区（只更新值和显示状态）
        const commitArea = document.getElementById('static-commit-area');
        const commitInput = document.getElementById('static-commit-input');
        const lockCommitBtn = document.getElementById('static-lock-commit');

        const defaultCommitMsg = generateCommitMessage(fieldUpdates, tagUpdates);
        commitInput.value = state.isCommitMessageLocked ? state.lockedCommitMessage : defaultCommitMsg;
        lockCommitBtn.innerHTML = `<i class="fas ${state.isCommitMessageLocked ? 'fa-lock' : 'fa-lock-open'}"></i>`;
        lockCommitBtn.title = state.isCommitMessageLocked ? '解锁编辑摘要' : '固定编辑摘要';
        commitArea.style.display = 'block';

        // 4. 处理WikiText编辑区（只更新值和显示状态）
        const wikitextArea = document.getElementById('static-wikitext-area');
        const wikitextInput = document.getElementById('static-wikitext-input');
        const contentDiffSection = document.getElementById('static-content-diff-container');

        const newInfobox = updateInfobox(oldInfobox, fieldUpdates);
        wikitextInput.value = newInfobox;
        wikitextArea.style.display = 'block';
        // 更新差异（复用固定容器）
        updateDiffDisplay(oldInfobox, newInfobox, 'static-content-diff-container');
        contentDiffSection.style.display = 'block';

        // 5. 处理标签编辑区（只更新值和显示状态）
        const tagsArea = document.getElementById('static-tags-area');
        const tagsInput = document.getElementById('static-tags-input');
        const tagsDiffSection = document.getElementById('static-tags-diff-container');

        const newTags = applyTagUpdates(oldTags, tagUpdates);
        tagsInput.value = newTags.join(' ');
        tagsArea.style.display = 'block';
        updateTagsDiffDisplay(oldTags, newTags, 'static-tags-diff-container');
        tagsDiffSection.style.display = 'block';

        // 6. 处理状态提示和条目进度（只更新内容）
        const statusContainer = document.getElementById('status-container');

        statusContainer.style.display = 'none';

        // 7. 生成参考信息HTML（未选中的列）
        const referenceFields = Object.entries(currentItem)
            .filter(([key]) =>
                key.toLowerCase() !== 'id' &&
                !state.selectedColumns.includes(key) &&
                state.csvHeaders.includes(key)
            );

        let referenceHTML = '';
        if (referenceFields.length > 0) {
            referenceHTML = `
                <div class="reference-info">
                    <div class="reference-title">参考信息（不参与更新）</div>
                    <div class="reference-fields">
                        ${referenceFields.map(([name, value]) => `
                            <div class="reference-field">
                                <span class="reference-field-name">${name}:</span> ${value || '无'}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // 8. 更新核心内容（只显示条目信息，其他内容在固定编辑区）
        coreContent.innerHTML = `
            <div>
                <div class="item-info">
                    当前条目：<a href="https://bgm.tv/subject/${currentItem.id}" target="_blank">${itemName}</a>（${currentItem.id}）
                </div>
                ${referenceHTML}
            </div>
        `;

        // 9. 更新按钮组（根据是否有更新切换按钮）
        buttonsContainer.innerHTML = `
            <button id="process-skip-update" class="secondary">跳过</button>
            <button id="process-confirm-update" class="primary">确认更新</button>
        `;
    }

    // 4. 切换到处理错误视图（复用容器，只更新内容）
    function switchToProcessingErrorView(currentItem, errorMsg) {
        state.currentView = 'processing';
        const coreContent = document.getElementById('core-content');
        const buttonsContainer = document.getElementById('static-buttons-container');
        const editRegions = document.getElementById('edit-regions');

        // 隐藏编辑区，显示全局进度条
        editRegions.style.display = 'none';
        showProgressBar();
        updateProgressBar(state.currentIndex, state.totalItems);

        // 计算重试次数
        const itemId = currentItem.id;
        const currentRetryCount = (state.retryCount[itemId] || 0) + 1;
        state.retryCount[itemId] = currentRetryCount;

        // 生成参考信息HTML（未选中的列）
        const referenceFields = Object.entries(currentItem)
            .filter(([key]) =>
                key.toLowerCase() !== 'id' &&
                !state.selectedColumns.includes(key) &&
                state.csvHeaders.includes(key)
            );

        let referenceHTML = '';
        if (referenceFields.length > 0) {
            referenceHTML = `
                <div class="reference-info">
                    <div class="reference-title">参考信息（不参与更新）</div>
                    <div class="reference-fields">
                        ${referenceFields.map(([name, value]) => `
                            <div class="reference-field">
                                <span class="reference-field-name">${name}:</span> ${value || '无'}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // 更新核心内容（只更新HTML）
        coreContent.innerHTML = `
            <div>
                <div class="item-info">
                    当前条目：<a href="https://bgm.tv/subject/${itemId}" target="_blank">查看条目</a>（${itemId}）
                </div>
                <div class="status-box error">
                    无法获取条目信息: ${errorMsg}
                    ${currentRetryCount > 1 ? `<br>已重试 ${currentRetryCount - 1} 次` : ''}
                </div>
                ${referenceHTML}
                <p>是否继续处理？</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${(state.currentIndex / state.totalItems) * 100}%"></div>
                </div>
            </div>
        `;

        // 更新按钮组
        buttonsContainer.innerHTML = `
            <button id="process-skip-error" class="secondary">跳过</button>
            <button id="process-retry-error" class="primary">重试</button>
        `;
    }

    // 5. 切换到更新失败视图（复用容器，只更新内容）
    function switchToUpdateErrorView(errorMsg) {
        state.currentView = 'processing';
        const coreContent = document.getElementById('core-content');
        const buttonsContainer = document.getElementById('static-buttons-container');
        const editRegions = document.getElementById('edit-regions');

        // 隐藏编辑区，显示全局进度条
        editRegions.style.display = 'none';
        showProgressBar();
        updateProgressBar(state.currentIndex, state.totalItems);

        // 计算重试次数
        const itemId = state.currentItemId;
        const currentRetryCount = (state.retryCount[itemId] || 0) + 1;
        state.retryCount[itemId] = currentRetryCount;

        // 更新核心内容
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

        // 更新按钮组
        buttonsContainer.innerHTML = `
            <button id="process-skip-update-fail" class="secondary">跳过</button>
            <button id="process-retry-update" class="primary">重试</button>
        `;
    }

    // 6. 切换到日志视图（只更新内容，复用搜索/过滤容器）
    function switchToLogsView() {
        state.currentView = 'logs';
        const coreContent = document.getElementById('core-content');
        const buttonsContainer = document.getElementById('static-buttons-container');
        const editRegions = document.getElementById('edit-regions');

        // 隐藏编辑区和全局进度条
        editRegions.style.display = 'none';
        hideProgressBar();

        // 生成日志HTML（只更新内容，不重建容器）
        let logsHTML = '';
        if (state.results.logs.length === 0) {
            logsHTML = '<div class="status-box info" style="text-align: center;">暂无日志记录</div>';
        } else {
            const reversedLogs = [...state.results.logs].reverse();
            logsHTML = `
                <div class="log-search-container">
                    <input type="text" id="log-search" placeholder="搜索日志...">
                </div>
                <div class="log-filter">
                    <button class="filter-btn active" data-filter="all">全部</button>
                    <button class="filter-btn" data-filter="success">成功</button>
                    <button class="filter-btn" data-filter="failed">失败</button>
                    <button class="filter-btn" data-filter="skip">跳过</button>
                </div>
                <div class="log-container" id="full-log-container">
                    ${reversedLogs.map(log => `
                        <div class="log-entry log-${log.status === '成功' ? 'success' : log.status === '跳过' ? 'info' : 'error'}"
                             data-status="${log.status === '成功' ? 'success' : log.status === '跳过' ? 'skip' : 'failed'}"
                             data-content="${escapeHTML(log.name + log.message + log.id)}">
                            <div style="margin-bottom: 4px; font-size: 12px; color: #888;">
                                ${new Date(log.timestamp).toLocaleString()}
                            </div>
                            <strong><a href="https://bgm.tv/subject/${log.id}" target="_blank">${log.name}</a></strong>（${log.id}）: ${log.message}
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // 更新核心内容
        coreContent.innerHTML = `
            <div>
                <h3 class="section-title">处理日志</h3>
                <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <div>共 ${state.results.logs.length} 条记录</div>
                    <button id="log-clear" class="danger" style="padding: 4px 10px; font-size: 13px;">清空日志</button>
                </div>
                ${logsHTML}
            </div>
        `;

        // 更新按钮组
        buttonsContainer.innerHTML = `
            <button id="log-download" class="secondary">下载完整日志</button>
            <button id="log-back" class="primary">返回</button>
        `;
    }

    // 7. 切换到完成视图（只更新内容）
    function switchToCompletedView() {
        state.currentView = 'completed';
        const coreContent = document.getElementById('core-content');
        const buttonsContainer = document.getElementById('static-buttons-container');
        const editRegions = document.getElementById('edit-regions');

        // 隐藏编辑区，显示全局进度条（100%）
        editRegions.style.display = 'none';
        showProgressBar();
        updateProgressBar(state.totalItems, state.totalItems);

        // 更新核心内容
        coreContent.innerHTML = `
            <div>
                <h3 class="section-title">处理完成</h3>
                <div class="status-box info">所有条目处理完毕</div>
                <div class="stats-container">
                    <div class="stats-item">
                        <span class="stats-label">总条目</span>
                        <span class="stats-value">${state.totalItems}</span>
                    </div>
                    <div class="stats-item">
                        <span class="stats-label">成功</span>
                        <span class="stats-value">${state.results.success}</span>
                    </div>
                    <div class="stats-item">
                        <span class="stats-label">失败/跳过</span>
                        <span class="stats-value">${state.results.failed}</span>
                    </div>
                </div>
                <div>
                    <p><strong>最近处理记录:</strong></p>
                    <div class="log-container">
                        ${state.results.logs.slice(-5).map(log => `
                            <div class="log-entry ${log.status === '成功' ? 'log-success' : 'log-error'}">
                                <strong><a href="https://bgm.tv/subject/${log.id}" target="_blank">${log.name}</a></strong>（${log.id}）: ${log.message}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // 更新按钮组
        buttonsContainer.innerHTML = `
            <button id="completed-download-log" class="secondary">下载完整日志</button>
            <button id="completed-back-to-setup" class="primary">返回设置</button>
        `;
    }

    // --------------------------
    // 按钮事件处理（按视图分发，避免重复绑定）
    // --------------------------
    // 设置视图按钮处理
    function handleSetupViewButtons(btnId) {
        switch (btnId) {
            case 'setup-start-processing':
                // 检查是否有CSV数据
                if (!state.csvData || state.csvData.length === 0) {
                    showStatusMessage('请上传有效的CSV文件');
                    return;
                }

                // 检查是否有Access Token
                if (!state.accessToken) {
                    showStatusMessage('请输入Access Token');
                    return;
                }

                // 切换到列选择视图
                switchToColumnsSelectionView();
                break;
            case 'setup-reset-progress':
                state.currentIndex = 0;
                state.retryCount = {};
                localStorage.setItem('bgmCurrentIndex', '0');
                switchToSetupView();
                break;
        }
    }

    // 新增：列选择视图按钮处理
    function handleColumnsSelectionViewButtons(btnId) {
        switch (btnId) {
            case 'columns-back':
                switchToSetupView();
                break;
            case 'columns-continue':
                // 验证至少选择了一列
                if (state.selectedColumns.length === 0) {
                    showStatusMessage('请至少选择一列进行更新');
                    return;
                }

                // 保存选择的列
                saveState();

                // 开始处理
                startProcessing();
                break;
        }
    }

    // 处理视图按钮处理
    function handleProcessingViewButtons(btnId) {
        const currentItem = state.csvData[state.currentIndex];
        const subjectData = state.currentSubjectData;
        const itemId = currentItem?.id || state.currentItemId;
        const itemName = subjectData?.name || '未知名称';

        switch (btnId) {
            case 'process-confirm-update':
                // 只获取必要的输入值（不重建输入框）
                const finalWikitext = document.getElementById('static-wikitext-input').value
                const finalTags = document.getElementById('static-tags-input').value.split(' ').filter(t => t)
                const commitMessage = document.getElementById('static-commit-input').value ||
                    generateCommitMessage(state.currentFieldUpdates, state.currentTagUpdates);

                // 禁用按钮，显示加载
                document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                    btn.disabled = true;
                });
                showLoadingOverlay('正在提交更新...');

                // 提交更新
                submitUpdate(
                    itemId,
                    finalWikitext,
                    finalTags,
                    itemName,
                    currentItem,
                    commitMessage,
                    // 成功回调
                    () => {
                        logResult(itemId, itemName, '成功', commitMessage);
                        state.results.success++;
                        state.currentIndex++;
                        resetProcessingState();
                        saveState();
                        processNextItem();
                    },
                    // 失败回调
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
                // 跳过更新
                logResult(itemId, itemName, '跳过', '用户选择跳过');
                state.results.failed++;
                state.currentIndex++;
                resetProcessingState();
                saveState();
                processNextItem();
                break;

            case 'process-confirm-continue':
                // 无需更新，继续
                logResult(itemId, itemName, '成功', '无需更新，继续处理');
                state.results.success++;
                state.currentIndex++;
                resetProcessingState();
                saveState();
                processNextItem();
                break;

            case 'process-skip-error':
                // 跳过错误条目
                logResult(itemId, '未知名称', '失败', `获取信息错误 (已跳过)`);
                state.results.failed++;
                state.currentIndex++;
                resetProcessingState();
                saveState();
                processNextItem();
                break;

            case 'process-retry-error':
                // 重试获取条目信息
                const currentRetryCount = state.retryCount[itemId] || 0;
                showStatusMessage(`正在重试（${currentRetryCount}次）...`);
                processNextItem();
                break;

            case 'process-skip-update-fail':
                // 跳过更新失败条目
                logResult(itemId, itemName, '失败', `更新失败 (已跳过)`);
                state.results.failed++;
                state.currentIndex++;
                resetProcessingState();
                saveState();
                processNextItem();
                break;

            case 'process-retry-update':
                // 重试更新
                const retryCurrentCount = state.retryCount[itemId] || 0;
                showStatusMessage(`正在重试（${retryCurrentCount}次）...`);
                // 重新切换到编辑视图
                processNextItem(true);
                break;
        }
    }

    // 日志视图按钮处理
    function handleLogsViewButtons(btnId) {
        switch (btnId) {
            case 'log-download':
            case 'log-download-full-log':
                downloadLog();
                break;
            case 'log-back':
                // 返回之前的视图
                if (state.csvData && state.currentIndex < state.csvData.length) {
                    processNextItem(true); // 重新加载当前条目
                } else {
                    switchToSetupView();
                }
                break;
            case 'log-clear':
                if (confirm('确定要清空所有日志记录吗？此操作不可恢复。')) {
                    state.results = { success: 0, failed: 0, logs: [] };
                    saveState();
                    switchToLogsView();
                    showStatusMessage('日志已清空');
                }
                break;
        }
    }

    // 完成视图按钮处理
    function handleCompletedViewButtons(btnId) {
        switch (btnId) {
            case 'completed-download-log':
                downloadLog();
                break;
            case 'completed-back-to-setup':
                switchToSetupView();
                hideProgressBar();
                break;
        }
    }

    // --------------------------
    // 工具函数（保持原有逻辑，优化DOM操作）
    // --------------------------
    // 重置处理状态（避免内存泄漏）
    function resetProcessingState() {
        state.currentSubjectData = null;
        state.currentItemId = null;
        state.currentWikitext = null;
        state.currentTags = null;
        state.currentCommitMessage = null;
        state.currentFieldUpdates = null;
        state.currentTagUpdates = null;
    }

    // 进度条控制（只更新宽度，不重建容器）
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

    // 加载遮罩（只更新文本，不重建容器）
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

    // 状态消息（只更新文本，不重建容器）
    function showStatusMessage(text) {
        const message = document.getElementById('bgm-status-message');
        message.classList.remove('show');
        void message.offsetWidth; // 强制重绘
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

    // 处理CSV上传（保持原有逻辑，添加列头保存）
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // 禁用按钮，显示加载
        document.querySelectorAll('#static-buttons-container button').forEach(btn => {
            btn.disabled = true;
        });
        showLoadingOverlay('正在解析CSV文件...');

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const csvContent = event.target.result;
                const { data, headers } = parseCSV(csvContent); // 修改：返回数据和列头
                state.csvData = data;
                state.csvHeaders = headers;
                state.selectedColumns = []; // 重置选择的列
                state.currentIndex = 0;
                state.retryCount = {};
                localStorage.setItem('bgmCsvData', JSON.stringify(state.csvData));
                localStorage.setItem('bgmCsvHeaders', JSON.stringify(state.csvHeaders)); // 保存列头
                localStorage.setItem('bgmCurrentIndex', '0');
                localStorage.setItem('bgmSelectedColumns', JSON.stringify(state.selectedColumns)); // 保存选择的列
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

    // 解析CSV（修改：返回数据和列头）
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

        return { data, headers }; // 返回数据和列头
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

    // 开始处理（保持原有逻辑，切换视图）
    function startProcessing() {
        state.totalItems = state.csvData.length;
        state.processing = true;
        state.paused = false;

        // 切换到处理准备视图
        const coreContent = document.getElementById('core-content');
        coreContent.innerHTML = `
            <div>
                <div class="item-info">准备处理第一个条目...</div>
            </div>
        `;

        // 更新按钮组
        const buttonsContainer = document.getElementById('static-buttons-container');
        buttonsContainer.innerHTML = `
            <button id="process-cancel" class="danger">取消</button>
        `;

        // 开始处理下一个条目
        processNextItem();
    }

    // 处理下一个条目（优化DOM操作：只切换视图，不重建容器）
    function processNextItem(isRetry = false) {
        if (state.paused || !state.processing) return;

        // 处理完成，切换到完成视图
        if (state.currentIndex >= state.totalItems) {
            switchToCompletedView();
            return;
        }

        const currentItem = state.csvData[state.currentIndex];
        if (!isRetry) {
            updateProgressBar(state.currentIndex, state.totalItems);
        }

        // 禁用按钮，显示加载
        document.querySelectorAll('#static-buttons-container button').forEach(btn => {
            btn.disabled = true;
        });
        showLoadingOverlay('正在获取条目信息...');

        // 获取条目信息（保持原有逻辑）
        Promise.all([
            fetch(`/p1/wiki/subjects/${currentItem.id}`, {
                headers: {
                    'Authorization': `Bearer ${state.accessToken}`,
                    'Accept': 'application/json'
                }
            }),
            fetch(`/p1/wiki/subjects/${currentItem.id}/history-summary`, {
                headers: {
                    'Authorization': `Bearer ${state.accessToken}`,
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
                // 成功获取，重置重试计数
                state.retryCount[itemData.currentItem.id] = 0;
                hideLoadingOverlay();
                document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                    btn.disabled = false;
                });

                // 切换到处理视图（只更新内容）
                switchToProcessingView(itemData);
            })
            .catch(error => {
                hideLoadingOverlay();
                document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                    btn.disabled = false;
                });

                // 切换到错误视图（只更新内容）
                switchToProcessingErrorView(currentItem, error.message);
            });
    }

    // 提交更新（保持原有逻辑，优化回调）
    function submitUpdate(itemId, newInfobox, newTags, itemName, csvItem, commitMessage, onSuccess, onError) {
        state.processing = true;

        fetch(`/p1/wiki/subjects/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${state.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                commitMessage: commitMessage,
                subject: {
                    infobox: newInfobox,
                    metaTags: newTags
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
    }

    // 其他工具函数（保持原有逻辑，优化DOM操作）
    function generateCommitMessage(fieldUpdates, tagUpdates) {
        const updatedFields = Object.keys(fieldUpdates || {});
        return [
            updatedFields.length ? `更新${updatedFields.join('、')}` : '',
            tagUpdates?.add.length ? `添加标签${tagUpdates.add.join('、')}` : '',
            tagUpdates?.remove.length ? `删除标签${tagUpdates.remove.join('、')}` : ''
        ].filter(s => s).join('；');
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

            // 清除旧的事件监听（如果有）
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

    function sanitizeRegExp(str) {
        const regexSpecialChars = /[.*+?^${}()|[\]\\]/g;
        return str.replace(regexSpecialChars, '\\$&');
    }

    // 字段更新处理（修改：只处理选中的列）
    function getFieldUpdates(csvItem, oldInfobox) {
        const updates = {};
        // 只处理选中的非标签列
        state.selectedColumns.forEach(key => {
            if (key.toLowerCase() === 'tags') return;

            if (csvItem[key] !== undefined &&
                !new RegExp(`\\|${sanitizeRegExp(key)}=\\s*${sanitizeRegExp(csvItem[key])}`, 'i').test(oldInfobox)) {
                updates[key] = csvItem[key];
            }
        });
        return updates;
    }

    // 标签更新处理（修改：只处理选中的标签列）
    function getTagUpdates(csvItem, oldTags) {
        // 检查tags列是否被选中
        const tagsColumn = state.selectedColumns.find(col => col.toLowerCase() === 'tags');
        if (!tagsColumn) {
            return { add: [], remove: [] };
        }

        const tagsStr = csvItem[tagsColumn] || '';
        const tags = tagsStr.split(' ').filter(t => t);

        const add = [];
        const remove = [];

        tags.forEach(tag => {
            if (tag.startsWith('-') && oldTags.includes(tag.slice(1))) {
                remove.push(tag.slice(1));
            } else if (!oldTags.includes(tag)) {
                add.push(tag);
            }
        });

        return { add, remove };
    }

    // 更新信息框内容
    function updateInfobox(oldInfobox, fieldUpdates) {
        let newInfobox = oldInfobox;

        // 处理每个字段更新
        Object.entries(fieldUpdates).forEach(([field, value]) => {
            const regex = new RegExp(`\\|${sanitizeRegExp(field)}\\s*=.*`, 'i');
            if (regex.test(newInfobox)) {
                // 替换现有字段
                newInfobox = newInfobox.replace(regex, `|${field}= ${value}`);
            } else {
                // 添加新字段（在第一个空行或末尾）
                const emptyLineIndex = newInfobox.indexOf('\n\n');
                if (emptyLineIndex !== -1) {
                    newInfobox = newInfobox.substring(0, emptyLineIndex) +
                        `|${field}= ${value}\n` +
                        newInfobox.substring(emptyLineIndex);
                } else {
                    newInfobox += `\n|${field}= ${value}`;
                }
            }
        });

        return newInfobox;
    }

    // 应用标签更新
    function applyTagUpdates(oldTags, tagUpdates) {
        const newTagsSet = new Set(oldTags);
        tagUpdates.add.forEach(tag => newTagsSet.add(tag));
        tagUpdates.remove.forEach(tag => newTagsSet.delete(tag));
        return [...newTagsSet];
    }

    // 检查是否是最近更新（24小时内）
    function isRecentUpdate(timestamp) {
        if (!timestamp) return false;
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
        return timestamp * 1000 > twentyFourHoursAgo;
    }

    // 记录结果
    function logResult(id, name, status, message) {
        state.results.logs.push({
            timestamp: new Date().toISOString(),
            id,
            name,
            status,
            message
        });
    }

    // 保存状态到本地存储（添加列相关状态）
    function saveState() {
        localStorage.setItem('bgmAccessToken', state.accessToken);
        localStorage.setItem('bgmCsvData', JSON.stringify(state.csvData));
        localStorage.setItem('bgmCsvHeaders', JSON.stringify(state.csvHeaders)); // 保存列头
        localStorage.setItem('bgmSelectedColumns', JSON.stringify(state.selectedColumns)); // 保存选择的列
        localStorage.setItem('bgmCurrentIndex', state.currentIndex.toString());
        localStorage.setItem('bgmResults', JSON.stringify(state.results));
        localStorage.setItem('bgmIsCommitMessageLocked', state.isCommitMessageLocked.toString());
        localStorage.setItem('bgmLockedCommitMessage', state.lockedCommitMessage);
    }

    // 下载日志
    function downloadLog() {
        const logText = state.results.logs.map(log =>
            `${new Date(log.timestamp).toLocaleString()} [${log.status}] ${log.name}（${log.id}）: ${log.message}`
        ).join('\n');

        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bgm_update_log_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // HTML转义
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 初始化
    createStaticDOM();
})();
