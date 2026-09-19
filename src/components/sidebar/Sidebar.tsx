'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  BookOpen,
  Star,
  Trash2,
  Archive,
  Settings,
  Command,
  Tag,
  Sun,
  Moon,
  Feather,
  Sparkles,
  Layers,
  ChevronRight,
  PanelLeftClose,
  Check,
} from 'lucide-react';
import { Note, NoteFilter, ThemeId } from '@/types/note';
import NoteListItem from './NoteListItem';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleArchive?: (id: string) => void;
  currentFilter: NoteFilter;
  onChangeFilter: (filter: NoteFilter) => void;
  currentTheme: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
  onOpenSettings: () => void;
  onOpenCommandPalette: () => void;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onToggleFavorite,
  onToggleArchive,
  currentFilter,
  onChangeFilter,
  currentTheme,
  onChangeTheme,
  onOpenSettings,
  onOpenCommandPalette,
  onToggleCollapse,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  // Extract all distinct tags from non-deleted notes
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    notes
      .filter((n) => !n.isDeleted)
      .forEach((n) => {
        (n.tags || []).forEach((t) => set.add(t));
      });
    return Array.from(set);
  }, [notes]);

  // Counts
  const activeCount = useMemo(
    () => notes.filter((n) => !n.isDeleted && !n.isArchived).length,
    [notes]
  );
  const favoritesCount = useMemo(
    () => notes.filter((n) => !n.isDeleted && !n.isArchived && n.favorite).length,
    [notes]
  );
  const archiveCount = useMemo(
    () => notes.filter((n) => !n.isDeleted && n.isArchived).length,
    [notes]
  );
  const trashCount = useMemo(
    () => notes.filter((n) => n.isDeleted).length,
    [notes]
  );

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Tab filter
        if (currentFilter === 'trash') {
          if (!note.isDeleted) return false;
        } else if (currentFilter === 'archive') {
          if (note.isDeleted || !note.isArchived) return false;
        } else if (currentFilter === 'favorites') {
          if (note.isDeleted || note.isArchived || !note.favorite) return false;
        } else {
          // 'all'
          if (note.isDeleted || note.isArchived) return false;
        }

        // Tag filter
        if (selectedTag && (!note.tags || !note.tags.includes(selectedTag))) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleMatch = (note.title || '').toLowerCase().includes(q);
          const contentMatch = (note.plainText || '').toLowerCase().includes(q);
          return titleMatch || contentMatch;
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned notes first
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        // Then by last updated
        return b.updatedAt - a.updatedAt;
      });
  }, [notes, currentFilter, selectedTag, searchQuery]);

  // All 8 Curated Premium Themes
  const themes: { id: ThemeId; label: string; desc: string; color: string }[] = [
    { id: 'paper', label: 'Paper', desc: 'Editorial warm cream', color: '#FAF6EE' },
    { id: 'light', label: 'Light', desc: 'Studio neutral white', color: '#FFFFFF' },
    { id: 'dark', label: 'Dark', desc: 'Carbon zinc contrast', color: '#18181B' },
    { id: 'midnight', label: 'Midnight', desc: 'Deep night slate', color: '#0B0F19' },
    { id: 'nordic', label: 'Nordic', desc: 'Icy frost & arctic blue', color: '#2E3440' },
    { id: 'matcha', label: 'Matcha', desc: 'Japanese botanical sage', color: '#ECF1EC' },
    { id: 'rosewater', label: 'Rosewater', desc: 'Cashmere dusk blush', color: '#F3EBEB' },
    { id: 'oled', label: 'OLED', desc: 'Pitch true black', color: '#000000' },
  ];

  return (
    <aside className="w-full md:w-72 lg:w-80 h-full flex flex-col bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] select-none shrink-0 transition-colors">
      {/* Top Header & Brand */}
      <div className="p-4 flex items-center justify-between border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-main)] flex items-center justify-center text-[var(--accent-contrast)] font-bold text-base shadow-sm shadow-[var(--accent-main)]/30 ring-1 ring-black/10 dark:ring-white/20">
            W
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-[var(--text-main)] leading-none">
              Writely
            </h1>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5 tracking-tight block">
              Distraction-free thoughts
            </span>
          </div>
        </div>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title="Collapse sidebar"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors hidden md:block"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Action Buttons: Premium Tactile New Note & Refined Search */}
      <div className="p-3 flex flex-col gap-2">
        <button
          onClick={onCreateNote}
          className="group relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[var(--accent-main)] hover:bg-[var(--accent-hover)] text-[var(--accent-contrast)] font-semibold text-xs shadow-sm shadow-[var(--accent-main)]/20 hover:shadow-md hover:shadow-[var(--accent-main)]/30 transition-all duration-200 active:scale-[0.98] ring-1 ring-black/10 dark:ring-white/10"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-black/10 dark:bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:rotate-90">
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="font-semibold tracking-wide">New Note</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-black/15 text-[var(--accent-contrast)] border border-[var(--accent-contrast)]/20">
            ⌘N
          </kbd>
        </button>

        {/* Search input with Command Palette shortcut */}
        <div className="relative group">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-main)] transition-colors" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8.5 pr-12 py-2 rounded-xl text-xs bg-[var(--bg-card)]/90 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-main)] focus:ring-2 focus:ring-[var(--accent-main)]/15 transition-all shadow-2xs"
          />
          <button
            type="button"
            onClick={onOpenCommandPalette}
            title="Open Command Palette (⌘K)"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-[var(--border-subtle)]/70 hover:bg-[var(--border-strong)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all shadow-2xs"
          >
            ⌘K
          </button>
        </div>
      </div>

      {/* Segmented Filter Pills */}
      <div className="px-3 py-1.5 flex flex-col gap-1 border-b border-[var(--border-subtle)]">
        <button
          onClick={() => {
            onChangeFilter('all');
            setSelectedTag(null);
          }}
          className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
            currentFilter === 'all' && selectedTag === null
              ? 'bg-[var(--bg-card-active)] text-[var(--text-main)] shadow-xs'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                currentFilter === 'all' && selectedTag === null
                  ? 'bg-[var(--accent-main)] text-[var(--accent-contrast)] shadow-2xs'
                  : 'bg-[var(--border-subtle)]/70 text-[var(--text-muted)] group-hover:text-[var(--text-main)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium">All Notes</span>
          </div>
          <span className="text-[11px] text-[var(--text-faint)] font-mono px-2 py-0.5 rounded-full bg-[var(--border-subtle)]/60">
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => {
            onChangeFilter('favorites');
            setSelectedTag(null);
          }}
          className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
            currentFilter === 'favorites' && selectedTag === null
              ? 'bg-[var(--bg-card-active)] text-[var(--text-main)] shadow-xs'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                currentFilter === 'favorites' && selectedTag === null
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500/25'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-medium">Favorites</span>
          </div>
          <span className="text-[11px] text-[var(--text-faint)] font-mono px-2 py-0.5 rounded-full bg-[var(--border-subtle)]/60">
            {favoritesCount}
          </span>
        </button>

        <button
          onClick={() => {
            onChangeFilter('archive');
            setSelectedTag(null);
          }}
          className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
            currentFilter === 'archive' && selectedTag === null
              ? 'bg-[var(--bg-card-active)] text-[var(--text-main)] shadow-xs'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                currentFilter === 'archive' && selectedTag === null
                  ? 'bg-[var(--accent-main)] text-[var(--accent-contrast)] shadow-2xs'
                  : 'bg-[var(--border-subtle)]/70 text-[var(--text-muted)] group-hover:text-[var(--text-main)]'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium">Archive</span>
          </div>
          <span className="text-[11px] text-[var(--text-faint)] font-mono px-2 py-0.5 rounded-full bg-[var(--border-subtle)]/60">
            {archiveCount}
          </span>
        </button>

        <button
          onClick={() => {
            onChangeFilter('trash');
            setSelectedTag(null);
          }}
          className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
            currentFilter === 'trash'
              ? 'bg-[var(--bg-card-active)] text-[var(--text-main)] shadow-xs'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                currentFilter === 'trash'
                  ? 'bg-[var(--danger-main)] text-white shadow-2xs'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-500/20'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium">Trash</span>
          </div>
          <span className="text-[11px] text-[var(--text-faint)] font-mono px-2 py-0.5 rounded-full bg-[var(--border-subtle)]/60">
            {trashCount}
          </span>
        </button>
      </div>

      {/* Tags section if tags exist */}
      {availableTags.length > 0 && (
        <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
          <span className="text-[10px] font-semibold tracking-wider text-[var(--text-faint)] uppercase px-2 mb-1 block">
            Tags
          </span>
          <div className="flex flex-wrap gap-1 px-1">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`text-[11px] px-2 py-0.5 rounded-md transition-colors ${
                  selectedTag === tag
                    ? 'bg-[var(--accent-main)] text-[var(--accent-contrast)] font-medium'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-2 pr-2.5 flex flex-col gap-1">
        {filteredNotes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[var(--text-muted)]">
            <p className="text-sm font-medium mb-1">Nothing here yet.</p>
            <p className="text-xs text-[var(--text-faint)] mb-4">
              {currentFilter === 'trash'
                ? 'Trash is completely empty.'
                : currentFilter === 'favorites'
                ? 'Star your favorite notes for quick access.'
                : 'Create a note and start writing.'}
            </p>
            {currentFilter !== 'trash' && (
              <button
                onClick={onCreateNote}
                className="px-3 py-1.5 rounded-xl border border-[var(--border-strong)] text-xs font-medium text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors shadow-2xs"
              >
                New Note
              </button>
            )}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteListItem
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onSelect={() => onSelectNote(note.id)}
              onToggleFavorite={(e) => {
                e.stopPropagation();
                onToggleFavorite(note.id);
              }}
            />
          ))
        )}
      </div>

      {/* Sidebar Footer: Theme Quick-Switch & Settings */}
      <div className="p-3 border-t border-[var(--border-subtle)] flex items-center justify-between relative bg-[var(--bg-sidebar)]">
        {/* Theme Picker Popover with all 8 themes */}
        <div className="relative">
          <button
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/90 hover:bg-[var(--bg-card-hover)] text-xs font-medium text-[var(--text-main)] transition-all shadow-2xs"
            title="Change theme"
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-2xs"
              style={{
                backgroundColor:
                  themes.find((t) => t.id === currentTheme)?.color || '#FAF6EE',
              }}
            />
            <span className="capitalize">{currentTheme}</span>
          </button>

          {themeMenuOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-48 rounded-2xl bg-[var(--bg-dialog)] border border-[var(--border-strong)] shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider border-b border-[var(--border-subtle)] mb-1">
                Themes
              </div>
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onChangeTheme(t.id);
                    setThemeMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs w-full text-left transition-colors ${
                    currentTheme === t.id
                      ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                      : 'hover:bg-[var(--bg-card-hover)] text-[var(--text-main)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-black/20 shrink-0 shadow-2xs"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>{t.label}</span>
                  </div>
                  {currentTheme === t.id && (
                    <Check className="w-3.5 h-3.5 text-[var(--accent-main)]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings button with subtle gear rotate animation */}
        <button
          onClick={onOpenSettings}
          className="group p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/90 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-all shadow-2xs"
          title="Preferences & Tools"
        >
          <Settings className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
        </button>
      </div>
    </aside>
  );
}
