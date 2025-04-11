import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../../../store/slices/notificationSlice';
import './Notification.scss';

const Notification = () => {
  const dispatch = useDispatch();
  const { message, type, isVisible } = useSelector(state => state.notification);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(removeNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  if (!isVisible) return null;

  return (
    <div className={`notification notification--${type}`}>
      <div className="notification__content">
        {message}
      </div>
      <button 
        className="notification__close"
        onClick={() => dispatch(removeNotification())}
      >
        &times;
      </button>
    </div>
  );
};

export default Notification;