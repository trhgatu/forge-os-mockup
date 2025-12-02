
import React, { useState } from 'react';
import { Send, Wind, Sparkles } from 'lucide-react';
import { useEchoes } from '../contexts/EchoesContext';
import { cn } from '../lib/utils';

interface PublicEchoPortalProps {
  onClose: () => void;
}

export const PublicEchoPortal: React.FC<PublicEchoPortalProps> = ({ onClose }) => {
  const { addEcho } = useEchoes();
  const [message, setMessage] = useState('');
  const [from, setFrom] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    await addEcho(from, message);
    setIsSending(false);
    setSent(true);

    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-700">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse-slow">
              <Sparkles className="text-white opacity-80" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-display font-light text-white mb-2">Echo Received</h2>
          <p className="text-sm text-gray-400 font-mono">Your signal has entered the stream.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050508]/95 backdrop-blur-lg animate-in fade-in duration-500">
      <div className="w-full max-w-lg p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 p-4 text-gray-500 hover:text-white transition-colors"
        >
          Close
        </button>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 mb-4">
            <Wind size={12} /> Public Echo Portal
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Leave a Signal</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your message will drift into the system as a whisper, signal, or echo depending on its weight.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Your Name (Optional)"
              className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors text-sm font-medium"
            />
          </div>

          <div className="group relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message to the void..."
              rows={5}
              className="w-full bg-transparent border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-all resize-none text-base leading-relaxed font-serif"
              autoFocus
            />
            <div className="absolute bottom-4 right-4 text-[10px] text-gray-600 font-mono">
              {message.length} chars
            </div>
          </div>

          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2",
              message.trim() && !isSending
                ? "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                : "bg-white/5 text-gray-500 cursor-not-allowed"
            )}
          >
            {isSending ? (
              <span className="animate-pulse">Transmitting...</span>
            ) : (
              <>
                <Send size={16} /> Send Echo
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
