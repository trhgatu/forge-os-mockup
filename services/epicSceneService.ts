
import { EpicScene, EpicVaultStats } from '../types';

const MOCK_SCENES: EpicScene[] = [
  {
    id: '4',
    title: 'United States of Smash',
    series: 'My Hero Academia',
    imageUrl: 'https://img.youtube.com/vi/rLl9XBg7wSs/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/rLl9XBg7wSs?si=c4eeOM-XY2T9_nNu',
    quote: "Next, it's your turn.",
    emotionTags: ['legacy', 'victory', 'farewell'],
    archetypeTags: ['hero', 'mentor'],
    vibeTags: ['legendary', 'emotional', 'explosive'],
    novaReflection: "The torch is passed. The fire doesn't die; it simply changes hands. You are next.",
    createdAt: new Date(),
    isFavorite: true
  },
  {
    id: '1',
    title: 'The Eclipse',
    series: 'Berserk',
    imageUrl: 'https://images3.alphacoders.com/695/695738.jpg',
    quote: "I sacrifice.",
    emotionTags: ['despair', 'sacrifice', 'ascension'],
    archetypeTags: ['villain', 'god-hand'],
    vibeTags: ['dark', 'ethereal', 'cosmic_horror'],
    novaReflection: "This scene carries the weight of ultimate ambition. What are you willing to sacrifice to ascend?",
    createdAt: new Date('2023-10-26'),
    isFavorite: true
  },
  {
    id: '2',
    title: 'You Are Not Alone',
    series: 'Evangelion',
    imageUrl: 'https://images.alphacoders.com/606/606272.jpg',
    quote: "I mustn't run away.",
    emotionTags: ['resolve', 'fear', 'connection'],
    archetypeTags: ['pilot', 'savior'],
    vibeTags: ['mechanical', 'apocalyptic', 'neon'],
    novaReflection: "Fear is not the enemy. Paralysis is. Step into the cockpit.",
    createdAt: new Date('2023-11-02'),
    isFavorite: false
  },
  {
    id: '3',
    title: 'To the Moon',
    series: 'Cyberpunk: Edgerunners',
    imageUrl: 'https://images8.alphacoders.com/128/1283627.jpg',
    quote: "I'm gonna take you there myself. I promise.",
    emotionTags: ['tragic', 'hope', 'love'],
    archetypeTags: ['dreamer', 'runner'],
    vibeTags: ['cyberpunk', 'neon', 'high-octane'],
    novaReflection: "Sometimes the dream outlives the dreamer. Keep running.",
    createdAt: new Date('2023-11-15'),
    isFavorite: true
  }
];

export const getScenes = async (): Promise<EpicScene[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_SCENES;
};

export const analyzeScene = async (series: string, quote?: string): Promise<{ reflection: string; tags: string[] }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock AI Logic
  const reflections = [
    "Khoảnh khắc này mang năng lượng của sự bứt phá.",
    "The resolve in this frame feels familiar to your current state.",
    "Infinity, hình như mày thích những cảnh gồng lên như thế này.",
    "This scene echoes something inside you.",
    "Có vẻ đây là một trong những ký hiệu thẩm mỹ của mày."
  ];

  return {
    reflection: reflections[Math.floor(Math.random() * reflections.length)],
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
    emotionTags: sceneData.emotionTags || [],
    archetypeTags: sceneData.archetypeTags || [],
    vibeTags: sceneData.vibeTags || [],
    novaReflection: analysis.reflection,
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
