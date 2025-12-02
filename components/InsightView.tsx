
import React, { useState, useEffect } from 'react';
import { useInsight } from '../contexts/InsightContext';
import { InsightCard } from './InsightCard';
import { InsightDetail } from './InsightDetail';
import { Telescope, Brain, Plus, RefreshCw, Layers, Search, Sparkles } from 'lucide-react';
import { draftService } from '../services/draftService';
import { cn } from '../lib/utils';

export const InsightView: React.FC = () => {
  const { insights, activeInsight, setActiveInsight, isLoading, addInsight, patterns, refreshPatterns } = useInsight();
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState('');

  // Check for incoming drafts from Thought Stream
  useEffect(() => {
    if (draftService.hasDraft()) {
      const draft = draftService.getDraft();
      if (draft) {
        const process = async () => {
           setIsProcessing(true);
           setManualInput(draft.content); // Visual feedback
           // Prioritize analysis for drafts
           await addInsight(draft.content, 'thought');
           setManualInput('');
           setIsProcessing(false);
        };
        process();
      }
    }
  }, [addInsight]);

  const handleManualAdd = async () => {
    if (!manualInput.trim()) return;
    setIsProcessing(true);
    await addInsight(manualInput, 'manual');
    setManualInput('');
    setIsProcessing(false);
  };

  const filteredInsights = insights.filter(i => 
    i.text.toLowerCase().includes(filter.toLowerCase()) || 
    i.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="h-full flex bg-[#020204] text-white relative overflow-hidden animate-in fade-in duration-1000">
      
      {/* Background Ambience */}
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
              <Telescope size={12} className="text-forge-cyan animate-pulse-slow" /> Meaning Maker
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">Insight Engine</h1>
            <p className="text-gray-400 mt-2 font-light text-sm max-w-md">
              Detecting patterns and crystallizing meaning from the noise.
            </p>
          </div>
          
          <div className="hidden md:flex gap-6 items-center">
             <div className="text-right">
                <div className="text-2xl font-bold text-white">{insights.length}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Total Nodes</div>
             </div>
             <div className="w-px h-8 bg-white/10" />
             <div className="text-right">
                <div className="text-2xl font-bold text-forge-cyan">{patterns.length}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Active Patterns</div>
             </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Feed */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8 pb-32">
              
              {/* Input Area */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-forge-cyan/20 to-fuchsia-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-700" />
                <div className="relative flex items-center bg-[#050508] rounded-2xl border border-white/10 p-2 shadow-2xl">
                  <div className="pl-4 pr-2 text-gray-500">
                    <Brain size={20} />
                  </div>
                  <input 
                    type="text" 
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Input raw data for analysis..." 
                    className="flex-1 bg-transparent border-none text-white text-lg px-4 py-3 focus:outline-none focus:ring-0 placeholder-gray-600 font-serif"
                    onKeyDown={(e) => e.key === 'Enter' && handleManualAdd()}
                  />
                  <button 
                    onClick={handleManualAdd}
                    disabled={!manualInput.trim() || isProcessing}
                    className={cn(
                      "p-3 rounded-xl transition-all duration-300",
                      manualInput.trim() 
                        ? "bg-white text-black hover:bg-gray-200" 
                        : "bg-white/5 text-gray-500 hover:text-gray-300"
                    )}
                  >
                    {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : <Plus size={18} />}
                  </button>
                </div>
              </div>

              {/* Filters / Search */}
              <div className="flex items-center gap-4">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input 
                        type="text" 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Search patterns..." 
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-white/20 transition-all"
                    />
                 </div>
                 <div className="flex gap-2">
                    {patterns.slice(0, 3).map((pat, i) => (
                        <button key={i} className="hidden md:block px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-gray-400 hover:text-white hover:border-white/20 transition-all truncate max-w-[150px]">
                            {pat.title.split(':')[0]}
                        </button>
                    ))}
                 </div>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-forge-cyan animate-spin" />
                  <p className="text-xs font-mono uppercase tracking-widest">Synthesizing Meaning...</p>
                </div>
              ) : filteredInsights.length === 0 ? (
                <div className="text-center py-20 opacity-50 border border-dashed border-white/10 rounded-3xl">
                  <Sparkles size={48} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400 font-light">No insights found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredInsights.map((insight) => (
                    <InsightCard 
                        key={insight.id} 
                        insight={insight} 
                        onClick={() => setActiveInsight(insight)} 
                    />
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Clusters (Visible on Large Screens) */}
          <div className="w-80 border-l border-white/5 bg-black/20 hidden xl:flex flex-col p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
              <Layers size={14} /> Pattern Clusters
            </div>
            
            <div className="space-y-3 overflow-y-auto flex-1 scrollbar-hide">
              {patterns.map((pat, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group cursor-default relative overflow-hidden">
                  <div className="relative z-10 flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{pat.title}</span>
                    <span className="bg-white/10 text-[10px] px-1.5 py-0.5 rounded text-gray-400 font-mono">{pat.count}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden relative z-10">
                    <div 
                      className="h-full bg-forge-cyan/50 group-hover:bg-forge-cyan transition-all duration-500" 
                      style={{ width: `${Math.min(100, pat.count * 10)}%` }} 
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-forge-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
              <div className="text-[10px] font-mono text-indigo-300 mb-2 uppercase tracking-widest">System Note</div>
              <p className="text-xs text-gray-400 leading-relaxed font-serif italic">
                "Identity vectors are aligning. A shift in the 'Work' cluster suggests a need for rest."
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Detail Overlay */}
      {activeInsight && (
        <InsightDetail 
          insight={activeInsight} 
          onClose={() => setActiveInsight(null)} 
        />
      )}

    </div>
  );
};
