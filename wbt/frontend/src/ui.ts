export function showRemaining(count: number): void {
    const el = document.getElementById('bgm-remaining');
    if (el) el.textContent = `剩余 ${count}`;
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
