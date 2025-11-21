
import React, { useState } from 'react';
import { Clock, Plus, Zap, ArrowUp, ArrowDown, CheckCircle2, Coffee, Sun, Moon, Briefcase, RotateCcw, Sparkles, X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Routine, RoutineBlock, RoutineType, RoutineBlockType } from '../types';
import { optimizeRoutine } from '../services/geminiService';
import { cn } from '../lib/utils';

const TYPE_CONFIG: Record<RoutineType, { label: string, icon: React.ElementType, gradient: string }> = {
    morning: { label: 'Activation', icon: Sun, gradient: 'from-yellow-500 to-orange-500' },
    work: { label: 'Deep Work', icon: Briefcase, gradient: 'from-blue-500 to-cyan-500' },
    evening: { label: 'Decompression', icon: Moon, gradient: 'from-indigo-500 to-purple-500' },
    reset: { label: 'System Reset', icon: RotateCcw, gradient: 'from-emerald-500 to-teal-500' },
};

const BLOCK_TYPES: Record<RoutineBlockType, { color: string, icon: React.ElementType }> = {
    habit: { color: 'text-blue-400', icon: RotateCcw },
    task: { color: 'text-fuchsia-400', icon: CheckCircle2 },
    reflection: { color: 'text-amber-400', icon: Sparkles },
    break: { color: 'text-emerald-400', icon: Coffee },
};

const MOCK_ROUTINES: Routine[] = [
    {
        id: '1', title: 'Morning Activation', type: 'morning', totalDuration: 45, active: true,
        blocks: [
            { id: 'b1', title: 'Hydration & Supplements', duration: 5, type: 'habit', energyImpact: 5 },
            { id: 'b2', title: 'Meditation', duration: 15, type: 'habit', energyImpact: 10 },
            { id: 'b3', title: 'Journaling', duration: 15, type: 'reflection', energyImpact: 5 },
            { id: 'b4', title: 'Review Goals', duration: 10, type: 'task', energyImpact: -2 },
        ],
        analysis: { energyScore: 8, flowSuggestion: "Solid energy ramp-up. Consider moving goal review to after movement.", bottleneck: "None detected.", recommendedStartTime: "07:00 AM" }
    },
    {
        id: '2', title: 'Deep Focus Protocol', type: 'work', totalDuration: 90, active: false,
        blocks: [
            { id: 'b5', title: 'Clear Desk', duration: 5, type: 'habit', energyImpact: 2 },
            { id: 'b6', title: 'Deep Work Session', duration: 75, type: 'task', energyImpact: -20 },
            { id: 'b7', title: 'Decompression Walk', duration: 10, type: 'break', energyImpact: 10 },
        ]
    }
];

const RoutineBlockCard: React.FC<{ block: RoutineBlock; index: number; onMoveUp: () => void; onMoveDown: () => void }> = ({ block, index, onMoveUp, onMoveDown }) => {
    const config = BLOCK_TYPES[block.type];
    const isPositive = block.energyImpact > 0;

    return (
        <div className="group relative flex items-center gap-4 mb-6 animate-in slide-in-from-left duration-500 fill-mode-backwards" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="absolute left-[23px] w-3 h-3 bg-black border-2 border-white/20 rounded-full z-20 group-hover:border-forge-cyan group-hover:scale-125 transition-all" />
            <div className="w-12 h-0.5 bg-white/10 group-hover:bg-white/30 transition-colors ml-7" />
            <div className="flex-1 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all hover:-translate-y-1 hover:shadow-lg relative">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg bg-white/5", config.color)}><config.icon size={16} /></div>
                        <div>
                            <h4 className="text-white font-medium text-sm">{block.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase mt-0.5">
                                <span>{block.duration} min</span><span className="w-1 h-1 rounded-full bg-gray-600" /><span className={isPositive ? 'text-green-400' : 'text-orange-400'}>{isPositive ? '+' : ''}{block.energyImpact} Energy</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={onMoveUp} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"><ArrowUp size={12} /></button>
                        <button onClick={onMoveDown} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"><ArrowDown size={12} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailPanel: React.FC<{ routine: Routine | null; onClose: () => void; onOptimize: () => void; isOptimizing: boolean }> = ({ routine, onClose, onOptimize, isOptimizing }) => {
    if (!routine) return null;
    const config = TYPE_CONFIG[routine.type];

    return (
        <div className="absolute inset-y-0 right-0 w-full md:w-[450px] bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br", config.gradient)}><config.icon size={18} className="text-white" /></div>
                    <div><h2 className="text-lg font-display font-bold text-white leading-tight">{routine.title}</h2><div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{routine.totalDuration} Minutes • {config.label}</div></div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5"><div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Net Energy</div><div className="text-2xl font-bold text-white flex items-center gap-2"><Zap size={18} className="text-yellow-400" />{routine.blocks.reduce((acc, b) => acc + b.energyImpact, 0)}</div></div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5"><div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Blocks</div><div className="text-2xl font-bold text-white">{routine.blocks.length}</div></div>
                </div>
                <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-white flex items-center gap-2"><Sparkles size={14} className="text-forge-accent" /> Flow Analysis</h3>{!routine.analysis && (<button onClick={onOptimize} disabled={isOptimizing} className="text-xs bg-white/5 hover:bg-forge-accent hover:text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50">{isOptimizing ? 'Calculating...' : 'Analyze Flow'}</button>)}</div>
                    {routine.analysis ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <GlassCard className="bg-gradient-to-br from-forge-accent/10 to-transparent border-forge-accent/20 relative overflow-hidden" noPadding><div className="p-4 relative z-10"><div className="text-[10px] text-forge-accent font-mono uppercase tracking-widest mb-2">Optimization</div><p className="text-sm text-white italic">"{routine.analysis.flowSuggestion}"</p></div></GlassCard>
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5"><div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Start Time</div><p className="text-sm text-gray-300">{routine.analysis.recommendedStartTime}</p></div>
                        </div>
                    ) : (<div className="text-center py-8 border border-dashed border-white/10 rounded-xl"><p className="text-xs text-gray-500">Activate AI to optimize energy flow.</p></div>)}
                </div>
            </div>
        </div>
    );
};

export const RoutinesView: React.FC = () => {
    const [routines, setRoutines] = useState<Routine[]>(MOCK_ROUTINES);
    const [selectedId, setSelectedId] = useState<string | null>(MOCK_ROUTINES[0].id);
    const [activeTab, setActiveTab] = useState<RoutineType>('morning');
    const [isOptimizing, setIsOptimizing] = useState(false);

    const selectedRoutine = routines.find(r => r.id === selectedId) || null;
    const handleOptimize = async () => { if (!selectedRoutine) return; setIsOptimizing(true); try { const analysis = await optimizeRoutine(selectedRoutine.blocks, selectedRoutine.type); setRoutines(prev => prev.map(r => r.id === selectedRoutine.id ? { ...r, analysis } : r)); } catch (e) { console.error(e); } finally { setIsOptimizing(false); } };

    return (
        <div className="h-full flex bg-forge-bg text-white relative overflow-hidden animate-in fade-in duration-700">
            <div className="flex-1 h-full overflow-y-auto relative scrollbar-hide flex flex-col">
                <div className="p-8 pb-4 z-10 bg-gradient-to-b from-forge-bg to-transparent">
                    <div className="flex justify-between items-end mb-6">
                        <div><h1 className="text-3xl font-display font-bold text-white flex items-center gap-3"><Clock className="text-forge-cyan" /> Rhythm Engine</h1><p className="text-sm text-gray-500 mt-2 max-w-xl">Architecting daily flow and energy cycles.</p></div>
                        <button className="px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 flex items-center gap-2"><Plus size={16} /> Create Rhythm</button>
                    </div>
                    <div className="flex gap-2">
                        {(Object.keys(TYPE_CONFIG) as RoutineType[]).map(t => {
                            const config = TYPE_CONFIG[t];
                            return (<button key={t} onClick={() => setActiveTab(t)} className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2", activeTab === t ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5')}><config.icon size={14} />{config.label}</button>);
                        })}
                    </div>
                </div>
                <div className="flex-1 relative px-12 py-8 overflow-y-auto">
                    <div className="absolute left-[42px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    <div className="max-w-3xl">
                        {routines.filter(r => r.type === activeTab).map(routine => (
                            <div key={routine.id} className="mb-12">
                                <div onClick={() => setSelectedId(routine.id)} className="cursor-pointer group mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full bg-forge-cyan border-4 border-forge-bg shadow-[0_0_15px_#22D3EE] z-10 relative" />
                                        <h2 className="text-xl font-display font-bold text-white group-hover:text-forge-cyan transition-colors">{routine.title}</h2>
                                        {routine.id === selectedId && <div className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-300">Editing</div>}
                                    </div>
                                </div>
                                <div className="pl-2">{routine.blocks.map((block, index) => <RoutineBlockCard key={block.id} block={block} index={index} onMoveUp={() => {}} onMoveDown={() => {}} />)}</div>
                                <div className="flex items-center gap-4 pl-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer group">
                                     <div className="w-3 h-3 rounded-full bg-gray-700 border-2 border-forge-bg z-10 ml-[11px]" /><div className="w-12 h-0.5 bg-white/10 ml-3" /><div className="px-4 py-2 rounded-lg border border-dashed border-white/20 text-xs text-gray-500 group-hover:text-white group-hover:border-white/40">+ Add Step</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedRoutine && <DetailPanel routine={selectedRoutine} onClose={() => setSelectedId(null)} onOptimize={handleOptimize} isOptimizing={isOptimizing} />}
        </div>
    );
};
