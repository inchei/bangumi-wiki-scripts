// ==UserScript==
// @name         bangumi wiki 批量更新工具
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  支持更新任意字段，始终覆盖，显示最后更新时间，并提供更新警告
// @author       You
// @match        https://next.bgm.tv/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.2.0/diff.min.js
// @require      https://unpkg.com/diff2html/bundles/js/diff2html-ui.min.js
// @license      MIT
// ==/UserScript==

// 灰白简约风格样式
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
    color: 6c757d;
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

/* 批处理模式样式 */
.batch-mode-indicator {
    display: inline-block;
    padding: 3px 8px;
    background: #6c757d;
    color: white;
    border-radius: 4px;
    font-size: 12px;
    margin-left: 10px;
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

/* 编辑区域样式 */
.edit-area {
    margin: 15px 0;
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

.last-update-info {
    font-size: 14px;
    color: #666;
    margin: 10px 0;
}

.commit-message-area {
    margin: 15px 0;
}

.commit-message-area input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
}
/* https://github.com/rtfpessoa/diff2html/issues/381#issuecomment-909260886 */
.d2h-code-linenumber {
  position: relative !important;
  display: table-cell !important;
}
.d2h-code-line {
  padding: 0 0.5em !important;
}
.d2h-file-collapse {
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
`);

// 加载diff2html样式
const diffLink = document.createElement('link');
diffLink.rel = 'stylesheet';
diffLink.href = 'https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css';
document.head.appendChild(diffLink);

// 加载Font Awesome图标库
const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
document.head.appendChild(fontAwesome);

// 创建悬浮按钮
function createFloatButton() {
    let floatBtn = document.getElementById('bgm-float-button');
    if (!floatBtn) {
        floatBtn = document.createElement('div');
        floatBtn.id = 'bgm-float-button';
        floatBtn.innerHTML = '<i class="fas fa-tools"></i>';
        document.body.appendChild(floatBtn);

        // 点击悬浮按钮显示主界面
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

    // 状态管理
    const state = {
        accessToken: localStorage.getItem('bgmAccessToken') || '',
        csvData: JSON.parse(localStorage.getItem('bgmCsvData') || 'null'),
        currentIndex: parseInt(localStorage.getItem('bgmCurrentIndex') || '0'),
        totalItems: 0,
        results: JSON.parse(localStorage.getItem('bgmResults') || '{"success":0,"failed":0,"logs":[]}'),
        processing: false,
        paused: false,
        batchMode: localStorage.getItem('bgmBatchMode') === 'true' || false,
        currentView: 'setup', // 当前视图: setup, processing, logs
        currentSubjectData: null, // 当前处理的条目数据
        currentFieldUpdates: null, // 当前字段更新
        currentWikitext: null, // 当前编辑的Wikitext
        currentCommitMessage: null, // 当前提交说明
        isCommitMessageLocked: localStorage.getItem('bgmIsCommitMessageLocked') === 'true' || false,
        lockedCommitMessage: localStorage.getItem('bgmLockedCommitMessage') || '',
        retryCount: {} // 记录每个条目的重试次数（不保存到localStorage）
    };

    // 创建界面结构
    function createUI() {
        // 先隐藏悬浮按钮
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
                <div id="bgm-tool-body">
                    </div>
                <div class="buttons-container" id="buttons-container">
                    </div>
                <div id="bgm-loading-overlay">
                    <div id="loading-spinner"></div>
                    <div id="loading-text"></div>
                </div>
            </div>
            <div id="bgm-status-message"></div>
        `;
        document.body.appendChild(container);

        // 绑定头部按钮事件
        document.getElementById('bgm-tool-close').addEventListener('click', () => {
            // 只有批处理模式且处理中未暂停时才阻止关闭
            if (state.batchMode && state.processing && !state.paused) return;
            // 隐藏容器而不是删除
            container.style.display = 'none';
            // 显示悬浮按钮
            const floatBtn = createFloatButton();
            floatBtn.style.display = 'flex';
            hideStatusMessage();
            saveState();
        });

        document.getElementById('bgm-tool-view-log').addEventListener('click', () => {
            // 只有批处理模式且处理中未暂停时才阻止查看日志
            if (state.batchMode && state.processing && !state.paused) {
                showStatusMessage('处理中不能查看日志，请先暂停');
                return;
            }
            showLogsSection();
        });

        showSetupSection();
    }

    // 进度条控制
    function showProgressBar() {
        document.getElementById('bgm-tool-progress').style.display = 'block';
    }

    function updateProgressBar(current, total) {
        document.getElementById('progress-text').textContent = `处理进度: ${current}/${total}`;
        const percentage = total > 0 ? (current / total) * 100 : 0;
        document.getElementById('progress-bar').style.width = `${percentage}%`;
        showProgressBar();
    }

    function hideProgressBar() {
        document.getElementById('bgm-tool-progress').style.display = 'none';
    }

    // 更新底部按钮 - 主要按钮放在最右侧
    function updateButtons(buttonsHTML) {
        const buttonsContainer = document.getElementById('buttons-container');
        buttonsContainer.innerHTML = buttonsHTML;
    }

    // 显示/隐藏加载遮罩
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

    // 状态消息
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

    // 显示设置界面
    function showSetupSection() {
        state.currentView = 'setup';
        const body = document.getElementById('bgm-tool-body');

        const contentWrapper = document.createElement('div');
        contentWrapper.innerHTML = `
            <div>
                <h3 class="section-title">基本设置</h3>
                <div class="form-group">
                    <label for="access-token">Access Token</label>
                    <input type="password" id="access-token" value="${state.accessToken}">
                    <p style="font-size: 13px; color: #666; margin-top: 5px;">
                        您可以在<a href="https://next.bgm.tv/demo/access-token" target="_blank">个人令牌页</a>中获取 Access Token
                    </p>
                </div>

                <div class="form-group">
                    <label for="csv-file">CSV文件 (需包含ID和要更新的字段列)</label>
                    <input type="file" id="csv-file" accept=".csv">
                    ${state.csvData ? `<div style="margin-top: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px; font-size: 14px;">已加载CSV: ${state.csvData.length} 条记录</div>` : ''}
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" id="batch-mode" ${state.batchMode ? 'checked' : ''}>
                        批处理模式
                    </label>
                </div>

                ${state.csvData ? `
                <div class="form-group">
                    <label>处理进度</label>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${(state.currentIndex / state.csvData.length) * 100}%"></div>
                    </div>
                    <div style="margin-top: 8px; color: #666; font-size: 14px;">上次进度: ${state.currentIndex}/${state.csvData.length}</div>
                    <button id="reset-progress" class="secondary" style="margin-top: 10px;">重置进度</button>
                </div>
                ` : ''}
            </div>
        `;

        // 清空内容区域
        body.innerHTML = '';
        body.appendChild(contentWrapper);

        // 主要按钮"开始处理"放在最右侧
        updateButtons(`
            <button id="start-processing" class="primary">开始处理</button>
        `);

        document.getElementById('access-token').addEventListener('input', e => {
            state.accessToken = e.target.value;
            localStorage.setItem('bgmAccessToken', state.accessToken);
        });

        document.getElementById('batch-mode').addEventListener('change', e => {
            state.batchMode = e.target.checked;
            localStorage.setItem('bgmBatchMode', state.batchMode.toString());
        });

        if (document.getElementById('csv-file')) {
            document.getElementById('csv-file').addEventListener('change', handleFileUpload);
        }

        if (state.csvData && document.getElementById('reset-progress')) {
            document.getElementById('reset-progress').addEventListener('click', () => {
                state.currentIndex = 0;
                state.retryCount = {}; // 重置重试计数
                localStorage.setItem('bgmCurrentIndex', '0');
                showSetupSection();
            });
        }

        if (document.getElementById('start-processing')) {
            document.getElementById('start-processing').addEventListener('click', startProcessing);
        }
    }

    // 显示日志界面
    function showLogsSection() {
        const previousView = state.currentView; // 保存之前的视图状态
        state.currentView = 'logs';
        const body = document.getElementById('bgm-tool-body');

        // 生成日志HTML
        let logsHTML = '';
        if (state.results.logs.length === 0) {
            logsHTML = '<div class="status-box info" style="text-align: center;">暂无日志记录</div>';
        } else {
            // 反转日志顺序，最新的在前面
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

        // 清空内容区域
        body.innerHTML = `
            <div>
                <h3 class="section-title">处理日志</h3>
                <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        共 ${state.results.logs.length} 条记录
                    </div>
                    <button id="clear-log" class="danger" style="padding: 4px 10px; font-size: 13px;">
                        清空日志
                    </button>
                </div>
                ${logsHTML}
            </div>
        `;

        // 主要按钮"返回"放在最右侧
        updateButtons(`
            <button id="download-full-log" class="secondary">下载完整日志</button>
            <button id="back-from-log" class="primary">返回</button>
        `);

        // 日志搜索功能
        if (document.getElementById('log-search')) {
            document.getElementById('log-search').addEventListener('input', function (e) {
                const searchTerm = e.target.value.toLowerCase();
                const logEntries = document.querySelectorAll('.log-entry');

                logEntries.forEach(entry => {
                    const content = entry.getAttribute('data-content').toLowerCase();
                    if (content.includes(searchTerm)) {
                        entry.style.display = '';
                    } else {
                        entry.style.display = 'none';
                    }
                });
            });
        }

        // 日志过滤功能
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');
                const logEntries = document.querySelectorAll('.log-entry');

                logEntries.forEach(entry => {
                    if (filter === 'all' || entry.getAttribute('data-status') === filter) {
                        entry.style.display = '';
                    } else {
                        entry.style.display = 'none';
                    }
                });
            });
        });

        // 清空日志
        if (document.getElementById('clear-log')) {
            document.getElementById('clear-log').addEventListener('click', () => {
                if (confirm('确定要清空所有日志记录吗？此操作不可恢复。')) {
                    state.results = {
                        success: 0,
                        failed: 0,
                        logs: []
                    };
                    saveState();
                    showLogsSection();
                    showStatusMessage('日志已清空');
                }
            });
        }

        // 下载完整日志
        document.getElementById('download-full-log').addEventListener('click', downloadLog);

        // 返回按钮 - 根据之前的视图状态决定返回哪里
        document.getElementById('back-from-log').addEventListener('click', () => {
            if (previousView === 'processing' || (state.processing && !state.paused)) {
                // 如果之前在处理中，返回到处理界面
                const currentItem = state.csvData[state.currentIndex];
                if (currentItem && state.currentSubjectData) {
                    // 重新渲染当前正在处理的条目界面
                    renderCurrentItemView();
                } else {
                    processNextItem();
                }
            } else {
                // 否则返回设置界面
                showSetupSection();
            }
        });
    }

    // 重新渲染当前正在处理的条目界面
    function renderCurrentItemView() {
        if (!state.currentSubjectData || state.currentIndex >= state.csvData.length) {
            processNextItem();
            return;
        }

        const currentItem = state.csvData[state.currentIndex];
        const itemName = state.currentSubjectData.name || '未知名称';
        const oldInfobox = state.currentSubjectData.infobox || '';

        // 更新infobox
        const fieldUpdates = getFieldUpdates(currentItem);
        state.currentFieldUpdates = fieldUpdates;

        const newInfobox = state.currentWikitext || updateInfobox(oldInfobox, fieldUpdates);

        // 生成默认commit message
        const defaultCommitMessage = state.currentCommitMessage || generateCommitMessage(fieldUpdates);

        const body = document.getElementById('bgm-tool-body');
        let content = `
        <div>
            <div class="item-info">
                当前条目：<a href="https://bgm.tv/subject/${currentItem.id}" target="_blank">${itemName}</a>（${currentItem.id}）
                ${state.batchMode ? '<span class="batch-mode-indicator">批处理模式</span>' : ''}
            </div>
        `;

        const hasUpdates = Object.keys(fieldUpdates).length > 0;

        if (hasUpdates) {
            content += `
            <div class="commit-message-area">
                <label>提交说明:</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="text" id="commit-message" placeholder="请输入提交说明" style="flex-grow: 1;">
                    <button id="lock-commit-message" class="secondary" title="${state.isCommitMessageLocked ? '解锁提交说明' : '固定提交说明'}">
                        <i class="fas ${state.isCommitMessageLocked ? 'fa-lock' : 'fa-lock-open'}"></i>
                    </button>
                </div>
            </div>

            <div class="edit-area">
                <label>WikiText:</label>
                <textarea id="wikitext-edit">${escapeHTML(newInfobox)}</textarea>
            </div>

            <div id="diff-container" class="diff-container"></div>
            <div id="diff-error" style="color: #a72e2e; font-size: 14px; margin-top: 8px;"></div>
        `;
        } else {
            content += `
            <div class="status-box success">
                没有需要更新的字段
            </div>

            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${(state.currentIndex / state.csvData.length) * 100}%"></div>
            </div>
        `;
        }

        content += `</div>`;
        body.innerHTML = content;

        if (hasUpdates) {
            const commitMessageInput = document.getElementById('commit-message');
            const lockButton = document.getElementById('lock-commit-message');

            // 根据锁定状态设置初始值
            if (state.isCommitMessageLocked) {
                commitMessageInput.value = state.lockedCommitMessage;
            } else {
                commitMessageInput.value = defaultCommitMessage;
            }

            // 保存当前编辑的内容
            commitMessageInput.addEventListener('input', e => {
                state.currentCommitMessage = e.target.value;
            });

            // 绑定锁定按钮事件
            lockButton.addEventListener('click', () => {
                state.isCommitMessageLocked = !state.isCommitMessageLocked;
                if (state.isCommitMessageLocked) {
                    state.lockedCommitMessage = commitMessageInput.value;
                    lockButton.innerHTML = '<i class="fas fa-lock"></i>';
                    lockButton.title = '解锁提交说明';
                } else {
                    lockButton.innerHTML = '<i class="fas fa-lock-open"></i>';
                    lockButton.title = '固定提交说明';
                    state.currentCommitMessage = generateCommitMessage(state.currentFieldUpdates);
                    commitMessageInput.value = state.currentCommitMessage;
                }
                saveState();
            });

            // 添加文本框内容变化监听器
            const wikitextEdit = document.getElementById('wikitext-edit');
            if (wikitextEdit) {
                wikitextEdit.addEventListener('input', function () {
                    state.currentWikitext = this.value;
                    updateDiffDisplay();
                });
            }
            // 初始渲染diff
            updateDiffDisplay();
        }

        // 恢复按钮状态
        document.querySelectorAll('button').forEach(btn => btn.disabled = false);

        // 根据模式显示不同按钮
        if (!state.batchMode) {
            let buttonsHTML = '';
            if (hasUpdates) {
                buttonsHTML = `
                <button id="skip-update" class="secondary">跳过</button>
                <button id="confirm-update" class="primary">确认更新</button>
            `;
            } else {
                buttonsHTML = `
                <button id="confirm-continue" class="primary">确认继续</button>
            `;
            }
            updateButtons(buttonsHTML);

            if (hasUpdates) {
                document.getElementById('confirm-update').addEventListener('click', () => {
                    document.querySelectorAll('button').forEach(btn => btn.disabled = true);
                    showLoadingOverlay('正在提交更新...');
                    const finalWikitext = document.getElementById('wikitext-edit').value;
                    const commitMessage = document.getElementById('commit-message').value || defaultCommitMessage;
                    submitUpdate(state.currentSubjectData.id, finalWikitext, itemName, currentItem, commitMessage);
                });

                document.getElementById('skip-update').addEventListener('click', () => {
                    logResult(currentItem.id, itemName, '跳过', '用户选择跳过');
                    state.results.failed++;
                    state.currentIndex++;
                    state.currentSubjectData = null;
                    state.currentWikitext = null;
                    state.currentCommitMessage = null;
                    saveState();
                    processNextItem();
                });
            } else {
                document.getElementById('confirm-continue').addEventListener('click', () => {
                    logResult(currentItem.id, itemName, '成功', '无需更新，继续处理');
                    state.results.success++;
                    state.currentIndex++;
                    state.currentSubjectData = null;
                    state.currentWikitext = null;
                    state.currentCommitMessage = null;
                    saveState();
                    processNextItem();
                });
            }
        } else {
            // 批处理模式下显示按钮
            updateButtons(`
            <button id="cancel-processing" class="danger">取消</button>
            <button id="pause-processing" class="primary">暂停</button>
        `);

            document.getElementById('pause-processing').addEventListener('click', pauseProcessing);
            document.getElementById('cancel-processing').addEventListener('click', cancelProcessing);
        }
    }

    // 处理CSV上传
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        document.querySelectorAll('button').forEach(btn => btn.disabled = true);
        showLoadingOverlay('正在解析CSV文件...');

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const csvContent = event.target.result;
                state.csvData = parseCSV(csvContent);
                state.currentIndex = 0;
                state.retryCount = {}; // 重置重试计数
                localStorage.setItem('bgmCsvData', JSON.stringify(state.csvData));
                localStorage.setItem('bgmCurrentIndex', '0');
                showSetupSection();
                showStatusMessage('CSV文件加载成功');
            } catch (error) {
                showStatusMessage('CSV解析错误: ' + error.message);
                console.error(error);
            } finally {
                hideLoadingOverlay();
                document.querySelectorAll('button').forEach(btn => btn.disabled = false);
            }
        };
        reader.readAsText(file);
    }

    // 解析CSV
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

        // 获取所有字段（除了ID）
        const fieldNames = headers.filter((h, i) => i !== idIndex);

        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const id = values[idIndex]?.trim();

            if (id) {
                const item = { id };
                // 为每个字段添加值
                fieldNames.forEach((fieldName, index) => {
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

    // 解析CSV行
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

    // 开始处理
    function startProcessing() {
        if (!state.accessToken) {
            showStatusMessage('请输入Access Token');
            return;
        }

        if (!state.csvData || state.csvData.length === 0) {
            showStatusMessage('请上传有效的CSV文件');
            return;
        }

        state.totalItems = state.csvData.length;
        state.processing = true;
        state.paused = false;
        state.currentView = 'processing';
        updateProgressBar(state.currentIndex, state.totalItems);

        const body = document.getElementById('bgm-tool-body');
        body.innerHTML = `
            <div>
                <div class="item-info">
                    准备处理第一个条目...
                    ${state.batchMode ? '<span class="batch-mode-indicator">批处理模式</span>' : ''}
                </div>
                ${state.batchMode ? `
                <div class="status-box warning">
                    批处理模式已启用，将自动处理所有条目。您可以随时点击"暂停"按钮中断处理。
                </div>
                ` : ''}
            </div>
        `;

        // 根据批处理模式显示不同的按钮
        if (state.batchMode) {
            // 批处理模式：显示暂停和取消按钮
            updateButtons(`
                <button id="cancel-processing" class="danger">取消</button>
                <button id="pause-processing" class="primary">暂停</button>
            `);

            document.getElementById('pause-processing').addEventListener('click', pauseProcessing);
            document.getElementById('cancel-processing').addEventListener('click', cancelProcessing);
        } else {
            // 非批处理模式：只显示取消按钮
            updateButtons(`
                <button id="cancel-processing" class="danger">取消</button>
            `);

            document.getElementById('cancel-processing').addEventListener('click', cancelProcessing);
        }

        processNextItem();
    }

    // 暂停处理（仅批处理模式使用）
    function pauseProcessing() {
        state.paused = true;
        state.processing = false;
        showStatusMessage('处理已暂停');

        // 主要操作按钮"继续处理"放在右侧
        updateButtons(`
            <button id="cancel-processing" class="danger">取消</button>
            <button id="resume-processing" class="primary">继续处理</button>
        `);

        document.getElementById('resume-processing').addEventListener('click', resumeProcessing);
        document.getElementById('cancel-processing').addEventListener('click', cancelProcessing);
    }

    // 恢复处理（仅批处理模式使用）
    function resumeProcessing() {
        state.paused = false;
        state.processing = true;
        showStatusMessage('处理已恢复');

        // 主要操作按钮"暂停"放在右侧
        updateButtons(`
            <button id="cancel-processing" class="danger">取消</button>
            <button id="pause-processing" class="primary">暂停</button>
        `);

        document.getElementById('pause-processing').addEventListener('click', pauseProcessing);
        document.getElementById('cancel-processing').addEventListener('click', cancelProcessing);

        processNextItem();
    }

    // 取消处理
    function cancelProcessing() {
        state.processing = false;
        state.paused = false;
        state.currentView = 'setup';
        state.currentSubjectData = null;
        state.currentWikitext = null;
        state.currentCommitMessage = null;
        saveState();
        showSetupSection();
        hideProgressBar();
        showStatusMessage('处理已取消');
    }

    // 处理下一个条目
    function processNextItem() {
        if (state.paused || !state.processing) return;

        if (state.currentIndex >= state.totalItems) {
            showCompletionScreen();
            return;
        }

        updateProgressBar(state.currentIndex, state.totalItems);
        const currentItem = state.csvData[state.currentIndex];

        document.querySelectorAll('button').forEach(btn => btn.disabled = true);
        showLoadingOverlay('正在获取条目信息...');
        state.processing = true;
        state.currentView = 'processing';

        // 获取条目信息
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
                if (!subjectResponse.ok) throw new Error(`获取条目信息失败: HTTP ${subjectResponse.status}`);
                if (!historyResponse.ok) throw new Error(`获取历史记录失败: HTTP ${historyResponse.status}`);

                const subjectData = await subjectResponse.json();
                const historyData = await historyResponse.json();

                return { subjectData, historyData };
            })
            .then(({ subjectData, historyData }) => {
                // 成功获取信息后重置重试计数
                state.retryCount[currentItem.id] = 0;

                hideLoadingOverlay();

                const itemName = subjectData.name || '未知名称';
                const oldInfobox = subjectData.infobox || '';

                // 保存当前条目数据
                state.currentSubjectData = subjectData;
                state.currentWikitext = null; // 重置当前编辑的Wikitext
                state.currentCommitMessage = null; // 重置当前提交说明

                // 获取最后更新时间
                const lastUpdateTime = historyData.length > 0 ? historyData[0].createdAt : 0;
                const lastUpdateDate = lastUpdateTime ? new Date(lastUpdateTime * 1000) : null;

                // 检查是否需要警告最近更新
                const shouldWarn = isRecentUpdate(lastUpdateTime);

                // 更新infobox
                const fieldUpdates = getFieldUpdates(currentItem);
                state.currentFieldUpdates = fieldUpdates;

                const newInfobox = updateInfobox(oldInfobox, fieldUpdates);

                // 生成默认commit message
                const defaultCommitMessage = generateCommitMessage(fieldUpdates);

                const body = document.getElementById('bgm-tool-body');
                let content = `
                <div>
                    <div class="item-info">
                        当前条目：<a href="https://bgm.tv/subject/${currentItem.id}" target="_blank">${itemName}</a>（${currentItem.id}）
                        ${state.batchMode ? '<span class="batch-mode-indicator">批处理模式</span>' : ''}
                    </div>
            `;

                // 显示最后更新时间
                if (lastUpdateDate) {
                    content += `
                    <div class="last-update-info" ${shouldWarn ? 'style="color:#d9534f"' : ''}>
                        最后更新时间: ${lastUpdateDate.toLocaleString()}
                    </div>
                `;
                }

                // 显示警告（如果需要）
                if (shouldWarn) {
                    // 批处理模式下自动暂停
                    if (state.batchMode) {
                        content += `
                        <div class="status-box warning">
                            此条目最近有更新，请确认是否继续更新
                        </div>
                    `;
                        pauseProcessing();
                    }
                }

                const hasUpdates = Object.keys(fieldUpdates).length > 0;

                if (hasUpdates) {
                    content += `
                    <div class="commit-message-area">
                        <label>提交说明:</label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="text" id="commit-message" placeholder="请输入提交说明" style="flex-grow: 1;">
                            <button id="lock-commit-message" class="secondary" title="${state.isCommitMessageLocked ? '解锁提交说明' : '固定提交说明'}">
                                <i class="fas ${state.isCommitMessageLocked ? 'fa-lock' : 'fa-lock-open'}"></i>
                            </button>
                        </div>
                    </div>

                    <div class="edit-area">
                        <label>WikiText:</label>
                        <textarea id="wikitext-edit">${escapeHTML(newInfobox)}</textarea>
                    </div>

                    <div id="diff-container" class="diff-container"></div>
                    <div id="diff-error" style="color: #a72e2e; font-size: 14px; margin-top: 8px;"></div>
                `;
                } else {
                    content += `
                    <div class="status-box success">
                        没有需要更新的字段
                    </div>

                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${(state.currentIndex / state.totalItems) * 100}%"></div>
                    </div>
                `;
                }

                content += `</div>`;
                body.innerHTML = content;

                if (hasUpdates) {
                    const commitMessageInput = document.getElementById('commit-message');
                    const lockButton = document.getElementById('lock-commit-message');

                    // 根据锁定状态设置初始值
                    if (state.isCommitMessageLocked) {
                        commitMessageInput.value = state.lockedCommitMessage;
                        state.currentCommitMessage = state.lockedCommitMessage;
                    } else {
                        commitMessageInput.value = defaultCommitMessage;
                        state.currentCommitMessage = defaultCommitMessage;
                    }

                    // 保存当前编辑的内容
                    commitMessageInput.addEventListener('input', e => {
                        state.currentCommitMessage = e.target.value;
                    });

                    // 绑定锁定按钮事件
                    lockButton.addEventListener('click', () => {
                        state.isCommitMessageLocked = !state.isCommitMessageLocked;
                        if (state.isCommitMessageLocked) {
                            state.lockedCommitMessage = commitMessageInput.value;
                            state.currentCommitMessage = commitMessageInput.value;
                            lockButton.innerHTML = '<i class="fas fa-lock"></i>';
                            lockButton.title = '解锁提交说明';
                        } else {
                            lockButton.innerHTML = '<i class="fas fa-lock-open"></i>';
                            lockButton.title = '固定提交说明';
                            state.currentCommitMessage = generateCommitMessage(state.currentFieldUpdates);
                            commitMessageInput.value = state.currentCommitMessage;
                        }
                        saveState();
                    });

                    // 添加文本框内容变化监听器
                    const wikitextEdit = document.getElementById('wikitext-edit');
                    if (wikitextEdit) {
                        wikitextEdit.addEventListener('input', function () {
                            state.currentWikitext = this.value;
                            updateDiffDisplay();
                        });
                    }
                    // 初始渲染diff
                    updateDiffDisplay();
                }

                // 恢复按钮状态
                document.querySelectorAll('button').forEach(btn => btn.disabled = false);

                // 批处理模式下自动确认（如果没有警告）
                if (state.batchMode && hasUpdates && !shouldWarn) {
                    // 短暂延迟，让用户可以看到内容
                    setTimeout(() => {
                        document.querySelectorAll('button').forEach(btn => btn.disabled = true);
                        showLoadingOverlay('正在提交更新...');
                        const finalWikitext = document.getElementById('wikitext-edit').value;
                        const commitMessage = document.getElementById('commit-message').value || defaultCommitMessage;
                        submitUpdate(subjectData.id, finalWikitext, itemName, currentItem, commitMessage);
                    }, 500);
                } else if (state.batchMode && !hasUpdates) {
                    // 无需更新，直接继续
                    setTimeout(() => {
                        logResult(currentItem.id, itemName, '成功', '无需更新，继续处理');
                        state.results.success++;
                        state.currentIndex++;
                        state.currentSubjectData = null;
                        state.currentWikitext = null;
                        state.currentCommitMessage = null;
                        saveState();
                        processNextItem();
                    }, 300);
                }

                // 非批处理模式下显示按钮（不包含暂停按钮）
                if (!state.batchMode) {
                    let buttonsHTML = '';
                    if (hasUpdates) {
                        buttonsHTML = `
                        <button id="skip-update" class="secondary">跳过</button>
                        <button id="confirm-update" class="primary">确认更新</button>
                    `;
                    } else {
                        buttonsHTML = `
                        <button id="confirm-continue" class="primary">确认继续</button>
                    `;
                    }
                    updateButtons(buttonsHTML);

                    if (hasUpdates) {
                        document.getElementById('confirm-update').addEventListener('click', () => {
                            document.querySelectorAll('button').forEach(btn => btn.disabled = true);
                            showLoadingOverlay('正在提交更新...');
                            const finalWikitext = document.getElementById('wikitext-edit').value;
                            const commitMessage = document.getElementById('commit-message').value || defaultCommitMessage;
                            submitUpdate(subjectData.id, finalWikitext, itemName, currentItem, commitMessage);
                        });

                        document.getElementById('skip-update').addEventListener('click', () => {
                            logResult(currentItem.id, itemName, '跳过', '用户选择跳过');
                            state.results.failed++;
                            state.currentIndex++;
                            state.currentSubjectData = null;
                            state.currentWikitext = null;
                            state.currentCommitMessage = null;
                            saveState();
                            processNextItem();
                        });
                    } else {
                        document.getElementById('confirm-continue').addEventListener('click', () => {
                            logResult(currentItem.id, itemName, '成功', '无需更新，继续处理');
                            state.results.success++;
                            state.currentIndex++;
                            state.currentSubjectData = null;
                            state.currentWikitext = null;
                            state.currentCommitMessage = null;
                            saveState();
                            processNextItem();
                        });
                    }
                } else {
                    // 批处理模式下显示按钮
                    updateButtons(`
                    <button id="cancel-processing" class="danger">取消</button>
                    <button id="pause-processing" class="primary">暂停</button>
                `);

                    document.getElementById('pause-processing').addEventListener('click', pauseProcessing);
                    document.getElementById('cancel-processing').addEventListener('click', cancelProcessing);
                }

                return;
            })
            .catch(error => {
                hideLoadingOverlay();
                document.querySelectorAll('button').forEach(btn => btn.disabled = false);

                // 更新重试计数
                const itemId = currentItem.id;
                state.retryCount[itemId] = (state.retryCount[itemId] || 0) + 1;
                const currentRetryCount = state.retryCount[itemId];
                const maxRetries = state.batchMode ? 3 : null; // 批处理模式有最大重试次数，非批处理模式无限制

                const body = document.getElementById('bgm-tool-body');
                body.innerHTML = `
                <div>
                    <div class="item-info">
                        当前条目：<a href="https://bgm.tv/subject/${currentItem.id}" target="_blank">查看条目</a>（${currentItem.id}）
                        ${state.batchMode ? '<span class="batch-mode-indicator">批处理模式</span>' : ''}
                    </div>

                    <div class="status-box error">
                        无法获取条目信息: ${error.message}
                        ${currentRetryCount > 1 ? `<br>已重试 ${currentRetryCount - 1} 次${state.batchMode ? `，最多重试 ${maxRetries} 次` : ''}` : ''}
                    </div>

                    <p>是否继续处理？</p>

                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${(state.currentIndex / state.totalItems) * 100}%"></div>
                    </div>
                </div>
            `;

                // 批处理模式下自动跳过错误（达到最大重试次数后）
                if (state.batchMode) {
                    updateButtons(`
                    <button id="skip-error" class="secondary">跳过</button>
                    ${currentRetryCount < maxRetries ? `<button id="retry-error" class="primary">重试</button>` : ''}
                    <button id="cancel-processing" class="danger">取消</button>
                `);

                    // 绑定按钮事件
                    document.getElementById('skip-error').addEventListener('click', () => {
                        logResult(currentItem.id, '未知名称', '失败', `获取信息错误: ${error.message} (已跳过)`);
                        state.results.failed++;
                        state.currentIndex++;
                        state.currentSubjectData = null;
                        state.currentWikitext = null;
                        state.currentCommitMessage = null;
                        saveState();
                        processNextItem();
                    });

                    if (currentRetryCount < maxRetries && document.getElementById('retry-error')) {
                        document.getElementById('retry-error').addEventListener('click', () => {
                            showStatusMessage(`正在重试（${currentRetryCount}/${maxRetries}）...`);
                            processNextItem();
                        });
                    }

                    document.getElementById('cancel-processing').addEventListener('click', cancelProcessing);

                    // 如果达到最大重试次数，自动跳过
                    if (currentRetryCount >= maxRetries) {
                        setTimeout(() => {
                            logResult(currentItem.id, '未知名称', '失败', `获取信息错误: ${error.message} (已达最大重试次数)`);
                            state.results.failed++;
                            state.currentIndex++;
                            state.currentSubjectData = null;
                            state.currentWikitext = null;
                            state.currentCommitMessage = null;
                            saveState();
                            processNextItem();
                        }, 1000);
                    }
                } else {
                    // 非批处理模式显示重试和跳过按钮，无最大重试次数限制
                    updateButtons(`
                    <button id="skip-error" class="secondary">跳过</button>
                    <button id="retry-error" class="primary">重试</button>
                `);

                    document.getElementById('skip-error').addEventListener('click', () => {
                        logResult(currentItem.id, '未知名称', '失败', `获取信息错误: ${error.message} (已跳过)`);
                        state.results.failed++;
                        state.currentIndex++;
                        state.currentSubjectData = null;
                        state.currentWikitext = null;
                        state.currentCommitMessage = null;
                        saveState();
                        processNextItem();
                    });

                    document.getElementById('retry-error').addEventListener('click', () => {
                        showStatusMessage(`正在重试（${currentRetryCount}次）...`);
                        processNextItem();
                    });
                }

                return;
            });
    }

    // 生成commit message
    function generateCommitMessage(fieldUpdates) {
        const fields = Object.keys(fieldUpdates);
        if (fields.length === 0) return '无字段更新';

        if (fields.length === 1) {
            return `更新${fields[0]}`;
        } else {
            return `更新${fields.slice(0, -1).join('、')}和${fields[fields.length - 1]}`;
        }
    }

    // 更新diff显示
    function updateDiffDisplay() {
        const textarea = document.getElementById('wikitext-edit');
        if (!textarea) return;

        const newText = textarea.value;
        const oldInfobox = state.currentSubjectData.infobox || '';

        try {
            // 确保文本格式正确，使用统一的换行符
            const normalizedOld = oldInfobox.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            const normalizedNew = newText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

            const fileName = `条目 ${state.currentSubjectData.name || '未知名称'} - ${state.currentSubjectData.id}`;
            const diffString = Diff.createPatch(fileName, normalizedOld, normalizedNew);
            const configuration = {
                drawFileList: false,
                fileListToggle: false,
                fileContentToggle: false,
                matching: 'lines',
                highlight: false
            };

            // 先清空容器
            const diffContainer = document.getElementById('diff-container');
            diffContainer.innerHTML = '';

            const diff2htmlUi = new Diff2HtmlUI(diffContainer, diffString, configuration);
            diff2htmlUi.draw();
        } catch (error) {
            console.error('渲染差异失败:', error);
            const diffError = document.getElementById('diff-error');
            if (diffError) {
                diffError.textContent = '显示差异时出错: ' + error.message;
            }
        }
    }

    // 获取需要更新的字段
    function getFieldUpdates(csvItem) {
        const updates = {};
        // 排除ID字段，处理所有其他字段
        Object.keys(csvItem).forEach(key => {
            if (key !== 'id' && csvItem[key]) {
                updates[key] = csvItem[key];
            }
        });
        return updates;
    }

    // 更新infobox中的字段（确保新字段添加在}}前面）
    function updateInfobox(infobox, fieldUpdates) {
        if (!infobox) {
            // 如果没有infobox，创建一个新的
            return Object.entries(fieldUpdates)
                .map(([key, value]) => `|${key}= ${value}`)
                .join('\n') + '\n}}';
        }

        const lines = infobox.split('\n');
        const newLines = [];
        const updatedFields = new Set();
        let foundClosingBrace = false;

        // 首先处理现有的行
        for (const line of lines) {
            // 检查是否找到结束括号
            if (line.trim() === '}}' && !foundClosingBrace) {
                foundClosingBrace = true;
                // 在结束括号前插入所有新字段
                for (const [field, value] of Object.entries(fieldUpdates)) {
                    if (!updatedFields.has(field)) {
                        newLines.push(`|${field}= ${value}`);
                    }
                }
                newLines.push('}}');
                continue;
            }

            let matched = false;
            for (const [field, value] of Object.entries(fieldUpdates)) {
                if (line.trim().startsWith(`|${field}=`)) {
                    newLines.push(`|${field}= ${value}`);
                    updatedFields.add(field);
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                newLines.push(line);
            }
        }

        // 如果没有找到结束括号，在最后添加新字段和结束括号
        if (!foundClosingBrace) {
            // 添加所有新字段
            for (const [field, value] of Object.entries(fieldUpdates)) {
                if (!updatedFields.has(field)) {
                    newLines.push(`|${field}= ${value}`);
                }
            }
            newLines.push('}}');
        }

        return newLines.join('\n');
    }

    // 检查是否为最近更新（上个UTC周二21:30之后）
    function isRecentUpdate(updateTimestamp) {
        if (!updateTimestamp) return false;

        const updateDate = new Date(updateTimestamp * 1000);
        const now = new Date();

        // 获取上一个UTC周二21:30
        const lastTuesday2130 = getLastUTCTuesday2130();

        return updateDate > lastTuesday2130;
    }

    // 获取上一个UTC周二21:30
    function getLastUTCTuesday2130() {
        const now = new Date();
        const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

        // 获取当前UTC星期几（0-6，0是周日）
        const currentUTCDay = utcNow.getUTCDay();

        // 计算到上周二的天数
        let daysSinceTuesday = (currentUTCDay + 5) % 7; // 周二对应2，所以+5取模7

        // 如果今天是周二且当前时间晚于21:30，则使用今天
        const isTuesday = currentUTCDay === 2;
        const isAfter2130 = utcNow.getUTCHours() > 21 ||
            (utcNow.getUTCHours() === 21 && utcNow.getUTCMinutes() >= 30);

        if (isTuesday && isAfter2130) {
            daysSinceTuesday = 0;
        } else if (isTuesday && !isAfter2130) {
            daysSinceTuesday = 7;
        }

        // 计算上一个周二的日期
        const lastTuesday = new Date(utcNow);
        lastTuesday.setUTCDate(utcNow.getUTCDate() - daysSinceTuesday);
        lastTuesday.setUTCHours(21, 30, 0, 0);

        return lastTuesday;
    }

    // 提交更新
    function submitUpdate(itemId, newInfobox, itemName, csvItem, commitMessage) {
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
                    infobox: newInfobox
                }
            })
        })
            .then(response => {
                if (!response.ok) {
                    // 解析错误响应内容
                    return response.text().then(text => {
                        throw new Error(`HTTP ${response.status} - ${text || '更新失败'}`);
                    });
                }
                return response;
            })
            .then(data => {
                hideLoadingOverlay();

                const updatedFields = Object.keys(getFieldUpdates(csvItem)).join(', ');
                logResult(itemId, itemName, '成功', `已更新字段: ${updatedFields} (提交说明: ${commitMessage})`);
                state.results.success++;
                state.currentIndex++;
                state.currentSubjectData = null;
                state.currentWikitext = null;
                state.currentCommitMessage = null;
                saveState();
                updateProgressBar(state.currentIndex, state.totalItems);
                processNextItem();
            })
            .catch(error => {
                hideLoadingOverlay();
                document.querySelectorAll('button').forEach(btn => btn.disabled = false);

                // 更新重试计数
                const currentRetryCount = (state.retryCount[itemId] || 0) + 1;
                state.retryCount[itemId] = currentRetryCount;
                const maxRetries = state.batchMode ? 3 : null; // 批处理模式有最大重试次数，非批处理模式无限制

                const body = document.getElementById('bgm-tool-body');
                body.innerHTML = `
                <div>
                    <div class="item-info">
                        当前条目：<a href="https://bgm.tv/subject/${itemId}" target="_blank">${itemName}</a>（${itemId}）
                        ${state.batchMode ? '<span class="batch-mode-indicator">批处理模式</span>' : ''}
                    </div>

                    <div class="status-box error">
                        提交更新失败: ${error.message}
                        ${currentRetryCount > 1 ? `<br>已重试 ${currentRetryCount - 1} 次${state.batchMode ? `，最多重试 ${maxRetries} 次` : ''}` : ''}
                    </div>

                    <p>是否重试更新？</p>
                </div>
            `;

                // 显示相应的按钮
                if (state.batchMode) {
                    updateButtons(`
                    <button id="skip-update-fail" class="secondary">跳过</button>
                    ${maxRetries === null || currentRetryCount < maxRetries ? `<button id="retry-update" class="primary">重试</button>` : ''}
                    <button id="cancel-processing" class="danger">取消</button>
                `);
                } else {
                    updateButtons(`
                    <button id="skip-update-fail" class="secondary">跳过</button>
                    <button id="retry-update" class="primary">重试</button>
                `);
                }

                // 绑定按钮事件
                document.getElementById('skip-update-fail').addEventListener('click', () => {
                    logResult(itemId, itemName, '失败', `更新失败: ${error.message} (已跳过)`);
                    state.results.failed++;
                    state.currentIndex++;
                    state.currentSubjectData = null;
                    state.currentWikitext = null;
                    state.currentCommitMessage = null;
                    saveState();
                    processNextItem();
                });

                if ((maxRetries === null || currentRetryCount < maxRetries) && document.getElementById('retry-update')) {
                    document.getElementById('retry-update').addEventListener('click', () => {
                        showStatusMessage(`${state.batchMode ? `正在重试（${currentRetryCount}/${maxRetries}）` : `正在重试（${currentRetryCount}次）`}...`);
                        document.querySelectorAll('button').forEach(btn => btn.disabled = true);
                        showLoadingOverlay('正在提交更新...');
                        submitUpdate(itemId, newInfobox, itemName, csvItem, commitMessage);
                    });
                }

                if (state.batchMode && document.getElementById('cancel-processing')) {
                    document.getElementById('cancel-processing').addEventListener('click', cancelProcessing);
                }

                // 批处理模式下达到最大重试次数自动跳过
                if (state.batchMode && maxRetries !== null && currentRetryCount >= maxRetries) {
                    setTimeout(() => {
                        logResult(itemId, itemName, '失败', `更新失败: ${error.message} (已达最大重试次数)`);
                        state.results.failed++;
                        state.currentIndex++;
                        state.currentSubjectData = null;
                        state.currentWikitext = null;
                        state.currentCommitMessage = null;
                        saveState();
                        processNextItem();
                    }, 1000);
                }
            });
    }

    // 显示完成界面
    function showCompletionScreen() {
        state.processing = false;
        state.paused = false;
        state.currentView = 'completed';
        state.currentSubjectData = null;
        state.currentWikitext = null;
        state.currentCommitMessage = null;

        const body = document.getElementById('bgm-tool-body');
        body.innerHTML = `
            <div>
                <h3 class="section-title">处理完成</h3>

                <div class="status-box info">
                    所有条目处理完毕
                </div>

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

        updateButtons(`
            <button id="download-log" class="secondary">下载完整日志</button>
            <button id="back-to-setup" class="primary">返回设置</button>
        `);

        document.getElementById('back-to-setup').addEventListener('click', () => {
            showSetupSection();
            hideProgressBar();
        });

        document.getElementById('download-log').addEventListener('click', downloadLog);
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

    // 保存状态
    function saveState() {
        localStorage.setItem('bgmAccessToken', state.accessToken);
        localStorage.setItem('bgmCsvData', JSON.stringify(state.csvData));
        localStorage.setItem('bgmCurrentIndex', state.currentIndex.toString());
        localStorage.setItem('bgmResults', JSON.stringify(state.results));
        localStorage.setItem('bgmBatchMode', state.batchMode.toString());
        localStorage.setItem('bgmIsCommitMessageLocked', state.isCommitMessageLocked.toString());
        localStorage.setItem('bgmLockedCommitMessage', state.lockedCommitMessage);
        // 不再保存重试次数到localStorage
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

    // HTML转义函数
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 初始化
    createUI();
})();
