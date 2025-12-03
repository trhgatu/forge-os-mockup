
import React, { useEffect } from 'react';
import { ThoughtStats } from '../types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadFragments, addFragment as reduxAdd, removeFragment as reduxRemove, setActiveFragmentId } from '../store/slices/thoughtStreamSlice';
import { useNotification } from './NotificationContext';

export const ThoughtStreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    useEffect(() => { dispatch(loadFragments()); }, [dispatch]);
    return <>{children}</>;
};

export const useThoughtStream = () => {
  const { fragments, isLoading, activeFragmentId } = useAppSelector((state) => state.thoughtStream);
  const dispatch = useAppDispatch();
  const { notify } = useNotification();

  const activeFragment = fragments.find(f => f.id === activeFragmentId) || null;

  const addFragment = async (text: string) => {
    const result = await dispatch(reduxAdd(text));
    if (result.payload && (result.payload as any).type === 'stream') {
        notify('signal', 'thoughtstream', 'Deep thought captured in the stream.');
    }
  };

  const removeFragment = (id: string) => dispatch(reduxRemove(id));
  const setActiveFragment = (f: any | null) => dispatch(setActiveFragmentId(f ? f.id : null));

  // Derived state
  const stats: ThoughtStats = {
    totalCount: fragments.length,
    avgDepth: Math.round(fragments.reduce((acc, f) => acc + f.metadata.depth, 0) / (fragments.length || 1)),
    dominantType: fragments.filter(f => f.type === 'spark').length > fragments.length / 2 ? 'spark' : 'fragment',
    flowState: fragments.length > 10 ? 'rushing' : fragments.length > 5 ? 'flowing' : 'drifting'
  };

  return {
    fragments,
    isLoading,
    addFragment,
    removeFragment,
    activeFragment,
    setActiveFragment,
    stats
  };
};
