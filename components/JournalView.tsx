
import React, { useState } from 'react';
import { 
  Search, Plus, Calendar, MoreHorizontal, PenLine, Sparkles, Maximize2, Minimize2, Tag, Hash, ChevronRight, Save, BrainCircuit,
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { JournalEntry, JournalAnalysis, MoodType } from '../types';
import { analyzeJournalEntry } from '../services/geminiService';
import { cn } from '../lib/utils';

// --- MOCK DATA ---
const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    title: 'The Architecture of Silence',
    content: "Today I realized that noise isn't just sound. It's visual clutter, it's unread notifications, it's the constant hum of expectation. I spent an hour just staring at the wall, letting the mental sediment settle. In that silence, I found the solution to the navigation problem I've been stuck on for days. It wasn't about adding more; it was about removing the friction.",
    date: new Date(),
    mood: 'calm',
    tags: ['Design', 'Philosophy', 'Silence'],
    analysis: {
        sentimentScore: 8,
        keywords: ['Minimalism', 'Clarity', 'Focus'],
        summary: 'True insight often requires the removal of external stimuli.',
        suggestedAction: 'Schedule a 30-minute deep focus block tomorrow.'
    }
  },
  {
    id: '2',
    title: 'System Entropy',
    content: "Everything tends towards disorder. My desk, my code, my schedule. Keeping order requires energy injection. I'm feeling tired today, like my personal entropy is winning. Need to re-calibrate my habits.",
    date: new Date(Date.now() - 86400000), 
    mood: 'tired',
    tags: ['Systems', 'Habits'],
    analysis: {
        sentimentScore: 3,
        keywords: ['Entropy', 'Fatigue', 'Disorder'],
        summary: 'Disorder is natural; resilience is the act of constant realignment.',
        suggestedAction: 'Rest tonight. Do not force organization when energy is low.'
    }
  },
  {
    id: '3',
    title: 'Project Nebula Ideas',
    content: "What if the interface itself was alive? Not just responding to clicks, but anticipating intent. We could use the cursor velocity to predict the next action...",
    date: new Date(Date.now() - 172800000), 
    mood: 'inspired',
    tags: ['Work', 'Ideas'],
  }
];

const MOOD_COLORS: Record<MoodType, string> = {
  inspired: 'text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/20',
  calm: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  anxious: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  tired: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  focused: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  neutral: 'text-white bg-white/10 border-white/20',
  joy: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  sad: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  stressed: 'text-red-400 bg-red-400/10 border-red-400/20',
  lonely: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  angry: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  energetic: 'text-lime-400 bg-lime-400/10 border-lime-400/20',
  empty: 'text-stone-400 bg-stone-400/10 border-stone-400/20',
};

const JournalSidebar: React.FC<{
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}> = ({ entries, selectedId, onSelect, onNew }) => {
  return (
    <div className="w-80 flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl h-full">
      <div className="p-4 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-white tracking-wide">JOURNAL</h2>
          <button onClick={onNew} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
            <Plus size={18} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input 
            type="text" 
            placeholder="Search thoughts..." 
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-forge-accent/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <div>
          <h3 className="px-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Timeline</h3>
          <div className="space-y-1">
            {entries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onSelect(entry.id)}
                className={cn(
                  "group p-3 rounded-xl cursor-pointer border transition-all duration-200",
                  selectedId === entry.id 
                    ? 'bg-white/10 border-white/10 shadow-lg' 
                    : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className={cn("font-medium text-sm truncate pr-2", selectedId === entry.id ? 'text-white' : 'text-gray-300 group-hover:text-white')}>
                    {entry.title || 'Untitled Entry'}
                  </h4>
                  {entry.analysis && <div className={cn("w-1.5 h-1.5 rounded-full", MOOD_COLORS[entry.mood].split(' ')[0].replace('text-', 'bg-'))} />}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
                  {entry.content}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-600 font-mono">
                    {entry.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  {entry.tags.slice(0,1).map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const JournalEditor: React.FC<{
  entry: JournalEntry;
  onChange: (updates: Partial<JournalEntry>) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
}> = ({ entry, onChange, onAnalyze, isAnalyzing, isFocusMode, toggleFocusMode }) => {
  return (
    <div className={cn("flex-1 relative h-full flex flex-col transition-all duration-500", isFocusMode ? 'bg-black' : 'bg-transparent')}>
      <div className={cn(
        "shrink-0 px-8 py-4 flex items-center justify-between border-b border-white/5 transition-all duration-500",
        isFocusMode ? '-mt-16 opacity-0 pointer-events-none' : 'mt-0 opacity-100'
      )}>
         <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
            <span className="flex items-center gap-2"><Calendar size={12} /> {entry.date.toLocaleDateString()}</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1 text-green-500"><Save size={12} /> Saved</span>
         </div>
         
         <div className="flex items-center gap-2">
            <button 
              onClick={toggleFocusMode}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors" 
              title="Focus Mode"
            >
               {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button 
               onClick={onAnalyze}
               disabled={isAnalyzing}
               className={cn(
                 "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all border",
                 isAnalyzing 
                    ? 'bg-forge-accent/20 text-forge-accent border-forge-accent/20 animate-pulse cursor-wait' 
                    : 'bg-white/5 text-white border-white/10 hover:bg-forge-accent hover:border-forge-accent hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]'
               )}
            >
               <Sparkles size={14} />
               {isAnalyzing ? 'Neural Processing...' : 'AI Reflect'}
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-12 min-h-full flex flex-col">
          <div className={cn("flex gap-2 mb-6 transition-opacity duration-500", isFocusMode ? 'opacity-0 hover:opacity-100' : 'opacity-100')}>
             {(Object.keys(MOOD_COLORS) as MoodType[]).map(mood => (
                <button
                  key={mood}
                  onClick={() => onChange({ mood })}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs capitalize border transition-all",
                    entry.mood === mood ? cn(MOOD_COLORS[mood], 'shadow-[0_0_10px_rgba(0,0,0,0.2)] scale-105') : 'text-gray-600 border-transparent hover:bg-white/5'
                  )}
                >
                  {mood}
                </button>
             ))}
          </div>

          <input 
            type="text"
            value={entry.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Title your thought..."
            className="w-full bg-transparent border-none text-4xl font-display font-bold text-white placeholder-gray-700 focus:ring-0 px-0 py-4 mb-4"
          />

          <textarea 
            value={entry.content}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="Start writing..."
            className="flex-1 w-full bg-transparent border-none text-lg leading-relaxed text-gray-300 placeholder-gray-700 focus:ring-0 px-0 resize-none font-sans scrollbar-hide focus:outline-none"
            spellCheck={false}
          />
          
          {isFocusMode && (
            <button 
              onClick={toggleFocusMode}
              className="fixed bottom-8 right-8 p-3 rounded-full bg-white/10 backdrop-blur text-gray-400 hover:text-white hover:bg-white/20 transition-all opacity-0 hover:opacity-100"
            >
               <Minimize2 size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const JournalContextPanel: React.FC<{ analysis?: JournalAnalysis }> = ({ analysis }) => {
   if (!analysis) {
      return (
         <div className="w-72 border-l border-white/5 bg-black/20 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-600">
               <BrainCircuit size={32} />
            </div>
            <h3 className="text-white font-display font-medium mb-2">Neural Context</h3>
            <p className="text-sm text-gray-500">Write your thoughts and activate the Neural Core to generate insights.</p>
         </div>
      );
   }

   return (
     <div className="w-72 border-l border-white/5 bg-black/20 backdrop-blur-xl h-full overflow-y-auto">
        <div className="p-5 space-y-6">
           <div>
              <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Emotional Resonance</h4>
              <div className="flex items-end gap-2 mb-2">
                 <span className="text-4xl font-display font-bold text-white">{analysis.sentimentScore}</span>
                 <span className="text-sm text-gray-500 mb-1">/ 10</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                 <div 
                   className={cn("h-full rounded-full transition-all duration-1000", analysis.sentimentScore > 7 ? 'bg-forge-cyan' : analysis.sentimentScore < 4 ? 'bg-orange-500' : 'bg-forge-accent')} 
                   style={{ width: `${analysis.sentimentScore * 10}%` }}
                 />
              </div>
           </div>

           <GlassCard className="bg-gradient-to-br from-white/5 to-transparent border-white/10" noPadding>
              <div className="p-4">
                 <div className="flex items-center gap-2 text-forge-accent text-xs font-medium mb-2">
                    <Sparkles size={12} /> Core Insight
                 </div>
                 <p className="text-sm text-gray-200 leading-relaxed italic">
                    "{analysis.summary}"
                 </p>
              </div>
           </GlassCard>

           <div>
              <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Detected Themes</h4>
              <div className="flex flex-wrap gap-2">
                 {analysis.keywords.map(kw => (
                    <span key={kw} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-gray-400 flex items-center gap-1">
                       <Hash size={10} /> {kw}
                    </span>
                 ))}
              </div>
           </div>

           <div>
              <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Next Step</h4>
              <div className="flex gap-3 items-start">
                 <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-forge-cyan/10 border border-forge-cyan/30 flex items-center justify-center text-forge-cyan">
                    <ChevronRight size={12} />
                 </div>
                 <p className="text-sm text-gray-300">{analysis.suggestedAction}</p>
              </div>
           </div>
        </div>
     </div>
   );
};

export const JournalView: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(MOCK_ENTRIES);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_ENTRIES[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const selectedEntry = entries.find(e => e.id === selectedId) || entries[0];

  const handleUpdateEntry = (updates: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(e => e.id === selectedId ? { ...e, ...updates } : e));
  };

  const handleNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: '',
      content: '',
      date: new Date(),
      mood: 'neutral',
      tags: [],
      isDraft: true
    };
    setEntries([newEntry, ...entries]);
    setSelectedId(newEntry.id);
  };

  const handleAnalyze = async () => {
    if (!selectedEntry) return;
    setIsAnalyzing(true);
    try {
       const result = await analyzeJournalEntry(selectedEntry.content);
       handleUpdateEntry({ analysis: result });
    } catch (error) {
       console.error("Analysis failed", error);
    } finally {
       setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex bg-forge-bg text-white overflow-hidden animate-in fade-in duration-700">
      {!isFocusMode && (
         <JournalSidebar 
           entries={entries} 
           selectedId={selectedId} 
           onSelect={setSelectedId}
           onNew={handleNewEntry}
         />
      )}
      <JournalEditor 
         entry={selectedEntry}
         onChange={handleUpdateEntry}
         onAnalyze={handleAnalyze}
         isAnalyzing={isAnalyzing}
         isFocusMode={isFocusMode}
         toggleFocusMode={() => setIsFocusMode(!isFocusMode)}
      />
      {!isFocusMode && (
         <JournalContextPanel analysis={selectedEntry.analysis} />
      )}
    </div>
  );
};
