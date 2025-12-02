
import React from 'react';
import { WikiProvider, useWiki } from '../contexts/WikiContext';
import { WikiSearch } from './WikiSearch';
import { WikiDetail } from './WikiDetail';
import { Globe, History } from 'lucide-react';
import { cn } from '../lib/utils';

const WikiContent: React.FC = () => {
  const { activeConcept, clearActive, history, selectConcept } = useWiki();

  return (
    <div className="h-full flex bg-[#020203] text-white relative overflow-hidden animate-in fade-in duration-1000">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-900/10 rounded-full blur-[200px] opacity-40" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-cyan-900/10 rounded-full blur-[200px] opacity-40" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10 flex flex-col">
        <div className="p-6 md:p-10 pb-0 max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 mb-6">
              <Globe size={12} /> Knowledge Gateway
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 tracking-tight">
              Wiki Interface
            </h1>
            <p className="text-lg text-gray-400 font-light max-w-xl mx-auto">
              Bridge the external world into your internal operating system.
            </p>
          </div>

          <WikiSearch />

          {/* History / Recent Concepts */}
          {history.length > 0 && (
            <div className="mt-20 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest mb-6 px-4">
                <History size={12} /> Recent Access
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 pb-20">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectConcept(item)}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-bold text-gray-300 group-hover:text-white truncate">
                        {item.title}
                      </div>
                      {item.language && (
                        <span className="text-[9px] font-mono text-gray-500 uppercase">{item.language}</span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-600 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Detail Overlay */}
      {activeConcept && (
        <WikiDetail concept={activeConcept} onClose={clearActive} />
      )}
    </div>
  );
};

export const WikiView: React.FC = () => {
  return (
    <WikiProvider>
      <WikiContent />
    </WikiProvider>
  );
};
