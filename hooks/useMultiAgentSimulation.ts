import { useState, useRef, useEffect, useCallback } from "react";
import {
  Message,
  AgentRole,
  SimulationMode,
  SimulationState,
  Language,
} from "../types";
import { AGENT_CONFIG } from "../constants";
import { generateAgentResponse } from "../services/geminiService";
import {
  fetchTTS,
  playAudioData,
  initAudioContext,
  stopCurrentAudio,
} from "../services/ttsService";

export const useMultiAgentSimulation = () => {
  const [state, setState] = useState<SimulationState>({
    isPlaying: false,
    round: 0,
    maxRounds: 6,
    topic: "",
    mode: SimulationMode.DEBATE,
    language: "en",
    messages: [],
    currentSpeaker: null,
    maxResponseLength: 80,
    isIntervening: false,
    isMuted: false,
    agentVoices: {
      [AgentRole.DIRECTOR]: AGENT_CONFIG[AgentRole.DIRECTOR].voiceName,
      [AgentRole.ACTOR_A]: AGENT_CONFIG[AgentRole.ACTOR_A].voiceName,
      [AgentRole.ACTOR_B]: AGENT_CONFIG[AgentRole.ACTOR_B].voiceName,
    },
    customAvatars: {
      [AgentRole.DIRECTOR]: null,
      [AgentRole.ACTOR_A]: null,
      [AgentRole.ACTOR_B]: null,
    },
    avatarSizes: {
      [AgentRole.DIRECTOR]: 64,
      [AgentRole.ACTOR_A]: 64,
      [AgentRole.ACTOR_B]: 64,
    },
    totalTokensUsed: 0,
  });

  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Modified to return the ID so we can update it later
  const addMessage = (
    role: AgentRole,
    content: string,
    audioBase64?: string,
  ): string => {
    const id = crypto.randomUUID();
    const newMessage: Message = {
      id,
      role,
      content,
      timestamp: Date.now(),
      audioBase64,
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
    return id;
  };

  const updateMessageAudio = (id: string, audioBase64: string) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.map((msg) =>
        msg.id === id ? { ...msg, audioBase64 } : msg,
      ),
    }));
  };

  const processTurn = useCallback(async () => {
    const currentState = stateRef.current;

    if (!currentState.isPlaying) return;

    let nextSpeaker: AgentRole | null = null;
    const { messages, round, maxRounds, isIntervening } = currentState;
    let overrideInstruction = "";
    let willIncrementRound = false;

    if (isIntervening) {
      nextSpeaker = AgentRole.DIRECTOR;
      overrideInstruction =
        currentState.language === "zh-TW"
          ? " 【重要指令】用戶要求你介入當前對話。請總結目前的衝突點，或引導演員進入新的討論方向。請保持專業且具引導性。"
          : " [URGENT] The user has requested you to intervene. Briefly summarize the conflict so far or steer the actors in a new direction. Be professional and guiding.";

      setState((prev) => ({ ...prev, isIntervening: false }));
    } else if (messages.length === 0) {
      nextSpeaker = AgentRole.DIRECTOR;
    } else {
      const lastSpeaker = messages[messages.length - 1].role;

      if (round >= maxRounds) {
        if (lastSpeaker !== AgentRole.DIRECTOR) {
          nextSpeaker = AgentRole.DIRECTOR;
        } else {
          setState((prev) => ({
            ...prev,
            isPlaying: false,
            currentSpeaker: null,
          }));
          return;
        }
      } else {
        if (lastSpeaker === AgentRole.DIRECTOR) {
          nextSpeaker = AgentRole.ACTOR_A;
        } else if (lastSpeaker === AgentRole.ACTOR_A) {
          nextSpeaker = AgentRole.ACTOR_B;
        } else if (lastSpeaker === AgentRole.ACTOR_B) {
          nextSpeaker = AgentRole.DIRECTOR;
          willIncrementRound = true;
        }
      }
    }

    if (willIncrementRound) {
      setState((prev) => ({ ...prev, round: prev.round + 1 }));
    }

    if (nextSpeaker) {
      setState((prev) => ({ ...prev, currentSpeaker: nextSpeaker }));

      const config = AGENT_CONFIG[nextSpeaker];
      const effectiveRound = willIncrementRound ? round + 1 : round;
      let systemInstruction = config.systemInstruction(
        currentState.topic,
        currentState.mode,
        currentState.language,
        effectiveRound,
        currentState.maxRounds,
      );

      const isClosing =
        !isIntervening &&
        messages.length > 0 &&
        nextSpeaker === AgentRole.DIRECTOR &&
        effectiveRound >= maxRounds;

      if (isClosing) {
        if (currentState.mode === SimulationMode.THEATER) {
          systemInstruction +=
            currentState.language === "zh-TW"
              ? " 【重要指令】這是故事的最後一環。請擔任旁白，為這段故事畫下完美句點（可以是開放式結局或發人深省的總結），絕對不要再要求角色繼續對話。"
              : " [URGENT] This is the final progression of the story. Provide a concluding narration to end the scene. Do NOT ask the characters to continue.";
        } else if (currentState.mode === SimulationMode.EDUCATION) {
          systemInstruction +=
            currentState.language === "zh-TW"
              ? " 【重要指令】這是這堂課的最後。請為今天的討論提供簡潔的總結，並感謝大家的參與。絕對不要再拋出新問題讓學生回答。"
              : " [URGENT] This is the end of the lesson. Provide a concise summary and thank everyone. Do NOT ask any new questions.";
        } else {
          systemInstruction +=
            currentState.language === "zh-TW"
              ? " 【重要指令】這是這場辯論/會議的最後總結。請提供結語並感謝參與者。絕對不要再讓雙方繼續發言。"
              : " [URGENT] This is the end of the session. Provide a closing summary. Do NOT prompt them to continue.";
        }
      }

      if (overrideInstruction) {
        systemInstruction += " " + overrideInstruction;
      }

      // 1. Generate Text
      const { text: responseText, tokensUsed } = await generateAgentResponse(
        nextSpeaker,
        systemInstruction,
        currentState.messages,
        currentState.topic,
        currentState.mode,
        currentState.language,
        currentState.maxResponseLength,
      );

      // Update token count
      setState((prev) => ({
        ...prev,
        totalTokensUsed: prev.totalTokensUsed + tokensUsed,
      }));

      // 2. IMMEDIATE UI UPDATE: Show text before fetching audio
      // This makes the app feel much faster as users can read while audio loads
      const messageId = addMessage(nextSpeaker, responseText, undefined);

      // Clear current speaker so the thinking indicator goes away while audio fetches and plays
      setState((prev) => ({ ...prev, currentSpeaker: null }));

      // 3. Generate Audio in background without blocking execution
      const selectedVoice = currentState.agentVoices[nextSpeaker];

      fetchTTS(responseText, selectedVoice).then(async (audioData) => {
        if (audioData) {
          updateMessageAudio(messageId, audioData);
        }

        // 4. Play Audio (Blocking if not muted)
        if (
          stateRef.current.isPlaying &&
          !stateRef.current.isMuted &&
          audioData
        ) {
          await playAudioData(audioData);
        }

        // 5. Queue next turn
        const nextTurnDelay = stateRef.current.isMuted ? 2000 : 500;
        setTimeout(() => {
          processTurn();
        }, nextTurnDelay);
      });
    }
  }, []);

  const startSimulation = (
    topic: string,
    mode: SimulationMode,
    maxRounds: number = 6,
    language: Language = "en",
    maxResponseLength: number = 80,
  ) => {
    // Initialize Audio Context on user interaction (Start button)
    initAudioContext();
    stopCurrentAudio(); // Ensure clean start

    setState((prev) => ({
      isPlaying: true,
      round: 0,
      maxRounds,
      topic,
      mode,
      language,
      messages: [],
      currentSpeaker: null,
      maxResponseLength,
      isIntervening: false,
      isMuted: prev.isMuted,
      agentVoices: prev.agentVoices,
      customAvatars: prev.customAvatars,
      avatarSizes: prev.avatarSizes,
      totalTokensUsed: 0,
    }));

    setTimeout(() => {
      processTurn();
    }, 100);
  };

  const stopSimulation = () => {
    stopCurrentAudio();
    setState((prev) => ({ ...prev, isPlaying: false, currentSpeaker: null }));
    stateRef.current = {
      ...stateRef.current,
      isPlaying: false,
      currentSpeaker: null,
    };
  };

  const loadState = (newState: SimulationState) => {
    stopCurrentAudio();
    // Force isPlaying to false to allow user to decide when to resume
    setState({ ...newState, isPlaying: false, currentSpeaker: null });
    stateRef.current = { ...newState, isPlaying: false, currentSpeaker: null };
  };

  const togglePause = () => {
    const currentState = stateRef.current;

    // Immediate action based on current state
    if (currentState.isPlaying) {
      stopCurrentAudio();
    }

    const nextIsPlaying = !currentState.isPlaying;

    // 1. Update React State
    setState((prev) => ({ ...prev, isPlaying: nextIsPlaying }));

    // 2. CRITICAL FIX: Manually update the Ref immediately.
    // waiting for the useEffect to fire (after render) is too slow and causes a race condition
    // where processTurn sees isPlaying=false and stops immediately.
    stateRef.current = { ...currentState, isPlaying: nextIsPlaying };

    if (nextIsPlaying) {
      initAudioContext();
      // Use a small timeout to let the UI update the button state,
      // but the Ref is already ready for logic.
      setTimeout(() => {
        processTurn();
      }, 50);
    }
  };

  const toggleMute = () => {
    // Immediate action based on current state
    if (!state.isMuted) {
      stopCurrentAudio();
    }

    const nextIsMuted = !state.isMuted;
    setState((prev) => ({ ...prev, isMuted: nextIsMuted }));
    stateRef.current = { ...stateRef.current, isMuted: nextIsMuted };
  };

  const triggerIntervention = () => {
    setState((prev) => ({ ...prev, isIntervening: true }));
    stateRef.current = { ...stateRef.current, isIntervening: true };
  };

  const resetSimulation = () => {
    stopCurrentAudio();
    setState((prev) => {
      const nextState = {
        ...prev,
        isPlaying: false,
        round: 0,
        messages: [],
        currentSpeaker: null,
        isIntervening: false,
        totalTokensUsed: 0,
      };
      stateRef.current = nextState;
      return nextState;
    });
  };

  const setAgentVoice = (role: AgentRole, voice: string) => {
    setState((prev) => ({
      ...prev,
      agentVoices: {
        ...prev.agentVoices,
        [role]: voice,
      },
    }));
  };

  const setCustomAvatar = (role: AgentRole, avatar: string | null) => {
    setState((prev) => ({
      ...prev,
      customAvatars: {
        ...prev.customAvatars,
        [role]: avatar,
      },
    }));
  };

  const setAvatarSize = (role: AgentRole, size: number) => {
    setState((prev) => ({
      ...prev,
      avatarSizes: {
        ...prev.avatarSizes,
        [role]: size,
      },
    }));
  };

  return {
    state,
    startSimulation,
    stopSimulation,
    resetSimulation,
    togglePause,
    triggerIntervention,
    toggleMute,
    setAgentVoice,
    setCustomAvatar,
    setAvatarSize,
    loadState,
  };
};
