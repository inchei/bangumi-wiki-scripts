// Map entity type to API config
function getEntityApiConfig(type, id) {
    const configs = {
        subject: {
            wikiPath: `/p1/wiki/subjects/${id}`,
            historyPath: `/p1/wiki/subjects/${id}/history-summary`,
            patchBodyKey: 'subject',
            editPagePath: `https://bgm.tv/subject/${id}/edit`,
        },
        character: {
            wikiPath: `/p1/wiki/characters/${id}`,
            historyPath: `/p1/wiki/characters/${id}/history-summary`,
            patchBodyKey: 'character',
            editPagePath: `https://bgm.tv/character/${id}/edit`,
        },
        person: {
            wikiPath: `/p1/wiki/persons/${id}`,
            historyPath: `/p1/wiki/persons/${id}/history-summary`,
            patchBodyKey: 'person',
            editPagePath: `https://bgm.tv/person/${id}/edit`,
        },
    };
    return configs[type] || configs.subject;
}

function startProcessing() {
    // Validate required parameters for the chosen submit method
    if (state.submitMethod === 'patch' && !state.accessToken) {
        showStatusMessage('请输入Access Token');
        return;
    }

    if (state.submitMethod === 'post' && !state.formhash) {
        showStatusMessage('请输入Formhash');
        return;
    }

    if (!state.csvData || state.csvData.length === 0) {
        showStatusMessage('请上传有效的CSV文件');
        return;
    }

    state.totalItems = state.csvData.length;
    state.processing = true;
    state.paused = false;

    const coreContent = document.getElementById('core-content');
    coreContent.innerHTML = `
        <div>
            <div class="item-info">准备处理第一个条目...</div>
        </div>
    `;

    const buttonsContainer = document.getElementById('static-buttons-container');
    buttonsContainer.innerHTML = `
        <button id="process-cancel" class="danger">取消</button>
    `;

    processNextItem();
}

function processNextItem(isRetry = false) {
    if (state.paused || !state.processing) return;

    if (state.currentIndex >= state.totalItems) {
        switchToCompletedView();
        return;
    }

    const currentItem = state.csvData[state.currentIndex];
    const entityType = currentItem.type || 'subject';

    // Characters and persons only support PATCH API
    if (entityType !== 'subject' && state.submitMethod === 'post') {
        showStatusMessage('角色和人物仅支持 Private API (PATCH) 提交方式，请在设置中切换');
        return;
    }

    if (!isRetry) {
        updateProgressBar(state.currentIndex, state.totalItems);
    }

    document.querySelectorAll('#static-buttons-container button').forEach(btn => {
        btn.disabled = true;
    });
    showLoadingOverlay('正在获取条目信息...');

    const { wikiPath, historyPath } = getEntityApiConfig(entityType, currentItem.id);

    const headers = state.submitMethod === 'patch' ? {
        'Authorization': `Bearer ${state.accessToken}`,
        'Accept': 'application/json'
    } : {
        'Accept': 'application/json'
    };

    Promise.all([
        GM_fetch(wikiPath, { headers }),
        GM_fetch(historyPath, { headers })
    ])
        .then(async ([wikiResponse, historyResponse]) => {
            if (!wikiResponse.ok) throw new Error(`HTTP ${wikiResponse.status}`);
            if (!historyResponse.ok) throw new Error(`HTTP ${historyResponse.status}`);

            const wikiData = await wikiResponse.json();
            const historyData = await historyResponse.json();
            return { currentItem, wikiData, historyData };
        })
        .then((itemData) => {
            state.retryCount[itemData.currentItem.id] = 0;
            hideLoadingOverlay();
            document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                btn.disabled = false;
            });

            switchToProcessingView(itemData);
        })
        .catch(error => {
            hideLoadingOverlay();
            document.querySelectorAll('#static-buttons-container button').forEach(btn => {
                btn.disabled = false;
            });

            switchToProcessingErrorView(currentItem, error.message);
        });
}

function submitUpdate(itemId, newWcode, newTags, newSeries, itemName, currentItem, commitMessage, onSuccess, onError) {
    state.processing = true;

    const entityType = currentItem.type || 'subject';

    if (state.submitMethod === 'patch') {
        const { wikiPath, patchBodyKey } = getEntityApiConfig(entityType, itemId);

        // Build type-specific request body
        const patchBody = {
            commitMessage: commitMessage,
        };

        if (entityType === 'subject') {
            patchBody.subject = {
                infobox: newWcode,
                metaTags: newTags,
                series: newSeries
            };
        } else {
            // Character and Person: no metaTags or series
            patchBody[patchBodyKey] = {
                infobox: newWcode,
            };
        }

        GM_fetch(wikiPath, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${state.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(patchBody)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP ${response.status} - ${text || '更新失败'}`);
                    });
                }
                return response;
            })
            .then(() => {
                hideLoadingOverlay();
                onSuccess();
            })
            .catch(error => {
                onError(error);
            });
    } else if (entityType === 'subject') {
        // POST form submission method — only for subjects
        const formattedInfobox = newWcode.replace(/\n/g, '\r\n');

        const formData = new FormData();
        formData.append('formhash', state.formhash);
        formData.append('subject_title', state.currentSubjectData.name || '');
        formData.append('platform', state.currentSubjectData.platform || '');
        formData.append('subject_infobox', formattedInfobox);
        formData.append('subject_summary', state.currentSubjectData.summary || '');
        formData.append('subject_meta_tags', newTags.join(' '));
        formData.append('editSummary', commitMessage);
        formData.append('series', newSeries ? '1' : '0');
        formData.append('submit', '提交');

        const formParams = new URLSearchParams();
        formData.forEach((value, key) => {
            formParams.append(key, value);
        });

        GM.xmlHttpRequest({
            method: 'POST',
            url: `https://bgm.tv/subject/${itemId}/new_revision`,
            data: formParams.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function (response) {
                hideLoadingOverlay();

                const successPattern = new RegExp(`${itemName} 的新描述`);
                if (successPattern.test(response.responseText)) {
                    onError(new Error('更新失败，可能是formhash无效或权限不足'));
                } else {
                    onSuccess();
                }
            },
            onerror: function (error) {
                hideLoadingOverlay();
                onError(new Error(`网络错误: ${error.message}`));
            },
            onabort: function () {
                hideLoadingOverlay();
                onError(new Error('请求已中止'));
            },
            ontimeout: function () {
                hideLoadingOverlay();
                onError(new Error('请求超时'));
            }
        });
    } else {
        onError(new Error('角色和人物仅支持 Private API (PATCH) 提交方式'));
    }
}
