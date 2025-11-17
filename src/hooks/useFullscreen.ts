/**
 * useFullscreen Hook
 * Управление Fullscreen API
 */

import { useState, useEffect, useCallback } from "react";

export interface FullscreenAPI {
  isFullscreen: boolean;
  isSupported: boolean;
  enter: () => Promise<void>;
  exit: () => Promise<void>;
  toggle: () => Promise<void>;
}

/**
 * Хук для работы с Fullscreen API
 * Поддерживает все браузеры с префиксами
 */
export function useFullscreen(): FullscreenAPI {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Проверяем поддержку Fullscreen API
  const isSupported =
    typeof document !== "undefined" &&
    !!(
      document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled ||
      (document as any).mozFullScreenEnabled ||
      (document as any).msFullscreenEnabled
    );

  // Универсальная функция для получения fullscreen элемента
  const getFullscreenElement = useCallback((): Element | null => {
    if (typeof document === "undefined") return null;

    return (
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement ||
      null
    );
  }, []);

  // Вход в fullscreen
  const enter = useCallback(async (): Promise<void> => {
    if (!isSupported || typeof document === "undefined") {
      console.warn("Fullscreen API is not supported");
      return;
    }

    try {
      const elem = document.documentElement;

      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        await (elem as any).mozRequestFullScreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error("Error entering fullscreen:", error);
    }
  }, [isSupported]);

  // Выход из fullscreen
  const exit = useCallback(async (): Promise<void> => {
    if (!isSupported || typeof document === "undefined") {
      return;
    }

    try {
      if (!getFullscreenElement()) {
        return; // Уже не в fullscreen
      }

      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error("Error exiting fullscreen:", error);
    }
  }, [isSupported, getFullscreenElement]);

  // Переключение fullscreen
  const toggle = useCallback(async (): Promise<void> => {
    if (isFullscreen) {
      await exit();
    } else {
      await enter();
    }
  }, [isFullscreen, enter, exit]);

  // Отслеживаем изменения fullscreen
  useEffect(() => {
    if (!isSupported || typeof document === "undefined") {
      return;
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!getFullscreenElement());
    };

    // Добавляем слушателей для всех браузеров
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Начальное состояние
    handleFullscreenChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [isSupported, getFullscreenElement]);

  return {
    isFullscreen,
    isSupported,
    enter,
    exit,
    toggle,
  };
}
