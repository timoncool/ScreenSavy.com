"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  clampChannel,
  getSpeedDelay,
  hexToRgb,
  rgbToHex,
  type Rgb,
} from "@/lib/color";
import {
  getTextTranslation,
  textTranslations,
  type TextTranslationKey,
} from "./textTranslations";
import {
  getTranslation,
  type Language,
  type LanguageSetting,
  type MainTranslationKey,
} from "./translations";
import {
  AboutModal,
  IconButton,
  INITIAL_FAVORITES,
  RgbPanel,
  ShadesPanel,
  SliderChannel,
  SpeedControl,
  WelcomeNotification,
  dayNames,
  detectBrowserLanguage,
  useAnimationFrame,
} from "./shared";
import type { CommonTranslationKey } from "./shared";

type ModeKey = "text" | "oneColor" | "colorChange";
type ClockStyle = "modern" | "full" | "minimal";

type TextFontSize = "small" | "medium" | "large";
type TextAlignment = "left" | "center" | "right";

const TEXT_UI_STORAGE_KEY = "screensavy-text-ui";
const TEXT_UI_DEFAULTS = {
  showShades: true,
  showRgbPanel: true,
  menuOpen: false,
  hintsEnabled: true,
  aboutOpen: false,
  textOptionsOpen: false,
};

const isTextTranslationKey = (
  key: CommonTranslationKey,
): key is TextTranslationKey => key in textTranslations.en;

type FavoritesPanelProps = {
  favorites: string[];
  translation: (key: TextTranslationKey) => string;
  hintsEnabled: boolean;
  showHint: boolean;
  onCloseHint: () => void;
  onAddFavorite: () => void;
  onClearFavorites: () => void;
  onSelectFavorite: (hex: string) => void;
  onRemoveFavorite: (hex: string) => void;
  interfaceHidden: boolean;
};

const FavoritesPanel = ({
  favorites,
  translation,
  hintsEnabled,
  showHint,
  onCloseHint,
  onAddFavorite,
  onClearFavorites,
  onSelectFavorite,
  onRemoveFavorite,
  interfaceHidden,
}: FavoritesPanelProps) => (
  <div
    className="saved-colors"
    style={{
      opacity: interfaceHidden ? 0 : 1,
      pointerEvents: interfaceHidden ? "none" : "auto",
    }}
  >
    {hintsEnabled && showHint && (
      <div className="colors-hint hint">
        <p>{translation("colorsHint")}</p>
        <button
          type="button"
          className="hint-close-button"
          onClick={onCloseHint}
        >
          <i className="material-symbols-outlined">close</i>
        </button>
      </div>
    )}
    <div className="favorite-buttons">
      <div
        className="add-to-favorites-button"
        onClick={onAddFavorite}
        title={translation("addToFavorites")}
        role="button"
      >
        <i className="material-symbols-outlined">favorite</i>
      </div>
      <div
        className="clear-favorites-button"
        onClick={onClearFavorites}
        title={translation("clearFavorites")}
        role="button"
      >
        <i className="material-symbols-outlined">delete_forever</i>
      </div>
    </div>
    {favorites.map((favorite) => (
      <div key={favorite} className="saved-color-container">
        <div
          className="saved-color"
          style={{ backgroundColor: favorite }}
          onClick={() => onSelectFavorite(favorite)}
        />
        <div
          className="delete-color"
          onClick={(event) => {
            event.stopPropagation();
            onRemoveFavorite(favorite);
          }}
        >
          <i className="material-symbols-outlined" style={{ fontSize: "12px" }}>
            close
          </i>
        </div>
      </div>
    ))}
  </div>
);

type PickerHintProps = {
  visible: boolean;
  translation: (key: TextTranslationKey) => string;
  onClose: () => void;
};

const PickerHint = ({ visible, translation, onClose }: PickerHintProps) => {
  if (!visible) return null;
  return (
    <div className="picker-info hint">
      <p>{translation("pickerHint")}</p>
      <button type="button" className="hint-close-button" onClick={onClose}>
        <i className="material-symbols-outlined">close</i>
      </button>
    </div>
  );
};

type MetaTagsProps = {
  language: Language;
};

const TextMetaTags = ({ language }: MetaTagsProps) => {
  const title =
    language === "ru"
      ? "ScreenSavy Text - Текстовые заставки для экрана"
      : "ScreenSavy Text - Custom Text Screen Backgrounds";

  const description =
    language === "ru"
      ? "ScreenSavy Text - режим для отображения произвольного текста на цветном фоне. Настраивайте текст, шрифт и размер."
      : "ScreenSavy Text is a mode for displaying custom text on a colored background. Customize text, font and size.";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet="UTF-8" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Bad+Script&family=Bebas+Neue&family=Caveat:wght@400;700&family=Comfortaa:wght@300;400;700&family=Cormorant:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@400;700&family=El+Messiri:wght@400;700&family=Inter:wght@300;400;700&family=Kelly+Slab&family=Lobster&family=Marck+Script&family=Montserrat:ital,wght@0,400;0,700;1,400&family=Neucha&family=Oswald:wght@400;700&family=PT+Sans:ital,wght@0,400;0,700;1,400&family=Pacifico&family=Philosopher:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poiret+One&family=Press+Start+2P&family=Raleway:ital,wght@0,300;0,400;0,700;1,400&family=Roboto+Mono:wght@400;700&family=Russo+One&family=Unbounded:wght@400;700&family=Yeseva+One&display=swap"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />
    </Helmet>
  );
};

const fontSizeClassMap: Record<TextFontSize, string> = {
  small: "text-small",
  medium: "text-medium",
  large: "text-large",
};

const fontFamilies: Record<string, string> = {
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
};

type TextDisplayProps = {
  text: string;
  fontSize: TextFontSize;
  fontFamily: string;
  styles: { bold: boolean; italic: boolean; underline: boolean };
  color: string;
  outline: { enabled: boolean; color: string; width: number };
  alignment: TextAlignment;
  translation: (key: TextTranslationKey) => string;
};

const TextDisplay = ({
  text,
  fontSize,
  fontFamily,
  styles,
  color,
  outline,
  alignment,
  translation,
}: TextDisplayProps) => {
  const style: React.CSSProperties = {
    fontFamily: fontFamilies[fontFamily] ?? "'Inter', sans-serif",
    fontWeight: styles.bold ? "bold" : "normal",
    fontStyle: styles.italic ? "italic" : "normal",
    textDecoration: styles.underline ? "underline" : "none",
    textAlign: alignment,
    color,
  };

  if (outline.enabled) {
    style.WebkitTextStroke = `${outline.width}px ${outline.color}`;
    style.textShadow = `0 0 1px ${outline.color}`;
  }

  return (
    <div className={`text-display ${fontSizeClassMap[fontSize]}`}>
      <div className="text-content" style={style}>
        {text || translation("enterText")}
      </div>
    </div>
  );
};

const STYLE_PRESETS: Record<
  string,
  {
    font: string;
    size: TextFontSize;
    color: string;
    stroke: { enabled: boolean; color: string; width: number };
    styles: { bold: boolean; italic: boolean; underline: boolean };
  }
> = {
  neon: {
    font: "Unbounded",
    size: "large",
    color: "#00FFFF",
    stroke: { enabled: true, color: "#FF00FF", width: 3 },
    styles: { bold: true, italic: false, underline: false },
  },
  classic: {
    font: "Playfair Display",
    size: "medium",
    color: "#FFFFFF",
    stroke: { enabled: true, color: "#000000", width: 1 },
    styles: { bold: false, italic: false, underline: false },
  },
  minimal: {
    font: "Inter",
    size: "medium",
    color: "#FFFFFF",
    stroke: { enabled: false, color: "#000000", width: 0 },
    styles: { bold: false, italic: false, underline: false },
  },
  nature: {
    font: "Caveat",
    size: "large",
    color: "#8BC34A",
    stroke: { enabled: true, color: "#3E5F22", width: 2 },
    styles: { bold: false, italic: false, underline: false },
  },
  romantic: {
    font: "Dancing Script",
    size: "large",
    color: "#FF69B4",
    stroke: { enabled: true, color: "#C71585", width: 1 },
    styles: { bold: false, italic: true, underline: false },
  },
  retro: {
    font: "Press Start 2P",
    size: "medium",
    color: "#FFFF00",
    stroke: { enabled: true, color: "#FF4500", width: 2 },
    styles: { bold: true, italic: false, underline: false },
  },
  cyber: {
    font: "Russo One",
    size: "large",
    color: "#00FF00",
    stroke: { enabled: true, color: "#000000", width: 2 },
    styles: { bold: true, italic: false, underline: false },
  },
};

const fontOptions = Object.keys(fontFamilies);

type TextOptionsPanelProps = {
  visible: boolean;
  translation: (key: TextTranslationKey) => string;
  showHint: boolean;
  onCloseHint: () => void;
  textValue: string;
  onTextChange: (value: string, caret: number | null) => void;
  textInputRef: React.RefObject<HTMLInputElement>;
  presets: typeof STYLE_PRESETS;
  onApplyPreset: (name: string) => void;
  fontSize: TextFontSize;
  onFontSizeChange: (size: TextFontSize) => void;
  fontFamily: string;
  onFontFamilyChange: (family: string) => void;
  textColor: string;
  onTextColorChange: (color: string) => void;
  outline: { enabled: boolean; color: string; width: number };
  onOutlineChange: (outline: {
    enabled: boolean;
    color: string;
    width: number;
  }) => void;
  alignment: TextAlignment;
  onAlignmentChange: (alignment: TextAlignment) => void;
  styles: { bold: boolean; italic: boolean; underline: boolean };
  onToggleStyle: (style: "bold" | "italic" | "underline") => void;
};

const TextOptionsPanel = ({
  visible,
  translation,
  showHint,
  onCloseHint,
  textValue,
  onTextChange,
  textInputRef,
  presets,
  onApplyPreset,
  fontSize,
  onFontSizeChange,
  fontFamily,
  onFontFamilyChange,
  textColor,
  onTextColorChange,
  outline,
  onOutlineChange,
  alignment,
  onAlignmentChange,
  styles,
  onToggleStyle,
}: TextOptionsPanelProps) => {
  if (!visible) return null;

  return (
    <div className="text-options-panel">
      {showHint && (
        <div className="text-hint hint">
          <p>{translation("textHint")}</p>
          <button
            type="button"
            className="hint-close-button"
            onClick={onCloseHint}
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>
      )}
      <div className="text-option-group">
        <label>{translation("enterText")}</label>
        <input
          type="text"
          value={textValue}
          onChange={(event) =>
            onTextChange(event.target.value, event.target.selectionStart)
          }
          ref={textInputRef}
          className="text-input"
          placeholder={translation("enterText")}
        />
      </div>
      <div className="text-option-group">
        <label>Style Presets</label>
        <div className="preset-chips">
          {Object.keys(presets).map((preset) => (
            <div
              key={preset}
              className={`preset-chip ${preset}`}
              onClick={() => onApplyPreset(preset)}
            >
              {preset.charAt(0).toUpperCase() + preset.slice(1)}
            </div>
          ))}
        </div>
      </div>
      <div className="text-option-group">
        <label>{translation("fontSize")}</label>
        <div className="button-group">
          <button
            type="button"
            className={`option-button ${fontSize === "small" ? "active" : ""}`}
            onClick={() => onFontSizeChange("small")}
          >
            {translation("small")}
          </button>
          <button
            type="button"
            className={`option-button ${fontSize === "medium" ? "active" : ""}`}
            onClick={() => onFontSizeChange("medium")}
          >
            {translation("medium")}
          </button>
          <button
            type="button"
            className={`option-button ${fontSize === "large" ? "active" : ""}`}
            onClick={() => onFontSizeChange("large")}
          >
            {translation("large")}
          </button>
        </div>
      </div>
      <div className="text-option-group">
        <label>{translation("fontFamily")}</label>
        <select
          value={fontFamily}
          onChange={(event) => onFontFamilyChange(event.target.value)}
          className="font-select"
        >
          {fontOptions.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>
      <div className="text-option-group">
        <label>Text Color</label>
        <input
          type="color"
          value={textColor}
          onChange={(event) => onTextColorChange(event.target.value)}
          className="color-picker"
        />
      </div>
      <div className="text-option-group">
        <label>Text Outline</label>
        <div className="stroke-controls">
          <div className="stroke-toggle">
            <label className="switch">
              <input
                type="checkbox"
                checked={outline.enabled}
                onChange={(event) =>
                  onOutlineChange({ ...outline, enabled: event.target.checked })
                }
              />
              <span className="slider round" />
            </label>
            <span>Enable Outline</span>
          </div>
          <div
            className={`stroke-options ${outline.enabled ? "" : "disabled"}`}
          >
            <div className="stroke-option">
              <label>Color</label>
              <input
                type="color"
                value={outline.color}
                disabled={!outline.enabled}
                onChange={(event) =>
                  onOutlineChange({ ...outline, color: event.target.value })
                }
                className="color-picker"
              />
            </div>
            <div className="stroke-option">
              <label>Width: {outline.width}px</label>
              <input
                type="range"
                min={1}
                max={10}
                value={outline.width}
                disabled={!outline.enabled}
                onChange={(event) =>
                  onOutlineChange({
                    ...outline,
                    width: Number(event.target.value),
                  })
                }
                className="slider"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="text-option-group">
        <label>{translation("textAlign")}</label>
        <div className="button-group">
          <button
            type="button"
            className={`option-button ${alignment === "left" ? "active" : ""}`}
            onClick={() => onAlignmentChange("left")}
          >
            <i className="material-symbols-outlined">format_align_left</i>
          </button>
          <button
            type="button"
            className={`option-button ${alignment === "center" ? "active" : ""}`}
            onClick={() => onAlignmentChange("center")}
          >
            <i className="material-symbols-outlined">format_align_center</i>
          </button>
          <button
            type="button"
            className={`option-button ${alignment === "right" ? "active" : ""}`}
            onClick={() => onAlignmentChange("right")}
          >
            <i className="material-symbols-outlined">format_align_right</i>
          </button>
        </div>
      </div>
      <div className="text-option-group">
        <div className="button-group style-toggles">
          <button
            type="button"
            className={`option-button ${styles.bold ? "active" : ""}`}
            onClick={() => onToggleStyle("bold")}
          >
            <i className="material-symbols-outlined">format_bold</i>
          </button>
          <button
            type="button"
            className={`option-button ${styles.italic ? "active" : ""}`}
            onClick={() => onToggleStyle("italic")}
          >
            <i className="material-symbols-outlined">format_italic</i>
          </button>
          <button
            type="button"
            className={`option-button ${styles.underline ? "active" : ""}`}
            onClick={() => onToggleStyle("underline")}
          >
            <i className="material-symbols-outlined">format_underlined</i>
          </button>
        </div>
      </div>
    </div>
  );
};

const TextModeExperience = () => {
  const [languageSetting, setLanguageSetting] =
    useState<LanguageSetting>("auto");
  const [detectedLanguage, setDetectedLanguage] = useState<Language>("en");
  const [currentHex, setCurrentHex] = useState("#5508FD");
  const [rgb, setRgb] = useState<Rgb>({ r: 85, g: 8, b: 253 });
  const [showShades, setShowShades] = useState(true);
  const [showRgbPanel, setShowRgbPanel] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(INITIAL_FAVORITES);
  const [interfaceHidden, setInterfaceHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModes, setActiveModes] = useState<ModeKey[]>(["text"]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [pickerActive, setPickerActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showColorsHint, setShowColorsHint] = useState(true);
  const [showShadesHint, setShowShadesHint] = useState(true);
  const [showTextHint, setShowTextHint] = useState(true);
  const [showPickerHint, setShowPickerHint] = useState(true);
  const [textValue, setTextValue] = useState("Your custom text here");
  const [fontSize, setFontSize] = useState<TextFontSize>("medium");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [textStyles, setTextStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [outline, setOutline] = useState({
    enabled: false,
    color: "#000000",
    width: 2,
  });
  const [alignment, setAlignment] = useState<TextAlignment>("center");
  const [textOptionsOpen, setTextOptionsOpen] = useState(false);
  const [restoreColorChange, setRestoreColorChange] = useState(false);
  const [uiHydrated, setUiHydrated] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const colorChangeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionIndexRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const animationFrame = useAnimationFrame();

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      setUiHydrated(true);
      return;
    }

    try {
      const stored = window.localStorage.getItem(TEXT_UI_STORAGE_KEY);
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as Partial<{
        showShades: boolean;
        showRgbPanel: boolean;
        menuOpen: boolean;
        hintsEnabled: boolean;
        aboutOpen: boolean;
        textOptionsOpen: boolean;
      }>;

      if (typeof parsed.showShades === "boolean") {
        setShowShades(parsed.showShades);
      }
      if (typeof parsed.showRgbPanel === "boolean") {
        setShowRgbPanel(parsed.showRgbPanel);
      }
      if (typeof parsed.menuOpen === "boolean") {
        setMenuOpen(parsed.menuOpen);
      }
      if (typeof parsed.hintsEnabled === "boolean") {
        setHintsEnabled(parsed.hintsEnabled);
      }
      if (typeof parsed.aboutOpen === "boolean") {
        setAboutOpen(parsed.aboutOpen);
      }
      if (typeof parsed.textOptionsOpen === "boolean") {
        setTextOptionsOpen(parsed.textOptionsOpen);
      }
    } catch (error) {
      console.error("Failed to restore text UI state", error);
    } finally {
      setUiHydrated(true);
    }
  }, []);

  const getText = useCallback(
    (key: TextTranslationKey) =>
      getTextTranslation(languageSetting, detectedLanguage, key),
    [languageSetting, detectedLanguage],
  );

  const getMainText = useCallback(
    (key: MainTranslationKey) =>
      getTranslation(languageSetting, detectedLanguage, key),
    [languageSetting, detectedLanguage],
  );

  const getCommonText = useCallback(
    (key: CommonTranslationKey) =>
      isTextTranslationKey(key) ? getText(key) : getMainText(key),
    [getText, getMainText],
  );

  useEffect(() => {
    setDetectedLanguage(detectBrowserLanguage());
  }, []);

  useEffect(() => {
    if (languageSetting !== "auto") return;
    setDetectedLanguage(detectBrowserLanguage());
  }, [languageSetting]);

  useEffect(() => {
    if (!activeModes.includes("colorChange") || favorites.length <= 1) {
      if (colorChangeTimerRef.current) {
        clearTimeout(colorChangeTimerRef.current);
        colorChangeTimerRef.current = null;
      }
      return;
    }

    let current = hexToRgb(favorites[transitionIndexRef.current]);
    let next = hexToRgb(
      favorites[(transitionIndexRef.current + 1) % favorites.length],
    );
    if (!current || !next) return;

    const step = () => {
      transitionProgressRef.current += 0.01;
      if (transitionProgressRef.current >= 1) {
        transitionIndexRef.current =
          (transitionIndexRef.current + 1) % favorites.length;
        current = hexToRgb(favorites[transitionIndexRef.current]) ?? current;
        next =
          hexToRgb(
            favorites[(transitionIndexRef.current + 1) % favorites.length],
          ) ?? next;
        transitionProgressRef.current = 0;
      }

      const progress = transitionProgressRef.current;
      if (!current || !next) {
        return;
      }
      const interpolated: Rgb = {
        r: Math.round(current.r + progress * (next.r - current.r)),
        g: Math.round(current.g + progress * (next.g - current.g)),
        b: Math.round(current.b + progress * (next.b - current.b)),
      };

      setRgb(interpolated);
      setCurrentHex(rgbToHex(interpolated));

      colorChangeTimerRef.current = setTimeout(
        step,
        getSpeedDelay(speed) / 100,
      );
    };

    colorChangeTimerRef.current = setTimeout(step, 50);

    return () => {
      if (colorChangeTimerRef.current) {
        clearTimeout(colorChangeTimerRef.current);
        colorChangeTimerRef.current = null;
      }
    };
  }, [activeModes, favorites, speed]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("screensavy-text-visited")) {
      setShowWelcome(false);
      setShowPickerHint(false);
      setShowColorsHint(false);
      setShowShadesHint(false);
      setShowTextHint(false);
    } else {
      localStorage.setItem("screensavy-text-visited", "true");
    }
  }, []);

  useEffect(() => {
    const element = rootRef.current;
    if (!pickerActive || !element) return;

    const handleMove = (event: MouseEvent) => {
      animationFrame.request(() => {
        const xRatio = event.clientX / window.innerWidth;
        const yRatio = event.clientY / window.innerHeight;
        const r = clampChannel(xRatio * 255);
        const g = clampChannel((1 - yRatio) * 255);
        const b = clampChannel(((xRatio + yRatio) / 2) * 255);
        const color = { r, g, b };
        setRgb(color);
        setCurrentHex(rgbToHex(color));
      });
    };

    const handleClick = () => setPickerActive(false);

    element.addEventListener("mousemove", handleMove);
    element.addEventListener("click", handleClick);

    return () => {
      element.removeEventListener("mousemove", handleMove);
      element.removeEventListener("click", handleClick);
      animationFrame.cancel();
    };
  }, [pickerActive, animationFrame]);

  useEffect(() => {
    if (!uiHydrated || typeof window === "undefined") {
      return;
    }

    const uiState = {
      showShades,
      showRgbPanel,
      menuOpen,
      hintsEnabled,
      aboutOpen,
      textOptionsOpen,
    };

    const isDefault =
      uiState.showShades === TEXT_UI_DEFAULTS.showShades &&
      uiState.showRgbPanel === TEXT_UI_DEFAULTS.showRgbPanel &&
      uiState.menuOpen === TEXT_UI_DEFAULTS.menuOpen &&
      uiState.hintsEnabled === TEXT_UI_DEFAULTS.hintsEnabled &&
      uiState.aboutOpen === TEXT_UI_DEFAULTS.aboutOpen &&
      uiState.textOptionsOpen === TEXT_UI_DEFAULTS.textOptionsOpen;

    if (isDefault) {
      window.localStorage.removeItem(TEXT_UI_STORAGE_KEY);
    } else {
      window.localStorage.setItem(
        TEXT_UI_STORAGE_KEY,
        JSON.stringify(uiState),
      );
    }
  }, [
    aboutOpen,
    hintsEnabled,
    menuOpen,
    showRgbPanel,
    showShades,
    textOptionsOpen,
    uiHydrated,
  ]);

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener(
      "webkitfullscreenchange",
      handleFullscreenChange as EventListener,
    );
    document.addEventListener(
      "mozfullscreenchange",
      handleFullscreenChange as EventListener,
    );
    document.addEventListener(
      "MSFullscreenChange",
      handleFullscreenChange as EventListener,
    );

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange as EventListener,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange as EventListener,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange as EventListener,
      );
    };
  }, []);

  const handleHexChange = useCallback((value: string) => {
    if (!/^#?[0-9A-Fa-f]{0,6}$/.test(value)) return;
    const normalized = value.startsWith("#")
      ? value.toUpperCase()
      : `#${value.toUpperCase()}`;
    setCurrentHex(normalized);
    if (/^#[0-9A-F]{6}$/i.test(normalized)) {
      const parsed = hexToRgb(normalized);
      if (parsed) {
        setRgb(parsed);
      }
    }
  }, []);

  const handleChannelChange = useCallback(
    (channel: SliderChannel, value: number) => {
      setRgb((prev) => {
        const next = { ...prev, [channel]: clampChannel(value) } as Rgb;
        setCurrentHex(rgbToHex(next));
        return next;
      });
    },
    [],
  );

  const handleAddFavorite = useCallback(() => {
    setFavorites((current) =>
      current.includes(currentHex) ? current : [...current, currentHex],
    );
  }, [currentHex]);

  const handleRemoveFavorite = useCallback((hex: string) => {
    setFavorites((current) => current.filter((value) => value !== hex));
  }, []);

  const handleSelectFavorite = useCallback((hex: string) => {
    setCurrentHex(hex);
    const parsed = hexToRgb(hex);
    if (parsed) {
      setRgb(parsed);
    }
  }, []);

  const handleCopyHex = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentHex);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [currentHex]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageSetting((previous) => {
      if (previous === "auto") {
        return detectedLanguage === "ru" ? "en" : "ru";
      }
      return previous === "ru" ? "en" : "ru";
    });
  }, [detectedLanguage]);

  const toggleHints = useCallback(() => {
    setHintsEnabled((prev) => {
      const next = !prev;
      if (!next) {
        setShowWelcome(false);
        setShowPickerHint(false);
        setShowColorsHint(false);
        setShowShadesHint(false);
        setShowTextHint(false);
      } else {
        setShowWelcome(true);
        setShowPickerHint(true);
        setShowColorsHint(true);
        setShowShadesHint(true);
        setShowTextHint(true);
      }
      return next;
    });
  }, []);

  const toggleMode = useCallback((mode: ModeKey) => {
    setMenuOpen(false);
    setActiveModes((current) => {
      if (current.includes(mode)) {
        const filtered = current.filter((value) => value !== mode);
        return filtered.length === 0 ? ["text"] : filtered;
      }
      if (mode === "text") {
        return ["text"];
      }
      return current.includes("text")
        ? [...current.filter((value) => value !== "text"), mode]
        : [...current, mode];
    });
  }, []);

  const toggleTextOptions = useCallback(() => {
    setTextOptionsOpen((open) => {
      if (!open && activeModes.includes("colorChange")) {
        setRestoreColorChange(true);
        setActiveModes((modes) =>
          modes.filter((mode) => mode !== "colorChange"),
        );
      }
      if (open && restoreColorChange) {
        setActiveModes((modes) =>
          modes.includes("colorChange") ? modes : [...modes, "colorChange"],
        );
        setRestoreColorChange(false);
      }
      return !open;
    });
  }, [activeModes, restoreColorChange]);

  const handleAddToBookmarks = useCallback(() => {
    try {
      const { sidebar } = window as typeof window & {
        sidebar?: {
          addPanel?: (title: string, url: string, panel?: string) => void;
        };
      };

      if (sidebar && typeof sidebar.addPanel === "function") {
        sidebar.addPanel(document.title, document.location.href, "");
      } else if (
        typeof window.external === "object" &&
        window.external &&
        "AddFavorite" in window.external
      ) {
        // @ts-expect-error legacy IE API
        window.external.AddFavorite(document.location.href, document.title);
      } else {
        alert(getText("bookmarkError"));
      }
      setMenuOpen(false);
    } catch {
      alert(getText("bookmarkError"));
    }
  }, [getText]);

  const handleTextChange = useCallback(
    (value: string, caret: number | null) => {
      setTextValue(value);
      requestAnimationFrame(() => {
        if (textInputRef.current && caret !== null) {
          textInputRef.current.focus();
          textInputRef.current.setSelectionRange(caret, caret);
        }
      });
    },
    [],
  );

  const handleToggleStyle = useCallback(
    (style: "bold" | "italic" | "underline") => {
      setTextStyles((prev) => ({ ...prev, [style]: !prev[style] }));
    },
    [],
  );

  const applyPreset = useCallback((preset: string) => {
    const config = STYLE_PRESETS[preset];
    if (!config) return;
    setFontFamily(config.font);
    setFontSize(config.size);
    setTextColor(config.color);
    setOutline(config.stroke);
    setTextStyles(config.styles);
  }, []);

  const activeLanguage =
    languageSetting === "auto" ? detectedLanguage : languageSetting;

  const backgroundStyle: React.CSSProperties = {
    backgroundColor: currentHex,
    height: "100vh",
    width: "100vw",
    position: "relative",
    overflow: "hidden",
    transition: "background-color 0.3s ease",
    cursor: pickerActive ? "crosshair" : "default",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  };

  return (
    <HelmetProvider>
      <div ref={rootRef} style={backgroundStyle}>
        <TextMetaTags language={activeLanguage} />
        <WelcomeNotification
          visible={hintsEnabled && showWelcome}
          translation={getCommonText}
          onClose={() => setShowWelcome(false)}
        />
        <AboutModal
          open={aboutOpen}
          onClose={() => setAboutOpen(false)}
          translation={getMainText}
          languageSetting={languageSetting}
          detected={detectedLanguage}
        />
        <TextDisplay
          text={textValue}
          fontSize={fontSize}
          fontFamily={fontFamily}
          styles={textStyles}
          color={textColor}
          outline={outline}
          alignment={alignment}
          translation={getText}
        />
        {activeModes.includes("colorChange") &&
          !interfaceHidden &&
          favorites.length > 1 && (
            <SpeedControl speed={speed} onChange={setSpeed} />
          )}
        <TextOptionsPanel
          visible={textOptionsOpen && !interfaceHidden}
          translation={getText}
          showHint={hintsEnabled && showTextHint}
          onCloseHint={() => setShowTextHint(false)}
          textValue={textValue}
          onTextChange={handleTextChange}
          textInputRef={textInputRef}
          presets={STYLE_PRESETS}
          onApplyPreset={applyPreset}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          fontFamily={fontFamily}
          onFontFamilyChange={setFontFamily}
          textColor={textColor}
          onTextColorChange={setTextColor}
          outline={outline}
          onOutlineChange={setOutline}
          alignment={alignment}
          onAlignmentChange={setAlignment}
          styles={textStyles}
          onToggleStyle={handleToggleStyle}
        />
        <ShadesPanel
          rgb={rgb}
          visible={showShades && !interfaceHidden}
          hintsEnabled={hintsEnabled}
          showHint={showShadesHint}
          translation={getCommonText}
          onCloseHint={() => setShowShadesHint(false)}
          onSelectShade={(hex) => {
            setCurrentHex(hex);
            const parsed = hexToRgb(hex);
            if (parsed) setRgb(parsed);
          }}
        />
        <RgbPanel
          hexValue={currentHex}
          rgb={rgb}
          show={showRgbPanel && !interfaceHidden}
          onHexChange={handleHexChange}
          onChannelChange={handleChannelChange}
          onCopyHex={handleCopyHex}
          copySuccess={copySuccess}
        />
        <div
          className="top-buttons"
          style={{
            opacity: interfaceHidden ? 0 : 1,
            pointerEvents: interfaceHidden ? "none" : "auto",
          }}
        >
          <div className="top-buttons-row">
            <IconButton
              icon="menu"
              onClick={() => setMenuOpen((value) => !value)}
              title={activeLanguage === "ru" ? "Меню" : "Menu"}
              active={menuOpen}
            />
            <IconButton
              icon="cached"
              onClick={() => {
                const random = {
                  r: Math.floor(Math.random() * 256),
                  g: Math.floor(Math.random() * 256),
                  b: Math.floor(Math.random() * 256),
                };
                setRgb(random);
                setCurrentHex(rgbToHex(random));
              }}
              title={
                activeLanguage === "ru" ? "Случайный цвет" : "Random color"
              }
            />
            <IconButton
              icon="palette"
              onClick={() => setShowShades((value) => !value)}
              title={
                activeLanguage === "ru" ? "Палитра оттенков" : "Color palette"
              }
              active={showShades}
            />
            <IconButton
              icon=""
              label="RGB"
              onClick={() => setShowRgbPanel((value) => !value)}
              title={activeLanguage === "ru" ? "RGB настройки" : "RGB settings"}
              active={showRgbPanel}
            />
            <IconButton
              icon="web_traffic"
              onClick={() => {
                setPickerActive((value) => !value);
                if (!pickerActive) setShowPickerHint(true);
              }}
              title={
                activeLanguage === "ru"
                  ? "Режим выбора цвета"
                  : "Color picker mode"
              }
              active={pickerActive}
            />
            <IconButton
              icon="webhook"
              onClick={toggleTextOptions}
              title={
                activeLanguage === "ru" ? "Настройки текста" : "Text options"
              }
              active={textOptionsOpen}
            />
            <IconButton
              icon="help"
              onClick={toggleHints}
              title={getText("toggleHints")}
              active={hintsEnabled}
            />
          </div>
        </div>
        <div
          className="right-buttons"
          style={{
            opacity: interfaceHidden ? 0 : 1,
            pointerEvents: interfaceHidden ? "none" : "auto",
          }}
        >
          <IconButton
            icon={isFullscreen ? "fullscreen_exit" : "fullscreen"}
            onClick={toggleFullscreen}
            title={getText(isFullscreen ? "exitFullscreen" : "fullscreen")}
          />
          <IconButton
            icon={interfaceHidden ? "lightbulb" : "light_off"}
            onClick={() => setInterfaceHidden((value) => !value)}
            title={getText(interfaceHidden ? "showInterface" : "hideInterface")}
            active={interfaceHidden}
          />
        </div>
        {menuOpen && (
          <div className="menu-container">
            <div className="menu-logo">
              <div className="menu-logo-left">
                <div className="menu-logo-image">
                  <img
                    src="/favicon.svg"
                    alt="ScreenSavy Logo"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="menu-logo-text">
                  ScreenSavy
                  <span className="menu-logo-domain">.com</span>
                </span>
              </div>
              <button
                type="button"
                className="bookmark-button"
                onClick={handleAddToBookmarks}
                title={getText("bookmarkSite")}
              >
                <i className="material-symbols-outlined favorite-filled">
                  favorite
                </i>
              </button>
            </div>
            <div className="menu-separator" />
            <div
              className={`menu-item ${activeModes.includes("text") ? "active" : ""}`}
              onClick={() => toggleMode("text")}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">text_fields</i>
              </div>
              {getText("text")}
            </div>
            <div
              className={`menu-item ${activeModes.includes("oneColor") ? "active" : ""}`}
              onClick={() => toggleMode("oneColor")}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">colors</i>
              </div>
              {getText("oneColor")}
            </div>
            <div
              className={`menu-item ${activeModes.includes("colorChange") ? "active" : ""}`}
              onClick={() => toggleMode("colorChange")}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">model_training</i>
              </div>
              {getText("colorChange")}
            </div>
            <Link
              href="/"
              className="menu-item"
              onClick={() => setMenuOpen(false)}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">schedule</i>
              </div>
              {getMainText("clock")}
            </Link>
            <div className="menu-item disabled">
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">tv_gen</i>
              </div>
              <div className="menu-item-content">
                <div>{getMainText("playerMode")}</div>
                <span className="coming-soon-badge">
                  {getMainText("comingSoon")}
                </span>
              </div>
            </div>
            <div className="menu-item disabled">
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">animation</i>
              </div>
              <div className="menu-item-content">
                <div>{getMainText("animationMode")}</div>
                <span className="coming-soon-badge">
                  {getMainText("comingSoon")}
                </span>
              </div>
            </div>
            <div className="menu-item disabled">
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">publish</i>
              </div>
              <div className="menu-item-content">
                <div>{getMainText("createOwnMode")}</div>
                <span className="coming-soon-badge">
                  {getMainText("comingSoon")}
                </span>
              </div>
            </div>
            <div className="menu-separator" />
            <div className="menu-item" onClick={toggleLanguage}>
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">language</i>
              </div>
              {getMainText("language")}:{" "}
              {languageSetting === "auto"
                ? detectedLanguage === "ru"
                  ? "Русский (auto)"
                  : "English (auto)"
                : languageSetting === "ru"
                  ? "Русский"
                  : "English"}
            </div>
            <div className="menu-item" onClick={() => setAboutOpen(true)}>
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">info</i>
              </div>
              {getMainText("about")}
            </div>
          </div>
        )}
        <FavoritesPanel
          favorites={favorites}
          translation={getText}
          hintsEnabled={hintsEnabled}
          showHint={showColorsHint}
          onCloseHint={() => setShowColorsHint(false)}
          onAddFavorite={handleAddFavorite}
          onClearFavorites={() => setFavorites([])}
          onSelectFavorite={handleSelectFavorite}
          onRemoveFavorite={handleRemoveFavorite}
          interfaceHidden={interfaceHidden}
        />
        <PickerHint
          visible={
            pickerActive && !interfaceHidden && hintsEnabled && showPickerHint
          }
          translation={getText}
          onClose={() => setShowPickerHint(false)}
        />
      </div>
    </HelmetProvider>
  );
};

export default TextModeExperience;
