---
description: Workflow para escribir capítulos del libro Law of One con Claude Desktop/Opus 4.5
---

# Workflow de Escritura de Capítulos

Este workflow define el proceso para escribir nuevos capítulos del libro "The One" usando Claude Desktop con Opus 4.5.

## Idioma Base: Inglés Controlado

Escribe en **inglés controlado** siguiendo estas reglas:

1. **Oraciones cortas** — máximo 20 palabras por oración
2. **Voz activa** — preferir "The Creator creates" sobre "Creation is done by"
3. **Sin modismos** — evitar expresiones culturales específicas
4. **Vocabulario consistente** — usar siempre los mismos términos del glosario
5. **Estructura clara** — Sujeto + Verbo + Objeto
6. **Sin pronombres ambiguos** — repetir sustantivos si es necesario

> **Objetivo**: El texto debe poder traducirse automáticamente via Google Translate con mínima distorsión del significado.

---

## Fase 1: Preparación

1. Revisar los capítulos anteriores para mantener continuidad de estilo y terminología
2. Consultar el Material Ra original (PDFs en Claude Desktop) para el tema del capítulo
3. Crear outline del capítulo con las secciones propuestas
4. Listar los términos del glosario que se usarán

---

## Fase 2: Revisión Preliminar con Usuario

1. Presentar el outline propuesto:
   - Título del capítulo
   - Lista de secciones con breve descripción
   - Términos clave a incluir
2. Recibir feedback del usuario
3. Ajustar outline según correcciones

**Criterios de revisión:**
- [ ] ¿El tema fluye naturalmente del capítulo anterior?
- [ ] ¿Las secciones cubren el tema completamente?
- [ ] ¿Hay algún concepto faltante o sobrante?

---

## Fase 3: Escritura del Capítulo

Escribir cada sección siguiendo el formato JSON:

```json
{
  "type": "paragraph",
  "text": "The text goes here with {term:term-id} for glossary terms."
}
```

### Sintaxis especial:
- `{term:término-id}` — para términos del glosario
- `**texto**` — para énfasis fuerte (conceptos clave)
- `*texto*` — para énfasis suave (términos en contexto)
- `"type": "quote"` — para citas destacadas

### Estructura de cada sección:
1. Párrafo de apertura que establece el tema
2. Desarrollo del concepto (3-5 párrafos)
3. Posible cita destacada
4. Párrafo de cierre que conecta con la siguiente sección

---

## Fase 4: Revisión del Borrador

Presentar el borrador completo al usuario y evaluar:

- [ ] **Fidelidad al mensaje de Ra** — ¿Preserva la esencia sin distorsionar?
- [ ] **Claridad de expresión** — ¿Es comprensible para lectores nuevos?
- [ ] **Flujo narrativo** — ¿Las secciones fluyen naturalmente?
- [ ] **Terminología** — ¿Los términos son consistentes con el glosario?
- [ ] **Traducibilidad** — ¿El texto evita modismos y ambigüedades?

### Si requiere cambios:
- Identificar secciones específicas a reescribir
- Hacer correcciones manteniendo el estilo
- Volver a presentar para revisión

### Si está aprobado:
- Continuar a Fase 5

---

## Fase 5: Generación de Archivos

Una vez aprobado el capítulo, generar los archivos:

// turbo
1. Guardar el JSON del capítulo en `i18n/en/chapters/XX.json`

// turbo
2. Actualizar el glosario si hay términos nuevos en `i18n/en/glossary.json`

// turbo
3. Ejecutar el build para generar los HTML:
```bash
cd /Users/chuchurex/Sites/lawofone.cl && npm run build
```

// turbo
4. Verificar el resultado en el navegador:
```bash
cd /Users/chuchurex/Sites/lawofone.cl && npm run serve
```

---

## Estructura del Archivo de Capítulo

```json
{
  "id": "chX",
  "number": X,
  "numberText": "Chapter [Number in Words]",
  "title": "Chapter Title",
  "sections": [
    {
      "id": "chX-section-id",
      "title": "Section Title",
      "content": [
        {
          "type": "paragraph",
          "text": "Content with {term:id} markers..."
        },
        {
          "type": "quote",
          "text": "Notable quote from the text."
        }
      ]
    }
  ]
}
```

---

## Términos del Glosario Existentes

Referencia rápida de términos disponibles:

- `infinite` — El Infinito
- `consciousness` — Conciencia
- `intelligent-infinity` — Infinito Inteligente
- `logos` — Logos
- `distortion` — Distorsión
- `free-will` — Libre Albedrío
- `love` — Amor (Segunda Distorsión)
- `light` — Luz (Tercera Distorsión)
- `co-creators` — Co-Creadores
- `intelligent-energy` — Energía Inteligente
- `sub-logos` — Sub-Logos
- `densities` — Densidades
- `holographic` — Principio Holográfico
- `spiral` — La Espiral
- `photon` — Fotón
- `octave` — La Octava
- `rays` — Los Rayos/Colores
- `self-awareness` — Autoconciencia
- `the-choice` — La Elección
- `service-to-others` — Servicio a Otros
- `service-to-self` — Servicio a Sí Mismo
- `polarity` — Polaridad
- `fractal` — Fractal
- `illusion` — Ilusión
- `catalyst` — Catalizador
- `indras-net` — Red de Indra
- `kybalion` — El Kybalion
- `law-of-confusion` — Ley de Confusión
- `mind-body-spirit` — Complejo Mente/Cuerpo/Espíritu

Para agregar nuevos términos, seguir el formato del glosario existente.
