
import { ThoughtFragment, ThoughtType } from '../types';

export const classifyThought = (text: string): ThoughtType => {
  const len = text.length;
  if (len < 80) return 'spark';
  if (len < 200) return 'fragment';
  return 'stream';
};

export const createFragment = async (text: string, origin: ThoughtFragment['metadata']['origin'] = 'manual'): Promise<ThoughtFragment> => {
  const type = classifyThought(text);
  
  // Simulate minor latency for natural feel
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    type,
    text,
    createdAt: new Date(),
    tags: [],
    metadata: {
      depth: type === 'spark' ? 20 : type === 'fragment' ? 50 : 80,
      origin,
      novaReflection: await generateReflection(type, text)
    },
    expanded: false
  };
};

const generateReflection = async (type: ThoughtType, text: string): Promise<string> => {
  // Mock Nova reflections
  const reflections = {
    spark: [
      "A flicker of something larger.",
      "Hold this thought gently.",
      "The seed of an idea."
    ],
    fragment: [
      "This connects to your recent patterns.",
      "A bridge between intuition and logic.",
      "Let this thought settle like sediment."
    ],
    stream: [
      "A deep current is moving here.",
      "This feels like a turning point.",
      "Significant cognitive weight detected."
    ]
  };
  
  const options = reflections[type];
  return options[Math.floor(Math.random() * options.length)];
};

export const fetchInitialFragments = async (): Promise<ThoughtFragment[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: '1',
      type: 'stream',
      text: "The concept of 'identity' isn't static. It's a fluid interface between internal state and external reality. If I change the interface, does the core change too?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      tags: ['Identity', 'System'],
      metadata: { depth: 85, origin: 'journal', novaReflection: "A recursive query on the self." },
      expanded: false
    },
    {
      id: '2',
      type: 'fragment',
      text: "Need to restructure the morning routine. The current flow feels too rigid, causing friction before 9AM.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      tags: ['Routine'],
      metadata: { depth: 40, origin: 'manual', novaReflection: "Friction indicates misalignment." },
      expanded: false
    },
    {
      id: '3',
      type: 'spark',
      text: "Silence is an active state.",
      createdAt: new Date(),
      tags: [],
      metadata: { depth: 25, origin: 'manual', novaReflection: "A quiet truth." },
      expanded: false
    }
  ];
};
