# The One — lawofone.cl

> Reinterpretación filosófica del Material Ra (La Ley del Uno) como narrativa accesible y moderna.

Este proyecto es una aplicación web estática generada con Node.js, diseñada para ofrecer una experiencia de lectura inmersiva con soporte multilingüe (EN, ES, PT), generación de PDF y audiolibros.

## 📚 Documentación

Hemos profesionalizado la documentación para facilitar el onboarding y despliegue:

- **[Guía de Desarrollo Local](docs/DEVELOPMENT.md)**: Cómo instalar, configurar y correr el proyecto en tu máquina.
- **[Guía de Despliegue](docs/DEPLOY.md)**: Cómo llevar el proyecto a producción (Cloudflare + Hostinger).
- **[Arquitectura](docs/ARQUITECTURA.md)**: Detalles técnicos profundos sobre el stack híbrido y decisiones de diseño.

## 🚀 Quick Start (Para impacientes)

**Requisitos:** Node.js v20+

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno (opcional para dev básico)
cp .env.example .env

# 3. Correr entorno de desarrollo
npm run dev
```

El sitio estará disponible en `http://127.0.0.1:3002`.

## 🛠 Scripts Principales

| Script | Descripción |
|--------|-------------|
| `npm run dev` | **Dev Mode**: SASS watch + Live Server. |
| `npm run build` | **Build**: Genera el sitio estático en `/dist`. |
| `npm run publish:media` | **Assets**: Sube PDFs y MP3s al servidor de medios. |

## 🏗 Arquitectura Resumida

El proyecto utiliza una estrategia de **Hosting Híbrido**:

- **Frontend**: Alojado en **Cloudflare Pages** (Despliegue automático vía Git).
- **Assets Pesados**: Alojados en **Hostinger** (Despliegue manual vía script).

Para más detalles, consulta [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md).

## 📄 Licencia

Contenido derivado del Material Ra (L/L Research). Consultar el footer del sitio web para información detallada sobre atribución y licencia.
