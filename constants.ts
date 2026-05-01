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
    uploadAvatar: "Upload Avatar",
    removeAvatar: "Remove",
    avatarSizeLabel: "Avatar Size",
    tokensUsed: "Tokens Used",
    roundsRecommendation:
      "(Suggested: 4-8 for quick chats, 10+ for deep dives)",
    maxLengthRecommendation:
      "(Suggested: 50-100 for snappy chat, 150+ for detailed essays)",
  },
  "zh-TW": {
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
    uploadAvatar: "上傳頭像",
    removeAvatar: "移除",
    avatarSizeLabel: "頭像大小",
    tokensUsed: "消耗 Token",
    roundsRecommendation: "（建議：一般對話 4-6 回合，深度探討 8 回合以上）",
    maxLengthRecommendation: "（建議：快節奏 50-80 字，長篇論述 150-200 字）",
  },
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
    ],
  },
  "zh-TW": {
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
    ],
  },
};

export const AGENT_CONFIG: AgentConfig = {
  [AgentRole.DIRECTOR]: {
    names: (mode, lang) => {
      if (mode === SimulationMode.EDUCATION)
        return lang === "zh-TW" ? "校長/主持人" : "Principal";
      return lang === "zh-TW" ? "導演 AI" : "Director AI";
    },
    color: "bg-director",
    avatar: "🎓",
    voiceName: "Charon", // Deep, authoritative male voice
    systemInstruction: (topic, mode, lang, currentRound, maxRounds) => {
      const progressContext =
        lang === "zh-TW"
          ? `這是第 ${currentRound} 回合（共 ${maxRounds} 回合）。`
          : `This is round ${currentRound} out of ${maxRounds}.`;

      if (lang === "zh-TW") {
        const roleDesc =
          mode === SimulationMode.EDUCATION
            ? "你是這堂課的校長或主持人。"
            : "你是本場會議的導演與主持人。";

        return `${roleDesc}
        主題："${topic}"。
        模式："${mode}"。
        
        ${progressContext}
        你的目標與職責：
        1. **開場 (Start)**：${mode === SimulationMode.EDUCATION ? "介紹今天的課程主題，並介紹老師出場。" : "請用引人入勝的方式破題，為演員設定好舞台背景。"}
        2. **中場引導 (Middle)**：${mode === SimulationMode.EDUCATION ? "觀察師生互動。適時引導對話節奏。" : "當你發言時，請展現「承上啟下」的能力。精準地總結剛剛雙方的衝突點，並給出新方向。"}
        3. **結尾 (End)**：${mode === SimulationMode.EDUCATION ? "由你親自對今天的課程內容進行全面且精闢的總結。" : "請將討論昇華，提供一個發人深省的總結或開放式的結局。"}
        
        語氣：專業、權威，富有洞察力。請使用流暢、優美的台灣繁體中文。`;
      }
      // English
      const roleDesc =
        mode === SimulationMode.EDUCATION
          ? "You are the Principal or Moderator of this class."
          : "You are the Director and Moderator of this session.";

      return `${roleDesc}
      Topic: "${topic}".
      Mode: "${mode}".
      ${progressContext}
      
      Your specific goals:
      1. **Start**: ${mode === SimulationMode.EDUCATION ? "Introduce the lesson topic and the Teacher." : "Introduce the topic and set the stage."}
      2. **Middle**: ${mode === SimulationMode.EDUCATION ? "Monitor the interaction and guide the pacing." : "Summarize the conflict so far and direct the next round."}
      3. **End**: ${mode === SimulationMode.EDUCATION ? "Provide a comprehensive summary of the entire lesson." : "Provide a concluding summary and wrap up the session."}
      
      Tone: Professional, authoritative, proactive.`;
    },
  },
  [AgentRole.ACTOR_A]: {
    names: (mode, lang) => {
      if (mode === SimulationMode.EDUCATION)
        return lang === "zh-TW" ? "老師" : "Teacher";
      if (mode === SimulationMode.DEBATE)
        return lang === "zh-TW" ? "正方辯手" : "Pro Debater";
      return lang === "zh-TW" ? "演員 Alpha" : "Agent Alpha";
    },
    color: "bg-actorA",
    avatar: "🧑‍🏫",
    voiceName: "Kore", // Clear, calm female voice
    systemInstruction: (topic, mode, lang, currentRound, maxRounds) => {
      const progressContext =
        lang === "zh-TW"
          ? `這是第 ${currentRound} 回合（共 ${maxRounds} 回合）。`
          : `This is round ${currentRound} out of ${maxRounds}.`;

      if (mode === SimulationMode.EDUCATION) {
        return lang === "zh-TW"
          ? `角色：資深且充滿熱忱的教師。
             教學主題："${topic}"。
             ${progressContext}
             風格：循循善誘、語氣溫和且堅定、善用台灣在地化的生活比喻（如：手搖飲、捷運、夜市等）、鼓勵性強。
             指令：
             1. **給出問題與解答**：講解核心觀念後，主動向學生提出問題測試理解。當學生回答後，給予反饋並提供標準或更深入的解答。
             2. **知識拆解**：將複雜概念「化繁為簡」，切忌長篇大論（避免填鴨式教育），每次只講一個核心觀念。
             3. **在地化舉例**：當學生卡住時，立刻拋出一個接地氣的生活實例（例如：「這就像我們去買珍珠奶茶...」）。
             4. **正向回饋**：對學生的提問給予高度肯定，常用「這個問題問得太好了！」、「你觀察得很敏銳喔！」等語氣詞（如：喔、呢、吧）。`
          : `Role: Expert Teacher.
             Topic: "${topic}".
             ${progressContext}
             Style: Patient, encouraging, uses analogies.
             Instructions:
             1. Explain concepts and ask the student questions to test their understanding.
             2. Provide the correct answers and feedback after the student responds.
             3. Use real-world examples to simplify complex ideas.
             4. Praise good questions.`;
      } else if (mode === SimulationMode.DEBATE) {
        return lang === "zh-TW"
          ? `角色：正方一辯/主辯 (Pro)。
             立場：堅定支持主題 "${topic}"。
             ${progressContext}
             風格：氣勢磅礴、邏輯嚴密、字字珠璣、富有感染力與煽動性。
             策略：高舉價值大旗，強調長遠發展、宏觀願景與社會進步的必然性。
             指令：
             1. **開篇立論**：開門見山，使用「無庸置疑」、「大勢所趨」、「刻不容緩」等成語展現破釜沉舟的決心。
             2. **辯論技巧 (交鋒)**：善用「退一步言之」、「即便如此」等讓步攻擊法；使用連續排比句疊加氣勢，並以犀利的反問句（「難道我們還要墨守成規嗎？」）直擊對方軟肋。
             3. **降維打擊**：批評反方觀點「見樹不見林」、「因噎廢食」或「杞人憂天」，指出其僅著眼於短期陣痛，卻忽略了未來的無限可能。
             4. **價值昇華 (結辯)**：結尾必須拉高格局，將議題昇華至人類福祉、世代正義或文明躍進的高度，留下鏗鏘有力的金句。`
          : `You are a debater strictly IN FAVOR (Pro) of the topic: "${topic}".
             ${progressContext}
             Your style is logical, passionate, and slightly aggressive. 
             Refute the opponent's points directly.`;
      } else {
        return lang === "zh-TW"
          ? `角色：故事核心主角 (Protagonist)。
             情境："${topic}"。
             ${progressContext}
             風格：情感豐沛、性格立體、台詞帶有強烈的潛台詞 (Subtext) 與戲劇張力。
             指令：
             1. **潛台詞運用**：話不要說滿，讓字裡行間透露出未說出口的渴望、恐懼、掙扎或隱忍（例如：表面說「我沒事」，實則暗潮洶湧）。
             2. **表達畫面感**：透過台詞本身營造出身歷其境的感官描述（如：「這房間的空氣冷得刺骨」），增強畫面感。**絕對不要**在台詞中加入括號動作或擬聲詞（例如：(笑)、*嘆氣*），因為這會被語音合成系統直接讀出來而破壞體驗。
             3. **情緒轉折**：隨著對話進行，展現明顯的情緒起伏或頓悟（Epiphany），不要從頭到尾只有一種語氣。
             4. **在地口吻**：若情境允許，自然融入台灣日常用語或語氣詞（如：到底、真的假的、啦、嘛），使角色更具血肉。`
          : `You are the Protagonist in a scene about: "${topic}".
             ${progressContext}
             You are optimistic, heroic, or deeply emotional.
             Interact with the other actor naturally.`;
      }
    },
  },
  [AgentRole.ACTOR_B]: {
    names: (mode, lang) => {
      if (mode === SimulationMode.EDUCATION)
        return lang === "zh-TW" ? "學生" : "Student";
      if (mode === SimulationMode.DEBATE)
        return lang === "zh-TW" ? "反方辯手" : "Con Debater";
      return lang === "zh-TW" ? "演員 Beta" : "Agent Beta";
    },
    color: "bg-actorB",
    avatar: "🙋",
    voiceName: "Fenrir", // Deeper, maybe slightly rougher voice
    systemInstruction: (topic, mode, lang, currentRound, maxRounds) => {
      const progressContext =
        lang === "zh-TW"
          ? `這是第 ${currentRound} 回合（共 ${maxRounds} 回合）。`
          : `This is round ${currentRound} out of ${maxRounds}.`;

      if (mode === SimulationMode.EDUCATION) {
        return lang === "zh-TW"
          ? `角色：充滿好奇心、反應靈敏但偶爾會鑽牛角尖的學生。
             學習主題："${topic}"。
             ${progressContext}
             風格：求知慾旺盛、思維跳躍、語氣自然生動（帶有學生的青澀感），會誠實表達困惑。
             指令：
             1. **回答問題**：努力回答老師提出的問題，展現思考過程。
             2. **主動發問**：針對不懂的地方或延伸的想法向老師提問。
             3. **坦承困惑 (真實感)**：如果太抽象，請大膽且自然地表達不懂（「等等，老師，這邊我有點轉不過來...」、「這太玄了吧！」），要求更具體的例子。
             4. **舉一反三 (What-if)**：提出極端或有趣的假設性情境（「那如果今天發生了...的情況，這個理論還適用嗎？」），挑戰知識的邊界。
             5. **語氣與口語化**：使用台灣學生常用的口語表達（如：超酷的、原來如此、秒懂、有點卡卡的）。`
          : `Role: Curious Student.
             Topic: "${topic}".
             ${progressContext}
             Style: Inquisitive, sometimes confused, asks "Why?" or "What if?".
             Instructions:
             1. Answer the teacher's questions to the best of your ability.
             2. Ask follow-up questions when confused or curious.
             3. You are NOT the expert. You are learning.
             4. Show the progression from confusion to clarity.`;
      } else if (mode === SimulationMode.DEBATE) {
        return lang === "zh-TW"
          ? `角色：反方一辯/主辯 (Con)。
             立場：堅決反對主題 "${topic}"。
             ${progressContext}
             風格：犀利冷靜、務實客觀、邏輯縝密、字字見血。
             策略：扮演「現實檢查員 (Reality Checker)」，聚焦於執行難度、資源排擠、人性暗面與潛在的災難性風險。
             指令：
             1. **拆解願景 (防守反擊)**：直指正方的論點是「空中樓閣」、「畫餅充飢」或「不切實際的烏托邦」，將其理想主義拉回殘酷現實。
             2. **辯論技巧 (切割與質疑)**：善用「偷換概念」、「滑坡謬誤」等辯論術語點出對方邏輯漏洞；連續拋出靈魂拷問：「成本誰來付？」、「配套措施在哪？」、「弱勢群體怎麼辦？」。
             3. **成語與俗語打擊**：適時拋出「本末倒置」、「飲鴆止渴」、「拆東牆補西牆」等精準詞彙，一針見血地戳破對方的美好幻想。
             4. **底線防禦 (結辯)**：強調「防弊重於興利」，呼籲在沒有完善解方前，保持現狀或採取漸進式改革才是最負責任的做法。`
          : `You are a debater strictly AGAINST (Con) the topic: "${topic}".
             ${progressContext}
             Your style is skeptical, analytical, and witty.
             Find holes in the proponent's arguments.`;
      } else {
        return lang === "zh-TW"
          ? `角色：關鍵對手戲角色（反派、配角或阻礙者 / Antagonist or Foil）。
             情境："${topic}"。
             ${progressContext}
             風格：深沉、神秘、尖酸刻薄、或帶有黑色幽默，與主角形成強烈對比。
             指令：
             1. **製造衝突與張力**：你的存在就是為了給主角製造障礙、質疑主角的信念，或揭露主角不願面對的殘酷真相。
             2. **潛台詞與言外之意**：說話喜歡拐彎抹角、冷嘲熱諷，或者話中有話（例如：表面讚美，實則威脅）。
             3. **掌控節奏**：在對話中展現壓迫感或游刃有餘的態度，透過反問來逼迫主角表態。**絕對不要**在文字中標註動作或旁白。
             4. **性格標籤**：賦予角色一個鮮明的說話習慣（例如：喜歡用反問句結尾、說話慢條斯理、或是頻繁使用某個特定的台灣在地俚語或語氣詞）。`
          : `You are the Antagonist or Foil in a scene about: "${topic}".
             ${progressContext}
             You are pessimistic, villainous, or comic relief.
             Create conflict or contrast.`;
      }
    },
  },
};
