#!/usr/bin/env node

/**
 * Audiobook Generator - Fish Audio + Background Music
 *
 * Genera audiolibros con voz TTS y música de fondo
 *
 * Usage:
 *   node audiobook/scripts/generate-audiobook.js --script <guion.md> --voice <voice_id> --music <music.mp3> --output <salida.mp3>
 *
 * Ejemplos:
 *   node audiobook/scripts/generate-audiobook.js \
 *     --script audiobook/content/es/chapter-01.md \
 *     --voice f53102becdf94a51af6d64010bc658f2 \
 *     --music video/bases/endless-cosmos-space-meditation-114592.mp3 \
 *     --output audiobook/audio/es/chapter-01-final.mp3
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// ============================================================================
// LOAD .ENV
// ============================================================================

const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// ============================================================================
// PARSE ARGUMENTS
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    script: null,
    voice: process.env.FISH_VOICE_ID,
    music: null,
    output: null,
    musicVolume: 0.15,  // Volumen de la música de fondo (0-1)
    fadeIn: 3,          // Fade in de música (segundos)
    fadeOut: 5,         // Fade out de música (segundos)
    speed: 1.0          // Velocidad de reproducción (0.5-2.0)
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--script':
      case '-s':
        options.script = args[++i];
        break;
      case '--voice':
      case '-v':
        options.voice = args[++i];
        break;
      case '--music':
      case '-m':
        options.music = args[++i];
        break;
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--music-volume':
        options.musicVolume = parseFloat(args[++i]);
        break;
      case '--fade-in':
        options.fadeIn = parseFloat(args[++i]);
        break;
      case '--fade-out':
        options.fadeOut = parseFloat(args[++i]);
        break;
      case '--speed':
        options.speed = parseFloat(args[++i]);
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
    }
  }

  return options;
}

function showHelp() {
  console.log(`
🎙️  Audiobook Generator - Fish Audio + Background Music

Uso:
  node generate-audiobook.js --script <guion.md> [opciones]

Opciones requeridas:
  --script, -s    Archivo markdown con el guion
  --output, -o    Archivo de salida (.mp3)

Opciones adicionales:
  --voice, -v     ID de voz Fish Audio (default: FISH_VOICE_ID del .env)
  --music, -m     Archivo de música de fondo (.mp3)
  --music-volume  Volumen de la música (0-1, default: 0.15)
  --fade-in       Fade in de música en segundos (default: 3)
  --fade-out      Fade out de música en segundos (default: 5)
  --speed         Velocidad de reproducción (0.5-2.0, default: 1.0)

Ejemplos:
  # Solo voz
  node generate-audiobook.js -s guion.md -o salida.mp3

  # Voz + música de fondo
  node generate-audiobook.js -s guion.md -m musica.mp3 -o salida.mp3

  # Con voz específica
  node generate-audiobook.js -s guion.md -v abc123 -m musica.mp3 -o salida.mp3
`);
}

// ============================================================================
// MARKDOWN TO TEXT
// ============================================================================

function markdownToPlainText(markdown) {
  let text = markdown;

  // Convertir headers a pausas naturales
  text = text.replace(/^### (.+)$/gm, '\n\n$1.\n\n');
  text = text.replace(/^## (.+)$/gm, '\n\n$1.\n\n');
  text = text.replace(/^# (.+)$/gm, '\n\n$1.\n\n');

  // Remover líneas horizontales
  text = text.replace(/^---+$/gm, '\n');

  // Remover marcadores de fin de capítulo
  text = text.replace(/\*Fin del Capítulo.*\*/gi, '');

  // Limpiar espacios múltiples
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();

  return text;
}

// ============================================================================
// SPLIT TEXT INTO CHUNKS
// ============================================================================

function splitIntoChunks(text, maxChunkSize = 4000) {
  const paragraphs = text.split('\n\n');
  const chunks = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;

    if ((currentChunk + '\n\n' + trimmed).length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = trimmed;
    } else {
      currentChunk = currentChunk ? currentChunk + '\n\n' + trimmed : trimmed;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// ============================================================================
// FISH AUDIO API
// ============================================================================

async function generateAudioChunk(text, voiceId, apiKey) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text: text,
      reference_id: voiceId,
      format: 'mp3',
      normalize: true,
      latency: 'normal'
    });

    const options = {
      hostname: 'api.fish.audio',
      port: 443,
      path: '/v1/tts',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => chunks.push(chunk));

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(Buffer.concat(chunks));
        } else {
          reject(new Error(`API error ${res.statusCode}: ${Buffer.concat(chunks).toString()}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ============================================================================
// AUDIO PROCESSING WITH FFMPEG
// ============================================================================

function checkFfmpeg() {
  try {
    execSync('which ffmpeg', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function getAudioDuration(filePath) {
  const result = execSync(
    `ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
    { encoding: 'utf8' }
  );
  return parseFloat(result.trim());
}

function mixAudioWithMusic(voicePath, musicPath, outputPath, options) {
  const voiceDuration = getAudioDuration(voicePath);
  const musicDuration = getAudioDuration(musicPath);

  console.log(`   🎤 Duración voz: ${formatTime(voiceDuration)}`);
  console.log(`   🎵 Duración música: ${formatTime(musicDuration)}`);

  // Tiempo total necesario (voz + padding)
  const totalDuration = voiceDuration + 4;
  const fadeOutStart = voiceDuration - options.fadeOut;

  // Usar stream_loop para loop infinito sin cortes
  // -stream_loop -1 hace loop infinito del archivo de entrada
  const filterComplex = [
    // Stream 0: voz con padding al final
    `[0:a]apad=pad_dur=2[voice]`,
    // Stream 1: música ya viene en loop, aplicar fade y volumen
    `[1:a]afade=t=in:st=0:d=${options.fadeIn},` +
    `afade=t=out:st=${fadeOutStart}:d=${options.fadeOut},` +
    `volume=${options.musicVolume}[music]`,
    // Mezclar ambos
    `[voice][music]amix=inputs=2:duration=first:dropout_transition=2[out]`
  ].join(';');

  // -stream_loop -1 en el input de música para loop seamless
  const cmd = `ffmpeg -y -i "${voicePath}" -stream_loop -1 -i "${musicPath}" -filter_complex "${filterComplex}" -map "[out]" -c:a libmp3lame -b:a 192k "${outputPath}"`;

  execSync(cmd, { stdio: 'inherit' });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================================================
// MAIN WORKFLOW
// ============================================================================

async function main() {
  const options = parseArgs();

  // Validaciones
  if (!options.script) {
    console.error('❌ Error: Se requiere --script <archivo.md>');
    showHelp();
    process.exit(1);
  }

  if (!options.output) {
    console.error('❌ Error: Se requiere --output <archivo.mp3>');
    showHelp();
    process.exit(1);
  }

  if (!options.voice) {
    console.error('❌ Error: Se requiere --voice o FISH_VOICE_ID en .env');
    process.exit(1);
  }

  const apiKey = process.env.FISH_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: FISH_API_KEY no configurado en .env');
    process.exit(1);
  }

  if (!fs.existsSync(options.script)) {
    console.error(`❌ Error: Guion no encontrado: ${options.script}`);
    process.exit(1);
  }

  if (options.music && !fs.existsSync(options.music)) {
    console.error(`❌ Error: Música no encontrada: ${options.music}`);
    process.exit(1);
  }

  if (options.music && !checkFfmpeg()) {
    console.error('❌ Error: ffmpeg no instalado. Instálalo con: brew install ffmpeg');
    process.exit(1);
  }

  console.log('\n🎙️  AUDIOBOOK GENERATOR\n');
  console.log('📋 Configuración:');
  console.log(`   Guion: ${options.script}`);
  console.log(`   Voz: ${options.voice}`);
  console.log(`   Música: ${options.music || '(sin música)'}`);
  console.log(`   Salida: ${options.output}`);
  if (options.music) {
    console.log(`   Volumen música: ${(options.musicVolume * 100).toFixed(0)}%`);
  }
  if (options.speed !== 1.0) {
    console.log(`   Velocidad: ${(options.speed * 100).toFixed(0)}%`);
  }

  // Paso 1: Cargar guion
  console.log('\n📖 Paso 1: Cargando guion...');
  const markdown = fs.readFileSync(options.script, 'utf8');
  const plainText = markdownToPlainText(markdown);
  console.log(`   ✅ ${plainText.length} caracteres`);

  // Paso 2: Dividir en chunks
  console.log('\n✂️  Paso 2: Dividiendo en chunks...');
  const chunks = splitIntoChunks(plainText);
  console.log(`   ✅ ${chunks.length} chunks`);

  // Paso 3: Generar audio
  console.log('\n🎤 Paso 3: Generando audio con Fish Audio...');
  const audioChunks = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    process.stdout.write(`   🔊 Chunk ${i + 1}/${chunks.length}...`);

    try {
      const audioBuffer = await generateAudioChunk(chunk, options.voice, apiKey);
      audioChunks.push(audioBuffer);
      console.log(` ✅ (${(audioBuffer.length / 1024).toFixed(0)} KB)`);

      // Rate limiting
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.log(` ❌`);
      console.error(`   Error: ${error.message}`);
      process.exit(1);
    }
  }

  // Paso 4: Combinar chunks de voz
  console.log('\n🔗 Paso 4: Combinando chunks...');
  const tempVoicePath = options.output.replace('.mp3', '_voice_temp.mp3');
  const combinedBuffer = Buffer.concat(audioChunks);
  fs.writeFileSync(tempVoicePath, combinedBuffer);
  console.log(`   ✅ Voz combinada: ${(combinedBuffer.length / 1024 / 1024).toFixed(2)} MB`);

  // Paso 5: Mezclar con música (si se proporcionó)
  if (options.music) {
    console.log('\n🎵 Paso 5: Mezclando con música de fondo...');
    mixAudioWithMusic(tempVoicePath, options.music, options.output, options);

    // Limpiar archivo temporal
    fs.unlinkSync(tempVoicePath);
    console.log(`   ✅ Mezcla completada`);
  } else {
    // Solo renombrar el archivo temporal
    fs.renameSync(tempVoicePath, options.output);
  }

  // Paso 6: Ajustar velocidad (si se especificó)
  if (options.speed !== 1.0) {
    console.log(`\n🏃 Paso 6: Ajustando velocidad a ${(options.speed * 100).toFixed(0)}%...`);
    const tempSpeedPath = options.output.replace('.mp3', '_speed_temp.mp3');
    fs.renameSync(options.output, tempSpeedPath);

    const speedCmd = `ffmpeg -y -i "${tempSpeedPath}" -filter:a "atempo=${options.speed}" -c:a libmp3lame -b:a 192k "${options.output}"`;
    execSync(speedCmd, { stdio: 'inherit' });

    fs.unlinkSync(tempSpeedPath);
    console.log(`   ✅ Velocidad ajustada`);
  }

  // Resumen final
  const finalStats = fs.statSync(options.output);
  const finalDuration = getAudioDuration(options.output);

  console.log('\n✨ ¡COMPLETADO!\n');
  console.log('📊 Resumen:');
  console.log(`   Archivo: ${options.output}`);
  console.log(`   Duración: ${formatTime(finalDuration)}`);
  console.log(`   Tamaño: ${(finalStats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log('');
}

main().catch(err => {
  console.error('\n❌ Error fatal:', err.message);
  process.exit(1);
});
