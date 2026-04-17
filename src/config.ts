// src/config.ts
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  GROQ_API_KEY: z.string().min(1, "A chave da Groq é obrigatória"),
  GEMINI_API_KEY: z.string().min(1, "A chave do Gemini é obrigatória"),
  OBSIDIAN_VAULT_PATH: z.string().min(1, "O caminho do vault é obrigatório"),
  
  GEMINI_MODEL: z.string().default("gemini-3-flash"),
  GEMINI_API_VERSION: z.string().default("v1"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Erro de configuração: Variáveis de ambiente inválidas.");
  console.error(_env.error.format());
  process.exit(1); 
}

export const env = _env.data;