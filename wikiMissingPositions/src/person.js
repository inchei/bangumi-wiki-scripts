import { searchPrsn, normalize } from './search.js';

export async function checkExistingPerson(personName) {
  const result = { aliased: null, directMatch: null };
  try {
    const [aliased, searchResults] = await Promise.all([
      window.personAliasQuery?.(personName),
      searchPrsn(personName),
    ]);
    if (aliased) result.aliased = { name: aliased.name, id: aliased.id };
    const first = searchResults?.[0];
    if (first && normalize(personName) === normalize(first.name)) {
      result.directMatch = { name: first.name, id: first.id };
    }
  } catch (e) {
    console.error('checkExistingPerson failed:', e);
  }
  return result;
}
