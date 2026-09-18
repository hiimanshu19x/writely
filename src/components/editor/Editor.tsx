'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';

import { Note } from '@/types/note';
import { extractPlainText } from '@/lib/db';
import FormattingSidebar from './FormattingSidebar';
import MobileToolbar from './MobileToolbar';

interface EditorProps {
  note: Note;
  onSaveNote: (updated: Partial<Note>) => void;
  setAutosaveStatus: (status: 'saving' | 'saved' | 'idle') => void;
  isFormattingOpen: boolean;
  onCloseFormatting: () => void;
}

export default function Editor({
  note,
  onSaveNote,
  setAutosaveStatus,
  isFormattingOpen,
  onCloseFormatting,
}: EditorProps) {
  // Local state for title to ensure instant, zero-latency typing
  const [localTitle, setLocalTitle] = useState(note.title || '');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const titleDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const contentDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const isInternalChangeRef = useRef(false);

  // Sync local title when switching notes
  useEffect(() => {
    setLocalTitle(note.title || '');
    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current);
      titleDebounceRef.current = null;
    }
  }, [note.id]);

  // Debounced auto-save function for editor content
  const triggerDebouncedContentSave = useCallback(
    (newContent: any) => {
      setAutosaveStatus('saving');
      if (contentDebounceRef.current) {
        clearTimeout(contentDebounceRef.current);
      }
      contentDebounceRef.current = setTimeout(() => {
        const plainText = extractPlainText(newContent);
        onSaveNote({
          content: newContent,
          plainText,
          updatedAt: Date.now(),
        });
        setAutosaveStatus('saved');
      }, 400); // 400ms debounce for content
    },
    [onSaveNote, setAutosaveStatus]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: {
            class:
              'underline decoration-[var(--border-strong)] hover:decoration-[var(--accent-main)] cursor-pointer transition-colors',
          },
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your thoughts...',
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: note.content || '',
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-[500px] text-base leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      isInternalChangeRef.current = true;
      const json = editor.getJSON();
      triggerDebouncedContentSave(json);
    },
    immediatelyRender: false,
  });

  // Keep editor content in sync when a different note is selected
  useEffect(() => {
    if (!editor) return;

    // Only update editor if external note change occurred (switching note)
    if (!isInternalChangeRef.current) {
      const incomingContent = note.content || { type: 'doc', content: [] };
      editor.commands.setContent(incomingContent, { emitUpdate: false });
    }
    isInternalChangeRef.current = false;
  }, [note.id, editor]);

  // Handle title edit with instant local update and debounced save
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    setAutosaveStatus('saving');

    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current);
    }
    titleDebounceRef.current = setTimeout(() => {
      onSaveNote({
        title: newTitle,
        updatedAt: Date.now(),
      });
      setAutosaveStatus('saved');
    }, 300);
  };

  // Immediate save on title blur
  const handleTitleBlur = () => {
    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current);
      titleDebounceRef.current = null;
    }
    if (localTitle !== note.title) {
      onSaveNote({
        title: localTitle,
        updatedAt: Date.now(),
      });
      setAutosaveStatus('saved');
    }
  };

  // Keyboard shortcut: pressing Enter in title jumps to editor
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editor?.chain().focus('start').run();
    }
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden relative bg-[var(--bg-editor)]">
      {/* Editor Content Canvas (Scrollable) */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="flex-1 flex flex-col px-6 md:px-12 pt-8 pb-32 max-w-[760px] w-full mx-auto">
          {/* Note Title Input */}
          <input
            ref={titleInputRef}
            type="text"
            value={localTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            placeholder="Untitled"
            className="w-full text-3xl md:text-4xl font-bold tracking-tight bg-transparent border-none outline-none text-[var(--text-main)] placeholder:text-[var(--text-faint)] mb-6 transition-colors"
            style={{ fontFamily: 'inherit' }}
          />

          {/* Tiptap Rich Text Content Area */}
          <div className="tiptap-container flex-1">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Web Formatting Sidebar Panel (Opened by click on Format button) */}
      <FormattingSidebar
        editor={editor}
        isOpen={isFormattingOpen}
        onClose={onCloseFormatting}
      />

      {/* Mobile Sticky Toolbar */}
      <div className="md:hidden">
        <MobileToolbar editor={editor} />
      </div>
    </div>
  );
}
