# The One — lawofone.cl

Reinterpretación filosófica del Material Ra (La Ley del Uno) como narrativa accesible.

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Copiar configuración de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Desarrollo (SASS watch + live-server)
npm run dev

# Build
npm run build
```

## Estructura

```
├── src/scss/           # SASS modular
├── i18n/               # Contenido JSON por idioma
│   ├── en/             # Inglés (base)
│   ├── es/             # Español
│   └── pt/             # Portugués
├── scripts/            # Scripts de build y deploy
├── dist/               # Output (generado)
└── .env.example        # Template de configuración
```

## Arquitectura

| Componente | Servicio | URL |
|------------|----------|-----|
| Frontend | Cloudflare Pages | lawofone.cl |
| Static Assets | Hostinger | static.lawofone.cl |

## Deploy

### Automático (Frontend)
Push a `main` → Cloudflare Pages compila y despliega.

### Media (MP3/PDF)
```bash
npm run publish:media
```
Requiere credenciales SSH en `.env`.

## Escribir Capítulos

Ver `.agent/workflows/chapter-writing.md`

## Licencia

Contenido derivado del Material Ra. Ver footer del sitio para atribución.
