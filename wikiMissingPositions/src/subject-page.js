import { POSITION_IDS } from './position-ids.js';
import { getProvider, getShow } from './api.js';
import { genAppearEps } from './appear-eps.js';
import { checkExistingPerson } from './person.js';

const cacheKey = (name, t, target) => `mp:${name}:${t}:${target}`;

const LOADING_MSGS = [
  '坐和放宽',
  '正在准备数据<br>请勿\u2122关闭计算机',
  '好东西就要来了！',
  () => `你已完成${10 * (2 + Math.floor(Math.random() * 7))}%`,
  '正在处理一些事情',
  '你正在成功！',
  '不巧的是，它花费的时间比通常要长',
  '再等一下下就好了',
  '这通常不会太久',
  '我们正在帮你搞定一切',
];

function randomMsg() {
  const m = LOADING_MSGS[Math.floor(Math.random() * LOADING_MSGS.length)];
  return typeof m === 'function' ? m() : m;
}

export function initSubjectPage() {
  if (getShow() === 'off') return;

  const href = document.querySelector('.focus').href.split('/').pop();
  const typeCode = { anime: 2, book: 1, music: 3, game: 4, real: 6 }[href] || 0;
  if (!typeCode) return;

  const posNames = new Set(Object.values(POSITION_IDS[typeCode] || {}));

  const infobox = document.querySelector('#infobox');
  if (!infobox) return;

  const DELIM_RE = /[()[\]{}（）<>《》「」『』【】+×·→/／、,，;；：&＆\\等]+/;

  infobox.querySelectorAll('li:not(.sub_container):not(.sub_group)').forEach((li) => {
    const tip = li.querySelector('.tip');
    if (!tip) return;
    const fieldName = tip.textContent.replace(/[:：]\s*$/, '').trim();
    if (!posNames.has(fieldName)) return;

    const linked = new Set();
    li.querySelectorAll('a').forEach((a) => linked.add(a.textContent.trim()));

    const clone = li.cloneNode(true);
    clone.querySelectorAll('a, .tip').forEach((el) => el.remove());
    const text = clone.textContent;
    const names = text
      .split(DELIM_RE)
      .map((s) => s.trim())
      .filter(Boolean);
    names.sort((a, b) => b.length - a.length);

    let tipHTML = '';
    if (tip) {
      tipHTML = tip.outerHTML;
      tip.remove();
    }

    const unlinked = names.filter((n) => !linked.has(n));
    if (unlinked.length) {
      const nameRE = new RegExp(
        `(?<=^|[^<\\w])(${unlinked.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})([^<\\w]|$)`,
        'g',
      );
      const walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) =>
          node.parentElement.closest('a, .tip')
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT,
      });
      const tNodes = [];
      while (walker.nextNode()) tNodes.push(walker.currentNode);
      for (const node of tNodes) {
        const html = node.textContent.replace(
          nameRE,
          (_, name, p3) =>
            `<a class="bgm-mp-name bgm-mp-name-link" data-name="${name}">${name}</a>${p3}`,
        );
        if (html !== node.textContent) {
          const span = document.createElement('span');
          span.innerHTML = html;
          node.replaceWith(...span.childNodes);
        }
      }
    }

    if (tipHTML) li.insertAdjacentHTML('afterbegin', tipHTML);
  });

  document.querySelectorAll('.bgm-mp-name').forEach((a) => {
    a.addEventListener('click', () => openSubjectPopup(a.dataset.name, typeCode));
  });
}

let _abortController = null;

export function openSubjectPopup(personName, typeCode) {
  if (_abortController) _abortController.abort();
  _abortController = new AbortController();
  const signal = _abortController.signal;

  const existing = document.querySelector('.bgm-mp-subject-popup');
  if (existing) existing.remove();

  const provider = getProvider();

  const popup = document.createElement('div');
  popup.className = 'bgm-mp-notify bgm-mp-subject-popup';

  const handle = document.createElement('div');
  handle.className = 'staff-tip-handle';
  const typeNames = { 1: '书', 2: '动', 3: '乐', 4: '游', 6: '实' };
  const typeChecks = [1, 2, 3, 4, 6]
    .map(
      (t) =>
        `<label class="bgm-mp-popup-type"><input type="checkbox" class="bgm-mp-type-check" value="${t}"${t === typeCode ? ' checked' : ''}>${typeNames[t]}</label>`,
    )
    .join('');
  handle.innerHTML = `<strong>${personName}</strong><span class="bgm-mp-popup-types">${typeChecks}</span><button class="bgm-mp-notify-close">&times;</button>`;

  const content = document.createElement('div');
  content.className = 'staff-tip-content';

  popup.append(handle, content);
  document.body.appendChild(popup);
  content.innerHTML = `<div class="bgm-mp-loading-wrap"><div class="bgm-mp-spinner"></div><div class="bgm-mp-loading-text">${randomMsg()}</div></div>`;

  popup.querySelector('.bgm-mp-notify-close').onclick = () => {
    _abortController.abort();
    popup.remove();
  };

  // Drag
  let offX = 0,
    offY = 0;
  function cx(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }
  function cy(e) {
    return e.touches ? e.touches[0].clientY : e.clientY;
  }
  handle.onmousedown = handle.ontouchstart = (e) => {
    if (e.target.closest('.bgm-mp-notify-close, .bgm-mp-popup-type, .bgm-mp-popup-types')) return;
    const rect = popup.getBoundingClientRect();
    popup.style.transform = 'none';
    popup.style.left = rect.left + 'px';
    popup.style.top = rect.top + 'px';
    offX = cx(e) - rect.left;
    offY = cy(e) - rect.top;
    document.onmousemove = document.ontouchmove = (ev) => {
      popup.style.left = cx(ev) - offX + 'px';
      popup.style.top = cy(ev) - offY + 'px';
    };
    document.onmouseup = document.ontouchend = () => {
      document.onmousemove = document.ontouchmove = null;
    };
  };

  const doMultiFetch = (existing, targetParam) => {
    if (!_ready) return;

    const checked = [...popup.querySelectorAll('.bgm-mp-type-check:checked')].map((c) =>
      Number(c.value),
    );
    const targetId = (existing?.aliased?.id || existing?.directMatches?.[0]?.id || 0).toString();
    const encoded = encodeURIComponent(personName);

    let uncached = [];
    let cached = {};
    for (const t of checked) {
      const key = cacheKey(encoded, t, targetId);
      const cachedData = sessionStorage.getItem(key);
      if (cachedData) {
        try {
          cached[t] = JSON.parse(cachedData);
        } catch {
          uncached.push(t);
        }
      } else {
        uncached.push(t);
      }
    }

    if (uncached.length === 0) {
      renderResults(content, cached, null, encoded, personName);
      return;
    }

    _abortController.abort();
    _abortController = new AbortController();
    const sig = _abortController.signal;
    content.innerHTML = `<div class="bgm-mp-loading-wrap"><div class="bgm-mp-spinner"></div><div class="bgm-mp-loading-text">${randomMsg()}</div></div>`;
    fetchMultiType(personName, provider, sig, content, targetParam, uncached, cached, targetId);
  };

  popup.querySelectorAll('.bgm-mp-type-check').forEach((cb) => {
    cb.addEventListener('change', () => doMultiFetch(_existing, _targetParam));
  });

  // Fetch data
  let _existing = null,
    _targetParam = '',
    _ready = false;
  (async () => {
    const existing = await checkExistingPerson(personName);
    _existing = existing;
    let targetParam = '';
    if (existing.aliased) targetParam = `&target=${existing.aliased.id}`;
    else if (existing.directMatches) targetParam = `&target=${existing.directMatches[0].id}`;
    _targetParam = targetParam;
    _ready = true;

    const hasExisting = existing.aliased || existing.directMatches;

    if (hasExisting) {
      let warningHtml = '';
      if (existing.aliased) {
        if (existing.aliasedMulti && existing.aliasedMulti.length > 1) {
          warningHtml += `<div class="staff-warning-section"><div class="staff-warning-title">别名为「${personName}」匹配到多个人物，已取第一个：</div>`;
          for (const p of existing.aliasedMulti) {
            warningHtml += `<a class="l" href="/person/${p.id}" target="_blank">${p.name}</a> `;
          }
          warningHtml += '</div>';
        } else {
          warningHtml += `<div class="staff-warning-section"><div class="staff-warning-title">别名为「${personName}」的人物已存在：</div><a class="l" href="/person/${existing.aliased.id}" target="_blank">${existing.aliased.name}</a></div>`;
        }
      }
      if (existing.directMatches) {
        warningHtml +=
          '<div class="staff-warning-section"><div class="staff-warning-title">同名人物已存在：</div>';
        for (const p of existing.directMatches) {
          warningHtml += `<a class="l" href="/person/${p.id}" target="_blank">${p.display || p.name}</a> `;
        }
        warningHtml += '</div>';
      }
      warningHtml += '<div class="staff-confirm-section" id="bgm-mp-confirm-btn">仍然加载</div>';
      content.innerHTML = warningHtml;

      document.querySelector('#bgm-mp-confirm-btn').onclick = () => {
        document.querySelector('#bgm-mp-confirm-btn').remove();
        doMultiFetch(existing, targetParam);
      };
    } else {
      doMultiFetch(existing, targetParam);
    }
  })();
}

async function fetchMultiType(
  personName,
  provider,
  signal,
  content,
  targetParam,
  types,
  cached,
  targetId,
) {
  const encodedName = encodeURIComponent(personName);

  let subjectsByType = { ...cached },
    episodesData = null;

  const fetches = types.map((t) =>
    fetch(`${provider}/api/persons/${encodedName}/missing-subjects?type=${t}${targetParam}`, {
      signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Object.keys(data).length) {
          sessionStorage.setItem(cacheKey(encodedName, t, targetId), JSON.stringify(data));
        }
        return { type: t, data };
      })
      .catch((e) => {
        if (e.name === 'AbortError') throw e;
        console.error(`missing-subjects type=${t} failed:`, e);
        return { type: t, data: null };
      }),
  );

  try {
    const results = await Promise.all(fetches);
    for (const r of results) {
      if (r.data && Object.keys(r.data).length) {
        subjectsByType[r.type] = r.data;
      }
    }
  } catch (e) {
    if (e.name !== 'AbortError') throw e;
    return;
  }

  if (types.includes(2)) {
    try {
      const epQuery = targetParam ? '?' + targetParam.slice(1) : '';
      const epRes = await fetch(
        `${provider}/api/persons/${encodedName}/missing-episodes${epQuery}`,
        { signal },
      );
      if (epRes.ok) episodesData = await epRes.json();
    } catch (e) {
      if (e.name === 'AbortError') return;
    }
  }

  renderResults(content, subjectsByType, episodesData, encodedName, personName);
}

function renderResults(content, subjectsByType, episodesData, encodedName, personName) {
  const typeNamesFull = { 1: '书籍', 2: '动画', 3: '音乐', 4: '游戏', 6: '三次元' };
  const totalEntries = Object.values(subjectsByType).reduce((c, d) => c + Object.keys(d).length, 0);
  const hasData =
    totalEntries ||
    (episodesData &&
      (Object.keys(episodesData.matched || {}).length ||
        Object.keys(episodesData.unmatched || {}).length));

  let html = '';

  if (totalEntries) {
    html += '<div class="bgm-mp-result-list">';
    html += '<div class="bgm-mp-section-title">缺失条目关联：</div>';
    for (const t of [2, 1, 3, 4, 6]) {
      const data = subjectsByType[t];
      if (!data) continue;
      html += `<div class="bgm-mp-type-section"><div class="bgm-mp-type-title">${typeNamesFull[t]}</div>`;
      for (const [sid, entry] of Object.entries(data)) {
        const posNames = (entry.positions || [])
          .map((pid) => POSITION_IDS[t]?.[pid] || pid)
          .join('、');
        html += `<div><strong><a class="l" href="/subject/${sid}" target="_blank">${entry.name || '#' + sid}</a></strong> - ${posNames}</div>`;
      }
      html += '</div>';
    }
    html += '</div>';
  }

  if (episodesData) {
    const matched = Object.entries(episodesData.matched || {});
    const unmatched = Object.entries(episodesData.unmatched || {});
    if (matched.length) {
      html += '<div class="bgm-mp-result-list">';
      html += '<div class="bgm-mp-section-title">缺失剧集关联：</div>';
      for (const [sid, entry] of matched) {
        const parts = Object.entries(entry.episodes || {}).map(
          ([pid, labels]) => `${POSITION_IDS[2]?.[pid] || pid}：${genAppearEps(labels)}`,
        );
        html += `<div><strong><a class="l" href="/subject/${sid}" target="_blank">${entry.name || '#' + sid}</a></strong> ${parts.join('，')}</div>`;
      }
      html += '</div>';
    }
    if (unmatched.length) {
      html += '<div class="bgm-mp-result-list">';
      html += '<div class="bgm-mp-section-title">疑似缺失剧集关联：</div>';
      for (const [sid, entry] of unmatched) {
        html += `<div><strong><a class="l" href="/subject/${sid}" target="_blank">${entry.name || '#' + sid}</a></strong> - ${(
          entry.episodes || []
        )
          .map(
            (ep) =>
              `<a class="l" href="/ep/${ep.episode_id}#:~:text=${encodedName}" target="_blank">${ep.label}</a>`,
          )
          .join(', ')}</div>`;
      }
      html += '</div>';
    }
  }

  if (!hasData) {
    html = '<div class="bgm-mp-empty-hint">未找到缺失关联</div>';
  }

  html += `<div class="bgm-mp-popup-actions">
      <button class="bgm-mp-btn" id="bgm-mp-create-btn"${hasData ? '' : ' disabled style="opacity:0.5"'}>创建人物</button>
    </div>`;

  content.innerHTML = html;

  document.querySelector('#bgm-mp-create-btn').onclick = () => {
    if (!hasData) return;
    const allSubjects = {};
    for (const [t, data] of Object.entries(subjectsByType)) {
      for (const [sid, entry] of Object.entries(data)) {
        allSubjects[`${t}:${sid}`] = { ...entry, _type: Number(t) };
      }
    }
    localStorage.setItem(
      'bgm-mp-pending',
      JSON.stringify({
        personName: personName,
        subjectsData: allSubjects,
        episodesData,
      }),
    );
    window.open('/person/new');
  };
}

export async function initPersonNewPage() {
  const params = new URLSearchParams(location.search);

  // 1. localStorage
  let raw = localStorage.getItem('bgm-mp-pending');

  // 2. If bgm_mp param present, try postMessage from opener (HTML page)
  if (!raw && params.has('bgm_mp') && window.opener) {
    raw = await new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), 3000);
      const handler = (e) => {
        if (e.data && e.data.type === 'bgm_mp_data' && e.data.data) {
          clearTimeout(timer);
          window.removeEventListener('message', handler);
          resolve(e.data.data);
        }
      };
      window.addEventListener('message', handler);
      window.opener.postMessage({ type: 'bgm_mp_request' }, '*');
    });
  }

  // 3. Fallback to window.name
  if (!raw) {
    raw = window.name && window.name.startsWith('{') ? window.name : null;
  }

  if (!raw) {
    const nameParam = params.get('name');
    if (nameParam) {
      const input = document.querySelector('#crt_name');
      if (input) input.value = nameParam;
    }
    return;
  }
  try {
    const data = JSON.parse(raw);
    const input = document.querySelector('#crt_name');
    if (input && data.personName) input.value = data.personName;
    localStorage.setItem('bgm-mp-pending', raw);
    window.name = '';
    if (params.has('bgm_mp')) {
      params.delete('bgm_mp');
      const qs = params.toString();
      history.replaceState(null, '', qs ? location.pathname + '?' + qs : location.pathname);
    }
  } catch (_e) {
    /* ignore */
  }
}

export function initPersonPage() {
  const raw = localStorage.getItem('bgm-mp-pending');
  if (!raw) return;
  const personId = location.pathname.match(/\/person\/(\d+)/)?.[1];
  if (!personId) return;
  try {
    const data = JSON.parse(raw);
    const typeExts = { 1: 'book', 2: 'anime', 3: 'music', 4: 'game', 6: 'real' };
    const typeNamesFull = { 1: '书籍', 2: '动画', 3: '音乐', 4: '游戏', 6: '三次元' };
    if (data.subjectsData) {
      const types = [
        ...new Set(
          Object.values(data.subjectsData)
            .map((e) => e._type)
            .filter(Boolean),
        ),
      ];
      if (types.length >= 1) {
        const ext = typeExts[types[0]];
        if (ext) location.href = `/person/${personId}/add_related/${ext}`;
      }
    }
  } catch (e) {
    console.error('initPersonPage failed:', e);
  }
}
