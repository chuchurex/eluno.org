# eluno.org - Contexto para Agentes IA

## Qué es este proyecto

Monorepo de libros digitales derivados del Material Ra (La Ley del Uno).
Libros como sitios web estáticos desplegados en Cloudflare Pages.

## Libros

| Libro | Dominio | Caps | PROMPT |
|-------|---------|------|--------|
| **eluno** | eluno.org | 16 | `packages/eluno/PROMPT.md` |
| **todo** | todo.eluno.org | 11 | `packages/todo/PROMPT.md` |
| **jesus** | jesus.eluno.org | 11 | `packages/jesus/PROMPT.md` |
| **sanacion** | sanacion.eluno.org | 11 | `packages/sanacion/PROMPT.md` |
| **otramirada** | (próximo) | 12 | `packages/otramirada/PROMPT.md` |

## Estructura

```
packages/
├── core/        # Código compartido (scripts, scss)
├── eluno/       # Libro original 16 caps
├── todo/        # Versión gentil 11 caps
├── jesus/       # El Camino del Amor
├── sanacion/    # Libro de Sanación
└── otramirada/  # Puentes doctrinales (próximo)

docs/
├── writing/     # Protocolo de escritura
├── tech/        # Arquitectura, deploy
├── audiobook/   # Guía TTS
├── video/       # Guía YouTube
└── private/     # Credenciales (NO en git)
```

## Antes de trabajar

1. **Lee el PROMPT.md del libro** que vas a editar
2. **Revisa `docs/writing/WRITING_PROTOCOL.md`** para estilo y voz
3. **Cada libro tiene su .env** con DOMAIN, LANGUAGES, BASE_LANG

## Comandos principales

```bash
npm install                 # Instalar
npm run dev:todo           # Desarrollo (puerto 3002)
npm run build              # Compilar
git push                   # Deploy automático a Cloudflare
```

## Voces TTS (Fish Audio)

- Actual: `f53102becdf94a51af6d64010bc658f2`
- Clon Chuchu: `60f3d0bf60cd4f5e88d1116e22eb19a7`

## Contacto

Carlos Martínez (Chuchu) — chuchurex@gmail.com
