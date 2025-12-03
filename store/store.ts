
import { configureStore } from '@reduxjs/toolkit';
import systemReducer from './slices/systemSlice';
import notificationReducer from './slices/notificationSlice';
import insightReducer from './slices/insightSlice';
import thoughtStreamReducer from './slices/thoughtStreamSlice';
import wikiReducer from './slices/wikiSlice';
import echoesReducer from './slices/echoesSlice';
import forgeLabReducer from './slices/forgeLabSlice';
import soundtrackReducer from './slices/soundtrackSlice';
import epicSceneReducer from './slices/epicSceneSlice';

export const store = configureStore({
  reducer: {
    system: systemReducer,
    notifications: notificationReducer,
    insight: insightReducer,
    thoughtStream: thoughtStreamReducer,
    wiki: wikiReducer,
    echoes: echoesReducer,
    forgeLab: forgeLabReducer,
    soundtrack: soundtrackReducer,
    epicScene: epicSceneReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false, // For Date objects and complex types
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
