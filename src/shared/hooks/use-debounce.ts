import { useState, useEffect } from 'react';

/**
 * Хук для дебаунса любого значения.
 * @param value - Значение, которое нужно дебаунсить.
 * @param delay - Время задержки в миллисекундах.
 * @returns - Дебаунсенное значение.
 */
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Запускаем таймер для обновления значения
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при изменении значения или компонента
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
