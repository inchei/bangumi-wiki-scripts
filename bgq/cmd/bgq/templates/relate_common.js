// Shared relate logic, used by both missing_page.js and related_page.js:
// the bgm_mp_relate postMessage channel plus openRelate(), which hands the
// person's pending subjects over to the wikiMissingPositions userscript on the
// /person/{id}/add_related/{type} page.
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'bgm_mp_relate_request' && _bgmMpRelateData) {
    e.source.postMessage({ type: 'bgm_mp_relate_data', data: _bgmMpRelateData }, '*');
  }
});

function openRelate(personId, data) {
  if (!personId || !data) return;
  _bgmMpRelateData = JSON.stringify({
    personName: data.personName,
    subjectsData: data.subjectsData,
    episodesData: data.episodesData
  });

  var firstType = null;
  var keys = Object.keys(data.subjectsData || {});
  for (var i = 0; i < keys.length; i++) {
    var t = data.subjectsData[keys[i]]._type;
    if (t) { firstType = t; break; }
  }
  var typeExt = { 1: 'book', 2: 'anime', 3: 'music', 4: 'game', 6: 'real' }[firstType] || 'book';
  window.open('https://bgm.tv/person/' + personId + '/add_related/' + typeExt + '?bgm_mp_relate=1', '_blank');
}