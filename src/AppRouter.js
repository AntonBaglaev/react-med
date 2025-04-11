import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, selectIsInitialized } from './store/slices/authSlice';
import Home from './pages/Home/Home';
import Doctors from './pages/Doctors/Doctors';
import DoctorCabinet from './pages/DoctorCabinet/DoctorCabinet';
import PatientCabinet from './pages/PatientCabinet/PatientCabinet';
import Auth from './pages/Auth/Auth';
import LoadingScreen from './components/common/LoadingScreen/LoadingScreen';
import AppointmentsList from './components/AppointmentsList/AppointmentsList';
import PatientCabinetLayout from './pages/PatientCabinet/PatientCabinetLayout';
import PatientInfo from './components/patient/PatientInfo/PatientInfo';
import NotFound from './pages/NotFound/NotFound';

const AppRouter = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsInitialized);

  // Показываем экран загрузки пока Redux Persist не восстановит состояние
  if (!isInitialized) {
    return <LoadingScreen message="Восстановление сессии..." />;
  }

  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/auth" element={<Auth />} />

      {/* Защищенные маршруты для врача */}
      <Route
        path="/doctor-cabinet/*"
        element={
          isAuthenticated && currentUser?.role === 'doctor' ? (
            <DoctorCabinet />
          ) : (
            <Navigate to="/auth" state={{ from: '/doctor-cabinet' }} replace />
          )
        }
      />

      {/* Защищенные маршруты для пациента с вложенными маршрутами */}
      <Route
        path="/patient-cabinet"
        element={
          isAuthenticated && currentUser?.role === 'patient' ? (
            <PatientCabinet />
          ) : (
            <Navigate to="/auth" state={{ from: '/patient-cabinet' }} replace />
          )
        }
      >
        <Route index element={<Navigate to="appointments" replace />} />
        <Route path="appointments" element={<PatientCabinetLayout tab="appointments" />} />
        <Route path="doctors" element={<PatientCabinetLayout tab="doctors" />} />
        <Route path="history" element={<PatientCabinetLayout tab="history" />} />
        <Route path="settings" element={<PatientCabinetLayout tab="settings" />} />
      </Route>
        

      {/* Резервный маршрут для несуществующих страниц */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;