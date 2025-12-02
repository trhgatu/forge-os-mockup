
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Echo } from '../types';
import { fetchEchoes, createEcho } from '../services/echoService';
import { useNotification } from './NotificationContext';

interface EchoesContextType {
  echoes: Echo[];
  addEcho: (from: string, message: string) => Promise<void>;
  markViewed: (id: string) => void;
  getUnreadCount: () => number;
  activeEcho: Echo | null;
  setActiveEcho: (echo: Echo | null) => void;
  isLoading: boolean;
}

const EchoesContext = createContext<EchoesContextType | undefined>(undefined);

export const EchoesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const [activeEcho, setActiveEcho] = useState<Echo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { notify } = useNotification();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await fetchEchoes();
      setEchoes(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const addEcho = async (from: string, message: string) => {
    const newEcho = await createEcho(from, message);
    setEchoes(prev => [newEcho, ...prev]);
    
    // Trigger system notification
    notify('whisper', 'echoes', `New ${newEcho.type} received from ${newEcho.from}`);
  };

  const markViewed = (id: string) => {
    setEchoes(prev => prev.map(e => e.id === id ? { ...e, viewed: true } : e));
  };

  const getUnreadCount = () => echoes.filter(e => !e.viewed).length;

  return (
    <EchoesContext.Provider value={{ 
      echoes, 
      addEcho, 
      markViewed, 
      getUnreadCount, 
      activeEcho, 
      setActiveEcho,
      isLoading 
    }}>
      {children}
    </EchoesContext.Provider>
  );
};

export const useEchoes = () => {
  const context = useContext(EchoesContext);
  if (!context) throw new Error("useEchoes must be used within EchoesProvider");
  return context;
};
