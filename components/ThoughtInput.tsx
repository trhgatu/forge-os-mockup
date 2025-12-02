
import React, { useState, useEffect, useRef } from 'react';
import { Send, Zap, Radio, Layers, Sparkles } from 'lucide-react';
import { useThoughtStream } from '../contexts/ThoughtStreamContext';
import { classifyThought } from '../services/thoughtStreamService';
import { ThoughtType } from '../types';
import { cn } from '../lib/utils';

const TYPE_CONFIG: Record<ThoughtType, { icon: React.ElementType, label: string, color: string, glow: string }> = {
  spark: { icon: Zap, label: 'Spark', color: 'text-amber-400', glow: 'from-amber-500/20' },
  fragment: { icon: Radio, label: 'Fragment', color: 'text-cyan-400', glow: 'from-cyan-500/20' },
  stream: { icon: Layers, label: 'Stream Node', color: 'text-violet-400', glow: 'from-violet-500/20' }
};

export const ThoughtInput: React.FC = () => {
  const { addFragment } = useThoughtStream();
  const [text, setText] = useState('');
  const [type, setType] = useState<ThoughtType>('spark');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setType(classifyThought(text));
  }, [text]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;

    setIsSending(true);
    await addFragment(text);
    setText('');
    setIsSending(false);
    
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <div className="w-full max-w-3xl mx-auto relative group z-50">
      
      {/* Ambient Glow */}
      <div className={cn(
        "absolute -inset-0.5 rounded-2xl opacity-0 transition-all duration-500 blur-xl bg-gradient-to-r to-transparent",
        config.glow,
        text.length > 0 ? 'opacity-100' : 'opacity-0'
      )} />

      <div className="relative bg-[#09090b]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col transition-colors duration-300">
        
        {/* Type Indicator */}
        <div className={cn(
          "absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border bg-[#050508] flex items-center gap-2 transition-all duration-300 shadow-lg",
          text.length > 0 
            ? `${config.color} border-current opacity-100 translate-y-0` 
            : "opacity-0 translate-y-2 border-transparent text-gray-500"
        )}>
          <Icon size={10} />
          {config.label}
        </div>

        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Let it flow..."
          rows={Math.min(5, Math.max(1, text.split('\n').length))}
          className="w-full bg-transparent border-none text-white text-lg placeholder-gray-600 focus:outline-none focus:ring-0 font-serif p-5 resize-none leading-relaxed"
        />

        <div className="flex justify-between items-center px-4 pb-3">
          <div className="text-[10px] font-mono text-gray-600">
            {text.length} chars
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isSending}
            className={cn(
              "p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center",
              text.trim() 
                ? "bg-white text-black hover:bg-gray-200 shadow-lg hover:scale-105" 
                : "bg-white/5 text-gray-500 cursor-not-allowed"
            )}
          >
            {isSending ? <Sparkles size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
