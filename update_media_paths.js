const fs = require('fs');
const path = require('path');

// --- TODO (ES) ---
const todoEsPath = 'packages/todo/i18n/es/media.json';
const todoEs = {
  "all": {
    "audio": "/todo/audiobook/audio/es/LA-LEY-DEL-UNO-AUDIOLIBRO-COMPLETO-TTS.mp3",
    "pdf": "/todo/pdf/es/el-uno-libro-completo.pdf",
    "youtube": ""
  }
};

const todoChapters = [
    "cosmologia-y-genesis", "el-creador-y-la-creacion", "las-densidades-de-conciencia",
    "la-historia-espiritual-de-la-tierra", "polaridad-los-dos-caminos", "errantes-los-que-regresan",
    "la-cosecha", "el-velo-del-olvido", "la-muerte-y-el-viaje-entre-vidas",
    "los-centros-de-energia", "catalizador-y-experiencia"
];
const todoAudioFiles = [
    "01-el-uno-infinito", "02-el-gran-viaje", "03-el-olvido", "04-la-historia-de-este-mundo",
    "05-la-eleccion", "06-la-cosecha", "07-el-regalo-de-la-experiencia", "08-lo-que-viene-despues",
    "09-la-ayuda-que-te-rodea", "10-vivir-las-ensenanzas", "11-el-misterio-permanece"
];

for (let i = 1; i <= 11; i++) {
    const num = i.toString().padStart(2, '0');
    todoEs[i.toString()] = {
        "pdf": `/todo/pdf/es/el-uno-cap-${num}-${todoChapters[i-1]}.pdf`,
        "audio": `/todo/audiobook/audio/es-tts/${todoAudioFiles[i-1]}.mp3`,
        "youtube": ""
    };
}
fs.writeFileSync(todoEsPath, JSON.stringify(todoEs, null, 2));


// --- SANACION (EN) ---
const sanacionEnPath = 'packages/sanacion/i18n/en/media.json';
const sanacionEn = {
    "all": { "audio": "", "pdf": "", "youtube": "" },
    "1": { 
        "audio": "/sanacion/audiobook/audio/en/ch1/ch1-en.mp3", 
        "pdf": "", 
        "youtube": "" 
    }
};
// Rellenar resto vacios
for(let i=2; i<=11; i++) {
    sanacionEn[i.toString()] = { "audio": "", "pdf": "", "youtube": "" };
}
fs.writeFileSync(sanacionEnPath, JSON.stringify(sanacionEn, null, 2));


// --- JESUS (ES) ---
const jesusEsPath = 'packages/jesus/i18n/es/media.json';
const jesusEs = {
    "all": {
        "audio": "/jesus/audiobook/audio/es/EL-CAMINO-DEL-AMOR-AUDIOLIBRO-COMPLETO.mp3",
        "pdf": "",
        "youtube": ""
    }
};
const jesusFiles = [
    "ch01-en-el-principio-era-el-verbo", "ch02-el-camino-que-jesus-enseno", "ch03-la-vida-como-escuela-del-alma",
    "ch04-la-eleccion-del-corazon", "ch05-el-espiritu-que-mora-en-nosotros", "ch06-la-nueva-criatura",
    "ch07-el-projimo-como-espejo", "ch08-la-esperanza-que-no-defrauda", "ch09-la-oracion-y-la-quietud",
    "ch10-fe-y-obras", "ch11-el-misterio-y-la-humildad"
];

for(let i=1; i<=11; i++) {
    jesusEs[i.toString()] = {
        "audio": `/jesus/audiobook/audio/es/${jesusFiles[i-1]}.mp3`,
        "pdf": "",
        "youtube": ""
    };
}
fs.writeFileSync(jesusEsPath, JSON.stringify(jesusEs, null, 2));

console.log("Archivos media.json actualizados correctamente.");
