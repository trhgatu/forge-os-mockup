
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Heart, Briefcase, Users, Flag, Plus, Filter, Search, Sparkles, ChevronRight, X, Brain, Target, Calendar } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Achievement, AchievementCategory, MoodType } from '../types';
import { analyzeAchievement } from '../services/geminiService';
import { cn } from '../lib/utils';

const CATEGORY_CONFIG: Record<AchievementCategory, { color: string, bg: string, icon: React.ElementType }> = {
    Work: { color: 'text-blue-400', bg: 'bg-blue-500', icon: Briefcase },
    Health: { color: 'text-emerald-400', bg: 'bg-emerald-500', icon: Heart },
    Personal: { color: 'text-violet-400', bg: 'bg-violet-500', icon: Brain },
    Creative: { color: 'text-pink-400', bg: 'bg-pink-500', icon: Sparkles },
    Social: { color: 'text-amber-400', bg: 'bg-amber-500', icon: Users },
    Milestone: { color: 'text-cyan-400', bg: 'bg-cyan-500', icon: Flag },
};

const MOCK_ACHIEVEMENTS: Achievement[] = [
    { id: '1', title: 'Forge OS 1.0 Launch', description: 'Deployed the first stable version of the operating system.', date: new Date(), category: 'Work', tags: ['Code', 'Launch'], moodSnapshot: 'inspired', energySnapshot: 90, analysis: { significanceScore: 9, identityShift: "You are a Builder.", growthPattern: "High stress -> High reward", emotionalDriver: "Ambition" } },
    { id: '2', title: 'Marathon Completed', description: 'Finished in under 4 hours.', date: new Date(Date.now() - 86400000 * 10), category: 'Health', tags: ['Run', 'Endurance'], moodSnapshot: 'tired', energySnapshot: 20 },
    { id: '3', title: 'Public Speaking', description: 'Gave a talk at the tech meetup.', date: new Date(Date.now() - 86400000 * 40), category: 'Personal', tags: ['Fear', 'Growth'], moodSnapshot: 'anxious', energySnapshot: 60 },
    { id: '4', title: 'Art Gallery Feature', description: 'Had 3 pieces displayed.', date: new Date(Date.now() - 86400000 * 60), category: 'Creative', tags: ['Art'], moodSnapshot: 'joy', energySnapshot: 85 },
];

const AchievementNode: React.FC<{ achievement: Achievement; isSelected: boolean; onClick: () => void; index: number }> = ({ achievement, isSelected, onClick, index }) => {
    const config = CATEGORY_CONFIG[achievement.category];
    const top = 50 + (index % 2 === 0 ? -20 : 20) * (index % 3 + 1); 

    return (
        <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${(index + 1) * 200}px`, top: `${top}%` }}
            onClick={onClick}
        >
            {isSelected && (
                <div className={cn("absolute inset-0 -m-4 rounded-full blur-xl opacity-40 animate-pulse-slow", config.bg)} />
            )}
            <div className={cn(
                "w-4 h-4 rounded-full border-2 transition-all duration-500 relative z-10",
                isSelected ? cn("scale-150 bg-white border-white shadow-[0_0_20px_white]") : cn("bg-black border-white/30 group-hover:scale-125 group-hover:border-white")
            )} />
            <div className={cn("absolute top-8 left-1/2 -translate-x-1/2 w-48 text-center transition-all duration-300", isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0')}>
                <div className="text-[10px] font-mono text-gray-500 mb-1">{achievement.date.toLocaleDateString()}</div>
                <div className={cn("text-sm font-bold", config.color)}>{achievement.title}</div>
            </div>
        </div>
    );
};

const ConstellationTimeline: React.FC<{ achievements: Achievement[]; onSelect: (id: string) => void; selectedId: string | null }> = ({ achievements, onSelect, selectedId }) => {
    const sorted = [...achievements].sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
        <div className="h-96 w-full relative overflow-x-auto overflow-y-hidden scrollbar-hide group cursor-grab active:cursor-grabbing bg-gradient-to-b from-[#050505] to-[#0B0B15] border-y border-white/5">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            <svg className="absolute inset-0 w-[2000px] h-full pointer-events-none">
                <path d={`M 0 ${300/2} ${sorted.map((_, i) => `L ${(i + 1) * 200} ${300/2 + (i % 2 === 0 ? -20 : 20) * (i % 3 + 1) * 3}`).join(' ')}`} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </svg>
            <div className="relative w-[2000px] h-full">
                {sorted.map((a, i) => <AchievementNode key={a.id} achievement={a} index={i} isSelected={selectedId === a.id} onClick={() => onSelect(a.id)} />)}
            </div>
        </div>
    );
};

const AchievementCard: React.FC<{ achievement: Achievement; onClick: () => void }> = ({ achievement, onClick }) => {
    const config = CATEGORY_CONFIG[achievement.category];
    return (
        <GlassCard className="cursor-pointer group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden" onClick={onClick}>
            <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full transition-opacity group-hover:opacity-100 opacity-0 pointer-events-none", config.bg.replace('bg-', 'from-'))} />
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-2 rounded-lg bg-white/5", config.color)}><config.icon size={18} /></div>
                    <div className="text-[10px] font-mono text-gray-500">{achievement.date.toLocaleDateString()}</div>
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-forge-cyan transition-colors">{achievement.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{achievement.description}</p>
                <div className="flex gap-2">{achievement.tags.map(t => <span key={t} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-gray-400">#{t}</span>)}</div>
            </div>
        </GlassCard>
    );
};

const DetailPanel: React.FC<{ achievement: Achievement | null; onClose: () => void; onAnalyze: () => void; isAnalyzing: boolean }> = ({ achievement, onClose, onAnalyze, isAnalyzing }) => {
    if (!achievement) return null;
    const config = CATEGORY_CONFIG[achievement.category];

    return (
        <div className="absolute inset-y-0 right-0 w-full md:w-[500px] bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b border-white/5 relative overflow-hidden">
                <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", config.bg.replace('bg-', 'from-'), "to-transparent")} />
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider mb-4", config.color)}>
                            <config.icon size={12} /> {achievement.category}
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white leading-tight">{achievement.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X size={20} /></button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="text-base text-gray-300 leading-relaxed">{achievement.description}</div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Mood State</div>
                        <div className="text-white font-medium capitalize">{achievement.moodSnapshot}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Energy Level</div>
                        <div className="text-white font-medium flex items-center gap-2"><Zap size={14} className="text-yellow-400" /> {achievement.energySnapshot}%</div>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2"><Sparkles size={14} className="text-forge-accent" /> Neural Reflection</h3>
                        {!achievement.analysis && (
                            <button onClick={onAnalyze} disabled={isAnalyzing} className="text-xs bg-white/5 hover:bg-forge-accent hover:text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2">
                                {isAnalyzing ? <Sparkles size={12} className="animate-spin" /> : <Target size={12} />} {isAnalyzing ? 'Analyzing...' : 'Analyze Impact'}
                            </button>
                        )}
                    </div>
                    {achievement.analysis ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                                <div className="text-[10px] text-forge-accent font-bold uppercase tracking-widest mb-2">Identity Shift</div>
                                <p className="text-sm text-white italic">"{achievement.analysis.identityShift}"</p>
                            </div>
                            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Growth Pattern</div>
                                <p className="text-sm text-gray-300">{achievement.analysis.growthPattern}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                            <p className="text-xs text-gray-500">Consult the Neural Core to understand the significance of this moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CreateAchievementModal: React.FC<{ onClose: () => void; onSave: (a: Achievement) => void }> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState<AchievementCategory>('Personal');
    const [mood, setMood] = useState<MoodType>('joy');
    
    const handleSave = () => {
        if (!title) return;
        onSave({ id: Date.now().toString(), title, description: desc, date: new Date(), category, tags: [], moodSnapshot: mood, energySnapshot: 80 });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                <div className="p-8 border-b border-white/5 flex justify-between items-center relative z-10">
                    <div><h3 className="text-xl font-display font-bold text-white">Archive Achievement</h3><p className="text-sm text-gray-400">Chronicle a moment of growth.</p></div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
                </div>
                <div className="p-8 space-y-6 relative z-10">
                    <input className="w-full bg-transparent border-b border-white/10 py-2 text-2xl font-display font-bold text-white placeholder-white/20 focus:border-forge-accent focus:outline-none" placeholder="What did you achieve?" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
                    <div className="flex gap-2 flex-wrap">
                        {(Object.keys(CATEGORY_CONFIG) as AchievementCategory[]).map(c => {
                            const config = CATEGORY_CONFIG[c];
                            return (
                                <button key={c} onClick={() => setCategory(c)} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all", category === c ? `bg-white/10 text-white border-white/20` : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5')}>
                                    <config.icon size={12} /> {c}
                                </button>
                            );
                        })}
                    </div>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-forge-accent focus:outline-none h-32 resize-none text-sm leading-relaxed" placeholder="Describe the significance..." value={desc} onChange={e => setDesc(e.target.value)} />
                </div>
                <div className="p-8 border-t border-white/5 flex justify-end gap-3 relative z-10">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" /> Save to Archive
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AchievementsView: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // Filters
    const [showFilters, setShowFilters] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<AchievementCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const selectedAchievement = achievements.find(a => a.id === selectedId) || null;

    const filteredAchievements = achievements.filter(a => {
        const matchesCategory = categoryFilter === 'All' || a.category === categoryFilter;
        const matchesSearch = searchQuery === '' || 
                              a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        
        let matchesDate = true;
        if (startDate) {
            matchesDate = matchesDate && new Date(a.date) >= new Date(startDate);
        }
        if (endDate) {
            matchesDate = matchesDate && new Date(a.date) <= new Date(endDate);
        }

        return matchesCategory && matchesSearch && matchesDate;
    });

    const handleAnalyze = async () => {
        if (!selectedAchievement) return;
        setIsAnalyzing(true);
        try {
            const analysis = await analyzeAchievement(selectedAchievement.title, selectedAchievement.description, selectedAchievement.category);
            setAchievements(prev => prev.map(a => a.id === selectedAchievement.id ? { ...a, analysis } : a));
        } catch (e) { console.error(e); } finally { setIsAnalyzing(false); }
    };

    return (
        <div className="h-full flex bg-[#050505] text-white relative overflow-hidden animate-in fade-in duration-1000">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#09090b] to-black pointer-events-none" />
            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10 flex flex-col">
                <div className="p-6 md:p-8 pb-0">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <div className="text-xs font-mono text-forge-cyan uppercase tracking-widest mb-2">Personal Evolution</div>
                            <h1 className="text-4xl font-display font-bold text-white flex items-center gap-3">Achievement Archive</h1>
                            <p className="text-sm text-gray-500 mt-2">A chronicle of what you've become.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right px-4 border-r border-white/10">
                                <div className="text-2xl font-bold text-white">{achievements.length}</div>
                                <div className="text-[10px] text-gray-500 uppercase">Lifetime</div>
                            </div>
                            <button onClick={() => setIsCreating(true)} className="px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2">
                                <Plus size={18} /> Log Achievement
                            </button>
                        </div>
                    </div>
                </div>

                {/* Constellation Timeline */}
                <div className="w-full mb-8 relative">
                    <div className="absolute top-4 left-8 text-[10px] font-mono text-gray-500 uppercase tracking-widest z-10">Cosmic Timeline</div>
                    <ConstellationTimeline achievements={filteredAchievements} onSelect={setSelectedId} selectedId={selectedId} />
                </div>

                {/* Grid View */}
                <div className="flex-1 px-6 md:px-8 pb-32">
                    <div className="flex items-center justify-between mb-6">
                         <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2"><Trophy size={16} className="text-yellow-500" /> Vault</h3>
                         <div className="flex gap-2">
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={cn("p-2 rounded-lg transition-all", showFilters ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white')}
                            >
                                <Filter size={16}/>
                            </button>
                         </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mb-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 animate-in slide-in-from-top-2 backdrop-blur-md">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs text-gray-500 font-mono uppercase mb-3">Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button 
                                            onClick={() => setCategoryFilter('All')}
                                            className={cn("px-3 py-1.5 rounded-lg text-xs border transition-all", categoryFilter === 'All' ? 'bg-white text-black border-white font-bold' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30')}
                                        >
                                            All
                                        </button>
                                        {Object.keys(CATEGORY_CONFIG).map(c => (
                                            <button 
                                                key={c}
                                                onClick={() => setCategoryFilter(c as AchievementCategory)}
                                                className={cn("px-3 py-1.5 rounded-lg text-xs border transition-all", categoryFilter === c ? 'bg-white text-black border-white font-bold' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30')}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 font-mono uppercase mb-3">Date Range</label>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-forge-accent/50" />
                                        </div>
                                        <span className="text-gray-500 text-xs">to</span>
                                        <div className="relative flex-1">
                                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-forge-accent/50" />
                                        </div>
                                    </div>
                                </div>
                                 <div>
                                    <label className="block text-xs text-gray-500 font-mono uppercase mb-3">Search & Tags</label>
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input 
                                            type="text" 
                                            value={searchQuery} 
                                            onChange={e => setSearchQuery(e.target.value)} 
                                            placeholder="Filter by title or #tag..." 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-forge-accent/50 placeholder-gray-600 transition-colors" 
                                        />
                                        {searchQuery && (
                                            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAchievements.length > 0 ? (
                            filteredAchievements.map(achievement => (
                                <AchievementCard key={achievement.id} achievement={achievement} onClick={() => setSelectedId(achievement.id)} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                                <Trophy size={32} className="mx-auto mb-4 text-white/10" />
                                <p className="text-gray-500">No artifacts found matching your criteria.</p>
                                <button onClick={() => {setCategoryFilter('All'); setSearchQuery(''); setStartDate(''); setEndDate('');}} className="text-xs text-forge-cyan mt-2 hover:underline">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebars & Modals */}
            {selectedAchievement && <DetailPanel achievement={selectedAchievement} onClose={() => setSelectedId(null)} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />}
            {isCreating && <CreateAchievementModal onClose={() => setIsCreating(false)} onSave={(a) => setAchievements([a, ...achievements])} />}
        </div>
    );
};
