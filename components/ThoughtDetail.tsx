
import React from 'react';
import { ThoughtFragment, View, ThoughtType } from '../types';
import { X, Sparkles, BookOpen, ArrowRight, Trash2, Calendar, Layers, Zap, Radio } from 'lucide-react';
import { useThoughtStream } from '../contexts/ThoughtStreamContext';
import { useNavigation } from '../contexts/NavigationContext';
import { draftService } from '../services/draftService';
import { cn } from '../lib/utils';

interface ThoughtDetailProps {
  fragment: ThoughtFragment;
  onClose: () => void;
}

const TYPE_THEMES: Record<ThoughtType, { text: string, bg: string, icon: React.ElementType }> = {
  spark: { text: 'text-amber-400', bg: 'from-amber-500/20', icon: Zap },
  fragment: { text: 'text-cyan-400', bg: 'from-cyan-500/20', icon: Radio },
  stream: { text: 'text-violet-400', bg: 'from-violet-500/20', icon: Layers }
};

export const ThoughtDetail: React.FC<ThoughtDetailProps> = ({ fragment, onClose }) => {
  const { removeFragment } = useThoughtStream();
  const { navigateTo } = useNavigation();

  const theme = TYPE_THEMES[fragment.type];
  const Icon = theme.icon;

  const handleDelete = () => {
    removeFragment(fragment.id);
    onClose();
  };

  const handleExpandToJournal = () => {
    draftService.setDraft({
      content: fragment.text,
      source: 'Thought Stream',
      tags: [...fragment.tags, 'Expanded Thought']
    });
    navigateTo(View.JOURNAL);
    onClose();
  };

  const handleConvertToInsight = () => {
    draftService.setDraft({
      content: fragment.text,
      source: 'Thought Stream',
      type: 'insight'
    });
    navigateTo(View.INSIGHTS);
    onClose();
  };

  return (
    <div className="absolute inset-y-0 right-0 w-full md:w-[600px] bg-[#050508]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
      
      {/* Cinematic Header Background */}
      <div className={cn("absolute top-0 inset-x-0 h-64 bg-gradient-to-b to-transparent pointer-events-none opacity-40", theme.bg)} />

      {/* Header */}
      <div className="relative z-10 p-8 border-b border-white/5 flex justify-between items-start">
        <div>
          <div className={cn("flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3", theme.text)}>
            <Icon size={14} /> {fragment.type} Node
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
             <span className="flex items-center gap-1"><Calendar size={12}/> {fragment.createdAt.toLocaleString()}</span>
             <span className="w-px h-3 bg-white/10" />
             <span>Depth: {fragment.metadata.depth}%</span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 rounded-full bg-black/20 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 md:p-12 relative z-10">
        
        {/* Main Text */}
        <div className="mb-12">
          <p className="text-xl md:text-2xl font-serif text-gray-200 leading-relaxed font-light whitespace-pre-wrap">
            {fragment.text}
          </p>
        </div>

        {/* Nova Reflection */}
        {fragment.metadata.novaReflection && (
          <div className="p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent mb-8">
            <div className="bg-[#08080a] rounded-xl p-6 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={48} className={theme.text} />
              </div>
              <div className="relative z-10">
                <div className={cn("text-[10px] font-mono uppercase tracking-widest mb-3 font-bold flex items-center gap-2", theme.text)}>
                  <Sparkles size={12} /> Nova Reflection
                </div>
                <p className="text-base text-gray-300 font-serif italic leading-relaxed">
                  "{fragment.metadata.novaReflection}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {fragment.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {fragment.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md flex justify-between items-center relative z-20">
        <button 
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-400 transition-colors p-3 hover:bg-red-500/10 rounded-xl"
          title="Discard Fragment"
        >
          <Trash2 size={18} />
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={handleExpandToJournal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-xs font-bold text-gray-300 transition-all uppercase tracking-wider"
          >
            <BookOpen size={14} /> Journal
          </button>
          <button 
            onClick={handleConvertToInsight}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all text-xs shadow-[0_0_20px_rgba(255,255,255,0.2)] uppercase tracking-wider"
          >
            Crystallize <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
};
