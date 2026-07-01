// ==UserScript==
// @name         预创建人物 / 人物页一键补完已填写未关联条目
// @namespace    bangumi.wiki.missing.positions
// @version      0.0.1
// @description  像 AniDB 一样，无需等待维基人即可查看人物关联 / 维基人可一键补完已填写未关联条目或剧集
// @author       you
// @icon         https://bgm.tv/img/favicon.ico
// @match        http*://bgm.tv/subject/*
// @match        http*://bgm.tv/person/*
// @match        http*://chii.in/subject/*
// @match        http*://chii.in/person/*
// @match        http*://bangumi.tv/subject/*
// @match        http*://bangumi.tv/person/*
// @match        http*://bgm.tv/person/*/add_related/anime
// @match        http*://bgm.tv/person/*/add_related/book
// @match        http*://bgm.tv/person/*/add_related/music
// @match        http*://bgm.tv/person/*/add_related/game
// @match        http*://bgm.tv/person/*/add_related/real
// @match        http*://chii.in/person/*/add_related/anime
// @match        http*://chii.in/person/*/add_related/book
// @match        http*://chii.in/person/*/add_related/music
// @match        http*://chii.in/person/*/add_related/game
// @match        http*://chii.in/person/*/add_related/real
// @match        http*://bangumi.tv/person/*/add_related/anime
// @match        http*://bangumi.tv/person/*/add_related/book
// @match        http*://bangumi.tv/person/*/add_related/music
// @match        http*://bangumi.tv/person/*/add_related/game
// @match        http*://bangumi.tv/person/*/add_related/real
// @grant        none
// @license      MIT
// @gf
// ==/UserScript==

(function () {
  'use strict';
  
const styleEl = document.createElement('style');
styleEl.textContent = `.bgm-mp-settings {
  padding: 12px;
}

.bgm-mp-settings .bgm-mp-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bgm-mp-settings .bgm-mp-row label {
  font-size: 13px;
  color: #909399;
  white-space: nowrap;
  flex-shrink: 0;
  margin-right: 8px;
}

.bgm-mp-settings .bgm-mp-row input {
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  font-size: 13px;
  color: #303133;
  background: #fff;
  outline: none;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 360px;
}

.bgm-mp-settings .bgm-mp-row input:focus {
  border-color: var(--primary-color,#f09199);
  box-shadow: 0 0 0 2px rgb(240 145 153 / 15%);
}

html[data-theme='dark'] .bgm-mp-settings .bgm-mp-row label {
  color: #9a9a9a;
}

html[data-theme='dark'] .bgm-mp-settings .bgm-mp-row input {
  border-color: #404040;
  color: #dcdcdc;
  background: #2d2e2f;
}

html[data-theme='dark'] .bgm-mp-settings .bgm-mp-row input:focus {
  border-color: var(--primary-color,#f09199);
  box-shadow: 0 0 0 2px rgb(240 145 153 / 25%);
}

#bgm-mp-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  float: right;
  margin: 5px 0;
  align-items: flex-end;
}

.bgm-mp-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.bgm-mp-select {
  height: 32px;
  padding: 0 28px 0 10px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  font-size: 13px;
  color: #303133;
  background: #fff;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23909399' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  transition: all 0.2s ease;
  field-sizing: content;
}

.bgm-mp-select:focus {
  border-color: var(--primary-color,#f09199);
  box-shadow: 0 0 0 2px rgb(240 145 153 / 15%);
}

.bgm-mp-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

html[data-theme='dark'] .bgm-mp-select {
  border-color: #404040;
  color: #dcdcdc;
  background-color: #2d2e2f;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239a9a9a' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
}

html[data-theme='dark'] .bgm-mp-select:focus {
  border-color: var(--primary-color,#f09199);
  box-shadow: 0 0 0 2px rgb(240 145 153 / 25%);
}

.bgm-mp-input {
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  font-size: 13px;
  color: #303133;
  background: #fff;
  outline: none;
  transition: all 0.2s ease;
  field-sizing: content;
}

.bgm-mp-input:focus {
  border-color: var(--primary-color,#f09199);
  box-shadow: 0 0 0 2px rgb(240 145 153 / 15%);
}

html[data-theme='dark'] .bgm-mp-input {
  border-color: #404040;
  color: #dcdcdc;
  background: #2d2e2f;
}

html[data-theme='dark'] .bgm-mp-input:focus {
  border-color: var(--primary-color,#f09199);
  box-shadow: 0 0 0 2px rgb(240 145 153 / 25%);
}
/* Notification - wikiEpStaffRelate tip box style */
.bgm-mp-notify {
  position: fixed;
  width: min(380px, 100vw);
  backdrop-filter: blur(10px);
  background: rgba(254, 254, 254, 0.8);
  border-radius: 15px;
  background-clip: padding-box;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 5px 30px 10px rgba(80, 80, 80, 0.5);
  z-index: 9999;
  overflow: hidden;
  font-size: 13px;
  color: #303133;
}

html[data-theme='dark'] .bgm-mp-notify {
  background: rgba(40, 40, 40, 0.8);
  color: #fff;
  box-shadow: 0 5px 30px 10px rgba(0, 0, 0, 0.2);
}

.bgm-mp-notify .staff-tip-handle {
  height: 36px;
  line-height: 36px;
  padding: 0 16px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  font-size: 14px;
  font-weight: 500;
  cursor: move;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--primary-color,#f09199);
}

.bgm-mp-notify .staff-tip-content {
  padding: 12px 16px;
  max-height: 400px;
  overflow-y: auto;
  font-size: 13px;
}

.bgm-mp-notify .staff-tip-title {
  margin: 0 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 14px;
}

.bgm-mp-notify .staff-tip-title.unmatched {
  color: #a0222e;
}

html[data-theme='dark'] .bgm-mp-notify .staff-tip-title {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

html[data-theme='dark'] .bgm-mp-notify .staff-tip-title.unmatched {
  color: #e57373;
}

.bgm-mp-notify-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #909399;
  padding: 0;
  line-height: 1;
}

.bgm-mp-notify-close:hover {
  color: #e07a85;
}

.bgm-mp-btn {
  display: inline-block;
  background: #fff;
  color: #303133;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 0 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  height: 30px;
}

html[data-theme='dark'] .bgm-mp-btn {
  background: #2d2e2f;
  color: #dcdcdc;
  border-color: #404040;
}

html[data-theme='dark'] .bgm-mp-btn:hover,
.bgm-mp-btn:hover {
  color: var(--primary-color,#f09199);
  border-color: var(--primary-color,#f09199);
}

.bgm-mp-spinner {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin-bottom: 16px;
  border: 3px solid #e4e7ed;
  border-top-color: var(--primary-color,#f09199);
  border-radius: 50%;
  animation: bgm-mp-spin 1.2s linear infinite;
}

html[data-theme="dark"] .bgm-mp-spinner {
  border-color: #404040;
  border-top-color: var(--primary-color,#f09199);
}

@keyframes bgm-mp-spin {
  to {
    transform: rotate(360deg);
  }
}

.bgm-mp-loading-text {
  text-align: center;
  color: #909399;
  font-size: 13px;
}

.bgm-mp-loading-wrap {
  min-height: 120px;
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

/* Popup content */
.bgm-mp-result-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.bgm-mp-section-title {
  font-weight: 700;
}

.bgm-mp-empty-hint {
  color: #909399;
  margin-bottom: 8px;
}

.bgm-mp-unmatched-hint {
  margin-top: 8px;
  color: #a0222e;
  font-size: 12px;
}

.bgm-mp-popup-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.bgm-mp-name-link {
  color: #1a7a1a;
  cursor: pointer;
  text-decoration: underline !important;
}

.bgm-mp-pending-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bgm-mp-pending-header {
  margin-bottom: 8px;
  color: #909399;
}

html[data-theme="dark"] .bgm-mp-name-link {
  color: #51cf66;
}

.bgm-mp-subject-popup {
  width: 400px;
  max-width: 100vw;
  max-height: 80vh;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}`;
document.head.appendChild(styleEl);

(() => {
  // src/position-ids.js
  var POSITION_IDS = {
    2: {
      1: "\u539F\u4F5C",
      2: "\u5BFC\u6F14",
      3: "\u811A\u672C",
      4: "\u5206\u955C",
      5: "\u6F14\u51FA",
      6: "\u97F3\u4E50",
      7: "\u4EBA\u7269\u539F\u6848",
      8: "\u4EBA\u7269\u8BBE\u5B9A",
      9: "\u6784\u56FE",
      10: "\u7CFB\u5217\u6784\u6210",
      11: "\u7F8E\u672F\u76D1\u7763",
      13: "\u8272\u5F69\u8BBE\u8BA1",
      14: "\u603B\u4F5C\u753B\u76D1\u7763",
      15: "\u4F5C\u753B\u76D1\u7763",
      16: "\u673A\u68B0\u8BBE\u5B9A",
      17: "\u6444\u5F71\u76D1\u7763",
      18: "\u76D1\u4FEE",
      19: "\u9053\u5177\u8BBE\u8BA1",
      20: "\u539F\u753B",
      21: "\u7B2C\u4E8C\u539F\u753B",
      22: "\u52A8\u753B\u68C0\u67E5",
      23: "\u52A9\u7406\u5236\u7247\u4EBA",
      24: "\u5236\u4F5C\u52A9\u7406",
      25: "\u80CC\u666F\u7F8E\u672F",
      26: "\u8272\u5F69\u6307\u5B9A",
      27: "\u6570\u7801\u7ED8\u56FE",
      28: "\u526A\u8F91",
      29: "\u539F\u6848",
      30: "\u4E3B\u9898\u6B4C\u7F16\u66F2",
      31: "\u4E3B\u9898\u6B4C\u4F5C\u66F2",
      32: "\u4E3B\u9898\u6B4C\u4F5C\u8BCD",
      33: "\u4E3B\u9898\u6B4C\u6F14\u51FA",
      34: "\u63D2\u5165\u6B4C\u6F14\u51FA",
      35: "\u4F01\u753B",
      36: "\u4F01\u5212\u5236\u4F5C\u4EBA",
      37: "\u5236\u4F5C\u7BA1\u7406",
      38: "\u5BA3\u4F20",
      39: "\u5F55\u97F3",
      40: "\u5F55\u97F3\u52A9\u7406",
      41: "\u7CFB\u5217\u76D1\u7763",
      42: "\u88FD\u4F5C",
      43: "\u8BBE\u5B9A",
      44: "\u97F3\u54CD\u76D1\u7763",
      45: "\u97F3\u54CD",
      46: "\u97F3\u6548",
      47: "\u7279\u6548",
      48: "\u914D\u97F3\u76D1\u7763",
      49: "\u8054\u5408\u5BFC\u6F14",
      50: "\u80CC\u666F\u8BBE\u5B9A",
      51: "\u8865\u95F4\u52A8\u753B",
      52: "\u6267\u884C\u5236\u7247\u4EBA",
      53: "\u52A9\u7406\u5236\u7247\u4EBA",
      54: "\u5236\u7247\u4EBA",
      55: "\u97F3\u4E50\u52A9\u7406",
      56: "\u5236\u4F5C\u8FDB\u884C",
      57: "\u6F14\u5458\u76D1\u7763",
      58: "\u603B\u5236\u7247\u4EBA",
      59: "\u8054\u5408\u5236\u7247\u4EBA",
      60: "\u53F0\u8BCD\u7F16\u8F91",
      61: "\u540E\u671F\u5236\u7247\u534F\u8C03",
      62: "\u5236\u4F5C\u52A9\u7406",
      63: "\u5236\u4F5C",
      64: "\u5236\u4F5C\u534F\u8C03",
      65: "\u97F3\u4E50\u5236\u4F5C",
      66: "\u7279\u522B\u9E23\u8C22",
      67: "\u52A8\u753B\u5236\u4F5C",
      69: "CG \u5BFC\u6F14",
      70: "\u673A\u68B0\u4F5C\u753B\u76D1\u7763",
      71: "\u7F8E\u672F\u8BBE\u8BA1",
      72: "\u526F\u5BFC\u6F14",
      73: "OP\u30FBED \u5206\u955C",
      74: "\u603B\u5BFC\u6F14",
      75: "3DCG",
      76: "\u5236\u4F5C\u534F\u529B",
      77: "\u52A8\u4F5C\u4F5C\u753B\u76D1\u7763",
      80: "\u76D1\u5236",
      81: "\u534F\u529B",
      82: "\u6444\u5F71",
      83: "\u5236\u4F5C\u8FDB\u884C\u534F\u529B",
      84: "\u8BBE\u5B9A\u5236\u4F5C",
      85: "\u97F3\u4E50\u5236\u4F5C\u4EBA",
      86: "3DCG \u5BFC\u6F14",
      87: "\u52A8\u753B\u5236\u7247\u4EBA",
      88: "\u7279\u6548\u4F5C\u753B\u76D1\u7763",
      89: "\u4E3B\u6F14\u51FA",
      90: "\u4F5C\u753B\u76D1\u7763\u52A9\u7406",
      91: "\u6F14\u51FA\u52A9\u7406",
      92: "\u4E3B\u52A8\u753B\u5E08",
      93: "\u4E0A\u8272",
      94: "\u4E0A\u8272\u68C0\u67E5",
      95: "\u8272\u5F69\u68C0\u67E5",
      96: "\u7F8E\u672F\u677F",
      97: "\u7F8E\u672F",
      98: "\u5370\u8C61\u677F",
      99: "2D \u8BBE\u8BA1",
      100: "3D \u8BBE\u8BA1",
      101: "\u6280\u672F\u5BFC\u6F14",
      102: "\u7279\u6280\u5BFC\u6F14",
      103: "\u8272\u5F69\u811A\u672C",
      104: "\u5206\u955C\u534F\u529B",
      105: "\u5206\u955C\u6284\u5199",
      106: "\u526F\u4EBA\u7269\u8BBE\u5B9A",
      107: "\u5BA2\u5EA7\u4EBA\u7269\u8BBE\u5B9A",
      108: "\u6784\u56FE\u76D1\u4FEE",
      109: "\u6784\u56FE\u4F5C\u753B\u76D1\u7763",
      110: "\u603B\u4F5C\u753B\u76D1\u7763\u52A9\u7406",
      111: "\u9053\u5177\u4F5C\u753B\u76D1\u7763",
      112: "\u6982\u5FF5\u8BBE\u8BA1",
      113: "\u670D\u88C5\u8BBE\u8BA1",
      114: "\u6807\u9898\u8BBE\u8BA1",
      115: "\u8BBE\u5B9A\u534F\u529B",
      116: "\u97F3\u4E50\u76D1\u7763",
      117: "\u9009\u66F2",
      118: "\u63D2\u5165\u6B4C\u4F5C\u8BCD",
      119: "\u63D2\u5165\u6B4C\u4F5C\u66F2",
      120: "\u63D2\u5165\u6B4C\u7F16\u66F2",
      121: "\u521B\u610F\u5236\u7247\u4EBA",
      122: "\u526F\u5236\u7247\u4EBA",
      123: "\u5236\u4F5C\u7EDF\u62EC",
      124: "\u73B0\u573A\u5236\u7247\u4EBA",
      125: "\u6587\u827A\u5236\u4F5C",
      127: "\u4F01\u753B\u534F\u529B",
      128: "OP\u30FBED \u6F14\u51FA",
      129: "Bank \u5206\u955C\u6F14\u51FA",
      130: "Live \u5206\u955C\u6F14\u51FA",
      131: "\u5267\u4E2D\u5267\u5206\u955C\u6F14\u51FA",
      132: "\u5267\u4E2D\u5267\u4EBA\u8BBE",
      133: "\u89C6\u89C9\u5BFC\u6F14",
      134: "\u521B\u610F\u603B\u76D1",
      135: "\u7279\u6444\u6548\u679C",
      136: "\u89C6\u89C9\u6548\u679C",
      137: "\u52A8\u4F5C\u5BFC\u6F14",
      138: "\u8F6C\u573A\u7ED8",
      139: "\u63D2\u753B",
      140: "\u89D2\u8272\u4F5C\u753B\u76D1\u7763",
      141: "\u4F5C\u753B\u76D1\u4FEE",
      142: "\u673A\u8BBE\u539F\u6848",
      143: "\u6982\u5FF5\u827A\u672F",
      144: "\u89C6\u89C9\u6982\u5FF5",
      145: "\u753B\u9762\u8BBE\u8BA1",
      146: "\u602A\u7269\u8BBE\u8BA1",
      147: "\u6545\u4E8B\u6982\u5FF5",
      148: "\u5267\u672C\u534F\u8C03",
      149: "\u811A\u672C\u534F\u529B",
      150: "\u526F\u7CFB\u5217\u6784\u6210",
      151: "\u6784\u6210\u534F\u529B",
      152: "\u5F55\u97F3\u5DE5\u4F5C\u5BA4",
      153: "\u6574\u97F3",
      154: "\u97F3\u54CD\u5236\u4F5C\u62C5\u5F53",
      155: "\u5728\u7EBF\u526A\u8F91",
      156: "\u79BB\u7EBF\u526A\u8F91",
      157: "3D \u52A8\u753B\u5E08",
      158: "CG \u5236\u4F5C\u4EBA",
      159: "\u5BA3\u4F20\u5236\u7247\u4EBA",
      160: "\u7F8E\u672F\u5236\u4F5C\u4EBA",
      161: "\u97F3\u54CD\u5236\u4F5C\u4EBA",
      162: "CG \u5236\u4F5C\u8FDB\u884C",
      163: "\u7F8E\u672F\u5236\u4F5C\u8FDB\u884C",
      164: "\u7F8E\u672F\u76D1\u7763\u52A9\u7406",
      165: "\u8272\u5F69\u8BBE\u8BA1\u52A9\u7406",
      166: "\u6444\u5F71\u76D1\u7763\u52A9\u7406",
      167: "\u5236\u4F5C\u7BA1\u7406\u52A9\u7406",
      168: "\u8BBE\u5B9A\u5236\u4F5C\u52A9\u7406"
    },
    1: {
      2001: "\u4F5C\u8005",
      2002: "\u4F5C\u753B",
      2003: "\u63D2\u56FE",
      2004: "\u51FA\u7248\u793E",
      2005: "\u8FDE\u8F7D\u6742\u5FD7",
      2006: "\u8BD1\u8005",
      2007: "\u539F\u4F5C",
      2008: "\u5BA2\u4E32",
      2009: "\u4EBA\u7269\u539F\u6848",
      2010: "\u811A\u672C",
      2011: "\u4E66\u7CFB",
      2012: "\u51FA\u54C1\u65B9",
      2013: "\u56FE\u4E66\u54C1\u724C"
    },
    4: {
      1001: "\u5F00\u53D1",
      1002: "\u53D1\u884C",
      1003: "\u6E38\u620F\u8BBE\u8BA1\u5E08",
      1004: "\u5267\u672C",
      1005: "\u7F8E\u5DE5",
      1006: "\u97F3\u4E50",
      1007: "\u5173\u5361\u8BBE\u8BA1",
      1008: "\u4EBA\u7269\u8BBE\u5B9A",
      1009: "\u4E3B\u9898\u6B4C\u4F5C\u66F2",
      1010: "\u4E3B\u9898\u6B4C\u4F5C\u8BCD",
      1011: "\u4E3B\u9898\u6B4C\u6F14\u51FA",
      1012: "\u63D2\u5165\u6B4C\u6F14\u51FA",
      1013: "\u539F\u753B",
      1014: "\u52A8\u753B\u5236\u4F5C",
      1015: "\u539F\u4F5C",
      1016: "\u5BFC\u6F14",
      1017: "\u52A8\u753B\u76D1\u7763",
      1018: "\u5236\u4F5C\u603B\u6307\u6325",
      1019: "QC",
      1020: "\u52A8\u753B\u5267\u672C",
      1021: "\u7A0B\u5E8F",
      1022: "\u534F\u529B",
      1023: "CG \u76D1\u4FEE",
      1024: "SD\u539F\u753B",
      1025: "\u80CC\u666F",
      1026: "\u76D1\u4FEE",
      1027: "\u7CFB\u5217\u6784\u6210",
      1028: "\u4F01\u753B",
      1029: "\u673A\u68B0\u8BBE\u5B9A",
      1030: "\u97F3\u54CD\u76D1\u7763",
      1031: "\u4F5C\u753B\u76D1\u7763",
      1032: "\u5236\u4F5C\u4EBA",
      1033: "\u6D77\u62A5"
    },
    3: {
      3001: "\u827A\u672F\u5BB6",
      3002: "\u5236\u4F5C\u4EBA",
      3003: "\u4F5C\u66F2",
      3004: "\u5382\u724C",
      3005: "\u539F\u4F5C",
      3006: "\u4F5C\u8BCD",
      3007: "\u5F55\u97F3",
      3008: "\u7F16\u66F2",
      3009: "\u63D2\u56FE",
      3010: "\u811A\u672C",
      3011: "\u51FA\u7248\u65B9",
      3012: "\u6BCD\u5E26\u5236\u4F5C",
      3013: "\u6DF7\u97F3",
      3014: "\u4E50\u5668",
      3015: "\u58F0\u4E50"
    },
    6: {
      4001: "\u539F\u4F5C",
      4002: "\u5BFC\u6F14",
      4003: "\u7F16\u5267",
      4004: "\u97F3\u4E50",
      4005: "\u6267\u884C\u5236\u7247\u4EBA",
      4006: "\u5171\u540C\u6267\u884C\u5236\u4F5C",
      4007: "\u5236\u7247\u4EBA/\u5236\u4F5C\u4EBA",
      4008: "\u76D1\u5236",
      4009: "\u526F\u5236\u4F5C\u4EBA/\u5236\u4F5C\u987E\u95EE",
      4010: "\u6545\u4E8B",
      4011: "\u7F16\u5BA1",
      4012: "\u526A\u8F91",
      4013: "\u521B\u610F\u603B\u76D1",
      4014: "\u6444\u5F71",
      4015: "\u4E3B\u9898\u6B4C\u6F14\u51FA",
      4016: "\u4E3B\u6F14",
      4017: "\u914D\u89D2",
      4018: "\u5236\u4F5C",
      4019: "\u51FA\u54C1",
      4020: "\u914D\u97F3\u5BFC\u6F14",
      4021: "\u5F55\u97F3",
      4022: "\u6D77\u62A5"
    }
  };

  // src/config.js
  var SETTINGS_KEY = "wikiMissingPositionsProvider";
  var DEFAULT_PROVIDER = "https://bgq.iccci.cc.cd";

  // src/api.js
  function getProvider() {
    if (chiiApp) {
      return chiiApp.cloud_settings.get(SETTINGS_KEY) || DEFAULT_PROVIDER;
    }
    return localStorage.getItem(SETTINGS_KEY) || DEFAULT_PROVIDER;
  }
  function saveProvider(val) {
    if (chiiApp) {
      chiiApp.cloud_settings.update({ [SETTINGS_KEY]: val });
      return;
    }
    localStorage.setItem(SETTINGS_KEY, val);
  }

  // src/appear-eps.js
  function parseAppearEps(input) {
    if (!input) return /* @__PURE__ */ new Set([]);
    const rawSegments = input.split(",").map((seg) => seg.trim()).filter((seg) => seg);
    const resultSet = /* @__PURE__ */ new Set();
    rawSegments.forEach((seg) => {
      if (seg.includes("-")) {
        const [s, e] = seg.split("-").map((p) => p.trim());
        if (isStrictInt(s) && isStrictInt(e)) {
          const min = Math.min(Number(s), Number(e));
          const max = Math.max(Number(s), Number(e));
          for (let i = min; i <= max; i++) {
            resultSet.add(i.toString());
          }
        } else {
          resultSet.add(seg);
        }
      } else {
        resultSet.add(seg);
      }
    });
    return new Set(sortAppearEps(Array.from(resultSet)));
  }
  function isStrictInt(str) {
    return /^-?\d+$/.test(str);
  }
  function sortAppearEps(eps) {
    return eps.sort((a, b) => {
      const isANum = isStrictInt(a);
      const isBNum = isStrictInt(b);
      if (isANum && isBNum) return Number(a) - Number(b);
      if (isANum) return -1;
      if (isBNum) return 1;
      return a.localeCompare(b);
    });
  }
  function genAppearEps(epArr) {
    if (!epArr || !epArr.length) return "";
    epArr = sortAppearEps([...new Set(epArr)]);
    const integers = epArr.filter(isStrictInt).map(Number);
    const others = epArr.filter((e) => !isStrictInt(e));
    const rangeParts = [];
    if (integers.length > 0) {
      let start = integers[0];
      let prev = integers[0];
      for (let i = 1; i <= integers.length; i++) {
        const curr = integers[i];
        if (i < integers.length && curr === prev + 1) {
          prev = curr;
        } else {
          rangeParts.push(start === prev ? `${start}` : `${start}-${prev}`);
          if (i < integers.length) {
            start = curr;
            prev = curr;
          }
        }
      }
    }
    return [...rangeParts, ...others].join(",");
  }

  // src/popup.js
  function showPendingEps(allUnmatched, personName, type2) {
    const existing = document.querySelector(".bgm-mp-notify");
    if (existing) existing.remove();
    const sections = allUnmatched.map(({ sid, entry }) => {
      const eps = entry.episodes || [];
      const epLinks = eps.map(
        (ep) => `<a class="l" href="https://bgm.tv/ep/${ep.episode_id}#:~:text=${encodeURIComponent(personName)}" target="_blank">${ep.label}</a>`
      ).join(", ");
      return { sid, entry, eps, epLinks };
    });
    if (!sections.length) return;
    const notify = document.createElement("div");
    notify.className = "bgm-mp-notify";
    const handle = document.createElement("div");
    handle.className = "staff-tip-handle";
    handle.innerHTML = '<strong>\u7591\u4F3C\u5339\u914D</strong><button class="bgm-mp-notify-close">&times;</button>';
    const content = document.createElement("div");
    content.className = "staff-tip-content";
    let html = '<div class="bgm-mp-pending-header">\u4EE5\u4E0B\u5267\u96C6\u7B80\u4ECB\u5305\u542B\u6B64\u540D\u79F0\u4F46\u672A\u5B9A\u4F4D\u5230\u804C\u4F4D\uFF1A</div>';
    for (const sec of sections) {
      html += `<div class="bgm-mp-pending-item">
        <strong><a href="/subject/${sec.sid}">${sec.entry.name || "#" + sec.sid}</a></strong> ${sec.epLinks}
        <button class="bgm-mp-btn bgm-mp-relate-btn" data-sid="${sec.sid}" href="javascript:">\u5173\u8054</button>
        <button class="bgm-mp-btn bgm-mp-copy-btn" data-sid="${sec.sid}" href="javascript:">\u590D\u5236</button>
        <button class="bgm-mp-btn bgm-mp-locate-btn" data-sid="${sec.sid}" href="javascript:">\u5B9A\u4F4D</button>
      </div>`;
    }
    content.innerHTML = html;
    notify.append(handle, content);
    notify.style.opacity = "0";
    document.body.appendChild(notify);
    const boxW = notify.offsetWidth;
    const boxH = notify.offsetHeight;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    let right = 50, bottom = 50;
    right = Math.min(right, winW - boxW);
    right = Math.max(right, 0);
    bottom = Math.min(bottom, winH - boxH);
    bottom = Math.max(bottom, 0);
    notify.style.bottom = `${bottom}px`;
    notify.style.right = `${right}px`;
    notify.style.opacity = "";
    notify.querySelectorAll(".bgm-mp-btn").forEach((btn) => {
      btn.onclick = () => {
        const sec = sections.find((s) => String(s.sid) === btn.dataset.sid);
        if (!sec) return;
        const epLabels = sec.eps.map((ep) => ep.label);
        if (!epLabels.length) return;
        subjectList = [
          {
            id: Number(sec.sid),
            type_id: type2,
            name: sec.entry.name,
            name_cn: "",
            url_mod: "subject"
          }
        ];
        addRelateSubject(0, "submitForm");
      };
    });
    notify.querySelectorAll(".bgm-mp-copy-btn").forEach((btn) => {
      btn.onclick = () => {
        const sec = sections.find((s) => String(s.sid) === btn.dataset.sid);
        if (!sec) return;
        const epLabels = sec.eps.map((ep) => ep.label);
        if (!epLabels.length) return;
        navigator.clipboard.writeText(genAppearEps(epLabels));
        const orig = btn.textContent;
        btn.textContent = "\u590D\u5236\u6210\u529F";
        setTimeout(() => btn.textContent = orig, 2e3);
      };
    });
    notify.querySelectorAll(".bgm-mp-locate-btn").forEach((btn) => {
      btn.onclick = () => {
        document.querySelector('[data-group-mode="subject"]').click();
        const l = document.querySelector(`[href="/subject/${btn.dataset.sid}"]`);
        if (!l) return;
        window.location.href += `#:~:text=${l.textContent}`;
      };
    });
    let offX = 0, offY = 0;
    handle.onmousedown = (e) => {
      if (e.target.closest(".bgm-mp-notify-close")) return;
      offX = e.clientX - notify.getBoundingClientRect().left;
      offY = e.clientY - notify.getBoundingClientRect().top;
      document.onmousemove = (ev) => {
        notify.style.left = ev.clientX - offX + "px";
        notify.style.top = ev.clientY - offY + "px";
        notify.style.right = "auto";
      };
      document.onmouseup = () => {
        document.onmousemove = null;
      };
    };
    notify.querySelector(".bgm-mp-notify-close").onclick = () => notify.remove();
  }

  // src/add-related.js
  var select;
  var type;
  var nameInput;
  var epBtn;
  function addSubjectLi(sid, posId, name) {
    const existing = document.querySelector(`#crtRelateSubjects li.old:has([href="/subject/${sid}"]):has(option[selected][value="${posId}"])`);
    if (existing) return existing;
    console.log("???");
    subjectList = [{ id: Number(sid), type_id: type, name, name_cn: "", url_mod: "subject" }];
    addRelateSubject(0, "submitForm");
    document.querySelector("#crtRelateSubjects select").value = posId;
    return document.querySelector(`#crtRelateSubjects li:has([href="/subject/${sid}"])`);
  }
  async function runEpisodeCheck() {
    const provider = getProvider();
    const queryName = nameInput.value.trim() || document.querySelector(".nameSingle").textContent.trim();
    epBtn.disabled = true;
    epBtn.textContent = "\u83B7\u53D6\u4E2D\u2026\u2026";
    try {
      const url = `${provider}/api/persons/${encodeURIComponent(queryName)}/missing-episodes`;
      const res = await fetch(url);
      const data = await res.json();
      let none = true;
      for (const [sid, entry] of Object.entries(data.matched || {})) {
        for (const [posId, labels] of Object.entries(entry.episodes || {})) {
          const li = addSubjectLi(sid, posId, entry.name);
          const epInput = li.querySelector('[name$="[appear_eps]"]');
          if (epInput) {
            const currentSet = parseAppearEps(epInput.value);
            const hasAll = labels.every((l) => currentSet.has(l));
            if (!hasAll) {
              none = false;
              epInput.value = genAppearEps(labels);
              if (li.classList.contains("old")) {
                li.style.background = document.documentElement.getAttribute("data-theme") === "dark" ? "rgba(255, 248, 165, 0.08)" : "rgba(255, 248, 165, 0.2)";
              }
            }
          }
        }
      }
      const allUnmatched = [];
      for (const [sid, entry] of Object.entries(data.unmatched || {})) {
        none = false;
        allUnmatched.push({ sid, entry });
      }
      if (allUnmatched.length) showPendingEps(allUnmatched, queryName, type);
      epBtn.textContent = none ? "\u672A\u67E5\u627E\u5230\u4EFB\u4F55\u5DF2\u586B\u5199\u5267\u96C6" : "\u5267\u96C6\u5173\u8054\u5B8C\u6210\uFF01";
    } catch (e) {
      console.error(e);
      epBtn.textContent = "\u83B7\u53D6\u5931\u8D25\uFF0C\u70B9\u51FB\u91CD\u8BD5";
    } finally {
      epBtn.disabled = false;
    }
  }
  function initAddRelated() {
    const personName = document.querySelector(".nameSingle").textContent.trim();
    type = {
      anime: 2,
      book: 1,
      music: 3,
      game: 4,
      real: 6
    }[document.querySelector(".cat .selected").href.split("/").pop()];
    select = document.createElement("select");
    select.className = "bgm-mp-select";
    let posOpts = '<option value="">\u6240\u6709\u804C\u4F4D</option>';
    Object.keys(POSITION_IDS[type] || {}).map(Number).sort(function(a, b) {
      return a - b;
    }).forEach(function(id) {
      posOpts += `<option value="${id}">${POSITION_IDS[type][id]}</option>`;
    });
    select.innerHTML = posOpts;
    const container = document.createElement("div");
    container.id = "bgm-mp-container";
    const group1 = document.createElement("div");
    group1.className = "bgm-mp-group";
    nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "bgm-mp-input";
    nameInput.placeholder = "\u522B\u540D\uFF08\u53EF\u9009\uFF09";
    const btn = document.createElement("button");
    btn.textContent = "\u5173\u8054\u5DF2\u586B\u5199\u6761\u76EE";
    btn.id = "missingPositions";
    btn.className = "bgm-mp-btn";
    btn.addEventListener("click", async () => {
      const position = select.value;
      const provider = getProvider();
      try {
        btn.disabled = true;
        btn.textContent = "\u83B7\u53D6\u4E2D\u2026\u2026";
        const res = await fetch(`${provider}/api/persons/${encodeURIComponent(nameInput.value.trim() || personName)}/missing-subjects?type=${type}&position=${position}`);
        const data = await res.json();
        const resEntries = Object.entries(data);
        let none = true;
        for (const [id, entry] of resEntries) {
          for (const pos of entry.positions) {
            if (!document.querySelector(`#crtRelateSubjects li.old:has([href="/subject/${id}"]):has(option[selected][value="${pos}"])`)) {
              none = false;
              subjectList = [{ id: Number(id), type_id: type, name: entry.name, name_cn: "", url_mod: "subject" }];
              addRelateSubject(0, "submitForm");
              document.querySelector("#crtRelateSubjects select").value = pos;
            }
          }
        }
        btn.textContent = none ? "\u672A\u67E5\u627E\u5230\u4EFB\u4F55\u5DF2\u586B\u5199\u6761\u76EE" : "\u5173\u8054\u586B\u5199\u5B8C\u6210\uFF01";
      } catch (e) {
        console.error(e);
        btn.textContent = "\u83B7\u53D6\u5931\u8D25\uFF0C\u70B9\u51FB\u91CD\u8BD5";
      } finally {
        btn.disabled = false;
      }
    });
    const group2 = document.createElement("div");
    group2.className = "bgm-mp-group";
    if (type === 2) {
      epBtn = document.createElement("button");
      epBtn.textContent = "\u5173\u8054\u5DF2\u586B\u5199\u5267\u96C6";
      epBtn.id = "missingEpisodes";
      epBtn.className = "bgm-mp-btn";
      epBtn.addEventListener("click", runEpisodeCheck);
      group2.append(epBtn);
    }
    group1.append(nameInput, select, btn);
    container.append(group1, group2);
    document.querySelector("#indexCatBox").after(container);
    processPendingData();
  }

  // src/subject-page.js
  var LOADING_MSGS = [
    "\u5750\u548C\u653E\u5BBD",
    "\u6B63\u5728\u51C6\u5907\u6570\u636E<br>\u8BF7\u52FF\u2122\u5173\u95ED\u8BA1\u7B97\u673A",
    "\u597D\u4E1C\u897F\u5C31\u8981\u6765\u4E86\uFF01",
    () => `\u4F60\u5DF2\u5B8C\u6210${10 * (2 + Math.floor(Math.random() * 7))}%`,
    "\u6B63\u5728\u5904\u7406\u4E00\u4E9B\u4E8B\u60C5",
    "\u4F60\u6B63\u5728\u6210\u529F\uFF01",
    "\u4E0D\u5DE7\u7684\u662F\uFF0C\u5B83\u82B1\u8D39\u7684\u65F6\u95F4\u6BD4\u901A\u5E38\u8981\u957F",
    "\u518D\u7B49\u4E00\u4E0B\u4E0B\u5C31\u597D\u4E86",
    "\u8FD9\u901A\u5E38\u4E0D\u4F1A\u592A\u4E45",
    "\u6211\u4EEC\u6B63\u5728\u5E2E\u4F60\u641E\u5B9A\u4E00\u5207"
  ];
  function randomMsg() {
    const m = LOADING_MSGS[Math.floor(Math.random() * LOADING_MSGS.length)];
    return typeof m === "function" ? m() : m;
  }
  function initSubjectPage() {
    const href = document.querySelector(".focus").href.split("/").pop();
    const typeCode = { anime: 2, book: 1, music: 3, game: 4, real: 6 }[href] || 0;
    if (!typeCode) return;
    const posNames = new Set(Object.values(POSITION_IDS[typeCode] || {}));
    const infobox = document.querySelector("#infobox");
    if (!infobox) return;
    const DELIM_RE = /[()[\]{}（）<>《》「」『』【】+×·→/／、,，;；：&＆\\等]+/;
    infobox.querySelectorAll("li").forEach((li) => {
      const tip = li.querySelector(".tip");
      if (!tip) return;
      const fieldName = tip.textContent.replace(/[:：]\s*$/, "").trim();
      if (!posNames.has(fieldName)) return;
      const linked = /* @__PURE__ */ new Set();
      li.querySelectorAll("a").forEach((a) => linked.add(a.textContent.trim()));
      const clone = li.cloneNode(true);
      clone.querySelectorAll("a, .tip").forEach((el) => el.remove());
      const text = clone.textContent;
      const names = text.split(DELIM_RE).map((s) => s.trim()).filter(Boolean);
      names.sort((a, b) => b.length - a.length);
      let tipHTML = "";
      if (tip) {
        tipHTML = tip.outerHTML;
        tip.remove();
      }
      const unlinked = names.filter((n) => !linked.has(n));
      if (unlinked.length) {
        const nameRE = new RegExp(
          `(?<=^|[^<\\w])(${unlinked.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})([^<\\w]|$)`,
          "g"
        );
        const walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT, {
          acceptNode: (node) => node.parentElement.closest("a, .tip") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        });
        const tNodes = [];
        while (walker.nextNode()) tNodes.push(walker.currentNode);
        for (const node of tNodes) {
          const html = node.textContent.replace(
            nameRE,
            (_, name, p3) => `<a class="bgm-mp-name bgm-mp-name-link" data-name="${name}">${name}</a>${p3}`
          );
          if (html !== node.textContent) {
            const span = document.createElement("span");
            span.innerHTML = html;
            node.replaceWith(...span.childNodes);
          }
        }
      }
      if (tipHTML) li.insertAdjacentHTML("afterbegin", tipHTML);
    });
    document.querySelectorAll(".bgm-mp-name").forEach((a) => {
      a.addEventListener("click", () => openSubjectPopup(a.dataset.name, typeCode));
    });
  }
  function openSubjectPopup(personName, typeCode) {
    const existing = document.querySelector(".bgm-mp-subject-popup");
    if (existing) existing.remove();
    const provider = getProvider();
    const popup = document.createElement("div");
    popup.className = "bgm-mp-notify bgm-mp-subject-popup";
    const handle = document.createElement("div");
    handle.className = "staff-tip-handle";
    handle.innerHTML = `<strong>${personName}</strong><button class="bgm-mp-notify-close">&times;</button>`;
    const content = document.createElement("div");
    content.className = "staff-tip-content";
    popup.append(handle, content);
    document.body.appendChild(popup);
    content.innerHTML = `<div class="bgm-mp-loading-wrap"><div class="bgm-mp-spinner"></div><div class="bgm-mp-loading-text">${randomMsg()}</div></div>`;
    popup.querySelector(".bgm-mp-notify-close").onclick = () => popup.remove();
    let offX = 0, offY = 0;
    handle.onmousedown = (e) => {
      if (e.target.closest(".bgm-mp-notify-close")) return;
      const rect = popup.getBoundingClientRect();
      popup.style.transform = "none";
      popup.style.left = rect.left + "px";
      popup.style.top = rect.top + "px";
      offX = e.clientX - rect.left;
      offY = e.clientY - rect.top;
      document.onmousemove = (ev) => {
        popup.style.left = ev.clientX - offX + "px";
        popup.style.top = ev.clientY - offY + "px";
      };
      document.onmouseup = () => {
        document.onmousemove = null;
      };
    };
    (async () => {
      const typeParam = typeCode ? `?type=${typeCode}` : "";
      const encodedName = encodeURIComponent(personName);
      let subjectsData = null, episodesData = null;
      try {
        const subjRes = await fetch(
          `${provider}/api/persons/${encodedName}/missing-subjects${typeParam}`
        );
        subjectsData = await subjRes.json();
      } catch (e) {
        subjectsData = {};
      }
      if (typeCode === 2) {
        try {
          const epRes = await fetch(`${provider}/api/persons/${encodedName}/missing-episodes`);
          episodesData = await epRes.json();
        } catch (e) {
          episodesData = {};
        }
      }
      let html = "";
      const subjEntries = subjectsData ? Object.entries(subjectsData) : [];
      if (subjEntries.length) {
        html += '<div class="bgm-mp-result-list">';
        html += '<div class="bgm-mp-section-title">\u7F3A\u5931\u6761\u76EE\u5173\u8054\uFF1A</div>';
        for (const [sid, entry] of subjEntries) {
          const posNames = (entry.positions || []).map((pid) => POSITION_IDS[typeCode]?.[pid] || pid).join("\u3001");
          html += `<div><strong><a class="l" href="/subject/${sid}" target="_blank">${entry.name || "#" + sid}</a></strong> - ${posNames}</div>`;
        }
        html += "</div>";
      } else {
        html += '<div class="bgm-mp-empty-hint">\u65E0\u7F3A\u5931\u6761\u76EE\u5173\u8054</div>';
      }
      if (episodesData) {
        const epEntries = Object.entries(episodesData.matched || {});
        if (epEntries.length) {
          html += '<div class="bgm-mp-result-list">';
          html += '<div class="bgm-mp-section-title">\u7F3A\u5931\u5267\u96C6\u5173\u8054\uFF1A</div>';
          for (const [sid, entry] of epEntries) {
            const posMap = entry.episodes || {};
            const parts = Object.entries(posMap).map(
              ([pid, labels]) => `${POSITION_IDS[typeCode]?.[pid] || pid}\uFF1A${genAppearEps(labels)}`
            );
            html += `<div><strong><a class="l" href="/subject/${sid}" target="_blank">${entry.name || "#" + sid}</a></strong> ${parts.join("\uFF0C")}</div>`;
          }
          html += "</div>";
        }
        if (Object.keys(episodesData.unmatched || {}).length) {
          html += '<div class="bgm-mp-unmatched-hint">\u53E6\u6709\u90E8\u5206\u96C6\u6570\u672A\u5B9A\u4F4D\u5230\u804C\u4F4D</div>';
        }
      }
      html += `<div class="bgm-mp-popup-actions">
        <button class="bgm-mp-btn" id="bgm-mp-create-btn">\u521B\u5EFA\u4EBA\u7269</button>
      </div>`;
      content.innerHTML = html;
      document.querySelector("#bgm-mp-create-btn").onclick = () => {
        localStorage.setItem(
          "bgm-mp-pending",
          JSON.stringify({
            personName,
            typeCode,
            subjectsData,
            episodesData
          })
        );
        window.open("/person/new");
      };
    })();
  }
  function initPersonNewPage() {
    const raw = localStorage.getItem("bgm-mp-pending");
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      const input = document.querySelector("#crt_name");
      if (input && data.personName) input.value = data.personName;
    } catch (_e) {
    }
  }
  function initPersonPage() {
    const raw = localStorage.getItem("bgm-mp-pending");
    if (!raw) return;
    const personId = location.pathname.match(/\/person\/(\d+)/)?.[1];
    if (!personId) return;
    try {
      const data = JSON.parse(raw);
      const typeExt = { 1: "book", 2: "anime", 3: "music", 4: "game", 6: "real" }[data.typeCode];
      if (!typeExt) return;
      location.href = `/person/${personId}/add_related/${typeExt}`;
    } catch (_e) {
    }
  }
  function processPendingData() {
    const raw = localStorage.getItem("bgm-mp-pending");
    if (!raw) return;
    const referrer = document.referrer;
    if (!referrer.includes("/person/new") && !referrer.match(/\/person\/\d+$/)) return;
    try {
      const data = JSON.parse(raw);
      if (!data.subjectsData) return;
      for (const [sid, entry] of Object.entries(data.subjectsData)) {
        for (const posId of entry.positions || []) {
          const li = addSubjectLi(Number(sid), posId, entry.name);
          if (li && li.classList.contains("old")) {
            li.style.background = document.documentElement.getAttribute("data-theme") === "dark" ? "rgba(255, 248, 165, 0.08)" : "rgba(255, 248, 165, 0.2)";
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
              if (li.classList.contains("old")) {
                li.style.background = document.documentElement.getAttribute("data-theme") === "dark" ? "rgba(255, 248, 165, 0.08)" : "rgba(255, 248, 165, 0.2)";
              }
            }
          }
        }
      }
      if (Object.keys(data.episodesData?.unmatched || {}).length) {
        const allUnmatched = Object.entries(data.episodesData.unmatched).map(([sid, entry]) => ({
          sid,
          entry
        }));
        showPendingEps(allUnmatched, data.personName, data.typeCode);
      }
      localStorage.removeItem("bgm-mp-pending");
    } catch (e) {
      localStorage.removeItem("bgm-mp-pending");
    }
  }

  // src/index.js
  var pathname = location.pathname;
  (function route() {
    if (/^\/subject\/\d+$/.test(pathname)) {
      initSubjectPage();
      return;
    }
    if (pathname === "/person/new") {
      initPersonNewPage();
      return;
    }
    if (/^\/person\/\d+$/.test(pathname)) {
      initPersonPage();
      return;
    }
    initAddRelated();
  })();
  if (typeof chiiLib !== "undefined" && chiiLib.ukagaka && chiiLib.ukagaka.addPanelTab) {
    chiiLib.ukagaka.addPanelTab({
      tab: "wiki_missing_positions",
      label: "\u7F3A\u5931\u804C\u4F4D",
      type: "custom",
      customContent: function() {
        const provider = getProvider();
        return (
          /* html */
          `
        <div class="bgm-mp-settings">
          <div class="bgm-mp-row">
            <label>API \u5730\u5740</label>
            <input type="text" id="bgm-mp-provider" value="${provider.replace(/"/g, "&quot;")}">
          </div>
        </div>`
        );
      },
      onInit: function(tabSelector, $tabContent) {
        $tabContent.off("change", "#bgm-mp-provider").on("change", "#bgm-mp-provider", function() {
          saveProvider($(this).val());
        });
      }
    });
  }
})();

})();
