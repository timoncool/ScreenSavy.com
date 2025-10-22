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
    const s = 0.1 + (index * 0.9) / 7;
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
export const SPEED_MAX = 10;

const SLOWEST_DELAY = 15000;
const FASTEST_DELAY = 500;

export const getSpeedDelay = (speed: number) => {
  const clamped = clamp(speed, SPEED_MIN, SPEED_MAX);
  const progress = (clamped - SPEED_MIN) / (SPEED_MAX - SPEED_MIN);

  return Math.round(SLOWEST_DELAY - progress * (SLOWEST_DELAY - FASTEST_DELAY));
};

export const clampChannel = (value: number) => clamp(Math.round(value), 0, 255);
