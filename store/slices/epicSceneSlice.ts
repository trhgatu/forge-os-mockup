
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EpicScene, EpicVaultStats } from '../../types';
import { getScenes, addScene as serviceAddScene, getVaultStats } from '../../services/epicSceneService';

interface EpicSceneState {
  scenes: EpicScene[];
  stats: EpicVaultStats | null;
  isLoading: boolean;
  activeSceneId: string | null;
}

const initialState: EpicSceneState = {
  scenes: [],
  stats: null,
  isLoading: false,
  activeSceneId: null,
};

export const loadVaultData = createAsyncThunk('epicScene/load', async () => {
  const scenes = await getScenes();
  const stats = await getVaultStats(scenes);
  return { scenes, stats };
});

export const addNewScene = createAsyncThunk('epicScene/add', async (data: Partial<EpicScene>) => {
  return await serviceAddScene(data);
});

export const epicSceneSlice = createSlice({
  name: 'epicScene',
  initialState,
  reducers: {
    setActiveSceneId: (state, action: PayloadAction<string | null>) => {
      state.activeSceneId = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const scene = state.scenes.find(s => s.id === action.payload);
      if (scene) scene.isFavorite = !scene.isFavorite;
    },
    deleteScene: (state, action: PayloadAction<string>) => {
      state.scenes = state.scenes.filter(s => s.id !== action.payload);
      if (state.activeSceneId === action.payload) state.activeSceneId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadVaultData.pending, (state) => { state.isLoading = true; })
      .addCase(loadVaultData.fulfilled, (state, action) => {
        state.scenes = action.payload.scenes;
        state.stats = action.payload.stats;
        state.isLoading = false;
      })
      .addCase(addNewScene.fulfilled, (state, action) => {
        state.scenes.unshift(action.payload);
        // Simple mock stat update
        if(state.stats) state.stats.totalScenes += 1;
      });
  }
});

export const { setActiveSceneId, toggleFavorite, deleteScene } = epicSceneSlice.actions;
export default epicSceneSlice.reducer;
