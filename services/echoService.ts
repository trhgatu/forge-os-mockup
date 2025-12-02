
import { Echo, EchoType, EchoTone } from '../types';

// Mock service for Echoes Module

export const classifyMessage = (message: string): EchoType => {
  const length = message.length;
  if (length < 120) return 'whisper';
  if (length < 300) return 'signal';
  return 'echo';
};

export const analyzeTone = async (message: string): Promise<{ tone: EchoTone; sentiment: string; keywords: string[]; depth: number }> => {
  // Simulate AI latency
  await new Promise(resolve => setTimeout(resolve, 600));

  const lower = message.toLowerCase();
  let tone: EchoTone = 'neutral';
  let depth = 50;

  if (lower.includes('feel') || lower.includes('heart') || lower.includes('sad')) {
    tone = 'deep';
    depth = 85;
  } else if (lower.includes('hope') || lower.includes('love') || lower.includes('light')) {
    tone = 'warm';
    depth = 60;
  } else if (lower.includes('think') || lower.includes('logic') || lower.includes('structure')) {
    tone = 'cool';
    depth = 40;
  } else if (lower.includes('gentle') || lower.includes('quiet') || lower.includes('soft')) {
    tone = 'soft';
    depth = 30;
  }

  // Generate mock keywords
  const words = message.split(' ').filter(w => w.length > 4);
  const keywords = words.slice(0, 3);

  return {
    tone,
    sentiment: tone === 'warm' ? 'Positive' : tone === 'deep' ? 'Reflective' : 'Neutral',
    keywords,
    depth
  };
};

export const createEcho = async (from: string, message: string): Promise<Echo> => {
  const type = classifyMessage(message);
  const analysis = await analyzeTone(message);

  return {
    id: Date.now().toString(),
    type,
    from: from || 'Anonymous',
    message,
    metadata: {
      sentiment: analysis.sentiment,
      depth: analysis.depth,
      keywords: analysis.keywords
    },
    createdAt: new Date(),
    viewed: false,
    tone: analysis.tone
  };
};

export const fetchEchoes = async (): Promise<Echo[]> => {
  // Mock initial data
  return [
    {
      id: '1',
      type: 'whisper',
      from: 'Anonymous',
      message: 'The wind has changed direction today.',
      metadata: { depth: 20, keywords: ['wind', 'direction'] },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      viewed: true,
      tone: 'soft'
    },
    {
      id: '2',
      type: 'signal',
      from: 'Traveler',
      message: 'I saw something that reminded me of your old work. It feels like you are building a cathedral in the cloud.',
      metadata: { depth: 55, keywords: ['cathedral', 'cloud'] },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      viewed: false,
      tone: 'cool'
    },
    {
      id: '3',
      type: 'echo',
      from: 'Old Friend',
      message: 'Do you remember the night we talked about digital immortality? I still think about that concept. It haunts me sometimes, how much of us is left behind in these fragments of code. I hope you are finding peace in the architecture.',
      metadata: { depth: 90, keywords: ['immortality', 'fragments', 'peace'] },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      viewed: true,
      tone: 'deep'
    }
  ];
};
