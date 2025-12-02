
import React, { useState, useRef } from 'react';
import { useForgeLab } from '../../contexts/ForgeLabContext';
import { ForgeProject, ForgeProjectStatus } from '../../types';
import { GlassCard } from '../GlassCard';
import { cn } from '../../lib/utils';
import { 
  Layers, 
  GitCommit, 
  Sparkles, 
  X, 
  Tag, 
  Cpu, 
  Calendar,
  CheckCircle2,
  Circle,
  ArrowRight,
  Code,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layout,
  Maximize2
} from 'lucide-react';

const STATUS_OPTIONS: ForgeProjectStatus[] = ['idea', 'active', 'paused', 'completed'];

const BlueprintView: React.FC<{ project: ForgeProject; onClose: () => void }> = ({ project, onClose }) => {
  const { updateProject } = useForgeLab();
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const handleStatusChange = (status: ForgeProjectStatus) => {
    updateProject(project.id, { status });
    setIsStatusOpen(false);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#050508] animate-in slide-in-from-bottom-4 duration-500 flex flex-col">
      
      {/* --- Fixed Header Layer (High Z-Index for Dropdown) --- */}
      <div className="relative z-20 w-full shrink-0 border-b border-white/5 bg-[#050508]/95 backdrop-blur-xl">
        {/* Background Atmosphere for Header */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[50%] left-[20%] w-[500px] h-[500px] bg-cyan-900/20 blur-[100px] opacity-50" />
        </div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col gap-6">
            {/* Top Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500 uppercase tracking-widest bg-cyan-950/30 px-3 py-1.5 rounded border border-cyan-500/20">
                    <Cpu size={12} /> Blueprint Mode
                 </div>
                 <div className="h-px w-8 bg-white/10" />
                 <span className="text-xs text-gray-500 font-mono">ID: {project.id}</span>
              </div>
              <button 
                onClick={onClose} 
                className="group p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 hover:border-white/20"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Title & Status Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-xl mb-2">
                    {project.title}
                </h1>
                <p className="text-gray-400 text-sm md:text-base font-light max-w-2xl line-clamp-1">
                    {project.description}
                </p>
              </div>

              {/* Interactive Status Dropdown */}
              <div className="relative">
                  <button 
                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-xl border transition-all text-xs font-bold uppercase tracking-widest hover:brightness-125",
                      project.status === 'active' ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' :
                      project.status === 'completed' ? 'bg-green-500/10 border-green-500/50 text-green-400' :
                      project.status === 'paused' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400' :
                      'bg-white/5 border-white/20 text-gray-400'
                    )}
                  >
                    <span className={cn(
                        "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
                        project.status === 'active' ? "bg-cyan-500" :
                        project.status === 'completed' ? "bg-green-500" :
                        project.status === 'paused' ? "bg-yellow-500" :
                        "bg-gray-500"
                      )} 
                    />
                    {project.status} 
                    <ChevronDown size={14} className={cn("transition-transform", isStatusOpen ? "rotate-180" : "")} />
                  </button>
                  
                  {isStatusOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#0F0F13] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[60] flex flex-col py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      {STATUS_OPTIONS.map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(s)}
                          className={cn(
                            "px-4 py-3 text-left text-xs font-mono uppercase transition-colors flex items-center gap-3",
                            project.status === s ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                          )}
                        >
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            s === 'active' ? "bg-cyan-500" :
                            s === 'completed' ? "bg-green-500" :
                            s === 'paused' ? "bg-yellow-500" :
                            "bg-gray-500"
                          )} />
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
            </div>
        </div>
      </div>

      {/* --- Scrollable Content Layer --- */}
      <div className="flex-1 overflow-y-auto relative z-10">
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        <div className="max-w-7xl mx-auto p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Milestones */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <GitCommit size={14} /> Execution Path
              </h3>
              <div className="space-y-4 pl-2 relative">
                <div className="absolute left-[19px] top-4 bottom-4 w-px bg-white/5" />
                {project.milestones.map((m, i) => (
                  <div key={m.id} className="relative flex items-start gap-6 group">
                    <div className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300 bg-[#050508]",
                      m.isCompleted 
                        ? "border-cyan-500 text-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                        : "border-white/10 text-gray-600 group-hover:border-white/30"
                    )}>
                      {m.isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </div>
                    <div className="flex-1 pt-1 pb-4 border-b border-white/5 group-last:border-0">
                      <h4 className={cn(
                        "text-lg font-medium transition-colors", 
                        m.isCompleted ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                      )}>
                        {m.title}
                      </h4>
                      {m.date && <div className="text-xs font-mono text-gray-600 mt-1">{m.date}</div>}
                    </div>
                  </div>
                ))}
                
                {/* Add Item Ghost */}
                <div className="relative flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity cursor-pointer group pt-2">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center bg-[#050508] z-10 group-hover:border-white group-hover:text-white text-gray-600">
                    <Plus size={18} />
                  </div>
                  <div className="text-sm text-gray-500 font-mono uppercase tracking-wider group-hover:text-white">Add Milestone</div>
                </div>
              </div>
            </section>

            {/* Tech Stack */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Code size={14} /> System Architecture
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map(tech => (
                  <div key={tech} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 flex items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" /> {tech}
                  </div>
                ))}
                <button className="px-4 py-2 rounded-lg border border-dashed border-white/10 text-sm text-gray-500 hover:text-white hover:border-white/30 transition-all">
                    + Add Tech
                </button>
              </div>
            </section>

          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            
            {/* Nova Reflection */}
            {project.novaReflection && (
              <div className="p-1 rounded-2xl bg-gradient-to-br from-cyan-900/20 via-transparent to-transparent">
                <div className="p-6 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
                    <Sparkles size={14} /> Nova Observation
                    </div>
                    <p className="text-base text-gray-200 font-serif italic leading-relaxed">
                    "{project.novaReflection}"
                    </p>
                </div>
              </div>
            )}

            {/* Stats / Metadata */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
                <div>
                    <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Created</h4>
                    <div className="text-sm text-white">{project.createdAt.toLocaleDateString()}</div>
                </div>
                <div>
                    <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Progress</h4>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 w-[65%]" />
                    </div>
                    <div className="text-right text-xs text-cyan-400 mt-1 font-mono">65%</div>
                </div>
                <div>
                    <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(t => (
                            <span key={t} className="text-[10px] px-2 py-1 rounded bg-black border border-white/10 text-gray-400">#{t}</span>
                        ))}
                    </div>
                </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

// --- CAROUSEL COMPONENTS ---

const ProjectCard: React.FC<{ project: ForgeProject; onClick: () => void; variant?: 'hero' | 'standard' }> = ({ project, onClick, variant = 'standard' }) => (
  <div 
    onClick={onClick}
    className={cn(
      "group relative rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between shrink-0",
      variant === 'hero' 
        ? 'w-full h-[400px] bg-[#0A0A0F] border-white/10 hover:border-cyan-500/30' 
        : 'w-[280px] md:w-[320px] h-[360px] bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-2'
    )}
  >
    {/* Background Image / Gradient */}
    <div className={cn(
        "absolute inset-0 bg-gradient-to-br transition-opacity duration-700",
        variant === 'hero' 
            ? 'from-cyan-950/30 via-[#050508] to-[#050508] opacity-60 group-hover:opacity-80' 
            : 'from-white/5 to-transparent opacity-0 group-hover:opacity-100'
    )} />
    
    {/* Grid Overlay for Hero */}
    {variant === 'hero' && (
       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
    )}

    {/* Header Status */}
    <div className="relative z-10 p-6 flex justify-between items-start">
        <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-300",
            variant === 'hero' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-400 group-hover:text-white'
        )}>
            <Layers size={20} />
        </div>
        <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md",
            project.status === 'active' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 
            'bg-white/5 border-white/10 text-gray-500'
        )}>
            {project.status}
        </div>
    </div>

    {/* Main Info */}
    <div className="relative z-10 p-6 pt-0 flex-1 flex flex-col justify-end">
        <h3 className={cn(
            "font-display font-bold text-white mb-2 leading-tight group-hover:text-cyan-400 transition-colors",
            variant === 'hero' ? 'text-4xl' : 'text-xl'
        )}>
            {project.title}
        </h3>
        <p className={cn(
            "text-gray-400 leading-relaxed",
            variant === 'hero' ? 'text-lg line-clamp-2 max-w-2xl' : 'text-xs line-clamp-3'
        )}>
            {project.description}
        </p>
    </div>

    {/* Footer */}
    <div className="relative z-10 p-6 pt-4 border-t border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
        <div className="flex -space-x-2">
            {project.technologies.slice(0, 3).map((tech, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-[#15151A] border border-white/10 flex items-center justify-center text-[8px] text-gray-500 uppercase" title={tech}>
                    {tech[0]}
                </div>
            ))}
            {project.technologies.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-[#15151A] border border-white/10 flex items-center justify-center text-[8px] text-gray-500">
                    +
                </div>
            )}
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 group-hover:text-white transition-colors">
            View Blueprint <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
        </div>
    </div>
  </div>
);

const ProjectCarousel: React.FC<{ projects: ForgeProject[]; onSelect: (p: ForgeProject) => void }> = ({ projects, onSelect }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const amount = 340;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group/carousel">
            <div className="flex justify-between items-center mb-6 px-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Layout size={16} className="text-gray-500" /> Active Gallery
                </h3>
                <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
            
            <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x scroll-smooth"
            >
                {/* Create New Card */}
                <div className="w-[280px] md:w-[320px] h-[360px] shrink-0 rounded-3xl border border-dashed border-white/10 hover:border-white/30 hover:bg-white/[0.02] flex flex-col items-center justify-center cursor-pointer transition-all group snap-start">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:scale-110 transition-all mb-6 border border-white/5 group-hover:border-white/20">
                        <Plus size={32} />
                    </div>
                    <span className="text-sm font-bold text-gray-500 group-hover:text-white uppercase tracking-widest">Initialize Project</span>
                </div>

                {projects.map(p => (
                    <div key={p.id} className="snap-start shrink-0">
                        <ProjectCard project={p} onClick={() => onSelect(p)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ProjectForge: React.FC = () => {
  const { projects, activeProject, setActiveProject } = useForgeLab();

  // Sort projects to find the "Spotlight" (most recently updated or flagged)
  const spotlightProject = projects.length > 0 ? projects[0] : null;
  const otherProjects = projects.length > 0 ? projects.slice(1) : [];

  return (
    <div className="relative h-full flex flex-col">
      <div className="max-w-7xl mx-auto w-full p-6 md:p-10 pb-32 space-y-16">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Project Forge</h2>
            <p className="text-gray-400 text-sm">The workshop of reality construction.</p>
          </div>
        </div>

        {/* 1. Spotlight Section */}
        {spotlightProject && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles size={14} className="text-cyan-400" /> Spotlight System
                </div>
                <ProjectCard 
                    project={spotlightProject} 
                    onClick={() => setActiveProject(spotlightProject)} 
                    variant="hero" 
                />
            </div>
        )}

        {/* 2. Carousel Section */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <ProjectCarousel projects={otherProjects} onSelect={setActiveProject} />
        </div>

      </div>

      {/* Blueprint Overlay */}
      {activeProject && (
        <BlueprintView project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </div>
  );
};
