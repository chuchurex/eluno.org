# YouTube Video Generation (Discontinued)

> **Status**: DISCONTINUED — This feature is no longer part of the project
> **Date**: Removed January 13, 2026
> **Reason**: Project pivoted away from YouTube video generation

This document preserves the methodology for historical reference.

---

## Original Video Generation Workflow

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

## YouTube Upload Workflow

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

## Nota sobre la Playlist de YouTube

La playlist requirió ordenamiento manual. El script `add-to-playlist.js` agrega videos pero YouTube no siempre respeta el orden de inserción. Si se necesita reordenar, hacerlo manualmente desde YouTube Studio.

---

## Playlist Original

- **URL**: https://www.youtube.com/playlist?list=PL5xfCBL9Dh7HF-DJ7aXX9jfTagZ1U4fl2
- **Contenido**: 16 videos (uno por capítulo)
- **Duración total**: ~6 horas

---

## Estructura en media.json

```json
{
  "1": {
    "pdf": "/pdf/es/ch01.pdf",
    "audio": "/audiobook/es/audios/ep01-cosmologia-y-genesis.mp3",
    "youtube": "https://youtu.be/VIDEO_ID"
  }
}
```

---

## Why This Was Discontinued

The project evolved to focus on:
- Web-based reading experience
- Audiobook generation (preserved)
- PDF generation (preserved)
- Direct content delivery without YouTube dependency

---

*Preserved for historical reference: January 13, 2026*
