import { createSlice } from '@reduxjs/toolkit';

// Функции для работы с localStorage
const loadAppointments = () => {
  try {
    const saved = localStorage.getItem('medical-appointments');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Ошибка загрузки записей из localStorage:', e);
    return [];
  }
};

const saveAppointments = (appointments) => {
  try {
    localStorage.setItem('medical-appointments', JSON.stringify(appointments));
  } catch (e) {
    console.error('Ошибка сохранения записей в localStorage:', e);
  }
};

const initialState = {
  appointments: loadAppointments(),
  status: 'idle',
  error: null
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    addAppointment: {
      reducer(state, action) {
        state.appointments.push(action.payload);
        saveAppointments(state.appointments);
      },
      prepare(payload) {
        return {
          payload: {
            ...payload,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            status: 'pending'
          }
        };
      }
    },
    cancelAppointment: (state, action) => {
      state.appointments = state.appointments.filter(
        app => app.id !== action.payload
      );
      saveAppointments(state.appointments);
    },
    updateAppointmentStatus: (state, action) => {
      const { id, status } = action.payload;
      const appointment = state.appointments.find(app => app.id === id);
      if (appointment) {
        appointment.status = status;
        saveAppointments(state.appointments);
      }
    },
    clearAppointments: (state) => {
      state.appointments = [];
      localStorage.removeItem('medical-appointments');
    }
  }
});

export const {
  addAppointment,
  cancelAppointment,
  updateAppointmentStatus,
  clearAppointments
} = appointmentsSlice.actions;

export const selectAllAppointments = (state) => state.appointments.appointments;
export const selectDoctorAppointments = (doctorId) => (state) => 
  state.appointments.appointments.filter(app => app.doctorId === doctorId);

export default appointmentsSlice.reducer;