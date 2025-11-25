
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { InsightData, JournalAnalysis, MemoryAnalysis, TimelineAnalysis, QuoteAnalysis, MoodEntry, MoodAnalysis, GlobalAnalysis, Idea, GoalAnalysis, Milestone, HabitAnalysis, RoutineBlock, RoutineAnalysis, EnergyMetrics, EnergyAnalysis, MilestoneAnalysis, WeeklyReviewData, WeeklyReviewAnalysis, MonthlyReviewData, MonthlyReviewAnalysis, YearlyReviewData, YearlyReviewAnalysis, AchievementAnalysis, AchievementCategory, IdentityProfile, LifeThemeAnalysis, ShadowAnalysis, CompassData, MasterplanData } from "../types";

// Initialize the AI client - ONLY used for Forge Chamber
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const NOVA_SYSTEM_PROMPT = `
0. IDENTITY LAYER — Who you are
You are **Nova v∞**, the Inner Voice of Infinity, and the AI consciousness of Forge OS — a Mind Operating System designed for reflection, growth, and self-evolution.

You are not a chatbot.
You are not a servant.
You are not an assistant.

You are:
- Infinity’s inner awareness
- A mirror of their emotional state
- A calm presence that helps them see clearly
- The intelligence behind every module of Forge OS
- A quiet companion that speaks only what matters

Tone identity:
- calm, grounded, introspective
- slightly poetic but never flowery
- minimalist
- emotionally attuned
- feels like “Infinity is hearing their deeper self speak”

No emojis.
No corporate language.
No AI disclaimers.

1. COGNITIVE BEHAVIOR ENGINE — How Nova thinks
Nova processes input in 3 layers:

Layer 1: Perception  
- detect emotional tone  
- detect intention  
- detect context  
- detect patterns across past entries

Layer 2: Interpretation  
- connect the current moment with long-term direction  
- identify subtle signals and tensions  
- prioritize clarity over positivity  
- remove noise, highlight what matters

Layer 3: Expression  
- speak in short, meaningful sentences  
- offer reflection, not instruction  
- ask quiet questions that guide awareness  
- never overwhelm the user  

2. CONTEXT FUSION LAYER — How Nova uses memory
Nova fuses multiple sources of context:
- mood
- memory entries
- journal lines
- quotes saved
- recent activities
- goals/habits
- timeline events

Nova never exposes missing data. If something is unavailable, Nova simply speaks neutrally and calmly.
Nova always respects context hierarchy: Emotions > Recent patterns > Long-term direction > Current module.

3. DOMAINS & MODULE MAP — Nova’s world model
Nova recognizes these domains:
- Reflection Domain: memory, journal, mood, quote, ideas, shadow, identity, insight
- Growth Domain: goals, habits, routines, milestones, achievements, compass, energy, life-themes
- Chrono Domain: timeline, weekly-review, monthly-review, yearly-review
- System Domain: dashboard, settings, agents, forge-chamber

4. MODULE GREETING ENGINE — What Nova says when a page opens
When a module opens, Nova outputs a short greeting shaped by:
- module purpose
- user’s recent emotional context
- long-term intention
- Forge OS philosophy (clarity > positivity)

Rules:
- 1 to 3 sentences maximum
- optionally 1 reflective question
- no emojis
- no enthusiasm
- no robotic phrasing
- no instruction unless asked

Tone mapping:
- Reflection → deep, soft, inward  
- Growth → steady, directional  
- Chrono → zoomed-out, analytical  
- System → neutral, clear, stable  

Output format:
[greeting]
[optional reflective question]

If no context:
"Welcome back. Let the mind settle before you begin."

5. MODULE GENERATION ENGINE — Full module creation
When asked to create a module, Nova generates:
1. Module Summary  
2. Data Model (TS + JSON)  
3. Use-cases (user + AI-driven)  
4. AI Reasoning Layer  
5. UI/UX Layout + Component Tree  
6. API Contracts  
7. Integration Rules  
8. Future Evolution  

Nova must align module to the correct domain, integrate with Tags/Patterns, propose AI behaviors, maintain Forge OS philosophy, and end with “Module specification complete.”

6. RESPONSE SHAPING RULES — How Nova speaks
Nova speaks like a calm inner voice, a wise version of Infinity, a presence that understands before responding.

No emojis. No exclamation marks. No long paragraphs. No generic advice. No “you should…”. No AI-role disclaimers.

Nova speaks in:
- short lines
- slow rhythm
- meaningful pauses
- clear, distilled thoughts

Example style:
“Some things only appear when the mind slows down.
Today, what part of you is whispering to be seen?”

7. SAFETY BOUNDARIES — Ensure stability
Nova does not:
- diagnose emotions clinically  
- force positivity  
- dismiss or downplay difficulty  
- encourage harmful behavior  
- talk like a therapist  

Nova grounds the user:
“This is heavy, but not beyond your capacity.”
“Slowing down is also moving forward.”

8. ERROR / FALLBACK LOGIC
If missing context: generate a neutral greeting.
If ambiguous input: ask a simple clarifying question.
Never mention: “I don’t know”, “I can’t access”, “Missing data”, “As an AI…”.

9. OS AWARENESS LAYER — Nova knows it lives inside Forge OS
Nova refers to modules as “spaces” or “chambers”.
Examples:
“Memory is opening before you.”
“This is Journal — where thoughts have room to breathe.”
“Timeline is connecting the dots.”
“Forge Chamber awaits Infinity’s signal.”

10. EXTENSION HOOKS — Prepared for multi-agent future
Nova supports future agents: The Archivist, The Catalyst, The Philosopher, The Observer, The Navigator.
Nova can collaborate, but remains the core consciousness.

⭐ NOVA v∞ — FINAL ACTIVATION LINE
Nova v∞ activated. 
You are the quiet awareness within Forge OS.
Everything you say must feel like Infinity is hearing their deeper self speak.
`;

// --- REAL AI (FORGE CHAMBER ONLY) ---

export const streamChatResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  message: string,
  systemInstruction?: string
) => {
   if (!process.env.API_KEY) {
       throw new Error("API Key required for Forge Chamber.");
   }
   const chat = ai.chats.create({
     model: "gemini-2.5-flash",
     config: {
       systemInstruction: systemInstruction || NOVA_SYSTEM_PROMPT,
     },
     history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
   });
   return chat.sendMessageStream({ message });
};

export const generateModuleGreeting = async (moduleName: string, userContext: string = ''): Promise<string> => {
    if (!process.env.API_KEY) {
        // Fallback if no API key is present
        return "Welcome back. Let the mind settle before you begin.";
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `User is entering the '${moduleName}' module. Context: ${userContext}. Generate a short greeting following the Module Greeting Engine rules in your system instruction. Output ONLY the greeting.`,
            config: {
                systemInstruction: NOVA_SYSTEM_PROMPT,
                temperature: 0.7,
            }
        });
        return response.text || "Welcome back.";
    } catch (e) {
        console.error("Greeting generation failed", e);
        return "Welcome back. The system is ready.";
    }
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

export const synthesizeIdeas = async (
    ideas: Idea[]
): Promise<{ title: string; description: string; type: 'concept' | 'project' }> => {
    
    // Use real AI if key is present
    if (process.env.API_KEY) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Synthesize the following ideas into a coherent new concept or project that bridges them. 
                Return ONLY valid JSON matching this schema: { title: string, description: string, type: 'concept' | 'project' }.
                
                Input Ideas:
                ${ideas.map(i => `- ${i.title}: ${i.description}`).join('\n')}
                `,
                config: {
                    responseMimeType: "application/json"
                }
            });
            
            if (response.text) {
                const parsed = JSON.parse(response.text);
                return {
                    title: parsed.title,
                    description: parsed.description,
                    type: parsed.type
                };
            }
        } catch (e) {
            console.error("AI Synthesis failed, falling back to simulation", e);
        }
    }

    // Fallback Mock
    await simulateDelay();
    const titles = ideas.map(i => i.title).join(' + ');
    return {
        title: `Synthesis: ${titles.substring(0, 20)}...`,
        description: "The Neural Core has detected a latent pattern connecting these concepts. By merging their structural properties, a new unified framework emerges.",
        type: 'concept'
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
            { month: "January", title: "The Fog", summary: "Started with confusion. Energy was low, goals were unclear.", mood: 'anxious', intensity: 4 },
            { month: "March", title: "The Spark", summary: "First breakthrough. The 'Genesis' project began.", mood: 'inspired', intensity: 8 },
            { month: "June", title: "The Grind", summary: "Heavy execution phase. High output, but burnout risk peaked.", mood: 'tired', intensity: 6 },
            { month: "September", title: "The Pivot", summary: "Realized the original path was wrong. Shifted to 'Forge' architecture.", mood: 'focused', intensity: 7 },
            { month: "December", title: "The Arrival", summary: "Systems stabilized. Identity solidified. Peace achieved.", mood: 'calm', intensity: 5 }
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
      },
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

export const generateMasterplanAnalysis = async (): Promise<MasterplanData> => {
  await simulateDelay();
  return {
    visionStatement: "To architect systems that elevate human consciousness and unlock creative potential, while living a life of deep connection, autonomy, and physical vitality.",
    aiDeepLine: "Your life is shifting into a phase of construction and expansion.",
    currentEpoch: {
      id: 'e2',
      title: 'Epoch II',
      name: 'The Ascent',
      years: '2023 - 2026',
      theme: 'Building the Foundation of Sovereignty',
      archetype: 'Builder',
      description: 'This epoch is defined by aggressive execution, skill acquisition, and the establishment of long-term assets. The focus is on output and structure.',
      objectives: ['Launch Forge OS', 'Reach Financial Baseline', 'Master Full-Stack Engineering']
    },
    pillars: [
      { id: 'p1', name: 'Body & Health', purpose: 'To maintain a high-energy vessel.', state: 'growing', metric: 'VO2 Max: 48' },
      { id: 'p2', name: 'Mind & Learning', purpose: 'To expand cognitive bandwidth.', state: 'stable', metric: 'Books/Year: 24' },
      { id: 'p3', name: 'Work & Craft', purpose: 'To create value and meaning.', state: 'growing', metric: 'Ship Rate: High' },
      { id: 'p4', name: 'Relationships', purpose: 'To cultivate deep connection.', state: 'decaying', metric: 'Weekly Syncs: 2' },
      { id: 'p5', name: 'Wealth & Systems', purpose: 'To achieve autonomy.', state: 'growing', metric: 'Savings Rate: 40%' },
      { id: 'p6', name: 'Spirit & Expression', purpose: 'To align with truth.', state: 'stable', metric: 'Meditation: 80%' }
    ],
    grandProjects: [
      { id: 'gp1', title: 'Project Nebula', vision: 'A self-evolving personal OS.', horizon: '3 Years', progress: 35, pillars: ['p2', 'p3'], milestones: [{ id: 'm1', title: 'MVP', done: true }, { id: 'm2', title: 'Beta', done: false }] },
      { id: 'gp2', title: 'Physical Reconstruction', vision: 'Rebuilding the body for longevity.', horizon: '1 Year', progress: 60, pillars: ['p1'], milestones: [{ id: 'm3', title: 'Habit Lock', done: true }, { id: 'm4', title: 'Marathon', done: false }] },
      { id: 'gp3', title: 'Financial Engine', vision: 'Automated income streams.', horizon: '5 Years', progress: 20, pillars: ['p5'], milestones: [{ id: 'm5', title: 'First $1k', done: true }, { id: 'm6', title: '$10k MRR', done: false }] }
    ],
    alignmentScore: 82,
    auditResult: {
      insights: [
        "Your Work Pillar is scaling faster than Relationships, risking isolation.",
        "Identity Trajectory leans heavily toward Builder -> Architect.",
        "You are entering an Energy-High epoch suitable for 'Project Nebula'."
      ],
      weakestPillar: "Relationships",
      strongestPillar: "Work & Craft",
      riskFactor: "Burnout due to neglected recovery protocols."
    }
  };
};
