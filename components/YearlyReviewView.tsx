
import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { 
  Orbit,
  Sparkles,
  Star,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Repeat,
  Flag,
  Mountain,
  Calendar,
  Target
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { YearlyReviewData, YearlyReviewAnalysis, MoodType } from '../types';
import { generateYearlyReview } from '../services/geminiService';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar
} from 'recharts';

// --- MOCK DATA ---

const MOCK_YEARLY_DATA: YearlyReviewData = {
    year: "2023",
    moodMatrix: [
        { month: 'Jan', intensity: 4, dominantMood: 'anxious' },
        { month: 'Feb', intensity: 5, dominantMood: 'tired' },
        { month: 'Mar', intensity: 8, dominantMood: 'inspired' },
        { month: 'Apr', intensity: 7, dominantMood: 'focused' },
        { month: 'May', intensity: 6, dominantMood: 'calm' },
        { month: 'Jun', intensity: 3, dominantMood: 'stressed' },
        { month: 'Jul', intensity: 7, dominantMood: 'joy' },
        { month: 'Aug', intensity: 8, dominantMood: 'energetic' },
        { month: 'Sep', intensity: 9, dominantMood: 'focused' },
        { month: 'Oct', intensity: 8, dominantMood: 'calm' },
        { month: 'Nov', intensity: 7, dominantMood: 'inspired' },
        { month: 'Dec', intensity: 8, dominantMood: 'calm' },
    ],
    energySeasonality: [
        { month: 'Jan', value: 40 }, { month: 'Feb', value: 50 }, { month: 'Mar', value: 85 },
        { month: 'Apr', value: 75 }, { month: 'May', value: 65 }, { month: 'Jun', value: 30 },
        { month: 'Jul', value: 80 }, { month: 'Aug', value: 90 }, { month: 'Sep', value: 95 },
        { month: 'Oct', value: 85 }, { month: 'Nov', value: 80 }, { month: 'Dec', value: 75 }
    ],
    topMilestones: [
        { id: '1', title: 'Career Pivot', month: 'Sep', type: 'goal' },
        { id: '2', title: 'Marathon', month: 'Aug', type: 'project' },
        { id: '3', title: 'Debt Free', month: 'Dec', type: 'goal' }
    ],
    habitPerformance: [
        { name: 'Gym', consistency: 88 },
        { name: 'Reading', consistency: 72 },
        { name: 'Meditation', consistency: 65 }
    ]
};

// --- SUB-COMPONENTS ---

const StatBox: React.FC<{ label: string; value: string | number; subtext?: string; glow?: string }> = ({ label, value, subtext, glow }) => (
    <div className={cn("text-center p-4 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden group")}>
        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500", glow || 'bg-white')} />
        <div className="relative z-10">
            <div className="text-xs text-white/50 uppercase tracking-widest mb-2">{label}</div>
            <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
            {subtext && <div className="text-[10px] text-white/60">{subtext}</div>}
        </div>
    </div>
);

const ChapterCard: React.FC<{ chapter: YearlyReviewAnalysis['narrativeChapters'][0]; index: number }> = ({ chapter, index }) => {
    return (
        <div className="group relative pl-8 pb-12 border-l border-white/10 last:border-l-0 last:pb-0">
            <div className={cn(
                "absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-[#0B0B15] transition-all duration-500 z-10",
                index % 2 === 0 ? 'bg-forge-cyan shadow-[0_0_10px_#22D3EE]' : 'bg-fuchsia-500 shadow-[0_0_10px_#D946EF]'
            )} />
            <div className="group-hover:translate-x-2 transition-transform duration-300">
                <div className="text-xs font-mono text-gray-500 mb-1 uppercase tracking-widest">{chapter.month}</div>
                <h3 className="text-xl font-display font-bold text-white mb-2">{chapter.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-md">{chapter.summary}</p>
            </div>
        </div>
    );
};

// --- MAIN VIEW ---

export const YearlyReviewView: React.FC = () => {
    const [data] = useState<YearlyReviewData>(MOCK_YEARLY_DATA);
    const [analysis, setAnalysis] = useState<YearlyReviewAnalysis | null>(null);
    const [, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const loadAnalysis = async () => {
            setIsAnalyzing(true);
            const result = await generateYearlyReview(data);
            setAnalysis(result);
            setIsAnalyzing(false);
        };
        loadAnalysis();
    }, []);

    return (
        <div className="h-full flex bg-[#050505] text-white relative overflow-hidden animate-in fade-in duration-1000">
            
            {/* Galactic Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#16213E] via-[#0B0B15] to-[#000000]">
                <div className="absolute top-[-20%] left-[10%] w-[1200px] h-[1200px] bg-indigo-900/10 rounded-full blur-[200px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[10%] w-[1000px] h-[1000px] bg-fuchsia-900/10 rounded-full blur-[200px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                
                {/* Parallax Stars */}
                {[...Array(50)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: Math.random() * 2 + 'px',
                            height: Math.random() * 2 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            opacity: Math.random() * 0.7 + 0.1,
                            animation: `float ${Math.random() * 10 + 10}s linear infinite`
                        }}
                    />
                ))}
            </div>

            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10">
                <div className="max-w-6xl mx-auto p-12 pb-40">
                    
                    {/* Hero Header */}
                    <div className="text-center mb-32 relative">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-300 mb-8 backdrop-blur-md">
                                <Orbit size={14} className="animate-spin-slow" /> Galactic Retrospective
                            </div>
                            <h1 className="text-8xl md:text-9xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20 tracking-tighter mb-6">
                                {data.year}
                            </h1>
                            {analysis && (
                                <div className="animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
                                    <h2 className="text-2xl md:text-3xl font-light text-forge-cyan/90 tracking-wide mb-4 font-display">
                                        "{analysis.theme}"
                                    </h2>
                                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                        {analysis.summary}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {analysis ? (
                        <div className="space-y-32">
                            
                            {/* 1. Identity Evolution (Radar Chart) */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Sparkles size={16} /> Identity Arc
                                    </h3>
                                    <h2 className="text-4xl font-display font-bold text-white mb-6">
                                        {analysis.identityLabel}
                                    </h2>
                                    <p className="text-gray-400 leading-relaxed text-lg mb-8">
                                        This year wasn't just about what you did, but who you became. 
                                        The data shows a distinct shift towards autonomy and resilience.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <StatBox label="Momentum" value={`${analysis.momentumRating}/10`} glow="bg-cyan-500" />
                                        <StatBox label="Stability" value={`${analysis.stabilityRating}/10`} glow="bg-purple-500" />
                                    </div>
                                </div>
                                <div className="h-[400px] w-full relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-forge-accent/10 to-transparent rounded-full blur-3xl" />
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysis.identityRadar}>
                                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar
                                                name="Identity"
                                                dataKey="A"
                                                stroke="#22D3EE"
                                                strokeWidth={3}
                                                fill="#22D3EE"
                                                fillOpacity={0.3}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* 2. The Narrative (Timeline) */}
                            <div>
                                <div className="text-center mb-16">
                                    <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-2">The Storyline</h3>
                                    <h2 className="text-3xl font-display font-bold text-white">12 Chapters of Growth</h2>
                                </div>
                                <div className="max-w-3xl mx-auto pl-8">
                                    {analysis.narrativeChapters.map((chapter, i) => (
                                        <ChapterCard key={i} chapter={chapter} index={i} />
                                    ))}
                                </div>
                            </div>

                            {/* 3. Energy Seasonality */}
                            <GlassCard className="p-8 relative overflow-hidden bg-black/40" noPadding>
                                <div className="p-8 pb-0 flex justify-between items-end mb-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                            <Zap size={16} className="text-yellow-400" /> Yearly Flow State
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">Energy output across seasons</p>
                                    </div>
                                </div>
                                <div className="h-64 w-full p-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.energySeasonality}>
                                            <defs>
                                                <linearGradient id="yearEnergy" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#FBBF24" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                            <Area type="monotone" dataKey="value" stroke="#FBBF24" fill="url(#yearEnergy)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </GlassCard>

                            {/* 4. Highs & Lows */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <ArrowUpRight size={16} className="text-green-400" /> Peak Moments
                                    </h3>
                                    <div className="space-y-4">
                                        {analysis.highlights.map((h, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                                <span className="text-sm text-gray-200">{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <ArrowDownRight size={16} className="text-red-400" /> Critical Lessons
                                    </h3>
                                    <div className="space-y-4">
                                        {analysis.lowlights.map((l, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                                                <span className="text-sm text-gray-200">{l}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 5. Habit Threads */}
                            <div className="bg-gradient-to-r from-white/5 to-transparent rounded-2xl p-8 border border-white/5">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <Repeat size={16} /> Threads of Consistency
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {data.habitPerformance.map((habit, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-black/20 border border-white/5 flex flex-col items-center text-center">
                                            <div className="text-3xl font-bold text-white mb-1">{habit.consistency}%</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">{habit.name}</div>
                                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div 
                                                    className={cn("h-full rounded-full", i === 0 ? 'bg-forge-cyan' : i === 1 ? 'bg-purple-500' : 'bg-orange-500')} 
                                                    style={{ width: `${habit.consistency}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 6. Future Casting */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-30 rounded-full pointer-events-none" />
                                <div className="relative z-10 text-center max-w-3xl mx-auto p-12 border-y border-white/10 bg-black/40 backdrop-blur-sm">
                                    <Star size={32} className="text-yellow-400 mx-auto mb-6 animate-pulse-slow" />
                                    <h2 className="text-2xl font-display font-bold text-white mb-6">The Golden Insight</h2>
                                    <p className="text-xl text-gray-200 italic leading-relaxed mb-8">
                                        "{analysis.keyInsight}"
                                    </p>
                                    <div className="inline-block px-6 py-4 rounded-xl bg-white/5 border-l-4 border-forge-cyan text-left">
                                        <div className="text-xs font-mono text-forge-cyan uppercase tracking-widest mb-2">Directive for 2024</div>
                                        <p className="text-sm text-gray-300">{analysis.nextYearAdvice}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="flex justify-center pt-20 pb-20">
                                <button className="group relative px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                    <span className="flex items-center gap-3 relative z-10">
                                        <Flag size={20} /> Commit to the New Year
                                    </span>
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="h-96 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                            <Orbit className="text-white/20 mb-6 animate-spin-slow" size={64} />
                            <p className="text-lg text-gray-400 font-light">Synthesizing Galactic Data...</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
