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

El deploy es automático via GitHub Actions:

1. Push a `main`
2. GitHub Actions compila SASS + HTML
3. FTP upload a lawofone.cl

## 📝 Escribir Nuevos Capítulos

Ver workflow en `.agent/workflows/chapter-writing.md`

## 📜 Licencia

Contenido basado en el Material Ra (dominio público).
