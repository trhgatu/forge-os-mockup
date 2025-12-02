
import React, { useState } from 'react';
import { EpicSceneProvider, useEpicScene } from '../../contexts/EpicSceneContext';
import { EpicSceneCard } from './EpicSceneCard';
import { EpicSceneDetail } from './EpicSceneDetail';
import { EpicUploader } from './EpicUploader';
import { VaultStats } from './VaultStats';
import { Film, Plus, Search, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';

const SceneVaultContent: React.FC = () => {
  const { scenes, activeScene, setActiveScene, toggleFavorite, stats } = useEpicScene();
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredScenes = scenes.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.series.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#050508] text-white relative overflow-hidden animate-in fade-in duration-1000 selection:bg-fuchsia-500/30">
      
      {/* Cinematic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[1200px] h-[1200px] bg-fuchsia-900/10 rounded-full blur-[200px] opacity-40" />
        <div className="absolute bottom-[-10%] right-[10%] w-[1000px] h-[1000px] bg-cyan-900/10 rounded-full blur-[200px] opacity-30" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="flex-1 h-full overflow-y-auto scrollbar-hide relative z-10 flex flex-col">
        <div className="max-w-7xl mx-auto w-full p-6 md:p-10 pb-32">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 mb-4 backdrop-blur-md shadow-lg">
                <Film size={12} className="text-fuchsia-400 animate-pulse-slow" /> Cinematic Archive
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-3 tracking-tight">
                Epic Vault
              </h1>
              <p className="text-lg text-gray-400 font-light max-w-xl leading-relaxed">
                A chamber of emotional impact. The moments that forged the soul.
              </p>
            </div>
            
            {/* Action Group */}
            <div className="flex gap-4">
              <button 
                onClick={() => setIsUploading(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105"
              >
                <Plus size={18} /> Capture Scene
              </button>
            </div>
          </div>

          <VaultStats stats={stats} />

          {/* Search Bar */}
          <div className="relative mb-12 group">
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative flex items-center bg-[#09090b] border border-white/10 rounded-2xl p-2 shadow-2xl">
              <Search className="ml-4 text-gray-500" size={20} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, series, or emotion..."
                className="flex-1 bg-transparent border-none text-white text-lg px-4 py-3 focus:outline-none focus:ring-0 placeholder-gray-600 font-light"
              />
              <button className="p-3 text-gray-500 hover:text-white transition-colors">
                <Filter size={20} />
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredScenes.map((scene) => (
              <EpicSceneCard 
                key={scene.id} 
                scene={scene} 
                onClick={() => setActiveScene(scene)} 
                onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(scene.id); }}
              />
            ))}
          </div>

          {filteredScenes.length === 0 && (
            <div className="py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
              <Film className="mx-auto mb-4 text-white/10" size={48} />
              <p className="text-gray-500 font-light text-lg">The vault is waiting for its first artifact.</p>
            </div>
          )}

        </div>
      </div>

      {/* Overlays */}
      {activeScene && (
        <EpicSceneDetail scene={activeScene} onClose={() => setActiveScene(null)} />
      )}

      {isUploading && (
        <EpicUploader onClose={() => setIsUploading(false)} />
      )}

    </div>
  );
};

export const EpicSceneVault: React.FC = () => {
  return (
    <EpicSceneProvider>
      <SceneVaultContent />
    </EpicSceneProvider>
  );
};
