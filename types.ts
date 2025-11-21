
// Fix: Import React to resolve "Cannot find namespace 'React'" error
import React from 'react';

export enum View {
  DASHBOARD = 'DASHBOARD',
  FORGE_CHAMBER = 'FORGE_CHAMBER',
  JOURNAL = 'JOURNAL',
  MEMORY = 'MEMORY',
  TIMELINE = 'TIMELINE',
  QUOTES = 'QUOTES',
  MOOD = 'MOOD',
  INSIGHTS = 'INSIGHTS',
  IDEAS = 'IDEAS',
  GOALS = 'GOALS',
  HABITS = 'HABITS',
  ROUTINES = 'ROUTINES',
  MILESTONES = 'MILESTONES',
  ENERGY = 'ENERGY',
  WEEKLY_REVIEW = 'WEEKLY_REVIEW',
  MONTHLY_REVIEW = 'MONTHLY_REVIEW',
  SETTINGS = 'SETTINGS',
}

export interface NavItem {
  id: View;
  label: string;
  icon: React.ElementType;
  group: 'Main' | 'Reflection' | 'Creativity' | 'Evolution' | 'System';
}

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  rank: string;
  streak: number;
}

export interface InsightData {
  quote: string;
  author: string;
  theme: string;
}

// --- Multi-Agent Types ---

export type AgentId = 'nexus' | 'socrates' | 'muse' | 'cipher' | 'user';

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  status: 'idle' | 'thinking' | 'speaking' | 'offline';
  icon: React.ElementType;
  color: string; // Tailwind text class (e.g., 'text-amber-400')
  bg: string; // Tailwind bg class for bubbles
  border: string; // Tailwind border class
  gradient: string; // Tailwind gradient classes for avatar
  systemPrompt: string; // Personality instruction
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  agentId?: AgentId; // If undefined, assumes 'nexus' (default system)
  text: string;
  timestamp?: number;
}

// --- Journal Types ---

export type MoodType = 
  | 'joy' 
  | 'calm' 
  | 'inspired' 
  | 'neutral' 
  | 'sad' 
  | 'stressed' 
  | 'lonely' 
  | 'angry' 
  | 'energetic' 
  | 'empty'
  | 'focused' // Legacy support
  | 'anxious' // Legacy support
  | 'tired';  // Legacy support

export interface JournalAnalysis {
  sentimentScore: number; // 0 to 10
  keywords: string[];
  summary: string;
  suggestedAction: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string; // Markdown/Text
  date: Date;
  mood: MoodType;
  tags: string[];
  analysis?: JournalAnalysis;
  isDraft?: boolean;
}

// --- Memory Types ---

export type MemoryType = 'moment' | 'milestone' | 'insight' | 'challenge';

export interface MemoryAnalysis {
  coreMeaning: string;
  emotionalPattern: string;
  timelineConnection: string; 
  sentimentScore: number;
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: MemoryType;
  mood: MoodType;
  tags: string[];
  imageUrl?: string;
  analysis?: MemoryAnalysis;
  reflectionDepth: number; // 1-10
}

// --- Timeline Types ---

export type TimelineType = 'memory' | 'journal' | 'quote' | 'mood' | 'milestone' | 'insight';

export interface TimelineAnalysis {
    significance: string; // Why this moment matters in the timeline
    pattern: string; // Recurring theme
    temporalContext: string; // "This happened 2 days after..."
}

export interface TimelineItem {
    id: string;
    type: TimelineType;
    date: Date;
    title: string;
    content: string; // Short snippet or full content
    mood: MoodType;
    tags: string[];
    imageUrl?: string;
    metadata?: any; // Flexible field for specific type data
    analysis?: TimelineAnalysis;
}

// --- Quote Types ---

export interface QuoteAnalysis {
    meaning: string; // Interpretation of the quote
    themes: string[]; // Semantic clusters
    sentimentScore: number; // 1-10
    reflectionPrompt: string; // Question for the user
}

export interface Quote {
    id: string;
    text: string;
    author: string;
    source?: string;
    mood: MoodType;
    tags: string[];
    isFavorite: boolean;
    dateAdded: Date;
    reflectionDepth: number; // 1-10 inferred from complexity
    analysis?: QuoteAnalysis;
    imageUrl?: string; // Optional background
}

// --- Mood Types ---

export interface MoodEntry {
  id: string;
  mood: MoodType;
  intensity: number; // 1-10
  note: string;
  tags: string[];
  date: Date;
}

export interface MoodAnalysis {
  overallTrend: string; // "Rising", "Stable", "Volatile"
  triggers: string[]; // "Work", "Sleep"
  prediction: string; // "Likely to feel energetic tomorrow"
  insight: string; // "You tend to feel anxious on Monday mornings."
  actionableStep: string;
}

// --- Global Insight Types ---

export interface TopicCluster {
  id: string;
  name: string;
  size: number; // 1-10 relative importance
  relatedTopics: string[];
  x: number; // 0-100% position
  y: number; // 0-100% position
}

export interface Pattern {
  id: string;
  type: 'behavior' | 'emotional' | 'cognitive';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'positive' | 'negative' | 'neutral';
}

export interface LifeArc {
  currentPhase: string; // e.g. "Building Foundation"
  description: string;
  progress: number; // 0-100
  nextPhasePrediction: string;
}

export interface GlobalAnalysis {
  weeklySummary: string;
  emotionalCycle: { date: string; mood: MoodType; value: number; event?: string }[]; 
  topics: TopicCluster[];
  patterns: Pattern[];
  lifeArc: LifeArc;
  predictions: {
    mood: string;
    energy: string;
    suggestion: string;
  };
}

// --- Idea Lab Types ---

export type IdeaMode = 'CANVAS' | 'LIST' | 'GRAPH';

export interface IdeaConnection {
  id: string;
  fromId: string;
  toId: string;
  type: 'related' | 'parent' | 'child' | 'conflict';
  strength: number; // 1-5 thickness
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  color: string; // Hex or Tailwind color
  tags: string[];
  energy: number; // 1-100, affects size/glow
  connections: string[]; // IDs of other ideas
  aiAnalysis?: {
    expansion: string;
    gaps: string[];
    nextSteps: string[];
  };
  dateCreated: Date;
}

// --- Goal Types ---

export type GoalType = 'life' | 'project' | 'micro';
export type GoalStatus = 'not_started' | 'in_progress' | 'paused' | 'completed';

export interface Milestone { // Legacy interface for Goals module
  id: string;
  title: string;
  isCompleted: boolean;
  targetDate?: Date;
}

export interface GoalAnalysis {
  risks: string[];
  energyLevel: number; // 1-10 estimate
  suggestedHabit: string;
  motivation: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  type: GoalType;
  status: GoalStatus;
  priority: number; // 1-5
  progress: number; // 0-100
  dueDate?: Date;
  milestones: Milestone[];
  tags: string[];
  analysis?: GoalAnalysis;
  dateCreated: Date;
}

// --- Milestone Types (Unified Module) ---

export type MilestoneType = 'goal' | 'habit' | 'routine' | 'project' | 'freeform';
export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface SubStep {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface MilestoneAnalysis {
  difficultyScore: number; // 1-10
  suggestedSubSteps: string[];
  blockerDetection: string;
  energyRequirement: string; // "High", "Medium", "Low"
}

export interface RichMilestone {
  id: string;
  title: string;
  description: string;
  type: MilestoneType;
  status: MilestoneStatus;
  dueDate: Date;
  completedDate?: Date;
  subSteps: SubStep[];
  progress: number; // 0-100
  difficulty: number; // 1-5 (User set)
  linkedEntityId?: string; // ID of related Goal/Habit
  tags: string[];
  analysis?: MilestoneAnalysis;
}


// --- Habit Types ---

export type HabitType = 'foundation' | 'growth' | 'micro';
export type HabitFrequency = 'daily' | 'weekly';

export interface HabitLog {
  date: string; // ISO Date string "YYYY-MM-DD"
  completed: boolean;
}

export interface HabitAnalysis {
  identityAlignment: string; // "This reinforces your identity as a writer."
  suggestedMicroHabit: string; // "Just write 1 sentence."
  riskAnalysis: string; // "You tend to skip this on weekends."
  bestTimeOfDay: string; // "Morning"
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  type: HabitType;
  frequency: HabitFrequency;
  streak: number;
  logs: HabitLog[]; // History
  linkedGoalId?: string;
  difficulty: number; // 1-10
  analysis?: HabitAnalysis;
  dateCreated: Date;
}

// --- Routine Types ---

export type RoutineType = 'morning' | 'evening' | 'work' | 'reset';
export type RoutineBlockType = 'habit' | 'task' | 'reflection' | 'break';

export interface RoutineBlock {
  id: string;
  title: string;
  duration: number; // minutes
  type: RoutineBlockType;
  energyImpact: number; // -10 (draining) to +10 (generating)
  linkedHabitId?: string;
}

export interface RoutineAnalysis {
  energyScore: number;
  flowSuggestion: string; // "Move meditation to start to reduce inertia"
  bottleneck?: string; // "Workout duration might be too ambitious"
  recommendedStartTime: string;
}

export interface Routine {
  id: string;
  title: string;
  type: RoutineType;
  blocks: RoutineBlock[];
  totalDuration: number;
  active: boolean;
  analysis?: RoutineAnalysis;
}

// --- Energy Types ---

export type EnergyZone = 'Recovery' | 'Calm' | 'Flow' | 'Peak' | 'Low';

export interface EnergyMetrics {
  mind: number; // 0-100
  body: number;
  emotion: number;
  focus: number;
}

export interface EnergyInfluence {
  id: string;
  name: string;
  impact: number; // -10 to +10
  type: 'habit' | 'sleep' | 'mood' | 'routine';
  description: string;
}

export interface EnergyAnalysis {
  currentZone: EnergyZone;
  forecast: string; // "Dip expected in 2 hours"
  recommendation: string; // "Take a break now to sustain peak later"
  peakTime: string; // "10:00 AM - 11:30 AM"
}

// --- Weekly Review Types ---

export interface WeeklyReviewData {
  moodHistory: { date: string, value: number, mood: string }[];
  energyHistory: { date: string, value: number }[];
  goalsCompleted: number;
  goalsInProgress: number;
  habitsConsistency: number; // 0-100
  topHabit: string;
  strugglingHabit: string;
  routinesCompleted: number;
  highlights: string[]; // Titles of key moments
}

export interface WeeklyReviewAnalysis {
  weeklyScore: number; // 0-100
  identityProgress: string; // "You are becoming a consistent creator."
  summary: string;
  trend: 'up' | 'stable' | 'down';
  insights: string[];
  focusAreaSuggestion: string[];
}

// --- Monthly Review Types ---

export interface MonthlyReviewData {
  month: string; // "October 2023"
  moodTrend: { day: number; value: number; label: string }[]; // 1-30
  energyTrend: { day: number; value: number }[]; // 1-30
  habitStats: { name: string; consistency: number; trend: 'up' | 'down' | 'flat' }[];
  goalsCompleted: number;
  goalsTotal: number;
  milestonesAchieved: number;
  topMemories: { id: string; title: string; date: string; mood: MoodType; imageUrl?: string }[];
  journalThemes: string[];
}

export interface MonthlyReviewAnalysis {
  theme: string; // "The Month of Grounding"
  summary: string;
  score: number;
  identityShift: string; // "From scattered to focused"
  momentumRating: number; // 1-10
  stabilityRating: number; // 1-10
  highlights: string[];
  lowlights: string[];
  keyInsight: string;
  nextMonthAdvice: string;
}
