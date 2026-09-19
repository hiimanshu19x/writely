'use client';

import React from 'react';
import {
  Star,
  Download,
  Trash2,
  Archive,
  Info,
  PanelLeftClose,
  PanelLeft,
  Check,
  RotateCw,
  SlidersHorizontal,
} from 'lucide-react';
import { Note } from '@/types/note';

interface EditorHeaderProps {
  note: Note;
  autosaveStatus: 'saving' | 'saved' | 'idle';
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onToggleFavorite: () => void;
  onToggleArchive?: () => void;
  onOpenExport: () => void;
  onOpenInfo: () => void;
  onDeleteNote: () => void;
  isMobile?: boolean;
  onBackToMobileList?: () => void;
  isFormattingOpen?: boolean;
  onToggleFormatting?: () => void;
}

export default function EditorHeader({
  note,
  autosaveStatus,
  sidebarOpen,
  onToggleSidebar,
  onToggleFavorite,
  onToggleArchive,
  onOpenExport,
  onOpenInfo,
  onDeleteNote,
  isMobile,
  onBackToMobileList,
  isFormattingOpen,
  onToggleFormatting,
}: EditorHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/80 backdrop-blur-sm sticky top-0 z-20">
      {/* Left controls */}
      <div className="flex items-center gap-2">
        {isMobile ? (
          <button
            onClick={onBackToMobileList}
            className="flex items-center gap-1 text-sm font-medium text-[var(--accent-main)] hover:opacity-80 transition-opacity px-2 py-1 -ml-2 rounded-md"
            aria-label="Back to notes list"
          >
            <span className="text-lg leading-none">‹</span>
            <span>Notes</span>
          </button>
        ) : !sidebarOpen ? (
          <button
            onClick={onToggleSidebar}
            title="Show sidebar (⌘\)"
            className="p-1.5 rounded-md hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            aria-label="Open sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        ) : null}

        {/* Autosave badge */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] select-none pl-2 border-l border-[var(--border-subtle)]">
          {autosaveStatus === 'saving' ? (
            <>
              <RotateCw className="w-3 h-3 animate-spin text-[var(--accent-main)]" />
              <span className="italic">Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5] animate-check-pop" />
              <span className="opacity-90 font-medium">Saved locally</span>
            </>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5">
        {/* Toggle Formatting Sidebar (Web only) */}
        {!isMobile && onToggleFormatting && (
          <button
            onClick={onToggleFormatting}
            title={isFormattingOpen ? 'Close format panel (⌘⇧F)' : 'Open format panel (⌘⇧F)'}
            className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
              isFormattingOpen
                ? 'bg-[var(--accent-subtle)] text-[var(--text-main)] border border-[var(--accent-main)]/50 shadow-xs ring-2 ring-[var(--accent-main)]/20'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] bg-[var(--bg-card)]/40'
            }`}
            aria-label="Toggle formatting panel"
          >
            <SlidersHorizontal
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isFormattingOpen
                  ? 'rotate-90 text-[var(--accent-main)]'
                  : 'group-hover:rotate-45'
              }`}
            />
            <span>Format</span>
            {isFormattingOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-main)] ml-0.5 animate-pulse-subtle" />
            )}
          </button>
        )}

        {/* Favorite toggle */}
        <button
          onClick={onToggleFavorite}
          title={note.favorite ? 'Unmark favorite' : 'Mark as favorite'}
          className={`p-1.5 rounded-lg transition-all active:scale-90 ${
            note.favorite
              ? 'text-amber-500 hover:text-amber-600 bg-amber-500/10'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
          }`}
          aria-label="Favorite note"
        >
          <Star
            className={`w-4 h-4 transition-transform ${
              note.favorite ? 'fill-amber-500 animate-star-pop' : ''
            }`}
          />
        </button>

        {/* Note info / word count */}
        <button
          onClick={onOpenInfo}
          title="Note statistics & info"
          className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors"
          aria-label="Note info"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Export button */}
        <button
          onClick={onOpenExport}
          title="Export note"
          className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors"
          aria-label="Export note"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Archive toggle */}
        {onToggleArchive && (
          <button
            onClick={onToggleArchive}
            title={note.isArchived ? 'Unarchive note' : 'Archive note'}
            className={`p-1.5 rounded-md transition-all active:scale-90 ${
              note.isArchived
                ? 'text-[var(--accent-main)] hover:opacity-80 bg-[var(--accent-subtle)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
            }`}
            aria-label={note.isArchived ? 'Unarchive note' : 'Archive note'}
          >
            <Archive className="w-4 h-4" />
          </button>
        )}

        {/* Delete note */}
        <button
          onClick={onDeleteNote}
          title={note.isDeleted ? 'Delete permanently' : 'Move to trash'}
          className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--danger-main)] hover:bg-[var(--danger-subtle)] transition-colors"
          aria-label="Delete note"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
