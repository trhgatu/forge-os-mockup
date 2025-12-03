
import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleTheme as toggleReduxTheme } from '../store/slices/systemSlice';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const useTheme = () => {
  const theme = useAppSelector((state) => state.system.theme);
  const dispatch = useAppDispatch();

  const toggleTheme = () => {
    dispatch(toggleReduxTheme());
  };

  return { theme, toggleTheme };
};
