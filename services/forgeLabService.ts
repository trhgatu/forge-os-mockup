
import { 
  ForgeProject, 
  ForgeFoundation, 
  ResearchTrail, 
  ForgeProjectStatus,
  ForgeFoundationCategory 
} from '../types';

// --- MOCK DATA ---

const MOCK_PROJECTS: ForgeProject[] = [
  {
    id: 'p1',
    title: 'Forge OS v3',
    description: 'The next iteration of the personal mind operating system. Focusing on AI integration and fluid UI.',
    status: 'active',
    tags: ['React', 'AI', 'System Design'],
    technologies: ['TypeScript', 'Gemini', 'Tailwind'],
    milestones: [
      { id: 'm1', title: 'Core Architecture', isCompleted: true, date: '2023-10-01' },
      { id: 'm2', title: 'Module Integration', isCompleted: true, date: '2023-10-15' },
      { id: 'm3', title: 'AI Nova Persona', isCompleted: false, date: '2023-11-01' }
    ],
    insights: ['1', '3'], 
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date(),
    novaReflection: "This project feels like a piece of your identity manifested in code."
  },
  {
    id: 'p2',
    title: 'Neural Garden',
    description: 'A generative art experiment visualizing thought patterns as organic growth.',
    status: 'idea',
    tags: ['Generative Art', 'WebGL'],
    technologies: ['Three.js', 'GLSL'],
    milestones: [],
    createdAt: new Date('2023-10-20'),
    updatedAt: new Date('2023-10-20'),
    novaReflection: "A seed waiting for the right season to bloom."
  }
];

const MOCK_FOUNDATIONS: ForgeFoundation[] = [
  {
    id: 'f1',
    title: 'Systems Over Goals',
    summary: 'The principle that consistent processes yield better long-term results than fixating on outcomes.',
    content: 'Goals are for setting direction; systems are for making progress. Winners and losers have the same goals. The difference is the system.',
    category: 'principle',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    novaReflection: "This foundation has stabilized your workflow significantly."
  },
  {
    id: 'f2',
    title: 'The Second Brain',
    summary: 'Offloading cognitive load to digital storage to free up creative bandwidth.',
    content: 'The mind is for having ideas, not holding them. Capture everything immediately. Review regularly.',
    category: 'method',
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-06-20'),
    novaReflection: "Your recent dependency on this system confirms its value."
  }
];

const MOCK_TRAILS: ResearchTrail[] = [
  {
    id: 't1',
    topic: 'Stoicism & Modernity',
    nodes: [
      { id: 'n1', title: 'Dichotomy of Control', summary: 'Distinguishing between what is up to us and what is not.', type: 'concept' },
      { id: 'n2', title: 'Meditations', summary: 'Marcus Aurelius personal notes.', type: 'source' },
      { id: 'n3', title: 'Application in Tech', summary: 'Using stoic principles to handle system failures.', type: 'note' }
    ],
    createdAt: new Date('2023-08-05'),
    novaReflection: "This trail seems to offer you resilience during high-stress periods."
  }
];

// --- SERVICE METHODS ---

export const getProjects = async (): Promise<ForgeProject[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return MOCK_PROJECTS;
};

export const getFoundations = async (): Promise<ForgeFoundation[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_FOUNDATIONS;
};

export const getResearchTrails = async (): Promise<ResearchTrail[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return MOCK_TRAILS;
};

export const generateNovaReflection = async (context: string, type: 'project' | 'foundation' | 'research'): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const reflections = {
    project: [
      "Infinity is progressing faster than you realize.",
      "The structure of this project mirrors your internal state.",
      "A worthy vessel for your energy.",
      "Building this is building yourself."
    ],
    foundation: [
      "This truth seems to be anchoring you lately.",
      "A solid bedrock for future decisions.",
      "Observe how often you return to this principle.",
      "Wisdom condensed into a protocol."
    ],
    research: [
      "This trail leads to open horizons.",
      "Knowledge is connecting in unexpected ways.",
      "You are mapping the unknown.",
      "Deep currents move through this topic."
    ]
  };

  const options = reflections[type];
  return options[Math.floor(Math.random() * options.length)];
};

export const createProject = async (title: string, description: string): Promise<ForgeProject> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    id: Date.now().toString(),
    title,
    description,
    status: 'idea',
    tags: [],
    technologies: [],
    milestones: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    novaReflection: await generateNovaReflection(title, 'project')
  };
};
