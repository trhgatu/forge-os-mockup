
import React, { useState } from 'react';
import { useEpicScene } from '../../contexts/EpicSceneContext';
import { X, Upload, Sparkles, Image as ImageIcon, Film, Mic, AlignLeft, Music } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EpicUploaderProps {
  onClose: () => void;
}

export const EpicUploader: React.FC<EpicUploaderProps> = ({ onClose }) => {
  const { addNewScene } = useEpicScene();
  const [url, setUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [series, setSeries] = useState('');
  const [quote, setQuote] = useState('');
  const [context, setContext] = useState('');
  const [soundtrack, setSoundtrack] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSave = async () => {
    if ((!url && !videoUrl) || !title) return;
    setIsProcessing(true);
    await addNewScene({
      imageUrl: url,
      videoUrl,
      title,
      series,
      quote,
      context,
      soundtrack: soundtrack ? { title: soundtrack, intensityLevel: 5 } : undefined,
      emotionTags: ['custom'],
      archetypeTags: [],
      vibeTags: []
    });
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-fuchsia-900/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
              <Upload size={16} />
            </div>
            <h3 className="font-display font-bold text-white tracking-wide">Capture Artifact</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          
          <div className="grid grid-cols-2 gap-6">
             {/* Visual Source */}
             <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Image URL</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-fuchsia-500/50 transition-colors">
                <ImageIcon size={16} className="text-gray-500" />
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 text-sm flex-1" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Video URL (Optional)</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-fuchsia-500/50 transition-colors">
                <Film size={16} className="text-gray-500" />
                <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="YouTube / MP4..." className="bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 text-sm flex-1" />
                </div>
             </div>
          </div>

          {/* Preview */}
          {(url || videoUrl) && (
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black">
              {url ? <img src={url} alt="Preview" className="w-full h-full object-cover opacity-80" /> : <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">Video Preview</div>}
            </div>
          )}

          {/* Core Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The Awakening..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Series</label>
              <input value={series} onChange={(e) => setSeries(e.target.value)} placeholder="Evangelion..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none" />
            </div>
          </div>

          {/* Context & Quote */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Story Context</label>
            <div className="relative">
                <AlignLeft size={14} className="absolute top-4 left-4 text-gray-500" />
                <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="What is happening in this moment?" rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none resize-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Memorable Quote</label>
            <div className="relative">
              <Mic size={14} className="absolute top-4 left-4 text-gray-500" />
              <textarea value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Lines that echoed..." rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none resize-none font-serif italic" />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Soundtrack Link</label>
             <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-fuchsia-500/50 transition-colors">
                <Music size={16} className="text-gray-500" />
                <input value={soundtrack} onChange={(e) => setSoundtrack(e.target.value)} placeholder="Song Title / OST..." className="bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 text-sm flex-1" />
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/40 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={(!url && !videoUrl) || !title || isProcessing}
            className="px-8 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? <Sparkles size={16} className="animate-spin" /> : <Upload size={16} />}
            {isProcessing ? 'Forging...' : 'Save to Vault'}
          </button>
        </div>

      </div>
    </div>
  );
};
