import { VideoService } from "../services/VideoService.js";

// TESTA A EXTRAÇÃO - Download do video pela URL
// npx tsx src/scripts/test-yt.ts

async function runTest() {
  const testUrl = "https://www.youtube.com/watch?v=fbwzEzTcABk";

  console.log("🚀 Iniciando teste de extração...");

  try {
    const outputPath = await VideoService.downloadAudio(testUrl);
    console.log("✅ Sucesso!");
    console.log(`📍 O arquivo foi salvo em: ${outputPath}`);
  } catch (error) {
    console.error("❌ O teste falhou:", error);
  }
}

runTest();
