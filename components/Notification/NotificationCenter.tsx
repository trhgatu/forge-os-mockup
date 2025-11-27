
import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { SignalCard } from './SignalCard';
import { X, Bell, CheckCheck } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { cn } from '../../lib/utils';

export const NotificationCenter: React.FC = () => {
  const { notifications, isCenterOpen, toggleCenter, markAsRead } = useNotification();

  if (!isCenterOpen) return null;

  const handleMarkAllRead = () => {
    notifications.forEach(n => markAsRead(n.id));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]" 
        onClick={toggleCenter} 
      />

      {/* Panel */}
      <div className="fixed top-4 right-4 bottom-20 w-[380px] z-[100] animate-in slide-in-from-right duration-300">
        <GlassCard className="h-full flex flex-col bg-black/80 border-white/10" noPadding>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-forge-cyan" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Signals</h3>
              <span className="bg-white/10 text-xs px-1.5 rounded text-gray-400">
                {notifications.filter(n => !n.read).length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleMarkAllRead}
                className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={14} />
              </button>
              <button 
                onClick={toggleCenter}
                className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-600">
                <Bell size={24} className="mb-2 opacity-20" />
                <p className="text-xs">No signals detected.</p>
              </div>
            ) : (
              notifications.map(n => (
                <SignalCard 
                  key={n.id} 
                  notification={n} 
                  onClick={() => markAsRead(n.id)}
                />
              ))
            )}
          </div>

        </GlassCard>
      </div>
    </>
  );
};
