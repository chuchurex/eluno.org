# Translation TODO — Spanish Files to English

> **Purpose**: This document lists all Spanish-language documentation files that should be translated to English for the public release.
>
> **Priority**: Medium — These files are functional in Spanish but English versions would improve accessibility.

---

## 🇪🇸 Files Requiring Translation

### High Priority (Core Documentation)

| File | Description | Status | Notes |
|------|-------------|--------|-------|
| **docs/PROTOCOLO_ESCRITURA_V3.md** | Writing protocol (424 lines) | 🟡 TO TRANSLATE | Core methodology, critical for replication |
| **docs/ESTRUCTURA_LIBRO_16_CAPITULOS.md** | Book structure (337 lines) | 🟡 TO TRANSLATE | Chapter outline and content plan |

### Medium Priority (Reference Materials)

| File | Description | Status | Notes |
|------|-------------|--------|-------|
| **docs/11enero/TABLA_TERMINOS_COMPLETA_V2.md** | Master glossary (136 terms) | 🟡 TO TRANSLATE | Terminology reference |
| **docs/ARQUITECTURA.md** | Architecture (Spanish version) | ⚪ OPTIONAL | English version exists (docs/ARCHITECTURE.md) |
| **docs/ESTRATEGIA_SEO_LANZAMIENTO.md** | SEO strategy | ⚪ OPTIONAL | Internal document, Spanish OK |
| **docs/GUIA_COMILLAS_JSON.md** | JSON quotes guide | ⚪ OPTIONAL | Technical note, Spanish OK |

### Low Priority (Internal/Legacy)

| File | Description | Status | Notes |
|------|-------------|--------|-------|
| **docs/CLAUDE.md** | Claude integration guide | ⚪ OPTIONAL | Internal guide |
| **docs/NUEVO_PROYECTO.md** | New project notes | ⚪ OPTIONAL | Internal notes |

---

## 📊 Translation Priority Rationale

### Why Translate These Files?

#### PROTOCOLO_ESCRITURA_V3.md (HIGH)
- **Reason**: Core writing methodology referenced in AI_WRITING_PROMPT.md
- **Impact**: Users need this to understand voice, style, and quality standards
- **Workaround**: AI can understand Spanish, but English improves accessibility
- **Lines**: 424 lines
- **Effort**: ~2-3 hours with AI assistance

#### ESTRUCTURA_LIBRO_16_CAPITULOS.md (HIGH)
- **Reason**: Book structure and chapter content outline
- **Impact**: Essential for understanding the narrative arc
- **Workaround**: AI can understand Spanish
- **Lines**: 337 lines
- **Effort**: ~2 hours with AI assistance

#### TABLA_TERMINOS_COMPLETA_V2.md (MEDIUM)
- **Reason**: Master glossary with 136 terms
- **Impact**: Helpful reference for contributors
- **Workaround**: Glossary exists in JSON format in 3 languages
- **Lines**: Unknown (estimated 200-300)
- **Effort**: ~1-2 hours

---

## 🛠 Translation Strategy

### Option 1: AI-Assisted Translation (Recommended)

Use Claude to translate while preserving:
- Technical terminology (density, distortion, Logos, etc.)
- Markup syntax (`{term:xxx}`, `{ref:xxx}`)
- Code blocks and examples
- Document structure and formatting

**Command**:
```
Please translate docs/PROTOCOLO_ESCRITURA_V3.md to English.

Preserve:
- All technical terms (density not dimension, distortion not change, etc.)
- Markdown formatting
- Code examples
- Section structure

Create: docs/WRITING_PROTOCOL_V3.md
```

### Option 2: Manual Translation
- More accurate for nuanced editorial decisions
- Time-consuming
- Better for philosophical content

### Option 3: Hybrid Approach (Best)
1. AI translates initial draft
2. Human reviews for accuracy
3. Special attention to:
   - Voice guidelines
   - Philosophical concepts
   - Examples and edge cases

---

## 📋 Translation Checklist

For each translated file:

- [ ] Technical terms preserved (use glossary as reference)
- [ ] Markdown formatting intact
- [ ] Code blocks unchanged
- [ ] Links updated if necessary
- [ ] Examples translated but meaning preserved
- [ ] Header metadata updated (date, version)
- [ ] File added to ai/README.md or docs/

---

## 🎯 Proposed File Names (English)

| Spanish File | Proposed English Name |
|--------------|----------------------|
| `PROTOCOLO_ESCRITURA_V3.md` | `WRITING_PROTOCOL_V3.md` |
| `ESTRUCTURA_LIBRO_16_CAPITULOS.md` | `BOOK_STRUCTURE_16_CHAPTERS.md` |
| `TABLA_TERMINOS_COMPLETA_V2.md` | `MASTER_GLOSSARY_V2.md` |
| `ARQUITECTURA.md` | ~~Already exists~~ (keep Spanish version as alternative) |

---

## 📅 Suggested Timeline

If translating for public release:

| Task | Effort | Priority |
|------|--------|----------|
| Translate PROTOCOLO_ESCRITURA_V3.md | 2-3 hours | HIGH |
| Translate ESTRUCTURA_LIBRO_16_CAPITULOS.md | 2 hours | HIGH |
| Translate TABLA_TERMINOS_COMPLETA_V2.md | 1-2 hours | MEDIUM |
| **Total** | **5-7 hours** | - |

**Decision Point**: Is English accessibility worth 5-7 hours of work?

### Arguments FOR Translation:
- Wider accessibility for international contributors
- Professional appearance for public repository
- Consistency with other English documentation
- Easier for non-Spanish-speaking AI systems to process

### Arguments AGAINST Translation:
- AI can understand Spanish documentation
- Current bilingual status shows authenticity (Spanish author)
- Translation effort could be spent on other improvements
- Spanish versions can coexist with English versions

---

## 🤖 AI Translation Note

**Important**: While AI can understand Spanish files for replication purposes, having English versions:
1. Improves discoverability in searches
2. Reduces cognitive load for English-speaking users
3. Makes the repository more professional
4. Aligns with the rest of the documentation (mostly English)

However, Claude and other modern LLMs can work with Spanish documentation without issue.

---

## 🌐 Current Language Distribution

### Documentation Status

| Category | English | Spanish | Bilingual |
|----------|---------|---------|-----------|
| AI Methodology | ✅ Complete | - | - |
| Technical Arch | ✅ Complete | Legacy version exists | Both available |
| Writing Protocol | - | ✅ Complete | TO DO |
| Book Structure | - | ✅ Complete | TO DO |
| Glossary | JSON in 3 langs | ✅ Markdown | Partial |

### Content Files (JSON)
- ✅ English (16 chapters)
- ✅ Spanish (16 chapters)
- ✅ Portuguese (16 chapters)

---

## 💡 Recommendation

### For Public Release: TRANSLATE HIGH PRIORITY FILES

**Rationale**:
1. Professional consistency across documentation
2. Improved accessibility for international audience
3. Relatively low effort (5-7 hours) with high impact
4. Maintains Spanish originals as authoritative versions

**Implementation**:
1. Create English versions with `_EN` suffix or in parallel structure
2. Add language selection notes in README files
3. Keep both versions maintained going forward

**Alternative**:
Leave as-is with note in README: "Some documentation is in Spanish. Modern AI systems can process these files for replication purposes."

---

*Created: January 13, 2026*
*Status: Pending decision on translation priority*
