# Monorepo eluno.org

Este repositorio contiene el ecosistema de sitios web de **eluno.org**, gestionados como un monorepo para compartir recursos y facilitar el mantenimiento.

## 📦 Proyectos (Paquetes)

El código se organiza en `packages/`:

| Paquete | Directorio | Dominio | Descripción |
| :--- | :--- | :--- | :--- |
| **Core** | `packages/core` | N/A | Recursos compartidos (SCSS, Templates, Scripts). **No se despliega.** |
| **Todo** | `packages/todo` | `todo.eluno.org` | La Ley del Uno (The Law of One). |
| **Sanación** | `packages/sanacion` | `sanacion.eluno.org` | Libro de Reiki. |
| **Jesús** | `packages/jesus` | `jesus.eluno.org` | El Evangelio (The One). |

## 🛠 Guía de Desarrollo Rápido

### 1. Instalación
Solo necesitas ejecutar esto una vez en la raíz del proyecto:
```bash
npm install
```
Esto instalará todas las dependencias para todos los proyectos gracias a los Workspaces.

### 2. Trabajar en un Proyecto
Para desarrollar, corre el comando correspondiente al proyecto que quieres editar. Esto iniciará el servidor local y "observará" cambios en SASS (incluyendo cambios en `core`).

*   **Para La Ley del Uno:**
    ```bash
    npm run dev:todo
    ```
    *Abre:* `http://127.0.0.1:3002`

*   **Para Reiki (Sanación):**
    ```bash
    npm run dev:sanacion
    ```
    *Abre:* `http://127.0.0.1:3004`

*   **Para Jesús:**
    ```bash
    npm run dev:jesus
    ```
    *Abre:* `http://127.0.0.1:3005`

### 3. Modificando Estilos y Scripts Compartidos
Si necesitas cambiar algo visual (CSS) o lÃ³gica comÃºn (JS) que afecte a todos los sitios:
1.  Edita los archivos en `packages/core/`.
2.  Los servidores de desarrollo (`dev:xxx`) detectarÃ¡n automÃ¡ticamente los cambios y recargarÃ¡n.

## 🚀 Despliegue (Producción)

### Construcción
Para generar los sitios estáticos de **todos** los proyectos en sus carpetas `dist/`:
```bash
npm run build:all
```

### Publicación Individual
Para desplegar un sitio específico a producción (requiere credenciales en `.env`):
```bash
cd packages/todo  # o el paquete que quieras
npm run publish
```

## 📂 Estructura del Proyecto

```text
eluno.org/
├── package.json          # Scripts globales y dependencias comunes
├── packages/
│   ├── core/             # EL CORAZÓN
│   │   ├── scss/         # Estilos maestros (main.scss)
│   │   ├── templates/    # Fragmentos HTML comunes
│   │   └── scripts/      # Lógica de build y deploy compartida
│   │
│   ├── todo/             # PROYECTO 1
│   │   ├── i18n/         # Contenido (JSONs en EN/ES)
│   │   └── .env          # Configuración específica
│   │
│   ├── sanacion/         # PROYECTO 2
│   │   ├── i18n/         # Contenido
│   │   └── .env
│   │
│   └── jesus/            # PROYECTO 3
│       ├── i18n/         # Contenido
│       └── .env
└── README.md
```

## 📄 Licencia y Metodología AI
Ver documentación en carpeta `docs/` o `ai/` (heredado de proyectos originales).
Estilos y código base son propiedad de **eluno.org**.
Contenidos derivados de Ra Material bajo licencia de L/L Research.
