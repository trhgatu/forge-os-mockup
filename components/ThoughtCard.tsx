
import React from 'react';
import { ThoughtFragment, ThoughtType } from '../types';
import { cn } from '../lib/utils';
import { Zap, Radio, Layers, ArrowRight } from 'lucide-react';

const TYPE_STYLES: Record<ThoughtType, { border: string, icon: React.ElementType, particle: string, bg: string, text: string, shadow: string }> = {
  spark: { 
    border: 'border-amber-500/30', 
    icon: Zap, 
    particle: 'bg-amber-400',
    bg: 'bg-amber-500/5',
    text: 'text-amber-400',
    shadow: 'hover:shadow-amber-500/10'
  },
  fragment: { 
    border: 'border-cyan-500/30', 
    icon: Radio, 
    particle: 'bg-cyan-400',
    bg: 'bg-cyan-500/5',
    text: 'text-cyan-400',
    shadow: 'hover:shadow-cyan-500/10'
  },
  stream: { 
    border: 'border-violet-500/30', 
    icon: Layers, 
    particle: 'bg-violet-400',
    bg: 'bg-violet-500/5',
    text: 'text-violet-400',
    shadow: 'hover:shadow-violet-500/10'
  }
};

interface ThoughtCardProps {
  fragment: ThoughtFragment;
  onClick: () => void;
}

export const ThoughtCard: React.FC<ThoughtCardProps> = ({ fragment, onClick }) => {
  const style = TYPE_STYLES[fragment.type];
  const Icon = style.icon;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative p-6 rounded-2xl border backdrop-blur-sm cursor-pointer transition-all duration-500 ease-out",
        "bg-[#09090b]/60 hover:bg-[#09090b]/80 hover:-translate-y-1 hover:shadow-xl",
        style.border,
        style.shadow,
        "mb-6 animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards"
      )}
    >
      {/* Background Gradient Hint */}
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl bg-gradient-to-br from-transparent to-transparent", style.bg.replace('bg-', 'via-'))} />

      {/* Floating Particle */}
      <div className={cn(
        "absolute top-5 right-5 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] opacity-50 group-hover:opacity-100 transition-opacity",
        style.particle
      )} />

      <div className="flex items-start gap-4 relative z-10">
        <div className={cn(
          "mt-1 p-2 rounded-xl border bg-black/40 transition-colors",
          style.border,
          style.text
        )}>
          <Icon size={16} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-base text-gray-200 font-serif leading-relaxed line-clamp-3 group-hover:text-white transition-colors">
            {fragment.text}
          </p>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500">
              <span className="uppercase tracking-wider">{fragment.type}</span>
              <span className="w-0.5 h-3 bg-white/10" />
              <span>{fragment.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            {fragment.tags.length > 0 ? (
              <div className="flex gap-2">
                {fragment.tags.map(tag => (
                  <span key={tag} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5 uppercase tracking-wider">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
                <ArrowRight size={12} className={cn("transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all", style.text)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
