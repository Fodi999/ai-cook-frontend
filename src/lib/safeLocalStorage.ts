// Утилиты для безопасной работы с localStorage
export const safeLocalStorage = {
  // Безопасное получение данных из localStorage
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      const item = localStorage.getItem(key);
      // Проверяем, что значение не является строкой "undefined" или "null"
      if (item === 'undefined' || item === 'null') {
        console.warn(`localStorage: Found invalid value for key "${key}":`, item);
        localStorage.removeItem(key); // Удаляем некорректное значение
        return null;
      }
      return item;
    } catch (error) {
      console.error(`localStorage.getItem error for key "${key}":`, error);
      return null;
    }
  },

  // Безопасное сохранение данных в localStorage
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window === 'undefined') return;
      // Проверяем, что значение не undefined
      if (value === undefined || value === 'undefined') {
        console.warn(`localStorage: Attempt to save undefined value for key "${key}"`);
        return;
      }
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`localStorage.setItem error for key "${key}":`, error);
    }
  },

  // Безопасное получение и парсинг JSON
  getJSON: <T = any>(key: string): T | null => {
    try {
      const item = safeLocalStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item);
    } catch (error) {
      console.error(`localStorage.getJSON error for key "${key}":`, error);
      // Удаляем некорректные данные
      localStorage.removeItem(key);
      return null;
    }
  },

  // Безопасное сохранение JSON
  setJSON: (key: string, value: any): void => {
    try {
      if (value === undefined) {
        console.warn(`localStorage: Attempt to save undefined JSON for key "${key}"`);
        return;
      }
      const jsonString = JSON.stringify(value);
      safeLocalStorage.setItem(key, jsonString);
    } catch (error) {
      console.error(`localStorage.setJSON error for key "${key}":`, error);
    }
  },

  // Безопасное удаление
  removeItem: (key: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`localStorage.removeItem error for key "${key}":`, error);
    }
  }
};
