
import React from 'react';
import { View } from '../types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCurrentView } from '../store/slices/systemSlice';

export const NavigationProvider: React.FC<{ 
  currentView?: View; 
  onNavigate?: (view: View) => void;
  children: React.ReactNode 
}> = ({ children }) => <>{children}</>;

export const useNavigation = () => {
  const currentView = useAppSelector((state) => state.system.currentView);
  const dispatch = useAppDispatch();

  const navigateTo = (view: View) => {
    dispatch(setCurrentView(view));
  };

  return { currentView, navigateTo };
};
