// src/index.ts
import fs from 'node:fs/promises';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
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

  // LOGIC: Gatilho Híbrido (Argumento ou Prompt)
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

  console.log('\n🏗️  Iniciando Pipeline C.A.O.S...');
  console.log('—'.repeat(50));
  
  // TELEMETRIA: Timer Global
  console.time('⏱️  Tempo Total de Processamento');

  let audioPath: string | null = null;

  try {
    // FASE 1: EXTRAÇÃO (The Ears)
    console.time('   [Phase 1] Extração de Áudio');
    audioPath = await VideoService.downloadAudio(url);
    console.timeEnd('   [Phase 1] Extração de Áudio');

    // FASE 2: TRANSCRIÇÃO (The Senses)
    console.time('   [Phase 2] Transcrição (Groq Whisper V3)');
    const transcript = await TranscriptionService.transcribe(audioPath);
    console.timeEnd('   [Phase 2] Transcrição (Groq Whisper V3)');
    console.log(`      └─ Volume: ${transcript.text.length} caracteres processados.`);

    // FASE 3: SÍNTESE (The Brain)
    console.time('   [Phase 3] Síntese Cognitiva (Gemini 3 Flash)');
    const synthesis = await SynthesisService.synthesize(transcript.text);
    console.timeEnd('   [Phase 3] Síntese Cognitiva (Gemini 3 Flash)');
    console.log(`      └─ Inteligência: "${synthesis.title}"`);

    // FASE 4: PERSISTÊNCIA (The Memory)
    console.time('   [Phase 4] Escrita no Obsidian');
    const finalPath = await StorageService.saveToObsidian(synthesis, url);
    console.timeEnd('   [Phase 4] Escrita no Obsidian');
    
    // RESULTADO FINAL
    console.log('—'.repeat(50));
    console.log(`✅ FLUXO CONCLUÍDO COM SUCESSO!`);
    console.log(`📂 Nota salva em: ${finalPath}`);
    console.timeEnd('⏱️  Tempo Total de Processamento');
    console.log('—'.repeat(50));

  } catch (error: any) {
    console.error('\n💥 FALHA CRÍTICA NO PIPELINE:');
    console.error(`   > Motivo: ${error.message || error}`);
    process.exit(1);
  } finally {
    // FASE 5: HIGIENE (Cleanup)
    if (audioPath) {
      try {
        await fs.unlink(audioPath);
        console.log('🧹 Cache de áudio removido do sistema.');
      } catch (e) {
        console.warn('⚠️  Aviso: Falha ao limpar arquivo temporário.');
      }
    }
    console.log('\n');
  }
}

// Inicialização do motor
run();