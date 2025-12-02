
import React, { createContext, useContext, ReactNode } from 'react';
import { View } from '../types';

interface NavigationContextType {
  currentView: View;
  navigateTo: (view: View) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ 
  currentView: View; 
  onNavigate: (view: View) => void;
  children: ReactNode 
}> = ({ currentView, onNavigate, children }) => {
  
  const navigateTo = (view: View) => {
    onNavigate(view);
  };

  return (
    <NavigationContext.Provider value={{ currentView, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used within NavigationProvider");
  return context;
};
