declare function GM_addStyle(css: string): void;

declare function GM_setValue(key: string, value: string): void;

declare function GM_getValue(key: string, defaultValue?: string): string;

declare namespace GM {
  function xmlHttpRequest(details: {
    method: string;
    url: string;
    data?: string;
    headers?: Record<string, string>;
    onload?: (response: { responseText: string; status: number }) => void;
    onerror?: (response: { message?: string }) => void;
    onabort?: () => void;
    ontimeout?: () => void;
  }): void;
}

declare module '*.css' {
  const content: string;
  export default content;
}
