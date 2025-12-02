
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ForgeProject, ForgeFoundation, ResearchTrail } from '../types';
import { getProjects, getFoundations, getResearchTrails } from '../services/forgeLabService';

type LabTab = 'dashboard' | 'projects' | 'foundations' | 'research';

interface ForgeLabContextType {
  activeTab: LabTab;
  setActiveTab: (tab: LabTab) => void;
  projects: ForgeProject[];
  foundations: ForgeFoundation[];
  trails: ResearchTrail[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  
  activeProject: ForgeProject | null;
  setActiveProject: (p: ForgeProject | null) => void;
  updateProject: (id: string, updates: Partial<ForgeProject>) => void;
  
  activeFoundation: ForgeFoundation | null;
  setActiveFoundation: (f: ForgeFoundation | null) => void;

  activeTrail: ResearchTrail | null;
  setActiveTrail: (t: ResearchTrail | null) => void;
}

const ForgeLabContext = createContext<ForgeLabContextType | undefined>(undefined);

export const ForgeLabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<LabTab>('dashboard');
  const [projects, setProjects] = useState<ForgeProject[]>([]);
  const [foundations, setFoundations] = useState<ForgeFoundation[]>([]);
  const [trails, setTrails] = useState<ResearchTrail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Detail States
  const [activeProject, setActiveProject] = useState<ForgeProject | null>(null);
  const [activeFoundation, setActiveFoundation] = useState<ForgeFoundation | null>(null);
  const [activeTrail, setActiveTrail] = useState<ResearchTrail | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    const [p, f, t] = await Promise.all([
      getProjects(),
      getFoundations(),
      getResearchTrails()
    ]);
    setProjects(p);
    setFoundations(f);
    setTrails(t);
    setIsLoading(false);
  };

  const updateProject = (id: string, updates: Partial<ForgeProject>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p));
    if (activeProject && activeProject.id === id) {
      setActiveProject(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <ForgeLabContext.Provider value={{
      activeTab,
      setActiveTab,
      projects,
      foundations,
      trails,
      isLoading,
      refreshData,
      activeProject,
      setActiveProject,
      updateProject,
      activeFoundation,
      setActiveFoundation,
      activeTrail,
      setActiveTrail
    }}>
      {children}
    </ForgeLabContext.Provider>
  );
};

export const useForgeLab = () => {
  const context = useContext(ForgeLabContext);
  if (!context) throw new Error("useForgeLab must be used within ForgeLabProvider");
  return context;
};
