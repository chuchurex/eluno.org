# The One — eluno.org

> A philosophical reinterpretation of the Ra Material (Law of One) as accessible, modern narrative prose.

This project is a static web application built with Node.js, designed to provide an immersive reading experience with multilingual support (EN, ES, PT), PDF generation, and audiobooks.

## 📚 Documentation

Professional documentation for easy onboarding and deployment:

- **[Development Guide](docs/DEVELOPMENT.md)**: How to install, configure, and run the project locally.
- **[Deployment Guide](docs/DEPLOY.md)**: How to deploy to production (Cloudflare + Hostinger).
- **[Architecture](docs/ARCHITECTURE.md)**: Technical details about the hybrid stack and design decisions.

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

## 📄 License

Content derived from the Ra Material (L/L Research). See the website footer for detailed attribution and licensing information.
