export const WORK_HOURS = {
  start: 9,
  end: 18,
};

export const APPOINTMENT_DURATION = 30; // in minutes

export const STORAGE_KEYS = {
  AUTH: 'auth',
  DATA: 'data',
  APPOINTMENTS: 'appointments',
  USER_TYPE: 'userType',
};

export const TEST_DOCTORS = [
  {
    id: 'd1',
    firstName: 'Иван',
    lastName: 'Петров',
    middleName: 'Сергеевич',
    specialty: 'Терапевт',
    email: 'doctor1@example.com',
    password: 'doctor1',
    phone: '+7 (123) 456-7890',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    schedule: {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    description:
      'Опытный терапевт с 10-летним стажем работы. Специализируется на лечении заболеваний внутренних органов.',
  },
  {
    id: 'd2',
    firstName: 'Мария',
    lastName: 'Иванова',
    middleName: 'Александровна',
    specialty: 'Кардиолог',
    email: 'doctor2@example.com',
    password: 'doctor2',
    phone: '+7 (987) 654-3210',
    photo: 'https://randomuser.me/api/portraits/women/2.jpg',
    schedule: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: false,
    },
    description:
      'Кардиолог высшей категории. Специализируется на диагностике и лечении сердечно-сосудистых заболеваний.',
  },
];

export const TEST_PATIENTS = [
  {
    id: 'p1',
    firstName: 'Алексей',
    lastName: 'Смирнов',
    middleName: 'Дмитриевич',
    email: 'patient1@example.com',
    password: 'patient1',
    phone: '+7 (111) 222-3333',
    birthDate: '1985-05-15',
    address: 'ул. Ленина, д. 10, кв. 25',
    medicalCard: {
      bloodType: 'A+',
      allergies: ['Пенициллин', 'Пыльца'],
      chronicDiseases: ['Гипертония'],
    },
  },
  {
    id: 'p2',
    firstName: 'Елена',
    lastName: 'Кузнецова',
    middleName: 'Владимировна',
    email: 'patient2@example.com',
    password: 'patient2',
    phone: '+7 (444) 555-6666',
    birthDate: '1990-08-22',
    address: 'ул. Пушкина, д. 5, кв. 12',
    medicalCard: {
      bloodType: 'B-',
      allergies: [],
      chronicDiseases: ['Астма'],
    },
  },
];

export const TEST_APPOINTMENTS = [
  {
    id: 'a1',
    doctorId: 'd1',
    patientId: 'p1',
    date: '2023-06-15',
    time: '10:00',
    status: 'completed',
    diagnosis: 'ОРВИ',
    prescription: 'Постельный режим, обильное питье, парацетамол',
  },
  {
    id: 'a2',
    doctorId: 'd2',
    patientId: 'p2',
    date: '2023-06-16',
    time: '14:30',
    status: 'scheduled',
    diagnosis: '',
    prescription: '',
  },
];

export const TEST_SPECIALTIES = [
  { id: 's1', name: 'Терапевт' },
  { id: 's2', name: 'Кардиолог' },
  { id: 's3', name: 'Невролог' },
  { id: 's4', name: 'Офтальмолог' },
  { id: 's5', name: 'Хирург' },
];