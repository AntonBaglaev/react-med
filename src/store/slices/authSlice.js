import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TEST_DOCTORS, TEST_PATIENTS } from '../../utils/constants';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { email, password } = credentials;
      const allUsers = [...TEST_DOCTORS, ...TEST_PATIENTS];
      
      const user = allUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return rejectWithValue('Неверные email или пароль');
      }

      return {
        ...user,
        role: TEST_DOCTORS.some(d => d.id === user.id) ? 'doctor' : 'patient'
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const allUsers = [...TEST_DOCTORS, ...TEST_PATIENTS];
      const userExists = allUsers.some(u => u.email === userData.email);
      
      if (userExists) {
        return rejectWithValue('Пользователь с таким email уже существует');
      }

      return {
        ...userData,
        id: `p${Date.now()}`,
        role: 'patient'
      };
    } catch (error) {
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isInitialized: false
  },
  reducers: {
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase('persist/REHYDRATE', (state, action) => {
        if (action.payload?.auth) {
          const { currentUser, isAuthenticated } = action.payload.auth;
          if (currentUser) {
            state.currentUser = currentUser;
            state.isAuthenticated = isAuthenticated;
          }
        }
        state.isInitialized = true;
      });
  }
});

export const { logout, clearError } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsInitialized = (state) => state.auth.isInitialized;

export default authSlice.reducer;