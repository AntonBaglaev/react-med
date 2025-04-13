import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  TEST_DOCTORS, 
  TEST_PATIENTS, 
  TEST_APPOINTMENTS, 
  TEST_SPECIALTIES 
} from '../../utils/constants';

export const initializeTestData = createAsyncThunk(
  'data/initializeTestData',
  async (_, { rejectWithValue }) => {
    try {

      return {
        doctors: TEST_DOCTORS,
        patients: TEST_PATIENTS,
        appointments: TEST_APPOINTMENTS,
        specialties: TEST_SPECIALTIES
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addDoctorAsync = createAsyncThunk(
  'data/addDoctor',
  async (doctorData, { rejectWithValue }) => {
    try {
      const newDoctor = {
        ...doctorData,
        id: `d${Date.now()}`
      };
      return newDoctor;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  doctors: [],
  patients: [],
  appointments: [],
  specialties: [],
  initialized: false,
  loading: false,
  error: null
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    updateDoctor(state, action) {
      const index = state.doctors.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.doctors[index] = action.payload;
      }
    },
    deleteDoctor(state, action) {
      state.doctors = state.doctors.filter(d => d.id !== action.payload);
    },
    clearDataError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeTestData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeTestData.fulfilled, (state, action) => {
        state.doctors = action.payload.doctors;
        state.patients = action.payload.patients;
        state.appointments = action.payload.appointments;
        state.specialties = action.payload.specialties;
        state.initialized = true;
        state.loading = false;
      })
      .addCase(initializeTestData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(addDoctorAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDoctorAsync.fulfilled, (state, action) => {
        state.doctors.push(action.payload);
        state.loading = false;
      })
      .addCase(addDoctorAsync.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export const { 
  updateDoctor, 
  deleteDoctor,
  clearDataError 
} = dataSlice.actions;

export const selectDoctors = state => state.data.doctors;
export const selectPatients = state => state.data.patients;
export const selectAppointments = state => state.data.appointments;
export const selectSpecialties = state => state.data.specialties;
export const selectDataInitialized = state => state.data.initialized;
export const selectDataLoading = state => state.data.loading;
export const selectDataError = state => state.data.error;

export const selectDoctorById = (state, doctorId) => 
  state.data.doctors.find(d => d.id === doctorId);

export const selectPatientById = (state, patientId) => 
  state.data.patients.find(p => p.id === patientId);

export const selectAppointmentsForDoctor = (state, doctorId) => 
  state.data.appointments.filter(a => a.doctorId === doctorId);

export const selectAppointmentsForPatient = (state, patientId) => 
  state.data.appointments.filter(a => a.patientId === patientId);

export default dataSlice.reducer;