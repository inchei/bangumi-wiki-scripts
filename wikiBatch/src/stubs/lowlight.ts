const noopHighlighter = {
    name: 'stub',
    maxLineToIgnoreSyntax: 0,
    setMaxLineToIgnoreSyntax: () => {},
    ignoreSyntaxHighlightList: [] as (string | RegExp)[],
    setIgnoreSyntaxHighlightList: () => {},
    getAST: () => ({ children: [] }),
    processAST: () => ({ syntaxFileObject: {} as Record<number, unknown>, syntaxFileLineNumber: 0 }),
    hasRegisteredCurrentLang: () => false,
    getHighlighterEngine: () => null,
};

export const highlighter = noopHighlighter;
export const LowlightHighlighter = noopHighlighter;

export function processAST(_ast: unknown) {
    return { syntaxFileObject: {} as Record<number, unknown>, syntaxFileLineNumber: 0 };
}
