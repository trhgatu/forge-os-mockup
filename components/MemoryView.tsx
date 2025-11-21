
import React, { useState, useRef } from 'react';
import { Search, Filter, Plus, Calendar, Tag, Sparkles, X, Image as ImageIcon, Clock, Upload } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Memory, MemoryType, MoodType } from '../types';
import { analyzeMemory } from '../services/geminiService';
import { cn } from '../lib/utils';

// --- MOCK DATA & CONFIG ---
const MOCK_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'The Summit at Dawn',
    description: 'Reached the peak just as the sun broke the horizon. The physical exhaustion vanished instantly, replaced by a profound sense of smallness and connection. The world below looked like a circuit board.',
    date: new Date('2023-11-15'),
    type: 'milestone',
    mood: 'inspired',
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
    title: 'Late Night Coding',
    description: '3 AM. The bug is fixed. The music is perfect. Flow state achieved. It felt like I was speaking directly to the machine.',
    date: new Date('2023-10-22'),
    type: 'moment',
    mood: 'focused',
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
    description: 'Watching the rain hit the window. Realized I have been running too fast. Need to slow down.',
    date: new Date('2023-09-10'),
    type: 'insight',
    mood: 'calm',
    tags: ['Rest', 'City', 'Rain'],
    imageUrl: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?auto=format&fit=crop&q=80&w=800',
    reflectionDepth: 8,
  },
  {
    id: '4',
    title: 'First Public Speech',
    description: 'Terrified beforehand. Exhilarated afterwards. The fear is just energy waiting to be transmuted.',
    date: new Date('2023-08-05'),
    type: 'challenge',
    mood: 'anxious',
    tags: ['Growth', 'Fear', 'Public Speaking'],
    reflectionDepth: 8,
  }
];

const MOOD_CONFIG: Record<MoodType, { color: string, border: string, glow: string }> = {
  inspired: { color: 'text-fuchsia-400', border: 'border-fuchsia-500/30', glow: 'shadow-fuchsia-500/20' },
  calm: { color: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/20' },
  anxious: { color: 'text-orange-400', border: 'border-orange-500/30', glow: 'shadow-orange-500/20' },
  tired: { color: 'text-gray-400', border: 'border-gray-500/30', glow: 'shadow-gray-500/20' },
  focused: { color: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
  neutral: { color: 'text-white', border: 'border-white/30', glow: 'shadow-white/10' },
  joy: { color: 'text-yellow-400', border: 'border-yellow-500/30', glow: 'shadow-yellow-500/20' },
  sad: { color: 'text-indigo-400', border: 'border-indigo-500/30', glow: 'shadow-indigo-500/20' },
  stressed: { color: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-red-500/20' },
  lonely: { color: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
  angry: { color: 'text-rose-500', border: 'border-rose-500/30', glow: 'shadow-rose-500/20' },
  energetic: { color: 'text-lime-400', border: 'border-lime-500/30', glow: 'shadow-lime-500/20' },
  empty: { color: 'text-stone-400', border: 'border-stone-500/30', glow: 'shadow-stone-500/20' },
};

const MemoryCard: React.FC<{ 
  memory: Memory; 
  onClick: () => void;
  variant?: 'default' | 'cinematic'; 
}> = ({ memory, onClick, variant = 'default' }) => {
  const moodStyle = MOOD_CONFIG[memory.mood];
  const isCinematic = variant === 'cinematic' || (!!memory.imageUrl && memory.reflectionDepth > 8);

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-spring-out border hover:scale-[1.02] hover:z-10",
        isCinematic 
          ? 'md:col-span-2 md:row-span-2 min-h-[300px] border-transparent shadow-2xl' 
          : 'min-h-[200px] bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10 shadow-lg'
      )}
    >
      {memory.imageUrl && (
        <div className="absolute inset-0 z-0">
          <img 
            src={memory.imageUrl} 
            alt={memory.title} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      )}

      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className={cn(
            "px-2 py-1 rounded-lg backdrop-blur-md text-[10px] font-mono uppercase tracking-wider border",
            isCinematic ? 'bg-black/40 border-white/10 text-white' : 'bg-white/5 border-white/5 text-gray-400'
          )}>
            {memory.type}
          </div>
          <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]", moodStyle.color.replace('text-', 'bg-'))} />
        </div>

        <div className="mt-auto">
          <h3 className={cn("font-display font-bold mb-2 leading-tight", isCinematic ? 'text-2xl text-white' : 'text-lg text-gray-100')}>
            {memory.title}
          </h3>
          <p className={cn("text-sm line-clamp-3 mb-4", isCinematic ? 'text-gray-200' : 'text-gray-500')}>
            {memory.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {memory.date.toLocaleDateString()}
            </span>
            {memory.analysis && (
               <span className="flex items-center gap-1 text-forge-accent">
                  <Sparkles size={12} /> Analyzed
               </span>
            )}
          </div>
        </div>
      </div>

      <div className={cn("absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none", moodStyle.border)} />
    </div>
  );
};

const DetailPanel: React.FC<{
  memory: Memory | null;
  onClose: () => void;
  onAnalyze: (id: string) => void;
  isAnalyzing: boolean;
}> = ({ memory, onClose, onAnalyze, isAnalyzing }) => {
  if (!memory) return null;
  const moodStyle = MOOD_CONFIG[memory.mood];

  return (
    <div className="absolute inset-y-0 right-0 w-full md:w-[450px] bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 overflow-y-auto transform transition-transform duration-500 ease-spring-out">
      {memory.imageUrl && (
        <div className="relative h-64 w-full">
           <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
           <button 
             onClick={onClose}
             className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white hover:bg-white/10 transition-all"
           >
             <X size={18} />
           </button>
        </div>
      )}

      <div className={cn("p-8", memory.imageUrl ? '-mt-12 relative z-10' : 'mt-0')}>
        {!memory.imageUrl && (
           <div className="flex justify-end mb-4">
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400"><X size={18}/></button>
           </div>
        )}

        <div className="flex items-center gap-3 mb-4">
           <span className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border bg-transparent", moodStyle.color, moodStyle.border)}>
              {memory.mood}
           </span>
           <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
              <Clock size={12} /> {memory.date.toLocaleDateString()}
           </span>
        </div>

        <h2 className="text-3xl font-display font-bold text-white mb-6">{memory.title}</h2>

        <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed mb-8">
           <p>{memory.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
           {memory.tags.map(tag => (
              <span key={tag} className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-400 border border-white/5 flex items-center gap-1">
                 <Tag size={10} /> {tag}
              </span>
           ))}
        </div>

        <div className="border-t border-white/10 pt-8">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                 <Sparkles size={14} className="text-forge-accent" /> Neural Analysis
              </h3>
              {!memory.analysis && (
                <button 
                   onClick={() => onAnalyze(memory.id)}
                   disabled={isAnalyzing}
                   className="text-xs bg-white/5 hover:bg-forge-accent hover:text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                >
                   {isAnalyzing ? 'Processing...' : 'Generate Insight'}
                </button>
              )}
           </div>

           {memory.analysis ? (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <GlassCard className="bg-gradient-to-br from-forge-accent/10 to-transparent border-forge-accent/20" noPadding>
                   <div className="p-4">
                      <div className="text-[10px] text-forge-accent font-mono uppercase tracking-widest mb-2">Core Meaning</div>
                      <p className="text-sm text-white italic">"{memory.analysis.coreMeaning}"</p>
                   </div>
                </GlassCard>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Pattern</div>
                      <p className="text-xs text-gray-300">{memory.analysis.emotionalPattern}</p>
                   </div>
                   <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Timeline</div>
                      <p className="text-xs text-gray-300">{memory.analysis.timelineConnection}</p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="p-8 rounded-xl border border-dashed border-white/10 text-center">
                <p className="text-sm text-gray-500 mb-2">No deep analysis generated yet.</p>
                <p className="text-xs text-gray-600">Activate the Neural Core to extract hidden patterns.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const CreateMemoryModal: React.FC<{ onClose: () => void; onSave: (m: Memory) => void }> = ({ onClose, onSave }) => {
   const [title, setTitle] = useState('');
   const [desc, setDesc] = useState('');
   const [mood, setMood] = useState<MoodType>('neutral');
   const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
   const fileInputRef = useRef<HTMLInputElement>(null);

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

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setImageUrl(reader.result as string);
         };
         reader.readAsDataURL(file);
      }
   };

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
         <div className="relative w-full max-w-lg bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
               <h3 className="font-display font-bold text-white">Capture Memory</h3>
               <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto">
               <div>
                  <label className="block text-xs text-gray-500 font-mono uppercase mb-2">Title</label>
                  <input 
                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-forge-accent focus:outline-none"
                     placeholder="Name this moment..."
                     value={title}
                     onChange={e => setTitle(e.target.value)}
                     autoFocus
                  />
               </div>

               <div>
                  <label className="block text-xs text-gray-500 font-mono uppercase mb-2">Visual Artifact</label>
                  <div className="w-full">
                     {imageUrl ? (
                        <div className="relative rounded-lg overflow-hidden border border-white/10 group">
                           <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover" />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                 onClick={() => setImageUrl(undefined)}
                                 className="px-3 py-1.5 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg hover:bg-red-500/40 transition-colors text-xs"
                              >
                                 Remove Image
                              </button>
                           </div>
                        </div>
                     ) : (
                        <div 
                           onClick={() => fileInputRef.current?.click()}
                           className="w-full h-32 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-forge-accent/50 hover:bg-white/5 transition-all group"
                        >
                           <div className="p-3 rounded-full bg-white/5 text-gray-400 group-hover:text-white mb-2 transition-colors">
                              <Upload size={20} />
                           </div>
                           <span className="text-xs text-gray-500 group-hover:text-gray-300">Upload Image</span>
                        </div>
                     )}
                     <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  </div>
               </div>

               <div>
                  <label className="block text-xs text-gray-500 font-mono uppercase mb-2">Description</label>
                  <textarea 
                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-forge-accent focus:outline-none h-32 resize-none"
                     placeholder="What happened? How did it feel?"
                     value={desc}
                     onChange={e => setDesc(e.target.value)}
                  />
               </div>
               <div>
                  <label className="block text-xs text-gray-500 font-mono uppercase mb-2">Emotional Resonance</label>
                  <div className="flex gap-2 flex-wrap">
                     {Object.keys(MOOD_CONFIG).map(m => (
                        <button 
                           key={m}
                           onClick={() => setMood(m as MoodType)}
                           className={cn(
                             "px-3 py-1 rounded-full text-xs border transition-all capitalize",
                             mood === m ? cn(MOOD_CONFIG[m as MoodType].color, 'border-current') : 'text-gray-500 border-transparent hover:bg-white/5'
                           )}
                        >
                           {m}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3 shrink-0">
               <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">Cancel</button>
               <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm bg-forge-accent text-white hover:bg-forge-accent/80 shadow-lg shadow-forge-accent/20">Save to Archive</button>
            </div>
         </div>
      </div>
   );
};

export const MemoryView: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES);
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredMemories = filter ? memories.filter(m => m.type === filter) : memories;
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
    <div className="h-full flex bg-forge-bg text-white relative overflow-hidden animate-in fade-in duration-700">
      <div className="w-64 flex-shrink-0 border-r border-white/5 bg-black/20 p-4 hidden lg:block">
        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 px-2">Archive Index</h3>
        <div className="space-y-1">
          {[{id:'all', label:'All Memories'}, {id:'milestone', label:'Milestones'}, {id:'moment', label:'Moments'}, {id:'insight', label:'Insights'}].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id === 'all' ? null : cat.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                (filter === cat.id) || (filter === null && cat.id === 'all') ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 h-full flex flex-col relative z-0">
        <div className="shrink-0 px-8 py-6 flex items-center justify-between bg-gradient-to-b from-forge-bg to-transparent z-20 sticky top-0">
           <div>
              <h1 className="text-2xl font-display font-bold text-white">Memory Archive</h1>
              <p className="text-xs text-gray-500 mt-1 font-mono">{memories.length} Artifacts Stored</p>
           </div>
           <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
              <Plus size={16} /> <span className="hidden md:inline">Add Memory</span>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-0 scrollbar-hide">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {filteredMemories.map((memory, index) => (
                 <MemoryCard key={memory.id} memory={memory} onClick={() => setSelectedMemoryId(memory.id)} variant={index === 0 ? 'cinematic' : 'default'} />
              ))}
              {filteredMemories.length === 0 && (
                 <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                    <ImageIcon size={24} className="mb-4 opacity-20" />
                    <p>No memories found in this sector.</p>
                 </div>
              )}
           </div>
        </div>
      </div>

      {selectedMemory && (
        <DetailPanel memory={selectedMemory} onClose={() => setSelectedMemoryId(null)} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      )}
      {isCreating && (
         <CreateMemoryModal onClose={() => setIsCreating(false)} onSave={handleSaveNew} />
      )}
    </div>
  );
};
