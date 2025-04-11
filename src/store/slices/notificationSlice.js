import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  type: null, // 'success', 'error', 'info'
  isVisible: false
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.isVisible = true;
    },
    removeNotification: (state) => {  // Изменили hideNotification на removeNotification
      state.isVisible = false;
      state.message = null;
      state.type = null;
    }
  }
});

export const { showNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;