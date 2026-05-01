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
): Promise<{ text: string; tokensUsed: number }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Format history for the model context
  // We provide the transcript as context so the agent knows what happened
  const contextString = history
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n\n");

  const outputLanguageInstruction = language === 'zh-TW' 
    ? "OUTPUT LANGUAGE: Traditional Chinese (Taiwan usage) / 台灣繁體中文。請使用台灣習慣用語，避免中國大陸用語。請使用淺顯易懂的現代常用詞彙，避免使用文言文、過度艱澀的成語或生僻字，讓一般大眾都能輕鬆理解。" 
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
    CRITICAL FOR TTS: DO NOT output any stage directions, actions, sound effects, or descriptions like *sighs*, (laughs), （嘆氣） etc. within your response. Output ONLY the pure spoken words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8, // Higher creativity for drama/debate
        maxOutputTokens: 2048, // High limit to prevent cut-offs, prompt controls actual length
      },
    });

    const tokensUsed = response.usageMetadata?.totalTokenCount || 0;
    return { text: getResponseText(response), tokensUsed };
  } catch (error) {
    console.error(`Error generating response for ${role}:`, error);
    return { text: `[System Error: ${role} failed to speak. Please try again.]`, tokensUsed: 0 };
  }
};