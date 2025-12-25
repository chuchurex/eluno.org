# Setup de GitHub y Deploy

## Paso 1: Crear el repositorio en GitHub

1. Ve a https://github.com/new
2. Crea un repo con nombre: `lawofone.cl`
3. Déjalo **público**
4. **NO** inicialices con README (ya lo tenemos)
5. Click "Create repository"

## Paso 2: Conectar el repo local a GitHub

Ejecuta estos comandos en terminal:

```bash
cd /Users/chuchurex/Sites/lawofone.cl
git remote add origin https://github.com/chuchurex/lawofone.cl.git
git push -u origin main
```

## Paso 3: Configurar secretos FTP

Ve a tu repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Crea estos 4 secretos con los datos de tu BananaHosting:

| Nombre | Valor (ejemplo) |
|--------|-----------------|
| `FTP_SERVER` | `ftp.lawofone.cl` o IP del servidor |
| `FTP_USERNAME` | Tu usuario FTP |
| `FTP_PASSWORD` | Tu contraseña FTP |
| `FTP_SERVER_DIR` | `/public_html/` o la ruta donde va el sitio |

> **Nota**: Los datos FTP los encuentras en tu panel de BananaHosting, sección "Cuentas FTP" o "Acceso FTP".

## Paso 4: Probar el deploy

Una vez configurados los secretos:
1. Ve a tu repo → **Actions**
2. Click en "Build and Deploy" 
3. Click "Run workflow" → "Run workflow"
4. Espera ~2 minutos y revisa lawofone.cl

## Para Claude Desktop

Después de configurar esto, desde Claude Desktop podrás:
1. Escribir un capítulo nuevo
2. Guardar el JSON en `i18n/en/chapters/XX.json`
3. Hacer commit y push
4. El deploy será automático

---

**¿Necesitas ayuda para encontrar los datos FTP de BananaHosting?**

Generalmente están en:
- cPanel → Cuentas FTP
- O Plesk → Acceso FTP
