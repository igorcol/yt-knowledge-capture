

export class StringHelper {
  /**
   * Transforma um título em um nome de arquivo seguro
   */
  static sanitizeFilename(title: string): string {
    return title
      .replace(/[\\/:*?"<>|]/g, '') // Remove caracteres ilegais do Windows
      .replace(/\s+/g, ' ')         // Remove espaços duplos
      .trim();
  }
}