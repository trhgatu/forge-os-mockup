
import React from 'react';

export type Language = 'en' | 'vi';

export enum View {
  DASHBOARD = 'DASHBOARD',
  FORGE_CHAMBER = 'FORGE_CHAMBER',
  COMPASS = 'COMPASS',
  JOURNAL = 'JOURNAL',
  META_JOURNAL = 'META_JOURNAL',
  MEMORY = 'MEMORY',
  TIMELINE = 'TIMELINE',
  CONNECTION = 'CONNECTION',
  PRESENCE = 'PRESENCE', 
  ECHOES = 'ECHOES', 
  WIKI = 'WIKI',
  THOUGHT_STREAM = 'THOUGHT_STREAM', 
  QUOTES = 'QUOTES',
  MOOD = 'MOOD',
  MANTRA = 'MANTRA', 
  INSIGHTS = 'INSIGHTS',
  IDEAS = 'IDEAS',
  GOALS = 'GOALS',
  HABITS = 'HABITS',
  ROUTINES = 'ROUTINES',
  MILESTONES = 'MILESTONES',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  IDENTITY = 'IDENTITY',
  THEMES = 'THEMES',
  SHADOW_WORK = 'SHADOW_WORK', 
  ENERGY = 'ENERGY',
  SOUNDTRACK = 'SOUNDTRACK',
  WEEKLY_REVIEW = 'WEEKLY_REVIEW',
  MONTHLY_REVIEW = 'MONTHLY_REVIEW',
  YEARLY_REVIEW = 'YEARLY_REVIEW',
  SETTINGS = 'SETTINGS',
}

export interface NavItem {
  id: View;
  labelKey: string; 
  icon: React.ElementType;
  group: 'Main' | 'Reflection' | 'Creativity' | 'Evolution' | 'System' | 'Meta';
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

// --- Insight Engine Types ---

export type InsightSource = 'thought' | 'journal' | 'wiki' | 'echo' | 'memory' | 'mood' | 'energy' | 'identity' | 'manual';

export interface Insight {
  id: string;
  source: InsightSource;
  text: string;          // The core realization
  reflection?: string;   // Nova's whisper
  createdAt: Date;
  tags: string[];
  metadata: {
    depth: number;       // 1-5
    emotion?: string;
    relatedConcepts?: string[];
  };
  isFavorite?: boolean;
}

// --- Thought Stream Types ---

export type ThoughtType = 'spark' | 'fragment' | 'stream';

export interface ThoughtFragment {
  id: string;
  type: ThoughtType;
  text: string;
  createdAt: Date;
  tags: string[];
  metadata: {
    sentiment?: string;
    depth: number; // 0-100
    origin?: "manual" | "wiki" | "echo" | "memory" | "journal";
    novaReflection?: string;
  };
  expanded: boolean;
}

export interface ThoughtStats {
  totalCount: number;
  avgDepth: number;
  dominantType: ThoughtType;
  flowState: 'stagnant' | 'drifting' | 'flowing' | 'rushing';
}

// --- Wiki Module Types ---

export interface WikiConcept {
  id: string;
  title: string;
  extract: string; 
  content?: string; 
  url: string; 
  imageUrl?: string; 
  language?: string; 
  metadata?: {
    keywords?: string[];
    categories?: string[];
  };
  insights?: string[]; 
  reflection?: string; 
  createdAt: string; 
  lastModified?: string; 
}

// --- Echoes Module Types ---

export type EchoType = 'whisper' | 'signal' | 'echo';
export type EchoTone = 'soft' | 'warm' | 'cool' | 'neutral' | 'deep';

export interface Echo {
  id: string;
  type: EchoType;
  from: string | null; 
  message: string;
  metadata: {
    sentiment?: string;
    depth: number; 
    keywords: string[];
  };
  createdAt: Date;
  viewed: boolean;
  tone: EchoTone;
}

// --- Notification Types (Whisper OS) ---

export type NotificationType = 'whisper' | 'signal' | 'event';
export type NotificationSource = 
  | 'season' 
  | 'thoughtstream' 
  | 'insight' 
  | 'identity' 
  | 'connection' 
  | 'system' 
  | 'nova'
  | 'memory'
  | 'presence'
  | 'echoes'
  | 'wiki';

export interface Notification {
  id: string;
  type: NotificationType;
  source: NotificationSource;
  title?: string;
  message: string;
  timestamp: Date;
  read: boolean;
  seasonTint?: Season; 
  priority: 'low' | 'medium' | 'high';
  linkTo?: View; 
}

// --- Presence / Visitor Echo Types ---

export type EchoTypeVisitor = 'anonymous' | 'known' | 'connection';

export interface VisitorEcho {
  id: string;
  timestamp: Date;
  type: EchoTypeVisitor;
  connectionId?: string; // If linked to a connection
  connectionName?: string;
  connectionRole?: ConnectionRole; // For color
  distance: number; // 0-100 (Proximity to center)
  angle: number; // 0-360 (Position on radar)
  seasonContext: Season;
  duration: number;
  pageVisited: string;
}

// --- Multi-Agent Types ---

export type AgentId = 'nova' | 'socrates' | 'muse' | 'cipher' | 'user';

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  status: 'idle' | 'thinking' | 'speaking' | 'offline';
  icon: React.ElementType;
  color: string; 
  bg: string; 
  border: string; 
  gradient: string; 
  systemPrompt: string; 
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  agentId?: AgentId; 
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
  | 'focused' 
  | 'anxious' 
  | 'tired';  

export interface JournalAnalysis {
  sentimentScore: number; 
  keywords: string[];
  summary: string;
  suggestedAction: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string; 
  date: Date;
  mood: MoodType;
  tags: string[];
  analysis?: JournalAnalysis;
  isDraft?: boolean;
}

// --- Meta-Journal Types ---

export type MetaJournalType = 'Pattern' | 'State' | 'Identity' | 'Season';

export interface MetaJournalAnalysis {
  depthLevel: number; // 1-10
  cognitivePattern: string;
  seasonalShift?: Season;
  novaWhisper: string;
}

export interface MetaJournalEntry {
  id: string;
  content: string;
  type: MetaJournalType;
  date: Date;
  season: Season;
  tags: string[];
  analysis?: MetaJournalAnalysis;
  linkedModules?: View[]; 
}

// --- Connection Types ---

export type ConnectionRole = 
  | 'Catalyst' 
  | 'Ghost' 
  | 'Mirror' 
  | 'Anchor' 
  | 'Teacher' 
  | 'Past Love' 
  | 'Shadow' 
  | 'Companion' 
  | 'Healer' 
  | 'Mystery';

export interface MessageFragment {
  id: string;
  content: string;
  date: Date;
  context: string;
  isFavorite: boolean;
}

export interface ConnectionAnalysis {
  novaWhisper: string;
  emotionalSummary: string;
  seasonAffinity: Season;
}

export interface ConnectionNode {
  id: string;
  name: string;
  nickname?: string;
  role: ConnectionRole;
  importance: number; // 1-10
  bondIntensity: number; // 0-100
  seasonInfluence: Season;
  lastInteraction: Date;
  messageFragments: MessageFragment[];
  linkedMemories?: string[]; // IDs
  analysis?: ConnectionAnalysis;
  
  // Visual coordinates
  x?: number; 
  y?: number;
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
  reflectionDepth: number; 
}

// --- Timeline Types ---

export type TimelineType = 'memory' | 'journal' | 'quote' | 'mood' | 'milestone' | 'insight';

export interface TimelineAnalysis {
    significance: string; 
    pattern: string; 
    temporalContext: string; 
}

export interface TimelineItem {
    id: string;
    type: TimelineType;
    date: Date;
    title: string;
    content: string; 
    mood: MoodType;
    tags: string[];
    imageUrl?: string;
    metadata?: any; 
    analysis?: TimelineAnalysis;
}

// --- Quote Types ---

export interface QuoteAnalysis {
    meaning: string; 
    themes: string[]; 
    sentimentScore: number; 
    reflectionPrompt: string; 
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
    reflectionDepth: number; 
    analysis?: QuoteAnalysis;
    imageUrl?: string; 
}

// --- Mantra Types ---

export type MantraType = 'Daily' | 'Seasonal' | 'Identity' | 'Shadow' | 'Compass';

export interface MantraAnalysis {
  season: Season;
  tone: string;
  archetype: IdentityArchetype;
  novaWhisper: string;
}

export interface Mantra {
  id: string;
  text: string;
  type: MantraType;
  season: Season;
  isActive: boolean;
  dateCreated: Date;
  analysis?: MantraAnalysis;
}

// --- Mood Types ---

export interface MoodEntry {
  id: string;
  mood: MoodType;
  intensity: number; 
  note: string;
  tags: string[];
  date: Date;
}

export interface MoodAnalysis {
  overallTrend: string; 
  triggers: string[]; 
  prediction: string; 
  insight: string; 
  actionableStep: string;
}

// --- Global Insight Types ---

export interface TopicCluster {
  id: string;
  name: string;
  size: number; 
  relatedTopics: string[];
  x: number; 
  y: number; 
}

export interface Pattern {
  id: string;
  type: 'behavior' | 'emotional' | 'cognitive';
  title: string;
  description: string;
  confidence: number; 
  impact: 'positive' | 'negative' | 'neutral';
}

export interface LifeArc {
  currentPhase: string; 
  description: string;
  progress: number; 
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
export type IdeaType = 'spark' | 'concept' | 'project' | 'cluster';
export type IdeaStatus = 'active' | 'incubating' | 'archived';

export interface IdeaConnection {
  id: string;
  fromId: string;
  toId: string;
  type: 'related' | 'parent' | 'child' | 'conflict';
  strength: number; 
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  type: IdeaType;
  status?: IdeaStatus; 
  color: string; 
  tags: string[];
  energy: number; 
  connections: string[]; 
  aiAnalysis?: {
    expansion: string;
    gaps: string[];
    nextSteps: string[];
    suggestedConnections?: string[];
  };
  dateCreated: Date;
}

// --- Goal Types ---

export type GoalType = 'life' | 'project' | 'micro';
export type GoalStatus = 'not_started' | 'in_progress' | 'paused' | 'completed';

export interface Milestone { 
  id: string;
  title: string;
  isCompleted: boolean;
  targetDate?: Date;
}

export interface GoalAnalysis {
  risks: string[];
  energyLevel: number; 
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
  priority: number; 
  progress: number; 
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
  difficultyScore: number; 
  suggestedSubSteps: string[];
  blockerDetection: string;
  energyRequirement: string; 
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
  progress: number; 
  difficulty: number; 
  linkedEntityId?: string; 
  tags: string[];
  analysis?: MilestoneAnalysis;
}


// --- Habit Types ---

export type HabitType = 'foundation' | 'growth' | 'micro';
export type HabitFrequency = 'daily' | 'weekly';

export interface HabitLog {
  date: string; 
  completed: boolean;
}

export interface HabitAnalysis {
  identityAlignment: string; 
  suggestedMicroHabit: string; 
  riskAnalysis: string; 
  bestTimeOfDay: string; 
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  type: HabitType;
  frequency: HabitFrequency;
  streak: number;
  logs: HabitLog[]; 
  linkedGoalId?: string;
  difficulty: number; 
  analysis?: HabitAnalysis;
  dateCreated: Date;
}

// --- Routine Types ---

export type RoutineType = 'morning' | 'evening' | 'work' | 'reset';
export type RoutineBlockType = 'habit' | 'task' | 'reflection' | 'break';

export interface RoutineBlock {
  id: string;
  title: string;
  duration: number; 
  type: RoutineBlockType;
  energyImpact: number; 
  linkedHabitId?: string;
}

export interface RoutineAnalysis {
  energyScore: number;
  flowSuggestion: string; 
  bottleneck?: string; 
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
  mind: number; 
  body: number;
  emotion: number;
  focus: number;
}

export interface EnergyInfluence {
  id: string;
  name: string;
  impact: number; 
  type: 'habit' | 'sleep' | 'mood' | 'routine';
  description: string;
}

export interface EnergyAnalysis {
  currentZone: EnergyZone;
  forecast: string; 
  recommendation: string; 
  peakTime: string; 
}

// --- Achievement Archive Types ---

export type AchievementCategory = 'Work' | 'Health' | 'Personal' | 'Creative' | 'Social' | 'Milestone';

export interface AchievementAnalysis {
  significanceScore: number; 
  identityShift: string; 
  growthPattern: string; 
  emotionalDriver: string; 
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: AchievementCategory;
  tags: string[];
  moodSnapshot: MoodType;
  energySnapshot: number; 
  linkedGoalId?: string;
  linkedMilestoneId?: string;
  analysis?: AchievementAnalysis;
  imageUrl?: string;
}

export interface AchievementStats {
  total: number;
  categoryBreakdown: Record<AchievementCategory, number>;
  topMonth: string;
  currentStreak: number;
}

// --- Identity Evolution Types ---

export type IdentityArchetype = 'Creator' | 'Strategist' | 'Warrior' | 'Healer' | 'Builder' | 'Explorer' | 'Sage';

export interface IdentityTrait {
  name: string;
  score: number; 
}

export interface IdentityPhase {
  id: string;
  title: string; 
  startDate: Date;
  endDate?: Date;
  description: string;
  moodBaseline: MoodType;
  energyAvg: number;
}

export interface IdentityShift {
  id: string;
  title: string; 
  date: Date;
  type: 'Mindset' | 'Behavioral' | 'Emotional' | 'Value';
  impactScore: number; 
  context: string;
}

export interface IdentityDriver {
  id: string;
  name: string;
  type: 'Habit' | 'Emotion' | 'Goal' | 'Belief' | 'Value';
  impact: number; 
  description: string;
}

export interface IdentityProfile {
  currentPhase: IdentityPhase;
  vector: string; 
  evolutionScore: number; 
  archetype: IdentityArchetype;
  traits: IdentityTrait[]; 
  topDrivers: IdentityDriver[];
  recentShifts: IdentityShift[];
  futureProjection: {
    trajectory: string;
    alignment: number; 
    nextPhasePrediction: string;
    potentialTraps: string[];
  };
}

// --- Life Themes Types ---

export type ThemeStatus = 'emerging' | 'dominant' | 'fading' | 'dormant' | 'resolved';

export interface ThemeBehavior {
  id: string;
  description: string; 
  type: 'habit' | 'decision' | 'avoidance';
}

export interface ThemeConflict {
  id: string;
  opposingThemeId: string;
  opposingThemeName: string;
  description: string; 
  tensionLevel: number; 
  resolutionHint: string;
}

export interface LifeTheme {
  id: string;
  title: string; 
  description: string;
  status: ThemeStatus;
  strength: number; 
  firstDetected: Date;
  lastActive: Date;
  relatedMoods: MoodType[]; 
  archetypeIcon: 'crown' | 'sword' | 'compass' | 'feather' | 'anchor' | 'flame'; 
  colorSignature: string; 
  evidence: string[]; 
  behaviors: ThemeBehavior[];
  conflicts?: ThemeConflict[];
  evolutionArc: string; 
}

export interface ThemeTimelinePoint {
  date: string;
  themeId: string;
  intensity: number;
}

export interface LifeThemeAnalysis {
  currentSeasonSummary: string; 
  stabilityScore: number; 
  dominantThemes: LifeTheme[];
  emergingThemes: LifeTheme[];
  quietThemes: LifeTheme[];
  timelineData: ThemeTimelinePoint[];
  reflectionPrompts: string[];
}

// --- Shadow Work Types ---

export interface ShadowMask {
  id: string;
  name: string; 
  protecting: string; 
  triggeredBy: string; 
  description: string;
  icon: 'shield' | 'mask' | 'wall' | 'clock' | 'smile';
}

export interface InnerConflict {
  id: string;
  desire: string; 
  fear: string; 
  manifestation: string; 
  tensionLevel: number; 
}

export interface LimitingBelief {
  id: string;
  statement: string; 
  originAge?: string; 
  intensity: number; 
  consequences: string[];
}

export interface ShadowTransmutation {
  shadow: string; 
  gift: string; 
  path: string; 
}

export interface ShadowAnalysis {
  primaryShadow: string; 
  supportingShadows: string[];
  tensionScore: number; 
  avoidanceIndex: number; 
  emotionalRoots: string[]; 
  masks: ShadowMask[];
  conflicts: InnerConflict[];
  limitingBeliefs: LimitingBelief[];
  transmutation: ShadowTransmutation;
  integrationSteps: string[];
  reflectionPrompts: string[];
  shadowTimeline: { date: string; intensity: number; trigger: string }[];
}

// --- Weekly Review Types ---

export interface WeeklyReviewData {
  moodHistory: { date: string, value: number, mood: string }[];
  energyHistory: { date: string, value: number }[];
  goalsCompleted: number;
  goalsInProgress: number;
  habitsConsistency: number; 
  topHabit: string;
  strugglingHabit: string;
  routinesCompleted: number;
  highlights: string[]; 
}

export interface WeeklyReviewAnalysis {
  weeklyScore: number; 
  identityProgress: string; 
  summary: string;
  trend: 'up' | 'stable' | 'down';
  insights: string[];
  focusAreaSuggestion: string[];
}

// --- Monthly Review Types ---

export interface MonthlyReviewData {
  month: string; 
  moodTrend: { day: number; value: number; label: string }[]; 
  energyTrend: { day: number; value: number }[]; 
  habitStats: { name: string; consistency: number; trend: 'up' | 'down' | 'flat' }[];
  goalsCompleted: number;
  goalsTotal: number;
  milestonesAchieved: number;
  topMemories: { id: string; title: string; date: string; mood: MoodType; imageUrl?: string }[];
  journalThemes: string[];
}

export interface MonthlyReviewAnalysis {
  theme: string; 
  summary: string;
  score: number;
  identityShift: string; 
  momentumRating: number; 
  stabilityRating: number; 
  highlights: string[];
  lowlights: string[];
  keyInsight: string;
  nextMonthAdvice: string;
}

// --- Yearly Review Types ---

export interface YearlyReviewData {
  year: string; 
  moodMatrix: { month: string; intensity: number; dominantMood: MoodType }[]; 
  energySeasonality: { month: string; value: number }[]; 
  topMilestones: { id: string; title: string; month: string; type: MilestoneType }[];
  habitPerformance: { name: string; consistency: number }[];
}

export interface IdentityAxis {
  subject: string; 
  A: number; 
  fullMark: number;
}

export interface NarrativeChapter {
  month: string;
  title: string;
  summary: string;
  mood: MoodType;
  intensity: number; 
}

export interface YearlyReviewAnalysis {
  theme: string; 
  summary: string;
  score: number;
  identityLabel: string; 
  identityRadar: IdentityAxis[];
  narrativeChapters: NarrativeChapter[];
  momentumRating: number;
  stabilityRating: number;
  highlights: string[];
  lowlights: string[];
  keyInsight: string;
  nextYearAdvice: string;
}

// --- Compass Types ---

export interface NorthStar {
  statement: string;
  whyItMatters: string;
  timeHorizon: string; 
  resonanceScore: number; 
}

export type HorizonLevel = '1Y' | '3Y' | '5Y';

export interface CompassHorizon {
  level: HorizonLevel;
  vision: string;
  domains: {
    name: string; 
    status: 'on-track' | 'drifting' | 'at-risk';
    anchorGoal: string;
  }[];
}

export interface StrategicTrack {
  id: string;
  title: string;
  linkedThemeId: string;
  horizon: HorizonLevel;
  status: 'active' | 'paused' | 'completed';
  momentum: number; 
  progress: number; 
}

export interface CompassData {
  northStar: NorthStar;
  horizons: CompassHorizon[];
  tracks: StrategicTrack[];
  alignmentScore: number; 
  driftScore: number; 
  currentPhase: string; 
  driftSources: string[];
  nextQuarterFocus: {
    themes: string[];
    goals: string[];
  };
}

// --- Season Types ---

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface SeasonTheme {
  id: Season;
  label: string;
  primary: string;
  accent: string;
  border: string;
  bg: string;
  gradient: string;
  particle: 'dust' | 'shimmer' | 'leaves' | 'snow';
  icon: React.ElementType;
  description: string;
}

// --- Soundtrack Types ---

export type MusicSeason = Season;

export interface AudioFeatures {
  energy: number; // 0-1
  valence: number; // 0-1 (Happiness)
  tempo: number; // BPM
  acousticness: number; // 0-1
  danceability: number; // 0-1
  instrumentalness: number; // 0-1
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  durationMs: number;
  playedAt: Date;
  features: AudioFeatures;
  season: MusicSeason;
  genre: string;
}

export interface MusicAnalysis {
  season: MusicSeason;
  novaWhisper: string;
  emotionalResonance: string; // "Melancholy", "Drive", "Peace"
  memoryLink?: string; // ID of linked memory
}

// --- Soundtrack Architecture Types ---

export type AmbienceLayer = 'Rain' | 'White Noise' | 'Binaural Beats' | 'Forest' | 'Ocean';

export interface SoundtrackState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  activeAmbience: AmbienceLayer[];
  globalSeason: MusicSeason;
  novaWhisper: string | null;
  isPlayerVisible: boolean;
}

export type AudioSignalType = 
  | 'ENTER_FOCUS' 
  | 'ENTER_REFLECTION' 
  | 'ENTER_ENERGY' 
  | 'SYSTEM_RESET';

export interface AudioSignal {
  type: AudioSignalType;
  context?: string;
}
