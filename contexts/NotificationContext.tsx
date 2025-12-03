
import React, { useEffect, useCallback } from 'react';
import { NotificationType, NotificationSource } from '../types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { notify as reduxNotify, markAsRead as reduxMarkRead, clearWhispers as reduxClearWhispers, removeWhisper as reduxRemoveWhisper, toggleCenter as reduxToggleCenter } from '../store/slices/notificationSlice';

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

    // Ambient heartbeat logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                const msg = AMBIENT_WHISPERS[Math.floor(Math.random() * AMBIENT_WHISPERS.length)];
                dispatch(reduxNotify({ type: 'whisper', source: 'system', message: msg, season }));
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
  }, [dispatch, season]);

  const markAsRead = (id: string) => dispatch(reduxMarkRead(id));
  const clearWhispers = () => dispatch(reduxClearWhispers());
  const removeWhisper = (id: string) => dispatch(reduxRemoveWhisper(id));
  const toggleCenter = () => dispatch(reduxToggleCenter());

  return { 
    notifications: items, 
    activeWhispers, 
    notify, 
    markAsRead, 
    clearWhispers,
    removeWhisper,
    toggleCenter,
    isCenterOpen
  };
};
