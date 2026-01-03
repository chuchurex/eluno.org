# The One — lawofone.cl

Reinterpretación filosófica del Material Ra (La Ley del Uno) como narrativa accesible.

## 🚀 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Desarrollo (SASS watch + live-server)
npm run dev

# Solo build
npm run build
```

## 📁 Estructura

```
├── src/scss/           # SASS modular
├── i18n/               # Contenido JSON por idioma
│   ├── en/             # Inglés (base)
│   ├── es/             # Español
│   └── pt/             # Portugués
├── scripts/build.js    # Genera HTML desde JSON
├── dist/               # Output (generado por CI)
└── docs/CONTEXT.md     # Contexto para Claude Desktop
```

## 🌍 Idiomas

- **EN**: Inglés (idioma base, controlado para traducciones)
- **ES**: Español
- **PT**: Portugués

## 📖 Capítulos

| # | Título | Estado |
|---|--------|--------|
| 1 | Cosmology and Genesis | ✅ EN/ES/PT |
| 2 | The Creator and Creation | ✅ EN/ES/PT |
| 3-16 | Por escribir | 📝 |

## 🔄 Deploy

Este proyecto usa **Cloudflare Pages** para deploys automáticos.

### Deploy Automático
Cada push a `main` despliega automáticamente a producción:

1. Push a `main`
2. Cloudflare Pages compila el proyecto (`npm run build`)
3. Deploy automático a https://lawofone.cl

### Deploy Manual (legacy)
El script `npm run publish` sigue disponible para FTP si es necesario.

## 📝 Escribir Nuevos Capítulos

Ver workflow en `.agent/workflows/chapter-writing.md`

## 📜 Licencia

Contenido basado en el Material Ra (dominio público).
