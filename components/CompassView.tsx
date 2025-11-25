
import React, { useState, useEffect } from 'react';
import { 
    Compass, 
    Target, 
    TrendingUp, 
    AlertTriangle, 
    Zap, 
    ArrowRight, 
    CheckCircle2, 
    Star, 
    Calendar, 
    Navigation, 
    Crosshair,
    RefreshCw,
    Lock,
    ChevronRight,
    Flag
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { CompassData, HorizonLevel } from '../types';
import { generateCompassAnalysis } from '../services/geminiService';
import { cn } from '../lib/utils';

// --- UI COMPONENTS ---

const NorthStarWidget: React.FC<{ northStar: CompassData['northStar'] }> = ({ northStar }) => (
    <div className="relative p-8 md:p-10 rounded-[2rem] overflow-hidden text-center group border border-white/10 bg-black/40 backdrop-blur-xl">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent group-hover:from-yellow-500/20 transition-all duration-1000" />
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-yellow-500/10 rounded-full animate-spin-slow opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-dashed border-yellow-500/10 rounded-full animate-spin-slow opacity-30" style={{ animationDirection: 'reverse' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 text-yellow-400 animate-float">
                <Star size={32} fill="currentColor" className="drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
            </div>
            <h2 className="text-xs font-mono text-yellow-500/80 uppercase tracking-[0.3em] mb-4">True North</h2>
            <h1 className="text-2xl md:text-4xl font-display font-bold text-white mb-4 leading-snug max-w-3xl">
                "{northStar.statement}"
            </h1>
            <p className="text-sm text-gray-400 max-w-xl leading-relaxed mb-6 italic">
                {northStar.whyItMatters}
            </p>
            
            <div className="flex items-center gap-4 text-xs font-mono text-gray-500 border-t border-white/10 pt-4">
                <span className="flex items-center gap-1">
                    <Calendar size={12} /> Horizon: {northStar.timeHorizon}
                </span>
                <span className="w-px h-3 bg-white/10" />
                <span className="flex items-center gap-1 text-yellow-500">
                    <Zap size={12} /> Resonance: {northStar.resonanceScore}/10
                </span>
            </div>
        </div>
    </div>
);

const HorizonTabs: React.FC<{ horizons: CompassData['horizons']; activeLevel: HorizonLevel; onChange: (l: HorizonLevel) => void }> = ({ horizons, activeLevel, onChange }) => {
    return (
        <div className="flex flex-col items-center mb-8">
            <div className="flex p-1 rounded-full bg-white/5 border border-white/10 relative backdrop-blur-md">
                {horizons.map((h) => (
                    <button
                        key={h.level}
                        onClick={() => onChange(h.level)}
                        className={cn(
                            "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 relative z-10",
                            activeLevel === h.level ? 'text-black' : 'text-gray-400 hover:text-white'
                        )}
                    >
                        {h.level}
                    </button>
                ))}
                {/* Sliding Pill */}
                <div 
                    className="absolute top-1 bottom-1 rounded-full bg-white transition-all duration-300 ease-spring-out z-0 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    style={{
                        left: activeLevel === '1Y' ? '4px' : activeLevel === '3Y' ? '33%' : '66%',
                        width: '32%',
                        transform: activeLevel === '3Y' ? 'translateX(4px)' : activeLevel === '5Y' ? 'translateX(2px)' : 'none'
                    }}
                />
            </div>
        </div>
    );
};

const HorizonContent: React.FC<{ horizon: CompassData['horizons'][0] }> = ({ horizon }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <GlassCard className="p-8 text-center mb-8 border-t-2 border-t-forge-cyan/50 bg-black/40" noPadding>
            <div className="relative z-10">
                <h3 className="text-lg font-display font-bold text-white mb-4">Vision Snapshot</h3>
                <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                    "{horizon.vision}"
                </p>
            </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {horizon.domains.map((domain, i) => (
                <div key={i} className={cn(
                    "p-5 rounded-2xl border flex flex-col justify-between h-32 transition-all hover:-translate-y-1",
                    domain.status === 'on-track' ? 'bg-emerald-900/10 border-emerald-500/20' :
                    domain.status === 'drifting' ? 'bg-amber-900/10 border-amber-500/20' :
                    'bg-rose-900/10 border-rose-500/20'
                )}>
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-mono uppercase text-gray-400">{domain.name}</span>
                        <div className={cn(
                            "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
                            domain.status === 'on-track' ? 'bg-emerald-500 text-emerald-500' :
                            domain.status === 'drifting' ? 'bg-amber-500 text-amber-500' : 'bg-rose-500 text-rose-500'
                        )} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Anchor Goal</div>
                        <div className="text-sm font-bold text-white">{domain.anchorGoal}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const TrackCard: React.FC<{ track: CompassData['tracks'][0] }> = ({ track }) => (
    <div className="group relative p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-forge-cyan to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="flex justify-between items-start mb-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-forge-cyan bg-forge-cyan/10 px-2 py-0.5 rounded border border-forge-cyan/20">{track.horizon}</span>
                    {track.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                </div>
                <h3 className="font-bold text-white group-hover:text-forge-cyan transition-colors">{track.title}</h3>
            </div>
            <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Momentum</div>
                <div className="text-lg font-bold text-white">{track.momentum}%</div>
            </div>
        </div>
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-forge-cyan transition-all duration-1000" style={{ width: `${track.progress}%` }} />
        </div>
    </div>
);

const AlignmentMatrix: React.FC = () => {
    // Mock visualization of Themes (cols) vs Goals (rows)
    return (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Crosshair size={16} /> Alignment Matrix
                </h3>
                <div className="flex gap-4 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-fuchsia-500" /> Linked</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white/10" /> Void</span>
                </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
                {/* Header Row (Themes) */}
                <div className="col-span-1"></div>
                {['Create', 'Build', 'Connect', 'Heal'].map(t => (
                    <div key={t} className="text-center text-[10px] font-mono text-gray-500 uppercase -rotate-45 origin-bottom-left translate-y-2">{t}</div>
                ))}

                {/* Rows (Goals) */}
                {['Ship MVP', 'Marathon', 'Write Book', 'Networking'].map((goal, i) => (
                    <React.Fragment key={goal}>
                        <div className="col-span-1 text-xs text-gray-400 font-medium truncate py-2">{goal}</div>
                        {[0, 1, 2, 3].map((col) => {
                            const active = (i + col) % 2 === 0; // Mock logic
                            return (
                                <div key={col} className="flex items-center justify-center">
                                    <div className={cn(
                                        "w-3 h-3 rounded-full transition-all",
                                        active ? 'bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]' : 'bg-white/5'
                                    )} />
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const DriftPanel: React.FC<{ score: number; sources: string[] }> = ({ score, sources }) => (
    <GlassCard className="bg-gradient-to-br from-rose-900/10 to-transparent border-rose-500/20" noPadding>
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={14} /> Drift Detected
                </h3>
                <span className="text-2xl font-bold text-white">{score}%</span>
            </div>
            <div className="space-y-3">
                {sources.map((source, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-rose-200/80">
                        <ArrowRight size={12} className="mt-0.5 shrink-0" />
                        {source}
                    </div>
                ))}
            </div>
        </div>
    </GlassCard>
);

const InsightCard: React.FC<{ title: string; type: 'opportunity' | 'warning' }> = ({ title, type }) => (
    <div className={cn(
        "p-4 rounded-xl border flex items-start gap-3 transition-all hover:-translate-y-1 cursor-pointer",
        type === 'opportunity' ? 'bg-emerald-900/10 border-emerald-500/20 hover:bg-emerald-900/20' : 'bg-amber-900/10 border-amber-500/20 hover:bg-amber-900/20'
    )}>
        <div className={cn("p-1.5 rounded-lg shrink-0", type === 'opportunity' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400')}>
            {type === 'opportunity' ? <Star size={14} /> : <AlertTriangle size={14} />}
        </div>
        <p className="text-sm text-gray-200 leading-tight">{title}</p>
    </div>
);

// --- MAIN VIEW ---

export const CompassView: React.FC = () => {
    const [data, setData] = useState<CompassData | null>(null);
    const [horizon, setHorizon] = useState<HorizonLevel>('1Y');
    const [isRecalibrating, setIsRecalibrating] = useState(false);

    useEffect(() => {
        const load = async () => {
            // Mock loading
            setTimeout(async () => {
                const result = await generateCompassAnalysis();
                setData(result);
            }, 1000);
        };
        load();
    }, []);

    if (!data) return (
        <div className="h-full flex flex-col items-center justify-center bg-[#020617]">
            <div className="w-16 h-16 border-4 border-forge-accent border-t-transparent rounded-full animate-spin mb-6" />
            <h2 className="text-xl font-display font-bold text-white">Calibrating Navigation Systems...</h2>
        </div>
    );

    const currentHorizon = data.horizons.find(h => h.level === horizon) || data.horizons[0];

    return (
        <div className="h-full flex bg-[#020617] text-white relative overflow-hidden animate-in fade-in duration-1000 selection:bg-yellow-500/30">
            
            {/* Deep Space Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-indigo-900/10 rounded-full blur-[200px]" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-900/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
            </div>

            {/* Main Content */}
            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10">
                <div className="max-w-7xl mx-auto p-6 md:p-10 pb-32">
                    
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-12">
                        <div className="flex items-center gap-3 text-xs font-mono text-gray-500 uppercase tracking-widest">
                            <Compass size={14} className="text-forge-cyan" /> Global Navigation
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">{data.alignmentScore}%</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Alignment</div>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="text-right">
                                <div className="text-sm font-bold text-white">{data.currentPhase}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Phase</div>
                            </div>
                        </div>
                    </div>

                    {/* North Star */}
                    <div className="mb-20">
                        <NorthStarWidget northStar={data.northStar} />
                    </div>

                    {/* Horizons Map */}
                    <div className="mb-24">
                        <div className="flex flex-col items-center mb-10">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">Temporal Horizons</h3>
                            <HorizonTabs horizons={data.horizons} activeLevel={horizon} onChange={setHorizon} />
                        </div>
                        <HorizonContent horizon={currentHorizon} />
                    </div>

                    {/* Strategic Tracks & Alignment */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <Target size={16} /> Strategic Tracks
                                </h3>
                                <button className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                                    View All <ChevronRight size={12} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.tracks.map(track => (
                                    <TrackCard key={track.id} track={track} />
                                ))}
                            </div>
                            
                            <div className="mt-12">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
                                    <Flag size={16} /> Next Quarter Directive
                                </h3>
                                <div className="p-8 rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/10 flex flex-col md:flex-row gap-8">
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500 uppercase mb-2">Focus Themes</div>
                                        <div className="flex gap-2 mb-6">
                                            {data.nextQuarterFocus.themes.map(t => (
                                                <span key={t} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase mb-2">Priority Goals</div>
                                        <ul className="space-y-2">
                                            {data.nextQuarterFocus.goals.map(g => (
                                                <li key={g} className="flex items-center gap-2 text-sm text-white">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-forge-cyan" /> {g}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex items-center justify-center border-l border-white/10 pl-8">
                                        <button className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2">
                                            <Lock size={16} /> Lock Directive
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 space-y-8">
                            <AlignmentMatrix />
                            <DriftPanel score={data.driftScore} sources={data.driftSources} />
                            
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <TrendingUp size={16} /> AI Insights
                                </h3>
                                <div className="space-y-3">
                                    <InsightCard title="High alignment in Creative domains, but Health is drifting." type="warning" />
                                    <InsightCard title="Pausing 'Side Project B' would increase North Star velocity by 15%." type="opportunity" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="text-center pt-12 border-t border-white/5">
                        <p className="text-sm text-gray-500 mb-6">Trajectory looks solid. Stay the course.</p>
                        <button 
                            onClick={() => setIsRecalibrating(true)}
                            className="text-xs font-mono text-forge-cyan hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto uppercase tracking-widest"
                        >
                            <RefreshCw size={14} /> Recalibrate Compass
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
