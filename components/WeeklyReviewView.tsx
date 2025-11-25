
import React, { useState, useEffect } from 'react';
import { CalendarCheck, Sparkles, TrendingUp, Activity, Zap, Target, Repeat, Clock, ArrowUpRight, ArrowDownRight, Minus, Flame, Play, BookOpen, RefreshCw, CheckCircle2 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { WeeklyReviewData, WeeklyReviewAnalysis } from '../types';
import { generateWeeklyReview } from '../services/geminiService';
import { AreaChart, Area, LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

const MOCK_WEEKLY_DATA: WeeklyReviewData = {
    moodHistory: [ { date: 'Mon', value: 6, mood: 'Neutral' }, { date: 'Tue', value: 8, mood: 'Focused' }, { date: 'Wed', value: 9, mood: 'Inspired' }, { date: 'Thu', value: 4, mood: 'Tired' }, { date: 'Fri', value: 7, mood: 'Calm' }, { date: 'Sat', value: 9, mood: 'Joy' }, { date: 'Sun', value: 8, mood: 'Calm' } ],
    energyHistory: [ { date: 'Mon', value: 70 }, { date: 'Tue', value: 85 }, { date: 'Wed', value: 90 }, { date: 'Thu', value: 55 }, { date: 'Fri', value: 75 }, { date: 'Sat', value: 95 }, { date: 'Sun', value: 85 } ],
    goalsCompleted: 2, goalsInProgress: 4, habitsConsistency: 88, topHabit: 'Deep Work', strugglingHabit: 'Hydration', routinesCompleted: 12, highlights: [ 'Breakthrough in Neural Architecture', 'Deep conversation with mentor', 'Finished "Dune"' ]
};

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ElementType; trend?: 'up' | 'down' | 'flat' }> = ({ label, value, icon: Icon, trend }) => (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-white/5 text-gray-300"><Icon size={16} /></div>
            {trend && (<div className="text-xs font-bold text-gray-400 flex items-center">{trend === 'up' ? <ArrowUpRight size={14} className="text-green-400" /> : trend === 'down' ? <ArrowDownRight size={14} className="text-red-400" /> : <Minus size={14} />}</div>)}
        </div>
        <div><div className="text-2xl font-bold text-white">{value}</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</div></div>
    </div>
);

const MoodMap: React.FC<{ data: WeeklyReviewData['moodHistory'] }> = ({ data }) => (
    <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%"><LineChart data={data}><defs><linearGradient id="moodLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#22D3EE" /></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} /><XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} /><Line type="monotone" dataKey="value" stroke="url(#moodLine)" strokeWidth={3} dot={{ r: 4, fill: '#09090b', strokeWidth: 2 }} /></LineChart></ResponsiveContainer>
    </div>
);

const EnergyCurve: React.FC<{ data: WeeklyReviewData['energyHistory'] }> = ({ data }) => (
    <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><defs><linearGradient id="energyArea" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3}/><stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} /><XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} /><Area type="monotone" dataKey="value" stroke="#22D3EE" fill="url(#energyArea)" strokeWidth={2} /></AreaChart></ResponsiveContainer>
    </div>
);

export const WeeklyReviewView: React.FC = () => {
    const [data, setData] = useState<WeeklyReviewData>(MOCK_WEEKLY_DATA);
    const [analysis, setAnalysis] = useState<WeeklyReviewAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => { handleAnalyze(); }, []);
    const handleAnalyze = async () => { setIsAnalyzing(true); try { const result = await generateWeeklyReview(data); setAnalysis(result); } catch (e) { console.error(e); } finally { setIsAnalyzing(false); } };

    return (
        <div className="h-full flex bg-[#050505] text-white relative overflow-hidden animate-in fade-in duration-700">
            <div className="absolute inset-0 pointer-events-none"><div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[150px]" /><div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[150px]" /></div>
            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10">
                <div className="max-w-4xl mx-auto p-6 md:p-8 pb-32">
                    <div className="flex justify-between items-center mb-12"><div><h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">Weekly Review</h1><p className="text-sm text-gray-500 font-mono">Oct 23 - Oct 29 • Week 43</p></div><div className="flex gap-2"><button onClick={handleAnalyze} disabled={isAnalyzing} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><RefreshCw size={18} className={isAnalyzing ? 'animate-spin' : ''} /></button></div></div>
                    {analysis ? (
                        <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 relative overflow-hidden">
                            <div className="relative z-10"><div className="flex items-start gap-6 mb-6"><div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-forge-accent to-forge-cyan flex flex-col items-center justify-center shadow-lg shadow-forge-accent/20"><span className="text-3xl font-bold text-white">{analysis.weeklyScore}</span><span className="text-[10px] font-mono text-white/80 uppercase">Score</span></div><div className="flex-1"><h2 className="text-xl font-medium text-white mb-2">"{analysis.identityProgress}"</h2><p className="text-sm text-gray-400 leading-relaxed">{analysis.summary}</p></div></div></div>
                        </div>
                    ) : <div className="h-64 flex items-center justify-center mb-12 border border-dashed border-white/10 rounded-3xl"><p className="text-gray-500 animate-pulse">Synthesizing weekly data...</p></div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <GlassCard className="flex flex-col" noPadding><div className="p-5 border-b border-white/5 flex justify-between items-center"><h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><Activity size={14} /> Emotional Baseline</h3></div><div className="flex-1 p-6"><MoodMap data={data.moodHistory} /></div></GlassCard>
                        <GlassCard className="flex flex-col" noPadding><div className="p-5 border-b border-white/5 flex justify-between items-center"><h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><Zap size={14} /> Vitality Flow</h3></div><div className="flex-1 p-6"><EnergyCurve data={data.energyHistory} /></div></GlassCard>
                        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4"><StatCard label="Goals Completed" value={data.goalsCompleted} icon={Target} trend="up" /><StatCard label="Active Goals" value={data.goalsInProgress} icon={Play} /><StatCard label="Habit Consistency" value={`${data.habitsConsistency}%`} icon={Repeat} trend={data.habitsConsistency > 80 ? 'up' : 'flat'} /><StatCard label="Routines Done" value={data.routinesCompleted} icon={Clock} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
