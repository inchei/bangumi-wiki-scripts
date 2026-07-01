import { genAppearEps } from './appear-eps.js';
import { POSITION_IDS } from './position-ids.js';

export function showPendingEps(allUnmatched, personName, type) {
  const existing = document.querySelector('.bgm-mp-notify');
  if (existing) existing.remove();

  const sections = allUnmatched.map(({ sid, entry }) => {
    const eps = entry.episodes || [];
    const epLinks = eps
      .map(
        (ep) =>
          `<a class="l" href="https://bgm.tv/ep/${ep.episode_id}#:~:text=${encodeURIComponent(personName)}" target="_blank">${ep.label}</a>`,
      )
      .join(', ');
    return { sid, entry, eps, epLinks };
  });

  if (!sections.length) return;

  const notify = document.createElement('div');
  notify.className = 'bgm-mp-notify';

  const handle = document.createElement('div');
  handle.className = 'staff-tip-handle';
  handle.innerHTML = '<strong>疑似匹配</strong><button class="bgm-mp-notify-close">&times;</button>';

  const content = document.createElement('div');
  content.className = 'staff-tip-content';

  let html =
    '<div class="bgm-mp-pending-header">以下剧集简介包含此名称但未定位到职位：</div>';
  for (const sec of sections) {
    html += `<div class="bgm-mp-pending-item">
        <strong><a href="/subject/${sec.sid}">${sec.entry.name || '#' + sec.sid}</a></strong> ${sec.epLinks}
        <button class="bgm-mp-btn bgm-mp-relate-btn" data-sid="${sec.sid}" href="javascript:">关联</button>
        <button class="bgm-mp-btn bgm-mp-copy-btn" data-sid="${sec.sid}" href="javascript:">复制</button>
        <button class="bgm-mp-btn bgm-mp-locate-btn" data-sid="${sec.sid}" href="javascript:">定位</button>
      </div>`;
  }
  content.innerHTML = html;

  notify.append(handle, content);
  notify.style.opacity = '0';
  document.body.appendChild(notify);

  const boxW = notify.offsetWidth;
  const boxH = notify.offsetHeight;
  const winW = window.innerWidth;
  const winH = window.innerHeight;

  let right = 50,
    bottom = 50;
  right = Math.min(right, winW - boxW);
  right = Math.max(right, 0);
  bottom = Math.min(bottom, winH - boxH);
  bottom = Math.max(bottom, 0);

  notify.style.bottom = `${bottom}px`;
  notify.style.right = `${right}px`;
  notify.style.opacity = '';

  notify.querySelectorAll('.bgm-mp-btn').forEach((btn) => {
    btn.onclick = () => {
      const sec = sections.find((s) => String(s.sid) === btn.dataset.sid);
      if (!sec) return;
      const epLabels = sec.eps.map((ep) => ep.label);
      if (!epLabels.length) return;
      subjectList = [
        {
          id: Number(sec.sid),
          type_id: type,
          name: sec.entry.name,
          name_cn: '',
          url_mod: 'subject',
        },
      ];
      addRelateSubject(0, 'submitForm');
    };
  });

  notify.querySelectorAll('.bgm-mp-copy-btn').forEach((btn) => {
    btn.onclick = () => {
      const sec = sections.find((s) => String(s.sid) === btn.dataset.sid);
      if (!sec) return;
      const epLabels = sec.eps.map((ep) => ep.label);
      if (!epLabels.length) return;
      navigator.clipboard.writeText(genAppearEps(epLabels));
      const orig = btn.textContent;
      btn.textContent = '复制成功';
      setTimeout(() => (btn.textContent = orig), 2000);
    };
  });

  notify.querySelectorAll('.bgm-mp-locate-btn').forEach((btn) => {
    btn.onclick = () => {
      document.querySelector('[data-group-mode="subject"]').click();
      const l = document.querySelector(`[href="/subject/${btn.dataset.sid}"]`);
      if (!l) return;
      window.location.href += `#:~:text=${l.textContent}`;
    };
  });

  let offX = 0,
    offY = 0;
  handle.onmousedown = (e) => {
    if (e.target.closest('.bgm-mp-notify-close')) return;
    offX = e.clientX - notify.getBoundingClientRect().left;
    offY = e.clientY - notify.getBoundingClientRect().top;
    document.onmousemove = (ev) => {
      notify.style.left = ev.clientX - offX + 'px';
      notify.style.top = ev.clientY - offY + 'px';
      notify.style.right = 'auto';
    };
    document.onmouseup = () => {
      document.onmousemove = null;
    };
  };

  notify.querySelector('.bgm-mp-notify-close').onclick = () => notify.remove();
}
