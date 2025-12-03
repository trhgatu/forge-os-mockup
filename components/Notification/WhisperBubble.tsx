
import React, { useEffect, useState } from 'react';
import { Notification } from '../../types';
import { Sparkles, Wind, Activity, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const FingerprintIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6" />
    <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
    <path d="M8.65 22c.21-.66.45-1.32.57-2" />
    <path d="M9 15.2a3 3 0 0 0-1.4-2.6" />
    <path d="M9 22v-8.3a9 9 0 0 1 12.8-3.9" />
    <path d="M12 22v-6.7a3 3 0 0 1 5.3-2" />
    <path d="M15 22v-3.6a1.4 1.4 0 0 1 2.5-.9" />
  </svg>
)

const SOURCE_ICONS = {
  season: Wind,
  thoughtstream: Activity,
  insight: Sparkles,
  identity: FingerprintIcon,
  connection: Zap,
  system: Activity,
  nova: Sparkles,
  memory: Wind
};

interface WhisperBubbleProps {
  notification: Notification;
  onDismiss: () => void;
}

export const WhisperBubble: React.FC<WhisperBubbleProps> = ({ notification, onDismiss }) => {
  const Icon = SOURCE_ICONS[notification.source] || Sparkles;
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Wait 5 seconds, then trigger exit animation
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isExiting) {
      // Wait for animation to finish (700ms) then actually remove from store
      const timer = setTimeout(() => {
        onDismiss();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isExiting, onDismiss]);

  return (
    <div 
      className={cn(
        "pointer-events-none mb-2 transition-all duration-700 ease-in-out",
        isExiting 
          ? "opacity-0 -translate-y-4 filter blur-sm scale-95" 
          : "opacity-100 translate-y-0 animate-in slide-in-from-top-4 fade-in"
      )}
    >
      <div className={cn(
        "inline-flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md shadow-lg border border-white/5",
        "bg-black/60 text-sm font-medium text-gray-200"
      )}>
        <div className="relative">
          <Icon size={12} className="text-forge-cyan opacity-80" />
          <div className="absolute inset-0 bg-forge-cyan blur-sm opacity-30 animate-pulse" />
        </div>
        <span className="tracking-wide font-light">{notification.message}</span>
      </div>
    </div>
  );
};
