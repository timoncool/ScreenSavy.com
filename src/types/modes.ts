/**
 * ScreenSavy Mode Types
 * Типы для различных режимов работы приложения
 */

export type ModeKey = "oneColor" | "colorChange" | "clock" | "text" | "video" | "custom";

export type ClockStyle = "modern" | "full" | "minimal";

export type TextFontSize = "small" | "medium" | "large";

export type TextAlignment = "left" | "center" | "right";

export interface TextStyles {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export interface TextOutline {
  enabled: boolean;
  color: string;
  width: number;
}

export interface TextModeConfig {
  text: string;
  fontSize: TextFontSize;
  fontFamily: string;
  color: string;
  alignment: TextAlignment;
  styles: TextStyles;
  outline: TextOutline;
}

export interface ClockModeConfig {
  style: ClockStyle;
}

export interface ColorChangeModeConfig {
  speed: number;
  favorites: string[];
}

export interface ModeConfig {
  text?: TextModeConfig;
  clock?: ClockModeConfig;
  colorChange?: ColorChangeModeConfig;
}

// Для будущих режимов
export interface VideoPlayerConfig {
  url?: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  volume: number;
}

export interface CustomScreensaverConfig {
  id: string;
  name: string;
  code: string;
  settings: Record<string, unknown>;
}
