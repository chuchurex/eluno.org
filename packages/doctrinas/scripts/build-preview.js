/**
 * Build Preview Script for Doctrinas
 *
 * Generates a single HTML page with all markdown drafts
 * for review purposes before converting to final JSON format.
 *
 * Usage: node scripts/build-preview.js
 *
 * Input: borradores/*.md
 * Output: dist/index.html (single page with all chapters)
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const CORE_ROOT = path.join(__dirname, '..', '..', 'core');

require('dotenv').config({ path: path.join(PROJECT_ROOT, '.env') });

const DOMAIN = process.env.DOMAIN || 'doctrinas.eluno.org';
const BORRADORES_DIR = path.join(PROJECT_ROOT, 'borradores');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

/**
 * Simple Markdown to HTML converter
 * Supports: headings, paragraphs, bold, italic, blockquotes, lists, hr
 */
function markdownToHtml(markdown) {
  let html = markdown;

  // Escape HTML entities first (but not our markdown)
  html = html.replace(/&/g, '&amp;');

  // Headings (must be at start of line)
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Horizontal rule
  html = html.replace(/^---+$/gm, '<hr class="section-divider">');
  html = html.replace(/^\*\*\*+$/gm, '<hr class="section-divider">');

  // Blockquotes (lines starting with >)
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Bold and italic
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Paragraphs: wrap non-empty lines that aren't already wrapped
  const lines = html.split('\n');
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      processedLines.push('');
      continue;
    }

    // Skip lines that are already HTML elements
    if (line.startsWith('<h') ||
        line.startsWith('<blockquote') ||
        line.startsWith('<ul') ||
        line.startsWith('<li') ||
        line.startsWith('<hr') ||
        line.startsWith('</')) {
      processedLines.push(line);
      continue;
    }

    // Wrap in paragraph
    processedLines.push(`<p>${line}</p>`);
  }

  html = processedLines.join('\n');

  // Clean up extra newlines
  html = html.replace(/\n{3,}/g, '\n\n');

  return html;
}

/**
 * Extract title from markdown (first # heading or filename)
 */
function extractTitle(markdown, filename) {
  const match = markdown.match(/^# (.+)$/m);
  if (match) {
    return match[1];
  }
  // Fallback to filename without extension
  return filename.replace(/\.md$/, '').replace(/^\d+-/, '');
}

/**
 * Extract chapter number from filename (e.g., "01-titulo.md" -> 1)
 */
function extractChapterNumber(filename) {
  const match = filename.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Generate the preview HTML page
 */
function generatePreviewHtml(chapters) {
  const now = new Date().toLocaleString('es-ES', {
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const version = Date.now();

  let tocHtml = '';
  let contentHtml = '';

  chapters.forEach((chapter, index) => {
    const chapterId = `chapter-${chapter.number || index + 1}`;

    // TOC entry
    tocHtml += `
      <a href="#${chapterId}" class="toc-item">
        <span class="toc-num">${chapter.number || index + 1}</span>
        <span class="toc-title">${chapter.title}</span>
      </a>`;

    // Chapter content
    contentHtml += `
      <article class="chapter" id="${chapterId}">
        <header class="chapter-header">
          <div class="chapter-num">Capítulo ${chapter.number || index + 1}</div>
          <h1 class="chapter-title">${chapter.title}</h1>
          <div class="chapter-meta">
            <span class="file-name">${chapter.filename}</span>
          </div>
        </header>
        <div class="chapter-content">
          ${chapter.content}
        </div>
      </article>
      <hr class="chapter-separator">`;
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Doctrinas - Preview de Borradores | ${DOMAIN}</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preload" href="/fonts/cormorant-garamond-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/spectral-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/fonts/fonts.css">
  <link rel="stylesheet" href="/css/main.css?v=${version}">
  <style>
    /* Preview-specific styles */
    .preview-banner {
      background: linear-gradient(135deg, #2a1f1a 0%, #1a1512 100%);
      border-bottom: 2px solid var(--gold-dim, #8b7355);
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .preview-banner h1 {
      margin: 0;
      font-size: 1.25rem;
      color: var(--gold, #d4af37);
    }

    .preview-banner .meta {
      font-size: 0.85rem;
      color: var(--text-dim, #999);
    }

    .preview-banner .status {
      background: #4a3728;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #f0c674;
    }

    .preview-container {
      display: grid;
      grid-template-columns: 280px 1fr;
      min-height: calc(100vh - 60px);
    }

    @media (max-width: 900px) {
      .preview-container {
        grid-template-columns: 1fr;
      }
      .preview-toc {
        position: relative;
        max-height: 300px;
        overflow-y: auto;
      }
    }

    .preview-toc {
      background: var(--bg-alt, #0f0d0b);
      padding: 1.5rem;
      border-right: 1px solid var(--border, #2a2520);
      position: sticky;
      top: 60px;
      height: calc(100vh - 60px);
      overflow-y: auto;
    }

    .preview-toc h2 {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--gold-dim, #8b7355);
      margin-bottom: 1rem;
    }

    .toc-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.5rem 0;
      text-decoration: none;
      color: var(--text, #e0e0e0);
      border-bottom: 1px solid var(--border, #2a2520);
      transition: color 0.2s;
    }

    .toc-item:hover {
      color: var(--gold, #d4af37);
    }

    .toc-num {
      color: var(--gold-dim, #8b7355);
      font-weight: 600;
      min-width: 1.5rem;
    }

    .preview-content {
      padding: 2rem 3rem;
      max-width: 900px;
    }

    .chapter {
      margin-bottom: 3rem;
    }

    .chapter-header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border, #2a2520);
    }

    .chapter-num {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--gold-dim, #8b7355);
      margin-bottom: 0.5rem;
    }

    .chapter-title {
      font-size: 2rem;
      color: var(--gold, #d4af37);
      margin: 0 0 0.5rem 0;
    }

    .chapter-meta {
      font-size: 0.8rem;
      color: var(--text-dim, #666);
    }

    .file-name {
      background: var(--bg-alt, #1a1512);
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      font-family: monospace;
    }

    .chapter-content {
      line-height: 1.8;
    }

    .chapter-content h2 {
      color: var(--gold, #d4af37);
      margin-top: 2rem;
      font-size: 1.4rem;
    }

    .chapter-content h3 {
      color: var(--text, #e0e0e0);
      margin-top: 1.5rem;
      font-size: 1.2rem;
    }

    .chapter-content p {
      margin: 1rem 0;
    }

    .chapter-content blockquote {
      border-left: 3px solid var(--gold-dim, #8b7355);
      padding-left: 1.5rem;
      margin: 1.5rem 0;
      font-style: italic;
      color: var(--text-dim, #bbb);
    }

    .chapter-content ul {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }

    .chapter-content li {
      margin: 0.5rem 0;
    }

    .chapter-separator {
      border: none;
      border-top: 2px dashed var(--border, #2a2520);
      margin: 3rem 0;
    }

    .section-divider {
      border: none;
      text-align: center;
      margin: 2rem 0;
    }

    .section-divider::before {
      content: "· · ·";
      color: var(--gold-dim, #8b7355);
      letter-spacing: 0.5em;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-dim, #666);
    }

    .empty-state h2 {
      color: var(--gold, #d4af37);
    }

    .empty-state code {
      background: var(--bg-alt, #1a1512);
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <header class="preview-banner">
    <div>
      <h1>Doctrinas - Preview de Borradores</h1>
      <div class="meta">Generado: ${now}</div>
    </div>
    <div class="status">${chapters.length} capítulos cargados</div>
  </header>

  <div class="preview-container">
    <nav class="preview-toc">
      <h2>Contenido</h2>
      ${chapters.length > 0 ? tocHtml : '<p class="empty">Sin capítulos</p>'}
    </nav>

    <main class="preview-content">
      ${chapters.length > 0 ? contentHtml : `
        <div class="empty-state">
          <h2>No hay borradores</h2>
          <p>Coloca tus archivos <code>.md</code> en la carpeta:</p>
          <p><code>packages/doctrinas/borradores/</code></p>
          <p>Formato de nombre sugerido: <code>01-titulo-capitulo.md</code></p>
          <p>Luego ejecuta: <code>npm run build</code></p>
        </div>
      `}
    </main>
  </div>
</body>
</html>`;
}

/**
 * Main build function
 */
function build() {
  console.log(`\n📝 Building preview for ${DOMAIN}...\n`);

  // Ensure dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  // Ensure borradores directory exists
  if (!fs.existsSync(BORRADORES_DIR)) {
    fs.mkdirSync(BORRADORES_DIR, { recursive: true });
    console.log(`📁 Created borradores/ directory`);
  }

  // Read all markdown files
  const files = fs.readdirSync(BORRADORES_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  console.log(`📄 Found ${files.length} markdown files`);

  // Process each file
  const chapters = files.map(filename => {
    const filepath = path.join(BORRADORES_DIR, filename);
    const markdown = fs.readFileSync(filepath, 'utf8');
    const title = extractTitle(markdown, filename);
    const number = extractChapterNumber(filename);
    const content = markdownToHtml(markdown);

    console.log(`   ✅ ${filename} → "${title}"`);

    return {
      filename,
      title,
      number,
      content
    };
  });

  // Sort by chapter number
  chapters.sort((a, b) => a.number - b.number);

  // Generate HTML
  const html = generatePreviewHtml(chapters);
  const outputPath = path.join(DIST_DIR, 'index.html');
  fs.writeFileSync(outputPath, html);
  console.log(`\n📄 Generated ${outputPath}`);

  // Copy CSS directory
  const cssDir = path.join(DIST_DIR, 'css');
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }

  // Copy fonts
  const fontsSrc = path.join(CORE_ROOT, 'fonts');
  const fontsDest = path.join(DIST_DIR, 'fonts');
  if (fs.existsSync(fontsSrc)) {
    if (!fs.existsSync(fontsDest)) {
      fs.mkdirSync(fontsDest, { recursive: true });
    }
    const fontFiles = fs.readdirSync(fontsSrc).filter(f => f.endsWith('.woff2') || f.endsWith('.css'));
    fontFiles.forEach(file => {
      fs.copyFileSync(path.join(fontsSrc, file), path.join(fontsDest, file));
    });
    console.log(`🔤 Copied ${fontFiles.length} font files`);
  }

  // Copy _headers
  const headersTemplate = path.join(CORE_ROOT, '_headers.template');
  const headersDest = path.join(DIST_DIR, '_headers');
  if (fs.existsSync(headersTemplate)) {
    let headersContent = fs.readFileSync(headersTemplate, 'utf8');
    headersContent = headersContent.replace(/\{\{DOMAIN\}\}/g, DOMAIN);
    fs.writeFileSync(headersDest, headersContent);
    console.log(`📋 Generated _headers`);
  }

  console.log(`\n✨ Preview build complete!`);
  console.log(`\n🚀 Run "npm run dev" to preview at http://localhost:3007\n`);
}

// Run
build();
