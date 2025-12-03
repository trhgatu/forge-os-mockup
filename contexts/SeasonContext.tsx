
import React from 'react';
import { Season, SeasonTheme } from '../types';
import { Sprout, Sun, Leaf, Snowflake } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSeason as setReduxSeason, cycleSeason as cycleReduxSeason } from '../store/slices/systemSlice';

const SEASON_CONFIG: Record<Season, SeasonTheme> = {
  Spring: {
    id: 'Spring',
    label: 'Awakening',
    primary: 'text-emerald-400',
    accent: 'text-emerald-300',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-900/10',
    gradient: 'from-emerald-900/20 to-teal-900/20',
    particle: 'dust',
    icon: Sprout,
    description: 'A time of gentle opening and new beginnings.'
  },
  Summer: {
    id: 'Summer',
    label: 'Drive',
    primary: 'text-amber-400',
    accent: 'text-yellow-300',
    border: 'border-amber-500/20',
    bg: 'bg-amber-900/10',
    gradient: 'from-amber-900/20 to-orange-900/20',
    particle: 'shimmer',
    icon: Sun,
    description: 'High energy, focus, and intensity.'
  },
  Autumn: {
    id: 'Autumn',
    label: 'Depth',
    primary: 'text-orange-400',
    accent: 'text-rose-300',
    border: 'border-orange-500/20',
    bg: 'bg-orange-900/10',
    gradient: 'from-orange-900/20 to-rose-900/20',
    particle: 'leaves',
    icon: Leaf,
    description: 'Introspection, maturity, and release.'
  },
  Winter: {
    id: 'Winter',
    label: 'Stillness',
    primary: 'text-indigo-300',
    accent: 'text-slate-200',
    border: 'border-indigo-500/20',
    bg: 'bg-slate-900/10',
    gradient: 'from-slate-900/20 to-indigo-900/20',
    particle: 'snow',
    icon: Snowflake,
    description: 'Silence, crystallization, and deep rest.'
  }
};

export const SeasonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const useSeason = () => {
  const season = useAppSelector((state) => state.system.season);
  const dispatch = useAppDispatch();

  const setSeason = (s: Season) => dispatch(setReduxSeason(s));
  const cycleSeason = () => dispatch(cycleReduxSeason());

  return { 
    season, 
    setSeason, 
    theme: SEASON_CONFIG[season],
    cycleSeason
  };
};
