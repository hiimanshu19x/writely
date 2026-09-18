import { JSONContent } from '@tiptap/react';

/**
 * Converts Tiptap JSON content into clean, semantic Markdown text.
 */
export function tiptapJsonToMarkdown(node: JSONContent): string {
  if (!node) return '';

  if (node.type === 'doc') {
    return (node.content || [])
      .map((child) => tiptapJsonToMarkdown(child))
      .filter((s) => s.length > 0)
      .join('\n\n');
  }

  if (node.type === 'paragraph') {
    return renderInline(node.content);
  }

  if (node.type === 'heading') {
    const level = node.attrs?.level || 1;
    const prefix = '#'.repeat(level);
    return `${prefix} ${renderInline(node.content)}`;
  }

  if (node.type === 'blockquote') {
    const text = (node.content || [])
      .map((child) => tiptapJsonToMarkdown(child))
      .join('\n>\n');
    return text
      .split('\n')
      .map((line) => (line.startsWith('>') ? line : `> ${line}`))
      .join('\n');
  }

  if (node.type === 'bulletList') {
    return (node.content || [])
      .map((item) => `- ${renderListItem(item)}`)
      .join('\n');
  }

  if (node.type === 'orderedList') {
    return (node.content || [])
      .map((item, idx) => `${idx + 1}. ${renderListItem(item)}`)
      .join('\n');
  }

  if (node.type === 'taskList') {
    return (node.content || [])
      .map((item) => {
        const checked = item.attrs?.checked ? 'x' : ' ';
        return `- [${checked}] ${renderListItem(item)}`;
      })
      .join('\n');
  }

  if (node.type === 'codeBlock') {
    const lang = node.attrs?.language || '';
    const code = renderInline(node.content);
    return `\`\`\`${lang}\n${code}\n\`\`\``;
  }

  if (node.type === 'horizontalRule') {
    return '---';
  }

  return renderInline(node.content);
}

function renderListItem(item: JSONContent): string {
  if (!item || !item.content) return '';
  return item.content
    .map((child) => {
      if (child.type === 'paragraph') {
        return renderInline(child.content);
      }
      return tiptapJsonToMarkdown(child);
    })
    .join('\n  ');
}

function renderInline(content?: JSONContent[]): string {
  if (!content || !Array.isArray(content)) return '';

  return content
    .map((node) => {
      if (node.type !== 'text') return '';
      let text = node.text || '';
      if (!node.marks) return text;

      for (const mark of node.marks) {
        if (mark.type === 'bold') {
          text = `**${text}**`;
        } else if (mark.type === 'italic') {
          text = `*${text}*`;
        } else if (mark.type === 'strike') {
          text = `~~${text}~~`;
        } else if (mark.type === 'code') {
          text = `\`${text}\``;
        } else if (mark.type === 'underline') {
          text = `<u>${text}</u>`;
        } else if (mark.type === 'highlight') {
          text = `<mark>${text}</mark>`;
        } else if (mark.type === 'link') {
          const href = mark.attrs?.href || '#';
          text = `[${text}](${href})`;
        }
      }
      return text;
    })
    .join('');
}

/**
 * Converts Markdown string into Tiptap JSONContent for import.
 */
export function markdownToTiptapJson(markdown: string): JSONContent {
  const lines = markdown.split(/\r?\n/);
  const doc: JSONContent = {
    type: 'doc',
    content: [],
  };

  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLang = '';

  let currentList: { type: 'bulletList' | 'orderedList' | 'taskList'; items: JSONContent[] } | null = null;

  const flushList = () => {
    if (currentList && currentList.items.length > 0) {
      doc.content!.push({
        type: currentList.type,
        content: currentList.items,
      });
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code fences
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        doc.content!.push({
          type: 'codeBlock',
          attrs: { language: codeBlockLang },
          content: [{ type: 'text', text: codeBlockContent }],
        });
        codeBlockContent = '';
        codeBlockLang = '';
      } else {
        flushList();
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
        codeBlockContent = '';
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += (codeBlockContent ? '\n' : '') + line;
      continue;
    }

    // Empty line
    if (!line.trim()) {
      flushList();
      continue;
    }

    // Horizontal rule
    if (/^(---|___|\*\*\*)$/.test(line.trim())) {
      flushList();
      doc.content!.push({ type: 'horizontalRule' });
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      const level = Math.min(headingMatch[1].length, 3);
      doc.content!.push({
        type: 'heading',
        attrs: { level },
        content: parseInlineText(headingMatch[2]),
      });
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      flushList();
      const quoteText = line.replace(/^>\s?/, '');
      doc.content!.push({
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: parseInlineText(quoteText),
          },
        ],
      });
      continue;
    }

    // Task list items (- [ ] or - [x])
    const taskMatch = line.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/);
    if (taskMatch) {
      if (!currentList || currentList.type !== 'taskList') {
        flushList();
        currentList = { type: 'taskList', items: [] };
      }
      const checked = taskMatch[1].toLowerCase() === 'x';
      currentList.items.push({
        type: 'taskItem',
        attrs: { checked },
        content: [
          {
            type: 'paragraph',
            content: parseInlineText(taskMatch[2]),
          },
        ],
      });
      continue;
    }

    // Bullet list items
    const bulletMatch = line.match(/^[-*+]\s+(.*)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'bulletList') {
        flushList();
        currentList = { type: 'bulletList', items: [] };
      }
      currentList.items.push({
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: parseInlineText(bulletMatch[1]),
          },
        ],
      });
      continue;
    }

    // Ordered list items
    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      if (!currentList || currentList.type !== 'orderedList') {
        flushList();
        currentList = { type: 'orderedList', items: [] };
      }
      currentList.items.push({
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: parseInlineText(orderedMatch[1]),
          },
        ],
      });
      continue;
    }

    // Regular paragraph
    flushList();
    doc.content!.push({
      type: 'paragraph',
      content: parseInlineText(line),
    });
  }

  flushList();

  if (doc.content!.length === 0) {
    doc.content!.push({ type: 'paragraph', content: [] });
  }

  return doc;
}

function parseInlineText(text: string): JSONContent[] {
  if (!text) return [];

  // Simple token parser for bold, italic, code, links
  // Falls back gracefully to regular text
  const tokens: JSONContent[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      tokens.push({
        type: 'text',
        marks: [{ type: 'bold' }],
        text: boldMatch[1],
      });
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic: *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)([^*_]+)\1/);
    if (italicMatch) {
      tokens.push({
        type: 'text',
        marks: [{ type: 'italic' }],
        text: italicMatch[2],
      });
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      tokens.push({
        type: 'text',
        marks: [{ type: 'code' }],
        text: codeMatch[1],
      });
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      tokens.push({
        type: 'text',
        marks: [{ type: 'link', attrs: { href: linkMatch[2] } }],
        text: linkMatch[1],
      });
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Strikethrough: ~~text~~
    const strikeMatch = remaining.match(/^~~([^~]+)~~/);
    if (strikeMatch) {
      tokens.push({
        type: 'text',
        marks: [{ type: 'strike' }],
        text: strikeMatch[1],
      });
      remaining = remaining.slice(strikeMatch[0].length);
      continue;
    }

    // Regular text up to the next special character
    const nextSpecial = remaining.search(/(\*\*|\*|_|`|\[|~~)/);
    if (nextSpecial === -1) {
      tokens.push({ type: 'text', text: remaining });
      break;
    } else if (nextSpecial === 0) {
      tokens.push({ type: 'text', text: remaining[0] });
      remaining = remaining.slice(1);
    } else {
      tokens.push({ type: 'text', text: remaining.slice(0, nextSpecial) });
      remaining = remaining.slice(nextSpecial);
    }
  }

  return tokens.length > 0 ? tokens : [{ type: 'text', text: '' }];
}
