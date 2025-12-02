
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { 
  InsightData, 
  JournalAnalysis, 
  MemoryAnalysis, 
  TimelineAnalysis, 
  QuoteAnalysis, 
  MoodEntry, 
  MoodAnalysis, 
  GlobalAnalysis, 
  Idea, 
  GoalType, 
  HabitAnalysis, 
  RoutineBlock, 
  RoutineType, 
  RoutineAnalysis, 
  EnergyMetrics, 
  EnergyAnalysis, 
  MilestoneAnalysis, 
  WeeklyReviewData, 
  WeeklyReviewAnalysis, 
  MonthlyReviewData, 
  MonthlyReviewAnalysis, 
  YearlyReviewData, 
  YearlyReviewAnalysis, 
  AchievementAnalysis, 
  AchievementCategory, 
  IdentityProfile, 
  LifeThemeAnalysis, 
  ShadowAnalysis, 
  CompassData, 
  MantraAnalysis, 
  MetaJournalType, 
  MetaJournalAnalysis, 
  ConnectionAnalysis, 
  ConnectionRole, 
  TimelineType
} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper for delay to simulate network latency
const simulateDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// --- REAL AI SERVICE (FOR FORGE CHAMBER ONLY) ---

export const streamChatResponse = async function* (history: { role: string; text: string }[], message: string, systemPrompt?: string) {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: systemPrompt },
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
    });

    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      yield chunk;
    }
  } catch (error) {
    console.error("Stream error", error);
    yield { text: "Connection interrupted. Neural Core offline." } as GenerateContentResponse;
  }
};

// --- MOCK SERVICES (FOR ALL OTHER MODULES) ---

export const analyzePresence = async (trafficSummary: string): Promise<string> => {
    await simulateDelay();
    // Logic for mock analysis based on keywords
    if (trafficSummary.includes('Catalyst')) {
        return "Connection Node 'Catalyst' vừa sáng. Có vẻ như một phần câu chuyện cũ đang khẽ động.";
    } else if (trafficSummary.includes('Known')) {
        return "Người quen ghé thăm. Không nhiều, nhưng cũng không ít. Sự hiện diện này có trọng lượng.";
    } else if (trafficSummary.includes('Anonymous')) {
        return "Dấu chân này giống một bản nháp của điều gì đó chưa thành hình.";
    }
    return "Trong hơi hướng Thu này, sự xuất hiện đó mang một cảm giác lạ...";
};

export const getDailyInsight = async (): Promise<InsightData> => {
  await simulateDelay(500);
  return { 
    quote: "The only way out is through.", 
    author: "Robert Frost", 
    theme: "Resilience" 
  };
};

export const analyzeJournalEntry = async (content: string): Promise<JournalAnalysis> => {
  await simulateDelay();
  return {
    sentimentScore: 7,
    keywords: ['Reflection', 'Growth', 'Mindset'],
    summary: "You are navigating a complex transition with surprising clarity.",
    suggestedAction: "Take a walk to let this settle."
  };
};

export const analyzeMemory = async (description: string): Promise<MemoryAnalysis> => {
  await simulateDelay();
  return { 
    coreMeaning: "Struggle often precedes the clearest moments of peace.", 
    emotionalPattern: "Seeking elevation to find perspective.", 
    timelineConnection: "Connects to your 'Year of Building' arc.", 
    sentimentScore: 8 
  };
};

export const analyzeTimelineItem = async (type: TimelineType, content: string): Promise<TimelineAnalysis> => {
  await simulateDelay();
  return { 
    significance: "This moment marks a subtle shift in your trajectory.", 
    pattern: "Recurrence of the 'Architect' archetype.", 
    temporalContext: "A seed planted for the coming season." 
  };
};

export const analyzeQuote = async (text: string, author: string): Promise<QuoteAnalysis> => {
  await simulateDelay();
  return {
      meaning: "True strength lies not in force, but in the ability to endure without losing softness.",
      themes: ["Strength", "Endurance", "Stoicism"],
      sentimentScore: 8,
      reflectionPrompt: "Where in your life are you forcing outcomes instead of allowing them?"
  };
};

export const analyzeMoodPatterns = async (entries: MoodEntry[]): Promise<MoodAnalysis> => {
  await simulateDelay();
  return {
      overallTrend: "Ascending",
      triggers: ["Creative Work", "Morning Routine"],
      prediction: "Energy levels likely to peak mid-week.",
      insight: "You are most stable when you create before you consume.",
      actionableStep: "Protect your morning hours strictly."
  };
};

export const generateGlobalInsights = async (summary: string): Promise<GlobalAnalysis> => {
  await simulateDelay(2000);
  return {
      weeklySummary: "A week of high cognitive load but rewarding breakthroughs.",
      emotionalCycle: [
        { date: 'Mon', mood: 'neutral', value: 5 },
        { date: 'Tue', mood: 'focused', value: 8 },
        { date: 'Wed', mood: 'inspired', value: 9 },
        { date: 'Thu', mood: 'tired', value: 4 },
        { date: 'Fri', mood: 'calm', value: 7 },
        { date: 'Sat', mood: 'joy', value: 8 },
        { date: 'Sun', mood: 'calm', value: 7 }
      ],
      topics: [
        { id: 't1', name: 'Systems', size: 10, relatedTopics: [], x: 50, y: 50 },
        { id: 't2', name: 'Identity', size: 8, relatedTopics: [], x: 30, y: 40 },
        { id: 't3', name: 'Code', size: 6, relatedTopics: [], x: 70, y: 60 }
      ],
      patterns: [
        { id: 'p1', type: 'cognitive', title: 'Deep Work Flow', description: 'Consistent entry into flow state in mornings.', confidence: 90, impact: 'positive' },
        { id: 'p2', type: 'emotional', title: 'Evening Dip', description: 'Recurring energy crash around 7 PM.', confidence: 75, impact: 'negative' }
      ],
      lifeArc: { currentPhase: "The Builder", description: "Constructing the foundations of the next chapter.", progress: 65, nextPhasePrediction: "The Sage" },
      predictions: { mood: "Stable", energy: "High", suggestion: "Maintain momentum." }
  };
};

export const synthesizeIdeas = async (ideas: Idea[]): Promise<{ title: string; description: string; type: Idea['type'] }> => {
    await simulateDelay();
    return { 
        title: "Neural Interface Protocol", 
        description: "A synthesis of fluid UI concepts and semantic search capabilities, creating an interface that adapts to thought patterns.", 
        type: "project" 
    };
};

export const breakdownGoal = async (title: string, description: string, type: GoalType): Promise<any> => {
    await simulateDelay();
    return {
        milestones: [
            { title: "Research Phase", isCompleted: false },
            { title: "Prototype Core", isCompleted: false },
            { title: "First Feedback Loop", isCompleted: false }
        ],
        riskAnalysis: ["Scope creep", "Energy burnout"],
        energyScore: 7,
        suggestedHabit: "Daily 30min focused research",
        motivation: "This goal aligns perfectly with your identity as an Innovator."
    };
};

export const optimizeHabitStrategy = async (title: string, frequency: string, streak: number): Promise<HabitAnalysis> => {
    await simulateDelay();
    return { 
        identityAlignment: "Builder", 
        suggestedMicroHabit: "Just do 2 minutes", 
        riskAnalysis: "Afternoon fatigue", 
        bestTimeOfDay: "08:00 AM" 
    };
};

export const optimizeRoutine = async (blocks: RoutineBlock[], type: RoutineType): Promise<RoutineAnalysis> => {
    await simulateDelay();
    return { 
        energyScore: 8, 
        flowSuggestion: "Move high-cognitive tasks to the start of the routine.", 
        bottleneck: "Transition time between deep work and meetings.", 
        recommendedStartTime: "07:30 AM" 
    };
};

export const analyzeEnergyLevels = async (metrics: EnergyMetrics): Promise<EnergyAnalysis> => {
    await simulateDelay();
    return { 
        currentZone: "Flow", 
        forecast: "Peak energy approaching in 2 hours.", 
        recommendation: "Engage in creative synthesis now.", 
        peakTime: "10:00 AM" 
    };
};

export const optimizeMilestone = async (title: string, currentProgress: number): Promise<MilestoneAnalysis> => {
    await simulateDelay();
    return {
        difficultyScore: 6,
        suggestedSubSteps: ["Define scope", "Draft outline", "Review with peer"],
        blockerDetection: "Procrastination due to lack of clarity.",
        energyRequirement: "High Focus"
    };
};

export const generateWeeklyReview = async (data: WeeklyReviewData): Promise<WeeklyReviewAnalysis> => {
    await simulateDelay();
    return {
        weeklyScore: 82,
        identityProgress: "Solidifying the 'Creator' archetype.",
        summary: "A strong week defined by consistent output, though recovery protocols need attention.",
        trend: "up",
        insights: ["Deep work consistency improved", "Sleep quality affected mood on Thursday"],
        focusAreaSuggestion: ["Recovery", "Social Connection"]
    };
};

export const generateMonthlyReview = async (data: MonthlyReviewData): Promise<MonthlyReviewAnalysis> => {
    await simulateDelay();
    return {
        theme: "Expansion",
        summary: "You pushed boundaries this month. The data shows a clear upward trajectory in creative output.",
        score: 88,
        identityShift: "From Observer to Participant.",
        momentumRating: 9,
        stabilityRating: 7,
        highlights: ["Launched Project Alpha", "Maintained gym streak"],
        lowlights: ["Neglected reading habit", "High stress in week 3"],
        keyInsight: "Action cures fear.",
        nextMonthAdvice: "Focus on stabilizing the new baseline."
    };
};

export const generateYearlyReview = async (data: YearlyReviewData): Promise<YearlyReviewAnalysis> => {
    await simulateDelay();
    return {
        theme: "Metamorphosis",
        summary: "This year was about shedding old skins. You are not the same person who started it.",
        score: 92,
        identityLabel: "The Architect",
        identityRadar: [
            { subject: 'Discipline', A: 80, fullMark: 100 },
            { subject: 'Creativity', A: 90, fullMark: 100 },
            { subject: 'Resilience', A: 85, fullMark: 100 },
            { subject: 'Health', A: 70, fullMark: 100 },
            { subject: 'Connection', A: 60, fullMark: 100 }
        ],
        narrativeChapters: [
            { month: 'Jan-Mar', title: 'The Awakening', summary: 'Realizing old patterns no longer served you.', mood: 'anxious', intensity: 6 },
            { month: 'Apr-Jun', title: 'The Grind', summary: 'Building new systems in the dark.', mood: 'focused', intensity: 8 },
            { month: 'Jul-Sep', title: 'The Breakthrough', summary: 'Seeing the first fruits of labor.', mood: 'inspired', intensity: 9 },
            { month: 'Oct-Dec', title: 'The Integration', summary: 'Becoming the new version.', mood: 'calm', intensity: 7 }
        ],
        momentumRating: 9,
        stabilityRating: 8,
        highlights: ["Career pivot success", "Physical transformation"],
        lowlights: ["Burnout in June", "Lost connection with X"],
        keyInsight: "Consistency beats intensity.",
        nextYearAdvice: "Go deeper, not wider."
    };
};

export const analyzeAchievement = async (title: string, description: string, category: AchievementCategory): Promise<AchievementAnalysis> => {
    await simulateDelay();
    return { 
        significanceScore: 9, 
        identityShift: "Validates your capability as a Leader.", 
        growthPattern: "Linear progression followed by exponential leap.", 
        emotionalDriver: "Purpose" 
    };
};

export const generateIdentityAnalysis = async (): Promise<IdentityProfile> => {
    await simulateDelay();
    return {
        currentPhase: { id: 'p1', title: 'The Architect', startDate: new Date('2023-01-01'), description: 'Designing the systems for a life of autonomy.', moodBaseline: 'focused', energyAvg: 80 },
        vector: 'Vertical Growth',
        evolutionScore: 78,
        archetype: 'Strategist',
        traits: [
            { name: "Vision", score: 90 },
            { name: "Execution", score: 75 },
            { name: "Resilience", score: 85 },
            { name: "Empathy", score: 60 }
        ],
        topDrivers: [
            { id: 'd1', name: 'Autonomy', type: 'Value', impact: 95, description: 'Desire for self-governance.' },
            { id: 'd2', name: 'Mastery', type: 'Goal', impact: 80, description: 'Pursuit of excellence.' }
        ],
        recentShifts: [
            { id: 's1', title: 'Mindset Shift', date: new Date(), type: 'Mindset', impactScore: 8, context: 'Moved from scarcity to abundance thinking.' }
        ],
        futureProjection: { trajectory: 'Exponential', alignment: 85, nextPhasePrediction: 'The Sage', potentialTraps: ['Isolation', 'Over-intellectualization'] }
    };
};

export const generateLifeThemesAnalysis = async (): Promise<LifeThemeAnalysis> => {
    await simulateDelay();
    return {
        currentSeasonSummary: "A season of rigorous building and internal structuring.",
        stabilityScore: 82,
        dominantThemes: [
            { 
                id: 't1', title: 'The Builder', description: 'Constructing lasting systems.', status: 'dominant', strength: 90, 
                firstDetected: new Date(), lastActive: new Date(), relatedMoods: ['focused', 'tired'], archetypeIcon: 'anchor', 
                colorSignature: '#7C3AED', evidence: [], behaviors: [{id: 'b1', description: 'Deep work blocks', type: 'habit'}], evolutionArc: 'Rising'
            }
        ],
        emergingThemes: [
            { 
                id: 't2', title: 'The Mystic', description: 'Seeking deeper meaning.', status: 'emerging', strength: 40, 
                firstDetected: new Date(), lastActive: new Date(), relatedMoods: ['calm', 'inspired'], archetypeIcon: 'feather', 
                colorSignature: '#FCD34D', evidence: [], behaviors: [], evolutionArc: 'Nascent'
            }
        ],
        quietThemes: [],
        timelineData: [
            { date: 'Jan', themeId: 't1', intensity: 20 },
            { date: 'Jun', themeId: 't1', intensity: 60 },
            { date: 'Dec', themeId: 't1', intensity: 90 }
        ],
        reflectionPrompts: ["What are you building that will outlast you?", "Where can you soften your approach?"]
    };
};

export const generateShadowAnalysis = async (): Promise<ShadowAnalysis> => {
    await simulateDelay();
    return {
        primaryShadow: "The Perfectionist",
        supportingShadows: ["The Imposter", "The Martyr"],
        tensionScore: 65,
        avoidanceIndex: 40,
        emotionalRoots: ["Fear of Failure", "Need for Control"],
        masks: [
            { id: 'm1', name: 'Procrastination', protecting: 'Self-worth', triggeredBy: 'High stakes tasks', description: 'Delaying to avoid judgment.', icon: 'clock' },
            { id: 'm2', name: 'Over-preparation', protecting: 'Competence', triggeredBy: 'New challenges', description: 'Never feeling ready.', icon: 'shield' }
        ],
        conflicts: [
            { id: 'c1', desire: 'To Launch', fear: 'To be Critiqued', manifestation: 'Endless editing', tensionLevel: 8 }
        ],
        limitingBeliefs: [
            { id: 'b1', statement: "I must be perfect to be loved.", intensity: 9, consequences: ["Burnout", "Anxiety"] }
        ],
        transmutation: { shadow: "Perfectionism", gift: "Excellence", path: "Accepting 'Good Enough' as a bridge." },
        integrationSteps: ["Ship before you feel ready.", "Celebrate small wins."],
        reflectionPrompts: ["What would you do if you knew you couldn't fail?", "Who are you trying to impress?"],
        shadowTimeline: [
            { date: 'Mon', intensity: 4, trigger: 'Meeting' },
            { date: 'Wed', intensity: 8, trigger: 'Deadline' },
            { date: 'Fri', intensity: 3, trigger: 'Rest' }
        ]
    };
};

export const generateCompassAnalysis = async (): Promise<CompassData> => {
    await simulateDelay();
    return { 
        northStar: { statement: "To live with radical authenticity and creative freedom.", whyItMatters: "Because masking drains the soul.", timeHorizon: "Lifetime", resonanceScore: 10 }, 
        horizons: [
            { level: '1Y', vision: "Financial Independence Baseline", domains: [{ name: "Wealth", status: 'on-track', anchorGoal: "Launch Product" }] },
            { level: '3Y', vision: "Global Nomad", domains: [{ name: "Lifestyle", status: 'at-risk', anchorGoal: "Remote Setup" }] }
        ], 
        tracks: [
            { id: 'tr1', title: 'Creative Mastery', linkedThemeId: 't1', horizon: '1Y', status: 'active', momentum: 85, progress: 60 }
        ], 
        alignmentScore: 88, 
        driftScore: 12, 
        currentPhase: "Execution", 
        driftSources: ["Social distractions", "Inconsistent sleep"], 
        nextQuarterFocus: { themes: ["Scale", "Health"], goals: ["Hire assistant", "Run 10k"] } 
    };
};

export const analyzeMantra = async (text: string): Promise<MantraAnalysis> => {
    await simulateDelay();
    return { 
        season: 'Winter', 
        tone: 'Resolute', 
        archetype: 'Warrior', 
        novaWhisper: "This phrase cuts through the noise like a blade of ice. Hold it close." 
    };
};

export const analyzeMetaJournal = async (content: string, type: MetaJournalType): Promise<MetaJournalAnalysis> => {
    await simulateDelay();
    return { 
        depthLevel: 8, 
        cognitivePattern: "Recursive self-awareness detected.", 
        seasonalShift: 'Spring', 
        novaWhisper: "You are beginning to see the code behind the curtain." 
    };
};

export const analyzeConnection = async (name: string, role: ConnectionRole): Promise<ConnectionAnalysis> => {
    await simulateDelay();
    return { 
        novaWhisper: "This bond acts as a mirror, reflecting parts of yourself you often ignore.", 
        emotionalSummary: "Intense but purifying.", 
        seasonAffinity: 'Autumn' 
    };
};
