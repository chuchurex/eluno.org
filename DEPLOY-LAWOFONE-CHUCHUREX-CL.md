# Deploy de lawofone.chuchurex.cl - 11 Enero 2026

## ✅ Completado

### DNS y Configuración de Cloudflare
- ✅ Registro DNS `lawofone.chuchurex.cl` creado apuntando a Hostinger (195.35.41.9)
- ✅ Cloudflare Proxy activado (naranja - protección DDoS + CDN)
- ✅ SSL Mode: Full (HTTPS end-to-end)
- ✅ Cache purgado para mostrar cambios inmediatos

### Configuración del Proyecto
- ✅ `.env` actualizado con nuevo dominio:
  ```
  DOMAIN=lawofone.chuchurex.cl
  UPLOAD_DIR=/home/u363856815/domains/lawofone.chuchurex.cl/public_html
  ```
- ✅ `scripts/deploy.js` actualizado para usar `UPLOAD_DIR` del `.env`

### Build y Deploy
- ✅ Sitio rebuildeado con nuevo dominio
- ✅ 283 archivos deployados vía rsync a Hostinger
- ✅ Sitio funcionando en: https://lawofone.chuchurex.cl

---

## 📊 Verificación

### DNS
```bash
# Registro A
lawofone.chuchurex.cl → 195.35.41.9 (Proxied via Cloudflare)
```

### SSL/HTTPS
```bash
curl -I https://lawofone.chuchurex.cl
# HTTP/2 200 OK
# Server: cloudflare
# Platform: hostinger
```

### Contenido
```bash
# Título actualizado
<title>The One | lawofone.chuchurex.cl</title>
```

---

## 📂 Estructura del Sitio

```
dist/
├── index.html              # TOC English
├── the-one/index.html      # Chapter 1 EN
├── the-harvest/index.html  # Chapter 7 EN
├── ...
├── es/
│   ├── index.html          # TOC Español
│   ├── el-uno/index.html   # Capítulo 1 ES
│   └── ...
├── pt/
│   ├── index.html          # TOC Português
│   ├── o-um/index.html     # Capítulo 1 PT
│   └── ...
├── books/                  # PDFs de Ra Material
├── pdf/                    # PDFs de capítulos (EN/ES/PT)
├── css/                    # Estilos compilados
└── fonts/                  # Fuentes web
```

---

## 🚀 Comandos de Deploy

### Build
```bash
cd /Users/chuchurex/Sites/vigentes/lawofone.cl
npm run build
```

### Deploy
```bash
node scripts/deploy.js
```

### Build + Deploy (en un solo comando)
```bash
npm run build && node scripts/deploy.js
```

---

## 🔧 Credenciales (desde .env)

### Hostinger SSH/RSYNC
```
Host: 195.35.41.9
Port: 65002
User: u363856815
Pass: Lo.qwerty-44
Dir:  /home/u363856815/domains/lawofone.chuchurex.cl/public_html
```

### Cloudflare
```
Zone ID: 0703a29a0195cb830924c8e679b75b6e
Email:   chuchurex@gmail.com
API Key: 8c9c5664c8f9cf1155faec65b053415aad211
```

---

## 📋 Checklist de Producción

### ✅ Completado
- [x] DNS configurado y propagado
- [x] SSL/HTTPS activo (modo Full)
- [x] Sitio deployado y funcionando
- [x] Cache de Cloudflare purgado
- [x] Título y meta tags actualizados con nuevo dominio
- [x] Robots.txt generado
- [x] Sitemap.xml generado
- [x] .htaccess copiado

### ⏳ Pendiente (Según CONTEXT_V04.md)
- [ ] Verificar Google Search Console (si se va a indexar)
- [ ] Verificar Google Analytics (GA_MEASUREMENT_ID)
- [ ] Quitar meta robots noindex (si está presente)
- [ ] Implementar JSON-LD schema.org (si no está)
- [ ] Verificar hreflang ES/EN/PT

---

## 🌐 URLs del Sitio

### Producción
- **Home EN:** https://lawofone.chuchurex.cl
- **Home ES:** https://lawofone.chuchurex.cl/es/
- **Home PT:** https://lawofone.chuchurex.cl/pt/
- **About:** https://lawofone.chuchurex.cl/about/

### Ejemplo de Capítulos
- **Chapter 1 EN:** https://lawofone.chuchurex.cl/the-one/
- **Capítulo 1 ES:** https://lawofone.chuchurex.cl/es/el-uno/
- **Capítulo 1 PT:** https://lawofone.chuchurex.cl/pt/o-um/

---

## 📚 Recursos

### L/L Research
- **Sitio oficial:** https://llresearch.org
- **Law of One Archive:** https://lawofone.info
- **Autorización:** Concedida el 10 Enero 2026

### Documentación del Proyecto
- `CONTEXT_V04.md` - Estado del proyecto
- `PROTOCOLO_ESCRITURA_V3.md` - Voz y formato
- `TABLA_TERMINOS_COMPLETA_V2.md` - Glosario (136 términos)
- `CORRESPONDENCIA_LL_RESEARCH.md` - Comunicación con L/L

---

## 🎯 Próximos Pasos

### Contenido
1. Continuar con audiolibros (EN/PT pendientes)
2. Generar PDFs descargables por capítulo
3. Versión impresa Amazon KDP (opcional)

### SEO (si se va a indexar)
1. Submit sitemap a Google Search Console
2. Configurar analytics
3. Implementar structured data (JSON-LD)
4. Contactar Tobey Wheelock (lawofone.info) para enlaces

### Mejoras Técnicas
1. PWA (Service Worker para offline)
2. Optimización de imágenes
3. Lazy loading de capítulos
4. Búsqueda full-text

---

## 🐛 Troubleshooting

### Problema: Sitio no muestra cambios
**Solución:** Purgar cache de Cloudflare
```bash
curl -X POST 'https://api.cloudflare.com/client/v4/zones/0703a29a0195cb830924c8e679b75b6e/purge_cache' \
  -H 'X-Auth-Email: chuchurex@gmail.com' \
  -H 'X-Auth-Key: 8c9c5664c8f9cf1155faec65b053415aad211' \
  -H 'Content-Type: application/json' \
  -d '{"purge_everything":true}'
```

### Problema: Error 522 (Connection timed out)
**Solución:** Verificar que Hostinger esté respondiendo
```bash
curl -I http://195.35.41.9
```

### Problema: rsync falla con "Permission denied"
**Solución:** Verificar credenciales SSH en `.env`
```bash
# Test SSH connection
sshpass -p 'Lo.qwerty-44' ssh -p 65002 -o StrictHostKeyChecking=no u363856815@195.35.41.9 "ls -la"
```

---

## 📞 Contacto

**Desarrollador:** Carlos Martínez (Chuchu)
**Email:** chuchurex@gmail.com
**Ubicación:** Santiago, Chile

---

## 🙏 Filosofía del Proyecto

> "The book presents universal philosophical truth. The teachings stand on their own."
> — L/L Research Authorization, January 10, 2026

Este proyecto combina:
- **Fidelidad al mensaje de Ra** por encima de todo
- **Accesibilidad** sin sacrificar profundidad
- **Respeto al libre albedrío** del lector
- **Humildad ante el misterio**
- **Servicio a otros** como motivación

---

*Documento generado: 11 de enero de 2026*
*Deploy exitoso en primera ejecución ✓*
