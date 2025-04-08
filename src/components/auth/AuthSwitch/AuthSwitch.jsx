import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../common/Button/Button';
import './AuthSwitch.scss';

const AuthSwitch = ({ isLogin, onSwitch }) => {
  return (
    <div className="auth-switch">
      <span className="auth-switch__text">
        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
      </span>
      <Button
        variant="text"
        onClick={() => onSwitch(!isLogin)}
        className="auth-switch__button"
      >
        {isLogin ? 'Зарегистрироваться' : 'Войти'}
      </Button>
    </div>
  );
};

AuthSwitch.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  onSwitch: PropTypes.func.isRequired,
};

export default AuthSwitch;