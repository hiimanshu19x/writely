import { db } from './db';
import { BackupData, Note } from '@/types/note';

export async function exportFullBackup(): Promise<void> {
  const allNotes = await db.notes.toArray();
  const backup: BackupData = {
    version: 1,
    app: 'Writely',
    exportedAt: new Date().toISOString(),
    notes: allNotes,
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(jsonStr, `writely-backup-${dateStr}.json`, 'application/json');
}

export function validateBackupData(data: any): { valid: boolean; error?: string; notes?: Note[] } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'File does not contain valid JSON object.' };
  }

  if (!data.version || typeof data.version !== 'number') {
    return { valid: false, error: 'Missing or invalid backup schema version.' };
  }

  if (!Array.isArray(data.notes)) {
    return { valid: false, error: 'Backup is missing the notes collection.' };
  }

  // Validate each note has essential fields
  for (const n of data.notes) {
    if (!n.id || typeof n.id !== 'string') {
      return { valid: false, error: 'One or more notes are missing a valid ID.' };
    }
  }

  return { valid: true, notes: data.notes as Note[] };
}

export async function importBackupJson(jsonString: string): Promise<{
  success: boolean;
  totalImported: number;
  duplicatesReassigned: number;
  error?: string;
}> {
  try {
    const parsed = JSON.parse(jsonString);
    const validation = validateBackupData(parsed);

    if (!validation.valid || !validation.notes) {
      return {
        success: false,
        totalImported: 0,
        duplicatesReassigned: 0,
        error: validation.error || 'Invalid backup file structure.',
      };
    }

    const incomingNotes = validation.notes;
    const existingIds = new Set((await db.notes.toArray()).map((n) => n.id));

    let duplicatesCount = 0;
    const notesToSave: Note[] = [];

    for (const note of incomingNotes) {
      let finalId = note.id;
      if (existingIds.has(finalId)) {
        // Avoid overwriting! Generate a fresh ID
        finalId = `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        duplicatesCount++;
      }

      notesToSave.push({
        ...note,
        id: finalId,
        title: note.title || 'Untitled Note',
        content: note.content || { type: 'doc', content: [] },
        plainText: note.plainText || '',
        createdAt: note.createdAt || Date.now(),
        updatedAt: note.updatedAt || Date.now(),
        favorite: Boolean(note.favorite),
        isDeleted: Boolean(note.isDeleted),
        deletedAt: note.deletedAt || null,
        tags: Array.isArray(note.tags) ? note.tags : [],
      });
      existingIds.add(finalId);
    }

    await db.notes.bulkPut(notesToSave);

    return {
      success: true,
      totalImported: notesToSave.length,
      duplicatesReassigned: duplicatesCount,
    };
  } catch (err: any) {
    return {
      success: false,
      totalImported: 0,
      duplicatesReassigned: 0,
      error: err.message || 'Failed to parse JSON file.',
    };
  }
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
