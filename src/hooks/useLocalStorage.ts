/**
 * useLocalStorage Hook
 * Типизированная работа с localStorage с SSR поддержкой
 */

import { useState, useEffect, useCallback } from "react";

type SetValue<T> = T | ((prevValue: T) => T);

/**
 * Хук для работы с localStorage
 * - Типобезопасность
 * - SSR совместимость
 * - Автоматическая сериализация/десериализация
 * - Синхронизация между вкладками
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Проверка на SSR
  const isSSR = typeof window === "undefined";

  // Читаем начальное значение
  const readValue = useCallback((): T => {
    if (isSSR) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key, isSSR]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Сохраняем значение
  const setValue = useCallback(
    (value: SetValue<T>) => {
      if (isSSR) {
        console.warn(
          `Tried setting localStorage key "${key}" in SSR environment`
        );
        return;
      }

      try {
        const newValue = value instanceof Function ? value(storedValue) : value;

        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);

        // Отправляем событие для синхронизации между вкладками
        window.dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: JSON.stringify(newValue),
          })
        );
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, isSSR]
  );

  // Удаляем значение
  const removeValue = useCallback(() => {
    if (isSSR) {
      console.warn(
        `Tried removing localStorage key "${key}" in SSR environment`
      );
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);

      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: null,
        })
      );
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, isSSR]);

  // Слушаем изменения из других вкладок
  useEffect(() => {
    if (isSSR) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key) return;

      try {
        if (e.newValue === null) {
          setStoredValue(initialValue);
        } else {
          setStoredValue(JSON.parse(e.newValue) as T);
        }
      } catch (error) {
        console.warn(`Error handling storage event for key "${key}":`, error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue, isSSR]);

  return [storedValue, setValue, removeValue];
}

/**
 * Упрощенная версия для строк
 */
export function useLocalStorageString(
  key: string,
  initialValue: string
): [string, (value: string) => void, () => void] {
  return useLocalStorage<string>(key, initialValue);
}

/**
 * Упрощенная версия для boolean
 */
export function useLocalStorageBoolean(
  key: string,
  initialValue: boolean
): [boolean, (value: boolean) => void, () => void] {
  return useLocalStorage<boolean>(key, initialValue);
}

/**
 * Упрощенная версия для чисел
 */
export function useLocalStorageNumber(
  key: string,
  initialValue: number
): [number, (value: number) => void, () => void] {
  return useLocalStorage<number>(key, initialValue);
}
