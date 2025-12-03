
import React, { useEffect } from 'react';
import { EpicScene } from '../types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadVaultData, addNewScene as reduxAdd, setActiveSceneId, toggleFavorite as reduxToggle, deleteScene as reduxDelete } from '../store/slices/epicSceneSlice';
import { useNotification } from './NotificationContext';

export const EpicSceneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    useEffect(() => { dispatch(loadVaultData()); }, [dispatch]);
    return <>{children}</>;
};

export const useEpicScene = () => {
  const { scenes, stats, isLoading, activeSceneId } = useAppSelector((state) => state.epicScene);
  const dispatch = useAppDispatch();
  const { notify } = useNotification();

  const activeScene = scenes.find(s => s.id === activeSceneId) || null;

  const addNewScene = async (data: Partial<EpicScene>) => {
    const result = await dispatch(reduxAdd(data));
    const newScene = result.payload as any;
    notify('event', 'epic_vault', `New epic scene crystallized: ${newScene.title}`);
  };

  return {
    scenes,
    stats,
    isLoading,
    activeScene,
    setActiveScene: (s: EpicScene | null) => dispatch(setActiveSceneId(s ? s.id : null)),
    addNewScene,
    toggleFavorite: (id: string) => dispatch(reduxToggle(id)),
    deleteScene: (id: string) => dispatch(reduxDelete(id)),
    refreshVault: () => dispatch(loadVaultData())
  };
};
