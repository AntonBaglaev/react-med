const STORAGE_PREFIX = 'mc_';

export const saveToLocalStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, serializedValue);
  } catch (error) {
    console.error('LocalStorage save error:', error);
    if (process.env.NODE_ENV === 'production') {
      window.Sentry?.captureException(error);
    }
  }
};

export const loadFromLocalStorage = (key) => {
  if (typeof window === 'undefined') return null;
  
  try {
    const serializedValue = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error('LocalStorage load error:', error);
    if (process.env.NODE_ENV === 'production') {
      window.Sentry?.captureException(error);
    }
    return null;
  }
};

export const removeFromLocalStorage = (key) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error('LocalStorage remove error:', error);
    if (process.env.NODE_ENV === 'production') {
      window.Sentry?.captureException(error);
    }
  }
};

export const clearAppStorage = () => {
  if (typeof window === 'undefined') return;
  
  Object.keys(localStorage)
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .forEach(key => localStorage.removeItem(key));
};