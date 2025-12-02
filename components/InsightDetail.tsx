
import React from 'react';
import { Insight, InsightSource } from '../types';
import { X, Sparkles, Trash2, ArrowRight, Share2, Calendar, Tag, BrainCircuit } from 'lucide-react';
import { useInsight } from '../contexts/InsightContext';
import { cn } from '../lib/utils';

interface InsightDetailProps {
  insight: Insight;
  onClose: () => void;
}

const SOURCE_COLORS: Record<InsightSource, string> = {
  thought: 'text-cyan-400 from-cyan-500/20',
  journal: 'text-fuchsia-400 from-fuchsia-500/20',
  wiki: 'text-blue-400 from-blue-500/20',
  echo: 'text-emerald-400 from-emerald-500/20',
  memory: 'text-amber-400 from-amber-500/20',
  mood: 'text-rose-400 from-rose-500/20',
  energy: 'text-yellow-400 from-yellow-500/20',
  identity: 'text-violet-400 from-violet-500/20',
  manual: 'text-white from-white/10'
};

export const InsightDetail: React.FC<InsightDetailProps> = ({ insight, onClose }) => {
  const { deleteInsight } = useInsight();
  const theme = SOURCE_COLORS[insight.source] || SOURCE_COLORS.manual;
  const accentColor = theme.split(' ')[0];
  const gradientColor = theme.split(' ')[1];

  const handleDelete = () => {
    deleteInsight(insight.id);
    onClose();
  };

  return (
    <div className="absolute inset-y-0 right-0 w-full md:w-[600px] bg-[#050508]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
      
      {/* Cinematic Header Background */}
      <div className={cn("absolute top-0 inset-x-0 h-64 bg-gradient-to-b to-transparent pointer-events-none opacity-50", gradientColor)} />
      
      {/* Header */}
      <div className="relative z-10 p-8 border-b border-white/5 flex justify-between items-start">
        <div>
          <div className={cn("flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3", accentColor)}>
            <Sparkles size={14} /> Neural Crystallization
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
             <span className="flex items-center gap-1"><Calendar size={12}/> {insight.createdAt.toLocaleDateString()}</span>
             <span className="w-px h-3 bg-white/10" />
             <span className="uppercase">{insight.source} Stream</span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 rounded-full bg-black/20 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 md:p-12 relative z-10">
        
        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight mb-8 drop-shadow-xl">
            "{insight.text}"
          </h2>
          
          {insight.reflection && (
            <div className="p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent">
              <div className="bg-[#08080a] rounded-xl p-6 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <BrainCircuit size={48} className={accentColor} />
                </div>
                <div className="relative z-10">
                  <div className={cn("text-[10px] font-mono uppercase tracking-widest mb-3 font-bold", accentColor)}>
                    System Reflection
                  </div>
                  <p className="text-lg text-gray-300 font-serif italic leading-relaxed">
                    {insight.reflection}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Depth Level</div>
              <div className="flex gap-1">
                 {[...Array(5)].map((_, i) => (
                    <div key={i} className={cn("h-1 flex-1 rounded-full", i < insight.metadata.depth ? accentColor.replace('text-', 'bg-') : 'bg-white/10')} />
                 ))}
              </div>
           </div>
           <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Emotion</div>
              <div className="text-white font-medium capitalize">{insight.metadata.emotion || 'Neutral'}</div>
           </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {insight.tags.map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center gap-2">
              <Tag size={12} /> {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions Footer */}
      <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md flex justify-between items-center relative z-20">
        <button 
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-400 transition-colors p-3 hover:bg-red-500/10 rounded-xl"
          title="Dismiss Insight"
        >
          <Trash2 size={18} />
        </button>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-xs font-bold text-gray-300 transition-all uppercase tracking-wider">
            <Share2 size={14} /> Connect
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all text-xs shadow-[0_0_20px_rgba(255,255,255,0.2)] uppercase tracking-wider">
            Mark Turning Point <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
};
