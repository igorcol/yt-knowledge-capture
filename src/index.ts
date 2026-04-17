// src/index.ts
import fs from 'node:fs/promises';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { env } from './config.js'; // Importando o env para os logs
import { VideoService } from './services/VideoService.js';
import { TranscriptionService } from './services/TranscriptionService.js';
import { SynthesisService } from './services/SynthesisService.js';
import { StorageService } from './services/StorageService.js';

/**
 * PROJETO LEARNING: Arquitetura de Absorção de Conhecimento
 * Motor de Automação C.A.O.S. (Colombini Automated Optimization Strategy)
 */
async function run() {
  let url = process.argv[2];

  if (!url) {
    const rl = readline.createInterface({ input, output });
    console.log('\n🫙  Nenhuma URL detectada no comando.');
    const answer = await rl.question('🔗 Cole a URL do YouTube aqui: ');
    url = answer.trim();
    rl.close();

    if (!url) {
      console.error('❌ Operação cancelada: URL não fornecida.');
      process.exit(1);
    }
  }

  // --- FRUFUZINHO TÉCNICO (HEADER) ---
  console.log('\n' + '═'.repeat(50));
  console.log('  C.A.O.S. LEARNING ENGINE v1.2');
  console.log('  ' + '─'.repeat(46));
  console.log(`  🎯 TARGET: ${url}`);
  console.log(`  🧠 BRAIN : ${env.GEMINI_MODEL} (${env.GEMINI_API_VERSION})`);
  console.log(`  🎙️  EARS  : Whisper V3 (Groq API)`);
  console.log('═'.repeat(50) + '\n');

  console.log('🏗️  Iniciando Pipeline...');
  
  // TELEMETRIA: Timer Global
  console.time('⏱️  Tempo Total de Processamento');

  let audioPath: string | null = null;

  try {
    // FASE 1: EXTRAÇÃO (The Ears)
    console.time('   [Phase 1] Extração de Áudio');
    audioPath = await VideoService.downloadAudio(url);
    console.timeEnd('   [Phase 1] Extração de Áudio');

    // FASE 2: TRANSCRIÇÃO (The Senses)
    console.time('   [Phase 2] Transcrição');
    const transcript = await TranscriptionService.transcribe(audioPath);
    console.timeEnd('   [Phase 2] Transcrição');
    console.log(`      └─ Volume: ${transcript.text.length} caracteres.`);

    // FASE 3: SÍNTESE (The Brain)
    console.time('   [Phase 3] Síntese Cognitiva');
    const synthesis = await SynthesisService.synthesize(transcript.text);
    console.timeEnd('   [Phase 3] Síntese Cognitiva');
    console.log(`      └─ Insight: "${synthesis.title}"`);

    // FASE 4: PERSISTÊNCIA (The Memory)
    console.time('   [Phase 4] Escrita no Obsidian');
    const finalPath = await StorageService.saveToObsidian(synthesis, url);
    console.timeEnd('   [Phase 4] Escrita no Obsidian');
    
    // RESULTADO FINAL
    console.log('\n' + '═'.repeat(50));
    console.log(`✅ FLUXO CONCLUÍDO COM SUCESSO!`);
    console.log(`📂 Nota salva em: ${finalPath}`);
    console.timeEnd('⏱️  Tempo Total de Processamento');
    console.log('═'.repeat(50));

  } catch (error: any) {
    console.error('\n' + '╒' + '═'.repeat(48) + '╕');
    console.error('  💥 FALHA CRÍTICA NO PIPELINE');
    console.error('  ' + '─'.repeat(46));
    console.error(`  > Motivo: ${error.message || error}`);
    console.error('╘' + '═'.repeat(48) + '╛');
    //process.exit(1); // Segue para apagar o temp
  } 
  finally {
    // Ofinally SEMPRE será executado, mesmo após um erro .
    if (audioPath) {
      try {
        await fs.unlink(audioPath);
        console.log('\n🧹 Cache de áudio removido.');
      } catch (e) {
        // Silencioso se o arquivo já não existir
      }
    }
    console.log('\n'); 
  }
}


run();