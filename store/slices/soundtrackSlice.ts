
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Track, SoundtrackState, AmbienceLayer, AudioSignalType } from '../../types';
import { getRecentTracks, getNovaMusicWhisper } from '../../services/spotifyService';

// Extends SoundtrackState but removes imperative methods
interface ReduxSoundtrackState extends SoundtrackState {
}

const initialState: ReduxSoundtrackState = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  activeAmbience: [],
  globalSeason: 'Winter',
  novaWhisper: null,
  isPlayerVisible: true
};

export const loadInitialTrack = createAsyncThunk('soundtrack/init', async () => {
    const tracks = await getRecentTracks(1);
    return tracks.length > 0 ? tracks[0] : null;
});

export const soundtrackSlice = createSlice({
  name: 'soundtrack',
  initialState,
  reducers: {
    playTrack: (state, action: PayloadAction<Track>) => {
        state.currentTrack = action.payload;
        state.isPlaying = true;
        state.globalSeason = action.payload.season;
        state.isPlayerVisible = true;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
        state.isPlaying = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
        state.volume = action.payload;
    },
    closePlayer: (state) => {
        state.isPlayerVisible = false;
        state.isPlaying = false;
    },
    setNovaWhisper: (state, action: PayloadAction<string | null>) => {
        state.novaWhisper = action.payload;
    },
    processSignal: (state, action: PayloadAction<AudioSignalType>) => {
        switch (action.payload) {
            case 'ENTER_FOCUS':
                if(!state.activeAmbience.includes('Binaural Beats')) state.activeAmbience.push('Binaural Beats');
                break;
            case 'ENTER_REFLECTION':
                if(!state.activeAmbience.includes('Rain')) state.activeAmbience.push('Rain');
                break;
            case 'ENTER_ENERGY':
                state.activeAmbience = [];
                break;
            case 'SYSTEM_RESET':
                state.activeAmbience = [];
                break;
        }
    }
  },
  extraReducers: (builder) => {
      builder.addCase(loadInitialTrack.fulfilled, (state, action) => {
          if (action.payload) {
              state.currentTrack = action.payload;
              state.isPlayerVisible = true;
          }
      });
  }
});

export const { playTrack, setPlaying, setVolume, closePlayer, setNovaWhisper, processSignal } = soundtrackSlice.actions;
export default soundtrackSlice.reducer;
