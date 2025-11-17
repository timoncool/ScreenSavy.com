/**
 * Theme and Color Types
 * Типы для цветов и темы приложения
 */

import type { Rgb } from "@/lib/color";

export interface ColorState {
  hex: string;
  rgb: Rgb;
}

export interface UIState {
  showShades: boolean;
  showRgbPanel: boolean;
  showFavorites: boolean;
  menuOpen: boolean;
  hintsEnabled: boolean;
  aboutOpen: boolean;
  interfaceHidden: boolean;
  textOptionsOpen: boolean;
}

export interface HintState {
  showWelcome: boolean;
  showColorsHint: boolean;
  showShadesHint: boolean;
  showPickerHint: boolean;
  showTextHint: boolean;
}

export interface AnimationState {
  isAnimating: boolean;
  currentIndex: number;
  progress: number;
  isPaused: boolean;
}

export interface FullscreenState {
  isFullscreen: boolean;
}

export interface PickerState {
  isActive: boolean;
}
