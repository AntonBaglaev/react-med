import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, selectIsInitialized } from './store/slices/authSlice';
import Home from './pages/Home/Home';
import Doctors from './pages/Doctors/Doctors';
import DoctorCabinet from './pages/DoctorCabinet/DoctorCabinet';
import PatientCabinet from './pages/PatientCabinet/PatientCabinet';
import Auth from './pages/Auth/Auth';
import LoadingScreen from './components/common/LoadingScreen/LoadingScreen';

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

      {/* Защищенные маршруты */}
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
      <Route
        path="/patient-cabinet/*"
        element={
          isAuthenticated && currentUser?.role === 'patient' ? (
            <PatientCabinet />
          ) : (
            <Navigate to="/auth" state={{ from: '/patient-cabinet' }} replace />
          )
        }
      />

      {/* Резервный маршрут для несуществующих страниц */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;