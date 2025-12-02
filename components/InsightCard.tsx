
import React from 'react';
import { Insight, InsightSource } from '../types';
import { cn } from '../lib/utils';
import { Sparkles, BookOpen, Wind, Activity, Zap, Brain, Fingerprint, Database, Smile, ArrowRight } from 'lucide-react';

const SOURCE_ICONS: Record<InsightSource, React.ElementType> = {
  thought: Wind,
  journal: BookOpen,
  wiki: Database,
  echo: Activity,
  memory: Brain,
  mood: Smile,
  energy: Zap,
  identity: Fingerprint,
  manual: Sparkles
};

const SOURCE_STYLES: Record<InsightSource, { text: string, border: string, bg: string, shadow: string }> = {
  thought: { text: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/5', shadow: 'hover:shadow-cyan-500/20' },
  journal: { text: 'text-fuchsia-400', border: 'border-fuchsia-500/30', bg: 'bg-fuchsia-500/5', shadow: 'hover:shadow-fuchsia-500/20' },
  wiki: { text: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/5', shadow: 'hover:shadow-blue-500/20' },
  echo: { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', shadow: 'hover:shadow-emerald-500/20' },
  memory: { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/5', shadow: 'hover:shadow-amber-500/20' },
  mood: { text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/5', shadow: 'hover:shadow-rose-500/20' },
  energy: { text: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/5', shadow: 'hover:shadow-yellow-500/20' },
  identity: { text: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-500/5', shadow: 'hover:shadow-violet-500/20' },
  manual: { text: 'text-white', border: 'border-white/20', bg: 'bg-white/5', shadow: 'hover:shadow-white/10' }
};

interface InsightCardProps {
  insight: Insight;
  onClick: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, onClick }) => {
  const Icon = SOURCE_ICONS[insight.source] || Sparkles;
  const style = SOURCE_STYLES[insight.source] || SOURCE_STYLES.manual;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative p-6 rounded-2xl border backdrop-blur-sm cursor-pointer transition-all duration-500 ease-out",
        "bg-[#09090b]/60 hover:bg-[#09090b]/80 hover:-translate-y-1 hover:shadow-xl",
        style.border,
        style.shadow,
        "mb-4 animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards"
      )}
    >
      {/* Background Gradient Hint */}
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl bg-gradient-to-br from-transparent to-transparent", style.bg.replace('bg-', 'via-'))} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg border bg-black/40", style.border, style.text)}>
            <Icon size={14} />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 group-hover:text-gray-400 transition-colors">
            {insight.source}
          </span>
        </div>
        <span className="text-[10px] text-gray-600 font-mono">
          {insight.createdAt.toLocaleDateString()}
        </span>
      </div>

      {/* Core Text */}
      <p className="text-lg font-display font-medium text-gray-200 leading-relaxed mb-4 group-hover:text-white transition-colors relative z-10">
        "{insight.text}"
      </p>

      {/* Reflection & Footer */}
      <div className="relative z-10">
        {insight.reflection && (
          <div className="pl-3 border-l border-white/10 mb-4">
            <p className="text-sm text-gray-400 italic font-serif leading-relaxed line-clamp-2">
              {insight.reflection}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
          <div className="flex gap-2">
            {insight.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-gray-500 border border-white/5 uppercase tracking-wider">
                #{tag}
              </span>
            ))}
          </div>
          <div className={cn("opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0", style.text)}>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};
