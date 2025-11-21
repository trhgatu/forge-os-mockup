
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { InsightData, JournalAnalysis, MemoryAnalysis, TimelineAnalysis, QuoteAnalysis, MoodEntry, MoodAnalysis, GlobalAnalysis, Idea, GoalAnalysis, Milestone, HabitAnalysis, RoutineBlock, RoutineAnalysis, EnergyMetrics, EnergyAnalysis, MilestoneAnalysis, WeeklyReviewData, WeeklyReviewAnalysis, MonthlyReviewData, MonthlyReviewAnalysis } from "../types";

// Initialize the AI client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDailyInsight = async (): Promise<InsightData> => {
  if (!process.env.API_KEY) {
    return {
      quote: "The mind is everything. What you think you become.",
      author: "Buddha",
      theme: "Mindfulness"
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a short, cryptic but inspiring philosophical insight for a futuristic operating system user (Forge OS). Keep it under 20 words. Return a JSON object with the following keys: 'quote', 'author' (can be 'System' or a philosopher), and 'theme'. Do not use Markdown formatting.",
      config: {
        responseMimeType: "application/json",
        // Schema removed to prevent intermittent 500 Internal Errors on simple generation tasks
      },
    });
    
    let text = response.text;
    if (!text) throw new Error("No response from AI");

    // Clean up potential markdown formatting or extra characters
    // This fixes "Unexpected non-whitespace character" errors
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    
    if (startIndex !== -1 && endIndex !== -1) {
        text = text.substring(startIndex, endIndex + 1);
    }
    
    return JSON.parse(text) as InsightData;
  } catch (error) {
    console.error("Failed to fetch insight:", error);
    return {
      quote: "System offline. Reflection is internal.",
      author: "Forge OS Kernel",
      theme: "Resilience"
    };
  }
};

export const streamChatResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  message: string
) => {
   const chat = ai.chats.create({
     model: "gemini-2.5-flash",
     config: {
       systemInstruction: "You are Forge, an advanced AI assistant within the Forge OS. You are helpful, concise, and speak with a slightly futuristic, calm tone. You help the user organize their thoughts and develop ideas.",
     }
   });
   return chat.sendMessageStream({ message });
};

export const analyzeJournalEntry = async (text: string): Promise<JournalAnalysis> => {
  if (!text || text.length < 10) {
    // Mock response for empty or very short text to save API calls
    return {
      sentimentScore: 5,
      keywords: ["Silence"],
      summary: "Not enough data to analyze.",
      suggestedAction: "Keep writing to uncover deeper thoughts."
    };
  }

  if (!process.env.API_KEY) {
     return {
        sentimentScore: 7,
        keywords: ["Simulated", "Offline"],
        summary: "AI Analysis requires an API Key. This is a simulated response.",
        suggestedAction: "Connect to the Neural Net."
     }
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following journal entry. Return JSON with:
      - sentimentScore (number 1-10, where 1 is negative/anxious, 10 is positive/inspired)
      - keywords (array of 3-5 strings capturing the themes)
      - summary (one philosophical sentence summarizing the core realization)
      - suggestedAction (one short, concrete step for the user)
      
      Entry: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                sentimentScore: { type: Type.NUMBER },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                summary: { type: Type.STRING },
                suggestedAction: { type: Type.STRING }
            },
            required: ["sentimentScore", "keywords", "summary", "suggestedAction"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No analysis returned");
    return JSON.parse(resultText) as JournalAnalysis;

  } catch (error) {
    console.error("Journal Analysis Failed:", error);
    return {
      sentimentScore: 5,
      keywords: ["Error", "Offline"],
      summary: "Neural link unstable. Analysis failed.",
      suggestedAction: "Try again later."
    };
  }
};

export const analyzeMemory = async (text: string): Promise<MemoryAnalysis> => {
  if (!process.env.API_KEY) {
     return {
        coreMeaning: "Simulation Mode: Deep meaning requires connectivity.",
        emotionalPattern: "Pattern analysis unavailable.",
        timelineConnection: "No connection found.",
        sentimentScore: 5
     };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this memory description for a personal archive. Return JSON.
      
      Memory: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                coreMeaning: { type: Type.STRING, description: "A philosophical summary of why this memory matters." },
                emotionalPattern: { type: Type.STRING, description: "What emotional habit or pattern does this represent?" },
                timelineConnection: { type: Type.STRING, description: "A hypothetical connection to past or future self." },
                sentimentScore: { type: Type.NUMBER }
            },
            required: ["coreMeaning", "emotionalPattern", "timelineConnection", "sentimentScore"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No analysis returned");
    return JSON.parse(resultText) as MemoryAnalysis;
  } catch (error) {
    console.error("Memory Analysis Failed:", error);
    return {
        coreMeaning: "Analysis failed due to signal interruption.",
        emotionalPattern: "Unknown.",
        timelineConnection: "Unknown.",
        sentimentScore: 5
    };
  }
};

export const analyzeTimelineItem = async (itemType: string, content: string): Promise<TimelineAnalysis> => {
    if (!process.env.API_KEY) {
        return {
            significance: "Connection offline. Temporal significance unknown.",
            pattern: "Pattern analysis unavailable.",
            temporalContext: "Time distortion detected."
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze this timeline item of type '${itemType}'. Return JSON.
            
            Content: "${content}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        significance: { type: Type.STRING, description: "Why this specific moment matters in a life context." },
                        pattern: { type: Type.STRING, description: "Recurring theme or habit detected." },
                        temporalContext: { type: Type.STRING, description: "How this relates to the flow of time." }
                    },
                    required: ["significance", "pattern", "temporalContext"]
                }
            }
        });
        const resultText = response.text;
        if (!resultText) throw new Error("No analysis returned");
        return JSON.parse(resultText) as TimelineAnalysis;
    } catch (error) {
        console.error("Timeline Analysis Failed", error);
        return {
            significance: "Analysis Failed.",
            pattern: "Unknown.",
            temporalContext: "Unknown."
        };
    }
};

export const analyzeQuote = async (text: string, author: string): Promise<QuoteAnalysis> => {
    if (!process.env.API_KEY) {
        return {
            meaning: "Simulated: A profound statement about human nature.",
            themes: ["Simulation", "Philosophy"],
            sentimentScore: 8,
            reflectionPrompt: "How does this apply to your current simulation?"
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze this quote deeply. Return JSON.
            Quote: "${text}" by ${author}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        meaning: { type: Type.STRING, description: "Hidden philosophical meaning." },
                        themes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        sentimentScore: { type: Type.NUMBER },
                        reflectionPrompt: { type: Type.STRING, description: "A question for the user to ask themselves based on this quote." }
                    },
                    required: ["meaning", "themes", "sentimentScore", "reflectionPrompt"]
                }
            }
        });
        const resultText = response.text;
        if (!resultText) throw new Error("No analysis returned");
        return JSON.parse(resultText) as QuoteAnalysis;
    } catch (error) {
        console.error("Quote Analysis Failed", error);
        return {
            meaning: "Analysis interrupted.",
            themes: [],
            sentimentScore: 5,
            reflectionPrompt: "Why do we seek meaning?"
        };
    }
};

export const analyzeMoodPatterns = async (entries: MoodEntry[]): Promise<MoodAnalysis> => {
    if (!process.env.API_KEY) {
        return {
            overallTrend: "Stable",
            triggers: ["Simulation Data"],
            prediction: "Likely calm with intermittent creative bursts.",
            insight: "Simulated pattern: You tend to be productive in the mornings.",
            actionableStep: "Continue monitoring emotional baseline."
        };
    }

    const dataSummary = entries.map(e => 
        `${e.date.toLocaleDateString()}: Mood=${e.mood}, Intensity=${e.intensity}, Tags=${e.tags.join(',')}`
    ).join('\n');

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze these mood logs. Return JSON.
            Data:
            ${dataSummary}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallTrend: { type: Type.STRING, description: "E.g. Rising, Volatile, Stable" },
                        triggers: { type: Type.ARRAY, items: { type: Type.STRING } },
                        prediction: { type: Type.STRING, description: "Forecast for next 24h" },
                        insight: { type: Type.STRING, description: "Deep psychological pattern identified" },
                        actionableStep: { type: Type.STRING }
                    },
                    required: ["overallTrend", "triggers", "prediction", "insight", "actionableStep"]
                }
            }
        });
        const resultText = response.text;
        if (!resultText) throw new Error("No analysis returned");
        return JSON.parse(resultText) as MoodAnalysis;
    } catch (error) {
        console.error("Mood Analysis Failed", error);
        return {
            overallTrend: "Unknown",
            triggers: [],
            prediction: "Insufficient data.",
            insight: "Analysis failed.",
            actionableStep: "Try logging more data."
        };
    }
};

export const generateGlobalInsights = async (
    mockDataSummary: string
): Promise<GlobalAnalysis> => {
    if (!process.env.API_KEY) {
        return {
            weeklySummary: "Simulation Mode: You have been highly productive in creative areas.",
            emotionalCycle: [
                { date: 'Mon', mood: 'neutral', value: 5 },
                { date: 'Tue', mood: 'focused', value: 7 },
                { date: 'Wed', mood: 'inspired', value: 9, event: 'Project Start' },
                { date: 'Thu', mood: 'tired', value: 4 },
                { date: 'Fri', mood: 'calm', value: 6 },
                { date: 'Sat', mood: 'joy', value: 8, event: 'Social' },
                { date: 'Sun', mood: 'calm', value: 7 }
            ],
            topics: [
                { id: '1', name: 'Philosophy', size: 9, relatedTopics: ['Stoicism', 'Mind'], x: 50, y: 50 },
                { id: '2', name: 'Design', size: 7, relatedTopics: ['UI/UX', 'Systems'], x: 20, y: 30 },
                { id: '3', name: 'Code', size: 6, relatedTopics: ['React', 'AI'], x: 80, y: 40 },
                { id: '4', name: 'Nature', size: 5, relatedTopics: ['Hiking'], x: 40, y: 80 },
            ],
            patterns: [
                { id: '1', type: 'behavior', title: 'Creative Night Owl', description: 'You tend to have breakthrough ideas after 10 PM.', confidence: 85, impact: 'positive' },
                { id: '2', type: 'emotional', title: 'Post-Project Dip', description: 'Energy levels consistently drop 2 days after completing a milestone.', confidence: 70, impact: 'negative' }
            ],
            lifeArc: {
                currentPhase: "Foundation Building",
                description: "You are currently establishing core habits and systems for long-term growth.",
                progress: 65,
                nextPhasePrediction: "Acceleration"
            },
            predictions: {
                mood: "Rising Optimism",
                energy: "Stable",
                suggestion: "Great time to start the complex module you've been postponing."
            }
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Act as a 'Data Scientist of the Self'. Analyze the following summary of user activity (Journal, Memory, Mood) and generate a holistic report.
            
            Input Summary:
            ${mockDataSummary}
            
            Return JSON matching the GlobalAnalysis schema.
            For emotionalCycle, generate 7 days of data points.
            For topics, generate 4-6 clustered topics with x/y coordinates (0-100) for visualization.
            For patterns, identify behavioral or emotional habits.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        weeklySummary: { type: Type.STRING },
                        emotionalCycle: { 
                            type: Type.ARRAY, 
                            items: { 
                                type: Type.OBJECT,
                                properties: {
                                    date: { type: Type.STRING },
                                    mood: { type: Type.STRING },
                                    value: { type: Type.NUMBER },
                                    event: { type: Type.STRING }
                                }
                            } 
                        },
                        topics: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    size: { type: Type.NUMBER },
                                    relatedTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    x: { type: Type.NUMBER },
                                    y: { type: Type.NUMBER }
                                }
                            }
                        },
                        patterns: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    type: { type: Type.STRING, enum: ['behavior', 'emotional', 'cognitive'] },
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    confidence: { type: Type.NUMBER },
                                    impact: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] }
                                }
                            }
                        },
                        lifeArc: {
                            type: Type.OBJECT,
                            properties: {
                                currentPhase: { type: Type.STRING },
                                description: { type: Type.STRING },
                                progress: { type: Type.NUMBER },
                                nextPhasePrediction: { type: Type.STRING }
                            }
                        },
                        predictions: {
                            type: Type.OBJECT,
                            properties: {
                                mood: { type: Type.STRING },
                                energy: { type: Type.STRING },
                                suggestion: { type: Type.STRING }
                            }
                        }
                    },
                    required: ["weeklySummary", "emotionalCycle", "topics", "patterns", "lifeArc", "predictions"]
                }
            }
        });

        const resultText = response.text;
        if (!resultText) throw new Error("No analysis returned");
        return JSON.parse(resultText) as GlobalAnalysis;

    } catch (error) {
        console.error("Global Analysis Failed", error);
        // Return fallback
        return {
             weeklySummary: "Analysis unavailable.",
             emotionalCycle: [],
             topics: [],
             patterns: [],
             lifeArc: { currentPhase: "Unknown", description: "", progress: 0, nextPhasePrediction: "" },
             predictions: { mood: "", energy: "", suggestion: "" }
        };
    }
};

export const expandIdea = async (
    ideaTitle: string, 
    ideaDescription: string, 
    action: 'expand' | 'pivot' | 'connect'
): Promise<NonNullable<Idea['aiAnalysis']>> => {
    if (!process.env.API_KEY) {
        return {
            expansion: "Simulation Mode: Expanding this idea involves exploring adjacent possibilities.",
            gaps: ["Missing technical details", "Target audience undefined"],
            nextSteps: ["Draft outline", "Research competitors"]
        };
    }

    const prompts = {
        expand: "Expand this idea with depth, details, and potential structure.",
        pivot: "Suggest a radically different direction or application for this idea.",
        connect: "Suggest 3 disparate fields or concepts that could connect to this idea."
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Act as a creative strategist. ${prompts[action]}
            
            Idea: ${ideaTitle}
            Context: ${ideaDescription}
            
            Return JSON.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        expansion: { type: Type.STRING, description: "A rich paragraph expanding the concept." },
                        gaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Potential missing links or questions." },
                        nextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Concrete actions to take." }
                    },
                    required: ["expansion", "gaps", "nextSteps"]
                }
            }
        });
        const resultText = response.text;
        if (!resultText) throw new Error("No analysis returned");
        return JSON.parse(resultText) as NonNullable<Idea['aiAnalysis']>;
    } catch (error) {
        console.error("Idea Expansion Failed", error);
        return {
            expansion: "Analysis failed.",
            gaps: [],
            nextSteps: []
        };
    }
};

export const breakdownGoal = async (
  title: string,
  description: string,
  type: string
): Promise<{ milestones: { title: string }[]; riskAnalysis: string[]; energyScore: number; suggestedHabit: string; motivation: string }> => {
  if (!process.env.API_KEY) {
    return {
      milestones: [
        { title: "Define clear scope" },
        { title: "First prototype" },
        { title: "Review and refine" }
      ],
      riskAnalysis: ["Scope creep", "Low energy"],
      energyScore: 7,
      suggestedHabit: "Daily 15min review",
      motivation: "This aligns with your desire for growth."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Act as a strategic performance coach. Break down this goal.
      
      Goal: ${title}
      Type: ${type}
      Description: ${description}
      
      Return JSON with 3-5 concrete milestones, potential risks, an estimated energy requirement (1-10), a suggested supporting habit, and a motivational reason why this matters.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            milestones: { 
              type: Type.ARRAY, 
              items: { type: Type.OBJECT, properties: { title: { type: Type.STRING } } } 
            },
            riskAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } },
            energyScore: { type: Type.NUMBER },
            suggestedHabit: { type: Type.STRING },
            motivation: { type: Type.STRING }
          },
          required: ["milestones", "riskAnalysis", "energyScore", "suggestedHabit", "motivation"]
        }
      }
    });
    
    const resultText = response.text;
    if (!resultText) throw new Error("No analysis returned");
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Goal Breakdown Failed", error);
    return {
      milestones: [{ title: "Start small" }],
      riskAnalysis: ["Unknown"],
      energyScore: 5,
      suggestedHabit: "Consistency",
      motivation: "Keep moving forward."
    };
  }
};

export const optimizeHabitStrategy = async (
  title: string,
  frequency: string,
  streak: number
): Promise<HabitAnalysis> => {
  if (!process.env.API_KEY) {
    return {
      identityAlignment: "Simulation: This habit reinforces a core discipline.",
      suggestedMicroHabit: "Do it for just 2 minutes.",
      riskAnalysis: "Pattern shows weekend drop-off.",
      bestTimeOfDay: "Morning"
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Act as a behavioral psychologist (Atomic Habits style). Analyze this habit strategy.
      
      Habit: ${title}
      Frequency: ${frequency}
      Current Streak: ${streak}
      
      Return JSON with:
      1. Identity Alignment (e.g., "This makes you a writer")
      2. Suggested Micro Habit (a 2-minute version)
      3. Risk Analysis (potential failure points)
      4. Best Time of Day
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identityAlignment: { type: Type.STRING },
            suggestedMicroHabit: { type: Type.STRING },
            riskAnalysis: { type: Type.STRING },
            bestTimeOfDay: { type: Type.STRING }
          },
          required: ["identityAlignment", "suggestedMicroHabit", "riskAnalysis", "bestTimeOfDay"]
        }
      }
    });
    
    const resultText = response.text;
    if (!resultText) throw new Error("No analysis returned");
    return JSON.parse(resultText) as HabitAnalysis;
  } catch (error) {
    console.error("Habit Optimization Failed", error);
    return {
      identityAlignment: "Aligns with personal growth.",
      suggestedMicroHabit: "Start small.",
      riskAnalysis: "Inconsistency.",
      bestTimeOfDay: "Anytime"
    };
  }
};

export const optimizeRoutine = async (
    blocks: RoutineBlock[],
    type: string
): Promise<RoutineAnalysis> => {
    if (!process.env.API_KEY) {
        return {
            energyScore: 8,
            flowSuggestion: "Simulation: Move high-energy tasks to the start.",
            bottleneck: "Break duration insufficient.",
            recommendedStartTime: "08:00 AM"
        };
    }

    const blocksText = blocks.map(b => `- ${b.title} (${b.duration}m, impact: ${b.energyImpact})`).join('\n');

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Act as a productivity and energy management expert. Analyze this routine flow.
            
            Routine Type: ${type}
            Blocks:
            ${blocksText}
            
            Return JSON with:
            1. Energy Score (1-10 sustainability)
            2. Flow Suggestion (how to order better)
            3. Potential Bottleneck
            4. Recommended Start Time based on circadian rhythm
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        energyScore: { type: Type.NUMBER },
                        flowSuggestion: { type: Type.STRING },
                        bottleneck: { type: Type.STRING },
                        recommendedStartTime: { type: Type.STRING }
                    },
                    required: ["energyScore", "flowSuggestion", "bottleneck", "recommendedStartTime"]
                }
            }
        });
        const resultText = response.text;
        if (!resultText) throw new Error("No analysis returned");
        return JSON.parse(resultText) as RoutineAnalysis;
    } catch (error) {
        console.error("Routine Optimization Failed", error);
        return {
            energyScore: 5,
            flowSuggestion: "Optimize block order.",
            bottleneck: "Unknown",
            recommendedStartTime: "09:00 AM"
        };
    }
};

export const analyzeEnergyLevels = async (
    metrics: EnergyMetrics
): Promise<EnergyAnalysis> => {
    if (!process.env.API_KEY) {
        return {
            currentZone: 'Flow',
            forecast: "Energy levels stable for next 2 hours.",
            recommendation: "Engage in deep work now before afternoon dip.",
            peakTime: "10:00 AM - 12:00 PM"
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Act as a bio-rhythm expert. Analyze these current energy metrics:
            Mind: ${metrics.mind}/100
            Body: ${metrics.body}/100
            Emotion: ${metrics.emotion}/100
            Focus: ${metrics.focus}/100
            
            Return JSON with:
            1. Current Energy Zone (Recovery, Calm, Flow, Peak, Low)
            2. Short-term Forecast
            3. Strategic Recommendation
            4. Peak Time Window
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        currentZone: { type: Type.STRING, enum: ['Recovery', 'Calm', 'Flow', 'Peak', 'Low'] },
                        forecast: { type: Type.STRING },
                        recommendation: { type: Type.STRING },
                        peakTime: { type: Type.STRING }
                    },
                    required: ["currentZone", "forecast", "recommendation", "peakTime"]
                }
            }
        });
        const resultText = response.text;
        if (!resultText) throw new Error("No analysis returned");
        return JSON.parse(resultText) as EnergyAnalysis;
    } catch (error) {
        console.error("Energy Analysis Failed", error);
        return {
            currentZone: 'Calm',
            forecast: "Unknown",
            recommendation: "Maintain balance.",
            peakTime: "Unknown"
        };
    }
};

export const optimizeMilestone = async (
    title: string,
    type: string,
    parentContext: string
): Promise<MilestoneAnalysis> => {
    if (!process.env.API_KEY) {
        return {
            difficultyScore: 6,
            suggestedSubSteps: ["Define inputs", "Draft version 1", "Test and review"],
            blockerDetection: "Simulation: Potential time constraint.",
            energyRequirement: "Medium"
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Act as a tactical project manager. Analyze this milestone.
            
            Milestone: ${title}
            Type: ${type}
            Context: ${parentContext}
            
            Return JSON with:
            1. Difficulty Score (1-10)
            2. 3-5 Concrete micro sub-steps (checklist)
            3. Potential blocker/risk
            4. Energy Requirement (Low, Medium, High)
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        difficultyScore: { type: Type.NUMBER },
                        suggestedSubSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                        blockerDetection: { type: Type.STRING },
                        energyRequirement: { type: Type.STRING }
                    },
                    required: ["difficultyScore", "suggestedSubSteps", "blockerDetection", "energyRequirement"]
                }
            }
        });
        const resultText = response.text;
        if (!resultText) throw new Error("No analysis returned");
        return JSON.parse(resultText) as MilestoneAnalysis;
    } catch (error) {
        console.error("Milestone Optimization Failed", error);
        return {
            difficultyScore: 5,
            suggestedSubSteps: ["Start"],
            blockerDetection: "Unknown",
            energyRequirement: "Medium"
        };
    }
};

export const generateWeeklyReview = async (
    data: WeeklyReviewData
): Promise<WeeklyReviewAnalysis> => {
    if (!process.env.API_KEY) {
        return {
            weeklyScore: 82,
            identityProgress: "You are becoming more consistent with deep work.",
            summary: "A solid week with high focus, though evening energy dipped on Thursday. Goals are progressing well.",
            trend: "up",
            insights: [
                "Morning routine consistency correlates with higher focus scores.",
                "Thursday's low energy followed a late night coding session."
            ],
            focusAreaSuggestion: ["Recovery Protocol", "Project Nebula Phase 2"]
        };
    }

    const dataStr = JSON.stringify(data, null, 2);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Act as a holistic life coach. Review this week's data and generate a summary.
            
            Data: ${dataStr}
            
            Return JSON with:
            1. Weekly Score (0-100)
            2. Identity Progress (e.g. "You are becoming a...")
            3. Executive Summary (2-3 sentences)
            4. Trend (up, stable, down)
            5. 2-3 Key Pattern Insights
            6. 2 Suggested Focus Areas for next week
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        weeklyScore: { type: Type.NUMBER },
                        identityProgress: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        trend: { type: Type.STRING, enum: ['up', 'stable', 'down'] },
                        insights: { type: Type.ARRAY, items: { type: Type.STRING } },
                        focusAreaSuggestion: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["weeklyScore", "identityProgress", "summary", "trend", "insights", "focusAreaSuggestion"]
                }
            }
        });
        const resultText = response.text;
        if (!resultText) throw new Error("No analysis returned");
        return JSON.parse(resultText) as WeeklyReviewAnalysis;
    } catch (error) {
        console.error("Weekly Review Failed", error);
        return {
            weeklyScore: 0,
            identityProgress: "Analysis unavailable.",
            summary: "Could not process weekly data.",
            trend: "stable",
            insights: [],
            focusAreaSuggestion: []
        };
    }
};

export const generateMonthlyReview = async (
    data: MonthlyReviewData
): Promise<MonthlyReviewAnalysis> => {
    if (!process.env.API_KEY) {
        return {
            theme: "The Month of Architecting",
            summary: "October was characterized by high creative output but fluctuating energy levels. You successfully established a new morning routine but struggled with consistency in health habits.",
            score: 78,
            identityShift: "Moving from 'Planner' to 'Executor'",
            momentumRating: 8,
            stabilityRating: 6,
            highlights: ["Launched Project Alpha", "Deep insights on system design", "Maintained journaling streak"],
            lowlights: ["Missed gym 2 weeks in a row", "Burnout in week 3"],
            keyInsight: "Your best work happens when you front-load the day; evenings are for recovery, not output.",
            nextMonthAdvice: "Prioritize physical recovery to match your mental output. The mind cannot outrun the body indefinitely."
        };
    }

    const dataStr = JSON.stringify(data, null, 2);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Act as a 'Cosmic Biographer' and Data Scientist. Review this month's life data and generate a deep retrospective.
            
            Data: ${dataStr}
            
            Return JSON with:
            1. Theme Title (e.g. "The Month of Awakening")
            2. Narrative Summary (3-4 sentences)
            3. Overall Score (0-100)
            4. Identity Shift (Who are they becoming?)
            5. Momentum Rating (1-10)
            6. Stability Rating (1-10)
            7. 3 Highlights
            8. 2 Lowlights/Challenges
            9. Key Insight (The "Golden Nugget" of wisdom)
            10. Advice for Next Month
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        theme: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        score: { type: Type.NUMBER },
                        identityShift: { type: Type.STRING },
                        momentumRating: { type: Type.NUMBER },
                        stabilityRating: { type: Type.NUMBER },
                        highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                        lowlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                        keyInsight: { type: Type.STRING },
                        nextMonthAdvice: { type: Type.STRING }
                    },
                    required: ["theme", "summary", "score", "identityShift", "momentumRating", "stabilityRating", "highlights", "lowlights", "keyInsight", "nextMonthAdvice"]
                }
            }
        });
        const resultText = response.text;
        if (!resultText) throw new Error("No analysis returned");
        return JSON.parse(resultText) as MonthlyReviewAnalysis;
    } catch (error) {
        console.error("Monthly Review Failed", error);
        return {
            theme: "Data Unavailable",
            summary: "Could not generate monthly report.",
            score: 0,
            identityShift: "Unknown",
            momentumRating: 0,
            stabilityRating: 0,
            highlights: [],
            lowlights: [],
            keyInsight: "System error.",
            nextMonthAdvice: "Retry later."
        };
    }
};
