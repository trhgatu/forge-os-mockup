
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Insight, InsightSource } from '../types';
import { fetchInitialInsights, analyzeInput, detectPatterns } from '../services/insightService';
import { useNotification } from './NotificationContext';

interface InsightContextType {
  insights: Insight[];
  isLoading: boolean;
  addInsight: (text: string, source: InsightSource) => Promise<void>;
  deleteInsight: (id: string) => void;
  activeInsight: Insight | null;
  setActiveInsight: (insight: Insight | null) => void;
  patterns: { title: string, count: number }[];
  refreshPatterns: () => void;
}

const InsightContext = createContext<InsightContextType | undefined>(undefined);

export const InsightProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeInsight, setActiveInsight] = useState<Insight | null>(null);
  const [patterns, setPatterns] = useState<{ title: string, count: number }[]>([]);
  const { notify } = useNotification();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await fetchInitialInsights();
      setInsights(data);
      const pats = await detectPatterns(data);
      setPatterns(pats);
      setIsLoading(false);
    };
    load();
  }, []);

  const addInsight = async (text: string, source: InsightSource) => {
    // Optimistic UI or wait? Let's wait for "analysis" simulation
    const newInsights = await analyzeInput(text, source);
    setInsights(prev => [...newInsights, ...prev]);
    notify('signal', 'insight', 'New insight crystallized from the stream.');
    refreshPatterns();
  };

  const deleteInsight = (id: string) => {
    setInsights(prev => prev.filter(i => i.id !== id));
    if (activeInsight?.id === id) setActiveInsight(null);
  };

  const refreshPatterns = async () => {
    const pats = await detectPatterns(insights);
    setPatterns(pats);
  };

  return (
    <InsightContext.Provider value={{
      insights,
      isLoading,
      addInsight,
      deleteInsight,
      activeInsight,
      setActiveInsight,
      patterns,
      refreshPatterns
    }}>
      {children}
    </InsightContext.Provider>
  );
};

export const useInsight = () => {
  const context = useContext(InsightContext);
  if (!context) throw new Error("useInsight must be used within InsightProvider");
  return context;
};
