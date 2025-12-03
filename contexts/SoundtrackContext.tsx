
import React, { useEffect } from 'react';
import { Track, AudioSignalType } from '../types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadInitialTrack, playTrack as reduxPlay, setPlaying, setVolume as reduxVolume, closePlayer as reduxClose, setNovaWhisper, processSignal } from '../store/slices/soundtrackSlice';
import { getNovaMusicWhisper } from '../services/spotifyService';
import { useLanguage } from './LanguageContext';

export const SoundtrackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    useEffect(() => { dispatch(loadInitialTrack()); }, [dispatch]);
    return <>{children}</>;
};

export const useSoundtrack = () => {
  const state = useAppSelector((state) => state.soundtrack);
  const dispatch = useAppDispatch();
  const { language } = useLanguage();

  // Effect to sync Nova whisper when track changes
  useEffect(() => {
      if (state.currentTrack) {
          const whisper = getNovaMusicWhisper(state.currentTrack.season, language);
          dispatch(setNovaWhisper(whisper));
      }
  }, [state.currentTrack, language, dispatch]);

  return {
    ...state,
    playTrack: (track: Track) => dispatch(reduxPlay(track)),
    pause: () => dispatch(setPlaying(false)),
    resume: () => dispatch(setPlaying(true)),
    setVolume: (vol: number) => dispatch(reduxVolume(vol)),
    emitSignal: (type: AudioSignalType) => dispatch(processSignal(type)),
    closePlayer: () => dispatch(reduxClose())
  };
};
