import Papa from 'papaparse';
import { state, type CsvItem } from './core';
import { showLoadingOverlay, hideLoadingOverlay, showStatusMessage } from './ui';
import { switchToSetupView } from './views';

const TYPE_MAP: Record<string, 'subject' | 'character' | 'person'> = {
    'subject': 'subject',
    'character': 'character', 'crt': 'character',
    'person': 'person', 'prsn': 'person',
};

export function handleFileUpload(this: HTMLInputElement, e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    document.querySelectorAll('#static-buttons-container button').forEach(btn => {
        (btn as HTMLButtonElement).disabled = true;
    });
    showLoadingOverlay('正在解析CSV文件...');

    const reader = new FileReader();
    reader.onload = function (event: ProgressEvent<FileReader>) {
        try {
            const csvContent = (event.target as FileReader).result as string;
            state.csvData = parseCSV(csvContent);
            state.currentIndex = 0;
            state.retryCount = {};
            state.previousItem = null;
            localStorage.setItem('bgmCsvData', JSON.stringify(state.csvData));
            localStorage.setItem('bgmCurrentIndex', '0');
            switchToSetupView();
            showStatusMessage('CSV文件加载成功');
        } catch (error: unknown) {
            showStatusMessage('CSV解析错误: ' + (error as Error).message);
            console.error(error);
        } finally {
            hideLoadingOverlay();
            document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                (btn as HTMLButtonElement).disabled = false;
            });
        }
    };
    reader.readAsText(file);
}

function parseCSV(csvContent: string): CsvItem[] {
    const result = Papa.parse<Record<string, string>>(csvContent, {
        header: true,
        skipEmptyLines: true,
        transform: (value: string) => value.trim(),
    });

    if (result.errors.length) {
        const firstErr = result.errors[0];
        throw new Error(`第${firstErr.row !== undefined ? firstErr.row + 1 : '?'}行: ${firstErr.message}`);
    }

    const headers = result.meta.fields;
    if (!headers || headers.length === 0) {
        throw new Error('CSV文件为空或格式错误');
    }

    const idIndex = headers.findIndex(h => h.toLowerCase() === 'id');
    if (idIndex === -1) {
        throw new Error('CSV必须包含"ID"列');
    }

    const typeIndex = headers.findIndex(h => h.toLowerCase() === 'type');
    const fieldNames = headers.filter((h, i) => i !== idIndex && i !== typeIndex);

    const data: CsvItem[] = [];

    for (const row of result.data) {
        const id = row[headers[idIndex]]?.trim();
        if (!id) continue;

        const rawType = typeIndex !== -1
            ? (row[headers[typeIndex]]?.trim().toLowerCase() || 'subject')
            : 'subject';
        const item: CsvItem = { id, type: TYPE_MAP[rawType] || 'subject' };

        for (const fieldName of fieldNames) {
            const val = row[fieldName];
            if (val !== undefined) {
                item[fieldName] = val.trim();
            }
        }

        data.push(item);
    }

    if (data.length === 0) {
        throw new Error('未找到有效的数据行');
    }

    return data;
}
