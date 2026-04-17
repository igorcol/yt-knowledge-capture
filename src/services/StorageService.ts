import fs from "node:fs/promises";
import path from "node:path";
import { env } from "../config.js";
import { StringHelper } from "../utils/StringHelper.js";
import type { ISynthesis } from "../types/schema.js";

/*
  Transforma a síntese em um arquivo .md no Obsidian
*/

export class StorageService {
  static async saveToObsidian(
    synthesis: ISynthesis,
    sourceUrl: string,
  ): Promise<string> {
    const fileName = `${StringHelper.sanitizeFilename(synthesis.title)}.md`;
    const fullPath = path.join(env.OBSIDIAN_VAULT_PATH, fileName);
    const date = new Date().toISOString().split("T")[0];

    // Agora o template é apenas os Metadados + o Conteúdo que a IA gerou
    const fileContent = `---
source: ${sourceUrl}
date: ${date}
tags: ${synthesis.tags.join(", ")}
status: #processed
---

${synthesis.content}

---
*Gerado via C.A.O.S. Learn Scrip em ${date}*
`;

    await fs.writeFile(fullPath, fileContent, "utf-8");
    return fullPath;
  }
}
