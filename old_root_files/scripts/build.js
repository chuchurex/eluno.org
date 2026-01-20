/**
 * Build Script for eluno.org (formerly lawofone.cl)
 *
 * Generates HTML files from JSON content and SASS
 * Supports multiple languages (EN, ES, PT)
 *
 * Output structure (SEO-friendly URLs):
 *   dist/
 *   ├── index.html              (TOC - English)
 *   ├── the-one/index.html      (Chapter 1 - English)
 *   ├── the-harvest/index.html  (Chapter 7 - English)
 *   ├── ...
 *   ├── es/
 *   │   ├── index.html          (TOC - Spanish)
 *   │   ├── el-uno/index.html   (Chapter 1 - Spanish)
 *   │   └── ...
 *   └── pt/
 *       ├── index.html          (TOC - Portuguese)
 *       ├── o-um/index.html     (Chapter 1 - Portuguese)
 *       └── ...
 *
 * Redirects from old /ch{n}/ URLs are generated in _redirects
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Domain Configuration (from .env)
const DOMAIN = process.env.DOMAIN || 'lawofone.cl';
const STATIC_SUBDOMAIN = process.env.STATIC_SUBDOMAIN || 'static';
const SITE_URL = `https://${DOMAIN}`;
const STATIC_BASE_URL = `https://${STATIC_SUBDOMAIN}.${DOMAIN}`;

// Configuration
const LANGUAGES = ['en', 'es', 'pt'];
const BASE_LANG = 'en';
const I18N_DIR = path.join(__dirname, '..', 'i18n');
const DIST_DIR = path.join(__dirname, '..', 'dist');

// Load chapter titles/slugs for SEO-friendly URLs
const CHAPTER_TITLES = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'v03_package', 'instructions', 'TITULOS_CAPITULOS.json'), 'utf8')
);

/**
 * Get the slug for a chapter URL (SEO-friendly)
 * @param {string} lang - Language code (en, es, pt)
 * @param {number} chapterNum - Chapter number (1-16)
 * @returns {string} - Slug without number prefix (e.g., "the-one", "el-uno")
 */
function getChapterSlug(lang, chapterNum) {
  const chapter = CHAPTER_TITLES.chapters.find(ch => ch.number === chapterNum);
  if (!chapter) return `ch${chapterNum}`;
  const filename = chapter[lang]?.filename || chapter.en?.filename || `ch${chapterNum}`;
  // Remove the number prefix (e.g., "01-the-one" -> "the-one")
  return filename.replace(/^\d+-/, '');
}

/**
 * Get the full chapter path for a language
 * @param {string} lang - Language code
 * @param {number} chapterNum - Chapter number
 * @returns {string} - Full path (e.g., "/the-one/", "/es/el-uno/")
 */
function getChapterPath(lang, chapterNum) {
  const slug = getChapterSlug(lang, chapterNum);
  return lang === BASE_LANG ? `/${slug}/` : `/${lang}/${slug}/`;
}


// Load JSON file
function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.warn(`Warning: Could not load ${filePath}`);
    return null;
  }
}

// Resolve asset URL (local or external)
function resolveUrl(url) {
  if (!url) return '';
  if (url.startsWith('/') && !url.startsWith('//')) {
    return STATIC_BASE_URL + url;
  }
  return url;
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
      // Only render if reference exists AND has a summary
      if (ref && ref.summary) {
        return `<sup class="ref" data-ref="${refId}" title="${ref.title}">&#42;</sup>`;
      }
      // If reference exists but has no summary, hide it (return empty string)
      if (ref) return '';

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

// Generate media toolbar HTML (Audio, PDF) - Inline with accordion
function generateMediaToolbar(chapterNum, media, ui) {
  if (!media || !ui.media) return '';

  const chapterMedia = media[String(chapterNum)];
  if (!chapterMedia) return '';

  const hasPdf = !!chapterMedia.pdf;
  const hasAudio = !!chapterMedia.audio;

  // If nothing available, return empty
  if (!hasPdf && !hasAudio) return '';

  let html = '';

  // SVG icons - 22px size
  const svgPdf = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zm-2 14l-4-4h2.5v-4h3v4H15l-4 4z"/></svg>`;
  const svgAudio = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;

  // Get labels (with fallbacks)
  const labelPdf = ui.media.labelPdf || 'PDF';
  const labelAudio = ui.media.labelAudio || 'MP3';

  // Icon bar - order: MP3, PDF
  html += `                <div class="ch-media-bar">\n`;

  // Audio MP3: accordion toggle and panel
  if (hasAudio) {
    const audioUrl = resolveUrl(chapterMedia.audio);
    html += `                    <div class="ch-media-audio-panel" id="audio-panel-${chapterNum}">\n`;
    html += `                        <audio src="${audioUrl}" controls preload="none"></audio>\n`;
    html += `                    </div>\n`;
    html += `                    <button class="ch-media-icon" onclick="toggleAudio('${chapterNum}')" title="${ui.media.downloadAudio || 'Descargar audio'}" data-audio-btn="${chapterNum}">${svgAudio}<span class="ch-media-label">${labelAudio}</span></button>\n`;
  }

  // PDF: direct download link
  if (hasPdf) {
    const pdfUrl = resolveUrl(chapterMedia.pdf);
    html += `                    <a href="${pdfUrl}" class="ch-media-icon" title="${ui.media.downloadPdf}" download>${svgPdf}<span class="ch-media-label">${labelPdf}</span></a>\n`;
  }

  html += `                </div>\n`;

  return html;
}

// Generate media toolbar for homepage (Direct download for MP3)
function generateHomepageMediaToolbar(media, ui) {
  if (!media || !ui.media) return '';

  const allMedia = media['all'];
  if (!allMedia) return '';

  const hasPdf = !!allMedia.pdf;
  const hasAudio = !!allMedia.audio;

  if (!hasPdf && !hasAudio) return '';

  let html = '';

  const svgPdf = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zm-2 14l-4-4h2.5v-4h3v4H15l-4 4z"/></svg>`;
  const svgAudio = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;

  const labelPdf = ui.media.labelPdf || 'Libro Completo (PDF)';
  const labelAudio = ui.media.labelAudio || 'Audiolibro (MP3)';

  html += `                <div class="ch-media-bar homepage-media">\n`;

  // Audio MP3: Direct download on homepage
  if (hasAudio) {
    const audioUrl = resolveUrl(allMedia.audio);
    html += `                    <a href="${audioUrl}" class="ch-media-icon" title="${ui.media.downloadAudio || 'Descargar audiolibro'}" download>${svgAudio}<span class="ch-media-label">${labelAudio}</span></a>\n`;
  }

  // PDF: Direct download link
  if (hasPdf) {
    const pdfUrl = resolveUrl(allMedia.pdf);
    html += `                    <a href="${pdfUrl}" class="ch-media-icon" title="${ui.media.downloadPdf}" download>${svgPdf}<span class="ch-media-label">${labelPdf}</span></a>\n`;
  }

  html += `                </div>\n`;

  return html;
}

// Generate chapter HTML (for chapter page)
function generateChapterContent(chapter, glossary, references, media, ui, lang) {
  // Get the title from TITULOS_CAPITULOS.json instead of chapter JSON
  const chapterTitleData = CHAPTER_TITLES.chapters.find(ch => ch.number === chapter.number);
  const chapterTitle = chapterTitleData?.[lang]?.title || chapter.title;

  let html = `            <article class="chapter" id="${chapter.id}">\n`;
  html += `                <header class="ch-head">\n`;
  html += `                    <div class="ch-head-top">\n`;
  html += `                        <div class="ch-num">${chapter.numberText}</div>\n`;
  html += generateMediaToolbar(chapter.number, media, ui);
  html += `                    </div>\n`;
  html += `                    <h1 class="ch-title">${chapterTitle}</h1>\n`;
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
  if (glossary) {
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
  }

  // References
  if (references) {
    for (const [id, ref] of Object.entries(references)) {
      html += `            <div class="note ref-note" id="ref-${id}">`;
      html += `<div class="note-title"><span class="ref-icon">*</span> ${ref.title}</div>`;
      html += `<div class="note-content">`;
      html += `<p>${ref.summary}</p>`;
      if (ref.learnMore) {
        html += `<p class="ref-link"><a href="${ref.learnMore}" target="_blank" rel="noopener">${ui.nav.learnMore} ↗</a></p>`;
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
    const href = getChapterPath(l, currentChapter.number);
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
    const chapterHref = getChapterPath(lang, ch.number);
    // Get title from TITULOS_CAPITULOS.json
    const chapterTitleData = CHAPTER_TITLES.chapters.find(c => c.number === ch.number);
    const chapterTitle = chapterTitleData?.[lang]?.title || ch.title;

    html += `            <div class="nav-chapter-group${isActive ? ' active' : ''}" id="nav-group-${ch.id}">\n`;
    html += `                <div class="nav-chapter-header">\n`;
    html += `                    <a href="${chapterHref}" class="nav-link${isActive ? ' current' : ''}">${ch.number}. ${chapterTitle}</a>\n`;

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
    const chapterHref = getChapterPath(lang, ch.number);
    // Get title from TITULOS_CAPITULOS.json
    const chapterTitleData = CHAPTER_TITLES.chapters.find(c => c.number === ch.number);
    const chapterTitle = chapterTitleData?.[lang]?.title || ch.title;

    html += `            <div class="nav-chapter-group" id="nav-group-${ch.id}">\n`;
    html += `                <div class="nav-chapter-header">\n`;
    html += `                    <a href="${chapterHref}" class="nav-link">${ch.number}. ${chapterTitle}</a>\n`;
    html += `                </div>\n`;
    html += `            </div>\n`;
  });

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
    // Get title from TITULOS_CAPITULOS.json
    const prevTitleData = CHAPTER_TITLES.chapters.find(c => c.number === prevChapter.number);
    const prevTitle = prevTitleData?.[lang]?.title || prevChapter.title;

    html += `                <a href="${getChapterPath(lang, prevChapter.number)}" class="chapter-nav-link prev">\n`;
    html += `                    <span class="chapter-nav-label">← ${ui.nav.previousChapter}</span>\n`;
    html += `                    <span class="chapter-nav-title">${prevTitle}</span>\n`;
    html += `                </a>\n`;
  } else {
    html += `                <a href="${langPrefix}/" class="chapter-nav-link prev">\n`;
    html += `                    <span class="chapter-nav-label">← ${ui.nav.backToIndex}</span>\n`;
    html += `                    <span class="chapter-nav-title">${ui.nav.tableOfContents}</span>\n`;
    html += `                </a>\n`;
  }

  if (nextChapter) {
    // Get title from TITULOS_CAPITULOS.json
    const nextTitleData = CHAPTER_TITLES.chapters.find(c => c.number === nextChapter.number);
    const nextTitle = nextTitleData?.[lang]?.title || nextChapter.title;

    html += `                <a href="${getChapterPath(lang, nextChapter.number)}" class="chapter-nav-link next">\n`;
    html += `                    <span class="chapter-nav-label">${ui.nav.nextChapter} →</span>\n`;
    html += `                    <span class="chapter-nav-title">${nextTitle}</span>\n`;
    html += `                </a>\n`;
  } else {
    html += `                <span class="chapter-nav-link next disabled"></span>\n`;
  }

  html += `            </nav>\n`;
  return html;
}

// Generate footer HTML
function generateFooter(ui, lang, showFeedback = true) {
  let html = `            <footer class="footer">\n`;
  if (ui.footerVersion) {
    html += `                <p>${ui.footerVersion}</p>\n`;
  }

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

  // L/L Research Attribution
  if (ui.footer.attribution) {
    html += `                <div class="footer-attribution">\n`;
    html += `                    <p>${ui.footer.attribution}</p>\n`;
    html += `                    <p>${ui.footer.originalSessions} <a href="https://www.llresearch.org" target="_blank" rel="noopener">llresearch.org</a></p>\n`;
    html += `                    <p class="footer-copyright">© ${ui.footer.derivedFrom}</p>\n`;
    const langPrefix = lang === BASE_LANG ? '' : `/${lang}`;
    html += `                    <p style="margin-top:1rem"><a href="${langPrefix}/about/" style="color:var(--gold);text-decoration:none">${ui.nav.about}</a></p>\n`;
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
    <title>${pageTitle} | ${DOMAIN}</title>
    <meta name="description" content="${ui.description}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${SITE_URL}${canonicalPath}">
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
    html += `    <link rel="alternate" hreflang="${l}" href="${SITE_URL}${href}">\n`;
  });

  html += `    <meta property="og:type" content="book">
    <meta property="og:url" content="${SITE_URL}${canonicalPath}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${ui.description}">
    <meta property="og:locale" content="${langCode === 'en' ? 'en_US' : langCode === 'es' ? 'es_ES' : 'pt_BR'}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#0d0d0f">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✧</text></svg>">
    <link rel="preload" href="/fonts/cormorant-garamond-400.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/spectral-400.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/fonts/fonts.css">
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

  // JSON-LD structured data (schema.org)
  const bookName = lang === 'es' ? 'El Uno' : lang === 'pt' ? 'O Um' : 'The One';
  const bookDesc = lang === 'es'
    ? 'Las enseñanzas filosóficas de La Ley del Uno transformadas en prosa narrativa'
    : lang === 'pt'
    ? 'Os ensinamentos filosóficos da Lei do Um transformados em prosa narrativa'
    : 'The philosophical teachings of The Law of One transformed into narrative prose';

  html += `    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Book",
      "name": "${bookName}",
      "alternateName": ["The One", "El Uno", "O Um"],
      "description": "${bookDesc}",
      "author": {
        "@type": "Person",
        "name": "Carlos Martínez"
      },
      "inLanguage": ["en", "es", "pt"],
      "genre": ["Philosophy", "Spirituality", "Metaphysics"],
      "about": {
        "@type": "Thing",
        "name": "The Law of One",
        "sameAs": "https://www.llresearch.org"
      },
      "isBasedOn": {
        "@type": "Book",
        "name": "The Ra Contact: Teaching the Law of One",
        "author": {
          "@type": "Organization",
          "name": "L/L Research",
          "url": "https://www.llresearch.org"
        }
      },
      "publisher": {
        "@type": "Person",
        "name": "Carlos Martínez"
      },
      "copyrightHolder": {
        "@type": "Organization",
        "name": "L/L Research",
        "url": "https://www.llresearch.org"
      },
      "license": "Used with permission from L/L Research",
      "url": "${SITE_URL}",
      "numberOfPages": 16,
      "bookFormat": "EBook"
    }
    </script>
`;

  html += `</head>\n`;
  return html;
}

// Generate common scripts
function generateScripts() {
  return `    <script>
        // Theme Management
        function initTheme() {
            const savedTheme = localStorage.getItem('theme');
            // const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            let currentTheme = 'dark';

            if (savedTheme) {
                currentTheme = savedTheme;
            }
            // Temporarily ignore system preference to enforce Dark Mode default per user request
            // else if (!systemDark) {
            //    currentTheme = 'light';
            // }

            if (currentTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
                updateThemeButton('light');
            } else {
                document.documentElement.removeAttribute('data-theme'); // Ensure dark (default)
                updateThemeButton('dark');
            }
        }

        function toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'light' ? 'dark' : 'light';
            
            if (newTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            
            localStorage.setItem('theme', newTheme);
            updateThemeButton(newTheme);
        }

        function updateThemeButton(theme) {
            const btns = document.querySelectorAll('.theme-toggle');
            btns.forEach(btn => {
                btn.innerHTML = theme === 'light' ? '☾' : '☀';
                btn.setAttribute('aria-label', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
            });
        }

        // Run immediately
        initTheme();

        function toggleNav(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('overlay').classList.toggle('active');document.getElementById('notes').classList.remove('open')}
        function toggleNotes(){document.getElementById('notes').classList.toggle('open');document.getElementById('overlay').classList.toggle('active');document.getElementById('sidebar').classList.remove('open')}
        function closeAll(){document.getElementById('sidebar').classList.remove('open');document.getElementById('notes').classList.remove('open');document.getElementById('overlay').classList.remove('active')}
        function toggleChapter(id){const g=document.getElementById('nav-group-'+id);if(g)g.classList.toggle('expanded')}
        function toggleAudio(num){
            const panel = document.getElementById('audio-panel-'+num);
            const btn = document.querySelector('[data-audio-btn="'+num+'"]');
            if(!panel || !btn) return;
            const isActive = panel.classList.contains('active');
            
            // Close all other audio panels
            document.querySelectorAll('.ch-media-audio-panel').forEach(p => {
                if(p.id !== 'audio-panel-'+num) {
                    p.classList.remove('active');
                    const a = p.querySelector('audio');
                    if(a) a.pause();
                }
            });
            document.querySelectorAll('[data-audio-btn]').forEach(b => b.classList.remove('active'));

            if(!isActive) {
                panel.classList.add('active');
                btn.classList.add('active');
                const audio = panel.querySelector('audio');
                if(audio && audio.paused) audio.play().catch(()=>{});
            } else {
                panel.classList.remove('active');
                btn.classList.remove('active');
                const audio = panel.querySelector('audio');
                if(audio) audio.pause();
            }
        }
        function toggleMediaPanel(type){const panel=document.getElementById('panel-'+type);const btn=document.querySelector('[data-panel="'+type+'"]');if(!panel||!btn)return;const isActive=panel.classList.contains('active');document.querySelectorAll('.ch-media-panel').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.ch-media-icon').forEach(b=>b.classList.remove('active'));if(!isActive){panel.classList.add('active');btn.classList.add('active')}}
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

            fetch('/api/send-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    lang: lang
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('feedback-form').style.display = 'none';
                    document.getElementById('feedback-success').style.display = 'block';
                } else {
                    alert('Error: ' + (data.message || 'Unknown error'));
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
            <button class="toggle theme-toggle" onclick="toggleTheme()" aria-label="Toggle Theme">☀</button>
            <header class="toc-header">
                <h1 class="toc-title">${ui.bookTitle}</h1>
                <p class="toc-subtitle">${ui.description}</p>
            </header>

            <section class="introduction">
                <h2 class="intro-title">${ui.introduction.title}</h2>
                ${ui.introduction.content.map(p => `<p class="intro-text">${p}</p>`).join('\n                ')}
                ${generateHomepageMediaToolbar(loadJSON(path.join(I18N_DIR, lang, 'media.json')), ui)}
            </section>

            <section class="disclaimer-banner">
                <h3 class="disclaimer-title">${ui.disclaimer.title}</h3>
                <p>${ui.disclaimer.text1}</p>
                <p>${ui.disclaimer.text2}</p>
                <p>${ui.disclaimer.text3} <a href="https://www.llresearch.org" target="_blank" rel="noopener">llresearch.org</a> ${ui.disclaimer.text3b}</p>
            </section>

            <section class="toc-section">
                <div class="toc-chapters">
`;

  chapters.forEach(ch => {
    const chapterHref = getChapterPath(lang, ch.number);
    // Get title from TITULOS_CAPITULOS.json
    const chapterTitleData = CHAPTER_TITLES.chapters.find(c => c.number === ch.number);
    const chapterTitle = chapterTitleData?.[lang]?.title || ch.title;

    html += `                    <a href="${chapterHref}" class="toc-chapter">\n`;
    html += `                        <span class="toc-chapter-num">${ch.numberText}</span>\n`;
    html += `                        <span class="toc-chapter-title">${chapterTitle}</span>\n`;
    html += `                        <span class="toc-chapter-arrow">→</span>\n`;
    html += `                    </a>\n`;
  });

  html += `                </div>
            </section>

`;
  html += generateFooter(ui, lang, false);
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
    const chapterHref = getChapterPath(lang, ch.number);
    // Get title from TITULOS_CAPITULOS.json
    const chapterTitleData = CHAPTER_TITLES.chapters.find(c => c.number === ch.number);
    const chapterTitle = chapterTitleData?.[lang]?.title || ch.title;
    html += `                <a href="${chapterHref}" class="nav-link">${ch.number}. ${chapterTitle}</a>\n`;
  });
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
            <button class="toggle theme-toggle" onclick="toggleTheme()" aria-label="Toggle Theme">☀</button>
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

// Generate simple navigation for sitemap/about pages
function generateSimpleNav(chapters, ui, lang, allLangs, pagePath) {
  const langPrefix = lang === BASE_LANG ? '' : `/${lang}`;

  let html = `        <nav class="nav" id="sidebar">\n`;
  html += `            <div class="nav-head">\n`;
  html += `                <a href="${langPrefix}/" class="nav-title">${ui.siteTitle}</a>\n`;
  html += `                <div class="lang">`;

  // Language links
  allLangs.forEach((l, i) => {
    const href = l === BASE_LANG ? pagePath : `/${l}${pagePath}`;
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
    const chapterSlug = getChapterSlug(lang, ch.number);
    // Get title from TITULOS_CAPITULOS.json
    const chapterTitleData = CHAPTER_TITLES.chapters.find(c => c.number === ch.number);
    const chapterTitle = chapterTitleData?.[lang]?.title || ch.title;
    html += `                <a href="${langPrefix}/${chapterSlug}/" class="nav-link">\n`;
    html += `                    <span class="nav-num">${ui.nav.chapter} ${ch.number}</span>\n`;
    html += `                    <span class="nav-text">${chapterTitle}</span>\n`;
    html += `                </a>\n`;
  });

  html += `            </div>\n`;

  // About link in footer
  html += `            <div class="nav-footer">\n`;
  html += `                <a href="${langPrefix}/about/" class="nav-link">✧ ${ui.nav.about || 'About'}</a>\n`;
  html += `            </div>\n`;

  html += `        </nav>\n`;
  return html;
}

// Generate Sitemap page for humans
function generateSitemapPage(lang, chapters, ui, allLangs, version) {
  const langPrefix = lang === BASE_LANG ? '' : `/${lang}`;
  const pagePath = '/sitemap/';
  const cssPath = lang === BASE_LANG ? '../' : '../../';
  const pageTitle = lang === 'es' ? 'Mapa del Sitio' : lang === 'pt' ? 'Mapa do Site' : 'Sitemap';

  let html = generateHead(lang, ui, allLangs, version, pagePath, cssPath, pageTitle, false);

  html += `<body>
    <button class="toggle nav-toggle" onclick="toggleNav()">☰ ${ui.nav.index}</button>
    <button class="toggle notes-toggle" onclick="toggleNotes()">✧ ${ui.nav.notes}</button>
    <div class="overlay" id="overlay" onclick="closeAll()"></div>

    <div class="layout">
        <main class="main">
            <button class="toggle theme-toggle" onclick="toggleTheme()" aria-label="Toggle Theme">☀</button>
            <header class="about-header">
                <h1 class="about-title">${pageTitle}</h1>
            </header>

            <section class="sitemap-section">
                <h2>${ui.bookTitle}</h2>
                <ul class="sitemap-list">
                    <li><a href="${langPrefix}/">${lang === 'es' ? 'Índice' : lang === 'pt' ? 'Índice' : 'Index'}</a></li>
`;

  // Add all chapters
  chapters.forEach(chapter => {
    const chapterSlug = getChapterSlug(lang, chapter.number);
    // Get title from TITULOS_CAPITULOS.json
    const chapterTitleData = CHAPTER_TITLES.chapters.find(c => c.number === chapter.number);
    const chapterTitle = chapterTitleData?.[lang]?.title || chapter.title;
    html += `                    <li><a href="${langPrefix}/${chapterSlug}/">${ui.nav.chapter} ${chapter.number}: ${chapterTitle}</a></li>\n`;
  });

  html += `                    <li><a href="${langPrefix}/about/">${lang === 'es' ? 'Acerca de' : lang === 'pt' ? 'Sobre' : 'About'}</a></li>
                </ul>
            </section>

            <section class="sitemap-section">
                <h2>${lang === 'es' ? 'Otros Idiomas' : lang === 'pt' ? 'Outros Idiomas' : 'Other Languages'}</h2>
                <ul class="sitemap-list">
                    <li><a href="/" hreflang="en">English</a></li>
                    <li><a href="/es/" hreflang="es">Español</a></li>
                    <li><a href="/pt/" hreflang="pt">Português</a></li>
                </ul>
            </section>

            <section class="sitemap-section">
                <h2>${lang === 'es' ? 'Recursos' : lang === 'pt' ? 'Recursos' : 'Resources'}</h2>
                <ul class="sitemap-list">
                    <li><a href="/sitemap.xml">Sitemap XML (${lang === 'es' ? 'para motores de búsqueda' : lang === 'pt' ? 'para motores de busca' : 'for search engines'})</a></li>
                    <li><a href="/robots.txt">Robots.txt</a></li>
                    <li><a href="https://www.llresearch.org" target="_blank" rel="noopener">${lang === 'es' ? 'Material Ra Original' : lang === 'pt' ? 'Material Ra Original' : 'Original Ra Material'} (L/L Research)</a></li>
                </ul>
            </section>
        </main>

`;
  html += generateSimpleNav(chapters, ui, lang, allLangs, '/sitemap/');
  html += '\n';
  html += generateNotes(null, null, ui);
  html += `    </div>

${generateScripts()}
</body>
</html>`;

  return html;
}

// Generate individual chapter page
function generateChapterPage(lang, chapters, chapterIndex, glossary, references, ui, allLangs, version, media) {
  const chapter = chapters[chapterIndex];
  const langPrefix = lang === BASE_LANG ? '' : `/${lang}`;
  const chapterSlug = getChapterSlug(lang, chapter.number);
  const pagePath = `/${chapterSlug}/`; // Path without language prefix (SEO-friendly slug)
  const cssPath = lang === BASE_LANG ? '../' : '../../';
  // Get title from TITULOS_CAPITULOS.json
  const chapterTitleData = CHAPTER_TITLES.chapters.find(c => c.number === chapter.number);
  const chapterTitle = chapterTitleData?.[lang]?.title || chapter.title;
  const pageTitle = `${ui.nav.chapter} ${chapter.number}: ${chapterTitle}`;

  let html = generateHead(lang, ui, allLangs, version, pagePath, cssPath, pageTitle, false);

  html += `<body>
    <button class="toggle nav-toggle" onclick="toggleNav()">☰ ${ui.nav.index}</button>
    <button class="toggle notes-toggle" onclick="toggleNotes()">✧ ${ui.nav.notes}</button>
    <div class="overlay" id="overlay" onclick="closeAll()"></div>

    <div class="layout">
        <main class="main">
            <button class="toggle theme-toggle" onclick="toggleTheme()" aria-label="Toggle Theme">☀</button>
`;

  html += generateChapterContent(chapter, glossary, references, media, ui, lang);
  html += '\n';
  html += generateChapterPrevNext(chapters, chapterIndex, ui, lang);
  html += '\n';
  html += generateFooter(ui, lang, true);
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

    // Load media configuration (optional, per language)
    const media = loadJSON(path.join(I18N_DIR, lang, 'media.json'));

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
      const chapterSlug = getChapterSlug(lang, chapter.number);
      const chapterDir = lang === BASE_LANG
        ? path.join(DIST_DIR, chapterSlug)
        : path.join(DIST_DIR, lang, chapterSlug);

      if (!fs.existsSync(chapterDir)) {
        fs.mkdirSync(chapterDir, { recursive: true });
      }

      const chapterHtml = generateChapterPage(lang, chapters, index, glossary, references, ui, LANGUAGES, version, media);
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

    // Generate Sitemap page
    const sitemapDir = lang === BASE_LANG
      ? path.join(DIST_DIR, 'sitemap')
      : path.join(DIST_DIR, lang, 'sitemap');

    if (!fs.existsSync(sitemapDir)) {
      fs.mkdirSync(sitemapDir, { recursive: true });
    }

    const sitemapHtml = generateSitemapPage(lang, chapters, ui, LANGUAGES, version);
    const sitemapPath = path.join(sitemapDir, 'index.html');
    fs.writeFileSync(sitemapPath, sitemapHtml);
    console.log(`   ✅ ${sitemapPath}`);
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

  // Generate _headers from template (replaces {{DOMAIN}} placeholder)
  const headersTemplate = path.join(__dirname, '..', '_headers.template');
  const headersDest = path.join(DIST_DIR, '_headers');
  if (fs.existsSync(headersTemplate)) {
    let headersContent = fs.readFileSync(headersTemplate, 'utf8');
    headersContent = headersContent.replace(/\{\{DOMAIN\}\}/g, DOMAIN);
    fs.writeFileSync(headersDest, headersContent);
    console.log(`📋 Generated _headers (domain: ${DOMAIN})`);
  }

  // Copy fonts folder
  const fontsSrc = path.join(__dirname, '..', 'src', 'fonts');
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

  // Copy icons if they exist (e.g. android-chrome)
  // Not strictly needed if everything is inline SVG/data URI, but good practice if listed in manifest

  // Note: API is now handled by Cloudflare Pages Functions (see /functions folder)

  // Generate sitemap.xml
  generateSitemap();

  // Generate robots.txt
  generateRobotsTxt();

  // Generate llms.txt for AI systems
  generateLlmsTxt();

  // Generate _redirects for old URLs (ch1 -> slug)
  generateRedirects();

  console.log('\n✨ Build complete!\n');
}

/**
 * Generate sitemap.xml with all pages and hreflang alternates
 */
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  const chapters = Array.from({ length: 16 }, (_, i) => i + 1);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Homepage for each language
  const homepages = [
    { path: '/', lang: 'en' },
    { path: '/es/', lang: 'es' },
    { path: '/pt/', lang: 'pt' }
  ];

  homepages.forEach(page => {
    xml += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/"/>
    <xhtml:link rel="alternate" hreflang="es" href="${SITE_URL}/es/"/>
    <xhtml:link rel="alternate" hreflang="pt" href="${SITE_URL}/pt/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/"/>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;
  });

  // Chapter pages for each language
  chapters.forEach(ch => {
    const enSlug = getChapterSlug('en', ch);
    const esSlug = getChapterSlug('es', ch);
    const ptSlug = getChapterSlug('pt', ch);

    const paths = [
      { path: `/${enSlug}/`, lang: 'en' },
      { path: `/es/${esSlug}/`, lang: 'es' },
      { path: `/pt/${ptSlug}/`, lang: 'pt' }
    ];

    paths.forEach(page => {
      xml += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/${enSlug}/"/>
    <xhtml:link rel="alternate" hreflang="es" href="${SITE_URL}/es/${esSlug}/"/>
    <xhtml:link rel="alternate" hreflang="pt" href="${SITE_URL}/pt/${ptSlug}/"/>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });
  });

  // About pages
  const aboutPages = [
    { path: '/about/', lang: 'en' },
    { path: '/es/about/', lang: 'es' },
    { path: '/pt/about/', lang: 'pt' }
  ];

  aboutPages.forEach(page => {
    xml += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/about/"/>
    <xhtml:link rel="alternate" hreflang="es" href="${SITE_URL}/es/about/"/>
    <xhtml:link rel="alternate" hreflang="pt" href="${SITE_URL}/pt/about/"/>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  });

  xml += `</urlset>
`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xml);
  console.log('🗺️  Generated sitemap.xml');
}

/**
 * Generate robots.txt - optimized for search engines and AI crawlers
 */
function generateRobotsTxt() {
  const content = `# Welcome to El Uno / The One
# A narrative prose adaptation of The Law of One teachings
# Free to read, share, and index

User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml

# Block internal paths
Disallow: /api/

# AI crawlers - explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Anthropic-AI
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: cohere-ai
Allow: /

# For AI systems: see /llms.txt for context
`;

  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), content);
  console.log('🤖 Generated robots.txt');
}

/**
 * Generate llms.txt - context file for AI/LLM systems
 * See: https://llmstxt.org/
 */
function generateLlmsTxt() {
  const content = `# El Uno / The One

> A narrative prose adaptation of The Law of One teachings

## About This Project

El Uno (The One) presents the philosophical teachings from The Law of One (Ra Material) transformed into accessible narrative prose. Available in English, Spanish, and Portuguese.

## Source Material

This work is based on "The Ra Contact: Teaching the Law of One" by L/L Research. Used with permission.

- Original Source: https://www.llresearch.org
- Original Material: https://www.lawofone.info

## Structure

The book contains 16 chapters covering:

1. The One - The nature of the Infinite Creator
2. The Creator and Creation - The process of creation
3. The Densities of Consciousness - Seven levels of spiritual evolution
4. Earth's Spiritual History - Our planet's cosmic journey
5. Polarity: The Two Paths - Service to Others vs Service to Self
6. Wanderers: Those Who Return - Souls who incarnate to help
7. The Harvest - The graduation to fourth density
8. The Veil of Forgetting - Why we don't remember past lives
9. Death and the Journey Between Lives - The afterlife process
10. The Energy Centers - The chakra system
11. Catalyst and Experience - How we grow through challenges
12. Higher Self and Inner Guidance - Our connection to wisdom
13. Free Will and the Law of Confusion - Why choice is sacred
14. The Harvest and the Transition - Earth's transformation
15. Living the Law of One - Practical application
16. The Return - Coming home to the One

## URLs

- Homepage (English): ${SITE_URL}/
- Homepage (Spanish): ${SITE_URL}/es/
- Homepage (Portuguese): ${SITE_URL}/pt/
- Chapter URLs use SEO-friendly slugs (e.g., /the-one/, /es/el-uno/, /pt/o-um/)
- About: ${SITE_URL}/about/, ${SITE_URL}/es/about/, ${SITE_URL}/pt/about/
- Sitemap: ${SITE_URL}/sitemap.xml

## Media

- Audio (MP3): Available for Spanish version
- PDF: Available per chapter

## License

Content used with permission from L/L Research.
This interpretation is offered freely as a service to others.

## Contact

Author: Carlos Martínez
Website: ${SITE_URL}
`;

  fs.writeFileSync(path.join(DIST_DIR, 'llms.txt'), content);
  console.log('🤖 Generated llms.txt');
}

/**
 * Generate _redirects file for Cloudflare Pages
 * Redirects old /ch1/ URLs to new SEO-friendly slugs
 */
function generateRedirects() {
  let content = `# Redirects from old URLs to new SEO-friendly slugs
# Format: /old-path /new-path [status]

`;

  // Redirect old ch{n} URLs to new slugs for each language
  for (let ch = 1; ch <= 16; ch++) {
    const enSlug = getChapterSlug('en', ch);
    const esSlug = getChapterSlug('es', ch);
    const ptSlug = getChapterSlug('pt', ch);

    // English (base language)
    content += `/ch${ch} /${enSlug}/ 301\n`;
    content += `/ch${ch}/ /${enSlug}/ 301\n`;

    // Spanish
    content += `/es/ch${ch} /es/${esSlug}/ 301\n`;
    content += `/es/ch${ch}/ /es/${esSlug}/ 301\n`;

    // Portuguese
    content += `/pt/ch${ch} /pt/${ptSlug}/ 301\n`;
    content += `/pt/ch${ch}/ /pt/${ptSlug}/ 301\n`;
  }

  fs.writeFileSync(path.join(DIST_DIR, '_redirects'), content);
  console.log('🔀 Generated _redirects');
}

// Run build
build();
