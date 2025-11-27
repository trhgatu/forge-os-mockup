
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Notification, NotificationType, NotificationSource, Season } from '../types';
import { useSeason } from './SeasonContext';

interface NotificationContextType {
  notifications: Notification[];
  activeWhispers: Notification[];
  notify: (type: NotificationType, source: NotificationSource, message: string, title?: string, linkTo?: any) => void;
  markAsRead: (id: string) => void;
  clearWhispers: () => void;
  toggleCenter: () => void;
  isCenterOpen: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock messages for ambient system
const AMBIENT_WHISPERS = [
  "Season Engine: A subtle shift towards Autumn.",
  "Your memory constellation is growing dense.",
  "Identity Vector aligning with 'Builder' archetype.",
  "Energy reserves are stable. Good time for deep work.",
  "Subconscious pattern detected in recent journals.",
  "Connection node 'Catalyst' active.",
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeWhispers, setActiveWhispers] = useState<Notification[]>([]);
  const [isCenterOpen, setIsCenterOpen] = useState(false);
  const { season } = useSeason();

  // Create a new notification
  const notify = useCallback((type: NotificationType, source: NotificationSource, message: string, title?: string, linkTo?: any) => {
    const newNotif: Notification = {
      id: Date.now().toString() + Math.random().toString(),
      type,
      source,
      title,
      message,
      timestamp: new Date(),
      read: false,
      priority: 'medium',
      seasonTint: season,
      linkTo
    };

    // Add to history
    setNotifications(prev => [newNotif, ...prev]);

    // If it's a whisper, add to active whispers queue
    if (type === 'whisper') {
      setActiveWhispers(prev => [...prev, newNotif]);
      
      // Auto dismiss whisper after 5 seconds
      setTimeout(() => {
        setActiveWhispers(prev => prev.filter(n => n.id !== newNotif.id));
      }, 5000);
    }
  }, [season]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearWhispers = () => setActiveWhispers([]);
  const toggleCenter = () => setIsCenterOpen(prev => !prev);

  // Ambient System Heartbeat
  // Simulates the OS "thinking" or "feeling" occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      // 20% chance every 30s to emit a whisper
      if (Math.random() > 0.8) {
        const msg = AMBIENT_WHISPERS[Math.floor(Math.random() * AMBIENT_WHISPERS.length)];
        notify('whisper', 'system', msg);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [notify]);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      activeWhispers, 
      notify, 
      markAsRead, 
      clearWhispers,
      toggleCenter,
      isCenterOpen
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};
