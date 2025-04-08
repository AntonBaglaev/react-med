// src/components/common/Notification/Notification.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../../../store/slices/notificationSlice";
import "./Notification.scss";

const Notification = () => {
  const dispatch = useDispatch();
  
  // Безопасное получение уведомлений с проверкой на существование state.notification
  const notifications = useSelector((state) => 
    state.notification?.notifications || []
  );

  useEffect(() => {
    if (!notifications.length) return;

    const timers = notifications
      .filter(notification => notification.autoHide)
      .map(notification => {
        return setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, 3000);
      });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, dispatch]);

  if (!notifications.length) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          onClick={() => dispatch(removeNotification(notification.id))}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default Notification;