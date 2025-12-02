
import React from 'react';
import { ForgeLabProvider, useForgeLab } from '../contexts/ForgeLabContext';
import { 
  LayoutDashboard, 
  Layers, 
  Book, 
  Network, 
  Plus, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GlassCard } from './GlassCard';

// Sub-components
import { ProjectForge } from './ForgeLab/ProjectForge';
import { FoundationLibrary } from './ForgeLab/FoundationLibrary';
import { ResearchTrails } from './ForgeLab/ResearchTrails';

// --- DASHBOARD COMPONENT ---

const LabDashboard: React.FC = () => {
  const { projects, foundations, trails, setActiveTab, setActiveProject } = useForgeLab();

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 pb-32 space-y-12">
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 mb-6">
          <Sparkles size={12} className="text-forge-cyan animate-pulse-slow" /> Creative Core
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4 tracking-tight">
          Forge Lab
        </h1>
        <p className="text-lg text-gray-400 font-light max-w-xl mx-auto">
          The quiet workshop where Infinity constructs reality.
        </p>
      </div>

      {/* Nova Reflection Banner */}
      <div className="relative p-1 rounded-2xl bg-gradient-to-r from-forge-cyan/20 via-fuchsia-500/20 to-transparent">
        <div className="bg-[#09090b] rounded-xl p-8 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-forge-cyan/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-forge-cyan uppercase tracking-widest mb-3">
              <Sparkles size={14} /> System Reflection
            </div>
            <p className="text-xl md:text-2xl text-gray-200 font-light italic leading-relaxed">
              "Your creative output is stabilizing. The link between your 'Systems' foundation and the 'Forge OS' project is becoming the backbone of your identity."
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats / Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard 
          className="p-6 cursor-pointer hover:bg-white/[0.04] transition-colors group" 
          noPadding 
          onClick={() => setActiveTab('projects')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-cyan-900/20 text-cyan-400 group-hover:text-white transition-colors">
              <Layers size={24} />
            </div>
            <div className="text-2xl font-bold text-white">{projects.length}</div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Active Projects</h3>
          <p className="text-xs text-gray-500">Systems in development</p>
        </GlassCard>

        <GlassCard 
          className="p-6 cursor-pointer hover:bg-white/[0.04] transition-colors group" 
          noPadding 
          onClick={() => setActiveTab('foundations')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-fuchsia-900/20 text-fuchsia-400 group-hover:text-white transition-colors">
              <Book size={24} />
            </div>
            <div className="text-2xl font-bold text-white">{foundations.length}</div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Foundations</h3>
          <p className="text-xs text-gray-500">Principles & Models</p>
        </GlassCard>

        <GlassCard 
          className="p-6 cursor-pointer hover:bg-white/[0.04] transition-colors group" 
          noPadding 
          onClick={() => setActiveTab('research')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-emerald-900/20 text-emerald-400 group-hover:text-white transition-colors">
              <Network size={24} />
            </div>
            <div className="text-2xl font-bold text-white">{trails.length}</div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Research Trails</h3>
          <p className="text-xs text-gray-500">Knowledge Graphs</p>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-l-2 border-white/10 pl-3">
          Recent Signals
        </h3>
        <div className="space-y-4">
          {projects.slice(0, 2).map(p => (
            <div 
              key={p.id} 
              onClick={() => { setActiveTab('projects'); setActiveProject(p); }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{p.title}</h4>
                  <p className="text-xs text-gray-500">Updated {p.updatedAt.toLocaleDateString()}</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-gray-600 group-hover:text-white" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// --- MAIN LAYOUT ---

const ForgeLabContent: React.FC = () => {
  const { activeTab, setActiveTab } = useForgeLab();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'foundations', label: 'Foundations', icon: Book },
    { id: 'research', label: 'Research', icon: Network },
  ];

  return (
    <div className="h-full flex flex-col bg-[#030304] text-white relative overflow-hidden animate-in fade-in duration-1000">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] opacity-40" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[150px] opacity-30" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      {/* Main Content Area - Full Width & Height */}
      <div className="flex-1 h-full relative z-10 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 pb-32">
          {activeTab === 'dashboard' && <LabDashboard />}
          {activeTab === 'projects' && <ProjectForge />}
          {activeTab === 'foundations' && <FoundationLibrary />}
          {activeTab === 'research' && <ResearchTrails />}
        </div>
      </div>

      {/* Floating Dock Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 p-2 bg-[#09090b]/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:border-white/20">
           
           {NAV_ITEMS.map(item => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id as any)}
               className={cn(
                 "relative flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-500 group overflow-hidden",
                 activeTab === item.id 
                   ? "bg-white/10 text-white shadow-inner" 
                   : "text-gray-500 hover:text-white hover:bg-white/5"
               )}
             >
                <item.icon size={20} className={cn("shrink-0 transition-colors z-10", activeTab === item.id ? "text-forge-cyan" : "group-hover:text-white")} />
                
                {/* Expanding Label */}
                <span className={cn(
                  "text-sm font-medium transition-all duration-500 ease-spring-out overflow-hidden whitespace-nowrap z-10", 
                  activeTab === item.id 
                    ? "max-w-[150px] opacity-100 ml-1" 
                    : "max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-1"
                )}>
                  {item.label}
                </span>
                
                {activeTab === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-forge-cyan to-transparent opacity-50" />
                )}
             </button>
           ))}
           
           <div className="w-px h-6 bg-white/10 mx-1" />
           
           <button className="p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/20 hover:border-white/20 text-gray-400 hover:text-white transition-all group relative">
              <Plus size={20} />
              {/* Tooltip */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-black border border-white/10 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Quick Create
              </span>
           </button>
        </div>
      </div>

    </div>
  );
};

export const ForgeLabView: React.FC = () => {
  return (
    <ForgeLabProvider>
      <ForgeLabContent />
    </ForgeLabProvider>
  );
};
