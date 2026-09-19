'use client';

import React, { useState, useMemo } from 'react';
import { Note, NoteFilter, ThemeId } from '@/types/note';
import {
  Search,
  FileText,
  Star,
  Trash2,
  Archive,
  Plus,
  Sun,
  Moon,
  MoreHorizontal,
  ChevronDown,
  Menu,
  Check,
  X,
  ArrowRight,
  Tag,
  Sparkles,
} from 'lucide-react';

interface MobileHomeScreenProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onDeleteTag?: (tag: string) => void;
  currentFilter: NoteFilter;
  onChangeFilter: (filter: NoteFilter) => void;
  currentTheme: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
  onOpenSettings: () => void;
  onOpenCommandPalette: () => void;
  onOpenStats?: () => void;
  onOpenEditor?: () => void;
}

interface TagColorConfig {
  bg: string;
  text: string;
  stripe: string;
  border: string;
  darkBg: string;
  darkText: string;
  darkStripe: string;
}

// Preset pastel tag color palettes matching reference UI
const TAG_COLOR_PALETTES: Record<string, TagColorConfig> = {
  personal: {
    bg: '#FCE8DE',
    text: '#8B482B',
    stripe: '#D96538',
    border: '#F8D3C1',
    darkBg: '#3B241C',
    darkText: '#F5BEAA',
    darkStripe: '#E07D54',
  },
  work: {
    bg: '#E1F0FF',
    text: '#1E56A0',
    stripe: '#2563EB',
    border: '#C5E2FF',
    darkBg: '#152942',
    darkText: '#93C5FD',
    darkStripe: '#60A5FA',
  },
  ideas: {
    bg: '#E3F6EC',
    text: '#226E46',
    stripe: '#059669',
    border: '#C5F0DA',
    darkBg: '#163826',
    darkText: '#86EFAC',
    darkStripe: '#34D399',
  },
  travel: {
    bg: '#EFE8FC',
    text: '#5E3FA2',
    stripe: '#7C3AED',
    border: '#DDD1F8',
    darkBg: '#281E42',
    darkText: '#C4B5FD',
    darkStripe: '#A78BFA',
  },
  books: {
    bg: '#F4EFE6',
    text: '#6B5738',
    stripe: '#D97706',
    border: '#E8DDCB',
    darkBg: '#352D21',
    darkText: '#E9D5BD',
    darkStripe: '#FBBF24',
  },
  welcome: {
    bg: '#FCE8DE',
    text: '#8B482B',
    stripe: '#D96538',
    border: '#F8D3C1',
    darkBg: '#3B241C',
    darkText: '#F5BEAA',
    darkStripe: '#E07D54',
  },
  guide: {
    bg: '#E1F0FF',
    text: '#1E56A0',
    stripe: '#2563EB',
    border: '#C5E2FF',
    darkBg: '#152942',
    darkText: '#93C5FD',
    darkStripe: '#60A5FA',
  },
};

// Dynamic color generator for any arbitrary tag
const FALLBACK_PALETTES: TagColorConfig[] = [
  { bg: '#FCE8DE', text: '#8B482B', stripe: '#D96538', border: '#F8D3C1', darkBg: '#3B241C', darkText: '#F5BEAA', darkStripe: '#E07D54' },
  { bg: '#E1F0FF', text: '#1E56A0', stripe: '#2563EB', border: '#C5E2FF', darkBg: '#152942', darkText: '#93C5FD', darkStripe: '#60A5FA' },
  { bg: '#E3F6EC', text: '#226E46', stripe: '#059669', border: '#C5F0DA', darkBg: '#163826', darkText: '#86EFAC', darkStripe: '#34D399' },
  { bg: '#EFE8FC', text: '#5E3FA2', stripe: '#7C3AED', border: '#DDD1F8', darkBg: '#281E42', darkText: '#C4B5FD', darkStripe: '#A78BFA' },
  { bg: '#F4EFE6', text: '#6B5738', stripe: '#D97706', border: '#E8DDCB', darkBg: '#352D21', darkText: '#E9D5BD', darkStripe: '#FBBF24' },
  { bg: '#FCE7F3', text: '#9D174D', stripe: '#DB2777', border: '#FBCFE8', darkBg: '#3C1828', darkText: '#F472B6', darkStripe: '#F472B6' },
  { bg: '#E0F2FE', text: '#075985', stripe: '#0284C7', border: '#BAE6FD', darkBg: '#112C3E', darkText: '#38BDF8', darkStripe: '#38BDF8' },
  { bg: '#CCFBF1', text: '#115E59', stripe: '#0D9488', border: '#99F6E4', darkBg: '#133532', darkText: '#2DD4BF', darkStripe: '#2DD4BF' },
];

const DEFAULT_TAGS = ['personal', 'work', 'ideas', 'travel', 'books'];

const THEMES_CYCLE: ThemeId[] = [
  'paper',
  'light',
  'dark',
  'oled',
  'nordic',
  'midnight',
  'matcha',
  'rosewater',
];

export default function MobileHomeScreen({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onToggleFavorite,
  onToggleArchive,
  onDeleteNote,
  onDeleteTag,
  currentFilter,
  onChangeFilter,
  currentTheme,
  onChangeTheme,
  onOpenSettings,
  onOpenCommandPalette,
}: MobileHomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [menuNoteId, setMenuNoteId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState('');

  // Cycle theme on header sun/moon click
  const handleCycleTheme = () => {
    const currentIndex = THEMES_CYCLE.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES_CYCLE.length;
    onChangeTheme(THEMES_CYCLE[nextIndex]);
  };

  // Extract all unique tags across notes plus default ones
  const availableTags = useMemo(() => {
    const set = new Set<string>(DEFAULT_TAGS);
    notes.forEach((n) => {
      if (!n.isDeleted && n.tags) {
        n.tags.forEach((t) => {
          const clean = t.replace(/^#/, '').trim().toLowerCase();
          if (clean) set.add(clean);
        });
      }
    });
    return Array.from(set);
  }, [notes]);

  // Filtered tags for the colorful popup modal
  const modalFilteredTags = useMemo(() => {
    if (!tagSearchQuery.trim()) return availableTags;
    const q = tagSearchQuery.toLowerCase().trim();
    return availableTags.filter((t) => t.includes(q));
  }, [availableTags, tagSearchQuery]);

  // Count active notes with a specific tag
  const getNoteCountForTag = (tag: string) => {
    const clean = tag.replace(/^#/, '').trim().toLowerCase();
    return notes.filter(
      (n) =>
        !n.isDeleted &&
        n.tags &&
        n.tags.some((t) => t.replace(/^#/, '').trim().toLowerCase() === clean)
    ).length;
  };

  // Counts for pills
  const allCount = useMemo(() => notes.filter((n) => !n.isDeleted && !n.isArchived).length, [notes]);
  const favoritesCount = useMemo(() => notes.filter((n) => !n.isDeleted && !n.isArchived && n.favorite).length, [notes]);
  const archiveCount = useMemo(() => notes.filter((n) => !n.isDeleted && n.isArchived).length, [notes]);
  const trashCount = useMemo(() => notes.filter((n) => n.isDeleted).length, [notes]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    let list = notes.slice();

    // Standard filter tabs
    if (currentFilter === 'trash') {
      list = list.filter((n) => n.isDeleted);
    } else if (currentFilter === 'archive') {
      list = list.filter((n) => !n.isDeleted && n.isArchived);
    } else if (currentFilter === 'favorites') {
      list = list.filter((n) => !n.isDeleted && !n.isArchived && n.favorite);
    } else {
      list = list.filter((n) => !n.isDeleted && !n.isArchived);
    }

    // Tag filter
    if (selectedTag) {
      const targetTag = selectedTag.replace(/^#/, '').trim().toLowerCase();
      list = list.filter(
        (n) =>
          n.tags &&
          n.tags.some((t) => t.replace(/^#/, '').trim().toLowerCase() === targetTag)
      );
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          (n.plainText && n.plainText.toLowerCase().includes(q))
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'created') return b.createdAt - a.createdAt;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.updatedAt - a.updatedAt;
    });

    return list;
  }, [notes, currentFilter, selectedTag, searchQuery, sortBy]);

  // Format date nicely matching "Today, 12:21 PM" or "Yesterday, 9:41 PM" or "Sep 14, 2024"
  const formatNoteDate = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    if (isToday) return `Today, ${timeStr}`;
    if (isYesterday) return `Yesterday, ${timeStr}`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  // Get harmonic tag styles deterministically
  const getTagStyle = (rawTag: string): TagColorConfig => {
    const key = rawTag.replace(/^#/, '').trim().toLowerCase();
    if (TAG_COLOR_PALETTES[key]) {
      return TAG_COLOR_PALETTES[key];
    }
    // Deterministic hash code for any custom tag
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % FALLBACK_PALETTES.length;
    return FALLBACK_PALETTES[index];
  };

  const isDarkTheme = ['dark', 'oled', 'midnight', 'nordic'].includes(currentTheme);

  return (
    <div
      style={{
        fontFamily: 'var(--font-sf-pro, -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", sans-serif)',
      }}
      className="w-full h-full flex flex-col bg-[var(--bg-app)] text-[var(--text-main)] select-none relative overflow-hidden"
    >
      {/* SCROLLABLE MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28 space-y-6">
        {/* 1. TOP HEADER & BRAND */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-main)] leading-none">
              Writely
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-normal mt-1.5 tracking-tight">
              Distraction-free thoughts
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Theme toggle circular button */}
            <button
              onClick={handleCycleTheme}
              title={`Switch theme (currently ${currentTheme})`}
              className="w-10 h-10 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] shadow-xs transition-all duration-200 active:scale-95"
            >
              {isDarkTheme ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-600" />}
            </button>

            {/* Profile / Monogram circle avatar */}
            <button
              onClick={onOpenSettings}
              title="Open Settings"
              className="w-10 h-10 rounded-full bg-[var(--accent-main)] text-[var(--accent-contrast)] flex items-center justify-center text-base font-bold shadow-xs ring-2 ring-black/5 dark:ring-white/10 transition-transform duration-200 active:scale-95"
            >
              W
            </button>
          </div>
        </div>

        {/* 2. FULL-WIDTH SEARCH BAR */}
        <div className="relative group">
          <div className="w-full h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] px-4 flex items-center gap-3 shadow-xs focus-within:ring-2 focus-within:ring-[var(--accent-main)]/25 focus-within:border-[var(--accent-main)] transition-all">
            <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your notes..."
              className="w-full bg-transparent text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/80 outline-none"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onOpenCommandPalette}
                className="px-2 py-0.5 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)] shrink-0 flex items-center gap-1 active:scale-95"
              >
                <span>⌘</span>
                <span>K</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. FILTER PILLS (Horizontal Scroll - Completely Hidden Scrollbars) */}
        <div
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5"
        >
          {/* ALL NOTES */}
          <button
            onClick={() => {
              onChangeFilter('all');
              setSelectedTag(null);
            }}
            className={`h-10 px-4 rounded-2xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all duration-200 active:scale-95 ${
              currentFilter === 'all' && !selectedTag
                ? 'bg-[var(--accent-main)] text-[var(--accent-contrast)] shadow-xs shadow-[var(--accent-main)]/20'
                : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>All</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                currentFilter === 'all' && !selectedTag
                  ? 'bg-white/20 text-[var(--accent-contrast)]'
                  : 'bg-[var(--bg-card-hover)] text-[var(--text-muted)]'
              }`}
            >
              {allCount}
            </span>
          </button>

          {/* FAVORITES */}
          <button
            onClick={() => {
              onChangeFilter('favorites');
              setSelectedTag(null);
            }}
            className={`h-10 px-4 rounded-2xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all duration-200 active:scale-95 ${
              currentFilter === 'favorites'
                ? 'bg-[var(--accent-main)] text-[var(--accent-contrast)] shadow-xs shadow-[var(--accent-main)]/20'
                : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${currentFilter === 'favorites' ? 'fill-current' : ''}`} />
            <span>Favorites</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                currentFilter === 'favorites'
                  ? 'bg-white/20 text-[var(--accent-contrast)]'
                  : 'bg-[var(--bg-card-hover)] text-[var(--text-muted)]'
              }`}
            >
              {favoritesCount}
            </span>
          </button>

          {/* TRASH */}
          <button
            onClick={() => {
              onChangeFilter('trash');
              setSelectedTag(null);
            }}
            className={`h-10 px-4 rounded-2xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all duration-200 active:scale-95 ${
              currentFilter === 'trash'
                ? 'bg-[var(--danger-main)] text-white shadow-xs'
                : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Trash</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                currentFilter === 'trash' ? 'bg-white/25 text-white' : 'bg-[var(--bg-card-hover)] text-[var(--text-muted)]'
              }`}
            >
              {trashCount}
            </span>
          </button>

          {/* ARCHIVE */}
          <button
            onClick={() => {
              onChangeFilter('archive');
              setSelectedTag(null);
            }}
            className={`h-10 px-4 rounded-2xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all duration-200 active:scale-95 ${
              currentFilter === 'archive' && !selectedTag
                ? 'bg-[var(--accent-main)] text-[var(--accent-contrast)] shadow-xs shadow-[var(--accent-main)]/20'
                : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archive</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                currentFilter === 'archive' && !selectedTag
                  ? 'bg-white/25 text-white'
                  : 'bg-[var(--bg-card-hover)] text-[var(--text-muted)]'
              }`}
            >
              {archiveCount}
            </span>
          </button>
        </div>

        {/* 4. TAGS SECTION (Horizontal Scroll - Completely Hidden Scrollbars) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text-main)]">
              Tags
            </h2>
            <button
              onClick={() => setIsTagsModalOpen(true)}
              className="text-xs text-[var(--accent-main)] hover:text-[var(--accent-hover)] font-semibold flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-[var(--bg-card)] active:scale-95"
            >
              <span>See all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-5 px-5"
          >
            {availableTags.map((tag) => {
              const style = getTagStyle(tag);
              const isSelected = selectedTag === tag;
              const stripeColor = isDarkTheme ? style.darkStripe : style.stripe;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? null : tag)}
                  style={{
                    backgroundColor: isDarkTheme ? style.darkBg : style.bg,
                    color: isDarkTheme ? style.darkText : style.text,
                    border: isSelected ? `2px solid ${stripeColor}` : '2px solid transparent',
                  }}
                  className={`h-8 px-3.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 shrink-0 transition-all duration-200 active:scale-95 ${
                    isSelected ? 'shadow-xs scale-[1.02]' : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  {isSelected && (
                    <span
                      style={{ backgroundColor: stripeColor }}
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                    />
                  )}
                  <span>#{tag}</span>
                </button>
              );
            })}

            {/* + Add Tag pill */}
            <button
              onClick={onOpenCommandPalette}
              title="Add or search tags"
              className="w-8 h-8 rounded-full border border-dashed border-[var(--border-strong)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent-main)] shrink-0 transition-colors active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5. RECENT NOTES SECTION */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-main)]">
              {currentFilter === 'trash'
                ? 'Trashed Notes'
                : currentFilter === 'favorites'
                ? 'Favorite Notes'
                : selectedTag
                ? `Tagged #${selectedTag}`
                : 'Recent Notes'}
            </h2>

            <div className="flex items-center gap-2 relative">
              {/* Sort Selector */}
              <button
                onClick={() => setShowSortMenu((prev) => !prev)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[var(--bg-card)] transition-colors"
              >
                <span>
                  {sortBy === 'updated'
                    ? 'Last edited'
                    : sortBy === 'created'
                    ? 'Date created'
                    : 'Alphabetical'}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Sort Dropdown Popup */}
              {showSortMenu && (
                <div className="absolute right-6 top-8 z-30 w-36 rounded-xl bg-[var(--bg-dialog)] border border-[var(--border-subtle)] shadow-lg py-1 text-xs">
                  <button
                    onClick={() => {
                      setSortBy('updated');
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[var(--bg-card-hover)] ${
                      sortBy === 'updated' ? 'font-semibold text-[var(--accent-main)]' : ''
                    }`}
                  >
                    <span>Last edited</span>
                    {sortBy === 'updated' && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('created');
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[var(--bg-card-hover)] ${
                      sortBy === 'created' ? 'font-semibold text-[var(--accent-main)]' : ''
                    }`}
                  >
                    <span>Date created</span>
                    {sortBy === 'created' && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('title');
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[var(--bg-card-hover)] ${
                      sortBy === 'title' ? 'font-semibold text-[var(--accent-main)]' : ''
                    }`}
                  >
                    <span>Alphabetical</span>
                    {sortBy === 'title' && <Check className="w-3 h-3" />}
                  </button>
                </div>
              )}

              {/* Layout toggle icon */}
              <button
                onClick={() => setSortBy(sortBy === 'updated' ? 'title' : 'updated')}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors"
                title="Toggle view"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Filtered Tag Bar with Delete Tag Option */}
          {selectedTag && (
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  style={{
                    backgroundColor: isDarkTheme
                      ? getTagStyle(selectedTag).darkStripe
                      : getTagStyle(selectedTag).stripe,
                  }}
                  className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white/20 dark:ring-black/20"
                />
                <div className="truncate">
                  <span className="text-xs font-bold text-[var(--text-main)]">
                    #{selectedTag.replace(/^#/, '')}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] ml-1.5 font-medium">
                    ({filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onDeleteTag && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTag(selectedTag);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-[var(--danger-subtle)] text-[var(--danger-main)] hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-2xs"
                    title={`Delete tag #${selectedTag} from all notes`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Tag</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedTag(null)}
                  className="p-1.5 rounded-xl hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors active:scale-95"
                  title="Clear filter"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* NOTES LIST CARDS - PROMINENTLY COLORED ACCORDING TO TAGS */}
          {filteredNotes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] p-8 text-center bg-[var(--bg-card)]/50">
              <p className="text-sm italic text-[var(--text-muted)] mb-3">
                No notes found in this view.
              </p>
              <button
                onClick={onCreateNote}
                className="px-4 py-2 rounded-xl bg-[var(--accent-main)] text-[var(--accent-contrast)] text-xs font-semibold shadow-xs"
              >
                Create a new note
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotes.map((note) => {
                // Determine primary tag
                const rawTag = note.tags && note.tags.length > 0 ? note.tags[0] : 'personal';
                const cleanTag = rawTag.replace(/^#/, '').trim().toLowerCase();
                const tagStyle = getTagStyle(cleanTag);
                const isMenuOpen = menuNoteId === note.id;
                const stripeColor = isDarkTheme ? tagStyle.darkStripe : tagStyle.stripe;

                return (
                  <div
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className={`relative group rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 shadow-xs hover:shadow-sm transition-all duration-200 active:scale-[0.99] cursor-pointer flex gap-3.5 ${
                      isMenuOpen ? 'z-30 ring-2 ring-[var(--accent-main)]/20' : 'z-0'
                    }`}
                  >
                    {/* Prominent Colored Accent Indicator Bar */}
                    <div
                      style={{ backgroundColor: stripeColor }}
                      className="w-1.5 rounded-full self-stretch shrink-0"
                    />

                    {/* Card Content */}
                    <div className="flex-1 min-w-0">
                      {/* Top Row: Title + Action Button */}
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[15px] font-bold text-[var(--text-main)] truncate leading-snug">
                          {note.title || 'Untitled note'}
                        </h3>

                        {/* Three Dots Menu Button */}
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setMenuNoteId(isMenuOpen ? null : note.id)}
                            className="p-1 -mr-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors active:scale-90"
                            title="More options"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {/* Options Popup with iOS Spring Pinch Animation & Outside Backdrop */}
                          {isMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40 bg-transparent cursor-default"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMenuNoteId(null);
                                }}
                              />
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-7.5 z-50 w-44 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-2xl py-1.5 text-xs text-[var(--text-main)] animate-ios-pinch-pop ring-1 ring-black/10 dark:ring-white/10"
                              >
                                <button
                                  onClick={() => {
                                    onToggleFavorite(note.id);
                                    setMenuNoteId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-[var(--bg-card-hover)] flex items-center gap-2.5 transition-colors"
                                >
                                  <Star className={`w-3.5 h-3.5 ${note.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                                  <span>{note.favorite ? 'Remove Favorite' : 'Mark as Favorite'}</span>
                                </button>

                                <button
                                  onClick={() => {
                                    onToggleArchive(note.id);
                                    setMenuNoteId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-[var(--bg-card-hover)] flex items-center gap-2.5 transition-colors"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                  <span>{note.isArchived ? 'Unarchive Note' : 'Archive Note'}</span>
                                </button>

                                <div className="my-1 border-t border-[var(--border-subtle)]/60" />

                                <button
                                  onClick={() => {
                                    onDeleteNote(note.id);
                                    setMenuNoteId(null);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-[var(--danger-subtle)] flex items-center gap-2.5 text-[var(--danger-main)] transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>{note.isDeleted ? 'Delete Forever' : 'Move to Trash'}</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Excerpt - Dynamically responsive to reading size */}
                      <p
                        style={{ fontSize: 'var(--reading-excerpt-size, 12px)' }}
                        className="text-[var(--text-muted)] line-clamp-2 leading-relaxed mt-1 mb-3 transition-all"
                      >
                        {note.plainText || 'No text content yet...'}
                      </p>

                      {/* Footer Row: Tag Chip + Date + Status Badges */}
                      <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                        <span
                          style={{
                            backgroundColor: isDarkTheme ? tagStyle.darkBg : tagStyle.bg,
                            color: isDarkTheme ? tagStyle.darkText : tagStyle.text,
                          }}
                          className="px-2.5 py-0.5 rounded-full font-bold tracking-tight text-[10px]"
                        >
                          #{cleanTag}
                        </span>

                        {note.isArchived && (
                          <span className="px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold text-[10px] flex items-center gap-1">
                            <Archive className="w-2.5 h-2.5" />
                            <span>Archived</span>
                          </span>
                        )}

                        <span>&bull;</span>

                        <span>{formatNoteDate(note.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 6. FLOATING ACTION BUTTON (FAB) FOR NEW NOTE (Positioned Cleanly at Bottom Right) */}
      <button
        onClick={onCreateNote}
        title="Create new note"
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-[var(--accent-main)] text-[var(--accent-contrast)] shadow-lg shadow-[var(--accent-main)]/35 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ring-4 ring-black/5 dark:ring-white/10"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* 7. ALL TAGS MODERN IOS NATIVE BOTTOM SHEET MODAL (BLURRED FROSTED BACKDROP) */}
      {isTagsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          {/* Intense frosted blurred backdrop */}
          <div
            className="absolute inset-0 bg-black/45 dark:bg-black/70 backdrop-blur-xl transition-opacity cursor-pointer"
            onClick={() => setIsTagsModalOpen(false)}
          />

          {/* iOS Floating Bottom Sheet Card */}
          <div
            className="relative w-full sm:max-w-md max-h-[82vh] rounded-t-[32px] sm:rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-2xl flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
            style={{
              fontFamily: 'var(--font-sf-pro, -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", sans-serif)',
            }}
          >
            {/* iOS Top Grabber Handle */}
            <div className="w-10 h-1 rounded-full bg-[var(--text-muted)]/30 mx-auto mt-3 mb-1 shrink-0" />

            {/* Sticky Fixed Header & Integrated Search Bar */}
            <div className="px-5 pt-2 pb-3.5 border-b border-[var(--border-subtle)] space-y-3 shrink-0 bg-[var(--bg-card)]">
              {/* Header Title Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl font-bold tracking-tight text-[var(--text-main)] leading-none">
                    Tags
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                    {availableTags.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedTag && (
                    <button
                      onClick={() => {
                        setSelectedTag(null);
                        setIsTagsModalOpen(false);
                      }}
                      className="text-xs font-semibold text-[var(--danger-main)] hover:opacity-80 px-2 py-1 transition-opacity"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    onClick={() => setIsTagsModalOpen(false)}
                    className="w-7 h-7 rounded-full bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center active:scale-90 transition-all"
                    title="Close"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* iOS Native Search Field */}
              <div className="w-full h-10 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] px-3.5 flex items-center gap-2.5 text-xs focus-within:ring-2 focus-within:ring-[var(--accent-main)]/20 transition-all">
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                <input
                  type="text"
                  value={tagSearchQuery}
                  onChange={(e) => setTagSearchQuery(e.target.value)}
                  placeholder="Search tags..."
                  className="w-full bg-transparent text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] outline-none"
                />
                {tagSearchQuery && (
                  <button
                    onClick={() => setTagSearchQuery('')}
                    className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Colorful Tag Cloud (Pills Flow Layout - No Stuck Cards) */}
            <div
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              className="flex-1 overflow-y-auto p-5 no-scrollbar max-h-[50vh]"
            >
              <div className="flex flex-wrap gap-2.5">
                {modalFilteredTags.map((tag) => {
                  const style = getTagStyle(tag);
                  const isSelected = selectedTag === tag;
                  const count = getNoteCountForTag(tag);
                  const stripeColor = isDarkTheme ? style.darkStripe : style.stripe;

                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTag(isSelected ? null : tag);
                        onChangeFilter('all');
                        setIsTagsModalOpen(false);
                      }}
                      style={{
                        backgroundColor: isDarkTheme ? style.darkBg : style.bg,
                        color: isDarkTheme ? style.darkText : style.text,
                        border: isSelected
                          ? `2px solid ${stripeColor}`
                          : isDarkTheme
                          ? '1.5px solid transparent'
                          : `1.5px solid ${style.border}`,
                      }}
                      className={`h-10 px-4 rounded-full flex items-center gap-2 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 shadow-xs hover:shadow-sm shrink-0 ${
                        isSelected ? 'shadow-md scale-[1.03]' : 'opacity-95 hover:opacity-100'
                      }`}
                    >
                      {/* Left Vibrant Accent Dot */}
                      <span
                        style={{ backgroundColor: stripeColor }}
                        className="w-2 h-2 rounded-full shrink-0"
                      />

                      {/* Tag Name */}
                      <span>#{tag}</span>

                      {/* Note Count Badge Pill */}
                      <span
                        style={{
                          backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
                          color: isDarkTheme ? style.darkText : style.text,
                        }}
                        className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                      >
                        {count}
                      </span>

                      {/* Selected Checkmark */}
                      {isSelected && (
                        <span className="text-[11px] font-bold ml-0.5">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {modalFilteredTags.length === 0 && (
                <div className="py-12 text-center text-xs text-[var(--text-muted)] italic">
                  No tags match "{tagSearchQuery}".
                </div>
              )}
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-app)]/40 flex items-center justify-between gap-3 shrink-0">
              {selectedTag ? (
                <div className="flex items-center gap-2">
                  {onDeleteTag && (
                    <button
                      onClick={() => {
                        onDeleteTag(selectedTag);
                        setIsTagsModalOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-[var(--danger-main)]/30 text-[var(--danger-main)] bg-[var(--danger-subtle)] hover:bg-[var(--danger-subtle)]/80 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Tag</span>
                    </button>
                  )}
                  <span className="text-xs text-[var(--text-muted)] truncate max-w-[120px]">
                    #{selectedTag.replace(/^#/, '')}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-[var(--text-muted)]">
                  Tap any tag to view or filter
                </span>
              )}

              <button
                onClick={() => setIsTagsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[var(--accent-main)] text-[var(--accent-contrast)] text-xs font-bold shadow-xs hover:opacity-95 transition-opacity active:scale-95 ml-auto"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
