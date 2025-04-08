import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TEST_PATIENTS } from '../../utils/constants';

export const loadPatientData = createAsyncThunk(
    'patients/loadPatient',
    async (patientId, { rejectWithValue }) => {
        try {
            const patient = TEST_PATIENTS.find(p => p.id === patientId);
            if (!patient) {
                throw new Error('Пациент не найден');
            }
            return patient;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    patients: [],
    currentPatient: null,
    loading: false,
    error: null,
    _persisted: false,
};

const patientsSlice = createSlice({
    name: 'patients',
    initialState,
    reducers: {
        setPatients(state, action) {
            state.patients = action.payload;
        },
        setCurrentPatient(state, action) {
            state.currentPatient = action.payload;
        },
        clearCurrentPatient(state) {
            state.currentPatient = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadPatientData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadPatientData.fulfilled, (state, action) => {
                state.currentPatient = action.payload;
                state.loading = false;
            })
            .addCase(loadPatientData.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase('persist/REHYDRATE', (state, action) => {
                if (action.payload?.patients) {
                    state.patients = action.payload.patients.patients || [];
                    state.currentPatient = action.payload.patients.currentPatient || null;
                }
                state._persisted = true;
            });
    },
});

export const {
    setPatients,
    setCurrentPatient,
    clearCurrentPatient
} = patientsSlice.actions;

export default patientsSlice.reducer;