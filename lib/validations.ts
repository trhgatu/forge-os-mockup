
import { z } from "zod";

// --- Core Enums ---
export const MoodEnum = z.enum([
  'joy', 'calm', 'inspired', 'neutral', 'sad', 
  'stressed', 'lonely', 'angry', 'energetic', 'empty',
  'focused', 'anxious', 'tired'
]);

export const GoalTypeEnum = z.enum(['life', 'project', 'micro']);
export const GoalStatusEnum = z.enum(['not_started', 'in_progress', 'paused', 'completed']);

// --- Schemas ---

export const JournalEntrySchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content cannot be empty"),
  mood: MoodEnum,
  tags: z.array(z.string()).max(5),
  isDraft: z.boolean().optional(),
});

export const GoalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  type: GoalTypeEnum,
  priority: z.number().min(1).max(5),
  dueDate: z.date().optional(),
});

export const MoodLogSchema = z.object({
  mood: MoodEnum,
  intensity: z.number().min(1).max(10),
  note: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// --- Inference Types ---
export type JournalEntryInput = z.infer<typeof JournalEntrySchema>;
export type GoalInput = z.infer<typeof GoalSchema>;
export type MoodLogInput = z.infer<typeof MoodLogSchema>;
