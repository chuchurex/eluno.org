#!/usr/bin/env node

/**
 * Audio Generation Script using Fish Audio API
 *
 * Converts audiobook markdown chapters to audio using Fish Audio TTS
 *
 * Usage:
 *   node audiobook/scripts/generate-audio.js <chapter-number> <language>
 *   node audiobook/scripts/generate-audio.js 01 en
 *   node audiobook/scripts/generate-audio.js 01 es
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load .env file
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
// CONFIGURATION
// ============================================================================

const FISH_AUDIO_API = 'https://api.fish.audio/v1/tts';

const VOICE_IDS = {
  en: process.env.FISH_VOICE_ID_EN || process.env.FISH_VOICE_ID || 'default-en',
  es: process.env.FISH_VOICE_ID_ES || process.env.FISH_VOICE_ID || 'default-es'
};

const PATHS = {
  contentEn: path.join(__dirname, '..', 'content', 'en'),
  contentEs: path.join(__dirname, '..', 'content', 'es'),
  audioEn: path.join(__dirname, '..', 'audio', 'en'),
  audioEs: path.join(__dirname, '..', 'audio', 'es')
};

// ============================================================================
// MARKDOWN TO TEXT CONVERTER
// ============================================================================

function markdownToPlainText(markdown) {
  let text = markdown;

  // Remove title metadata at the top
  text = text.replace(/^# .+ - AUDIOBOOK VERSION\n/m, '');

  // Convert headers to natural pauses
  text = text.replace(/^### (.+)$/gm, '\n\n$1.\n\n');  // H3 -> sentence with period
  text = text.replace(/^## (.+)$/gm, '\n\n$1.\n\n');   // H2 -> sentence with period
  text = text.replace(/^# (.+)$/gm, '\n\n$1.\n\n');    // H1 -> sentence with period

  // Remove horizontal rules (---)
  text = text.replace(/^---+$/gm, '\n');

  // Remove multiple newlines (keep max 2 for paragraph breaks)
  text = text.replace(/\n{3,}/g, '\n\n');

  // Remove leading/trailing whitespace
  text = text.trim();

  // Replace *End of Chapter* markers with natural ending
  text = text.replace(/\*End of Chapter.*\*/gi, 'End of chapter.');

  return text;
}

// ============================================================================
// SPLIT TEXT INTO CHUNKS
// ============================================================================

function splitIntoChunks(text, maxChunkSize = 4000) {
  // Fish Audio API typically has limits on text length per request
  // We split by paragraphs and combine into chunks under the limit

  const paragraphs = text.split('\n\n');
  const chunks = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;

    if ((currentChunk + '\n\n' + trimmedParagraph).length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = trimmedParagraph;
    } else {
      if (currentChunk) {
        currentChunk += '\n\n' + trimmedParagraph;
      } else {
        currentChunk = trimmedParagraph;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// ============================================================================
// FISH AUDIO API CALL
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

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(Buffer.concat(chunks));
        } else {
          reject(new Error(`API returned status ${res.statusCode}: ${Buffer.concat(chunks).toString()}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// ============================================================================
// COMBINE AUDIO FILES
// ============================================================================

async function combineAudioFiles(audioChunks, outputPath) {
  // Simple concatenation of MP3 files
  // Note: For production, you might want to use ffmpeg for better quality
  const combinedBuffer = Buffer.concat(audioChunks);
  fs.writeFileSync(outputPath, combinedBuffer);
}

// ============================================================================
// MAIN WORKFLOW
// ============================================================================

async function generateAudio(chapterNum, language) {
  const chNum = String(chapterNum).padStart(2, '0');
  console.log(`\n🎙️  Starting audio generation for Chapter ${chNum} (${language.toUpperCase()})\n`);

  // Validate language
  if (!['en', 'es'].includes(language)) {
    console.error('❌ Language must be "en" or "es"');
    process.exit(1);
  }

  // Check API key
  const apiKey = process.env.FISH_AUDIO_API_KEY || process.env.FISH_API_KEY;
  if (!apiKey) {
    console.error('❌ FISH_AUDIO_API_KEY or FISH_API_KEY environment variable not set');
    console.log('\nGet your API key from: https://fish.audio/');
    process.exit(1);
  }

  // Step 1: Load markdown chapter
  console.log('📖 Step 1: Loading chapter...');
  const contentPath = language === 'en' ? PATHS.contentEn : PATHS.contentEs;
  const sourcePath = path.join(contentPath, `chapter-${chNum}.md`);

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Chapter not found: ${sourcePath}`);
    process.exit(1);
  }

  const markdown = fs.readFileSync(sourcePath, 'utf8');
  const titleMatch = markdown.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Unknown';

  console.log(`   ✅ Loaded: "${title}"`);

  // Step 2: Convert to plain text
  console.log('\n📝 Step 2: Converting markdown to speech text...');
  const plainText = markdownToPlainText(markdown);
  console.log(`   ✅ Text length: ${plainText.length} characters`);

  // Step 3: Split into chunks
  console.log('\n✂️  Step 3: Splitting into chunks...');
  const chunks = splitIntoChunks(plainText, 4000);
  console.log(`   ✅ Created ${chunks.length} chunks`);

  // Step 4: Generate audio for each chunk
  console.log('\n🎙️  Step 4: Generating audio chunks...');
  const voiceId = VOICE_IDS[language];
  console.log(`   🎤 Using voice ID: ${voiceId}`);

  const audioChunks = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`   🔊 Chunk ${i + 1}/${chunks.length} (${chunk.length} chars)...`);

    try {
      const audioBuffer = await generateAudioChunk(chunk, voiceId, apiKey);
      audioChunks.push(audioBuffer);
      console.log(`   ✅ Chunk ${i + 1} complete (${audioBuffer.length} bytes)`);

      // Rate limiting - wait 1 second between requests
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`   ❌ Chunk ${i + 1} failed:`, error.message);
      throw error;
    }
  }

  // Step 5: Combine audio files
  console.log('\n🔗 Step 5: Combining audio chunks...');
  const audioPath = language === 'en' ? PATHS.audioEn : PATHS.audioEs;
  const outputPath = path.join(audioPath, `chapter-${chNum}.mp3`);

  await combineAudioFiles(audioChunks, outputPath);

  const stats = fs.statSync(outputPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

  console.log(`   ✅ Saved: ${outputPath}`);
  console.log(`   📊 Size: ${sizeMB} MB`);

  console.log('\n✨ Audio generation complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Chapter ${chNum} (${language.toUpperCase()})`);
  console.log(`   - ${chunks.length} chunks processed`);
  console.log(`   - Output: ${outputPath}`);
  console.log(`   - Size: ${sizeMB} MB`);
}

// ============================================================================
// MAIN
// ============================================================================

const chapterNum = process.argv[2];
const language = process.argv[3];

if (!chapterNum || !language) {
  console.log('\n🎙️  Audio Generation Script (Fish Audio)\n');
  console.log('Usage:');
  console.log('  node audiobook/scripts/generate-audio.js <chapter-number> <language>');
  console.log('  node audiobook/scripts/generate-audio.js 01 en');
  console.log('  node audiobook/scripts/generate-audio.js 01 es\n');
  console.log('Requirements:');
  console.log('  - FISH_AUDIO_API_KEY environment variable');
  console.log('  - FISH_VOICE_ID_EN (optional, for English voice)');
  console.log('  - FISH_VOICE_ID_ES (optional, for Spanish voice)\n');
  console.log('Get your API key from: https://fish.audio/\n');
  process.exit(0);
}

generateAudio(chapterNum, language).catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
