import {
  initSubjectPage,
  initPersonNewPage,
  initPersonPage,
  initPersonEditPage,
} from './subject-page.js';
import { getProvider, getShow, saveProvider, saveShow } from './api.js';
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
  if (/^\/person\/\d+\/edit$/.test(pathname)) {
    initPersonEditPage();
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
    customContent: function () {
      const provider = getProvider();
      const show = getShow();
      return /* html */ `
        <div class="bgm-mp-settings">
          <div class="bgm-mp-row">
            <label for="bgm-mp-provider">API 地址</label>
            <input type="text" id="bgm-mp-provider" value="${provider.replace(/"/g, '&quot;')}">
            <button type="button" class="bgm-mp-btn" id="bgm-mp-save" disabled>保存</button>
          </div>
          <div class="bgm-mp-row">
            <label for="bgm-mp-show">条目页显示未关联人物</label>
            <input type="checkbox" class="bgm-mp-toggle" id="bgm-mp-show"${show === 'on' ? ' checked' : ''}>
          </div>
        </div>`;
    },
    onInit: function (tabSelector, $tabContent) {
      const $provider = $tabContent.find('#bgm-mp-provider');
      const $save = $tabContent.find('#bgm-mp-save');
      let savedValue = $provider.val();
      let saveTimer = null;

      function setSaveState(dirty, saving) {
        if (saving) {
          $save.text('保存中').prop('disabled', true);
        } else {
          $save.text('保存').prop('disabled', !dirty);
        }
      }

      function doSave() {
        const val = $provider.val();
        setSaveState(false, true);
        saveProvider(val).then(
          function () {
            savedValue = val;
            setSaveState($provider.val() !== savedValue, false);
          },
          function () {
            setSaveState(true, false);
          },
        );
      }

      $tabContent
        .off('input change', '#bgm-mp-provider')
        .on('input change', '#bgm-mp-provider', function () {
          setSaveState(true, false);
          clearTimeout(saveTimer);
          saveTimer = setTimeout(doSave, 400);
        });
      $tabContent.off('click', '#bgm-mp-save').on('click', '#bgm-mp-save', function () {
        clearTimeout(saveTimer);
        doSave();
      });
      $tabContent.off('change', '#bgm-mp-show').on('change', '#bgm-mp-show', function () {
        saveShow(this.checked ? 'on' : 'off');
      });
    },
  });
}
