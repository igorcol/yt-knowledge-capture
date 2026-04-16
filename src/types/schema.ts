// src/types/schemas.ts
import { z } from 'zod';

export const SynthesisSchema = z.object({
  title: z.string().describe("Título impactante e direto"),
  summary: z.string().describe("A 'Grande Ideia' em uma frase única"),
  pillars: z.array(z.object({
    concept: z.string().describe("O conceito ou pilar fundamental"),
    explanation: z.string().describe("Explicação cirúrgica e concisa")
  })).min(1),
  actionItems: z.array(z.string()).min(1).describe("Lista de ações práticas para aplicar o conhecimento")
});

// Extraímos o tipo inferido do Zod para uso no TypeScript
export type ISynthesis = z.infer<typeof SynthesisSchema>;