import React, { useState } from "react";
import { Message, AgentRole, Language, SimulationMode } from "../types";
import { AGENT_CONFIG } from "../constants";
import { playAudioData } from "../services/ttsService";

interface ChatBubbleProps {
  message: Message;
  language: Language;
  mode?: SimulationMode; 
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, language, mode = SimulationMode.DEBATE }) => {
  const config = AGENT_CONFIG[message.role];
  const isDirector = message.role === AgentRole.DIRECTOR;
  
  // Resolve the name function
  const displayName = config.names(mode, language);
  
  const [isPlaying, setIsPlaying] = useState(false);

  const handleReplay = async () => {
    if (!message.audioBase64 || isPlaying) return;
    setIsPlaying(true);
    await playAudioData(message.audioBase64);
    setIsPlaying(false);
  };

  return (
    <div
      className={`flex w-full mb-8 animate-fade-in ${
        isDirector ? "justify-center" : message.role === AgentRole.ACTOR_A ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`flex max-w-[85%] md:max-w-[75%] flex-col ${
          message.role === AgentRole.ACTOR_B ? "items-end" : "items-start"
        }`}
      >
        <div className="flex items-center gap-3 mb-2 px-1">
          <span className="text-3xl filter drop-shadow-sm">{config.avatar}</span>
          <span className={`text-sm md:text-base font-bold uppercase tracking-wider ${
             isDirector ? "text-violet-700" : message.role === AgentRole.ACTOR_A ? "text-cyan-700" : "text-rose-700"
          }`}>
            {displayName}
          </span>
          {message.audioBase64 && (
            <button
              onClick={handleReplay}
              disabled={isPlaying}
              className={`ml-1 p-1.5 rounded-full hover:bg-slate-200 transition-colors ${
                 isPlaying ? "text-green-600 animate-pulse" : "text-slate-400 hover:text-slate-700"
              }`}
              title="Replay Audio"
            >
               {isPlaying ? (
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
               )}
            </button>
          )}
        </div>
        
        <div
          className={`relative p-6 rounded-3xl shadow-sm border ${
            isDirector
              ? "bg-violet-50 border-violet-200 text-center text-violet-900"
              : message.role === AgentRole.ACTOR_A
              ? "bg-cyan-50 border-cyan-200 text-cyan-950 rounded-tl-none"
              : "bg-rose-50 border-rose-200 text-rose-950 rounded-tr-none"
          }`}
        >
          <p className="whitespace-pre-wrap leading-relaxed text-lg md:text-xl font-medium">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
};