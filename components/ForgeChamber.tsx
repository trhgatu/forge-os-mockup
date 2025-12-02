
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GlassCard } from './GlassCard';
import { streamChatResponse } from '../services/geminiService';
import { cn } from '../lib/utils';
import { 
  Send, 
  User, 
  PanelRightOpen, 
  PanelRightClose, 
  ToggleLeft, 
  ToggleRight, 
  Sparkles, 
  Bot, 
  Cpu, 
  Activity, 
  Zap, 
  Aperture,
  Hexagon
} from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';
import { AgentDock, AGENTS } from './AgentDock';
import { Message, AgentId, Agent } from '../types';

// --- VISUAL SUB-COMPONENTS ---

const BackgroundGrid = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020203]">
    {/* Local Styles for Animations */}
    <style>{`
      @keyframes grid-flow {
        0% { background-position: 0% 0%; }
        100% { background-position: 0% 100%; }
      }
      @keyframes float-slow {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
    `}</style>

    {/* Moving Perspective Grid */}
    <div 
      className="absolute inset-[-50%] opacity-20"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        transform: 'perspective(500px) rotateX(60deg) scale(2)',
        transformOrigin: 'top center',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        animation: 'grid-flow 20s linear infinite'
      }}
    />
    
    {/* Horizon Glow */}
    <div className="absolute top-[-10%] left-0 right-0 h-[400px] bg-gradient-to-b from-forge-accent/20 to-transparent blur-[100px] opacity-40" />

    {/* Floating Particles */}
    <div className="absolute inset-0">
      {[...Array(30)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 3 + 'px',
            height: Math.random() * 3 + 'px',
            backgroundColor: Math.random() > 0.5 ? '#22D3EE' : '#7C3AED',
            opacity: Math.random() * 0.5 + 0.1,
            animationDuration: `${10 + Math.random() * 20}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  </div>
);

const AgentDrone: React.FC<{ 
  agent: Agent; 
  isActive: boolean; 
  isTyping: boolean;
  position: { top: string; left: string; delay: string };
}> = ({ agent, isActive, isTyping, position }) => {
  const Icon = agent.icon;
  
  return (
    <div 
      className={cn(
        "absolute transition-all duration-1000 ease-in-out z-10 pointer-events-none hidden md:block", // Visible on md+
        isActive ? "scale-110 opacity-100 z-20" : "scale-75 opacity-30 grayscale blur-[1px]"
      )}
      style={{ 
        top: position.top, 
        left: position.left,
        animation: `float-slow ${isActive ? '4s' : '8s'} ease-in-out infinite alternate`,
        animationDelay: position.delay
      }}
    >
      {/* Drone Body Container */}
      <div className="relative group flex flex-col items-center">
        
        {/* Scanning Beam (Active Only) */}
        {isActive && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[200px] h-[300px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none -z-10 [clip-path:polygon(50%_0%,_0%_100%,_100%_100%)] animate-pulse" />
        )}

        {/* Outer Tech Ring */}
        <div className={cn(
          "w-24 h-24 rounded-full border flex items-center justify-center backdrop-blur-sm bg-black/40 relative transition-colors duration-500",
          isActive ? `border-${agent.color.split('-')[1]}-500/50` : 'border-white/5'
        )}>
          {/* Rotating Segments */}
          <div className={cn(
            "absolute inset-0 rounded-full border-t-2 border-b-2 border-transparent transition-all duration-1000",
            isActive ? `border-t-${agent.color.split('-')[1]}-400 border-b-${agent.color.split('-')[1]}-400 animate-[spin_3s_linear_infinite]` : "border-white/10 animate-[spin_20s_linear_infinite]"
          )} />
          
          {/* Inner Core */}
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 relative overflow-hidden border",
            agent.bg,
            agent.border
          )}>
             <div className={cn("absolute inset-0 opacity-50 animate-pulse", agent.color.replace('text-', 'bg-'))} />
             <Icon size={24} className={cn("relative z-10 drop-shadow-lg", agent.color)} />
          </div>

          {/* Typing Indicator Orb */}
          {isTyping && (
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping shadow-[0_0_10px_white]" />
          )}
        </div>

        {/* Thruster Flame */}
        <div className={cn(
            "mt-[-5px] w-4 h-12 bg-gradient-to-b from-current to-transparent blur-md opacity-60 animate-pulse transition-all duration-500",
            agent.color
        )} />

        {/* Identity Label */}
        <div className={cn(
          "absolute -bottom-8 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md transition-all duration-500",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        )}>
          <span className={cn("text-[10px] font-bold font-mono tracking-widest uppercase", agent.color)}>
            {agent.name}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export const ForgeChamber: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', agentId: 'nova', text: 'Neural Core online. I am listening.' }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDockOpen, setIsDockOpen] = useState(true);
  const [isRoundtableMode, setIsRoundtableMode] = useState(false);
  const [activeAgentIds, setActiveAgentIds] = useState<string[]>(['nova']);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Drone Positions (Percentage based for responsiveness)
  const dronePositions = useMemo(() => ({
    nova: { top: '15%', left: '50%', delay: '0s' },
    socrates: { top: '25%', left: '80%', delay: '1.2s' },
    muse: { top: '25%', left: '20%', delay: '2.5s' },
    cipher: { top: '50%', left: '15%', delay: '0.5s' },
    // Extra dummy positions if needed
  }), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getAgent = (id?: AgentId): Agent => AGENTS.find(a => a.id === id) || AGENTS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));

    try {
      if (isRoundtableMode) {
        const roundtableAgents = AGENTS.filter(a => ['muse', 'socrates', 'cipher'].includes(a.id));
        setActiveAgentIds(roundtableAgents.map(a => a.id));
        
        const newIds: Record<string, string> = {};
        const newMessages: Message[] = [];
        
        roundtableAgents.forEach(agent => {
          const msgId = `msg-${agent.id}-${Date.now()}`;
          newIds[agent.id] = msgId;
          newMessages.push({ id: msgId, role: 'model', agentId: agent.id as AgentId, text: '' });
        });

        setMessages(prev => [...prev, ...newMessages]);

        const promises = roundtableAgents.map(async (agent, index) => {
           await new Promise(r => setTimeout(r, index * 800)); // Stagger starts
           const personaPrompt = `${agent.systemPrompt}\nUser Query: "${userMsg.text}"\nRespond briefly in your persona.`;
           
           const result = await streamChatResponse([], personaPrompt, agent.systemPrompt);
           let fullText = '';
           for await (const chunk of result) {
              const c = chunk as GenerateContentResponse;
              if (c.text) {
                  fullText += c.text;
                  setMessages(prev => prev.map(msg => msg.id === newIds[agent.id] ? { ...msg, text: fullText } : msg));
              }
           }
        });
        await Promise.all(promises);
      } else {
        const modelMsgId = (Date.now() + 1).toString();
        setActiveAgentIds(['nova']);
        setMessages(prev => [...prev, { id: modelMsgId, role: 'model', agentId: 'nova', text: '' }]);
        const result = await streamChatResponse(history, userMsg.text);
        let fullText = '';
        for await (const chunk of result) {
           const c = chunk as GenerateContentResponse;
           if (c.text) {
               fullText += c.text;
               setMessages(prev => prev.map(msg => msg.id === modelMsgId ? { ...msg, text: fullText } : msg));
           }
        }
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Error: Neural Core Interrupted.' }]);
    } finally {
      setIsStreaming(false);
      setTimeout(() => {
          if (!isStreaming) setActiveAgentIds(['nova']);
      }, 5000);
    }
  };

  return (
    <div className="h-full flex relative overflow-hidden bg-[#020203]">
       
       {/* Layer 0: Holographic Environment */}
       <BackgroundGrid />

       {/* Layer 1: Agent Drones (Visuals) */}
       {AGENTS.map(agent => (
         <AgentDrone 
            key={agent.id}
            agent={agent}
            isActive={activeAgentIds.includes(agent.id)}
            isTyping={isStreaming && activeAgentIds.includes(agent.id)}
            // @ts-ignore
            position={dronePositions[agent.id] || { top: '10%', left: '10%', delay: '0s' }}
         />
       ))}

       {/* Layer 2: Main Chat Interface */}
       <div className="flex-1 flex flex-col min-w-0 z-20 relative">
          
          {/* Chat Header */}
          <div className="shrink-0 p-6 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-black/40 shadow-lg">
                  <div className={cn("w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] animate-pulse bg-current", isRoundtableMode ? 'text-fuchsia-500' : 'text-forge-cyan')} />
                  <span className="font-display font-bold text-sm text-gray-200 tracking-wider uppercase">
                    {isRoundtableMode ? 'Roundtable Protocol' : 'Nova Core'}
                  </span>
                </div>

                <button 
                  onClick={() => setIsRoundtableMode(!isRoundtableMode)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-all group"
                >
                  {isRoundtableMode ? <ToggleRight className="text-fuchsia-500" /> : <ToggleLeft className="text-gray-500" />}
                  <span className={cn("text-xs font-mono", isRoundtableMode ? 'text-white' : 'text-gray-500')}>
                    Multi-Agent Cluster
                  </span>
                </button>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-gray-600">
                    <Activity size={12} />
                    <span>Lat: 12ms</span>
                </div>
                <button 
                  onClick={() => setIsDockOpen(!isDockOpen)}
                  className={cn("p-2 rounded-lg transition-all duration-300 border", isDockOpen ? 'text-forge-cyan bg-forge-cyan/10 border-forge-cyan/20' : 'text-gray-500 hover:text-white border-transparent hover:bg-white/5')}
                >
                  {isDockOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
                </button>
             </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide relative">
             <div className="max-w-4xl mx-auto space-y-8 pb-4">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const agent = isUser ? null : getAgent(msg.agentId);
                  const Icon = agent?.icon || User;

                  return (
                    <div key={msg.id} className={cn("flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 group", isUser ? 'flex-row-reverse' : '')}>
                        
                        {/* Avatar */}
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative border backdrop-blur-md",
                          isUser ? 'bg-white/5 border-white/10' : `bg-black/40 ${agent?.border}`
                        )}>
                          <Icon size={18} className={isUser ? "text-gray-400" : agent?.color} />
                          {/* Connection Line */}
                          <div className={cn(
                              "absolute top-10 h-full w-px bg-gradient-to-b from-white/10 to-transparent",
                              isUser ? 'right-5' : 'left-5'
                          )} />
                        </div>

                        {/* Message Bubble */}
                        <div className={cn(
                          "max-w-[85%] md:max-w-[75%] p-6 rounded-2xl text-sm leading-7 shadow-lg backdrop-blur-md border transition-all duration-300",
                          isUser 
                            ? 'bg-white/[0.03] text-gray-100 rounded-tr-sm border-white/10 hover:bg-white/[0.05]' 
                            : `bg-black/60 text-gray-200 border-white/5 rounded-tl-sm hover:border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.2)]`
                        )}>
                          {!isUser && (
                            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                                <span className={cn("text-xs font-bold uppercase tracking-widest", agent?.color)}>
                                    {agent?.name}
                                </span>
                                <span className="text-[10px] font-mono text-gray-600">{agent?.role}</span>
                            </div>
                          )}
                          <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                          {isStreaming && activeAgentIds.includes(agent?.id || '') && msg.text.length > 0 && (
                            <span className="inline-block w-1.5 h-3 ml-1 bg-current animate-pulse align-middle" />
                          )}
                        </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
             </div>
          </div>

          {/* Input Area */}
          <div className="shrink-0 p-6 z-30 flex justify-center">
             <div className="w-full max-w-3xl relative group">
                {/* Glow effect behind input */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-forge-accent/50 to-cyan-500/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                
                <GlassCard className="relative bg-black/80 backdrop-blur-2xl border-white/10 shadow-2xl flex flex-col" noPadding>
                   <form onSubmit={handleSubmit} className="flex items-end p-2">
                      <div className="p-3 text-gray-500">
                         <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500", isStreaming ? "bg-forge-accent/20 text-forge-accent animate-pulse" : "bg-white/5 border border-white/5")}>
                           {isStreaming ? <Zap size={16} /> : <Hexagon size={16} />}
                         </div>
                      </div>
                      
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder={isRoundtableMode ? "Broadcast query to agent cluster..." : "Input neural query..."}
                        className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 py-4 text-sm font-medium resize-none max-h-32"
                        rows={1}
                        disabled={isStreaming}
                      />
                      
                      <button 
                        type="submit"
                        disabled={!input.trim() || isStreaming}
                        className={cn(
                          "m-2 p-3 rounded-xl transition-all duration-300",
                          input.trim() && !isStreaming 
                            ? 'bg-white text-black hover:bg-gray-200 hover:scale-105' 
                            : 'bg-white/5 text-gray-600 cursor-not-allowed'
                        )}
                      >
                         {isStreaming ? <Aperture size={18} className="animate-spin" /> : <Send size={18} />}
                      </button>
                   </form>
                   
                   {/* Tech Footer in Input */}
                   <div className="px-4 pb-2 flex justify-between items-center text-[9px] font-mono text-gray-600 uppercase tracking-widest border-t border-white/5 pt-2 mx-2">
                      <span>SECURE_CHANNEL_v4</span>
                      <span className="flex items-center gap-1">
                          {isRoundtableMode ? 'CLUSTER_ACTIVE' : 'NOVA_CORE_ACTIVE'}
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      </span>
                   </div>
                </GlassCard>
             </div>
          </div>
       </div>

       <AgentDock isOpen={isDockOpen} activeAgentIds={activeAgentIds} />
    </div>
  );
};
