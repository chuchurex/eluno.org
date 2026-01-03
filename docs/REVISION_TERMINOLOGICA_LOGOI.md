# REVISIÓN TERMINOLÓGICA: Uso de "Logoi"

## Problema Identificado

Se detectó el uso de **"Logoi"** como plural de "Logos" en los capítulos del libro. Este es el plural griego (λόγοι), pero **no es español correcto**.

## Tarea de Revisión

Revisar todos los archivos JSON de capítulos (01.json hasta 16.json) buscando:

### Términos a buscar:
- `Logoi` (incorrecto en español)
- `logoi` (incorrecto en español)
- `sub-Logoi` (incorrecto en español)
- `Sub-Logoi` (incorrecto en español)

### Reemplazar por:
| Incorrecto | Correcto |
|------------|----------|
| Logoi | Logos (plural invariable) |
| logoi | logos |
| sub-Logoi | sub-Logos |
| Sub-Logoi | Sub-Logos |
| galactic Logoi | Logos galácticos |
| solar Logoi | Logos solares |

## Regla para el español

En español, "Logos" es un sustantivo invariable (como "crisis", "tesis", "análisis"):

- Singular: **el Logos**
- Plural: **los Logos**

## Ejemplos de corrección

### Incorrecto:
> "Los Logoi galácticos subdividen en sub-Logoi solares."

### Correcto:
> "Los Logos galácticos se subdividen en sub-Logos solares."

---

### Incorrecto:
> "Existen Logoi que eligieron crear sin libre albedrío."

### Correcto:
> "Existen Logos que eligieron crear sin libre albedrío."

---

### Incorrecto:
> "La jerarquía de Logoi incluye..."

### Correcto:
> "La jerarquía de Logos incluye..."

## Estado de la Revisión

### ✅ REVISIÓN COMPLETADA - 29 Diciembre 2025

Se verificó mediante búsqueda automatizada (`grep -ri "logoi"`) que **no existen ocurrencias** de "Logoi" en ningún capítulo de los tres idiomas (ES, EN, PT).

Los errores originalmente identificados ya fueron corregidos:
- ~~02.json (4 ocurrencias)~~ ✓ Corregido
- ~~04.json (1 ocurrencia)~~ ✓ Corregido
- ~~08.json (1 ocurrencia)~~ ✓ Corregido

### Todos los archivos verificados:
- [x] 01.json ✓
- [x] 02.json ✓
- [x] 03.json ✓
- [x] 04.json ✓
- [x] 05.json ✓
- [x] 06.json ✓
- [x] 07.json ✓
- [x] 08.json ✓
- [x] 09.json ✓
- [x] 10.json ✓
- [x] 11.json ✓
- [x] 12.json ✓
- [x] 13.json ✓
- [x] 14.json ✓
- [x] 15.json ✓
- [x] 16.json ✓

## Comando de búsqueda sugerido

```bash
grep -r -i "logoi" *.json
```

## Notas adicionales

- El Material Ra en inglés usa "Logoi" porque es convención académica anglosajona
- En español, los préstamos griegos terminados en consonante suelen ser invariables
- Las Biblias en español traducen λόγος como "Verbo" o "Palabra", no mantienen "Logos"
- Para nuestro proyecto, mantenemos "Logos" como término técnico pero con plural español

## Origen del error

Este error proviene de traducir literalmente desde el inglés del Material Ra, donde el glosario define:

> "Logos (Logoi) / Sub-logos (Sub-Logoi)"

Al adaptar al español, debemos castellanizar el plural.

---

*Documento creado: Diciembre 2024*
*Revisión completada: 29 Diciembre 2025*
*Para uso interno del proyecto lawofone.cl*
