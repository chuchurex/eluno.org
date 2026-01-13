# Documentation — eluno.org

> **Language**: All documentation is in English for international accessibility.
>
> **Spanish backups**: Available in `/backups/spanish-docs/` for reference.

---

## 📚 Documentation Index

### Technical Documentation
| File | Description | Lines |
|------|-------------|-------|
| **[DEVELOPMENT.md](./DEVELOPMENT.md)** | Local development setup guide | ~75 |
| **[DEPLOY.md](./DEPLOY.md)** | Production deployment guide (Cloudflare + Hostinger) | ~90 |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Complete technical architecture | 535 |
| **[CLAUDE.md](./CLAUDE.md)** | Claude AI integration guide (internal) | ~150 |

### AI Writing Methodology
| File | Description | Lines |
|------|-------------|-------|
| **[WRITING_PROTOCOL_V3.md](./WRITING_PROTOCOL_V3.md)** | Complete writing protocol and voice guidelines | 424 |
| **[BOOK_STRUCTURE_16_CHAPTERS.md](./BOOK_STRUCTURE_16_CHAPTERS.md)** | 16-chapter structure with themes | 337 |

---

## 🚀 Quick Start

### For Developers
**Want to run the project locally?**
1. Read [DEVELOPMENT.md](./DEVELOPMENT.md) — Setup in < 30 minutes
2. Run `npm install && npm run dev`
3. Site available at `http://127.0.0.1:3002`

### For Writers (AI Replication)
**Want to replicate the book writing process?**
1. Read [../ai/QUICK_START.md](../ai/QUICK_START.md) — 5-step guide
2. Download source PDFs from [../ai/SOURCES.md](../ai/SOURCES.md)
3. Follow the writing protocol in [WRITING_PROTOCOL_V3.md](./WRITING_PROTOCOL_V3.md)

### For Deployment
**Want to deploy to production?**
1. Read [DEPLOY.md](./DEPLOY.md) — Cloudflare Pages + Hostinger setup
2. Configure environment variables
3. Run `npm run build && npx wrangler pages deploy dist`

---

## 🔗 Related Documentation

### AI Methodology (Complete)
See the [`ai/` folder](../ai/) for comprehensive AI replication guides:
- [AI Writing Prompt](../ai/AI_WRITING_PROMPT.md) — System prompt
- [Quick Start Guide](../ai/QUICK_START.md) — 30-minute replication
- [Methodology](../ai/METHODOLOGY.md) — Editorial decisions
- [Sources](../ai/SOURCES.md) — PDF links

### Content Files (The Book)
The actual book content is in JSON format:
- `i18n/en/chapters/` — 16 English chapters
- `i18n/es/chapters/` — 16 Spanish chapters
- `i18n/pt/chapters/` — 16 Portuguese chapters

### Backups
Historical and non-English documentation:
- [../backups/spanish-docs/](../backups/spanish-docs/) — Spanish documentation
- [../backups/discontinued-features/](../backups/discontinued-features/) — YouTube generation

---

## 🌐 Language Policy

**Primary**: English (this folder)
- All active documentation maintained in English
- International accessibility
- Standard for open source projects

**Backups**: Spanish (../backups/spanish-docs/)
- Original Spanish docs preserved
- Not actively maintained
- Reference only

**Content**: Multilingual (../i18n/)
- Book chapters in EN, ES, PT
- Glossaries and UI in 3 languages
- Fully multilingual reading experience

---

*Last updated: January 13, 2026*
