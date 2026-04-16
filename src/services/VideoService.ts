import { exec } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import fs from "node:fs/promises";

const execPromise = promisify(exec);

export class VideoService {
  private static readonly TEMP_DIR = path.resolve("temp");

  /**
   * Extrai o áudio de uma URL do YouTube e salva na pasta /temp
   * @param url URL do vídeo
   * @returns Caminho do arquivo de áudio gerado
   */
  static async downloadAudio(url: string): Promise<string> {
    // Garante que a /temp existe
    await fs.mkdir(this.TEMP_DIR, { recursive: true });

    const timestamp = Date.now();
    const outputPath = path.join(this.TEMP_DIR, `audio_${timestamp}.m4a`);

    // Comando yt-dlp:
    // -x: extrair áudio | --audio-format m4a: formato leve e compativel | -o: caminho de saída
    const command = `yt-dlp -x --audio-format m4a -o "${outputPath}" "${url}"`;

    try {
      console.log(`[VideoService] Iniciando download do áudio...`);
      await execPromise(command);
      console.log(`[VideoService] Download concluído: ${outputPath}`);
      return outputPath;
    } catch (error: any) {
      const errorMessage = error.stderr || error.message;
      console.error(`[VideoService] Erro do yt-dlp: ${errorMessage}`);
      throw new Error(
        "Falha na extração de áudio: O vídeo pode ser muito novo ou estar indisponível.",
      );
    }
  }
}
