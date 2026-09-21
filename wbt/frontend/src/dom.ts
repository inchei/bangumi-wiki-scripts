import { state, saveState, type ThemeMode } from './core';
import { switchToHomeView, switchToSetupView, switchToLoginView } from './views';
import { hideStatusMessage } from './ui';
import {
    updateConfirmButtonState,
    generateCommitMessage,
    refreshDiffDisplays,
    getResolvedTheme,
} from './diff';
import {
    handleHomeViewButtons,
    handleProcessingViewButtons,
    handleCompletedViewButtons,
} from './handlers';
import { enterWorkgroup, stopLockExtender } from './flow';

import { paintStaticIcons, setLockIcon, setThemeIcon } from './morph';
import { refreshDiffLayout } from './cm-diff';
import { spriteDataUrl } from './sprite';

const spriteCols = 7;
const spriteW = 40;
let logoCol = Math.floor(Math.random() * spriteCols);

function cycleLogo(): void {
    logoCol = (logoCol + 1) % spriteCols;
    const el = document.getElementById('bgm-tool-logo-sprite');
    if (el) el.style.backgroundPosition = `${-logoCol * spriteW}px 0`;
}

function applyTheme(mode: ThemeMode): void {
    const container = document.getElementById('bgm-tool-container');
    if (!container) return;
    container.classList.add('no-transitions');
    const isDark =
        mode === 'dark' ||
        (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
        container.setAttribute('data-theme', 'dark');
    } else {
        container.removeAttribute('data-theme');
    }
    void container.offsetWidth;
    container.classList.remove('no-transitions');
}

function systemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function oppositeTheme(mode: 'light' | 'dark'): 'light' | 'dark' {
    return mode === 'dark' ? 'light' : 'dark';
}

function cycleTheme(): void {
    if (state.theme === 'system') {
        state.theme = oppositeTheme(systemTheme());
        localStorage.setItem('wbtTheme', state.theme);
    } else {
        const next = oppositeTheme(state.theme);
        if (next === systemTheme()) {
            state.theme = 'system';
            localStorage.removeItem('wbtTheme');
        } else {
            state.theme = next;
            localStorage.setItem('wbtTheme', state.theme);
        }
    }
    applyTheme(state.theme);
    updateThemeButton(true);
    if (state.currentView === 'processing') {
        refreshDiffDisplays();
    }
}

function updateThemeButton(animate = false): void {
    const btn = document.getElementById('bgm-tool-theme');
    if (!btn) return;
    setThemeIcon(getResolvedTheme() === 'dark', animate);
}

export function createStaticDOM(): void {
    if (document.getElementById('bgm-tool-container')) {
        return;
    }

    const container = document.createElement('div');
    container.id = 'bgm-tool-container';
    container.innerHTML = `
        <div id="bgm-tool-header">
            <div id="bgm-tool-header-logo">
                <div id="bgm-tool-logo-sprite" style="background-image: url(${spriteDataUrl}); background-position: ${-logoCol * spriteW}px 0;"></div>
                <span>Wiki 批量审核</span>
                <span id="bgm-remaining" class="header-remaining"></span>
            </div>
            <span class="header-spacer"></span>
            <div id="bgm-tool-header-actions">
                <span id="bgm-user-name" class="header-user"></span>
                <button id="bgm-tool-theme" class="btn btn-default" title="主题" tabindex="0"><morph-icon size="16" reduced-motion="user"></morph-icon></button>
                <button id="bgm-tool-settings" class="btn btn-default" title="设置" tabindex="0"><morph-icon data-icon="settings" size="16"></morph-icon></button>
                <button id="bgm-tool-home" class="btn btn-default" title="返回首页" tabindex="0"><morph-icon data-icon="home" size="16"></morph-icon></button>
                <button id="bgm-tool-logout" class="btn btn-default" title="退出登录" tabindex="0"><morph-icon data-icon="logout" size="16"></morph-icon></button>
            </div>
        </div>
        <div class="loading-container">
            <div id="bgm-tool-body">
                <div id="core-content"></div>
                <div id="edit-regions">
                    <div class="prev-item-link" id="prev-item-link"></div>

                    <div class="last-update-info" id="static-last-update"></div>
                    <div class="commit-message-area" id="static-commit-area">
                        <label for="static-commit-input">编辑摘要</label>
                        <div class="row-flex">
                            <input type="text" id="static-commit-input" placeholder="请输入编辑摘要">
                            <button id="static-lock-commit" class="secondary" title="${state.isCommitMessageLocked ? '解锁编辑摘要' : '固定编辑摘要'}">
                                <morph-icon size="16" reduced-motion="user"></morph-icon>
                            </button>
                        </div>
                    </div>
                    <div class="edit-rows">
                        <div class="edit-row">
                            <div class="edit-area" id="static-wcode-area">
                                <label>Wcode</label>
                                <div id="static-cm-diff"></div>
                            </div>
                            <div class="wcode-diff-col" style="display: none;">
                                <div class="diff-section-label">Wcode 变更</div>
                                <div class="diff-section wcode-diff-section">
                                    <div id="static-content-diff-container" class="diff-container"></div>
                                </div>
                            </div>
                        </div>
                        <div class="edit-row">
                            <div class="edit-area" id="static-tags-area">
                                <label>标签（空格分隔）</label>
                                <div id="static-tags-cm-diff"></div>
                            </div>
                        </div>
                        <div class="edit-row" id="static-series-area">
                            <label class="toggle-switch">
                                <input type="checkbox" id="static-series-checkbox">
                                <span class="toggle-slider"></span>
                            </label>
                            <label for="static-series-checkbox">标记为系列</label>
                        </div>
                    </div>
                    <div id="diff-error"></div>
                    <div id="status-container" class="status-box"></div>
                </div>
            </div>
            <div class="buttons-container" id="static-buttons-container"></div>
            <div id="bgm-loading-overlay">
                <div class="bouncy" role="status" aria-label="加载中">
                    <div class="bouncy-cube"><div class="bouncy-cube-inner"></div></div>
                    <div class="bouncy-cube"><div class="bouncy-cube-inner"></div></div>
                    <div class="bouncy-cube"><div class="bouncy-cube-inner"></div></div>
                </div>
                <div id="loading-text"></div>
            </div>
        </div>
        <div id="bgm-status-message"></div>
    `;
    document.body.appendChild(container);

    bindEventDelegation();

    const homeBtn = document.getElementById('bgm-tool-home');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            stopLockExtender();
            void switchToHomeView();
        });
    }

    const logoutBtn = document.getElementById('bgm-tool-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            void fetch('/auth/logout', { method: 'POST' }).finally(() => {
                location.href = '/';
            });
        });
    }

    const settingsBtn = document.getElementById('bgm-tool-settings');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            openSetupView();
        });
    }

    const themeBtn = document.getElementById('bgm-tool-theme');
    if (themeBtn) {
        themeBtn.addEventListener('click', cycleTheme);
    }

    const logo = document.getElementById('bgm-tool-header-logo');
    if (logo) {
        logo.addEventListener('click', cycleLogo);
    }

    applyTheme(state.theme);
    updateThemeButton();
    paintStaticIcons();
    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
            if (state.theme === 'system') {
                applyTheme('system');
                if (state.currentView === 'processing') {
                    refreshDiffDisplays();
                }
            }
        });

    bindEditRegionEvents();

    void bootstrap();
}

async function bootstrap(): Promise<void> {
    try {
        const resp = await fetch('/api/me', { headers: { 'Accept': 'application/json' } });
        if (resp.status === 401) {
            switchToLoginView();
            return;
        }
        const me = await resp.json() as { id: number; name: string; hasCookie: boolean; lockExtendMs: number };
        state.userId = me.id;
        state.userName = me.name;
        state.hasCookie = me.hasCookie;
        const nameEl = document.getElementById('bgm-user-name');
        if (nameEl) nameEl.textContent = me.name;
    } catch {
        switchToLoginView();
        return;
    }
    void switchToHomeView();
}

export function openSetupView(): void {
    void (async () => {
        try {
            const resp = await fetch('/api/me', { headers: { 'Accept': 'application/json' } });
            if (resp.status === 401) {
                switchToLoginView();
                return;
            }
            if (!resp.ok) {
                throw new Error('HTTP ' + resp.status);
            }
            const me = await resp.json() as { id: number; name: string; hasCookie: boolean; lockExtendMs: number };
            switchToSetupView(me);
        } catch {
            switchToLoginView();
        }
    })();
}

function delegateClick(container: HTMLElement): void {
    container.addEventListener('click', (e) => {
        const targetBtn = (e.target as HTMLElement).closest('button');
        if (!targetBtn) return;

        const btnId = targetBtn.id;
        if (btnId === 'workgroup-enter-btn') {
            const card = targetBtn.closest('.workgroup-card, .workgroup') as HTMLElement | null;
            if (card?.dataset.error) {
                enterWorkgroup('error');
            } else if (card?.dataset.sourceId) {
                enterWorkgroup('source', parseInt(card.dataset.sourceId, 10), card.dataset.sourceName);
            }
        }

        const currentView = state.currentView;

        switch (currentView) {
            case 'home':
                handleHomeViewButtons(btnId, targetBtn);
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

function bindEventDelegation(): void {
    const buttonsContainer = document.getElementById('static-buttons-container');
    if (buttonsContainer) delegateClick(buttonsContainer);
    const coreContent = document.getElementById('core-content');
    if (coreContent) delegateClick(coreContent);
}

function bindEditRegionEvents(): void {
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            if (state.currentView === 'processing') {
                refreshDiffLayout(getResolvedTheme() === 'dark');
            }
        }, 200);
    });
    for (const id of ['static-cm-diff', 'static-tags-cm-diff']) {
        const el = document.getElementById(id);
        if (el) ro.observe(el);
    }

    const commitInput = document.getElementById('static-commit-input') as HTMLInputElement;
    commitInput.addEventListener('input', (e) => {
        if (state.currentView === 'processing' && state.currentSubjectData) {
            state.currentCommitMessage = (e.target as HTMLInputElement).value;
            updateConfirmButtonState();
        }
    });

    const lockCommitBtn = document.getElementById('static-lock-commit') as HTMLButtonElement;
    lockCommitBtn.addEventListener('click', () => {
        if (state.currentView !== 'processing' || !state.currentSubjectData) return;

        state.isCommitMessageLocked = !state.isCommitMessageLocked;
        const commitInput2 = document.getElementById('static-commit-input') as HTMLInputElement;

        if (state.isCommitMessageLocked) {
            state.lockedCommitMessage = commitInput2.value;
            setLockIcon(true, true);
        } else {
            setLockIcon(false, true);

            state.currentCommitMessage = generateCommitMessage(
                state.currentFieldUpdates,
                state.currentTagUpdates,
                state.currentSeriesUpdate,
                state.currentItem?.entityType,
            );
            commitInput2.value = state.currentCommitMessage;
        }
        saveState();
        updateConfirmButtonState();
    });

    const seriesCheckbox = document.getElementById('static-series-checkbox') as HTMLInputElement;
    seriesCheckbox.addEventListener('change', (e) => {
        if (state.currentView === 'processing' && state.currentSubjectData) {
            state.currentSeries = (e.target as HTMLInputElement).checked;
            updateConfirmButtonState();
        }
    });

    setLockIcon(state.isCommitMessageLocked, false);
}
