function normalize(s) {
  return s.replace(/[\s-]/g, '')
    .replace(/[\u30A1-\u30F6]/g, function(m) {
      return String.fromCharCode(m.charCodeAt(0) - 0x60);
    })
    .replace(/[\uFF21-\uFF5A]/g, function(m) {
      return String.fromCharCode(m.charCodeAt(0) - 0xFEE0);
    })
    .toLowerCase();
}

function renderSubjects(idx, container) {
  var data = _pendingData[idx];
  if (!data || !data.subjectsData) return;
  var ul = document.createElement('ul');
  var entries = Object.entries(data.subjectsData).sort(function(a, b) {
    return a[0].localeCompare(b[0]);
  });
  for (var i = 0; i < entries.length; i++) {
    var parts = entries[i][0].split(':');
    var stype = parseInt(parts[0]);
    var sid = parts[1];
    var entry = entries[i][1];
    var li = document.createElement('li');
    li.innerHTML = '<span class="type">[' + (_typeNames[stype] || stype) + ']</span> '
      + '<a href="https://bgm.tv/subject/' + sid + '" target="_blank">' + entry.name + '</a> '
      + '<span class="pos">[' + entry.positions.map(function(p) { return _posNames[p] || p; }).join('\u3001') + ']</span>';
    ul.appendChild(li);
  }
  container.appendChild(ul);
}

document.addEventListener('click', function(e) {
  var det = e.target.closest('details.person');
  if (!det || det.querySelector('ul')) return;
  renderSubjects(parseInt(det.dataset.idx), det);
});

function showResult(btn, html, className) {
  var sr = btn.parentElement.querySelector('.sr');
  if (!sr) {
    sr = document.createElement('div');
    sr.className = 'sr';
    btn.parentElement.insertBefore(sr, btn.nextSibling);
  }
  sr.className = 'sr ' + className;
  sr.innerHTML = html;
}

window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'bgm_mp_request' && _bgmMpPending) {
    e.source.postMessage({ type: 'bgm_mp_data', data: _bgmMpPending }, '*');
  }
});

document.addEventListener('click', function(e) {
  var btn = e.target.closest('.btn-create');
  if (!btn) return;
  var idx = parseInt(btn.dataset.idx);
  var name = btn.dataset.name;
  _bgmMpPending = JSON.stringify(_pendingData[idx]);
  showResult(btn, '\u641C\u7D22\u4E2D\u2026', 'sr-loading');
  fetch('https://api.bgm.tv/v0/search/persons?limit=5', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword: name })
  })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var matches = (data.data || []).filter(function(p) {
        return normalize(p.name) === normalize(name);
      });
      if (matches.length) {
        _bgmMpPending = null;
        var links = matches.map(function(p) {
          return '<a href="https://bgm.tv/person/' + p.id + '" target="_blank">' + p.name + ' (ID:' + p.id + ')</a>';
        }).join(' ');
        showResult(btn, '\u2705 ' + links, 'sr-found');
        return;
      }
      showResult(btn, '\u2796 \u672A\u521B\u5EFA', 'sr-missing');
      window.open('https://bgm.tv/person/new?name=' + encodeURIComponent(name) + '&bgm_mp=1', '_blank');
    })
    .catch(function() {
      showResult(btn, '\u641C\u7D22\u5931\u8D25', 'sr-loading');
    });
});
