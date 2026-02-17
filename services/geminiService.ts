import { GoogleGenAI, Type } from "@google/genai";
import { AgentRole, Message, SimulationMode, Language } from "../types";

// Helper to get clean text from response
const getResponseText = (response: any): string => {
  if (response.text) return response.text;
  if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
    return response.candidates[0].content.parts[0].text;
  }
  return "Error generating response.";
};

export const generateAgentResponse = async (
  role: AgentRole,
  systemInstruction: string,
  history: Message[],
  topic: string,
  mode: SimulationMode,
  language: Language,
  maxLength: number
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Format history for the model context
  // We provide the transcript as context so the agent knows what happened
  const contextString = history
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n\n");

  const outputLanguageInstruction = language === 'zh-TW' 
    ? "OUTPUT LANGUAGE: Traditional Chinese (Taiwan usage) / 台灣繁體中文。請使用台灣習慣用語，避免中國大陸用語。" 
    : "OUTPUT LANGUAGE: English";

  // Define length constraints based on language to keep dialogue snappy
  const lengthConstraint = language === 'zh-TW'
    ? `LENGTH CONSTRAINT: 請將回應控制在 ${maxLength} 字以內，保持對話節奏緊湊。`
    : `LENGTH CONSTRAINT: Keep your response concise, ideally under ${maxLength} words.`;

  const prompt = `
    CURRENT CONTEXT (Transcript):
    ${contextString}

    TOPIC: ${topic}
    MODE: ${mode}
    ${outputLanguageInstruction}

    INSTRUCTION:
    Based on the transcript above and your character defined in the system instruction, please provide your next line of dialogue.
    ${lengthConstraint}
    
    CRITICAL: Ensure you complete your sentences and thoughts. Do not stop mid-sentence. End with proper punctuation.
    Do not prefix your response with your name, just speak.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8, // Higher creativity for drama/debate
        maxOutputTokens: 2048, // High limit to prevent cut-offs, prompt controls actual length
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for lower latency
      },
    });

    return getResponseText(response);
  } catch (error) {
    console.error(`Error generating response for ${role}:`, error);
    return `[System Error: ${role} failed to speak. Please try again.]`;
  }
};