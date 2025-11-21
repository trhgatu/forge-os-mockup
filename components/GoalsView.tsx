
import React, { useState } from 'react';
import { Target, Plus, Zap, CheckCircle2, X, Sparkles, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Goal, GoalType, GoalStatus } from '../types';
import { breakdownGoal } from '../services/geminiService';
import { cn } from '../lib/utils';

const GOAL_TYPES: Record<GoalType, { color: string, bg: string, label: string }> = {
    life: { color: 'text-fuchsia-400', bg: 'bg-fuchsia-500', label: 'Life Quest' },
    project: { color: 'text-cyan-400', bg: 'bg-cyan-500', label: 'Project' },
    micro: { color: 'text-emerald-400', bg: 'bg-emerald-500', label: 'Micro Goal' },
};

const MOCK_GOALS: Goal[] = [
    {
        id: '1',
        title: 'Master Neural Networks',
        description: 'Deep dive into transformer architectures and build a custom implementation.',
        category: 'Learning',
        type: 'project',
        status: 'in_progress',
        priority: 5,
        progress: 45,
        dueDate: new Date(Date.now() + 86400000 * 30),
        milestones: [
            { id: 'm1', title: 'Complete theory course', isCompleted: true },
            { id: 'm2', title: 'Build tokenizer', isCompleted: true },
            { id: 'm3', title: 'Train on small dataset', isCompleted: false },
        ],
        tags: ['AI', 'Code'],
        analysis: {
            risks: ['Complexity overload', 'GPU constraints'],
            energyLevel: 8,
            suggestedHabit: 'Read 1 paper daily',
            motivation: 'Understanding the core of modern AI is essential for your career arc.'
        },
        dateCreated: new Date()
    },
    {
        id: '2',
        title: 'Physical Resilience',
        description: 'Establish a consistent routine to improve energy baseline.',
        category: 'Health',
        type: 'life',
        status: 'in_progress',
        priority: 4,
        progress: 20,
        milestones: [
            { id: 'm1', title: 'Gym signup', isCompleted: true },
            { id: 'm2', title: 'First month consistency', isCompleted: false },
        ],
        tags: ['Health', 'Habit'],
        analysis: {
            risks: ['Injury', 'Time management'],
            energyLevel: 6,
            suggestedHabit: 'Morning hydration',
            motivation: 'A strong vessel is required for a strong mind.'
        },
        dateCreated: new Date()
    }
];

const ProgressRing: React.FC<{ progress: number, color: string, size?: number }> = ({ progress, color, size = 60 }) => {
    const radius = size / 2 - 4;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    
    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full">
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                <circle 
                    cx={size / 2} cy={size / 2} r={radius} 
                    stroke="currentColor" strokeWidth="4" fill="transparent" 
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                    className={cn("transition-all duration-1000 ease-out", color)}
                />
            </svg>
            <span className="absolute text-xs font-mono text-gray-400">{progress}%</span>
        </div>
    );
};

const GoalCard: React.FC<{ goal: Goal; onClick: () => void }> = ({ goal, onClick }) => {
    const typeStyle = GOAL_TYPES[goal.type];
    return (
        <div 
            onClick={onClick}
            className={cn(
                "group relative p-5 rounded-2xl bg-white/[0.02] border border-white/5",
                "hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-1 hover:shadow-lg",
                `hover:shadow-${typeStyle.color.split('-')[1]}-500/10`,
                "transition-all duration-500 cursor-pointer"
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className={cn("text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border bg-white/5 border-white/5", typeStyle.color)}>
                        {typeStyle.label}
                    </span>
                    <h3 className="text-lg font-display font-bold text-white mt-2 group-hover:text-forge-cyan transition-colors">
                        {goal.title}
                    </h3>
                </div>
                <ProgressRing progress={goal.progress} color={typeStyle.color} size={48} />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 font-mono mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} /> {goal.milestones.filter(m => m.isCompleted).length}/{goal.milestones.length}</span>
                    <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-500" /> {goal.analysis?.energyLevel || '-'}/10</span>
                </div>
                {goal.dueDate && (
                    <span className={cn(goal.dueDate < new Date() ? 'text-red-400' : '')}>
                        {goal.dueDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                )}
            </div>
            <div className={cn("absolute inset-0 rounded-2xl border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none", `border-${typeStyle.color.split('-')[1]}-500/20`)} />
        </div>
    );
};

const GoalDetailPanel: React.FC<{ goal: Goal | null; onClose: () => void; onToggleMilestone: (id: string) => void }> = ({ goal, onClose, onToggleMilestone }) => {
    if (!goal) return null;
    const typeStyle = GOAL_TYPES[goal.type];

    return (
        <div className="absolute inset-y-0 right-0 w-full md:w-[500px] bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 border-b border-white/5 flex justify-between items-start bg-black/40">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={cn("w-2 h-2 rounded-full", typeStyle.bg)} />
                        <span className={cn("text-xs font-bold uppercase tracking-widest", typeStyle.color)}>{typeStyle.label}</span>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white leading-tight">{goal.title}</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="text-sm text-gray-300 leading-relaxed">{goal.description}</div>
                <div>
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Milestones</h3>
                    <div className="space-y-2">
                        {goal.milestones.map(m => (
                            <div key={m.id} onClick={() => onToggleMilestone(m.id)} className={cn("group flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all", m.isCompleted ? 'bg-white/5 border-white/5' : 'bg-transparent border-white/10 hover:border-white/30')}>
                                <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center transition-colors", m.isCompleted ? 'bg-green-500 border-green-500 text-black' : 'border-gray-500 text-transparent group-hover:border-white')}>
                                    <CheckCircle2 size={14} />
                                </div>
                                <span className={cn("text-sm", m.isCompleted ? 'text-gray-500 line-through' : 'text-white')}>{m.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {goal.analysis && (
                    <div className="space-y-4">
                        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Sparkles size={12} className="text-forge-accent" /> Strategy Protocol</h3>
                        <GlassCard className="bg-gradient-to-br from-white/5 to-transparent border-white/10 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="text-[10px] text-forge-accent font-bold uppercase mb-2">Core Motivation</div>
                                <p className="text-sm text-white italic">"{goal.analysis.motivation}"</p>
                            </div>
                        </GlassCard>
                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                            <div className="text-[10px] text-red-400 uppercase mb-2 flex items-center gap-1"><AlertTriangle size={10} /> Risk Factors</div>
                            <div className="flex flex-wrap gap-2">
                                {goal.analysis.risks.map(r => <span key={r} className="text-[10px] px-2 py-1 rounded bg-red-500/10 text-red-300 border border-red-500/20">{r}</span>)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CreateGoalModal: React.FC<{ onClose: () => void; onSave: (g: Goal) => void }> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState<GoalType>('project');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCreate = async () => {
        if (!title) return;
        setIsProcessing(true);
        try {
            const analysis = await breakdownGoal(title, desc, type);
            const newGoal: Goal = {
                id: Date.now().toString(), title, description: desc, category: 'General', type, status: 'not_started', priority: 3, progress: 0,
                milestones: analysis.milestones.map((m, i) => ({ id: `m${i}`, title: m.title, isCompleted: false })),
                tags: [],
                analysis: { risks: analysis.riskAnalysis, energyLevel: analysis.energyScore, suggestedHabit: analysis.suggestedHabit, motivation: analysis.motivation },
                dateCreated: new Date()
            };
            onSave(newGoal);
            onClose();
        } catch (e) { console.error(e); } finally { setIsProcessing(false); }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-display font-bold text-white">Set Intent</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18}/></button>
                </div>
                <div className="p-6 space-y-6">
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-forge-accent focus:outline-none text-lg font-medium" placeholder="Objective" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
                    <div className="flex gap-2">
                        {(Object.keys(GOAL_TYPES) as GoalType[]).map(t => (
                            <button key={t} onClick={() => setType(t)} className={cn("flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all", type === t ? `bg-white/10 text-white border-white/20` : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5')}>{GOAL_TYPES[t].label}</button>
                        ))}
                    </div>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-forge-accent focus:outline-none h-24 resize-none text-sm" placeholder="Context" value={desc} onChange={e => setDesc(e.target.value)} />
                </div>
                <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-black/40">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">Cancel</button>
                    <button onClick={handleCreate} disabled={isProcessing} className="px-4 py-2 rounded-lg text-sm bg-forge-accent text-white hover:bg-forge-accent/80 shadow-lg shadow-forge-accent/20 flex items-center gap-2 disabled:opacity-50">
                        {isProcessing ? <Sparkles size={14} className="animate-spin" /> : <Target size={14} />} {isProcessing ? 'Breaking Down...' : 'Initialize Goal'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const GoalsView: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleToggleMilestone = (milestoneId: string) => {
        if (!selectedId) return;
        setGoals(prev => prev.map(g => {
            if (g.id !== selectedId) return g;
            const newMilestones = g.milestones.map(m => m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m);
            const completed = newMilestones.filter(m => m.isCompleted).length;
            return { ...g, milestones: newMilestones, progress: Math.round((completed / newMilestones.length) * 100) };
        }));
    };

    const handleSaveNew = (newGoal: Goal) => setGoals([newGoal, ...goals]);
    const activeGoals = goals.filter(g => g.status === 'in_progress').length;
    const avgProgress = Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) || 0;

    return (
        <div className="h-full flex bg-forge-bg text-white relative overflow-hidden animate-in fade-in duration-700">
            <div className="flex-1 h-full overflow-y-auto relative scrollbar-hide">
                <div className="p-8 pb-4 relative z-10">
                    <div className="flex justify-between items-end">
                        <div><h1 className="text-3xl font-display font-bold text-white flex items-center gap-3"><Target className="text-forge-cyan" /> Evolution Path</h1><p className="text-sm text-gray-500 mt-2 max-w-xl">Turning intention into structural reality.</p></div>
                        <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 flex items-center gap-2"><Plus size={16} /> New Goal</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><TrendingUp size={18} /></div><div><div className="text-xs text-gray-500 uppercase">Momentum</div><div className="text-lg font-bold text-white">{activeGoals} Active</div></div></div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3"><div className="p-2 rounded-lg bg-green-500/20 text-green-400"><BarChart3 size={18} /></div><div><div className="text-xs text-gray-500 uppercase">Completion</div><div className="text-lg font-bold text-white">{avgProgress}%</div></div></div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3"><div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400"><Zap size={18} /></div><div><div className="text-xs text-gray-500 uppercase">Energy Load</div><div className="text-lg font-bold text-white">Optimal</div></div></div>
                    </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                    {goals.map(goal => <GoalCard key={goal.id} goal={goal} onClick={() => setSelectedId(goal.id)} />)}
                </div>
            </div>
            {selectedId && <GoalDetailPanel goal={goals.find(g => g.id === selectedId)!} onClose={() => setSelectedId(null)} onToggleMilestone={handleToggleMilestone} />}
            {isCreating && <CreateGoalModal onClose={() => setIsCreating(false)} onSave={handleSaveNew} />}
        </div>
    );
};
