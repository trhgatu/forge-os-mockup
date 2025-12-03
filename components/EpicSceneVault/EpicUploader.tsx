
import React, { useState, useRef } from 'react';
import { useEpicScene } from '../../contexts/EpicSceneContext';
import { X, Upload, Sparkles, Image as ImageIcon, Film, Mic, AlignLeft, Music, Clock, User, Hash, Lightbulb, PenTool, Layers, Link as LinkIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EpicUploaderProps {
  onClose: () => void;
}

export const EpicUploader: React.FC<EpicUploaderProps> = ({ onClose }) => {
  const { addNewScene } = useEpicScene();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Media
  const [url, setUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  // Identity
  const [title, setTitle] = useState('');
  const [series, setSeries] = useState('');
  const [episode, setEpisode] = useState('');
  const [timestamp, setTimestamp] = useState('');
  
  // Content
  const [quote, setQuote] = useState('');
  const [quoteBy, setQuoteBy] = useState('');
  const [context, setContext] = useState('');
  
  // Meaning
  const [reflection, setReflection] = useState('');
  const [insight, setInsight] = useState('');
  
  // Tags (Comma separated strings for input)
  const [emotions, setEmotions] = useState('');
  const [archetypes, setArchetypes] = useState('');
  const [themes, setThemes] = useState('');
  const [vibes, setVibes] = useState('');
  
  // Audio
  const [soundtrack, setSoundtrack] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if ((!url && !videoUrl) || !title) return;
    setIsProcessing(true);
    
    // Parse tags
    const parseTags = (str: string) => str.split(',').map(s => s.trim()).filter(s => s.length > 0);

    await addNewScene({
      imageUrl: url,
      videoUrl,
      title,
      series,
      episode,
      timestamp,
      quote,
      quoteBy,
      context,
      reflection,
      insight,
      soundtrack: soundtrack ? { title: soundtrack, intensityLevel: 5 } : undefined,
      emotionTags: parseTags(emotions),
      archetypeTags: parseTags(archetypes),
      themeTags: parseTags(themes),
      vibeTags: parseTags(vibes),
    });
    
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="w-full max-w-5xl bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-fuchsia-900/10 to-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
              <Upload size={16} />
            </div>
            <div>
              <h3 className="font-display font-bold text-white tracking-wide">Crystallize Scene</h3>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Add to Epic Vault</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-10">
            
            {/* SECTION 1: MEDIA & ORIGIN */}
            <section>
               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2 mb-6">
                  <Film size={12} className="text-cyan-500" /> Media & Origin
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Scene Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. United States of Smash" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-base font-bold focus:border-cyan-500/50 focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Series Source</label>
                        <input value={series} onChange={(e) => setSeries(e.target.value)} placeholder="e.g. My Hero Academia" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-cyan-500/50 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase">Episode</label>
                          <input value={episode} onChange={(e) => setEpisode(e.target.value)} placeholder="S03E11" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-cyan-500/50 focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase">Timestamp</label>
                          <div className="relative">
                            <Clock size={14} className="absolute left-3 top-2.5 text-gray-500" />
                            <input value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder="20:45" className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm focus:border-cyan-500/50 focus:outline-none" />
                          </div>
                        </div>
                      </div>
                  </div>
                  <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Cover Image</label>
                        <div className="flex gap-2">
                            <input 
                                value={url} 
                                onChange={(e) => setUrl(e.target.value)} 
                                placeholder="Paste URL or upload..." 
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-fuchsia-500/50 focus:outline-none" 
                            />
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileSelect} 
                                className="hidden" 
                                accept="image/*" 
                            />
                            <button 
                                onClick={triggerFileUpload} 
                                className="px-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                title="Upload Image"
                            >
                                <Upload size={16} />
                            </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Video Clip URL (Optional)</label>
                        <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="YouTube / MP4..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-fuchsia-500/50 focus:outline-none" />
                      </div>
                      {url && (
                        <div className="relative h-28 rounded-xl overflow-hidden border border-white/10 group">
                            <img src={url} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                            <div className="absolute bottom-2 right-2 text-[10px] text-white/80 bg-black/50 px-2 py-1 rounded backdrop-blur-md">Preview</div>
                        </div>
                      )}
                  </div>
               </div>
            </section>

            {/* SECTION 2: THE NARRATIVE */}
            <section>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2 mb-6">
                    <Layers size={12} className="text-amber-500" /> The Narrative
                </h4>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-mono text-gray-400 uppercase">Key Quote</label>
                            <input value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="The memorable line..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-amber-500/50 focus:outline-none font-serif italic" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-gray-400 uppercase">Speaker</label>
                            <div className="relative">
                                <User size={14} className="absolute left-3 top-2.5 text-gray-500" />
                                <input value={quoteBy} onChange={(e) => setQuoteBy(e.target.value)} placeholder="Character" className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm focus:border-amber-500/50 focus:outline-none" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Context (Story Background)</label>
                        <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="What is happening in this moment?" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 text-sm focus:border-amber-500/50 focus:outline-none resize-none leading-relaxed" />
                    </div>
                </div>
            </section>

            {/* SECTION 3: THE MEANING */}
            <section>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2 mb-6">
                    <Sparkles size={12} className="text-emerald-500" /> The Resonance
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Reflection (Personal Feeling)</label>
                        <textarea value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="How does this make you feel?" rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-emerald-500/50 focus:outline-none resize-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Insight (Universal Truth)</label>
                        <div className="relative h-full">
                            <textarea value={insight} onChange={(e) => setInsight(e.target.value)} placeholder="What truth does this scene reveal?" className="w-full h-full bg-emerald-900/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-emerald-100 text-sm focus:border-emerald-500/50 focus:outline-none resize-none" />
                            <Lightbulb size={14} className="absolute bottom-3 right-3 text-emerald-500/50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: META DATA */}
            <section>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2 mb-6">
                    <Hash size={12} className="text-fuchsia-500" /> Tag Matrix
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-fuchsia-400 uppercase">Emotions</label>
                        <input value={emotions} onChange={(e) => setEmotions(e.target.value)} placeholder="e.g. Sacrifice, Hope" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-fuchsia-500/50 focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-cyan-400 uppercase">Archetypes</label>
                        <input value={archetypes} onChange={(e) => setArchetypes(e.target.value)} placeholder="e.g. Mentor, Hero" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-amber-400 uppercase">Themes</label>
                        <input value={themes} onChange={(e) => setThemes(e.target.value)} placeholder="e.g. Legacy, Willpower" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500/50 focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-emerald-400 uppercase">Vibes</label>
                        <input value={vibes} onChange={(e) => setVibes(e.target.value)} placeholder="e.g. Legendary, Neon" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none" />
                    </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/5">
                     <div className="flex items-center gap-4">
                        <Music size={16} className="text-gray-500" />
                        <input value={soundtrack} onChange={(e) => setSoundtrack(e.target.value)} placeholder="Soundtrack Link / Title" className="flex-1 bg-transparent border-b border-white/10 py-1 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30" />
                     </div>
                </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/40 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={(!url && !videoUrl) || !title || isProcessing}
            className="px-8 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? <Sparkles size={16} className="animate-spin" /> : <Upload size={16} />}
            {isProcessing ? 'Crystallizing...' : 'Save to Vault'}
          </button>
        </div>

      </div>
    </div>
  );
};
