
import React, { useRef, useEffect } from 'react';
import { EpicScene } from '../../types';
import { cn } from '../../lib/utils';
import { Heart, Quote, Film, Music } from 'lucide-react';
import { gsap } from 'gsap';

interface EpicSceneCardProps {
  scene: EpicScene;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const EpicSceneCard: React.FC<EpicSceneCardProps> = ({ scene, onClick, onToggleFavorite }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    
    if (!card || !image) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      gsap.to(image, {
        x: (x - 0.5) * 20,
        y: (y - 0.5) * 20,
        scale: 1.15,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        x: 0,
        y: 0,
        scale: 1.05,
        duration: 0.7,
        ease: 'power2.out'
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      className="group relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border border-white/5 bg-black hover:border-fuchsia-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(124,58,237,0.2)]"
    >
      {/* Image Layer */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          ref={imageRef}
          src={scene.imageUrl} 
          alt={scene.title} 
          className="w-full h-full object-cover scale-105 opacity-80 group-hover:opacity-100 will-change-transform"
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-black/60 opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
        {/* Scanlines Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_3px,3px_100%] opacity-30" />
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
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-2 mb-1">
            <Film size={12} className="text-cyan-400" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{scene.series}</span>
          </div>
          <h3 className="text-xl font-display font-bold text-white leading-tight mb-2 drop-shadow-lg group-hover:text-fuchsia-200 transition-colors">
            {scene.title}
          </h3>
          
          <div className="flex items-center justify-between text-gray-400 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-500">
             {scene.quote ? (
                <div className="flex items-center gap-2 italic flex-1 truncate mr-4">
                  <Quote size={10} className="shrink-0" />
                  <span className="truncate">"{scene.quote}"</span>
                </div>
             ) : <div />}
             
             {scene.soundtrack && (
                <div className="flex items-center gap-1 text-[9px] uppercase font-mono tracking-wider">
                   <Music size={10} /> {scene.soundtrack.title}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
