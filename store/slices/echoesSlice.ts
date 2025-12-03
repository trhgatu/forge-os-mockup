
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Echo } from '../../types';
import { fetchEchoes, createEcho } from '../../services/echoService';

interface EchoesState {
  echoes: Echo[];
  activeEchoId: string | null;
  isLoading: boolean;
}

const initialState: EchoesState = {
  echoes: [],
  activeEchoId: null,
  isLoading: false,
};

export const loadEchoes = createAsyncThunk('echoes/load', async () => {
  return await fetchEchoes();
});

export const addEcho = createAsyncThunk('echoes/add', async ({ from, message }: { from: string, message: string }) => {
  return await createEcho(from, message);
});

export const echoesSlice = createSlice({
  name: 'echoes',
  initialState,
  reducers: {
    markViewed: (state, action: PayloadAction<string>) => {
      const echo = state.echoes.find(e => e.id === action.payload);
      if (echo) echo.viewed = true;
    },
    setActiveEchoId: (state, action: PayloadAction<string | null>) => {
      state.activeEchoId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEchoes.pending, (state) => { state.isLoading = true; })
      .addCase(loadEchoes.fulfilled, (state, action) => {
        state.echoes = action.payload;
        state.isLoading = false;
      })
      .addCase(addEcho.fulfilled, (state, action) => {
        state.echoes.unshift(action.payload);
      });
  },
});

export const { markViewed, setActiveEchoId } = echoesSlice.actions;
export default echoesSlice.reducer;
