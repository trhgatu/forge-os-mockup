
import React, { useState, useEffect } from 'react';
import { EpicScene, View } from '../../types';
import { X, Share2, Sparkles, Quote, Film, Tag, ArrowRight, BrainCircuit, BookOpen, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEpicScene } from '../../contexts/EpicSceneContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { draftService } from '../../services/draftService';

interface EpicSceneDetailProps {
  scene: EpicScene;
  onClose: () => void;
}

// Helper to normalize YouTube URLs to Embed format
const getEmbedUrl = (url: string) => {
  if (!url) return '';
  
  try {
    let embedUrl = url;
    const urlObj = new URL(url);

    // Case 1: Already an embed URL
    if (url.includes('youtube.com/embed')) {
      // Ensure autoplay is on
      if (!url.includes('autoplay=1')) {
        embedUrl += (url.includes('?') ? '&' : '?') + 'autoplay=1';
      }
      return embedUrl;
    }

    // Case 2: Standard Watch URL (youtube.com/watch?v=...)
    if (url.includes('youtube.com/watch')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    }

    // Case 3: Short URL (youtu.be/...)
    if (url.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    }

    return url; // Return original if no pattern matched (fallback)
  } catch (e) {
    return url; // Return original on error
  }
};

export const EpicSceneDetail: React.FC<EpicSceneDetailProps> = ({ scene, onClose }) => {
  const { deleteScene } = useEpicScene();
  const { navigateTo } = useNavigation();
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Reset states when scene changes
  useEffect(() => {
    setVideoLoading(true);
    setVideoError(false);
  }, [scene.id]);

  const handleLinkToJournal = () => {
    draftService.setDraft({
      content: `Reflecting on the scene "${scene.title}" from ${scene.series}.\n\nQuote: "${scene.quote}"\n\n[Nova Reflection]: ${scene.novaReflection}`,
      source: 'Epic Scene Vault',
      tags: ['Scene', ...scene.emotionTags]
    });
    navigateTo(View.JOURNAL);
  };

  const isVideo = !!scene.videoUrl;
  const isYoutube = isVideo && (scene.videoUrl?.includes('youtube') || scene.videoUrl?.includes('youtu.be'));
  const embedUrl = isYoutube && scene.videoUrl ? getEmbedUrl(scene.videoUrl) : scene.videoUrl;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-500 p-0 md:p-8">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-black/50 text-white hover:bg-white/10 hover:scale-110 transition-all border border-white/10"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-7xl h-full md:h-[85vh] bg-[#050508] border border-white/10 rounded-none md:rounded-3xl shadow-[0_0_100px_rgba(124,58,237,0.1)] flex flex-col md:flex-row overflow-hidden relative group">
        
        {/* Left: Cinematic Visual / Video Player */}
        <div className="relative w-full md:w-[65%] h-[40vh] md:h-full bg-black overflow-hidden flex items-center justify-center group">
          {isVideo ? (
             <>
                {/* Loading Spinner */}
                {videoLoading && !videoError && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#050508]">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-10 h-10 text-fuchsia-500 animate-spin" />
                            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Loading Stream...</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {videoError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#050508]">
                        <AlertCircle className="text-red-500 mb-4 opacity-80" size={48} />
                        <p className="text-gray-300 font-display text-lg">Signal Lost</p>
                        <p className="text-gray-500 text-xs mt-2 font-mono">Video source unavailable or restricted.</p>
                    </div>
                )}

                {/* Player Frame */}
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
                className="w-full h-full object-contain md:object-cover opacity-90 transition-opacity duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#050508]" />
            </>
          )}
          
          {/* Quote Overlay (Hide if video is playing to avoid obstruction, simplify logic) */}
          {!isVideo && scene.quote && (
            <div className="absolute bottom-8 left-8 right-8 z-20">
              <div className="inline-flex mb-4">
                <Quote size={32} className="text-fuchsia-500 opacity-80" />
              </div>
              <p className="text-2xl md:text-4xl font-display font-bold text-white leading-tight drop-shadow-2xl max-w-2xl italic">
                "{scene.quote}"
              </p>
            </div>
          )}
        </div>

        {/* Right: Metadata & Forge */}
        <div className="flex-1 flex flex-col h-full bg-[#050508] relative z-10 border-l border-white/5">
          <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
                <Film size={14} /> {scene.series} {scene.episode && `• EP.${scene.episode}`}
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{scene.title}</h1>
              <div className="text-xs text-gray-500 font-mono">
                Captured {new Date(scene.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Tags Cluster */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {scene.emotionTags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded bg-fuchsia-900/20 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-medium uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
                {scene.archetypeTags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded bg-cyan-900/20 border border-cyan-500/20 text-cyan-300 text-xs font-medium uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Nova Reflection */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles size={24} className="text-fuchsia-500/50" />
              </div>
              <div className="relative z-10">
                <div className="text-[10px] font-mono text-fuchsia-400 uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                  <Sparkles size={12} /> System Reflection
                </div>
                <p className="text-base text-gray-200 font-light italic leading-relaxed">
                  "{scene.novaReflection || "This scene resonates with a frequency yet to be decoded."}"
                </p>
              </div>
            </div>

            {/* Forge Links */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Forge Connections</h3>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={handleLinkToJournal}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-white"><BookOpen size={16} /></div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">Expand in Journal</span>
                  </div>
                  <ArrowRight size={14} className="text-gray-600 group-hover:text-white" />
                </button>
                
                <button className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-white"><BrainCircuit size={16} /></div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">Generate Insight</span>
                  </div>
                  <ArrowRight size={14} className="text-gray-600 group-hover:text-white" />
                </button>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/5 flex justify-between items-center">
            <button 
              onClick={() => deleteScene(scene.id)}
              className="p-3 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all"
            >
              <Trash2 size={18} />
            </button>
            <button className="p-3 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all">
              <Share2 size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
