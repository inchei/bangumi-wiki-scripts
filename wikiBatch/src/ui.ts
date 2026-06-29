export function showProgressBar(): void {
    const el = document.getElementById('bgm-tool-progress');
    if (el) el.style.display = 'block';
}

export function updateProgressBar(current: number, total: number): void {
    const textEl = document.getElementById('progress-text');
    const barEl = document.getElementById('progress-bar');
    if (textEl) textEl.textContent = `处理进度: ${current}/${total}`;
    const percentage = total > 0 ? (current / total) * 100 : 0;
    if (barEl) barEl.style.width = `${percentage}%`;
}

export function hideProgressBar(): void {
    const el = document.getElementById('bgm-tool-progress');
    if (el) el.style.display = 'none';
}

export function showLoadingOverlay(text: string): void {
    const overlay = document.getElementById('bgm-loading-overlay');
    const textElement = document.getElementById('loading-text');
    if (textElement) textElement.textContent = text;
    if (overlay) overlay.classList.add('active');
}

export function hideLoadingOverlay(): void {
    const overlay = document.getElementById('bgm-loading-overlay');
    if (overlay) overlay.classList.remove('active');
}

export function showStatusMessage(text: string): void {
    const message = document.getElementById('bgm-status-message');
    if (!message) return;
    message.classList.remove('show');
    void message.offsetWidth;
    message.textContent = text;
    message.classList.add('show');

    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);
}

export function hideStatusMessage(): void {
    const message = document.getElementById('bgm-status-message');
    if (message) message.classList.remove('show');
}
