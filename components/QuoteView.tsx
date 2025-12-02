
import React, { useState, useEffect } from 'react';
import { Search, Plus, Heart, Maximize2, Minimize2, Sparkles, Tag, Quote as QuoteIcon, X, BookOpen, Feather, Layers } from 'lucide-react';
import { Quote, MoodType } from '../types';
import { analyzeQuote } from '../services/geminiService';
import { draftService } from '../services/draftService';
import { cn } from '../lib/utils';

const MOOD_THEMES: Record<MoodType, { bg: string, border: string, text: string, glow: string }> = {
    inspired: { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', text: 'text-fuchsia-400', glow: 'shadow-[0_0_30px_rgba(217,70,239,0.2)]' },
    calm: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', glow: 'shadow-[0_0_30px_rgba(34,211,238,0.2)]' },
    anxious: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.2)]' },
    tired: { bg: 'bg-gray-500/10', border: 'border-gray-500/20', text: 'text-gray-400', glow: 'shadow-[0_0_30px_rgba(156,163,175,0.1)]' },
    focused: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]' },
    neutral: { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white', glow: 'shadow-[0_0_30px_rgba(255,255,255,0.1)]' },
    joy: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', glow: 'shadow-[0_0_30px_rgba(250,204,21,0.2)]' },
    sad: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', glow: 'shadow-[0_0_30px_rgba(99,102,241,0.2)]' },
    stressed: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', glow: 'shadow-[0_0_30px_rgba(248,113,113,0.2)]' },
    lonely: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', glow: 'shadow-[0_0_30px_rgba(96,165,250,0.2)]' },
    angry: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-500', glow: 'shadow-[0_0_30px_rgba(244,63,94,0.2)]' },
    energetic: { bg: 'bg-lime-500/10', border: 'border-lime-500/20', text: 'text-lime-400', glow: 'shadow-[0_0_30px_rgba(163,230,53,0.2)]' },
    empty: { bg: 'bg-stone-500/10', border: 'border-stone-500/20', text: 'text-stone-400', glow: 'shadow-[0_0_30px_rgba(168,162,158,0.1)]' },
};

const MOCK_QUOTES: Quote[] = [
    {
        id: '1',
        text: "We suffer more often in imagination than in reality.",
        author: "Seneca",
        mood: 'calm',
        tags: ['Stoicism', 'Anxiety', 'Mindset'],
        isFavorite: true,
        dateAdded: new Date(),
        reflectionDepth: 8,
        analysis: {
            meaning: "Our fears extrapolate worst-case scenarios that rarely happen. True peace comes from dealing with the present, not the projected future.",
            themes: ["Fear", "Reality", "Perception"],
            sentimentScore: 7,
            reflectionPrompt: "What 'catastrophe' are you imagining right now that hasn't actually happened?"
        }
    },
    {
        id: '2',
        text: "The only way out is through.",
        author: "Robert Frost",
        mood: 'focused',
        tags: ['Resilience', 'Action'],
        isFavorite: false,
        dateAdded: new Date(Date.now() - 86400000),
        reflectionDepth: 6,
    },
    {
        id: '3',
        text: "He who has a why to live for can bear almost any how.",
        author: "Friedrich Nietzsche",
        mood: 'inspired',
        tags: ['Purpose', 'Meaning'],
        isFavorite: true,
        dateAdded: new Date(Date.now() - 172800000),
        reflectionDepth: 9,
    }
];

const QuoteCard: React.FC<{ quote: Quote; onClick: () => void; onToggleFav: (e: React.MouseEvent) => void }> = ({ quote, onClick, onToggleFav }) => {
    const theme = MOOD_THEMES[quote.mood];
    const isLong = quote.text.length > 150;

    return (
        <div 
            onClick={onClick}
            className={cn(
                "group h-full relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-spring-out hover:-translate-y-2 hover:z-10 border bg-black/40 backdrop-blur-xl hover:bg-white/[0.03]",
                theme.border
            )}
        >
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700", theme.glow)} />
            <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <QuoteIcon size={20} className={cn("opacity-50", theme.text)} />
                    <button 
                        onClick={onToggleFav}
                        className={cn("p-2 rounded-full hover:bg-white/10 transition-colors", quote.isFavorite ? 'text-red-500' : 'text-gray-600')}
                    >
                        <Heart size={16} fill={quote.isFavorite ? "currentColor" : "none"} />
                    </button>
                </div>
                <blockquote className={cn("font-display text-gray-100 leading-relaxed mb-6", isLong ? 'text-sm' : 'text-lg font-medium')}>
                    "{quote.text}"
                </blockquote>
                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                        <div className={cn("w-1 h-6 rounded-full", theme.bg.replace('/10', ''))} />
                        <div className="flex flex-col">
                            <cite className="text-xs font-bold text-white not-italic font-mono">{quote.author}</cite>
                            <span className="text-[10px] text-gray-500">{quote.tags[0]}</span>
                        </div>
                    </div>
                    {quote.analysis && <Sparkles size={12} className="text-forge-accent" />}
                </div>
            </div>
        </div>
    );
};

const DetailPanel: React.FC<{ quote: Quote; onClose: () => void; onAnalyze: (id: string) => void; isAnalyzing: boolean }> = ({ quote, onClose, onAnalyze, isAnalyzing }) => {
    const theme = MOOD_THEMES[quote.mood];

    return (
        <div className="absolute inset-y-0 right-0 w-full md:w-[450px] bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 overflow-y-auto transform transition-transform duration-500 ease-spring-out animate-in slide-in-from-right">
            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-black/60 backdrop-blur-xl z-20">
                <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                    <BookOpen size={16} className={theme.text} /> Reflection
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X size={18}/></button>
            </div>

            <div className="p-8 space-y-8">
                <div>
                    <blockquote className="font-display text-2xl text-white leading-relaxed mb-4">"{quote.text}"</blockquote>
                    <cite className="text-forge-cyan font-mono not-italic">— {quote.author}</cite>
                </div>

                <div className="flex flex-wrap gap-2">
                    {quote.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300 flex items-center gap-1">
                            <Tag size={10} /> {tag}
                        </span>
                    ))}
                </div>

                <div className="border-t border-white/10 pt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles size={14} className="text-forge-accent" /> Neural Decoding
                        </h3>
                        {!quote.analysis && (
                            <button onClick={() => onAnalyze(quote.id)} disabled={isAnalyzing} className="text-xs bg-white/5 hover:bg-forge-accent hover:text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2">
                                {isAnalyzing ? <Sparkles size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                {isAnalyzing ? 'Analyzing...' : 'Decode Meaning'}
                            </button>
                        )}
                    </div>

                    {quote.analysis ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="text-[10px] text-forge-accent font-mono uppercase tracking-widest mb-2">Hidden Meaning</div>
                                    <p className="text-sm text-gray-200 leading-relaxed">"{quote.analysis.meaning}"</p>
                                </div>
                            </div>
                            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 border-l-2 border-l-forge-cyan">
                                <div className="text-[10px] text-forge-cyan font-mono uppercase tracking-widest mb-2">Daily Prompt</div>
                                <p className="text-sm text-white italic">{quote.analysis.reflectionPrompt}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                            <p className="text-xs text-gray-500">Activate neural core to interpret this wisdom.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AddQuoteModal: React.FC<{ 
    initialText?: string; 
    onClose: () => void; 
    onSave: (q: Quote) => void 
}> = ({ initialText = '', onClose, onSave }) => {
    const [text, setText] = useState(initialText);
    const [author, setAuthor] = useState('');
    const [mood, setMood] = useState<MoodType>('neutral');

    // Auto-set author if we have initial text (coming from Thought Stream)
    useEffect(() => {
        if (initialText) setAuthor('Self');
    }, [initialText]);

    const handleSave = () => {
        if (!text) return;
        const newQuote: Quote = {
            id: Date.now().toString(), text, author: author || 'Unknown', mood, tags: [], isFavorite: false, dateAdded: new Date(), reflectionDepth: 5
        };
        onSave(newQuote);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-display font-bold text-white">Add Wisdom</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18}/></button>
                </div>
                <div className="p-6 space-y-6">
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-forge-accent focus:outline-none h-32 resize-none text-lg font-display" placeholder="Type something profound..." value={text} onChange={e => setText(e.target.value)} autoFocus />
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-forge-accent focus:outline-none" placeholder="Who said it?" value={author} onChange={e => setAuthor(e.target.value)} />
                    <div className="flex gap-2 flex-wrap">
                        {(Object.keys(MOOD_THEMES) as MoodType[]).map(m => (
                            <button key={m} onClick={() => setMood(m)} className={cn("px-3 py-1 rounded-full text-xs border transition-all capitalize", mood === m ? cn(MOOD_THEMES[m].text, 'border-current bg-white/5') : 'text-gray-500 border-transparent hover:bg-white/5')}>{m}</button>
                        ))}
                    </div>
                </div>
                <div className="p-6 border-t border-white/5 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm bg-forge-accent text-white hover:bg-forge-accent/80 shadow-lg shadow-forge-accent/20">Archive Quote</button>
                </div>
            </div>
        </div>
    );
};

export const QuoteView: React.FC = () => {
    const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filterMood, setFilterMood] = useState<MoodType | 'all'>('all');
    const [isAdding, setIsAdding] = useState(false);
    const [initialDraftText, setInitialDraftText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Check for incoming drafts (from Thought Stream)
    useEffect(() => {
        if (draftService.hasDraft()) {
            const draft = draftService.getDraft();
            if (draft && draft.type === 'insight') {
                setInitialDraftText(draft.content);
                setIsAdding(true);
            }
        }
    }, []);

    const filteredQuotes = filterMood === 'all' ? quotes : quotes.filter(q => q.mood === filterMood);

    const handleAnalyze = async (id: string) => {
        const quote = quotes.find(q => q.id === id);
        if (!quote) return;
        setIsAnalyzing(true);
        try {
            const analysis = await analyzeQuote(quote.text, quote.author);
            setQuotes(prev => prev.map(q => q.id === id ? { ...q, analysis } : q));
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveNew = (newQuote: Quote) => setQuotes([newQuote, ...quotes]);
    const handleToggleFav = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, isFavorite: !q.isFavorite } : q));
    };

    return (
        <div className="h-full flex flex-col bg-[#050508] relative overflow-hidden animate-in fade-in duration-700">
            
            {/* Atmospheric Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-900/10 via-transparent to-transparent" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-900/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
            </div>

            {/* Header & Filter Section */}
            <div className="shrink-0 p-8 pb-4 relative z-30 flex flex-col gap-6">
                 
                 {/* Top Row: Title & Actions */}
                 <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">
                            <BookOpen size={12} /> Wisdom Archive
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Library of Meaning</h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <div className="text-2xl font-bold text-white">{quotes.length}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Entries</div>
                        </div>
                        <button 
                            onClick={() => { setInitialDraftText(''); setIsAdding(true); }}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                        >
                            <Plus size={18} /> <span className="hidden md:inline">Add Quote</span>
                        </button>
                    </div>
                 </div>

                 {/* Filter Island (Horizontal Scroll) */}
                 <div className="w-full flex justify-center">
                    <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md overflow-x-auto scrollbar-hide max-w-full">
                        <button 
                            onClick={() => setFilterMood('all')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                                filterMood === 'all' 
                                    ? 'bg-white/10 text-white shadow-inner' 
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <Layers size={14} /> All Wisdom
                        </button>
                        <div className="w-px h-4 bg-white/10 mx-1" />
                        {(Object.keys(MOOD_THEMES) as MoodType[]).map(mood => {
                            const config = MOOD_THEMES[mood];
                            return (
                                <button
                                    key={mood}
                                    onClick={() => setFilterMood(mood)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                                        filterMood === mood 
                                            ? `bg-white/10 text-white shadow-inner border border-white/5` 
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    )}
                                >
                                    <div className={cn("w-2 h-2 rounded-full", config.bg.replace('/10', ''))} />
                                    {mood}
                                </button>
                            );
                        })}
                    </div>
                 </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-8 pb-20 scrollbar-hide z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-7xl pt-4">
                    {filteredQuotes.map(quote => (
                        <QuoteCard key={quote.id} quote={quote} onClick={() => setSelectedId(quote.id)} onToggleFav={(e) => handleToggleFav(e, quote.id)} />
                    ))}
                </div>
                
                {filteredQuotes.length === 0 && (
                    <div className="text-center py-32 opacity-50">
                        <Feather size={32} className="mx-auto mb-4 text-white" />
                        <p className="text-sm font-mono text-gray-500">Silence fills the archives.</p>
                    </div>
                )}
            </div>

            {selectedId && (
                <DetailPanel quote={quotes.find(q => q.id === selectedId)!} onClose={() => setSelectedId(null)} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            )}
            {isAdding && <AddQuoteModal initialText={initialDraftText} onClose={() => setIsAdding(false)} onSave={handleSaveNew} />}
        </div>
    );
};
