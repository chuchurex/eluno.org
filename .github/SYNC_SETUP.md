# Configuración de Sincronización Automática

## 🔧 Setup Inicial (Solo una vez)

### 1. Crear GitHub Personal Access Token

1. Ve a GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Nombre: `lawofone-to-template-sync`
4. Scopes requeridos:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. **Copia el token** (lo necesitarás en el siguiente paso)

### 2. Agregar el Token a lawofone.cl

1. Ve a https://github.com/chuchurex/lawofone.cl/settings/secrets/actions
2. Click "New repository secret"
3. Name: `TEMPLATE_SYNC_TOKEN`
4. Value: [pega el token del paso 1]
5. Click "Add secret"

## ✅ ¡Listo!

Ahora cada vez que hagas merge a `main` en lawofone.cl, si hay cambios en:
- `src/scss/**` (estilos)
- `scripts/build.js` o `scripts/build-pdf.js`
- `templates/**`
- `fonts/**`

El workflow automáticamente:
1. ✅ Copia los cambios a book-template
2. ✅ Crea un Pull Request para revisar
3. ✅ Tú decides si hacer merge o no

## 🔄 Cómo Funciona

```
lawofone.cl (main)
     ↓
  [cambios en SCSS/templates]
     ↓
  GitHub Actions detecta
     ↓
  Copia archivos a book-template
     ↓
  Crea PR en book-template
     ↓
  Tú revisas y haces merge
     ↓
  book-template actualizado ✅
```

## 🎯 Ejemplo de Uso

1. **En lawofone.cl**:
   ```bash
   git checkout -b feature/accessibility
   # Haces cambios en src/scss/
   git commit -m "feat: mejoras de accesibilidad"
   git push
   ```

2. **Creas PR y haces merge a main**

3. **GitHub Actions automáticamente**:
   - Detecta cambios en SCSS
   - Crea PR en book-template con los cambios
   - Te notifica

4. **En book-template**:
   - Revisas el PR
   - Si todo está bien, haces merge
   - El template queda actualizado

## 📝 Notas

- Solo se sincronizan archivos "genéricos" del front-end
- **NO** se sincronizan contenidos específicos (i18n, .env, etc.)
- Puedes revisar cada cambio antes de aplicarlo
- Si no quieres un cambio específico, simplemente no hagas merge del PR
