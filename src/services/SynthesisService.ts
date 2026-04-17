import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config.js";
import { SynthesisSchema, type ISynthesis } from "../types/schema.js";
import { PERSONA_PROMPT } from "../../PROMPTS.js";

/*
    Recebe a transcrição do video e gera um resumo tático com a persona dada.
*/

export class SynthesisService {
  private static genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  
  // A Persona é o coração do sistema
  private static readonly SYSTEM_PROMPT = PERSONA_PROMPT;

  // Inicialização otimizada para v1beta (Resiliência Máxima)
  private static model = this.genAI.getGenerativeModel(
  { 
    model: env.GEMINI_MODEL,
    systemInstruction: {
      role: "system",
      parts: [{ text: this.SYSTEM_PROMPT }],
    },
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2, 
    },
  },
  { apiVersion: env.GEMINI_API_VERSION as any }
);

  static async synthesize(transcriptText: string): Promise<ISynthesis> {
    try {
      console.log(`[SynthesisService] Iniciando compressão cognitiva via ${env.GEMINI_MODEL}...`);

      const prompt = `Analise e destile a transcrição conforme o protocolo 80/20:\n\n"${transcriptText}"`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let responseText = response.text();

      // --- BLINDAGEM C.A.O.S. (LIMPEZA DE RESPOSTA) ---
      // 1. Remove blocos de código Markdown se existirem (```json ... ```)
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '');
      
      // 2. Localiza o primeiro '{' e o último '}' para isolar apenas o objeto JSON
      const firstBrace = responseText.indexOf('{');
      const lastBrace = responseText.lastIndexOf('}');
      
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("A IA não retornou um objeto JSON válido.");
      }
      
      const cleanedJson = responseText.substring(firstBrace, lastBrace + 1);

      // 3. Parsing e validação via Zod
      const parsedData = JSON.parse(cleanedJson);
      return SynthesisSchema.parse(parsedData);
      
    } catch (error: any) {
      // Se for erro de Zod ou JSON, o log será mais limpo
      throw new Error(`Erro na síntese neural: ${error.message}`);
    }
  }
}
