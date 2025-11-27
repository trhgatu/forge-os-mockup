
import React, { useState, useEffect } from 'react';
import { 
    Aperture, 
    Sparkles, 
    Wind, 
    Sun, 
    Leaf, 
    Snowflake, 
    Sprout, 
    Maximize2, 
    Minimize2,
    Plus,
    Activity,
    Layers,
    Brain,
    Fingerprint
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { MetaJournalEntry, MetaJournalType, Season } from '../types';
import { analyzeMetaJournal } from '../services/geminiService';
import { cn } from '../lib/utils';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, CartesianGrid } from 'recharts';

// --- CONFIG ---

const SEASON_THEMES: Record<Season, { bg: string, accent: string, icon: React.ElementType, particle: string }> = {
    Spring: { bg: 'bg-emerald-900/10', accent: 'text-emerald-400', icon: Sprout, particle: 'bg-emerald-200' },
    Summer: { bg: 'bg-amber-900/10', accent: 'text-amber-400', icon: Sun, particle: 'bg-amber-200' },
    Autumn: { bg: 'bg-orange-900/10', accent: 'text-orange-400', icon: Leaf, particle: 'bg-orange-300' },
    Winter: { bg: 'bg-slate-900/10', accent: 'text-indigo-300', icon: Snowflake, particle: 'bg-indigo-200' }
};

const TYPE_ICONS: Record<MetaJournalType, React.ElementType> = {
    Pattern: Layers,
    State: Activity,
    Identity: Fingerprint,
    Season: Wind
};

const MOCK_META_ENTRIES: MetaJournalEntry[] = [
    {
        id: '1',
        content: "I notice a recurring cycle: intense creation (Summer) followed by sudden emptiness (Winter). I usually fight the Winter, which prolongs it. Acceptance might be key.",
        type: 'Pattern',
        date: new Date(),
        season: 'Winter',
        tags: ['Cycle', 'Creativity'],
        analysis: {
            depthLevel: 8,
            cognitivePattern: "Resistance to rest phases causing prolonged burnout.",
            novaWhisper: "The silence is not a void; it is a womb."
        }
    },
    {
        id: '2',
        content: "My identity as 'The Architect' feels heavy today. There is a desire to be 'The Explorer' again - seeing without building.",
        type: 'Identity',
        date: new Date(Date.now() - 86400000 * 2),
        season: 'Autumn',
        tags: ['Archetype', 'Shift'],
        analysis: {
            depthLevel: 7,
            cognitivePattern: "Identity rigidity creating friction.",
            novaWhisper: "Shed the armor. It served its purpose."
        }
    },
    {
        id: '3',
        content: "Mental state is scattered but high frequency. Like static electricity. Hard to focus on one thing, but many connections forming.",
        type: 'State',
        date: new Date(Date.now() - 86400000 * 5),
        season: 'Spring',
        tags: ['Focus', 'Connections'],
        analysis: {
            depthLevel: 6,
            cognitivePattern: "Divergent thinking phase.",
            novaWhisper: "Let the sparks fly. Synthesis comes later."
        }
    }
];

// --- SUB-COMPONENTS ---

const MetaEntryCard: React.FC<{ entry: MetaJournalEntry }> = ({ entry }) => {
    const theme = SEASON_THEMES[entry.season];
    const TypeIcon = TYPE_ICONS[entry.type];

    return (
        <div className={cn("relative p-6 rounded-2xl border border-white/5 backdrop-blur-md overflow-hidden transition-all hover:border-white/10 group", theme.bg)}>
            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(3)].map((_, i) => (
                    <div 
                        key={i}
                        className={cn("absolute rounded-full w-0.5 h-0.5 opacity-40 animate-float", theme.particle)}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 2}s`,
                            animationDuration: `${10 + i * 5}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-1.5 rounded-lg bg-white/5 border border-white/5", theme.accent)}>
                            <TypeIcon size={14} />
                        </div>
                        <span className="text-xs font-mono uppercase tracking-widest text-gray-400">{entry.type}</span>
                    </div>
                    <div className={cn("flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-white/5 bg-white/5", theme.accent)}>
                        <theme.icon size={10} /> {entry.season}
                    </div>
                </div>

                <p className="text-sm text-gray-200 leading-relaxed font-serif mb-4">
                    {entry.content}
                </p>

                {entry.analysis && (
                    <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono mb-1">
                            <Sparkles size={10} className={theme.accent} /> Nova Observation
                        </div>
                        <p className={cn("text-xs italic opacity-80", theme.accent)}>
                            "{entry.analysis.novaWhisper}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CognitiveDepthChart: React.FC<{ entries: MetaJournalEntry[] }> = ({ entries }) => {
    const data = entries.slice().reverse().map(e => ({
        date: e.date.toLocaleDateString([], { weekday: 'short' }),
        depth: e.analysis?.depthLevel || 0
    }));

    return (
        <div className="h-48 w-full relative">
            <div className="absolute top-0 left-0 text-[10px] text-gray-500 font-mono uppercase tracking-widest p-4">
                Cognitive Depth Stream
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#34d399" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="#818cf8" stopOpacity={0.5} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="date" stroke="#333" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="depth" 
                        stroke="url(#lineGradient)" 
                        strokeWidth={2} 
                        dot={{ r: 3, fill: '#09090b', strokeWidth: 1.5, stroke: '#fff' }} 
                        activeDot={{ r: 5, fill: '#fff' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const MetaComposer: React.FC<{ onSave: (e: MetaJournalEntry) => void }> = ({ onSave }) => {
    const [content, setContent] = useState('');
    const [type, setType] = useState<MetaJournalType>('Pattern');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyzeAndSave = async () => {
        if (!content.trim()) return;
        setIsAnalyzing(true);
        try {
            const analysis = await analyzeMetaJournal(content, type);
            const newEntry: MetaJournalEntry = {
                id: Date.now().toString(),
                content,
                type,
                date: new Date(),
                season: analysis.seasonalShift || 'Winter',
                tags: [],
                analysis
            };
            onSave(newEntry);
            setContent('');
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <GlassCard className="flex flex-col h-full bg-black/40 border-l border-white/10" noPadding>
            <div className="p-6 border-b border-white/5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Brain size={16} className="text-forge-cyan" /> Meta-Cognitive Log
                </h3>
            </div>
            
            <div className="flex-1 p-6 flex flex-col">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {(Object.keys(TYPE_ICONS) as MetaJournalType[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap",
                                type === t ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-white/10 hover:bg-white/5'
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Observe the observer. How is your mind working right now?"
                    className="flex-1 bg-transparent border-none text-gray-300 placeholder-gray-700 resize-none focus:ring-0 text-sm leading-relaxed font-serif"
                />
            </div>

            <div className="p-6 border-t border-white/5">
                <button 
                    onClick={handleAnalyzeAndSave}
                    disabled={!content || isAnalyzing}
                    className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                    {isAnalyzing ? <Sparkles size={14} className="animate-spin" /> : <Aperture size={14} />}
                    {isAnalyzing ? 'Analyzing Patterns...' : 'Log Observation'}
                </button>
            </div>
        </GlassCard>
    );
};

// --- MAIN COMPONENT ---

export const MetaJournalView: React.FC = () => {
    const [entries, setEntries] = useState<MetaJournalEntry[]>(MOCK_META_ENTRIES);

    const handleSave = (entry: MetaJournalEntry) => {
        setEntries([entry, ...entries]);
    };

    return (
        <div className="h-full flex bg-[#030304] text-white relative overflow-hidden animate-in fade-in duration-1000">
            
            {/* Ambient Background - "Dusty" feel */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-slate-900/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-gray-900/30 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            {/* Left Panel - Feed & Viz */}
            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10 flex flex-col">
                <div className="p-8 pb-0">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400">
                            <Aperture size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-white">Meta-Cognition</h1>
                            <p className="text-xs text-gray-500 font-mono">Monitoring the internal operating system.</p>
                        </div>
                    </div>

                    <div className="mb-8 rounded-2xl border border-white/5 bg-black/20 overflow-hidden backdrop-blur-sm">
                        <CognitiveDepthChart entries={entries} />
                    </div>
                </div>

                <div className="flex-1 px-8 pb-32">
                    <div className="space-y-6 max-w-2xl mx-auto">
                        {entries.map(entry => (
                            <MetaEntryCard key={entry.id} entry={entry} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Composer */}
            <div className="w-96 shrink-0 relative z-20 hidden md:block">
                <MetaComposer onSave={handleSave} />
            </div>
        </div>
    );
};
