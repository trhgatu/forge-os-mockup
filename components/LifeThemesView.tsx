
import React, { useState, useEffect } from 'react';
import { 
    Map, 
    Sparkles, 
    Activity, 
    Compass, 
    Feather, 
    Crown, 
    Anchor, 
    Flame, 
    Zap, 
    GitBranch, 
    GitCommit, 
    Search, 
    ArrowRight,
    RefreshCw,
    BookOpen,
    AlertTriangle
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { LifeThemeAnalysis, LifeTheme, ThemeConflict } from '../types';
import { generateLifeThemesAnalysis } from '../services/geminiService';
import { cn } from '../lib/utils';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    Tooltip,
    YAxis,
    CartesianGrid
} from 'recharts';

// --- ICONS MAPPING ---
const ARCHETYPE_ICONS = {
    crown: Crown,
    sword: Zap, // using Zap as Sword for now
    compass: Compass,
    feather: Feather,
    anchor: Anchor,
    flame: Flame
};

// --- SUB-COMPONENTS ---

const ThematicAtlas: React.FC<{ themes: LifeTheme[] }> = ({ themes }) => {
    // Mock positions for a constellation effect
    const nodes = themes.map((theme, i) => ({
        ...theme,
        x: 20 + (i * 25) + Math.sin(i * 2) * 10,
        y: 50 + Math.cos(i * 3) * 20,
        size: theme.strength / 2
    }));

    return (
        <div className="w-full h-[500px] relative overflow-hidden rounded-3xl bg-[#050508] border border-white/5 group">
            {/* Cinematic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0B0B15] to-black opacity-60" />
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }} />
            
            {/* Drifting Particles/Ink effect via simple CSS animation could go here */}
            
            {/* Constellation Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {nodes.map((n1, i) => (
                    nodes.slice(i + 1).map((n2, j) => (
                        // Draw line if themes are related (mock logic: close IDs or strength)
                        <line 
                            key={`${n1.id}-${n2.id}`}
                            x1={`${n1.x}%`} y1={`${n1.y}%`}
                            x2={`${n2.x}%`} y2={`${n2.y}%`}
                            stroke="white"
                            strokeOpacity={0.05}
                            strokeWidth={1}
                        />
                    ))
                ))}
            </svg>

            {/* Theme Nodes */}
            {nodes.map((node) => {
                const Icon = ARCHETYPE_ICONS[node.archetypeIcon] || Sparkles;
                return (
                    <div 
                        key={node.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group/node cursor-pointer"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                        {/* Pulsing Glow */}
                        <div 
                            className="absolute inset-0 -m-8 rounded-full blur-2xl opacity-0 group-hover/node:opacity-40 transition-opacity duration-700"
                            style={{ backgroundColor: node.colorSignature }}
                        />
                        
                        {/* Core Node */}
                        <div 
                            className={cn(
                                "rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md transition-all duration-500 ease-out hover:scale-110",
                                node.status === 'dominant' ? 'bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'bg-black/40'
                            )}
                            style={{ 
                                width: Math.max(60, node.size * 1.5), 
                                height: Math.max(60, node.size * 1.5),
                                borderColor: node.colorSignature
                            }}
                        >
                            <Icon size={20} className="text-white/80" />
                        </div>

                        {/* Label */}
                        <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                            <div className="text-xs font-display font-bold text-white tracking-wide whitespace-nowrap px-3 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm">
                                {node.title}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover/node:opacity-100 transition-opacity">
                                {node.status}
                            </div>
                        </div>
                    </div>
                );
            })}
            
            <div className="absolute bottom-6 left-6 flex items-center gap-2 text-xs font-mono text-gray-500">
                <Activity size={14} /> Thematic Constellation Map
            </div>
        </div>
    );
};

const ThemeCard: React.FC<{ theme: LifeTheme }> = ({ theme }) => {
    const Icon = ARCHETYPE_ICONS[theme.archetypeIcon] || Sparkles;
    
    return (
        <GlassCard className="group relative overflow-hidden hover:-translate-y-1 transition-all duration-300 border-t-4" style={{ borderTopColor: theme.colorSignature }} noPadding>
            {/* Background Gradient */}
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
                style={{ background: `linear-gradient(to bottom right, ${theme.colorSignature}, transparent)` }}
            />
            
            <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <Icon size={20} style={{ color: theme.colorSignature }} />
                    </div>
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded-full">
                        {theme.strength}% Strength
                    </div>
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-white/90">{theme.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-6">
                    {theme.description}
                </p>

                {/* Emotional Palette */}
                <div className="mb-6">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Emotional Palette</div>
                    <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-white/5">
                        {theme.relatedMoods.map((mood, i) => (
                            <div 
                                key={i}
                                className="flex-1 opacity-80"
                                style={{ backgroundColor: mood === 'focused' ? '#10B981' : mood === 'anxious' ? '#F59E0B' : theme.colorSignature }}
                            />
                        ))}
                    </div>
                </div>

                {/* Evolution Arc */}
                <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 p-3 rounded-lg">
                    <GitBranch size={14} className="text-gray-500" />
                    <span className="font-mono">{theme.evolutionArc}</span>
                </div>
            </div>

            {/* Behaviors Section (Reveal on hover-ish or just list) */}
            <div className="px-6 pb-6 border-t border-white/5 pt-4">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Key Drivers</div>
                <div className="space-y-2">
                    {theme.behaviors.slice(0, 2).map(b => (
                        <div key={b.id} className="flex items-start gap-2 text-xs text-gray-400">
                            <div className="mt-1 w-1 h-1 rounded-full bg-white/20" />
                            {b.description}
                        </div>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
};

const NarrativeTimeline: React.FC<{ data: any[] }> = ({ data }) => (
    <div className="w-full h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="theme1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="theme2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="theme3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FCD34D" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="intensity" stroke="#22D3EE" strokeWidth={2} fill="url(#theme1)" stackId="1" name="The Architect" />
                {/* Mocking multiple streams by reusing data key slightly modified in real app */}
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const ConflictCard: React.FC<{ conflict: ThemeConflict }> = ({ conflict }) => (
    <div className="relative p-6 rounded-2xl bg-gradient-to-r from-rose-900/10 to-transparent border border-rose-500/20 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/50" />
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest">
                <AlertTriangle size={14} /> Tension Detected
            </div>
            <div className="text-xs font-mono text-rose-300/60">Intensity: {conflict.tensionLevel}/10</div>
        </div>
        <h3 className="text-white font-display font-bold text-lg mb-2">{conflict.description}</h3>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <span className="text-xs text-gray-400 italic">{conflict.resolutionHint}</span>
            <button className="text-[10px] bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded border border-white/10 transition-all">
                Resolve
            </button>
        </div>
    </div>
);

const ReflectionPrompt: React.FC<{ prompt: string }> = ({ prompt }) => (
    <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-forge-cyan/30 transition-all cursor-pointer relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-forge-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <BookOpen size={20} className="text-gray-500 mb-4 group-hover:text-forge-cyan transition-colors" />
        <p className="text-gray-200 font-medium leading-relaxed group-hover:text-white transition-colors">
            "{prompt}"
        </p>
        <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
            Write to Journal <ArrowRight size={12} />
        </div>
    </div>
);

export const LifeThemesView: React.FC = () => {
    const [data, setData] = useState<LifeThemeAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const load = async () => {
            setIsAnalyzing(true);
            const result = await generateLifeThemesAnalysis();
            setData(result);
            setIsAnalyzing(false);
        };
        load();
    }, []);

    if (!data) return (
        <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-6" />
            <h2 className="text-xl font-display font-bold text-white">Weaving Narrative Threads...</h2>
            <p className="text-sm text-gray-500 mt-2">Consulting the mythic archives.</p>
        </div>
    );

    return (
        <div className="h-full flex bg-[#020204] text-white relative overflow-hidden animate-in fade-in duration-1000 selection:bg-indigo-500/30">
            
            {/* Cinematic Background Layers */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent opacity-50" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[150px]" />
            </div>

            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10">
                <div className="max-w-7xl mx-auto p-6 md:p-10 pb-32">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 mb-4">
                                <Map size={12} /> Narrative Cartography
                            </div>
                            <h1 className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-gray-400 mb-4 tracking-tight">
                                Life Themes
                            </h1>
                            <p className="text-lg text-gray-400 font-light max-w-2xl">
                                The recurring patterns, archetypes, and stories that shape your existence.
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-right mb-2">
                                <div className="text-4xl font-bold text-white">{data.stabilityScore}%</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Theme Stability</div>
                            </div>
                        </div>
                    </div>

                    {/* AI Summary */}
                    <div className="mb-16 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-cyan-500/5 to-transparent blur-xl" />
                        <div className="relative p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
                            <Sparkles size={24} className="text-forge-cyan mb-4 animate-pulse-slow" />
                            <p className="text-xl md:text-2xl font-light text-white leading-relaxed">
                                "{data.currentSeasonSummary}"
                            </p>
                        </div>
                    </div>

                    {/* 1. Thematic Atlas */}
                    <div className="mb-20">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Compass size={16} /> Thematic Atlas
                        </h3>
                        <ThematicAtlas themes={[...data.dominantThemes, ...data.emergingThemes, ...data.quietThemes]} />
                    </div>

                    {/* 2. Dominant Themes */}
                    <div className="mb-20">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Crown size={16} /> Active Archetypes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.dominantThemes.map(theme => (
                                <ThemeCard key={theme.id} theme={theme} />
                            ))}
                        </div>
                    </div>

                    {/* 3. Narrative River (Timeline) */}
                    <div className="mb-20">
                        <div className="flex justify-between items-end mb-6">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={16} /> Narrative Flow
                            </h3>
                            <div className="flex gap-2 text-[10px] font-mono text-gray-500">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-400" /> Architect</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-violet-500" /> Hermit</span>
                            </div>
                        </div>
                        <GlassCard className="p-6 bg-black/40" noPadding>
                            <NarrativeTimeline data={data.timelineData} />
                        </GlassCard>
                    </div>

                    {/* 4. Tension & Emergence */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                        {/* Conflicts */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2 border-l-2 border-rose-500 pl-2">
                                Internal Tension
                            </h3>
                            <div className="space-y-4">
                                {data.dominantThemes.flatMap(t => t.conflicts || []).map(conflict => (
                                    <ConflictCard key={conflict.id} conflict={conflict} />
                                ))}
                                {data.dominantThemes.every(t => !t.conflicts?.length) && (
                                    <div className="p-6 rounded-xl border border-dashed border-white/10 text-center text-sm text-gray-500">
                                        No active narrative conflicts detected.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Emerging */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2 border-l-2 border-yellow-400 pl-2">
                                Emerging Horizon
                            </h3>
                            <div className="space-y-4">
                                {data.emergingThemes.map(theme => (
                                    <div key={theme.id} className="p-5 rounded-xl bg-yellow-400/5 border border-yellow-400/10 flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-yellow-400/10 text-yellow-400">
                                            <Zap size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-1">{theme.title}</h4>
                                            <p className="text-sm text-gray-400">{theme.description}</p>
                                            <div className="mt-3 text-xs font-mono text-yellow-500/80">
                                                Strength: {theme.strength}% (Rising)
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 5. Quiet Themes */}
                    <div className="mb-20">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Anchor size={16} /> Subconscious Currents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.quietThemes.map(theme => (
                                <div key={theme.id} className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors flex items-center gap-4 opacity-70 hover:opacity-100">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 text-gray-400">
                                        <Feather size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-300">{theme.title}</div>
                                        <div className="text-xs text-gray-500">{theme.evolutionArc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 6. Reflection Prompts */}
                    <div>
                        <div className="text-center mb-10">
                            <Sparkles size={24} className="text-white mx-auto mb-4 opacity-50" />
                            <h2 className="text-2xl font-display font-bold text-white">Deep Reflection</h2>
                            <p className="text-sm text-gray-500 mt-2">Questions generated from your narrative arc.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {data.reflectionPrompts.map((prompt, i) => (
                                <ReflectionPrompt key={i} prompt={prompt} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
