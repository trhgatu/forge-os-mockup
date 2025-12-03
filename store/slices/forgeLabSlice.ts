
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ForgeProject, ForgeFoundation, ResearchTrail } from '../../types';
import { getProjects, getFoundations, getResearchTrails } from '../../services/forgeLabService';

type LabTab = 'dashboard' | 'projects' | 'foundations' | 'research';

interface ForgeLabState {
  activeTab: LabTab;
  projects: ForgeProject[];
  foundations: ForgeFoundation[];
  trails: ResearchTrail[];
  isLoading: boolean;
  activeProjectId: string | null;
  activeFoundationId: string | null;
  activeTrailId: string | null;
}

const initialState: ForgeLabState = {
  activeTab: 'dashboard',
  projects: [],
  foundations: [],
  trails: [],
  isLoading: false,
  activeProjectId: null,
  activeFoundationId: null,
  activeTrailId: null,
};

export const loadLabData = createAsyncThunk('forgeLab/load', async () => {
  const [p, f, t] = await Promise.all([getProjects(), getFoundations(), getResearchTrails()]);
  return { p, f, t };
});

export const forgeLabSlice = createSlice({
  name: 'forgeLab',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<LabTab>) => {
      state.activeTab = action.payload;
    },
    setActiveProjectId: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload;
    },
    setActiveFoundationId: (state, action: PayloadAction<string | null>) => {
      state.activeFoundationId = action.payload;
    },
    setActiveTrailId: (state, action: PayloadAction<string | null>) => {
      state.activeTrailId = action.payload;
    },
    updateProject: (state, action: PayloadAction<{id: string, updates: Partial<ForgeProject>}>) => {
        const { id, updates } = action.payload;
        state.projects = state.projects.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLabData.pending, (state) => { state.isLoading = true; })
      .addCase(loadLabData.fulfilled, (state, action) => {
        state.projects = action.payload.p;
        state.foundations = action.payload.f;
        state.trails = action.payload.t;
        state.isLoading = false;
      });
  },
});

export const { setActiveTab, setActiveProjectId, setActiveFoundationId, setActiveTrailId, updateProject } = forgeLabSlice.actions;
export default forgeLabSlice.reducer;
