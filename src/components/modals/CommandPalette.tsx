'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Plus,
  Palette,
  Type,
  Download,
  Upload,
  PanelLeft,
  Trash2,
  Archive,
  FileText,
  Clock,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Note, ThemeId, FontFamilyId } from '@/types/note';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onChangeTheme: (theme: ThemeId) => void;
  onChangeFont: (font: FontFamilyId) => void;
  onOpenExport: () => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onImportDoc: () => void;
  onToggleSidebar: () => void;
  onDeleteCurrentNote: () => void;
  onViewTrash: () => void;
  onViewArchive?: () => void;
  onToggleArchiveNote?: () => void;
  onToggleFormatting?: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  notes,
  onSelectNote,
  onCreateNote,
  onChangeTheme,
  onChangeFont,
  onOpenExport,
  onExportBackup,
  onImportBackup,
  onImportDoc,
  onToggleSidebar,
  onDeleteCurrentNote,
  onViewTrash,
  onViewArchive,
  onToggleArchiveNote,
  onToggleFormatting,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<'main' | 'theme' | 'font'>('main');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setMode('main');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global shortcut: ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open from parent or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Build items list
  const themeItems = [
    { id: 'theme-paper', title: 'Theme: Paper (Warm Editorial)', action: () => onChangeTheme('paper') },
    { id: 'theme-light', title: 'Theme: Light (Clean Studio)', action: () => onChangeTheme('light') },
    { id: 'theme-dark', title: 'Theme: Dark (Carbon Zinc)', action: () => onChangeTheme('dark') },
    { id: 'theme-midnight', title: 'Theme: Midnight (Deep Slate)', action: () => onChangeTheme('midnight') },
    { id: 'theme-nordic', title: 'Theme: Nordic (Icy Slate & Frost)', action: () => onChangeTheme('nordic') },
    { id: 'theme-matcha', title: 'Theme: Matcha (Botanical Sage)', action: () => onChangeTheme('matcha') },
    { id: 'theme-rosewater', title: 'Theme: Rosewater (Cashmere & Blush)', action: () => onChangeTheme('rosewater') },
    { id: 'theme-oled', title: 'Theme: OLED (Pitch True Black)', action: () => onChangeTheme('oled') },
  ];

  const fontItems = [
    { id: 'font-sfpro', title: 'Font: SF Pro (Apple System)', action: () => onChangeFont('sans-sfpro') },
    { id: 'font-inter', title: 'Font: Inter (Clean Sans)', action: () => onChangeFont('sans-inter') },
    { id: 'font-geist', title: 'Font: Geist (Modern Sans)', action: () => onChangeFont('sans-geist') },
    { id: 'font-jakarta', title: 'Font: Plus Jakarta Sans (Contemporary Sans)', action: () => onChangeFont('sans-jakarta') },
    { id: 'font-sourceserif', title: 'Font: Source Serif (Editorial Serif)', action: () => onChangeFont('serif-sourceserif') },
    { id: 'font-georgia', title: 'Font: Georgia (Classic Web Serif)', action: () => onChangeFont('serif-georgia') },
    { id: 'font-newsreader', title: 'Font: Newsreader (Literary Long-form Serif)', action: () => onChangeFont('serif-newsreader') },
    { id: 'font-garamond', title: 'Font: EB Garamond (Classical Renaissance Serif)', action: () => onChangeFont('serif-garamond') },
    { id: 'font-lora', title: 'Font: Lora (Calligraphic Book Serif)', action: () => onChangeFont('serif-lora') },
    { id: 'font-jetbrains', title: 'Font: JetBrains Mono (Code Monospace)', action: () => onChangeFont('mono-jetbrains') },
    { id: 'font-ibmplex', title: 'Font: IBM Plex Mono (Tactile Typewriter Mono)', action: () => onChangeFont('mono-ibmplex') },
  ];

  // Matching notes
  const matchedNotes = useMemo(() => {
    if (!query.trim() || mode !== 'main') return [];
    const q = query.toLowerCase();
    return notes
      .filter((n) => !n.isDeleted)
      .filter((n) => (n.title || '').toLowerCase().includes(q) || (n.plainText || '').toLowerCase().includes(q))
      .slice(0, 5);
  }, [notes, query, mode]);

  // Standard commands
  const mainCommands = useMemo(() => {
    const list = [
      {
        id: 'cmd-new-note',
        title: 'New note',
        icon: Plus,
        shortcut: '⌘N',
        action: () => onCreateNote(),
      },
      {
        id: 'cmd-theme',
        title: 'Change theme...',
        icon: Palette,
        action: () => {
          setMode('theme');
          setSelectedIndex(0);
        },
      },
      {
        id: 'cmd-font',
        title: 'Change font...',
        icon: Type,
        action: () => {
          setMode('font');
          setSelectedIndex(0);
        },
      },
      {
        id: 'cmd-export-note',
        title: 'Export note (.md, .txt, .html, .json)',
        icon: Download,
        action: () => onOpenExport(),
      },
      {
        id: 'cmd-export-backup',
        title: 'Export backup (.json)',
        icon: Download,
        action: () => onExportBackup(),
      },
      {
        id: 'cmd-import-backup',
        title: 'Import backup (.json)',
        icon: Upload,
        action: () => onImportBackup(),
      },
      {
        id: 'cmd-import-doc',
        title: 'Import document (.md, .txt, .html)',
        icon: FileText,
        action: () => onImportDoc(),
      },
      {
        id: 'cmd-toggle-sidebar',
        title: 'Toggle sidebar',
        icon: PanelLeft,
        shortcut: '⌘\\',
        action: () => onToggleSidebar(),
      },
      {
        id: 'cmd-formatting',
        title: 'Toggle formatting panel',
        icon: SlidersHorizontal,
        shortcut: '⌘⇧F',
        action: () => onToggleFormatting?.(),
      },
      {
        id: 'cmd-archive',
        title: 'View Archive',
        icon: Archive,
        action: () => onViewArchive?.(),
      },
      {
        id: 'cmd-toggle-archive',
        title: 'Archive / Unarchive current note',
        icon: Archive,
        action: () => onToggleArchiveNote?.(),
      },
      {
        id: 'cmd-trash',
        title: 'View Trash',
        icon: Trash2,
        action: () => onViewTrash(),
      },
      {
        id: 'cmd-delete-note',
        title: 'Delete current note',
        icon: Trash2,
        action: () => onDeleteCurrentNote(),
      },
    ];

    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((item) => item.title.toLowerCase().includes(q));
  }, [
    query,
    onCreateNote,
    onOpenExport,
    onExportBackup,
    onImportBackup,
    onImportDoc,
    onToggleSidebar,
    onViewTrash,
    onViewArchive,
    onToggleArchiveNote,
    onDeleteCurrentNote,
  ]);

  // Combine items for keyboard navigation
  const currentNavItems = useMemo(() => {
    if (mode === 'theme') {
      const q = query.toLowerCase();
      return themeItems.filter((i) => !q || i.title.toLowerCase().includes(q));
    }
    if (mode === 'font') {
      const q = query.toLowerCase();
      return fontItems.filter((i) => !q || i.title.toLowerCase().includes(q));
    }
    // Mode main: notes + commands
    const noteItems = matchedNotes.map((n) => ({
      id: `note-${n.id}`,
      title: n.title || 'Untitled Note',
      snippet: n.plainText ? n.plainText.slice(0, 60) : '',
      icon: FileText,
      isNote: true,
      action: () => onSelectNote(n.id),
    }));
    return [...noteItems, ...mainCommands];
  }, [mode, query, matchedNotes, mainCommands]);

  // Keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, currentNavItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + currentNavItems.length) % Math.max(1, currentNavItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentNavItems[selectedIndex]) {
        currentNavItems[selectedIndex].action();
        if (mode !== 'main') {
          onClose();
        } else if (!('action' in currentNavItems[selectedIndex] && currentNavItems[selectedIndex].id.startsWith('cmd-theme') || currentNavItems[selectedIndex].id.startsWith('cmd-font'))) {
          onClose();
        }
      }
    } else if (e.key === 'Backspace' && !query && mode !== 'main') {
      setMode('main');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-[var(--bg-dialog)] border border-[var(--border-strong)] shadow-2xl overflow-hidden text-[var(--text-main)] transition-all flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-subtle)]">
          <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          {mode !== 'main' && (
            <button
              onClick={() => setMode('main')}
              className="text-[11px] px-2 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent-main)] font-medium flex items-center gap-1"
            >
              <span>← Back</span>
            </button>
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === 'theme'
                ? 'Select a theme...'
                : mode === 'font'
                ? 'Select a typography family...'
                : 'Search notes or run commands...'
            }
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-[var(--text-faint)] text-[var(--text-main)]"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)]">
            ESC
          </kbd>
        </div>

        {/* Results / Commands List */}
        <div className="max-h-[340px] overflow-y-auto p-2 flex flex-col gap-0.5">
          {currentNavItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              No matching notes or commands found.
            </div>
          ) : (
            currentNavItems.map((item: any, idx: number) => {
              const Icon = item.icon || ArrowRight;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    if (mode === 'main' && (item.id === 'cmd-theme' || item.id === 'cmd-font')) {
                      // stays open in submenu
                    } else {
                      onClose();
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs w-full text-left transition-colors ${
                    isSelected
                      ? 'bg-[var(--bg-card-active)] text-[var(--text-main)] font-medium'
                      : 'hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Icon className="w-4 h-4 shrink-0 opacity-70" />
                    <div className="min-w-0 flex-1 truncate">
                      <span className="truncate">{item.title}</span>
                      {item.snippet && (
                        <p className="text-[11px] text-[var(--text-faint)] truncate font-normal">
                          {item.snippet}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.shortcut && (
                    <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--border-subtle)] text-[var(--text-muted)] shrink-0 ml-2">
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[var(--bg-sidebar)] border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-faint)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Writely Local-First</span>
        </div>
      </div>
    </div>
  );
}
