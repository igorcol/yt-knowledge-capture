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

    // Template do OBSIDIAN (Markdown + Metadata)
    const content = `---
source: ${sourceUrl}
date: ${date}
type: Learning/YouTube
status: #processed
---

# ${synthesis.title}

> [!ABSTRACT] Grande Ideia
> ${synthesis.summary}

---

## 🧠 Pilares do Conhecimento
${synthesis.pillars.map((p) => `### ${p.concept}\n${p.explanation}`).join("\n\n")}

---

## 🛠️ Ações Práticas
${synthesis.actionItems.map((item) => `- [ ] ${item}`).join("\n")}

---
*Gerado automaticamente pelo ecossistema C.A.O.S. em ${date}*
`;

    try {
      await fs.mkdir(env.OBSIDIAN_VAULT_PATH, { recursive: true });
      await fs.writeFile(fullPath, content, "utf-8");
      return fullPath;
    } catch (error) {
      console.error(`[StorageService] Erro ao salvar no Obsidian:`, error);
      throw new Error("Falha na persistência dos dados no Second Brain.");
    }
  }
}
