
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
        id: '3', title: 'Meditation', category: 'Mind', type: 'foundation', frequency: 'daily', streak: 5, logs: [], difficulty: 4, dateCreated: new Date()
    }
];

const Heatmap: React.FC = () => {
    // Mock heatmap visualization
    return (
        <div className="flex gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "w-2 h-8 rounded-sm", 
                        Math.random() > 0.3 ? 'bg-green-500 opacity-80' : 'bg-white/10'
                    )} 
                />
            ))}
        </div>
    );
}

const HabitCard: React.FC<{ habit: Habit; onClick: () => void; onToggle: (e: React.MouseEvent) => void }> = ({ habit, onClick, onToggle }) => {
    const typeConfig = TYPE_CONFIG[habit.type];
    const isDoneToday = habit.logs.some(l => l.date === new Date().toISOString().split('T')[0] && l.completed);

    return (
        <div onClick={onClick} className="group relative p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg bg-white/5", typeConfig.color)}>
                        <typeConfig.icon size={18} />
                    </div>
                    <div>
                        <h3 className="text-lg font-display font-bold text-white group-hover:text-forge-cyan transition-colors">{habit.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono uppercase mt-1">
                            <span>{habit.category}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                            <span className={cn("flex items-center gap-1", habit.streak > 10 ? 'text-orange-400' : 'text-gray-400')}>
                                <Flame size={10} /> {habit.streak} Day Streak
                            </span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onToggle}
                    className={cn(
                        "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 z-20",
                        isDoneToday 
                            ? 'bg-green-500 border-green-500 text-black shadow-[0_0_10px_#22c55e]' 
                            : 'border-white/20 text-transparent hover:border-white hover:bg-white/10'
                    )}
                >
                    <Check size={16} strokeWidth={3} />
                </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex items-end justify-between">
                <Heatmap />
                {habit.analysis && <Sparkles size={14} className="text-forge-accent mb-1" />}
            </div>
        </div>
    );
};

const HabitDetailPanel: React.FC<{ habit: Habit | null; onClose: () => void; onAnalyze: () => void; isAnalyzing: boolean }> = ({ habit, onClose, onAnalyze, isAnalyzing }) => {
    if (!habit) return null;
    const typeConfig = TYPE_CONFIG[habit.type];

    return (
        <div className="absolute inset-y-0 right-0 w-full md:w-[450px] bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl bg-white/5", typeConfig.color)}><typeConfig.icon size={20} /></div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-white leading-tight">{habit.title}</h2>
                        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{habit.frequency} • {typeConfig.label}</div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Current Streak</div>
                        <div className="text-2xl font-bold text-white flex items-center gap-2">
                            <Flame size={18} className="text-orange-500" /> {habit.streak}
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Completion Rate</div>
                        <div className="text-2xl font-bold text-white">85%</div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles size={14} className="text-forge-accent" /> Neural Strategy
                        </h3>
                        {!habit.analysis && (
                            <button onClick={onAnalyze} disabled={isAnalyzing} className="text-xs bg-white/5 hover:bg-forge-accent hover:text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2">
                                {isAnalyzing ? 'Optimizing...' : 'Optimize Habit'}
                            </button>
                        )}
                    </div>

                    {habit.analysis ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <GlassCard className="bg-gradient-to-br from-forge-accent/10 to-transparent border-forge-accent/20 relative overflow-hidden" noPadding>
                                <div className="p-4 relative z-10">
                                    <div className="text-[10px] text-forge-accent font-mono uppercase tracking-widest mb-2">Identity Lock</div>
                                    <p className="text-sm text-white italic">"{habit.analysis.identityAlignment}"</p>
                                </div>
                            </GlassCard>
                            
                            <div className="p-4 rounded-xl bg-emerald-900/10 border border-emerald-500/20">
                                <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest mb-2">Micro Step</div>
                                <p className="text-sm text-emerald-200">{habit.analysis.suggestedMicroHabit}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                    <div className="text-[10px] text-gray-500 font-mono uppercase">Risk Factor</div>
                                    <div className="text-xs text-gray-300 mt-1">{habit.analysis.riskAnalysis}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                    <div className="text-[10px] text-gray-500 font-mono uppercase">Optimal Time</div>
                                    <div className="text-xs text-gray-300 mt-1">{habit.analysis.bestTimeOfDay}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                            <p className="text-xs text-gray-500">Engage neural core to analyze friction points.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CreateHabitModal: React.FC<{ onClose: () => void; onSave: (h: Habit) => void }> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState<HabitType>('foundation');
    
    const handleSave = () => {
        if (!title) return;
        onSave({
            id: Date.now().toString(), title, category: category || 'General', type, frequency: 'daily', streak: 0, logs: [], difficulty: 5, dateCreated: new Date()
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-display font-bold text-white">Install New Habit</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18}/></button>
                </div>
                <div className="p-6 space-y-6">
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-forge-accent focus:outline-none text-lg font-medium" placeholder="Habit Name" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-forge-accent focus:outline-none text-sm" placeholder="Category (e.g. Health, Mind)" value={category} onChange={e => setCategory(e.target.value)} />
                    <div className="flex gap-2">
                        {(Object.keys(TYPE_CONFIG) as HabitType[]).map(t => (
                            <button key={t} onClick={() => setType(t)} className={cn("flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all", type === t ? `bg-white/10 text-white border-white/20` : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5')}>{TYPE_CONFIG[t].label}</button>
                        ))}
                    </div>
                </div>
                <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-black/40">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm bg-forge-accent text-white hover:bg-forge-accent/80 shadow-lg shadow-forge-accent/20 flex items-center gap-2">
                        <Plus size={14} /> Initialize
                    </button>
                </div>
            </div>
        </div>
    );
};

export const HabitsView: React.FC = () => {
    const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const selectedHabit = habits.find(h => h.id === selectedId) || null;

    const handleToggleHabit = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const today = new Date().toISOString().split('T')[0];
        setHabits(prev => prev.map(h => {
            if (h.id !== id) return h;
            const existingLogIndex = h.logs.findIndex(l => l.date === today);
            let newLogs = [...h.logs];
            let newStreak = h.streak;

            if (existingLogIndex >= 0) {
                // Toggle off
                if (newLogs[existingLogIndex].completed) {
                    newLogs[existingLogIndex].completed = false;
                    newStreak = Math.max(0, newStreak - 1);
                } else {
                    // Toggle on
                    newLogs[existingLogIndex].completed = true;
                    newStreak += 1;
                }
            } else {
                // New log
                newLogs.push({ date: today, completed: true });
                newStreak += 1;
            }
            return { ...h, logs: newLogs, streak: newStreak };
        }));
    };

    const handleOptimize = async () => {
        if (!selectedHabit) return;
        setIsAnalyzing(true);
        try {
            const analysis = await optimizeHabitStrategy(selectedHabit.title, selectedHabit.frequency, selectedHabit.streak);
            setHabits(prev => prev.map(h => h.id === selectedHabit.id ? { ...h, analysis } : h));
        } catch (e) { console.error(e); } finally { setIsAnalyzing(false); }
    };

    const handleSaveNew = (newHabit: Habit) => setHabits([newHabit, ...habits]);

    return (
        <div className="h-full flex bg-forge-bg text-white relative overflow-hidden animate-in fade-in duration-700">
            <div className="flex-1 h-full overflow-y-auto relative scrollbar-hide">
                <div className="p-6 md:p-8 pb-4 relative z-10">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                                <Repeat className="text-forge-cyan" /> Atomic Systems
                            </h1>
                            <p className="text-sm text-gray-500 mt-2 max-w-xl">Architecting the subconscious framework.</p>
                        </div>
                        <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 flex items-center gap-2">
                            <Plus size={16} /> Add Habit
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
                        {habits.map(habit => (
                            <HabitCard 
                                key={habit.id} 
                                habit={habit} 
                                onClick={() => setSelectedId(habit.id)} 
                                onToggle={(e) => handleToggleHabit(e, habit.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            {selectedHabit && (
                <HabitDetailPanel 
                    habit={selectedHabit} 
                    onClose={() => setSelectedId(null)} 
                    onAnalyze={handleOptimize} 
                    isAnalyzing={isAnalyzing} 
                />
            )}
            {isCreating && <CreateHabitModal onClose={() => setIsCreating(false)} onSave={handleSaveNew} />}
        </div>
    );
};
