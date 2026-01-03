#!/usr/bin/env node

/**
 * Audiobook Translation Script for lawofone.cl
 *
 * Translates audiobook chapters from English to Spanish
 * Uses the same glossary and quality standards as the main site
 *
 * Usage:
 *   node audiobook/scripts/translate-audiobook.js <chapter-number>
 *   node audiobook/scripts/translate-audiobook.js 01
 */

const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// ============================================================================
// CONFIGURATION
// ============================================================================

const GLOSSARY = {
  en: {
    'Harvest': 'Harvest',
    'Distortion': 'Distortion',
    'Catalyst': 'Catalyst',
    'Density': 'Density',
    'Service to Others': 'Service to Others',
    'Service to Self': 'Service to Self',
    'Free Will': 'Free Will',
    'The Veil': 'The Veil',
    'Logos': 'Logos',
    'Intelligent Infinity': 'Intelligent Infinity',
    'Intelligent Energy': 'Intelligent Energy',
    'Social Memory Complex': 'Social Memory Complex',
    'Mind/Body/Spirit Complex': 'Mind/Body/Spirit Complex',
    'Wanderer': 'Wanderer',
    'Confederation': 'Confederation',
    'Orion Group': 'Orion Group',
    'Sub-Logos': 'Sub-Logos',
    'Co-Creator': 'Co-Creator',
    'The Infinite': 'The Infinite',
    'The One': 'The One',
    'Finitude': 'Finitude'
  },
  es: {
    'Harvest': 'Cosecha',
    'Distortion': 'Distorsión',
    'Catalyst': 'Catalizador',
    'Density': 'Densidad',
    'Service to Others': 'Servicio a Otros',
    'Service to Self': 'Servicio a Sí Mismo',
    'Free Will': 'Libre Albedrío',
    'The Veil': 'El Velo',
    'Logos': 'Logos',
    'Intelligent Infinity': 'Infinito Inteligente',
    'Intelligent Energy': 'Energía Inteligente',
    'Social Memory Complex': 'Complejo de Memoria Social',
    'Mind/Body/Spirit Complex': 'Complejo Mente/Cuerpo/Espíritu',
    'Wanderer': 'Errante',
    'Confederation': 'Confederación',
    'Orion Group': 'Grupo de Orión',
    'Sub-Logos': 'Sub-Logos',
    'Co-Creator': 'Co-Creador',
    'The Infinite': 'El Infinito',
    'The One': 'El Uno',
    'Finitude': 'Finitud'
  }
};

const PATHS = {
  contentEn: path.join(__dirname, '..', 'content', 'en'),
  contentEs: path.join(__dirname, '..', 'content', 'es')
};

// ============================================================================
// TRANSLATION PROMPT GENERATOR
// ============================================================================

function generateTranslationPrompt(markdownContent) {
  const glossaryList = Object.entries(GLOSSARY.en)
    .map(([en, _]) => `- ${en} = ${GLOSSARY.es[en]}`)
    .join('\n');

  return `Traduce el siguiente capítulo del audiolibro del Material de Ra al español.

REGLAS ESTRICTAS DE TRADUCCIÓN:

1. **Consistencia Terminológica Absoluta**: Usa SIEMPRE estas traducciones exactas:
${glossaryList}

2. **Estilo de Traducción para Audiolibro**:
   - Mantén el tono filosófico, educativo y reverente al misterio
   - La traducción debe sonar NATURAL cuando se lea en voz alta
   - Usa oraciones fluidas que funcionen bien para narración
   - Mantén la estructura markdown (títulos, separadores ---)
   - Preserva el formato exacto del original
   - Evita redundancias que suenen mal al oído

3. **Qué Traducir**:
   - Todos los títulos (# ## ###)
   - Todo el contenido narrativo
   - Mantén los separadores --- sin cambios
   - Traduce "End of Chapter" como "Fin del Capítulo"

4. **Consideraciones para Audio**:
   - Las oraciones deben fluir naturalmente al ser leídas
   - Evita construcciones gramaticales complejas que confundan al oyente
   - Mantén el ritmo y la cadencia del original
   - Las pausas (párrafos) deben ser claras y significativas

5. **Formato Markdown**:
   - Mantén EXACTAMENTE la misma estructura de títulos
   - Preserva todos los --- (separadores)
   - No agregues ni quites líneas en blanco
   - Mantén la jerarquía de títulos (# ## ###)

CAPÍTULO A TRADUCIR:

${markdownContent}

RESPONDE ÚNICAMENTE CON EL MARKDOWN TRADUCIDO, SIN EXPLICACIONES ADICIONALES.`;
}

// ============================================================================
// TRANSLATION FUNCTION
// ============================================================================

async function translateWithClaude(content) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable not set');
  }

  const client = new Anthropic({ apiKey });

  console.log('   🤖 Sending to Claude for translation...');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [{
      role: 'user',
      content: generateTranslationPrompt(content)
    }]
  });

  return message.content[0].text;
}

// ============================================================================
// MAIN WORKFLOW
// ============================================================================

async function translateAudiobook(chapterNum) {
  const chNum = String(chapterNum).padStart(2, '0');
  console.log(`\n🎧 Starting audiobook translation for Chapter ${chNum}\n`);

  // Step 1: Load source chapter
  console.log('📖 Step 1: Loading English audiobook chapter...');
  const sourcePath = path.join(PATHS.contentEn, `chapter-${chNum}.md`);

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Chapter ${chNum} not found at ${sourcePath}`);
    process.exit(1);
  }

  const sourceContent = fs.readFileSync(sourcePath, 'utf8');
  const titleMatch = sourceContent.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Unknown';

  console.log(`   ✅ Loaded: "${title}"`);
  console.log(`   📊 Length: ${sourceContent.length} characters`);

  // Step 2: Translate with Claude
  console.log('\n🌐 Step 2: Translating to Spanish...');

  try {
    const translatedContent = await translateWithClaude(sourceContent);

    console.log(`   ✅ Translation complete`);
    console.log(`   📊 Length: ${translatedContent.length} characters`);

    // Step 3: Save translation
    console.log('\n💾 Step 3: Saving Spanish translation...');
    const targetPath = path.join(PATHS.contentEs, `chapter-${chNum}.md`);
    fs.writeFileSync(targetPath, translatedContent, 'utf8');
    console.log(`   ✅ Saved to: ${targetPath}`);

    // Step 4: Verification
    console.log('\n✅ Step 4: Verification...');
    const savedContent = fs.readFileSync(targetPath, 'utf8');
    const esTitle = savedContent.match(/^# (.+)$/m)?.[1];

    console.log(`   ✅ Spanish title: "${esTitle}"`);
    console.log(`   ✅ File size: ${savedContent.length} characters`);

    console.log('\n✨ Translation complete!\n');
    console.log('📊 Summary:');
    console.log(`   - Chapter ${chNum} translated to Spanish`);
    console.log(`   - Source: ${sourcePath}`);
    console.log(`   - Target: ${targetPath}`);
    console.log('\nNext steps:');
    console.log('   - Review the translation for quality');
    console.log('   - Generate audio with: node audiobook/scripts/generate-audio.js 01');

  } catch (error) {
    console.error('\n❌ Translation failed:', error.message);
    process.exit(1);
  }
}

// ============================================================================
// MAIN
// ============================================================================

const chapterNum = process.argv[2];

if (!chapterNum) {
  console.log('\n🎧 Audiobook Translation Script\n');
  console.log('Usage:');
  console.log('  node audiobook/scripts/translate-audiobook.js <chapter-number>');
  console.log('  node audiobook/scripts/translate-audiobook.js 01\n');
  console.log('Features:');
  console.log('  - Translates audiobook chapters from EN to ES');
  console.log('  - Uses Claude Sonnet 4 for high-quality translation');
  console.log('  - Maintains consistent Law of One terminology');
  console.log('  - Optimized for natural audio narration\n');
  console.log('Requirements:');
  console.log('  - ANTHROPIC_API_KEY environment variable must be set\n');
  process.exit(0);
}

translateAudiobook(chapterNum).catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
