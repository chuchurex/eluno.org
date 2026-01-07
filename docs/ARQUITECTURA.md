# Arquitectura Completa - lawofone.cl

> **Versión:** 1.0
> **Fecha:** 4 Enero 2026
> **Propósito:** Documento de referencia para replicar esta arquitectura en otros proyectos

---

## 1. Visión General

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FLUJO DE DEPLOY                                │
└─────────────────────────────────────────────────────────────────────────────┘

  Developer        GitHub           GitHub Actions      Cloudflare Pages
     │                │                   │                    │
     │   git push     │                   │                    │
     ├───────────────►│   trigger         │                    │
     │                ├──────────────────►│                    │
     │                │                   │  npm run build     │
     │                │                   │  wrangler deploy   │
     │                │                   ├───────────────────►│
     │                │                   │                    │
     │                │                   │              ┌─────┴─────┐
     │                │                   │              │  LIVE!    │
     │                │                   │              │ lawofone  │
     │                │                   │              │   .cl     │
     │                │                   │              └───────────┘
```

---

## 2. Stack Tecnológico

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| HTML5 | - | Estructura semántica |
| SCSS/SASS | 1.69.0 | Estilos modulares |
| JavaScript | ES6+ | Interactividad (vanilla) |
| Google Fonts | Self-hosted | Tipografía (woff2) |

### Build System
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | 20.x | Runtime |
| npm | 10.x | Package manager |
| dotenv | 17.x | Variables de entorno |
| SASS | 1.69.0 | Compilador CSS |
| Puppeteer | 24.x | Generación PDFs |
| live-server | 1.2.2 | Dev server |
| concurrently | 8.2.0 | Múltiples procesos |

### Hosting & CDN
| Servicio | Uso |
|----------|-----|
| Cloudflare Pages | Frontend + Functions |
| Hostinger | Static assets (audio/pdf) |
| GitHub | Repositorio + CI/CD |

### APIs Externas
| Servicio | Uso |
|----------|-----|
| Fish Audio | Text-to-Speech |
| Cartesia | TTS alternativo |
| Google Analytics | Métricas |

---

## 3. Estructura de Directorios

```
lawofone.cl/
├── .env                    # Variables de entorno (NO en git)
├── .env.example            # Template de variables
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD GitHub Actions
├── .gitignore
├── _headers.template       # Template para headers CF (con {{DOMAIN}})
├── wrangler.toml           # Config Cloudflare Workers/Pages
├── package.json
│
├── src/
│   ├── scss/
│   │   ├── main.scss       # Entry point SCSS
│   │   ├── _variables.scss
│   │   ├── _typography.scss
│   │   ├── _layout.scss
│   │   ├── _sidebar.scss
│   │   ├── _notes.scss
│   │   └── _responsive.scss
│   ├── fonts/
│   │   ├── fonts.css       # @font-face definitions
│   │   ├── cormorant-garamond-400.woff2
│   │   ├── spectral-400.woff2
│   │   └── ...
│   └── templates/          # (futuro) HTML templates
│
├── scripts/
│   ├── build.js            # Generador HTML principal
│   ├── translate.js        # Traducción con Claude API
│   ├── translate-chapter.js
│   ├── build-pdf.js        # Generación PDFs
│   └── publish-media.js    # Upload a Hostinger
│
├── functions/
│   └── api/
│       └── send-feedback.js  # Cloudflare Function
│
├── i18n/
│   ├── en/
│   │   ├── ui.json         # Strings de interfaz
│   │   ├── glossary.json   # Términos del glosario
│   │   ├── references.json # Referencias bibliográficas
│   │   ├── media.json      # URLs de media
│   │   ├── about.json      # Página About
│   │   └── chapters/
│   │       ├── 01.json
│   │       ├── 02.json
│   │       └── ...
│   ├── es/
│   │   └── ... (misma estructura)
│   └── pt/
│       └── ... (misma estructura)
│
├── dist/                   # Output (generado, en .gitignore en producción)
│   ├── index.html
│   ├── css/main.css
│   ├── fonts/
│   ├── _headers
│   ├── ch1/index.html
│   ├── ch2/index.html
│   ├── ...
│   ├── es/
│   │   ├── index.html
│   │   ├── ch1/index.html
│   │   └── ...
│   └── pt/
│       └── ...
│
├── docs/                   # Documentación
│   ├── ARQUITECTURA.md     # Este archivo
│   ├── CLAUDE.md
│   └── ...
│
└── private-context.md      # Contexto privado (NO en git)
```

---

## 4. Configuración de Variables

### `.env` (local, nunca en git)

```bash
# DOMAIN CONFIGURATION
DOMAIN=lawofone.cl
STATIC_SUBDOMAIN=static

# HOSTINGER - Static Assets
UPLOAD_HOST=195.35.41.9
UPLOAD_PORT=65002
UPLOAD_USER=usuario
UPLOAD_PASS=password
UPLOAD_DIR=domains/lawofone.cl/public_html/static

# CLOUDFLARE
CF_API_KEY=your-api-key
CF_EMAIL=your-email
CF_ZONE_ID=your-zone-id

# APIs OPCIONALES
FISH_API_KEY=your-fish-key
CARTESIA_API_KEY=your-cartesia-key
```

### `wrangler.toml` (en git)

```toml
name = "lawofone"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"

[vars]
DOMAIN = "lawofone.cl"
```

### GitHub Secrets

| Secret | Uso |
|--------|-----|
| `CF_API_KEY` | Cloudflare API Key |
| `CF_EMAIL` | Email de Cloudflare |
| `CF_ACCOUNT_ID` | Account ID de Cloudflare |

---

## 5. CI/CD Pipeline

### `.github/workflows/deploy.yml`

```yaml
name: Build and Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build SASS
      run: npm run sass:build

    - name: Build HTML from JSON
      run: npm run build

    - name: Remove large files (go to Hostinger)
      run: |
        rm -rf dist/audio dist/audiobook dist/books
        find dist -name "*.mp3" -delete
        find dist -name "*.pdf" -delete

    - name: Deploy to Cloudflare Pages
      env:
        CLOUDFLARE_API_KEY: ${{ secrets.CF_API_KEY }}
        CLOUDFLARE_EMAIL: ${{ secrets.CF_EMAIL }}
        CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}
      run: npx wrangler pages deploy dist --project-name=lawofone
```

---

## 6. Security Headers

### `_headers.template`

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' https://static.{{DOMAIN}} https://www.google-analytics.com data:; font-src 'self'; connect-src 'self' https://www.google-analytics.com https://static.{{DOMAIN}}; media-src 'self' https://static.{{DOMAIN}}; frame-ancestors 'none'

/css/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/i18n/*
  Cache-Control: public, max-age=3600
```

El placeholder `{{DOMAIN}}` se reemplaza durante el build.

---

## 7. Cloudflare Function (API)

### `functions/api/send-feedback.js`

```javascript
// Rate limiting en memoria
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 3;   // 3 req/min por IP

function isRateLimited(ip) { /* ... */ }

// CORS dinámico desde env.DOMAIN
function getAllowedOrigins(env) {
  const domain = env.DOMAIN || 'lawofone.cl';
  return [
    `https://${domain}`,
    `https://www.${domain}`
  ];
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const allowedOrigins = getAllowedOrigins(env);

  // Rate limiting
  const clientIP = request.headers.get('CF-Connecting-IP');
  if (isRateLimited(clientIP)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
  }

  // Validación y procesamiento
  const data = await request.json();
  // ...
}

export async function onRequestOptions(context) {
  // CORS preflight
}
```

---

## 8. Build Process

### `scripts/build.js` (simplificado)

```javascript
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Domain desde .env
const DOMAIN = process.env.DOMAIN || 'lawofone.cl';
const STATIC_SUBDOMAIN = process.env.STATIC_SUBDOMAIN || 'static';
const SITE_URL = `https://${DOMAIN}`;
const STATIC_BASE_URL = `https://${STATIC_SUBDOMAIN}.${DOMAIN}`;

function build() {
  // 1. Cargar contenido JSON
  // 2. Generar HTML para cada idioma
  // 3. Copiar assets
  // 4. Generar _headers desde template

  let headersContent = fs.readFileSync('_headers.template', 'utf8');
  headersContent = headersContent.replace(/\{\{DOMAIN\}\}/g, DOMAIN);
  fs.writeFileSync('dist/_headers', headersContent);
}
```

---

## 9. Arquitectura de Hosting Híbrido

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE PAGES                                    │
│                         (lawofone.cl)                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  ✓ HTML estático (48 páginas = 16 caps × 3 idiomas)                        │
│  ✓ CSS minificado                                                           │
│  ✓ Fonts (woff2 self-hosted)                                               │
│  ✓ JavaScript                                                               │
│  ✓ i18n JSON                                                                │
│  ✓ Imágenes pequeñas                                                        │
│  ✓ Cloudflare Function (/api/send-feedback)                                │
│                                                                             │
│  CDN: Automático, edge caching global                                      │
│  Compresión: Brotli automático                                             │
│  SSL: Automático                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ referencias a static.lawofone.cl
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          HOSTINGER                                          │
│                    (static.lawofone.cl)                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ✓ Audio MP3 (16 capítulos × 3 idiomas = 48 archivos)                      │
│  ✓ PDFs (16 capítulos × 3 idiomas = 48 archivos)                           │
│  ✓ Audiobooks completos                                                     │
│                                                                             │
│  Razón: Archivos grandes que exceden límites de CF Pages                   │
│  Upload: Via SFTP con scripts/publish-media.js                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Scripts npm

```json
{
  "scripts": {
    "sass:watch": "sass --watch src/scss/main.scss:dist/css/main.css",
    "sass:build": "sass src/scss/main.scss:dist/css/main.css --style=compressed",
    "serve": "live-server dist --port=3002",
    "dev": "concurrently \"npm run sass:watch\" \"npm run serve\"",
    "build": "npm run sass:build && node scripts/build.js",
    "translate": "node scripts/translate.js",
    "translate:chapter": "node scripts/translate-chapter.js",
    "build:pdf": "node scripts/build-pdf.js",
    "publish:media": "node scripts/publish-media.js"
  }
}
```

---

## 11. Migración de Dominio

Cuando se necesite cambiar de dominio:

### 1. Actualizar `.env`
```bash
DOMAIN=nuevodominio.com
STATIC_SUBDOMAIN=static
```

### 2. Actualizar `wrangler.toml`
```toml
[vars]
DOMAIN = "nuevodominio.com"
```

### 3. Rebuild y deploy
```bash
npm run build
git add . && git commit -m "chore: migrate to nuevodominio.com"
git push
```

### 4. Configurar en Cloudflare
- Agregar dominio personalizado en Pages
- Configurar DNS (CNAME a *.pages.dev)

### 5. Verificar
- [ ] Headers CSP correctos
- [ ] CORS permite nuevo dominio
- [ ] Canonical URLs actualizadas
- [ ] Static subdomain funcionando

---

## 12. Checklist de Seguridad

| Item | Estado | Implementación |
|------|--------|----------------|
| HTTPS | ✅ | Automático CF |
| CSP Header | ✅ | `_headers.template` |
| X-Frame-Options | ✅ | DENY |
| X-Content-Type-Options | ✅ | nosniff |
| CORS restringido | ✅ | Solo dominio propio |
| Rate limiting | ✅ | 3 req/min por IP |
| Secrets en .env | ✅ | No en git |
| Input validation | ✅ | En CF Function |
| noindex (temporal) | ✅ | Hasta lanzamiento |

---

## 13. Monitoreo

### Cloudflare Dashboard
- **Analytics** → Tráfico y requests
- **Pages > Functions > Logs** → Logs de feedback en tiempo real

### GitHub Actions
```bash
gh run list --limit 5
gh run watch <run-id>
```

### Verificar headers en producción
```bash
curl -sI https://lawofone.cl | head -20
```

---

## 14. Comandos Útiles

```bash
# Desarrollo local
npm run dev                     # Servidor + watch SCSS

# Build completo
npm run build                   # Genera dist/

# Traducir capítulo
npm run translate:chapter -- --chapter=08 --lang=es

# Generar PDFs
npm run build:pdf

# Publicar media a Hostinger
npm run publish:media

# Deploy manual (si falla CI)
npx wrangler pages deploy dist --project-name=lawofone

# Purgar cache Cloudflare
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CF_API_KEY}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

---

## 15. Replicar en Nuevo Proyecto

1. **Copiar estructura base:**
   - `package.json`
   - `.github/workflows/deploy.yml`
   - `wrangler.toml`
   - `_headers.template`
   - `.gitignore`
   - `.env.example`

2. **Crear proyecto en Cloudflare Pages:**
   ```bash
   npx wrangler pages project create nombre-proyecto
   ```

3. **Configurar GitHub Secrets:**
   - `CF_API_KEY`
   - `CF_EMAIL`
   - `CF_ACCOUNT_ID`

4. **Configurar dominio:**
   - Agregar dominio en CF Pages
   - Configurar DNS

5. **Adaptar `build.js`** según necesidades del proyecto

---

## 16. YouTube: Generación y Subida de Videos

### Visión General

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      FLUJO YOUTUBE - AUDIOLIBRO                             │
└─────────────────────────────────────────────────────────────────────────────┘

  Audio MP3              Script                    Video MP4            YouTube
  (16 caps)             Generador                 (16 caps)              API
     │                      │                         │                    │
     │  audiobook/audio/es/ │                         │                    │
     ├─────────────────────►│ build-youtube-videos.js │                    │
     │                      ├────────────────────────►│                    │
     │                      │   video/youtube/*.mp4   │                    │
     │                      │                         │  upload-youtube.js │
     │                      │                         ├───────────────────►│
     │                      │                         │                    │
     │                      │                         │    16 videos en    │
     │                      │                         │    canal YouTube   │
     │                      │                         │                    │
```

### Estructura de Archivos YouTube

```
lawofone.cl/
├── scripts/
│   └── build-youtube-videos.js    # Genera videos con fondo de estrellas
│
├── video/
│   ├── youtube/                   # Output de videos generados
│   │   ├── stars-loop-60s.mp4     # Loop reutilizable (2.4 MB)
│   │   ├── 01-cosmolog-a-y-g-nesis.mp4
│   │   ├── 02-el-creador-y-la-creaci-n.mp4
│   │   └── ... (16 videos totales)
│   │
│   ├── upload-youtube.js          # Sube videos a YouTube
│   ├── replace-youtube-videos.js  # Reemplaza videos existentes
│   ├── client_secret.json         # Credenciales OAuth (NO en git)
│   ├── youtube_token.json         # Token de acceso (NO en git)
│   └── upload_results.json        # IDs de videos subidos
│
├── audiobook/audio/es/            # Audio fuente (16 MP3s)
│   ├── 01-cosmologia-y-genesis.mp3
│   ├── 02-el-creador-y-la-creacion.mp3
│   └── ... (16 archivos)
│
└── client_secret_*.json           # Credenciales OAuth (raíz, NO en git)
```

### Paso 1: Generar Videos

El script `build-youtube-videos.js` combina:
- Fondo animado de estrellas (CSS → Puppeteer → FFmpeg)
- Audio MP3 del capítulo
- Título superpuesto

```bash
# Generar todos los videos
node scripts/build-youtube-videos.js

# Generar solo un capítulo específico
node scripts/build-youtube-videos.js --chapter=5

# Regenerar solo el loop de estrellas
node scripts/build-youtube-videos.js --loop-only
```

**Configuración del generador:**
- Resolución: 1920×1080 (Full HD)
- FPS: 30
- Codec video: libx264, CRF 23
- Codec audio: AAC 192kbps
- Loop de estrellas: 60 segundos, se repite según duración del audio

**Proceso interno:**
1. Genera CSS con estrellas aleatorias (box-shadow)
2. Puppeteer captura imagen alta (3× altura)
3. FFmpeg anima imagen con scroll vertical
4. Combina loop + audio + texto overlay

### Paso 2: Subir a YouTube

```bash
cd video
node upload-youtube.js --all           # Sube los 16 videos
node upload-youtube.js --episode 5     # Sube solo capítulo 5
```

**Primera vez (autenticación):**
1. El script abre URL de autorización de Google
2. Usuario autoriza en el navegador
3. Callback a `localhost:3000` guarda el token
4. Token se reutiliza en futuras ejecuciones

**IMPORTANTE:** El script busca videos en `video/dist/videos/`. Para usar los nuevos videos de `video/youtube/`, actualizar la constante `VIDEOS_DIR` en el script o mover los archivos.

### Credenciales Google API

**Proyecto Google Cloud:** `lawofone-youtube`
- YouTube Data API v3 habilitada
- OAuth 2.0 Client ID tipo "Web application"
- Redirect URI: `http://localhost:3000/oauth2callback`

**Archivos de credenciales:**
| Archivo | Contenido | En Git |
|---------|-----------|--------|
| `client_secret.json` | Client ID + Secret | ❌ NO |
| `youtube_token.json` | Access + Refresh token | ❌ NO |
| `youtube_token_replace.json` | Token con scope delete | ❌ NO |

**Scopes utilizados:**
```javascript
// Upload simple
['https://www.googleapis.com/auth/youtube.upload']

// Replace/Delete (requiere más permisos)
[
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.force-ssl'
]
```

### Metadatos de Videos

Los 16 capítulos con sus metadatos están definidos en `upload-youtube.js`:

| Cap | Título |
|-----|--------|
| 01 | Cosmología y Génesis |
| 02 | El Creador y la Creación |
| 03 | Las Densidades de Consciencia |
| 04 | La Historia Espiritual de la Tierra |
| 05 | Polaridad: Los Dos Caminos |
| 06 | Errantes: Los Que Regresan |
| 07 | La Cosecha |
| 08 | El Velo del Olvido |
| 09 | La Muerte y el Viaje Entre Vidas |
| 10 | Los Centros de Energía |
| 11 | Catalizador y Experiencia |
| 12 | El Yo Superior y la Guía Interior |
| 13 | Libre Albedrío y la Ley de Confusión |
| 14 | La Cosecha y la Transición |
| 15 | Viviendo la Ley del Uno |
| 16 | El Retorno |

**Configuración de publicación:**
- Categoría: 27 (Educación)
- Idioma: Español
- Estado inicial: `unlisted` (cambiar a `public` después de revisar)
- Made for Kids: `false`

### Playlist

**ID:** `PL5xfCBL9Dh7HF-DJ7aXX9jfTagZ1U4fl2`
**URL:** https://www.youtube.com/playlist?list=PL5xfCBL9Dh7HF-DJ7aXX9jfTagZ1U4fl2

### Actualizar Referencias en el Sitio

Los IDs de YouTube se guardan en `/i18n/es/media.json`:

```json
{
  "1": {
    "pdf": "/pdf/es/ch01.pdf",
    "audio": "/audiobook/audio/es/01-cosmologia-y-genesis.mp3",
    "youtube": "https://youtu.be/VIDEO_ID_AQUI"
  }
}
```

El script `replace-youtube-videos.js` actualiza automáticamente este archivo.

### Flujo Completo de Publicación

```bash
# 1. Generar los 16 videos (~2-3 min por video)
node scripts/build-youtube-videos.js

# 2. Verificar que se crearon
ls -la video/youtube/*.mp4

# 3. Subir a YouTube (requiere autenticación primera vez)
cd video
node upload-youtube.js --all

# 4. Los videos se suben como "unlisted"
# 5. Revisar en YouTube Studio
# 6. Cambiar a "public" cuando estén listos

# 7. Actualizar media.json con nuevos IDs (manual o con replace script)
```

### Troubleshooting

**Error: "quota exceeded"**
- La API tiene límite diario. Esperar 24 horas.

**Error: "token expired"**
- Eliminar `youtube_token.json` y re-autenticar.

**Error: "client_secret.json not found"**
1. Ir a Google Cloud Console
2. APIs & Services → Credentials
3. Descargar OAuth 2.0 Client ID
4. Guardar como `video/client_secret.json`

**Videos no se encuentran**
- Verificar que `VIDEOS_DIR` apunte al directorio correcto
- Default: `video/dist/videos/`
- Nuevos videos: `video/youtube/`

---

*Documento generado: 4 Enero 2026*
*Última actualización: 4 Enero 2026*
*Proyecto: lawofone.cl*
