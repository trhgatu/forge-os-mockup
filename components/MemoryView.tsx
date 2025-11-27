
import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Sparkles, X, Image as ImageIcon, 
  Sun, CloudRain, Snowflake, Leaf, Sprout, 
  Wind, Mic, Maximize2, Calendar, Tag, Heart
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Memory, MoodType } from '../types';
import { analyzeMemory } from '../services/geminiService';
import { cn } from '../lib/utils';

// --- SEASONAL SYSTEM CORE ---

type InnerSeason = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

interface SeasonConfig {
  id: InnerSeason;
  label: string; // "Awakening", "Drive", etc.
  icon: React.ElementType;
  gradient: string;
  border: string;
  accent: string;
  bg: string; // Solid-ish bg for cards
  whisper: string; // Nova's poetic voice
  texture: 'dust' | 'shimmer' | 'leaves' | 'snow';
  particleColor: string;
}

const SEASON_CONFIG: Record<InnerSeason, SeasonConfig> = {
  Spring: {
    id: 'Spring',
    label: 'Awakening',
    icon: Sprout,
    // Updated for "diffused freshness" - lighter, airier feel with soft teal/sky tones
    gradient: 'from-emerald-500/20 via-teal-500/10 to-sky-500/5',
    bg: 'bg-[#061414]', // Deep mossy/teal black
    border: 'border-emerald-400/20',
    accent: 'text-emerald-200',
    whisper: "Có thứ gì đó đang mở ra trong mày.",
    texture: 'dust',
    particleColor: 'bg-emerald-100'
  },
  Summer: {
    id: 'Summer',
    label: 'Drive',
    icon: Sun,
    gradient: 'from-amber-900/40 via-orange-900/20 to-slate-900/40',
    bg: 'bg-[#110c05]',
    border: 'border-amber-500/30',
    accent: 'text-amber-200',
    whisper: "Khoảnh khắc này vẫn mang hơi ấm và sức đẩy.",
    texture: 'shimmer',
    particleColor: 'bg-amber-100'
  },
  Autumn: {
    id: 'Autumn',
    label: 'Depth',
    icon: Leaf,
    gradient: 'from-orange-950/40 via-rose-950/20 to-slate-900/40',
    bg: 'bg-[#110805]',
    border: 'border-orange-400/30',
    accent: 'text-orange-200',
    whisper: "Chiều sâu của ký ức này chạm vào một phần trưởng thành của mày.",
    texture: 'leaves',
    particleColor: 'bg-orange-300'
  },
  Winter: {
    id: 'Winter',
    label: 'Stillness',
    icon: Snowflake,
    gradient: 'from-slate-900/60 via-indigo-950/20 to-slate-950/60',
    bg: 'bg-[#050508]',
    border: 'border-indigo-300/20',
    accent: 'text-indigo-200',
    whisper: "Im lặng trong ký ức này nói nhiều hơn bất cứ lời nào.",
    texture: 'snow',
    particleColor: 'bg-white'
  }
};

// Mapping Mood -> Season
const getSeason = (mood: MoodType): InnerSeason => {
  switch (mood) {
    case 'calm':
    case 'sad':
    case 'lonely':
      return 'Spring'; // Vulnerability, Rain, Growth
    
    case 'joy':
    case 'energetic':
    case 'angry':
    case 'stressed':
      return 'Summer'; // Heat, Intensity
    
    case 'inspired':
    case 'anxious':
      return 'Autumn'; // Change, Wind, Harvest
    
    case 'neutral':
    case 'focused':
    case 'tired':
    case 'empty':
    default:
      return 'Winter'; // Cold, Stasis, Crystallization
  }
};

// --- MOCK DATA ---

const MOCK_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'The Summit at Dawn',
    description: 'Reached the peak just as the sun broke the horizon. The physical exhaustion vanished instantly, replaced by a profound sense of smallness and connection. The world below looked like a circuit board.',
    date: new Date('2023-11-15'),
    type: 'milestone',
    mood: 'inspired', // Autumn
    tags: ['Nature', 'Achievement', 'Perspective'],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    reflectionDepth: 9,
    analysis: {
      coreMeaning: "Physical struggle often precedes spiritual clarity.",
      emotionalPattern: "Seeking elevation to find peace.",
      timelineConnection: "Connects to 'The Marathon' (2021).",
      sentimentScore: 9
    }
  },
  {
    id: '2',
    title: 'Deep Code Flow',
    description: '3 AM. The bug is fixed. The music is perfect. Flow state achieved. It felt like I was speaking directly to the machine. Silence in the room, loud in the mind.',
    date: new Date('2023-10-22'),
    type: 'moment',
    mood: 'focused', // Winter
    tags: ['Code', 'Flow', 'Night'],
    reflectionDepth: 7,
    analysis: {
      coreMeaning: "Creation is the ultimate form of communication.",
      emotionalPattern: "Solitude fuels your competence.",
      timelineConnection: "Echoes early coding days.",
      sentimentScore: 8
    }
  },
  {
    id: '3',
    title: 'Rainy Cafe Reflection',
    description: 'Watching the rain hit the window. Realized I have been running too fast. Need to slow down. The coffee was warm, but my hands were cold.',
    date: new Date('2023-09-10'),
    type: 'insight',
    mood: 'calm', // Spring
    tags: ['Rest', 'City', 'Rain'],
    imageUrl: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?auto=format&fit=crop&q=80&w=800',
    reflectionDepth: 8,
  },
  {
    id: '4',
    title: 'Startup Pitch',
    description: 'The lights were too bright. My heart was racing. But when I started speaking, the fire took over.',
    date: new Date('2023-08-05'),
    type: 'challenge',
    mood: 'energetic', // Summer
    tags: ['Growth', 'Fear', 'Work'],
    reflectionDepth: 8,
  }
];

// --- VISUAL FX COMPONENTS ---

const Particles: React.FC<{ type: SeasonConfig['texture']; color: string }> = ({ type, color }) => {
  // Increase particle count for dust to feel like "floating particles"
  const count = type === 'dust' ? 20 : 8;
  const particles = useMemo(() => Array.from({ length: count }), [count]);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
      {particles.map((_, i) => {
        const left = `${Math.random() * 100}%`;
        const top = `${Math.random() * 100}%`;
        const delay = `${Math.random() * 5}s`;
        const duration = `${type === 'dust' ? 15 + Math.random() * 15 : 5 + Math.random() * 10}s`;
        
        let animationClass = '';
        let blurClass = '';
        let size = Math.random() * 3 + 1;

        if (type === 'dust') {
            animationClass = 'animate-float'; 
            blurClass = 'blur-[1px]'; // Soft, diffused dust
            size = Math.random() * 2 + 1; // Smaller particles
        } else if (type === 'shimmer') {
             animationClass = 'animate-float';
        } else if (type === 'snow') {
             animationClass = 'animate-[fall_10s_linear_infinite]'; 
        } else if (type === 'leaves') {
             animationClass = 'animate-[sway_8s_ease-in-out_infinite]'; 
        }

        return (
          <div
            key={i}
            className={cn("absolute rounded-full", animationClass, blurClass, color)}
            style={{
              left,
              top,
              width: size + 'px',
              height: size + 'px',
              animationDelay: delay,
              animationDuration: duration,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        );
      })}
    </div>
  );
};

// --- CARD COMPONENT ---

const SeasonalCard: React.FC<{ 
  memory: Memory; 
  onClick: () => void; 
}> = ({ memory, onClick }) => {
  const season = getSeason(memory.mood);
  const config = SEASON_CONFIG[season];
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ease-out",
        "hover:-translate-y-2 hover:shadow-2xl",
        "min-h-[280px] flex flex-col border backdrop-blur-md",
        config.bg,
        config.border
      )}
    >
      {/* Atmospheric Background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity duration-700 group-hover:opacity-60", config.gradient)} />
      
      {/* Diffused Freshness Texture for Spring */}
      {season === 'Spring' && (
        <>
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50" />
        </>
      )}
      
      {/* Particles Layer */}
      <Particles type={config.texture} color={config.particleColor} />

      {/* Image Layer (if exists) - Blends with season */}
      {memory.imageUrl && (
        <div className="absolute inset-0 z-0">
          <img 
            src={memory.imageUrl} 
            alt="" 
            className="w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-[50%]"
          />
          <div className={cn("absolute inset-0 bg-gradient-to-t", `from-[${config.bg.replace('bg-', '')}]`, "via-transparent to-transparent")} />
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        
        {/* Top Indicator */}
        <div className="flex justify-between items-start mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold border bg-black/20 backdrop-blur-md",
            config.accent, config.border
          )}>
            <config.icon size={12} />
            {config.label}
          </div>
          {memory.analysis && <Sparkles size={14} className={cn("animate-pulse", config.accent)} />}
        </div>

        {/* Middle - Spacer */}
        <div className="flex-1" />

        {/* Title & Description */}
        <div className="mt-auto">
          <h3 className={cn("text-2xl font-display font-medium text-white leading-tight mb-3 group-hover:translate-x-1 transition-transform duration-500")}>
            {memory.title}
          </h3>
          
          <div className={cn("h-px w-12 mb-4 transition-all duration-700 group-hover:w-full opacity-50", config.particleColor.replace('bg-', 'bg-'))} />

          <p className="text-sm text-gray-400 font-light leading-relaxed line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity font-serif">
            {memory.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
          <span>{memory.date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
          <span className="uppercase tracking-wider opacity-50">#{memory.mood}</span>
        </div>
      </div>
    </div>
  );
};

// --- DETAIL PANEL (Standardized) ---

const MemoryDetailPanel: React.FC<{
  memory: Memory | null;
  onClose: () => void;
  onAnalyze: (id: string) => void;
  isAnalyzing: boolean;
}> = ({ memory, onClose, onAnalyze, isAnalyzing }) => {
  if (!memory) return null;
  const season = getSeason(memory.mood);
  const config = SEASON_CONFIG[season];

  return (
    <div className={cn(
        "fixed inset-y-0 right-0 w-full md:w-[500px] bg-black/90 backdrop-blur-2xl border-l shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-500",
        config.border // Use season border color
    )}>
       {/* Background Ambience */}
       <div className={cn("absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-br", config.gradient)} />
       {season === 'Spring' && (
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
          />
       )}
       <Particles type={config.texture} color={config.particleColor} />

       {/* Header */}
       <div className="p-6 border-b border-white/5 flex justify-between items-start bg-black/40 shrink-0 relative z-10">
          <div>
             <div className={cn("flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest", config.accent)}>
               <config.icon size={14} /> Season of {config.label}
             </div>
             <h2 className="text-2xl font-display font-bold text-white leading-tight">{memory.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
             <X size={20} />
          </button>
       </div>

       {/* Scrollable Content */}
       <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10">
          
          {/* Image Section */}
          {memory.imageUrl && (
             <div className="rounded-xl overflow-hidden border border-white/10 relative aspect-video">
                <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
             </div>
          )}

          {/* Metadata Strip */}
          <div className="flex items-center gap-4 text-xs text-gray-400 font-mono border-b border-white/5 pb-6">
             <span className="flex items-center gap-2"><Calendar size={12} /> {memory.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
             <span className="w-px h-3 bg-white/10" />
             <span className="flex items-center gap-2 capitalize"><Heart size={12} /> {memory.mood}</span>
          </div>

          {/* Body Content */}
          <div className="prose prose-invert prose-sm max-w-none">
             <p className="text-base text-gray-200 leading-relaxed font-serif whitespace-pre-line">
                {memory.description}
             </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
             {memory.tags.map(t => (
                <span key={t} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center gap-1">
                   <Tag size={10} /> {t}
                </span>
             ))}
          </div>

          {/* AI Analysis Section */}
          <div className="border-t border-white/5 pt-8">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                   <Sparkles size={14} className="text-forge-accent" /> Neural Reflection
                </h3>
                {!memory.analysis && (
                   <button 
                      onClick={() => onAnalyze(memory.id)}
                      disabled={isAnalyzing}
                      className="text-xs bg-white/5 hover:bg-forge-accent hover:text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                   >
                      {isAnalyzing ? <Sparkles size={12} className="animate-spin"/> : <Mic size={12} />}
                      {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                   </button>
                )}
             </div>

             {memory.analysis ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                   {/* Nova Whisper Card */}
                   <div className={cn("p-5 rounded-xl border bg-white/[0.02] relative overflow-hidden", config.border)}>
                      <div className={cn("absolute inset-0 opacity-5 bg-gradient-to-br", config.gradient)} />
                      <div className="relative z-10">
                         <div className={cn("text-[10px] font-mono uppercase tracking-widest mb-2", config.accent)}>Nova Whisper</div>
                         <p className="text-sm text-gray-300 italic">"{config.whisper}"</p>
                      </div>
                   </div>

                   {/* Meaning */}
                   <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Core Meaning</div>
                      <p className="text-sm text-white">{memory.analysis.coreMeaning}</p>
                   </div>

                   {/* Pattern */}
                   <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Detected Pattern</div>
                      <p className="text-sm text-gray-300">{memory.analysis.emotionalPattern}</p>
                   </div>
                </div>
             ) : (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                   <p className="text-xs text-gray-500">Analyze this memory to reveal hidden patterns and connections.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

// --- CREATE MODAL ---

const CreateMemoryModal: React.FC<{ onClose: () => void; onSave: (m: Memory) => void }> = ({ onClose, onSave }) => {
   const [title, setTitle] = useState('');
   const [desc, setDesc] = useState('');
   const [mood, setMood] = useState<MoodType>('neutral');
   const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

   const handleSave = () => {
      if (!title || !desc) return;
      const newMemory: Memory = {
         id: Date.now().toString(),
         title,
         description: desc,
         date: new Date(),
         mood,
         type: 'moment',
         tags: [],
         reflectionDepth: 5,
         imageUrl
      };
      onSave(newMemory);
      onClose();
   };

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
         <div className="w-full max-w-lg bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
               <h3 className="font-display font-bold text-white tracking-wide">Preserve Moment</h3>
               <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-6">
               <div>
                  <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Artifact Name</label>
                  <input 
                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-white/20 focus:outline-none font-display"
                     placeholder="Untitled Memory"
                     value={title}
                     onChange={e => setTitle(e.target.value)}
                     autoFocus
                  />
               </div>
               <div>
                  <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Atmosphere</label>
                  <textarea 
                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/20 focus:outline-none h-32 resize-none leading-relaxed"
                     placeholder="What is the texture of this moment?"
                     value={desc}
                     onChange={e => setDesc(e.target.value)}
                  />
               </div>
               <div>
                  <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Emotional Charge</label>
                  <div className="flex flex-wrap gap-2">
                     {['joy', 'calm', 'inspired', 'neutral', 'sad', 'anxious', 'focused'].map((m) => (
                        <button 
                           key={m}
                           onClick={() => setMood(m as MoodType)}
                           className={cn(
                             "px-3 py-1 rounded text-xs border transition-all capitalize",
                             mood === m ? 'bg-white text-black border-white font-bold' : 'text-gray-500 border-white/10 hover:border-white/30'
                           )}
                        >
                           {m}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
               <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all">Discard</button>
               <button onClick={handleSave} className="px-6 py-2 rounded-lg text-xs bg-white text-black font-bold hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all">Crystallize</button>
            </div>
         </div>
      </div>
   );
};

// --- MAIN VIEW ---

export const MemoryView: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<InnerSeason | 'All'>('All');

  const filteredMemories = useMemo(() => {
    let filtered = memories.filter(m => 
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (activeFilter !== 'All') {
      filtered = filtered.filter(m => getSeason(m.mood) === activeFilter);
    }
    return filtered;
  }, [memories, searchTerm, activeFilter]);

  const selectedMemory = memories.find(m => m.id === selectedMemoryId) || null;

  const handleAnalyze = async (id: string) => {
     const mem = memories.find(m => m.id === id);
     if (!mem) return;
     setIsAnalyzing(true);
     try {
        const analysis = await analyzeMemory(mem.description);
        setMemories(prev => prev.map(m => m.id === id ? { ...m, analysis } : m));
     } catch (error) {
        console.error(error);
     } finally {
        setIsAnalyzing(false);
     }
  };

  const handleSaveNew = (newMem: Memory) => setMemories([newMem, ...memories]);

  return (
    <div className={cn(
      "h-full flex flex-col relative overflow-hidden animate-in fade-in duration-1000 selection:bg-white/20",
      // Subtle global tint based on filter
      activeFilter === 'Spring' ? 'bg-[#020a0a]' :
      activeFilter === 'Summer' ? 'bg-[#0c0804]' :
      activeFilter === 'Autumn' ? 'bg-[#0c0505]' :
      activeFilter === 'Winter' ? 'bg-[#02030a]' :
      'bg-[#020204]'
    )}>
      
      {/* Global Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000">
        <div className={cn(
          "absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b opacity-30 transition-colors duration-1000",
          activeFilter === 'Spring' ? 'from-emerald-900/30' :
          activeFilter === 'Summer' ? 'from-amber-900/30' :
          activeFilter === 'Autumn' ? 'from-orange-900/30' :
          'from-slate-900/30'
        )} />
      </div>

      {/* Header */}
      <div className="shrink-0 px-8 py-8 flex items-end justify-between z-20 sticky top-0 backdrop-blur-sm border-b border-white/5">
         <div>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">
              <Wind size={14} /> Mnemosyne Engine
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Memory Landscape</h1>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={14} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search echoes..."
                className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-white/20 w-48 transition-all placeholder-gray-600"
              />
            </div>
            <button 
              onClick={() => setIsCreating(true)} 
              className="flex items-center gap-2 px-5 py-2 bg-white text-black rounded-full text-xs font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Plus size={14} /> Preserve
            </button>
         </div>
      </div>

      {/* Filter Bar */}
      <div className="px-8 py-4 flex gap-2 overflow-x-auto scrollbar-hide z-20">
        {['All', 'Spring', 'Summer', 'Autumn', 'Winter'].map((season) => {
           const config = SEASON_CONFIG[season as InnerSeason];
           const isActive = activeFilter === season;
           return (
             <button
               key={season}
               onClick={() => setActiveFilter(season as any)}
               className={cn(
                 "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2",
                 isActive 
                   ? "bg-white/10 text-white border-white/20 shadow-lg" 
                   : "bg-transparent text-gray-500 border-transparent hover:bg-white/5 hover:text-gray-300"
               )}
             >
               {config && <config.icon size={12} className={isActive ? config.accent : 'text-gray-600'} />}
               {season}
             </button>
           );
        })}
      </div>

      {/* Seasonal Feed */}
      <div className="flex-1 overflow-y-auto px-8 pb-32 scrollbar-hide relative z-10">
         <div className="max-w-7xl mx-auto pt-8">
            
            {filteredMemories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
                {filteredMemories.map(memory => (
                  <SeasonalCard 
                    key={memory.id} 
                    memory={memory} 
                    onClick={() => setSelectedMemoryId(memory.id)} 
                  />
                ))}
              </div>
            ) : (
               <div className="py-32 text-center opacity-40">
                  <ImageIcon size={32} className="mx-auto mb-4 text-white" />
                  <p className="text-sm font-mono text-gray-500">The landscape is silent.</p>
               </div>
            )}
         </div>
      </div>

      {/* Detail View (Side Panel) */}
      {selectedMemory && (
        <MemoryDetailPanel 
          memory={selectedMemory} 
          onClose={() => setSelectedMemoryId(null)} 
          onAnalyze={handleAnalyze} 
          isAnalyzing={isAnalyzing} 
        />
      )}

      {/* Create Modal */}
      {isCreating && (
         <CreateMemoryModal onClose={() => setIsCreating(false)} onSave={handleSaveNew} />
      )}
    </div>
  );
};