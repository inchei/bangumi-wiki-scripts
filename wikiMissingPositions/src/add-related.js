import { POSITION_IDS } from './position-ids.js';
import { getProvider } from './api.js';
import { genAppearEps, parseAppearEps, sortAppearEps } from './appear-eps.js';
import { showPendingEps } from './popup.js';
import { processPendingData, getPendingData } from './subject-page.js';

let select, type, nameInput, epNameInput, epBtn, personId;

export function addSubjectLi(sid, posId, name) {
  const existing = document.querySelector(`#crtRelateSubjects li:has([href="/subject/${sid}"])`);
  if (existing?.querySelector('select[name$="[prsnPos]"]')?.value === posId) return existing;
  subjectList = [{ id: Number(sid), type_id: type, name, name_cn: '', url_mod: 'subject' }];
  addRelateSubject(0, 'submitForm');
  document.querySelector('#crtRelateSubjects select[name$="[prsnPos]"]').value = posId;
  return document.querySelector(`#crtRelateSubjects li:has([href="/subject/${sid}"])`);
}

async function processEpisodesData(data, queryName) {
  let none = true;
  for (const [sid, entry] of Object.entries(data.matched || {})) {
    for (const [posId, labels] of Object.entries(entry.episodes || {})) {
      const li = addSubjectLi(sid, posId, entry.name);
      const epInput = li.querySelector('[name$="[appear_eps]"]');
      if (epInput) {
        const currentSet = parseAppearEps(epInput.value);
        const hasAll = labels.every((l) => currentSet.has(l));
        if (!hasAll) {
          none = false;
          epInput.value = genAppearEps(labels);
          if (li.classList.contains('old')) {
            li.style.background =
              document.documentElement.getAttribute('data-theme') === 'dark'
                ? 'rgba(255, 248, 165, 0.08)'
                : 'rgba(255, 248, 165, 0.2)';
          }
        }
      }
    }
  }
  const allUnmatched = [];
  for (const [sid, entry] of Object.entries(data.unmatched || {})) {
    none = false;
    allUnmatched.push({ sid, entry });
  }
  if (allUnmatched.length) showPendingEps(allUnmatched, queryName, type);
  return none;
}

function resolveTarget(name) {
  if (!name || !personId) return '';
  return `&target=${personId}`;
}

export async function runEpisodeCheck() {
  const alias = epNameInput.value.trim();
  const queryName = alias || document.querySelector('.nameSingle').textContent.trim();
  epBtn.disabled = true;
  epBtn.textContent = '获取中……';

  const targetParam = await resolveTarget(alias);

  const pending = getPendingData();
  if (
    pending &&
    pending.episodesData &&
    (Object.keys(pending.episodesData.matched || {}).length ||
      Object.keys(pending.episodesData.unmatched || {}).length)
  ) {
    const none = await processEpisodesData(pending.episodesData, queryName);
    epBtn.textContent = none ? '未查找到任何已填写剧集' : '剧集关联完成！';
    epBtn.disabled = false;
    return;
  }

  const provider = getProvider();
  try {
    const url = `${provider}/api/persons/${encodeURIComponent(queryName)}/missing-episodes${targetParam ? '?' + targetParam.slice(1) : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    const none = await processEpisodesData(data, queryName);
    epBtn.textContent = none ? '未查找到任何已填写剧集' : '剧集关联完成！';
  } catch (e) {
    console.error(e);
    epBtn.textContent = '获取失败，点击重试';
  } finally {
    epBtn.disabled = false;
  }
}

export function initAddRelated() {
  const personName = document.querySelector('.nameSingle').textContent.trim();
  const pidMatch = location.pathname.match(/\/person\/(\d+)/);
  personId = pidMatch ? pidMatch[1] : '';

  type = {
    anime: 2,
    book: 1,
    music: 3,
    game: 4,
    real: 6,
  }[document.querySelector('.cat .selected').href.split('/').pop()];

  select = document.createElement('select');
  select.className = 'bgm-mp-select';
  let posOpts = '<option value="">所有职位</option>';
  Object.keys(POSITION_IDS[type] || {})
    .map(Number)
    .sort(function (a, b) {
      return a - b;
    })
    .forEach(function (id) {
      posOpts += `<option value="${id}">${POSITION_IDS[type][id]}</option>`;
    });
  select.innerHTML = posOpts;

  const container = document.createElement('div');
  container.id = 'bgm-mp-container';

  const group1 = document.createElement('div');
  group1.className = 'bgm-mp-group';

  nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'bgm-mp-input';
  nameInput.placeholder = '别名（可选）';

  const btn = document.createElement('button');
  btn.textContent = '关联已填写条目';
  btn.id = 'missingPositions';
  btn.className = 'bgm-mp-btn';
  btn.addEventListener('click', async () => {
    const position = select.value;

    const pending = getPendingData();
    if (pending && pending.subjectsData && Object.keys(pending.subjectsData).length) {
      const resEntries = Object.entries(pending.subjectsData);
      let none = true;
      for (const [id, entry] of resEntries) {
        for (const pos of entry.positions || []) {
          if (position && String(pos) !== position) continue;
          const existing = document.querySelector(
            `#crtRelateSubjects li:has([href="/subject/${id}"])`,
          );
          if (existing?.querySelector('select[name$="[prsnPos]"]')?.value !== pos) {
            none = false;
            subjectList = [
              { id: Number(id), type_id: type, name: entry.name, name_cn: '', url_mod: 'subject' },
            ];
            addRelateSubject(0, 'submitForm');
            document.querySelector('#crtRelateSubjects select[name$="[prsnPos]"]').value = pos;
          }
        }
      }
      btn.textContent = none ? '未查找到任何已填写条目' : '关联填写完成！';
      return;
    }

    const provider = getProvider();
    try {
      btn.disabled = true;
      btn.textContent = '获取中……';
      const alias = nameInput.value.trim();
      const targetParam = await resolveTarget(alias);
      const res = await fetch(
        `${provider}/api/persons/${encodeURIComponent(alias || personName)}/missing-subjects?type=${type}&position=${position}${targetParam}`,
      );
      const data = await res.json();
      const resEntries = Object.entries(data);
      let none = true;
      for (const [id, entry] of resEntries) {
        for (const pos of entry.positions) {
          const existing = document.querySelector(
            `#crtRelateSubjects li:has([href="/subject/${id}"])`,
          );
          if (existing?.querySelector('select[name$="[prsnPos]"]')?.value !== pos) {
            none = false;
            subjectList = [
              { id: Number(id), type_id: type, name: entry.name, name_cn: '', url_mod: 'subject' },
            ];
            addRelateSubject(0, 'submitForm');
            document.querySelector('#crtRelateSubjects select[name$="[prsnPos]"]').value = pos;
          }
        }
      }
      btn.textContent = none ? '未查找到任何已填写条目' : '关联填写完成！';
    } catch (e) {
      console.error(e);
      btn.textContent = '获取失败，点击重试';
    } finally {
      btn.disabled = false;
    }
  });

  const group2 = document.createElement('div');
  group2.className = 'bgm-mp-group';

  if (type === 2) {
    epNameInput = document.createElement('input');
    epNameInput.type = 'text';
    epNameInput.className = 'bgm-mp-input';
    epNameInput.placeholder = '别名（可选）';
    epBtn = document.createElement('button');
    epBtn.textContent = '关联已填写剧集';
    epBtn.id = 'missingEpisodes';
    epBtn.className = 'bgm-mp-btn';
    epBtn.addEventListener('click', runEpisodeCheck);
    group2.append(epNameInput, epBtn);
  }

  group1.append(nameInput, select, btn);
  container.append(group1, group2);
  document.querySelector('#indexCatBox').after(container);

  processPendingData();
}
