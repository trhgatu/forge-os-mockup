
import React, { useState } from 'react';
import { 
  Wind, 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  Zap, 
  AlignLeft, 
  ChevronRight,
  User,
  X,
  Sparkles,
  Inbox,
  Radio,
  ArrowUpRight
} from 'lucide-react';
import { useEchoes } from '../contexts/EchoesContext';
import { PublicEchoPortal } from './PublicEchoPortal';
import { Echo, EchoType, EchoTone } from '../types';
import { cn } from '../lib/utils';
import { GlassCard } from './GlassCard';

// --- CONFIG ---

const TYPE_CONFIG: Record<EchoType, { color: string, icon: React.ElementType, glow: string, label: string }> = {
  whisper: { color: 'text-emerald-400', icon: Wind, glow: 'shadow-[0_0_15px_rgba(52,211,153,0.1)]', label: 'Whisper' },
  signal: { color: 'text-forge-cyan', icon: Radio, glow: 'shadow-[0_0_15px_rgba(34,211,238,0.2)]', label: 'Signal' },
  echo: { color: 'text-violet-400', icon: Sparkles, glow: 'shadow-[0_0_20px_rgba(139,92,246,0.25)]', label: 'Deep Echo' },
};

const TONE_STYLES: Record<EchoTone, string> = {
  soft: 'border-emerald-500/20 text-emerald-200 bg-emerald-500/5',
  warm: 'border-amber-500/20 text-amber-200 bg-amber-500/5',
  cool: 'border-cyan-500/20 text-cyan-200 bg-cyan-500/5',
  deep: 'border-violet-500/20 text-violet-200 bg-violet-500/5',
  neutral: 'border-white/10 text-gray-400 bg-white/5'
};

// --- SUB-COMPONENTS ---

const EchoCard: React.FC<{ echo: Echo; onClick: () => void }> = ({ echo, onClick }) => {
  const typeConfig = TYPE_CONFIG[echo.type];
  const Icon = typeConfig.icon;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full",
        echo.viewed 
          ? "bg-white/[0.01] border-white/5 opacity-60 hover:opacity-100" 
          : `bg-white/[0.03] border-white/10 hover:-translate-y-1 hover:shadow-xl ${typeConfig.glow.replace('shadow-', 'hover:shadow-')}`
      )}
    >
      {/* Type Indicator */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-lg bg-white/5 border border-white/5", typeConfig.color)}>
            <Icon size={14} />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">
            {typeConfig.label}
          </span>
        </div>
        {!echo.viewed && <div className="w-1.5 h-1.5 rounded-full bg-forge-accent animate-pulse shadow-[0_0_8px_#7C3AED]" />}
      </div>

      {/* Content Preview */}
      <div className="flex-1 mb-6">
        <p className="text-base text-gray-300 leading-relaxed font-serif line-clamp-4 group-hover:text-white transition-colors">
          "{echo.message}"
        </p>
      </div>

      {/* Footer Meta */}
      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600">
          <span className="text-gray-400">{echo.from || 'Anonymous'}</span>
          <span className="w-px h-3 bg-white/10" />
          <span>{echo.createdAt.toLocaleDateString()}</span>
        </div>
        
        <div className={cn("px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider border", TONE_STYLES[echo.tone])}>
          {echo.tone}
        </div>
      </div>
    </div>
  );
};

const EchoDetailPanel: React.FC<{ echo: Echo; onClose: () => void }> = ({ echo, onClose }) => {
  const typeConfig = TYPE_CONFIG[echo.type];

  return (
    <div className="absolute inset-y-0 right-0 w-full md:w-[600px] bg-[#050508]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
      
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
        <div>
          <div className={cn("flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest mb-3", typeConfig.color)}>
            <typeConfig.icon size={14} /> Incoming {typeConfig.label}
          </div>
          <h2 className="text-3xl font-display font-bold text-white leading-tight">
            Transmission from <span className="text-gray-400">{echo.from || 'The Void'}</span>
          </h2>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/10"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 md:p-12">
        <div className="max-w-xl mx-auto space-y-12">
          
          {/* Main Message */}
          <div className="relative">
            <span className="absolute -top-6 -left-6 text-8xl text-white/[0.03] font-serif select-none">“</span>
            <p className="text-2xl md:text-3xl text-gray-200 font-serif leading-relaxed font-light">
              {echo.message}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 font-mono">
              <Clock size={14} /> Received {echo.createdAt.toLocaleString()}
            </div>
          </div>

          {/* Analysis Module */}
          <div className="p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent">
            <div className="bg-[#08080a] rounded-xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-forge-cyan uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={14} /> Neural Resonance
                </h3>
                <div className="h-px flex-1 bg-white/10 ml-4" />
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Emotional Tone</div>
                  <div className="text-lg text-white font-display capitalize">{echo.tone}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Signal Depth</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-forge-cyan shadow-[0_0_10px_#22D3EE]" style={{ width: `${echo.metadata.depth}%` }} />
                    </div>
                    <span className="text-sm font-mono text-forge-cyan">{echo.metadata.depth}%</span>
                  </div>
                </div>
              </div>

              {echo.metadata.keywords && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Detected Patterns</div>
                  <div className="flex gap-2">
                    {echo.metadata.keywords.map(kw => (
                      <span key={kw} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 font-mono">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- MAIN VIEW ---

export const EchoesView: React.FC = () => {
  const { echoes, activeEcho, setActiveEcho, markViewed, isLoading } = useEchoes();
  const [filter, setFilter] = useState<EchoType | 'all'>('all');
  const [showPortal, setShowPortal] = useState(false);

  const filteredEchoes = filter === 'all' ? echoes : echoes.filter(e => e.type === filter);

  const handleEchoClick = (echo: Echo) => {
    markViewed(echo.id);
    setActiveEcho(echo);
  };

  return (
    <div className="h-full flex bg-[#050508] text-white relative overflow-hidden animate-in fade-in duration-1000">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-slate-900/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-900/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10 flex flex-col">
        <div className="max-w-7xl mx-auto w-full p-6 md:p-10 pb-32">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 mb-4 backdrop-blur-md">
                <Inbox size={12} className="text-forge-cyan" /> Cosmic Inbox
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-3 tracking-tight">
                Echoes
              </h1>
              <p className="text-lg text-gray-400 font-light max-w-xl leading-relaxed">
                Signals, whispers, and fragments drifting in from the exterior world.
              </p>
            </div>
            
            {/* Action Group */}
            <div className="flex gap-4">
               {/* Filters */}
              <div className="flex p-1 bg-white/5 border border-white/5 rounded-xl backdrop-blur-sm">
                {['all', 'whisper', 'signal', 'echo'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t as any)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all capitalize",
                      filter === t 
                        ? "bg-white text-black shadow-lg" 
                        : "text-gray-500 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setShowPortal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                <ArrowUpRight size={18} /> Open Portal
              </button>
            </div>
          </div>

          {/* Feed Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-white/5 border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEchoes.map((echo) => (
                <EchoCard 
                  key={echo.id} 
                  echo={echo} 
                  onClick={() => handleEchoClick(echo)} 
                />
              ))}
            </div>
          )}

          {!isLoading && filteredEchoes.length === 0 && (
            <div className="py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
              <Wind className="mx-auto mb-4 text-white/20 animate-pulse-slow" size={48} />
              <p className="text-gray-500 font-light text-lg">The frequency is silent.</p>
            </div>
          )}

        </div>
      </div>

      {/* Overlays */}
      {activeEcho && (
        <EchoDetailPanel 
          echo={activeEcho} 
          onClose={() => setActiveEcho(null)} 
        />
      )}

      {showPortal && (
        <PublicEchoPortal onClose={() => setShowPortal(false)} />
      )}

    </div>
  );
};
