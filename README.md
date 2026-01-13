# The One — eluno.org

> A philosophical reinterpretation of the Ra Material (Law of One) as accessible, modern narrative prose.

This project is a static web application built with Node.js, designed to provide an immersive reading experience with multilingual support (EN, ES, PT), PDF generation, and audiobooks.

## 📚 Documentation

### Technical Documentation

Professional documentation for easy onboarding and deployment:

- **[Development Guide](docs/DEVELOPMENT.md)**: How to install, configure, and run the project locally.
- **[Deployment Guide](docs/DEPLOY.md)**: How to deploy to production (Cloudflare + Hostinger).
- **[Architecture](docs/ARCHITECTURE.md)**: Technical details about the hybrid stack and design decisions.

### AI Methodology Documentation

This book was created with AI assistance. **We openly share our complete methodology:**

- **[AI Writing Prompt](ai/AI_WRITING_PROMPT.md)**: Complete system prompt to replicate the writing process.
- **[Quick Start Guide](ai/QUICK_START.md)**: 5-step guide to replicate this book (30 minutes).
- **[Methodology](ai/METHODOLOGY.md)**: Editorial decisions, iterations, and lessons learned.
- **[Source Materials](ai/SOURCES.md)**: Direct links to Ra Contact and Q'uo PDFs.

**→ Start here to replicate**: [ai/QUICK_START.md](ai/QUICK_START.md)

## 🚀 Quick Start

**Requirements:** Node.js v20+

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional for basic dev)
cp .env.example .env

# 3. Run development server
npm run dev
```

The site will be available at `http://127.0.0.1:3002`.

## 🛠 Main Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | **Dev Mode**: SASS watch + Live Server. |
| `npm run build` | **Build**: Generate static site in `/dist`. |
| `npm run publish:media` | **Deploy Media**: Upload audio/PDF files to static server. |
| `npm run build:pdf` | **PDFs**: Generate chapter PDFs (e.g., `npm run build:pdf 01 es`). |

## 🏗 Architecture Overview

The project uses a hybrid deployment architecture:

- **Frontend**: Deployed to **Cloudflare Pages** (HTML, CSS, JS)
- **Static Assets**: Hosted on **Hostinger** (PDFs, Audio files)
- **Content**: Generated from JSON with Puppeteer for PDFs
- **Features**: Glossary system, references, multilingual support (EN, ES, PT)

For more details, see [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md).

## 🌐 Live Site

- **Production**: [https://eluno.org](https://eluno.org)
- **GitHub**: [https://github.com/chuchurex/eluno.org](https://github.com/chuchurex/eluno.org)

## 🤖 AI-Assisted Creation & Transparency

This book was created with AI assistance (Claude by Anthropic). We believe in **radical transparency** about our methodology:

### Why We Share This

1. **Transparency**: Readers deserve to know how the content was created
2. **Reproducibility**: Others can replicate, improve, or create similar projects
3. **Trust**: Open methodology builds credibility
4. **Contribution**: Clear guidelines help future contributors

### The Human-AI Collaboration

- **Human role**: Philosophical direction, editorial decisions, quality control, final approval
- **AI role**: Synthesizing source material, maintaining consistent voice, drafting and formatting
- **Source authority**: The Ra Contact (1981-1984) is the sole doctrinal authority
- **Fidelity**: Every concept traces back to the original Ra Material

**The AI served as a writing tool, not as an autonomous author.**

### Replicate This Book

See the [`ai/` folder](./ai/) for complete instructions to replicate this writing process in ~30 minutes.

---

## 📄 License

**Content**: Derived from the Ra Material © L/L Research. Authorization received January 10, 2026.

**Code & Documentation**: See LICENSE file for details.

**AI Methodology**: Open source — freely replicable and improvable.

See the website footer for detailed attribution and licensing information.

---

**Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.
**Roadmap**: See [ROADMAP.md](ROADMAP.md) for planned features and improvements.
