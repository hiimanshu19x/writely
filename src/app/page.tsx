'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db, initializeDatabase } from '@/lib/db';
import { Note, ThemeId, FontFamilyId, FontSizeId, NoteFilter } from '@/types/note';
import {
  getStoredTheme,
  setStoredTheme,
  getStoredFont,
  setStoredFont,
  getStoredFontSize,
  setStoredFontSize,
  getStoredSidebarOpen,
  setStoredSidebarOpen,
  getStoredLastNoteId,
  setStoredLastNoteId,
  enablePersistentStorage,
} from '@/lib/storage';
import Sidebar from '@/components/sidebar/Sidebar';
import MobileHomeScreen from '@/components/mobile/MobileHomeScreen';
import Editor from '@/components/editor/Editor';
import EditorHeader from '@/components/editor/EditorHeader';
import CommandPalette from '@/components/modals/CommandPalette';
import ExportModal from '@/components/modals/ExportModal';
import NoteInfoModal from '@/components/modals/NoteInfoModal';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import SettingsModal from '@/components/modals/SettingsModal';
import AppSplashScreen from '@/components/AppSplashScreen';
import { exportFullBackup } from '@/lib/backup';
import { Plus, BookOpen, Sparkles } from 'lucide-react';

export default function WritelyApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<NoteFilter>('all');
  const [autosaveStatus, setAutosaveStatus] = useState<'saving' | 'saved' | 'idle'>('saved');
  const [isLoaded, setIsLoaded] = useState(false);

  // Responsive mobile view: 'home' | 'editor'
  const [mobileView, setMobileView] = useState<'home' | 'editor'>('home');
  const [isMobile, setIsMobile] = useState(false);

  // Sidebar open / closed state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Web formatting side panel state (toggleable by click)
  const [isFormattingOpen, setIsFormattingOpen] = useState(false);

  // Preferences
  const [theme, setTheme] = useState<ThemeId>('paper');
  const [font, setFont] = useState<FontFamilyId>('serif-sourceserif');
  const [fontSize, setFontSize] = useState<FontSizeId>('base');

  // Modals state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    isOpen: boolean;
    mode: 'trash' | 'permanent' | 'emptyTrash';
    noteId?: string;
    noteTitle?: string;
    count?: number;
  }>({
    isOpen: false,
    mode: 'trash',
  });

  // Responsive screen detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize DB and load initial notes & preferences
  const reloadNotes = useCallback(async () => {
    try {
      const all = await db.notes.toArray();
      setNotes(all);
      return all;
    } catch (err) {
      console.error('Failed to load notes from Dexie:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    async function setup() {
      // Load saved preferences
      const savedTheme = getStoredTheme();
      const savedFont = getStoredFont();
      const savedFontSize = getStoredFontSize();
      const savedSidebar = getStoredSidebarOpen();
      const lastNoteId = getStoredLastNoteId();

      setTheme(savedTheme);
      setFont(savedFont);
      setFontSize(savedFontSize);
      setSidebarOpen(savedSidebar);

      // Seed database if empty
      await initializeDatabase();
      const all = await reloadNotes();

      // Request browser persistent storage to prevent eviction
      enablePersistentStorage().catch(() => {});

      // Pick active note: last opened note or first available note
      if (all.length > 0) {
        const found = all.find((n) => n.id === lastNoteId && !n.isDeleted);
        const activeOne = found || all.find((n) => !n.isDeleted) || all[0];
        setActiveNoteId(activeOne.id);
      }
      setIsLoaded(true);
    }
    setup();
  }, [reloadNotes]);

  // Active note object
  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  // Change active note
  const handleSelectNote = useCallback((id: string) => {
    setActiveNoteId(id);
    setStoredLastNoteId(id);
    if (isMobile) {
      setMobileView('editor');
    }
  }, [isMobile]);

  // Create new note
  const handleCreateNote = useCallback(async () => {
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: '',
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
      plainText: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      favorite: false,
      isDeleted: false,
      deletedAt: null,
      tags: [],
    };

    try {
      await db.notes.put(newNote);
      await reloadNotes();
      setActiveNoteId(newNote.id);
      setStoredLastNoteId(newNote.id);
      setCurrentFilter('all');
      if (isMobile) {
        setMobileView('editor');
      }
    } catch (err) {
      console.error('Failed to create new note:', err);
    }
  }, [reloadNotes, isMobile]);

  // Debounced or direct note update
  const handleSaveNote = useCallback(
    async (updatedFields: Partial<Note>) => {
      if (!activeNoteId) return;

      try {
        await db.notes.update(activeNoteId, updatedFields);
        // Update local state smoothly
        setNotes((prev) =>
          prev.map((n) => (n.id === activeNoteId ? { ...n, ...updatedFields } : n))
        );
      } catch (err) {
        console.error('Failed to save note:', err);
      }
    },
    [activeNoteId]
  );

  // Toggle favorite
  const handleToggleFavorite = useCallback(
    async (id: string) => {
      const note = notes.find((n) => n.id === id);
      if (!note) return;
      const nextFav = !note.favorite;
      await db.notes.update(id, { favorite: nextFav });
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, favorite: nextFav } : n))
      );
    },
    [notes]
  );

  // Move note to trash
  const handleMoveToTrash = useCallback(
    async (id: string) => {
      await db.notes.update(id, {
        isDeleted: true,
        deletedAt: Date.now(),
      });
      const updated = await reloadNotes();

      // If active note was trashed, pick the next non-deleted note
      if (activeNoteId === id) {
        const nextActive = updated.find((n) => !n.isDeleted);
        setActiveNoteId(nextActive ? nextActive.id : null);
        if (isMobile) {
          setMobileView('home');
        }
      }
    },
    [activeNoteId, reloadNotes, isMobile]
  );

  // Restore note from trash
  const handleRestoreNote = useCallback(
    async (id: string) => {
      await db.notes.update(id, {
        isDeleted: false,
        deletedAt: null,
      });
      await reloadNotes();
      setActiveNoteId(id);
    },
    [reloadNotes]
  );

  // Permanently delete note
  const handlePermanentlyDelete = useCallback(
    async (id: string) => {
      await db.notes.delete(id);
      const updated = await reloadNotes();
      if (activeNoteId === id) {
        const nextActive = updated.find((n) => n.isDeleted) || updated[0];
        setActiveNoteId(nextActive ? nextActive.id : null);
      }
    },
    [activeNoteId, reloadNotes]
  );

  // Empty trash
  const handleEmptyTrash = useCallback(async () => {
    const trashed = notes.filter((n) => n.isDeleted);
    await Promise.all(trashed.map((n) => db.notes.delete(n.id)));
    const updated = await reloadNotes();
    const nextActive = updated.find((n) => !n.isDeleted);
    setActiveNoteId(nextActive ? nextActive.id : null);
  }, [notes, reloadNotes]);

  // Toggle sidebar
  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      const nextVal = !prev;
      setStoredSidebarOpen(nextVal);
      return nextVal;
    });
  }, []);

  // Change theme
  const handleChangeTheme = useCallback((newTheme: ThemeId) => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
  }, []);

  // Change font
  const handleChangeFont = useCallback((newFont: FontFamilyId) => {
    setFont(newFont);
    setStoredFont(newFont);
  }, []);

  // Change font size
  const handleChangeFontSize = useCallback((newSize: FontSizeId) => {
    setFontSize(newSize);
    setStoredFontSize(newSize);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘N or Ctrl+N: New note
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleCreateNote();
      }
      // ⌘\ or Ctrl+\: Toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        handleToggleSidebar();
      }
      // ⌘K or Ctrl+K: Command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      // ⌘⇧F or Ctrl+Shift+F: Toggle formatting panel
      if ((e.metaKey || e.ctrlKey) && (e.altKey || e.shiftKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsFormattingOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCreateNote, handleToggleSidebar]);

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[var(--bg-app)] text-[var(--text-muted)] text-sm">
        <div className="flex items-center gap-2 font-serif italic animate-pulse">
          <span>Loading your thoughts...</span>
        </div>
      </div>
    );
  }

  // Active trash count
  const trashCount = notes.filter((n) => n.isDeleted).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-app)] text-[var(--text-main)]">
      {/* APP OPENING LAUNCH ANIMATION */}
      <AppSplashScreen currentTheme={theme} />

      {/* MOBILE HOME SCREEN (DEDICATED DASHBOARD) */}
      {isMobile && mobileView === 'home' && (
        <div className="w-full h-full">
          <MobileHomeScreen
            notes={notes}
            activeNoteId={activeNoteId}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
            onToggleFavorite={handleToggleFavorite}
            onDeleteNote={handleMoveToTrash}
            currentFilter={currentFilter}
            onChangeFilter={setCurrentFilter}
            currentTheme={theme}
            onChangeTheme={handleChangeTheme}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenStats={() => setIsInfoOpen(true)}
            onOpenEditor={() => setMobileView('editor')}
          />
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <div
          className={`${
            sidebarOpen ? 'w-72 lg:w-80 h-full' : 'hidden'
          } shrink-0 transition-all duration-200`}
        >
          <Sidebar
            notes={notes}
            activeNoteId={activeNoteId}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
            onToggleFavorite={handleToggleFavorite}
            currentFilter={currentFilter}
            onChangeFilter={setCurrentFilter}
            currentTheme={theme}
            onChangeTheme={handleChangeTheme}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onToggleCollapse={handleToggleSidebar}
          />
        </div>
      )}

      {/* MAIN WRITING CANVAS */}
      {(!isMobile || mobileView === 'editor') && (
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {activeNote ? (
            <>
              {/* If note is in Trash, show prominent restore banner */}
              {activeNote.isDeleted && (
                <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs flex items-center justify-between text-amber-800 dark:text-amber-200">
                  <span>This note is currently in Trash.</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestoreNote(activeNote.id)}
                      className="font-medium underline hover:opacity-80"
                    >
                      Restore note
                    </button>
                    <span>&bull;</span>
                    <button
                      onClick={() =>
                        setDeleteModalConfig({
                          isOpen: true,
                          mode: 'permanent',
                          noteId: activeNote.id,
                          noteTitle: activeNote.title,
                        })
                      }
                      className="font-medium text-[var(--danger-main)] hover:underline"
                    >
                      Delete forever
                    </button>
                  </div>
                </div>
              )}

              {/* Editor Header */}
              <EditorHeader
                note={activeNote}
                autosaveStatus={autosaveStatus}
                sidebarOpen={sidebarOpen}
                onToggleSidebar={handleToggleSidebar}
                onToggleFavorite={() => handleToggleFavorite(activeNote.id)}
                onOpenExport={() => setIsExportOpen(true)}
                onOpenInfo={() => setIsInfoOpen(true)}
                onDeleteNote={() => {
                  if (activeNote.isDeleted) {
                    setDeleteModalConfig({
                      isOpen: true,
                      mode: 'permanent',
                      noteId: activeNote.id,
                      noteTitle: activeNote.title,
                    });
                  } else {
                    setDeleteModalConfig({
                      isOpen: true,
                      mode: 'trash',
                      noteId: activeNote.id,
                      noteTitle: activeNote.title,
                    });
                  }
                }}
                isMobile={isMobile}
                onBackToMobileList={() => setMobileView('home')}
                isFormattingOpen={isFormattingOpen}
                onToggleFormatting={() => setIsFormattingOpen((prev) => !prev)}
              />

              {/* Main Tiptap Writing Editor */}
              <Editor
                key={activeNote.id}
                note={activeNote}
                onSaveNote={handleSaveNote}
                setAutosaveStatus={setAutosaveStatus}
                isFormattingOpen={isFormattingOpen}
                onCloseFormatting={() => setIsFormattingOpen(false)}
              />
            </>
          ) : (
            /* Clean Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-strong)] flex items-center justify-center text-[var(--accent-main)] mb-4 shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[var(--text-main)] mb-1 tracking-tight">
                Nothing here yet.
              </h2>
              <p className="text-sm text-[var(--text-muted)] max-w-sm mb-6">
                Create a note and start writing. Your words are autosaved locally and 100% private.
              </p>
              <button
                onClick={handleCreateNote}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-main)] hover:bg-[var(--accent-hover)] text-[var(--accent-contrast)] font-semibold text-xs shadow-sm transition-all active:scale-[0.98] ring-1 ring-black/10 dark:ring-white/10"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New note</span>
              </button>
            </div>
          )}
        </main>
      )}

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        notes={notes}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onChangeTheme={handleChangeTheme}
        onChangeFont={handleChangeFont}
        onOpenExport={() => setIsExportOpen(true)}
        onExportBackup={exportFullBackup}
        onImportBackup={() => setIsSettingsOpen(true)}
        onImportDoc={() => setIsSettingsOpen(true)}
        onToggleSidebar={handleToggleSidebar}
        onDeleteCurrentNote={() => {
          if (activeNote) {
            setDeleteModalConfig({
              isOpen: true,
              mode: activeNote.isDeleted ? 'permanent' : 'trash',
              noteId: activeNote.id,
              noteTitle: activeNote.title,
            });
          }
        }}
        onViewTrash={() => setCurrentFilter('trash')}
        onToggleFormatting={() => setIsFormattingOpen((prev) => !prev)}
      />

      {/* Export Modal */}
      <ExportModal
        note={activeNote}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Note Info & Word Count Modal */}
      <NoteInfoModal
        note={activeNote}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        onUpdateTags={(tags) => handleSaveNote({ tags })}
      />

      {/* Delete / Trash Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalConfig.isOpen}
        mode={deleteModalConfig.mode}
        noteTitle={deleteModalConfig.noteTitle}
        count={deleteModalConfig.count}
        onClose={() => setDeleteModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (deleteModalConfig.mode === 'trash' && deleteModalConfig.noteId) {
            handleMoveToTrash(deleteModalConfig.noteId);
          } else if (deleteModalConfig.mode === 'permanent' && deleteModalConfig.noteId) {
            handlePermanentlyDelete(deleteModalConfig.noteId);
          } else if (deleteModalConfig.mode === 'emptyTrash') {
            handleEmptyTrash();
          }
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={theme}
        onChangeTheme={handleChangeTheme}
        currentFont={font}
        onChangeFont={handleChangeFont}
        currentFontSize={fontSize}
        onChangeFontSize={handleChangeFontSize}
        onRefreshNotes={reloadNotes}
      />
    </div>
  );
}
