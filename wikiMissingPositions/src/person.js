import { searchPrsn, normalize } from './search.js';
import { getProvider } from './api.js';

export async function checkExistingPerson(personName) {
  const result = { aliased: null, directMatch: null, aliasedMulti: null };
  try {
    let aliased = null;
    const provider = getProvider();
    try {
      const res = await fetch(`${provider}/api/aliases/${encodeURIComponent(personName)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          aliased = data[0];
          if (data.length > 1) {
            result.aliasedMulti = data;
          }
        }
      }
    } catch (e) {
      console.error('aliases API failed:', e);
    }
    if (!aliased) {
      aliased = await window.personAliasQuery?.(personName);
    }
    if (aliased) result.aliased = { name: aliased.name, id: aliased.id };
    const searchResults = await searchPrsn(personName);
    const first = searchResults?.[0];
    if (first && normalize(personName) === normalize(first.name)) {
      result.directMatch = { name: first.name, id: first.id };
    }
  } catch (e) {
    console.error('checkExistingPerson failed:', e);
  }
  return result;
}
