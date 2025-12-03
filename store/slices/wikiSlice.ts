
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WikiConcept } from '../../types';
import { searchWikipedia, getConceptDetails } from '../../services/wikiService';

interface WikiState {
  searchResults: WikiConcept[];
  activeConcept: WikiConcept | null;
  history: WikiConcept[];
  isLoading: boolean;
}

const initialState: WikiState = {
  searchResults: [],
  activeConcept: null,
  history: [],
  isLoading: false,
};

export const searchWiki = createAsyncThunk('wiki/search', async ({ query, lang }: { query: string, lang: string }) => {
  return await searchWikipedia(query, lang);
});

export const selectConcept = createAsyncThunk('wiki/select', async ({ concept, systemLang }: { concept: WikiConcept, systemLang: string }) => {
  const lang = concept.language || systemLang;
  const fullConcept = await getConceptDetails(concept.title, lang);
  if (fullConcept) fullConcept.language = lang;
  return fullConcept;
});

export const wikiSlice = createSlice({
  name: 'wiki',
  initialState,
  reducers: {
    clearActive: (state) => { state.activeConcept = null; },
    clearHistory: (state) => { state.history = []; },
    clearResults: (state) => { state.searchResults = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchWiki.pending, (state) => { state.isLoading = true; })
      .addCase(searchWiki.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.isLoading = false;
      })
      .addCase(selectConcept.pending, (state) => { state.isLoading = true; })
      .addCase(selectConcept.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeConcept = action.payload;
          state.searchResults = [];
          // Avoid duplicates in history
          const exists = state.history.some(h => h.title === action.payload?.title);
          if (!exists) {
             state.history.unshift(action.payload);
             if(state.history.length > 10) state.history.pop();
          }
        }
        state.isLoading = false;
      });
  },
});

export const { clearActive, clearHistory, clearResults } = wikiSlice.actions;
export default wikiSlice.reducer;
