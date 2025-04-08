import {
    TEST_DOCTORS,
    TEST_PATIENTS,
    TEST_APPOINTMENTS,
    TEST_SPECIALTIES,
    APPOINTMENT_DURATION,
    WORK_HOURS,
} from './constants';
import { store } from '../store/store';
import {
    setDoctors,
    setPatients,
    setAppointments,
    setSpecialties,
} from '../store/slices';

export const initTestData = () => {
    // Проверяем, есть ли уже данные в localStorage
    if (!localStorage.getItem('persist:root')) {
        // Если нет, инициализируем тестовые данные
        store.dispatch(setDoctors(TEST_DOCTORS));
        store.dispatch(setPatients(TEST_PATIENTS));
        store.dispatch(setAppointments(TEST_APPOINTMENTS));
        store.dispatch(setSpecialties(TEST_SPECIALTIES));
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