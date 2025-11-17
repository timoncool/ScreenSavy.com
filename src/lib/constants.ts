/**
 * Application Constants
 * Centralized constants to avoid magic numbers and improve maintainability
 */

// Speed thresholds
export const SPEED_THRESHOLD = {
  SLOW: 33,
  FAST: 67,
  MIN: 1,
  MAX: 100,
} as const;

// Animation constants
export const ANIMATION = {
  COLOR_TRANSITION_STEPS: 510,
  FPS_TARGET: 60,
  FRAME_TIME: 1000 / 60, // ~16.67ms
} as const;

// Timing constants (in milliseconds)
export const TIMING = {
  DEBOUNCE_DEFAULT: 300,
  DEBOUNCE_SEARCH: 500,
  THROTTLE_SCROLL: 100,
  NOTIFICATION_DURATION: 3000,
  TOOLTIP_DELAY: 500,
} as const;

// Z-index layers
export const Z_INDEX = {
  BASE: 1,
  TOOLBAR: 10,
  DROPDOWN: 100,
  MODAL: 1000,
  NOTIFICATION: 2000,
  TOOLTIP: 3000,
} as const;

// Breakpoints (in pixels)
export const BREAKPOINT = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
} as const;

// Color picker constants
export const COLOR_PICKER = {
  HUE_MAX: 360,
  SV_MAX: 100,
  RGB_MAX: 255,
  ALPHA_MAX: 1,
} as const;

// Storage keys
export const STORAGE_KEY = {
  MAIN_COLOR: 'screensavy-main-color',
  MAIN_RGB: 'screensavy-main-rgb',
  FAVORITES: 'screensavy-favorites',
  SPEED: 'screensavy-speed',
  ACTIVE_MODES: 'screensavy-active-modes',
  LANGUAGE: 'screensavy-language',
  CLOCK_STYLE: 'screensavy-clock-style',
  TEXT_OPTIONS: 'screensavy-text-options',
  MAIN_UI: 'screensavy-main-ui',
  WELCOME_SHOWN: 'screensavy-welcome-shown',
} as const;

// Default values
export const DEFAULTS = {
  COLOR: '#5508FD',
  RGB: { r: 85, g: 8, b: 253 },
  SPEED: 50,
  LANGUAGE: 'en' as const,
} as const;
