// src/scripts/test-full-flow.ts
import fs from 'node:fs/promises';
import { VideoService } from '../services/VideoService.js';
import { TranscriptionService } from '../services/TranscriptionService.js';
import { SynthesisService } from '../services/SynthesisService.js';
import { StorageService } from '../services/StorageService.js';

async function runFullFlow() {
  const url = 'https://www.youtube.com/watch?v=fbwzEzTcABk';
  
  console.log('🏗️  Iniciando Pipeline C.A.O.S...');
  console.log('—'.repeat(40));
  
  // Timer Global
  console.time('⏱️  Tempo Total de Execução');

  let audioPath = '';

  try {
    // FASE 1: EXTRAÇÃO 
    console.time('   Phase 1: Extração de Áudio');
    audioPath = await VideoService.downloadAudio(url);
    console.timeEnd('   Phase 1: Extração de Áudio');

    // FASE 2: TRANSCRIÇÃO 
    console.time('   Phase 2: Transcrição (Groq)');
    const transcript = await TranscriptionService.transcribe(audioPath);
    console.timeEnd('   Phase 2: Transcrição (Groq)');
    console.log(`      └─ Transcrito: ${transcript.text.length} caracteres.`);

    // FASE 3: SÍNTESE
    console.time('   Phase 3: Síntese Cognitiva (Gemini 3)');
    const synthesis = await SynthesisService.synthesize(transcript.text);
    console.timeEnd('   Phase 3: Síntese Cognitiva (Gemini 3)');

    // FASE 4: PERSISTÊNCIA 
    console.time('   Phase 4: Escrita no Obsidian');
    const finalPath = await StorageService.saveToObsidian(synthesis, url);
    console.timeEnd('   Phase 4: Escrita no Obsidian');
    
    console.log('—'.repeat(40));
    console.log(`✅ FLUXO CONCLUÍDO COM SUCESSO!`);
    console.log(`📂 Nota salva em: ${finalPath}`);
    console.timeEnd('⏱️  Tempo Total de Execução');
    console.log('—'.repeat(40));

  } catch (error) {
    console.error('\n❌ FALHA NO PIPELINE:');
    console.error(error);
  } finally {
    // FASE 5: Cleanup
    if (audioPath) {
      try {
        await fs.unlink(audioPath);
        console.log('🧹 Cache de áudio removido.');
      } catch (e) {
        console.warn('⚠️ Erro ao limpar cache.');
      }
    }
  }
}

// npx tsx src/scripts/test-full-flow.ts
runFullFlow();