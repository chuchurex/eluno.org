# Configuración de Build para Cloudflare Pages

## Variables de Entorno Requeridas

En el panel de Cloudflare Pages → Settings → Environment variables:

```
NODE_VERSION = 20
```

## Comandos de Build por Proyecto

### Proyecto: todo
**Build command:**
```bash
cd packages/todo && npm install && npm run build
```

**Build output directory:**
```
packages/todo/dist
```

---

### Proyecto: sanacion
**Build command:**
```bash
cd packages/sanacion && npm install && npm run build
```

**Build output directory:**
```
packages/sanacion/dist
```

---

### Proyecto: jesus
**Build command:**
```bash
cd packages/jesus && npm install && npm run build
```

**Build output directory:**
```
packages/jesus/dist
```

---

## Notas Importantes

1. **npm install dentro del comando:** Incluimos `npm install` en cada comando de build para garantizar que las dependencias locales se resuelvan correctamente en el ambiente de Cloudflare Pages.

2. **Estructura limpia:** La raíz del repositorio ahora está limpia, con todos los archivos antiguos movidos a `old_root_files/`.

3. **Monorepo:** Los tres proyectos están organizados en `packages/`:
   - `packages/todo` - eltodonuestro.org
   - `packages/sanacion` - lasanacion.org
   - `packages/jesus` - eljesus.org

4. **Framework preset:** Usa "Astro" como framework preset en Cloudflare Pages para cada proyecto.

## Pasos para Configurar en Cloudflare

1. Ve a tu dashboard de Cloudflare Pages
2. Para cada proyecto (todo, sanacion, jesus):
   - Crea un nuevo proyecto o edita el existente
   - Configura el comando de build según la tabla arriba
   - Configura el directorio de salida (Build output directory)
   - Asegúrate de tener `NODE_VERSION=20` en las variables de entorno
   - Despliega

## Verificación Post-Deploy

Después de desplegar, verifica:
- [ ] El sitio carga correctamente
- [ ] Los assets (CSS, JS, imágenes) se cargan
- [ ] Las rutas funcionan correctamente
- [ ] No hay errores 404 en la consola del navegador
