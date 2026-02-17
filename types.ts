
export type Language = 'en' | 'zh-TW';

export enum AgentRole {
  DIRECTOR = 'Director',
  ACTOR_A = 'Actor A',
  ACTOR_B = 'Actor B',
}

export enum SimulationMode {
  DEBATE = 'DEBATE',
  THEATER = 'THEATER',
  EDUCATION = 'EDUCATION',
}

export interface Message {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: number;
  audioBase64?: string;
}

export interface SimulationState {
  isPlaying: boolean;
  round: number;
  maxRounds: number;
  topic: string;
  mode: SimulationMode;
  language: Language;
  messages: Message[];
  currentSpeaker: AgentRole | null;
  maxResponseLength: number;
  isIntervening: boolean;
  isMuted: boolean;
  agentVoices: Record<AgentRole, string>;
}

export type AgentConfig = {
  [key in AgentRole]: {
    // Names is now a function to allow dynamic naming based on mode (e.g., "Teacher" vs "Debater")
    names: (mode: SimulationMode, lang: Language) => string;
    systemInstruction: (topic: string, mode: SimulationMode, lang: Language) => string;
    color: string;
    avatar: string;
    voiceName: string; // Default voice
  };
};