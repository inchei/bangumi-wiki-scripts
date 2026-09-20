import { Compartment, EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { MergeView, unifiedMergeView } from '@codemirror/merge';

const NARROW_PX = 640;

const themeCompartment = new Compartment();

function themeSpec(fontSize: string) {
    return {
        '&': {
            backgroundColor: 'var(--white)',
            color: 'var(--text)',
            fontSize,
            border: '1px solid var(--border)',
            borderRadius: '6px',
        },
        '.cm-content': {
            fontFamily: 'var(--font-mono)',
            lineHeight: '1.6',
            padding: '12px 0',
        },
        '.cm-gutters': {
            backgroundColor: 'transparent',
            border: 'none',
        },
        '&.cm-focused': {
            outline: 'none',
            borderColor: 'var(--accent)',
            boxShadow: '0 0 0 2px rgb(240 145 153 / 15%)',
        },
    };
}

const cmLight = (fontSize: string) => EditorView.theme(themeSpec(fontSize));
const cmDark = (fontSize: string) => EditorView.theme(themeSpec(fontSize), { dark: true });

const zhCN = EditorState.phrases.of({
    '$ unchanged lines': '$ 行未变更',
    'Revert this chunk': '撤销此块',
    'Accept': '接受',
    'Reject': '撤销',
});

function baseExtensions(onChange: () => void, narrow: boolean, dark: boolean) {
    const fontSize = narrow ? '16px' : '13px';
    return [
        EditorView.lineWrapping,
        zhCN,
        themeCompartment.of(dark ? cmDark(fontSize) : cmLight(fontSize)),
        EditorView.updateListener.of((u) => {
            if (u.docChanged) onChange();
        }),
    ];
}

const mergeConfig = {
    gutter: true,
    highlightChanges: true,
    collapseUnchanged: { margin: 3, minSize: 4 },
    diffConfig: { scanLimit: 20000 },
};

export const WCODE_CONTAINER_ID = 'static-cm-diff';
export const TAGS_CONTAINER_ID = 'static-tags-cm-diff';

interface EditableHandle {
    view: MergeView | EditorView;
    narrow: boolean;
}

const editableViews = new Map<string, EditableHandle>();

export function destroyDiffEditor(): void {
    for (const h of editableViews.values()) {
        h.view.destroy();
    }
    editableViews.clear();
}

export function getDoc(containerId: string): string {
    const h = editableViews.get(containerId);
    if (!h) return '';
    if (h.view instanceof MergeView) return h.view.b.state.doc.toString();
    return h.view.state.doc.toString();
}

export function refreshEditorTheme(dark: boolean): void {
    for (const h of editableViews.values()) {
        const fontSize = h.narrow ? '16px' : '13px';
        const t = dark ? cmDark(fontSize) : cmLight(fontSize);
        if (h.view instanceof MergeView) {
            h.view.a.dispatch({ effects: themeCompartment.reconfigure(t) });
            h.view.b.dispatch({ effects: themeCompartment.reconfigure(t) });
        } else {
            h.view.dispatch({ effects: themeCompartment.reconfigure(t) });
        }
    }
}

export function setDiffContent(
    containerId: string,
    oldText: string,
    newText: string,
    dark: boolean,
    onChange: () => void,
): void {
    const parent = document.getElementById(containerId);
    if (!parent) return;
    editableViews.get(containerId)?.view.destroy();
    editableViews.delete(containerId);
    parent.replaceChildren();
    const narrow = parent.clientWidth < NARROW_PX || window.innerWidth < NARROW_PX;
    const shared = (cb: () => void) => baseExtensions(cb, narrow, dark);
    if (narrow) {
        const v = new EditorView({
            doc: newText,
            parent,
            extensions: [
                ...shared(onChange),
                unifiedMergeView({
                    original: oldText,
                    mergeControls: false,
                    allowInlineDiffs: true,
                    ...mergeConfig,
                }),
            ],
        });
        editableViews.set(containerId, { view: v, narrow });
        return;
    }
    const v = new MergeView({
        a: {
            doc: oldText,
            extensions: [...shared(() => {}), EditorState.readOnly.of(true)],
        },
        b: { doc: newText, extensions: shared(onChange) },
        parent,
        orientation: 'a-b',
        revertControls: 'a-to-b',
        ...mergeConfig,
    });
    editableViews.set(containerId, { view: v, narrow });
}
