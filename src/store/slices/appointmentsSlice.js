import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';
import { saveToLocalStorage, loadFromLocalStorage } from '../../utils/storage';

// Вспомогательная функция для загрузки и дедупликации записей
const loadInitialAppointments = () => {
  try {
    const loaded = loadFromLocalStorage(STORAGE_KEYS.APPOINTMENTS);
    if (!loaded || !Array.isArray(loaded)) return [];

    // Дедупликация по ID, дате и времени
    return loaded.reduce((unique, item) => {
      const exists = unique.some(app => 
        app.id === item.id || 
        (app.doctorId === item.doctorId &&
         app.date === item.date &&
         app.time === item.time)
      );
      return exists ? unique : [...unique, item];
    }, []);
  } catch (error) {
    console.error('Failed to load appointments:', error);
    return [];
  }
};

const initialState = {
  appointments: loadInitialAppointments(),
  status: 'idle',
  error: null,
  lastUpdated: null
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    addAppointment: {
      reducer(state, action) {
        try {
          const { payload } = action;
          
          // Проверка обязательных полей
          if (!payload.doctorId || !payload.patientId || !payload.date || !payload.time) {
            throw new Error('Недостаточно данных для записи');
          }

          // Проверка на дубликат
          const isDuplicate = state.appointments.some(app => 
            app.id === payload.id ||
            (app.doctorId === payload.doctorId &&
             app.date === payload.date &&
             app.time === payload.time)
          );

          if (isDuplicate) {
            state.error = 'Запись на это время уже существует';
            return;
          }

          state.appointments.push(payload);
          state.lastUpdated = new Date().toISOString();
          state.error = null;
          
          // Сохраняем в localStorage
          saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, state.appointments);
        } catch (error) {
          state.error = error.message;
          console.error('Appointment save error:', error);
        }
      },
      prepare(payload) {
        // Генерация уникального ID с префиксом и временной меткой
        const id = `app_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        return {
          payload: {
            ...payload,
            id,
            createdAt: new Date().toISOString(),
            status: 'scheduled',
            updatedAt: new Date().toISOString()
          }
        };
      }
    },
    cancelAppointment: (state, action) => {
      const appointment = state.appointments.find(app => app.id === action.payload);
      if (appointment) {
        appointment.status = 'cancelled';
        appointment.updatedAt = new Date().toISOString();
        state.lastUpdated = new Date().toISOString();
        saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, state.appointments);
      }
    },
    completeAppointment: (state, action) => {
      const { id, diagnosis, prescription } = action.payload;
      const appointment = state.appointments.find(app => app.id === id);
      if (appointment) {
        appointment.status = 'completed';
        appointment.diagnosis = diagnosis;
        appointment.prescription = prescription;
        appointment.updatedAt = new Date().toISOString();
        state.lastUpdated = new Date().toISOString();
        saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, state.appointments);
      }
    },
    clearAppointments: (state) => {
      state.appointments = [];
      state.lastUpdated = new Date().toISOString();
      saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, []);
    },
    removeDuplicates: (state) => {
      const uniqueApps = state.appointments.reduce((unique, item) => {
        const exists = unique.some(app => 
          app.id === item.id || 
          (app.doctorId === item.doctorId &&
           app.date === item.date &&
           app.time === item.time)
        );
        return exists ? unique : [...unique, item];
      }, []);

      if (uniqueApps.length !== state.appointments.length) {
        state.appointments = uniqueApps;
        state.lastUpdated = new Date().toISOString();
        saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, uniqueApps);
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase('persist/REHYDRATE', (state, action) => {
      if (action.payload?.appointments) {
        // Дедупликация при восстановлении состояния
        const uniqueApps = action.payload.appointments.appointments.reduce((unique, item) => {
          const exists = unique.some(app => 
            app.id === item.id || 
            (app.doctorId === item.doctorId &&
             app.date === item.date &&
             app.time === item.time)
          );
          return exists ? unique : [...unique, item];
        }, []);

        return {
          ...state,
          appointments: uniqueApps,
          status: 'idle',
          error: null,
          lastUpdated: uniqueApps.length > 0 
            ? uniqueApps.reduce((latest, app) => 
                new Date(app.updatedAt) > new Date(latest) ? app.updatedAt : latest, 
                ''
              ) 
            : null
        };
      }
    });
  }
});

export const {
  addAppointment,
  cancelAppointment,
  completeAppointment,
  clearAppointments,
  removeDuplicates
} = appointmentsSlice.actions;

// Селекторы
export const selectAllAppointments = (state) => state.appointments.appointments;
export const selectPatientAppointments = (patientId) => (state) => 
  state.appointments.appointments.filter(app => app.patientId === patientId);
export const selectDoctorAppointments = (doctorId) => (state) => 
  state.appointments.appointments.filter(app => app.doctorId === doctorId);
export const selectAppointmentsStatus = (state) => state.appointments.status;
export const selectAppointmentsError = (state) => state.appointments.error;
export const selectLastUpdated = (state) => state.appointments.lastUpdated;

export default appointmentsSlice.reducer;