import {
    state,
    type EntityType,
    type WorkItem,
    type WikiData,
    type HistoryEntry,
    type SourceInfo,
    getEntityApiConfig,
} from './core';
import {
    showStatusMessage,
    hideLoadingOverlay,
} from './ui';
import {
    getFieldUpdates,
    getFullInfobox,
    getTagUpdates,
    getSeriesUpdate,
    updateInfobox,
    applyTagUpdates,
    generateCommitMessage,
    updateConfirmButtonState,
    getResolvedTheme,
} from './diff';
import { setDiffContent, WCODE_CONTAINER_ID, TAGS_CONTAINER_ID, getDoc } from './cm-diff';
import { paintStaticIcons, setLockIcon } from './morph';
import { isRecentUpdate, resetProcessingState } from './utils';
import { type MeInfo } from './api';

// login view: shares the same page shell as other views, swaps core-content only
export async function switchToLoginView(): Promise<void> {
    state.currentView = 'login';
    state.processing = false;
    resetProcessingState();
    hideLoadingOverlay();

    const coreContent = document.getElementById('core-content');
    const buttonsContainer = document.getElementById('static-buttons-container');
    const editRegions = document.getElementById('edit-regions');

    if (editRegions) editRegions.style.display = 'none';
    if (buttonsContainer) buttonsContainer.innerHTML = '';
    const userNameEl = document.getElementById('bgm-user-name');
    if (userNameEl) userNameEl.textContent = '';

    if (!coreContent) return;

    let oauthHTML = '';
    try {
        const infoResp = await fetch('/api/auth/info', { headers: { 'Accept': 'application/json' } });
        const info = await infoResp.json() as { oauthEnabled?: boolean };
        if (infoResp.ok && info.oauthEnabled) {
            oauthHTML = '<button type="button" class="primary login-oauth-btn">使用 Bangumi OAuth 登录</button>';
        }
    } catch {
        // keep the OAuth entry hidden when the query fails; token login still works
    }

    coreContent.innerHTML = `
        <div class="login-card">
            <h3 class="section-title">登录</h3>
            ${oauthHTML}
            <p class="formhash-hint">
                在 <a href="https://next.bgm.tv/demo/access-token" target="_blank">个人令牌页</a>
                生成 access token（无需任何权限），粘贴到下方直接确认身份：
            </p>
            <input type="password" id="login-token-input" placeholder="粘贴 access token">
            <button type="button" class="secondary login-token-btn">使用 Access Token 登录</button>
            <div id="login-status" class="status-box hidden"></div>
        </div>
    `;

    const oauthBtn = coreContent.querySelector<HTMLButtonElement>('.login-oauth-btn');
    if (oauthBtn) {
        oauthBtn.addEventListener('click', () => {
            location.href = '/auth/oauth';
        });
    }

    const tokenBtn = coreContent.querySelector<HTMLButtonElement>('.login-token-btn');
    const tokenInput = coreContent.querySelector<HTMLInputElement>('#login-token-input');
    const statusEl = coreContent.querySelector('#login-status');
    if (tokenBtn && tokenInput && statusEl) {
        tokenBtn.addEventListener('click', async () => {
            const token = tokenInput.value.trim();
            if (!token) {
                showStatusMessage('请填写 access token');
                return;
            }
            tokenBtn.disabled = true;
            statusEl.classList.remove('hidden');
            statusEl.className = 'status-box info';
            statusEl.textContent = '正在验证 access token...';
            try {
                const resp = await fetch('/api/auth/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ accessToken: token }),
                });
                const body = await resp.json();
                if (!resp.ok) {
                    throw new Error((body as { error?: string }).error || `HTTP ${resp.status}`);
                }
                location.href = '/';
            } catch (error) {
                statusEl.className = 'status-box error';
                statusEl.textContent = '登录失败: ' + (error as Error).message;
                tokenBtn.disabled = false;
            }
        });
    }
}


export async function switchToHomeView(): Promise<void> {
    state.currentView = 'home';
    state.processing = false;
    state.scope = null;
    resetProcessingState();
    hideLoadingOverlay();

    const coreContent = document.getElementById('core-content');
    const buttonsContainer = document.getElementById('static-buttons-container');
    const editRegions = document.getElementById('edit-regions');

    if (editRegions) editRegions.style.display = 'none';
    if (buttonsContainer) buttonsContainer.innerHTML = '';

    if (!coreContent) return;
    coreContent.innerHTML = `
        <div id="home-view">
            <div class="home-loading">加载工作组列表...</div>
        </div>
    `;

    let sources: SourceInfo[];
    let errorCount: number;
    try {
        const resp = await fetchSourcesResp();
        sources = resp.sources;
        errorCount = resp.errorCount;
    } catch (error) {
        coreContent.innerHTML = `
            <div class="status-box error">加载工作组失败: ${(error as Error).message}</div>
        `;
        return;
    }

    if (state.currentView !== 'home') return;

    const cards = sources.map(src => `
        <div class="workgroup-card" data-source-id="${src.id}" data-source-name="${escapeHtml(src.name)}">
            <div class="workgroup-title">${escapeHtml(src.name)}</div>
            <div class="workgroup-meta">待审核: <strong>${src.pending}</strong></div>
            <button id="workgroup-enter-btn" class="primary workgroup-enter-btn" ${src.pending === 0 ? 'disabled' : ''}>进入处理</button>
        </div>
    `).join('');

    coreContent.innerHTML = `
        <div id="home-view">
            <h3 class="section-title">待办工作组</h3>
            ${sources.length ? `<div class="workgroup-list">${cards}</div>` : '<div class="status-box info">暂无可处理的工作组</div>'}
            <h3 class="section-title">错误编辑</h3>
            <div class="workgroup-list">
                <div class="workgroup error-workgroup" data-error="1">
                    <div class="workgroup-title">错误编辑</div>
                    <div class="workgroup-meta">待处理: <strong>${errorCount}</strong></div>
                    <button id="workgroup-enter-btn" class="primary workgroup-enter-btn" ${errorCount === 0 ? 'disabled' : ''}>进入处理</button>
                </div>
            </div>
        </div>
    `;
    paintStaticIcons();
}

async function fetchSourcesResp(): Promise<{ sources: SourceInfo[]; errorCount: number }> {
    const resp = await fetch('/api/sources', { headers: { Accept: 'application/json' } });
    const body = await resp.json();
    if (!resp.ok) {
        throw new Error((body as { error?: string }).error || `HTTP ${resp.status}`);
    }
    return body as { sources: SourceInfo[]; errorCount: number };
}

function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function switchToSetupView(me: MeInfo): void {
    state.currentView = 'setup';
    state.processing = false;
    resetProcessingState();
    hideLoadingOverlay();

    const coreContent = document.getElementById('core-content');
    const buttonsContainer = document.getElementById('static-buttons-container');
    const editRegions = document.getElementById('edit-regions');

    if (editRegions) editRegions.style.display = 'none';
    if (buttonsContainer) buttonsContainer.innerHTML = '';

    if (!coreContent) return;
    coreContent.innerHTML = `
        <div>
            <h3 class="section-title">账号</h3>
            <div class="form-group">
                <p>当前用户: <strong>${escapeHtml(me.name)}</strong>（id ${me.id}）</p>
                <p>bgm.tv 凭证状态: ${me.hasCookie ? '<strong style="color:#85ce61">已配置</strong>' : '未配置'}</p>
            </div>
            <h3 class="section-title">bgm.tv 凭证</h3>
            <div class="form-group">
                <label for="setup-bgm-cookie">bgm.tv 登录 Cookie</label>
                <textarea id="setup-bgm-cookie" rows="4" placeholder="例如: chii_auth=xxxx; chii_sid=yyyy"></textarea>
                <p class="formhash-hint">
                    审核提交将以此账号通过旧 API 进行，后端自动抓取 formhash。<br>
                    获取方式：本浏览器登录 bgm.tv 后，打开控制台执行
                    <code>document.cookie</code> 并复制全部内容（至少包含 chii_auth）。<br>
                    支持粘贴完整 <code>chii_auth=xxx; chii_sid=yyy</code> 形式。
                </p>
                <div class="row-flex">
                    <button type="button" class="primary" id="setup-save-cookie">保存凭证</button>
                    <button type="button" class="secondary" id="setup-back-home">返回首页</button>
                </div>
                <div id="setup-cookie-status" class="status-box hidden"></div>
            </div>
        </div>
    `;

    const saveBtn = document.getElementById('setup-save-cookie') as HTMLButtonElement | null;
    const textarea = document.getElementById('setup-bgm-cookie') as HTMLTextAreaElement | null;
    const statusEl = document.getElementById('setup-cookie-status');
    if (saveBtn && textarea && statusEl) {
        saveBtn.addEventListener('click', async () => {
            const cookie = textarea.value.trim();
            if (!cookie) {
                showStatusMessage('请粘贴 cookie');
                return;
            }
            saveBtn.disabled = true;
            statusEl.classList.remove('hidden');
            statusEl.className = 'status-box info';
            statusEl.textContent = '正在验证 cookie（请求 bgm.tv 抓取 formhash）...';
            try {
                const resp = await fetch('/api/credentials', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cookie }),
                });
                const body = await resp.json();
                if (!resp.ok) {
                    throw new Error((body as { error?: string }).error || `HTTP ${resp.status}`);
                }
                state.hasCookie = true;
                statusEl.className = 'status-box success';
                statusEl.textContent = '凭证已保存并通过验证';
                showStatusMessage('凭证已保存');
            } catch (error) {
                statusEl.className = 'status-box error';
                statusEl.textContent = '保存失败: ' + (error as Error).message;
            } finally {
                saveBtn.disabled = false;
            }
        });
    }

    const backBtn = document.getElementById('setup-back-home');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            void import('./views').then(m => m.switchToHomeView());
        });
    }
}

const TYPE_LABELS: Record<string, string> = {
    subject: '条目',
    character: '角色',
    person: '人物',
};

export function switchToProcessingView(itemData: {
    currentItem: WorkItem;
    wikiData: WikiData;
    historyData: HistoryEntry[];
}): void {
    state.currentView = 'processing';
    const { currentItem, wikiData, historyData } = itemData;
    state.currentSubjectData = wikiData;

    const entityType = currentItem.entityType as EntityType;

    state.currentWcode = null;
    state.currentTags = null;
    state.currentSeries = null;
    state.currentCommitMessage = null;

    const coreContent = document.getElementById('core-content');
    const buttonsContainer = document.getElementById('static-buttons-container');
    const editRegions = document.getElementById('edit-regions');

    if (editRegions) editRegions.style.display = 'block';

    const itemName = wikiData.name || '未知名称';
    const oldInfobox = wikiData.infobox || '';
    const oldTags = entityType === 'subject' ? (wikiData.metaTags || []) : [];
    const oldSeries = entityType === 'subject' ? (wikiData.series || false) : false;
    const fieldUpdates = getFieldUpdates(currentItem.row, oldInfobox);
    const fullInfobox = getFullInfobox(currentItem.row);
    const tagUpdates = getTagUpdates(currentItem.row, oldTags);
    const seriesUpdate = getSeriesUpdate(currentItem.row, oldSeries);
    state.currentFieldUpdates = fieldUpdates;
    state.currentTagUpdates = tagUpdates;
    state.currentSeriesUpdate = seriesUpdate;

    const lastUpdateEl = document.getElementById('static-last-update');
    const lastUpdateTime: number | undefined = historyData[0]?.createdAt;
    const lastUpdateDate = lastUpdateTime ? new Date(lastUpdateTime * 1000) : null;
    const lastCreator: string = historyData[0]?.creator?.username || '';
    const lastCommitMessage2: string = historyData[0]?.commitMessage || '';
    const shouldWarn = isRecentUpdate(lastUpdateTime);

    if (lastUpdateDate && lastUpdateEl) {
        const { editPagePath } = getEntityApiConfig(entityType, currentItem.csvId);
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
    if (prevLinkEl && state.previousItem) {
        const prevType = state.previousItem.type as EntityType;
        const { editPagePath: prevEditPath } = getEntityApiConfig(prevType, state.previousItem.id);
        prevLinkEl.innerHTML = `
            <morph-icon data-icon="arrow-left" size="14"></morph-icon> 上一个:
            <a href="${prevEditPath}" target="_blank">
                ${state.previousItem.name}（${state.previousItem.id}）
            </a>
        `;
        paintStaticIcons(prevLinkEl);
        prevLinkEl.style.display = 'block';
    } else if (prevLinkEl) {
        prevLinkEl.style.display = 'none';
    }

    const commitInput = document.getElementById('static-commit-input') as HTMLInputElement;

    const defaultCommitMsg = generateCommitMessage(fieldUpdates, tagUpdates, seriesUpdate, entityType);
    commitInput.value = state.isCommitMessageLocked ? state.lockedCommitMessage : defaultCommitMsg;
    setLockIcon(state.isCommitMessageLocked, false);

    const newInfobox = updateInfobox(fullInfobox ?? oldInfobox, fieldUpdates);
    setDiffContent(WCODE_CONTAINER_ID, oldInfobox, newInfobox, getResolvedTheme() === 'dark', () => {
        if (state.currentView === 'processing' && state.currentSubjectData) {
            state.currentWcode = getDoc(WCODE_CONTAINER_ID);
            updateConfirmButtonState();
        }
    }, true);

    const tagsArea = document.getElementById('static-tags-area');
    if (entityType === 'subject') {
        const newTags = applyTagUpdates(oldTags, tagUpdates);
        setDiffContent(TAGS_CONTAINER_ID, oldTags.join(' '), newTags.join(' '), getResolvedTheme() === 'dark', () => {
            if (state.currentView === 'processing' && state.currentSubjectData) {
                state.currentTags = getDoc(TAGS_CONTAINER_ID);
                updateConfirmButtonState();
            }
        });
        if (tagsArea) tagsArea.style.display = 'block';
    } else {
        if (tagsArea) tagsArea.style.display = 'none';
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

    const browsePath = getEntityApiConfig(entityType, currentItem.csvId).editPagePath.replace('/edit', '');
    const typeLabel = TYPE_LABELS[entityType] || '条目';
    const scopeLabel = state.scope?.scope === 'error' ? '错误编辑' : '待审核';

    if (coreContent) {
        coreContent.innerHTML = `
            <div>
                <div class="item-info">
                    [${scopeLabel}] 当前${typeLabel}：<a href="${browsePath}" target="_blank">${itemName}</a>（${currentItem.csvId}）[${typeLabel}]
                </div>
            </div>
        `;
    }

    if (buttonsContainer) {
        buttonsContainer.innerHTML = `
            <button id="process-mark-error" class="secondary danger-style">标记错误</button>
            <span class="buttons-spacer"></span>
            <button id="process-skip-update" class="secondary">跳过</button>
            <button id="process-confirm-update" class="primary">确认更新</button>
        `;
    }

    paintStaticIcons();
    updateConfirmButtonState();
}

export function switchToProcessingErrorView(errorMsg: string): void {
    state.currentView = 'processing';
    const coreContent = document.getElementById('core-content');
    const buttonsContainer = document.getElementById('static-buttons-container');
    const editRegions = document.getElementById('edit-regions');

    if (editRegions) editRegions.style.display = 'none';

    const currentItem = state.currentItem;
    const itemId = currentItem?.csvId || '';
    const typeLabel = TYPE_LABELS[currentItem?.entityType || ''] || '条目';

    if (coreContent) {
        coreContent.innerHTML = `
            <div>
                <div class="item-info">
                    当前${typeLabel}：<a href="https://bgm.tv/${currentItem?.entityType}/${itemId}" target="_blank">查看${typeLabel}</a>（${itemId}）
                </div>
                <div class="status-box error">
                    获取条目信息失败: ${escapeHtml(errorMsg)}
                </div>
                <p>是否继续处理？</p>
            </div>
        `;
    }

    if (buttonsContainer) {
        buttonsContainer.innerHTML = `
            <button id="process-mark-error" class="secondary">标记错误</button>
            <span class="buttons-spacer"></span>
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

    const currentItem = state.currentItem;
    const subjectData = state.currentSubjectData;
    const itemName = subjectData?.name || '未知名称';
    const itemId = currentItem?.csvId || '';
    const typeLabel = TYPE_LABELS[currentItem?.entityType || ''] || '条目';

    if (coreContent) {
        coreContent.innerHTML = `
            <div>
                <div class="item-info">
                    当前${typeLabel}：<a href="https://bgm.tv/${currentItem?.entityType}/${itemId}" target="_blank">${itemName}</a>（${itemId}）
                </div>
                <div class="status-box error">
                    提交更新失败: ${escapeHtml(errorMsg)}
                </div>
                <p>是否重试更新？</p>
            </div>
        `;
    }

    if (buttonsContainer) {
        buttonsContainer.innerHTML = `
            <button id="process-mark-error" class="secondary">标记错误</button>
            <span class="buttons-spacer"></span>
            <button id="process-skip-update-fail" class="secondary">跳过</button>
            <button id="process-retry-update" class="primary">重试</button>
        `;
    }
}

export function switchToCompletedView(finishedMsg: string): void {
    state.currentView = 'completed';
    state.processing = false;
    const coreContent = document.getElementById('core-content');
    const buttonsContainer = document.getElementById('static-buttons-container');
    const editRegions = document.getElementById('edit-regions');

    if (editRegions) editRegions.style.display = 'none';

    if (coreContent) {
        coreContent.innerHTML = `
            <div>
                <h3 class="section-title">处理完成</h3>
                <div class="status-box info">${escapeHtml(finishedMsg)}</div>
                <div class="stats-container">
                    <div class="stats-item">
                        <span class="stats-label">本次处理条目</span>
                        <span class="stats-value">${state.processedCount}</span>
                    </div>
                </div>            </div>
        `;
    }

    if (buttonsContainer) {
        buttonsContainer.innerHTML = `
            <button id="completed-back-to-home" class="primary">返回首页</button>
        `;
    }
}
