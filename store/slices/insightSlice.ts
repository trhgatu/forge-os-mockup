
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Insight, InsightSource } from '../../types';
import { fetchInitialInsights, analyzeInput, detectPatterns } from '../../services/insightService';

interface InsightState {
  items: Insight[];
  isLoading: boolean;
  activeInsightId: string | null;
  patterns: { title: string, count: number }[];
}

const initialState: InsightState = {
  items: [],
  isLoading: false,
  activeInsightId: null,
  patterns: [],
};

export const loadInsights = createAsyncThunk('insight/load', async () => {
  const data = await fetchInitialInsights();
  const pats = await detectPatterns(data);
  return { data, pats };
});

export const addInsight = createAsyncThunk('insight/add', async ({ text, source }: { text: string, source: InsightSource }) => {
  const newInsights = await analyzeInput(text, source);
  return newInsights;
});

export const insightSlice = createSlice({
  name: 'insight',
  initialState,
  reducers: {
    deleteInsight: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      if (state.activeInsightId === action.payload) state.activeInsightId = null;
    },
    setActiveInsightId: (state, action: PayloadAction<string | null>) => {
      state.activeInsightId = action.payload;
    },
    updatePatterns: (state, action: PayloadAction<{ title: string, count: number }[]>) => {
        state.patterns = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInsights.pending, (state) => { state.isLoading = true; })
      .addCase(loadInsights.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.patterns = action.payload.pats;
        state.isLoading = false;
      })
      .addCase(addInsight.fulfilled, (state, action) => {
        state.items.unshift(...action.payload);
      });
  },
});

export const { deleteInsight, setActiveInsightId, updatePatterns } = insightSlice.actions;
export default insightSlice.reducer;
