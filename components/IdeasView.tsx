
import React, { useState, useRef, useEffect } from 'react';
import { 
  Lightbulb, 
  Plus, 
  Search, 
  Share2, 
  Zap, 
  X, 
  Sparkles, 
  MousePointer2, 
  Grid, 
  Layers, 
  Maximize, 
  Trash2, 
  Link as LinkIcon, 
  Edit3,
  Check
} from 'lucide-react';
import { Idea, IdeaType, IdeaStatus } from '../types';
import { synthesizeIdeas } from '../services/geminiService';
import { cn } from '../lib/utils';

const generateId = () => Math.random().toString(36).substring(2, 9);

const INITIAL_IDEAS: Idea[] = [
    { id: '1', title: 'Project Nebula', description: 'An OS that evolves with the user thought patterns.', x: 400, y: 300, type: 'project', status: 'active', color: 'bg-fuchsia-500', tags: ['AI', 'Design'], energy: 90, connections: ['2'], dateCreated: new Date() },
    { id: '2', title: 'Liquid Interface', description: 'UI elements that behave like fluids.', x: 700, y: 400, type: 'concept', status: 'active', color: 'bg-cyan-500', tags: ['UI', 'Physics'], energy: 75, connections: [], dateCreated: new Date() },
    { id: '3', title: 'Semantic Search', description: 'Searching by meaning, not keywords.', x: 300, y: 600, type: 'spark', status: 'incubating', color: 'bg-emerald-500', tags: ['Search', 'Data'], energy: 60, connections: ['1'], dateCreated: new Date() }
];

const NODE_TYPES = {
    spark: { label: 'Spark', icon: Zap, color: 'text-yellow-400' },
    concept: { label: 'Concept', icon: Lightbulb, color: 'text-cyan-400' },
    project: { label: 'Project', icon: Layers, color: 'text-fuchsia-400' },
    cluster: { label: 'Cluster', icon: Grid, color: 'text-white' }
};

const STATUS_COLORS = {
    active: 'bg-green-500',
    incubating: 'bg-yellow-500',
    archived: 'bg-gray-500'
};

// --- SUB-COMPONENTS ---

const IdeaNode: React.FC<{ 
    idea: Idea; 
    isSelected: boolean; 
    onClick: (e: React.MouseEvent) => void; 
    onDoubleClick: (e: React.MouseEvent) => void;
    onDragStart: (e: React.MouseEvent) => void;
    scale: number;
}> = ({ idea, isSelected, onClick, onDoubleClick, onDragStart, scale }) => {
    
    // Render Spark (Minimal Orb)
    if (idea.type === 'spark') {
        return (
            <div
                className={cn(
                    "absolute flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300 group z-10",
                    isSelected ? 'scale-150 z-30' : 'hover:scale-125'
                )}
                style={{ left: idea.x, top: idea.y, transform: 'translate(-50%, -50%)' }}
                onMouseDown={(e) => { e.stopPropagation(); onDragStart(e); onClick(e); }}
                onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(e); }}
            >
                {/* Glowing Core */}
                <div className={cn(
                    "w-4 h-4 rounded-full shadow-[0_0_15px_currentColor] animate-pulse-slow transition-all",
                    idea.color.replace('bg-', 'bg-')
                )} />
                
                {/* Outer Ring */}
                <div className={cn(
                    "absolute inset-0 -m-1 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                )} />

                {/* Label Tooltip */}
                <div className="absolute top-full mt-3 px-2 py-1 rounded-lg bg-black/80 text-[10px] font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none border border-white/10 backdrop-blur-md translate-y-2 group-hover:translate-y-0">
                    {idea.title}
                </div>
            </div>
        );
    }

    // Render Concept (Pill)
    if (idea.type === 'concept') {
        return (
            <div 
                className={cn(
                    "absolute flex items-center gap-3 px-4 py-2 backdrop-blur-xl transition-all duration-300 group cursor-grab active:cursor-grabbing rounded-full border",
                    isSelected 
                        ? 'bg-white/10 border-white shadow-[0_0_30px_rgba(255,255,255,0.1)] z-30 scale-105' 
                        : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5 z-20 shadow-lg'
                )}
                style={{ left: idea.x, top: idea.y, transform: 'translate(-50%, -50%)' }}
                onMouseDown={(e) => { e.stopPropagation(); onDragStart(e); onClick(e); }}
                onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(e); }}
            >
                <div className={cn("w-2 h-2 rounded-full", idea.color)} />
                <span className="text-xs font-bold text-gray-200 whitespace-nowrap">{idea.title}</span>
                {idea.aiAnalysis && <Sparkles size={10} className="text-forge-accent" />}
            </div>
        );
    }

    // Render Project (Card)
    return (
        <div 
            className={cn(
                "absolute w-64 p-5 backdrop-blur-xl transition-all duration-300 group cursor-grab active:cursor-grabbing flex flex-col rounded-2xl border",
                isSelected 
                    ? 'bg-white/10 border-white shadow-[0_0_40px_rgba(255,255,255,0.15)] z-20 scale-105' 
                    : 'bg-[#0B0B15]/80 border-white/10 hover:border-white/30 hover:bg-white/5 z-10 shadow-2xl'
            )}
            style={{ left: idea.x, top: idea.y, transform: 'translate(-50%, -50%)' }}
            onMouseDown={(e) => { e.stopPropagation(); onDragStart(e); onClick(e); }}
            onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(e); }}
        >
            {/* Energy Bar */}
            <div className={cn("absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl opacity-50", idea.color)} />
            
            <div className="flex justify-between items-start mb-3 pl-2">
                <div className="flex items-center gap-2">
                    <Layers size={14} className="text-gray-400" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Project</span>
                </div>
                <div className="flex items-center gap-1">
                    {idea.status && <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", STATUS_COLORS[idea.status])} />}
                    {idea.aiAnalysis && <Sparkles size={12} className="text-forge-accent" />}
                </div>
            </div>
            
            <h3 className="font-display font-bold text-white text-lg leading-tight mb-2 pl-2">
                {idea.title}
            </h3>
            
            <p className="text-xs text-gray-400 line-clamp-3 pl-2 mb-4 leading-relaxed">
                {idea.description}
            </p>

            <div className="flex flex-wrap gap-1 pl-2 mt-auto">
                {idea.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] text-gray-400 font-mono uppercase">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

const ConnectionLine: React.FC<{ start: {x:number, y:number}, end: {x:number, y:number}, strength: number }> = ({ start, end, strength }) => {
    const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const curvature = Math.min(150, dist * 0.4);

    const cp1x = start.x + curvature; 
    const cp1y = start.y;
    const cp2x = end.x - curvature;
    const cp2y = end.y;

    const path = `M ${start.x} ${start.y} C ${start.x + (end.x - start.x) / 2} ${start.y}, ${end.x - (end.x - start.x) / 2} ${end.y}, ${end.x} ${end.y}`;

    return (
        <g className="pointer-events-none">
            <path d={path} stroke="rgba(255,255,255,0.05)" strokeWidth={strength * 4} fill="none" />
            <path d={path} stroke="rgba(255,255,255,0.2)" strokeWidth={strength} fill="none" strokeDasharray="5,5" className="animate-pulse-slow" />
            <circle cx={start.x} cy={start.y} r="2" fill="rgba(255,255,255,0.3)" />
            <circle cx={end.x} cy={end.y} r="2" fill="rgba(255,255,255,0.3)" />
        </g>
    );
};

const EditIdeaModal: React.FC<{ idea: Idea; onClose: () => void; onSave: (updated: Idea) => void }> = ({ idea, onClose, onSave }) => {
    const [title, setTitle] = useState(idea.title);
    const [desc, setDesc] = useState(idea.description);
    const [type, setType] = useState<IdeaType>(idea.type);
    const [status, setStatus] = useState<IdeaStatus>(idea.status || 'active');

    const handleSave = () => {
        onSave({ ...idea, title, description: desc, type, status });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white font-bold">
                        <Edit3 size={16} className="text-gray-400" /> Edit Node
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase font-mono mb-1">Identity</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-forge-accent focus:outline-none font-display font-bold text-lg" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 uppercase font-mono mb-1">Configuration</label>
                        <div className="flex gap-2 mb-2">
                            {(Object.keys(NODE_TYPES) as IdeaType[]).map(t => (
                                <button key={t} onClick={() => setType(t)} className={cn("flex-1 py-1.5 rounded border text-[10px] uppercase font-bold transition-all", type === t ? 'bg-white/10 text-white border-white/30' : 'bg-transparent text-gray-500 border-white/5 hover:bg-white/5')}>{t}</button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {(Object.keys(STATUS_COLORS) as IdeaStatus[]).map(s => (
                                <button key={s} onClick={() => setStatus(s)} className={cn("flex-1 py-1.5 rounded border text-[10px] uppercase font-bold transition-all", status === s ? 'bg-white/10 text-white border-white/30' : 'bg-transparent text-gray-500 border-white/5 hover:bg-white/5')}>{s}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 uppercase font-mono mb-1">Manifest</label>
                        <textarea className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-forge-accent focus:outline-none h-24 resize-none" value={desc} onChange={e => setDesc(e.target.value)} />
                    </div>
                </div>
                <div className="p-4 border-t border-white/5 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg text-xs font-bold bg-forge-accent text-white hover:bg-forge-accent/80 shadow-lg shadow-forge-accent/20 flex items-center gap-2"><Check size={14} /> Update Node</button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN VIEW ---

export const IdeasView: React.FC = () => {
    const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    // Canvas State
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionBox, setSelectionBox] = useState<{startX: number, startY: number, currentX: number, currentY: number} | null>(null);
    
    const [dragNodeId, setDragNodeId] = useState<string | null>(null);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    // --- Helpers ---
    const screenToWorld = (sx: number, sy: number) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        return {
            x: (sx - rect.left - offset.x) / zoom,
            y: (sy - rect.top - offset.y) / zoom
        };
    };

    // --- Interaction Handlers ---

    const handleMouseDown = (e: React.MouseEvent) => {
        // Check if clicking on background
        if ((e.target as HTMLElement).dataset.canvas) {
            if (e.shiftKey || e.metaKey) {
                // Start Rubber Band Selection
                setIsSelecting(true);
                const { x, y } = screenToWorld(e.clientX, e.clientY);
                setSelectionBox({ startX: x, startY: y, currentX: x, currentY: y });
            } else {
                // Start Panning
                setIsDraggingCanvas(true);
                lastMousePos.current = { x: e.clientX, y: e.clientY };
                setSelectedIds([]); // Deselect on bg click
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDraggingCanvas) {
            const dx = e.clientX - lastMousePos.current.x;
            const dy = e.clientY - lastMousePos.current.y;
            lastMousePos.current = { x: e.clientX, y: e.clientY };
            setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        } else if (dragNodeId) {
            // Dragging Node
            const dx = e.movementX / zoom;
            const dy = e.movementY / zoom;
            setIdeas(prev => prev.map(idea => 
                selectedIds.includes(idea.id) 
                    ? { ...idea, x: idea.x + dx, y: idea.y + dy } 
                    : idea.id === dragNodeId // Fallback if dragging unselected node
                        ? { ...idea, x: idea.x + dx, y: idea.y + dy }
                        : idea
            ));
        } else if (isSelecting && selectionBox) {
            // Rubber Band Update
            const { x, y } = screenToWorld(e.clientX, e.clientY);
            setSelectionBox(prev => prev ? { ...prev, currentX: x, currentY: y } : null);
            
            // Calculate Selection Intersection
            const x1 = Math.min(selectionBox.startX, x);
            const x2 = Math.max(selectionBox.startX, x);
            const y1 = Math.min(selectionBox.startY, y);
            const y2 = Math.max(selectionBox.startY, y);

            const newSelection = ideas.filter(idea => 
                idea.x >= x1 && idea.x <= x2 && idea.y >= y1 && idea.y <= y2
            ).map(i => i.id);
            
            setSelectedIds(newSelection);
        }
    };

    const handleMouseUp = () => {
        setIsDraggingCanvas(false);
        setDragNodeId(null);
        setIsSelecting(false);
        setSelectionBox(null);
    };

    const handleWheel = (e: React.WheelEvent) => {
        const scaleFactor = 0.001;
        const newZoom = Math.min(Math.max(0.2, zoom - e.deltaY * scaleFactor), 3);
        setZoom(newZoom);
    };

    const handleNodeClick = (e: React.MouseEvent, id: string) => {
        if (e.shiftKey) {
            setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        } else {
            if (!selectedIds.includes(id)) setSelectedIds([id]);
        }
    };

    // --- Logic Handlers ---

    const handleCreateNode = (type: IdeaType) => {
        const container = canvasRef.current;
        const w = container ? container.clientWidth : window.innerWidth;
        const h = container ? container.clientHeight : window.innerHeight;
        
        const centerX = (-offset.x + w / 2) / zoom;
        const centerY = (-offset.y + h / 2) / zoom;

        const newIdea: Idea = {
            id: generateId(),
            title: type === 'spark' ? 'New Spark' : 'New Concept',
            description: 'Double click to edit description...',
            x: centerX + (Math.random() * 40 - 20),
            y: centerY + (Math.random() * 40 - 20),
            type,
            status: 'incubating',
            color: 'bg-gray-500',
            tags: [],
            energy: 50,
            connections: [],
            dateCreated: new Date()
        };
        setIdeas([...ideas, newIdea]);
        setSelectedIds([newIdea.id]);
    };

    const handleSynthesize = async () => {
        if (selectedIds.length < 2) return;
        setIsProcessing(true);
        const selectedIdeas = ideas.filter(i => selectedIds.includes(i.id));
        
        try {
            const synthesis = await synthesizeIdeas(selectedIdeas);
            
            const avgX = selectedIdeas.reduce((sum, i) => sum + i.x, 0) / selectedIdeas.length;
            const avgY = selectedIdeas.reduce((sum, i) => sum + i.y, 0) / selectedIdeas.length;

            const newNode: Idea = {
                id: generateId(),
                title: synthesis.title,
                description: synthesis.description,
                x: avgX,
                y: avgY + 200,
                type: synthesis.type,
                status: 'active',
                color: 'bg-forge-accent',
                tags: ['AI Synthesis'],
                energy: 100,
                connections: selectedIds, 
                aiAnalysis: { expansion: 'Generated by Neural Core', gaps: [], nextSteps: [] },
                dateCreated: new Date()
            };

            setIdeas([...ideas, newNode]);
            setSelectedIds([newNode.id]);
        } catch (e) {
            console.error("Synthesis Failed", e);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConnect = () => {
        if (selectedIds.length < 2) return;
        const [sourceId, ...targetIds] = selectedIds;
        setIdeas(prev => prev.map(idea => {
            if (idea.id === sourceId) {
                return { ...idea, connections: [...new Set([...idea.connections, ...targetIds])] };
            }
            return idea;
        }));
        setSelectedIds([]);
    };

    const handleDelete = () => {
        setIdeas(prev => prev.filter(i => !selectedIds.includes(i.id)));
        setSelectedIds([]);
    };

    return (
        <div className="h-full w-full bg-[#050505] overflow-hidden relative flex flex-col">
            
            {/* --- Top HUD --- */}
            <div className="absolute top-6 left-6 right-6 z-40 flex justify-between items-start pointer-events-none">
                
                {/* Tools */}
                <div className="pointer-events-auto flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-3 px-4 border-r border-white/10 mr-2">
                        <Grid size={18} className="text-forge-cyan" />
                        <span className="font-display font-bold text-white tracking-wide">Neural Canvas</span>
                    </div>
                    <button onClick={() => handleCreateNode('spark')} className="p-3 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all group relative" title="Add Spark">
                        <Zap size={18} />
                    </button>
                    <button onClick={() => handleCreateNode('concept')} className="p-3 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all group relative" title="Add Concept">
                        <Lightbulb size={18} />
                    </button>
                    <button onClick={() => handleCreateNode('project')} className="p-3 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all group relative" title="Add Project">
                        <Layers size={18} />
                    </button>
                </div>

                {/* Search */}
                <div className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center gap-3 px-4 animate-in slide-in-from-top-4">
                    <Search size={16} className="text-gray-500" />
                    <input placeholder="Search neural web..." className="bg-transparent border-none text-sm text-white placeholder-gray-600 focus:ring-0 w-48 font-mono" />
                </div>
            </div>

            {/* --- Infinite Canvas --- */}
            <div 
                ref={canvasRef}
                className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden bg-[#050505]"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                data-canvas="true"
                style={{ 
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', 
                    backgroundSize: `${30 * zoom}px ${30 * zoom}px`, 
                    backgroundPosition: `${offset.x}px ${offset.y}px` 
                }}
            >
                <div 
                    className="absolute origin-top-left will-change-transform"
                    style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
                >
                    {/* Connections */}
                    <svg className="absolute top-0 left-0 overflow-visible" style={{ width: 1, height: 1 }}>
                        {ideas.map(idea => idea.connections.map(targetId => {
                            const target = ideas.find(t => t.id === targetId);
                            if (!target) return null;
                            return <ConnectionLine key={`${idea.id}-${target.id}`} start={{x:idea.x, y:idea.y}} end={{x:target.x, y:target.y}} strength={1} />;
                        }))}
                    </svg>

                    {/* Rubber Band Visual */}
                    {selectionBox && (
                        <div 
                            className="absolute border border-forge-cyan bg-forge-cyan/10 pointer-events-none z-50"
                            style={{
                                left: Math.min(selectionBox.startX, selectionBox.currentX),
                                top: Math.min(selectionBox.startY, selectionBox.currentY),
                                width: Math.abs(selectionBox.currentX - selectionBox.startX),
                                height: Math.abs(selectionBox.currentY - selectionBox.startY)
                            }}
                        />
                    )}

                    {/* Nodes */}
                    {ideas.map(idea => (
                        <IdeaNode 
                            key={idea.id} 
                            idea={idea} 
                            isSelected={selectedIds.includes(idea.id)} 
                            onClick={(e) => handleNodeClick(e, idea.id)} 
                            onDoubleClick={() => setEditingId(idea.id)}
                            onDragStart={(e) => { setDragNodeId(idea.id); }} 
                            scale={zoom}
                        />
                    ))}
                </div>
            </div>

            {/* --- Context Action Bar --- */}
            {selectedIds.length > 0 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full p-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center gap-2 animate-in slide-in-from-bottom-4 z-50">
                    <div className="px-4 py-1 text-xs font-mono text-gray-400 border-r border-white/10 flex items-center gap-2">
                        <MousePointer2 size={12} />
                        {selectedIds.length} Selected
                    </div>
                    
                    {selectedIds.length >= 2 && (
                        <>
                            <button 
                                onClick={handleSynthesize}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-5 py-2.5 bg-forge-accent hover:bg-forge-accent/80 text-white rounded-full text-xs font-bold transition-all shadow-lg shadow-forge-accent/20"
                            >
                                {isProcessing ? <Sparkles size={14} className="animate-spin" /> : <Share2 size={14} />}
                                {isProcessing ? 'Neural Synthesis...' : 'Synthesize'}
                            </button>
                            <button 
                                onClick={handleConnect}
                                className="p-2.5 hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors"
                                title="Connect Nodes"
                            >
                                <LinkIcon size={16} />
                            </button>
                        </>
                    )}

                    {selectedIds.length === 1 && (
                        <button 
                            onClick={() => setEditingId(selectedIds[0])}
                            className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 text-white rounded-full text-xs font-medium transition-all"
                        >
                            <Maximize size={14} /> Inspect
                        </button>
                    )}

                    <div className="w-px h-6 bg-white/10 mx-1" />
                    
                    <button onClick={handleDelete} className="p-2.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-full transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            )}

            {/* --- Modals --- */}
            {editingId && (
                <EditIdeaModal 
                    idea={ideas.find(i => i.id === editingId)!} 
                    onClose={() => setEditingId(null)} 
                    onSave={(updated) => setIdeas(prev => prev.map(i => i.id === updated.id ? updated : i))}
                />
            )}

            {/* --- Zoom Indicator --- */}
            <div className="absolute bottom-6 left-6 pointer-events-none">
                <div className="bg-black/40 px-3 py-1 rounded-lg border border-white/5 text-[10px] text-gray-500 font-mono backdrop-blur-md">
                    ZOOM: {Math.round(zoom * 100)}%
                </div>
            </div>
        </div>
    );
};
