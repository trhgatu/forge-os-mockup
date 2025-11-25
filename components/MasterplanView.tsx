
import React, { useState, useEffect } from 'react';
import { 
    Globe, 
    Hexagon, 
    Heart, 
    Brain, 
    Briefcase, 
    Users, 
    Zap, 
    Feather, 
    Sparkles, 
    Maximize2, 
    ChevronRight, 
    Activity, 
    Orbit, 
    Crosshair, 
    Rocket, 
    Lock,
    RefreshCw,
    Target,
    Share2,
    Layers,
    Plus,
    Calendar,
    CheckCircle2
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { MasterplanData, LifePillar, Epoch, GrandProject } from '../types';
import { generateMasterplanAnalysis } from '../services/geminiService';
import { cn } from '../lib/utils';

// --- PILLAR ICONS ---
const PILLAR_CONFIG: Record<string, { color: string, icon: React.ElementType, orbit: string }> = {
    'Body & Health': { color: 'text-emerald-400', icon: Heart, orbit: 'animate-[spin_20s_linear_infinite]' },
    'Mind & Learning': { color: 'text-blue-400', icon: Brain, orbit: 'animate-[spin_25s_linear_infinite_reverse]' },
    'Work & Craft': { color: 'text-fuchsia-400', icon: Briefcase, orbit: 'animate-[spin_30s_linear_infinite]' },
    'Relationships': { color: 'text-rose-400', icon: Users, orbit: 'animate-[spin_35s_linear_infinite_reverse]' },
    'Wealth & Systems': { color: 'text-amber-400', icon: Zap, orbit: 'animate-[spin_40s_linear_infinite]' },
    'Spirit & Expression': { color: 'text-violet-400', icon: Feather, orbit: 'animate-[spin_45s_linear_infinite_reverse]' },
};

// --- SUB-COMPONENTS ---

const EpochBanner: React.FC<{ epoch: Epoch }> = ({ epoch }) => (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 mb-16 group">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-transparent to-cyan-900/20 opacity-60 group-hover:opacity-80 transition-opacity duration-1000" />
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="flex-1">
                <div className="flex items-center gap-3 text-xs font-mono text-forge-cyan uppercase tracking-[0.2em] mb-4">
                    <Orbit size={14} className="animate-spin-slow" /> {epoch.title}
                </div>
                <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    {epoch.name}
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                    {epoch.description}
                </p>
            </div>
            <div className="text-right">
                <div className="text-3xl font-bold text-white mb-1">{epoch.years}</div>
                <div className="text-xs text-gray-500 font-mono uppercase tracking-widest">Timeline Horizon</div>
                <div className="mt-4 flex gap-2 justify-end">
                    {epoch.objectives.map((obj, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-300 backdrop-blur-md">
                            {obj}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const VisionMonolith: React.FC<{ statement: string }> = ({ statement }) => (
    <div className="mb-24 flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-forge-accent mb-6" />
        <div className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent w-full">
            <GlassCard className="bg-black/60 backdrop-blur-xl p-12" noPadding>
                <div className="mb-6 text-forge-accent">
                    <Sparkles size={24} className="mx-auto animate-pulse-slow" />
                </div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.4em] mb-8">Life Vision • 30 Year Horizon</h2>
                <div className="relative group">
                    <textarea 
                        defaultValue={statement}
                        className="w-full bg-transparent border-none text-xl md:text-2xl lg:text-3xl font-light text-white text-center leading-relaxed focus:ring-0 resize-none scrollbar-hide font-display"
                        rows={4}
                    />
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-600 font-mono flex items-center gap-1">
                        <Maximize2 size={10} /> Edit Vision
                    </div>
                </div>
            </GlassCard>
        </div>
        <div className="w-px h-16 bg-gradient-to-b from-forge-accent to-transparent mt-6" />
    </div>
);

const PillarOrbit: React.FC<{ pillars: LifePillar[] }> = ({ pillars }) => {
    const [activePillar, setActivePillar] = useState<string | null>(null);

    return (
        <div className="relative h-[600px] w-full flex items-center justify-center mb-24 overflow-hidden">
            {/* Orbit Rings */}
            {[1, 2, 3].map((i) => (
                <div 
                    key={i} 
                    className="absolute rounded-full border border-white/5" 
                    style={{ width: `${i * 30}%`, height: `${i * 30}%` }} 
                />
            ))}

            {/* Central Core */}
            <div className="relative z-20 w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-pulse-slow">
                <div className="text-center">
                    <Hexagon size={32} className="text-black mx-auto mb-1" />
                    <div className="text-[10px] font-bold text-black uppercase tracking-widest">Core</div>
                </div>
            </div>

            {/* Orbiting Pillars */}
            {pillars.map((pillar, i) => {
                const config = PILLAR_CONFIG[pillar.name] || { color: 'text-white', icon: Hexagon, orbit: '' };
                const angle = (i / pillars.length) * 360;
                const radius = 250; // px
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                    <div 
                        key={pillar.id}
                        className="absolute z-20 transition-all duration-500 group"
                        style={{ 
                            transform: `translate(${x}px, ${y}px)`,
                            // In a real dynamic orbit, we'd use CSS keyframes or requestAnimationFrame
                        }}
                        onMouseEnter={() => setActivePillar(pillar.id)}
                        onMouseLeave={() => setActivePillar(null)}
                    >
                        <div className={cn(
                            "relative w-16 h-16 rounded-full bg-[#0B0B15] border border-white/10 flex items-center justify-center cursor-pointer hover:scale-110 hover:border-white/40 transition-all shadow-lg",
                            config.color
                        )}>
                            <config.icon size={24} />
                            {activePillar === pillar.id && (
                                <div className="absolute top-full mt-4 w-48 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center z-30 animate-in fade-in slide-in-from-top-2">
                                    <div className="text-xs font-bold text-white uppercase mb-1">{pillar.name}</div>
                                    <div className="text-[10px] text-gray-400 mb-2">{pillar.purpose}</div>
                                    <div className="text-xs font-mono text-forge-cyan">{pillar.metric}</div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ProjectCard: React.FC<{ project: GrandProject }> = ({ project }) => (
    <div className="group relative h-full p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity text-forge-cyan">
            <Rocket size={24} />
        </div>
        
        <div className="mb-6">
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                <Calendar size={12} /> {project.horizon}
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">{project.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{project.vision}</p>
        </div>

        <div className="space-y-4">
            <div>
                <div className="flex justify-between text-[10px] text-gray-500 uppercase mb-1">
                    <span>Completion</span>
                    <span>{project.progress}%</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-forge-accent to-forge-cyan" style={{ width: `${project.progress}%` }} />
                </div>
            </div>

            <div className="space-y-2 pt-2">
                {project.milestones.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 text-sm">
                        <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center transition-colors", m.done ? 'bg-green-500 border-green-500 text-black' : 'border-white/20 text-transparent')}>
                            <CheckCircle2 size={10} />
                        </div>
                        <span className={cn("transition-colors", m.done ? 'text-gray-500 line-through' : 'text-gray-300')}>{m.title}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const SystemNode: React.FC<{ label: string; type: 'core' | 'sub' | 'leaf'; x: number; y: number }> = ({ label, type, x, y }) => {
    const size = type === 'core' ? 16 : type === 'sub' ? 12 : 8;
    const color = type === 'core' ? 'bg-white' : type === 'sub' ? 'bg-forge-cyan' : 'bg-gray-500';
    
    return (
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group" style={{ left: `${x}%`, top: `${y}%` }}>
            <div className={cn("rounded-full shadow-[0_0_15px_currentColor]", color, `w-${size/4} h-${size/4}`)} style={{ width: size, height: size }} />
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10 whitespace-nowrap">
                {label}
            </div>
        </div>
    );
};

const SystemMap: React.FC = () => (
    <div className="relative w-full h-[500px] rounded-3xl bg-[#050508] border border-white/5 overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 to-transparent opacity-50" />
        
        {/* Connecting Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="50%" y1="50%" x2="30%" y2="30%" stroke="white" strokeOpacity="0.1" />
            <line x1="50%" y1="50%" x2="70%" y2="30%" stroke="white" strokeOpacity="0.1" />
            <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="white" strokeOpacity="0.1" />
            <line x1="30%" y1="30%" x2="20%" y2="20%" stroke="white" strokeOpacity="0.05" />
            <line x1="30%" y1="30%" x2="40%" y2="20%" stroke="white" strokeOpacity="0.05" />
        </svg>

        {/* Nodes */}
        <SystemNode label="Master Vision" type="core" x={50} y={50} />
        <SystemNode label="Mind Pillar" type="sub" x={30} y={30} />
        <SystemNode label="Work Pillar" type="sub" x={70} y={30} />
        <SystemNode label="Body Pillar" type="sub" x={50} y={80} />
        <SystemNode label="Deep Work Habit" type="leaf" x={20} y={20} />
        <SystemNode label="Learning Goal" type="leaf" x={40} y={20} />
        
        <div className="absolute bottom-6 right-6 flex items-center gap-2 text-xs font-mono text-gray-600">
            <Share2 size={14} /> System Topology
        </div>
    </div>
);

const AuditCard: React.FC<{ result: MasterplanData['auditResult'] }> = ({ result }) => (
    <GlassCard className="bg-gradient-to-br from-white/5 to-transparent border-white/10" noPadding>
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Activity size={16} className="text-forge-accent" /> Neural Audit
                </h3>
                <div className="text-xs text-gray-500 font-mono">Confidence: 94%</div>
            </div>
            
            <div className="space-y-6">
                <div>
                    <div className="text-xs text-gray-500 uppercase mb-2">Critical Insights</div>
                    <ul className="space-y-2">
                        {result.insights.map((insight, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-200">
                                <ChevronRight size={14} className="mt-1 text-forge-cyan shrink-0" />
                                {insight}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Strongest Pillar</div>
                        <div className="text-emerald-400 font-bold">{result.strongestPillar}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Weakest Pillar</div>
                        <div className="text-rose-400 font-bold">{result.weakestPillar}</div>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-900/10 border border-amber-500/20">
                    <div className="text-[10px] text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Target size={12} /> Primary Risk Factor
                    </div>
                    <p className="text-sm text-amber-100/80 italic">"{result.riskFactor}"</p>
                </div>
            </div>
        </div>
    </GlassCard>
);

// --- MAIN VIEW ---

export const MasterplanView: React.FC = () => {
    const [data, setData] = useState<MasterplanData | null>(null);
    const [activeHorizon, setActiveHorizon] = useState('H3'); // H10, H5, H3, H1
    const [isAuditing, setIsAuditing] = useState(false);

    useEffect(() => {
        const load = async () => {
            setTimeout(async () => {
                const result = await generateMasterplanAnalysis();
                setData(result);
            }, 1500);
        };
        load();
    }, []);

    if (!data) return (
        <div className="h-full flex flex-col items-center justify-center bg-[#020204] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020204] to-black" />
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 relative mb-8">
                    <div className="absolute inset-0 border-2 border-white/10 rounded-full animate-ping opacity-30" />
                    <div className="absolute inset-0 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                    <Globe size={32} className="absolute inset-0 m-auto text-white opacity-80" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white tracking-[0.3em] uppercase">Architecting Reality</h2>
                <p className="text-xs font-mono text-gray-500 mt-4">Loading Universal Blueprint...</p>
            </div>
        </div>
    );

    return (
        <div className="h-full flex bg-[#020204] text-white relative overflow-hidden animate-in fade-in duration-1000 selection:bg-white/20">
            
            {/* Deep Space Parallax */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-indigo-950/30 via-transparent to-transparent" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[1200px] h-[1200px] bg-purple-900/10 rounded-full blur-[200px]" />
                <div className="absolute top-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-cyan-900/10 rounded-full blur-[150px]" />
                
                {/* Stars */}
                {[...Array(100)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: Math.random() > 0.9 ? '2px' : '1px',
                            height: Math.random() > 0.9 ? '2px' : '1px',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.1,
                            animation: `pulse ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10">
                <div className="max-w-7xl mx-auto p-6 md:p-10 pb-32">
                    
                    {/* Header Info */}
                    <div className="flex justify-between items-center mb-8 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-widest">
                            <Globe size={14} /> Masterplan v1.0
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                            <span className="flex items-center gap-1"><Crosshair size={12} /> Score: {data.alignmentScore}</span>
                            <span className="w-px h-3 bg-white/20" />
                            <span className="flex items-center gap-1 text-forge-cyan"><Activity size={12} /> System Optimal</span>
                        </div>
                    </div>

                    {/* Epoch Banner */}
                    <EpochBanner epoch={data.currentEpoch} />

                    {/* Life Vision */}
                    <VisionMonolith statement={data.visionStatement} />

                    {/* Pillars Orbit */}
                    <div className="mb-32">
                        <div className="text-center mb-12">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-4">The 6 Pillars</h3>
                            <h2 className="text-3xl font-display font-bold text-white">Foundational Architecture</h2>
                        </div>
                        <PillarOrbit pillars={data.pillars} />
                    </div>

                    {/* Grand Projects */}
                    <div className="mb-32">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-2">Grand Projects</h3>
                                <h2 className="text-3xl font-display font-bold text-white">The Great Work</h2>
                            </div>
                            <div className="flex gap-2">
                                {['H10', 'H5', 'H3', 'H1'].map(h => (
                                    <button 
                                        key={h} 
                                        onClick={() => setActiveHorizon(h)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all",
                                            activeHorizon === h ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'
                                        )}
                                    >
                                        {h}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[400px]">
                            {data.grandProjects.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                            <div className="border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-600 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer">
                                <Plus size={32} className="mb-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Initiate Project</span>
                            </div>
                        </div>
                    </div>

                    {/* Systems Map & Audit */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32">
                        <div className="lg:col-span-2">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                                <Layers size={16} /> System Topology
                            </h3>
                            <SystemMap />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em]">AI Audit</h3>
                                <button onClick={() => setIsAuditing(!isAuditing)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                    <RefreshCw size={14} />
                                </button>
                            </div>
                            <AuditCard result={data.auditResult} />
                        </div>
                    </div>

                    {/* Footer Ritual */}
                    <div className="text-center pt-20 border-t border-white/5">
                        <p className="text-lg text-gray-400 font-light mb-8 italic">
                            "The unexamined life is not worth living, but the unlived life is not worth examining."
                        </p>
                        <button className="group relative px-12 py-6 rounded-full bg-white text-black font-bold text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            <span className="flex items-center gap-3 relative z-10">
                                <Lock size={20} /> Commit to Masterplan
                            </span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
