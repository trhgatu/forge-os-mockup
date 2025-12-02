
import React from 'react';
import { EpicScene } from '../../types';
import { cn } from '../../lib/utils';
import { Heart, Maximize2, Quote, Film } from 'lucide-react';

interface EpicSceneCardProps {
  scene: EpicScene;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const EpicSceneCard: React.FC<EpicSceneCardProps> = ({ scene, onClick, onToggleFavorite }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer border border-white/5 bg-black hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]"
    >
      {/* Image Layer */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={scene.imageUrl} 
          alt={scene.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
        {/* Scanlines Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20" />
      </div>

      {/* Content Layer */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between z-20">
        
        {/* Top Actions */}
        <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
          <div className="flex gap-2">
            {scene.emotionTags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/60 border border-white/10 text-white backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>
          <button 
            onClick={onToggleFavorite}
            className={cn(
              "p-2 rounded-full backdrop-blur-md transition-colors",
              scene.isFavorite ? "bg-red-500/20 text-red-500" : "bg-black/60 text-white hover:bg-white/20"
            )}
          >
            <Heart size={14} fill={scene.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Bottom Info */}
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-2 mb-1">
            <Film size={12} className="text-forge-cyan" />
            <span className="text-[10px] font-mono text-forge-cyan uppercase tracking-widest">{scene.series}</span>
          </div>
          <h3 className="text-lg font-display font-bold text-white leading-tight mb-2 drop-shadow-md group-hover:text-fuchsia-200 transition-colors">
            {scene.title}
          </h3>
          {scene.quote && (
            <div className="flex items-start gap-2 text-gray-300 text-xs font-serif italic opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              <Quote size={10} className="shrink-0 mt-0.5" />
              <span className="line-clamp-1">{scene.quote}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Border Glow */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-fuchsia-500/30 rounded-xl transition-colors duration-500 pointer-events-none" />
    </div>
  );
};
