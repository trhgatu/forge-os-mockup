
import React from 'react';
import { WikiConcept } from '../types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { searchWiki, selectConcept as reduxSelect, clearActive as reduxClearActive, clearHistory as reduxClearHistory, clearResults as reduxClearResults } from '../store/slices/wikiSlice';
import { useLanguage } from './LanguageContext';

export const WikiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const useWiki = () => {
  const { searchResults, activeConcept, history, isLoading } = useAppSelector((state) => state.wiki);
  const dispatch = useAppDispatch();
  const { language } = useLanguage();

  const search = async (query: string) => {
    await dispatch(searchWiki({ query, lang: language }));
  };

  const selectConcept = async (concept: WikiConcept) => {
    await dispatch(reduxSelect({ concept, systemLang: language }));
  };

  return { 
    searchResults, 
    activeConcept, 
    history, 
    isLoading, 
    search, 
    selectConcept, 
    clearActive: () => dispatch(reduxClearActive()),
    clearHistory: () => dispatch(reduxClearHistory()),
    clearResults: () => dispatch(reduxClearResults())
  };
};
