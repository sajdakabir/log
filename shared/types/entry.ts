export type EntryStatus = 'DRAFT' | 'PUBLISHED';

export type ChangeType = 'Added' | 'Improved' | 'Fixed' | 'Removed';

export const CHANGE_TYPES: ChangeType[] = ['Added', 'Improved', 'Fixed', 'Removed'];

export interface ChangeItem {
  type: ChangeType;
  text: string;
}

export interface EntryDTO {
  id: string;
  projectId: string;
  title: string;
  summary: string | null;
  bodyMarkdown: string;
  version: string;
  changes: ChangeItem[] | null;
  status: EntryStatus;
  publishedAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEntryInput {
  title?: string;
  version?: string;
  summary?: string | null;
  bodyMarkdown?: string;
  changes?: ChangeItem[] | null;
}
