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

            const csvItem = state.csvData?.[state.currentIndex];
            const entityType = csvItem?.type || 'subject';
            state.currentCommitMessage = generateCommitMessage(
                state.currentFieldUpdates,
                state.currentTagUpdates,
                state.currentSeriesUpdate,
                entityType
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
