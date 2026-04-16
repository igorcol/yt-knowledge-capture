import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config.js";
import { SynthesisSchema, type ISynthesis } from "../types/schema.js";

/*
    Recebe a transcrição do video e gera um resumo tático com a persona dada.
*/

export class SynthesisService {
  private static genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  private static model = this.genAI.getGenerativeModel({
    model: "gemini-3-flash",
    // Configura o modelo para sempre responder em JSON
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  // -- PROMPT DE PERSONA --
  // TODO: Pegar de outro arquivo
  private static readonly SYSTEM_PROMPT = `
    Você é o Sintetizador Neural do ecossistema C.A.O.S.
    Sua missão é aplicar o Princípio de Pareto (80/20) em transcrições de vídeos.
    
    Diretrizes:
    1. Extraia os 20% de informação que geram 80% do valor.
    2. Ignore introduções, anúncios e ruídos oratórios.
    3. Foque na arquitetura do pensamento e ações práticas.
    4. Responda estritamente no formato JSON seguindo o schema fornecido.
  `;

  static async synthesize(transcriptText: string): Promise<ISynthesis> {
    try {
      console.log(
        `[SynthesisService] Iniciando compressão cognitiva via Gemini...`,
      );

      const prompt = `
            Analise a seguinte transcrição e extraia o conhecimento core:

            Transcrição:
            "${transcriptText}"

            Returno um JSON que siga EXATAMENTE este formato:
            {
                "title": "Título impactante",
                "summary": "A grande ideia em uma frase",
                "pillars": [{ "concept": "Conceito", "explanation": "Explicação" }],
                "actionItems": ["Ação 1", "Ação 2"]
            }
        `;

      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: this.SYSTEM_PROMPT,
      });

      const responseText = result.response.text();

      // Validação com zod
      const parsedData = SynthesisSchema.parse(JSON.parse(responseText));

      console.log(`[SynthesisService] Síntese concluída com sucesso.`);
      return parsedData;
    } catch (error) {
      console.error(`[SynthesisService] Erro na síntese:`, error);
      throw new Error("Falha ao sintetizar o conhecimento via Gemini.");
    }
  }
}
