import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    doctors: [],
    loading: false,
    error: null,
};

const doctorsSlice = createSlice({
    name: 'doctors',
    initialState,
    reducers: {
        setDoctors(state, action) {
            state.doctors = action.payload;
        },
        addDoctor(state, action) {
            state.doctors.push(action.payload);
        },
        updateDoctor(state, action) {
            const index = state.doctors.findIndex(
                (doctor) => doctor.id === action.payload.id
            );
            if (index !== -1) {
                state.doctors[index] = action.payload;
            }
        },
        deleteDoctor(state, action) {
            state.doctors = state.doctors.filter(
                (doctor) => doctor.id !== action.payload
            );
        },
    },
});

export const { setDoctors, addDoctor, updateDoctor, deleteDoctor } =
    doctorsSlice.actions;

export default doctorsSlice.reducer;