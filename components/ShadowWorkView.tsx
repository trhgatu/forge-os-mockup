
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
    MoveRight,
    Flame
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
    <div className="group perspective-1000 h-80 w-full cursor-pointer">
        <div className="relative w-full h-full transition-all duration-700 group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d' }}>
            
            {/* --- FRONT FACE --- */}
            <div 
                className="absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center text-center overflow-hidden bg-[#050508] border border-violet-500/20 shadow-[0_0_40px_rgba(139,92,246,0.05)]"
                style={{ backfaceVisibility: 'hidden' }}
            >
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-violet-500/10 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 w-24 h-24 rounded-full bg-[#0A0A0F] border border-violet-500/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                    <Shield className="text-violet-400" size={36} strokeWidth={1} />
                </div>
                
                <div className="relative z-10">
                    <h3 className="text-2xl font-display font-bold text-white mb-3 tracking-wide">{mask.name}</h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/5 border border-violet-500/10 text-[10px] text-violet-300 uppercase tracking-widest font-mono">
                        Defense Mechanism
                    </div>
                </div>
                
                <div className="absolute bottom-8 text-[10px] text-gray-600 font-mono flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    REVEAL ORIGIN <ArrowRight size={10} />
                </div>
            </div>
            
            {/* --- BACK FACE --- */}
            <div 
                className="absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center text-center overflow-hidden bg-[#08080C] border border-violet-500/20 shadow-[0_0_50px_rgba(139,92,246,0.1)]"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
                {/* Inner Border Accent */}
                <div className="absolute inset-2 border border-white/5 rounded-xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col gap-8 w-full h-full justify-center">
                    
                    {/* Protecting Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 text-[9px] text-emerald-400/80 uppercase tracking-[0.2em] font-mono">
                            <Lock size={10} /> Protecting
                        </div>
                        <p className="text-xl text-white font-medium leading-relaxed font-display">
                            "{mask.protecting}"
                        </p>
                    </div>
                    
                    <div className="w-8 h-px bg-violet-500/30 mx-auto" />
                    
                    {/* Trigger Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 text-[9px] text-rose-400/80 uppercase tracking-[0.2em] font-mono">
                            <AlertTriangle size={10} /> Trigger
                        </div>
                        <p className="text-sm text-gray-400 font-light leading-relaxed px-4">
                            {mask.triggeredBy}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    </div>
);

const ConflictMap: React.FC<{ conflicts: InnerConflict[] }> = ({ conflicts }) => (
    <div className="space-y-12">
        {conflicts.map((conflict, i) => (
            <div key={conflict.id} className="relative group">
                {/* Connection Line Visual */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-emerald-500/20 via-violet-500/20 to-rose-500/20 transform -translate-y-1/2 z-0" />
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    
                    {/* Desire Node */}
                    <div className="p-6 rounded-2xl bg-[#08080C] border border-emerald-500/20 hover:border-emerald-500/40 transition-colors text-center shadow-lg relative overflow-hidden group/card min-h-[140px] flex flex-col justify-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 opacity-50 group-hover/card:opacity-100 transition-opacity" />
                        <div className="text-[9px] text-emerald-500/70 uppercase tracking-widest mb-3 font-mono">Conscious Desire</div>
                        <div className="text-white font-bold text-lg font-display">{conflict.desire}</div>
                    </div>
                    
                    {/* Tension Core */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-[#030305] border border-white/10 flex items-center justify-center relative shadow-[0_0_40px_rgba(0,0,0,0.8)] z-20">
                            <div className="absolute inset-0 rounded-full border border-violet-500/30 animate-pulse-slow" />
                            <div className="absolute inset-2 rounded-full border border-violet-500/10" />
                            <Activity size={24} className="text-violet-400" />
                        </div>
                        <div className="mt-4 bg-[#0A0A0F] border border-white/5 px-4 py-1.5 rounded-full text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                            Tension: {conflict.tensionLevel * 10}%
                        </div>
                    </div>

                    {/* Fear Node */}
                    <div className="p-6 rounded-2xl bg-[#08080C] border border-rose-500/20 hover:border-rose-500/40 transition-colors text-center shadow-lg relative overflow-hidden group/card min-h-[140px] flex flex-col justify-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-rose-500/50 opacity-50 group-hover/card:opacity-100 transition-opacity" />
                        <div className="text-[9px] text-rose-500/70 uppercase tracking-widest mb-3 font-mono">Unconscious Fear</div>
                        <div className="text-white font-bold text-lg font-display">{conflict.fear}</div>
                    </div>
                </div>
                
                {/* Manifestation Text */}
                <div className="mt-6 text-center">
                    <div className="inline-block px-6 py-3 rounded-full bg-[#0A0A0F] border border-white/5 text-xs text-gray-400 italic">
                        Manifests as: <span className="text-gray-200 not-italic">"{conflict.manifestation}"</span>
                    </div>
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
        <div className="h-[600px] flex flex-col bg-[#050508] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="p-6 flex justify-between items-center bg-[#08080C] border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                        <MessageSquare size={16} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Shadow Dialogue</h3>
                        <div className="text-[10px] text-gray-500 font-mono">Neural Link Established</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-500/80 font-mono">Active</span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                {history.map((msg, i) => (
                    <div key={i} className={cn("flex gap-5 animate-in fade-in slide-in-from-bottom-2", msg.role === 'user' ? 'flex-row-reverse' : '')}>
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-lg",
                            msg.role === 'user' ? 'bg-[#1A1A20] border-white/5 text-gray-300' : 
                            msg.role === 'shadow' ? 'bg-violet-950/20 border-violet-500/20 text-violet-400' : 
                            'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
                        )}>
                            {msg.role === 'user' ? <Eye size={16} /> : msg.role === 'shadow' ? <Ghost size={16} /> : <Sparkles size={16} />}
                        </div>
                        <div className={cn(
                            "max-w-[75%] p-5 rounded-2xl text-sm leading-7 shadow-sm border",
                            msg.role === 'user' ? 'bg-[#1A1A20] border-white/5 text-gray-200 rounded-tr-none' : 
                            msg.role === 'shadow' ? 'bg-violet-900/10 border-violet-500/10 text-violet-100 rounded-tl-none' :
                            'bg-emerald-900/10 border-emerald-500/10 text-emerald-100 rounded-tl-none'
                        )}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-6 bg-[#08080C] border-t border-white/5">
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-4 text-center">Select Query</p>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center">
                    {questions.map((q, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleAsk(q)}
                            className="whitespace-nowrap px-5 py-3 rounded-xl bg-[#121216] hover:bg-[#1A1A20] text-xs text-gray-300 hover:text-white transition-all border border-white/5 hover:border-white/20 shadow-lg hover:-translate-y-0.5"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>
        </div>
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
            }, 2500);
        };
        load();
    }, []);

    if (isScanning) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[#020205] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-[#020205] to-black" />
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-32 h-32 relative mb-10">
                        <div className="absolute inset-0 border-4 border-violet-500/10 rounded-full animate-ping" />
                        <div className="absolute inset-0 border-4 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                        <div className="absolute inset-2 border-2 border-white/5 rounded-full flex items-center justify-center bg-[#020205]">
                            <Eye size={40} className="text-violet-400 animate-pulse" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-widest uppercase mb-2">Shadow Scan</h2>
                    <div className="flex flex-col items-center space-y-2 text-xs font-mono text-gray-500">
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
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-violet-900/5 rounded-full blur-[200px] opacity-40" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-indigo-900/5 rounded-full blur-[150px] opacity-40" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
            </div>

            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10">
                <div className="max-w-6xl mx-auto p-6 md:p-12 pb-32">
                    
                    {/* Header Ritual */}
                    <div className="text-center mb-20 pt-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F0F13] text-[10px] font-mono text-violet-300 mb-6 border border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                            <Ghost size={12} /> Subconscious Mapping
                        </div>
                        <h1 className="text-6xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                            Shadow Work
                        </h1>
                        <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                            "Until you make the unconscious conscious, it will direct your life and you will call it fate."
                        </p>
                    </div>

                    {/* 1. Primary Shadow */}
                    <div className="mb-24 relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent blur-3xl rounded-full opacity-20 pointer-events-none" />
                        <GlassCard className="bg-[#050508]/80 border-violet-500/20 p-8 md:p-12 relative overflow-hidden" noPadding>
                            <div className="relative z-10 text-center">
                                <div className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4">Primary Shadow Identified</div>
                                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                                    {data.primaryShadow}
                                </h2>
                                <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed font-light">
                                    This aspect of yourself thrives in the unsaid. It generates a Tension Score of <span className="text-violet-300 font-bold">{data.tensionScore}%</span> when active.
                                </p>
                            </div>
                        </GlassCard>
                    </div>

                    {/* 2. Protective Masks */}
                    <div className="mb-24">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3 justify-center">
                            <Shield size={16} /> Protective Masks
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {data.masks.map((mask) => (
                                <ShadowMaskCard key={mask.id} mask={mask} />
                            ))}
                        </div>
                    </div>

                    {/* 3. Internal Conflicts */}
                    <div className="mb-24">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3 justify-center">
                            <Zap size={16} /> Neural Conflicts
                        </h3>
                        <ConflictMap conflicts={data.conflicts} />
                    </div>

                    {/* 4. Dialogue Interface */}
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-3 justify-center">
                            <MessageSquare size={16} /> Integration Dialogue
                        </h3>
                        <ShadowDialogue />
                    </div>

                </div>
            </div>
        </div>
    );
};
