
import React, { useState } from 'react';
import { useSoundtrack } from '../contexts/SoundtrackContext';
import { Play, Pause, Disc, Volume2, VolumeX, Maximize2, Sparkles, Wind, Sun, Leaf, Snowflake, Sprout, X, Music } from 'lucide-react';
import { cn } from '../lib/utils';
import { MusicSeason } from '../types';

const SEASON_ICONS: Record<MusicSeason, React.ElementType> = {
    Spring: Sprout,
    Summer: Sun,
    Autumn: Leaf,
    Winter: Snowflake,
};

const SEASON_COLORS: Record<MusicSeason, string> = {
    Spring: 'text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]',
    Summer: 'text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]',
    Autumn: 'text-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.5)]',
    Winter: 'text-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.5)]',
};

export const GlobalPlayer: React.FC = () => {
  const { currentTrack, isPlaying, pause, resume, isPlayerVisible, closePlayer, globalSeason } = useSoundtrack();
  const [isHovered, setIsHovered] = useState(false);

  if (!currentTrack || !isPlayerVisible) return null;

  const SeasonIcon = SEASON_ICONS[globalSeason] || Sparkles;
  const seasonColorClass = SEASON_COLORS[globalSeason] || 'text-white shadow-white/50';

  return (
    <div 
      className={cn(
        "absolute z-[90] transition-all duration-500 ease-spring-out flex items-center justify-start",
        // Positioned bottom-left of the content area
        "bottom-8 left-8" 
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Player Container - Expands Rightwards */}
      <div 
        className={cn(
          "relative flex items-center bg-[#050505]/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 ease-spring-out group",
          isHovered ? "w-[320px] rounded-2xl pr-12 pl-3 py-3" : "w-12 h-12 rounded-full p-0 justify-center cursor-pointer"
        )}
        onClick={(e) => {
            if (!isHovered) {
                setIsHovered(true); 
                e.stopPropagation();
            }
        }}
      >
        
        {/* Vinyl / Icon (Always Visible on Left) */}
        <div className={cn(
            "relative shrink-0 z-20 flex items-center justify-center transition-all duration-500",
            isHovered ? "mr-4" : "mr-0"
        )}>
             <div 
                className={cn(
                    "w-8 h-8 rounded-full border border-white/10 overflow-hidden relative flex items-center justify-center bg-black",
                    isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
                )}
                onClick={(e) => {
                    if (isHovered) {
                        e.stopPropagation();
                        isPlaying ? pause() : resume();
                    }
                }}
             >
                <img src={currentTrack.coverUrl} alt="cover" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-[#050505] rounded-full z-10" />
                
                {/* Play/Pause Overlay on Hover (when expanded) */}
                {isHovered && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                        {isPlaying ? <Pause size={10} className="text-white fill-white" /> : <Play size={10} className="text-white fill-white ml-0.5" />}
                    </div>
                )}
             </div>

             {/* Season Glow behind Vinyl */}
             <div className={cn("absolute inset-0 rounded-full blur-md opacity-40 z-0", seasonColorClass.split(' ')[0].replace('text-', 'bg-'))} />
        </div>

        {/* Expanded Content */}
        <div className={cn(
            "flex-1 min-w-0 flex flex-col justify-center transition-all duration-300",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute pointer-events-none"
        )}>
            <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-white truncate">{currentTrack.title}</span>
                <SeasonIcon size={10} className={cn(seasonColorClass.split(' ')[0])} />
            </div>
            <div className="text-[10px] text-gray-400 font-mono truncate">{currentTrack.artist}</div>
            
            {/* Mini Progress Bar */}
            <div className="w-full h-0.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                    className={cn("h-full transition-all duration-1000 ease-linear", seasonColorClass.split(' ')[0].replace('text-', 'bg-'))} 
                    style={{ width: isPlaying ? '100%' : '30%' }} 
                />
            </div>
        </div>

        {/* Close Button (Absolute right when expanded) */}
        <button 
            onClick={(e) => { e.stopPropagation(); closePlayer(); }}
            className={cn(
                "absolute top-1/2 -translate-y-1/2 right-3 p-1.5 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all",
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
            )}
        >
            <X size={14} />
        </button>

      </div>
    </div>
  );
};
