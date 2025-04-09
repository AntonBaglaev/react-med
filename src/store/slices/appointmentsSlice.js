import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';
import { saveToLocalStorage, loadFromLocalStorage } from '../../utils/storage';

const initialState = {
  appointments: loadFromLocalStorage(STORAGE_KEYS.APPOINTMENTS) || [],
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
        saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, state.appointments);
      },
      prepare(payload) {
        return {
          payload: {
            ...payload,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            status: 'scheduled'
          }
        };
      }
    },
    cancelAppointment: (state, action) => {
      const appointment = state.appointments.find(app => app.id === action.payload);
      if (appointment) {
        appointment.status = 'cancelled';
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
        saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, state.appointments);
      }
    },
    clearAppointments: (state) => {
      state.appointments = [];
      saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, []);
    }
  }
});

export const {
  addAppointment,
  cancelAppointment,
  completeAppointment,
  clearAppointments
} = appointmentsSlice.actions;

export const selectAllAppointments = (state) => state.appointments.appointments;
export const selectPatientAppointments = (patientId) => (state) => 
  state.appointments.appointments.filter(app => app.patientId === patientId);

export default appointmentsSlice.reducer;