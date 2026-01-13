# Claude Integration Guide — eluno.org

> **Note**: This document contains internal notes and workflows for working with Claude AI on this project.

---

## Project Architecture

```
eluno.org/
├── i18n/                    # Content in 3 languages
│   ├── en/                  # English (base)
│   ├── es/                  # Spanish
│   └── pt/                  # Portuguese
│       ├── chapters/        # 16 chapters JSON (01.json - 16.json)
│       ├── ui.json          # Interface texts
│       ├── glossary.json    # Glossary of terms
│       ├── references.json  # Bibliographic references
│       ├── media.json       # URLs for audio/PDF
│       └── about.json       # About page
│
├── scripts/                 # Build scripts
│   ├── build.js            # Main HTML generator
│   ├── build-pdf.js        # PDF generator
│   └── translate-chapter.js # Automatic translator
│
├── src/scss/               # SCSS styles
├── dist/                   # Generated site (do not edit)
└── audiobook/              # Audio resources (in dist/)
```

---

## Main Commands

### Build and Publish
```bash
npm run build      # Build site (HTML + CSS)
npm run publish    # Build + FTP upload + Git commit
```

### Chapter Translation
```bash
npm run translate:chapter -- --chapter=01 --lang=pt
npm run translate:chapter -- --chapter=05 --lang=es
```

---

## Audiobook Generation

### 1. Create script from chapter JSON
Scripts are in: `/dist/audiobook/es/guiones/`

### 2. Generate audio with Fish Audio (TTS)
```bash
node scripts/fish-audio-tts.js
```
- API Key in `.env`: `FISH_AUDIO_API_KEY=...`
- Cloned voice configured in script

### 3. Add silences between sections
```bash
node scripts/add-silences.js
```

### 4. Final result
Files in: `/dist/audiobook/es/audios/ep01-cosmologia-y-genesis.mp3`

---

## JSON Content Structure

### Chapter (`i18n/en/chapters/01.json`)
```json
{
  "id": "ch1",
  "number": 1,
  "numberText": "Chapter One",
  "title": "Cosmology and Genesis",
  "sections": [
    {
      "id": "section-id",
      "title": "Section Title",
      "content": [
        { "type": "paragraph", "text": "Text with {term:term} and {ref:reference}" }
      ]
    }
  ]
}
```

### Media (`i18n/en/media.json`)
```json
{
  "1": {
    "pdf": "/pdf/en/ch01.pdf",
    "audio": "/audiobook/en/audios/ep01-cosmology-and-genesis.mp3"
  }
}
```

### Glossary (`i18n/en/glossary.json`)
```json
{
  "term-id": {
    "title": "Term",
    "content": ["Paragraph 1", "Paragraph 2"]
  }
}
```

---

## Project Metrics

- **16 chapters** in 3 languages
- **~6 hours** of audiobook content
- **50+ terms** in glossary
- **5,307 lines** of code (JS + SCSS)
- **16,056 lines** of JSON content

---

## Important URLs

- **Site**: https://eluno.org
- **GitHub**: https://github.com/chuchurex/eluno.org

---

## Key Files to Edit

| File | Purpose |
|------|---------|
| `scripts/build.js` | HTML generator - modify for new features |
| `src/scss/_content.scss` | Main content styles |
| `i18n/*/chapters/*.json` | Chapter content |
| `i18n/*/media.json` | Media URLs per chapter |

---

## Deployment

The site automatically deploys via FTP with `npm run publish`. GitHub pushes work correctly.

---

## Discontinued Features

### YouTube Video Generation
This feature was removed from the project. For historical reference, see:
`/backups/discontinued-features/YOUTUBE_VIDEO_GENERATION.md`

---

*Last updated: January 13, 2026*
