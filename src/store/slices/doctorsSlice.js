import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TEST_DOCTORS } from '../../utils/constants';
import { saveToLocalStorage, loadFromLocalStorage } from '../../utils/storage';
import { STORAGE_KEYS } from '../../utils/constants';

// Асинхронная загрузка врачей
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Проверяем наличие данных в localStorage
      const cachedDoctors = loadFromLocalStorage(STORAGE_KEYS.DOCTORS);
      if (cachedDoctors && cachedDoctors.length > 0) {
        return cachedDoctors;
      }

      // 2. Если нет в кеше, используем тестовые данные (в реальном приложении - API запрос)
      saveToLocalStorage(STORAGE_KEYS.DOCTORS, TEST_DOCTORS);
      return TEST_DOCTORS;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронное добавление врача
export const addNewDoctor = createAsyncThunk(
  'doctors/addNewDoctor',
  async (doctorData, { rejectWithValue, getState }) => {
    try {
      // В реальном приложении здесь будет API запрос
      const newDoctor = {
        ...doctorData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      const updatedDoctors = [...getState().doctors.doctors, newDoctor];
      saveToLocalStorage(STORAGE_KEYS.DOCTORS, updatedDoctors);
      
      return newDoctor;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  doctors: [],
  loading: false,
  error: null,
  currentDoctor: null
};

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    // Синхронные редюсеры
    setDoctors: (state, action) => {
      state.doctors = action.payload;
      saveToLocalStorage(STORAGE_KEYS.DOCTORS, action.payload);
    },
    setCurrentDoctor: (state, action) => {
      state.currentDoctor = action.payload;
    },
    clearCurrentDoctor: (state) => {
      state.currentDoctor = null;
    },
    clearDoctorsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchDoctors
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
        state.loading = false;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Обработка addNewDoctor
      .addCase(addNewDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewDoctor.fulfilled, (state, action) => {
        state.doctors.push(action.payload);
        state.loading = false;
      })
      .addCase(addNewDoctor.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

// Экспорт действий
export const { 
  setDoctors, 
  setCurrentDoctor, 
  clearCurrentDoctor,
  clearDoctorsError 
} = doctorsSlice.actions;

// Селекторы
export const selectAllDoctors = (state) => state.doctors.doctors;
export const selectCurrentDoctor = (state) => state.doctors.currentDoctor;
export const selectDoctorsLoading = (state) => state.doctors.loading;
export const selectDoctorsError = (state) => state.doctors.error;
export const selectDoctorById = (doctorId) => (state) => 
  state.doctors.doctors.find(doctor => doctor.id === doctorId);

export default doctorsSlice.reducer;