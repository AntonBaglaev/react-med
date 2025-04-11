import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import patientsReducer from './slices/patientsSlice';
import doctorsReducer from './slices/doctorsSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import dataReducer from './slices/dataSlice';
import { initializeTestData } from './slices/dataSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  patients: patientsReducer,
  doctors: doctorsReducer,
  appointments: appointmentsReducer,
  data: dataReducer,
});

const persistConfig = {
  key: 'medcenter',
  version: 1,
  storage,
  whitelist: ['auth', 'patients', 'appointments'],
  // Добавляем миграцию для устранения дублирования
  migrate: (state) => {
    if (!state) return Promise.resolve(undefined);
    
    // Удаляем дубликаты записей
    if (state.appointments?.appointments) {
      const uniqueApps = state.appointments.appointments.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      
      return Promise.resolve({
        ...state,
        appointments: {
          ...state.appointments,
          appointments: uniqueApps
        }
      });
    }
    return Promise.resolve(state);
  }
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store, null, () => {
  const state = store.getState();
  if (!state.data.initialized) {
    store.dispatch(initializeTestData());
  }
});