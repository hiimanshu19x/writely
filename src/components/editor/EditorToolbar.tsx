'use client';

import React, { useState, useRef, useEffect } from 'react';
import { type Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Link as LinkIcon,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  MoreHorizontal,
  Minus,
  RemoveFormatting,
  Palette,
  Check,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const [showHeadings, setShowHeadings] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const headingsRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headingsRef.current && !headingsRef.current.contains(e.target as Node)) {
        setShowHeadings(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMore(false);
      }
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
      if (linkRef.current && !linkRef.current.contains(e.target as Node)) {
        setLinkInputOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) return null;

  const setLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      let finalUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl) && !/^mailto:/i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }
      editor.chain().focus().setLink({ href: finalUrl }).run();
    }
    setLinkInputOpen(false);
  };

  const openLinkModal = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setLinkInputOpen(true);
  };

  // Color options
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

  return (
    <div className="sticky bottom-4 mx-auto z-30 pointer-events-auto flex items-center justify-center">
      <nav
        aria-label="Text formatting toolbar"
        className="flex items-center gap-0.5 px-2 py-1.5 rounded-full bg-[var(--bg-toolbar)] backdrop-blur-md border border-[var(--border-strong)] shadow-lg shadow-black/5 text-[var(--text-main)] transition-all"
      >
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (⌘Z)"
          aria-label="Undo"
          className="p-1.5 rounded-full hover:bg-[var(--bg-card-hover)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (⌘⇧Z)"
          aria-label="Redo"
          className="p-1.5 rounded-full hover:bg-[var(--bg-card-hover)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-[var(--border-strong)] mx-1" />

        {/* Headings Selector */}
        <div className="relative" ref={headingsRef}>
          <button
            type="button"
            onClick={() => setShowHeadings(!showHeadings)}
            title="Text style"
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
              editor.isActive('heading')
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
                : 'hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <span>
              {editor.isActive('heading', { level: 1 })
                ? 'H1'
                : editor.isActive('heading', { level: 2 })
                ? 'H2'
                : editor.isActive('heading', { level: 3 })
                ? 'H3'
                : 'Body'}
            </span>
          </button>

          {showHeadings && (
            <div className="absolute bottom-full mb-2 left-0 w-36 rounded-xl bg-[var(--bg-dialog)] border border-[var(--border-strong)] shadow-xl p-1 z-50 flex flex-col gap-0.5">
              <button
                onClick={() => {
                  editor.chain().focus().setParagraph().run();
                  setShowHeadings(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs w-full text-left transition-colors ${
                  editor.isActive('paragraph')
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                    : 'hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <Pilcrow className="w-3.5 h-3.5" />
                <span>Paragraph</span>
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                  setShowHeadings(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs w-full text-left transition-colors ${
                  editor.isActive('heading', { level: 1 })
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                    : 'hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <Heading1 className="w-3.5 h-3.5" />
                <span className="font-bold text-sm">Heading 1</span>
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                  setShowHeadings(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs w-full text-left transition-colors ${
                  editor.isActive('heading', { level: 2 })
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                    : 'hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <Heading2 className="w-3.5 h-3.5" />
                <span className="font-semibold">Heading 2</span>
              </button>
              <button
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                  setShowHeadings(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs w-full text-left transition-colors ${
                  editor.isActive('heading', { level: 3 })
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)] font-semibold'
                    : 'hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <Heading3 className="w-3.5 h-3.5" />
                <span>Heading 3</span>
              </button>
            </div>
          )}
        </div>

        <div className="w-[1px] h-4 bg-[var(--border-strong)] mx-1" />

        {/* Inline Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (⌘B)"
          aria-label="Bold"
          className={`p-1.5 rounded-full transition-colors ${
            editor.isActive('bold')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (⌘I)"
          aria-label="Italic"
          className={`p-1.5 rounded-full transition-colors ${
            editor.isActive('italic')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (⌘U)"
          aria-label="Underline"
          className={`p-1.5 rounded-full transition-colors ${
            editor.isActive('underline')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
          aria-label="Strikethrough"
          className={`p-1.5 rounded-full transition-colors ${
            editor.isActive('strike')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-[var(--border-strong)] mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          title="Checklist ([] + space)"
          aria-label="Checklist"
          className={`p-1.5 rounded-full transition-colors ${
            editor.isActive('taskList')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List (- + space)"
          aria-label="Bullet list"
          className={`p-1.5 rounded-full transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List (1. + space)"
          aria-label="Numbered list"
          className={`p-1.5 rounded-full transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote (> + space)"
          aria-label="Quote"
          className={`p-1.5 rounded-full transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-[var(--border-strong)] mx-1" />

        {/* Inline code & Link */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code"
          aria-label="Inline code"
          className={`p-1.5 rounded-full transition-colors ${
            editor.isActive('code')
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Code className="w-4 h-4" />
        </button>

        {/* Link Popover */}
        <div className="relative" ref={linkRef}>
          <button
            type="button"
            onClick={openLinkModal}
            title="Link"
            aria-label="Link"
            className={`p-1.5 rounded-full transition-colors ${
              editor.isActive('link')
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
                : 'hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {linkInputOpen && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 rounded-xl bg-[var(--bg-dialog)] border border-[var(--border-strong)] shadow-xl p-2 z-50">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setLink();
                    } else if (e.key === 'Escape') {
                      setLinkInputOpen(false);
                    }
                  }}
                  autoFocus
                  className="flex-1 text-xs px-2 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-main)] outline-none focus:border-[var(--accent-main)]"
                />
                <button
                  type="button"
                  onClick={setLink}
                  className="px-2 py-1.5 bg-[var(--accent-main)] text-[var(--accent-contrast)] text-xs rounded-md hover:opacity-90 font-semibold"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Text Highlight */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title="Highlight"
          aria-label="Highlight"
          className={`p-1.5 rounded-full transition-colors ${
            editor.isActive('highlight')
              ? 'bg-amber-300 text-amber-900 dark:bg-amber-500/30 dark:text-amber-200'
              : 'hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <Highlighter className="w-4 h-4" />
        </button>

        {/* Text Color Picker */}
        <div className="relative" ref={colorRef}>
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Text color"
            aria-label="Text color"
            className="p-1.5 rounded-full hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            <Palette className="w-4 h-4" />
          </button>

          {showColorPicker && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-xl bg-[var(--bg-dialog)] border border-[var(--border-strong)] shadow-xl p-2 z-50 grid grid-cols-4 gap-1.5 w-36">
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
                    setShowColorPicker(false);
                  }}
                  title={opt.label}
                  className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: opt.color }}
                >
                  {editor.isActive('textStyle', { color: opt.value }) && (
                    <Check className="w-3 h-3 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-[1px] h-4 bg-[var(--border-strong)] mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align left"
          aria-label="Align left"
          className={`p-1.5 rounded-full transition-colors ${
            editor.isActive({ textAlign: 'left' })
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align center"
          aria-label="Align center"
          className={`p-1.5 rounded-full transition-colors ${
            editor.isActive({ textAlign: 'center' })
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align right"
          aria-label="Align right"
          className={`p-1.5 rounded-full transition-colors ${
            editor.isActive({ textAlign: 'right' })
              ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
              : 'hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <AlignRight className="w-4 h-4" />
        </button>

        {/* More formatting popover */}
        <div className="relative" ref={moreRef}>
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            title="More formatting"
            aria-label="More formatting"
            className={`p-1.5 rounded-full transition-colors ${
              showMore
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-main)]'
                : 'hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMore && (
            <div className="absolute bottom-full mb-2 right-0 w-44 rounded-xl bg-[var(--bg-dialog)] border border-[var(--border-strong)] shadow-xl p-1 z-50 flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleCodeBlock().run();
                  setShowMore(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs w-full text-left hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Code Block</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().setHorizontalRule().run();
                  setShowMore(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs w-full text-left hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Divider Line</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetAllMarks().clearNodes().run();
                  setShowMore(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs w-full text-left hover:bg-[var(--bg-card-hover)] text-[var(--danger-main)] transition-colors"
              >
                <RemoveFormatting className="w-3.5 h-3.5" />
                <span>Clear Formatting</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
