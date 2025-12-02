
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
    Flag,
    Map
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { CompassData, HorizonLevel } from '../types';
import { generateCompassAnalysis } from '../services/geminiService';
import { cn } from '../lib/utils';

// --- UI COMPONENTS ---

const NorthStarWidget: React.FC<{ northStar: CompassData['northStar'] }> = ({ northStar }) => (
    <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent">
        <div className="relative p-8 md:p-12 rounded-[2.2rem] overflow-hidden text-center group bg-[#08080a] border border-white/5 shadow-2xl">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-[#08080a] to-[#08080a]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            
            {/* Constellation lines decoration */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10 flex flex-col items-center">
                <div className="mb-8 p-4 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.2)] animate-float">
                    <Star size={32} fill="currentColor" className="text-amber-400" />
                </div>
                
                <h2 className="text-xs font-mono text-amber-500/80 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <span className="w-8 h-px bg-amber-500/30" /> True North <span className="w-8 h-px bg-amber-500/30" />
                </h2>
                
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight max-w-4xl tracking-tight drop-shadow-xl">
                    "{northStar.statement}"
                </h1>
                
                <p className="text-base text-gray-400 max-w-2xl leading-relaxed mb-8 font-light border-l-2 border-amber-500/30 pl-6 italic">
                    {northStar.whyItMatters}
                </p>
                
                <div className="flex items-center gap-6 text-xs font-mono text-gray-500 bg-white/5 px-6 py-3 rounded-full border border-white/5">
                    <span className="flex items-center gap-2">
                        <Calendar size={12} className="text-gray-400" /> {northStar.timeHorizon} Horizon
                    </span>
                    <span className="w-px h-3 bg-white/10" />
                    <span className="flex items-center gap-2 text-amber-400">
                        <Zap size={12} fill="currentColor" /> Resonance: {northStar.resonanceScore}/10
                    </span>
                </div>
            </div>
        </div>
    </div>
);

const HorizonTabs: React.FC<{ horizons: CompassData['horizons']; activeLevel: HorizonLevel; onChange: (l: HorizonLevel) => void }> = ({ horizons, activeLevel, onChange }) => {
    return (
        <div className="flex justify-center mb-10">
            <div className="flex p-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                {horizons.map((h) => (
                    <button
                        key={h.level}
                        onClick={() => onChange(h.level)}
                        className={cn(
                            "px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300",
                            activeLevel === h.level 
                                ? 'bg-white text-black shadow-lg scale-105' 
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                        )}
                    >
                        {h.level} Horizon
                    </button>
                ))}
            </div>
        </div>
    );
};

const HorizonContent: React.FC<{ horizon: CompassData['horizons'][0] }> = ({ horizon }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <GlassCard className="p-8 text-center mb-8 border-t-2 border-t-forge-cyan/30 bg-[#0A0A0F]" noPadding>
            <div className="relative z-10">
                <h3 className="text-xs font-bold text-forge-cyan uppercase tracking-widest mb-3">Vision Snapshot</h3>
                <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto font-light font-display">
                    "{horizon.vision}"
                </p>
            </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {horizon.domains.map((domain, i) => (
                <div key={i} className={cn(
                    "group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 bg-white/[0.02]",
                    domain.status === 'on-track' ? 'border-emerald-500/20 hover:border-emerald-500/40' :
                    domain.status === 'drifting' ? 'border-amber-500/20 hover:border-amber-500/40' :
                    'border-rose-500/20 hover:border-rose-500/40'
                )}>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">{domain.name}</span>
                        <div className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                            domain.status === 'on-track' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            domain.status === 'drifting' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        )}>
                            {domain.status}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1 font-mono">Anchor Goal</div>
                        <div className="text-base font-bold text-white group-hover:text-forge-cyan transition-colors">{domain.anchorGoal}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const TrackCard: React.FC<{ track: CompassData['tracks'][0] }> = ({ track }) => (
    <div className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer overflow-hidden">
        {/* Progress Bar Background */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
            <div className="h-full bg-forge-cyan transition-all duration-1000" style={{ width: `${track.progress}%` }} />
        </div>
        
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 group-hover:text-white transition-colors">
                    <Target size={18} />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold text-forge-cyan bg-forge-cyan/10 px-1.5 py-0.5 rounded border border-forge-cyan/20">{track.horizon}</span>
                        {track.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                    </div>
                    <h3 className="font-bold text-white text-lg group-hover:text-forge-cyan transition-colors">{track.title}</h3>
                </div>
            </div>
            <div className="text-right">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Momentum</div>
                <div className="text-xl font-display font-bold text-white">{track.momentum}%</div>
            </div>
        </div>
    </div>
);

const AlignmentMatrix: React.FC = () => {
    return (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Crosshair size={14} /> Alignment Matrix
                </h3>
                <div className="flex gap-3 text-[9px] font-mono text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" /> Linked</span>
                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-white/10" /> Void</span>
                </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
                {/* Header Row (Themes) */}
                <div className="col-span-1"></div>
                {['Create', 'Build', 'Connect', 'Heal'].map(t => (
                    <div key={t} className="text-center text-[9px] font-mono text-gray-500 uppercase -rotate-45 origin-bottom-left translate-y-2 opacity-70">{t}</div>
                ))}

                {/* Rows (Goals) */}
                {['Ship MVP', 'Marathon', 'Write Book', 'Networking'].map((goal, i) => (
                    <React.Fragment key={goal}>
                        <div className="col-span-1 text-[10px] text-gray-400 font-medium truncate py-2 flex items-center">{goal}</div>
                        {[0, 1, 2, 3].map((col) => {
                            const active = (i + col) % 2 === 0; // Mock logic
                            return (
                                <div key={col} className="flex items-center justify-center">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full transition-all duration-500",
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
    <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-900/10 to-transparent border border-rose-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={14} /> Drift Detected
                </h3>
                <span className="text-2xl font-display font-bold text-white">{score}%</span>
            </div>
            <div className="space-y-3">
                {sources.map((source, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-rose-200/80">
                        <ArrowRight size={12} className="mt-0.5 shrink-0 opacity-50" />
                        {source}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const InsightCard: React.FC<{ title: string; type: 'opportunity' | 'warning' }> = ({ title, type }) => (
    <div className={cn(
        "p-4 rounded-xl border flex items-start gap-3 transition-all hover:-translate-y-1 cursor-pointer",
        type === 'opportunity' ? 'bg-emerald-900/10 border-emerald-500/20 hover:bg-emerald-900/20' : 'bg-amber-900/10 border-amber-500/20 hover:bg-amber-900/20'
    )}>
        <div className={cn("p-1.5 rounded-lg shrink-0", type === 'opportunity' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400')}>
            {type === 'opportunity' ? <Star size={14} /> : <AlertTriangle size={14} />}
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">{title}</p>
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
            <div className="w-16 h-16 border-4 border-forge-cyan border-t-transparent rounded-full animate-spin mb-6" />
            <h2 className="text-xl font-display font-bold text-white">Calibrating Navigation Systems...</h2>
        </div>
    );

    const currentHorizon = data.horizons.find(h => h.level === horizon) || data.horizons[0];

    return (
        <div className="h-full flex bg-[#050508] text-white relative overflow-hidden animate-in fade-in duration-1000 selection:bg-amber-500/30">
            
            {/* Cinematic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[1000px] h-[1000px] bg-indigo-900/10 rounded-full blur-[200px] opacity-40" />
                <div className="absolute bottom-[-10%] right-[10%] w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[200px] opacity-30" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
            </div>

            {/* Main Content */}
            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10 flex flex-col">
                <div className="max-w-7xl mx-auto w-full p-6 md:p-10 pb-32">
                    
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 mb-4 backdrop-blur-md">
                                <Compass size={12} className="text-forge-cyan animate-spin-slow" /> Global Navigation
                            </div>
                            <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight mb-2">Compass</h1>
                            <p className="text-gray-400 text-lg font-light">Orienting the self amidst the chaos.</p>
                        </div>
                        <div className="flex items-center gap-6 hidden md:flex">
                            <div className="text-right">
                                <div className="text-3xl font-bold text-white">{data.alignmentScore}%</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Alignment Score</div>
                            </div>
                            <div className="h-10 w-px bg-white/10" />
                            <div className="text-right">
                                <div className="text-lg font-bold text-forge-cyan">{data.currentPhase}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Current Phase</div>
                            </div>
                        </div>
                    </div>

                    {/* North Star */}
                    <div className="mb-20">
                        <NorthStarWidget northStar={data.northStar} />
                    </div>

                    {/* Horizons Map */}
                    <div className="mb-24">
                        <HorizonTabs horizons={data.horizons} activeLevel={horizon} onChange={setHorizon} />
                        <HorizonContent horizon={currentHorizon} />
                    </div>

                    {/* Strategic Tracks & Alignment */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Target size={14} /> Strategic Tracks
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
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                                    <Flag size={14} /> Next Quarter Directive
                                </h3>
                                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row gap-8 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-forge-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    
                                    <div className="flex-1 relative z-10">
                                        <div className="text-[10px] text-forge-cyan font-mono uppercase tracking-widest mb-3">Focus Themes</div>
                                        <div className="flex gap-2 mb-6">
                                            {data.nextQuarterFocus.themes.map(t => (
                                                <span key={t} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-3">Priority Goals</div>
                                        <ul className="space-y-3">
                                            {data.nextQuarterFocus.goals.map(g => (
                                                <li key={g} className="flex items-center gap-3 text-sm text-white">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-forge-cyan shadow-[0_0_5px_#22D3EE]" /> {g}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex items-center justify-center border-l border-white/5 pl-8 relative z-10">
                                        <button className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2 text-xs uppercase tracking-wider">
                                            <Lock size={14} /> Lock Directive
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            <AlignmentMatrix />
                            <DriftPanel score={data.driftScore} sources={data.driftSources} />
                            
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <TrendingUp size={14} /> AI Insights
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
                        <p className="text-sm text-gray-500 mb-6 font-mono">Trajectory looks solid. Stay the course.</p>
                        <button 
                            onClick={() => setIsRecalibrating(true)}
                            className="text-xs font-bold text-forge-cyan hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto uppercase tracking-widest border border-forge-cyan/20 px-6 py-3 rounded-full hover:bg-forge-cyan/10"
                        >
                            <RefreshCw size={14} className={isRecalibrating ? "animate-spin" : ""} /> Recalibrate Compass
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
