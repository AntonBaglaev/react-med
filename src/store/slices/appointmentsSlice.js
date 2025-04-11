import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';
import { saveToLocalStorage, loadFromLocalStorage } from '../../utils/storage';

// Функция для загрузки и валидации записей
const loadValidatedAppointments = () => {
  try {
    const loaded = loadFromLocalStorage(STORAGE_KEYS.APPOINTMENTS);
    if (!Array.isArray(loaded)) return [];
    
    return loaded.filter(app => (
      app.id &&
      app.doctorId &&
      app.patientId &&
      app.date &&
      app.time &&
      app.status &&
      ['scheduled', 'completed', 'cancelled'].includes(app.status)
    )).reduce((unique, item) => {
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
  appointments: loadValidatedAppointments(),
  status: 'idle',
  error: null,
  lastUpdated: new Date().toISOString()
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    addAppointment: {
      reducer(state, action) {
        try {
          const { payload } = action;
          
          // Валидация обязательных полей
          if (!payload.doctorId || !payload.patientId || !payload.date || !payload.time) {
            throw new Error('Missing required appointment fields');
          }

          // Проверка на конфликты времени
          const hasConflict = state.appointments.some(app => 
            app.doctorId === payload.doctorId &&
            app.date === payload.date &&
            app.time === payload.time &&
            app.status === 'scheduled'
          );

          if (hasConflict) {
            state.error = 'У врача уже есть запись на это время';
            return;
          }

          // Добавление новой записи
          state.appointments.push({
            ...payload,
            updatedAt: new Date().toISOString()
          });
          
          state.lastUpdated = new Date().toISOString();
          state.error = null;
          saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, state.appointments);
        } catch (error) {
          state.status = 'failed';
          state.error = error.message;
          console.error('Appointment save error:', error);
        }
      },
      prepare({ doctorId, patientId, doctorName, patientName, date, time, specialty }) {
        return {
          payload: {
            id: `app_${Date.now()}`,
            doctorId,
            patientId,
            doctorName: doctorName || `Врач ${doctorId.slice(0, 5)}`,
            patientName: patientName || `Пациент ${patientId.slice(0, 5)}`,
            date,
            time,
            specialty,
            status: 'scheduled',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            diagnosis: '',
            prescription: '',
            patientData: { // Добавляем полные данные пациента
              firstName: patientName.split(' ')[0],
              lastName: patientName.split(' ')[1],
              phone: '',
              birthDate: ''
            }
          }
        };
      }
    },
    
    updateAppointment: (state, action) => {
      const { id, changes } = action.payload;
      const index = state.appointments.findIndex(app => app.id === id);
      
      if (index !== -1) {
        state.appointments[index] = {
          ...state.appointments[index],
          ...changes,
          updatedAt: new Date().toISOString()
        };
        state.lastUpdated = new Date().toISOString();
        saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, state.appointments);
      }
    },
    
    cancelAppointment: (state, action) => {
      const { id, reason } = action.payload;
      const appointment = state.appointments.find(app => app.id === id);
      
      if (appointment) {
        appointment.status = 'cancelled';
        appointment.cancellationReason = reason;
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
        appointment.diagnosis = diagnosis || '';
        appointment.prescription = prescription || '';
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
      const uniqueApps = state.appointments.filter((app, index, self) =>
        index === self.findIndex(a => (
          a.id === app.id || (
            a.doctorId === app.doctorId &&
            a.date === app.date &&
            a.time === app.time
          )
        ))
      );
      
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
        const loadedApps = action.payload.appointments.appointments || [];
        const validApps = loadedApps.filter(app => (
          app.id && app.doctorId && app.patientId && app.date && app.time
        ));
        
        return {
          ...initialState,
          appointments: validApps.reduce((unique, item) => {
            const exists = unique.some(app => app.id === item.id);
            return exists ? unique : [...unique, item];
          }, []),
          lastUpdated: action.payload.appointments.lastUpdated || initialState.lastUpdated
        };
      }
    });
  }
});

// Экспорт действий
export const {
  addAppointment,
  updateAppointment,
  cancelAppointment,
  completeAppointment,
  clearAppointments,
  removeDuplicates
} = appointmentsSlice.actions;

// Селекторы
export const selectAllAppointments = (state) => state.appointments.appointments;
export const selectAppointmentsStatus = (state) => state.appointments.status;
export const selectAppointmentsError = (state) => state.appointments.error;
export const selectLastUpdated = (state) => state.appointments.lastUpdated;

export const selectPatientAppointments = (patientId) => (state) => 
  state.appointments.appointments
    .filter(app => app.patientId === patientId)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

    export const selectDoctorAppointments = (doctorId) => (state) => 
      state.appointments.appointments
        .filter(app => app.doctorId === doctorId)
        .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

export const selectUpcomingDoctorAppointments = (doctorId) => (state) => {
  const now = new Date();
  return state.appointments.appointments
    .filter(app => 
      app.doctorId === doctorId && 
      app.status === 'scheduled' &&
      new Date(`${app.date}T${app.time}`) > now
    )
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
};

export default appointmentsSlice.reducer;