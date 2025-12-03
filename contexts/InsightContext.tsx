
import React, { useEffect } from 'react';
import { InsightSource } from '../types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadInsights, addInsight as reduxAddInsight, deleteInsight as reduxDelete, setActiveInsightId, updatePatterns } from '../store/slices/insightSlice';
import { detectPatterns } from '../services/insightService';

export const InsightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadInsights());
    }, [dispatch]);
    return <>{children}</>;
};

export const useInsight = () => {
  const { items, isLoading, activeInsightId, patterns } = useAppSelector((state) => state.insight);
  const dispatch = useAppDispatch();

  const activeInsight = items.find(i => i.id === activeInsightId) || null;

  const addInsight = async (text: string, source: InsightSource) => {
    await dispatch(reduxAddInsight({ text, source }));
  };

  const deleteInsight = (id: string) => {
    dispatch(reduxDelete(id));
  };

  const setActiveInsight = (insight: any | null) => {
      dispatch(setActiveInsightId(insight ? insight.id : null));
  };

  const refreshPatterns = async () => {
      // In a real app, this logic might be in a middleware or thunk
      const pats = await detectPatterns(items);
      dispatch(updatePatterns(pats));
  };

  return {
    insights: items,
    isLoading,
    addInsight,
    deleteInsight,
    activeInsight,
    setActiveInsight,
    patterns,
    refreshPatterns
  };
};
