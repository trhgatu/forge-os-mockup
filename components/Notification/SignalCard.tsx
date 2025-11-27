
import React from 'react';
import { Notification } from '../../types';
import { cn } from '../../lib/utils';
import { 
  Wind, 
  Activity, 
  Sparkles, 
  Zap, 
  Database, 
  Cpu, 
  Fingerprint
} from 'lucide-react';

const SOURCE_CONFIG: Record<string, { icon: React.ElementType, color: string }> = {
  season: { icon: Wind, color: 'text-emerald-400' },
  thoughtstream: { icon: Activity, color: 'text-blue-400' },
  insight: { icon: Sparkles, color: 'text-fuchsia-400' },
  identity: { icon: Fingerprint, color: 'text-violet-400' },
  connection: { icon: Zap, color: 'text-yellow-400' },
  system: { icon: Cpu, color: 'text-gray-400' },
  memory: { icon: Database, color: 'text-orange-400' },
  nova: { icon: Sparkles, color: 'text-forge-cyan' }
};

interface SignalCardProps {
  notification: Notification;
  onClick?: () => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({ notification, onClick }) => {
  const config = SOURCE_CONFIG[notification.source] || SOURCE_CONFIG.system;
  const Icon = config.icon;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative p-4 rounded-xl border transition-all cursor-pointer group hover:bg-white/[0.02]",
        notification.read ? "bg-transparent border-white/5 opacity-60" : "bg-white/[0.03] border-white/10"
      )}
    >
      {!notification.read && (
        <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-forge-accent shadow-[0_0_8px_#7C3AED]" />
      )}
      
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg bg-white/5 border border-white/5", config.color)}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              {notification.source}
            </span>
            <span className="text-[10px] text-gray-600">
              {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          {notification.title && (
            <h4 className={cn("text-sm font-bold mb-1", notification.read ? "text-gray-400" : "text-white")}>
              {notification.title}
            </h4>
          )}
          <p className={cn("text-xs leading-relaxed line-clamp-2", notification.read ? "text-gray-600" : "text-gray-300")}>
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
};
