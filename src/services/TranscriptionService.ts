import fs from "node:fs";
import Groq from "groq-sdk";
import { env } from "../config.js";
import type { TranscriptResult } from "../types/index.js";

// TRANSCREVE O AUDIO

export class TranscriptionService {
  private static groq = new Groq({
    apiKey: env.GROQ_API_KEY,
  });

  /**
   * Envia o arquivo de áudio para a Groq e retorna o texto transcrito
   * @param filePath Caminho local do arquivo .m4a
   */
  static async transcribe(filePath: string): Promise<TranscriptResult> {
    try {
      console.log(`[TranscriptionService] Enviando para Groq (Whisper V3)...`);

      // Cria um stream de leitura para o arquivo
      const fileStream = fs.createReadStream(filePath);

      const response = await this.groq.audio.transcriptions.create({
        file: fileStream,
        model: "whisper-large-v3",
        response_format: "json",
        temperature: 0,
      });

      // A API retorna a duração em segundos se solicitado ou apenas o texto.
      return {
        text: response.text,
        language: "pt", // TODO: NÃO DEIXAR SÓ PARA PTBR
        duration: 0,
      };
    } catch (error: any) {
      console.error(
        `[TranscriptionService] Erro na transcrição:`,
        error.message,
      );
      throw new Error(`Falha ao converter áudio em texto via Groq.`);
    }
  }
}
