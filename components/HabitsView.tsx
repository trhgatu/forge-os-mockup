
import React, { useState } from 'react';
import { Repeat, Plus, Check, Flame, Zap, X, Sparkles, Trophy, Coffee, BookOpen, Dumbbell } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Habit, HabitType, HabitAnalysis } from '../types';
import { optimizeHabitStrategy } from '../services/geminiService';
import { cn } from '../lib/utils';

const TYPE_CONFIG: Record<HabitType, { color: string, bg: string, label: string, icon: React.ElementType }> = {
    foundation: { color: 'text-blue-400', bg: 'bg-blue-500', label: 'Foundation', icon: Coffee },
    growth: { color: 'text-fuchsia-400', bg: 'bg-fuchsia-500', label: 'Growth', icon: BookOpen },
    micro: { color: 'text-emerald-400', bg: 'bg-emerald-500', label: 'Micro', icon: Zap },
};

const MOCK_HABITS: Habit[] = [
    {
        id: '1', title: 'Deep Work (4h)', category: 'Career', type: 'growth', frequency: 'daily', streak: 12, logs: [], difficulty: 8, dateCreated: new Date(),
        analysis: { identityAlignment: "This reinforces your identity as a creator.", suggestedMicroHabit: "Just open your IDE.", riskAnalysis: "Distractions in afternoon.", bestTimeOfDay: "Morning" }
    },
    {
        id: '2', title: 'Morning Hydration', category: 'Health', type: 'micro', frequency: 'daily', streak: 45, logs: [], difficulty: 2, dateCreated: new Date()
    },
    {
        id: '3', title: 'Meditation', category: 'Mind', type: 'foundation', frequency: 'daily', streak: 3, logs: [], difficulty: 5, dateCreated: new Date()
    }
];

const CircularProgress: React.FC<{ percentage: number; color: string }> = ({ percentage, color }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5" />
                <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={cn("transition-all duration-1000", color)} />
            </svg>
            <span className="absolute text-[10px] font-bold text-white">{percentage}%</span>
        </div>
    );
};

const HabitCard: React.FC<{ habit: Habit; onToggle: () => void; onClick: () => void }> = ({ habit, onToggle, onClick }) => {
    const [isCompleted, setIsCompleted] = useState(false);
    const config = TYPE_CONFIG[habit.type];
    const handleCheck = (e: React.MouseEvent) => { e.stopPropagation(); setIsCompleted(!isCompleted); onToggle(); };

    return (
        <div onClick={onClick} className={cn("group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg", isCompleted ? 'bg-white/5 border-white/10' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10')}>
            {isCompleted && <div className={cn("absolute inset-0 rounded-2xl border opacity-50 pointer-events-none", `border-${config.color.split('-')[1]}-500/30`)} />}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", `${config.bg}/20`, config.color)}><config.icon size={18} /></div>
                    <div>
                        <h3 className={cn("font-medium transition-colors", isCompleted ? 'text-gray-400 line-through' : 'text-white')}>{habit.title}</h3>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-wider mt-1"><span>{config.label}</span><span className="w-1 h-1 rounded-full bg-gray-600" /><span>{habit.frequency}</span></div>
                    </div>
                </div>
                <CircularProgress percentage={isCompleted ? 100 : 0} color={config.color} />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2"><Flame size={14} className={habit.streak > 5 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-gray-600'} /><span className="text-sm font-bold text-white">{habit.streak}</span><span className="text-xs text-gray-500">Day Streak</span></div>
                <button onClick={handleCheck} className={cn("w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300", isCompleted ? cn(`bg-${config.color.split('-')[1]}-500 border-${config.color.split('-')[1]}-500 text-white scale-110 shadow-[0_0_15px_currentColor]`) : 'bg-transparent border-white/20 text-transparent hover:border-white/50')}><Check size={14} strokeWidth={4} /></button>
            </div>
        </div>
    );
};

const DetailPanel: React.FC<{ habit: Habit | null; onClose: () => void; onOptimize: () => void; isOptimizing: boolean }> = ({ habit, onClose, onOptimize, isOptimizing }) => {
    if (!habit) return null;
    const config = TYPE_CONFIG[habit.type];

    return (
        <div className="absolute inset-y-0 right-0 w-full md:w-[450px] bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", `${config.bg}/20`, config.color)}><config.icon size={18} /></div>
                    <div><h2 className="text-lg font-display font-bold text-white leading-tight">{habit.title}</h2><div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{config.label} Protocol</div></div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center"><div className="text-2xl font-bold text-white">{habit.streak}</div><div className="text-[10px] text-gray-500 uppercase">Streak</div></div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center"><div className="text-2xl font-bold text-white">92%</div><div className="text-[10px] text-gray-500 uppercase">Success</div></div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center"><div className="text-2xl font-bold text-white">{habit.difficulty}/10</div><div className="text-[10px] text-gray-500 uppercase">Effort</div></div>
                </div>
                <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-white flex items-center gap-2"><Sparkles size={14} className="text-forge-accent" /> Behavioral Optimization</h3>{!habit.analysis && (<button onClick={onOptimize} disabled={isOptimizing} className="text-xs bg-white/5 hover:bg-forge-accent hover:text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50">{isOptimizing ? 'Analyzing...' : 'Optimize'}</button>)}</div>
                    {habit.analysis ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <GlassCard className="bg-gradient-to-br from-forge-accent/10 to-transparent border-forge-accent/20 relative overflow-hidden" noPadding><div className="p-4 relative z-10"><div className="text-[10px] text-forge-accent font-mono uppercase tracking-widest mb-2">Identity Anchor</div><p className="text-sm text-white italic">"{habit.analysis.identityAlignment}"</p></div></GlassCard>
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Micro-Habit Fallback</div><p className="text-sm text-gray-300">{habit.analysis.suggestedMicroHabit}</p></div>
                        </div>
                    ) : (<div className="text-center py-8 border border-dashed border-white/10 rounded-xl"><p className="text-xs text-gray-500">Activate AI to refine this behavioral algorithm.</p></div>)}
                </div>
            </div>
        </div>
    );
};

const CreateHabitModal: React.FC<{ onClose: () => void; onSave: (h: Habit) => void }> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<HabitType>('growth');
    const handleSave = () => { if (!title) return; onSave({ id: Date.now().toString(), title, category: 'General', type, frequency: 'daily', streak: 0, logs: [], difficulty: 5, dateCreated: new Date() }); onClose(); };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center"><h3 className="font-display font-bold text-white">Install Protocol</h3><button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18}/></button></div>
                <div className="p-6 space-y-6">
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-forge-accent focus:outline-none text-lg font-medium" placeholder="Action" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
                    <div className="flex gap-2">{(Object.keys(TYPE_CONFIG) as HabitType[]).map(t => (<button key={t} onClick={() => setType(t)} className={cn("flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all", type === t ? `bg-white/10 text-white border-white/20` : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5')}>{TYPE_CONFIG[t].label}</button>))}</div>
                </div>
                <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-black/40"><button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm bg-forge-accent text-white hover:bg-forge-accent/80 shadow-lg shadow-forge-accent/20">Initialize</button></div>
            </div>
        </div>
    );
};

export const HabitsView: React.FC = () => {
    const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);

    const handleToggle = (id: string) => console.log("Toggled", id);
    const handleSaveNew = (newHabit: Habit) => setHabits([newHabit, ...habits]);
    const handleOptimize = async () => { if (!selectedId) return; const habit = habits.find(h => h.id === selectedId); if (!habit) return; setIsOptimizing(true); try { const analysis = await optimizeHabitStrategy(habit.title, habit.frequency, habit.streak); setHabits(prev => prev.map(h => h.id === selectedId ? { ...h, analysis } : h)); } catch (e) { console.error(e); } finally { setIsOptimizing(false); } };

    return (
        <div className="h-full flex bg-forge-bg text-white relative overflow-hidden animate-in fade-in duration-700">
            <div className="flex-1 h-full overflow-y-auto relative scrollbar-hide">
                <div className="p-8 pb-4 relative z-10">
                    <div className="flex justify-between items-end">
                        <div><h1 className="text-3xl font-display font-bold text-white flex items-center gap-3"><Repeat className="text-forge-cyan" /> Routine Matrix</h1><p className="text-sm text-gray-500 mt-2 max-w-xl">Reinforcing identity through consistent action.</p></div>
                        <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 flex items-center gap-2"><Plus size={16} /> New Habit</button>
                    </div>
                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/5 flex items-center gap-8">
                        <div><div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Consistency</div><div className="text-3xl font-bold text-white">87%</div></div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="flex-1 grid grid-cols-7 gap-1 h-8 opacity-50">{[...Array(35)].map((_, i) => (<div key={i} className={cn("rounded-sm", Math.random() > 0.3 ? 'bg-forge-cyan' : 'bg-white/5', `opacity-${Math.random() > 0.5 ? '100' : '30'}`)} />))}</div>
                    </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                    {habits.map(habit => <HabitCard key={habit.id} habit={habit} onToggle={() => handleToggle(habit.id)} onClick={() => setSelectedId(habit.id)} />)}
                </div>
            </div>
            {selectedId && <DetailPanel habit={habits.find(h => h.id === selectedId)!} onClose={() => setSelectedId(null)} onOptimize={handleOptimize} isOptimizing={isOptimizing} />}
            {isCreating && <CreateHabitModal onClose={() => setIsCreating(false)} onSave={handleSaveNew} />}
        </div>
    );
};
