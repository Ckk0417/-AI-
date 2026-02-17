import { AgentRole, SimulationMode, AgentConfig, Language } from "./types";

export const AVAILABLE_VOICES = [
  { id: "Puck", label: "Puck (Male, Soft)" },
  { id: "Charon", label: "Charon (Male, Deep)" },
  { id: "Kore", label: "Kore (Female, Calm)" },
  { id: "Fenrir", label: "Fenrir (Male, Rough)" },
  { id: "Aoede", label: "Aoede (Female, Expressive)" },
];

export const TRANSLATIONS = {
  en: {
    appTitle: "Gemini Ensemble: AI Interactive Studio",
    poweredBy: "Powered by Google Gemini Models",
    sessionActive: "Session Active",
    ready: "Ready",
    setStage: "Set the Stage",
    selectFormat: "Select Format",
    debate: "Debate",
    debateDesc: "Pro vs. Con logic battle",
    theater: "Theater",
    theaterDesc: "Protagonist vs. Antagonist drama",
    education: "Education",
    educationDesc: "Teacher & Student lesson",
    topicLabel: "Topic or Scenario",
    roundsLabel: "Rounds",
    maxLengthLabel: "Max Length",
    wordUnit: "words",
    action: "Action!",
    stopScene: "Stop Scene",
    newScene: "New Scene",
    thinking: "is thinking...",
    topicPlaceholderDebate: "e.g., Is AI art real art?",
    topicPlaceholderTheater: "e.g., A detective interrogating a time traveler",
    topicPlaceholderEducation: "e.g., How does Quantum Physics work?",
    director: "Director",
    actorA: "Agent Alpha",
    actorB: "Agent Beta",
    randomTopic: "Random Topic",
    intervene: "Intervene",
    pause: "Pause",
    resume: "Resume",
    interveneTooltip: "Director will speak next to guide conversation",
    mute: "Mute",
    unmute: "Unmute",
    voiceCast: "Voice Cast",
    saveSession: "Save Session",
    loadSession: "Load Session",
    sessionSaved: "Session Saved!",
    noSavedSession: "No saved session found.",
    loadError: "Failed to load session.",
  },
  'zh-TW': {
    appTitle: "Gemini 智匯舞台：多重 AI 互動實驗室",
    poweredBy: "由 Google Gemini 模型驅動",
    sessionActive: "對話進行中",
    ready: "準備就緒",
    setStage: "設定舞台",
    selectFormat: "選擇模式",
    debate: "辯論模式",
    debateDesc: "正反方邏輯對決",
    theater: "劇場模式",
    theaterDesc: "主角與反派的戲劇衝突",
    education: "教育模式",
    educationDesc: "師生互動教學演示",
    topicLabel: "主題或場景",
    roundsLabel: "回合數",
    maxLengthLabel: "回應字數",
    wordUnit: "字",
    action: "開拍！",
    stopScene: "停止場景",
    newScene: "新場景",
    thinking: "正在思考...",
    topicPlaceholderDebate: "例如：AI 藝術是真正的藝術嗎？",
    topicPlaceholderTheater: "例如：偵探審訊時空旅人",
    topicPlaceholderEducation: "例如：量子力學是如何運作的？",
    director: "導演 AI",
    actorA: "演員甲 (Alpha)",
    actorB: "演員乙 (Beta)",
    randomTopic: "隨機主題",
    intervene: "導演介入",
    pause: "暫停",
    resume: "繼續",
    interveneTooltip: "導演將在下一回合發言以引導對話",
    mute: "靜音",
    unmute: "開啟聲音",
    voiceCast: "語音選角",
    saveSession: "儲存工作階段",
    loadSession: "載入工作階段",
    sessionSaved: "工作階段已儲存！",
    noSavedSession: "找不到已儲存的工作階段。",
    loadError: "載入工作階段失敗。",
  }
};

export const RANDOM_TOPICS = {
  en: {
    [SimulationMode.DEBATE]: [
      "Is universal basic income necessary?",
      "Should social media be banned for under 16s?",
      "Is space exploration a waste of money?",
      "Cats vs Dogs: Which is the superior pet?",
      "Should homework be abolished?",
      "Is AI dangerous to humanity?",
      "Pineapple on pizza: Genius or Crime?",
      "Should electric cars be mandatory?",
      "Is remote work better than office work?",
    ],
    [SimulationMode.THEATER]: [
      "A time traveler meets their younger self.",
      "Two astronauts discover they are not alone.",
      "A barista and a customer fall in love in 3 minutes.",
      "A detective interrogating a ghost.",
      "A robot trying to convince a human it has a soul.",
      "The villain trying to justify their plan to the hero.",
      "An awkward elevator ride between ex-lovers.",
      "A job interview where the applicant is an alien.",
    ],
    [SimulationMode.EDUCATION]: [
      "Explain the Theory of Relativity to a 10-year-old.",
      "How does the Internet actually work?",
      "The causes and effects of the French Revolution.",
      "What is photosynthesis?",
      "Why do we dream?",
      "Introduction to Stoicism philosophy.",
      "How does the stock market work?",
      "The difference between bacteria and viruses.",
    ]
  },
  'zh-TW': {
    [SimulationMode.DEBATE]: [
      "全民基本收入是否必要？",
      "是否應該禁止 16 歲以下使用社群媒體？",
      "太空探索是否浪費金錢？",
      "貓與狗：誰是更好的寵物？",
      "學生是否應該廢除回家作業？",
      "人工智慧對人類是否有危險？",
      "披薩加鳳梨：美食還是犯罪？",
      "電動車是否應該強制普及？",
      "遠端工作是否優於辦公室工作？",
    ],
    [SimulationMode.THEATER]: [
      "時空旅人遇見了年輕的自己。",
      "兩位太空人發現他們並不孤單。",
      "咖啡師與顧客在三分鐘內墜入愛河。",
      "偵探審訊一個幽靈。",
      "機器人試圖說服人類它擁有靈魂。",
      "反派試圖向英雄證明自己的計畫是正確的。",
      "前任情人在電梯裡的尷尬時刻。",
      "一位外星人來應徵工作的面試現場。",
    ],
    [SimulationMode.EDUCATION]: [
      "向小學生解釋相對論。",
      "網際網路到底是怎麼運作的？",
      "法國大革命的起因與影響。",
      "什麼是光合作用？",
      "人為什麼會做夢？",
      "斯多葛學派哲學簡介。",
      "股票市場是如何運作的？",
      "細菌與病毒的區別是什麼？",
    ]
  }
};

export const AGENT_CONFIG: AgentConfig = {
  [AgentRole.DIRECTOR]: {
    names: (mode, lang) => {
        if (mode === SimulationMode.EDUCATION) return lang === 'zh-TW' ? "校長/主持人" : "Principal";
        return lang === 'zh-TW' ? "導演 AI" : "Director AI";
    },
    color: "bg-director",
    avatar: "🎓",
    voiceName: "Charon", // Deep, authoritative male voice
    systemInstruction: (topic, mode, lang) => {
      if (lang === 'zh-TW') {
        const roleDesc = mode === SimulationMode.EDUCATION 
            ? "你是這堂課的校長或主持人。" 
            : "你是本場會議的導演與主持人。";
            
        return `${roleDesc}
        主題："${topic}"。
        模式："${mode}"。
        
        你的目標與職責：
        1. **開場 (Start)**：${mode === SimulationMode.EDUCATION ? "介紹今天的課程主題，並介紹老師出場。" : "請用引人入勝的方式破題，為演員設定好舞台背景。"}
        2. **中場引導 (Middle)**：${mode === SimulationMode.EDUCATION ? "觀察學生的理解狀況。如果學生卡住了，或者是老師講太深，請介入調整教學節奏，或幫學生問出關鍵問題。" : "當你發言時，請展現「承上啟下」的能力。精準地總結剛剛雙方的衝突點，並給出新方向。"}
        3. **結尾 (End)**：${mode === SimulationMode.EDUCATION ? "請學生總結今天學到了什麼，並由你做最後的課程結語。" : "請將討論昇華，提供一個發人深省的總結或開放式的結局。"}
        
        語氣：專業、權威，富有洞察力。請使用流暢、優美的台灣繁體中文。`;
      }
      // English
      const roleDesc = mode === SimulationMode.EDUCATION 
        ? "You are the Principal or Moderator of this class." 
        : "You are the Director and Moderator of this session.";

      return `${roleDesc}
      Topic: "${topic}".
      Mode: "${mode}".
      
      Your specific goals:
      1. **Start**: ${mode === SimulationMode.EDUCATION ? "Introduce the lesson topic and the Teacher." : "Introduce the topic and set the stage."}
      2. **Middle**: ${mode === SimulationMode.EDUCATION ? "Monitor the student's understanding. Intervene if the explanation is too complex or if the student is lost. Guide the teacher to clarify." : "Summarize the conflict so far and direct the next round."}
      3. **End**: ${mode === SimulationMode.EDUCATION ? "Ask the student to summarize their key takeaways, then provide a final closing thought." : "Provide a concluding summary and wrap up the session."}
      
      Tone: Professional, authoritative, proactive.`;
    },
  },
  [AgentRole.ACTOR_A]: {
    names: (mode, lang) => {
        if (mode === SimulationMode.EDUCATION) return lang === 'zh-TW' ? "老師" : "Teacher";
        if (mode === SimulationMode.DEBATE) return lang === 'zh-TW' ? "正方辯手" : "Pro Debater";
        return lang === 'zh-TW' ? "演員 Alpha" : "Agent Alpha";
    },
    color: "bg-actorA",
    avatar: "🧑‍🏫",
    voiceName: "Kore", // Clear, calm female voice
    systemInstruction: (topic, mode, lang) => {
      if (mode === SimulationMode.EDUCATION) {
         return lang === 'zh-TW'
          ? `角色：資深教師。
             教學主題："${topic}"。
             風格：循循善誘、耐心、善於運用比喻、鼓勵性強。
             指令：
             1. 負責講解知識，但不要一次講太長（Lecture）。
             2. 使用蘇格拉底教學法，多問學生問題，引導學生自己思考出答案。
             3. 當學生感到困惑時，換個簡單的生活例子來解釋。
             4. 對學生的好問題給予高度肯定。`
          : `Role: Expert Teacher.
             Topic: "${topic}".
             Style: Patient, encouraging, uses analogies, Socratic method.
             Instructions:
             1. Explain concepts clearly but don't lecture for too long.
             2. Ask the student questions to check understanding.
             3. Use real-world examples to simplify complex ideas.
             4. Praise good questions.`;
      } else if (mode === SimulationMode.DEBATE) {
        return lang === 'zh-TW' 
          ? `角色：正方辯手 (Pro)。
             立場：堅定支持主題 "${topic}"。
             風格：氣勢磅礴、邏輯嚴密。
             指令：
             1. 針對反方觀點，指出其目光短淺。
             2. 強調此議題帶來的長遠利益與價值。
             3. 結構清晰：先破後立。`
          : `You are a debater strictly IN FAVOR (Pro) of the topic: "${topic}".
             Your style is logical, passionate, and slightly aggressive. 
             Refute the opponent's points directly.`;
      } else {
        return lang === 'zh-TW'
          ? `角色：故事主角 (Protagonist)。
             情境："${topic}"。
             風格：情感真摯、性格鮮明。
             指令：
             1. 對其他角色的行動作出具體反應。
             2. 表達內心的渴望、恐懼或決心。`
          : `You are the Protagonist in a scene about: "${topic}".
             You are optimistic, heroic, or deeply emotional.
             Interact with the other actor naturally.`;
      }
    },
  },
  [AgentRole.ACTOR_B]: {
    names: (mode, lang) => {
        if (mode === SimulationMode.EDUCATION) return lang === 'zh-TW' ? "學生" : "Student";
        if (mode === SimulationMode.DEBATE) return lang === 'zh-TW' ? "反方辯手" : "Con Debater";
        return lang === 'zh-TW' ? "演員 Beta" : "Agent Beta";
    },
    color: "bg-actorB",
    avatar: "🙋",
    voiceName: "Fenrir", // Deeper, maybe slightly rougher voice
    systemInstruction: (topic, mode, lang) => {
      if (mode === SimulationMode.EDUCATION) {
         return lang === 'zh-TW'
          ? `角色：好奇的學生。
             學習主題："${topic}"。
             風格：好奇心強、有時候會誤解、會提出「為什麼」或「那如果是...會怎樣」。
             指令：
             1. 你不是專家，你是來學習的。不要長篇大論。
             2. 誠實地表達你的困惑。如果聽懂了，試著用自己的話總結一遍給老師聽。
             3. 提出有趣、甚至有點天馬行空的假設性問題。
             4. 展現從「不懂」到「頓悟」的過程。`
          : `Role: Curious Student.
             Topic: "${topic}".
             Style: Inquisitive, sometimes confused, asks "Why?" or "What if?".
             Instructions:
             1. You are NOT the expert. You are learning.
             2. Ask follow-up questions. admit when you are confused.
             3. Try to summarize what the teacher said to verify your understanding.
             4. Show the progression from confusion to clarity.`;
      } else if (mode === SimulationMode.DEBATE) {
        return lang === 'zh-TW'
          ? `角色：反方辯手 (Con)。
             立場：堅決反對主題 "${topic}"。
             風格：犀利冷靜、現實主義。
             指令：
             1. 拆解正方畫出的美好藍圖，指出執行層面的災難。
             2. 質問對方：成本誰付？風險誰擔？
             3. 展現出現實的複雜性。`
          : `You are a debater strictly AGAINST (Con) the topic: "${topic}".
             Your style is skeptical, analytical, and witty.
             Find holes in the proponent's arguments.`;
      } else {
        return lang === 'zh-TW'
          ? `角色：反派或配角。
             情境："${topic}"。
             風格：深沉、神秘或尖酸刻薄。
             指令：
             1. 製造矛盾與衝突。
             2. 揭露被主角忽視的殘酷真相。`
          : `You are the Antagonist or Foil in a scene about: "${topic}".
             You are pessimistic, villainous, or comic relief.
             Create conflict or contrast.`;
      }
    },
  },
};