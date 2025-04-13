import React from 'react';
import { Outlet } from 'react-router-dom';
import AppointmentsList from '../../components/AppointmentsList/AppointmentsList';
import './PatientCabinet.scss';

const PatientCabinet = () => {
  return (
    <div className="patient-cabinet">
      <div className="patient-cabinet__content">
        <div className="patient-cabinet__sidebar">
        
        </div>
        
        <div className="patient-cabinet__main">
          <Outlet />

        </div>
      </div>
    </div>
  );
};

export default PatientCabinet;