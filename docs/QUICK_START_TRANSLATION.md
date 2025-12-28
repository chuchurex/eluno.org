# 🚀 Quick Start: Traducir un Capítulo

> **Nota:** Este workflow es para **Claude Code**. 
> La escritura de capítulos nuevos se hace en **Claude Desktop** con `PROTOCOLO_ESCRITURA_V2.md`.

---

## TL;DR

```bash
npm run translate:chapter -- 07
```

Eso es todo. El script te guiará paso a paso.

---

## Flujo Completo del Proyecto

```
┌─────────────────────────────────────────────────────────────┐
│  CLAUDE DESKTOP                                             │
│  • Escribe capítulo nuevo en inglés                        │
│  • Sigue PROTOCOLO_ESCRITURA_V2.md                         │
│  • Entrega archivo XX.json                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  CLAUDE CODE (este workflow)                                │
│  • Recibe XX.json y lo guarda en i18n/en/chapters/         │
│  • Ejecuta: npm run translate:chapter -- XX                │
│  • Traduce a ES y PT                                        │
│  • Build + Git + Push                                       │
│  • Deploy automático a lawofone.cl                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Paso a Paso

### 1. Verificar que existe el capítulo EN

```bash
ls i18n/en/chapters/07.json
```

Si no existe, primero debe escribirse en Claude Desktop.

### 2. Ejecutar el script

```bash
npm run translate:chapter -- 07
```

### 3. El script generará 2 prompts

Copia cada prompt y pégalo en tu LLM favorito:
- Claude (recomendado)
- GPT-4
- Gemini Pro

### 4. Guardar las respuestas

Pega las respuestas JSON en:
- `i18n/es/chapters/07.json`
- `i18n/pt/chapters/07.json`

### 5. Presionar ENTER

El script automáticamente:
- ✅ Verifica las traducciones
- ✅ Actualiza la navegación
- ✅ Ejecuta el build
- ✅ Crea commits de git
- ✅ Push al repositorio

---

## Opciones

```bash
# Sin push automático
npm run translate:chapter -- 07 --no-push

# Ver ayuda
npm run translate:chapter
```

---

## Santo y Seña para Claude Code

Cuando recibas:
```
"Traducir capítulo [X] con workflow completo de lawofone.cl"
```

Lee y ejecuta: `docs/TRANSLATION_WORKFLOW.md`

---

## ¿Problemas?

- Documentación completa: `docs/TRANSLATION_WORKFLOW.md`
- Contexto del proyecto: `docs/CONTEXT.md`
- Protocolo de escritura: `docs/PROTOCOLO_ESCRITURA_V2.md`
