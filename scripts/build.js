/**
 * Build Script for lawofone.cl
 * 
 * Generates HTML files from JSON content and SASS
 * Supports multiple languages (EN, ES, PT)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LANGUAGES = ['en', 'es', 'pt'];
const BASE_LANG = 'en';
const I18N_DIR = path.join(__dirname, '..', 'i18n');
const DIST_DIR = path.join(__dirname, '..', 'dist');

// Load JSON file
function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.warn(`Warning: Could not load ${filePath}`);
    return null;
  }
}

// Process text with term markers and emphasis
function processText(text, glossary) {
  // Replace {term:id} or {term:id|text} with HTML
  text = text.replace(/\{term:([^}|]+)(?:\|([^}]+))?\}/g, (match, termId, customText) => {
    const displayText = customText || glossary[termId]?.title || termId;
    return `<span class="term" data-note="${termId}">${displayText}</span>`;
  });

  // Replace **text** with <strong>
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Replace *text* with <em>
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return text;
}

// Generate section HTML
function generateSection(section, glossary, isFirst = false) {
  let html = `                <section class="section" id="${section.id}">\n`;
  html += `                    <h2 class="sec-title">${section.title}</h2>\n`;

  section.content.forEach(block => {
    const processedText = processText(block.text, glossary);
    if (block.type === 'paragraph') {
      html += `                    <p>${processedText}</p>\n`;
    } else if (block.type === 'quote') {
      html += `                    <div class="quote">${processedText}</div>\n`;
    }
  });

  html += `                </section>\n`;
  return html;
}

// Generate chapter HTML
function generateChapter(chapter, glossary) {
  let html = `            <article class="chapter" id="${chapter.id}">\n`;
  html += `                <header class="ch-head">\n`;
  html += `                    <div class="ch-num">${chapter.numberText}</div>\n`;
  html += `                    <h1 class="ch-title">${chapter.title}</h1>\n`;
  html += `                </header>\n\n`;

  chapter.sections.forEach((section, index) => {
    html += generateSection(section, glossary, index === 0);
    if (index < chapter.sections.length - 1) {
      html += `\n                <div class="divider">· · ·</div>\n\n`;
    }
  });

  html += `            </article>\n`;
  return html;
}

// Generate glossary notes HTML
function generateNotes(glossary, ui) {
  let html = `        <aside class="notes" id="notes">\n`;
  html += `            <div class="notes-head">${ui.nav.notesPanel}</div>\n`;
  html += `            <div class="notes-empty" id="notes-empty">${ui.nav.notesEmpty.replace('class="term-hint"', 'style="color:var(--gold);border-bottom:1px dotted var(--gold-dim)"')}</div>\n\n`;

  for (const [id, term] of Object.entries(glossary)) {
    html += `            <div class="note" id="note-${id}">`;
    html += `<div class="note-title">${term.title}</div>`;
    html += `<div class="note-content">`;
    term.content.forEach(p => {
      // Process emphasis in glossary
      let processed = p.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      html += `<p>${processed}</p>`;
    });
    html += `</div></div>\n`;
  }

  html += `        </aside>\n`;
  return html;
}

// Generate navigation sidebar
function generateNav(chapters, ui, lang, allLangs) {
  let html = `        <nav class="nav" id="sidebar">\n`;
  html += `            <div class="nav-head">\n`;
  html += `                <div class="nav-title">${ui.siteTitle}</div>\n`;
  html += `                <div class="lang">`;

  // Language links
  allLangs.forEach((l, i) => {
    const href = l === BASE_LANG ? '/' : `/${l}/`;
    const active = l === lang ? ' class="active"' : '';
    html += `<a href="${href}"${active}>${l.toUpperCase()}</a>`;
    if (i < allLangs.length - 1) html += ' | ';
  });

  html += `</div>\n`;
  html += `            </div>\n`;
  html += `            <div class="nav-section">\n`;
  html += `                <div class="nav-section-title">${ui.parts.foundations}</div>\n`;

  // Chapter links
  chapters.forEach(ch => {
    html += `            <div class="nav-chapter-group" id="nav-group-${ch.id}">\n`;
    html += `                <div class="nav-chapter-header">\n`;
    html += `                    <a href="#${ch.id}" class="nav-link">${ui.nav.chapter} ${ch.number}: ${ch.title}</a>\n`;
    html += `                    <button class="nav-chapter-toggle" onclick="toggleChapter('${ch.id}')" aria-label="Toggle sections">▾</button>\n`;
    html += `                </div>\n`;
    html += `                <div class="nav-sections-list">\n`;
    ch.sections.forEach(sec => {
      html += `                    <a href="#${sec.id}" class="nav-link sub" onclick="if(window.innerWidth<=1100)closeAll()">${sec.title}</a>\n`;
    });
    html += `                </div>\n`;
    html += `            </div>\n`;
  });

  html += `            </div>\n`;

  // Feedback Link
  html += `            <div class="nav-footer-links">\n`;
  html += `                <a href="#feedback-section" class="nav-link feedback-link" onclick="if(window.innerWidth<=1100)closeAll()">✧ ${ui.footer.formSubmit}</a>\n`;
  html += `            </div>\n`;

  html += `            <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);font-size:0.75rem;color:var(--muted)">\n`;
  html += `                ${ui.meta.chapters}<br>${ui.meta.version}\n`;
  html += `            </div>\n`;
  html += `        </nav>\n`;
  return html;
}

// Generate footer HTML
function generateFooter(ui) {
  let html = `            <footer class="footer">\n`;
  html += `                <p>${ui.footer.draft} · ${ui.footer.date}</p>\n`;
  html += `                <div class="feedback" id="feedback-section">\n`;
  html += `                    <h3>${ui.footer.feedbackTitle}</h3>\n`;
  html += `                    <form class="feedback-form" id="feedback-form">\n`;
  html += `                        <input type="text" id="fb-name" placeholder="${ui.footer.formName}" required>\n`;
  html += `                        <textarea id="fb-msg" placeholder="${ui.footer.formMessage}" required></textarea>\n`;
  html += `                        <button type="submit" class="feedback-btn">${ui.footer.formSubmit}</button>\n`;
  html += `                    </form>\n`;
  html += `                    <div id="feedback-success" style="display:none; color:var(--gold); margin-top:1rem; font-family:var(--font-heading);">${ui.footer.formSuccess}</div>\n`;
  html += `                </div>\n`;
  html += `            </footer>\n`;
  return html;
}

// Generate full HTML page
function generatePage(lang, chapters, glossary, ui, allLangs, version) {
  const langCode = lang === BASE_LANG ? 'en' : lang;
  const canonicalPath = lang === BASE_LANG ? '/' : `/${lang}/`;

  let html = `<!DOCTYPE html>
<html lang="${langCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ui.bookTitle} | lawofone.cl</title>
    <meta name="description" content="${ui.description}">
    <meta name="robots" content="noindex, nofollow">
    <link rel="canonical" href="https://lawofone.cl${canonicalPath}">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-9LDPDW8V6E"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-9LDPDW8V6E');
    </script>
`;

  // Hreflang tags
  allLangs.forEach(l => {
    const href = l === BASE_LANG ? '/' : `/${l}/`;
    html += `    <link rel="alternate" hreflang="${l}" href="https://lawofone.cl${href}">\n`;
  });

  html += `    <meta property="og:type" content="book">
    <meta property="og:url" content="https://lawofone.cl${canonicalPath}">
    <meta property="og:title" content="${ui.bookTitle}">
    <meta property="og:description" content="${ui.description}">
    <meta property="og:locale" content="${langCode === 'en' ? 'en_US' : langCode === 'es' ? 'es_ES' : 'pt_BR'}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#0d0d0f">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✧</text></svg>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Spectral:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${lang === BASE_LANG ? '' : '../'}css/main.css?v=${version}">
${lang === BASE_LANG ? `    <script>
        (function() {
            if (document.referrer && document.referrer.indexOf(window.location.host) !== -1) return;
            var ln = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
            if (ln.indexOf('es') === 0) window.location.href = '/es/';
            else if (ln.indexOf('pt') === 0) window.location.href = '/pt/';
        })();
    </script>` : ''}
</head>
<body>
    <button class="toggle nav-toggle" onclick="toggleNav()">☰ ${ui.nav.index}</button>
    <button class="toggle notes-toggle" onclick="toggleNotes()">✧ ${ui.nav.notes}</button>
    <div class="overlay" id="overlay" onclick="closeAll()"></div>

    <div class="layout">
${generateNav(chapters, ui, lang, allLangs)}

        <main class="main">
`;

  // Add chapters
  chapters.forEach((ch, i) => {
    html += generateChapter(ch, glossary);
    if (i < chapters.length - 1) {
      html += '\n';
    }
  });

  html += '\n';
  html += generateFooter(ui);
  html += `        </main>\n\n`;
  html += generateNotes(glossary, ui);
  html += `    </div>

    <script>
        function toggleNav(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('overlay').classList.toggle('active');document.getElementById('notes').classList.remove('open')}
        function toggleNotes(){document.getElementById('notes').classList.toggle('open');document.getElementById('overlay').classList.toggle('active');document.getElementById('sidebar').classList.remove('open')}
        function closeAll(){document.getElementById('sidebar').classList.remove('open');document.getElementById('notes').classList.remove('open');document.getElementById('overlay').classList.remove('active')}
        function toggleChapter(id){const g=document.getElementById('nav-group-'+id);if(g)g.classList.toggle('expanded')}
        document.querySelectorAll('.term').forEach(t=>t.addEventListener('click',function(e){e.preventDefault();const noteId='note-'+this.dataset.note;const note=document.getElementById(noteId);if(!note)return;document.querySelectorAll('.term').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.note').forEach(n=>n.classList.remove('active'));document.getElementById('notes-empty').style.display='none';this.classList.add('active');note.classList.add('active');if(window.innerWidth<=1100){document.getElementById('notes').classList.add('open');document.getElementById('overlay').classList.add('active')}note.scrollIntoView({behavior:'smooth',block:'nearest'})}));
        document.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{if(window.innerWidth<=1100)closeAll()}));
        
        document.getElementById('feedback-form')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const name = document.getElementById('fb-name').value;
            const message = document.getElementById('fb-msg').value;
            const lang = document.documentElement.lang;
            
            btn.disabled = true;
            btn.style.opacity = '0.5';
            
            // Redirect to mailto
            const subject = encodeURIComponent(\`Feedback [\${lang.toUpperCase()}] - \${name}\`);
            const body = encodeURIComponent(\`Name: \${name}\\nLanguage: \${lang}\\n\\nMessage:\\n\${message}\`);
            window.location.href = \`mailto:feedback@lawofone.cl?subject=\${subject}&body=\${body}\`;
            
            setTimeout(() => {
                document.getElementById('feedback-form').style.display = 'none';
                document.getElementById('feedback-success').style.display = 'block';
            }, 1000);
        });
    </script>
</body>
</html>`;

  return html;
}

// Main build function
function build() {
  console.log('🔨 Building lawofone.cl...\n');

  // Ensure dist directories exist
  LANGUAGES.forEach(lang => {
    const dir = lang === BASE_LANG ? DIST_DIR : path.join(DIST_DIR, lang);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Ensure CSS directory exists
  const cssDir = path.join(DIST_DIR, 'css');
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }

  LANGUAGES.forEach(lang => {
    console.log(`📖 Building ${lang.toUpperCase()} version...`);

    // Load UI strings (fall back to EN if not available)
    let ui = loadJSON(path.join(I18N_DIR, lang, 'ui.json'));
    if (!ui) {
      ui = loadJSON(path.join(I18N_DIR, BASE_LANG, 'ui.json'));
    }

    // Load glossary (fall back to EN if not available)
    let glossary = loadJSON(path.join(I18N_DIR, lang, 'glossary.json'));
    if (!glossary) {
      glossary = loadJSON(path.join(I18N_DIR, BASE_LANG, 'glossary.json'));
    }

    // Load chapters (fall back to EN if not available)
    const chapters = [];
    const chaptersDir = path.join(I18N_DIR, lang, 'chapters');
    const defaultChaptersDir = path.join(I18N_DIR, BASE_LANG, 'chapters');

    // Get chapter files
    let chapterFiles = [];
    if (fs.existsSync(chaptersDir)) {
      chapterFiles = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.json')).sort();
    }
    if (chapterFiles.length === 0 && fs.existsSync(defaultChaptersDir)) {
      chapterFiles = fs.readdirSync(defaultChaptersDir).filter(f => f.endsWith('.json')).sort();
    }

    chapterFiles.forEach(file => {
      let chapter = loadJSON(path.join(chaptersDir, file));
      if (!chapter) {
        chapter = loadJSON(path.join(defaultChaptersDir, file));
      }
      if (chapter) {
        chapters.push(chapter);
      }
    });

    // Generate HTML
    const version = Date.now();
    const html = generatePage(lang, chapters, glossary, ui, LANGUAGES, version);

    // Write HTML file
    const outputPath = lang === BASE_LANG
      ? path.join(DIST_DIR, 'index.html')
      : path.join(DIST_DIR, lang, 'index.html');

    fs.writeFileSync(outputPath, html);
    console.log(`   ✅ ${outputPath}`);
  });

  // Copy og-image if exists
  const ogSrc = path.join(__dirname, '..', 'og-image.jpg');
  const ogDest = path.join(DIST_DIR, 'og-image.jpg');
  if (fs.existsSync(ogSrc)) {
    fs.copyFileSync(ogSrc, ogDest);
    console.log(`\n📷 Copied og-image.jpg`);
  }

  // Copy .htaccess if exists
  const htSrc = path.join(__dirname, '..', 'src', '.htaccess');
  const htDest = path.join(DIST_DIR, '.htaccess');
  if (fs.existsSync(htSrc)) {
    fs.copyFileSync(htSrc, htDest);
    console.log(`📄 Copied .htaccess`);
  }

  console.log('\n✨ Build complete!\n');
}

// Run build
build();
