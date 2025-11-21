
import React, { useState, useEffect } from 'react';
import { Zap, Brain, Activity, Battery, Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { EnergyMetrics, EnergyZone, EnergyInfluence, EnergyAnalysis } from '../types';
import { analyzeEnergyLevels } from '../services/geminiService';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from '../lib/utils';

const ZONE_CONFIG: Record<EnergyZone, { color: string, bg: string, gradient: string }> = {
    Recovery: { color: 'text-purple-400', bg: 'bg-purple-500', gradient: 'from-purple-500 to-indigo-600' },
    Low: { color: 'text-slate-400', bg: 'bg-slate-500', gradient: 'from-slate-600 to-gray-700' },
    Calm: { color: 'text-blue-400', bg: 'bg-blue-500', gradient: 'from-blue-500 to-cyan-500' },
    Flow: { color: 'text-cyan-400', bg: 'bg-cyan-500', gradient: 'from-cyan-400 to-teal-400' },
    Peak: { color: 'text-emerald-400', bg: 'bg-emerald-500', gradient: 'from-emerald-400 to-green-300' },
};

const INITIAL_METRICS: EnergyMetrics = { mind: 75, body: 60, emotion: 85, focus: 90 };
const GRAPH_DATA = Array.from({ length: 24 }, (_, i) => {
    const circadian = Math.sin((i - 6) / 24 * 2 * Math.PI) * 30 + 50; 
    const ultradian = Math.sin(i * 1.5) * 10;
    return { time: `${i}:00`, value: Math.round(Math.max(10, Math.min(100, circadian + ultradian))) };
});

const MetricBar: React.FC<{ label: string; value: number; icon: React.ElementType; color: string }> = ({ label, value, icon: Icon, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
            <span className={cn("flex items-center gap-2 text-gray-300")}>
                <Icon size={14} className={color} /> {label}
            </span>
            <span className="font-mono text-gray-500">{value}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]", color.replace('text-', 'bg-'))} style={{ width: `${value}%` }} />
        </div>
    </div>
);

const ZoneCard: React.FC<{ zone: EnergyZone }> = ({ zone }) => {
    const config = ZONE_CONFIG[zone];
    return (
        <div className={cn("relative overflow-hidden p-6 rounded-2xl border border-white/10 bg-gradient-to-br bg-opacity-10", config.gradient)}>
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
            <div className="relative z-10 flex justify-between items-center">
                <div><div className="text-[10px] text-white/60 font-mono uppercase tracking-widest mb-1">Current Zone</div><h2 className="text-3xl font-display font-bold text-white mb-2">{zone}</h2><p className="text-xs text-white/80">Ideal for creative synthesis and deep work.</p></div>
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-xl animate-float"><Zap size={24} className="text-white fill-white" /></div>
            </div>
        </div>
    );
};

export const EnergyView: React.FC = () => {
    const [metrics, setMetrics] = useState<EnergyMetrics>(INITIAL_METRICS);
    const [analysis, setAnalysis] = useState<EnergyAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => { handleAnalyze(); }, []);
    const handleAnalyze = async () => { setIsAnalyzing(true); try { const result = await analyzeEnergyLevels(metrics); setAnalysis(result); } catch (e) { console.error(e); } finally { setIsAnalyzing(false); } };

    return (
        <div className="h-full flex bg-forge-bg text-white relative overflow-hidden animate-in fade-in duration-700">
            <div className="flex-1 h-full overflow-y-auto scrollbar-hide">
                <div className="p-8 pb-24 max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
                        <div className="flex-1 w-full space-y-6">
                            <div><h1 className="text-3xl font-display font-bold text-white mb-2">Energy Landscape</h1><p className="text-sm text-gray-500">Real-time bio-rhythm monitoring active.</p></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <MetricBar label="Mental Clarity" value={metrics.mind} icon={Brain} color="text-purple-400" />
                                <MetricBar label="Physical Readiness" value={metrics.body} icon={Activity} color="text-emerald-400" />
                                <MetricBar label="Emotional Stability" value={metrics.emotion} icon={Battery} color="text-blue-400" />
                                <MetricBar label="Focus Bandwidth" value={metrics.focus} icon={Zap} color="text-yellow-400" />
                            </div>
                        </div>
                    </div>
                    <div className="mb-8">
                        <GlassCard className="h-[300px] relative overflow-hidden" noPadding>
                            <div className="w-full h-full pt-12 pr-4 pb-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={GRAPH_DATA}><defs><linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4}/><stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} strokeDasharray="3 3" /><XAxis dataKey="time" stroke="#555" fontSize={10} tickLine={false} axisLine={false} interval={3} /><Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} /><ReferenceLine x={`${new Date().getHours()}:00`} stroke="#fff" strokeDasharray="3 3" /><Area type="monotone" dataKey="value" stroke="#22D3EE" strokeWidth={3} fill="url(#colorCurve)" /></AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">{analysis && <ZoneCard zone={analysis.currentZone} />}</div>
                        <div className="h-full border-l border-white/5 pl-6 ml-2"><div className="flex items-center justify-between mb-6"><h3 className="text-xs text-gray-500 font-mono uppercase tracking-widest">System Forecast</h3><button onClick={handleAnalyze} disabled={isAnalyzing} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"><Sparkles size={14} className={isAnalyzing ? 'animate-spin' : ''} /></button></div>{analysis && (<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700"><div className="p-5 rounded-xl bg-gradient-to-br from-forge-accent/10 to-transparent border border-forge-accent/20 relative overflow-hidden"><div className="relative z-10"><div className="flex items-center gap-2 text-xs font-bold text-forge-accent uppercase tracking-widest mb-3"><Brain size={12} /> Neural Forecast</div><p className="text-sm text-white leading-relaxed mb-4">"{analysis.forecast}"</p></div></div></div>)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
