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

    // Detect type column, default to 'subject' for backward compatibility
    const typeIndex = headers.findIndex(h => h.toLowerCase() === 'type');
    const TYPE_MAP = {
        'subject': 'subject',
        'character': 'character', 'crt': 'character',
        'person': 'person', 'prsn': 'person',
    };

    const fieldNames = headers.filter((h, i) => i !== idIndex && i !== typeIndex);
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const id = values[idIndex]?.trim();

        if (id) {
            const rawType = typeIndex !== -1 ? (values[typeIndex]?.trim().toLowerCase() || 'subject') : 'subject';
            const item = { id, type: TYPE_MAP[rawType] || 'subject' };
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
