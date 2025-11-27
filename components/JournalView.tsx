
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Plus, Calendar, MoreHorizontal, PenLine, Sparkles, Maximize2, Minimize2, Tag, Hash, ChevronRight, Save, BrainCircuit,
  Bold, Italic, List, Type, Quote, Code, Eye, Edit3, Heading1, Heading2, Heading3
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
    content: "Today I realized that noise isn't just sound. It's visual clutter, it's unread notifications, it's the constant hum of expectation.\n\n> True insight often requires the removal of external stimuli.\n\nI spent an hour just staring at the wall, letting the mental sediment settle. In that silence, I found the solution to the navigation problem I've been stuck on for days. \n\n**Key Realizations:**\n- It wasn't about adding more\n- It was about removing the friction\n- Silence is an active state, not a passive one",
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
    content: "What if the interface itself was alive? Not just responding to clicks, but anticipating intent.\n\nWe could use the cursor velocity to predict the next action...",
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

// --- MARKDOWN RENDERER ---

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const parseInline = (text: string) => {
    // Split by bold, italic, code
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="text-gray-200 italic">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-forge-cyan border border-white/5">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const lines = content.split('\n');
  return (
    <div className="space-y-3 text-gray-300 leading-relaxed">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-4" />; // Spacer for empty lines

        if (trimmed.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-display font-bold text-white mt-6 mb-4">{parseInline(trimmed.slice(2))}</h1>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-display font-bold text-white mt-5 mb-3">{parseInline(trimmed.slice(3))}</h2>;
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-display font-bold text-white mt-4 mb-2">{parseInline(trimmed.slice(4))}</h3>;
        }
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-forge-accent pl-4 py-1 italic text-gray-400 my-4 bg-white/[0.02] rounded-r-lg">
              {parseInline(trimmed.slice(2))}
            </blockquote>
          );
        }
        if (trimmed.startsWith('- ')) {
          return (
            <div key={index} className="flex items-start gap-2 ml-2">
              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-forge-cyan shrink-0" />
              <span>{parseInline(trimmed.slice(2))}</span>
            </div>
          );
        }
        
        return <p key={index}>{parseInline(line)}</p>;
      })}
    </div>
  );
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
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = entry.content;
    
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    
    const newText = before + prefix + selection + suffix + after;
    onChange({ content: newText });
    
    // Restore focus and cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length);
      }
    }, 0);
  };

  const handleToolbarAction = (action: string) => {
    switch (action) {
      case 'bold': insertFormat('**', '**'); break;
      case 'italic': insertFormat('*', '*'); break;
      case 'h1': insertFormat('# '); break;
      case 'h2': insertFormat('## '); break;
      case 'list': insertFormat('- '); break;
      case 'quote': insertFormat('> '); break;
      case 'code': insertFormat('`', '`'); break;
    }
  };

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
        <div className="max-w-3xl mx-auto px-8 py-8 min-h-full flex flex-col">
          
          {/* Mood Selector */}
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

          {/* Toolbar & Mode Switch */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5 sticky top-0 bg-[#09090b]/95 backdrop-blur-md z-20 transition-all">
             <div className="flex items-center gap-1">
               <button onClick={() => handleToolbarAction('bold')} className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Bold"><Bold size={14} /></button>
               <button onClick={() => handleToolbarAction('italic')} className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Italic"><Italic size={14} /></button>
               <div className="w-px h-4 bg-white/10 mx-1" />
               <button onClick={() => handleToolbarAction('h1')} className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Heading 1"><Heading1 size={14} /></button>
               <button onClick={() => handleToolbarAction('h2')} className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Heading 2"><Heading2 size={14} /></button>
               <div className="w-px h-4 bg-white/10 mx-1" />
               <button onClick={() => handleToolbarAction('list')} className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="List"><List size={14} /></button>
               <button onClick={() => handleToolbarAction('quote')} className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Quote"><Quote size={14} /></button>
               <button onClick={() => handleToolbarAction('code')} className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Code"><Code size={14} /></button>
             </div>
             
             <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/5">
                <button 
                  onClick={() => setMode('write')} 
                  className={cn("px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-2", mode === 'write' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300')}
                >
                  <Edit3 size={12} /> Write
                </button>
                <button 
                  onClick={() => setMode('preview')} 
                  className={cn("px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-2", mode === 'preview' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300')}
                >
                  <Eye size={12} /> Preview
                </button>
             </div>
          </div>

          <input 
            type="text"
            value={entry.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Title your thought..."
            className="w-full bg-transparent border-none text-4xl font-display font-bold text-white placeholder-gray-700 focus:ring-0 px-0 py-4 mb-4"
          />

          {mode === 'write' ? (
            <textarea 
              ref={textareaRef}
              value={entry.content}
              onChange={(e) => onChange({ content: e.target.value })}
              placeholder="Start writing... (Markdown supported)"
              className="flex-1 w-full bg-transparent border-none text-lg leading-relaxed text-gray-300 placeholder-gray-700 focus:ring-0 px-0 resize-none font-sans scrollbar-hide focus:outline-none min-h-[500px]"
              spellCheck={false}
            />
          ) : (
            <div className="flex-1 min-h-[500px] animate-in fade-in duration-300">
              <MarkdownRenderer content={entry.content} />
            </div>
          )}
          
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