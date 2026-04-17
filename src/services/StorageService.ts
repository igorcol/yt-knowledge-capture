import fs from "node:fs/promises";
import path from "node:path";
import { env } from "../config.js";
import { StringHelper } from "../utils/StringHelper.js";
import type { ISynthesis } from "../types/schema.js";

/*
  Transforma a síntese em um arquivo .md no Obsidian
*/

export class StorageService {
  // Agora recebemos o title e o channel do vídeo
  static async saveToObsidian(
    synthesis: ISynthesis,
    url: string,
    videoTitle: string,
    channelName: string,
  ): Promise<string> {
    const fileName = `${StringHelper.sanitizeFilename(videoTitle)}.md`;
    const fullPath = path.join(env.OBSIDIAN_VAULT_PATH, fileName);
    const date = new Date().toISOString().split("T")[0];

    const fileContent = `---
                        source: ${url}
                        author: ${channelName}
                        date: ${date}
                        tags: ${synthesis.tags.join(", ")}
                        status: #processed
                        ---

                        # 🧠 ${videoTitle}

                        ${synthesis.content}

                        ---
                        *Gerado via C.A.O.S. Learning Engine em ${date}*
                        `;

    await fs.writeFile(fullPath, fileContent, "utf-8");
    return fullPath;
  }
}
