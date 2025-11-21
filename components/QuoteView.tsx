
import React, { useState } from 'react';
import { Search, Plus, Heart, Maximize2, Minimize2, Sparkles, Tag, Quote as QuoteIcon, X, BookOpen, Feather } from 'lucide-react';
import { Quote, MoodType } from '../types';
import { analyzeQuote } from '../services/geminiService';
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
    // ... more mocks
];

const QuoteCard: React.FC<{ quote: Quote; onClick: () => void; onToggleFav: (e: React.MouseEvent) => void }> = ({ quote, onClick, onToggleFav }) => {
    const theme = MOOD_THEMES[quote.mood];
    const isLong = quote.text.length > 150;

    return (
        <div 
            onClick={onClick}
            className={cn(
                "group break-inside-avoid mb-6 relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-spring-out hover:-translate-y-2 hover:z-10 border bg-black/40 backdrop-blur-xl hover:bg-white/[0.03]",
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
        <div className="absolute inset-y-0 right-0 w-full md:w-[450px] bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 overflow-y-auto transform transition-transform duration-500 ease-spring-out">
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
                            <button onClick={() => onAnalyze(quote.id)} disabled={isAnalyzing} className="text-xs bg-white/5 hover:bg-forge-accent hover:text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50">
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

const AddQuoteModal: React.FC<{ onClose: () => void; onSave: (q: Quote) => void }> = ({ onClose, onSave }) => {
    const [text, setText] = useState('');
    const [author, setAuthor] = useState('');
    const [mood, setMood] = useState<MoodType>('neutral');

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
    const [isAnalyzing, setIsAnalyzing] = useState(false);

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
        <div className="h-full flex bg-forge-bg text-white relative overflow-hidden animate-in fade-in duration-700">
            <div className="hidden lg:block w-64 flex-shrink-0 border-r border-white/5 bg-black/20 p-4">
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 px-2">Library Filter</h3>
                <div className="space-y-1">
                    <button onClick={() => setFilterMood('all')} className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-all", filterMood === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5')}>All Wisdom</button>
                    {(Object.keys(MOOD_THEMES) as MoodType[]).map(mood => (
                        <button key={mood} onClick={() => setFilterMood(mood)} className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all capitalize", filterMood === mood ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5')}>
                            <div className={cn("w-2 h-2 rounded-full", MOOD_THEMES[mood].bg.replace('/10', ''))} />
                            {mood}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 h-full flex flex-col relative z-0">
                <div className="shrink-0 px-8 py-6 flex items-center justify-between bg-gradient-to-b from-forge-bg to-transparent z-20 sticky top-0">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">Wisdom Archive</h1>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{quotes.length} Quotes Collected</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
                            <Plus size={16} /> <span className="hidden md:inline">Add Quote</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pb-20 scrollbar-hide">
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {filteredQuotes.map(quote => (
                            <QuoteCard key={quote.id} quote={quote} onClick={() => setSelectedId(quote.id)} onToggleFav={(e) => handleToggleFav(e, quote.id)} />
                        ))}
                    </div>
                </div>
            </div>

            {selectedId && (
                <DetailPanel quote={quotes.find(q => q.id === selectedId)!} onClose={() => setSelectedId(null)} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            )}
            {isAdding && <AddQuoteModal onClose={() => setIsAdding(false)} onSave={handleSaveNew} />}
        </div>
    );
};
