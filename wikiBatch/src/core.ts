export interface CsvItem {
  id: string;
  type: 'subject' | 'character' | 'person';
  tags?: string;
  series?: string;
  [field: string]: string | undefined;
}

export interface EntityConfig {
  wikiPath: string;
  historyPath: string;
  patchBodyKey: string;
  editPagePath: string;
}

export type EntityType = 'subject' | 'character' | 'person';

export interface TagUpdates {
  add: string[];
  remove: string[];
}

export interface SeriesUpdate {
  hasUpdate: boolean;
  newValue?: boolean;
}

export interface WikiData {
  name?: string;
  infobox?: string;
  metaTags?: string[];
  series?: boolean;
  platform?: string;
  summary?: string;
}

export interface HistoryEntry {
  createdAt?: number;
  creator?: { username?: string };
  commitMessage?: string;
}

export type ViewName = 'setup' | 'processing' | 'completed';
export type DiffViewMode = 'split' | 'unified';

export interface PreviousItem {
  id: string;
  name: string;
  type: string;
}

export interface State {
  accessToken: string;
  formhash: string;
  submitMethod: 'patch' | 'post';
  csvData: CsvItem[] | null;
  currentIndex: number;
  totalItems: number;
  processing: boolean;
  paused: boolean;
  currentView: ViewName;
  currentSubjectData: WikiData | null;
  currentFieldUpdates: Record<string, string> | null;
  currentTagUpdates: TagUpdates | null;
  currentSeriesUpdate: SeriesUpdate | null;
  currentWcode: string | null;
  currentTags: string | null;
  currentSeries: boolean | null;
  currentCommitMessage: string | null;
  isCommitMessageLocked: boolean;
  lockedCommitMessage: string;
  retryCount: Record<string, number>;
  currentItemId: string | null;
  previousItem: PreviousItem | null;
  diffViewMode: DiffViewMode;
}

export const state: State = {
    accessToken: GM_getValue('bgmAccessToken') || '',
    formhash: GM_getValue('bgmFormhash') || '',
    submitMethod: (GM_getValue('bgmSubmitMethod') as 'patch' | 'post') || 'patch',
    csvData: JSON.parse(localStorage.getItem('bgmCsvData') || 'null'),
    currentIndex: parseInt(localStorage.getItem('bgmCurrentIndex') || '0'),
    totalItems: 0,
    processing: false,
    paused: false,
    currentView: 'setup',
    currentSubjectData: null,
    currentFieldUpdates: null,
    currentTagUpdates: null,
    currentSeriesUpdate: null,
    currentWcode: null,
    currentTags: null,
    currentSeries: null,
    currentCommitMessage: null,
    isCommitMessageLocked: localStorage.getItem('bgmIsCommitMessageLocked') === 'true' || false,
    lockedCommitMessage: localStorage.getItem('bgmLockedCommitMessage') || '',
    retryCount: {},
    currentItemId: null,
    previousItem: JSON.parse(localStorage.getItem('bgmPreviousItem') || 'null'),
    diffViewMode: (localStorage.getItem('bgmDiffViewMode') as DiffViewMode) || 'split',
};

export function saveState(): void {
    GM_setValue('bgmAccessToken', state.accessToken);
    GM_setValue('bgmFormhash', state.formhash);
    GM_setValue('bgmSubmitMethod', state.submitMethod);
    localStorage.setItem('bgmCsvData', JSON.stringify(state.csvData));
    localStorage.setItem('bgmCurrentIndex', state.currentIndex.toString());
    localStorage.setItem('bgmIsCommitMessageLocked', state.isCommitMessageLocked.toString());
    localStorage.setItem('bgmLockedCommitMessage', state.lockedCommitMessage);
    if (state.previousItem) {
        localStorage.setItem('bgmPreviousItem', JSON.stringify(state.previousItem));
    }
    localStorage.setItem('bgmDiffViewMode', state.diffViewMode);
}

export function getEntityApiConfig(type: EntityType, id: string): EntityConfig {
    const configs: Record<EntityType, EntityConfig> = {
        subject: {
            wikiPath: `/p1/wiki/subjects/${id}`,
            historyPath: `/p1/wiki/subjects/${id}/history-summary`,
            patchBodyKey: 'subject',
            editPagePath: `https://bgm.tv/subject/${id}/edit`,
        },
        character: {
            wikiPath: `/p1/wiki/characters/${id}`,
            historyPath: `/p1/wiki/characters/${id}/history-summary`,
            patchBodyKey: 'character',
            editPagePath: `https://bgm.tv/character/${id}/edit`,
        },
        person: {
            wikiPath: `/p1/wiki/persons/${id}`,
            historyPath: `/p1/wiki/persons/${id}/history-summary`,
            patchBodyKey: 'person',
            editPagePath: `https://bgm.tv/person/${id}/edit`,
        },
    };
    return configs[type] || configs.subject;
}
