
import { 
  analyzeJournalEntry, 
  breakdownGoal, 
  analyzeMoodPatterns,
  generateMonthlyReview,
  generateGlobalInsights 
} from "./geminiService";
import { JournalEntrySchema, GoalSchema, MoodLogSchema } from "../lib/validations";
import { JournalEntry, Goal, MoodEntry, MonthlyReviewData } from "../types";

// --- Simulated Server Actions ---

export async function actionAnalyzeJournal(entry: JournalEntry) {
  // Validate input
  const result = JournalEntrySchema.safeParse({
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    tags: entry.tags
  });

  if (!result.success) {
    return { error: "Validation failed", details: result.error.format() };
  }

  try {
    const analysis = await analyzeJournalEntry(entry.content);
    return { success: true, data: analysis };
  } catch (error) {
    return { error: "Failed to analyze journal entry" };
  }
}

export async function actionCreateGoal(goal: Goal) {
  const result = GoalSchema.safeParse({
    title: goal.title,
    description: goal.description,
    type: goal.type,
    priority: goal.priority,
    dueDate: goal.dueDate
  });

  if (!result.success) {
    return { error: "Validation failed", details: result.error.format() };
  }

  try {
    const analysis = await breakdownGoal(goal.title, goal.description, goal.type);
    return { success: true, data: analysis };
  } catch (error) {
    return { error: "Failed to process goal strategy" };
  }
}

export async function actionGenerateMonthlyReview(data: MonthlyReviewData) {
  try {
    const analysis = await generateMonthlyReview(data);
    return { success: true, data: analysis };
  } catch (error) {
    return { error: "Failed to generate monthly review" };
  }
}

export async function actionAnalyzeGlobal(summary: string) {
  try {
    const analysis = await generateGlobalInsights(summary);
    return { success: true, data: analysis };
  } catch (error) {
    return { error: "Failed to generate global insights" };
  }
}
