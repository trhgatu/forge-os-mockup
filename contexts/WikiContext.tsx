
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WikiConcept } from '../types';
import { searchWikipedia, getConceptDetails } from '../services/wikiService';
import { useLanguage } from './LanguageContext';

interface WikiContextType {
  searchResults: WikiConcept[];
  activeConcept: WikiConcept | null;
  history: WikiConcept[];
  isLoading: boolean;
  search: (query: string) => Promise<void>;
  selectConcept: (concept: WikiConcept) => Promise<void>;
  clearActive: () => void;
  clearHistory: () => void;
  clearResults: () => void;
}

const WikiContext = createContext<WikiContextType | undefined>(undefined);

export const WikiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<WikiConcept[]>([]);
  const [activeConcept, setActiveConcept] = useState<WikiConcept | null>(null);
  const [history, setHistory] = useState<WikiConcept[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  const search = async (query: string) => {
    setIsLoading(true);
    const results = await searchWikipedia(query, language);
    setSearchResults(results);
    setIsLoading(false);
  };

  const selectConcept = async (concept: WikiConcept) => {
    setIsLoading(true);
    // Use the concept's specific language, fallback to system language if missing
    const lang = concept.language || language; 
    const fullConcept = await getConceptDetails(concept.title, lang);
    
    if (fullConcept) {
      // Ensure language tag is preserved
      fullConcept.language = lang; 
      setActiveConcept(fullConcept);
      setHistory(prev => {
        if (prev.some(h => h.title === concept.title && h.language === lang)) return prev;
        return [fullConcept, ...prev].slice(0, 10); // Keep last 10
      });
      // Clear results after selection for cleaner UI
      setSearchResults([]);
    }
    setIsLoading(false);
  };

  const clearActive = () => setActiveConcept(null);
  const clearHistory = () => setHistory([]);
  const clearResults = () => setSearchResults([]);

  return (
    <WikiContext.Provider value={{ 
      searchResults, 
      activeConcept, 
      history, 
      isLoading, 
      search, 
      selectConcept, 
      clearActive,
      clearHistory,
      clearResults
    }}>
      {children}
    </WikiContext.Provider>
  );
};

export const useWiki = () => {
  const context = useContext(WikiContext);
  if (!context) throw new Error("useWiki must be used within WikiProvider");
  return context;
};
