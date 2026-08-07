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

var _openccConverters = null;
function getConverters() {
  if (!_openccConverters && typeof OpenCC !== 'undefined') {
    _openccConverters = {
      jp2t: OpenCC.Converter({ from: 'jp', to: 'tw' }),
      t2s: OpenCC.Converter({ from: 'tw', to: 'cn' }),
      tw2s: OpenCC.Converter({ from: 'tw', to: 'cn' }),
      hk2s: OpenCC.Converter({ from: 'hk', to: 'cn' }),
      t2jp: OpenCC.Converter({ from: 'tw', to: 'jp' })
    };
  }
  return _openccConverters;
}

var _openccWaiters = null;
function waitOpenCC() {
  if (typeof OpenCC !== 'undefined' && typeof openccCN !== 'undefined') {
    return Promise.resolve();
  }
  if (!_openccWaiters) {
    _openccWaiters = new Promise(function(resolve) {
      var started = Date.now();
      var t = setInterval(function() {
        if (typeof OpenCC !== 'undefined' && typeof openccCN !== 'undefined') {
          clearInterval(t);
          resolve();
        } else if (Date.now() - started > 8000) {
          clearInterval(t);
          resolve();
        }
      }, 100);
    });
  }
  return _openccWaiters;
}

// refinedSame reports whether two names normalize to the same simplified-Chinese
// form: exact-normalized match, or both convert identically through refinedToCN
// (OpenCC jp→cn pipeline + variant tables, e.g. 髙橋 → 高橋).
function refinedSame(a, b) {
  if (normalize(a) === normalize(b)) return true;
  var conv = getConverters();
  if (!conv || typeof openccCN === 'undefined') return false;
  return openccCN.refinedToCN(a, conv) === openccCN.refinedToCN(b, conv);
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
  waitOpenCC().then(function() {
    return fetch('https://api.bgm.tv/v0/search/persons?limit=5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: name })
    });
  })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var results = (data.data || []).filter(function(p) {
        return normalize(p.name) === normalize(name) || refinedSame(p.name, name);
      });
      if (results.length) {
        _bgmMpPending = null;
        var links = results.map(function(p) {
          return '<a href="https://bgm.tv/person/' + p.id + '" target="_blank">' + p.name + ' (ID:' + p.id + ')</a>';
        }).join(' ');
        showResult(btn, '\u2705 ' + links
          + ' <a class="btn-create-still" href="https://bgm.tv/person/new?name=' + encodeURIComponent(name) + '&bgm_mp=1" target="_blank">\u4ECD\u7136\u521B\u5EFA</a>', 'sr-found');
        return;
      }
      showResult(btn, '\u2796 \u672A\u521B\u5EFA', 'sr-missing');
      window.open('https://bgm.tv/person/new?name=' + encodeURIComponent(name) + '&bgm_mp=1', '_blank');
    })
    .catch(function() {
      showResult(btn, '\u641C\u7D22\u5931\u8D25', 'sr-loading');
    });
});
