
import React, { useState } from 'react';
import { Flag, Plus, Calendar, CheckCircle2, X, Sparkles, Target, Repeat, Briefcase, Star, GitCommit, LayoutGrid } from 'lucide-react';
import { RichMilestone, MilestoneType, MilestoneStatus } from '../types';
import { optimizeMilestone } from '../services/geminiService';
import { cn } from '../lib/utils';

const TYPE_CONFIG: Record<MilestoneType, { label: string, color: string, bg: string, icon: React.ElementType }> = {
    goal: { label: 'Goal', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500', icon: Target },
    habit: { label: 'Habit', color: 'text-blue-400', bg: 'bg-blue-500', icon: Repeat },
    routine: { label: 'Routine', color: 'text-orange-400', bg: 'bg-orange-500', icon: Calendar },
    project: { label: 'Project', color: 'text-cyan-400', bg: 'bg-cyan-500', icon: Briefcase },
    freeform: { label: 'Freeform', color: 'text-emerald-400', bg: 'bg-emerald-500', icon: Star },
};

const STATUS_CONFIG: Record<MilestoneStatus, { label: string, color: string, glow: string }> = {
    pending: { label: 'Pending', color: 'text-gray-400', glow: 'shadow-none' },
    in_progress: { label: 'Active', color: 'text-white', glow: 'shadow-[0_0_15px_rgba(255,255,255,0.2)]' },
    completed: { label: 'Done', color: 'text-forge-cyan', glow: 'shadow-[0_0_15px_#22D3EE]' },
    overdue: { label: 'Overdue', color: 'text-red-400', glow: 'shadow-[0_0_15px_rgba(248,113,113,0.3)]' },
};

const MOCK_MILESTONES: RichMilestone[] = [
    {
        id: '1', title: 'Launch MVP Alpha', description: 'Deploy initial version to internal testers.', type: 'project', status: 'in_progress',
        dueDate: new Date(Date.now() + 86400000 * 5), progress: 65, difficulty: 4, tags: ['Code', 'Launch'],
        subSteps: [{ id: 's1', title: 'Finalize DB Schema', isCompleted: true }, { id: 's2', title: 'Configure CI/CD', isCompleted: true }, { id: 's3', title: 'Security Audit', isCompleted: false }]
    },
    {
        id: '2', title: '30-Day Meditation Streak', description: 'Consistency is key for mental clarity.', type: 'habit', status: 'pending',
        dueDate: new Date(Date.now() + 86400000 * 20), progress: 33, difficulty: 3, tags: ['Mind', 'Habit'], subSteps: []
    }
];

const MilestoneCard: React.FC<{ milestone: RichMilestone; onClick: () => void; layout: 'grid' | 'timeline' }> = ({ milestone, onClick, layout }) => {
    const typeConfig = TYPE_CONFIG[milestone.type];
    const isCompleted = milestone.status === 'completed';

    return (
        <div onClick={onClick} className={cn("group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden", layout === 'timeline' ? 'w-full' : 'h-full', isCompleted ? 'bg-forge-cyan/5 border-forge-cyan/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-1 hover:shadow-lg')}>
            <div className="absolute bottom-0 left-0 h-1 bg-forge-cyan/20 transition-all duration-1000" style={{ width: `${milestone.progress}%` }} />
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg bg-white/5", typeConfig.color)}><typeConfig.icon size={14} /></div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">{typeConfig.label}</span>
                </div>
                {milestone.analysis && <Sparkles size={12} className="text-forge-accent" />}
            </div>
            <h3 className={cn("font-display font-bold text-lg mb-1 leading-tight", isCompleted ? 'text-gray-400 line-through' : 'text-white')}>{milestone.title}</h3>
            <div className="flex items-center justify-between mt-4 text-xs text-gray-500 font-mono">
                <span className={cn(milestone.dueDate < new Date() && !isCompleted ? 'text-red-400' : '')}>{milestone.dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                <div className="flex items-center gap-2"><span>{milestone.progress}%</span></div>
            </div>
        </div>
    );
};

export const MilestoneView: React.FC = () => {
    const [milestones, setMilestones] = useState<RichMilestone[]>(MOCK_MILESTONES);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'timeline'>('timeline');
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="h-full flex bg-forge-bg text-white relative overflow-hidden animate-in fade-in duration-700">
            <div className="flex-1 h-full overflow-y-auto relative scrollbar-hide flex flex-col">
                <div className="p-8 pb-4 z-10 bg-gradient-to-b from-forge-bg to-transparent sticky top-0">
                    <div className="flex justify-between items-end mb-6">
                        <div><h1 className="text-3xl font-display font-bold text-white flex items-center gap-3"><Flag className="text-forge-cyan" /> Progress Engine</h1><p className="text-sm text-gray-500 mt-2">Tracking <span className="text-white">{milestones.filter(m => m.status === 'in_progress').length}</span> active directives.</p></div>
                        <div className="flex gap-3">
                             <div className="bg-black/40 border border-white/10 rounded-lg p-1 flex gap-1">
                                 <button onClick={() => setViewMode('timeline')} className={cn("p-2 rounded transition-all", viewMode === 'timeline' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white')}><GitCommit size={16}/></button>
                                 <button onClick={() => setViewMode('list')} className={cn("p-2 rounded transition-all", viewMode === 'list' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white')}><LayoutGrid size={16}/></button>
                             </div>
                             <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 flex items-center gap-2"><Plus size={16} /> New Marker</button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 relative px-8 pb-24 pt-4">
                    {viewMode === 'list' && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{milestones.map(m => <MilestoneCard key={m.id} milestone={m} onClick={() => setSelectedId(m.id)} layout="grid" />)}</div>}
                    {viewMode === 'timeline' && (
                        <div className="relative max-w-3xl mx-auto py-12 min-h-[500px]">
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-forge-accent/50 to-transparent" />
                            {milestones.sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()).map((m, i) => (
                                <div key={m.id} className="relative flex w-full mb-24 group">
                                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20"><div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center bg-[#09090b] transition-all duration-500", selectedId === m.id ? 'scale-150 border-white' : 'border-white/20')} /></div>
                                    <div className={cn("w-[45%]", i % 2 === 0 ? 'mr-auto pr-12' : 'ml-auto pl-12')}><MilestoneCard milestone={m} onClick={() => setSelectedId(m.id)} layout="timeline" /></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
