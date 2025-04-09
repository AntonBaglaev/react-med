import {
    TEST_DOCTORS,
    TEST_PATIENTS,
    TEST_APPOINTMENTS,
    TEST_SPECIALTIES,
    APPOINTMENT_DURATION,
    WORK_HOURS,
} from './constants';
import { store } from '../store/store';
import { initializeTestData } from '../store/slices/dataSlice';

export const initTestData = () => {
    if (!localStorage.getItem('persist:root')) {
        store.dispatch(initializeTestData({
            doctors: TEST_DOCTORS,
            patients: TEST_PATIENTS,
            appointments: TEST_APPOINTMENTS,
            specialties: TEST_SPECIALTIES
        }));
    }
};

export const generateTimeSlots = (doctor) => {
    const slots = [];
    const startHour = WORK_HOURS.start;
    const endHour = WORK_HOURS.end;
    const duration = APPOINTMENT_DURATION;

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += duration) {
            const time = `${hour.toString().padStart(2, '0')}:${minute
                .toString()
                .padStart(2, '0')}`;
            slots.push(time);
        }
    }

    return slots;
};

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
};

export const getDayName = (dateString) => {
    const days = [
        'воскресенье',
        'понедельник',
        'вторник',
        'среду',
        'четверг',
        'пятницу',
        'субботу',
    ];
    const dayIndex = new Date(dateString).getDay();
    return days[dayIndex];
};

export const filterAppointmentsByPatient = (appointments, patientId) => {
    return appointments.filter(app => app.patientId === patientId);
};

export const sortAppointmentsByDate = (appointments, ascending = true) => {
    return [...appointments].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return ascending ? dateA - dateB : dateB - dateA;
    });
};