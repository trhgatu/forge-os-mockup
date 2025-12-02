
import React from 'react';
import { useForgeLab } from '../../contexts/ForgeLabContext';
import { ForgeFoundation } from '../../types';
import { cn } from '../../lib/utils';
import { 
  Book, 
  X, 
  Sparkles, 
  Bookmark, 
  Hash,
  Scale,
  Anchor
} from 'lucide-react';

const FoundationDetail: React.FC<{ foundation: ForgeFoundation; onClose: () => void }> = ({ foundation, onClose }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] bg-[#09090b] border border-white/10 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="relative p-8 pb-12 border-b border-white/5 bg-gradient-to-br from-fuchsia-900/10 to-transparent">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white">
            <X size={24} />
          </button>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-xs font-bold text-fuchsia-400 uppercase tracking-widest mb-6">
            <Scale size={12} /> {foundation.category}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
            {foundation.title}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl font-light">
            {foundation.summary}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 bg-[#09090b]">
          
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="font-serif text-gray-200 leading-loose text-xl">
              {foundation.content}
            </p>
          </div>

          {/* Nova Reflection */}
          {foundation.novaReflection && (
            <div className="p-6 rounded-xl bg-white/[0.02] border-l-4 border-fuchsia-500 relative">
              <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-500 uppercase tracking-widest mb-2">
                <Sparkles size={14} /> Nova Note
              </div>
              <p className="text-gray-300 italic font-serif">
                "{foundation.novaReflection}"
              </p>
            </div>
          )}

          {/* Footer Metadata */}
          <div className="flex items-center gap-6 pt-8 border-t border-white/5 text-xs text-gray-500 font-mono uppercase tracking-widest">
            <span>Est. {foundation.createdAt.toLocaleDateString()}</span>
            <span>Last Verified {foundation.updatedAt.toLocaleDateString()}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

const FoundationCard: React.FC<{ foundation: ForgeFoundation; onClick: () => void }> = ({ foundation, onClick }) => (
  <div 
    onClick={onClick}
    className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-fuchsia-500/30 transition-all duration-500 cursor-pointer flex flex-col h-full"
  >
    <div className="mb-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-fuchsia-900/10 text-fuchsia-400">
          <Anchor size={20} />
        </div>
        <div className="text-[10px] font-mono text-gray-600 uppercase border border-white/5 px-2 py-1 rounded">
          {foundation.category}
        </div>
      </div>
      <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-fuchsia-400 transition-colors">
        {foundation.title}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed font-serif line-clamp-3">
        {foundation.summary}
      </p>
    </div>
    
    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-white transition-colors">
        <Book size={14} /> Read Principle
      </div>
      {foundation.novaReflection && <Sparkles size={14} className="text-fuchsia-500 opacity-50" />}
    </div>
  </div>
);

export const FoundationLibrary: React.FC = () => {
  const { foundations, activeFoundation, setActiveFoundation } = useForgeLab();

  return (
    <div className="relative h-full flex flex-col">
      <div className="max-w-7xl mx-auto w-full p-6 md:p-10 pb-32">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">Foundation Library</h2>
            <p className="text-gray-400 text-sm">The immutable principles governing the system.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {foundations.map(f => (
            <FoundationCard key={f.id} foundation={f} onClick={() => setActiveFoundation(f)} />
          ))}
        </div>
      </div>

      {activeFoundation && (
        <FoundationDetail foundation={activeFoundation} onClose={() => setActiveFoundation(null)} />
      )}
    </div>
  );
};
