
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EpicScene, EpicVaultStats } from '../types';
import { getScenes, addScene, getVaultStats } from '../services/epicSceneService';
import { useNotification } from './NotificationContext';

interface EpicSceneContextType {
  scenes: EpicScene[];
  stats: EpicVaultStats | null;
  isLoading: boolean;
  activeScene: EpicScene | null;
  setActiveScene: (scene: EpicScene | null) => void;
  addNewScene: (data: Partial<EpicScene>) => Promise<void>;
  toggleFavorite: (id: string) => void;
  deleteScene: (id: string) => void;
  refreshVault: () => void;
}

const EpicSceneContext = createContext<EpicSceneContextType | undefined>(undefined);

export const EpicSceneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scenes, setScenes] = useState<EpicScene[]>([]);
  const [stats, setStats] = useState<EpicVaultStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeScene, setActiveScene] = useState<EpicScene | null>(null);
  const { notify } = useNotification();

  const loadData = async () => {
    setIsLoading(true);
    const data = await getScenes();
    setScenes(data);
    const vaultStats = await getVaultStats(data);
    setStats(vaultStats);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addNewScene = async (data: Partial<EpicScene>) => {
    const newScene = await addScene(data);
    setScenes(prev => [newScene, ...prev]);
    notify('event', 'epic_vault', `New epic scene crystallized: ${newScene.title}`);
    
    // Update stats
    const newStats = await getVaultStats([newScene, ...scenes]);
    setStats(newStats);
  };

  const toggleFavorite = (id: string) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s));
  };

  const deleteScene = (id: string) => {
    setScenes(prev => prev.filter(s => s.id !== id));
    if (activeScene?.id === id) setActiveScene(null);
  };

  const refreshVault = () => loadData();

  return (
    <EpicSceneContext.Provider value={{
      scenes,
      stats,
      isLoading,
      activeScene,
      setActiveScene,
      addNewScene,
      toggleFavorite,
      deleteScene,
      refreshVault
    }}>
      {children}
    </EpicSceneContext.Provider>
  );
};

export const useEpicScene = () => {
  const context = useContext(EpicSceneContext);
  if (!context) throw new Error("useEpicScene must be used within EpicSceneProvider");
  return context;
};
