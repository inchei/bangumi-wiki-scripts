import fastDiff from 'fast-diff';
import {
    DiffLineType,
    getPlainDiffTemplateByFastDiff,
    type DiffFile,
    type DiffLine,
} from '@git-diff-view/file';

type Seg = {
    type: 1 | -1 | 0;
    str: string;
    startIndex: number;
    endIndex: number;
    length: number;
};

function toSegments(ops: fastDiff.Diff[], keep: (t: number) => boolean): Seg[] {
    let start = 0;
    const out: Seg[] = [];
    for (const [t, s] of ops) {
        if (!keep(t)) continue;
        out.push({
            type: t,
            str: s,
            startIndex: start,
            endIndex: start + s.length - 1,
            length: s.length,
        });
        start += s.length;
    }
    return out;
}

function refinePair(deletion: DiffLine, addition: DiffLine): void {
    const ops = fastDiff(deletion.text, addition.text, 0, false);
    const addSegs = toSegments(ops, (t) => t !== -1);
    const delSegs = toSegments(ops, (t) => t !== 1);
    const hasLineChange = addSegs.some((s) => s.type === 0 && s.str.trim().length > 0);
    addition.diffChanges = {
        range: addSegs,
        hasLineChange,
        newLineSymbol: addition.changes?.newLineSymbol,
    };
    deletion.diffChanges = {
        range: delSegs,
        hasLineChange,
        newLineSymbol: deletion.changes?.newLineSymbol,
    };
    addition._diffChanges = deletion.diffChanges;
    deletion._diffChanges = addition.diffChanges;
    addition.plainTemplate = undefined;
    deletion.plainTemplate = undefined;
    getPlainDiffTemplateByFastDiff({ diffLine: addition, rawLine: addition.text, operator: 'add' });
    getPlainDiffTemplateByFastDiff({ diffLine: deletion, rawLine: deletion.text, operator: 'del' });
    if (addition.plainTemplate) addition.plainTemplateMode = 'relative';
    if (deletion.plainTemplate) deletion.plainTemplateMode = 'relative';
}

export function refineInlineHighlights(file: DiffFile): void {
    for (let i = 0; i < file.splitLineLength; i++) {
        const left = file.getSplitLeftLine(i).diff;
        const right = file.getSplitRightLine(i).diff;
        if (!left || !right) continue;
        if (left.type !== DiffLineType.Delete || right.type !== DiffLineType.Add) continue;
        if (!left.changes || !right.changes) continue;
        refinePair(left, right);
    }
}
