
import { Insight, InsightSource } from '../types';

const generateMockReflection = (text: string, source: InsightSource): string => {
  const reflections = [
    "This feels like a small shift in how you see yourself.",
    "Có vẻ mày đang quan tâm đến điều này nhiều hơn trước.",
    "Insight này mang một năng lượng khá nhẹ.",
    "Hình như nó chạm tới một tầng sâu hơn trong mày.",
    "Observe this pattern. It has appeared before.",
    "This thought carries the weight of a turning point.",
    "A quiet realization, but a necessary one."
  ];
  return reflections[Math.floor(Math.random() * reflections.length)];
};

export const extractInsights = async (text: string, source: InsightSource): Promise<Insight[]> => {
  // Simulate AI latency
  await new Promise(resolve => setTimeout(resolve, 600));

  // In a real app, this would call Gemini. Here we mock extraction.
  // We'll just take the text and pretend to extract 1 key insight if short, or summarize if long.
  
  const extractedText = text.length > 100 ? text.substring(0, 80) + "..." : text;
  
  const newInsight: Insight = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    source,
    text: `Realization: ${extractedText}`,
    reflection: generateMockReflection(text, source),
    createdAt: new Date(),
    tags: ['Auto-Generated', source],
    metadata: {
      depth: Math.floor(Math.random() * 5) + 1,
      emotion: 'neutral',
      relatedConcepts: []
    }
  };

  return [newInsight];
};

export const analyzeInput = async (text: string, source: InsightSource = 'manual'): Promise<Insight[]> => {
  return extractInsights(text, source);
};

export const detectPatterns = async (insights: Insight[]): Promise<{ title: string, count: number }[]> => {
  // Mock pattern detection
  await new Promise(resolve => setTimeout(resolve, 400));
  return [
    { title: "Recurring Theme: Identity", count: insights.filter(i => i.tags.includes('Identity')).length + 2 },
    { title: "Emotional Cycle: Rest", count: 3 },
    { title: "Cognitive Shift: Systems", count: 5 }
  ];
};

export const fetchInitialInsights = async (): Promise<Insight[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    {
      id: '1',
      source: 'journal',
      text: "You are consistently seeking silence before major decisions.",
      reflection: "This silence is your calibration tool.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      tags: ['Pattern', 'Decision'],
      metadata: { depth: 4, emotion: 'calm' }
    },
    {
      id: '2',
      source: 'memory',
      text: "The 'Summit' memory anchors your definition of success.",
      reflection: "Success defined by internal feeling, not external view.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      tags: ['Value', 'Memory'],
      metadata: { depth: 5, emotion: 'inspired' }
    },
    {
      id: '3',
      source: 'thought',
      text: "Friction in routines usually points to an outdated identity layer.",
      reflection: "You are outgrowing your old skin.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      tags: ['Growth', 'System'],
      metadata: { depth: 3, emotion: 'neutral' }
    }
  ];
};
