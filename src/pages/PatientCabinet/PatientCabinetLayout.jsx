import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  faCalendarAlt, 
  faUserMd, 
  faHistory, 
  faCog,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../store/slices/authSlice';
import { loadPatientData, clearCurrentPatient } from '../../store/slices/patientsSlice';
import { fetchDoctors } from '../../store/slices/doctorsSlice';
import PatientInfo from '../../components/patient/PatientInfo/PatientInfo';
import Navigation from '../../components/common/Navigation/Navigation';
import Button from '../../components/common/Button/Button';
import LoadingScreen from '../../components/common/LoadingScreen/LoadingScreen';
import Notification from '../../components/common/Notification/Notification';
import AppointmentsList from '../../components/AppointmentsList/AppointmentsList';
import './PatientCabinetLayout.scss';

const PatientCabinetLayout = ({ tab }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { currentPatient, loading, error } = useSelector((state) => state.patients);
  const { currentUser } = useSelector((state) => state.auth);
  const [notification, setNotification] = React.useState(null);

  useEffect(() => {
    if (currentUser?.id) {
      // Загружаем данные пациента
      if (!currentPatient) {
        dispatch(loadPatientData(currentUser.id));
      }
      
      // Явно загружаем врачей и проверяем результат
      dispatch(fetchDoctors())
        .unwrap()
        .then(() => console.log('Врачи успешно загружены'))
        .catch((error) => console.error('Ошибка загрузки врачей:', error));
    }
  }, [currentUser, dispatch, currentPatient]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCurrentPatient());
    navigate('/auth');
  };

  const navItems = [
    { id: 'appointments', label: 'Мои записи', icon: faCalendarAlt, path: 'appointments' },
    { id: 'doctors', label: 'Мои врачи', icon: faUserMd, path: 'doctors' },
    { id: 'history', label: 'История болезней', icon: faHistory, path: 'history' },
    { id: 'settings', label: 'Настройки', icon: faCog, path: 'settings' },
  ];

  if (loading) {
    return <LoadingScreen message="Загрузка данных пациента..." />;
  }

  if (error) {
    return (
      <Notification 
        message={`Ошибка загрузки данных: ${error}`}
        type="error"
        onClose={() => window.location.reload()}
      />
    );
  }

  if (!currentPatient) {
    return (
      <div className="patient-cabinet__error">
        <p>Данные пациента не найдены</p>
        <Button onClick={() => navigate('/auth')}>Вернуться к авторизации</Button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch(tab) {
      case 'appointments':
        return <AppointmentsList />;
      case 'doctors':
        return <div>Список врачей</div>;
      case 'history':
        return <div>История болезней</div>;
      case 'settings':
        return <div>Настройки</div>;
      default:
        return <AppointmentsList />;
    }
  };

  return (
    <>
      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="patient-cabinet__header">
        <h1 className="patient-cabinet__title">
          Личный кабинет пациента: {currentPatient.firstName} {currentPatient.lastName}
        </h1>
        <Button 
          onClick={handleLogout}
          icon={faSignOutAlt}
          variant="text"
          className="logout-btn"
        >
          Выйти
        </Button>
      </div>

      <div className="patient-cabinet-layout">
        <div className="patient-cabinet-layout__sidebar">
          <PatientInfo patient={currentPatient} />
          <Navigation
            items={navItems}
            activeTab={tab}
            onTabChange={(tab) => navigate(tab)}
            vertical
          />
        </div>
        <div className="patient-cabinet-layout__main">
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};

export default PatientCabinetLayout;