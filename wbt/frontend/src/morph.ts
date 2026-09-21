import { MorphIconElement, defineMorphIcon, type IconInput } from 'morphicons/element';
import {
    ArrowLeft,
    House,
    LoaderCircle,
    Lock,
    LockOpen,
    LogOut,
    Moon,
    Settings,
    Sun,
} from 'lucide';
import { MorphController } from 'torph';

let defined = false;

export function initMorphIcons(): void {
    if (defined) return;
    defineMorphIcon();
    defined = true;
}

const STATIC_ICONS: Record<string, IconInput> = {
    'arrow-left': ArrowLeft,
    'home': House,
    'loader': LoaderCircle,
    'logout': LogOut,
    'settings': Settings,
};

export function paintStaticIcons(root: ParentNode = document): void {
    initMorphIcons();
    root.querySelectorAll('morph-icon[data-icon]').forEach((el) => {
        if (!(el instanceof MorphIconElement)) return;
        const icon = STATIC_ICONS[el.dataset.icon ?? ''];
        if (icon) el.set(icon);
    });
}

function morphEl(btn: HTMLElement): MorphIconElement | null {
    initMorphIcons();
    const el = btn.querySelector('morph-icon');
    return el instanceof MorphIconElement ? el : null;
}

export function setThemeIcon(dark: boolean, animate: boolean): void {
    const btn = document.getElementById('bgm-tool-theme');
    if (!btn) return;
    const el = morphEl(btn);
    if (!el) return;
    const icon = dark ? Moon : Sun;
    if (animate) el.morphTo(icon);
    else el.set(icon);
    btn.title = '主题: ' + (dark ? '深色' : '浅色');
}

export function setLockIcon(locked: boolean, animate: boolean): void {
    const btn = document.getElementById('static-lock-commit');
    if (!btn) return;
    const el = morphEl(btn);
    if (!el) return;
    const icon = locked ? Lock : LockOpen;
    if (animate) el.morphTo(icon);
    else el.set(icon);
    btn.title = locked ? '解锁编辑摘要' : '固定编辑摘要';
}

let confirmMorph: MorphController | null = null;
let lastConfirmText = '';

export function setConfirmButtonText(btn: HTMLButtonElement, text: string): void {
    if (confirmMorph && text === lastConfirmText) return;
    lastConfirmText = text;
    if (!confirmMorph) {
        confirmMorph = new MorphController();
        confirmMorph.attach(btn, { ease: { stiffness: 420, damping: 30 } });
    }
    confirmMorph.update(text);
}
