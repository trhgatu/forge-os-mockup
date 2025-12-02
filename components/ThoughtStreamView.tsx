
import React from 'react';
import { useThoughtStream } from '../contexts/ThoughtStreamContext';
import { ThoughtInput } from './ThoughtInput';
import { ThoughtCard } from './ThoughtCard';
import { ThoughtDetail } from './ThoughtDetail';
import { Wind, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export const ThoughtStreamView: React.FC = () => {
  const { fragments, activeFragment, setActiveFragment, stats, isLoading } = useThoughtStream();

  return (
    <div className="h-full flex bg-[#020204] text-white relative overflow-hidden animate-in fade-in duration-1000">
      
      {/* Deep Space Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[1000px] h-[1000px] bg-indigo-900/10 rounded-full blur-[200px] opacity-40" />
        <div className="absolute bottom-[-10%] right-[10%] w-[800px] h-[800px] bg-fuchsia-900/10 rounded-full blur-[200px] opacity-40" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="flex-1 h-full flex flex-col relative z-10">
        
        {/* Header */}
        <div className="shrink-0 p-8 flex justify-between items-end border-b border-white/5 bg-black/20 backdrop-blur-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 mb-4">
              <Wind size={12} className="text-forge-cyan animate-pulse-slow" /> Cognitive River
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">Thought Stream</h1>
            <p className="text-gray-400 mt-2 font-light text-sm max-w-md">
              Capture the fleeting drift of consciousness.
            </p>
          </div>
          
          {/* Stats Widget */}
          <div className="hidden md:flex gap-8 items-center">
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{stats.totalCount}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">Fragments</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-right">
              <div className="text-2xl font-bold text-forge-cyan capitalize flex items-center justify-end gap-2">
                {stats.flowState} <Activity size={16} />
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">Current Flow</div>
            </div>
          </div>
        </div>

        {/* The River */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-8">
          <div className="max-w-3xl mx-auto pb-32 relative">
            
            {/* Central Spine */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:-translate-x-1/2 pointer-events-none" />

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-forge-cyan animate-spin" />
                <p className="text-xs font-mono uppercase tracking-widest">Syncing Neural Stream...</p>
              </div>
            ) : fragments.length === 0 ? (
              <div className="text-center py-20 opacity-50 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                <Wind size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 font-light">The stream is quiet.</p>
              </div>
            ) : (
              fragments.map((fragment, index) => (
                <div 
                  key={fragment.id}
                  className={cn(
                    "relative transition-all duration-700 pl-8 md:pl-0",
                    // Alternating layout for desktop, single column for mobile
                    index % 2 === 0 ? "md:mr-auto md:pr-12 md:w-[85%] md:text-right" : "md:ml-auto md:pl-12 md:w-[85%] md:text-left"
                  )}
                >
                  {/* Spine Connector Dot */}
                  <div className={cn(
                    "absolute top-8 w-2 h-2 rounded-full bg-[#030304] border-2 border-white/20 z-10",
                    // Mobile pos vs Desktop pos
                    "left-3 md:left-1/2 md:-translate-x-1/2"
                  )} />
                  
                  <ThoughtCard 
                    fragment={fragment} 
                    onClick={() => setActiveFragment(fragment)} 
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Floating Input Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-[#020204] via-[#020204]/90 to-transparent z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <ThoughtInput />
          </div>
        </div>

      </div>

      {/* Detail Overlay */}
      {activeFragment && (
        <ThoughtDetail 
          fragment={activeFragment} 
          onClose={() => setActiveFragment(null)} 
        />
      )}

    </div>
  );
};
