export type Rgb = {
  r: number;
  g: number;
  b: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const hexToRgb = (hex: string): Rgb | null => {
  if (!hex) {
    return null;
  }

  let normalized = hex.trim();
  if (!normalized.startsWith('#')) {
    normalized = `#${normalized}`;
  }

  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  normalized = normalized.replace(
    shorthandRegex,
    (_, r, g, b) => r + r + g + g + b + b
  );

  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  if (!match) {
    return null;
  }

  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16)
  };
};

export const rgbToHex = ({ r, g, b }: Rgb): string =>
  `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();

const hueToRgb = (p: number, q: number, t: number) => {
  let temp = t;
  if (temp < 0) temp += 1;
  if (temp > 1) temp -= 1;
  if (temp < 1 / 6) return p + (q - p) * 6 * temp;
  if (temp < 1 / 2) return q;
  if (temp < 2 / 3) return p + (q - p) * (2 / 3 - temp) * 6;
  return p;
};

export const hslToRgb = (h: number, s: number, l: number): Rgb => {
  if (s === 0) {
    const value = Math.round(l * 255);
    return { r: value, g: value, b: value };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hueToRgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hueToRgb(p, q, h) * 255);
  const b = Math.round(hueToRgb(p, q, h - 1 / 3) * 255);

  return { r, g, b };
};

export const generateShadeSets = (color: Rgb) => {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  let saturation = 0;
  if (max !== min) {
    saturation =
      lightness > 0.5
        ? (max - min) / (2 - max - min)
        : (max - min) / (max + min);
  }

  let hue = 0;
  if (max !== min) {
    if (max === r) {
      hue = (g - b) / (max - min) + (g < b ? 6 : 0);
    } else if (max === g) {
      hue = (b - r) / (max - min) + 2;
    } else {
      hue = (r - g) / (max - min) + 4;
    }
    hue /= 6;
  }

  const baseHexShades = Array.from({ length: 8 }, (_, index) => {
    const l = 0.1 + (index * 0.8) / 7;
    return rgbToHex(hslToRgb(hue, saturation, l));
  });

  const saturationHexShades = Array.from({ length: 8 }, (_, index) => {
    const s = 0.1 + ((7 - index) * 0.9) / 7;
    return rgbToHex(hslToRgb(hue, s, lightness));
  });

  const adjacentHexShades = Array.from({ length: 8 }, (_, index) => {
    const hShift = (hue - 0.1 + (index * 0.2) / 7 + 1) % 1;
    return rgbToHex(hslToRgb(hShift, saturation, lightness));
  });

  return {
    baseHexShades,
    saturationHexShades,
    adjacentHexShades
  };
};

export const SPEED_MIN = 0;
export const SPEED_MAX = 100;

const SLOWEST_DELAY = 60000;
const FASTEST_DELAY = 500;

export const getSpeedDelay = (speed: number) => {
  const clamped = clamp(speed, SPEED_MIN, SPEED_MAX);
  const progress = (clamped - SPEED_MIN) / (SPEED_MAX - SPEED_MIN);

  return Math.round(SLOWEST_DELAY - progress * (SLOWEST_DELAY - FASTEST_DELAY));
};

export const clampChannel = (value: number) => clamp(Math.round(value), 0, 255);

// ==================== OKLAB COLOR SPACE ====================
/**
 * OKLAB - Perceptually uniform color space
 * Значительно лучше для интерполяции цветов чем RGB или HSL
 *
 * Преимущества:
 * - Перцептуально линейное пространство (равные шаги = равные визуальные различия)
 * - Нет "провала" через серый при переходе между противоположными цветами
 * - Простая математика (в отличие от LAB)
 * - Поддерживается современными браузерами в CSS Level 4
 */

export type Oklab = {
  l: number; // Lightness: 0-1
  a: number; // Green-Red: ~-0.4 to ~0.4
  b: number; // Blue-Yellow: ~-0.4 to ~0.4
};

/**
 * Конвертация sRGB в линейный RGB
 */
const srgbToLinear = (channel: number): number => {
  const c = channel / 255;
  return c <= 0.04045
    ? c / 12.92
    : Math.pow((c + 0.055) / 1.055, 2.4);
};

/**
 * Конвертация линейного RGB в sRGB
 */
const linearToSrgb = (channel: number): number => {
  const c = channel <= 0.0031308
    ? 12.92 * channel
    : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
  return Math.round(clamp(c * 255, 0, 255));
};

/**
 * Конвертация RGB в OKLAB
 */
export const rgbToOklab = (rgb: Rgb): Oklab => {
  // Конвертируем в линейный RGB
  const lr = srgbToLinear(rgb.r);
  const lg = srgbToLinear(rgb.g);
  const lb = srgbToLinear(rgb.b);

  // Конвертируем в LMS cone response
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  // Нелинейное преобразование
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // Конвертируем в OKLAB
  return {
    l: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
};

/**
 * Конвертация OKLAB в RGB
 */
export const oklabToRgb = (oklab: Oklab): Rgb => {
  // Конвертируем OKLAB в LMS
  const l_ = oklab.l + 0.3963377774 * oklab.a + 0.2158037573 * oklab.b;
  const m_ = oklab.l - 0.1055613458 * oklab.a - 0.0638541728 * oklab.b;
  const s_ = oklab.l - 0.0894841775 * oklab.a - 1.2914855480 * oklab.b;

  // Обратное нелинейное преобразование
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // Конвертируем LMS в линейный RGB
  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Конвертируем в sRGB
  return {
    r: linearToSrgb(lr),
    g: linearToSrgb(lg),
    b: linearToSrgb(lb),
  };
};

/**
 * Интерполяция между двумя цветами в пространстве OKLAB
 * ЗНАЧИТЕЛЬНО ЛУЧШЕ чем интерполяция в RGB!
 *
 * @param from - Начальный цвет
 * @param to - Конечный цвет
 * @param t - Прогресс (0-1)
 * @returns Интерполированный цвет
 */
export const interpolateOklab = (from: Rgb, to: Rgb, t: number): Rgb => {
  const progress = clamp(t, 0, 1);

  // Конвертируем в OKLAB
  const fromOklab = rgbToOklab(from);
  const toOklab = rgbToOklab(to);

  // Линейная интерполяция в OKLAB пространстве
  const interpolated: Oklab = {
    l: fromOklab.l + (toOklab.l - fromOklab.l) * progress,
    a: fromOklab.a + (toOklab.a - fromOklab.a) * progress,
    b: fromOklab.b + (toOklab.b - fromOklab.b) * progress,
  };

  // Конвертируем обратно в RGB
  return oklabToRgb(interpolated);
};

// ==================== ACCESSIBILITY ====================
/**
 * Вычисление относительной яркости по WCAG
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export const getRelativeLuminance = (rgb: Rgb): number => {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Вычисление контрастности между двумя цветами по WCAG
 * Результат от 1 (нет контраста) до 21 (максимальный контраст)
 *
 * WCAG требования:
 * - AA: минимум 4.5:1 для обычного текста, 3:1 для крупного
 * - AAA: минимум 7:1 для обычного текста, 4.5:1 для крупного
 */
export const getContrastRatio = (color1: Rgb, color2: Rgb): number => {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Получить доступный цвет текста (белый или черный) для данного фона
 * Гарантирует контрастность минимум 4.5:1 (WCAG AA)
 */
export const getAccessibleTextColor = (bgColor: Rgb): Rgb => {
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  const whiteContrast = getContrastRatio(bgColor, white);
  const blackContrast = getContrastRatio(bgColor, black);

  return whiteContrast > blackContrast ? white : black;
};

/**
 * Проверка соответствия WCAG AAA (7:1) для текста
 */
export const meetsWCAGAAA = (bgColor: Rgb, textColor: Rgb): boolean => {
  return getContrastRatio(bgColor, textColor) >= 7;
};

/**
 * Проверка соответствия WCAG AA (4.5:1) для текста
 */
export const meetsWCAGAA = (bgColor: Rgb, textColor: Rgb): boolean => {
  return getContrastRatio(bgColor, textColor) >= 4.5;
};
