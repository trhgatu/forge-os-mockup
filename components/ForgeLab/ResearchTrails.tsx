
import React from 'react';
import { useForgeLab } from '../../contexts/ForgeLabContext';
import { ResearchTrail, ResearchNode } from '../../types';
import { cn } from '../../lib/utils';
import { 
  Network, 
  Search, 
  Plus, 
  ExternalLink, 
  FileText,
  Lightbulb,
  X,
  Share2
} from 'lucide-react';

const TrailDetail: React.FC<{ trail: ResearchTrail; onClose: () => void }> = ({ trail, onClose }) => {
  return (
    <div className="absolute inset-y-0 right-0 w-full md:w-[600px] bg-[#050508]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
      
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-emerald-900/5">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 uppercase tracking-widest">
            <Network size={14} /> Knowledge Graph
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">{trail.topic}</h2>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{trail.nodes.length} Nodes</span>
          <span className="w-px h-3 bg-white/10" />
          <span>Created {trail.createdAt.toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Nodes Timeline/Tree */}
        <div className="relative pl-6 border-l border-white/10 space-y-12">
          {trail.nodes.map((node, index) => (
            <div key={node.id} className="relative">
              <div className="absolute -left-[29px] top-4 w-3 h-3 rounded-full bg-[#050508] border-2 border-emerald-500/50" />
              
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{node.title}</h3>
                  <span className={cn(
                    "text-[10px] uppercase font-bold px-2 py-0.5 rounded border",
                    node.type === 'concept' ? "text-cyan-400 border-cyan-500/20 bg-cyan-500/5" :
                    node.type === 'source' ? "text-amber-400 border-amber-500/20 bg-amber-500/5" :
                    "text-gray-400 border-gray-500/20 bg-gray-500/5"
                  )}>
                    {node.type}
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {node.summary}
                </p>
                
                <div className="flex gap-2">
                  {node.wikiSource && (
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-colors">
                      <ExternalLink size={12} /> Source
                    </button>
                  )}
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-colors">
                    <Lightbulb size={12} /> Extract Insight
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Node Button */}
        <button className="w-full py-4 rounded-xl border border-dashed border-white/10 text-gray-500 hover:text-white hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2">
          <Plus size={16} /> Append Node
        </button>
      </div>
    </div>
  );
};

const TrailCard: React.FC<{ trail: ResearchTrail; onClick: () => void }> = ({ trail, onClick }) => (
  <div 
    onClick={onClick}
    className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-emerald-900/20 text-emerald-400">
        <Network size={20} />
      </div>
      <div>
        <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{trail.topic}</h3>
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{trail.nodes.length} Connected Nodes</div>
      </div>
    </div>
    
    <div className="space-y-2 mb-4">
      {trail.nodes.slice(0, 2).map(node => (
        <div key={node.id} className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
          {node.title}
        </div>
      ))}
      {trail.nodes.length > 2 && (
        <div className="text-xs text-gray-600 pl-3">+{trail.nodes.length - 2} more...</div>
      )}
    </div>

    {trail.novaReflection && (
      <div className="pt-4 border-t border-white/5 text-xs text-emerald-300/60 italic truncate">
        "{trail.novaReflection}"
      </div>
    )}
  </div>
);

export const ResearchTrails: React.FC = () => {
  const { trails, activeTrail, setActiveTrail } = useForgeLab();

  return (
    <div className="relative h-full flex flex-col">
      <div className="max-w-7xl mx-auto w-full p-6 md:p-10 pb-32">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">Research Trails</h2>
            <p className="text-gray-400 text-sm">Mapped knowledge paths and rabbit holes.</p>
          </div>
          <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center gap-2">
            <Search size={14} /> New Query
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trails.map(t => (
            <TrailCard key={t.id} trail={t} onClick={() => setActiveTrail(t)} />
          ))}
        </div>
      </div>

      {activeTrail && (
        <TrailDetail trail={activeTrail} onClose={() => setActiveTrail(null)} />
      )}
    </div>
  );
};
