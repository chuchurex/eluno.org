# Law of One - Próximos Pasos (Roadmap)

Este archivo sirve como guía para cualquier agente o desarrollador que continúe con el proyecto. Contiene las mejoras de eficiencia y nuevas funcionalidades planeadas.

## 🏁 Paridad de Idiomas
- [ ] **Generación de PDFs completos (EN/PT):** Replicar el comando `node scripts/build-pdf.js complete` para los idiomas restantes.
- [ ] **Barras de Medios en Portadas (EN/PT):** Asegurar que las portadas de Inglés y Portugués también tengan acceso al PDF completo y audiolibro.
- [ ] **Sincronización de Medios:** Completar la subida de todos los activos a Hostinger.

## 🚀 Mejoras de UX/UI
- [ ] **Navegación entre Capítulos:** Añadir botones de "Anterior" y "Siguiente" al pie de cada capítulo para facilitar la lectura lineal.
- [ ] **Modo Oscuro (Dark Mode):** Implementar un sistema nativo basado en CSS Variables para lectura nocturna.
- [ ] **PWA (Progressive Web App):** Configurar `manifest.json` y Service Worker básico para permitir lectura offline.

## 🛠️ Excelencia en Arquitectura
- [ ] **Modularización de `build.js`:** 
    - Extraer generadores a `scripts/generators/`.
    - Crear `scripts/core/processor.js` para unificar Regex de texto.
- [ ] **Optimización de Puppeteer:** Modificar `build-pdf.js` para reutilizar una única instancia del navegador durante la generación masiva.
- [ ] **Limpieza de Hardcoding:** Mover todas las URLs de YouTube y redes sociales a los archivos `i18n/xx/ui.json`.

## 📈 Tareas Pendientes Menores
- [ ] Investigar incorporación de silencios en el audiolibro completo si se requiere mayor pausa entre capítulos.

---
*Ultima actualización: 2026-01-07*
