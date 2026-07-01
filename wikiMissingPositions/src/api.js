import { SETTINGS_KEY, DEFAULT_PROVIDER } from './config.js';

export function getProvider() {
  if (chiiApp) {
    return chiiApp.cloud_settings.get(SETTINGS_KEY) || DEFAULT_PROVIDER;
  }
  return localStorage.getItem(SETTINGS_KEY) || DEFAULT_PROVIDER;
}

export function saveProvider(val) {
  if (chiiApp) {
    chiiApp.cloud_settings.update({ [SETTINGS_KEY]: val });
    return;
  }
  localStorage.setItem(SETTINGS_KEY, val);
}
