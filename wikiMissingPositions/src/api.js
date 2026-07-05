import { PROVIDER_KEY, DEFAULT_PROVIDER, SHOW_KEY } from './config.js';

function hasChiiApp() {
  return typeof chiiApp !== 'undefined' && chiiApp;
}

function get(key, def) {
  if (hasChiiApp()) {
    return chiiApp.cloud_settings.get(key) || def;
  }
  return localStorage.getItem(key) || def;
}

export function getProvider() {
  return get(PROVIDER_KEY, DEFAULT_PROVIDER);
}

export function getShow() {
  return get(SHOW_KEY, 'on');
}

function save(key, val) {
  if (hasChiiApp()) {
    chiiApp.cloud_settings.update({ [key]: val });
    return;
  }
  localStorage.setItem(key, val);
}

export function saveProvider(val) {
  save(PROVIDER_KEY, val);
}

export function saveShow(val) {
  save(SHOW_KEY, val);
}
