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
  whitelist: ['auth', 'patients'],
  timeout: null,
  migrate: (state) => {
    if (!state) {
      return Promise.resolve(undefined);
    }
    
    if (!state.data) {
      return Promise.resolve({
        ...state,
        data: {
          doctors: [],
          patients: [],
          appointments: [],
          specialties: [],
          initialized: false,
          loading: false,
          error: null
        }
      });
    }
    
    return Promise.resolve(state);
  },
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
  devTools: process.env.NODE_ENV !== 'production',
});

export const initializeStore = async () => {
  await persistor.persist();
  return store;
};

export const persistor = persistStore(store);

// Инициализация тестовых данных после восстановления состояния
const initializeApp = async () => {
  await persistor.persist();
  const state = store.getState();
  if (!state.data.initialized) {
    store.dispatch(initializeTestData());
  }
};

initializeApp();