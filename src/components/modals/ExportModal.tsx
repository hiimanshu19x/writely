'use client';

import React from 'react';
import { X, FileText, Code2, FileCode, Database, Download } from 'lucide-react';
import { Note } from '@/types/note';
import { tiptapJsonToMarkdown } from '@/lib/markdown';
import { generateHtmlExport } from '@/lib/html-export';
import { downloadFile, exportFullBackup } from '@/lib/backup';

interface ExportModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ note, isOpen, onClose }: ExportModalProps) {
  if (!isOpen || !note) return null;

  const sanitizeFilename = (name: string) => {
    return (name || 'untitled')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const filenameBase = sanitizeFilename(note.title);

  const handleExportMarkdown = () => {
    const md = tiptapJsonToMarkdown(note.content);
    const content = `# ${note.title || 'Untitled'}\n\n${md}`;
    downloadFile(content, `${filenameBase}.md`, 'text/markdown;charset=utf-8');
    onClose();
  };

  const handleExportTxt = () => {
    const content = `${note.title || 'Untitled'}\n\n${note.plainText || ''}`;
    downloadFile(content, `${filenameBase}.txt`, 'text/plain;charset=utf-8');
    onClose();
  };

  const handleExportHtml = () => {
    // Generate simple HTML representation
    const md = tiptapJsonToMarkdown(note.content);
    // Simple html conversion or editor html
    const htmlBody = `<p>${(note.plainText || '').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`;
    const fullHtml = generateHtmlExport(note, htmlBody);
    downloadFile(fullHtml, `${filenameBase}.html`, 'text/html;charset=utf-8');
    onClose();
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(note, null, 2);
    downloadFile(jsonStr, `${filenameBase}.json`, 'application/json;charset=utf-8');
    onClose();
  };

  const handleExportBackup = async () => {
    await exportFullBackup();
    onClose();
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
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
          <div>
            <h3 className="text-base font-semibold">Export note</h3>
            <p className="text-xs text-[var(--text-muted)] truncate max-w-[240px]">
              {note.title || 'Untitled Note'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options matching the design mockup */}
        <div className="flex flex-col gap-2">
          {/* Markdown */}
          <button
            onClick={handleExportMarkdown}
            className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold">Markdown</div>
                <div className="text-[11px] text-[var(--text-muted)]">.md file format</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[var(--text-faint)] group-hover:text-[var(--text-main)] transition-colors" />
          </button>

          {/* Plain Text */}
          <button
            onClick={handleExportTxt}
            className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold">Plain text</div>
                <div className="text-[11px] text-[var(--text-muted)]">.txt file format</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[var(--text-faint)] group-hover:text-[var(--text-main)] transition-colors" />
          </button>

          {/* HTML */}
          <button
            onClick={handleExportHtml}
            className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold">HTML</div>
                <div className="text-[11px] text-[var(--text-muted)]">.html formatted webpage</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[var(--text-faint)] group-hover:text-[var(--text-main)] transition-colors" />
          </button>

          {/* JSON */}
          <button
            onClick={handleExportJson}
            className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold">JSON</div>
                <div className="text-[11px] text-[var(--text-muted)]">Raw note structure</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[var(--text-faint)] group-hover:text-[var(--text-main)] transition-colors" />
          </button>
        </div>

        {/* Full Workspace Backup divider */}
        <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <span className="text-[11px] text-[var(--text-muted)]">Looking for all notes?</span>
          <button
            onClick={handleExportBackup}
            className="text-xs font-medium text-[var(--accent-main)] hover:underline flex items-center gap-1"
          >
            <Database className="w-3 h-3" />
            <span>Export Full Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
}
