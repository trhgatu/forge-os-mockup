
import React, { useEffect, useRef, useMemo } from 'react';
import { useSeason } from '../contexts/SeasonContext';
import { cn } from '../lib/utils';

interface SeasonalWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const Particles: React.FC<{ type: 'dust' | 'shimmer' | 'leaves' | 'snow'; color: string }> = ({ type, color }) => {
  const count = type === 'dust' ? 30 : type === 'snow' ? 40 : 15;
  const particles = useMemo(() => Array.from({ length: count }), [count]);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((_, i) => {
        const left = `${Math.random() * 100}%`;
        const top = `${Math.random() * 100}%`;
        const delay = `${Math.random() * 5}s`;
        const duration = `${type === 'dust' ? 15 + Math.random() * 10 : 5 + Math.random() * 10}s`;
        
        let animationClass = '';
        let sizeClass = 'w-1 h-1';
        
        if (type === 'dust') {
            animationClass = 'animate-float'; 
            sizeClass = Math.random() > 0.5 ? 'w-0.5 h-0.5' : 'w-1 h-1';
        } else if (type === 'shimmer') {
             animationClass = 'animate-pulse-slow';
             sizeClass = 'w-1.5 h-1.5 blur-[1px]';
        } else if (type === 'snow') {
             animationClass = 'animate-[fall_15s_linear_infinite]';
             sizeClass = Math.random() > 0.7 ? 'w-1 h-1' : 'w-0.5 h-0.5';
        } else if (type === 'leaves') {
             animationClass = 'animate-[sway_10s_ease-in-out_infinite]';
             sizeClass = 'w-2 h-2 opacity-60';
        }

        return (
          <div
            key={i}
            className={cn("absolute rounded-full opacity-30 transition-colors duration-1000", animationClass, sizeClass, color)}
            style={{
              left,
              top,
              animationDelay: delay,
              animationDuration: duration,
            }}
          />
        );
      })}
    </div>
  );
};

export const SeasonalWrapper: React.FC<SeasonalWrapperProps> = ({ children, className }) => {
  const { theme } = useSeason();

  // CSS variable injection for dynamic theming
  const style = {
    '--season-primary': theme.primary,
    '--season-accent': theme.accent,
    '--season-border': theme.border,
  } as React.CSSProperties;

  return (
    <div className={cn("relative w-full h-full overflow-hidden transition-colors duration-1000 bg-[#050505]", className)} style={style}>
      
      {/* 1. Global Gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br transition-all duration-1000 opacity-40", theme.gradient)} />
      
      {/* 2. Noise Overlay */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* 3. Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_40%,#050505_100%)] pointer-events-none opacity-80" />

      {/* 4. Particles */}
      <Particles 
        type={theme.particle} 
        color={
          theme.id === 'Spring' ? 'bg-emerald-200' :
          theme.id === 'Summer' ? 'bg-amber-200' :
          theme.id === 'Autumn' ? 'bg-orange-300' : 'bg-slate-300'
        } 
      />

      {/* 5. Content Layer */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
