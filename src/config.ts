// src/config.ts
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  GROQ_API_KEY: z.string().min(1, "A chave da Groq é obrigatória"),
  GEMINI_API_KEY: z.string().min(1, "A chave do Gemini é obrigatória"),
  OBSIDIAN_VAULT_PATH: z.string().min(1, "O caminho do vault é obrigatório"),
});

// Validação em tempo de execução
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Erro de configuração: Variáveis de ambiente inválidas.");
  console.error(z.treeifyError(_env.error));
  process.exit(1); // Interrompe imediatamente
}

export const env = _env.data;