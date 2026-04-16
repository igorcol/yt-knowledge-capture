// src/scripts/test-transcribe.ts
import { TranscriptionService } from '../services/TranscriptionService.js';
import path from 'node:path';

async function testTranscription() {
  // Ajuste para o seu arquivo atual
  const fileName = 'audio_1776375684444.m4a'; 
  const filePath = path.resolve('temp', fileName);

  console.log(`🎙️[Teste-Transcribe] Iniciando transcrição: ${fileName}`);

  try {
    const result = await TranscriptionService.transcribe(filePath);
    
    const textLength = result.text.length;
    const sampleSize = 150; // Quantidade de caracteres para amostra

    const start = result.text.slice(0, sampleSize);
    const end = result.text.slice(-sampleSize);

    console.log('\n--- AMOSTRAGEM DE DADOS ---');
    console.log(`📏 Total de caracteres: ${textLength}`);
    console.log(`📌 Início: "${start}..."`);
    console.log(`🔚 Fim: "...${end}"`);
    console.log('---------------------------\n');
    
    console.log('✅ Transcrição validada com sucesso!');
  } catch (error) {
    console.error('❌ Falha no teste de transcrição:', error);
  }
}

// npx tsx src/scripts/test-transcribe.ts
testTranscription();