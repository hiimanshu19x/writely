'use client';

import React from 'react';
import { type Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Code,
  Highlighter,
  Undo,
  Redo,
} from 'lucide-react';

interface MobileToolbarProps {
  editor: Editor | null;
}

export default function MobileToolbar({ editor }: MobileToolbarProps) {
  if (!editor) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-toolbar)] backdrop-blur-lg border-t border-[var(--border-subtle)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1 px-2">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          aria-label="Undo"
          className="min-w-[44px] h-[44px] flex items-center justify-center rounded-lg text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] disabled:opacity-30 active:scale-95 transition-all"
        >
          <Undo className="w-5 h-5" />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          aria-label="Redo"
          className="min-w-[44px] h-[44px] flex items-center justify-center rounded-lg text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] disabled:opacity-30 active:scale-95 transition-all"
        >
          <Redo className="w-5 h-5" />
        </button>

        <div className="w-[1px] h-6 bg-[var(--border-subtle)] mx-0.5 shrink-0" />

        {/* Heading */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading"
          className={`min-w-[44px] h-[44px] flex items-center justify-center rounded-lg text-sm font-bold transition-all active:scale-95 ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Heading2 className="w-5 h-5" />
        </button>

        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
          className={`min-w-[44px] h-[44px] flex items-center justify-center rounded-lg transition-all active:scale-95 ${
            editor.isActive('bold')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Bold className="w-5 h-5" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
          className={`min-w-[44px] h-[44px] flex items-center justify-center rounded-lg transition-all active:scale-95 ${
            editor.isActive('italic')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Italic className="w-5 h-5" />
        </button>

        {/* Strike */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Strikethrough"
          className={`min-w-[44px] h-[44px] flex items-center justify-center rounded-lg transition-all active:scale-95 ${
            editor.isActive('strike')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Strikethrough className="w-5 h-5" />
        </button>

        <div className="w-[1px] h-6 bg-[var(--border-subtle)] mx-0.5 shrink-0" />

        {/* Checklist */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          aria-label="Checklist"
          className={`min-w-[44px] h-[44px] flex items-center justify-center rounded-lg transition-all active:scale-95 ${
            editor.isActive('taskList')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
        </button>

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet list"
          className={`min-w-[44px] h-[44px] flex items-center justify-center rounded-lg transition-all active:scale-95 ${
            editor.isActive('bulletList')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <List className="w-5 h-5" />
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Numbered list"
          className={`min-w-[44px] h-[44px] flex items-center justify-center rounded-lg transition-all active:scale-95 ${
            editor.isActive('orderedList')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <ListOrdered className="w-5 h-5" />
        </button>

        {/* Quote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Quote"
          className={`min-w-[44px] h-[44px] flex items-center justify-center rounded-lg transition-all active:scale-95 ${
            editor.isActive('blockquote')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Quote className="w-5 h-5" />
        </button>

        {/* Inline code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          aria-label="Code"
          className={`min-w-[44px] h-[44px] flex items-center justify-center rounded-lg transition-all active:scale-95 ${
            editor.isActive('code')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Code className="w-5 h-5" />
        </button>

        {/* Highlight */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          aria-label="Highlight"
          className={`min-w-[44px] h-[44px] flex items-center justify-center rounded-lg transition-all active:scale-95 ${
            editor.isActive('highlight')
              ? 'bg-amber-300 text-amber-900'
              : 'text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Highlighter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
