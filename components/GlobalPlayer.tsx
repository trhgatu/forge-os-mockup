
import React, { useState } from 'react';
import { useSoundtrack } from '../contexts/SoundtrackContext';
import { Play, Pause, Disc, Volume2, VolumeX, Maximize2, Sparkles, Wind, Sun, Leaf, Snowflake, Sprout, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { MusicSeason } from '../types';

const SEASON_ICONS: Record<MusicSeason, React.ElementType> = {
    Spring: Sprout,
    Summer: Sun,
    Autumn: Leaf,
    Winter: Snowflake,
};

const SEASON_COLORS: Record<MusicSeason, string> = {
    Spring: 'text-emerald-400 shadow-emerald-500/50',
    Summer: 'text-amber-400 shadow-amber-500/50',
    Autumn: 'text-orange-400 shadow-orange-500/50',
    Winter: 'text-indigo-400 shadow-indigo-500/50',
};

export const GlobalPlayer: React.FC = () => {
  const { currentTrack, isPlaying, volume, globalSeason, playTrack, pause, resume, setVolume, activeAmbience, isPlayerVisible, closePlayer } = useSoundtrack();
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTrack || !isPlayerVisible) return null;

  const SeasonIcon = SEASON_ICONS[globalSeason] || Sparkles;
  const seasonStyle = SEASON_COLORS[globalSeason] || 'text-white shadow-white/50';

  return (
    <div 
      className={cn(
        "fixed z-[100] transition-all duration-500 ease-spring-out group/player",
        isExpanded ? "bottom-8 left-1/2 -translate-x-1/2 w-[400px]" : "bottom-8 left-1/2 -translate-x-1/2 w-[300px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Close Button (Hover Only) */}
      <button 
         onClick={(e) => { e.stopPropagation(); closePlayer(); }}
         className={cn(
           "absolute -top-2 -right-2 p-1.5 rounded-full bg-black/80 border border-white/10 text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all opacity-0 group-hover/player:opacity-100 scale-90 hover:scale-100 z-50 cursor-pointer"
         )}
         title="Turn Off Soundtrack"
       >
         <X size={12} />
       </button>

      {/* Crystal Container */}
      <div className="relative bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl overflow-hidden group">
        
        {/* Progress Bar Background */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/10 w-full">
            <div className={cn("h-full transition-all duration-1000 ease-linear", seasonStyle.split(' ')[0].replace('text-', 'bg-'))} style={{ width: isPlaying ? '100%' : '30%' }} />
        </div>

        <div className="flex items-center justify-between p-2 pr-4">
            
            {/* Album Art / Play Toggle */}
            <div className="relative shrink-0 cursor-pointer" onClick={isPlaying ? pause : resume}>
                <div className={cn(
                    "w-10 h-10 rounded-full overflow-hidden border border-white/10 relative z-10",
                    isPlaying ? "animate-[spin_10s_linear_infinite]" : ""
                )}>
                    <img src={currentTrack.coverUrl} alt="cover" className="w-full h-full object-cover opacity-80" />
                </div>
                {/* Center Hole for Vinyl look */}
                <div className="absolute inset-0 m-auto w-2 h-2 bg-[#050505] rounded-full z-20" />
                
                {/* Hover Play Icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 hover:opacity-100 bg-black/50 rounded-full transition-opacity">
                    {isPlaying ? <Pause size={12} className="text-white fill-white" /> : <Play size={12} className="text-white fill-white" />}
                </div>
            </div>

            {/* Track Info */}
            <div className="flex-1 px-3 min-w-0 flex flex-col justify-center h-10" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate max-w-[150px]">{currentTrack.title}</span>
                    <SeasonIcon size={10} className={cn("shrink-0", seasonStyle.split(' ')[0])} />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                    <span className="truncate max-w-[100px]">{currentTrack.artist}</span>
                    {activeAmbience.length > 0 && (
                        <>
                            <span className="w-0.5 h-0.5 rounded-full bg-gray-500" />
                            <span className="text-forge-cyan flex items-center gap-1">
                                <Wind size={8} /> +{activeAmbience[0]}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Volume / Equalizer Visual */}
            <div className="flex items-center gap-3">
                <div className="flex items-end gap-0.5 h-4">
                    {[...Array(5)].map((_, i) => (
                        <div 
                            key={i} 
                            className={cn("w-0.5 rounded-full transition-all duration-300", seasonStyle.split(' ')[0].replace('text-', 'bg-'))}
                            style={{ 
                                height: isPlaying ? `${Math.random() * 100}%` : '20%',
                                animation: isPlaying ? `pulse 0.5s infinite ${i * 0.1}s` : 'none'
                            }} 
                        />
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
