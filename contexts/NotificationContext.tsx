
import React, { useEffect, useCallback } from 'react';
import { NotificationType, NotificationSource } from '../types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { notify as reduxNotify, markAsRead as reduxMarkRead, clearWhispers as reduxClearWhispers, removeWhisper, toggleCenter as reduxToggleCenter } from '../store/slices/notificationSlice';

// Mock messages
const AMBIENT_WHISPERS = [
  "Season Engine: A subtle shift towards Autumn.",
  "Your memory constellation is growing dense.",
  "Identity Vector aligning with 'Builder' archetype.",
  "Energy reserves are stable. Good time for deep work.",
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const season = useAppSelector(state => state.system.season);

    // Ambient heartbeat logic moved here to run once
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                const msg = AMBIENT_WHISPERS[Math.floor(Math.random() * AMBIENT_WHISPERS.length)];
                dispatch(reduxNotify({ type: 'whisper', source: 'system', message: msg, season }));
                // Auto remove handled by component timeouts usually, but slice can handle logic too
                // Here we rely on the component rendering the whisper to handle fade out or simple timeout dispatch
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [dispatch, season]);

    return <>{children}</>;
};

export const useNotification = () => {
  const { items, activeWhispers, isCenterOpen } = useAppSelector((state) => state.notifications);
  const season = useAppSelector((state) => state.system.season);
  const dispatch = useAppDispatch();

  const notify = useCallback((type: NotificationType, source: NotificationSource, message: string, title?: string, linkTo?: any) => {
    dispatch(reduxNotify({ type, source, message, title, linkTo, season }));
    if(type === 'whisper') {
        // Auto dismiss logic simulation
        const id = Date.now(); // This won't match exact ID in reducer but we need a way. 
        // Actually, the reducer generates ID. 
        // For simple auto-dismiss visual, WhisperBubble handles animation out.
        // We can dispatch removeWhisper after timeout if needed, but for now we let state persist briefly.
        setTimeout(() => {
             // In a real app we'd need the ID returned from dispatch, but RTK doesn't return payload ID easily without thunks.
             // We'll rely on `clearWhispers` or UI components handling exit animations.
             dispatch(reduxClearWhispers()); // Simple clear for now
        }, 5000);
    }
  }, [dispatch, season]);

  const markAsRead = (id: string) => dispatch(reduxMarkRead(id));
  const clearWhispers = () => dispatch(reduxClearWhispers());
  const toggleCenter = () => dispatch(reduxToggleCenter());

  return { 
    notifications: items, 
    activeWhispers, 
    notify, 
    markAsRead, 
    clearWhispers,
    toggleCenter,
    isCenterOpen
  };
};
