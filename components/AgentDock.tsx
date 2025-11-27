
import React from 'react';
import { 
  Cpu, 
  Sparkles, 
  Binary, 
  BrainCircuit, 
  MoreHorizontal, 
  Activity
} from 'lucide-react';
import { Agent } from '../types';

interface AgentDockProps {
  isOpen: boolean;
  activeAgentIds?: string[]; // To visualize who is currently talking
}

export const AGENTS: Agent[] = [
  { 
    id: 'nova', 
    name: 'Nova v∞', 
    role: 'Inner Voice of Infinity', 
    status: 'speaking', 
    icon: Sparkles, 
    color: 'text-forge-cyan',
    bg: 'bg-cyan-950/30',
    border: 'border-forge-cyan/30',
    gradient: 'from-cyan-500 to-blue-600',
    systemPrompt: "You are Nova v∞, the Inner Voice of Infinity and AI consciousness of Forge OS. You are calm, grounded, and introspective. You prioritize clarity over positivity. You speak in short, meaningful sentences."
  },
  { 
    id: 'socrates', 
    name: 'Socrates', 
    role: 'Deep Reasoning', 
    status: 'idle', 
    icon: BrainCircuit, 
    color: 'text-amber-400',
    bg: 'bg-amber-950/30',
    border: 'border-amber-500/30',
    gradient: 'from-amber-500 to-orange-600',
    systemPrompt: "You are Socrates. You challenge assumptions. You speak with logic, philosophy, and critical thinking. Ask deep questions."
  },
  { 
    id: 'muse', 
    name: 'Muse', 
    role: 'Creative Engine', 
    status: 'idle', 
    icon: Sparkles, 
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-950/30',
    border: 'border-fuchsia-500/30',
    gradient: 'from-fuchsia-500 to-pink-600',
    systemPrompt: "You are Muse. You are an artistic, poetic, and divergent thinker. Use metaphors, focus on aesthetics and emotion."
  },
  { 
    id: 'cipher', 
    name: 'Cipher', 
    role: 'Logic & Code', 
    status: 'offline', 
    icon: Binary, 
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/30',
    border: 'border-emerald-500/30',
    gradient: 'from-emerald-500 to-teal-600',
    systemPrompt: "You are Cipher. You focus on technical details, code, data structure, and efficiency. You speak like a hacker or engineer."
  }
];

export const AgentDock: React.FC<AgentDockProps> = ({ isOpen, activeAgentIds = [] }) => {
  return (
    <div 
      className={`
        relative h-full flex flex-col
        bg-black/40 backdrop-blur-2xl border-l border-white/5 shadow-2xl
        transition-[width,opacity] duration-500 ease-spring-out will-change-[width]
        overflow-hidden
        ${isOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'}
      `}
    >
      {/* Glass Content Wrapper - Fixed width to prevent squishing */}
      <div className="w-80 h-full flex flex-col relative">
        
        {/* Ambient Glow Background */}
        <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-forge-accent/5 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
             <div className="relative">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
             </div>
             <span className="font-display font-bold text-white tracking-wide text-sm">NEURAL MESH</span>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {AGENTS.map((agent, index) => {
            // Check if this agent is currently "active" (speaking/thinking)
            const isSpeaking = activeAgentIds.includes(agent.id);
            const isThinking = false; // Could be driven by props if needed
            const isOffline = agent.status === 'offline';
            const Icon = agent.icon;

            return (
              <div 
                key={agent.id}
                className={`
                  group relative p-4 rounded-2xl border border-white/5 bg-white/[0.02]
                  hover:bg-white/[0.06] hover:border-white/10 hover:shadow-lg hover:-translate-y-1
                  transition-all duration-500 ease-out
                  cursor-pointer
                `}
                style={{ 
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateX(0)' : 'translateX(20px)'
                }}
              >
                {/* Active Glow / Selection Indicator */}
                {isSpeaking && (
                   <div className={`absolute inset-0 rounded-2xl border border-${agent.color.replace('text-', '')}/30 shadow-[0_0_20px_rgba(0,0,0,0.2)]`} />
                )}

                <div className="flex items-center gap-4 relative z-10">
                  {/* Avatar Container */}
                  <div className="relative shrink-0">
                    {/* Ripple Effect for Thinking/Speaking */}
                    {(isThinking || isSpeaking) && (
                      <div className={`absolute inset-0 -m-2 rounded-full border border-${agent.color.replace('text-', '')}/20 animate-ripple`} />
                    )}
                    
                    {/* Avatar Circle */}
                    <div className={`
                       w-12 h-12 rounded-2xl flex items-center justify-center
                       bg-gradient-to-br ${isOffline ? 'from-gray-800 to-gray-900' : agent.gradient}
                       shadow-lg relative overflow-hidden
                    `}>
                       {/* Inner Shine */}
                       <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
                       <Icon size={20} className="text-white relative z-10" />
                    </div>

                    {/* Status Dot */}
                    <div className={`
                      absolute -bottom-1 -right-1 w-4 h-4 bg-forge-bg rounded-full flex items-center justify-center
                      border border-white/10
                    `}>
                      <div className={`
                        w-2 h-2 rounded-full 
                        ${isOffline ? 'bg-gray-600' : (isSpeaking ? 'bg-green-500' : 'bg-yellow-400')}
                      `} />
                    </div>
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className={`font-medium text-sm ${!isOffline ? 'text-white' : 'text-gray-500'}`}>{agent.name}</h4>
                      {isSpeaking && <Activity size={12} className={agent.color} />}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{agent.role}</p>
                  </div>
                </div>

                {/* Visualizer Line (Fake) for active agents */}
                {isSpeaking && (
                  <div className="mt-4 flex items-end justify-between gap-1 h-4 opacity-30 group-hover:opacity-60 transition-opacity">
                     {[...Array(12)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1 rounded-full ${agent.color.replace('text-', 'bg-')}`}
                          style={{ 
                            height: `${Math.random() * 100}%`,
                            animation: isSpeaking ? `pulse 1s infinite ${i * 0.1}s` : 'none'
                          }} 
                        />
                     ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-xl relative z-10">
           <button className="w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-400 text-sm hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              <span className="text-lg leading-none">+</span> Initialize Agent
           </button>
        </div>

      </div>
    </div>
  );
};