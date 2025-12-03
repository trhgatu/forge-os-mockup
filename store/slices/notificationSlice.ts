
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, NotificationType, NotificationSource, Season } from '../../types';

interface NotificationState {
  items: Notification[];
  activeWhispers: Notification[];
  isCenterOpen: boolean;
}

const initialState: NotificationState = {
  items: [],
  activeWhispers: [],
  isCenterOpen: false,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notify: (state, action: PayloadAction<{ type: NotificationType; source: NotificationSource; message: string; title?: string; linkTo?: any; season: Season }>) => {
      const newNotif: Notification = {
        id: Date.now().toString() + Math.random().toString(),
        type: action.payload.type,
        source: action.payload.source,
        title: action.payload.title,
        message: action.payload.message,
        timestamp: new Date(),
        read: false,
        priority: 'medium',
        seasonTint: action.payload.season,
        linkTo: action.payload.linkTo
      };
      state.items.unshift(newNotif);
      if (action.payload.type === 'whisper') {
        state.activeWhispers.push(newNotif);
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.items.find(n => n.id === action.payload);
      if (notif) notif.read = true;
    },
    clearWhispers: (state) => {
      state.activeWhispers = [];
    },
    removeWhisper: (state, action: PayloadAction<string>) => {
        state.activeWhispers = state.activeWhispers.filter(n => n.id !== action.payload);
    },
    toggleCenter: (state) => {
      state.isCenterOpen = !state.isCenterOpen;
    }
  },
});

export const { notify, markAsRead, clearWhispers, removeWhisper, toggleCenter } = notificationSlice.actions;
export default notificationSlice.reducer;
