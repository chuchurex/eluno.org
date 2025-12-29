/**
 * Build Script for lawofone.cl
 *
 * Generates HTML files from JSON content and SASS
 * Supports multiple languages (EN, ES, PT)
 *
 * Output structure:
 *   dist/
 *   ├── index.html          (TOC - English)
 *   ├── ch1/index.html      (Chapter 1 - English)
 *   ├── ch2/index.html      (Chapter 2 - English)
 *   ├── ...
 *   ├── es/
 *   │   ├── index.html      (TOC - Spanish)
 *   │   ├── ch1/index.html  (Chapter 1 - Spanish)
 *   │   └── ...
 *   └── pt/
 *       ├── index.html      (TOC - Portuguese)
 *       ├── ch1/index.html  (Chapter 1 - Portuguese)
 *       └── ...
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

// Process text with term markers, references, and emphasis
function processText(text, glossary, references) {
  // Replace {term:id} or {term:id|text} with HTML
  text = text.replace(/\{term:([^}|]+)(?:\|([^}]+))?\}/g, (match, termId, customText) => {
    const displayText = customText || glossary[termId]?.title || termId;
    return `<span class="term" data-note="${termId}">${displayText}</span>`;
  });

  // Replace {ref:id} with HTML (reference marker - superscript)
  if (references) {
    text = text.replace(/\{ref:([^}]+)\}/g, (match, refId) => {
      const ref = references[refId];
      if (ref) {
        return `<sup class="ref" data-ref="${refId}" title="${ref.title}">*</sup>`;
      }
      return match;
    });
  }

  // Replace **text** with <strong>
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Replace *text* with <em>
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return text;
}

// Generate section HTML
function generateSection(section, glossary, references) {
  let html = `                <section class="section" id="${section.id}">\n`;
  html += `                    <h2 class="sec-title">${section.title}</h2>\n`;

  section.content.forEach(block => {
    const processedText = processText(block.text, glossary, references);
    if (block.type === 'paragraph') {
      html += `                    <p>${processedText}</p>\n`;
    } else if (block.type === 'quote') {
      html += `                    <div class="quote">${processedText}</div>\n`;
    }
  });

  html += `                </section>\n`;
  return html;
}

// Generate chapter HTML (for chapter page)
function generateChapterContent(chapter, glossary, references) {
  let html = `            <article class="chapter" id="${chapter.id}">\n`;
  html += `                <header class="ch-head">\n`;
  html += `                    <div class="ch-num">${chapter.numberText}</div>\n`;
  html += `                    <h1 class="ch-title">${chapter.title}</h1>\n`;
  html += `                </header>\n\n`;

  chapter.sections.forEach((section, index) => {
    html += generateSection(section, glossary, references);
    if (index < chapter.sections.length - 1) {
      html += `\n                <div class="divider">· · ·</div>\n\n`;
    }
  });

  html += `            </article>\n`;
  return html;
}

// Generate glossary notes and references HTML
function generateNotes(glossary, references, ui) {
  let html = `        <aside class="notes" id="notes">\n`;
  html += `            <div class="notes-head">${ui.nav.notesPanel}</div>\n`;
  html += `            <div class="notes-empty" id="notes-empty">${ui.nav.notesEmpty.replace('class="term-hint"', 'style="color:var(--gold);border-bottom:1px dotted var(--gold-dim)"')}</div>\n\n`;

  // Glossary terms
  for (const [id, term] of Object.entries(glossary)) {
    html += `            <div class="note" id="note-${id}">`;
    html += `<div class="note-title">${term.title}</div>`;
    html += `<div class="note-content">`;
    term.content.forEach(p => {
      let processed = p.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      html += `<p>${processed}</p>`;
    });
    html += `</div></div>\n`;
  }

  // References
  if (references) {
    for (const [id, ref] of Object.entries(references)) {
      html += `            <div class="note ref-note" id="ref-${id}">`;
      html += `<div class="note-title"><span class="ref-icon">*</span> ${ref.title}</div>`;
      html += `<div class="note-content">`;
      html += `<p>${ref.summary}</p>`;
      if (ref.learnMore) {
        html += `<p class="ref-link"><a href="${ref.learnMore}" target="_blank" rel="noopener">Learn more ↗</a></p>`;
      }
      html += `</div></div>\n`;
    }
  }

  html += `        </aside>\n`;
  return html;
}

// Generate navigation sidebar for chapter page
function generateChapterNav(chapters, currentChapter, ui, lang, allLangs) {
  const langPrefix = lang === BASE_LANG ? '' : `/${lang}`;

  let html = `        <nav class="nav" id="sidebar">\n`;
  html += `            <div class="nav-head">\n`;
  html += `                <a href="${langPrefix}/" class="nav-title">${ui.siteTitle}</a>\n`;
  html += `                <div class="lang">`;

  // Language links - switch to same chapter in other language
  allLangs.forEach((l, i) => {
    const href = l === BASE_LANG ? `/ch${currentChapter.number}/` : `/${l}/ch${currentChapter.number}/`;
    const active = l === lang ? ' class="active"' : '';
    html += `<a href="${href}"${active}>${l.toUpperCase()}</a>`;
    if (i < allLangs.length - 1) html += ' | ';
  });

  html += `</div>\n`;
  html += `            </div>\n`;

  // Back to index link
  html += `            <div class="nav-back">\n`;
  html += `                <a href="${langPrefix}/" class="nav-link">← ${ui.nav.backToIndex}</a>\n`;
  html += `            </div>\n`;

  html += `            <div class="nav-section">\n`;

  // Chapter links
  chapters.forEach(ch => {
    const isActive = ch.id === currentChapter.id;
    const chapterHref = `${langPrefix}/ch${ch.number}/`;

    html += `            <div class="nav-chapter-group${isActive ? ' active' : ''}" id="nav-group-${ch.id}">\n`;
    html += `                <div class="nav-chapter-header">\n`;
    html += `                    <a href="${chapterHref}" class="nav-link${isActive ? ' current' : ''}">${ui.nav.chapter} ${ch.number}: ${ch.title}</a>\n`;

    if (isActive) {
      html += `                    <button class="nav-chapter-toggle" onclick="toggleChapter('${ch.id}')" aria-label="Toggle sections">▾</button>\n`;
    }

    html += `                </div>\n`;

    if (isActive) {
      html += `                <div class="nav-sections-list">\n`;
      ch.sections.forEach(sec => {
        html += `                    <a href="#${sec.id}" class="nav-link sub" onclick="if(window.innerWidth<=1100)closeAll()">${sec.title}</a>\n`;
      });
      html += `                </div>\n`;
    }

    html += `            </div>\n`;
  });

  html += `            </div>\n`;

  // Feedback Link
  html += `            <div class="nav-footer-links">\n`;
  html += `                <a href="#feedback-section" class="nav-link feedback-link" onclick="if(window.innerWidth<=1100)closeAll()">✧ ${ui.footer.formSubmit}</a>\n`;
  html += `            </div>\n`;

  // About link
  html += `            <div class="nav-footer-links">\n`;
  html += `                <a href="${langPrefix}/about/" class="nav-link">${ui.nav.about}</a>\n`;
  html += `            </div>\n`;

  html += `            <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);font-size:0.75rem;color:var(--muted)">\n`;
  html += `                ${ui.meta.version}\n`;
  html += `            </div>\n`;
  html += `        </nav>\n`;
  return html;
}

// Generate navigation sidebar for TOC page
function generateTocNav(chapters, ui, lang, allLangs) {
  const langPrefix = lang === BASE_LANG ? '' : `/${lang}`;

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

  // Chapter links
  chapters.forEach(ch => {
    const chapterHref = `${langPrefix}/ch${ch.number}/`;

    html += `            <div class="nav-chapter-group" id="nav-group-${ch.id}">\n`;
    html += `                <div class="nav-chapter-header">\n`;
    html += `                    <a href="${chapterHref}" class="nav-link">${ui.nav.chapter} ${ch.number}: ${ch.title}</a>\n`;
    html += `                </div>\n`;
    html += `            </div>\n`;
  });

  html += `            </div>\n`;

  // About link
  html += `            <div class="nav-footer-links">\n`;
  html += `                <a href="${langPrefix}/about/" class="nav-link">${ui.nav.about}</a>\n`;
  html += `            </div>\n`;

  html += `            <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);font-size:0.75rem;color:var(--muted)">\n`;
  html += `                ${ui.meta.version}\n`;
  html += `            </div>\n`;
  html += `        </nav>\n`;
  return html;
}

// Generate chapter navigation (prev/next)
function generateChapterPrevNext(chapters, currentIndex, ui, lang) {
  const langPrefix = lang === BASE_LANG ? '' : `/${lang}`;
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  let html = `            <nav class="chapter-nav" aria-label="Chapter navigation">\n`;

  if (prevChapter) {
    html += `                <a href="${langPrefix}/ch${prevChapter.number}/" class="chapter-nav-link prev">\n`;
    html += `                    <span class="chapter-nav-label">← ${ui.nav.previousChapter}</span>\n`;
    html += `                    <span class="chapter-nav-title">${prevChapter.title}</span>\n`;
    html += `                </a>\n`;
  } else {
    html += `                <a href="${langPrefix}/" class="chapter-nav-link prev">\n`;
    html += `                    <span class="chapter-nav-label">← ${ui.nav.backToIndex}</span>\n`;
    html += `                    <span class="chapter-nav-title">${ui.nav.tableOfContents}</span>\n`;
    html += `                </a>\n`;
  }

  if (nextChapter) {
    html += `                <a href="${langPrefix}/ch${nextChapter.number}/" class="chapter-nav-link next">\n`;
    html += `                    <span class="chapter-nav-label">${ui.nav.nextChapter} →</span>\n`;
    html += `                    <span class="chapter-nav-title">${nextChapter.title}</span>\n`;
    html += `                </a>\n`;
  } else {
    html += `                <span class="chapter-nav-link next disabled"></span>\n`;
  }

  html += `            </nav>\n`;
  return html;
}

// Generate footer HTML
function generateFooter(ui, showFeedback = true) {
  let html = `            <footer class="footer">\n`;
  html += `                <p>${ui.footerVersion}</p>\n`;

  if (showFeedback) {
    html += `                <div class="feedback" id="feedback-section">\n`;
    html += `                    <h3>${ui.footer.feedbackTitle}</h3>\n`;
    html += `                    <form class="feedback-form" id="feedback-form">\n`;
    html += `                        <input type="text" id="fb-name" placeholder="${ui.footer.formName}" required>\n`;
    html += `                        <input type="email" id="fb-email" placeholder="${ui.footer.formEmail}" required>\n`;
    html += `                        <textarea id="fb-msg" placeholder="${ui.footer.formMessage}" required></textarea>\n`;
    html += `                        <button type="submit" class="feedback-btn">${ui.footer.formSubmit}</button>\n`;
    html += `                    </form>\n`;
    html += `                    <div id="feedback-success" style="display:none; color:var(--gold); margin-top:1rem; font-family:var(--font-heading);">${ui.footer.formSuccess}</div>\n`;
    html += `                </div>\n`;
  }

  html += `            </footer>\n`;
  return html;
}

// Generate HTML head section
// pagePath is the path without language prefix (e.g., "/", "/ch1/")
function generateHead(lang, ui, allLangs, version, pagePath, cssPath, pageTitle, includeRedirect = false) {
  const langCode = lang === BASE_LANG ? 'en' : lang;
  // Full canonical path includes language prefix for non-base languages
  const canonicalPath = lang === BASE_LANG ? pagePath : `/${lang}${pagePath}`;

  let html = `<!DOCTYPE html>
<html lang="${langCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle} | lawofone.cl</title>
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

  // Hreflang tags - pagePath is used to build correct URLs for each language
  allLangs.forEach(l => {
    const href = l === BASE_LANG ? pagePath : `/${l}${pagePath}`;
    html += `    <link rel="alternate" hreflang="${l}" href="https://lawofone.cl${href}">\n`;
  });

  html += `    <meta property="og:type" content="book">
    <meta property="og:url" content="https://lawofone.cl${canonicalPath}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${ui.description}">
    <meta property="og:locale" content="${langCode === 'en' ? 'en_US' : langCode === 'es' ? 'es_ES' : 'pt_BR'}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#0d0d0f">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✧</text></svg>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Spectral:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${cssPath}css/main.css?v=${version}">
`;

  if (includeRedirect && lang === BASE_LANG) {
    html += `    <script>
        (function() {
            if (document.referrer && document.referrer.indexOf(window.location.host) !== -1) return;
            var ln = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
            if (ln.indexOf('es') === 0) window.location.href = '/es/';
            else if (ln.indexOf('pt') === 0) window.location.href = '/pt/';
        })();
    </script>
`;
  }

  html += `</head>\n`;
  return html;
}

// Generate common scripts
function generateScripts() {
  return `    <script>
        function toggleNav(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('overlay').classList.toggle('active');document.getElementById('notes').classList.remove('open')}
        function toggleNotes(){document.getElementById('notes').classList.toggle('open');document.getElementById('overlay').classList.toggle('active');document.getElementById('sidebar').classList.remove('open')}
        function closeAll(){document.getElementById('sidebar').classList.remove('open');document.getElementById('notes').classList.remove('open');document.getElementById('overlay').classList.remove('active')}
        function toggleChapter(id){const g=document.getElementById('nav-group-'+id);if(g)g.classList.toggle('expanded')}
        document.querySelectorAll('.term').forEach(t=>t.addEventListener('click',function(e){e.preventDefault();const noteId='note-'+this.dataset.note;const note=document.getElementById(noteId);if(!note)return;document.querySelectorAll('.term').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.ref').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.note').forEach(n=>n.classList.remove('active'));document.getElementById('notes-empty').style.display='none';this.classList.add('active');note.classList.add('active');if(window.innerWidth<=1100){document.getElementById('notes').classList.add('open');document.getElementById('overlay').classList.add('active')}note.scrollIntoView({behavior:'smooth',block:'nearest'})}));
        document.querySelectorAll('.ref').forEach(r=>r.addEventListener('click',function(e){e.preventDefault();const refId='ref-'+this.dataset.ref;const note=document.getElementById(refId);if(!note)return;document.querySelectorAll('.term').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.ref').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.note').forEach(n=>n.classList.remove('active'));document.getElementById('notes-empty').style.display='none';this.classList.add('active');note.classList.add('active');if(window.innerWidth<=1100){document.getElementById('notes').classList.add('open');document.getElementById('overlay').classList.add('active')}note.scrollIntoView({behavior:'smooth',block:'nearest'})}));
        document.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{if(window.innerWidth<=1100)closeAll()}));

        document.getElementById('feedback-form')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const name = document.getElementById('fb-name').value;
            const email = document.getElementById('fb-email').value;
            const message = document.getElementById('fb-msg').value;
            const lang = document.documentElement.lang;

            btn.disabled = true;
            btn.style.opacity = '0.5';

            fetch('/api/send-feedback.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message, lang })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('feedback-form').style.display = 'none';
                    document.getElementById('feedback-success').style.display = 'block';
                } else {
                    alert('Error: ' + (data.error || 'Unknown error'));
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }
            })
            .catch(err => {
                alert('Connection error. Please try again later.');
                btn.disabled = false;
                btn.style.opacity = '1';
            });
        });
    </script>`;
}

// Generate TOC (Table of Contents) page
function generateTocPage(lang, chapters, glossary, references, ui, allLangs, version) {
  const langPrefix = lang === BASE_LANG ? '' : `/${lang}`;
  const pagePath = '/'; // Path without language prefix
  const cssPath = lang === BASE_LANG ? '' : '../';

  let html = generateHead(lang, ui, allLangs, version, pagePath, cssPath, ui.bookTitle, true);

  html += `<body>
    <button class="toggle nav-toggle" onclick="toggleNav()">☰ ${ui.nav.index}</button>
    <button class="toggle notes-toggle" onclick="toggleNotes()">✧ ${ui.nav.notes}</button>
    <div class="overlay" id="overlay" onclick="closeAll()"></div>

    <div class="layout">
        <main class="main">
            <header class="toc-header">
                <h1 class="toc-title">${ui.bookTitle}</h1>
                <p class="toc-subtitle">${ui.description}</p>
            </header>

            <section class="introduction">
                <h2 class="intro-title">${ui.introduction.title}</h2>
                ${ui.introduction.content.map(p => `<p class="intro-text">${p}</p>`).join('\n                ')}
            </section>

            <section class="toc-section">
                <div class="toc-chapters">
`;

  chapters.forEach(ch => {
    const chapterHref = `${langPrefix}/ch${ch.number}/`;
    html += `                    <a href="${chapterHref}" class="toc-chapter">\n`;
    html += `                        <span class="toc-chapter-num">${ch.numberText}</span>\n`;
    html += `                        <span class="toc-chapter-title">${ch.title}</span>\n`;
    html += `                        <span class="toc-chapter-arrow">→</span>\n`;
    html += `                    </a>\n`;
  });

  html += `                </div>
            </section>

`;
  html += generateFooter(ui, false);
  html += `        </main>\n\n`;
  html += generateTocNav(chapters, ui, lang, allLangs);
  html += '\n';
  html += generateNotes(glossary, references, ui);
  html += `    </div>

${generateScripts()}
</body>
</html>`;

  return html;
}

// Generate About page content
function generateAboutContent(about) {
  let html = `            <article class="chapter about-page">\n`;
  html += `                <header class="ch-head">\n`;
  html += `                    <h1 class="ch-title">${about.title}</h1>\n`;
  html += `                    <p class="about-subtitle">${about.subtitle}</p>\n`;
  html += `                </header>\n\n`;

  about.sections.forEach((section, index) => {
    html += `                <section class="section" id="${section.id}">\n`;
    html += `                    <h2 class="sec-title">${section.icon ? section.icon + ' ' : ''}${section.title}</h2>\n`;

    section.content.forEach(block => {
      if (block.type === 'paragraph') {
        let text = block.text;
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html += `                    <p>${text}</p>\n`;
      } else if (block.type === 'quote') {
        let text = block.text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html += `                    <div class="quote">${text}</div>\n`;
      } else if (block.type === 'timeline') {
        html += `                    <div class="about-timeline">\n`;
        block.items.forEach(item => {
          html += `                        <div class="timeline-item"><span class="timeline-time">${item.time}</span><span class="timeline-text">${item.text}</span></div>\n`;
        });
        html += `                    </div>\n`;
      } else if (block.type === 'stats') {
        html += `                    <div class="about-stats">\n`;
        block.items.forEach(item => {
          html += `                        <div class="stat"><div class="stat-number">${item.number}</div><div class="stat-label">${item.label}</div></div>\n`;
        });
        html += `                    </div>\n`;
      } else if (block.type === 'funfact') {
        html += `                    <div class="about-funfact">\n`;
        html += `                        <div class="funfact-title">${block.title}</div>\n`;
        html += `                        <p>${block.text}</p>\n`;
        html += `                    </div>\n`;
      } else if (block.type === 'credits') {
        html += `                    <div class="about-credits">\n`;
        block.items.forEach(item => {
          const roleText = item.link
            ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.role}</a>`
            : item.role;
          html += `                        <p><strong>${roleText}:</strong> ${item.contribution}</p>\n`;
        });
        html += `                    </div>\n`;
      }
    });

    html += `                </section>\n`;
    if (index < about.sections.length - 1) {
      html += `\n                <div class="divider">· · ·</div>\n\n`;
    }
  });

  html += `\n                <footer class="about-footer">\n`;
  html += `                    <p>${about.footer.updated}</p>\n`;
  html += `                    <p>${about.footer.madeWith}</p>\n`;
  html += `                </footer>\n`;
  html += `            </article>\n`;
  return html;
}

// Generate navigation sidebar for About page
function generateAboutNav(chapters, about, ui, lang, allLangs) {
  const langPrefix = lang === BASE_LANG ? '' : `/${lang}`;

  let html = `        <nav class="nav" id="sidebar">\n`;
  html += `            <div class="nav-head">\n`;
  html += `                <a href="${langPrefix}/" class="nav-title">${ui.siteTitle}</a>\n`;
  html += `                <div class="lang">`;

  // Language links - switch to about in other language
  allLangs.forEach((l, i) => {
    const href = l === BASE_LANG ? '/about/' : `/${l}/about/`;
    const active = l === lang ? ' class="active"' : '';
    html += `<a href="${href}"${active}>${l.toUpperCase()}</a>`;
    if (i < allLangs.length - 1) html += ' | ';
  });

  html += `</div>\n`;
  html += `            </div>\n`;

  // Back to index link
  html += `            <div class="nav-back">\n`;
  html += `                <a href="${langPrefix}/" class="nav-link">← ${ui.nav.backToIndex}</a>\n`;
  html += `            </div>\n`;

  html += `            <div class="nav-section">\n`;
  html += `                <div class="nav-section-title">${about.title}</div>\n`;

  // Section links for about page
  about.sections.forEach(sec => {
    html += `                <a href="#${sec.id}" class="nav-link sub" onclick="if(window.innerWidth<=1100)closeAll()">${sec.icon ? sec.icon + ' ' : ''}${sec.title}</a>\n`;
  });

  html += `            </div>\n`;

  // Chapters section
  html += `            <div class="nav-section" style="margin-top:1.5rem">\n`;
  chapters.forEach(ch => {
    const chapterHref = `${langPrefix}/ch${ch.number}/`;
    html += `                <a href="${chapterHref}" class="nav-link">${ui.nav.chapter} ${ch.number}: ${ch.title}</a>\n`;
  });
  html += `            </div>\n`;

  html += `            <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);font-size:0.75rem;color:var(--muted)">\n`;
  html += `                ${ui.meta.version}\n`;
  html += `            </div>\n`;
  html += `        </nav>\n`;
  return html;
}

// Generate About page
function generateAboutPage(lang, chapters, about, glossary, ui, allLangs, version) {
  const langPrefix = lang === BASE_LANG ? '' : `/${lang}`;
  const pagePath = '/about/';
  const cssPath = lang === BASE_LANG ? '../' : '../../';
  const pageTitle = about.title;

  let html = generateHead(lang, ui, allLangs, version, pagePath, cssPath, pageTitle, false);

  html += `<body>
    <button class="toggle nav-toggle" onclick="toggleNav()">☰ ${ui.nav.index}</button>
    <button class="toggle notes-toggle" onclick="toggleNotes()">✧ ${ui.nav.notes}</button>
    <div class="overlay" id="overlay" onclick="closeAll()"></div>

    <div class="layout">
        <main class="main">
`;

  html += generateAboutContent(about);
  html += `        </main>\n\n`;
  html += generateAboutNav(chapters, about, ui, lang, allLangs);
  html += '\n';
  html += generateNotes(glossary, null, ui);
  html += `    </div>

${generateScripts()}
</body>
</html>`;

  return html;
}

// Generate individual chapter page
function generateChapterPage(lang, chapters, chapterIndex, glossary, references, ui, allLangs, version) {
  const chapter = chapters[chapterIndex];
  const langPrefix = lang === BASE_LANG ? '' : `/${lang}`;
  const pagePath = `/ch${chapter.number}/`; // Path without language prefix
  const cssPath = lang === BASE_LANG ? '../' : '../../';
  const pageTitle = `${ui.nav.chapter} ${chapter.number}: ${chapter.title}`;

  let html = generateHead(lang, ui, allLangs, version, pagePath, cssPath, pageTitle, false);

  html += `<body>
    <button class="toggle nav-toggle" onclick="toggleNav()">☰ ${ui.nav.index}</button>
    <button class="toggle notes-toggle" onclick="toggleNotes()">✧ ${ui.nav.notes}</button>
    <div class="overlay" id="overlay" onclick="closeAll()"></div>

    <div class="layout">
        <main class="main">
`;

  html += generateChapterContent(chapter, glossary, references);
  html += '\n';
  html += generateChapterPrevNext(chapters, chapterIndex, ui, lang);
  html += '\n';
  html += generateFooter(ui, true);
  html += `        </main>\n\n`;
  html += generateChapterNav(chapters, chapter, ui, lang, allLangs);
  html += '\n';
  html += generateNotes(glossary, references, ui);
  html += `    </div>

${generateScripts()}
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

  const version = Date.now();

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

    // Load references (fall back to EN if not available)
    let references = loadJSON(path.join(I18N_DIR, lang, 'references.json'));
    if (!references) {
      references = loadJSON(path.join(I18N_DIR, BASE_LANG, 'references.json'));
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

    // Generate TOC page
    const tocHtml = generateTocPage(lang, chapters, glossary, references, ui, LANGUAGES, version);
    const tocPath = lang === BASE_LANG
      ? path.join(DIST_DIR, 'index.html')
      : path.join(DIST_DIR, lang, 'index.html');
    fs.writeFileSync(tocPath, tocHtml);
    console.log(`   ✅ ${tocPath}`);

    // Generate individual chapter pages
    chapters.forEach((chapter, index) => {
      const chapterDir = lang === BASE_LANG
        ? path.join(DIST_DIR, `ch${chapter.number}`)
        : path.join(DIST_DIR, lang, `ch${chapter.number}`);

      if (!fs.existsSync(chapterDir)) {
        fs.mkdirSync(chapterDir, { recursive: true });
      }

      const chapterHtml = generateChapterPage(lang, chapters, index, glossary, references, ui, LANGUAGES, version);
      const chapterPath = path.join(chapterDir, 'index.html');
      fs.writeFileSync(chapterPath, chapterHtml);
      console.log(`   ✅ ${chapterPath}`);
    });

    // Generate About page
    const about = loadJSON(path.join(I18N_DIR, lang, 'about.json'));
    if (about) {
      const aboutDir = lang === BASE_LANG
        ? path.join(DIST_DIR, 'about')
        : path.join(DIST_DIR, lang, 'about');

      if (!fs.existsSync(aboutDir)) {
        fs.mkdirSync(aboutDir, { recursive: true });
      }

      const aboutHtml = generateAboutPage(lang, chapters, about, glossary, ui, LANGUAGES, version);
      const aboutPath = path.join(aboutDir, 'index.html');
      fs.writeFileSync(aboutPath, aboutHtml);
      console.log(`   ✅ ${aboutPath}`);
    }
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

  // Copy API folder
  const apiSrc = path.join(__dirname, '..', 'src', 'api');
  const apiDest = path.join(DIST_DIR, 'api');
  if (fs.existsSync(apiSrc)) {
    if (!fs.existsSync(apiDest)) {
      fs.mkdirSync(apiDest, { recursive: true });
    }
    const files = fs.readdirSync(apiSrc);
    files.forEach(file => {
      fs.copyFileSync(path.join(apiSrc, file), path.join(apiDest, file));
    });
    console.log(`🔌 Copied API files`);
  }

  console.log('\n✨ Build complete!\n');
}

// Run build
build();
