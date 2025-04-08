// src/components/AppointmentsList/AppointmentsList.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const AppointmentsList = () => {
  const appointments = useSelector((state) => state.appointments.appointments);

  return (
    <div className="appointments-list">
      <h2>Мои записи</h2>
      {appointments.length === 0 ? (
        <p>У вас нет активных записей</p>
      ) : (
        <ul>
          {appointments.map(app => (
            <li key={app.id} className="appointment-item">
              <div>
                <strong>Врач:</strong> {app.doctorName} ({app.specialty})
              </div>
              <div>
                <strong>Дата:</strong> {app.date} в {app.time}
              </div>
              <div>
                <strong>Статус:</strong> {app.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentsList;