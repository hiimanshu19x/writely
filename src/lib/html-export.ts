import { Note } from '@/types/note';

/**
 * Generates a self-contained, standalone, beautifully styled HTML document for export or print.
 */
export function generateHtmlExport(note: Note, htmlBody: string): string {
  const dateStr = new Date(note.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(note.title || 'Untitled Note')}</title>
  <style>
    :root {
      --bg: #fcfbf9;
      --text: #23201d;
      --muted: #7d756e;
      --border: #e6decb;
      --accent: #9c5b2b;
      --code-bg: #f3efe6;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #12141a;
        --text: #eae6df;
        --muted: #959aa5;
        --border: #232938;
        --accent: #e0945c;
        --code-bg: #1a1e28;
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Source Serif 4", Georgia, serif;
      line-height: 1.75;
      font-size: 18px;
      padding: 4rem 1.5rem;
      display: flex;
      justify-content: center;
    }
    .container {
      max-width: 720px;
      width: 100%;
    }
    header {
      margin-bottom: 2.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.5rem;
    }
    h1.title {
      font-size: 2.4rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.25;
      margin-bottom: 0.5rem;
    }
    .metadata {
      font-size: 0.875rem;
      color: var(--muted);
      font-family: -apple-system, BlinkMacSystemFont, "Inter", "Geist", sans-serif;
    }
    .content h1, .content h2, .content h3 {
      font-weight: 600;
      letter-spacing: -0.015em;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      line-height: 1.3;
    }
    .content h1 { font-size: 1.75rem; }
    .content h2 { font-size: 1.45rem; }
    .content h3 { font-size: 1.2rem; }
    .content p { margin-bottom: 1.25rem; }
    .content blockquote {
      border-left: 3px solid var(--accent);
      padding-left: 1.25rem;
      font-style: italic;
      color: var(--muted);
      margin: 1.5rem 0;
    }
    .content ul, .content ol {
      margin: 1rem 0 1.25rem 1.5rem;
    }
    .content li { margin-bottom: 0.35rem; }
    ul[data-type="taskList"] {
      list-style: none;
      margin-left: 0;
    }
    ul[data-type="taskList"] li {
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
    }
    .content code {
      background: var(--code-bg);
      padding: 0.15em 0.35em;
      border-radius: 4px;
      font-size: 0.88em;
      font-family: "JetBrains Mono", Menlo, Consolas, monospace;
    }
    .content pre {
      background: var(--code-bg);
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5rem 0;
    }
    .content pre code {
      background: transparent;
      padding: 0;
    }
    .content hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 2.5rem 0;
    }
    .content mark {
      background-color: #fde68a;
      color: #1e1b18;
      padding: 0.1em 0.25em;
      border-radius: 3px;
    }
    .content a {
      color: var(--accent);
      text-decoration: underline;
    }
    @media print {
      body { padding: 0; }
      header { margin-bottom: 1.5rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1 class="title">${escapeHtml(note.title || 'Untitled Note')}</h1>
      <div class="metadata">Saved with Writely &bull; ${dateStr}</div>
    </header>
    <main class="content">
      ${htmlBody}
    </main>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
