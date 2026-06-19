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
