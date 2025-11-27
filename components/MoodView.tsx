
import React, { useState } from 'react';
import { 
  Plus, 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  Activity, 
  MoreHorizontal, 
  X,
  Zap,
  Cloud,
  Sun,
  Moon,
  Droplets,
  Flame,
  Heart,
  Anchor,
  Wind,
  Ghost,
  Smile,
  Frown
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { MoodEntry, MoodType, MoodAnalysis } from '../types';
import { analyzeMoodPatterns } from '../services/geminiService';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { cn } from '../lib/utils';

// --- CONFIG ---

interface MoodConfigItem {
    color: string; // Text color
    bg: string; // Background/Glow color
    icon: React.ElementType;
    label: string;
    weight: number; // For graph Y-axis (approximate emotional energy)
}

const MOOD_CONFIG: Record<MoodType, MoodConfigItem> = {
    joy: { color: 'text-yellow-400', bg: 'bg-yellow-500', icon: Sun, label: 'Joy', weight: 9 },
    calm: { color: 'text-cyan-400', bg: 'bg-cyan-500', icon: Anchor, label: 'Calm', weight: 6 },
    inspired: { color: 'text-fuchsia-400', bg: 'bg-fuchsia-500', icon: Sparkles, label: 'Inspired', weight: 10 },
    neutral: { color: 'text-gray-300', bg: 'bg-gray-500', icon: Cloud, label: 'Neutral', weight: 5 },
    sad: { color: 'text-indigo-400', bg: 'bg-indigo-500', icon: Droplets, label: 'Sad', weight: 2 },
    stressed: { color: 'text-red-400', bg: 'bg-red-500', icon: Zap, label: 'Stressed', weight: 3 },
    lonely: { color: 'text-blue-400', bg: 'bg-blue-500', icon: Ghost, label: 'Lonely', weight: 1 },
    angry: { color: 'text-rose-600', bg: 'bg-rose-600', icon: Flame, label: 'Angry', weight: 8 }, // High energy, negative
    energetic: { color: 'text-lime-400', bg: 'bg-lime-500', icon: Activity, label: 'Energetic', weight: 9 },
    empty: { color: 'text-stone-400', bg: 'bg-stone-500', icon: Moon, label: 'Empty', weight: 0 },
    // Legacy mapping
    focused: { color: 'text-emerald-400', bg: 'bg-emerald-500', icon: Activity, label: 'Focused', weight: 7 },
    anxious: { color: 'text-orange-400', bg: 'bg-orange-500', icon: Wind, label: 'Anxious', weight: 4 },
    tired: { color: 'text-slate-400', bg: 'bg-slate-500', icon: Moon, label: 'Tired', weight: 2 },
};

// --- MOCK DATA ---

const MOCK_HISTORY: MoodEntry[] = [
    { id: '1', mood: 'joy', intensity: 8, note: 'Great morning meeting', tags: ['Work'], date: new Date(Date.now() - 86400000 * 6) },
    { id: '2', mood: 'anxious', intensity: 6, note: 'Deadline approaching', tags: ['Work', 'Stress'], date: new Date(Date.now() - 86400000 * 5) },
    { id: '3', mood: 'calm', intensity: 7, note: 'Meditation', tags: ['Health'], date: new Date(Date.now() - 86400000 * 4) },
    { id: '4', mood: 'tired', intensity: 5, note: 'Late night coding', tags: ['Work'], date: new Date(Date.now() - 86400000 * 3) },
    { id: '5', mood: 'inspired', intensity: 9, note: 'New project idea', tags: ['Creativity'], date: new Date(Date.now() - 86400000 * 2) },
    { id: '6', mood: 'joy', intensity: 8, note: 'Coffee with friend', tags: ['Social'], date: new Date(Date.now() - 86400000 * 1) },
    { id: '7', mood: 'calm', intensity: 8, note: 'Starting the day fresh', tags: ['Morning'], date: new Date() },
];

// --- SUB-COMPONENTS ---

const AddMoodModal: React.FC<{ onClose: () => void; onSave: (e: MoodEntry) => void }> = ({ onClose, onSave }) => {
    const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
    const [intensity, setIntensity] = useState(5);
    const [note, setNote] = useState('');
    const [step, setStep] = useState<1|2>(1);

    const handleSave = () => {
        if (!selectedMood) return;
        const newEntry: MoodEntry = {
            id: Date.now().toString(),
            mood: selectedMood,
            intensity,
            note,
            tags: [], // Todo: Add tag selector
            date: new Date()
        };
        onSave(newEntry);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                
                <div className="p-8 relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-display font-bold text-white">Emotional Log</h2>
                            <p className="text-sm text-gray-400">How does the inner world feel right now?</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white"><X size={20}/></button>
                    </div>

                    {step === 1 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {(Object.keys(MOOD_CONFIG) as MoodType[]).slice(0, 10).map(mood => {
                                const config = MOOD_CONFIG[mood];
                                return (
                                    <button
                                        key={mood}
                                        onClick={() => { setSelectedMood(mood); setStep(2); }}
                                        className="group flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-lg transition-all group-hover:scale-110 ${config.color.replace('text-', 'bg-')}/20`}>
                                            <config.icon size={24} className={config.color} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-300 group-hover:text-white capitalize">{config.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-right duration-300">
                            {/* Selected Mood Indicator */}
                            <div className="flex items-center gap-4 mb-6">
                                <button onClick={() => setStep(1)} className="text-xs text-gray-500 hover:text-white">← Change</button>
                                <div className="flex items-center gap-2 text-xl font-bold text-white capitalize">
                                    <div className={`w-3 h-3 rounded-full ${MOOD_CONFIG[selectedMood!].bg}`} />
                                    {selectedMood}
                                </div>
                            </div>

                            {/* Intensity Slider */}
                            <div>
                                <div className="flex justify-between text-sm text-gray-400 mb-2">
                                    <span>Intensity</span>
                                    <span className="text-white font-mono">{intensity}/10</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" max="10" 
                                    value={intensity}
                                    onChange={e => setIntensity(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-forge-accent"
                                />
                                <div className="flex justify-between text-[10px] text-gray-600 mt-1 font-mono uppercase">
                                    <span>Subtle</span>
                                    <span>Overwhelming</span>
                                </div>
                            </div>

                            {/* Note Input */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Context / Triggers</label>
                                <textarea 
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    placeholder="Why do you feel this way?"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-forge-accent focus:outline-none h-24 resize-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button onClick={handleSave} className="px-6 py-3 bg-forge-accent text-white rounded-xl font-medium hover:bg-forge-accent/80 shadow-lg shadow-forge-accent/20 w-full sm:w-auto">
                                    Log Emotion
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InsightPanel: React.FC<{ analysis: MoodAnalysis | null; isAnalyzing: boolean }> = ({ analysis, isAnalyzing }) => {
    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-12 h-12 rounded-full border-2 border-forge-accent border-t-transparent animate-spin mb-4" />
                <p className="text-gray-400">Detecting emotional patterns...</p>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
                <Sparkles size={32} className="mb-4 opacity-30" />
                <p>No patterns detected yet. Log more data to unlock insights.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            
            {/* Prediction Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-forge-accent/10 to-transparent border border-forge-accent/20 relative overflow-hidden">
                 <div className="absolute -right-4 -top-4 w-24 h-24 bg-forge-accent/20 blur-2xl rounded-full pointer-events-none" />
                 <div className="relative z-10">
                     <div className="flex items-center gap-2 text-xs font-bold text-forge-accent uppercase tracking-widest mb-2">
                         <Activity size={12} /> Forecast
                     </div>
                     <p className="text-white font-medium leading-relaxed">"{analysis.prediction}"</p>
                 </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Trend</div>
                    <div className="text-lg text-white">{analysis.overallTrend}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Triggers</div>
                    <div className="text-sm text-gray-300 flex flex-wrap gap-1">
                        {analysis.triggers.map(t => <span key={t} className="bg-white/10 px-1.5 rounded">{t}</span>)}
                    </div>
                </div>
            </div>

            {/* Deep Insight */}
            <div>
                <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Pattern Analysis</h4>
                <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-white/10 pl-4">
                    {analysis.insight}
                </p>
            </div>

            {/* Action */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                 <div className="text-[10px] text-forge-cyan uppercase tracking-widest mb-2">Recommendation</div>
                 <p className="text-sm text-gray-400 italic">{analysis.actionableStep}</p>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export const MoodView: React.FC = () => {
    const [history, setHistory] = useState<MoodEntry[]>(MOCK_HISTORY);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleSave = (entry: MoodEntry) => {
        setHistory(prev => [...prev, entry]);
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const result = await analyzeMoodPatterns(history);
            setAnalysis(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Prepare data for graph
    // We map dates to X and intensity * weight to Y
    const graphData = history.map(entry => {
        const config = MOOD_CONFIG[entry.mood];
        return {
            date: entry.date.toLocaleDateString([], { weekday: 'short' }),
            fullDate: entry.date.toLocaleDateString(),
            value: entry.intensity, // Could multiply by config.weight for "Energy" vs "Intensity"
            mood: entry.mood,
            color: config.bg.replace('bg-', '#') // Approximation for Recharts color
        };
    });

    return (
        <div className="h-full flex bg-forge-bg text-white relative overflow-hidden animate-in fade-in duration-700">
            
            {/* Left/Main Section */}
            <div className="flex-1 h-full flex flex-col relative z-10 overflow-hidden">
                
                {/* Top Bar */}
                <div className="shrink-0 px-8 py-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">Emotional Resonance</h1>
                        <p className="text-xs text-gray-500 mt-1 font-mono">Tracking internal weather patterns.</p>
                    </div>
                    <div className="flex gap-3">
                         <button 
                             onClick={handleAnalyze}
                             disabled={isAnalyzing}
                             className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-300 transition-all flex items-center gap-2"
                         >
                             <Sparkles size={16} className={isAnalyzing ? 'animate-spin' : 'text-forge-accent'} />
                             Analyze Cycles
                         </button>
                         <button 
                             onClick={() => setIsModalOpen(true)}
                             className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                         >
                             <Plus size={16} /> Log Mood
                         </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-8 scrollbar-hide">
                    
                    {/* Chart Area */}
                    <div className="h-64 w-full mb-12">
                        <GlassCard className="h-full relative overflow-hidden" noPadding>
                            <div className="absolute top-4 left-6 z-10">
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={14} className="text-forge-cyan" /> Resonance Frequency
                                </h3>
                            </div>
                            <div className="w-full h-full pt-12 pr-0 pb-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={graphData}>
                                        <defs>
                                            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#FBBF24" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} strokeDasharray="3 3" />
                                        <XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '8px' }}
                                            itemStyle={{ fontSize: '12px' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#FBBF24" fill="url(#moodGradient)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Recent Logs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
                        {history.slice().reverse().map((entry) => {
                            const config = MOOD_CONFIG[entry.mood];
                            return (
                                <div key={entry.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-lg bg-white/5", config.color)}>
                                                <config.icon size={18} />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold capitalize">{entry.mood}</div>
                                                <div className="text-[10px] text-gray-500">{entry.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs font-mono text-gray-600">Int: {entry.intensity}</div>
                                    </div>
                                    {entry.note && <p className="text-xs text-gray-400 line-clamp-2">{entry.note}</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Right Panel: Analysis (Desktop Only) */}
            <div className="hidden xl:block w-80 border-l border-white/5 bg-black/20 backdrop-blur-xl">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Pattern Recognition</h3>
                </div>
                <InsightPanel analysis={analysis} isAnalyzing={isAnalyzing} />
            </div>

            {isModalOpen && <AddMoodModal onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
        </div>
    );
};
