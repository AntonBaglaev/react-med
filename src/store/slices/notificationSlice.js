import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  type: null, 
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
    removeNotification: (state) => {  
      state.isVisible = false;
      state.message = null;
      state.type = null;
    }
  }
});

export const { showNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;