
import { EpicScene, EpicVaultStats } from '../types';

const MOCK_SCENES: EpicScene[] = [
  {
    id: '4',
    title: 'United States of Smash',
    series: 'My Hero Academia',
    imageUrl: 'https://static.wikia.nocookie.net/everyth1ng/images/a/a5/United_States_of_Smash.png/revision/latest?cb=20250429184631',
    // videoUrl: 'https://www.youtube.com/embed/rLl9XBg7wSs?si=c4eeOM-XY2T9_nNu', // Optional video link
    episode: 'Season 3, Episode 11 (One For All)',
    timestamp: '20:45',
    quote: "Farewell, All For One... Next, it's your turn.",
    quoteBy: 'All Might',
    context: "All Might uses the very last sparks of One For All to defeat his nemesis, All For One. In this strike, he pours every ounce of his remaining strength, effectively ending his career as the Symbol of Peace, but securing the future for Deku.",
    emotionTags: ['Legacy', 'Sacrifice', 'Victory', 'Farewell'],
    archetypeTags: ['Mentor', 'Hero', 'Successor'],
    themeTags: ['Inheritance', 'Willpower'],
    vibeTags: ['Legendary', 'Explosive', 'Emotional'],
    novaReflection: "You feel the weight of the torch being passed. The embers are fading, but the fire has already ignited the next generation. It is not an end, but a transfer of will.",
    insight: "True power is not in holding on, but in knowing when to entrust the future to others.",
    soundtrack: { title: "You Say Run", intensityLevel: 10 },
    osLinks: [
        { type: 'insight', id: 'i1', title: 'Power Transfer Dynamics' },
        { type: 'thought', id: 't1', title: 'The burden of legacy' }
    ],
    createdAt: new Date(),
    isFavorite: true
  },
  {
    id: '1',
    title: 'The Eclipse',
    series: 'Berserk',
    imageUrl: 'https://images3.alphacoders.com/695/695738.jpg',
    quote: "I sacrifice.",
    quoteBy: 'Griffith',
    context: 'Griffith makes the ultimate choice between his dream and his humanity during the Eclipse.',
    emotionTags: ['despair', 'sacrifice', 'ascension'],
    archetypeTags: ['villain', 'god-hand'],
    themeTags: ['ambition', 'betrayal'],
    vibeTags: ['dark', 'ethereal', 'cosmic_horror'],
    novaReflection: "This scene carries the weight of ultimate ambition. What are you willing to sacrifice to ascend?",
    insight: "Ambition without connection creates a kingdom of ash.",
    soundtrack: { title: "Behelit Theme", intensityLevel: 8 },
    createdAt: new Date('2023-10-26'),
    isFavorite: true
  },
  {
    id: '2',
    title: 'You Are Not Alone',
    series: 'Evangelion',
    imageUrl: 'https://images.alphacoders.com/606/606272.jpg',
    quote: "I mustn't run away.",
    quoteBy: 'Shinji Ikari',
    context: 'Shinji resolves to pilot Unit-01 despite his paralyzing fear.',
    emotionTags: ['resolve', 'fear', 'connection'],
    archetypeTags: ['pilot', 'savior'],
    themeTags: ['responsibility', 'isolation'],
    vibeTags: ['mechanical', 'apocalyptic', 'neon'],
    novaReflection: "Fear is not the enemy. Paralysis is. Step into the cockpit.",
    insight: "Courage is not the absence of fear, but the decision that something else is more important.",
    createdAt: new Date('2023-11-02'),
    isFavorite: false
  },
  {
    id: '3',
    title: 'To the Moon',
    series: 'Cyberpunk: Edgerunners',
    imageUrl: 'https://images8.alphacoders.com/128/1283627.jpg',
    quote: "I'm gonna take you there myself. I promise.",
    quoteBy: 'David Martinez',
    context: 'David sacrifices everything to help Lucy achieve her dream.',
    emotionTags: ['tragic', 'hope', 'love'],
    archetypeTags: ['dreamer', 'runner'],
    themeTags: ['dreams', 'consequence'],
    vibeTags: ['cyberpunk', 'neon', 'high-octane'],
    novaReflection: "Sometimes the dream outlives the dreamer. Keep running.",
    insight: "A dream shared is a bond forged in chrome and blood.",
    createdAt: new Date('2023-11-15'),
    isFavorite: true
  }
];

export const getScenes = async (): Promise<EpicScene[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_SCENES;
};

export const analyzeScene = async (series: string, quote?: string): Promise<{ reflection: string; tags: string[]; insight: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock AI Logic
  const reflections = [
    "Khoảnh khắc này mang năng lượng của sự bứt phá.",
    "The resolve in this frame feels familiar to your current state.",
    "Infinity, hình như mày thích những cảnh gồng lên như thế này.",
    "This scene echoes something inside you.",
    "Có vẻ đây là một trong những ký hiệu thẩm mỹ của mày."
  ];

  const insights = [
    "Resilience is quiet before it is loud.",
    "Victory often requires a sacrifice of the old self.",
    "True strength is found in the protection of others.",
    "The path is clearer when you stop looking at the obstacles."
  ];

  return {
    reflection: reflections[Math.floor(Math.random() * reflections.length)],
    insight: insights[Math.floor(Math.random() * insights.length)],
    tags: ['cinematic', 'impact', 'core_memory']
  };
};

export const addScene = async (sceneData: Partial<EpicScene>): Promise<EpicScene> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const analysis = await analyzeScene(sceneData.series || '', sceneData.quote);
  
  return {
    id: Date.now().toString(),
    title: sceneData.title || 'Untitled Scene',
    series: sceneData.series || 'Unknown Series',
    imageUrl: sceneData.imageUrl || '',
    quote: sceneData.quote,
    quoteBy: sceneData.quoteBy || 'Unknown',
    context: sceneData.context || 'No context provided.',
    emotionTags: sceneData.emotionTags || [],
    archetypeTags: sceneData.archetypeTags || [],
    themeTags: sceneData.themeTags || [],
    vibeTags: sceneData.vibeTags || [],
    novaReflection: analysis.reflection,
    insight: analysis.insight,
    createdAt: new Date(),
    isFavorite: false,
    ...sceneData
  } as EpicScene;
};

export const getVaultStats = async (scenes: EpicScene[]): Promise<EpicVaultStats> => {
  // Mock calculation
  return {
    totalScenes: scenes.length,
    topEmotion: 'Resolve',
    topSeries: 'Berserk',
    lastAdded: new Date()
  };
};