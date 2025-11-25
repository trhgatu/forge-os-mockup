
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SoundtrackState, Track, AudioSignal, AudioSignalType, AmbienceLayer, MusicSeason } from '../types';
import { getRecentTracks, getNovaMusicWhisper } from '../services/spotifyService';
import { useLanguage } from './LanguageContext';

interface SoundtrackContextType extends SoundtrackState {
  playTrack: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  setVolume: (vol: number) => void;
  emitSignal: (type: AudioSignalType, context?: string) => void;
  closePlayer: () => void;
}

const SoundtrackContext = createContext<SoundtrackContextType | undefined>(undefined);

export const SoundtrackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [state, setState] = useState<SoundtrackState>({
    currentTrack: null,
    isPlaying: false,
    volume: 0.5,
    activeAmbience: [],
    globalSeason: 'Winter',
    novaWhisper: null,
    isPlayerVisible: true
  });

  // Initial load of a track
  useEffect(() => {
    const init = async () => {
        const tracks = await getRecentTracks(1);
        if (tracks.length > 0) {
            setState(prev => ({ ...prev, currentTrack: tracks[0], isPlayerVisible: true }));
        }
    };
    init();
  }, []);

  // Sync Whisper when track changes
  useEffect(() => {
      if (state.currentTrack) {
          const whisper = getNovaMusicWhisper(state.currentTrack.season, language);
          setState(prev => ({ ...prev, novaWhisper: whisper }));
      }
  }, [state.currentTrack, language]);

  const playTrack = (track: Track) => {
    setState(prev => ({ 
        ...prev, 
        currentTrack: track, 
        isPlaying: true, 
        globalSeason: track.season, // Music influences global season
        isPlayerVisible: true // Ensure visible when playing
    }));
  };

  const pause = () => setState(prev => ({ ...prev, isPlaying: false }));
  const resume = () => setState(prev => ({ ...prev, isPlaying: true }));
  const setVolume = (vol: number) => setState(prev => ({ ...prev, volume: vol }));
  
  const closePlayer = () => {
      setState(prev => ({ ...prev, isPlayerVisible: false, isPlaying: false }));
  };

  // The Core Logic: Interpreting Signals from Modules
  const emitSignal = (type: AudioSignalType, context?: string) => {
      console.log(`[Audio Kernel] Signal Received: ${type} | Context: ${context}`);
      
      switch (type) {
          case 'ENTER_FOCUS':
              // Add Focus Ambience, lower music volume slightly (simulated)
              setState(prev => ({ 
                  ...prev, 
                  activeAmbience: [...new Set([...prev.activeAmbience, 'Binaural Beats' as AmbienceLayer])]
              }));
              break;
          case 'ENTER_REFLECTION':
              setState(prev => ({ 
                  ...prev, 
                  activeAmbience: [...new Set([...prev.activeAmbience, 'Rain' as AmbienceLayer])]
              }));
              break;
          case 'ENTER_ENERGY':
              // Clear calm ambience
              setState(prev => ({ 
                  ...prev, 
                  activeAmbience: []
              }));
              break;
          case 'SYSTEM_RESET':
              setState(prev => ({ ...prev, activeAmbience: [] }));
              break;
      }
  };

  return (
    <SoundtrackContext.Provider value={{ ...state, playTrack, pause, resume, setVolume, emitSignal, closePlayer }}>
      {children}
    </SoundtrackContext.Provider>
  );
};

export const useSoundtrack = () => {
  const context = useContext(SoundtrackContext);
  if (!context) throw new Error('useSoundtrack must be used within a SoundtrackProvider');
  return context;
};
