
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Disc, 
    Activity, 
    Wind, 
    Sun, 
    Leaf, 
    Snowflake, 
    Sprout, 
    X, 
    Sparkles, 
    Heart,
    Music,
    Play,
    Pause
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Track, MusicSeason } from '../types';
import { getRecentTracks } from '../services/spotifyService';
import { useSoundtrack } from '../contexts/SoundtrackContext';
import { cn } from '../lib/utils';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    Tooltip, 
    CartesianGrid 
} from 'recharts';

// --- CONSTANTS ---

const SEASON_COLORS: Record<MusicSeason, string> = {
    Spring: 'text-emerald-400 border-emerald-500/30 bg-emerald-900/10 from-emerald-500/20',
    Summer: 'text-amber-400 border-amber-500/30 bg-amber-900/10 from-amber-500/20',
    Autumn: 'text-orange-400 border-orange-500/30 bg-orange-900/10 from-orange-500/20',
    Winter: 'text-indigo-400 border-indigo-500/30 bg-indigo-900/10 from-indigo-500/20',
};

const SEASON_ICONS: Record<MusicSeason, React.ElementType> = {
    Spring: Sprout,
    Summer: Sun,
    Autumn: Leaf,
    Winter: Snowflake,
};

// --- SUB-COMPONENTS ---

const TrackDetailPanel: React.FC<{ track: Track | null; onClose: () => void }> = ({ track, onClose }) => {
    const { novaWhisper } = useSoundtrack();
    
    if (!track) return null;
    
    const seasonColor = SEASON_COLORS[track.season];
    const SeasonIcon = SEASON_ICONS[track.season];

    return (
        <div className="absolute inset-y-0 right-0 w-full md:w-[450px] bg-black/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
            {/* Header Image with Blur */}
            <div className="relative h-64 w-full overflow-hidden shrink-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
                    style={{ backgroundImage: `url(${track.coverUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
                
                <div className="absolute bottom-6 left-6 right-6 z-10">
                    <h2 className="text-3xl font-display font-bold text-white leading-tight mb-1">{track.title}</h2>
                    <p className="text-lg text-gray-300 font-light">{track.artist}</p>
                </div>

                <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-black/40 hover:bg-white/10 text-white transition-all border border-white/10">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                
                {/* Season Tag */}
                <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest", seasonColor)}>
                    <SeasonIcon size={14} /> Season of {track.season}
                </div>

                {/* Nova Whisper */}
                {novaWhisper && (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden group">
                        <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-r transition-opacity group-hover:opacity-20", seasonColor.split(' ')[3])} />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">
                                <Sparkles size={12} className="text-forge-cyan" /> Nova Reflection
                            </div>
                            <p className="text-lg text-gray-200 font-light italic leading-relaxed">
                                "{novaWhisper}"
                            </p>
                        </div>
                    </div>
                )}

                {/* Audio Features Analysis */}
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Sonic Architecture</h3>
                    <div className="space-y-4">
                        <FeatureBar label="Energy" value={track.features.energy} color="bg-yellow-400" />
                        <FeatureBar label="Valence (Mood)" value={track.features.valence} color="bg-cyan-400" />
                        <FeatureBar label="Acousticness" value={track.features.acousticness} color="bg-emerald-400" />
                        <FeatureBar label="Instrumental" value={track.features.instrumentalness} color="bg-violet-400" />
                    </div>
                </div>

                {/* Memory Link Mock */}
                <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="p-2 rounded-lg bg-white/5"><Heart size={14} /></div>
                        <span>You often listen to this when focusing.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="flex items-center gap-4 text-sm">
        <span className="w-24 text-gray-400 shrink-0">{label}</span>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
                className={cn("h-full rounded-full shadow-[0_0_10px_currentColor]", color)} 
                style={{ width: `${value * 100}%` }} 
            />
        </div>
        <span className="w-8 text-right font-mono text-gray-500">{Math.round(value * 100)}%</span>
    </div>
);

const TrackShard: React.FC<{ track: Track; onClick: () => void; isPlaying: boolean }> = ({ track, onClick, isPlaying }) => {
    const seasonColor = SEASON_COLORS[track.season].split(' ')[0];
    
    return (
        <div 
            onClick={onClick}
            className="group relative min-w-[160px] h-[240px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-white/5 bg-white/[0.02]"
        >
            {/* Background Blur Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-40 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                style={{ backgroundImage: `url(${track.coverUrl})` }}
            />
            
            {/* Gradient Overlay */}
            <div className={cn("absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80")} />

            {/* Seasonal Particle */}
            <div className={cn("absolute top-3 right-3 w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]", seasonColor)} />

            {/* Play Overlay */}
            <div className={cn("absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300")}>
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    {isPlaying ? <Pause fill="white" className="text-white" /> : <Play fill="white" className="text-white ml-1" />}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-4">
                <div className="text-xs font-mono text-gray-500 mb-1">{track.season}</div>
                <h4 className="text-white font-bold leading-tight mb-1 line-clamp-2 group-hover:text-forge-cyan transition-colors">{track.title}</h4>
                <p className="text-xs text-gray-400 truncate">{track.artist}</p>
            </div>
        </div>
    );
};

const EmotionalGraph: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
    const data = useMemo(() => {
        return tracks.slice().reverse().map((t, i) => ({
            name: i,
            energy: t.features.energy * 100,
            valence: t.features.valence * 100,
            label: t.playedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }));
    }, [tracks]);

    return (
        <GlassCard className="h-64 w-full relative overflow-hidden" noPadding>
            <div className="absolute top-4 left-6 z-10">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="text-forge-cyan" /> Emotional Resonance Flow
                </h3>
            </div>
            <div className="w-full h-full pt-12 pr-0 pb-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#FBBF24" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="valenceGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} strokeDasharray="3 3" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="energy" stroke="#FBBF24" fill="url(#energyGradient)" strokeWidth={2} />
                        <Area type="monotone" dataKey="valence" stroke="#22D3EE" fill="url(#valenceGradient)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};

// --- MAIN VIEW ---

export const SoundtrackView: React.FC = () => {
    const { playTrack, currentTrack, isPlaying } = useSoundtrack();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [selectedTrackDetail, setSelectedTrackDetail] = useState<Track | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            const data = await getRecentTracks(20);
            setTracks(data);
            setIsLoading(false);
        };
        load();
    }, []);

    const dominantSeason = useMemo(() => {
        if (tracks.length === 0) return 'Winter';
        const counts = tracks.reduce((acc, t) => {
            acc[t.season] = (acc[t.season] || 0) + 1;
            return acc;
        }, {} as Record<MusicSeason, number>);
        return Object.keys(counts).reduce((a, b) => counts[a as MusicSeason] > counts[b as MusicSeason] ? a : b) as MusicSeason;
    }, [tracks]);

    const seasonConfig = {
        color: SEASON_COLORS[dominantSeason],
        Icon: SEASON_ICONS[dominantSeason]
    };

    const handleTrackClick = (track: Track) => {
        playTrack(track);
        setSelectedTrackDetail(track);
    };

    return (
        <div className="h-full flex bg-[#050505] text-white relative overflow-hidden animate-in fade-in duration-1000">
            
            {/* Cinematic Background based on Dominant Season */}
            <div className="absolute inset-0 pointer-events-none transition-colors duration-1000">
                <div className={cn("absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] rounded-full blur-[200px] opacity-30", seasonConfig.color.split(' ')[2].replace('bg-', 'bg-'))} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-slate-900/20 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10 flex flex-col">
                <div className="p-6 md:p-8 pb-0">
                    {/* Header */}
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 mb-4">
                                <Disc size={12} className="animate-spin-slow" /> Sonic Mirror v1.0
                            </div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">
                                Soundtrack
                            </h1>
                            <p className="text-gray-400 max-w-lg">
                                The emotional biography of your life, encoded in sound.
                            </p>
                        </div>
                        <div className="text-right hidden md:block">
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Dominant Season</div>
                            <div className={cn("text-2xl font-bold flex items-center justify-end gap-2", seasonConfig.color.split(' ')[0])}>
                                <seasonConfig.Icon size={24} /> {dominantSeason}
                            </div>
                        </div>
                    </div>

                    {/* Emotional Graph */}
                    <div className="mb-12">
                        <EmotionalGraph tracks={tracks} />
                    </div>

                    {/* Timeline Stream */}
                    <div className="mb-24">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <Music size={16} /> Recent Echoes
                            </h3>
                        </div>
                        
                        <div className="relative">
                            {/* Horizontal Scroll Area */}
                            <div className="flex gap-4 overflow-x-auto pb-8 pt-2 px-1 scrollbar-hide snap-x">
                                {isLoading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="min-w-[160px] h-[240px] rounded-2xl bg-white/5 animate-pulse" />
                                    ))
                                ) : (
                                    tracks.map(track => (
                                        <TrackShard 
                                            key={track.id} 
                                            track={track} 
                                            isPlaying={currentTrack?.id === track.id && isPlaying}
                                            onClick={() => handleTrackClick(track)} 
                                        />
                                    ))
                                )}
                            </div>
                            {/* Fade indicators */}
                            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
                        </div>
                    </div>

                    {/* Identity Signature */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                        <GlassCard className="bg-gradient-to-br from-white/5 to-transparent border-white/10" noPadding>
                            <div className="p-6">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Top Genre</div>
                                <div className="text-3xl font-display text-white mb-1">Ambient</div>
                                <div className="text-xs text-gray-400">34% of listening time</div>
                            </div>
                        </GlassCard>
                        <GlassCard className="bg-gradient-to-br from-white/5 to-transparent border-white/10" noPadding>
                            <div className="p-6">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Avg. Energy</div>
                                <div className="text-3xl font-display text-yellow-400 mb-1">Medium-Low</div>
                                <div className="text-xs text-gray-400">Introspective Tendency</div>
                            </div>
                        </GlassCard>
                        <GlassCard className="bg-gradient-to-br from-white/5 to-transparent border-white/10" noPadding>
                            <div className="p-6">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Discovery Rate</div>
                                <div className="text-3xl font-display text-emerald-400 mb-1">High</div>
                                <div className="text-xs text-gray-400">Openness to experience</div>
                            </div>
                        </GlassCard>
                    </div>

                </div>
            </div>

            {/* Details Panel Overlay */}
            {selectedTrackDetail && <TrackDetailPanel track={selectedTrackDetail} onClose={() => setSelectedTrackDetail(null)} />}
        </div>
    );
};
