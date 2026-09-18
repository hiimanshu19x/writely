'use client';

import React, { useState, useEffect } from 'react';
import { type Editor } from '@tiptap/react';
import {
  X,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Minus,
  RemoveFormatting,
  Palette,
  Check,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';

interface FormattingSidebarProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FormattingSidebar({
  editor,
  isOpen,
  onClose,
}: FormattingSidebarProps) {
  const [linkInput, setLinkInput] = useState('');
  const [showLinkSection, setShowLinkSection] = useState(false);

  // Sync current link if text selected
  useEffect(() => {
    if (editor) {
      const currentLink = editor.getAttributes('link').href || '';
      setLinkInput(currentLink);
    }
  }, [editor]);

  if (!editor) return null;

  const colorOptions = [
    { label: 'Default', value: 'inherit', color: 'var(--text-main)' },
    { label: 'Terracotta', value: '#9C5B2B', color: '#9C5B2B' },
    { label: 'Amber', value: '#D97706', color: '#D97706' },
    { label: 'Forest Green', value: '#16A34A', color: '#16A34A' },
    { label: 'Ocean Blue', value: '#2563EB', color: '#2563EB' },
    { label: 'Plum Purple', value: '#9333EA', color: '#9333EA' },
    { label: 'Crimson', value: '#DC2626', color: '#DC2626' },
    { label: 'Muted Slate', value: '#64748B', color: '#64748B' },
  ];

  const applyLink = () => {
    if (!linkInput.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      let finalUrl = linkInput.trim();
      if (!/^https?:\/\//i.test(finalUrl) && !/^mailto:/i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }
      editor.chain().focus().setLink({ href: finalUrl }).run();
    }
    setShowLinkSection(false);
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setLinkInput('');
    setShowLinkSection(false);
  };

  return (
    <aside
      aria-label="Formatting and styles panel"
      className={`hidden md:flex flex-col h-full bg-[var(--bg-sidebar)] select-none shrink-0 z-20 format-panel-container ${
        isOpen ? 'open' : ''
      }`}
    >
      <div className="format-panel-inner flex flex-col shrink-0">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--accent-main)]" />
            <h2 className="text-sm font-semibold tracking-tight text-[var(--text-main)]">
              Format & Styles
            </h2>
          </div>
          <button
            onClick={onClose}
            title="Close formatting panel"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto p-4 pr-3.5 flex flex-col gap-5">
        {/* Undo / Redo */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] block mb-2">
            History
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] disabled:opacity-35 disabled:pointer-events-none text-xs font-medium text-[var(--text-main)] transition-colors"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] disabled:opacity-35 disabled:pointer-events-none text-xs font-medium text-[var(--text-main)] transition-colors"
            >
              <Redo className="w-3.5 h-3.5" />
              <span>Redo</span>
            </button>
          </div>
        </div>

        {/* Text Structure / Headings */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] block mb-2">
            Text Structure
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                editor.isActive('paragraph')
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
              }`}
            >
              <Pilcrow className="w-3.5 h-3.5 shrink-0" />
              <span>Paragraph</span>
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                editor.isActive('heading', { level: 1 })
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
              }`}
            >
              <Heading1 className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold">Heading 1</span>
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                editor.isActive('heading', { level: 2 })
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
              }`}
            >
              <Heading2 className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold">Heading 2</span>
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                editor.isActive('heading', { level: 3 })
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
              }`}
            >
              <Heading3 className="w-3.5 h-3.5 shrink-0" />
              <span>Heading 3</span>
            </button>
          </div>
        </div>

        {/* Inline Formatting */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] block mb-2">
            Inline Styles
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold (⌘B)"
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                editor.isActive('bold')
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic (⌘I)"
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                editor.isActive('italic')
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Underline (⌘U)"
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                editor.isActive('underline')
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Strikethrough"
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                editor.isActive('strike')
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lists & Task Checklist */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] block mb-2">
            Lists & Blocks
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                editor.isActive('taskList')
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 shrink-0" />
              <span>Checklist</span>
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                editor.isActive('bulletList')
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
              }`}
            >
              <List className="w-3.5 h-3.5 shrink-0" />
              <span>Bullet List</span>
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                editor.isActive('orderedList')
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5 shrink-0" />
              <span>Numbered</span>
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                editor.isActive('blockquote')
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
              }`}
            >
              <Quote className="w-3.5 h-3.5 shrink-0" />
              <span>Quote</span>
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                editor.isActive('code')
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
              }`}
            >
              <Code className="w-3.5 h-3.5 shrink-0" />
              <span>Inline Code</span>
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                editor.isActive('codeBlock')
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]'
              }`}
            >
              <Code className="w-3.5 h-3.5 shrink-0" />
              <span>Code Block</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="w-full mt-1.5 flex items-center justify-center gap-1.5 p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)] transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>Insert Divider Line</span>
          </button>
        </div>

        {/* Link Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] block">
              Hyperlink
            </span>
            <button
              type="button"
              onClick={() => setShowLinkSection(!showLinkSection)}
              className="text-[11px] text-[var(--accent-main)] hover:underline flex items-center gap-1"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showLinkSection ? 'Close' : 'Set link'}</span>
            </button>
          </div>

          {showLinkSection && (
            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col gap-2">
              <input
                type="text"
                placeholder="https://example.com"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyLink();
                  }
                }}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] outline-none focus:border-[var(--accent-main)]"
              />
              <div className="flex items-center justify-end gap-1.5">
                {editor.isActive('link') && (
                  <button
                    type="button"
                    onClick={removeLink}
                    className="px-2 py-1 text-xs text-[var(--danger-main)] hover:underline"
                  >
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  onClick={applyLink}
                  className="px-3 py-1 rounded-lg bg-[var(--accent-main)] text-[var(--accent-contrast)] text-xs font-semibold hover:opacity-90 shadow-2xs transition-opacity"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Highlight & Colors */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] block">
              Color & Highlight
            </span>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs transition-colors ${
                editor.isActive('highlight')
                  ? 'bg-amber-300 text-amber-900 font-medium'
                  : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Highlighter className="w-3 h-3" />
              <span>Highlight</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            {colorOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (opt.value === 'inherit') {
                    editor.chain().focus().unsetColor().run();
                  } else {
                    editor.chain().focus().setColor(opt.value).run();
                  }
                }}
                title={opt.label}
                className="h-7 rounded-lg border border-black/10 flex items-center justify-center transition-transform hover:scale-105"
                style={{ backgroundColor: opt.color }}
              >
                {editor.isActive('textStyle', { color: opt.value }) && (
                  <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Text Alignment */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] block mb-2">
            Alignment
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              title="Align left"
              className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                editor.isActive({ textAlign: 'left' })
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              title="Align center"
              className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                editor.isActive({ textAlign: 'center' })
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              title="Align right"
              className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                editor.isActive({ textAlign: 'right' })
                  ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clear formatting */}
        <div className="pt-2 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs text-[var(--danger-main)] hover:bg-[var(--danger-subtle)] transition-colors"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
            <span>Clear All Formatting</span>
          </button>
        </div>
      </div>
    </div>
  </aside>
);
}
