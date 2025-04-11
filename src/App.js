import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import AppRouter from './AppRouter';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import Notification from './components/common/Notification/Notification';
import LoadingScreen from './components/common/LoadingScreen/LoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import { STORAGE_KEYS } from './utils/constants';
import './App.css';

function App() {
  useEffect(() => {
    // Инициализация приложения
    const initializeApp = async () => {
      try {
        // Проверка целостности localStorage
        const checkStorageIntegrity = () => {
          try {
            const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS));
            if (appointments && !Array.isArray(appointments)) {
              localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
            }
          } catch (e) {
            localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
          }
        };

        checkStorageIntegrity();

        // Ожидание завершения гидратации состояния
        await persistor.persist();

        // Проверка восстановленного состояния
        const state = store.getState();
        if (!state.appointments?.appointments) {
          console.warn('Appointments state not properly rehydrated');
        }

        // Подписка на изменения persistence
        const unsubscribe = persistor.subscribe(() => {
          const { bootstrapped } = persistor.getState();
          if (bootstrapped) {
            console.log('State rehydration completed');
          }
        });

        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch (error) {
        console.error('App initialization failed:', error);
      }
    };

    initializeApp();

    // Синхронизация между вкладками
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.APPOINTMENTS) {
        store.dispatch({ type: 'appointments/syncFromStorage' });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate
          loading={<LoadingScreen message="Инициализация приложения..." />}
          persistor={persistor}
          onBeforeLift={() => {
            if (process.env.NODE_ENV === 'development') {
              console.log('Store rehydration started');
            }
          }}
        >
          <div className="app">
            <Header />
            <main className="app__main">
              <AppRouter />
            </main>
            <Footer />
            <Notification />
          </div>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;