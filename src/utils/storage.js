export const saveToLocalStorage = (key, value) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(`medcenter_${key}`, serializedValue);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

export const loadFromLocalStorage = (key) => {
    try {
        const serializedValue = localStorage.getItem(`medcenter_${key}`);
        return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
};

export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(`medcenter_${key}`);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};

export const clearAppLocalStorage = () => {
    Object.keys(localStorage)
        .filter(key => key.startsWith('medcenter_'))
        .forEach(key => localStorage.removeItem(key));
};

export const clearAppStorage = () => {
  if (typeof window === 'undefined') return;

  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('mc_')) {
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('persist:')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Ошибка при очистке хранилища:', error);
    if (window.Sentry) {
      window.Sentry.captureException(error);
    }
  }
};