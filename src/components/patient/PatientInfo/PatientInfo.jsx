import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCalendarAlt, 
  faPhone, 
  faMapMarkerAlt,
  faTint,
  faAllergies,
  faHeartbeat
} from '@fortawesome/free-solid-svg-icons';
import './PatientInfo.scss';

const PatientInfo = ({ patient }) => {

  if (!patient) {
    return <div className="patient-info-error">Данные пациента не загружены</div>;
  }
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="patient-info">
      <div className="patient-info__header">
        <div className="patient-info__avatar">
          <FontAwesomeIcon icon={faUser} size="3x" />
        </div>
        <div className="patient-info__title">
          <h2 className="patient-info__name">
            {patient.lastName} {patient.firstName} {patient.middleName}
          </h2>
          <p className="patient-info__id">ID: {patient.id}</p>
        </div>
      </div>

      <div className="patient-info__section">
        <h3 className="patient-info__section-title">Основная информация</h3>
        <div className="patient-info__details">
          <div className="patient-info__detail">
            <FontAwesomeIcon icon={faCalendarAlt} className="patient-info__icon" />
            <span>Дата рождения: {formatDate(patient.birthDate)}</span>
          </div>
          <div className="patient-info__detail">
            <FontAwesomeIcon icon={faPhone} className="patient-info__icon" />
            <span>Телефон: {patient.phone}</span>
          </div>
          <div className="patient-info__detail">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="patient-info__icon" />
            <span>Адрес: {patient.address}</span>
          </div>
        </div>
      </div>

      <div className="patient-info__section">
        <h3 className="patient-info__section-title">Медицинская карта</h3>
        <div className="patient-info__details">
          <div className="patient-info__detail">
            <FontAwesomeIcon icon={faTint} className="patient-info__icon" />
            <span>Группа крови: {patient.medicalCard?.bloodType || 'не указана'}</span>
          </div>
          
          {patient.medicalCard?.allergies?.length > 0 && (
            <div className="patient-info__detail">
              <FontAwesomeIcon icon={faAllergies} className="patient-info__icon" />
              <span>
                Аллергии: {patient.medicalCard.allergies.join(', ')}
              </span>
            </div>
          )}

          {patient.medicalCard?.chronicDiseases?.length > 0 && (
            <div className="patient-info__detail">
              <FontAwesomeIcon icon={faHeartbeat} className="patient-info__icon" />
              <span>
                Хронические заболевания: {patient.medicalCard.chronicDiseases.join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

PatientInfo.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    middleName: PropTypes.string,
    birthDate: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    medicalCard: PropTypes.shape({
      bloodType: PropTypes.string,
      allergies: PropTypes.arrayOf(PropTypes.string),
      chronicDiseases: PropTypes.arrayOf(PropTypes.string)
    })
  }).isRequired
};

export default PatientInfo;