
import React, { useEffect } from 'react';
import { ForgeProject, ForgeFoundation, ResearchTrail } from '../types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadLabData, setActiveTab, setActiveProjectId, setActiveFoundationId, setActiveTrailId, updateProject as reduxUpdate } from '../store/slices/forgeLabSlice';

type LabTab = 'dashboard' | 'projects' | 'foundations' | 'research';

export const ForgeLabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    useEffect(() => { dispatch(loadLabData()); }, [dispatch]);
    return <>{children}</>;
};

export const useForgeLab = () => {
  const { activeTab, projects, foundations, trails, isLoading, activeProjectId, activeFoundationId, activeTrailId } = useAppSelector((state) => state.forgeLab);
  const dispatch = useAppDispatch();

  const activeProject = projects.find(p => p.id === activeProjectId) || null;
  const activeFoundation = foundations.find(f => f.id === activeFoundationId) || null;
  const activeTrail = trails.find(t => t.id === activeTrailId) || null;

  return {
    activeTab,
    setActiveTab: (tab: LabTab) => dispatch(setActiveTab(tab)),
    projects,
    foundations,
    trails,
    isLoading,
    refreshData: async () => { await dispatch(loadLabData()); },
    activeProject,
    setActiveProject: (p: ForgeProject | null) => dispatch(setActiveProjectId(p ? p.id : null)),
    updateProject: (id: string, updates: Partial<ForgeProject>) => dispatch(reduxUpdate({ id, updates })),
    activeFoundation,
    setActiveFoundation: (f: ForgeFoundation | null) => dispatch(setActiveFoundationId(f ? f.id : null)),
    activeTrail,
    setActiveTrail: (t: ResearchTrail | null) => dispatch(setActiveTrailId(t ? t.id : null))
  };
};
