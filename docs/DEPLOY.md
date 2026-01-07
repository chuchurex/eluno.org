# Guía de Despliegue (Deployment)

Esta guía detalla los procesos para desplegar **The One (lawofone.cl)** en producción. El proyecto utiliza una arquitectura híbrida para optimizar costos y rendimiento.

## 🏗 Arquitectura de Despliegue

| Componente | Servicio | Método de Despliegue |
|------------|----------|----------------------|
| **Frontend** (HTML/JS/CSS) | **Cloudflare Pages** | Automático vía GitHub (o manual con Wrangler) |
| **Static Assets** (PDF/Audio) | **Hostinger** | Manual vía Script `npm run publish:media` |

---

## 1. Despliegue del Frontend (Cloudflare Pages)

El frontend incluye todo el sitio web, lógica, estilos y contenido de texto.

### Opción A: Despliegue Automático (Recomendado)
Cada vez que haces un **push** a la rama `main` en GitHub, se dispara una acción automática que construye y despliega el sitio.

1. Realiza tus cambios localmente.
2. Haz commit y push:
   ```bash
   git add .
   git commit -m "feat: actualización de contenido"
   git push origin main
   ```
3. Verifica el estado en [GitHub Actions](https://github.com/chuchurex/lawofone.cl/actions) o en el Dashboard de Cloudflare Pages.

### Opción B: Despliegue Manual (Desde IDE/Terminal)
Si necesitas desplegar sin pasar por git (ej. hotfix rápido o pruebas) o si falla el CI/CD, puedes usar **Wrangler** (CLI de Cloudflare).

**Requisitos:**
- Tener cuenta en Cloudflare.
- Estar logueado: `npx wrangler login`

**Comando:**
```bash
# Construir el proyecto
npm run build

# Desplegar a producción
npx wrangler pages deploy dist --project-name=lawofone
```

---

## 2. Despliegue de Media (Hostinger)

Los archivos pesados (PDFs generados y Audiobooks en MP3) se alojan en un servidor tradicional (Hostinger) bajo el subdominio `static.lawofone.cl` para evitar los límites de tamaño de Cloudflare Pages.

**Este proceso es MANUAL y debe ejecutarse cuando se generan nuevos audios o PDFs.**

### Requisitos
Asegúrate de tener las credenciales SSH/SFTP configuradas en tu archivo `.env`:
```bash
UPLOAD_HOST=x.x.x.x
UPLOAD_PORT=xxxxx
UPLOAD_USER=usuario
UPLOAD_PASS=contraseña
UPLOAD_DIR=domains/lawofone.cl/public_html/static
```

### Comandos

**Publicar todo el contenido media:**
```bash
npm run publish:media
```

Este script:
1. Conecta por SFTP al servidor.
2. Sube el contenido de las carpetas locales de audio y libros.
3. Mantiene la estructura de directorios correcta.

---

## 3. Configuración de Secretos (Variables de Entorno)

Para que los despliegues funcionen (tanto local como en CI/CD), se requieren ciertas variables.

### En Local (`.env`)
Copia `.env.example` a `.env` y rellena:
- `DOMAIN`: Dominio principal (lawofone.cl).
- Credenciales de Hostinger (`UPLOAD_*`) para subir media.

### En GitHub (Secrets)
Para que el CI/CD funcione, configura en el repositorio (Settings > Secrets and variables > Actions):

- `CF_API_KEY`: API Key de Cloudflare.
- `CF_EMAIL`: Email de tu cuenta Cloudflare.
- `CF_ACCOUNT_ID`: ID de cuenta Cloudflare.

---

## 4. Solución de Problemas (Troubleshooting)

**Error: "Quota Exceeded" en Cloudflare**
- Causa: Has subido demasiados archivos o archivos muy grandes al Frontend.
- Solución: Asegúrate de que los MP3 y PDF no estén en la carpeta `dist` que se sube a Cloudflare. El script de build debería borrarlos automáticamente de `dist`, pero verifícalo.

**Error: Fallo de conexión SFTP**
- Verificación: Revisa que tu IP no esté bloqueada por el firewall de Hostinger y que el puerto (usualmente no estandar, ej. 65002) sea correcto en `.env`.

**El sitio no muestra los cambios**
- Cloudflare hace cache agresivo. Purgar caché:
  - Desde Dashboard de Cloudflare > Caching > Configuration > Purge Everything.
