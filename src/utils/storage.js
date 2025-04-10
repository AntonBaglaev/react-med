// Улучшенные утилиты для работы с localStorage
export const saveToLocalStorage = (key, value) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(`medcenter_${key}`, serializedValue); // Добавил префикс
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        // Можно добавить отправку ошибки в Sentry или аналогичный сервис
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

// Новая функция для очистки всех данных приложения
export const clearAppLocalStorage = () => {
    Object.keys(localStorage)
        .filter(key => key.startsWith('medcenter_'))
        .forEach(key => localStorage.removeItem(key));
};