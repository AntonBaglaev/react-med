import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    specialties: [],
    loading: false,
    error: null,
};

const specialtiesSlice = createSlice({
    name: 'specialties',
    initialState,
    reducers: {
        setSpecialties(state, action) {
            state.specialties = action.payload;
        },
        addSpecialty(state, action) {
            state.specialties.push(action.payload);
        },
        deleteSpecialty(state, action) {
            state.specialties = state.specialties.filter(
                (specialty) => specialty.id !== action.payload
            );
        },
    },
});

export const { setSpecialties, addSpecialty, deleteSpecialty } =
    specialtiesSlice.actions;

export default specialtiesSlice.reducer;