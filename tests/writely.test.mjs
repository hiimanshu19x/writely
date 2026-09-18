import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  tiptapJsonToMarkdown,
  markdownToTiptapJson,
} from '../src/lib/markdown.js';
import { calculateNoteStats } from '../src/lib/stats.js';
import { validateBackupData } from '../src/lib/backup.js';
import { generateHtmlExport } from '../src/lib/html-export.js';
import { extractPlainText, INITIAL_SEED_NOTE } from '../src/lib/db.js';

console.log('--- RUNNING WRITELY VERIFICATION SUITE ---');

// 1. Test Seed Note & Text Extraction
console.log('Test 1: Seed Note Structure & Plain Text Extraction');
assert.ok(INITIAL_SEED_NOTE.id, 'Seed note must have an ID');
assert.strictEqual(INITIAL_SEED_NOTE.title, 'A calmer mind');
const extractedText = extractPlainText(INITIAL_SEED_NOTE.content);
assert.ok(
  extractedText.includes('Sometimes the most productive thing you can do is simply take a breath.'),
  'Text extraction should extract paragraph content'
);
assert.ok(
  extractedText.includes('Read a book'),
  'Text extraction should extract task item text'
);
console.log('✓ Test 1 Passed: Seed note and extraction verified.');

// 2. Test Markdown Serializer
console.log('Test 2: Markdown Serialization');
const sampleDoc = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'My Daily Journal' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Today was ' },
        { type: 'text', marks: [{ type: 'bold' }], text: 'productive' },
        { type: 'text', text: ' and ' },
        { type: 'text', marks: [{ type: 'italic' }], text: 'calm' },
        { type: 'text', text: '.' },
      ],
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Morning meditation' }] }],
        },
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Evening stroll' }] }],
        },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Simplicity is the ultimate sophistication.' }],
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: { language: 'typescript' },
      content: [{ type: 'text', text: 'const note = "Writely";' }],
    },
    {
      type: 'horizontalRule',
    },
  ],
};

const generatedMd = tiptapJsonToMarkdown(sampleDoc);
assert.ok(generatedMd.includes('# My Daily Journal'), 'H1 heading formatted in markdown');
assert.ok(generatedMd.includes('**productive**'), 'Bold markdown formatted');
assert.ok(generatedMd.includes('*calm*'), 'Italic markdown formatted');
assert.ok(generatedMd.includes('- [x] Morning meditation'), 'Completed task item serialized');
assert.ok(generatedMd.includes('- [ ] Evening stroll'), 'Uncompleted task item serialized');
assert.ok(generatedMd.includes('> Simplicity is the ultimate sophistication.'), 'Blockquote serialized');
assert.ok(generatedMd.includes('```typescript\nconst note = "Writely";\n```'), 'Code block serialized');
assert.ok(generatedMd.includes('---'), 'Horizontal rule serialized');
console.log('✓ Test 2 Passed: Markdown serialization verified.');

// 3. Test Markdown Parser
console.log('Test 3: Markdown Parser & Round-trip');
const mdInput = `# Morning Thoughts

Distraction-free writing.

- [x] Deep breath
- [ ] Write first draft

> Give your ideas a quiet home.

- Bullet item 1
- Bullet item 2

1. First step
2. Second step

---`;

const parsedDoc = markdownToTiptapJson(mdInput);
assert.strictEqual(parsedDoc.type, 'doc');
assert.ok(parsedDoc.content.length >= 6, 'Parsed doc must have multiple nodes');
const reSerialized = tiptapJsonToMarkdown(parsedDoc);
assert.ok(reSerialized.includes('# Morning Thoughts'));
assert.ok(reSerialized.includes('- [x] Deep breath'));
assert.ok(reSerialized.includes('- [ ] Write first draft'));
assert.ok(reSerialized.includes('> Give your ideas a quiet home.'));
console.log('✓ Test 3 Passed: Markdown parser verified.');

// 4. Test Note Statistics (Word count, characters, reading time)
console.log('Test 4: Note Statistics Calculation');
const testText = 'The quick brown fox jumps over the lazy dog. A second paragraph with more words.';
const stats = calculateNoteStats(testText);
assert.strictEqual(stats.words, 15);
assert.strictEqual(stats.characters, testText.length);
assert.ok(stats.charactersNoSpaces < stats.characters);
assert.strictEqual(stats.readingTimeMinutes, 1);
assert.strictEqual(stats.paragraphs, 1);

const emptyStats = calculateNoteStats('');
assert.strictEqual(emptyStats.words, 0);
assert.strictEqual(emptyStats.characters, 0);
console.log('✓ Test 4 Passed: Note statistics calculator verified.');

// 5. Test Backup Validation & Conflict Resolution
console.log('Test 5: Backup Validation & Conflict Resolution');
const validBackup = {
  version: 1,
  app: 'Writely',
  exportedAt: new Date().toISOString(),
  notes: [
    {
      id: 'note-1',
      title: 'First Note',
      content: { type: 'doc', content: [] },
      plainText: 'hello',
      createdAt: 1000,
      updatedAt: 1000,
      favorite: false,
      isDeleted: false,
      tags: ['work'],
    },
  ],
};

const valRes = validateBackupData(validBackup);
assert.strictEqual(valRes.valid, true);
assert.strictEqual(valRes.notes.length, 1);

const invalidBackupNoVersion = { app: 'Writely', notes: [] };
assert.strictEqual(validateBackupData(invalidBackupNoVersion).valid, false);

const invalidBackupCorrupted = 'not an object';
assert.strictEqual(validateBackupData(invalidBackupCorrupted).valid, false);
console.log('✓ Test 5 Passed: Backup validation verified.');

// 6. Test HTML Export Generator
console.log('Test 6: HTML Export Generation');
const htmlOutput = generateHtmlExport(
  {
    id: 'note-test',
    title: 'Editorial Philosophy',
    content: {},
    plainText: 'Notes are thoughts.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    favorite: false,
    isDeleted: false,
    tags: [],
  },
  '<h1>Editorial Philosophy</h1><p>Notes are thoughts.</p>'
);
assert.ok(htmlOutput.includes('<!DOCTYPE html>'));
assert.ok(htmlOutput.includes('<title>Editorial Philosophy</title>'));
assert.ok(htmlOutput.includes('<h1>Editorial Philosophy</h1>'));
assert.ok(htmlOutput.includes('Saved with Writely'));
console.log('✓ Test 6 Passed: HTML export generator verified.');

// 7. Verify PWA Assets
console.log('Test 7: PWA Assets (manifest.json, sw.js, icons)');
const manifestPath = path.resolve('./public/manifest.json');
assert.ok(fs.existsSync(manifestPath), 'manifest.json exists');
const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
assert.strictEqual(manifestContent.display, 'standalone');
assert.strictEqual(manifestContent.short_name, 'Writely');

const swPath = path.resolve('./public/sw.js');
assert.ok(fs.existsSync(swPath), 'sw.js exists');
const swContent = fs.readFileSync(swPath, 'utf8');
assert.ok(swContent.includes('addEventListener(\'fetch\''), 'Service worker has fetch listener');

const icon192 = path.resolve('./public/icons/icon-192.png');
const icon512 = path.resolve('./public/icons/icon-512.png');
assert.ok(fs.existsSync(icon192), 'icon-192.png exists');
assert.ok(fs.existsSync(icon512), 'icon-512.png exists');
assert.ok(fs.statSync(icon192).size > 100, 'icon-192.png is valid size');
assert.ok(fs.statSync(icon512).size > 100, 'icon-512.png is valid size');
console.log('✓ Test 7 Passed: PWA assets verified.');

// 8. Verify Themes and Dynamic Favicon Palette
console.log('Test 8: Premium Themes & Dynamic Favicon Palette');
import { VALID_THEMES, THEME_FAVICON_COLORS, VALID_FONTS, DEFAULT_FONT } from '../src/lib/storage.js';
assert.strictEqual(VALID_THEMES.length, 8, 'Must have 8 curated themes');
assert.ok(VALID_THEMES.includes('nordic'), 'Includes Nordic theme');
assert.ok(VALID_THEMES.includes('matcha'), 'Includes Matcha theme');
assert.ok(VALID_THEMES.includes('rosewater'), 'Includes Rosewater theme');
assert.ok(VALID_THEMES.includes('oled'), 'Includes OLED theme');

for (const theme of VALID_THEMES) {
  assert.ok(THEME_FAVICON_COLORS[theme], `Favicon color defined for ${theme}`);
  assert.ok(THEME_FAVICON_COLORS[theme].bg, `Favicon bg defined for ${theme}`);
  assert.ok(THEME_FAVICON_COLORS[theme].fg, `Favicon fg defined for ${theme}`);
}
console.log('✓ Test 8 Passed: All 8 themes and dynamic favicon palettes verified.');

// 9. Verify 11 Curated Premium Fonts & Contrast System
console.log('Test 9: 11 Curated Premium Fonts & Contrast System');
assert.strictEqual(VALID_FONTS.length, 11, 'Must have 11 curated typography options');
assert.strictEqual(DEFAULT_FONT, 'sans-sfpro', 'Default font must be sans-sfpro');
assert.ok(VALID_FONTS.includes('sans-sfpro'), 'Includes SF Pro');
assert.ok(VALID_FONTS.includes('sans-jakarta'), 'Includes Plus Jakarta Sans');
assert.ok(VALID_FONTS.includes('serif-newsreader'), 'Includes Newsreader');
assert.ok(VALID_FONTS.includes('serif-garamond'), 'Includes EB Garamond');
assert.ok(VALID_FONTS.includes('serif-lora'), 'Includes Lora');
assert.ok(VALID_FONTS.includes('mono-ibmplex'), 'Includes IBM Plex Mono');

const cssContent = fs.readFileSync(path.resolve('./src/app/globals.css'), 'utf8');
assert.ok(cssContent.includes('--accent-contrast: #000000;'), 'OLED theme has black accent contrast');
assert.ok(cssContent.includes('--accent-contrast: #1E232A;'), 'Nordic theme has deep slate accent contrast');
assert.ok(cssContent.includes('--accent-contrast: #0B0F19;'), 'Midnight theme has dark navy accent contrast');
assert.ok(cssContent.includes('--font-sf-pro:'), 'Defines SF Pro font family');
console.log('✓ Test 9 Passed: 11 fonts and contrast tokens fully verified.');

console.log('\n--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
