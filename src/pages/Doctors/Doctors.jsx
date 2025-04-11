import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { addAppointment } from "../../store/slices/appointmentsSlice";
import { showNotification } from "../../store/slices/notificationSlice";
import DoctorCard from "../../components/doctor/DoctorCard/DoctorCard";
import Select from "../../components/common/Select/Select";
import Modal from "../../components/common/Modal/Modal";
import DatePicker from "../../components/common/DatePicker/DatePicker";
import TimeSlotPicker from "../../components/common/TimeSlotPicker/TimeSlotPicker";
import "./Doctors.scss";

const Doctors = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const specialties = useSelector((state) => state.data?.specialties || []);
  const doctors = useSelector((state) => state.data?.doctors || []);
  const currentUser = useSelector((state) => state.auth.currentUser); // Перенесено наверх
  
  // Состояния компонента
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Проверка рабочего дня врача
  const isWorkingDay = (doctor, date) => {
    if (!doctor?.schedule || !date) return false;
    
    const dayOfWeek = date.getDay();
    const daysMap = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };
    
    return doctor.schedule[daysMap[dayOfWeek]];
  };

  // Генерация временных слотов
  const generateTimeSlots = (doctor, date) => {
    if (!isWorkingDay(doctor, date)) return [];
    
    const slots = [];
    const startHour = 9;
    const endHour = 18;
    const slotDuration = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    
    return slots;
  };

  // Фильтрация врачей
  useEffect(() => {
    if (location.state?.specialty) {
      setSelectedSpecialty(location.state.specialty);
    }
  }, [location.state]);

  useEffect(() => {
    const filtered = doctors.filter(doctor => {
      const matchesSpecialty = selectedSpecialty 
        ? doctor.specialty === selectedSpecialty 
        : true;
      
      const matchesSearch = searchTerm
        ? `${doctor.firstName} ${doctor.lastName} ${doctor.specialty}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;
      
      return matchesSpecialty && matchesSearch;
    });
    
    setFilteredDoctors(filtered);
  }, [doctors, selectedSpecialty, searchTerm]);

  // Обработчики для записи
  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
    setSelectedDate(new Date());
    setSelectedTime(null);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) {
      dispatch(showNotification({
        type: 'error',
        message: 'Пожалуйста, выберите дату и время'
      }));
      return;
    }

    if (!currentUser) {
      dispatch(showNotification({
        type: 'error',
        message: 'Необходимо авторизоваться'
      }));
      return;
    }

    const appointmentData = {
      doctorId: selectedDoctor.id,
      patientId: currentUser.id,
      doctorName: `${selectedDoctor.lastName} ${selectedDoctor.firstName}`,
      specialty: selectedDoctor.specialty,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    dispatch(addAppointment(appointmentData));
    dispatch(showNotification({
      type: 'success',
      message: `Запись к ${selectedDoctor.lastName} на ${selectedDate.toLocaleDateString()} в ${selectedTime} создана!`
    }));

    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <div className="doctors-page">
      <div className="doctors-header">
        <h1>Наши врачи</h1>
        
        <div className="doctors-filters">
          <input
            type="text"
            placeholder="Поиск по имени или специальности..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <Select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            options={[
              { value: '', label: 'Все специальности' },
              ...specialties.map(s => ({ value: s.name, label: s.name }))
            ]}
          />
        </div>
      </div>

      {filteredDoctors.length > 0 ? (
        <div className="doctors-grid">
          {filteredDoctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBookAppointment={() => handleBookClick(doctor)}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>Врачи не найдены</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedSpecialty("");
            }}
            className="reset-btn"
          >
            Сбросить фильтры
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Запись к врачу ${selectedDoctor?.lastName}`}
      >
        <div className="booking-form">
          <DatePicker 
            selectedDate={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            filterDate={(date) => 
              selectedDoctor && isWorkingDay(selectedDoctor, date)
            }
          />
          
          {selectedDate && selectedDoctor && (
            <TimeSlotPicker
              availableSlots={generateTimeSlots(selectedDoctor, selectedDate)}
              selectedTime={selectedTime}
              onSelect={setSelectedTime}
            />
          )}

          <div className="form-actions">
            <button
              onClick={() => setIsModalOpen(false)}
              className="cancel-btn"
            >
              Отмена
            </button>
            <button
              onClick={handleConfirmBooking}
              className="confirm-btn"
              disabled={!selectedDate || !selectedTime}
            >
              Подтвердить запись
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Doctors;