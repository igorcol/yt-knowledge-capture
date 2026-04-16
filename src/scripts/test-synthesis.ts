// src/scripts/test-synthesis.ts
import path from 'node:path';
import { TranscriptionService } from '../services/TranscriptionService.js';
import { SynthesisService } from '../services/SynthesisService.js';

async function testFullIntelligence() {
  // 1. Usando o arquivo que você já tem no /temp
  const fileName = 'audio_1776375684444.m4a'; 
  const filePath = path.resolve('temp', fileName);

  console.log(`🚀 Iniciando Teste de Inteligência C.A.O.S.`);
  
  try {
    // Passo A: Transcrição (Ouvido)
    const transcript = await TranscriptionService.transcribe(filePath);
    console.log(`✅ Transcrição concluída (${transcript.text.length} caracteres).`);

    // Passo B: Síntese (Cérebro)
    const synthesis = await SynthesisService.synthesize(transcript.text);

    // Exibição dos resultados formatados
    console.log('\n' + '='.repeat(50));
    console.log(`📘 TÍTULO: ${synthesis.title}`);
    console.log(`💡 RESUMO: ${synthesis.summary}`);
    
    console.log('\n🧠 PILARES DO CONHECIMENTO:');
    synthesis.pillars.forEach((p, i) => {
      console.log(`${i + 1}. [${p.concept}]: ${p.explanation}`);
    });

    console.log('\n🛠️ AÇÕES PRÁTICAS:');
    synthesis.actionItems.forEach((item, i) => {
      console.log(`- ${item}`);
    });
    console.log('='.repeat(50) + '\n');

    console.log('✅ Motor de Síntese validado com sucesso!');

  } catch (error) {
    console.error('❌ O teste de inteligência falhou:', error);
  }
}

// npx tsx src/scripts/test-synthesis.ts
testFullIntelligence();