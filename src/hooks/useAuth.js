import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../store/slices/authSlice';
import { initTestData } from '../utils/helpers';

const useAuth = () => {
    const dispatch = useDispatch();
    const { currentUser, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        initTestData();

        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch(loginSuccess(user));
        }
    }, [dispatch]);

    const handleLogin = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(loginSuccess(user));
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        dispatch(logout());
    };

    return {
        currentUser,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
    };
};

export default useAuth;