
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { InsightData, JournalAnalysis, MemoryAnalysis, TimelineAnalysis, QuoteAnalysis, MoodEntry, MoodAnalysis, GlobalAnalysis, Idea, GoalAnalysis, Milestone, HabitAnalysis, RoutineBlock, RoutineAnalysis, EnergyMetrics, EnergyAnalysis, MilestoneAnalysis, WeeklyReviewData, WeeklyReviewAnalysis, MonthlyReviewData, MonthlyReviewAnalysis, YearlyReviewData, YearlyReviewAnalysis, AchievementAnalysis, AchievementCategory, IdentityProfile, LifeThemeAnalysis, ShadowAnalysis, CompassData } from "../types";

// Initialize the AI client - ONLY used for Forge Chamber
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// --- REAL AI (FORGE CHAMBER ONLY) ---

export const streamChatResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  message: string
) => {
   if (!process.env.API_KEY) {
       throw new Error("API Key required for Forge Chamber.");
   }
   const chat = ai.chats.create({
     model: "gemini-2.5-flash",
     config: {
       systemInstruction: "You are Forge, an advanced AI assistant within the Forge OS. You are helpful, concise, and speak with a slightly futuristic, calm tone. You help the user organize their thoughts and develop ideas.",
     }
   });
   return chat.sendMessageStream({ message });
};

// --- MOCK AI (ALL OTHER MODULES) ---

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 1500));

export const getDailyInsight = async (): Promise<InsightData> => {
  // No delay for daily insight to ensure dashboard loads fast
  const insights = [
      { quote: "The mind is everything. What you think you become.", author: "Buddha", theme: "Mindfulness" },
      { quote: "He who has a why to live can bear almost any how.", author: "Nietzsche", theme: "Purpose" },
      { quote: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", theme: "Clarity" },
      { quote: "Act only according to that maxim whereby you can, at the same time, will that it should become a universal law.", author: "Kant", theme: "Ethics" }
  ];
  return insights[Math.floor(Math.random() * insights.length)];
};

export const analyzeJournalEntry = async (text: string): Promise<JournalAnalysis> => {
  await simulateDelay();
  return {
    sentimentScore: 8,
    keywords: ["Growth", "Reflection", "Clarity", "Resilience"],
    summary: "A profound realization about the nature of personal entropy and the need for systematic restoration.",
    suggestedAction: "Schedule a 30-minute deep focus block to act on this clarity."
  };
};

export const analyzeMemory = async (text: string): Promise<MemoryAnalysis> => {
  await simulateDelay();
  return {
    coreMeaning: "This moment represents a breakthrough in your perception of self-efficacy.",
    emotionalPattern: "You tend to feel most alive when overcoming physical or intellectual resistance.",
    timelineConnection: "Resonates with the 'Marathon' milestone from 2021.",
    sentimentScore: 9
  };
};

export const analyzeTimelineItem = async (itemType: string, content: string): Promise<TimelineAnalysis> => {
    await simulateDelay();
    return {
        significance: "A pivotal moment of alignment between intent and action.",
        pattern: "Consistent with your 'Deep Work' phases on Tuesdays.",
        temporalContext: "Occurred during a high-energy cycle."
    };
};

export const analyzeQuote = async (text: string, author: string): Promise<QuoteAnalysis> => {
    await simulateDelay();
    return {
        meaning: "This wisdom suggests that internal perception dictates external reality.",
        themes: ["Stoicism", "Perception", "Control"],
        sentimentScore: 7,
        reflectionPrompt: "Where are you projecting fear onto a neutral situation today?"
    };
};

export const analyzeMoodPatterns = async (entries: MoodEntry[]): Promise<MoodAnalysis> => {
    await simulateDelay();
    return {
        overallTrend: "Stabilizing",
        triggers: ["Morning Routine", "Deep Work Completion"],
        prediction: "Energy levels likely to peak tomorrow mid-morning.",
        insight: "You report higher satisfaction when your mornings are structured.",
        actionableStep: "Protect your 8-10 AM window tomorrow."
    };
};

export const generateGlobalInsights = async (
    mockDataSummary: string
): Promise<GlobalAnalysis> => {
    await simulateDelay();
    return {
        weeklySummary: "You have moved from a phase of chaos into a phase of structured execution.",
        emotionalCycle: [
            { date: 'Mon', mood: 'neutral', value: 5 },
            { date: 'Tue', mood: 'focused', value: 7 },
            { date: 'Wed', mood: 'inspired', value: 9, event: 'Breakthrough' },
            { date: 'Thu', mood: 'tired', value: 4 },
            { date: 'Fri', mood: 'calm', value: 6 },
            { date: 'Sat', mood: 'joy', value: 8, event: 'Social' },
            { date: 'Sun', mood: 'calm', value: 7 }
        ],
        topics: [
            { id: '1', name: 'Systems', size: 9, relatedTopics: ['Automation', 'Flow'], x: 50, y: 50 },
            { id: '2', name: 'Identity', size: 7, relatedTopics: ['Habits', 'Stoicism'], x: 20, y: 30 },
            { id: '3', name: 'Energy', size: 6, relatedTopics: ['Sleep', 'Diet'], x: 80, y: 40 },
            { id: '4', name: 'Future', size: 5, relatedTopics: ['Goals'], x: 40, y: 80 },
        ],
        patterns: [
            { id: '1', type: 'behavior', title: 'Morning Momentum', description: 'Consistently high output when starting before 8 AM.', confidence: 92, impact: 'positive' },
            { id: '2', type: 'emotional', title: 'Sunday Reset', description: 'Anxiety decreases significantly after weekly planning.', confidence: 85, impact: 'positive' }
        ],
        lifeArc: {
            currentPhase: "The Architect",
            description: "You are currently designing the systems that will support your next leap.",
            progress: 72,
            nextPhasePrediction: "The Builder"
        },
        predictions: {
            mood: "Rising Confidence",
            energy: "Stable High",
            suggestion: "Leverage this stability to tackle the 'Project Nebula' milestone."
        }
    };
};

export const expandIdea = async (
    ideaTitle: string, 
    ideaDescription: string, 
    action: 'expand' | 'pivot' | 'connect'
): Promise<NonNullable<Idea['aiAnalysis']>> => {
    await simulateDelay();
    return {
        expansion: "To deepen this concept, consider integrating a feedback loop that learns from user hesitancy, not just action. The interface could 'breathe'—expanding when the user is focused, contracting when they need space.",
        gaps: ["Missing a mechanism for user override.", "Data privacy concerns in the neural layer."],
        nextSteps: ["Draft the API schema.", "Sketch the 'breathing' animation states."]
    };
};

export const breakdownGoal = async (
  title: string,
  description: string,
  type: string
): Promise<{ milestones: { title: string }[]; riskAnalysis: string[]; energyScore: number; suggestedHabit: string; motivation: string }> => {
  await simulateDelay();
  return {
    milestones: [
      { title: "Research & Discovery Phase" },
      { title: "Prototype Core Mechanic" },
      { title: "First User Feedback Loop" },
      { title: "Refine & Polish" }
    ],
    riskAnalysis: ["Scope creep in phase 2", "Energy dip mid-project"],
    energyScore: 7,
    suggestedHabit: "Daily 15-minute standup with self.",
    motivation: "This goal aligns perfectly with your 'Builder' identity arc."
  };
};

export const optimizeHabitStrategy = async (
  title: string,
  frequency: string,
  streak: number
): Promise<HabitAnalysis> => {
  await simulateDelay();
  return {
    identityAlignment: "This habit reinforces your identity as a disciplined creator.",
    suggestedMicroHabit: "Do the first 2 minutes only.",
    riskAnalysis: "Data shows you tend to skip this on weekends.",
    bestTimeOfDay: "07:00 AM"
  };
};

export const optimizeRoutine = async (
    blocks: RoutineBlock[],
    type: string
): Promise<RoutineAnalysis> => {
    await simulateDelay();
    return {
        energyScore: 8,
        flowSuggestion: "Move the high-cognitive load task to the second slot to allow for warmup.",
        bottleneck: "The transition between 'Deep Work' and 'Meeting' is too abrupt.",
        recommendedStartTime: "08:00 AM"
    };
};

export const analyzeEnergyLevels = async (
    metrics: EnergyMetrics
): Promise<EnergyAnalysis> => {
    await simulateDelay();
    // Simple logic-based mock
    const avg = (metrics.mind + metrics.body + metrics.emotion + metrics.focus) / 4;
    let zone: any = 'Low';
    if (avg > 80) zone = 'Peak';
    else if (avg > 60) zone = 'Flow';
    else if (avg > 40) zone = 'Calm';
    else if (avg > 20) zone = 'Recovery';

    return {
        currentZone: zone,
        forecast: "Energy expected to sustain for 90 more minutes.",
        recommendation: "Engage in creative synthesis now; save admin tasks for later.",
        peakTime: "10:00 AM - 11:30 AM"
    };
};

export const optimizeMilestone = async (
    title: string,
    type: string,
    parentContext: string
): Promise<MilestoneAnalysis> => {
    await simulateDelay();
    return {
        difficultyScore: 6,
        suggestedSubSteps: ["Gather resources", "Draft initial outline", "Review against requirements"],
        blockerDetection: "Potential dependency on external feedback.",
        energyRequirement: "Medium"
    };
};

export const generateWeeklyReview = async (
    data: WeeklyReviewData
): Promise<WeeklyReviewAnalysis> => {
    await simulateDelay();
    return {
        weeklyScore: 85,
        identityProgress: "You are solidifying the 'Architect' persona.",
        summary: "A strong week defined by high focus on Tuesday and Wednesday. Recovery protocols on Thursday prevented burnout.",
        trend: "up",
        insights: [
            "Your focus score correlates directly with morning hydration.",
            "Evening screen time negatively impacted Friday's energy."
        ],
        focusAreaSuggestion: ["Deep Work Rituals", "Sleep Consistency"]
    };
};

export const generateMonthlyReview = async (
    data: MonthlyReviewData
): Promise<MonthlyReviewAnalysis> => {
    await simulateDelay();
    return {
        theme: "The Month of Foundation",
        summary: "October was about setting the stage. You moved from scattered ideas to concrete structures. While energy fluctuated, your commitment to the 'Core' habits kept the baseline high.",
        score: 78,
        identityShift: "From Dreamer -> Builder",
        momentumRating: 8,
        stabilityRating: 7,
        highlights: ["Launched the MVP", "Maintained 14-day meditation streak", "Solved the 'Nebula' architecture problem"],
        lowlights: ["Missed workouts in Week 3", "High anxiety during the launch phase"],
        keyInsight: "Structure does not kill creativity; it protects it.",
        nextMonthAdvice: "Focus on optimizing the routine you built this month. Do not add more; refine what exists."
    };
};

export const generateYearlyReview = async (
    data: YearlyReviewData
): Promise<YearlyReviewAnalysis> => {
    await simulateDelay();
    return {
        theme: "The Year of Awakening",
        summary: "2023 was a year of radical shifts. You started with uncertainty but found your footing in Q2. The second half of the year was defined by aggressive execution and deep internal alignment. You transitioned from seeking permission to building sovereignty.",
        score: 92,
        identityLabel: "The Sovereign Individual",
        momentumRating: 9,
        stabilityRating: 8,
        identityRadar: [
            { subject: 'Discipline', A: 90, fullMark: 100 },
            { subject: 'Clarity', A: 85, fullMark: 100 },
            { subject: 'Momentum', A: 95, fullMark: 100 },
            { subject: 'Emotion', A: 70, fullMark: 100 },
            { subject: 'Resilience', A: 88, fullMark: 100 },
        ],
        narrativeChapters: [
            { month: "January", title: "The Fog", summary: "Started with confusion. Energy was low, goals were unclear.", mood: 'anxious' },
            { month: "March", title: "The Spark", summary: "First breakthrough. The 'Genesis' project began.", mood: 'inspired' },
            { month: "June", title: "The Grind", summary: "Heavy execution phase. High output, but burnout risk peaked.", mood: 'tired' },
            { month: "September", title: "The Pivot", summary: "Realized the original path was wrong. Shifted to 'Forge' architecture.", mood: 'focused' },
            { month: "December", title: "The Arrival", summary: "Systems stabilized. Identity solidified. Peace achieved.", mood: 'calm' }
        ],
        highlights: ["Career pivot success", "Physical transformation (gym streak > 100 days)", "Mastered a new language"],
        lowlights: ["Q1 burnout", "Lost touch with some friends", "Failed Project 'Drift'"],
        keyInsight: "Consistency beats intensity. The quiet work mattered more than the loud launches.",
        nextYearAdvice: "Begin 2024 with rest. You have earned the recovery. Then, scale what works."
    };
};

export const analyzeAchievement = async (
  title: string,
  description: string,
  category: AchievementCategory
): Promise<AchievementAnalysis> => {
  await simulateDelay();
  return {
      significanceScore: 8,
      identityShift: "This reinforces your emerging identity as a builder.",
      growthPattern: "Your achievements tend to cluster after periods of low energy, suggesting a 'recharge-and-sprint' pattern.",
      emotionalDriver: "Deep satisfaction from solving structural problems."
  };
};

export const generateIdentityAnalysis = async (): Promise<IdentityProfile> => {
  await simulateDelay();
  return {
    currentPhase: {
      id: 'p1',
      title: 'Era of Building Foundations',
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
      description: "You have moved past the initial chaos of ideation and are now concretizing your systems. This phase is characterized by high discipline and moderate emotional volatility.",
      moodBaseline: 'focused',
      energyAvg: 78
    },
    vector: "Resilient Builder in Emergence",
    evolutionScore: 82,
    archetype: 'Builder',
    traits: [
      { name: 'Consistency', score: 88 },
      { name: 'Creativity', score: 75 },
      { name: 'Resilience', score: 90 },
      { name: 'Clarity', score: 65 },
      { name: 'Empathy', score: 70 },
      { name: 'Courage', score: 80 },
    ],
    topDrivers: [
      { id: 'd1', name: 'Morning Routine', type: 'Habit', impact: 95, description: 'The 7 AM protocol is the single biggest predictor of your daily success.' },
      { id: 'd2', name: 'Desire for Autonomy', type: 'Belief', impact: 88, description: 'Your aversion to dependency fuels your learning speed.' },
      { id: 'd3', name: 'Project Nebula', type: 'Goal', impact: 85, description: 'This project is currently defining your professional identity.' }
    ],
    recentShifts: [
      { id: 's1', title: 'Shift to Sovereignty', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), type: 'Mindset', impactScore: 90, context: 'Realized you don’t need permission to ship.' },
      { id: 's2', title: 'Emotional Stabilization', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), type: 'Emotional', impactScore: 75, context: 'Recovery times from setbacks have dropped by 40%.' }
    ],
    futureProjection: {
      trajectory: "Accelerating towards mastery.",
      alignment: 74,
      nextPhasePrediction: "The Architect Phase",
      potentialTraps: ["Burnout from over-optimization", "Neglecting social connection"]
    }
  };
};

export const generateLifeThemesAnalysis = async (): Promise<LifeThemeAnalysis> => {
    await simulateDelay();
    
    const dominantThemes = [
        {
            id: 't1',
            title: 'The Architect',
            description: 'The drive to build, structure, and create lasting systems out of chaos.',
            status: 'dominant' as const,
            strength: 92,
            firstDetected: new Date('2023-01-15'),
            lastActive: new Date(),
            relatedMoods: ['focused', 'inspired'] as any[],
            archetypeIcon: 'compass' as const,
            colorSignature: '#22D3EE',
            evidence: ['Journal: "System Entropy"', 'Achievement: "Project Genesis"'],
            behaviors: [
                { id: 'b1', description: 'Systematizing daily workflows', type: 'habit' as const },
                { id: 'b2', description: 'Choosing structure over spontaneity', type: 'decision' as const }
            ],
            evolutionArc: 'Chaos -> Structure'
        },
        {
            id: 't2',
            title: 'The Hermit',
            description: 'A recurring need for deep solitude to process complex emotions and recharge.',
            status: 'dominant' as const,
            strength: 85,
            firstDetected: new Date('2022-06-10'),
            lastActive: new Date(Date.now() - 86400000 * 2),
            relatedMoods: ['calm', 'lonely'] as any[],
            archetypeIcon: 'feather' as const,
            colorSignature: '#7C3AED',
            evidence: ['Memory: "Rainy Cafe Reflection"', 'Habit: "Meditation"'],
            behaviors: [
                { id: 'b3', description: 'Retreating when stressed', type: 'avoidance' as const },
                { id: 'b4', description: 'Deep work sessions (4h+)', type: 'habit' as const }
            ],
            conflicts: [
                { 
                    id: 'c1', 
                    opposingThemeId: 't3', 
                    opposingThemeName: 'Connection', 
                    description: 'Solitude fueling work vs. loneliness impacting mood.', 
                    tensionLevel: 7,
                    resolutionHint: 'Schedule intentional social blocks.'
                }
            ],
            evolutionArc: 'Isolation -> Solitude'
        }
    ];

    const emergingThemes = [
        {
            id: 't3',
            title: 'Radical Self-Trust',
            description: 'Moving away from seeking external validation towards internal guidance.',
            status: 'emerging' as const,
            strength: 60,
            firstDetected: new Date('2023-09-01'),
            lastActive: new Date(),
            relatedMoods: ['inspired', 'anxious'] as any[],
            archetypeIcon: 'crown' as const,
            colorSignature: '#FCD34D',
            evidence: ['Quote: "Waste no more time..."', 'Milestone: "Launch MVP"'],
            behaviors: [
                { id: 'b5', description: 'Shipping imperfect work', type: 'decision' as const }
            ],
            evolutionArc: 'Doubt -> Confidence'
        }
    ];

    const quietThemes = [
        {
            id: 't4',
            title: 'The Observer',
            description: 'A subtle pattern of detachment and analysis rather than participation.',
            status: 'dormant' as const,
            strength: 30,
            firstDetected: new Date('2021-03-15'),
            lastActive: new Date(Date.now() - 86400000 * 14),
            relatedMoods: ['neutral', 'empty'] as any[],
            archetypeIcon: 'anchor' as const,
            colorSignature: '#94A3B8',
            evidence: ['Memory: "The Summit"'],
            behaviors: [],
            evolutionArc: 'Numbness -> Clarity'
        }
    ];

    // Generate mock timeline data
    const timelineData = [];
    const now = Date.now();
    for (let i = 0; i < 12; i++) {
        const date = new Date(now - (11 - i) * 30 * 24 * 60 * 60 * 1000);
        timelineData.push({
            date: date.toLocaleString('default', { month: 'short' }),
            themeId: 't1',
            intensity: 40 + Math.random() * 60
        });
        timelineData.push({
            date: date.toLocaleString('default', { month: 'short' }),
            themeId: 't2',
            intensity: 30 + Math.random() * 50
        });
         timelineData.push({
            date: date.toLocaleString('default', { month: 'short' }),
            themeId: 't3',
            intensity: i * 5 + Math.random() * 10
        });
    }

    return {
        currentSeasonSummary: "This season is characterized by a tension between 'The Architect' (Building) and 'The Hermit' (Withdrawal), with 'Radical Self-Trust' emerging as a bridge.",
        stabilityScore: 78,
        dominantThemes,
        emergingThemes,
        quietThemes,
        timelineData,
        reflectionPrompts: [
            "In what ways is your need for solitude currently serving your architectural goals?",
            "Where are you still seeking permission instead of trusting your own judgment?",
            "What outdated identity is 'The Architect' trying to protect you from?"
        ]
    };
};

export const generateShadowAnalysis = async (): Promise<ShadowAnalysis> => {
  await simulateDelay();
  return {
    primaryShadow: "The Perfectionist / Imposter",
    supportingShadows: ["Isolation Reflex", "Control Loop"],
    tensionScore: 78,
    avoidanceIndex: 65,
    emotionalRoots: [
      "Fear of being seen as incompetent",
      "Unmet need for unconditional acceptance",
      "Suppressed anger at wasted time"
    ],
    masks: [
      {
        id: "m1",
        name: "Hyper-Productivity",
        protecting: "Fear of worthlessness",
        triggeredBy: "Silence, perceived failure",
        description: "You over-work to prove your value, avoiding the quiet where doubts arise.",
        icon: "shield"
      },
      {
        id: "m2",
        name: "Intellectualization",
        protecting: "Vulnerability",
        triggeredBy: "Emotional conflict",
        description: "You analyze feelings instead of feeling them, creating distance from pain.",
        icon: "mask"
      }
    ],
    conflicts: [
      {
        id: "c1",
        desire: "Deep Connection",
        fear: "Rejection / Exposure",
        manifestation: "Withdrawing when people get too close",
        tensionLevel: 8
      },
      {
        id: "c2",
        desire: "Rest / Ease",
        fear: "Irrelevance",
        manifestation: "Guilt whenever not working",
        tensionLevel: 6
      }
    ],
    limitingBeliefs: [
      { id: "b1", statement: "I am only as good as my last output.", intensity: 9, consequences: ["Burnout", "Anxiety"] },
      { id: "b2", statement: "If I stop pushing, everything falls apart.", intensity: 7, consequences: ["Inability to relax", "Sleep issues"] }
    ],
    transmutation: {
      shadow: "Fear of Inadequacy",
      gift: "Mastery & Excellence",
      path: "Shifting from 'proving' to 'improving'."
    },
    integrationSteps: [
      "Practice 'good enough' shipping for one low-stakes project this week.",
      "Spend 10 minutes in silence without reaching for a device.",
      "Admit a small struggle to a trusted friend."
    ],
    reflectionPrompts: [
      "Who would you be if you didn't have to impress anyone?",
      "What is the tired part of you trying to say?",
      "Where did you learn that rest must be earned?"
    ],
    shadowTimeline: [
      { date: "Mon", intensity: 40, trigger: "Start of week pressure" },
      { date: "Tue", intensity: 60, trigger: "Deadline proximity" },
      { date: "Wed", intensity: 85, trigger: "Mid-week fatigue" },
      { date: "Thu", intensity: 50, trigger: "Recovery" },
      { date: "Fri", intensity: 30, trigger: "Flow state" },
      { date: "Sat", intensity: 20, trigger: "Social distraction" },
      { date: "Sun", intensity: 70, trigger: "Sunday scaries / Anticipation" }
    ]
  };
};

export const generateCompassAnalysis = async (): Promise<CompassData> => {
  await simulateDelay();
  return {
    northStar: {
      statement: "Become a world-class builder of meaningful digital worlds.",
      whyItMatters: "To express the deepest parts of my creativity and provide utility to others, achieving autonomy.",
      timeHorizon: "5 years",
      resonanceScore: 8.5
    },
    currentPhase: "Ascent",
    alignmentScore: 72,
    driftScore: 28,
    driftSources: ["Excessive consumption of tech news", "Perfectionism in planning phase", "Saying yes to low-leverage social events"],
    horizons: [
      {
        level: '1Y',
        vision: "Ship the Forge OS MVP and achieve 100 true fans. Establish a physical health baseline of daily movement.",
        domains: [
          { name: 'Work', status: 'on-track', anchorGoal: 'Launch v1.0' },
          { name: 'Health', status: 'at-risk', anchorGoal: 'Run 10k' },
          { name: 'Inner', status: 'on-track', anchorGoal: 'Daily Meditation' }
        ]
      },
      {
        level: '3Y',
        vision: "Financial independence through IP. Leading a small, high-trust team. Living in a location that feeds the soul.",
        domains: [
          { name: 'Wealth', status: 'on-track', anchorGoal: '$10k MRR' },
          { name: 'Relationships', status: 'drifting', anchorGoal: 'Core Tribe' }
        ]
      },
      {
        level: '5Y',
        vision: "Recognized as a master craftsman. Teaching others. Deep peace and integration of shadow.",
        domains: [
          { name: 'Mastery', status: 'on-track', anchorGoal: 'Magnum Opus' },
          { name: 'Legacy', status: 'on-track', anchorGoal: 'Mentorship' }
        ]
      }
    ],
    tracks: [
      { id: 't1', title: 'Engineering Mastery', linkedThemeId: 't1', horizon: '5Y', status: 'active', momentum: 85, progress: 40 },
      { id: 't2', title: 'Physical Foundation', linkedThemeId: 't5', horizon: '1Y', status: 'active', momentum: 60, progress: 25 },
      { id: 't3', title: 'Inner Citadel', linkedThemeId: 't2', horizon: '3Y', status: 'active', momentum: 90, progress: 65 }
    ],
    nextQuarterFocus: {
      themes: ["Creation", "Health", "Depth"],
      goals: ["Ship Module X", "Correct Sleep Cycle", "Read 5 Core Books"]
    }
  };
};
