
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadEchoes, addEcho as reduxAdd, markViewed as reduxMark, setActiveEchoId } from '../store/slices/echoesSlice';
import { useNotification } from './NotificationContext';

export const EchoesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    useEffect(() => { dispatch(loadEchoes()); }, [dispatch]);
    return <>{children}</>;
};

export const useEchoes = () => {
  const { echoes, activeEchoId, isLoading } = useAppSelector((state) => state.echoes);
  const dispatch = useAppDispatch();
  const { notify } = useNotification();

  const activeEcho = echoes.find(e => e.id === activeEchoId) || null;

  const addEcho = async (from: string, message: string) => {
    const result = await dispatch(reduxAdd({ from, message }));
    const newEcho = result.payload as any;
    notify('whisper', 'echoes', `New ${newEcho.type} received from ${newEcho.from}`);
  };

  const markViewed = (id: string) => dispatch(reduxMark(id));
  const setActiveEcho = (e: any | null) => dispatch(setActiveEchoId(e ? e.id : null));
  const getUnreadCount = () => echoes.filter(e => !e.viewed).length;

  return { 
    echoes, 
    addEcho, 
    markViewed, 
    getUnreadCount, 
    activeEcho, 
    setActiveEcho,
    isLoading 
  };
};
