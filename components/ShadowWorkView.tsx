
import React, { useState, useEffect } from 'react';
import { 
    Ghost, 
    Eye, 
    Shield, 
    X, 
    ArrowRight, 
    Sparkles, 
    AlertTriangle, 
    Activity, 
    Zap, 
    Heart, 
    MessageSquare, 
    CheckCircle2, 
    Lock,
    Minimize2,
    RefreshCw,
    MoveRight
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ShadowAnalysis, ShadowMask, InnerConflict } from '../types';
import { generateShadowAnalysis } from '../services/geminiService';
import { cn } from '../lib/utils';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    Tooltip, 
    CartesianGrid 
} from 'recharts';

// --- SUB-COMPONENTS ---

const ShadowMaskCard: React.FC<{ mask: ShadowMask }> = ({ mask }) => (
    <div className="group perspective-1000 h-48 w-full cursor-pointer">
        <div className="relative w-full h-full transition-all duration-700 transform style-preserve-3d group-hover:rotate-y-180">
            {/* Front */}
            <div className="absolute inset-0 bg-white/[0.02] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center backface-hidden">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                    <Shield className="text-white/60" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{mask.name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Defense Mechanism</p>
            </div>
            
            {/* Back */}
            <div className="absolute inset-0 bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180">
                <div className="text-[10px] text-indigo-300 uppercase tracking-widest mb-2">Protecting</div>
                <p className="text-white font-medium mb-4">"{mask.protecting}"</p>
                <div className="text-[10px] text-gray-400">
                    Triggered by: {mask.triggeredBy}
                </div>
            </div>
        </div>
    </div>
);

const ConflictMap: React.FC<{ conflicts: InnerConflict[] }> = ({ conflicts }) => (
    <div className="space-y-8">
        {conflicts.map((conflict, i) => (
            <div key={conflict.id} className="relative p-6 rounded-2xl bg-black/40 border border-white/5 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Activity className="w-full h-full text-violet-500/20 animate-pulse-slow" />
                </div>
                <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex-1 text-center p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Conscious Desire</div>
                        <div className="text-emerald-400 font-bold">{conflict.desire}</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <div className="text-xs font-mono text-violet-400 mb-1">Tension {conflict.tensionLevel}/10</div>
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 via-violet-500 to-rose-500 rounded-full" />
                        <div className="w-0.5 h-8 bg-white/10 my-1" />
                        <AlertTriangle size={16} className="text-violet-400" />
                    </div>

                    <div className="flex-1 text-center p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Unconscious Fear</div>
                        <div className="text-rose-400 font-bold">{conflict.fear}</div>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <span className="text-xs text-gray-400 italic">Manifests as: "{conflict.manifestation}"</span>
                </div>
            </div>
        ))}
    </div>
);

const ShadowDialogue: React.FC = () => {
    const [step, setStep] = useState(0);
    const [history, setHistory] = useState<{role: 'user'|'shadow'|'guide', text: string}[]>([
        { role: 'guide', text: "The Shadow is not your enemy. It is the part of you that wants to be seen. What would you like to ask it?" }
    ]);

    const questions = [
        "What are you trying to protect me from?",
        "What do you need that I am ignoring?",
        "When did you first appear in my life?"
    ];

    const handleAsk = (q: string) => {
        const newHistory = [...history, { role: 'user' as const, text: q }];
        setHistory(newHistory);
        setStep(step + 1);
        
        // Simulated response
        setTimeout(() => {
            const responses = [
                "I protect you from the pain of rejection. If you don't try, you can't fail.",
                "I need rest. You push so hard because you think your worth is your output.",
                "I appeared when you were told that being quiet was 'good'."
            ];
            setHistory(prev => [...prev, { role: 'shadow' as const, text: responses[step % 3] }]);
        }, 1000);
    };

    return (
        <GlassCard className="h-[500px] flex flex-col bg-black/40" noPadding>
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare size={14} /> Shadow Dialogue
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                    Connection Active
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {history.map((msg, i) => (
                    <div key={i} className={cn("flex gap-4", msg.role === 'user' ? 'flex-row-reverse' : '')}>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === 'user' ? 'bg-white/10' : msg.role === 'shadow' ? 'bg-violet-900/30 text-violet-400' : 'bg-emerald-900/30 text-emerald-400'
                        )}>
                            {msg.role === 'user' ? <Eye size={14} /> : msg.role === 'shadow' ? <Ghost size={14} /> : <Sparkles size={14} />}
                        </div>
                        <div className={cn(
                            "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                            msg.role === 'user' ? 'bg-white/10 text-white rounded-tr-none' : 
                            msg.role === 'shadow' ? 'bg-violet-900/10 border border-violet-500/20 text-violet-100 rounded-tl-none' :
                            'bg-emerald-900/10 border border-emerald-500/20 text-emerald-100 rounded-tl-none'
                        )}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {questions.map((q, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleAsk(q)}
                            className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-gray-300 transition-all"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
};

// --- MAIN COMPONENT ---

export const ShadowWorkView: React.FC = () => {
    const [data, setData] = useState<ShadowAnalysis | null>(null);
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        const load = async () => {
            // Artificial delay for "scanning" effect
            setTimeout(async () => {
                const result = await generateShadowAnalysis();
                setData(result);
                setIsScanning(false);
            }, 3000);
        };
        load();
    }, []);

    if (isScanning) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#020205] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-[#020205] to-black" />
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 relative mb-8">
                        <div className="absolute inset-0 border-4 border-violet-500/30 rounded-full animate-ping" />
                        <div className="absolute inset-0 border-4 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                        <div className="absolute inset-2 border-2 border-white/10 rounded-full flex items-center justify-center bg-[#020205]">
                            <Eye size={32} className="text-violet-400 animate-pulse" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white tracking-widest uppercase">Shadow Scan</h2>
                    <div className="flex flex-col items-center mt-4 space-y-2 text-xs font-mono text-gray-500">
                        <span className="animate-fade-in delay-75">Analyzing Journal Anomalies...</span>
                        <span className="animate-fade-in delay-150">Detecting Avoidance Patterns...</span>
                        <span className="animate-fade-in delay-300">Mapping Subconscious Tensions...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="h-full flex bg-[#020205] text-white relative overflow-hidden animate-in fade-in duration-1000 selection:bg-violet-500/30">
            
            {/* Atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-violet-900/10 rounded-full blur-[150px] opacity-40" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-indigo-900/10 rounded-full blur-[150px] opacity-40" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10">
                <div className="max-w-5xl mx-auto p-8 md:p-12 pb-40">
                    
                    {/* Header Ritual */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-violet-300 mb-6">
                            <Ghost size={12} /> Inner Sanctum
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-violet-100 to-gray-500 mb-4 tracking-tight">
                            Shadow Chamber
                        </h1>
                        <p className="text-lg text-gray-400 font-light max-w-xl mx-auto">
                            Here, the hidden becomes visible. Face your patterns to transcend them.
                        </p>
                    </div>

                    {/* 1. Shadow Mirror (Primary Scan) */}
                    <div className="mb-24">
                        <div className="relative p-1 rounded-3xl bg-gradient-to-b from-violet-500/20 to-transparent">
                            <GlassCard className="bg-black/60 backdrop-blur-xl p-12 text-center relative overflow-hidden" noPadding>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-6">Primary Shadow Detected</div>
                                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                                        "{data.primaryShadow}"
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="text-xs text-gray-500 uppercase mb-1">Tension Score</div>
                                            <div className="text-2xl font-bold text-white">{data.tensionScore}/100</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="text-xs text-gray-500 uppercase mb-1">Avoidance Index</div>
                                            <div className="text-2xl font-bold text-white">{data.avoidanceIndex}/100</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="text-xs text-gray-500 uppercase mb-1">Supporting Shadows</div>
                                            <div className="text-sm text-gray-300">{data.supportingShadows.join(", ")}</div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>

                    {/* 2. Behavior Masks */}
                    <div className="mb-24">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Shield size={16} /> Protective Masks
                            </h3>
                            <p className="text-xs text-gray-600">How the shadow hides in plain sight.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.masks.map(mask => (
                                <ShadowMaskCard key={mask.id} mask={mask} />
                            ))}
                        </div>
                    </div>

                    {/* 3. Shadow Timeline */}
                    <div className="mb-24">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Activity size={16} /> Temporal Manifestation
                        </h3>
                        <GlassCard className="h-64 w-full p-6 bg-black/40" noPadding>
                            <div className="w-full h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.shadowTimeline}>
                                        <defs>
                                            <linearGradient id="shadowColor" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="intensity" stroke="#8B5CF6" fill="url(#shadowColor)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>
                    </div>

                    {/* 4. Inner Conflict Map */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2 border-l-2 border-rose-500 pl-3">
                                The Conflict Engine
                            </h3>
                            <ConflictMap conflicts={data.conflicts} />
                            
                            <div className="mt-12">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2 border-l-2 border-amber-500 pl-3">
                                    Limiting Beliefs
                                </h3>
                                <div className="space-y-4">
                                    {data.limitingBeliefs.map(belief => (
                                        <div key={belief.id} className="p-4 rounded-xl bg-amber-900/5 border border-amber-500/10 hover:bg-amber-900/10 transition-colors cursor-pointer">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="text-xs font-mono text-amber-500/70">Intensity: {belief.intensity}/10</div>
                                                <Lock size={12} className="text-amber-500/50" />
                                            </div>
                                            <div className="text-white font-medium mb-2">"{belief.statement}"</div>
                                            <div className="text-xs text-gray-500">
                                                Consequences: {belief.consequences.join(", ")}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* 5. Dialogue Interface */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2 border-l-2 border-violet-500 pl-3">
                                Confrontation Ritual
                            </h3>
                            <ShadowDialogue />
                            
                            {/* Transmutation Path */}
                            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-violet-900/20 to-emerald-900/20 border border-white/5">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                                    <RefreshCw size={14} /> Transmutation Path
                                </div>
                                <div className="flex items-center justify-between text-center">
                                    <div>
                                        <div className="text-xs text-rose-400 mb-1">Shadow</div>
                                        <div className="text-lg font-bold text-white">{data.transmutation.shadow}</div>
                                    </div>
                                    <MoveRight className="text-gray-600" />
                                    <div>
                                        <div className="text-xs text-emerald-400 mb-1">Gift</div>
                                        <div className="text-lg font-bold text-white">{data.transmutation.gift}</div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-400 italic">"{data.transmutation.path}"</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 6. Integration Steps */}
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-display font-bold text-white">Integration Protocol</h2>
                            <p className="text-sm text-gray-500 mt-2">Actionable steps to reclaim lost power.</p>
                        </div>
                        <div className="space-y-4">
                            {data.integrationSteps.map((step, i) => (
                                <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <p className="text-gray-200 leading-relaxed">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
