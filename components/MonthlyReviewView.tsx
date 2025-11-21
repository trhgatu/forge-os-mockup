
import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { 
  Sparkles, 
  Star, 
  Moon, 
  Activity, 
  Zap, 
  Flag, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  Image as ImageIcon,
  Repeat
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { MonthlyReviewData, MonthlyReviewAnalysis } from '../types';
import { actionGenerateMonthlyReview } from '../services/actions';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

// --- MOCK DATA ---

const MOCK_MONTHLY_DATA: MonthlyReviewData = {
    month: "October 2023",
    moodTrend: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, value: Math.floor(Math.random() * 5) + 5, label: 'Stable' })),
    energyTrend: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, value: Math.floor(Math.random() * 40) + 60 })),
    habitStats: [
        { name: 'Morning Pages', consistency: 92, trend: 'up' },
        { name: 'Gym', consistency: 45, trend: 'down' },
        { name: 'Reading', consistency: 80, trend: 'flat' },
        { name: 'Meditation', consistency: 60, trend: 'up' }
    ],
    goalsCompleted: 3,
    goalsTotal: 5,
    milestonesAchieved: 12,
    topMemories: [
        { id: '1', title: 'The Summit', date: 'Oct 15', mood: 'inspired', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' },
        { id: '2', title: 'Deep Flow State', date: 'Oct 04', mood: 'focused' },
        { id: '3', title: 'Family Dinner', date: 'Oct 22', mood: 'joy' }
    ],
    journalThemes: ['Ambition', 'Rest', 'Systems', 'Nature']
};

// --- SUB-COMPONENTS ---

const StatBox: React.FC<{ label: string; value: string | number; subtext?: string }> = ({ label, value, subtext }) => (
    <div className="text-center">
        <div className="text-xs text-white/50 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-display font-bold text-white mb-1">{value}</div>
        {subtext && <div className="text-[10px] text-forge-cyan/80">{subtext}</div>}
    </div>
);

const HighlightCard: React.FC<{ text: string; type: 'high' | 'low' }> = ({ text, type }) => (
    <div className={cn(
        "p-4 rounded-xl border text-sm",
        type === 'high' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-200' : 'bg-rose-500/5 border-rose-500/10 text-rose-200'
    )}>
        <div className="flex items-start gap-2">
            <div className={cn("mt-1 w-1.5 h-1.5 rounded-full", type === 'high' ? 'bg-emerald-400' : 'bg-rose-400')} />
            <p className="leading-relaxed">{text}</p>
        </div>
    </div>
);

const MemoryThumbnail: React.FC<{ memory: MonthlyReviewData['topMemories'][0] }> = ({ memory }) => (
    <div className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all">
        {memory.imageUrl ? (
            <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
                <ImageIcon size={24} />
            </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
            <div className="text-xs font-bold text-white truncate">{memory.title}</div>
            <div className="text-[10px] text-gray-400">{memory.date}</div>
        </div>
    </div>
);

// --- MAIN VIEW ---

export const MonthlyReviewView: React.FC = () => {
    const [data] = useState<MonthlyReviewData>(MOCK_MONTHLY_DATA);
    const [analysis, setAnalysis] = useState<MonthlyReviewAnalysis | null>(null);
    const [, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const loadAnalysis = async () => {
            setIsAnalyzing(true);
            const result = await actionGenerateMonthlyReview(data);
            if (result.success && result.data) {
                setAnalysis(result.data);
            }
            setIsAnalyzing(false);
        };
        loadAnalysis();
    }, []);

    return (
        <div className="h-full flex bg-[#0B0B15] text-white relative overflow-hidden animate-in fade-in duration-1000">
            
            {/* Deep Space Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[20%] w-[1000px] h-[1000px] bg-indigo-900/10 rounded-full blur-[150px] opacity-50" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-fuchsia-900/10 rounded-full blur-[150px] opacity-40" />
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: Math.random() * 2 + 1 + 'px',
                            height: Math.random() * 2 + 1 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            opacity: Math.random() * 0.5 + 0.1,
                            animation: `pulse ${Math.random() * 3 + 2}s infinite`
                        }}
                    />
                ))}
            </div>

            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10">
                <div className="max-w-5xl mx-auto p-12 pb-40">
                    
                    {/* Header Area */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 mb-6">
                            <Moon size={12} /> Cosmic Retrospective
                        </div>
                        <h1 className="text-6xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tight mb-4">
                            {data.month}
                        </h1>
                        <p className="text-lg text-gray-400 font-light">
                            One month of lived experience, condensed into meaning.
                        </p>
                    </div>

                    {analysis ? (
                        <div className="space-y-24">
                            
                            {/* 1. The Theme (Hero) */}
                            <div className="text-center max-w-2xl mx-auto relative">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                                <div className="relative z-10">
                                    <h2 className="text-sm font-mono text-forge-cyan uppercase tracking-[0.2em] mb-4">Theme of the Month</h2>
                                    <div className="text-3xl md:text-4xl font-display font-bold text-white mb-8 leading-snug">
                                        "{analysis.theme}"
                                    </div>
                                    <p className="text-gray-300 leading-relaxed text-lg">
                                        {analysis.summary}
                                    </p>
                                </div>
                            </div>

                            {/* 2. Core Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/5 bg-white/[0.01]">
                                <StatBox label="Overall Score" value={analysis.score} subtext="System Rating" />
                                <StatBox label="Momentum" value={`${analysis.momentumRating}/10`} subtext="Velocity" />
                                <StatBox label="Stability" value={`${analysis.stabilityRating}/10`} subtext="Consistency" />
                                <StatBox label="Milestones" value={data.milestonesAchieved} subtext="Completed" />
                            </div>

                            {/* 3. Identity Shift */}
                            <div className="flex flex-col items-center">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">Identity Evolution</h3>
                                <GlassCard className="w-full max-w-3xl p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-white/10 text-center">
                                    <Sparkles size={24} className="text-white mx-auto mb-4 opacity-80" />
                                    <div className="text-2xl font-medium text-white mb-2">{analysis.identityShift}</div>
                                    <div className="text-sm text-white/60">Your actions are reshaping who you are.</div>
                                </GlassCard>
                            </div>

                            {/* 4. Trends */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 rounded-2xl border border-white/5 bg-black/20">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2"><Activity size={16} /> Mood Arc</h3>
                                        <div className="text-xs text-gray-500">30 Days</div>
                                    </div>
                                    <div className="h-48 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={data.moodTrend}>
                                                <defs>
                                                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="day" hide />
                                                <Tooltip cursor={false} contentStyle={{ background: '#000', border: '1px solid #333', borderRadius: '8px' }} />
                                                <Area type="monotone" dataKey="value" stroke="#818cf8" fill="url(#moodGradient)" strokeWidth={2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl border border-white/5 bg-black/20">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2"><Zap size={16} /> Energy Cycle</h3>
                                        <div className="text-xs text-gray-500">30 Days</div>
                                    </div>
                                    <div className="h-48 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={data.energyTrend}>
                                                <defs>
                                                    <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="day" hide />
                                                <Tooltip cursor={false} contentStyle={{ background: '#000', border: '1px solid #333', borderRadius: '8px' }} />
                                                <Area type="monotone" dataKey="value" stroke="#34d399" fill="url(#energyGradient)" strokeWidth={2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* 5. Highs & Lows */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <ArrowUpRight size={16} /> Highlights
                                    </h3>
                                    <div className="space-y-3">
                                        {analysis.highlights.map((h, i) => (
                                            <HighlightCard key={i} text={h} type="high" />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <ArrowDownRight size={16} /> Challenges
                                    </h3>
                                    <div className="space-y-3">
                                        {analysis.lowlights.map((l, i) => (
                                            <HighlightCard key={i} text={l} type="low" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 6. Habit Matrix */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Repeat size={16} /> Habit Evolution
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {data.habitStats.map((habit, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs text-gray-400">{habit.name}</span>
                                                {habit.trend === 'up' ? <ArrowUpRight size={12} className="text-green-400" /> : habit.trend === 'down' ? <ArrowDownRight size={12} className="text-red-400" /> : <Minus size={12} className="text-gray-500" />}
                                            </div>
                                            <div className="text-xl font-bold text-white">{habit.consistency}%</div>
                                            <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                                                <div className={cn("h-full", habit.consistency > 80 ? 'bg-green-500' : habit.consistency > 50 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: `${habit.consistency}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 7. Memory Gallery */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Visual Artifacts</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {data.topMemories.map((m) => (
                                        <MemoryThumbnail key={m.id} memory={m} />
                                    ))}
                                </div>
                            </div>

                            {/* 8. Blueprint */}
                            <div className="border-t border-white/10 pt-16">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div>
                                        <div className="flex items-center gap-2 text-forge-accent mb-4">
                                            <Star size={18} fill="currentColor" />
                                            <h3 className="text-sm font-bold uppercase tracking-wider">The Golden Insight</h3>
                                        </div>
                                        <p className="text-xl font-display font-medium text-white leading-relaxed">
                                            "{analysis.keyInsight}"
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-xl bg-white/5 border-l-2 border-white/20">
                                        <div className="text-xs font-mono text-gray-400 uppercase mb-2">Directive for Next Month</div>
                                        <p className="text-sm text-gray-200 leading-relaxed italic">
                                            {analysis.nextMonthAdvice}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="flex justify-center pt-12">
                                <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2">
                                    <Flag size={18} /> Initialize Next Cycle
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="h-96 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl">
                            <Moon className="text-white/20 mb-4 animate-pulse" size={48} />
                            <p className="text-gray-500">Consulting the Cosmic Biographer...</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
