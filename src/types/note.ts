import { type JSONContent } from '@tiptap/react';

export type ThemeId =
  | 'paper'
  | 'light'
  | 'dark'
  | 'midnight'
  | 'nordic'
  | 'matcha'
  | 'rosewater'
  | 'oled';

export type FontFamilyId =
  | 'sans-sfpro'
  | 'sans-inter'
  | 'sans-geist'
  | 'sans-jakarta'
  | 'serif-georgia'
  | 'serif-sourceserif'
  | 'serif-newsreader'
  | 'serif-garamond'
  | 'serif-lora'
  | 'mono-jetbrains'
  | 'mono-ibmplex';

export type FontSizeId = 'sm' | 'base' | 'lg';

export interface Note {
  id: string;
  title: string;
  content: JSONContent;
  plainText: string;
  createdAt: number;
  updatedAt: number;
  favorite: boolean;
  isDeleted: boolean;
  deletedAt?: number | null;
  tags: string[];
  pinned?: boolean;
  isArchived?: boolean;
  archivedAt?: number | null;
}

export type NoteFilter = 'all' | 'favorites' | 'archive' | 'trash';

export interface BackupData {
  version: number;
  app: 'Writely';
  exportedAt: string;
  notes: Note[];
}

export interface NoteStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  readingTimeMinutes: number;
  paragraphs: number;
}
