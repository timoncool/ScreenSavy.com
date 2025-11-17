/**
 * Application Constants
 * Централизованное хранение всех констант
 */

import type { TextFontSize, ModeKey } from "@/types";

// ==================== STORAGE KEYS ====================
export const STORAGE_KEYS = {
  MAIN_UI: "screensavy-main-ui",
  MAIN_COLOR: "screensavy-main-color",
  MAIN_RGB: "screensavy-main-rgb",
  MAIN_FAVORITES: "screensavy-main-favorites",
  MAIN_SPEED: "screensavy-main-speed",
  VISITED: "screensavy-visited",
} as const;

// ==================== DEFAULTS ====================
export const DEFAULT_COLOR = "#5508FD";
export const DEFAULT_RGB = { r: 85, g: 8, b: 253 };

export const DEFAULT_FAVORITES = [
  "#FF0000",
  "#FFA500",
  "#FFFF00",
  "#00FF00",
  "#0000FF",
  "#4B0082",
  "#9400D3",
];

export const SPEED_MIN = 0;
export const SPEED_MAX = 100;
export const DEFAULT_SPEED_RATIO = 0.65;
export const DEFAULT_SPEED = Math.min(
  SPEED_MAX,
  Math.max(SPEED_MIN, SPEED_MIN + (SPEED_MAX - SPEED_MIN) * DEFAULT_SPEED_RATIO)
);

// ==================== UI DEFAULTS ====================
export const DEFAULT_UI_STATE = {
  showShades: true,
  showRgbPanel: true,
  showFavorites: true,
  menuOpen: false,
  hintsEnabled: true,
  aboutOpen: false,
  interfaceHidden: false,
  textOptionsOpen: false,
} as const;

// ==================== ANIMATION ====================
export const ANIMATION_CONSTANTS = {
  // Для colorChange режима
  MIN_STEPS: 20,
  MAX_STEPS: 100,
  OPTIMAL_FPS: 60,
  FRAME_TIME: 1000 / 60, // ~16.67ms

  // Delays для скорости
  SLOWEST_DELAY: 60000,
  FASTEST_DELAY: 500,
} as const;

// ==================== TEXT MODE ====================
export const FONT_FAMILIES = {
  Inter: "'Inter', sans-serif",
  "Roboto Mono": "'Roboto Mono', monospace",
  Arial: "Arial, sans-serif",
  "Times New Roman": "'Times New Roman', serif",
  "Courier New": "'Courier New', monospace",
  Montserrat: "'Montserrat', sans-serif",
  "Playfair Display": "'Playfair Display', serif",
  Oswald: "'Oswald', sans-serif",
  Raleway: "'Raleway', sans-serif",
  Lobster: "'Lobster', cursive",
  Pacifico: "'Pacifico', cursive",
  "Dancing Script": "'Dancing Script', cursive",
  Caveat: "'Caveat', cursive",
  "Bebas Neue": "'Bebas Neue', sans-serif",
  Comfortaa: "'Comfortaa', cursive",
  Unbounded: "'Unbounded', sans-serif",
  "Russo One": "'Russo One', sans-serif",
  Philosopher: "'Philosopher', sans-serif",
  "PT Sans": "'PT Sans', sans-serif",
  "Amatic SC": "'Amatic SC', cursive",
  "Bad Script": "'Bad Script', cursive",
  "El Messiri": "'El Messiri', sans-serif",
  Neucha: "'Neucha', cursive",
  "Marck Script": "'Marck Script', cursive",
  "Poiret One": "'Poiret One', cursive",
  "Press Start 2P": "'Press Start 2P', cursive",
  "Kelly Slab": "'Kelly Slab', cursive",
  "Yeseva One": "'Yeseva One', cursive",
} as const;

export const FONT_SIZE_CLASS_MAP: Record<TextFontSize, string> = {
  small: "text-small",
  medium: "text-medium",
  large: "text-large",
} as const;

export const STYLE_PRESETS = {
  neon: {
    font: "Unbounded",
    size: "large" as TextFontSize,
    color: "#00FFFF",
    stroke: { enabled: true, color: "#FF00FF", width: 3 },
    styles: { bold: true, italic: false, underline: false },
  },
  classic: {
    font: "Playfair Display",
    size: "medium" as TextFontSize,
    color: "#FFFFFF",
    stroke: { enabled: true, color: "#000000", width: 1 },
    styles: { bold: false, italic: false, underline: false },
  },
  minimal: {
    font: "Inter",
    size: "medium" as TextFontSize,
    color: "#FFFFFF",
    stroke: { enabled: false, color: "#000000", width: 0 },
    styles: { bold: false, italic: false, underline: false },
  },
  nature: {
    font: "Caveat",
    size: "large" as TextFontSize,
    color: "#8BC34A",
    stroke: { enabled: true, color: "#3E5F22", width: 2 },
    styles: { bold: false, italic: false, underline: false },
  },
  romantic: {
    font: "Dancing Script",
    size: "large" as TextFontSize,
    color: "#FF69B4",
    stroke: { enabled: true, color: "#C71585", width: 1 },
    styles: { bold: false, italic: true, underline: false },
  },
  retro: {
    font: "Press Start 2P",
    size: "medium" as TextFontSize,
    color: "#FFFF00",
    stroke: { enabled: true, color: "#FF4500", width: 2 },
    styles: { bold: true, italic: false, underline: false },
  },
  cyber: {
    font: "Russo One",
    size: "large" as TextFontSize,
    color: "#00FF00",
    stroke: { enabled: true, color: "#000000", width: 2 },
    styles: { bold: true, italic: false, underline: false },
  },
} as const;

// ==================== MODE TOOLBAR ====================
export const TOP_TOOLBAR_BUTTONS = [
  "menu",
  "randomColor",
  "toggleShades",
  "toggleRgb",
  "toggleFavorites",
  "picker",
  "textOptions",
  "toggleHints",
] as const;

// ==================== PERFORMANCE ====================
export const PERFORMANCE_CONFIG = {
  // Дебаунс для тяжелых операций
  DEBOUNCE_COLOR_CHANGE: 50,
  DEBOUNCE_SHADE_GENERATION: 100,

  // Батчинг
  BATCH_UPDATE_INTERVAL: 16, // ~60fps

  // Мемоизация
  SHADE_CACHE_SIZE: 50,
} as const;

// ==================== Z-INDEX LAYERS ====================
export const Z_INDEX = {
  BACKGROUND: 0,
  CONTENT: 5,
  SHADES_PANEL: 20,
  SPEED_CONTROL: 25,
  RGB_PANEL: 30,
  CLOCK_CONTROLS: 40,
  TOOLBAR: 50,
  MENU: 100,
  WELCOME: 200,
  MODAL: 1000,
  VISUALIZER_OVERLAY: 1200,
} as const;

// ==================== MODE SETTINGS ====================
export const DEFAULT_MODE_CONFIGS = {
  oneColor: {},
  colorChange: {
    speed: DEFAULT_SPEED,
    favorites: DEFAULT_FAVORITES,
  },
  clock: {
    style: "modern" as const,
  },
  text: {
    text: "ScreenSavy",
    fontSize: "medium" as TextFontSize,
    fontFamily: "Inter",
    color: "#FFFFFF",
    alignment: "center" as const,
    styles: { bold: false, italic: false, underline: false },
    outline: { enabled: false, color: "#000000", width: 1 },
  },
} as const;
