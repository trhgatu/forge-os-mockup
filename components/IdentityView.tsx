
import React, { useState, useEffect } from 'react';
import { 
    Fingerprint, 
    Orbit, 
    Sparkles, 
    TrendingUp, 
    Zap, 
    Anchor, 
    Compass, 
    Target, 
    Brain, 
    Activity,
    Repeat,
    ArrowRight,
    RefreshCw,
    Hexagon,
    Shield,
    Plus
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { IdentityProfile, IdentityDriver } from '../types';
import { generateIdentityAnalysis } from '../services/geminiService';
import { cn } from '../lib/utils';
import { 
    ResponsiveContainer, 
    RadarChart, 
    PolarGrid, 
    PolarAngleAxis, 
    PolarRadiusAxis, 
    Radar,
    AreaChart,
    Area,
    XAxis,
    Tooltip,
    ReferenceLine
} from 'recharts';

// --- MOCK DATA FOR GRAPHS ---
const CONSISTENCY_DATA = [
    { day: 'M', value: 65 }, { day: 'T', value: 72 }, { day: 'W', value: 85 },
    { day: 'T', value: 80 }, { day: 'F', value: 75 }, { day: 'S', value: 90 }, { day: 'S', value: 88 }
];

// --- VISUAL COMPONENTS ---

const ConstellationNode: React.FC<{ x: number; y: number; size: number; color: string; label?: string; pulse?: boolean }> = ({ x, y, size, color, label, pulse }) => (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer" style={{ left: `${x}%`, top: `${y}%` }}>
        {pulse && <div className={cn("absolute inset-0 -m-4 rounded-full blur-xl opacity-30 animate-pulse-slow", color.replace('bg-', 'bg-opacity-30 '))} />}
        <div className={cn("rounded-full transition-all duration-500", size > 16 ? 'border-2 border-white/20' : '', color)} style={{ width: size, height: size }} />
        {label && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-white whitespace-nowrap bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10 z-10">
                {label}
            </div>
        )}
    </div>
);

const ConstellationLine: React.FC<{ x1: number; y1: number; x2: number; y2: number; opacity: number }> = ({ x1, y1, x2, y2, opacity }) => {
    // Convert percentages to approximate SVG coordinates (assuming 1000x600 canvas)
    const width = 1000;
    const height = 600;
    return (
        <line 
            x1={x1 * (width/100)} 
            y1={y1 * (height/100)} 
            x2={x2 * (width/100)} 
            y2={y2 * (height/100)} 
            stroke="rgba(255,255,255,0.15)" 
            strokeWidth="1"
            strokeOpacity={opacity}
        />
    );
};

const IdentityConstellationMap: React.FC = () => {
    // Simulate nodes (Habits, Goals, Emotions)
    const nodes = [
        { id: 1, x: 50, y: 50, size: 32, color: 'bg-white', label: 'Identity Core', pulse: true },
        { id: 2, x: 30, y: 30, size: 16, color: 'bg-fuchsia-500', label: 'Creative Ambition' },
        { id: 3, x: 70, y: 30, size: 16, color: 'bg-cyan-500', label: 'Systems Thinking' },
        { id: 4, x: 20, y: 60, size: 12, color: 'bg-blue-500', label: 'Deep Work Habit' },
        { id: 5, x: 80, y: 60, size: 12, color: 'bg-emerald-500', label: 'Physical Resilience' },
        { id: 6, x: 50, y: 80, size: 20, color: 'bg-violet-500', label: 'Emotional Stability' },
        { id: 7, x: 35, y: 45, size: 8, color: 'bg-white/50' }, // connector
        { id: 8, x: 65, y: 45, size: 8, color: 'bg-white/50' }, // connector
    ];

    return (
        <div className="w-full h-[500px] relative overflow-hidden rounded-3xl border border-white/5 bg-[#0B0B15] group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1E1B4B] via-[#0B0B15] to-[#050505] opacity-80" />
            
            {/* SVG Layer for Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 600" preserveAspectRatio="none">
                <ConstellationLine x1={50} y1={50} x2={30} y2={30} opacity={0.5} />
                <ConstellationLine x1={50} y1={50} x2={70} y2={30} opacity={0.5} />
                <ConstellationLine x1={50} y1={50} x2={50} y2={80} opacity={0.5} />
                <ConstellationLine x1={30} y1={30} x2={20} y2={60} opacity={0.3} />
                <ConstellationLine x1={70} y1={30} x2={80} y2={60} opacity={0.3} />
                <ConstellationLine x1={20} y1={60} x2={50} y2={80} opacity={0.1} />
                <ConstellationLine x1={80} y1={60} x2={50} y2={80} opacity={0.1} />
            </svg>

            {/* Nodes */}
            {nodes.map(n => (
                <ConstellationNode key={n.id} {...n} />
            ))}
            
            <div className="absolute bottom-6 right-6 text-xs font-mono text-white/30 uppercase tracking-widest pointer-events-none">
                Neural Identity Map v2.4
            </div>
        </div>
    );
};

const ArchetypeWheel: React.FC<{ traits: IdentityProfile['traits'] }> = ({ traits }) => {
    const data = traits.map(t => ({ subject: t.name, A: t.score, fullMark: 100 }));
    
    return (
        <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Identity"
                        dataKey="A"
                        stroke="#7C3AED"
                        strokeWidth={3}
                        fill="#7C3AED"
                        fillOpacity={0.3}
                    />
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

const PhaseTimeline: React.FC<{ currentPhase: IdentityProfile['currentPhase'] }> = ({ currentPhase }) => {
    return (
        <div className="w-full py-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2" />
            <div className="flex justify-between relative z-10 px-4 md:px-12">
                <div className="flex flex-col items-center opacity-50">
                    <div className="w-3 h-3 rounded-full bg-gray-600 mb-4" />
                    <span className="text-[10px] text-gray-500 uppercase">Era of Overcoming</span>
                </div>
                <div className="flex flex-col items-center opacity-50">
                    <div className="w-3 h-3 rounded-full bg-gray-600 mb-4" />
                    <span className="text-[10px] text-gray-500 uppercase">Era of Discovery</span>
                </div>
                <div className="flex flex-col items-center relative">
                    <div className="absolute -top-12 px-3 py-1 bg-forge-accent text-white text-xs rounded-full whitespace-nowrap shadow-[0_0_15px_rgba(124,58,237,0.4)] animate-float">
                        Current Phase
                    </div>
                    <div className="w-5 h-5 rounded-full bg-white border-4 border-forge-accent shadow-[0_0_20px_#7C3AED] mb-4 relative z-10" />
                    <span className="text-xs text-white font-bold uppercase tracking-wider">{currentPhase.title}</span>
                    <span className="text-[10px] text-gray-500 mt-1">Started {currentPhase.startDate.toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col items-center opacity-30">
                    <div className="w-3 h-3 rounded-full bg-gray-800 border border-white/10 mb-4" />
                    <span className="text-[10px] text-gray-600 uppercase">The Architect</span>
                </div>
            </div>
        </div>
    );
};

const DriverCard: React.FC<{ driver: IdentityDriver }> = ({ driver }) => (
    <div className="group p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all">
        <div className="flex justify-between items-start mb-2">
            <div className={cn(
                "text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border bg-transparent",
                driver.type === 'Habit' ? 'text-blue-400 border-blue-500/30' :
                driver.type === 'Emotion' ? 'text-pink-400 border-pink-500/30' :
                driver.type === 'Goal' ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400 border-amber-500/30'
            )}>
                {driver.type}
            </div>
            <div className="text-xs font-mono text-gray-500">{driver.impact}% Impact</div>
        </div>
        <h4 className="text-white font-medium mb-1">{driver.name}</h4>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{driver.description}</p>
    </div>
);

export const IdentityView: React.FC = () => {
    const [data, setData] = useState<IdentityProfile | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const load = async () => {
            setIsAnalyzing(true);
            try {
                const result = await generateIdentityAnalysis();
                setData(result);
            } catch (e) {
                console.error(e);
            } finally {
                setIsAnalyzing(false);
            }
        };
        load();
    }, []);

    if (!data) return (
        <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full border-4 border-forge-accent border-t-transparent animate-spin mb-6" />
            <h2 className="text-xl font-display font-bold text-white">Mapping Identity Vectors...</h2>
            <p className="text-sm text-gray-500 mt-2">Consulting the core memory banks.</p>
        </div>
    );

    return (
        <div className="h-full flex bg-[#050505] text-white relative overflow-hidden animate-in fade-in duration-1000 selection:bg-fuchsia-500/30">
            
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/20 via-[#050505] to-black" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10">
                <div className="max-w-6xl mx-auto p-8 md:p-12 pb-40">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 mb-4">
                                <Fingerprint size={12} /> Soul Interface v1.0
                            </div>
                            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 tracking-tight">
                                Identity Evolution
                            </h1>
                            <p className="text-lg text-gray-400 font-light max-w-2xl">
                                A living map of the self you are becoming. Your habits, choices, and breakthroughs woven into a constellation of growth.
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-right mb-2">
                                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                                    {data.evolutionScore}
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Evolution Score</div>
                            </div>
                            <div className="flex gap-2">
                                {['Month', 'Year', 'Life'].map(range => (
                                    <button key={range} className="px-3 py-1 rounded border border-white/10 text-xs text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 1. Constellation & Snapshot */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        <div className="lg:col-span-2 space-y-6">
                            <IdentityConstellationMap />
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Current Trajectory</div>
                                    <div className="text-xl text-white font-display font-medium">"{data.vector}"</div>
                                </div>
                                <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <GlassCard className="flex-1 flex flex-col" noPadding>
                                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <Hexagon size={16} className="text-fuchsia-500" /> Archetype
                                    </h3>
                                    <span className="px-2 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-300 text-[10px] uppercase font-bold border border-fuchsia-500/20">
                                        {data.archetype}
                                    </span>
                                </div>
                                <div className="flex-1 p-4">
                                    <ArchetypeWheel traits={data.traits} />
                                </div>
                                <div className="p-6 border-t border-white/5 grid grid-cols-3 gap-2">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-white">92%</div>
                                        <div className="text-[10px] text-gray-500 uppercase">Consistency</div>
                                    </div>
                                    <div className="text-center border-l border-white/5">
                                        <div className="text-lg font-bold text-white">85%</div>
                                        <div className="text-[10px] text-gray-500 uppercase">Awareness</div>
                                    </div>
                                    <div className="text-center border-l border-white/5">
                                        <div className="text-lg font-bold text-white">78%</div>
                                        <div className="text-[10px] text-gray-500 uppercase">Courage</div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>

                    {/* 2. Timeline */}
                    <div className="mb-20">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8 pl-2 border-l-2 border-forge-accent">
                            Life Chapters
                        </h3>
                        <GlassCard className="p-8 overflow-hidden relative" noPadding>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-pulse-slow" />
                            <PhaseTimeline currentPhase={data.currentPhase} />
                            <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/5 max-w-3xl mx-auto text-center relative z-10">
                                <p className="text-gray-300 italic leading-relaxed">"{data.currentPhase.description}"</p>
                            </div>
                        </GlassCard>
                    </div>

                    {/* 3. Shifts & Drivers */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                        <div>
                            <div className="flex justify-between items-end mb-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-l-2 border-cyan-500 pl-2">
                                    Recent Breakthroughs
                                </h3>
                                <button className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1">View Log <ArrowRight size={10}/></button>
                            </div>
                            <div className="space-y-4">
                                {data.recentShifts.map(shift => (
                                    <div key={shift.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs text-cyan-400 font-mono uppercase">{shift.type} Shift</div>
                                            <div className="text-xs text-gray-500">{shift.date.toLocaleDateString()}</div>
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2">{shift.title}</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">{shift.context}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-l-2 border-violet-500 pl-2">
                                    Identity Drivers
                                </h3>
                                <button className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1">Manage <ArrowRight size={10}/></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.topDrivers.map(driver => (
                                    <DriverCard key={driver.id} driver={driver} />
                                ))}
                                <div className="flex items-center justify-center p-4 rounded-xl border border-dashed border-white/10 text-gray-600 hover:text-gray-400 hover:border-white/20 cursor-pointer transition-all">
                                    <Plus size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Future Projection */}
                    <div className="relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-forge-accent/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />
                        <div className="relative z-10 max-w-4xl mx-auto text-center">
                            <Orbit size={48} className="text-white mx-auto mb-6 animate-spin-slow opacity-80" />
                            <h2 className="text-3xl font-display font-bold text-white mb-8">Future Self Projection</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Next Phase</div>
                                    <div className="text-xl font-bold text-white">{data.futureProjection.nextPhasePrediction}</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Projected Alignment</div>
                                    <div className="text-3xl font-bold text-forge-cyan">{data.futureProjection.alignment}%</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Potential Trap</div>
                                    <div className="text-sm text-white leading-relaxed">"{data.futureProjection.potentialTraps[0]}"</div>
                                </div>
                            </div>

                            <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2 mx-auto">
                                <Target size={18} /> Calibrate Trajectory
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
