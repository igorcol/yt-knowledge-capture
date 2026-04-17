// src/types/schemas.ts
import { z } from 'zod';

export const SynthesisSchema = z.object({
  title: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
  // Corpo da nota completo e formatado
  content: z.string(), 
});

export type ISynthesis = z.infer<typeof SynthesisSchema>;