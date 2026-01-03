# Sistema de Marcado: Términos y Referencias - Capítulo 1

**Contexto**: Este documento describe el sistema de marcado desarrollado para lawofone.cl que permite al lector explorar tanto el glosario espiritual como conexiones con ciencia, tradiciones y textos sagrados.

---

## Sistema de Iconos

| Icono | Tipo | Uso |
|-------|------|-----|
| 📖 | `{term:xxx}` | Término del glosario espiritual del Material de Ra |
| 🔬 | `{ref:xxx}` | Referencia al mundo real (ciencia, tradiciones, textos) |

---

## INVENTARIO COMPLETO - CAPÍTULO 1

### Términos del Glosario Espiritual (📖) - 24 términos

Estos son términos únicos del Material de Ra que requieren definición en el glosario:

1. **Infinito** - La totalidad sin límites, el potencial puro anterior a toda manifestación
2. **Consciencia** - El primer movimiento del Infinito al volverse consciente de sí mismo
3. **Infinito Inteligente** - El Infinito en su aspecto de consciencia enfocada y creativa
4. **Logos** - El principio creativo, también llamado Amor o la Palabra
5. **Distorsión** - Cada particularización del Uno original (no es error, es enfoque)
6. **Libre Albedrío** - La primera distorsión, libertad inherente de la consciencia
7. **Amor** - La segunda distorsión, principio creativo que moldea realidades
8. **Luz** - La tercera distorsión, primera manifestación tangible
9. **Co-Creadores** - Porciones individualizadas del Infinito que crean universos
10. **Energía Inteligente** - Amor y luz canalizados hacia manifestación
11. **Sub-Logos** - El sol de un sistema solar como porción individualizada
12. **Densidades** - Niveles de consciencia y vibración (7 + 1 octava)
13. **Holográfico** - Principio: cada parte contiene la información del todo
14. **Espiral** - Patrón fundamental de la creación en todas las escalas
15. **Octava** - Estructura de 7 densidades + 1 de retorno
16. **Rayos** - Vibraciones específicas de luz por densidad (colores)
17. **Auto-consciencia** - Capacidad de ser consciente de sí mismo (3ª densidad)
18. **La Elección** - Decisión fundamental: orientarse a otros o a sí mismo
19. **Servicio a Otros** - Orientación hacia amor, compasión, servicio
20. **Servicio a Sí Mismo** - Orientación hacia poder, control, acumulación
21. **Polaridad** - La orientación fundamental elegida en 3ª densidad
22. **Fractal** - Estructura auto-similar a todas las escalas
23. **Ilusión** - Realidad enfocada, particularizada (no falso)
24. **Catalizadores** - Experiencias que provocan crecimiento espiritual

---

### Referencias al Mundo Real (🔬) - 22 referencias

Conexiones verificables con ciencia, tradiciones y textos sagrados:

#### FÍSICA (phys:) - 9 referencias

1. **photon-foundation** - El fotón como partícula fundamental; E=mc² muestra materia como luz condensada
2. **electromagnetic-spectrum** - Espectro completo: radio, microondas, IR, visible, UV, rayos X, gamma
3. **spiral-energy** - Patrón espiral en todas escalas: galaxias, huracanes, ADN, nautilus
4. **holographic-principle** - Teoría: información de un volumen codificada en su superficie
5. **musical-octave** - Octava = intervalo donde frecuencia se duplica (Pitágoras)
6. **color-spectrum** - Espectro visible: rojo (700nm) a violeta (400nm) - 7 colores de Newton
7. **atomic-void** - Átomo es 99.9999999% espacio vacío; solidez es ilusión electromagnética
8. **quantum-mechanics** - Partículas son ondas de probabilidad que colapsan al observarse
9. **spiral-nature** - Espiral áurea en naturaleza: proporción phi (1.618...)

#### ASTRONOMÍA (astro:) - 2 referencias

10. **spiral-galaxies** - Mayoría de galaxias son espirales (Vía Láctea es espiral barrada)
11. **lenticular-shape** - Forma de disco aplanado en sistemas solares y galaxias

#### TRADICIONES ESPIRITUALES (trad:) - 7 referencias

12. **kabbalah-vedanta** - Ein Sof (Kabbalah) y Nirguna Brahman (Vedanta) como Infinito sin atributos
13. **kabbalah-tzimtzum** - Tzimtzum: "contracción" del Infinito para crear espacio para lo finito
14. **gurdjieff-octave** - Ley de Siete de Gurdjieff; intervalo Mi-Fa = transición 3ª→4ª densidad
15. **chakra-system** - 7 chakras con mismos colores que densidades (confirmado por Ra)
16. **four-elements** - Fuego, aire, agua, tierra en filosofía griega, ayurveda, alquimia
17. **indras-net** - Metáfora budista: red infinita donde cada joya refleja todas las demás
18. **vedanta-maya** - Maya: ilusión del mundo fenoménico que oculta Brahman (no es falso)

#### TEXTOS SAGRADOS (text:) - 1 referencia

19. **genesis-logos** - Juan 1:1 "En el principio era el Verbo (Logos)"; filosofía griega

#### MATEMÁTICAS (math:) - 1 referencia

20. **fractals** - Mandelbrot: geometría fractal, auto-similaridad infinita en naturaleza

#### TEORÍA FÍSICA AVANZADA (phys:) - 2 referencias adicionales

21. **bohm-implicate-order** - David Bohm: orden implicado (todo plegado en cada parte)
22. **bohm-holographic** - Teoría holográfica del universo de David Bohm

---

## HALLAZGO CLAVE

**PROBLEMA DETECTADO**: Este análisis exhaustivo se hizo SOLO para el Capítulo 1.

**NECESIDAD**: Los capítulos 2-16 también usan términos `{term:xxx}` y potencialmente `{ref:xxx}`, pero NO han sido analizados de esta forma.

---

## PARA CLAUDE DESKTOP - TAREAS PENDIENTES

### Análisis Requerido para Capítulos 2-16

Para cada capítulo restante (02-16), se necesita:

1. **Extraer términos `{term:xxx}`** usados
2. **Verificar** que existen en `i18n/es/glossary.json` y `i18n/en/glossary.json`
3. **Identificar referencias potenciales `{ref:xxx}`** - conexiones con:
   - Física moderna
   - Astronomía
   - Tradiciones espirituales (Kabbalah, Vedanta, Budismo, Taoísmo, etc.)
   - Textos sagrados (Biblia, Bhagavad Gita, Tao Te Ching, etc.)
   - Matemáticas
   - Biología
   - Psicología

4. **Documentar** en formato similar a este documento

### Comando Útil

Para extraer términos de un capítulo:

```bash
# Ver todos los {term:xxx} únicos en un capítulo
grep -oE '\{term:[^}]+\}' i18n/es/chapters/02.json | sort -u

# Verificar si un término existe en el glosario
grep "\"nombre-del-termino\":" i18n/es/glossary.json
```

---

## SISTEMA DE GLOSARIO ACTUAL

### Ubicación de Archivos

- `i18n/en/glossary.json` - Glosario en inglés
- `i18n/es/glossary.json` - Glosario en español
- `i18n/pt/glossary.json` - Glosario en portugués

### Formato del Glosario

```json
{
  "nombre-del-termino": {
    "term": "Nombre del Término",
    "definition": "Definición breve del término..."
  }
}
```

### Cómo se Usan en los Capítulos

```json
{
  "text": "...exploración de la {term:third-density}..."
}
```

Cuando el sitio se construye (`npm run build`), el script `src/build.js` procesa estos marcadores y los convierte en tooltips interactivos.

---

## PRÓXIMOS PASOS SUGERIDOS

1. **Auditar capítulos 2-16** para extraer todos los `{term:xxx}` usados
2. **Verificar consistencia** del glosario entre idiomas (EN, ES, PT)
3. **Identificar términos faltantes** que deberían agregarse
4. **Planificar sistema `{ref:xxx}`** para referencias al mundo real
5. **Crear documentos similares** para cada capítulo

---

## NOTAS TÉCNICAS

### Build Process

El archivo `src/build.js` procesa:
- `{term:xxx}` → tooltip con definición del glosario
- `{ref:xxx}` → (planeado) tooltip con referencia al mundo real

### Limitación Actual

El sistema `{ref:xxx}` fue diseñado pero **no está implementado**. Solo existe el análisis conceptual en `docs/CAPITULO_1_ANALISIS_REFERENCIAS.md`.

Para implementarlo se necesitaría:
1. Crear archivos `references.json` (EN, ES, PT)
2. Modificar `src/build.js` para procesar `{ref:xxx}`
3. Agregar estilos CSS diferenciados para referencias vs términos

---

*Documento creado para Claude Desktop - 2025-12-31*
*Fuente: docs/CAPITULO_1_ANALISIS_REFERENCIAS.md*
