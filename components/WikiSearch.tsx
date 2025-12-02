
import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, ArrowRight, CornerDownLeft, Globe, Zap } from 'lucide-react';
import { useWiki } from '../contexts/WikiContext';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { WikiConcept } from '../types';

export const WikiSearch: React.FC = () => {
  const { search, searchResults, selectConcept, isLoading, clearResults } = useWiki();
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search
  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      search(debouncedQuery);
    } else {
      clearResults();
    }
  }, [debouncedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (concept: WikiConcept) => {
    selectConcept(concept);
    setQuery('');
    setDebouncedQuery('');
    setIsFocused(false);
  };

  const showDropdown = isFocused && (searchResults.length > 0 || isLoading);

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto p-4 flex flex-col relative z-50">
      
      {/* Search Bar */}
      <div className="relative group z-50">
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-forge-cyan/20 to-forge-accent/20 rounded-2xl blur-lg transition-opacity duration-700",
          isFocused ? "opacity-100" : "opacity-0"
        )} />
        
        <div className={cn(
          "relative bg-[#09090b] border transition-all duration-300 rounded-2xl flex items-center p-1 shadow-2xl",
          isFocused ? "border-forge-cyan/50 shadow-[0_0_30px_rgba(34,211,238,0.15)]" : "border-white/10"
        )}>
          <div className="pl-4 pr-3 text-gray-500">
            {isLoading ? <Loader2 className="animate-spin text-forge-cyan" size={20} /> : <Search size={20} />}
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={language === 'vi' ? "Tìm kiếm tri thức toàn cầu..." : "Search global knowledge..."}
            className="flex-1 bg-transparent border-none text-white text-lg placeholder-gray-600 focus:outline-none focus:ring-0 font-display tracking-wide py-3"
            autoComplete="off"
          />
          
          {query && (
            <div className="pr-4 hidden md:flex items-center gap-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest animate-in fade-in">
              <span className="bg-white/5 px-2 py-1 rounded border border-white/5">Unified Search</span>
            </div>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-[#09090b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 z-40 max-h-[60vh] overflow-y-auto scrollbar-hide">
          
          {isLoading && searchResults.length === 0 && (
             <div className="p-4 text-center text-sm text-gray-500 font-mono flex items-center justify-center gap-2">
                <Zap size={12} className="animate-pulse" /> Scanning Knowledge Graph...
             </div>
          )}

          {searchResults.map((result) => (
            <div
              key={result.id}
              onClick={() => handleSelect(result)}
              className="group flex items-start gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.05] cursor-pointer transition-colors"
            >
              <div className="mt-1 p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-forge-cyan group-hover:bg-forge-cyan/10 transition-colors">
                <Globe size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium group-hover:text-forge-cyan transition-colors font-display text-base">
                      {result.title}
                    </h3>
                    {result.language && (
                      <span className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider",
                        result.language === 'vi' 
                          ? "bg-red-500/10 text-red-400 border-red-500/20" 
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      )}>
                        {result.language}
                      </span>
                    )}
                  </div>
                  <CornerDownLeft className="text-gray-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" size={12} />
                </div>
                <p className="text-sm text-gray-500 line-clamp-1 font-light group-hover:text-gray-400 transition-colors">
                  {result.extract || "..."}
                </p>
              </div>
            </div>
          ))}
          
          {searchResults.length > 0 && (
            <div className="bg-black/40 p-2 text-center text-[10px] text-gray-600 uppercase tracking-widest font-mono sticky bottom-0 backdrop-blur-sm">
              Press Enter to Select
            </div>
          )}
        </div>
      )}
    </div>
  );
};
