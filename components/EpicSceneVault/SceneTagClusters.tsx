
import React from 'react';
import { cn } from '../../lib/utils';
import { Tag, Hash, Zap, Feather } from 'lucide-react';

interface SceneTagClustersProps {
  activeFilter: string | null;
  onFilterChange: (tag: string | null) => void;
  tags: {
    emotions: string[];
    archetypes: string[];
    vibes: string[];
  };
}

export const SceneTagClusters: React.FC<SceneTagClustersProps> = ({ activeFilter, onFilterChange, tags }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-8">
      <button 
        onClick={() => onFilterChange(null)}
        className={cn(
          "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border",
          activeFilter === null 
            ? "bg-white text-black border-white" 
            : "bg-transparent text-gray-500 border-transparent hover:bg-white/5 hover:text-white"
        )}
      >
        All Artifacts
      </button>

      <div className="w-px h-8 bg-white/10 mx-2" />

      {/* Emotion Cluster */}
      {tags.emotions.map(tag => (
        <button
          key={tag}
          onClick={() => onFilterChange(tag)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border",
            activeFilter === tag 
              ? "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50 shadow-[0_0_10px_rgba(217,70,239,0.2)]" 
              : "bg-transparent text-gray-500 border-white/5 hover:border-fuchsia-500/30 hover:text-fuchsia-300"
          )}
        >
          <Feather size={10} /> {tag}
        </button>
      ))}

      {/* Archetype Cluster */}
      {tags.archetypes.map(tag => (
        <button
          key={tag}
          onClick={() => onFilterChange(tag)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border",
            activeFilter === tag 
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
              : "bg-transparent text-gray-500 border-white/5 hover:border-cyan-500/30 hover:text-cyan-300"
          )}
        >
          <Hash size={10} /> {tag}
        </button>
      ))}

      {/* Vibe Cluster */}
      {tags.vibes.map(tag => (
        <button
          key={tag}
          onClick={() => onFilterChange(tag)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border",
            activeFilter === tag 
              ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]" 
              : "bg-transparent text-gray-500 border-white/5 hover:border-amber-500/30 hover:text-amber-300"
          )}
        >
          <Zap size={10} /> {tag}
        </button>
      ))}
    </div>
  );
};
