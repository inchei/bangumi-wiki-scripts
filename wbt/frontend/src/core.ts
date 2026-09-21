export interface CsvItem {
  id: string;
  tags?: string;
  series?: string;
  [field: string]: string | undefined;
}

export interface EntityConfig {
  wikiPath: string;
  historyPath: string;
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
  profession?: Record<string, boolean>;
}

export interface HistoryEntry {
  createdAt?: number;
  creator?: { username?: string };
  commitMessage?: string;
}

export type ViewName = 'home' | 'setup' | 'processing' | 'completed' | 'login';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface PreviousItem {
  id: string;
  name: string;
  type: string;
}

export interface WorkItem {
  id: number;
  csvId: string;
  entityType: EntityType;
  row: CsvItem;
  sourceId: number;
}

export interface SourceInfo {
  id: number;
  name: string;
  entityType: string;
  pending: number;
}

export interface WorkScope {
    scope: 'error' | 'source';
    sourceId?: number;
    sourceName?: string;
    // cursor: only acquire items with pk after this value; advances on
    // every claim so skipped items are not handed back to the same user
    after: number;
    // cursor value before the last claim; retry restores it to re-fetch
    // the same item
    prevAfter: number;
}

export interface State {
    theme: ThemeMode;
    currentView: ViewName;
    userName: string;
    userId: number;
    hasCookie: boolean;
    processedCount: number;
    processing: boolean;
  scope: WorkScope | null;
  currentItem: WorkItem | null;
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
  previousItem: PreviousItem | null;
}

export const state: State = {
  theme: (localStorage.getItem('wbtTheme') as ThemeMode) || 'system',
  currentView: 'home',
  userName: '',
  userId: 0,
  hasCookie: false,
  processedCount: 0,
  processing: false,
  scope: null,
  currentItem: null,
  currentSubjectData: null,
  currentFieldUpdates: null,
  currentTagUpdates: null,
  currentSeriesUpdate: null,
  currentWcode: null,
  currentTags: null,
  currentSeries: null,
  currentCommitMessage: null,
  isCommitMessageLocked: localStorage.getItem('wbtIsCommitMessageLocked') === 'true',
  lockedCommitMessage: localStorage.getItem('wbtLockedCommitMessage') || '',
  previousItem: JSON.parse(localStorage.getItem('wbtPreviousItem') || 'null'),
};

export function saveState(): void {
  localStorage.setItem('wbtIsCommitMessageLocked', state.isCommitMessageLocked.toString());
  localStorage.setItem('wbtLockedCommitMessage', state.lockedCommitMessage);
  if (state.previousItem) {
    localStorage.setItem('wbtPreviousItem', JSON.stringify(state.previousItem));
  }
  localStorage.setItem('wbtTheme', state.theme);
}

export function getEntityApiConfig(type: EntityType, id: string): EntityConfig {
  const configs: Record<EntityType, EntityConfig> = {
    subject: {
      wikiPath: `/p1/wiki/subjects/${id}`,
      historyPath: `/p1/wiki/subjects/${id}/history-summary`,
      editPagePath: `https://bgm.tv/subject/${id}/edit`,
    },
    character: {
      wikiPath: `/p1/wiki/characters/${id}`,
      historyPath: `/p1/wiki/characters/${id}/history-summary`,
      editPagePath: `https://bgm.tv/character/${id}/edit`,
    },
    person: {
      wikiPath: `/p1/wiki/persons/${id}`,
      historyPath: `/p1/wiki/persons/${id}/history-summary`,
      editPagePath: `https://bgm.tv/person/${id}/edit`,
    },
  };
  return configs[type] || configs.subject;
}
