import Dexie, { type Table } from 'dexie';
import { Note } from '@/types/note';

export class WritelyDatabase extends Dexie {
  notes!: Table<Note, string>;

  constructor() {
    super('WritelyDB');
    // Version 1 of the schema
    this.version(1).stores({
      notes: 'id, title, plainText, createdAt, updatedAt, favorite, isDeleted, deletedAt, *tags',
    });
  }
}

export const db = new WritelyDatabase();

// Starter seed note content when user opens the app for the first time
export const INITIAL_SEED_NOTE: Note = {
  id: 'welcome-to-writely',
  title: 'A calmer mind',
  createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  updatedAt: Date.now() - 1000 * 60 * 15,
  favorite: true,
  isDeleted: false,
  deletedAt: null,
  tags: ['welcome', 'guide'],
  pinned: true,
  plainText: `Sometimes the most productive thing you can do is simply take a breath.\n\nRead a book\nGo for a walk\nBe present\nBuild what excites you\n\nWritely was designed with a simple philosophy:\nOpen → write → autosave → export.\n\nAll notes live purely on your device in IndexedDB. No accounts, no tracking, works completely offline.\n\nShortcuts to remember:\n⌘K / Ctrl+K: Open Command Palette\n⌘N / Ctrl+N: Create a new note\n⌘B / ⌘I / ⌘U: Bold, italic, underline\n# + Space: Large heading\n- + Space: Bullet list\n[] + Space: Interactive task checklist`,
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Sometimes the most productive thing you can do is simply take a breath.',
          },
        ],
      },
      {
        type: 'taskList',
        content: [
          {
            type: 'taskItem',
            attrs: { checked: true },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Read a book' }],
              },
            ],
          },
          {
            type: 'taskItem',
            attrs: { checked: false },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Go for a walk' }],
              },
            ],
          },
          {
            type: 'taskItem',
            attrs: { checked: false },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Be present' }],
              },
            ],
          },
          {
            type: 'taskItem',
            attrs: { checked: true },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Build what excites you' }],
              },
            ],
          },
        ],
      },
      {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'The core philosophy: Open → write → autosave → export. Distraction-free, private, and fast.',
              },
            ],
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Distraction-Free Essentials' }],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', marks: [{ type: 'bold' }], text: '100% Local-First' },
                  {
                    type: 'text',
                    text: ': Your notes remain inside your browser using IndexedDB. No cloud servers, no analytics, no accounts.',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', marks: [{ type: 'bold' }], text: 'Instant Autosave' },
                  {
                    type: 'text',
                    text: ': Every keystroke saves automatically. You never need to click a Save button.',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', marks: [{ type: 'bold' }], text: 'Own Your Data' },
                  {
                    type: 'text',
                    text: ': Export any note as Markdown, Plain Text, or clean HTML at any time, or generate a full versioned JSON backup.',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Press ',
          },
          {
            type: 'text',
            marks: [{ type: 'code' }],
            text: 'Cmd + K',
          },
          {
            type: 'text',
            text: ' (or Ctrl + K) anytime to jump anywhere, switch themes, or export your work.',
          },
        ],
      },
    ],
  },
};

export const STARTER_NOTES: Note[] = [
  {
    ...INITIAL_SEED_NOTE,
    tags: ['personal'],
  },
  {
    id: 'project-ideas',
    title: 'Project ideas',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
    favorite: false,
    isDeleted: false,
    deletedAt: null,
    tags: ['work'],
    plainText: 'A collection of ideas to explore this month. Focus on simplicity, not features.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A collection of ideas to explore this month. Focus on simplicity, not features.',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'travel-plans',
    title: 'Travel plans',
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
    updatedAt: Date.now() - 1000 * 60 * 60 * 14,
    favorite: false,
    isDeleted: false,
    deletedAt: null,
    tags: ['travel'],
    plainText: 'Places to visit, things to do, experiences to have. Keep adding to this list...',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Places to visit, things to do, experiences to have. Keep adding to this list...',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'book-notes',
    title: 'Book notes',
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
    updatedAt: Date.now() - 1000 * 60 * 60 * 72,
    favorite: false,
    isDeleted: false,
    deletedAt: null,
    tags: ['books'],
    plainText: 'Notes and highlights from books I\'m reading. Key takeaways, favorite quotes, lessons...',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Notes and highlights from books I\'m reading. Key takeaways, favorite quotes, lessons...',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'workout-routine',
    title: 'Workout routine',
    createdAt: Date.now() - 1000 * 60 * 60 * 144,
    updatedAt: Date.now() - 1000 * 60 * 60 * 120,
    favorite: true,
    isDeleted: false,
    deletedAt: null,
    tags: ['personal'],
    plainText: 'Be consistent. Progress over perfection. Small steps every day.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Be consistent. Progress over perfection. Small steps every day.',
            },
          ],
        },
      ],
    },
  },
];

let isInitializing = false;
let isInitialized = false;

// Ensure seed notes exist on first load
export async function initializeDatabase(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (isInitialized || isInitializing) return;
  isInitializing = true;

  try {
    const count = await db.notes.count();
    if (count === 0) {
      await db.notes.bulkPut(STARTER_NOTES);
    } else if (count === 1) {
      const existing = await db.notes.get(INITIAL_SEED_NOTE.id);
      if (existing) {
        const others = STARTER_NOTES.filter((n) => n.id !== INITIAL_SEED_NOTE.id);
        await db.notes.bulkPut(others);
      }
    }
    isInitialized = true;
  } catch (err: any) {
    if (err?.name === 'ConstraintError') {
      // Key already placed concurrently
      isInitialized = true;
      return;
    }
    console.error('Failed to initialize Writely IndexedDB:', err);
  } finally {
    isInitializing = false;
  }
}

// Extract plain text recursively from Tiptap JSONContent
export function extractPlainText(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map(extractPlainText).join(' ');
  }
  let text = '';
  if (content.text) {
    text += content.text;
  }
  if (content.content) {
    text += ' ' + extractPlainText(content.content);
  }
  return text.trim();
}
