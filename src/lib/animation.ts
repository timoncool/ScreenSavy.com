/**
 * Animation Utilities
 * Оптимизированные утилиты для анимаций
 */

import type { Rgb } from "./color";
import { ANIMATION_CONSTANTS } from "./constants";

/**
 * Интерполяция между двумя RGB цветами
 * Использует easing для более плавных переходов
 */
export function interpolateColor(
  from: Rgb,
  to: Rgb,
  progress: number,
  easing: (t: number) => number = easeInOutCubic
): Rgb {
  const t = Math.max(0, Math.min(1, progress));
  const easedProgress = easing(t);

  return {
    r: Math.round(from.r + (to.r - from.r) * easedProgress),
    g: Math.round(from.g + (to.g - from.g) * easedProgress),
    b: Math.round(from.b + (to.b - from.b) * easedProgress),
  };
}

/**
 * Easing функции для плавных анимаций
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeLinear(t: number): number {
  return t;
}

export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Вычисляет оптимальное количество шагов для анимации
 * Основано на расстоянии между цветами
 */
export function calculateOptimalSteps(from: Rgb, to: Rgb): number {
  const distance = Math.max(
    Math.abs(to.r - from.r),
    Math.abs(to.g - from.g),
    Math.abs(to.b - from.b)
  );

  // Минимум 20 шагов для плавности, максимум 100 для производительности
  return Math.max(
    ANIMATION_CONSTANTS.MIN_STEPS,
    Math.min(ANIMATION_CONSTANTS.MAX_STEPS, distance)
  );
}

/**
 * Вычисляет задержку между цветами на основе скорости
 */
export function calculateTransitionDelay(speed: number): number {
  const { SLOWEST_DELAY, FASTEST_DELAY } = ANIMATION_CONSTANTS;
  const progress = Math.max(0, Math.min(100, speed)) / 100;
  return Math.round(SLOWEST_DELAY - progress * (SLOWEST_DELAY - FASTEST_DELAY));
}

/**
 * Класс для управления requestAnimationFrame с поддержкой отмены
 */
export class AnimationFrameController {
  private frameId: number | null = null;

  request(callback: FrameRequestCallback): void {
    this.cancel();
    this.frameId = requestAnimationFrame(callback);
  }

  cancel(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  isActive(): boolean {
    return this.frameId !== null;
  }
}

/**
 * Создает оптимизированный цикл анимации
 */
export function createAnimationLoop(
  callback: (deltaTime: number) => boolean | void,
  onComplete?: () => void
): () => void {
  let rafId: number | null = null;
  let lastTime = performance.now();
  let running = true;

  const loop = (currentTime: number) => {
    if (!running) return;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    const shouldContinue = callback(deltaTime);

    if (shouldContinue !== false) {
      rafId = requestAnimationFrame(loop);
    } else {
      onComplete?.();
    }
  };

  rafId = requestAnimationFrame(loop);

  // Возвращаем функцию для остановки анимации
  return () => {
    running = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

/**
 * Батчинг обновлений для производительности
 */
export class UpdateBatcher<T> {
  private pending: T | null = null;
  private rafId: number | null = null;
  private callback: (value: T) => void;

  constructor(callback: (value: T) => void) {
    this.callback = callback;
  }

  schedule(value: T): void {
    this.pending = value;

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        if (this.pending !== null) {
          this.callback(this.pending);
          this.pending = null;
        }
        this.rafId = null;
      });
    }
  }

  cancel(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pending = null;
  }

  flush(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.pending !== null) {
      this.callback(this.pending);
      this.pending = null;
    }
  }
}
