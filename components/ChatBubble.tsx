import React, { useState } from "react";
import { Message, AgentRole, Language, SimulationMode } from "../types";
import { AGENT_CONFIG } from "../constants";
import { playAudioData } from "../services/ttsService";

interface ChatBubbleProps {
  message: Message;
  language: Language;
  mode?: SimulationMode; 
  customAvatar?: string | null;
  avatarSize?: number;
}

export const ChatBubble: React.FC<ChatBubbleProps> = React.memo(({ message, language, mode = SimulationMode.DEBATE, customAvatar, avatarSize = 64 }) => {
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
      className={`flex w-full mb-6 md:mb-10 animate-fade-in gap-2 md:gap-4 ${
        isDirector ? "flex-col items-center text-center" : 
        message.role === AgentRole.ACTOR_B ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar Section */}
      <div className="shrink-0 mt-1">
        <div 
          className="rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden border border-slate-200"
          style={{ 
            width: window.innerWidth < 768 ? Math.min(avatarSize, 48) : avatarSize, 
            height: window.innerWidth < 768 ? Math.min(avatarSize, 48) : avatarSize 
          }}
        >
          {customAvatar ? (
            <img 
              src={customAvatar} 
              alt="Avatar" 
              className="w-full h-full object-cover block" 
              referrerPolicy="no-referrer"
              key={customAvatar}
            />
          ) : (
            <span style={{ fontSize: (window.innerWidth < 768 ? Math.min(avatarSize, 48) : avatarSize) * 0.5 }} className="filter drop-shadow-sm">{config.avatar}</span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div
        className={`flex flex-col ${
          isDirector ? "max-w-[95%] md:max-w-[90%] items-center" : 
          message.role === AgentRole.ACTOR_B ? "max-w-[85%] md:max-w-[70%] items-end" : 
          "max-w-[85%] md:max-w-[70%] items-start"
        }`}
      >
        <div className={`flex items-center gap-1.5 md:gap-2 mb-1 px-1 ${
          message.role === AgentRole.ACTOR_B ? "flex-row-reverse" : "flex-row"
        }`}>
          <span className={`text-xs md:text-base font-bold uppercase tracking-wider ${
             isDirector ? "text-violet-700" : message.role === AgentRole.ACTOR_A ? "text-cyan-700" : "text-rose-700"
          }`}>
            {displayName}
          </span>
          {message.audioBase64 && (
            <button
              onClick={handleReplay}
              disabled={isPlaying}
              className={`p-1.5 rounded-full hover:bg-slate-200 transition-colors ${
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
          className={`relative p-4 md:p-8 lg:p-10 rounded-2xl md:rounded-[2rem] shadow-sm border ${
            isDirector
              ? "bg-violet-50 border-violet-200 text-violet-900"
              : message.role === AgentRole.ACTOR_A
              ? "bg-cyan-50 border-cyan-200 text-cyan-950 rounded-tl-none"
              : "bg-rose-50 border-rose-200 text-rose-950 rounded-tr-none"
          }`}
        >
          <p className="whitespace-pre-wrap leading-relaxed text-base md:text-xl lg:text-2xl font-medium">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
});
