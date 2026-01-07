# Guía de Desarrollo Local (Development)

Esta guía te ayudará a configurar tu entorno local para trabajar en **The One (lawofone.cl)**.

## 📋 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

1.  **Node.js**: Versión 20.x o superior.
    - Verificar: `node -v`
2.  **Git**: Para control de versiones.
3.  **Editor de Código**: Recomendamos VS Code o Cursor.

## 🚀 Instalación y Setup

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/chuchurex/lawofone.cl.git
    cd lawofone.cl
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    - Copia el archivo de ejemplo:
      ```bash
      cp .env.example .env
      ```
    - Abre `.env` y configura las variables básicas (el proyecto puede correr localmente sin credenciales externas, pero algunas funciones de build/deploy las necesitarán).

## 💻 Ejecutar Localmente

Para iniciar el servidor de desarrollo con recarga en caliente (Hot Reload) y compilación de SASS:

```bash
npm run dev
```

Este comando:
- Compila `src/scss/main.scss` a CSS.
- Observa cambios en archivos SCSS.
- Inicia un servidor local en `http://127.0.0.1:3002`.
- Abre el navegador automáticamente (dependiendo de tu config).

## 🛠 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia entorno de desarrollo (SASS watch + Live Server). |
| `npm run build` | Genera la versión de producción en la carpeta `dist/`. Compila HTML y CSS. |
| `npm run sass:watch` | Solo observa y compila cambios de SASS. |
| `npm run serve` | Sirve la carpeta `dist/` estáticamente (útil para probar el build final). |
| `npm run translate` | Ejecuta scripts de traducción (requiere API Keys). |
| `npm run build:pdf` | Genera los PDF de los capítulos (usa Puppeteer). |

## 📂 Estructura del Proyecto

- **`src/`**: Código fuente.
    - `scss/`: Estilos (SASS).
    - `fonts/`: Archivos de fuentes locales.
- **`i18n/`**: Contenido.
    - `en/`, `es/`, `pt/`: Archivos JSON con el texto de los capítulos y la interfaz.
- **`scripts/`**: Lógica de construcción (Build) y herramientas en Node.js.
- **`dist/`**: Carpeta de salida (lo que se despliega). Generada por `npm run build`.

## 🧪 Flujo de Trabajo Típico

1.  **Editar Contenido:** Modificar archivos JSON en `i18n/`.
2.  **Editar Estilos:** Modificar archivos SCSS en `src/scss/`.
3.  **Visualizar:** Ver cambios en tiempo real con `npm run dev`.
4.  **Probar Build:** Correr `npm run build` y revisar `dist/` si hay dudas sobre la generación final.
