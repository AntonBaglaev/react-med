import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, register } from "../../store/slices/authSlice";
import AuthForm from "../../components/auth/AuthForm/AuthForm";
import AuthSwitch from "../../components/auth/AuthSwitch/AuthSwitch";
import "./Auth.scss";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(currentUser.role === "doctor" ? "/doctor-cabinet" : "/patient-cabinet");
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleAuthSubmit = async (formData) => {
    try {
      const action = isLogin ? login(formData) : register(formData);
      const result = await dispatch(action);
      
      if (result.error) {
        throw new Error(result.error.message || "Ошибка авторизации");
      }
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__card">
          <h1 className="auth__title">{isLogin ? "Вход в систему" : "Регистрация"}</h1>

          {authError && <div className="auth__error">{authError}</div>}

          <AuthForm isLogin={isLogin} onSubmit={handleAuthSubmit} />

          <div className="auth__footer">
            <Link to="/" className="auth__home-link">
              На главную
            </Link>
            <AuthSwitch isLogin={isLogin} onSwitch={setIsLogin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;