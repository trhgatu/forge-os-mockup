
import React from 'react';
import { TRANSLATIONS } from '../lib/translations';
import { Language } from '../types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setLanguage as setReduxLanguage } from '../store/slices/systemSlice';

// --- ADAPTER ---
// This mimics the old Context Provider but acts as a passthrough for Redux.
// Components import { useLanguage } from '../contexts/LanguageContext';
// and it works exactly the same.

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Provider is now a no-op dummy to keep App.tsx structure valid without breaking changes,
  // or we can remove it from App.tsx. 
  // Since we are migrating, we will simply render children.
  return <>{children}</>;
};

export const useLanguage = () => {
  const language = useAppSelector((state) => state.system.language);
  const dispatch = useAppDispatch();

  const setLanguage = (lang: Language) => {
    dispatch(setReduxLanguage(lang));
  };

  const t = (key: string) => {
    // @ts-ignore
    return TRANSLATIONS[language][key] || key;
  };

  return { language, setLanguage, t };
};
