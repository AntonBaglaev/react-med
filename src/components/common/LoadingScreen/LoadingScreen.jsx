import React from 'react';
import './LoadingScreen.scss';

const LoadingScreen = ({ message = 'Загрузка...' }) => {
    return (
        <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p className="loading-message">{message}</p>
        </div>
    );
};

export default LoadingScreen;