# Guía de Uso de Comillas en Contenido JSON

Al crear o editar contenido para los capítulos (archivos `.json` en `i18n/`), es crucial manejar las comillas correctamente para evitar errores técnicos que rompen la generación del sitio.

## El Problema
Los archivos JSON utilizan **comillas dobles** (`"`) para marcar el inicio y el final de un texto. Si incluyes una comilla doble dentro de tu texto sin "escaparla", el sistema pensará que el texto ha terminado antes de tiempo, causando un error de sintaxis.

## La Regla de Oro
**Todas las comillas dobles dentro del contenido deben llevar una barra invertida antes (`\"`).**

### ❌ Incorrecto
Esto romperá el sitio porque la comilla antes de *La Ley* cierra el texto inesperadamente:
```json
"text": "Ra dijo: "La Ley del Uno" es fundamental."
```

### ✅ Correcto (Escapado)
Usa `\"` para que el sistema entienda que la comilla es parte del texto:
```json
"text": "Ra dijo: \"La Ley del Uno\" es fundamental."
```

### ✅ Alternativa (Comillas Tipográficas)
También puedes usar comillas "curvas" o tipográficas, que no necesitan escape porque son caracteres diferentes a la comilla recta del código:
```json
"text": "Ra dijo: “La Ley del Uno” es fundamental."
```

## Resumen de Caracteres

| Carácter | Nombre | ¿Requiere Escape? | Cómo escribirlo |
| :--- | :--- | :--- | :--- |
| `"` | Comilla Doble Recta | **SÍ** | `\"` |
| `'` | Comilla Simple | No | `'` |
| `“` `”` | Comillas Inglesas | No | `“` `”` |
| `«` `»` | Comillas Latinas | No | `«` `»` |

## Herramienta de Reparación
Si olvidas escapar algunas comillas, he creado un script de emergencia que intenta corregirlas automáticamente. Puedes ejecutarlo con:

```bash
node scripts/fix-json.js
```

Sin embargo, es mejor escribir el contenido correctamente desde el principio para asegurar la integridad del texto.
