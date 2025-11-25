
import React, { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';

type SoundType = 'click' | 'hover' | 'success' | 'error' | 'on' | 'off';

interface SoundContextType {
  playSound: (type: SoundType) => void;
  isEnabled: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext lazily
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    if (AudioContextClass) {
      audioCtxRef.current = new AudioContextClass();
    }
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  const playTone = (
    freq: number, 
    type: OscillatorType, 
    duration: number, 
    vol: number, 
    rampTo?: number
  ) => {
    if (!audioCtxRef.current || !isEnabled) return;
    
    const ctx = audioCtxRef.current;
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

  const playSound = (type: SoundType) => {
    if (!isEnabled) return;

    switch (type) {
      case 'click':
        // Glassy Tap
        playTone(800, 'sine', 0.1, 0.1, 300);
        break;
      case 'hover':
        // Subtle Tick
        playTone(2000, 'sine', 0.03, 0.02);
        break;
      case 'success':
        // Major Chord Swell
        playTone(440, 'sine', 1.5, 0.1); // A4
        setTimeout(() => playTone(554.37, 'sine', 1.5, 0.1), 50); // C#5
        setTimeout(() => playTone(659.25, 'sine', 1.5, 0.1), 100); // E5
        break;
      case 'on':
        playTone(400, 'sine', 0.15, 0.1, 600);
        break;
      case 'off':
        playTone(600, 'sine', 0.15, 0.1, 300);
        break;
      case 'error':
        playTone(150, 'sawtooth', 0.3, 0.1, 100);
        break;
    }
  };

  const toggleSound = () => {
      if (!isEnabled) {
          // Play 'on' sound right before enabling state to ensure user hears it
          const ctx = audioCtxRef.current;
          if (ctx && ctx.state === 'suspended') ctx.resume();
          // We can't use playSound here because isEnabled is still false in this scope
          // but the user expects feedback. 
          // So we manually trigger a sound or just rely on the state change.
      }
      setIsEnabled(prev => !prev);
      // If turning on, play a sound
      if (!isEnabled) setTimeout(() => playSound('on'), 50);
  };

  return (
    <SoundContext.Provider value={{ playSound, isEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within a SoundProvider');
  return context;
};
