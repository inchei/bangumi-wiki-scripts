function getCurrentEntityType() {
    if (!state.csvData || state.currentIndex >= state.csvData.length) return 'subject';
    return state.csvData[state.currentIndex]?.type || 'subject';
}

function checkForUpdates() {
    if (!state.currentSubjectData) return false;

    const entityType = getCurrentEntityType();
    const currentWcode = document.getElementById('static-wcode-input').value;
    const normalizedCurrentWcode = currentWcode.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const originalWcode = state.currentSubjectData.infobox || '';
    const normalizedOriginalWcode = originalWcode.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const wcodeChanged = normalizedCurrentWcode !== normalizedOriginalWcode;

    // Tags and series only apply to subjects
    if (entityType === 'subject') {
        const currentTags = document.getElementById('static-tags-input').value.split(' ').filter(t => t);
        const currentSeries = document.getElementById('static-series-checkbox').checked;
        const originalTags = state.currentSubjectData.metaTags || [];
        const originalSeries = state.currentSubjectData.series || false;
        const tagsChanged = !arraysEqual(currentTags, originalTags);
        const seriesChanged = currentSeries !== originalSeries;
        return wcodeChanged || tagsChanged || seriesChanged;
    }

    return wcodeChanged;
}

function updateConfirmButtonState() {
    const confirmBtn = document.querySelector('#static-buttons-container button#process-confirm-update');
    if (!confirmBtn) return;

    const hasUpdates = checkForUpdates();

    if (hasUpdates) {
        confirmBtn.textContent = '确认更新';
        confirmBtn.disabled = false;
    } else {
        confirmBtn.textContent = '确认更新（无实质修改）';
        confirmBtn.disabled = false;
    }
}

function generateCommitMessage(fieldUpdates, tagUpdates, seriesUpdate, entityType) {
    const updatedFields = Object.keys(fieldUpdates || {});
    const messages = [];

    if (updatedFields.length) messages.push(`更新${updatedFields.join('、')}`);

    // Tags and series only apply to subjects
    if (entityType === 'subject' || !entityType) {
        if (tagUpdates?.add.length) messages.push(`添加标签${tagUpdates.add.join('、')}`);
        if (tagUpdates?.remove.length) messages.push(`删除标签${tagUpdates.remove.join('、')}`);
        if (seriesUpdate?.hasUpdate) {
            messages.push(seriesUpdate.newValue ? '标记为系列' : '取消系列标记');
        }
    }

    return messages.filter(s => s).join('；') || '更新条目信息';
}

function updateDiffDisplay(oldText, newText, containerId) {
    try {
        const normalizedOld = (oldText || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const normalizedNew = (newText || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const fileName = `条目 ${state.currentSubjectData?.name || '未知名称'} - ${state.currentItemId}`;
        const diffString = Diff.createPatch(fileName, normalizedOld, normalizedNew);
        const configuration = {
            drawFileList: false,
            fileListToggle: false,
            fileContentToggle: false,
            matching: 'lines',
            highlight: false
        };

        const container = document.getElementById(containerId);
        const diff2htmlUi = new Diff2HtmlUI(container, diffString, configuration);
        diff2htmlUi.draw();

        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.textContent = script.textContent;
            script.parentNode.replaceChild(newScript, script);
        });

        document.getElementById('diff-error').style.display = 'none';
    } catch (e) {
        console.error('Diff generation error:', e);
        document.getElementById('diff-error').textContent = `差异显示错误: ${e.message}`;
        document.getElementById('diff-error').style.display = 'block';
    }
}

function updateTagsDiffDisplay(oldTags, newTags, containerId) {
    const oldText = oldTags.join(' ');
    const newText = newTags.join(' ');
    updateDiffDisplay(oldText, newText, containerId);
}

function getFieldUpdates(csvItem, oldInfobox) {
    const updates = {};
    Object.keys(csvItem).forEach(key => {
        if (!['id', 'tags', 'series', 'type'].includes(key.toLowerCase())) {
            updates[key] = csvItem[key];
        }
    });
    return updates;
}

function getTagUpdates(csvItem, oldTags) {
    // Tags only apply to subjects
    const entityType = csvItem.type || 'subject';
    if (entityType !== 'subject') {
        return { add: [], remove: [] };
    }

    const tagsStr = csvItem.tags || '';
    const tags = tagsStr.split(' ').filter(t => t);

    const add = [];
    const remove = [];

    tags.forEach(tag => {
        if (tag.startsWith('-')) {
            remove.push(tag.slice(1));
        } else {
            add.push(tag);
        }
    });

    return { add, remove };
}

function getSeriesUpdate(csvItem, oldSeries) {
    // Series only applies to subjects
    const entityType = csvItem.type || 'subject';
    if (entityType !== 'subject') {
        return { hasUpdate: false };
    }

    // Check if CSV has a series column
    if (csvItem.series === undefined || csvItem.series === null || csvItem.series === '') {
        return { hasUpdate: false };
    }

    // Parse CSV series value, supports true/false, 1/0, yes/no
    const seriesValue = csvItem.series.trim().toLowerCase();
    const newValue = seriesValue === 'true' || seriesValue === '1' || seriesValue === 'yes';

    return {
        hasUpdate: newValue !== oldSeries,
        newValue: newValue
    };
}

function updateInfobox(oldInfobox, fieldUpdates) {
    let newInfobox = oldInfobox;

    Object.entries(fieldUpdates).forEach(([field, value]) => {
        value = value.replaceAll('\\n', '\n');
        const regex = new RegExp(`\\|${sanitizeRegExp(field)}\\s*=.*`, 'i');
        if (regex.test(newInfobox)) {
            newInfobox = newInfobox.replace(regex, `|${field}= ${value}`);
        } else {
            const lines = newInfobox.split('\n');
            lines.splice(-1, 0, `|${field}= ${value}`);
            newInfobox = lines.join('\n');
        }
    });

    return newInfobox;
}

function applyTagUpdates(oldTags, tagUpdates) {
    const newTagsSet = new Set(oldTags);
    tagUpdates.add.forEach(tag => newTagsSet.add(tag));
    tagUpdates.remove.forEach(tag => newTagsSet.delete(tag));
    return [...newTagsSet];
}
