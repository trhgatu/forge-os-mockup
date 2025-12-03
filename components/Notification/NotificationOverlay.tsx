
import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { WhisperBubble } from './WhisperBubble';
import { NotificationCenter } from './NotificationCenter';
import { Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

export const NotificationOverlay: React.FC = () => {
  const { activeWhispers, toggleCenter, notifications, removeWhisper } = useNotification();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Floating Whispers Layer - Top Center */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 flex flex-col items-center z-[80] pointer-events-none w-full max-w-md px-4 space-y-2">
        {activeWhispers.map(n => (
          <WhisperBubble 
            key={n.id} 
            notification={n} 
            onDismiss={() => removeWhisper(n.id)} 
          />
        ))}
      </div>

      {/* Dock Trigger - Right Center (Vertical) */}
      <div className="fixed top-1/2 right-4 -translate-y-1/2 z-[60]">
        <button
          onClick={toggleCenter}
          className={cn(
            "flex flex-col items-center gap-2 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 group shadow-lg hover:scale-110",
            unreadCount > 0 ? "border-forge-cyan/30" : ""
          )}
          title="System Signals"
        >
          <div className="relative">
            <Activity size={20} className={cn("text-gray-400 group-hover:text-white transition-colors", unreadCount > 0 && "text-forge-cyan")} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-forge-accent rounded-full animate-pulse border-2 border-black" />
            )}
          </div>
        </button>
      </div>

      {/* Main Center Panel */}
      <NotificationCenter />
    </>
  );
};
