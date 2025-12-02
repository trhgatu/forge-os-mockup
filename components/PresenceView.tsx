
import React, { useState, useEffect, useMemo } from 'react';
import { Radar, Disc, Radio, Eye, Ghost, Zap, Sparkles, Activity } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '../lib/utils';
import { VisitorEcho, EchoTypeVisitor, ConnectionRole } from '../types';
import { analyzePresence } from '../services/geminiService';
import { useNotification } from '../contexts/NotificationContext';

// --- VISUAL CONSTANTS ---

const ECHO_COLORS: Record<EchoTypeVisitor, string> = {
    anonymous: 'bg-blue-400/50 shadow-[0_0_10px_#60A5FA]',
    known: 'bg-amber-400/50 shadow-[0_0_10px_#FBBF24]',
    connection: 'bg-fuchsia-500/50 shadow-[0_0_15px_#D946EF]' // Base color, overridden by role
};

const ROLE_COLORS: Record<ConnectionRole, string> = {
    'Catalyst': 'bg-orange-500 shadow-[0_0_15px_#F97316]',
    'Ghost': 'bg-slate-400 shadow-[0_0_15px_#94A3B8]',
    'Mirror': 'bg-cyan-400 shadow-[0_0_15px_#22D3EE]',
    'Anchor': 'bg-indigo-500 shadow-[0_0_15px_#6366F1]',
    'Teacher': 'bg-yellow-400 shadow-[0_0_15px_#FACC15]',
    'Past Love': 'bg-rose-400 shadow-[0_0_15px_#FB7185]',
    'Shadow': 'bg-violet-600 shadow-[0_0_15px_#7C3AED]',
    'Companion': 'bg-emerald-400 shadow-[0_0_15px_#34D399]',
    'Healer': 'bg-teal-300 shadow-[0_0_15px_#5EEAD4]',
    'Mystery': 'bg-fuchsia-400 shadow-[0_0_15px_#E879F9]'
};

// --- SIMULATION LOGIC ---

const generateMockEcho = (): VisitorEcho => {
    const r = Math.random();
    let type: EchoTypeVisitor = 'anonymous';
    let role: ConnectionRole | undefined = undefined;
    let connectionName = undefined;

    if (r > 0.9) {
        type = 'connection';
        const roles: ConnectionRole[] = ['Catalyst', 'Mirror', 'Ghost', 'Healer'];
        role = roles[Math.floor(Math.random() * roles.length)];
        connectionName = 'Linked Soul';
    } else if (r > 0.7) {
        type = 'known';
        connectionName = 'Returning Visitor';
    }

    return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        type,
        connectionName,
        connectionRole: role,
        distance: Math.floor(Math.random() * 80) + 10, // 10% to 90% radius
        angle: Math.random() * 360,
        seasonContext: 'Winter',
        duration: Math.floor(Math.random() * 120),
        pageVisited: '/memory/123'
    };
};

// --- SUB-COMPONENTS ---

const RadarBlip: React.FC<{ echo: VisitorEcho }> = ({ echo }) => {
    const [opacity, setOpacity] = useState(1);
    
    useEffect(() => {
        // Fade out over time to simulate "echo" decaying
        const timer = setTimeout(() => setOpacity(0), 5000); // Disappear after 5s
        return () => clearTimeout(timer);
    }, []);

    if (opacity === 0) return null;

    let colorClass = ECHO_COLORS[echo.type];
    if (echo.type === 'connection' && echo.connectionRole) {
        colorClass = ROLE_COLORS[echo.connectionRole].replace('/50', ''); // Use solid for core
    }

    // Convert Polar to Cartesian for CSS positioning (center is 50%, 50%)
    // distance is % from center.
    const angleRad = (echo.angle - 90) * (Math.PI / 180); // -90 to start top
    const x = 50 + (echo.distance / 2) * Math.cos(angleRad); // divide by 2 because distance is 0-100 but radius is 50%
    const y = 50 + (echo.distance / 2) * Math.sin(angleRad);

    return (
        <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 group cursor-pointer z-20"
            style={{ 
                left: `${x}%`, 
                top: `${y}%`,
                opacity: opacity
            }}
        >
            <div className={cn("w-3 h-3 rounded-full animate-ping absolute opacity-50", colorClass.split(' ')[0])} />
            <div className={cn("w-2 h-2 rounded-full relative z-10", colorClass)} />
            
            {/* Tooltip on Hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 border border-white/10 rounded text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-md">
                {echo.type === 'connection' ? echo.connectionRole : echo.type}
            </div>
        </div>
    );
};

const CosmicRadar: React.FC<{ echoes: VisitorEcho[] }> = ({ echoes }) => {
    return (
        <div className="relative w-[600px] h-[600px] rounded-full border border-white/5 bg-black/20 backdrop-blur-sm overflow-hidden flex items-center justify-center group shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            {/* Grid Rings */}
            <div className="absolute w-[25%] h-[25%] rounded-full border border-white/5" />
            <div className="absolute w-[50%] h-[50%] rounded-full border border-white/5" />
            <div className="absolute w-[75%] h-[75%] rounded-full border border-white/5" />
            <div className="absolute w-full h-full rounded-full border border-white/10 opacity-50" />
            
            {/* Crosshairs */}
            <div className="absolute w-full h-px bg-white/5" />
            <div className="absolute h-full w-px bg-white/5" />

            {/* Scanning Line (The Sweep) */}
            <div className="absolute w-full h-full animate-[spin_4s_linear_infinite] pointer-events-none origin-center">
                <div className="w-1/2 h-1/2 bg-gradient-to-r from-transparent via-forge-cyan/10 to-forge-cyan/40 absolute top-0 left-1/2 origin-bottom-left transform -rotate-45" 
                     style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} // Triangle slice
                />
            </div>

            {/* Center (The Self) */}
            <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white] z-30 animate-pulse-slow">
                <div className="absolute inset-0 bg-forge-cyan blur-md opacity-50" />
            </div>

            {/* Render Echoes */}
            {echoes.map(echo => (
                <RadarBlip key={echo.id} echo={echo} />
            ))}
        </div>
    );
};

// --- MAIN VIEW ---

export const PresenceView: React.FC = () => {
    const [echoes, setEchoes] = useState<VisitorEcho[]>([]);
    const { notify } = useNotification();

    // Memoize the background stars to prevent re-rendering (jumping) on state updates
    const stars = useMemo(() => {
        return Array.from({ length: 50 }).map((_, i) => ({
            width: Math.random() * 2 + 'px',
            height: Math.random() * 2 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() * 0.5 + 0.1,
            animationDuration: `${Math.random() * 5 + 2}s`
        }));
    }, []);

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            // Random chance to detect visitor
            if (Math.random() > 0.6) {
                const newEcho = generateMockEcho();
                setEchoes(prev => [...prev, newEcho]);
                
                // Trigger Whisper OS
                if (newEcho.type === 'connection') {
                    notify('event', 'connection', `Connection Node '${newEcho.connectionRole}' detected nearby.`);
                } else if (newEcho.type === 'known') {
                    notify('signal', 'presence', "A familiar frequency has returned.");
                } else {
                    notify('whisper', 'presence', "A faint echo brushed against the perimeter.");
                }
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [notify]);

    // Clean up old echoes
    useEffect(() => {
        const cleanup = setInterval(() => {
            const now = Date.now();
            setEchoes(prev => prev.filter(e => now - e.timestamp.getTime() < 6000)); // Remove after 6s (faded out)
        }, 1000);
        return () => clearInterval(cleanup);
    }, []);

    return (
        <div className="h-full flex flex-col bg-[#010103] text-white relative overflow-hidden animate-in fade-in duration-1000 selection:bg-cyan-500/30">
            
            {/* Deep Space Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#010103] to-black" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                
                {/* Stabilized Stars */}
                {stars.map((style, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-white animate-pulse"
                        style={style}
                    />
                ))}
            </div>

            {/* Header Overlay */}
            <div className="absolute top-0 left-0 p-8 z-30 pointer-events-none">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-500 uppercase tracking-widest mb-2">
                    <Radar size={14} className="animate-spin-slow" /> Presence Sensor Active
                </div>
                <h1 className="text-4xl font-display font-bold text-white tracking-tight">Visitor Echo</h1>
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                    Sensing the subtle ripples of those who brush against your digital existence.
                </p>
            </div>

            {/* Main Radar Area */}
            <div className="flex-1 flex items-center justify-center relative z-10">
                <CosmicRadar echoes={echoes} />
            </div>

            {/* Legend / Status Footer */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 text-[10px] font-mono text-gray-500 uppercase tracking-widest z-30 pointer-events-none">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400/50 shadow-[0_0_5px_#60A5FA]" /> Anonymous
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400/50 shadow-[0_0_5px_#FBBF24]" /> Known
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-fuchsia-500/50 shadow-[0_0_5px_#D946EF]" /> Connection
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                    <Eye size={12} className="text-cyan-500" />
                    {echoes.length} Echoes Detected
                </div>
            </div>

        </div>
    );
};
