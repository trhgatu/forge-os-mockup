
import React, { useState, useEffect } from 'react';
import { Telescope, Sparkles, Activity, Zap, TrendingUp, BrainCircuit, RefreshCw, ArrowRight } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GlobalAnalysis, TopicCluster, Pattern } from '../types';
import { generateGlobalInsights } from '../services/geminiService';
import { ComposedChart, Area, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

const TopicConstellation: React.FC<{ topics: TopicCluster[] }> = ({ topics }) => {
    return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-black/40 to-transparent rounded-2xl border border-white/5">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-forge-accent/5 rounded-full blur-3xl animate-pulse-slow" />
            {topics.map((topic, index) => {
                const sizeClass = topic.size > 8 ? 'w-24 h-24 text-base' : topic.size > 5 ? 'w-16 h-16 text-sm' : 'w-12 h-12 text-xs';
                return (
                    <div key={topic.id} className="absolute transition-all duration-1000" style={{ left: `${topic.x}%`, top: `${topic.y}%`, animation: `float ${6 + index}s ease-in-out infinite ${index}s` }}>
                        <div className="absolute left-1/2 top-1/2 w-[200px] h-[1px] bg-gradient-to-r from-white/5 to-transparent origin-left -z-10 -rotate-45 opacity-30" />
                        <div className={cn(sizeClass, "rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-center p-2 shadow-lg hover:scale-110 transition-transform cursor-pointer group hover:bg-forge-accent/20 hover:border-forge-accent/40")}>
                            <span className="font-medium text-gray-200 group-hover:text-white">{topic.name}</span>
                        </div>
                        {topic.relatedTopics.map((sub, i) => <div key={i} className="absolute w-2 h-2 bg-forge-cyan/40 rounded-full animate-pulse" style={{ top: `${Math.sin(i) * 40}px`, left: `${Math.cos(i) * 40}px` }} />)}
                    </div>
                );
            })}
        </div>
    );
};

const PatternCard: React.FC<{ pattern: Pattern }> = ({ pattern }) => {
    const color = pattern.impact === 'positive' ? 'text-emerald-400 border-emerald-500/30' : pattern.impact === 'negative' ? 'text-rose-400 border-rose-500/30' : 'text-blue-400 border-blue-500/30';
    return (
        <div className={cn("group p-5 rounded-xl border bg-white/[0.02] hover:bg-white/[0.05] transition-all", color)}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2"><Zap size={14} className="animate-pulse" /><span className="text-xs font-bold uppercase tracking-wider opacity-80">{pattern.type} Signal</span></div>
                <div className="text-xs font-mono opacity-60">{pattern.confidence}% Conf.</div>
            </div>
            <h3 className="text-white font-medium mb-2 group-hover:text-white transition-colors">{pattern.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300">{pattern.description}</p>
        </div>
    );
};

const LifeArcWidget: React.FC<{ arc: GlobalAnalysis['lifeArc'] }> = ({ arc }) => (
    <GlassCard className="relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-forge-cyan/20 to-transparent blur-2xl rounded-bl-full pointer-events-none" />
        <div className="relative z-10">
            <div className="flex items-center gap-2 text-forge-cyan text-xs font-bold uppercase tracking-widest mb-4"><Activity size={14} /> Macro Cycle</div>
            <div className="flex justify-between items-end mb-2"><h2 className="text-2xl font-display font-bold text-white">{arc.currentPhase}</h2><span className="text-xs text-gray-500 font-mono mb-1">Phase Progress</span></div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-4"><div className="h-full bg-gradient-to-r from-forge-accent to-forge-cyan" style={{ width: `${arc.progress}%` }} /></div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">{arc.description}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400"><span>Next Phase Prediction:</span><span className="text-white font-medium">{arc.nextPhasePrediction}</span><ArrowRight size={12} /></div>
        </div>
    </GlassCard>
);

export const InsightView: React.FC = () => {
    const [data, setData] = useState<GlobalAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [period, setPeriod] = useState<'7d' | '30d'>('7d');

    useEffect(() => { refreshInsights(); }, []);
    const refreshInsights = async () => { setIsAnalyzing(true); try { const mockSummary = "User has been logging focused work sessions but reporting feeling tired in evenings. High activity in Journaling about 'Systems'. Memory logged about hiking."; const result = await generateGlobalInsights(mockSummary); setData(result); } catch (e) { console.error(e); } finally { setIsAnalyzing(false); } };

    return (
        <div className="h-full flex bg-forge-bg text-white relative overflow-hidden animate-in fade-in duration-700">
            <div className="flex-1 h-full overflow-y-auto overflow-x-hidden relative">
                <div className="p-8 pb-4 relative z-10">
                    <div className="flex justify-between items-start">
                        <div><h1 className="text-3xl font-display font-bold text-white flex items-center gap-3"><Telescope className="text-forge-cyan" /> Mind Observatory</h1><p className="text-sm text-gray-500 mt-2 max-w-xl leading-relaxed">Aggregating cognitive signals, emotional cycles, and behavioral patterns from the Forge Neural Net.</p></div>
                        <div className="flex gap-2">
                            {['7d', '30d'].map(p => (<button key={p} onClick={() => setPeriod(p as any)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all", period === p ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-gray-500 hover:text-white')}>{p === '7d' ? '7 Days' : '30 Days'}</button>))}
                            <button onClick={refreshInsights} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-forge-accent/20 transition-all" disabled={isAnalyzing}><RefreshCw size={16} className={isAnalyzing ? 'animate-spin' : ''} /></button>
                        </div>
                    </div>
                </div>
                {data ? (
                    <div className="p-8 pt-0 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24">
                        <div className="lg:col-span-2 min-h-[300px]"><GlassCard className="h-full flex flex-col" noPadding><div className="p-5 border-b border-white/5 flex justify-between items-center"><h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><TrendingUp size={14} /> Emotional Cycle</h3></div><div className="flex-1 w-full h-full min-h-[250px] p-4"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={data.emotionalCycle}><defs><linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/><stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} strokeDasharray="3 3" /><XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} /><YAxis hide domain={[0, 10]} /><Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} /><Area type="monotone" dataKey="value" stroke="#7C3AED" fill="url(#colorMood)" strokeWidth={2} /><Scatter dataKey="value" fill="#fff" /></ComposedChart></ResponsiveContainer></div></GlassCard></div>
                        <div className="lg:col-span-1"><LifeArcWidget arc={data.lifeArc} /></div>
                        <div className="lg:col-span-2 min-h-[400px]"><GlassCard className="h-full relative" noPadding><div className="absolute top-5 left-5 z-10"><h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><BrainCircuit size={14} /> Topic Constellation</h3></div><TopicConstellation topics={data.topics} /></GlassCard></div>
                        <div className="lg:col-span-1 flex flex-col gap-4"><h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 px-2">Detected Signals</h3>{data.patterns.map(p => <PatternCard key={p.id} pattern={p} />)}</div>
                    </div>
                ) : <div className="flex flex-col items-center justify-center h-[60vh]"><div className="w-16 h-16 rounded-full border-4 border-forge-accent border-t-transparent animate-spin mb-6" /><h2 className="text-xl font-display font-bold text-white">Calibrating Sensors...</h2></div>}
            </div>
        </div>
    );
};
