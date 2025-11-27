
import React, { useState, useEffect } from 'react';
import { 
    Mic2, 
    Sparkles, 
    Sun, 
    Moon, 
    Leaf, 
    Sprout, 
    Snowflake,
    Play,
    Pause,
    Plus,
    X,
    Maximize2,
    Minimize2,
    Fingerprint,
    Compass,
    Ghost,
    ArrowRight
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Mantra, MantraType, Season } from '../types';
import { analyzeMantra } from '../services/geminiService';
import { cn } from '../lib/utils';
import { useSound } from '../contexts/SoundContext';

// --- VISUAL CONSTANTS ---

const SEASON_STYLES: Record<Season, { 
    bg: string; 
    border: string; 
    accent: string; 
    icon: React.ElementType; 
    particle: string;
    text: string;
}> = {
    Spring: {
        bg: 'bg-emerald-900/10',
        border: 'border-emerald-500/20',
        accent: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
        icon: Sprout,
        particle: 'bg-emerald-200',
        text: 'text-emerald-400'
    },
    Summer: {
        bg: 'bg-amber-900/10',
        border: 'border-amber-500/20',
        accent: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
        icon: Sun,
        particle: 'bg-amber-200',
        text: 'text-amber-400'
    },
    Autumn: {
        bg: 'bg-orange-900/10',
        border: 'border-orange-500/20',
        accent: 'shadow-[0_0_30px_rgba(249,115,22,0.2)]',
        icon: Leaf,
        particle: 'bg-orange-300',
        text: 'text-orange-400'
    },
    Winter: {
        bg: 'bg-slate-900/10',
        border: 'border-indigo-500/20',
        accent: 'shadow-[0_0_30px_rgba(99,102,241,0.2)]',
        icon: Snowflake,
        particle: 'bg-indigo-200',
        text: 'text-indigo-400'
    }
};

const MANTRA_TYPE_ICONS: Record<MantraType, React.ElementType> = {
    Daily: Sun,
    Seasonal: Compass,
    Identity: Fingerprint,
    Shadow: Ghost,
    Compass: Compass
};

const MOCK_MANTRAS: Mantra[] = [
    {
        id: '1',
        text: "Đi tận cùng chiều sâu, nhưng tâm không lạc.",
        type: 'Identity',
        season: 'Autumn',
        isActive: true,
        dateCreated: new Date(),
        analysis: {
            season: 'Autumn',
            tone: 'Vững Chãi',
            archetype: 'Warrior',
            novaWhisper: "Vững vàng giữa những tầng sâu của ý thức."
        }
    },
    {
        id: '2',
        text: "Nhẹ như sương, thực như đất.",
        type: 'Daily',
        season: 'Spring',
        isActive: true,
        dateCreated: new Date(),
        analysis: {
            season: 'Spring',
            tone: 'Thanh Thoát',
            archetype: 'Explorer',
            novaWhisper: "Một sự hiện diện không cần sức nặng."
        }
    },
    {
        id: '3',
        text: "Trong thinh lặng, ta kiến tạo chính mình.",
        type: 'Shadow',
        season: 'Winter',
        isActive: false,
        dateCreated: new Date(Date.now() - 86400000),
        analysis: {
            season: 'Winter',
            tone: 'Tĩnh Tại',
            archetype: 'Sage',
            novaWhisper: "Tiếng ồn tắt đi để sự thật lên tiếng."
        }
    }
];

// --- SUB-COMPONENTS ---

const MantraCard: React.FC<{ 
    mantra: Mantra; 
    onClick: () => void; 
    isActive: boolean;
}> = ({ mantra, onClick, isActive }) => {
    const seasonStyle = SEASON_STYLES[mantra.season];
    const TypeIcon = MANTRA_TYPE_ICONS[mantra.type];

    return (
        <div 
            onClick={onClick}
            className={cn(
                "group relative p-6 rounded-2xl border transition-all duration-700 cursor-pointer overflow-hidden backdrop-blur-sm",
                seasonStyle.bg,
                seasonStyle.border,
                isActive ? seasonStyle.accent : 'hover:bg-white/[0.02]'
            )}
        >
            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                {[...Array(5)].map((_, i) => (
                    <div 
                        key={i}
                        className={cn("absolute rounded-full w-1 h-1 animate-float", seasonStyle.particle)}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col h-full min-h-[160px]">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">
                        <TypeIcon size={12} /> {mantra.type}
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                </div>

                <div className="flex-1 flex items-center">
                    <p className={cn(
                        "font-display text-xl md:text-2xl leading-relaxed transition-colors duration-500 font-medium",
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                    )}>
                        "{mantra.text}"
                    </p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className={cn("text-[10px] font-mono", seasonStyle.text)}>
                        {mantra.season} Resonance
                    </div>
                    {mantra.analysis && <Sparkles size={12} className={seasonStyle.text} />}
                </div>
            </div>
        </div>
    );
};

const FocusSurface: React.FC<{ mantra: Mantra }> = ({ mantra }) => {
    const seasonStyle = SEASON_STYLES[mantra.season];
    
    return (
        <div className="relative w-full h-[400px] mb-12 rounded-[2rem] overflow-hidden border border-white/10 flex flex-col items-center justify-center text-center p-8 group">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl z-0" />
            <div className={cn("absolute inset-0 opacity-20 transition-all duration-1000 bg-gradient-to-br from-transparent to-transparent", seasonStyle.bg.replace('bg-', 'via-'))} />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
            
            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto">
                <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-black/20 backdrop-blur-md text-xs font-mono mb-8 uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-1000", seasonStyle.border, seasonStyle.text)}>
                    <seasonStyle.icon size={12} /> Current Anchor
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-8 tracking-tight drop-shadow-2xl animate-in zoom-in-95 duration-1000 ease-out">
                    "{mantra.text}"
                </h1>

                {mantra.analysis && (
                    <div className="text-sm md:text-base text-gray-400 font-light italic max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                        {mantra.analysis.novaWhisper}
                    </div>
                )}
            </div>
        </div>
    );
};

const MantraDetailPanel: React.FC<{ 
    mantra: Mantra | null; 
    onClose: () => void;
}> = ({ mantra, onClose }) => {
    if (!mantra) return null;
    const seasonStyle = SEASON_STYLES[mantra.season];

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-black/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b border-white/5 flex justify-between items-start bg-black/40">
                <div>
                    <div className={cn("flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2", seasonStyle.text)}>
                        <seasonStyle.icon size={14} /> Season of {mantra.season}
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white leading-tight">Mantra Detail</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                
                {/* Main Text */}
                <div>
                    <p className="text-3xl font-display text-white leading-snug">"{mantra.text}"</p>
                </div>

                {/* Analysis Grid */}
                {mantra.analysis && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Tone</div>
                            <div className="text-white font-medium">{mantra.analysis.tone}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Archetype</div>
                            <div className="text-white font-medium">{mantra.analysis.archetype}</div>
                        </div>
                    </div>
                )}

                {/* Nova Whisper Box */}
                {mantra.analysis && (
                    <div className={cn("p-6 rounded-2xl border relative overflow-hidden", seasonStyle.border, seasonStyle.bg)}>
                        <div className="relative z-10">
                            <div className={cn("flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-3", seasonStyle.text)}>
                                <Sparkles size={12} /> Nova Reflection
                            </div>
                            <p className="text-lg text-gray-200 font-light italic leading-relaxed">
                                "{mantra.analysis.novaWhisper}"
                            </p>
                        </div>
                    </div>
                )}

                {/* Timeline Integration (Mock) */}
                <div className="pt-8 border-t border-white/5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Integration History</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            <span>Active during 3 Journal Entries</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            <span>Aligned with 'Builder' Identity Phase</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MantraComposer: React.FC<{ 
    onClose: () => void; 
    onSave: (m: Mantra) => void;
}> = ({ onClose, onSave }) => {
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [previewAnalysis, setPreviewAnalysis] = useState<Mantra['analysis'] | null>(null);
    const [selectedType, setSelectedType] = useState<MantraType>('Daily');

    const handleRefine = async (direction: 'deeper' | 'softer' | 'darker') => {
        // Mock refinement logic - In reality, this would call Gemini
        const variations = {
            deeper: text + " (Sâu Sắc Hơn)",
            softer: text + " (Nhẹ Nhàng Hơn)",
            darker: text + " (Góc Tối)"
        };
        setText(variations[direction]);
    };

    const handleAnalyze = async () => {
        if (!text) return;
        setIsAnalyzing(true);
        try {
            const result = await analyzeMantra(text);
            setPreviewAnalysis(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = () => {
        if (!text || !previewAnalysis) return;
        const newMantra: Mantra = {
            id: Date.now().toString(),
            text,
            type: selectedType,
            season: previewAnalysis.season,
            isActive: true,
            dateCreated: new Date(),
            analysis: previewAnalysis
        };
        onSave(newMantra);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                            <Mic2 size={16} />
                        </div>
                        <h3 className="font-display font-bold text-white tracking-wide">Forge Mantra</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
                </div>

                <div className="p-8 flex-1 overflow-y-auto">
                    {/* Type Selector */}
                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                        {(Object.keys(MANTRA_TYPE_ICONS) as MantraType[]).map(t => (
                            <button
                                key={t}
                                onClick={() => setSelectedType(t)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap",
                                    selectedType === t ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <textarea 
                        className="w-full bg-transparent border-none text-3xl md:text-4xl font-display font-bold text-white placeholder-gray-800 focus:ring-0 px-0 py-4 resize-none leading-tight"
                        placeholder="Khắc ghi lời nguyện..."
                        rows={3}
                        value={text}
                        onChange={e => setText(e.target.value)}
                        autoFocus
                    />

                    {/* Refine Controls */}
                    <div className="flex gap-4 mt-4">
                        <button onClick={() => handleRefine('deeper')} className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                            <ArrowRight size={12} /> Sâu Sắc
                        </button>
                        <button onClick={() => handleRefine('softer')} className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                            <ArrowRight size={12} /> Nhẹ Nhàng
                        </button>
                        <button onClick={() => handleRefine('darker')} className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                            <ArrowRight size={12} /> Góc Tối
                        </button>
                    </div>

                    {/* Analysis Preview */}
                    <div className="mt-12 pt-8 border-t border-white/5">
                        {!previewAnalysis ? (
                            <button 
                                onClick={handleAnalyze}
                                disabled={!text || isAnalyzing}
                                className="w-full py-4 rounded-xl border border-dashed border-white/10 text-gray-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                            >
                                {isAnalyzing ? <Sparkles size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                {isAnalyzing ? 'Nova Đang Lắng Nghe...' : 'Phân Tích Cộng Hưởng'}
                            </button>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-4">
                                    <div className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-white/5", SEASON_STYLES[previewAnalysis.season].border, SEASON_STYLES[previewAnalysis.season].text)}>
                                        {previewAnalysis.season}
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono">{previewAnalysis.tone} Tone</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                                    <p className="text-gray-300 italic text-sm">"{previewAnalysis.novaWhisper}"</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-black/40">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">Hủy</button>
                    <button 
                        onClick={handleSave} 
                        disabled={!previewAnalysis}
                        className="px-8 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Kết Tinh
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN VIEW ---

export const MantraView: React.FC = () => {
    const [mantras, setMantras] = useState<Mantra[]>(MOCK_MANTRAS);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const { playSound } = useSound();

    const activeMantra = mantras.find(m => m.isActive) || mantras[0];
    const otherMantras = mantras.filter(m => m.id !== activeMantra?.id);
    const selectedMantra = mantras.find(m => m.id === selectedId) || null;

    const handleSaveNew = (m: Mantra) => {
        // If new is active, deactive others
        let updated = mantras;
        if (m.isActive) {
            updated = updated.map(old => ({ ...old, isActive: false }));
        }
        setMantras([m, ...updated]);
    };

    return (
        <div className="h-full flex bg-[#050508] text-white relative overflow-hidden animate-in fade-in duration-1000">
            
            {/* Atmospheric Fog Layers */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-slate-900/20 rounded-full blur-[150px] opacity-40" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[1200px] h-[1200px] bg-indigo-900/10 rounded-full blur-[200px] opacity-30" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10 flex flex-col">
                <div className="p-6 md:p-10 pb-32 max-w-7xl mx-auto w-full">
                    
                    {/* Header */}
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 mb-4">
                                <Mic2 size={12} /> Inner Voice
                            </div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">
                                Mantra Board
                            </h1>
                            <p className="text-gray-400 font-light text-lg">
                                Tín hiệu lập trình bản thể.
                            </p>
                        </div>
                        <button 
                            onClick={() => { playSound('click'); setIsCreating(true); }}
                            className="px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2"
                        >
                            <Plus size={18} /> Tạo Mantra Mới
                        </button>
                    </div>

                    {/* Active Mantra Surface */}
                    {activeMantra && (
                        <div onClick={() => setSelectedId(activeMantra.id)} className="cursor-pointer">
                            <FocusSurface mantra={activeMantra} />
                        </div>
                    )}

                    {/* Mantra Grid */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 border-l-2 border-white/10 pl-3">
                            Thư Viện Ý Niệm
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherMantras.map(mantra => (
                                <MantraCard 
                                    key={mantra.id} 
                                    mantra={mantra} 
                                    isActive={false}
                                    onClick={() => setSelectedId(mantra.id)} 
                                />
                            ))}
                            {/* Empty State / Add Card */}
                            <div 
                                onClick={() => setIsCreating(true)}
                                className="group relative p-6 rounded-2xl border border-dashed border-white/10 hover:border-white/30 hover:bg-white/[0.02] transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white mb-4 transition-colors">
                                    <Plus size={24} />
                                </div>
                                <span className="text-sm text-gray-500 font-medium group-hover:text-gray-300">Thêm Tín Hiệu Mới</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Overlays */}
            {selectedMantra && (
                <MantraDetailPanel 
                    mantra={selectedMantra} 
                    onClose={() => setSelectedId(null)} 
                />
            )}
            
            {isCreating && (
                <MantraComposer 
                    onClose={() => setIsCreating(false)} 
                    onSave={handleSaveNew} 
                />
            )}
        </div>
    );
};
