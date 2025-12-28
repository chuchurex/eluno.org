# 📖 Translation Workflow Documentation

## Santo y Seña (Password/Keyword)

**Comando mágico para agentes IA:**
```
"Traducir capítulo [número] con workflow completo de lawofone.cl"
```

Cuando un agente IA (Claude Code, otro LLM, o sistema automatizado) reciba esta instrucción, debe ejecutar el flujo completo de traducción documentado aquí.

---

## 🎯 Propósito

Este documento mapea el flujo COMPLETO de traducción de capítulos para lawofone.cl, incluyendo:
- Generación de traducciones ES y PT
- Actualización de archivos HTML
- Build del sitio
- Commits de git
- Push al repositorio

---

## 📋 Mapa del Proceso

### Archivos Involucrados

```
lawofone.cl/
├── i18n/
│   ├── en/chapters/XX.json        # Fuente (inglés)
│   ├── es/chapters/XX.json        # Destino (español) ← CREAR
│   └── pt/chapters/XX.json        # Destino (portugués) ← CREAR
├── index.html                     # ← ACTUALIZAR navegación
├── es/index.html                  # ← ACTUALIZAR navegación (si existe)
├── dist/                          # ← REGENERAR con build
│   ├── index.html
│   ├── es/index.html
│   └── pt/index.html
└── scripts/
    ├── translate-chapter.js       # Script de automatización
    └── build.js                   # Script de build
```

### Flujo de Trabajo (6 Pasos)

```
┌─────────────────────────────────────────────────────────────┐
│ PASO 1: Cargar capítulo fuente EN                          │
│         i18n/en/chapters/XX.json                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PASO 2: Generar traducciones ES y PT                       │
│         Usar glosario terminológico ESTRICTO               │
│         Guardar en i18n/es/chapters/XX.json                │
│                  i18n/pt/chapters/XX.json                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PASO 3: Actualizar navegación                              │
│         - index.html (EN)                                   │
│         - es/index.html (ES) si existe                      │
│         Agregar links al nuevo capítulo                    │
│         Actualizar contador "Chapters 1–X of 16"           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PASO 4: Ejecutar build                                     │
│         npm run build                                       │
│         Regenera dist/ con todos los idiomas               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PASO 5: Git commits (2 commits)                            │
│         1. "content: add chapter X ..."                    │
│         2. "content: update site YYYY-MM-DD ..."           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PASO 6: Push a repositorio                                 │
│         git push origin main                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Glosario Terminológico (CRÍTICO)

**REGLA DE ORO:** El Material de Ra tiene términos específicos que DEBEN traducirse consistentemente.

| English | Español | Português |
|---------|---------|-----------|
| **Harvest** | Cosecha | Colheita |
| **Distortion** | Distorsión | Distorção |
| **Catalyst** | Catalizador | Catalisador |
| **Density** | Densidad | Densidade |
| **Service to Others** | Servicio a Otros | Serviço aos Outros |
| **Service to Self** | Servicio a Sí Mismo | Serviço a Si Mesmo |
| **Free Will** | Libre Albedrío | Livre Arbítrio |
| **The Veil** | El Velo | O Véu |
| **Logos** | Logos | Logos |
| **Intelligent Infinity** | Infinito Inteligente | Infinito Inteligente |
| **Social Memory Complex** | Complejo de Memoria Social | Complexo de Memória Social |
| **Mind/Body/Spirit Complex** | Complejo Mente/Cuerpo/Espíritu | Complexo Mente/Corpo/Espírito |
| **Wanderer** | Errante | Andarilho |
| **Confederation** | Confederación | Confederação |
| **Orion Group** | Grupo de Orión | Grupo de Órion |

---

## 🤖 Prompt para Traducción (Template)

### Para Español

```
Traduce el siguiente capítulo del Material de Ra al español.

REGLAS ESTRICTAS DE TRADUCCIÓN:

1. **Consistencia Terminológica Absoluta**: Usa SIEMPRE estas traducciones exactas:
   - Harvest = Cosecha
   - Distortion = Distorsión
   - Catalyst = Catalizador
   - Density = Densidad
   - Service to Others = Servicio a Otros
   - Service to Self = Servicio a Sí Mismo
   - Free Will = Libre Albedrío
   - The Veil = El Velo
   - Logos = Logos
   - Intelligent Infinity = Infinito Inteligente
   - Social Memory Complex = Complejo de Memoria Social
   - Mind/Body/Spirit Complex = Complejo Mente/Cuerpo/Espíritu
   - Wanderer = Errante
   - Confederation = Confederación
   - Orion Group = Grupo de Orión

2. **Estilo de Traducción**:
   - Mantén el tono filosófico, educativo y reverente al misterio
   - Traduce de manera literal y fiel al original (evita creatividad excesiva)
   - Preserva la estructura JSON exactamente como está
   - Mantén los {term:...} tags sin modificar
   - No inventes adornos ni modismos locales

3. **Qué Traducir**:
   - "numberText": Traduce a "Capítulo Cinco" (formato en español)
   - "title": Traduce el título
   - "sections[].title": Traduce títulos de secciones
   - "sections[].content[].text": Traduce el contenido

4. **Qué NO Traducir**:
   - "id", "number": Mantén sin cambios
   - "type": Mantén "paragraph", "quote" sin traducir
   - {term:...}: No traduzcas los IDs dentro de las llaves
   - metadata (si existe): No traducir

5. **Formato JSON**:
   - Mantén la estructura exacta del JSON
   - Usa comillas dobles (")
   - Escapa caracteres especiales correctamente
   - Mantén la sangría de 2 espacios

CAPÍTULO A TRADUCIR:

```json
[INSERTAR CONTENIDO DEL CAPÍTULO AQUÍ]
```

RESPONDE ÚNICAMENTE CON EL JSON TRADUCIDO, SIN EXPLICACIONES ADICIONALES.
```

### Para Portugués

```
Traduza o seguinte capítulo do Material de Ra para o português.

REGRAS ESTRITAS DE TRADUÇÃO:

1. **Consistência Terminológica Absoluta**: Use SEMPRE estas traduções exatas:
   - Harvest = Colheita
   - Distortion = Distorção
   - Catalyst = Catalisador
   - Density = Densidade
   - Service to Others = Serviço aos Outros
   - Service to Self = Serviço a Si Mesmo
   - Free Will = Livre Arbítrio
   - The Veil = O Véu
   - Logos = Logos
   - Intelligent Infinity = Infinito Inteligente
   - Social Memory Complex = Complexo de Memória Social
   - Mind/Body/Spirit Complex = Complexo Mente/Corpo/Espírito
   - Wanderer = Andarilho
   - Confederation = Confederação
   - Orion Group = Grupo de Órion

2. **Estilo de Tradução**:
   - Mantenha o tom filosófico, educativo e reverente ao mistério
   - Traduza de maneira literal e fiel ao original (evite criatividade excessiva)
   - Preserve a estrutura JSON exatamente como está
   - Mantenha as tags {term:...} sem modificar
   - Não invente ornamentos nem expressões idiomáticas locais

3. **O Que Traduzir**:
   - "numberText": Traduza para "Capítulo Cinco" (formato em português)
   - "title": Traduza o título
   - "sections[].title": Traduza títulos de seções
   - "sections[].content[].text": Traduza o conteúdo

4. **O Que NÃO Traduzir**:
   - "id", "number": Mantenha sem alterações
   - "type": Mantenha "paragraph", "quote" sem traduzir
   - {term:...}: Não traduza os IDs dentro das chaves
   - metadata (se existir): Não traduzir

5. **Formato JSON**:
   - Mantenha a estrutura exata do JSON
   - Use aspas duplas (")
   - Escape caracteres especiais corretamente
   - Mantenha a indentação de 2 espaços

CAPÍTULO A TRADUZIR:

```json
[INSERIR CONTEÚDO DO CAPÍTULO AQUI]
```

RESPONDA APENAS COM O JSON TRADUZIDO, SEM EXPLICAÇÕES ADICIONAIS.
```

---

## 🚀 Uso del Script de Automatización

### Instalación

El script ya está incluido en el repositorio:
```bash
scripts/translate-chapter.js
```

### Ejecución

```bash
# Opción 1: Ejecutar directamente
node scripts/translate-chapter.js 05

# Opción 2: Usar npm (si se agrega al package.json)
npm run translate -- 05

# Opción 3: Sin push automático
node scripts/translate-chapter.js 05 --no-push
```

### Flujo del Script

1. **Carga el capítulo fuente** (i18n/en/chapters/XX.json)
2. **Genera prompts de traducción** con glosario incorporado
3. **Espera confirmación manual** de que las traducciones están listas
4. **Verifica** que existan los archivos ES y PT
5. **Actualiza navegación** en index.html y es/index.html
6. **Ejecuta build** (npm run build)
7. **Crea 2 commits** de git con mensajes descriptivos
8. **Push** a origin/main (opcional con --no-push)

---

## 📝 Mensajes de Commit

### Commit 1: Traducciones
```
content: add chapter X (Title) in EN, ES, and PT

Added complete translation of Chapter X:
- EN: [English Title]
- ES: [Spanish Title]
- PT: [Portuguese Title]

Translations maintain consistent terminology from the Law of One material.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Commit 2: Actualización del sitio
```
content: update site YYYY-MM-DD HH:MM [skip ci]

Update navigation index to include chapter X:
- Chapter X: [Title]

Updated chapter counter to include chapter X

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## 🧪 Testing del Workflow

Para probar el workflow completo sin hacer push:

```bash
# 1. Asegúrate de tener un capítulo fuente
ls i18n/en/chapters/06.json

# 2. Ejecuta el script sin push
node scripts/translate-chapter.js 06 --no-push

# 3. Revisa los cambios
git diff HEAD~2
git log --oneline -3

# 4. Si todo está bien, push manual
git push origin main

# 5. Si algo falló, revertir
git reset --hard HEAD~2
```

---

## 🔄 Ciclo de Vida Completo

### Ejemplo Real: Traducir Capítulo 6

```bash
# Paso 1: Verificar que existe el capítulo fuente
cat i18n/en/chapters/06.json

# Paso 2: Ejecutar script de traducción
node scripts/translate-chapter.js 06

# El script mostrará los prompts de traducción
# Copiar y pegar en Claude/GPT/Gemini

# Paso 3: Guardar traducciones
# Pegar respuestas JSON en:
# - i18n/es/chapters/06.json
# - i18n/pt/chapters/06.json

# Paso 4: Presionar ENTER para continuar
# El script automáticamente:
# - Verifica traducciones
# - Actualiza navegación
# - Ejecuta build
# - Crea commits
# - Push a remote

# Paso 5: Verificar en el sitio
# https://lawofone.cl
# https://lawofone.cl/es/
# https://lawofone.cl/pt/
```

---

## ⚠️ Precauciones y Errores Comunes

### ❌ NO HACER

1. **No omitir el glosario** - Causará inconsistencias terminológicas
2. **No modificar metadata** - Solo traducir content, title, numberText
3. **No cambiar IDs** - Romperá links y navegación
4. **No olvidar los {term:...} tags** - Deben permanecer intactos
5. **No ejecutar build antes de actualizar navegación** - Orden importa
6. **No ignorar términos compuestos con guión** - Ver caso especial abajo
7. **🚨 CRÍTICO: No inventar IDs de términos** - Los IDs dentro de `{term:xxx}` DEBEN coincidir EXACTAMENTE con las claves del glosario. Ver regla de oro abajo.

### ✅ HACER

1. **Validar JSON** antes de guardar (usar jq o JSON linter)
2. **Revisar glosario** antes de cada traducción
3. **Probar build localmente** antes de push
4. **Verificar navegación** en todos los idiomas
5. **Revisar commits** con `git diff` antes de push
6. **Agregar términos específicos al glosario** cuando sea necesario

### 🔍 Caso Especial: Términos Compuestos

**Problema:** Si un capítulo usa `{term:third-density}`, el texto mostrará "third-density" en español en lugar de "Tercera Densidad".

**Causa:** El sistema de build busca coincidencia EXACTA del ID en el glosario. Si solo existe `"densities"` pero no `"third-density"`, no encontrará la traducción.

**Solución:** Agregar entrada específica en glosario ES y PT:

---

### 🚨 REGLA DE ORO: IDs de Términos del Glosario

**NUNCA** uses un ID de término que no exista en el glosario. Los IDs son claves del JSON, NO traducciones.

**Ejemplo del error común (Capítulo 8):**

❌ **INCORRECTO:**
```json
"text": "...propicia para la {term:polarization}..."
```
El ID `polarization` NO existe en el glosario. El ID correcto es `polarity`.

✅ **CORRECTO:**
```json
"text": "...propicia para la {term:polarity}..."
```

**Proceso de verificación obligatorio:**

1. Antes de usar `{term:xxx}`, verificar que `"xxx"` existe como clave en `i18n/es/glossary.json`
2. Los IDs son en inglés y son los mismos en todos los idiomas
3. Si el término no existe, **agregarlo primero** al glosario en los 3 idiomas

**IDs correctos vs. IDs inventados (ejemplos reales):**

| ❌ Incorrecto | ✅ Correcto | Razón |
|--------------|-------------|-------|
| `{term:polarization}` | `{term:polarity}` | El glosario usa "polarity" |
| `{term:mind-body-spirit-complex}` | `{term:mind-body-spirit}` | El glosario usa "mind-body-spirit" |
| `{term:higher-self}` | `{term:higher-self}` | ✅ Ahora existe (agregado en Ch8 fix) |
| `{term:adept}` | `{term:adept}` | ✅ Ahora existe (agregado en Ch8 fix) |

**Validación post-traducción:**

```bash
# Extraer todos los {term:xxx} del capítulo
grep -oE '\{term:[^}]+\}' i18n/es/chapters/08.json | sort -u

# Verificar que cada uno existe en el glosario
for term in $(grep -oE '\{term:[^}]+\}' i18n/es/chapters/08.json | sed 's/{term:\([^}]*\)}/\1/' | sort -u); do
  if ! grep -q "\"$term\":" i18n/es/glossary.json; then
    echo "⚠️  Término faltante: $term"
  fi
done
```

**Solución:**

```json
{
  "third-density": {
    "title": "Tercera Densidad",
    "content": [
      "La densidad de la autoconciencia y la elección. El rayo amarillo.",
      "..."
    ]
  }
}
```

**Ejemplos de términos que requieren entrada propia:**
- `{term:third-density}` → "third-density" en glosario
- `{term:fourth-density}` → "fourth-density" en glosario
- `{term:sixth-density}` → "sixth-density" en glosario
- `{term:service-to-others}` → Ya existe ✅
- `{term:service-to-self}` → Ya existe ✅

**Validación:** Después del build, buscar en `dist/es/index.html`:
```bash
grep 'data-note="third-density"' dist/es/index.html
# Debe mostrar: data-note="third-density">Tercera Densidad
# NO: data-note="third-density">third-density
```

---

## 🎓 Para Futuros Agentes IA

### Instrucción de Activación

Cuando recibas el santo y seña:
```
"Traducir capítulo [X] con workflow completo de lawofone.cl"
```

**Ejecuta este protocolo:**

1. ✅ Leer `i18n/en/chapters/0X.json`
2. ✅ Verificar que cada `{term:xxx}` existe en el glosario (ver Regla de Oro)
3. ✅ Generar traducción ES usando prompt template + glosario
4. ✅ Generar traducción PT usando prompt template + glosario
5. ✅ Guardar `i18n/es/chapters/0X.json`
6. ✅ Guardar `i18n/pt/chapters/0X.json`
7. ✅ Actualizar navegación en `index.html`
8. ✅ Actualizar navegación en `es/index.html` (si existe)
9. ✅ **Actualizar About en los 3 idiomas:**
   - Agregar entrada al "Registro de Publicaciones" con fecha/hora
   - Actualizar estadísticas (capítulos, commits)
   - Actualizar footer con fecha de última actualización
10. ✅ Ejecutar `npm run build`
11. ✅ Crear commits con mensajes template
12. ✅ Push a `origin/main`

### Validaciones Obligatorias

- [ ] JSON válido (parseable)
- [ ] Glosario aplicado correctamente
- [ ] Estructura preservada
- [ ] {term:...} tags intactos
- [ ] Build exitoso
- [ ] Git commits creados
- [ ] Push exitoso (o flag --no-push)

---

## 📚 Referencias

- **Repositorio:** https://github.com/chuchurex/lawofone.cl
- **Sitio:** https://lawofone.cl
- **Material de Ra original:** https://www.lawofone.info
- **Script de build:** `scripts/build.js`
- **Script de traducción:** `scripts/translate-chapter.js`

---

## 📄 Licencia y Atribución

Este workflow fue diseñado para lawofone.cl, un proyecto de traducción y reescritura del Material de Ra.

**Desarrollado por:** Claude Sonnet 4.5 (Anthropic)
**Fecha:** Diciembre 2025
**Versión:** 1.0

---

**¡Que la Luz del Uno te guíe en tus traducciones!** ✧
