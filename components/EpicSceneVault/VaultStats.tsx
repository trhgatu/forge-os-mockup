
import React from 'react';
import { EpicVaultStats } from '../../types';
import { Film, Heart, Zap, Clock } from 'lucide-react';

interface VaultStatsProps {
  stats: EpicVaultStats | null;
}

export const VaultStats: React.FC<VaultStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full">
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
        <div className="p-2 rounded-lg bg-white/5 text-gray-400"><Film size={18}/></div>
        <div>
          <div className="text-xl font-bold text-white">{stats.totalScenes}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">Total Scenes</div>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
        <div className="p-2 rounded-lg bg-fuchsia-500/10 text-fuchsia-400"><Heart size={18}/></div>
        <div>
          <div className="text-xl font-bold text-white capitalize">{stats.topEmotion}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">Dominant Emotion</div>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400"><Zap size={18}/></div>
        <div>
          <div className="text-xl font-bold text-white truncate max-w-[100px]">{stats.topSeries}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">Top Series</div>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
        <div className="p-2 rounded-lg bg-white/5 text-gray-400"><Clock size={18}/></div>
        <div>
          <div className="text-xl font-bold text-white">Recent</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">{stats.lastAdded.toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};
