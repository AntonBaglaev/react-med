import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faCalendarAlt, faClock, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './DoctorInfo.scss';

const DoctorInfo = ({ doctor }) => {
  const formatSchedule = (schedule) => {
    const days = {
      monday: 'Понедельник',
      tuesday: 'Вторник',
      wednesday: 'Среда',
      thursday: 'Четверг',
      friday: 'Пятница',
      saturday: 'Суббота',
      sunday: 'Воскресенье'
    };

    return Object.entries(schedule)
      .filter(([_, isWorking]) => isWorking)
      .map(([day]) => days[day])
      .join(', ');
  };

  return (
    <div className="doctor-info">
      <div className="doctor-info__header">
        <div className="doctor-info__avatar">
          {doctor.photo ? (
            <img src={doctor.photo} alt={`${doctor.firstName} ${doctor.lastName}`} />
          ) : (
            <FontAwesomeIcon icon={faUserMd} size="3x" />
          )}
        </div>
        <div className="doctor-info__title">
          <h2 className="doctor-info__name">
            {doctor.lastName} {doctor.firstName} {doctor.middleName}
          </h2>
          <p className="doctor-info__specialty">{doctor.specialty}</p>
        </div>
      </div>

      <div className="doctor-info__details">
        <div className="doctor-info__detail">
          <FontAwesomeIcon icon={faCalendarAlt} className="doctor-info__icon" />
          <span>Рабочие дни: {formatSchedule(doctor.schedule)}</span>
        </div>

        <div className="doctor-info__detail">
          <FontAwesomeIcon icon={faClock} className="doctor-info__icon" />
          <span>Часы приема: 9:00 - 18:00</span>
        </div>

        <div className="doctor-info__detail">
          <FontAwesomeIcon icon={faPhone} className="doctor-info__icon" />
          <span>Телефон: {doctor.phone}</span>
        </div>

        <div className="doctor-info__detail">
          <FontAwesomeIcon icon={faEnvelope} className="doctor-info__icon" />
          <span>Email: {doctor.email}</span>
        </div>
      </div>

      {doctor.description && (
        <div className="doctor-info__description">
          <h3 className="doctor-info__subtitle">О враче</h3>
          <p>{doctor.description}</p>
        </div>
      )}
    </div>
  );
};

DoctorInfo.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    middleName: PropTypes.string,
    specialty: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    photo: PropTypes.string,
    schedule: PropTypes.object.isRequired,
    description: PropTypes.string
  }).isRequired
};

export default DoctorInfo;