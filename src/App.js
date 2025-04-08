import React from 'react';
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
  return (
    <Provider store={store}>
      {/* PersistGate задерживает рендеринг UI пока состояние не восстановится из localStorage */}
      <PersistGate 
        loading={<LoadingScreen message="Загрузка приложения..." />}
        persistor={persistor}
      >
        <div className="app">
          {/* Общий header для всех страниц */}
          <Header />
          
          {/* Основное содержимое страницы */}
          <main className="app__main">
            <AppRouter />
          </main>
          
          {/* Общий footer для всех страниц */}
          <Footer />
          
          {/* Компонент для отображения уведомлений */}
          <Notification />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;