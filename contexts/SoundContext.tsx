
import React, { useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleSound as toggleReduxSound } from '../store/slices/systemSlice';

type SoundType = 'click' | 'hover' | 'success' | 'error' | 'on' | 'off';

// Singleton Audio Context outside React lifecycle
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
    if (!audioCtx) {
        const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    return audioCtx;
};

const playTone = (freq: number, type: OscillatorType, duration: number, vol: number, rampTo?: number) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (rampTo) {
        osc.frequency.exponentialRampToValueAtTime(rampTo, ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const useSound = () => {
  const isEnabled = useAppSelector((state) => state.system.soundEnabled);
  const dispatch = useAppDispatch();

  const playSound = (type: SoundType) => {
    if (!isEnabled) return;

    switch (type) {
      case 'click': playTone(800, 'sine', 0.1, 0.1, 300); break;
      case 'hover': playTone(2000, 'sine', 0.03, 0.02); break;
      case 'success':
        playTone(440, 'sine', 1.5, 0.1); 
        setTimeout(() => playTone(554.37, 'sine', 1.5, 0.1), 50); 
        setTimeout(() => playTone(659.25, 'sine', 1.5, 0.1), 100); 
        break;
      case 'on': playTone(400, 'sine', 0.15, 0.1, 600); break;
      case 'off': playTone(600, 'sine', 0.15, 0.1, 300); break;
      case 'error': playTone(150, 'sawtooth', 0.3, 0.1, 100); break;
    }
  };

  const toggleSound = () => {
      dispatch(toggleReduxSound());
      if (!isEnabled) setTimeout(() => playSound('on'), 50);
  };

  return { playSound, isEnabled, toggleSound };
};
