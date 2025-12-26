# 🚀 Quick Start: Traducir un Capítulo

## TL;DR

```bash
npm run translate:chapter -- 06
```

Eso es todo. El script te guiará paso a paso.

---

## Paso a Paso

### 1. Ejecutar el script

```bash
npm run translate:chapter -- 06
```

### 2. El script generará 2 prompts

Copia cada prompt y pégalo en tu LLM favorito:
- Claude (recomendado)
- GPT-4
- Gemini Pro

### 3. Guardar las respuestas

Pega las respuestas JSON en:
- `i18n/es/chapters/06.json`
- `i18n/pt/chapters/06.json`

### 4. Presionar ENTER

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
npm run translate:chapter -- 06 --no-push

# Ver ayuda
npm run translate:chapter
```

---

## Santo y Seña para Agentes IA

Si eres un agente IA (Claude Code, ChatGPT, etc.), cuando recibas:

```
"Traducir capítulo [X] con workflow completo de lawofone.cl"
```

Lee y ejecuta: `docs/TRANSLATION_WORKFLOW.md`

---

## ¿Problemas?

Lee la documentación completa: `docs/TRANSLATION_WORKFLOW.md`
