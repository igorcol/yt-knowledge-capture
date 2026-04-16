
export interface TranscriptResult {
  text: string;
  language: string;
  duration: number; // em segundos
}

export interface SynthesisOutput {
  title: string;
  summary: string; 
  pillars: KnowledgePillar[];
  actionItems: string[];
  metadata: {
    sourceUrl: string;
    processedAt: string;
  };
}

export interface KnowledgePillar {
  concept: string;
  explanation: string;
}