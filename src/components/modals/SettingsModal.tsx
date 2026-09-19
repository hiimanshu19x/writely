'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Palette,
  Type,
  Database,
  Upload,
  Download,
  FileText,
  Keyboard,
  ShieldCheck,
  Smartphone,
  Check,
  AlertCircle,
} from 'lucide-react';
import { ThemeId, FontFamilyId, FontSizeId } from '@/types/note';
import { exportFullBackup, importBackupJson } from '@/lib/backup';
import { markdownToTiptapJson } from '@/lib/markdown';
import { db } from '@/lib/db';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
  currentFont: FontFamilyId;
  onChangeFont: (font: FontFamilyId) => void;
  currentFontSize: FontSizeId;
  onChangeFontSize: (size: FontSizeId) => void;
  onRefreshNotes: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  currentTheme,
  onChangeTheme,
  currentFont,
  onChangeFont,
  currentFontSize,
  onChangeFontSize,
  onRefreshNotes,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'backup' | 'shortcuts' | 'about'>('general');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  const backupFileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).deferredInstallPrompt) {
      setCanInstallPwa(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const themes: { id: ThemeId; name: string; desc: string; color: string }[] = [
    { id: 'paper', name: 'Paper', desc: 'Warm editorial cream', color: '#FAF6EE' },
    { id: 'light', name: 'Light', desc: 'Clean studio neutral', color: '#FFFFFF' },
    { id: 'dark', name: 'Dark', desc: 'Deep zinc carbon', color: '#18181B' },
    { id: 'midnight', name: 'Midnight', desc: 'Sophisticated deep slate', color: '#0B0F19' },
    { id: 'nordic', name: 'Nordic', desc: 'Frost arctic blue', color: '#2E3440' },
    { id: 'matcha', name: 'Matcha', desc: 'Japanese botanical sage', color: '#ECF1EC' },
    { id: 'rosewater', name: 'Rosewater', desc: 'Cashmere dusk blush', color: '#F3EBEB' },
    { id: 'oled', name: 'OLED', desc: 'Pitch true black', color: '#000000' },
  ];

  const fonts: { id: FontFamilyId; name: string; category: string; preview: string; fontStyle: string }[] = [
    { id: 'sans-sfpro', name: 'SF Pro', category: 'Apple System', preview: 'Distraction-free clarity', fontStyle: 'var(--font-sf-pro)' },
    { id: 'sans-inter', name: 'Inter', category: 'Clean Sans', preview: 'Modern interface readability', fontStyle: 'var(--font-inter), sans-serif' },
    { id: 'sans-geist', name: 'Geist', category: 'Modern Sans', preview: 'Engineered for precision', fontStyle: 'var(--font-geist), sans-serif' },
    { id: 'sans-jakarta', name: 'Plus Jakarta Sans', category: 'Contemporary Sans', preview: 'Geometric editorial aesthetic', fontStyle: 'var(--font-plus-jakarta), sans-serif' },
    { id: 'serif-sourceserif', name: 'Source Serif', category: 'Editorial Serif', preview: 'Classic publication typography', fontStyle: 'var(--font-source-serif), serif' },
    { id: 'serif-georgia', name: 'Georgia', category: 'Traditional Serif', preview: 'Timeless journalism serif', fontStyle: 'Georgia, serif' },
    { id: 'serif-newsreader', name: 'Newsreader', category: 'Literary Serif', preview: 'Crafted for long-form reading', fontStyle: 'var(--font-newsreader), serif' },
    { id: 'serif-garamond', name: 'EB Garamond', category: 'Humanist Serif', preview: 'Timeless Renaissance publishing', fontStyle: 'var(--font-eb-garamond), serif' },
    { id: 'serif-lora', name: 'Lora', category: 'Contemporary Book', preview: 'Warm calligraphic curves', fontStyle: 'var(--font-lora), serif' },
    { id: 'mono-jetbrains', name: 'JetBrains Mono', category: 'Code Monospace', preview: 'Crisp developer legibility', fontStyle: 'var(--font-jetbrains-mono), monospace' },
    { id: 'mono-ibmplex', name: 'IBM Plex Mono', category: 'Typewriter Mono', preview: 'Aesthetic tactile notes', fontStyle: 'var(--font-ibm-plex-mono), monospace' },
  ];

  const fontSizes: { id: FontSizeId; label: string; size: string; preview: string }[] = [
    { id: 'sm', label: 'Compact', size: '14px', preview: 'A' },
    { id: 'base', label: 'Default', size: '17px', preview: 'A' },
    { id: 'lg', label: 'Comfortable', size: '21px', preview: 'A' },
  ];

  // Handle backup JSON file import
  const handleBackupFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = await importBackupJson(text);
      if (res.success) {
        setImportStatus({
          type: 'success',
          message: `Successfully restored ${res.totalImported} notes${
            res.duplicatesReassigned > 0
              ? ` (${res.duplicatesReassigned} duplicates safely reassigned)`
              : ''
          }.`,
        });
        onRefreshNotes();
      } else {
        setImportStatus({
          type: 'error',
          message: res.error || 'Failed to import backup.',
        });
      }
    } catch (err: any) {
      setImportStatus({
        type: 'error',
        message: err.message || 'Error reading backup file.',
      });
    }
    e.target.value = '';
  };

  // Handle document import (.md, .txt, .html)
  const handleDocFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const filename = file.name.replace(/\.[^/.]+$/, '');
      const doc = markdownToTiptapJson(text);

      const newNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: filename || 'Imported Note',
        content: doc,
        plainText: text,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        favorite: false,
        isDeleted: false,
        deletedAt: null,
        tags: ['imported'],
      };

      await db.notes.put(newNote);
      setImportStatus({
        type: 'success',
        message: `Imported "${filename}" as a new note.`,
      });
      onRefreshNotes();
    } catch (err: any) {
      setImportStatus({
        type: 'error',
        message: err.message || 'Failed to import document.',
      });
    }
    e.target.value = '';
  };

  // Trigger PWA installation
  const handleInstallPwa = async () => {
    const promptEvent = (window as any).deferredInstallPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setCanInstallPwa(false);
      }
      (window as any).deferredInstallPrompt = null;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-[var(--bg-dialog)] border border-[var(--border-strong)] shadow-2xl p-6 text-[var(--text-main)] transition-all flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <h2 className="text-lg font-semibold tracking-tight">Preferences & Tools</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-[var(--border-subtle)] py-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'general'
                ? 'bg-[var(--bg-card-active)] text-[var(--text-main)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'backup'
                ? 'bg-[var(--bg-card-active)] text-[var(--text-main)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            Backup & Import
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'shortcuts'
                ? 'bg-[var(--bg-card-active)] text-[var(--text-main)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            Shortcuts
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'about'
                ? 'bg-[var(--bg-card-active)] text-[var(--text-main)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            About
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 pr-3 flex flex-col gap-5">
          {importStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                importStatus.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20'
              }`}
            >
              {importStatus.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {activeTab === 'general' && (
            <>
              {/* Theme Selector */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[var(--text-muted)]">
                  <Palette className="w-4 h-4" />
                  <span>Theme</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onChangeTheme(t.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                        currentTheme === t.id
                          ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: t.color }}
                      />
                      <div>
                        <div className="text-xs font-semibold">{t.name}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">
                          {t.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family Selector */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[var(--text-muted)]">
                  <Type className="w-4 h-4" />
                  <span>Font Family</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {fonts.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => onChangeFont(f.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        currentFont === f.id
                          ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent-main)]/30'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-semibold text-[var(--text-main)]"
                            style={{ fontFamily: f.fontStyle }}
                          >
                            {f.name}
                          </span>
                          <span className="text-[10px] text-[var(--text-faint)] font-mono px-1.5 py-0.5 rounded-md bg-[var(--border-subtle)]/70">
                            {f.category}
                          </span>
                        </div>
                        <span
                          className="text-xs text-[var(--text-muted)]"
                          style={{ fontFamily: f.fontStyle }}
                        >
                          {f.preview}
                        </span>
                      </div>
                      {currentFont === f.id && (
                        <Check className="w-4 h-4 text-[var(--accent-main)] shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
                    <Type className="w-4 h-4" />
                    <span>Reading Size</span>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {currentFontSize === 'sm' ? '14px' : currentFontSize === 'lg' ? '21px' : '17px'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {fontSizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onChangeFontSize(s.id)}
                      className={`py-2.5 px-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                        currentFontSize === s.id
                          ? 'border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)] shadow-xs ring-2 ring-[var(--accent-main)]/20'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)]'
                      }`}
                    >
                      <span
                        className="font-bold leading-none"
                        style={{
                          fontSize: s.id === 'sm' ? '13px' : s.id === 'lg' ? '20px' : '16px',
                        }}
                      >
                        {s.preview}
                      </span>
                      <span className="text-[11px] font-medium">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Install PWA Button if available */}
              {canInstallPwa && (
                <div className="pt-2">
                  <button
                    onClick={handleInstallPwa}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-[var(--accent-main)] bg-[var(--accent-subtle)] text-[var(--accent-main)] text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Install Writely App on this device</span>
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'backup' && (
            <div className="flex flex-col gap-4">
              {/* Export Full Backup */}
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Database className="w-4 h-4 text-[var(--accent-main)]" />
                  <span className="text-xs font-semibold">Export Full Backup</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-3 leading-relaxed">
                  Download a complete, versioned JSON backup containing all your notes, tags, and timestamps.
                </p>
                <button
                  onClick={exportFullBackup}
                  className="px-3.5 py-2 rounded-xl bg-[var(--accent-main)] text-[var(--accent-contrast)] text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup (.json)</span>
                </button>
              </div>

              {/* Import Backup */}
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold">Restore from Backup</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-3 leading-relaxed">
                  Safely restores notes from a previously exported Writely backup. Existing notes are never overwritten.
                </p>
                <input
                  ref={backupFileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleBackupFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => backupFileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl border border-[var(--border-strong)] text-xs font-medium text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Select Backup File...</span>
                </button>
              </div>

              {/* Import Individual Document */}
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold">Import Document</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-3 leading-relaxed">
                  Import a Markdown (.md) or Plain Text (.txt) file directly as a new note.
                </p>
                <input
                  ref={docFileInputRef}
                  type="file"
                  accept=".md,.txt,.html,text/markdown,text/plain,text/html"
                  onChange={handleDocFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => docFileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl border border-[var(--border-strong)] text-xs font-medium text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Select Document...</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Command Palette / Search</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-strong)] font-mono text-[11px]">
                  ⌘K / Ctrl+K
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Create New Note</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-strong)] font-mono text-[11px]">
                  ⌘N / Ctrl+N
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Toggle Sidebar</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-strong)] font-mono text-[11px]">
                  ⌘\ / Ctrl+\
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Bold / Italic / Underline</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-strong)] font-mono text-[11px]">
                  ⌘B / ⌘I / ⌘U
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Undo / Redo</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-strong)] font-mono text-[11px]">
                  ⌘Z / ⌘⇧Z
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Interactive Checklist</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-strong)] font-mono text-[11px]">
                  [] + Space
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Bullet List / Ordered List</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-strong)] font-mono text-[11px]">
                  - or 1. + Space
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Heading 1 / 2 / 3</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-strong)] font-mono text-[11px]">
                  # or ## + Space
                </kbd>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="flex flex-col gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 text-[var(--accent-main)] font-semibold mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Privacy-First by Architecture</span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed mb-3">
                  Writely operates purely on your local device. There are zero accounts, zero databases on remote servers, no analytics, and no trackers.
                </p>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Your notes belong exclusively to you, persisted securely in your browser&apos;s IndexedDB.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <div className="font-semibold mb-1">Philosophy</div>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Open → write → autosave → export.
                  <br />
                  A calm, intentional space designed to give your ideas a quiet home.
                </p>
              </div>

              <div className="text-[11px] text-[var(--text-faint)] text-center pt-2">
                Writely v1.0.0 &bull; Local-First Personal Writing
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
