import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import AppRouter from './AppRouter';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import Notification from './components/common/Notification/Notification';
import LoadingScreen from './components/common/LoadingScreen/LoadingScreen';
import './App.css';

function App() {
  useEffect(() => {
    // Добавляем обработчик ошибок persistence
    const unsubscribe = persistor.subscribe(() => {
      const { bootstrapped } = persistor.getState();
      if (bootstrapped) {
        // Проверяем состояние после восстановления
        const state = store.getState();
        if (!state.appointments || !Array.isArray(state.appointments.appointments)) {
          console.error('Invalid appointments state after rehydration');
        }
      }
    });

    return () => {
      // Правильно отписываемся
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        loading={<LoadingScreen message="Загрузка приложения..." />}
        persistor={persistor}
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
  );
}

export default App;