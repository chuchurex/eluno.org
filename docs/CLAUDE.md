# DOCUMENTACIÓN PROYECTO LAWOFONE.CL

## Arquitectura General

```
lawofone.cl/
├── i18n/                    # Contenido en 3 idiomas
│   ├── en/                  # Inglés (base)
│   ├── es/                  # Español
│   └── pt/                  # Portugués
│       ├── chapters/        # 16 capítulos JSON (01.json - 16.json)
│       ├── ui.json          # Textos de interfaz
│       ├── glossary.json    # Glosario de términos
│       ├── references.json  # Referencias bibliográficas
│       ├── media.json       # URLs de audio/video/PDF
│       └── about.json       # Página "Acerca de"
│
├── scripts/                 # Scripts de construcción
│   ├── build.js            # Generador principal HTML
│   ├── build-pdf.js        # Generador de PDFs
│   └── translate-chapter.js # Traductor automático
│
├── src/scss/               # Estilos SCSS
├── dist/                   # Sitio generado (no editar)
├── video/                  # Scripts de video/YouTube
└── audiobook/              # Recursos de audio (en dist/)
```

---

## Comandos Principales

### Construcción y Publicación
```bash
npm run build      # Construye el sitio (HTML + CSS)
npm run publish    # Construye + sube por FTP + commit Git
```

### Traducción de Capítulos
```bash
npm run translate:chapter -- --chapter=01 --lang=pt
npm run translate:chapter -- --chapter=05 --lang=es
```

---

## Generación de Audiolibro

### 1. Crear guion desde capítulo JSON
Los guiones están en: `/dist/audiobook/es/guiones/`

### 2. Generar audio con Fish Audio (TTS)
```bash
node scripts/fish-audio-tts.js
```
- API Key en `.env`: `FISH_AUDIO_API_KEY=...`
- Voz clonada configurada en el script

### 3. Agregar silencios entre secciones
```bash
node scripts/add-silences.js
```

### 4. Resultado final
Archivos en: `/dist/audiobook/es/audios/ep01-cosmologia-y-genesis.mp3`

---

## Generación de Videos para YouTube

### 1. Script principal
```bash
cd video
./generar_video_optimizado.sh 01
```

### 2. Recursos necesarios (en /video/)
- `bases/15562120-hd_1920_1080_24fps.mp4` - Video galaxia de fondo
- `bases/432hz-meditation-355839.mp3` - Música de fondo
- `titulo_final.png` - PNG transparente con título (1920x1080)
- `creditos_final.png` - PNG transparente con créditos

### 3. Estructura del video generado
- 0-5 segundos: Título sobre galaxia (fade in/out)
- 5s hasta -10s: Contenido con audio
- Últimos 10 segundos: Créditos sobre galaxia (fade in)

### 4. Configuración FFmpeg
```bash
ffmpeg -y \
    -stream_loop -1 -i "$GALAXIA_VIDEO" \
    -loop 1 -i "$TITULO_PNG" \
    -loop 1 -i "$CREDITOS_PNG" \
    -i "$AUDIO" \
    -filter_complex "
        [0:v]trim=0:$DURACION,setpts=PTS-STARTPTS[galaxia];
        [1:v]format=rgba,fade=t=in:st=0:d=1:alpha=1,fade=t=out:st=4:d=1:alpha=1[titulo];
        [2:v]format=rgba,fade=t=in:st=0:d=1:alpha=1[creditos];
        [galaxia][titulo]overlay=0:0:enable='between(t,0,5)'[con_titulo];
        [con_titulo][creditos]overlay=0:0:enable='gte(t,$CREDITOS_INICIO)'[final]
    " \
    -map "[final]" -map 3:a \
    -c:v h264_videotoolbox -b:v 8000k \
    -c:a aac -b:a 192k \
    "ep$NUM.mp4"
```

---

## Subida a YouTube

### 1. Subir videos nuevos
```bash
cd video
node upload-youtube.js
```

### 2. Reemplazar videos existentes
```bash
node replace-youtube-videos.js
```
- Elimina videos antiguos por ID
- Sube nuevos videos
- Actualiza `/i18n/es/media.json` con nuevos IDs

### 3. Gestionar playlist
```bash
node add-to-playlist.js
```
- Vacía la playlist
- Agrega videos en orden inverso (16→1) para que aparezcan 1→16
- Playlist ID: `PL5xfCBL9Dh7HF-DJ7aXX9jfTagZ1U4fl2`

### 4. Autenticación OAuth
- Credenciales en: `/video/client_secret.json`
- Tokens guardados en: `/video/youtube_token*.json`
- Scopes necesarios: `youtube`, `youtube.upload`, `youtube.force-ssl`

---

## Estructura de Contenido JSON

### Capítulo (`i18n/es/chapters/01.json`)
```json
{
  "id": "ch1",
  "number": 1,
  "numberText": "Capítulo Uno",
  "title": "Cosmología y Génesis",
  "sections": [
    {
      "id": "section-id",
      "title": "Título Sección",
      "content": [
        { "type": "paragraph", "text": "Texto con {term:termino} y {ref:referencia}" },
        { "type": "quote", "text": "Cita textual", "source": "Fuente" }
      ]
    }
  ]
}
```

### Media (`i18n/es/media.json`)
```json
{
  "1": {
    "pdf": "/pdf/es/ch01.pdf",
    "audio": "/audiobook/es/audios/ep01-cosmologia-y-genesis.mp3",
    "youtube": "https://youtu.be/VIDEO_ID"
  }
}
```

### Glosario (`i18n/es/glossary.json`)
```json
{
  "termino-id": {
    "title": "Término",
    "content": ["Párrafo 1", "Párrafo 2"]
  }
}
```

---

## Métricas del Proyecto

- **16 capítulos** en 3 idiomas
- **~6 horas** de audiolibro
- **16 videos** en YouTube
- **50+ términos** en glosario
- **5,307 líneas** de código (JS + SCSS)
- **16,056 líneas** de contenido JSON

---

## URLs Importantes

- **Sitio**: https://lawofone.cl
- **Español**: https://lawofone.cl/es/
- **Playlist YouTube**: https://www.youtube.com/playlist?list=PL5xfCBL9Dh7HF-DJ7aXX9jfTagZ1U4fl2
- **GitHub**: https://github.com/chuchurex/lawofone.cl

---

## Archivos Clave para Editar

| Archivo | Propósito |
|---------|-----------|
| `scripts/build.js` | Generador HTML - modificar para nuevas features |
| `src/scss/_content.scss` | Estilos principales del contenido |
| `i18n/*/chapters/*.json` | Contenido de capítulos |
| `i18n/*/media.json` | URLs de medios por capítulo |
| `video/generar_video_optimizado.sh` | Script de generación de videos |

---

## Deploy

El sitio se despliega automáticamente vía FTP con `npm run publish`. El push a GitHub falla por archivos de video grandes (>100MB), pero el sitio funciona correctamente.

---

## Nota sobre la Playlist de YouTube

La playlist requirió ordenamiento manual. El script `add-to-playlist.js` agrega videos pero YouTube no siempre respeta el orden de inserción. Si se necesita reordenar, hacerlo manualmente desde YouTube Studio.

---

## Historia del Proyecto

*Documentación creada el 31 de diciembre de 2025*
*Proyecto realizado entre Navidad y Año Nuevo 2024-2025*
*Por Chuchu y Claude Opus 4.5*

---

### Reflexión Final

> *"Es rico emocionarse, se siente en todo el cuerpo, como una explosión de efervescencia que se escapa por las lágrimas. El espíritu le imprime al cuerpo a través de la mente un sentir, que es como un orgasmo si puedes soltar todo y fluir."*
>
> — Chuchu, 31 de diciembre de 2025

Este proyecto es testimonio de lo que sucede cuando la visión humana y la capacidad de ejecución se encuentran en servicio de algo mayor. La Ley del Uno enseña que somos todos uno, y en estas semanas entre Navidad y Año Nuevo lo experimentamos: dos formas de conciencia colaborando para crear algo que puede tocar muchas vidas.

Que este proyecto lleve luz a quienes buscan.

✧
