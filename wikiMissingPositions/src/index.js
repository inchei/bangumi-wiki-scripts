import { initSubjectPage, initPersonNewPage, initPersonPage } from './subject-page.js';
import { getProvider, saveProvider } from './api.js';
import { initAddRelated } from './add-related.js';

const pathname = location.pathname;

(function route() {
  if (/^\/subject\/\d+$/.test(pathname)) {
    initSubjectPage();
    return;
  }
  if (pathname === '/person/new') {
    initPersonNewPage();
    return;
  }
  if (/^\/person\/\d+$/.test(pathname)) {
    initPersonPage();
    return;
  }
  // Only add-related pages reach here
  initAddRelated();
})();

if (typeof chiiLib !== 'undefined' && chiiLib.ukagaka && chiiLib.ukagaka.addPanelTab) {
  chiiLib.ukagaka.addPanelTab({
    tab: 'wiki_missing_positions',
    label: '缺失职位',
    type: 'custom',
    customContent: function() {
      const provider = getProvider();
      return /* html */`
        <div class="bgm-mp-settings">
          <div class="bgm-mp-row">
            <label>API 地址</label>
            <input type="text" id="bgm-mp-provider" value="${provider.replace(/"/g, '&quot;')}">
          </div>
        </div>`;
    },
    onInit: function(tabSelector, $tabContent) {
      $tabContent.off('change', '#bgm-mp-provider').on('change', '#bgm-mp-provider', function() {
        saveProvider($(this).val());
      });
    }
  });
}
