export interface Symptom {
  name: string;
  unlocked: boolean;
  description: string;
}

export interface Persona {
  id: string;
  name: string;
  age: number;
  demographics: string;
  diagnosis: string;
  familyHistory: string;
  difficulty: 'Mild' | 'Acute' | 'Crisis';
  difficultyLevel: number;
  initialPrompt: string;
  symptoms: Symptom[];
  imageUrl?: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Scores {
  oars: number;
  activeListening: number;
  cbtTechniques: number;
  deEscalation: number;
}

export interface EvalResponse {
  scores: Scores;
  feedback: string;
  unlockedSymptoms: string[];
}
