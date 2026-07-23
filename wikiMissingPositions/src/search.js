const createFetch = (method) => async (url, body) => {
  const options = method === 'POST' ? { method, body: JSON.stringify(body) } : { method };
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

const fetchPost = createFetch('POST');

const postSearch = async (cat, keyword, filter, limit = 1) => {
  const url = `https://api.bgm.tv/v0/search/${cat}?limit=${limit}`;
  const body = { keyword, filter };
  const result = await fetchPost(url, body);
  return result?.data;
};

export const searchPrsn = (keyword) => postSearch('persons', keyword);
export const searchPrsnAll = (keyword) => postSearch('persons', keyword, undefined, 5);

export function normalize(name) {
  return name
    .replace(/\s/g, '')
    .replaceAll('-', '')
    .replace(/[\u30A1-\u30F6]/g, function (match) {
      return String.fromCharCode(match.charCodeAt(0) - 0x60);
    })
    .replace(/[\uFF21-\uFF5A]/g, function (match) {
      return String.fromCharCode(match.charCodeAt(0) - 0xfee0);
    })
    .toLowerCase();
}
