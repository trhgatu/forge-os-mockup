
import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { WhisperBubble } from './WhisperBubble';
import { NotificationCenter } from './NotificationCenter';
import { Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

export const NotificationOverlay: React.FC = () => {
  const { activeWhispers, toggleCenter, notifications } = useNotification();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Floating Whispers Layer */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center z-[80] pointer-events-none w-full max-w-md px-4">
        {activeWhispers.map(n => (
          <WhisperBubble key={n.id} notification={n} />
        ))}
      </div>

      {/* Dock Trigger (Small indicator at bottom right, next to Nova Guide presumably) */}
      <div className="fixed bottom-8 right-36 z-[60]">
        <button
          onClick={toggleCenter}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 group",
            unreadCount > 0 ? "border-forge-cyan/30" : ""
          )}
        >
          <div className="relative">
            <Activity size={14} className={cn("text-gray-400 group-hover:text-white transition-colors", unreadCount > 0 && "text-forge-cyan")} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-forge-accent rounded-full animate-pulse" />
            )}
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase group-hover:text-gray-300">
            Signals {unreadCount > 0 && `(${unreadCount})`}
          </span>
        </button>
      </div>

      {/* Main Center Panel */}
      <NotificationCenter />
    </>
  );
};
