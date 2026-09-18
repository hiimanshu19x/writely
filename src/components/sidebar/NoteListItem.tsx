'use client';

import React from 'react';
import { Star, Pin } from 'lucide-react';
import { Note } from '@/types/note';

interface NoteListItemProps {
  note: Note;
  isActive: boolean;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export default function NoteListItem({
  note,
  isActive,
  onSelect,
  onToggleFavorite,
}: NoteListItemProps) {
  // Format timestamp
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return 'Yesterday';
    }

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Plain text snippet
  const snippet = note.plainText
    ? note.plainText.replace(/\n+/g, ' ').slice(0, 75)
    : 'No additional text';

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col gap-1.5 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-150 select-none border ${
        isActive
          ? 'bg-[var(--bg-card-active)] text-[var(--text-main)] shadow-xs border-[var(--border-strong)]/70 pl-4'
          : 'border-transparent hover:border-[var(--border-subtle)]/70 hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:-translate-y-[0.5px]'
      }`}
    >
      {/* Active left indicator accent bar */}
      {isActive && (
        <div className="absolute left-1 top-2.5 bottom-2.5 w-1 bg-[var(--accent-main)] rounded-full shadow-xs" />
      )}

      {/* Title & Pin/Favorite */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-sm font-semibold truncate flex-1 tracking-tight ${
            isActive ? 'text-[var(--text-main)] font-bold' : 'text-[var(--text-main)]/90'
          }`}
        >
          {note.title.trim() || 'Untitled Note'}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {note.pinned && (
            <Pin className="w-3 h-3 text-[var(--accent-main)] fill-[var(--accent-main)]" />
          )}

          <button
            type="button"
            onClick={onToggleFavorite}
            className={`p-1 rounded-md transition-all ${
              note.favorite
                ? 'opacity-100 text-amber-500 animate-star-pop'
                : 'opacity-0 group-hover:opacity-60 hover:opacity-100 text-[var(--text-muted)] hover:bg-[var(--bg-card)]'
            }`}
            title={note.favorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Star
              className={`w-3.5 h-3.5 ${note.favorite ? 'fill-amber-500' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Snippet */}
      <p className="text-xs line-clamp-2 text-[var(--text-muted)] font-normal leading-relaxed">
        {snippet}
      </p>

      {/* Date & Tags */}
      <div className="flex items-center justify-between text-[10px] text-[var(--text-faint)] pt-0.5">
        <span className="font-mono">{formatDate(note.updatedAt || note.createdAt)}</span>

        {note.tags && note.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.2 rounded-md bg-[var(--border-subtle)] text-[var(--text-muted)] font-medium">
              #{note.tags[0]}
            </span>
            {note.tags.length > 1 && (
              <span className="text-[9px] font-mono">+{note.tags.length - 1}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
