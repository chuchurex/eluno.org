# Guía para Crear un Nuevo Proyecto con esta Arquitectura

Esta arquitectura está lista para ser replicada en subdominios de lawofone.cl.

## 📋 Configuración Inicial

### 1. Definir el Proyecto

Antes de comenzar, define estos parámetros:

```json
{
  "subdominio": "nombre.lawofone.cl",
  "titulo": "Título del Libro",
  "bajadaPortada": "Subtítulo o descripción corta",
  "textoPortada": "Descripción completa para la portada",
  "creditosPie": "© 2026 Autor/Editorial - Licencia",
  "paginaAbout": "Información sobre el libro y proyecto",
  "conNotas": true,  // false = sin glosario ni barra lateral
  "idiomas": ["en", "es", "pt"]  // Idiomas disponibles
}
```

### 2. Infraestructura (Hostinger)

#### a) Crear Subdominio en Hostinger
1. Ve a hPanel → **Dominios**
2. Click en **Subdominios**
3. Crear: `nombre.lawofone.cl`
4. Apuntar a: `domains/lawofone.cl/public_html/nombre/`

#### b) Crear Cuenta SSH/FTP (si es necesario)
1. Ve a **Archivos** → **Cuentas FTP**
2. Usar las credenciales existentes (`u363856815`)
3. El deploy apuntará a: `domains/lawofone.cl/public_html/nombre/`

### 3. Configuración DNS (Cloudflare - Opcional)

Si quieres usar CDN de Cloudflare:

1. Ve a **DNS** en Cloudflare
2. Agregar registro CNAME:
   - Nombre: `nombre`
   - Destino: `lawofone.cl`
   - Proxy: Activado (naranja)

### 4. Configuración del Proyecto

#### a) Actualizar `.env`

```bash
# Copiar desde el proyecto base
cp .env .env.nombre

# Editar variables específicas
DOMAIN=nombre.lawofone.cl
UPLOAD_HOST=195.35.41.9
UPLOAD_PORT=65002
UPLOAD_USER=u363856815
UPLOAD_PASS=Lo.qwerty-44
```

#### b) Actualizar `i18n/{lang}/ui.json`

```json
{
  "siteTitle": "Título del Proyecto",
  "bookTitle": "Nombre del Libro",
  "subtitle": "Bajada/Descripción",
  "footer": {
    "credits": "© 2026 - Créditos del pie"
  }
}
```

#### c) Crear estructura de capítulos

Preparar los archivos JSON:

```
i18n/
  en/
    chapters/
      01.json
      02.json
      ...
    glossary.json (si conNotas: true)
    references.json (si conNotas: true)
    ui.json
  es/
    ...
  pt/
    ...
```

#### d) Configurar índice (opcional)

Crear `i18n/en/index.json`:

```json
{
  "chapters": [
    { "number": 1, "title": "Título Cap 1", "slug": "ch1" },
    { "number": 2, "title": "Título Cap 2", "slug": "ch2" }
  ]
}
```

### 5. Modificar Scripts de Deploy

Actualizar `scripts/deploy.js` para el nuevo subdominio:

```javascript
const remoteDir = "domains/lawofone.cl/public_html/nombre/";
```

### 6. Build y Deploy

```bash
# 1. Build HTML
npm run build

# 2. Build PDFs (todos los capítulos)
npm run build:pdf all

# 3. Deploy automático
npm run publish
```

## 🎨 Personalización Opcional

### Sin Notas / Glosario

Si `conNotas: false`:

1. **Remover del HTML**:
   - Barra lateral derecha
   - Links de términos
   - Panel de notas

2. **Remover del PDF**:
   - Ya está configurado para solo mostrar términos si existen

3. **Simplificar navegación**:
   - Solo capítulos + About
   - Sin panel de glosario

### Funcionalidades Disponibles

Todas estas funcionalidades están listas para usar:

- ✅ **Audiolibros**: Configurar con Fish Audio o Cartesia
- ✅ **Videos YouTube**: Agregar IDs en `ui.json`
- ✅ **PDFs**: Generación automática con Puppeteer
- ✅ **Multilingüe**: EN, ES, PT (agregar más idiomas si necesario)
- ✅ **Referencias**: Sistema de citas bibliográficas
- ✅ **Glosario**: Términos con notas al pie

## 📁 Estructura de Archivos por Proyecto

```
lawofone.cl/
├── dist/
│   ├── nombre/           # Subdominio "nombre"
│   │   ├── index.html
│   │   ├── ch1/
│   │   ├── pdf/
│   │   └── ...
│   └── otro/             # Otro subdominio
│       └── ...
├── i18n/
│   └── nombre/           # Datos específicos del proyecto
│       ├── en/
│       ├── es/
│       └── pt/
└── scripts/
    └── build-nombre.js   # Script específico si es necesario
```

## 🚀 Checklist de Lanzamiento

- [ ] Definir todos los parámetros del proyecto
- [ ] Crear subdominio en Hostinger
- [ ] Configurar DNS en Cloudflare (opcional)
- [ ] Preparar archivos JSON de capítulos
- [ ] Configurar ui.json en 3 idiomas
- [ ] Crear glosario y referencias (si conNotas: true)
- [ ] Actualizar .env con nuevo subdominio
- [ ] Modificar scripts/deploy.js
- [ ] Build HTML + PDFs
- [ ] Deploy automático
- [ ] Verificar sitio en nombre.lawofone.cl
- [ ] Configurar audiolibros (opcional)
- [ ] Agregar videos YouTube (opcional)
- [ ] Commit y tag de versión

## 🔧 Mantenimiento

### Deploy de Actualizaciones

```bash
# Editar archivos JSON de capítulos
vim i18n/nombre/es/chapters/01.json

# Build y deploy
npm run build
npm run publish
```

### Regenerar PDFs

```bash
# Capítulo específico
npm run build:pdf 01 es

# Todos los capítulos
npm run build:pdf all
```

### Actualizar Traducciones

```bash
# Si tienes el script de traducción automática
npm run translate:chapter 01
```

## 📝 Notas

- La arquitectura está diseñada para ser **multiproyecto** desde el inicio
- Cada subdominio es independiente pero comparte la base de código
- El deploy es automático y rápido (rsync sobre SSH)
- Los PDFs se generan con la misma fuente que los HTMLs
- Sistema de versionado con Git tags para cada proyecto

---

**Tag Base**: v1.0.0
**Arquitectura completa** con deploy automatizado, PDFs, multilingüe, y todas las funcionalidades.
