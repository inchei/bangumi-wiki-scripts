import { POSITION_IDS } from './position-ids.js';
import { getProvider } from './api.js';
import { genAppearEps } from './appear-eps.js';
import { showPendingEps } from './popup.js';
import { addSubjectLi } from './add-related.js';


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
  const href = document.querySelector('.focus').href.split('/').pop();
  const typeCode = { anime: 2, book: 1, music: 3, game: 4, real: 6 }[href] || 0;
  if (!typeCode) return;

  const posNames = new Set(Object.values(POSITION_IDS[typeCode] || {}));

  const infobox = document.querySelector('#infobox');
  if (!infobox) return;

  const DELIM_RE = /[()[\]{}（）<>《》「」『』【】+×·→/／、,，;；：&＆\\等]+/;

  infobox.querySelectorAll('li').forEach((li) => {
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
          node.parentElement.closest('a, .tip') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
      });
      const tNodes = [];
      while (walker.nextNode()) tNodes.push(walker.currentNode);
      for (const node of tNodes) {
        const html = node.textContent.replace(nameRE, (_, name, p3) =>
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
  handle.innerHTML = `<strong>${personName}</strong><button class="bgm-mp-notify-close">&times;</button>`;

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
  function cx(e) { return e.touches ? e.touches[0].clientX : e.clientX; }
  function cy(e) { return e.touches ? e.touches[0].clientY : e.clientY; }
  handle.onmousedown = handle.ontouchstart = (e) => {
    if (e.target.closest('.bgm-mp-notify-close')) return;
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

  // Fetch data
  (async () => {
    const typeParam = typeCode ? `?type=${typeCode}` : '';
    const encodedName = encodeURIComponent(personName);

    let subjectsData = null,
      episodesData = null,
      aborted = false;

    try {
      const subjRes = await fetch(
        `${provider}/api/persons/${encodedName}/missing-subjects${typeParam}`,
        { signal },
      );
      if (!subjRes.ok) {
        subjectsData = null;
      } else {
        subjectsData = await subjRes.json();
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        aborted = true;
        return;
      }
    }

    if (typeCode === 2) {
      try {
        const epRes = await fetch(
          `${provider}/api/persons/${encodedName}/missing-episodes`,
          { signal },
        );
        if (epRes.ok) {
          episodesData = await epRes.json();
        }
      } catch (e) {
        if (e.name === 'AbortError') {
          aborted = true;
          return;
        }
      }
    }

    if (aborted) return;

    const hasNetworkError = subjectsData === null;
    const subjEntries = hasNetworkError ? [] : Object.entries(subjectsData || {});
    const hasData = subjEntries.length || (episodesData && (Object.keys(episodesData.matched || {}).length || Object.keys(episodesData.unmatched || {}).length));

    let html = '';

    if (hasNetworkError) {
      const errColor = document.documentElement.getAttribute('data-theme') === 'dark' ? '#e57373' : '#a0222e';
      html = `<div class="bgm-mp-loading-wrap" style="color:${errColor}">获取失败，请检查API地址或网络</div>`;
    } else {
      if (subjEntries.length) {
        html += '<div class="bgm-mp-result-list">';
        html += '<div class="bgm-mp-section-title">缺失条目关联：</div>';
        for (const [sid, entry] of subjEntries) {
          const posNames = (entry.positions || [])
            .map((pid) => POSITION_IDS[typeCode]?.[pid] || pid)
            .join('、');
          html += `<div><strong><a class="l" href="/subject/${sid}" target="_blank">${entry.name || '#' + sid}</a></strong> - ${posNames}</div>`;
        }
        html += '</div>';
      } else {
        html += '<div class="bgm-mp-empty-hint">无缺失条目关联</div>';
      }

      if (episodesData) {
        const epEntries = Object.entries(episodesData.matched || {});
        if (epEntries.length) {
          html += '<div class="bgm-mp-result-list">';
          html += '<div class="bgm-mp-section-title">缺失剧集关联：</div>';
          for (const [sid, entry] of epEntries) {
            const posMap = entry.episodes || {};
            const parts = Object.entries(posMap).map(
              ([pid, labels]) => `${POSITION_IDS[typeCode]?.[pid] || pid}：${genAppearEps(labels)}`,
            );
            html += `<div><strong><a class="l" href="/subject/${sid}" target="_blank">${entry.name || '#' + sid}</a></strong> ${parts.join('，')}</div>`;
          }
          html += '</div>';
        }
        if (Object.keys(episodesData.unmatched || {}).length) {
          html += '<div class="bgm-mp-unmatched-hint">另有部分集数未定位到职位</div>';
        }
      }

      html += `<div class="bgm-mp-popup-actions">
          <button class="bgm-mp-btn" id="bgm-mp-create-btn"${hasData ? '' : ' disabled style="opacity:0.5"'}>创建人物</button>
        </div>`;
    }

    content.innerHTML = html;

    if (!hasNetworkError) {
      document.querySelector('#bgm-mp-create-btn').onclick = () => {
        if (!hasData) return;
        localStorage.setItem(
          'bgm-mp-pending',
          JSON.stringify({
            personName,
            typeCode,
            subjectsData,
            episodesData,
          }),
        );
        window.open('/person/new');
      };
    }
  })();
}

export function initPersonNewPage() {
  const raw = localStorage.getItem('bgm-mp-pending');
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    const input = document.querySelector('#crt_name');
    if (input && data.personName) input.value = data.personName;
  } catch (_e) { /* ignore */ }
}

export function initPersonPage() {
  const raw = localStorage.getItem('bgm-mp-pending');
  if (!raw) return;
  const personId = location.pathname.match(/\/person\/(\d+)/)?.[1];
  if (!personId) return;
  try {
    const data = JSON.parse(raw);
    const typeExt = { 1: 'book', 2: 'anime', 3: 'music', 4: 'game', 6: 'real' }[data.typeCode];
    if (!typeExt) return;
    location.href = `/person/${personId}/add_related/${typeExt}`;
  } catch (_e) { /* ignore */ }
}

let _pendingData = null;
export function getPendingData() { return _pendingData; }

export function processPendingData() {
  const raw = localStorage.getItem('bgm-mp-pending');
  if (!raw) return;

  const referrer = document.referrer;
  if (!referrer.includes('/person/new') && !referrer.match(/\/person\/\d+$/)) return;

  try {
    const data = JSON.parse(raw);
    _pendingData = data;
    if (!data.subjectsData) {
      localStorage.removeItem('bgm-mp-pending');
      return;
    }

    for (const [sid, entry] of Object.entries(data.subjectsData)) {
      for (const posId of entry.positions || []) {
        const li = addSubjectLi(Number(sid), posId, entry.name);
        if (li && li.classList.contains('old')) {
          li.style.background =
            document.documentElement.getAttribute('data-theme') === 'dark'
              ? 'rgba(255, 248, 165, 0.08)'
              : 'rgba(255, 248, 165, 0.2)';
        }
      }
    }

    if (data.episodesData?.matched) {
      for (const [sid, entry] of Object.entries(data.episodesData.matched)) {
        for (const [posId, labels] of Object.entries(entry.episodes || {})) {
          const li = addSubjectLi(Number(sid), Number(posId), entry.name);
          const epInput = li.querySelector('[name$="[appear_eps]"]');
          if (epInput) {
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

    if (Object.keys(data.episodesData?.unmatched || {}).length) {
      const allUnmatched = Object.entries(data.episodesData.unmatched).map(([sid, entry]) => ({
        sid,
        entry,
      }));
      showPendingEps(allUnmatched, data.personName, data.typeCode);
    }

    localStorage.removeItem('bgm-mp-pending');
  } catch (e) {
    localStorage.removeItem('bgm-mp-pending');
  }
}
