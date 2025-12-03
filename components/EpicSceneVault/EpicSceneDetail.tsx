
import React, { useState, useEffect } from 'react';
import { EpicScene, View } from '../../types';
import { 
  X, Share2, Sparkles, Quote, Film, Tag, ArrowRight, BrainCircuit, BookOpen, Trash2, AlertCircle, Loader2, Music, User, Layers, Play, Calendar, Zap, Heart, Hash, Link as LinkIcon
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

const AudioVisualizer: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="flex items-end gap-0.5 h-3">
    {[...Array(6)].map((_, i) => (
      <div 
        key={i} 
        className={cn("w-0.5 bg-fuchsia-500 rounded-full transition-all duration-300", active ? "animate-music-bar" : "h-1 opacity-20")}
        style={{ 
          height: active ? `${Math.random() * 100}%` : '4px',
          animationDelay: `${i * 0.1}s` 
        }} 
      />
    ))}
  </div>
);

const TagCluster: React.FC<{ label: string; tags: string[]; icon: React.ElementType; color: string }> = ({ label, tags, icon: Icon, color }) => (
    <div className="mb-4">
        <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-2", color)}>
            <Icon size={10} /> {label}
        </div>
        <div className="flex flex-wrap gap-2">
            {tags.map(t => (
                <span key={t} className={cn("px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-gray-300 font-mono hover:bg-white/10 transition-colors")}>
                    #{t}
                </span>
            ))}
        </div>
    </div>
);

export const EpicSceneDetail: React.FC<EpicSceneDetailProps> = ({ scene, onClose }) => {
  const { deleteScene, toggleFavorite } = useEpicScene();
  const { navigateTo } = useNavigation();
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  
  useEffect(() => { setVideoLoading(true); setVideoError(false); }, [scene.id]);

  const handleLinkToJournal = () => {
    draftService.setDraft({
      content: `Reflecting on the scene "${scene.title}" from ${scene.series}.\n\nQuote: "${scene.quote}"\n\n[Nova Reflection]: ${scene.novaReflection}\n\n[Insight]: ${scene.insight}`,
      source: 'Epic Scene Vault',
      tags: ['Scene', ...scene.emotionTags]
    });
    navigateTo(View.JOURNAL);
    onClose();
  };

  const isVideo = !!scene.videoUrl;
  const isYoutube = isVideo && (scene.videoUrl?.includes('youtube') || scene.videoUrl?.includes('youtu.be'));
  const embedUrl = isYoutube && scene.videoUrl ? getEmbedUrl(scene.videoUrl) : scene.videoUrl;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-500">
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Main Card */}
      <div className="relative w-full max-w-[90rem] h-full md:h-[90vh] bg-[#050508] border border-white/10 rounded-none md:rounded-3xl shadow-[0_0_100px_rgba(124,58,237,0.15)] flex flex-col md:flex-row overflow-hidden group">
        
        {/* Close Button (Mobile) */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-[110] p-2 rounded-full bg-black/50 text-white md:hidden"
        >
            <X size={20} />
        </button>

        {/* LEFT COLUMN: Visual & Narrative (65%) */}
        <div className="relative w-full md:w-[65%] h-[40vh] md:h-full bg-black flex flex-col">
            
            {/* Media Player Area */}
            <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
                {isVideo ? (
                    <>
                        {videoLoading && !videoError && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#050508]">
                                <Loader2 className="w-8 h-8 text-fuchsia-500 animate-spin" />
                            </div>
                        )}
                        {isYoutube ? (
                            <iframe 
                            src={embedUrl} 
                            title={scene.title}
                            className={cn("w-full h-full object-cover transition-opacity duration-500", videoLoading ? 'opacity-0' : 'opacity-100')}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                            onLoad={() => setVideoLoading(false)}
                            onError={() => setVideoError(true)}
                            />
                        ) : (
                            <video 
                            src={embedUrl} 
                            className="w-full h-full object-contain" 
                            controls 
                            autoPlay 
                            loop
                            onLoadedData={() => setVideoLoading(false)}
                            onError={() => setVideoError(true)}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <img 
                            src={scene.imageUrl} 
                            alt={scene.title} 
                            className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#050508]" />
                    </>
                )}
            </div>

            {/* Narrative Content (Overlaid or Below) */}
            <div className="bg-[#050508] p-8 md:p-12 relative z-20">
                {/* Title Block */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
                        <Film size={14} /> {scene.series}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-4 drop-shadow-xl">
                        {scene.title}
                    </h1>
                    {/* Main Quote - Prominent */}
                    {scene.quote && (
                        <blockquote className="border-l-4 border-fuchsia-500 pl-6 py-2">
                            <p className="text-xl md:text-2xl text-white font-serif italic leading-relaxed">
                                "{scene.quote}"
                            </p>
                            {scene.quoteBy && (
                                <cite className="block mt-2 text-sm text-gray-400 font-mono not-italic uppercase tracking-wider">
                                    — {scene.quoteBy}
                                </cite>
                            )}
                        </blockquote>
                    )}
                </div>

                {/* Context Text */}
                {scene.context && (
                    <div className="prose prose-invert prose-sm md:prose-base max-w-3xl">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Layers size={12} /> Story Context
                        </h4>
                        <p className="text-gray-300 font-light leading-relaxed">
                            {scene.context}
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (35%) */}
        <div className="hidden md:flex w-[35%] bg-black/40 border-l border-white/5 flex-col h-full relative backdrop-blur-xl">
            
            {/* Sidebar Header / Actions */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(scene.id); }} 
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
                <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                
                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono text-gray-500">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="uppercase tracking-wider mb-1 opacity-50">Episode</div>
                        <div className="text-white truncate">{scene.episode || 'N/A'}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="uppercase tracking-wider mb-1 opacity-50">Timestamp</div>
                        <div className="text-white">{scene.timestamp || '00:00'}</div>
                    </div>
                </div>

                {/* Nova Reflection */}
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-fuchsia-900/20 to-transparent border border-fuchsia-500/20 overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Sparkles size={48} className="text-fuchsia-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest mb-3">
                            <Sparkles size={12} /> Infinity's Response
                        </div>
                        <p className="text-sm text-gray-200 font-light italic leading-relaxed">
                            "{scene.novaReflection}"
                        </p>
                    </div>
                </div>

                {/* Core Insight */}
                {scene.insight && (
                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 group-hover:text-cyan-300">
                            <BrainCircuit size={12} /> Meaning
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed font-medium">
                            {scene.insight}
                        </p>
                    </div>
                )}

                {/* Soundtrack */}
                {scene.soundtrack && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-white/10">
                            <Music size={16} className="text-fuchsia-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Soundtrack</div>
                            <div className="text-sm text-white truncate">{scene.soundtrack.title}</div>
                        </div>
                        <div className="flex gap-0.5 items-end h-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-1 bg-fuchsia-500 rounded-full animate-music-bar" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags Section */}
                <div className="space-y-1">
                    {scene.emotionTags.length > 0 && <TagCluster label="Emotions" tags={scene.emotionTags} icon={Heart} color="text-fuchsia-400" />}
                    {scene.archetypeTags.length > 0 && <TagCluster label="Archetypes" tags={scene.archetypeTags} icon={User} color="text-cyan-400" />}
                    {scene.themeTags.length > 0 && <TagCluster label="Themes" tags={scene.themeTags} icon={Layers} color="text-amber-400" />}
                    {scene.vibeTags.length > 0 && <TagCluster label="Vibe" tags={scene.vibeTags} icon={Zap} color="text-emerald-400" />}
                </div>

                {/* OS Links */}
                {scene.osLinks && scene.osLinks.length > 0 && (
                    <div className="pt-6 border-t border-white/5">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <LinkIcon size={12} /> Neural Links
                        </h4>
                        <div className="space-y-2">
                            {scene.osLinks.map((link, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", link.type === 'thought' ? 'bg-blue-400' : link.type === 'insight' ? 'bg-fuchsia-400' : 'bg-gray-400')} />
                                    <div className="flex-1 text-xs text-gray-400 group-hover:text-white transition-colors truncate">
                                        <span className="uppercase font-mono text-[9px] mr-2 opacity-50">{link.type}</span>
                                        {link.title}
                                    </div>
                                    <ArrowRight size={10} className="text-gray-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Creation Info */}
                <div className="pt-4 text-[10px] font-mono text-gray-600 text-center uppercase tracking-widest">
                    Crystallized on {new Date(scene.createdAt).toLocaleDateString()}
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};