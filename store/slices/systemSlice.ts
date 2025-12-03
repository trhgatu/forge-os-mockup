
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { View, Language, Season } from '../../types';

interface SystemState {
  language: Language;
  theme: 'dark' | 'light';
  currentView: View;
  soundEnabled: boolean;
  season: Season;
}

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('forge-theme') as 'dark' | 'light') || 'dark';
  }
  return 'dark';
};

const initialState: SystemState = {
  language: 'en',
  theme: getInitialTheme(),
  currentView: View.DASHBOARD,
  soundEnabled: true,
  season: 'Winter',
};

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('forge-theme', state.theme);
      // Side effect for DOM update handled in adapter/component or middleware
      if (state.theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    },
    setCurrentView: (state, action: PayloadAction<View>) => {
      state.currentView = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    setSeason: (state, action: PayloadAction<Season>) => {
      state.season = action.payload;
    },
    cycleSeason: (state) => {
      const order: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
      const currentIndex = order.indexOf(state.season);
      state.season = order[(currentIndex + 1) % 4];
    },
  },
});

export const { setLanguage, toggleTheme, setCurrentView, toggleSound, setSeason, cycleSeason } = systemSlice.actions;
export default systemSlice.reducer;
