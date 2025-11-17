/**
 * useFullscreen Hook
 * Управление Fullscreen API
 */

import { useState, useEffect, useCallback } from "react";

// TypeScript interfaces for browser-specific fullscreen APIs
interface DocumentWithFullscreen extends Document {
  webkitFullscreenEnabled?: boolean;
  mozFullScreenEnabled?: boolean;
  msFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface HTMLElementWithFullscreen extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

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
      (document as DocumentWithFullscreen).webkitFullscreenEnabled ||
      (document as DocumentWithFullscreen).mozFullScreenEnabled ||
      (document as DocumentWithFullscreen).msFullscreenEnabled
    );

  // Универсальная функция для получения fullscreen элемента
  const getFullscreenElement = useCallback((): Element | null => {
    if (typeof document === "undefined") return null;

    const doc = document as DocumentWithFullscreen;
    return (
      document.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement ||
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
      const elem = document.documentElement as HTMLElementWithFullscreen;

      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
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

      const doc = document as DocumentWithFullscreen;
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
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
