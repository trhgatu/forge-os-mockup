
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThoughtFragment, ThoughtType, ThoughtStats } from '../types';
import { fetchInitialFragments, createFragment } from '../services/thoughtStreamService';
import { useNotification } from './NotificationContext';

interface ThoughtStreamContextType {
  fragments: ThoughtFragment[];
  isLoading: boolean;
  addFragment: (text: string) => Promise<void>;
  removeFragment: (id: string) => void;
  activeFragment: ThoughtFragment | null;
  setActiveFragment: (fragment: ThoughtFragment | null) => void;
  stats: ThoughtStats;
}

const ThoughtStreamContext = createContext<ThoughtStreamContextType | undefined>(undefined);

export const ThoughtStreamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fragments, setFragments] = useState<ThoughtFragment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFragment, setActiveFragment] = useState<ThoughtFragment | null>(null);
  const { notify } = useNotification();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await fetchInitialFragments();
      setFragments(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const addFragment = async (text: string) => {
    const newFragment = await createFragment(text);
    setFragments(prev => [newFragment, ...prev]);
    
    // Subtle notification for flow feedback
    if (newFragment.type === 'stream') {
        notify('signal', 'thoughtstream', 'Deep thought captured in the stream.');
    }
  };

  const removeFragment = (id: string) => {
    setFragments(prev => prev.filter(f => f.id !== id));
    if (activeFragment?.id === id) setActiveFragment(null);
  };

  // Calculate stats on the fly
  const stats: ThoughtStats = {
    totalCount: fragments.length,
    avgDepth: Math.round(fragments.reduce((acc, f) => acc + f.metadata.depth, 0) / (fragments.length || 1)),
    dominantType: fragments.filter(f => f.type === 'spark').length > fragments.length / 2 ? 'spark' : 'fragment',
    flowState: fragments.length > 10 ? 'rushing' : fragments.length > 5 ? 'flowing' : 'drifting'
  };

  return (
    <ThoughtStreamContext.Provider value={{
      fragments,
      isLoading,
      addFragment,
      removeFragment,
      activeFragment,
      setActiveFragment,
      stats
    }}>
      {children}
    </ThoughtStreamContext.Provider>
  );
};

export const useThoughtStream = () => {
  const context = useContext(ThoughtStreamContext);
  if (!context) throw new Error("useThoughtStream must be used within ThoughtStreamProvider");
  return context;
};
