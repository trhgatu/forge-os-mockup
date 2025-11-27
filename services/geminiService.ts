
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

// Helper for delay
const simulateDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzePresence = async (trafficSummary: string): Promise<string> => {
    await simulateDelay();
    
    // Logic for mock analysis based on keywords
    let whisper = "Có ai đó vừa lướt qua... như một cơn gió nhẹ.";
    
    if (trafficSummary.includes('Catalyst')) {
        whisper = "Connection Node 'Catalyst' vừa sáng. Có vẻ như một phần câu chuyện cũ đang khẽ động.";
    } else if (trafficSummary.includes('Known')) {
        whisper = "Người quen ghé thăm. Không nhiều, nhưng cũng không ít. Sự hiện diện này có trọng lượng.";
    } else if (trafficSummary.includes('Anonymous')) {
        whisper = "Dấu chân này giống một bản nháp của điều gì đó chưa thành hình.";
    } else {
        whisper = "Trong hơi hướng Thu này, sự xuất hiện đó mang một cảm giác lạ...";
    }

    return whisper;
};

export const getDailyInsight = async (): Promise<InsightData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Generate a short, profound insight or quote for today. Return JSON with { quote, author, theme }.',
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error(error);
    return { quote: "The only way out is through.", author: "Robert Frost", theme: "Resilience" };
  }
};

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
    yield { text: "Connection interrupted." } as GenerateContentResponse;
  }
};

export const analyzeJournalEntry = async (content: string): Promise<JournalAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this journal entry: "${content}". Return JSON with sentimentScore (1-10), keywords (string[]), summary, suggestedAction.`,
      config: { responseMimeType: 'application/json' }
    });
    const data = JSON.parse(response.text || '{}');
    return {
      sentimentScore: data.sentimentScore || 5,
      keywords: data.keywords || [],
      summary: data.summary || "Analysis unavailable",
      suggestedAction: data.suggestedAction || "Reflect manually."
    };
  } catch (error) {
    return { sentimentScore: 5, keywords: [], summary: "Analysis unavailable", suggestedAction: "Reflect manually." };
  }
};

export const analyzeMemory = async (description: string): Promise<MemoryAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this memory: "${description}". Return JSON with coreMeaning, emotionalPattern, timelineConnection, sentimentScore (1-10).`,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { coreMeaning: "Analysis failed", emotionalPattern: "Unknown", timelineConnection: "None", sentimentScore: 5 };
  }
};

export const analyzeTimelineItem = async (type: TimelineType, content: string): Promise<TimelineAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this timeline item of type ${type}: "${content}". Return JSON with significance, pattern, temporalContext.`,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { significance: "Unknown", pattern: "None detected", temporalContext: "Present" };
  }
};

export const analyzeQuote = async (text: string, author: string): Promise<QuoteAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze quote: "${text}" by ${author}. Return JSON with meaning, themes (string[]), sentimentScore (1-10), reflectionPrompt.`,
      config: { responseMimeType: 'application/json' }
    });
    const data = JSON.parse(response.text || '{}');
    return {
        meaning: data.meaning || "Analysis unavailable",
        themes: data.themes || [],
        sentimentScore: data.sentimentScore || 5,
        reflectionPrompt: data.reflectionPrompt || "What does this mean to you?"
    };
  } catch (error) {
    return { meaning: "Analysis unavailable", themes: [], sentimentScore: 5, reflectionPrompt: "What does this mean to you?" };
  }
};

export const analyzeMoodPatterns = async (entries: MoodEntry[]): Promise<MoodAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze these mood entries: ${JSON.stringify(entries)}. Return JSON with overallTrend, triggers (string[]), prediction, insight, actionableStep.`,
      config: { responseMimeType: 'application/json' }
    });
    const data = JSON.parse(response.text || '{}');
    return {
        overallTrend: data.overallTrend || "Stable",
        triggers: data.triggers || [],
        prediction: data.prediction || "Steady",
        insight: data.insight || "Keep logging.",
        actionableStep: data.actionableStep || "Continue monitoring."
    };
  } catch (error) {
    return { overallTrend: "Stable", triggers: [], prediction: "Steady", insight: "Keep logging.", actionableStep: "Continue monitoring." };
  }
};

export const generateGlobalInsights = async (summary: string): Promise<GlobalAnalysis> => {
  try {
      const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate global insights based on: "${summary}". Return JSON matching GlobalAnalysis interface.`,
      config: { responseMimeType: 'application/json' }
    });
    const data = JSON.parse(response.text || '{}');
    return {
        weeklySummary: data.weeklySummary || "Data insufficient.",
        emotionalCycle: data.emotionalCycle || [],
        topics: data.topics || [],
        patterns: data.patterns || [],
        lifeArc: data.lifeArc || { currentPhase: "Unknown", description: "N/A", progress: 0, nextPhasePrediction: "N/A" },
        predictions: data.predictions || { mood: "Stable", energy: "Stable", suggestion: "Keep tracking." }
    };
  } catch (e) {
      return {
          weeklySummary: "Data insufficient.",
          emotionalCycle: [],
          topics: [],
          patterns: [],
          lifeArc: { currentPhase: "Unknown", description: "N/A", progress: 0, nextPhasePrediction: "N/A" },
          predictions: { mood: "Stable", energy: "Stable", suggestion: "Keep tracking." }
      };
  }
};

export const synthesizeIdeas = async (ideas: Idea[]): Promise<{ title: string; description: string; type: Idea['type'] }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Synthesize these ideas into a new concept: ${JSON.stringify(ideas)}. Return JSON with title, description, type (spark, concept, project, or cluster).`,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return { title: "Synthesis Error", description: "Could not merge ideas.", type: "spark" };
    }
};

export const breakdownGoal = async (title: string, description: string, type: GoalType): Promise<any> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Break down goal "${title}" (${description}, type: ${type}) into milestones. Return JSON with milestones [{title}], riskAnalysis (string[]), energyScore (1-10), suggestedHabit, motivation.`,
            config: { responseMimeType: 'application/json' }
        });
        const data = JSON.parse(response.text || '{}');
        return {
            milestones: data.milestones || [],
            riskAnalysis: data.riskAnalysis || [],
            energyScore: data.energyScore || 5,
            suggestedHabit: data.suggestedHabit || "Start small",
            motivation: data.motivation || "Keep going"
        };
    } catch (e) {
        return { milestones: [], riskAnalysis: [], energyScore: 5, suggestedHabit: "Start small", motivation: "Keep going" };
    }
};

export const optimizeHabitStrategy = async (title: string, frequency: string, streak: number): Promise<HabitAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Optimize habit "${title}" (${frequency}, streak: ${streak}). Return JSON with identityAlignment, suggestedMicroHabit, riskAnalysis, bestTimeOfDay.`,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return { identityAlignment: "Builder", suggestedMicroHabit: "Do 1 min", riskAnalysis: "Inconsistency", bestTimeOfDay: "Morning" };
    }
};

export const optimizeRoutine = async (blocks: RoutineBlock[], type: RoutineType): Promise<RoutineAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze routine blocks: ${JSON.stringify(blocks)} of type ${type}. Return JSON with energyScore, flowSuggestion, bottleneck, recommendedStartTime.`,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return { energyScore: 5, flowSuggestion: "Balance needed", bottleneck: "None", recommendedStartTime: "08:00" };
    }
};

export const analyzeEnergyLevels = async (metrics: EnergyMetrics): Promise<EnergyAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze energy metrics: ${JSON.stringify(metrics)}. Return JSON with currentZone (Recovery, Calm, Flow, Peak, Low), forecast, recommendation, peakTime.`,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return { currentZone: "Calm", forecast: "Stable", recommendation: "Rest", peakTime: "10:00" };
    }
};

export const optimizeMilestone = async (title: string, currentProgress: number): Promise<MilestoneAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Optimize milestone "${title}" at ${currentProgress}%. Return JSON with difficultyScore (1-10), suggestedSubSteps (string[]), blockerDetection, energyRequirement.`,
            config: { responseMimeType: 'application/json' }
        });
        const data = JSON.parse(response.text || '{}');
        return {
            difficultyScore: data.difficultyScore || 5,
            suggestedSubSteps: data.suggestedSubSteps || [],
            blockerDetection: data.blockerDetection || "None",
            energyRequirement: data.energyRequirement || "Moderate"
        };
    } catch (e) {
        return { difficultyScore: 5, suggestedSubSteps: [], blockerDetection: "None", energyRequirement: "Moderate" };
    }
};

export const generateWeeklyReview = async (data: WeeklyReviewData): Promise<WeeklyReviewAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate weekly review from data: ${JSON.stringify(data)}. Return JSON with weeklyScore (1-100), identityProgress, summary, trend (up/stable/down), insights (string[]), focusAreaSuggestion (string[]).`,
            config: { responseMimeType: 'application/json' }
        });
        const result = JSON.parse(response.text || '{}');
        return {
            weeklyScore: result.weeklyScore || 50,
            identityProgress: result.identityProgress || "Steady",
            summary: result.summary || "Data processed",
            trend: result.trend || "stable",
            insights: result.insights || [],
            focusAreaSuggestion: result.focusAreaSuggestion || []
        };
    } catch (e) {
        return { weeklyScore: 50, identityProgress: "Steady", summary: "Data processed", trend: "stable", insights: [], focusAreaSuggestion: [] };
    }
};

export const generateMonthlyReview = async (data: MonthlyReviewData): Promise<MonthlyReviewAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate monthly review for ${data.month}. Data: ${JSON.stringify(data)}. Return JSON with theme, summary, score, identityShift, momentumRating, stabilityRating, highlights, lowlights, keyInsight, nextMonthAdvice.`,
            config: { responseMimeType: 'application/json' }
        });
        const result = JSON.parse(response.text || '{}');
        return {
            theme: result.theme || "Reflection",
            summary: result.summary || "Processing...",
            score: result.score || 50,
            identityShift: result.identityShift || "None",
            momentumRating: result.momentumRating || 5,
            stabilityRating: result.stabilityRating || 5,
            highlights: result.highlights || [],
            lowlights: result.lowlights || [],
            keyInsight: result.keyInsight || "Keep going",
            nextMonthAdvice: result.nextMonthAdvice || "Review goals"
        };
    } catch (e) {
        return { theme: "Reflection", summary: "Processing...", score: 50, identityShift: "None", momentumRating: 5, stabilityRating: 5, highlights: [], lowlights: [], keyInsight: "Keep going", nextMonthAdvice: "Review goals" };
    }
};

export const generateYearlyReview = async (data: YearlyReviewData): Promise<YearlyReviewAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate yearly review for ${data.year}. Return JSON matching YearlyReviewAnalysis interface.`,
            config: { responseMimeType: 'application/json' }
        });
        const result = JSON.parse(response.text || '{}');
        return {
            theme: result.theme || "Integration",
            summary: result.summary || "Year of growth",
            score: result.score || 80,
            identityLabel: result.identityLabel || "Explorer",
            identityRadar: result.identityRadar || [],
            narrativeChapters: result.narrativeChapters || [],
            momentumRating: result.momentumRating || 8,
            stabilityRating: result.stabilityRating || 7,
            highlights: result.highlights || [],
            lowlights: result.lowlights || [],
            keyInsight: result.keyInsight || "Consistency wins",
            nextYearAdvice: result.nextYearAdvice || "Focus on depth"
        };
    } catch (e) {
        return { theme: "Integration", summary: "Year of growth", score: 80, identityLabel: "Explorer", identityRadar: [], narrativeChapters: [], momentumRating: 8, stabilityRating: 7, highlights: [], lowlights: [], keyInsight: "Consistency wins", nextYearAdvice: "Focus on depth" };
    }
};

export const analyzeAchievement = async (title: string, description: string, category: AchievementCategory): Promise<AchievementAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze achievement: "${title}" (${category}) - ${description}. Return JSON with significanceScore, identityShift, growthPattern, emotionalDriver.`,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return { significanceScore: 5, identityShift: "Growth", growthPattern: "Steady", emotionalDriver: "Motivation" };
    }
};

export const generateIdentityAnalysis = async (): Promise<IdentityProfile> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a comprehensive identity profile based on recent user behavior. Return JSON matching IdentityProfile interface.`,
            config: { responseMimeType: 'application/json' }
        });
        const data = JSON.parse(response.text || '{}');
        return {
            currentPhase: data.currentPhase || { id: 'p1', title: 'Awakening', startDate: new Date(), description: 'Phase 1', moodBaseline: 'calm', energyAvg: 70 },
            vector: data.vector || 'Upward',
            evolutionScore: data.evolutionScore || 50,
            archetype: data.archetype || 'Explorer',
            traits: data.traits || [],
            topDrivers: data.topDrivers || [],
            recentShifts: data.recentShifts || [],
            futureProjection: data.futureProjection || { trajectory: 'Positive', alignment: 80, nextPhasePrediction: 'Builder', potentialTraps: [] }
        };
    } catch (e) {
        return { 
            currentPhase: { id: 'p1', title: 'Awakening', startDate: new Date(), description: 'Phase 1', moodBaseline: 'calm', energyAvg: 70 },
            vector: 'Upward', evolutionScore: 50, archetype: 'Explorer', traits: [], topDrivers: [], recentShifts: [], 
            futureProjection: { trajectory: 'Positive', alignment: 80, nextPhasePrediction: 'Builder', potentialTraps: [] }
        };
    }
};

export const generateLifeThemesAnalysis = async (): Promise<LifeThemeAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate life themes analysis. Return JSON matching LifeThemeAnalysis interface.`,
            config: { responseMimeType: 'application/json' }
        });
        const data = JSON.parse(response.text || '{}');
        return {
            currentSeasonSummary: data.currentSeasonSummary || "Transition",
            stabilityScore: data.stabilityScore || 50,
            dominantThemes: data.dominantThemes || [],
            emergingThemes: data.emergingThemes || [],
            quietThemes: data.quietThemes || [],
            timelineData: data.timelineData || [],
            reflectionPrompts: data.reflectionPrompts || []
        };
    } catch (e) {
        return { currentSeasonSummary: "Transition", stabilityScore: 50, dominantThemes: [], emergingThemes: [], quietThemes: [], timelineData: [], reflectionPrompts: [] };
    }
};

export const generateShadowAnalysis = async (): Promise<ShadowAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Perform shadow work analysis. Return JSON matching ShadowAnalysis interface.`,
            config: { responseMimeType: 'application/json' }
        });
        const data = JSON.parse(response.text || '{}');
        return {
            primaryShadow: data.primaryShadow || "Fear of Failure",
            supportingShadows: data.supportingShadows || [],
            tensionScore: data.tensionScore || 50,
            avoidanceIndex: data.avoidanceIndex || 50,
            emotionalRoots: data.emotionalRoots || [],
            masks: data.masks || [],
            conflicts: data.conflicts || [],
            limitingBeliefs: data.limitingBeliefs || [],
            transmutation: data.transmutation || { shadow: "Fear", gift: "Caution", path: "Acceptance" },
            integrationSteps: data.integrationSteps || [],
            reflectionPrompts: data.reflectionPrompts || [],
            shadowTimeline: data.shadowTimeline || []
        };
    } catch (e) {
        return { primaryShadow: "Fear of Failure", supportingShadows: [], tensionScore: 50, avoidanceIndex: 50, emotionalRoots: [], masks: [], conflicts: [], limitingBeliefs: [], transmutation: { shadow: "Fear", gift: "Caution", path: "Acceptance" }, integrationSteps: [], reflectionPrompts: [], shadowTimeline: [] };
    }
};

export const generateCompassAnalysis = async (): Promise<CompassData> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate life compass data. Return JSON matching CompassData interface.`,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return { northStar: { statement: "To live fully", whyItMatters: "Purpose", timeHorizon: "Lifetime", resonanceScore: 10 }, horizons: [], tracks: [], alignmentScore: 80, driftScore: 10, currentPhase: "Building", driftSources: [], nextQuarterFocus: { themes: [], goals: [] } };
    }
};

export const analyzeMantra = async (text: string): Promise<MantraAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze mantra "${text}". Return JSON with season (Spring/Summer/Autumn/Winter), tone, archetype, novaWhisper.`,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return { season: 'Winter', tone: 'Calm', archetype: 'Sage', novaWhisper: "Silence speaks." };
    }
};

export const analyzeMetaJournal = async (content: string, type: MetaJournalType): Promise<MetaJournalAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze meta-journal "${content}" of type ${type}. Return JSON with depthLevel (1-10), cognitivePattern, seasonalShift (optional Season), novaWhisper.`,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return { depthLevel: 5, cognitivePattern: "Reflection", novaWhisper: "Interesting observation." };
    }
};

export const analyzeConnection = async (name: string, role: ConnectionRole): Promise<ConnectionAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze connection with ${name} (Role: ${role}). Return JSON with novaWhisper, emotionalSummary, seasonAffinity (Spring/Summer/Autumn/Winter).`,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return { novaWhisper: "A bond formed in silence.", emotionalSummary: "Stable", seasonAffinity: 'Winter' };
    }
};
