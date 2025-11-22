
import React, { useState } from 'react';
import { Search, Plus, Calendar, Tag, Sparkles, X, Image as ImageIcon, Quote, BookOpen, Activity, Flag } from 'lucide-react';
import { TimelineItem, TimelineType, MoodType } from '../types';
import { analyzeTimelineItem } from '../services/geminiService';
import { cn } from '../lib/utils';

// --- CONFIG & UTILS ---
const TYPE_CONFIG: Record<TimelineType, { icon: React.ElementType, color: string, label: string }> = {
    memory: { icon: ImageIcon, color: 'text-blue-400', label: 'Memory' },
    journal: { icon: BookOpen, color: 'text-purple-400', label: 'Journal' },
    quote: { icon: Quote, color: 'text-amber-400', label: 'Insight' },
    mood: { icon: Activity, color: 'text-pink-400', label: 'Mood' },
    milestone: { icon: Flag, color: 'text-red-400', label: 'Milestone' },
    insight: { icon: Sparkles, color: 'text-forge-cyan', label: 'AI Insight' },
};

const MOOD_COLORS: Record<MoodType, string> = {
    inspired: 'shadow-fuchsia-500/40 border-fuchsia-500/30',
    calm: 'shadow-cyan-500/40 border-cyan-500/30',
    anxious: 'shadow-orange-500/40 border-orange-500/30',
    tired: 'shadow-gray-500/40 border-gray-500/30',
    focused: 'shadow-emerald-500/40 border-emerald-500/30',
    neutral: 'shadow-white/20 border-white/10',
    joy: 'shadow-yellow-500/40 border-yellow-500/30',
    sad: 'shadow-indigo-500/40 border-indigo-500/30',
    stressed: 'shadow-red-500/40 border-red-500/30',
    lonely: 'shadow-blue-500/40 border-blue-500/30',
    angry: 'shadow-rose-500/40 border-rose-500/30',
    energetic: 'shadow-lime-500/40 border-lime-500/30',
    empty: 'shadow-stone-500/40 border-stone-500/30',
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

const TimelineNode: React.FC<{ item: TimelineItem; isLeft: boolean; isSelected: boolean }> = ({ item, isLeft, isSelected }) => {
    const TypeIcon = TYPE_CONFIG[item.type].icon;
    const typeColor = TYPE_CONFIG[item.type].color;

    return (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
            <div 
                className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center bg-black transition-all duration-500",
                    isSelected 
                        ? "scale-125 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)]" 
                        : "border-white/20 hover:border-forge-cyan hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                )}
            >
                <TypeIcon size={16} className={typeColor} />
            </div>
            <div 
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-white/20 to-transparent",
                    isLeft ? '-left-8 rotate-180' : '-right-8',
                    isSelected ? 'from-forge-cyan to-forge-cyan/20' : ''
                )}
            />
        </div>
    );
};

const TimelineCard: React.FC<{ item: TimelineItem; isLeft: boolean; isSelected: boolean; onClick: () => void }> = ({ item, isLeft, isSelected, onClick }) => {
    const config = TYPE_CONFIG[item.type];
    const moodGlow = MOOD_COLORS[item.mood];

    return (
        <div 
            onClick={onClick}
            className={cn(
                "relative w-[42%] mb-24 cursor-pointer group perspective-1000",
                isLeft ? 'mr-auto pr-12 text-right' : 'ml-auto pl-12 text-left'
            )}
        >
            <span className={cn(
                "absolute top-3 text-xs font-mono text-gray-500 font-bold tracking-widest w-20",
                isLeft ? '-right-24 text-left' : '-left-24 text-right'
            )}>
                {item.date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>

            <div 
                className={cn(
                    "relative p-6 rounded-2xl border backdrop-blur-xl transition-all duration-500 ease-spring-out hover:-translate-y-1 hover:scale-[1.02]",
                    isSelected 
                        ? cn("bg-white/10 z-10", moodGlow)
                        : 'bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/10 shadow-lg'
                )}
            >
                <div className={cn(
                    "absolute top-4 flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono",
                    isLeft ? 'right-6 flex-row-reverse' : 'left-6'
                )}>
                    <span className={config.color}>{config.label}</span>
                    {item.mood && <span className="px-1.5 py-0.5 rounded border border-white/10 text-gray-400">{item.mood}</span>}
                </div>

                <div className={cn("mt-6 flex flex-col", isLeft ? 'items-end' : 'items-start')}>
                    {item.type === 'memory' && item.imageUrl && (
                        <div className="w-full h-32 mb-4 rounded-lg overflow-hidden border border-white/5">
                            <img src={item.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="memory" />
                        </div>
                    )}

                    {item.type === 'quote' ? (
                        <blockquote className={cn("font-display text-xl italic text-white mb-2", isLeft ? 'text-right' : 'text-left')}>
                            "{item.content}"
                        </blockquote>
                    ) : (
                        <h3 className="font-display font-bold text-lg text-white mb-2">{item.title}</h3>
                    )}
                    
                    {item.type !== 'quote' && (
                         <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">{item.content}</p>
                    )}

                    {item.metadata?.author && (
                        <div className="mt-2 text-xs text-forge-cyan font-mono">— {item.metadata.author}</div>
                    )}

                    <div className={cn("flex flex-wrap gap-2 mt-4", isLeft ? 'justify-end' : 'justify-start')}>
                        {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">#{tag}</span>
                        ))}
                    </div>
                    
                    {item.analysis && (
                        <div className={cn("absolute -bottom-3 w-6 h-6 rounded-full bg-forge-accent flex items-center justify-center shadow-lg shadow-forge-accent/30", isLeft ? '-left-3' : '-right-3')}>
                             <Sparkles size={12} className="text-white" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ContextPanel: React.FC<{ item: TimelineItem | null; onClose: () => void; onAnalyze: (id: string) => void; isAnalyzing: boolean }> = ({ item, onClose, onAnalyze, isAnalyzing }) => {
    if (!item) return null;
    const config = TYPE_CONFIG[item.type];

    return (
        <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-black/40 backdrop-blur-xl z-10">
                <div className="flex items-center gap-2">
                    <config.icon size={18} className={config.color} />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">{config.label} Detail</span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            </div>

            <div className="p-6 space-y-8">
                <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mb-2">
                        <Calendar size={12} /> {item.date.toLocaleString()}
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-4">{item.title}</h2>
                    
                    {item.imageUrl && (
                        <img src={item.imageUrl} className="w-full rounded-xl border border-white/10 mb-6" alt="detail" />
                    )}

                    <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
                        <p>{item.content}</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Semantic Tags</h4>
                    <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-gray-300 flex items-center gap-1">
                                <Tag size={10} /> {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles size={14} className="text-forge-accent" /> Temporal Analysis
                        </h3>
                        {!item.analysis && (
                            <button 
                                onClick={() => onAnalyze(item.id)}
                                disabled={isAnalyzing}
                                className="text-xs bg-forge-accent/10 hover:bg-forge-accent/20 text-forge-accent border border-forge-accent/20 px-3 py-1 rounded transition-all disabled:opacity-50"
                            >
                                {isAnalyzing ? 'Processing...' : 'Analyze'}
                            </button>
                        )}
                    </div>

                    {item.analysis ? (
                        <div className="space-y-4 relative z-10 animate-in fade-in duration-500">
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Significance</div>
                                <p className="text-sm text-gray-200">{item.analysis.significance}</p>
                            </div>
                            <div className="h-px bg-white/5" />
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Pattern</div>
                                <p className="text-sm text-gray-200 italic">"{item.analysis.pattern}"</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 italic relative z-10">
                            Reveal the hidden connections of this moment within your life's timeline.
                        </p>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                    <h3 className="font-display font-bold text-white">Log Timeline Event</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18}/></button>
                </div>
                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 font-mono uppercase mb-2">Type</label>
                            <select 
                                value={type}
                                onChange={(e) => setType(e.target.value as TimelineType)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-forge-accent focus:outline-none appearance-none"
                            >
                                {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                                    <option key={key} value={key}>{config.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 font-mono uppercase mb-2">Date</label>
                            <input 
                                type="date"
                                value={dateStr}
                                onChange={(e) => setDateStr(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-forge-accent focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 font-mono uppercase mb-2">Title</label>
                        <input 
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-forge-accent focus:outline-none"
                            placeholder="Event Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 font-mono uppercase mb-2">Description</label>
                        <textarea 
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-forge-accent focus:outline-none h-32 resize-none"
                            placeholder="What happened?"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 font-mono uppercase mb-2">Tags</label>
                        <input 
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-forge-accent focus:outline-none text-sm"
                            placeholder="Comma separated tags (e.g. Work, Life, Milestone)"
                            value={tagsStr}
                            onChange={e => setTagsStr(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 font-mono uppercase mb-2">Mood Snapshot</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(MOOD_COLORS).map(m => (
                                <button 
                                    key={m}
                                    onClick={() => setMood(m as MoodType)}
                                    className={cn(
                                        "px-3 py-1 rounded-full text-xs border transition-all capitalize",
                                        mood === m ? 'bg-white/10 border-white text-white' : 'text-gray-500 border-transparent hover:bg-white/5'
                                    )}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-black/40 shrink-0">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm bg-forge-accent text-white hover:bg-forge-accent/80 shadow-lg shadow-forge-accent/20">Add to Timeline</button>
                </div>
            </div>
        </div>
    );
};

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
        <div className="h-full w-full flex bg-forge-bg relative overflow-hidden animate-in fade-in duration-700">
            <div className="hidden lg:flex w-64 flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl h-full p-6 z-20">
                <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">Timeline Stream</h2>
                <div className="space-y-2">
                    <button 
                        onClick={() => setFilterType('all')}
                        className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-all", filterType === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5')}
                    >
                        All Streams
                    </button>
                    {Object.entries(TYPE_CONFIG).map(([type, config]) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as TimelineType)}
                            className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all", filterType === type ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5')}
                        >
                            <config.icon size={14} className={filterType === type ? 'text-white' : config.color} />
                            {config.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 h-full overflow-y-auto relative scrollbar-hide" id="timeline-scroll-container">
                <div className="sticky top-0 z-40 w-full p-6 bg-gradient-to-b from-forge-bg via-forge-bg/90 to-transparent pointer-events-none flex justify-between items-start">
                    <div className="pointer-events-auto">
                        <h1 className="text-3xl font-display font-bold text-white">Chronicle</h1>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{sortedItems.length} Artifacts</p>
                    </div>
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="pointer-events-auto p-3 rounded-full bg-forge-accent text-white shadow-lg hover:scale-110 transition-transform"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="relative w-full max-w-4xl mx-auto pb-32 min-h-screen">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-forge-accent to-transparent opacity-50" />
                    
                    <div className="pt-12 relative">
                        {sortedItems.map((item, index) => (
                            <div key={item.id} className="relative flex w-full">
                                <TimelineNode item={item} isLeft={index % 2 === 0} isSelected={selectedId === item.id} />
                                <TimelineCard item={item} isLeft={index % 2 === 0} isSelected={selectedId === item.id} onClick={() => setSelectedId(item.id)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedId && (
                <ContextPanel item={items.find(i => i.id === selectedId) || null} onClose={() => setSelectedId(null)} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            )}

            {isCreating && (
                <CreateTimelineModal onClose={() => setIsCreating(false)} onSave={handleSaveNew} />
            )}
        </div>
    );
};
