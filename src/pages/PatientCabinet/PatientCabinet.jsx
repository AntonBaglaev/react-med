import React from 'react';
import { Outlet } from 'react-router-dom';
import './PatientCabinet.scss';

const PatientCabinet = () => {
  return (
    <div className="patient-cabinet">
      <Outlet />
    </div>
  );
};

export default PatientCabinet;