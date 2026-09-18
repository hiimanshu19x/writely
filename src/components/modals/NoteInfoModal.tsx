'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, Tag as TagIcon, Plus } from 'lucide-react';
import { Note } from '@/types/note';
import { calculateNoteStats } from '@/lib/stats';

interface NoteInfoModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTags?: (tags: string[]) => void;
}

export default function NoteInfoModal({
  note,
  isOpen,
  onClose,
  onUpdateTags,
}: NoteInfoModalProps) {
  const [newTagInput, setNewTagInput] = useState('');

  if (!isOpen || !note) return null;

  const stats = calculateNoteStats(note.plainText || '');

  const createdDate = new Date(note.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const updatedDate = new Date(note.updatedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTagInput.trim().toLowerCase().replace(/^#/, '');
    if (!tag) return;

    const existing = note.tags || [];
    if (!existing.includes(tag)) {
      const updated = [...existing, tag];
      onUpdateTags?.(updated);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = (note.tags || []).filter((t) => t !== tagToRemove);
    onUpdateTags?.(updated);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-[var(--bg-dialog)] border border-[var(--border-strong)] shadow-2xl p-5 text-[var(--text-main)] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--accent-main)]" />
            <h3 className="text-base font-semibold">Note Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <div className="text-xl font-bold font-mono text-[var(--text-main)]">
              {stats.words.toLocaleString()}
            </div>
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
              Words
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <div className="text-xl font-bold font-mono text-[var(--text-main)]">
              {stats.characters.toLocaleString()}
            </div>
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
              Characters
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <div className="text-base font-bold font-mono text-[var(--text-main)]">
              ~{stats.readingTimeMinutes} min
            </div>
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
              Reading time
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <div className="text-base font-bold font-mono text-[var(--text-main)]">
              {stats.paragraphs}
            </div>
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
              Paragraphs
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] mb-4 text-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created</span>
            </div>
            <span className="font-mono text-[11px] text-[var(--text-main)]">
              {createdDate}
            </span>
          </div>

          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Last Modified</span>
            </div>
            <span className="font-mono text-[11px] text-[var(--text-main)]">
              {updatedDate}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-[var(--text-muted)]">
            <TagIcon className="w-3.5 h-3.5" />
            <span>Tags</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {(!note.tags || note.tags.length === 0) && (
              <span className="text-[11px] text-[var(--text-faint)] italic">
                No tags added
              </span>
            )}
            {(note.tags || []).map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-[var(--accent-subtle)] text-[var(--accent-main)] font-medium"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="hover:opacity-75 ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Add Tag Form */}
          <form onSubmit={handleAddTag} className="flex gap-1.5">
            <input
              type="text"
              placeholder="Add a tag..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-main)]"
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 rounded-lg bg-[var(--border-subtle)] hover:bg-[var(--border-strong)] text-xs font-medium text-[var(--text-main)] transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
