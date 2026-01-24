# eluno.org — Transparent Distortions

## What is this project?

This is a collection of books that present the same core spiritual philosophy through different linguistic and cultural lenses. Each version adapts the language to be received without unnecessary resistance by its intended audience.

The source material is the [Ra Material (The Law of One)](https://www.llresearch.org/library/the-ra-contact-teaching-the-law-of-one), channeled by L/L Research between 1981 and 1984. These books are AI-assisted reinterpretations of that philosophy, written with the explicit purpose of making the teachings accessible to readers who might otherwise never encounter them.

## Why multiple versions of the same teaching?

There is a well-documented psychological phenomenon where certain words or concepts trigger automatic resistance in readers, preventing them from engaging with the actual content. This is related to several concepts in psychology and spiritual traditions:

- **Cognitive dissonance** (Leon Festinger, 1957): The mental discomfort experienced when new information conflicts with existing beliefs. Research shows that exposure to religious or spiritual terminology alone can activate cognitive frameworks that block reception of unfamiliar ideas.

- **Psychological reactance** (Jack Brehm, 1966): The automatic resistance triggered when a person perceives their freedom of thought or belief system as being challenged. Specific words act as triggers: "reincarnation," "densities," or "channeling" may close a Christian reader; "God," "sin," or "redemption" may close an agnostic one.

- **Conscious shocks** (G.I. Gurdjieff, Fourth Way): Gurdjieff taught that humans live in "waking sleep" and require shocks to awaken. However, he also warned that shocks administered without preparation produce resistance rather than awakening. His concept of *Djartklom* (separated functioning) describes how thoughts, feelings, and actions pull in opposite directions — a state resembling cognitive dissonance.

Each book in this project removes the specific trigger words that would activate reactance in its target audience, while preserving the complete philosophical message. Nothing is added that isn't in the source. Content is only omitted — never distorted into falsehood.

This is not deception. It is the same compassionate principle used by every good teacher: meeting the student where they are.

## Project Structure

| ID | Package | Book Title | Distortion | Audience |
|----|---------|-----------|------------|----------|
| 000 | `eluno` | El Uno / The One | Philosophical base | Intellectually-oriented seekers |
| 010 | `todo` | Las Enseñanzas de la Ley del Uno | Agnostic/narrative | Modern seekers without religious framework |
| 020 | `jesus` | El Camino del Amor | Christian | Christians open to contemplative spirituality |
| 021 | `sanacion` | Sanación | Christian + practical | Christians seeking healing and transformation |
| 100 | `doctrinas` | Doctrinas | Theological | Traditional/Catholic Christians |

### What remains constant across ALL versions:
1. Unity of consciousness at source
2. Apparent separation as sacred and necessary
3. Free will as fundamental principle
4. Love as the creative force
5. Every being is the Creator experiencing itself

### What changes:
- **Language register**: scientific → narrative → theological
- **Trigger words removed**: Each version omits terminology that would activate resistance in its audience
- **Frame of reference**: cosmology → personal experience → faith

## The Distortion Tree

```
000 (eluno) ─── The philosophical core
 │
 ├── 010 (todo) ─── Agnostic simplification
 │
 ├── 020 (jesus) ─── Christian lens
 │    │
 │    └── 021 (sanacion) ─── Practical healing sub-branch
 │
 └── 100 (doctrinas) ─── Theological doctrine branch
```

## Transparency

The writing prompts and AI generation process for each book are available in this repository. Every distortion is documented and intentional. The reader of any version can trace back to the source material and verify that nothing has been falsified — only adapted.

This is what we call a **transparent distortion**: the philosophical equivalent of translating between languages, except the translation is between worldviews rather than vocabularies.

---

## Development Guide

### Installation
```bash
npm install
```
This installs all dependencies for all packages via npm workspaces.

### Working on a project
```bash
npm run dev:eluno      # http://127.0.0.1:3001
npm run dev:todo       # http://127.0.0.1:3002
npm run dev:sanacion   # http://127.0.0.1:3004
npm run dev:jesus      # http://127.0.0.1:3005
npm run dev:doctrinas  # http://127.0.0.1:3006
```

### Shared styles and scripts
Edit files in `packages/core/`. Dev servers detect changes automatically.

### Build & Deploy
```bash
npm run build:all          # Build all sites to dist/
cd packages/<name>
npm run publish            # Deploy to production (requires .env credentials)
```

## Repository Structure

```
eluno.org/
├── packages/
│   ├── core/              # Shared resources (SCSS, templates, build scripts)
│   ├── eluno/             # 000 - El Uno / The One
│   ├── todo/              # 010 - Las Enseñanzas de la Ley del Uno
│   ├── jesus/             # 020 - El Camino del Amor
│   ├── sanacion/          # 021 - Sanación
│   └── doctrinas/         # 100 - Doctrinas
├── docs/project/          # Project documentation
└── README.md
```

## Technical

- **Source**: [L/L Research - The Ra Contact](https://www.llresearch.org/library/the-ra-contact-teaching-the-law-of-one)
- **Generated with**: Claude (Anthropic) for text, Fish Audio for TTS audiobooks
- **Hosted at**: [eluno.org](https://eluno.org) and subdomains
- **Deployed via**: Cloudflare Pages (sites), Hostinger (static media)
- **License**: Content derived from L/L Research material, used with consideration of their open sharing philosophy

## References

- Festinger, L. (1957). *A Theory of Cognitive Dissonance*. Stanford University Press.
- Brehm, J. W. (1966). *A Theory of Psychological Reactance*. Academic Press.
- Gurdjieff, G.I. — Fourth Way teachings on conscious shocks and *Djartklom*.
- L/L Research (1981-1984). *The Ra Contact: Teaching the Law of One*.
