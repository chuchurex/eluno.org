# REPORTE DE LIMPIEZA - Documentación El Uno
## 11 de Enero de 2026

Este reporte identifica archivos duplicados, obsoletos o que requieren revisión.

---

## 🗑️ ARCHIVOS A ELIMINAR (Duplicados confirmados)

### 1. `/docs/PROTOCOLO_ESCRITURA_V3.md`
- **Estado:** DUPLICADO
- **Tamaño:** 14K
- **Razón:** Mismo archivo existe en `/docs/11enero/PROTOCOLO_ESCRITURA_V3.md` (actualizado)
- **Acción:** ✅ ELIMINAR
- **Comando:** `rm docs/PROTOCOLO_ESCRITURA_V3.md`

### 2. `/CONTEXT_V04.md` (raíz)
- **Estado:** DUPLICADO (pero en ubicación incorrecta)
- **Tamaño:** 7.9K
- **Razón:** Ya copiado a `/docs/11enero/CONTEXT_V04.md`
- **Acción:** ⚠️ ELIMINAR después de verificar
- **Comando:** `rm CONTEXT_V04.md`
- **Nota:** Decidir si mantener en raíz O solo en docs/11enero

### 3. `/docs/11enero/CONTEXT_V03_ACTUALIZADO.md`
- **Estado:** OBSOLETO (V03 → V04)
- **Tamaño:** 6.1K
- **Razón:** Reemplazado por CONTEXT_V04.md
- **Acción:** 🔄 RENOMBRAR a `CONTEXT_V03_ACTUALIZADO.OBSOLETO.md` (mantener como referencia histórica)
- **Comando:** `mv docs/11enero/CONTEXT_V03_ACTUALIZADO.md docs/11enero/CONTEXT_V03_ACTUALIZADO.OBSOLETO.md`

---

## 🔍 ARCHIVOS A REVISAR (Decisión manual requerida)

### 4. `/docs/ARQUITECTURA.md`
- **Tamaño:** 24K
- **Última modificación:** 4 Ene
- **Contenido:** Arquitectura técnica del proyecto
- **Pregunta:** ¿Está actualizado con la arquitectura actual?
- **Acción sugerida:**
  - ✅ Revisar contenido
  - Si está actualizado → Mover a `/docs/11enero/ARQUITECTURA.md`
  - Si está obsoleto → Eliminar o archivar

### 5. `/docs/CLAUDE.md`
- **Tamaño:** 6.8K
- **Última modificación:** 31 Dic
- **Contenido:** Instrucciones para Claude
- **Pregunta:** ¿Sigue siendo relevante o está cubierto por otros docs?
- **Acción sugerida:**
  - ✅ Revisar contenido
  - Si es útil → Mover a `/docs/11enero/CLAUDE.md`
  - Si está obsoleto → Eliminar

### 6. `/docs/DEPLOY.md`
- **Tamaño:** 3.6K
- **Última modificación:** 6 Ene
- **Contenido:** Instrucciones de deploy
- **Pregunta:** ¿Está actualizado con el nuevo dominio eluno.org?
- **Acción sugerida:**
  - ✅ Actualizar con info de eluno.org
  - Mover a `/docs/11enero/DEPLOY.md`

### 7. `/docs/DEVELOPMENT.md`
- **Tamaño:** 2.5K
- **Última modificación:** 6 Ene
- **Contenido:** Guía de desarrollo
- **Pregunta:** ¿Está actualizado?
- **Acción sugerida:**
  - ✅ Revisar y actualizar si es necesario
  - Mover a `/docs/11enero/DEVELOPMENT.md`

### 8. `/docs/NUEVO_PROYECTO.md`
- **Tamaño:** 5.4K
- **Última modificación:** 8 Ene
- **Contenido:** ¿Información sobre nuevo proyecto?
- **Pregunta:** ¿Es sobre El Uno o sobre otro proyecto?
- **Acción sugerida:**
  - ✅ Revisar contenido
  - Si es sobre El Uno → Integrar en CONTEXT_V04.md
  - Si es sobre otro proyecto → Mover fuera de `/docs`

### 9. `/docs/GUIA_COMILLAS_JSON.md`
- **Tamaño:** 1.8K
- **Última modificación:** 8 Ene
- **Contenido:** Guía técnica específica
- **Pregunta:** ¿Sigue siendo necesaria?
- **Acción sugerida:**
  - ✅ **MANTENER** - Es guía técnica específica y útil
  - Mover a `/docs/11enero/GUIA_COMILLAS_JSON.md`

---

## 📂 ARCHIVOS EN RAÍZ (Decisión de ubicación)

### 10. `/.claude-context.md`
- **Ubicación:** Raíz del proyecto
- **Propósito:** Contexto para Claude Code
- **Acción:** ✅ **MANTENER EN RAÍZ** - Es funcional para Claude Code

### 11. `/private-context.md`
- **Ubicación:** Raíz del proyecto
- **Propósito:** Información privada
- **Acción:** ✅ **MANTENER EN RAÍZ** - Es privado (git ignored)

### 12. `/TODO.md`
- **Ubicación:** Raíz del proyecto
- **Propósito:** Lista de tareas
- **Pregunta:** ¿Está actualizado?
- **Acción sugerida:**
  - ✅ Revisar y actualizar con próximos pasos de CONTEXT_V04.md
  - Mantener en raíz

### 13. `/README.md`
- **Ubicación:** Raíz del proyecto
- **Propósito:** README principal del repo
- **Acción:** ✅ **MANTENER EN RAÍZ** - Es estándar para repos

---

## 📋 RESUMEN DE ACCIONES

### Eliminar inmediatamente (2 archivos):
```bash
rm docs/PROTOCOLO_ESCRITURA_V3.md
```

### Archivar como obsoleto (1 archivo):
```bash
mv docs/11enero/CONTEXT_V03_ACTUALIZADO.md docs/11enero/CONTEXT_V03_ACTUALIZADO.OBSOLETO.md
```

### Revisar contenido (6 archivos):
1. docs/ARQUITECTURA.md
2. docs/CLAUDE.md
3. docs/DEPLOY.md
4. docs/DEVELOPMENT.md
5. docs/NUEVO_PROYECTO.md
6. docs/GUIA_COMILLAS_JSON.md → Mover a 11enero

### Decidir ubicación (1 archivo):
- CONTEXT_V04.md (¿raíz o solo en docs/11enero?)

### Mantener como están (4 archivos):
- /.claude-context.md
- /private-context.md
- /TODO.md
- /README.md

---

## 🎯 OBJETIVO FINAL

Estructura limpia y consolidada:

```
/
├── .claude-context.md     ← Funcional para Claude Code
├── private-context.md     ← Información privada
├── TODO.md                ← Tareas actualizadas
├── README.md              ← README del repo
│
├── docs/
│   └── 11enero/          ← FUENTE ÚNICA DE VERDAD
│       ├── README.md     ← Índice de documentación
│       ├── CONTEXT_V04.md
│       ├── PROTOCOLO_ESCRITURA_V3.md
│       ├── TABLA_TERMINOS_COMPLETA_V2.md
│       ├── ESTRUCTURA_LIBRO_16_CAPITULOS.md
│       ├── ESTRATEGIA_SEO_LANZAMIENTO.md
│       ├── ARQUITECTURA.md (si es actual)
│       ├── DEPLOY.md (actualizado)
│       ├── DEVELOPMENT.md (actualizado)
│       └── GUIA_COMILLAS_JSON.md
│
└── [otros archivos del proyecto]
```

---

## ⚠️ IMPORTANTE

Antes de eliminar cualquier archivo, asegurarse de:

1. ✅ Verificar que el contenido está duplicado o realmente obsoleto
2. ✅ Verificar que no hay referencias a ese archivo en el código
3. ✅ Hacer backup o commit antes de eliminar (git)

---

*Reporte generado: 11 de Enero de 2026*
