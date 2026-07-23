import { searchPrsnAll, normalize } from './search.js';
import { getProvider } from './api.js';

export async function checkExistingPerson(personName) {
  const result = { aliased: null, aliasedMulti: null, directMatches: null };
  const normalized = normalize(personName);
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

    const searchResults = await searchPrsnAll(personName);
    if (searchResults) {
      const matches = searchResults.filter((r) => normalized === normalize(r.name));
      if (matches.length) {
        result.directMatches = matches.map((r) => {
          const cn = (r.infobox || []).find((f) => f.key === '简体中文名');
          return { name: r.name, id: r.id, display: cn?.value || r.name };
        });
      }
    }
  } catch (e) {
    console.error('checkExistingPerson failed:', e);
  }
  return result;
}
