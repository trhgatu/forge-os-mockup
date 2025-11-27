
import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Zap, 
    Ghost, 
    Scan, 
    Anchor, 
    Heart, 
    Skull, 
    Plus, 
    X, 
    Sparkles, 
    MessageSquare, 
    History, 
    Search,
    Wind,
    Sun,
    Leaf,
    Snowflake,
    Share2,
    Compass,
    Activity
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ConnectionNode, ConnectionRole, Season, MessageFragment } from '../types';
import { analyzeConnection } from '../services/geminiService';
import { cn } from '../lib/utils';

// --- CONFIG ---

const ROLE_CONFIG: Record<ConnectionRole, { color: string, glow: string, icon: React.ElementType, description: string }> = {
    'Catalyst': { color: 'text-orange-400', glow: 'shadow-[0_0_30px_rgba(251,146,60,0.4)]', icon: Zap, description: 'Triggers transformation and change.' },
    'Ghost': { color: 'text-slate-400', glow: 'shadow-[0_0_30px_rgba(148,163,184,0.3)]', icon: Ghost, description: 'Absent but influential.' },
    'Mirror': { color: 'text-cyan-400', glow: 'shadow-[0_0_30px_rgba(34,211,238,0.4)]', icon: Scan, description: 'Reflects your true self.' },
    'Anchor': { color: 'text-indigo-400', glow: 'shadow-[0_0_30px_rgba(129,140,248,0.4)]', icon: Anchor, description: 'Provides stability and grounding.' },
    'Teacher': { color: 'text-yellow-400', glow: 'shadow-[0_0_30px_rgba(250,204,21,0.4)]', icon: Compass, description: 'Imparts wisdom and lessons.' },
    'Past Love': { color: 'text-rose-400', glow: 'shadow-[0_0_30px_rgba(251,113,133,0.4)]', icon: Heart, description: 'Deep emotional imprint.' },
    'Shadow': { color: 'text-violet-500', glow: 'shadow-[0_0_30px_rgba(139,92,246,0.4)]', icon: Skull, description: 'Reveals suppressed aspects.' },
    'Companion': { color: 'text-emerald-400', glow: 'shadow-[0_0_30px_rgba(52,211,153,0.4)]', icon: Users, description: 'Walks the path with you.' },
    'Healer': { color: 'text-teal-300', glow: 'shadow-[0_0_30px_rgba(94,234,212,0.4)]', icon: Sparkles, description: 'Restores and soothes.' },
    'Mystery': { color: 'text-fuchsia-400', glow: 'shadow-[0_0_30px_rgba(232,121,249,0.4)]', icon: Wind, description: 'Unknown or complex influence.' }
};

const SEASON_ICONS: Record<Season, React.ElementType> = {
    Spring: Leaf,
    Summer: Sun,
    Autumn: Wind,
    Winter: Snowflake
};

// --- MOCK DATA ---

const MOCK_CONNECTIONS: ConnectionNode[] = [
    {
        id: '1', name: 'Elena', nickname: 'The Spark', role: 'Catalyst', importance: 9, bondIntensity: 85, seasonInfluence: 'Summer',
        lastInteraction: new Date(), messageFragments: [
            { id: 'm1', content: "You are not afraid of the fire, you are afraid of what it burns away.", date: new Date('2023-06-15'), context: 'Late night call', isFavorite: true }
        ],
        x: 50, y: 40,
        analysis: { novaWhisper: "She ignites the dormant parts of your ambition.", emotionalSummary: "High intensity, transformative.", seasonAffinity: 'Summer' }
    },
    {
        id: '2', name: 'Marcus', role: 'Anchor', importance: 7, bondIntensity: 60, seasonInfluence: 'Autumn',
        lastInteraction: new Date(Date.now() - 86400000 * 5), messageFragments: [],
        x: 30, y: 70,
        analysis: { novaWhisper: "A steady hand when the ground shakes.", emotionalSummary: "Grounding, reliable.", seasonAffinity: 'Autumn' }
    },
    {
        id: '3', name: 'Sarah', role: 'Ghost', importance: 5, bondIntensity: 30, seasonInfluence: 'Winter',
        lastInteraction: new Date(Date.now() - 86400000 * 120), messageFragments: [],
        x: 80, y: 30,
        analysis: { novaWhisper: "Silence speaks of what was left unsaid.", emotionalSummary: "Melancholic, distant.", seasonAffinity: 'Winter' }
    }
];

// --- COMPONENTS ---

const RoleBadge: React.FC<{ role: ConnectionRole }> = ({ role }) => {
    const config = ROLE_CONFIG[role];
    const Icon = config.icon;
    return (
        <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full border bg-white/5 backdrop-blur-md", `border-${config.color.split('-')[1]}-500/30`)}>
            <Icon size={12} className={config.color} />
            <span className={cn("text-[10px] uppercase font-bold tracking-wider", config.color)}>{role}</span>
        </div>
    );
};

const ConstellationMap: React.FC<{ 
    nodes: ConnectionNode[]; 
    selectedId: string | null; 
    onSelect: (id: string) => void; 
}> = ({ nodes, selectedId, onSelect }) => {
    
    return (
        <div className="relative w-full h-full overflow-hidden bg-[#030305] group">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030305] to-black opacity-60" />
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.1 }} />
            
            {/* Central Self Node */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_30px_white] z-10 animate-pulse-slow" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-500 mt-4 tracking-widest pointer-events-none">YOU</div>

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {nodes.map(node => (
                    <line 
                        key={node.id}
                        x1="50%" y1="50%"
                        x2={`${node.x}%`} y2={`${node.y}%`}
                        stroke="white"
                        strokeOpacity={selectedId === node.id ? 0.3 : 0.05}
                        strokeWidth={selectedId === node.id ? 2 : 1}
                        className="transition-all duration-500"
                    />
                ))}
            </svg>

            {/* Nodes */}
            {nodes.map(node => {
                const config = ROLE_CONFIG[node.role];
                const isSelected = selectedId === node.id;
                const size = 30 + (node.importance * 3);

                return (
                    <div 
                        key={node.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ease-out hover:scale-110 z-20"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        onClick={() => onSelect(node.id)}
                    >
                        {/* Aura */}
                        <div className={cn(
                            "absolute inset-0 -m-4 rounded-full blur-xl opacity-20 transition-all duration-700",
                            config.glow.replace('shadow-', 'bg-').replace('0.4', '0.2'),
                            isSelected ? "opacity-60 scale-150" : "group-hover:opacity-40"
                        )} />

                        {/* Core */}
                        <div 
                            className={cn(
                                "rounded-full border backdrop-blur-md flex items-center justify-center transition-all duration-300 relative overflow-hidden",
                                isSelected ? "border-white bg-white/10" : "border-white/10 bg-black/40 hover:border-white/30"
                            )}
                            style={{ 
                                width: size, 
                                height: size,
                                borderColor: isSelected ? undefined : config.color.replace('text-', 'rgb(').replace('-400', '') // approximate
                            }}
                        >
                            <span className={cn("font-bold text-white text-xs opacity-0 hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity")}>
                                {node.role[0]}
                            </span>
                            {/* Inner tint */}
                            <div className={cn("absolute inset-0 opacity-20", config.color.replace('text-', 'bg-'))} />
                        </div>

                        {/* Label */}
                        <div className={cn(
                            "absolute top-full mt-2 left-1/2 -translate-x-1/2 text-center transition-all duration-300",
                            isSelected ? "translate-y-0 opacity-100" : "translate-y-2 opacity-60 group-hover:opacity-100"
                        )}>
                            <div className="text-sm font-display font-bold text-white tracking-wide">{node.name}</div>
                            {isSelected && <div className={cn("text-[10px] uppercase font-mono", config.color)}>{node.role}</div>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const MessageCard: React.FC<{ msg: MessageFragment }> = ({ msg }) => (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
        <div className="flex justify-between items-start mb-2">
            <div className="text-[10px] font-mono text-gray-500 uppercase">{msg.context}</div>
            <div className="text-[10px] text-gray-600">{msg.date.toLocaleDateString()}</div>
        </div>
        <p className="text-sm text-gray-300 font-serif italic leading-relaxed">"{msg.content}"</p>
    </div>
);

const DetailPanel: React.FC<{ 
    connection: ConnectionNode; 
    onClose: () => void;
    onAnalyze: () => void;
    isAnalyzing: boolean;
}> = ({ connection, onClose, onAnalyze, isAnalyzing }) => {
    const roleConfig = ROLE_CONFIG[connection.role];
    const SeasonIcon = SEASON_ICONS[connection.seasonInfluence];

    return (
        <div className="absolute inset-y-0 right-0 w-full md:w-[500px] bg-[#050508]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
            {/* Header */}
            <div className="relative p-8 pb-4 border-b border-white/5">
                <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-b from-transparent pointer-events-none", roleConfig.color.replace('text-', 'to-'))} />
                
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Connection Profile</div>
                        <h2 className="text-4xl font-display font-bold text-white mb-1">{connection.name}</h2>
                        {connection.nickname && <p className="text-sm text-gray-400 italic">"{connection.nickname}"</p>}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"><X size={20}/></button>
                </div>

                <div className="flex gap-3 mt-6">
                    <RoleBadge role={connection.role} />
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 text-[10px] uppercase font-bold text-gray-400">
                        <SeasonIcon size={12} /> {connection.seasonInfluence}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                
                {/* Nova Analysis */}
                <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                    <div className={cn("absolute top-0 left-0 w-1 h-full opacity-50", roleConfig.color.replace('text-', 'bg-'))} />
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={14} className="text-forge-cyan" /> Nova Reflection
                        </h3>
                        {!connection.analysis && (
                            <button onClick={onAnalyze} disabled={isAnalyzing} className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-all">
                                {isAnalyzing ? 'Connecting...' : 'Analyze Bond'}
                            </button>
                        )}
                    </div>
                    {connection.analysis ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-lg text-gray-200 font-light italic leading-relaxed mb-4">"{connection.analysis.novaWhisper}"</p>
                            <div className="text-xs text-gray-500 font-mono border-t border-white/5 pt-3">
                                Emotional Vector: <span className="text-white">{connection.analysis.emotionalSummary}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 italic">Analyze this connection to reveal its deeper pattern.</p>
                    )}
                </div>

                {/* Bond Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Bond Intensity</div>
                        <div className="text-2xl font-bold text-white flex items-center gap-2">
                            <Activity size={18} className={roleConfig.color} /> {connection.bondIntensity}%
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Last Contact</div>
                        <div className="text-sm font-bold text-white mt-1">
                            {connection.lastInteraction.toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Message Memory */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare size={14} className="text-gray-400" /> Echoes & Artifacts
                        </h3>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"><Plus size={14}/></button>
                    </div>
                    <div className="space-y-3">
                        {connection.messageFragments.length > 0 ? (
                            connection.messageFragments.map(msg => <MessageCard key={msg.id} msg={msg} />)
                        ) : (
                            <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                                <p className="text-xs text-gray-500">No echoes preserved yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timeline Graph Placeholder */}
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                        <History size={14} className="text-gray-400" /> Connection Arc
                    </h3>
                    <div className="h-24 w-full bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center">
                        <span className="text-xs text-gray-600 font-mono">Temporal data insufficient</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

const CreateConnectionModal: React.FC<{ onClose: () => void; onSave: (c: ConnectionNode) => void }> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState<ConnectionRole>('Companion');
    const [season, setSeason] = useState<Season>('Spring');
    
    const handleSave = () => {
        if (!name) return;
        const newNode: ConnectionNode = {
            id: Date.now().toString(),
            name,
            role,
            seasonInfluence: season,
            importance: 5,
            bondIntensity: 50,
            lastInteraction: new Date(),
            messageFragments: [],
            x: 50 + (Math.random() * 40 - 20),
            y: 50 + (Math.random() * 40 - 20)
        };
        onSave(newNode);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg bg-[#050508] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-display font-bold text-white tracking-wide">Forge Connection</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
                </div>
                
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Identity</label>
                        <input 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 focus:outline-none font-display text-lg"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Archetype</label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                            {(Object.keys(ROLE_CONFIG) as ConnectionRole[]).map(r => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={cn(
                                        "px-3 py-2 rounded-lg text-xs font-bold text-left border transition-all flex items-center gap-2",
                                        role === r 
                                            ? `bg-white/10 text-white border-white/20` 
                                            : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5'
                                    )}
                                >
                                    <div className={cn("w-2 h-2 rounded-full", ROLE_CONFIG[r].color.replace('text-', 'bg-'))} />
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Seasonal Influence</label>
                        <div className="flex gap-2">
                            {(['Spring', 'Summer', 'Autumn', 'Winter'] as Season[]).map(s => {
                                const Icon = SEASON_ICONS[s];
                                return (
                                    <button
                                        key={s}
                                        onClick={() => setSeason(s)}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all",
                                            season === s ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5'
                                        )}
                                    >
                                        <Icon size={14} />
                                        <span className="text-[10px] uppercase font-bold">{s}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-black/40">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-200 transition-all">
                        Initialize Node
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN VIEW ---

export const ConnectionView: React.FC = () => {
    const [nodes, setNodes] = useState<ConnectionNode[]>(MOCK_CONNECTIONS);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const selectedNode = nodes.find(n => n.id === selectedId) || null;

    const handleSaveNew = (node: ConnectionNode) => {
        setNodes([...nodes, node]);
    };

    const handleAnalyze = async () => {
        if (!selectedNode) return;
        setIsAnalyzing(true);
        try {
            const analysis = await analyzeConnection(selectedNode.name, selectedNode.role);
            setNodes(prev => prev.map(n => n.id === selectedId ? { ...n, analysis } : n));
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="h-full flex bg-[#030305] text-white relative overflow-hidden animate-in fade-in duration-1000">
            
            {/* Main Area: Constellation */}
            <div className="flex-1 h-full relative z-10 flex flex-col">
                
                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start pointer-events-none z-30">
                    <div className="pointer-events-auto">
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">
                            <Share2 size={14} className="text-forge-cyan" /> Interpersonal Vectors
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Constellation</h1>
                    </div>
                    <div className="pointer-events-auto flex gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                            <input 
                                type="text" 
                                placeholder="Search souls..."
                                className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-white/30 w-48 transition-all"
                            />
                        </div>
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="flex items-center gap-2 px-5 py-2 bg-white text-black rounded-full text-xs font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            <Plus size={14} /> Add Node
                        </button>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 w-full h-full">
                    <ConstellationMap 
                        nodes={nodes} 
                        selectedId={selectedId} 
                        onSelect={setSelectedId} 
                    />
                </div>
            </div>

            {/* Side Panel */}
            {selectedId && (
                <DetailPanel 
                    connection={selectedNode!} 
                    onClose={() => setSelectedId(null)}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={isAnalyzing}
                />
            )}

            {/* Create Modal */}
            {isCreating && (
                <CreateConnectionModal 
                    onClose={() => setIsCreating(false)} 
                    onSave={handleSaveNew} 
                />
            )}
        </div>
    );
};
