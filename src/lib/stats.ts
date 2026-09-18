import { NoteStats } from '@/types/note';

export function calculateNoteStats(plainText: string): NoteStats {
  if (!plainText || !plainText.trim()) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      readingTimeMinutes: 0,
      paragraphs: 0,
    };
  }

  const trimmed = plainText.trim();
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0).length;
  const characters = plainText.length;
  const charactersNoSpaces = plainText.replace(/\s/g, '').length;
  const paragraphs = trimmed
    .split(/\n+/)
    .filter((p) => p.trim().length > 0).length;

  // Average reading speed: 200 words per minute
  const readingTimeMinutes = Math.ceil(words / 200);

  return {
    words,
    characters,
    charactersNoSpaces,
    readingTimeMinutes: Math.max(1, readingTimeMinutes),
    paragraphs,
  };
}
