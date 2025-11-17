/**
 * useColorAnimation Hook
 * Оптимизированная анимация смены цветов с requestAnimationFrame
 *
 * КРИТИЧЕСКАЯ ОПТИМИЗАЦИЯ:
 * - Использует CSS переменные вместо setState на каждом кадре
 * - requestAnimationFrame вместо setTimeout
 * - Батчинг обновлений состояния
 * - Уменьшает перерисовки с ~510 до ~10-20
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { hexToRgb, rgbToHex, type Rgb } from "@/lib/color";
import {
  interpolateColor,
  calculateOptimalSteps,
  calculateTransitionDelay,
  createAnimationLoop,
} from "@/lib/animation";
import { interpolateOklab } from "@/lib/color";

export interface UseColorAnimationOptions {
  favorites: string[];
  speed: number;
  enabled: boolean;
  onColorChange?: (hex: string, rgb: Rgb) => void;
}

export interface ColorAnimationState {
  currentHex: string;
  currentRgb: Rgb;
  isAnimating: boolean;
  currentIndex: number;
  progress: number;
}

/**
 * Хук для анимации смены цветов
 * Оптимизирован для максимальной производительности
 */
export function useColorAnimation({
  favorites,
  speed,
  enabled,
  onColorChange,
}: UseColorAnimationOptions) {
  const [state, setState] = useState<ColorAnimationState>({
    currentHex: favorites[0] || "#000000",
    currentRgb: hexToRgb(favorites[0]) || { r: 0, g: 0, b: 0 },
    isAnimating: false,
    currentIndex: 0,
    progress: 0,
  });

  const stopAnimationRef = useRef<(() => void) | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const transitionStartTimeRef = useRef<number>(0);

  // Обновляем CSS переменную напрямую (без перерисовки React!)
  const updateCSSVariable = useCallback((rgb: Rgb) => {
    const hex = rgbToHex(rgb);
    document.documentElement.style.setProperty(
      "--screensavy-bg-color",
      hex
    );
  }, []);

  // Основной цикл анимации
  const startAnimation = useCallback(() => {
    if (!enabled || favorites.length <= 1) {
      return;
    }

    // Останавливаем предыдущую анимацию
    stopAnimationRef.current?.();

    let currentIndex = 0;
    let transitionProgress = 0;
    let isInTransition = false;
    let transitionStartTime = 0;

    const transitionDelay = calculateTransitionDelay(speed);

    const animate = (deltaTime: number) => {
      const now = performance.now();

      // Если не в переходе, ждем
      if (!isInTransition) {
        if (now - lastUpdateTimeRef.current >= transitionDelay) {
          isInTransition = true;
          transitionStartTime = now;
          transitionProgress = 0;
        }
        return true; // Продолжаем анимацию
      }

      // Вычисляем прогресс перехода
      const elapsed = now - transitionStartTime;
      const transitionDuration = 1000; // 1 секунда на переход
      transitionProgress = Math.min(elapsed / transitionDuration, 1);

      // Получаем текущий и следующий цвет
      const fromColor = hexToRgb(favorites[currentIndex]);
      const toColor = hexToRgb(favorites[(currentIndex + 1) % favorites.length]);

      if (!fromColor || !toColor) return true;

      // Интерполируем цвет используя OKLAB для перцептуально точных переходов
      const interpolated = interpolateOklab(fromColor, toColor, transitionProgress);

      // Обновляем CSS переменную (БЕЗ перерисовки React!)
      updateCSSVariable(interpolated);

      // Переход завершен
      if (transitionProgress >= 1) {
        currentIndex = (currentIndex + 1) % favorites.length;
        isInTransition = false;
        lastUpdateTimeRef.current = now;

        // Обновляем состояние только раз в конце перехода (вместо 510 раз!)
        setState((prev) => ({
          ...prev,
          currentHex: rgbToHex(interpolated),
          currentRgb: interpolated,
          currentIndex,
          progress: 0,
        }));

        // Вызываем callback если есть
        onColorChange?.( rgbToHex(interpolated), interpolated);
      }

      return true; // Продолжаем анимацию
    };

    // Запускаем цикл анимации
    lastUpdateTimeRef.current = performance.now();
    const stopFn = createAnimationLoop(animate);
    stopAnimationRef.current = stopFn;

    setState((prev) => ({ ...prev, isAnimating: true }));
  }, [enabled, favorites, speed, onColorChange, updateCSSVariable]);

  // Останавливаем анимацию
  const stopAnimation = useCallback(() => {
    stopAnimationRef.current?.();
    stopAnimationRef.current = null;
    setState((prev) => ({ ...prev, isAnimating: false }));
  }, []);

  // Перезапускаем анимацию при изменении параметров
  useEffect(() => {
    if (enabled && favorites.length > 1) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [enabled, favorites, speed, startAnimation, stopAnimation]);

  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      stopAnimationRef.current?.();
    };
  }, []);

  return {
    ...state,
    startAnimation,
    stopAnimation,
  };
}
