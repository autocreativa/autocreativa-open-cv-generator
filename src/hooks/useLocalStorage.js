import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para manejar LocalStorage con estado reactivo
 * @param {string} key - Clave de localStorage
 * @param {any} initialValue - Valor inicial
 * @returns {[any, function]} - Estado y setter
 */
export const useLocalStorage = (key, initialValue) => {
  // Obtener valor inicial de localStorage o usar el valor por defecto
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Actualizar localStorage cuando el estado cambie
  const setValue = useCallback((value) => {
    try {
      // Permitir que value sea una función (como setState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Escuchar cambios de storage desde otras pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};

/**
 * Hook para limpiar un valor de localStorage
 * @param {string} key - Clave a limpiar
 * @returns {function} - Función para limpiar
 */
export const useClearStorage = (key) => {
  return useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);
};

export default useLocalStorage;
