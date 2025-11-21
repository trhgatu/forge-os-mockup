
import React, { useState, useRef } from 'react';
import { Lightbulb, Plus, Search, Layout, Share2, List, Maximize, Compass, Sparkles, Zap, X } from 'lucide-react';
import { Idea, IdeaMode } from '../types';
import { expandIdea } from '../services/geminiService';
import { cn } from '../lib/utils';

const generateId = () => Math.random().toString(36).substring(2, 9);
const INITIAL_IDEAS: Idea[] = [
    { id: '1', title: 'Project Nebula', description: 'An OS that evolves with the user thought patterns.', x: 400, y: 300, color: 'bg-fuchsia-500', tags: ['AI', 'Design'], energy: 90, connections: ['2'], dateCreated: new Date() },
    { id: '2', title: 'Liquid Interface', description: 'UI elements that behave like fluids.', x: 700, y: 400, color: 'bg-cyan-500', tags: ['UI', 'Physics'], energy: 75, connections: [], dateCreated: new Date() },
    { id: '3', title: 'Semantic Search', description: 'Searching by meaning, not keywords.', x: 300, y: 600, color: 'bg-emerald-500', tags: ['Search', 'Data'], energy: 60, connections: ['1'], dateCreated: new Date() }
];

const useCanvasControls = () => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => { if (e.button !== 0) return; if ((e.target as HTMLElement).dataset.canvas) { setIsDragging(true); lastMousePos.current = { x: e.clientX, y: e.clientY }; } };
    const handleMouseMove = (e: React.MouseEvent) => { if (isDragging) { const dx = e.clientX - lastMousePos.current.x; const dy = e.clientY - lastMousePos.current.y; setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy })); lastMousePos.current = { x: e.clientX, y: e.clientY }; } };
    const handleMouseUp = () => setIsDragging(false);
    const handleWheel = (e: React.WheelEvent) => { const scaleFactor = 0.001; setZoom(Math.min(Math.max(0.1, zoom - e.deltaY * scaleFactor), 3)); };
    return { offset, zoom, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel };
};

const IdeaNode: React.FC<{ idea: Idea; isSelected: boolean; onClick: (e: React.MouseEvent) => void; onDragStart: (e: React.MouseEvent) => void }> = ({ idea, isSelected, onClick, onDragStart }) => {
    return (
        <div 
            className={cn(
                "absolute p-4 rounded-2xl w-64 backdrop-blur-xl border transition-all duration-300 group",
                isSelected ? 'bg-white/10 border-white shadow-[0_0_30px_rgba(255,255,255,0.2)] z-20 scale-105' : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5 z-10'
            )}
            style={{ left: idea.x, top: idea.y, cursor: 'grab' }}
            onClick={(e) => { e.stopPropagation(); onClick(e); }}
            onMouseDown={(e) => { e.stopPropagation(); onDragStart(e); }}
        >
            <div className={cn("absolute top-0 left-0 right-0 h-1 rounded-t-2xl", idea.color)} />
            <div className="flex justify-between items-start mb-2 mt-1">
                <div className="flex items-center gap-2"><Lightbulb size={14} className={isSelected ? 'text-white' : 'text-gray-500'} /><span className="text-xs font-mono text-gray-500">{idea.energy}% Energy</span></div>
                {idea.aiAnalysis && <Sparkles size={12} className="text-forge-accent" />}
            </div>
            <h3 className="font-display font-bold text-white text-lg leading-tight mb-2">{idea.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-3 mb-3 leading-relaxed">{idea.description}</p>
            <div className="flex flex-wrap gap-1">{idea.tags.map(tag => <span key={tag} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-gray-400">#{tag}</span>)}</div>
        </div>
    );
};

const ConnectionLine: React.FC<{ start: {x:number, y:number}, end: {x:number, y:number} }> = ({ start, end }) => {
    const cardW = 256; const cardH = 160;
    const sX = start.x + cardW / 2; const sY = start.y + cardH / 2;
    const eX = end.x + cardW / 2; const eY = end.y + cardH / 2;
    const midX = (sX + eX) / 2;
    const path = `M ${sX} ${sY} C ${midX} ${sY}, ${midX} ${eY}, ${eX} ${eY}`;
    return <path d={path} stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" className="pointer-events-none" />;
};

const InspectorPanel: React.FC<{ idea: Idea | null; onClose: () => void; onUpdate: (u: Partial<Idea>) => void; onExpand: (type: 'expand' | 'pivot' | 'connect') => void; isProcessing: boolean }> = ({ idea, onClose, onUpdate, onExpand, isProcessing }) => {
    if (!idea) return <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500"><Compass size={48} className="mb-4 opacity-20" /><p className="text-sm">Select a node.</p></div>;

    return (
        <div className="h-full flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider"><Zap size={14} className="text-forge-accent" /> Idea Inspector</div>
                <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={16}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div><input className="w-full bg-transparent border-none text-2xl font-display font-bold text-white focus:ring-0 p-0 mb-2" value={idea.title} onChange={e => onUpdate({ title: e.target.value })} /><textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:border-forge-accent focus:outline-none min-h-[100px]" value={idea.description} onChange={e => onUpdate({ description: e.target.value })} placeholder="Describe the concept..." /></div>
                <div>
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">AI Co-Creation</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {[{ id: 'expand', label: 'Expand', icon: Maximize }, { id: 'pivot', label: 'Pivot', icon: Compass }, { id: 'connect', label: 'Connect', icon: Share2 }].map(action => (
                            <button key={action.id} onClick={() => onExpand(action.id as any)} disabled={isProcessing} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-forge-accent/20 hover:border-forge-accent/40 hover:text-white text-gray-400 transition-all disabled:opacity-50">
                                <action.icon size={16} /><span className="text-[10px] uppercase">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                {idea.aiAnalysis && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                            <div className="flex items-center gap-2 text-[10px] text-forge-accent font-mono uppercase tracking-widest mb-2"><Sparkles size={12} /> Expansion</div>
                            <p className="text-sm text-gray-200 leading-relaxed">{idea.aiAnalysis.expansion}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const IdeasView: React.FC = () => {
    const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);
    const [mode, setMode] = useState<IdeaMode>('CANVAS');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { offset, zoom, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel } = useCanvasControls();
    const [dragNodeId, setDragNodeId] = useState<string | null>(null);

    const handleNodeDragStart = (e: React.MouseEvent, id: string) => { setDragNodeId(id); setSelectedId(id); };
    const handleCanvasMouseMove = (e: React.MouseEvent) => { if (dragNodeId) { const movementX = e.movementX / zoom; const movementY = e.movementY / zoom; setIdeas(prev => prev.map(idea => idea.id === dragNodeId ? { ...idea, x: idea.x + movementX, y: idea.y + movementY } : idea)); } else { handleMouseMove(e); } };
    const handleCanvasMouseUp = () => { setDragNodeId(null); handleMouseUp(); };
    const handleCreateIdea = () => { const centerX = (-offset.x + window.innerWidth / 2) / zoom - 128; const centerY = (-offset.y + window.innerHeight / 2) / zoom - 80; const newIdea: Idea = { id: generateId(), title: 'New Spark', description: '', x: centerX, y: centerY, color: 'bg-gray-600', tags: [], energy: 50, connections: [], dateCreated: new Date() }; setIdeas([...ideas, newIdea]); setSelectedId(newIdea.id); };
    const handleExpandIdea = async (action: 'expand' | 'pivot' | 'connect') => { const idea = ideas.find(i => i.id === selectedId); if (!idea) return; setIsProcessing(true); try { const analysis = await expandIdea(idea.title, idea.description, action); setIdeas(prev => prev.map(i => i.id === selectedId ? { ...i, aiAnalysis: analysis } : i)); } catch (e) { console.error(e); } finally { setIsProcessing(false); } };

    return (
        <div className="h-full w-full flex bg-forge-bg text-white relative overflow-hidden animate-in fade-in duration-700">
            <div className="absolute top-0 left-0 right-0 z-40 p-6 pointer-events-none flex justify-between items-start">
                <div className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex gap-2 shadow-2xl">
                    {[{ id: 'CANVAS', icon: Layout }, { id: 'GRAPH', icon: Share2 }, { id: 'LIST', icon: List }].map(m => (
                        <button key={m.id} onClick={() => setMode(m.id as IdeaMode)} className={cn("p-2 rounded-xl transition-all", mode === m.id ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5')}><m.icon size={18} /></button>
                    ))}
                    <div className="w-px bg-white/10 mx-1" /><button onClick={handleCreateIdea} className="px-4 py-2 bg-forge-accent text-white rounded-xl font-medium flex items-center gap-2 hover:bg-forge-accent/80 transition-colors"><Plus size={16} /> New Spark</button>
                </div>
                <div className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl hidden md:flex items-center gap-2"><Search size={16} className="text-gray-500 ml-2" /><input placeholder="Search vault..." className="bg-transparent border-none text-sm text-white placeholder-gray-500 focus:ring-0 w-48" /></div>
            </div>
            <div className="flex-1 h-full relative cursor-move bg-[#050505]" onMouseDown={handleMouseDown} onMouseMove={handleCanvasMouseMove} onMouseUp={handleCanvasMouseUp} onMouseLeave={handleCanvasMouseUp} onWheel={handleWheel} data-canvas="true">
                <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: `${20 * zoom}px ${20 * zoom}px`, backgroundPosition: `${offset.x}px ${offset.y}px` }} />
                <div className="absolute origin-top-left transition-transform duration-75 ease-linear will-change-transform" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}>
                    <svg className="absolute top-0 left-0 overflow-visible" style={{ width: '1px', height: '1px' }}>{ideas.map(idea => idea.connections.map(targetId => { const target = ideas.find(t => t.id === targetId); if (!target) return null; return <ConnectionLine key={`${idea.id}-${targetId}`} start={idea} end={target} />; }))}</svg>
                    {ideas.map(idea => <IdeaNode key={idea.id} idea={idea} isSelected={selectedId === idea.id} onClick={(e) => { if (!dragNodeId) setSelectedId(idea.id); }} onDragStart={(e) => handleNodeDragStart(e, idea.id)} />)}
                </div>
                <div className="absolute bottom-6 left-6 pointer-events-none bg-black/40 px-3 py-1 rounded-lg border border-white/5 text-xs text-gray-500 font-mono">Zoom: {Math.round(zoom * 100)}%</div>
            </div>
            <div className={cn("w-96 border-l border-white/5 bg-black/20 backdrop-blur-xl z-30 transition-transform duration-500 ease-spring-out", selectedId ? 'translate-x-0' : 'translate-x-full')}><InspectorPanel idea={ideas.find(i => i.id === selectedId) || null} onClose={() => setSelectedId(null)} onUpdate={(u) => setIdeas(prev => prev.map(i => i.id === selectedId ? { ...i, ...u } : i))} onExpand={handleExpandIdea} isProcessing={isProcessing} /></div>
        </div>
    );
};
