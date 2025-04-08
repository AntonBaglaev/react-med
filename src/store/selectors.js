export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export const selectDoctors = (state) => state.data.doctors || [];
export const selectDoctorById = (id) => (state) =>
    selectDoctors(state).find(doctor => doctor.id === id);

export const selectPatients = (state) => state.data.patients || [];
export const selectPatientById = (id) => (state) =>
    selectPatients(state).find(patient => patient.id === id);

export const selectAppointments = (state) => state.appointments.appointments;
export const selectDoctorAppointments = (doctorId) => (state) =>
    state.appointments.appointments.filter(
        (appointment) => appointment.doctorId === doctorId
    );
export const selectPatientAppointments = (patientId) => (state) =>
    state.appointments.appointments.filter(
        (appointment) => appointment.patientId === patientId
    );

export const selectCurrentDoctor = (state) => {
    if (!state.auth.currentUser) return null;
    return selectDoctorById(state.auth.currentUser.id)(state);
};

export const selectCurrentPatient = (state) => {
    if (!state.auth.currentUser) return null;
    return selectPatientById(state.auth.currentUser.id)(state);
};

export const selectSpecialties = (state) => state.data?.specialties || [];
