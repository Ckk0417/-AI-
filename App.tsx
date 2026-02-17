import React, { useState, useRef, useEffect } from "react";
import { useMultiAgentSimulation } from "./hooks/useMultiAgentSimulation";
import { SimulationMode, AgentRole, Language } from "./types";
import { ChatBubble } from "./components/ChatBubble";
import { AGENT_CONFIG, TRANSLATIONS, RANDOM_TOPICS, AVAILABLE_VOICES } from "./constants";

const MAX_TOPIC_LENGTH = 100;

const App: React.FC = () => {
  const { 
    state, 
    startSimulation, 
    stopSimulation, 
    resetSimulation, 
    togglePause, 
    triggerIntervention, 
    toggleMute,
    setAgentVoice,
    loadState
  } = useMultiAgentSimulation();
  
  const [inputTopic, setInputTopic] = useState("");
  const [numRounds, setNumRounds] = useState(6);
  const [selectedMode, setSelectedMode] = useState<SimulationMode>(SimulationMode.DEBATE);
  const [language, setLanguage] = useState<Language>('en'); 
  // Use string | number to allow empty input while typing
  const [maxLen, setMaxLen] = useState<number | string>(80);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language]; 

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.messages, state.currentSpeaker]);

  // Update default max length when language changes
  useEffect(() => {
    if (language === 'zh-TW') {
        setMaxLen(150);
    } else {
        setMaxLen(80);
    }
  }, [language]);

  const handleStart = () => {
    if (!inputTopic.trim()) return;
    // Ensure maxLen is a valid number before starting
    const finalLen = Number(maxLen) || (language === 'zh-TW' ? 150 : 80);
    startSimulation(inputTopic, selectedMode, numRounds || 6, language, finalLen);
  };

  const toggleLanguage = () => {
      setLanguage(prev => prev === 'en' ? 'zh-TW' : 'en');
  };

  const handleRandomTopic = () => {
      const topics = RANDOM_TOPICS[language][selectedMode];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      setInputTopic(randomTopic);
  };

  const handleMaxLenBlur = () => {
    let val = Number(maxLen);
    if (!val || val < 10) val = 10;
    if (val > 1000) val = 1000;
    setMaxLen(val);
  };

  const handleSaveSession = () => {
      try {
          // Deep clone state to avoid mutating original
          const stateToSave = JSON.parse(JSON.stringify(state));
          
          // Strip audio data to save space in localStorage (5MB limit)
          stateToSave.messages.forEach((msg: any) => {
              delete msg.audioBase64;
          });
          
          const sessionData = {
              simulationState: stateToSave,
              uiState: {
                  inputTopic: state.topic || inputTopic,
                  numRounds: state.maxRounds || numRounds,
                  selectedMode: state.mode || selectedMode,
                  language: state.language || language,
                  maxLen: state.maxResponseLength || maxLen
              }
          };
          
          localStorage.setItem('gemini_agent_session', JSON.stringify(sessionData));
          alert(t.sessionSaved);
      } catch (e) {
          console.error("Save failed", e);
          alert("Failed to save session (possibly too large).");
      }
  };

  const handleLoadSession = () => {
      try {
          const saved = localStorage.getItem('gemini_agent_session');
          if (!saved) {
              alert(t.noSavedSession);
              return;
          }
          
          const data = JSON.parse(saved);
          
          if (data.uiState) {
              setInputTopic(data.uiState.inputTopic || "");
              setNumRounds(data.uiState.numRounds || 6);
              setSelectedMode(data.uiState.selectedMode || SimulationMode.DEBATE);
              setLanguage(data.uiState.language || 'en');
              setMaxLen(data.uiState.maxLen || 80);
          }
          
          if (data.simulationState) {
              loadState(data.simulationState);
          }
      } catch (e) {
          console.error("Load failed", e);
          alert(t.loadError);
      }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 text-slate-900 font-sans selection:bg-violet-200 selection:text-violet-900">
      {/* Header */}
      <header className="w-full max-w-5xl p-6 border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-10 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl shadow-lg shadow-violet-500/20 text-white">
            🤖
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">
              {t.appTitle}
            </h1>
            <p className="text-sm text-slate-500 font-medium">{t.poweredBy}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap justify-end">
            {/* Save / Load */}
            <div className="flex gap-2">
                <button 
                    onClick={handleSaveSession}
                    className="px-3 py-2 text-sm md:text-base rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition-colors text-slate-700 font-medium shadow-sm"
                    title={t.saveSession}
                >
                    💾 {t.saveSession}
                </button>
                <button 
                    onClick={handleLoadSession}
                    className="px-3 py-2 text-sm md:text-base rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition-colors text-slate-700 font-medium shadow-sm"
                    title={t.loadSession}
                >
                    📂 {t.loadSession}
                </button>
            </div>

            <div className="h-8 w-px bg-slate-300 mx-1 hidden md:block"></div>

            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              className="p-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              title={state.isMuted ? t.unmute : t.mute}
            >
               <span className="text-xl">{state.isMuted ? "🔇" : "🔊"}</span>
            </button>

            {/* Language Toggle */}
            <button 
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-base font-bold text-slate-700 transition-colors shadow-sm"
            >
                {language === 'en' ? '中文' : 'English'}
            </button>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
                <div className={`w-3 h-3 rounded-full ${state.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                <span className="text-sm font-bold text-slate-600">
                    {state.isPlaying ? t.sessionActive : (state.messages.length > 0 ? t.pause : t.ready)}
                </span>
            </div>
        </div>
      </header>

      {/* Main Stage */}
      <main className="flex-1 w-full max-w-5xl p-4 md:p-8 flex flex-col gap-8">
        
        {/* Controls (Only visible when not playing or empty) */}
        {!state.isPlaying && state.messages.length === 0 && (
          <div className="w-full bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-xl animate-fade-in space-y-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800">{t.setStage}</h2>
            
            {/* Mode Selection */}
            <div>
              <label className="block text-lg font-bold text-slate-700 mb-4">{t.selectFormat}</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => setSelectedMode(SimulationMode.DEBATE)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                    selectedMode === SimulationMode.DEBATE
                      ? "border-violet-500 bg-violet-50 text-violet-900 shadow-md"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-400 hover:bg-white"
                  }`}
                >
                  <span className="text-4xl">⚖️</span>
                  <span className="text-xl font-bold">{t.debate}</span>
                  <span className="text-sm opacity-80">{t.debateDesc}</span>
                </button>
                <button
                  onClick={() => setSelectedMode(SimulationMode.THEATER)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                    selectedMode === SimulationMode.THEATER
                      ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-900 shadow-md"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-400 hover:bg-white"
                  }`}
                >
                  <span className="text-4xl">🎭</span>
                  <span className="text-xl font-bold">{t.theater}</span>
                  <span className="text-sm opacity-80">{t.theaterDesc}</span>
                </button>
                <button
                  onClick={() => setSelectedMode(SimulationMode.EDUCATION)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                    selectedMode === SimulationMode.EDUCATION
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-400 hover:bg-white"
                  }`}
                >
                  <span className="text-4xl">🎓</span>
                  <span className="text-xl font-bold">{t.education}</span>
                  <span className="text-sm opacity-80">{t.educationDesc}</span>
                </button>
              </div>
            </div>

            {/* Voice Cast Settings */}
            <div>
               <label className="block text-lg font-bold text-slate-700 mb-4">{t.voiceCast}</label>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[AgentRole.DIRECTOR, AgentRole.ACTOR_A, AgentRole.ACTOR_B].map(role => {
                    const currentVoice = state.agentVoices[role];
                    const config = AGENT_CONFIG[role];
                    const roleColor = role === AgentRole.DIRECTOR ? 'text-violet-600' : role === AgentRole.ACTOR_A ? 'text-cyan-600' : 'text-rose-600';
                    return (
                      <div key={role} className="flex flex-col gap-2">
                        <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${roleColor}`}>
                           <span className="text-xl">{config.avatar}</span>
                           <span>{config.names(selectedMode, language)}</span>
                        </div>
                        <select
                          value={currentVoice}
                          onChange={(e) => setAgentVoice(role, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
                        >
                          {AVAILABLE_VOICES.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* Inputs: Topic, Rounds, Length */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow">
                <label className="block text-lg font-bold text-slate-700 mb-3 flex items-center justify-between">
                    {t.topicLabel}
                    <button 
                      onClick={handleRandomTopic}
                      className="text-violet-600 hover:text-violet-800 text-sm font-bold flex items-center gap-1 transition-colors bg-violet-50 px-3 py-1 rounded-lg hover:bg-violet-100"
                    >
                       <span>🎲</span> {t.randomTopic}
                    </button>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={MAX_TOPIC_LENGTH}
                    value={inputTopic}
                    onChange={(e) => setInputTopic(e.target.value)}
                    placeholder={
                      selectedMode === SimulationMode.DEBATE
                        ? t.topicPlaceholderDebate
                        : selectedMode === SimulationMode.THEATER
                        ? t.topicPlaceholderTheater
                        : t.topicPlaceholderEducation
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl p-5 pr-16 text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all placeholder-slate-400 shadow-inner"
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  />
                  <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-mono font-bold ${
                      inputTopic.length >= MAX_TOPIC_LENGTH ? 'text-red-500' : 'text-slate-400'
                  }`}>
                    {inputTopic.length}/{MAX_TOPIC_LENGTH}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                  <div className="w-28">
                     <label className="block text-lg font-bold text-slate-700 mb-3">{t.roundsLabel}</label>
                     <input
                        type="number"
                        min={1}
                        max={20}
                        value={numRounds}
                        onChange={(e) => setNumRounds(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-xl p-5 text-center text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all shadow-inner"
                     />
                  </div>

                   <div className="w-36">
                     <label className="block text-lg font-bold text-slate-700 mb-3">{t.maxLengthLabel}</label>
                     <div className="relative">
                         <input
                            type="number"
                            min={10}
                            max={500}
                            step={10}
                            value={maxLen}
                            onChange={(e) => setMaxLen(e.target.value)}
                            onBlur={handleMaxLenBlur}
                            className="w-full bg-white border border-slate-300 rounded-xl p-5 text-center text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all shadow-inner"
                         />
                         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none font-medium">
                             {t.wordUnit}
                         </span>
                     </div>
                  </div>
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={!inputTopic.trim()}
              className="w-full py-5 rounded-2xl font-bold text-2xl text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-violet-500/30 flex items-center justify-center gap-3 transform hover:-translate-y-1 active:translate-y-0"
            >
              <span>🎬</span>
              <span>{t.action}</span>
            </button>
          </div>
        )}

        {/* Script Display */}
        {(state.messages.length > 0 || state.isPlaying) && (
           <div className="flex-1 min-h-[500px] flex flex-col relative">
              <div className="flex-1 space-y-4 pb-32">
                  {state.messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} language={state.language} mode={state.mode} />
                  ))}
                  
                  {/* Loading / Typing Indicator */}
                  {state.isPlaying && state.currentSpeaker && (
                     <div className="flex w-full justify-center animate-pulse py-4">
                        <div className={`px-6 py-3 rounded-full text-base font-bold border-2 shadow-sm ${
                            state.currentSpeaker === AgentRole.DIRECTOR ? 'border-violet-200 text-violet-700 bg-violet-50' :
                            state.currentSpeaker === AgentRole.ACTOR_A ? 'border-cyan-200 text-cyan-700 bg-cyan-50' :
                            'border-rose-200 text-rose-700 bg-rose-50'
                        }`}>
                           {AGENT_CONFIG[state.currentSpeaker].avatar} {AGENT_CONFIG[state.currentSpeaker].names(state.mode, state.language)} {t.thinking}
                        </div>
                     </div>
                  )}
                  <div ref={scrollRef} />
              </div>

              {/* Floating Action Bar */}
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/95 backdrop-blur-md border border-slate-200 p-3 pl-4 pr-3 rounded-2xl shadow-2xl z-50 ring-1 ring-black/5">
                 
                 {/* Intervene Button */}
                 <button
                   onClick={() => triggerIntervention()}
                   disabled={!state.isPlaying || state.isIntervening}
                   title={t.interveneTooltip}
                   className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${
                     state.isIntervening 
                      ? "bg-violet-600 text-white animate-pulse shadow-lg" 
                      : "bg-slate-100 hover:bg-violet-50 text-slate-500 hover:text-violet-600 border border-slate-200 hover:border-violet-300"
                   } disabled:opacity-30 disabled:cursor-not-allowed`}
                 >
                   <span className="text-2xl">📢</span>
                 </button>

                 <div className="h-10 w-px bg-slate-300 mx-1"></div>

                 {/* Pause / Resume */}
                 <button 
                    onClick={togglePause}
                    className={`flex items-center gap-3 px-8 h-14 rounded-xl font-bold text-lg transition-all shadow-sm ${
                       state.isPlaying 
                         ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 hover:border-amber-400" 
                         : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 hover:border-emerald-400"
                    }`}
                 >
                    <span className="text-2xl">{state.isPlaying ? "⏸" : "▶️"}</span>
                    <span>{state.isPlaying ? t.pause : t.resume}</span>
                 </button>

                 {/* Reset / New Scene */}
                 {!state.isPlaying && (
                     <button 
                        onClick={resetSimulation}
                        className="flex items-center gap-3 px-6 h-14 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 rounded-xl transition-colors font-bold text-lg shadow-sm"
                    >
                        <span>🔄</span>
                        <span className="hidden sm:inline">{t.newScene}</span>
                    </button>
                 )}
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;