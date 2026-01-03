# Demo Audiolibro para WhatsApp

## 📱 Versión Optimizada

**Archivo**: `audiobook/audio/es/chapter-01-demo-whatsapp.mp3`

### Especificaciones
- **Duración**: 2 minutos (120 segundos)
- **Tamaño**: 1.4 MB
- **Bitrate**: 96 kbps
- **Formato**: MP3 mono, 44100 Hz
- **Compatible con**: WhatsApp, Telegram, Signal

### Contenido
Primeros 2 minutos del Capítulo 1 - Cosmología y Génesis del audiolibro de La Ley del Uno en español.

## 📊 Comparación

| Versión | Duración | Tamaño | Bitrate | Uso |
|---------|----------|--------|---------|-----|
| Completa | 18.3 min | 17 MB | 128 kbps | Descarga/Streaming |
| Demo WhatsApp | 2 min | 1.4 MB | 96 kbps | Compartir en chat |

## 🚀 Cómo usar

### Enviar por WhatsApp
1. Abre WhatsApp
2. Selecciona un contacto o grupo
3. Toca el ícono de adjuntar (📎)
4. Selecciona "Documento" o "Audio"
5. Busca: `chapter-01-demo-whatsapp.mp3`
6. Envía

### Mensaje sugerido
```
🎧 Demo: Audiolibro "La Ley del Uno" - Capítulo 1

Primeros 2 minutos del Capítulo 1: Cosmología y Génesis
Narrado por IA en español latino

Escucha el capítulo completo (18 min) en: lawofone.cl/audiobook
```

## 🛠️ Comando de generación

```bash
# Extrae primeros 2 minutos del capítulo completo
ffmpeg -i audiobook/audio/es/chapter-01.mp3 \
  -t 120 \
  -acodec libmp3lame \
  -b:a 96k \
  audiobook/audio/es/chapter-01-demo-whatsapp.mp3 \
  -y
```

### Parámetros
- `-t 120`: Duración de 2 minutos
- `-b:a 96k`: Bitrate reducido para menor tamaño
- `-acodec libmp3lame`: Codec MP3 optimizado
- `-y`: Sobrescribir si existe

## 📁 Ubicación

```
audiobook/audio/es/
├── chapter-01.mp3                    # Completo (17 MB, 18.3 min)
└── chapter-01-demo-whatsapp.mp3      # Demo (1.4 MB, 2 min)
```

---

*Generado: 2026-01-01*
*Calidad: 96 kbps mono*
*Optimizado para mensajería móvil*
