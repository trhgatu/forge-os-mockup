
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ThoughtFragment, ThoughtStats } from '../../types';
import { fetchInitialFragments, createFragment } from '../../services/thoughtStreamService';

interface ThoughtStreamState {
  fragments: ThoughtFragment[];
  isLoading: boolean;
  activeFragmentId: string | null;
}

const initialState: ThoughtStreamState = {
  fragments: [],
  isLoading: false,
  activeFragmentId: null,
};

export const loadFragments = createAsyncThunk('thoughtStream/load', async () => {
  return await fetchInitialFragments();
});

export const addFragment = createAsyncThunk('thoughtStream/add', async (text: string) => {
  return await createFragment(text);
});

export const thoughtStreamSlice = createSlice({
  name: 'thoughtStream',
  initialState,
  reducers: {
    removeFragment: (state, action: PayloadAction<string>) => {
      state.fragments = state.fragments.filter(f => f.id !== action.payload);
      if (state.activeFragmentId === action.payload) state.activeFragmentId = null;
    },
    setActiveFragmentId: (state, action: PayloadAction<string | null>) => {
      state.activeFragmentId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFragments.pending, (state) => { state.isLoading = true; })
      .addCase(loadFragments.fulfilled, (state, action) => {
        state.fragments = action.payload;
        state.isLoading = false;
      })
      .addCase(addFragment.fulfilled, (state, action) => {
        state.fragments.unshift(action.payload);
      });
  },
});

export const { removeFragment, setActiveFragmentId } = thoughtStreamSlice.actions;
export default thoughtStreamSlice.reducer;
