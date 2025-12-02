
import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, ArrowRight, CornerDownLeft, Globe, Zap, Sparkles } from 'lucide-react';
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
    <div ref={containerRef} className="w-full max-w-3xl mx-auto flex flex-col relative z-50">
      
      {/* Search Bar Container */}
      <div className="relative group z-50">
        {/* Glow Effect */}
        <div className={cn(
          "absolute -inset-0.5 bg-gradient-to-r from-forge-cyan via-purple-500 to-forge-accent rounded-2xl opacity-20 blur-md transition-all duration-500 group-hover:opacity-40 group-hover:blur-lg",
          isFocused ? "opacity-60 blur-xl" : ""
        )} />
        
        <div className={cn(
          "relative bg-[#050508] border transition-all duration-300 rounded-2xl flex items-center p-2 shadow-2xl",
          isFocused ? "border-forge-cyan/40 bg-[#09090b]" : "border-white/10"
        )}>
          <div className="pl-4 pr-4 text-gray-500">
            {isLoading ? <Loader2 className="animate-spin text-forge-cyan" size={24} /> : <Search size={24} className={cn("transition-colors", isFocused ? "text-forge-cyan" : "text-gray-500")} />}
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={language === 'vi' ? "Truy cập Mạng lưới Tri thức..." : "Access Global Knowledge Grid..."}
            className="flex-1 bg-transparent border-none text-white text-xl placeholder-gray-600 focus:outline-none focus:ring-0 font-display font-light tracking-wide py-4"
            autoComplete="off"
          />
          
          {query && (
            <div className="pr-4 hidden md:flex items-center gap-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest animate-in fade-in">
              <span className="bg-white/5 px-3 py-1.5 rounded border border-white/5 flex items-center gap-2">
                <Sparkles size={10} className="text-forge-accent" />
                Live Query
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-2 right-2 mt-4 bg-[#09090b]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in slide-in-from-top-4 fade-in duration-300 z-40 max-h-[60vh] overflow-y-auto scrollbar-hide">
          
          {isLoading && searchResults.length === 0 && (
             <div className="p-8 text-center text-sm text-gray-500 font-mono flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-forge-cyan rounded-full animate-ping" />
                <span className="animate-pulse">Synthesizing Results...</span>
             </div>
          )}

          {searchResults.map((result, index) => (
            <div
              key={result.id}
              onClick={() => handleSelect(result)}
              className="group flex items-start gap-5 p-5 border-b border-white/5 last:border-0 hover:bg-white/[0.03] cursor-pointer transition-all hover:pl-6"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mt-1 p-3 rounded-xl bg-white/5 text-gray-400 group-hover:text-forge-cyan group-hover:bg-forge-cyan/10 transition-colors shadow-inner">
                <Globe size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-medium group-hover:text-forge-cyan transition-colors font-display text-lg">
                      {result.title}
                    </h3>
                    {result.language && (
                      <span className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider opacity-60",
                        result.language === 'vi' 
                          ? "bg-red-500/10 text-red-200 border-red-500/20" 
                          : "bg-blue-500/10 text-blue-200 border-blue-500/20"
                      )}>
                        {result.language}
                      </span>
                    )}
                  </div>
                  <CornerDownLeft className="text-gray-600 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" size={14} />
                </div>
                <p className="text-sm text-gray-500 line-clamp-1 font-light group-hover:text-gray-400 transition-colors">
                  {result.extract || "..."}
                </p>
              </div>
            </div>
          ))}
          
          {searchResults.length > 0 && (
            <div className="bg-[#050508]/80 p-3 flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest font-mono sticky bottom-0 backdrop-blur-md border-t border-white/5">
              <span>{searchResults.length} Concepts Found</span>
              <span className="flex items-center gap-2">Press <kbd className="bg-white/10 px-1 rounded text-gray-400">Enter</kbd> to Select</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
