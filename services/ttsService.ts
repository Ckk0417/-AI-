import { GoogleGenAI, Modality } from "@google/genai";

let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

// Initialize Audio Context (must be called after user interaction)
export const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000, // Matches Gemini TTS output
    });
  } else if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
};

// Stop the currently playing audio immediately
export const stopCurrentAudio = () => {
  if (currentSource) {
    try {
      currentSource.stop();
    } catch (e) {
      // Ignore errors if already stopped or invalid
    }
    currentSource = null;
  }
};

// Base64 decoding helper from documentation
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Audio decoding helper from documentation
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Fetch TTS Audio Data (Base64)
export const fetchTTS = async (text: string, voiceName: string): Promise<string | undefined> => {
  if (!text.trim()) return undefined;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Generation Error:", error);
    return undefined;
  }
};

// Play existing Base64 Audio Data
export const playAudioData = async (base64Audio: string): Promise<void> => {
  const ctx = initAudioContext();
  if (!ctx) return;

  // Stop any currently playing audio before starting new one
  stopCurrentAudio();

  try {
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      ctx,
      24000,
      1,
    );

    return new Promise((resolve) => {
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      currentSource = source;
      
      source.onended = () => {
        if (currentSource === source) {
            currentSource = null;
        }
        resolve();
      };
      
      source.start();
    });
  } catch (error) {
    console.error("Audio Playback Error:", error);
    return Promise.resolve();
  }
};

// Deprecated: Wrapper for backward compatibility if needed, but we will update hooks to use split functions
export const playTextToSpeech = async (text: string, voiceName: string): Promise<void> => {
    const data = await fetchTTS(text, voiceName);
    if (data) {
        await playAudioData(data);
    }
};