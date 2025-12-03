
import React, { useState } from 'react';
import { EpicScene, View } from '../../types';
import { 
  X, Share2, Sparkles, Quote, Film, Tag, ArrowRight, BrainCircuit, BookOpen, Trash2, AlertCircle, Loader2, Music, User, Layers, Play, Calendar, Zap, Heart, Hash, Link as LinkIcon, Edit, MonitorPlay, Clock, Lightbulb
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEpicScene } from '../../contexts/EpicSceneContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { draftService } from '../../services/draftService';
import { GlassCard } from '../GlassCard';

interface EpicSceneDetailProps {
  scene: EpicScene;
  onClose: () => void;
}

// Helper to normalize YouTube URLs
const getEmbedUrl = (url: string) => {
  if (!url) return '';
  try {
    let embedUrl = url;
    const urlObj = new URL(url);
    if (url.includes('youtube.com/embed')) {
      if (!url.includes('autoplay=1')) embedUrl += (url.includes('?') ? '&' : '?') + 'autoplay=1';
      return embedUrl;
    }
    if (url.includes('youtube.com/watch')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    if (url.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1);
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    return url; 
  } catch (e) { return url; }
};

const TagCluster: React.FC<{ label: string; tags: string[]; icon: React.ElementType; color: string }> = ({ label, tags, icon: Icon, color }) => {
    if (!tags || tags.length === 0) return null;
    return (
        <div className="mb-6">
            <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3", color)}>
                <Icon size={12} /> {label}
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map(t => (
                    <span key={t} className={cn("px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300 font-medium hover:bg-white/10 transition-colors")}>
                        #{t}
                    </span>
                ))}
            </div>
        </div>
    );
}

const VideoSection: React.FC<{ url: string; title: string }> = ({ url, title }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const embed = getEmbedUrl(url);

    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black shadow-2xl mb-12 group">
            {loading && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#050508] z-10">
                    <Loader2 className="w-8 h-8 text-fuchsia-500 animate-spin" />
                </div>
            )}
            <iframe 
                src={embed} 
                title={title}
                className={cn("w-full h-full transition-opacity duration-500", loading ? 'opacity-0' : 'opacity-100')}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                onLoad={() => setLoading(false)}
                onError={() => setError(true)}
            />
        </div>
    );
};

export const EpicSceneDetail: React.FC<EpicSceneDetailProps> = ({ scene, onClose }) => {
  const { deleteScene, toggleFavorite } = useEpicScene();
  const { navigateTo } = useNavigation();

  const handleLinkToJournal = () => {
    draftService.setDraft({
      content: `Reflecting on the scene "${scene.title}" from ${scene.series}.\n\nQuote: "${scene.quote}"\n\n[Nova Reflection]: ${scene.novaReflection}\n\n[Insight]: ${scene.insight}`,
      source: 'Epic Scene Vault',
      tags: ['Scene', ...scene.emotionTags]
    });
    navigateTo(View.JOURNAL);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#050508] animate-in fade-in duration-500 overflow-hidden">
        
        {/* Navigation Bar */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-[#050508]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-[60]">
            <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <ArrowRight className="rotate-180" size={20} />
                </button>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                    <Film size={14} /> {scene.series}
                </div>
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={() => toggleFavorite(scene.id)} 
                    className={cn("p-2 rounded-lg transition-colors border", scene.isFavorite ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-white/5 border-white/10 text-gray-400 hover:text-white")}
                >
                    <Heart size={18} fill={scene.isFavorite ? "currentColor" : "none"} />
                </button>
                <button onClick={handleLinkToJournal} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors" title="Journal Reflection">
                    <BookOpen size={18} />
                </button>
                <button onClick={() => deleteScene(scene.id)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pt-16">
            
            {/* HERO SECTION */}
            <div className="relative w-full h-[60vh] shrink-0 overflow-hidden">
                <div className="absolute inset-0">
                    <img src={scene.imageUrl} alt={scene.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/30 via-transparent to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 z-10">
                    <div className="flex flex-wrap gap-4 mb-6">
                        {scene.episode && (
                            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white backdrop-blur-md">
                                {scene.episode}
                            </span>
                        )}
                        {scene.timestamp && (
                            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white backdrop-blur-md flex items-center gap-2">
                                <Clock size={12} /> {scene.timestamp}
                            </span>
                        )}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight mb-4 drop-shadow-2xl max-w-4xl">
                        {scene.title}
                    </h1>
                    <div className="text-sm text-gray-400 font-mono uppercase tracking-widest">
                        Crystallized on {new Date(scene.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-5xl mx-auto px-6 md:px-12 pb-32 -mt-8 relative z-20">
                
                {/* 1. Video Footage (If available) */}
                {scene.videoUrl && (
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <MonitorPlay size={16} className="text-fuchsia-500" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Scene Footage</h3>
                        </div>
                        <VideoSection url={scene.videoUrl} title={scene.title} />
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* LEFT COLUMN (Narrative & Context) */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        {/* Quote */}
                        {scene.quote && (
                            <section className="relative">
                                <Quote className="absolute -left-8 -top-6 text-white/5 w-24 h-24 transform -scale-x-100" />
                                <blockquote className="relative z-10">
                                    <p className="text-2xl md:text-3xl font-serif text-white italic leading-relaxed">
                                        "{scene.quote}"
                                    </p>
                                    {scene.quoteBy && (
                                        <footer className="mt-4 flex items-center gap-3">
                                            <div className="h-px w-12 bg-fuchsia-500" />
                                            <cite className="text-sm text-fuchsia-400 font-mono uppercase tracking-widest not-italic">
                                                {scene.quoteBy}
                                            </cite>
                                        </footer>
                                    )}
                                </blockquote>
                            </section>
                        )}

                        {/* Context */}
                        <section>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                                <Layers size={14} /> Context
                            </h3>
                            <p className="text-lg text-gray-300 font-light leading-relaxed whitespace-pre-wrap">
                                {scene.context}
                            </p>
                        </section>

                        {/* Meaning Analysis */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {scene.reflection && (
                                <GlassCard className="p-6 bg-white/[0.02] border-white/5" noPadding>
                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
                                        <User size={12} /> Reflection
                                    </div>
                                    <p className="text-sm text-gray-300 italic leading-relaxed">
                                        "{scene.reflection}"
                                    </p>
                                </GlassCard>
                            )}
                            {scene.insight && (
                                <GlassCard className="p-6 bg-white/[0.02] border-white/5" noPadding>
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                                        <Lightbulb size={12} /> Insight
                                    </div>
                                    <p className="text-sm text-gray-300 font-medium leading-relaxed">
                                        {scene.insight}
                                    </p>
                                </GlassCard>
                            )}
                        </section>

                    </div>

                    {/* RIGHT COLUMN (Meta & Links) */}
                    <div className="space-y-10">
                        
                        {/* Tags Cluster */}
                        <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                            <TagCluster label="Emotions" tags={scene.emotionTags} icon={Heart} color="text-fuchsia-400" />
                            <TagCluster label="Archetypes" tags={scene.archetypeTags} icon={User} color="text-cyan-400" />
                            <TagCluster label="Themes" tags={scene.themeTags} icon={Layers} color="text-amber-400" />
                            <TagCluster label="Vibe" tags={scene.vibeTags} icon={Zap} color="text-emerald-400" />
                        </section>

                        {/* Soundtrack */}
                        {scene.soundtrack && (
                            <section>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Music size={14} /> Soundtrack
                                </h3>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center border border-white/10 group-hover:border-fuchsia-500/50 transition-colors">
                                        <Play size={16} className="text-white ml-1" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-white truncate">{scene.soundtrack.title}</div>
                                        <div className="text-xs text-gray-500">Intensity: {scene.soundtrack.intensityLevel}/10</div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* OS Links */}
                        {scene.osLinks && scene.osLinks.length > 0 && (
                            <section>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <LinkIcon size={14} /> Neural Links
                                </h3>
                                <div className="space-y-2">
                                    {scene.osLinks.map((link, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group border border-transparent hover:border-white/5">
                                            <div className={cn("w-2 h-2 rounded-full", link.type === 'thought' ? 'bg-blue-400' : link.type === 'insight' ? 'bg-fuchsia-400' : 'bg-gray-400')} />
                                            <div className="flex-1 text-xs text-gray-400 group-hover:text-white transition-colors truncate">
                                                <span className="uppercase font-mono text-[9px] mr-2 opacity-50">{link.type}</span>
                                                {link.title}
                                            </div>
                                            <ArrowRight size={12} className="text-gray-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Nova System Note */}
                        {scene.novaReflection && (
                            <section className="p-6 rounded-2xl bg-gradient-to-br from-fuchsia-900/10 to-transparent border border-fuchsia-500/20">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest mb-3">
                                    <Sparkles size={12} /> System Note
                                </div>
                                <p className="text-xs text-gray-300 font-mono leading-relaxed opacity-80">
                                    {scene.novaReflection}
                                </p>
                            </section>
                        )}

                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
