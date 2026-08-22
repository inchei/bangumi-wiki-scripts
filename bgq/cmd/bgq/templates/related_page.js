function renderSubjects(idx, container) {
  var data = _relatedData[idx];
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

window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'bgm_mp_request' && _bgmMpPending) {
    e.source.postMessage({ type: 'bgm_mp_data', data: _bgmMpPending }, '*');
  }
});

window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'bgm_mp_alias_request' && _bgmMpAliasData) {
    e.source.postMessage({ type: 'bgm_mp_alias_data', data: _bgmMpAliasData }, '*');
  }
});

// 创建 button
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.btn-create');
  if (!btn || btn.dataset.force !== '1') return;
  var idx = parseInt(btn.dataset.idx);
  var name = btn.dataset.name;
  var data = _relatedData[idx];
  if (!data) return;
  _bgmMpPending = JSON.stringify({
    personName: data.personName,
    subjectsData: data.subjectsData,
    episodesData: data.episodesData
  });
  window.open('https://bgm.tv/person/new?name=' + encodeURIComponent(name) + '&bgm_mp=1', '_blank');
});

// 关联 button
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.btn-relate');
  if (!btn) return;
  var idx = parseInt(btn.dataset.idx);
  var data = _relatedData[idx];
  if (!data) return;

  var wrap = btn.parentElement;
  var sel = wrap.querySelector('.relate-select');
  var personId = sel ? parseInt(sel.value) : (data.relatedPersonIds && data.relatedPersonIds.length ? data.relatedPersonIds[0].id : 0);
  openRelate(personId, data);
});

// 添加别名 button
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.btn-alias');
  if (!btn) return;
  var idx = parseInt(btn.dataset.idx);
  var data = _relatedData[idx];
  if (!data) return;

  var wrap = btn.parentElement;
  var sel = wrap.querySelector('.relate-select');
  var personId = sel ? parseInt(sel.value) : (data.relatedPersonIds && data.relatedPersonIds.length ? data.relatedPersonIds[0].id : 0);
  if (!personId) return;

  _bgmMpAliasData = JSON.stringify({
    personName: data.personName,
    personId: personId
  });
  window.open('https://bgm.tv/person/' + personId + '/edit?bgm_mp_alias=1', '_blank');
});

// Sync link href when select changes
document.addEventListener('change', function(e) {
  var sel = e.target.closest('.relate-select');
  if (!sel) return;
  var wrap = sel.parentElement;
  var link = wrap.querySelector('.relate-link');
  if (link) link.href = 'https://bgm.tv/person/' + sel.value;
});
