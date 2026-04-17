// src/services/SynthesisService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config.js";
import { SynthesisSchema, type ISynthesis } from "../types/schema.js";
import { PERSONA_PROMPT } from "../../PROMPTS.js";

/*
    C.A.O.S. Synthesis Service - Protocolo de Destilação Neural
*/

export class SynthesisService {
  private static genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

  // A Persona é o coração do sistema (Mentalidade Stark)
  private static readonly SYSTEM_PROMPT = PERSONA_PROMPT;

  // Inicialização Robusta v1beta
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
    { apiVersion: env.GEMINI_API_VERSION as any },
  );

  static async synthesize(transcriptText: string): Promise<ISynthesis> {
    try {
      console.log(
        `[SynthesisService] Iniciando compressão cognitiva via ${env.GEMINI_MODEL}...`,
      );

      // Prompt Reforçado: Forçamos a IA a entender que o Markdown mora dentro do JSON
      const prompt = `
  EXECUTE O PROTOCOLO DE DESTILAÇÃO 80/20.
  
  REGRAS DE FORMATO (ESTRITAMENTE OBRIGATÓRIO):
  1. Retorne um OBJETO JSON ÚNICO.
  2. O campo "content" deve conter TODO o corpo da nota formatado em Markdown rico. Não coloque um título <h1> (#) no topo do content, pois o sistema já fará isso.
  3. O campo "tags" deve ser um array de strings.
  4. O campo "summary" deve ser a Grande Ideia em uma frase.

  TRANSCRIÇÃO PARA PROCESSAR:
  "${transcriptText}"

  ESTRUTURA DO JSON ESPERADA:
  {
    "summary": "Frase de alto impacto",
    "tags": ["tag1", "tag2"],
    "content": "Corpo completo em Markdown aqui..."
  }
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // --- BLINDAGEM C.A.O.S. ---

      // 1. Extração via Regex (Captura o maior bloco de chaves possível)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        console.error("--- DEBUG: FALHA NO PARSE ---");
        console.log(responseText);
        throw new Error("A IA não retornou um objeto JSON válido.");
      }

      let parsedData = JSON.parse(jsonMatch[0]);

      // 2. Desembrulho de Array (Caso o Gemini insista em usar [ ])
      if (Array.isArray(parsedData)) {
        parsedData = parsedData[0];
      }

      // 3. Validação final via Zod
      return SynthesisSchema.parse(parsedData);
    } catch (error: any) {
      // Log limpo para o usuário, mas detalhado para o erro
      throw new Error(`Erro na síntese neural: ${error.message}`);
    }
  }
}
