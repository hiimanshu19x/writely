'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mode: 'trash' | 'permanent' | 'emptyTrash';
  noteTitle?: string;
  count?: number;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  mode,
  noteTitle,
  count,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  let title = 'Move to Trash?';
  let description = `Move "${noteTitle || 'Untitled Note'}" to Trash? You can restore it whenever you want.`;
  let confirmButtonText = 'Move to Trash';

  if (mode === 'permanent') {
    title = 'Delete Permanently?';
    description = `Are you sure you want to permanently delete "${noteTitle || 'Untitled Note'}"? This action cannot be reversed.`;
    confirmButtonText = 'Delete Forever';
  } else if (mode === 'emptyTrash') {
    title = 'Empty Trash?';
    description = `Are you sure you want to permanently delete all ${count ?? ''} notes in Trash? This cannot be undone.`;
    confirmButtonText = 'Empty Trash';
  }

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
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[var(--danger-subtle)] text-[var(--danger-main)] flex items-center justify-center shrink-0">
            {mode === 'trash' ? (
              <Trash2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-5">
          {description}
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] border border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-white bg-[var(--danger-main)] hover:opacity-90 transition-opacity"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
