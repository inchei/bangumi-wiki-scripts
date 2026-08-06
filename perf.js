const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('/tmp/scale_index.html', 'utf8');

let t0 = Date.now();
const dom = new JSDOM(html, { url: 'https://example.com/', runScripts: 'dangerously' });
console.log('page parse+script exec:', Date.now() - t0, 'ms');

const d = dom.window.document;
const input = d.getElementById('person-search-input');
const btn = d.getElementById('person-search-btn');
const results = d.getElementById('person-search-results');
const count = d.getElementById('person-search-count');

// measure search with a query matching ~200 items
input.value = '人物';
t0 = Date.now();
btn.click();
console.log('search 人物 (~all 5000):', Date.now() - t0, 'ms, rendered', results.querySelectorAll('details.person').length);

// query matching smaller set
input.value = '人物01';
t0 = Date.now();
btn.click();
console.log('search 人物01 (~556):', Date.now() - t0, 'ms, rendered', results.querySelectorAll('details.person').length);

// empty-ish common query
input.value = '人物02';
t0 = Date.now();
btn.click();
console.log('search 人物02 (~556):', Date.now() - t0, 'ms, rendered', results.querySelectorAll('details.person').length);
