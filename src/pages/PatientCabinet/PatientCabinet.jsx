import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  faCalendarAlt, 
  faUserMd, 
  faHistory, 
  faCog,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../store/slices/authSlice';
import { loadPatientData, clearCurrentPatient } from '../../store/slices/patientsSlice';
import PatientInfo from '../../components/patient/PatientInfo/PatientInfo';
import Navigation from '../../components/common/Navigation/Navigation';
import Button from '../../components/common/Button/Button';
import LoadingScreen from '../../components/common/LoadingScreen/LoadingScreen';
import Notification from '../../components/common/Notification/Notification';
import './PatientCabinet.scss';

const PatientCabinet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentPatient, loading, error, _persisted } = useSelector((state) => state.patients);
  const { currentUser } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('appointments');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (_persisted && currentUser?.id && !currentPatient) {
      dispatch(loadPatientData(currentUser.id));
    }
  }, [currentUser, _persisted, dispatch]);

  useEffect(() => {
    const currentTab = location.pathname.split('/').pop();
    if (currentTab && navItems.some(item => item.path === currentTab)) {
      setActiveTab(currentTab);
    }
  }, [location]);

  const navItems = [
    { id: 'appointments', label: 'Мои записи', icon: faCalendarAlt, path: 'appointments' },
    { id: 'doctors', label: 'Мои врачи', icon: faUserMd, path: 'doctors' },
    { id: 'history', label: 'История болезней', icon: faHistory, path: 'history' },
    { id: 'settings', label: 'Настройки', icon: faCog, path: 'settings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCurrentPatient());
    navigate('/auth');
  };

  if (!_persisted) {
    return <LoadingScreen message="Восстановление сессии..." />;
  }

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

  return (
    <div className="patient-cabinet">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="patient-cabinet__header">
        <h1 className="patient-cabinet__title">Личный кабинет пациента</h1>
        <Button 
          onClick={handleLogout}
          icon={faSignOutAlt}
          variant="text"
          className="logout-btn"
        >
          Выйти
        </Button>
      </div>

      <div className="patient-cabinet__content">
        <div className="patient-cabinet__sidebar">
          <PatientInfo patient={currentPatient} />
          <Navigation
            items={navItems}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              navigate(tab);
            }}
            vertical
          />
        </div>

        <div className="patient-cabinet__main">
          <Outlet context={{ patient: currentPatient, setNotification }} />
        </div>
      </div>
    </div>
  );
};

export default PatientCabinet;