// src/services/VideoService.ts
import { exec } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import fs from "node:fs/promises";

const execPromise = promisify(exec);

export interface VideoData {
  audioPath: string;
  title: string;
  channel: string;
}

export class VideoService {
  private static readonly TEMP_DIR = path.resolve("temp");

  /**
   * Extrai os metadados e o áudio de uma URL do YouTube
   * @param url URL do vídeo
   * @returns Objeto com o caminho do áudio, título e nome do canal
   */
  static async downloadAudio(url: string): Promise<VideoData> {
    await fs.mkdir(this.TEMP_DIR, { recursive: true });

    // 1. Extração de Metadados (Super Rápida)
    console.log(`[VideoService] Capturando metadados da fonte...`);
    // Usamos um separador bizarro '|#|' para evitar conflitos se o título tiver pipes
    const metaCommand = `yt-dlp --print "%(title)s|#|%(uploader)s" --no-playlist "${url}"`;
    
    let title = "Video_Desconhecido";
    let channel = "Canal_Desconhecido";

    try {
      const { stdout } = await execPromise(metaCommand);
      const parts = stdout.trim().split('|#|');
      
      if (parts.length >= 2) {
        title = parts[0] ?? "Video_Desconhecido";
        channel = parts[1] ?? "Canal_Desconhecido";
      }
    } catch (error) {
      console.warn(`[VideoService] ⚠️ Aviso: Não foi possível extrair metadados precisos. Usando fallback.`);
    }

    // 2. Download do Áudio
    const timestamp = Date.now();
    const outputPath = path.join(this.TEMP_DIR, `audio_${timestamp}.m4a`);
    const command = `yt-dlp -x --audio-format m4a -o "${outputPath}" "${url}"`;

    try {
      console.log(`[VideoService] Iniciando download do áudio...`);
      await execPromise(command);
      console.log(`[VideoService] Download concluído: ${outputPath}`);
      
      return {
        audioPath: outputPath,
        title,
        channel
      };
    } catch (error: any) {
      const errorMessage = error.stderr || error.message;
      console.error(`[VideoService] Erro do yt-dlp: ${errorMessage}`);
      throw new Error(
        "Falha na extração de áudio: O vídeo pode ser muito novo ou estar indisponível.",
      );
    }
  }
}