// src/store/slices/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        type: action.payload.type,
        message: action.payload.message,
        autoHide: action.payload.autoHide !== false,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
  },
});

export const { showNotification, removeNotification } = notificationSlice.actions;

export default notificationSlice.reducer;