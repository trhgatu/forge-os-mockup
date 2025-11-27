
import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Plus, 
    Calendar, 
    Tag, 
    Sparkles, 
    X, 
    Image as ImageIcon, 
    Quote, 
    BookOpen, 
    Activity, 
    Flag, 
    Filter,
    Clock,
    MoreHorizontal
} from 'lucide-react';
import { TimelineItem, TimelineType, MoodType } from '../types';
import { analyzeTimelineItem } from '../services/geminiService';
import { cn } from '../lib/utils';
import { GlassCard } from './GlassCard';

// --- CONFIG & UTILS ---
const TYPE_CONFIG: Record<TimelineType, { icon: React.ElementType, color: string, bg: string, label: string }> = {
    memory: { icon: ImageIcon, color: 'text-blue-400', bg: 'bg-blue-500', label: 'Memory' },
    journal: { icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500', label: 'Journal' },
    quote: { icon: Quote, color: 'text-amber-400', bg: 'bg-amber-500', label: 'Insight' },
    mood: { icon: Activity, color: 'text-pink-400', bg: 'bg-pink-500', label: 'Mood' },
    milestone: { icon: Flag, color: 'text-red-400', bg: 'bg-red-500', label: 'Milestone' },
    insight: { icon: Sparkles, color: 'text-forge-cyan', bg: 'bg-cyan-500', label: 'AI Insight' },
};

const MOOD_GLOWS: Record<MoodType, string> = {
    inspired: 'shadow-[0_0_30px_rgba(232,121,249,0.15)] border-fuchsia-500/30',
    calm: 'shadow-[0_0_30px_rgba(34,211,238,0.15)] border-cyan-500/30',
    anxious: 'shadow-[0_0_30px_rgba(249,115,22,0.15)] border-orange-500/30',
    tired: 'shadow-[0_0_30px_rgba(156,163,175,0.15)] border-gray-500/30',
    focused: 'shadow-[0_0_30px_rgba(52,211,153,0.15)] border-emerald-500/30',
    neutral: 'shadow-[0_0_30px_rgba(255,255,255,0.05)] border-white/10',
    joy: 'shadow-[0_0_30px_rgba(250,204,21,0.15)] border-yellow-500/30',
    sad: 'shadow-[0_0_30px_rgba(99,102,241,0.15)] border-indigo-500/30',
    stressed: 'shadow-[0_0_30px_rgba(248,113,113,0.15)] border-red-500/30',
    lonely: 'shadow-[0_0_30px_rgba(96,165,250,0.15)] border-blue-500/30',
    angry: 'shadow-[0_0_30px_rgba(244,63,94,0.15)] border-rose-500/30',
    energetic: 'shadow-[0_0_30px_rgba(163,230,53,0.15)] border-lime-500/30',
    empty: 'shadow-[0_0_30px_rgba(168,162,158,0.15)] border-stone-500/30',
};

// --- MOCK DATA ---
const MOCK_TIMELINE: TimelineItem[] = [
    {
        id: '1',
        type: 'milestone',
        date: new Date(),
        title: 'Project Genesis Launch',
        content: 'Deployed the first version of the core architecture. Systems are stable.',
        mood: 'inspired',
        tags: ['Work', 'Achievement'],
    },
    {
        id: '2',
        type: 'mood',
        date: new Date(Date.now() - 1000 * 60 * 60 * 4),
        title: 'Mid-day Pulse',
        content: 'Feeling a bit drained but mentally clear.',
        mood: 'tired',
        tags: ['Health'],
    },
    {
        id: '3',
        type: 'journal',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        title: 'The Architecture of Silence',
        content: "Today I realized that noise isn't just sound. It's visual clutter, it's unread notifications...",
        mood: 'calm',
        tags: ['Philosophy', 'Design'],
    },
    {
        id: '4',
        type: 'quote',
        date: new Date(Date.now() - 1000 * 60 * 60 * 48),
        title: 'Daily Stoic',
        content: '"Waste no more time arguing what a good man should be. Be one."',
        mood: 'focused',
        tags: ['Stoicism', 'Marcus Aurelius'],
        metadata: { author: 'Marcus Aurelius' }
    },
    {
        id: '5',
        type: 'memory',
        date: new Date('2023-11-15'),
        title: 'The Summit at Dawn',
        content: 'Reached the peak just as the sun broke the horizon. The physical exhaustion vanished instantly.',
        mood: 'inspired',
        tags: ['Nature', 'Travel'],
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    }
];

// --- COMPONENTS ---

const TimelineNode: React.FC<{ item: TimelineItem; isSelected: boolean }> = ({ item, isSelected }) => {
    const TypeIcon = TYPE_CONFIG[item.type].icon;
    const config = TYPE_CONFIG[item.type];

    return (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
            <div className={cn(
                "relative flex items-center justify-center transition-all duration-500",
                isSelected ? "scale-110" : "scale-100"
            )}>
                {/* Glow Halo */}
                <div className={cn(
                    "absolute inset-0 -m-2 rounded-full blur-xl opacity-40 transition-all duration-500",
                    config.bg,
                    isSelected ? "opacity-60 scale-150" : "opacity-0 scale-50"
                )} />
                
                {/* Core Circle */}
                <div className={cn(
                    "w-10 h-10 rounded-full border border-white/10 bg-[#0B0B15] flex items-center justify-center shadow-lg relative z-10 group-hover:border-white/30 transition-colors",
                    isSelected ? "border-white/40 bg-white/5" : ""
                )}>
                    <TypeIcon size={16} className={cn("transition-colors", isSelected ? 'text-white' : config.color)} />
                </div>
            </div>
        </div>
    );
};

const TimelineCard: React.FC<{ 
    item: TimelineItem; 
    isLeft: boolean; 
    isSelected: boolean; 
    onClick: () => void 
}> = ({ item, isLeft, isSelected, onClick }) => {
    const config = TYPE_CONFIG[item.type];
    const moodStyle = MOOD_GLOWS[item.mood] || MOOD_GLOWS['neutral'];

    return (
        <div 
            onClick={onClick}
            className={cn(
                "relative w-[45%] mb-20 cursor-pointer group perspective-1000",
                isLeft ? 'mr-auto pr-12 text-right' : 'ml-auto pl-12 text-left'
            )}
        >
            {/* Connection Line */}
            <div className={cn(
                "absolute top-5 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-12 transition-all duration-500",
                isLeft ? 'right-0 group-hover:via-white/40' : 'left-0 group-hover:via-white/40',
                isSelected ? 'via-forge-cyan/50' : ''
            )} />

            {/* Date Label */}
            <div className={cn(
                "absolute top-[1.35rem] text-[10px] font-mono text-gray-500 font-bold tracking-widest opacity-60 group-hover:opacity-100 transition-opacity",
                isLeft ? '-right-32 text-left w-20' : '-left-32 text-right w-20'
            )}>
                {item.date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </div>

            {/* Main Card */}
            <div className={cn(
                "relative p-6 rounded-2xl border backdrop-blur-xl transition-all duration-500 ease-spring-out hover:-translate-y-1 hover:scale-[1.01]",
                "bg-black/40",
                isSelected ? cn("bg-white/[0.03]", moodStyle) : "border-white/5 hover:border-white/10 hover:shadow-2xl"
            )}>
                {/* Type & Mood Header */}
                <div className={cn(
                    "flex items-center gap-3 mb-4",
                    isLeft ? 'flex-row-reverse' : 'flex-row'
                )}>
                    <span className={cn("text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border bg-white/5 border-white/5", config.color)}>
                        {config.label}
                    </span>
                    {item.mood && (
                        <div className={cn("flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500", isLeft ? 'flex-row-reverse' : '')}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", MOOD_GLOWS[item.mood].split(' ')[0].replace('shadow-', 'bg-').replace('rgba', 'rgb').replace('0.15', '1'))} />
                            {item.mood}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className={cn("flex flex-col", isLeft ? 'items-end' : 'items-start')}>
                    {item.type === 'memory' && item.imageUrl && (
                        <div className="w-full h-40 mb-4 rounded-xl overflow-hidden border border-white/5 relative group/img">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                            <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" alt="memory" />
                        </div>
                    )}

                    {item.type === 'quote' ? (
                        <blockquote className={cn("font-display text-xl italic text-white/90 mb-3 leading-relaxed", isLeft ? 'text-right' : 'text-left')}>
                            "{item.content}"
                        </blockquote>
                    ) : (
                        <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-forge-cyan transition-colors">{item.title}</h3>
                    )}
                    
                    {item.type !== 'quote' && (
                         <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed font-light">{item.content}</p>
                    )}

                    {item.metadata?.author && (
                        <div className="mt-2 text-xs text-forge-cyan font-mono">— {item.metadata.author}</div>
                    )}

                    {/* Tags */}
                    <div className={cn("flex flex-wrap gap-2 mt-5", isLeft ? 'justify-end' : 'justify-start')}>
                        {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[9px] px-2 py-1 rounded-md bg-white/5 border border-white/5 text-gray-500 group-hover:text-gray-400 transition-colors uppercase tracking-wider">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    
                    {item.analysis && (
                        <div className={cn("absolute -bottom-3 w-8 h-8 rounded-full bg-[#0B0B15] border border-white/10 flex items-center justify-center shadow-lg text-forge-accent", isLeft ? '-left-4' : '-right-4')}>
                             <Sparkles size={14} className="animate-pulse-slow" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ContextPanel: React.FC<{ 
    item: TimelineItem | null; 
    onClose: () => void; 
    onAnalyze: (id: string) => void; 
    isAnalyzing: boolean 
}> = ({ item, onClose, onAnalyze, isAnalyzing }) => {
    if (!item) return null;
    const config = TYPE_CONFIG[item.type];

    return (
        <div className="absolute inset-y-0 right-0 w-full md:w-[500px] bg-black/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-right duration-500">
            {/* Ambient Background */}
            <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br pointer-events-none", config.bg.replace('bg-', 'from-'), "to-transparent")} />
            
            {/* Header */}
            <div className="relative z-10 p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">
                        <Calendar size={12} /> {item.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white leading-tight">{item.title}</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto p-8 space-y-8">
                
                {item.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <img src={item.imageUrl} className="w-full h-full object-cover" alt="detail" />
                    </div>
                )}

                <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-base text-gray-300 leading-relaxed font-light whitespace-pre-line">
                        {item.content}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center gap-1">
                            <Tag size={10} /> {tag}
                        </span>
                    ))}
                </div>

                {/* AI Analysis Section */}
                <div className="border-t border-white/5 pt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                            <Sparkles size={14} className="text-forge-accent" /> Neural Interpretation
                        </h3>
                        {!item.analysis && (
                            <button 
                                onClick={() => onAnalyze(item.id)}
                                disabled={isAnalyzing}
                                className="text-xs bg-white/5 hover:bg-forge-accent hover:text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 border border-white/10"
                            >
                                {isAnalyzing ? <Sparkles size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                {isAnalyzing ? 'Processing...' : 'Analyze'}
                            </button>
                        )}
                    </div>

                    {item.analysis ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <GlassCard className="bg-gradient-to-br from-white/5 to-transparent border-white/10 p-6" noPadding>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Significance</div>
                                <p className="text-sm text-white leading-relaxed mb-4">{item.analysis.significance}</p>
                                <div className="h-px bg-white/5 w-full mb-4" />
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Pattern Recognition</div>
                                <p className="text-sm text-gray-400 italic">"{item.analysis.pattern}"</p>
                            </GlassCard>
                        </div>
                    ) : (
                        <div className="p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] text-center">
                            <p className="text-xs text-gray-500">
                                Analyze this moment to uncover hidden connections in your timeline.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CreateTimelineModal: React.FC<{ onClose: () => void; onSave: (item: TimelineItem) => void }> = ({ onClose, onSave }) => {
    const [type, setType] = useState<TimelineType>('journal');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<MoodType>('neutral');
    const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [tagsStr, setTagsStr] = useState('');

    const handleSave = () => {
        if (!title || !content) return;
        
        const newItem: TimelineItem = {
            id: Date.now().toString(),
            type,
            title,
            content,
            date: new Date(dateStr),
            mood,
            tags: tagsStr.split(',').map(t => t.trim()).filter(t => t),
            metadata: {}
        };
        onSave(newItem);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                    <h3 className="font-display font-bold text-white tracking-wide">Log Event</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
                </div>
                
                <div className="p-8 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Artifact Type</label>
                            <div className="relative">
                                <select 
                                    value={type}
                                    onChange={(e) => setType(e.target.value as TimelineType)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-forge-accent focus:outline-none appearance-none"
                                >
                                    {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                                        <option key={key} value={key}>{config.label}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <Clock size={14} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Timestamp</label>
                            <input 
                                type="date"
                                value={dateStr}
                                onChange={(e) => setDateStr(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-forge-accent focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Title</label>
                        <input 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-forge-accent focus:outline-none font-medium"
                            placeholder="Event Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Context</label>
                        <textarea 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-forge-accent focus:outline-none h-32 resize-none text-sm leading-relaxed"
                            placeholder="What happened?"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Emotional Imprint</label>
                        <div className="flex flex-wrap gap-2">
                            {['joy', 'calm', 'inspired', 'neutral', 'anxious', 'focused'].map(m => (
                                <button 
                                    key={m}
                                    onClick={() => setMood(m as MoodType)}
                                    className={cn(
                                        "px-3 py-1 rounded-full text-xs border transition-all capitalize",
                                        mood === m ? 'bg-white text-black border-white font-bold' : 'text-gray-500 border-white/10 hover:border-white/30 bg-transparent'
                                    )}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-black/40 shrink-0">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                        Crystallize
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN VIEW ---

export const TimelineView: React.FC = () => {
    const [items, setItems] = useState<TimelineItem[]>(MOCK_TIMELINE);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<TimelineType | 'all'>('all');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const filteredItems = filterType === 'all' ? items : items.filter(i => i.type === filterType);
    const sortedItems = [...filteredItems].sort((a, b) => b.date.getTime() - a.date.getTime());

    const handleAnalyze = async (id: string) => {
        const item = items.find(i => i.id === id);
        if (!item) return;
        setIsAnalyzing(true);
        try {
            const analysis = await analyzeTimelineItem(item.type, item.content);
            setItems(prev => prev.map(i => i.id === id ? { ...i, analysis } : i));
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveNew = (item: TimelineItem) => {
        setItems([item, ...items]);
    };

    return (
        <div className="h-full w-full flex bg-[#030304] relative overflow-hidden animate-in fade-in duration-700">
            
            {/* Atmospheric Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-900/10 via-transparent to-transparent" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-cyan-900/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
            </div>

            {/* Sidebar Filters */}
            <div className="hidden lg:flex w-72 flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl h-full p-6 z-20">
                <div className="mb-8">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Filter size={12} /> Data Streams
                    </h2>
                    <div className="space-y-2">
                        <button 
                            onClick={() => setFilterType('all')}
                            className={cn(
                                "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                                filterType === 'all' 
                                    ? 'bg-white/10 text-white border-white/10 shadow-lg' 
                                    : 'bg-transparent text-gray-400 border-transparent hover:bg-white/5 hover:text-gray-200'
                            )}
                        >
                            All Streams
                        </button>
                        {Object.entries(TYPE_CONFIG).map(([type, config]) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type as TimelineType)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                                    filterType === type 
                                        ? 'bg-white/10 text-white border-white/10 shadow-lg' 
                                        : 'bg-transparent text-gray-400 border-transparent hover:bg-white/5 hover:text-gray-200'
                                )}
                            >
                                <config.icon size={16} className={filterType === type ? 'text-white' : config.color} />
                                {config.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                    <div className="text-xs font-mono text-gray-500 uppercase mb-2">Total Artifacts</div>
                    <div className="text-3xl font-display font-bold text-white">{items.length}</div>
                </div>
            </div>

            {/* Main Timeline Area */}
            <div className="flex-1 h-full overflow-y-auto relative scrollbar-hide flex flex-col" id="timeline-scroll-container">
                
                {/* Header */}
                <div className="sticky top-0 z-40 w-full p-8 bg-gradient-to-b from-[#030304] via-[#030304]/90 to-transparent pointer-events-none flex justify-between items-end backdrop-blur-[2px]">
                    <div className="pointer-events-auto">
                        <div className="flex items-center gap-2 text-xs font-mono text-forge-cyan uppercase tracking-widest mb-2">
                            <Clock size={12} /> Temporal Log
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Chronicle</h1>
                    </div>
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="pointer-events-auto flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                    >
                        <Plus size={18} /> <span className="hidden md:inline">Add Event</span>
                    </button>
                </div>

                <div className="relative w-full max-w-5xl mx-auto pb-32 min-h-screen px-4 md:px-0">
                    
                    {/* The Spine - subtle gradient line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    
                    <div className="pt-12 relative">
                        {sortedItems.map((item, index) => (
                            <div key={item.id} className="relative flex w-full justify-center">
                                <TimelineNode item={item} isSelected={selectedId === item.id} />
                                <TimelineCard 
                                    item={item} 
                                    isLeft={index % 2 === 0} 
                                    isSelected={selectedId === item.id} 
                                    onClick={() => setSelectedId(item.id)} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detail Panel Overlay */}
            {selectedId && (
                <ContextPanel 
                    item={items.find(i => i.id === selectedId) || null} 
                    onClose={() => setSelectedId(null)} 
                    onAnalyze={handleAnalyze} 
                    isAnalyzing={isAnalyzing} 
                />
            )}

            {/* Create Modal */}
            {isCreating && (
                <CreateTimelineModal onClose={() => setIsCreating(false)} onSave={handleSaveNew} />
            )}
        </div>
    );
};
