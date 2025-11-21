"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { videoPlayers, videoEffects } from "@/lib/videoPlayers";
import {
  SPEED_MAX,
  SPEED_MIN,
  clampChannel,
  getSpeedDelay,
  hexToRgb,
  rgbToHex,
  type Rgb,
} from "@/lib/color";
import { STORAGE_KEY, DEFAULTS } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  getTranslation,
  type Language,
  type LanguageSetting,
  type MainTranslationKey,
} from "./translations";
import type { TextTranslationKey } from "./textTranslations";
import {
  AboutModal,
  IconButton,
  INITIAL_FAVORITES,
  RgbPanel,
  ShadesPanel,
  SliderChannel,
  SpeedControl,
  TOP_TOOLBAR_BUTTONS,
  ToolbarButtonState,
  ToolbarButtonKey,
  WelcomeNotification,
  VisualizerSetupModal,
  dayNames,
  detectBrowserLanguage,
  useAnimationFrame,
} from "./shared";
import type { RetroTVRef } from "./RetroTV";
import { RETRO_ENVIRONMENTS, type RetroEnvironmentId } from "@/lib/retroEnvironments";

type ModeKey = "oneColor" | "colorChange" | "clock" | "text";
type ClockStyle = "modern" | "full" | "minimal";
type TextFontSize = "small" | "medium" | "large";
type TextAlignment = "left" | "center" | "right";

// UI state defaults (not using STORAGE_KEY here as it's internal to this component)
const MAIN_UI_DEFAULTS = {
  showShades: true,
  showRgbPanel: true,
  showFavorites: true,
  menuOpen: false,
  hintsEnabled: true,
  aboutOpen: false,
  clockStyle: "modern" as ClockStyle,
  textOptionsOpen: false,
};

const fontSizeClassMap: Record<TextFontSize, string> = {
  small: "text-small",
  medium: "text-medium",
  large: "text-large",
};

const RETRO_TV_ENVIRONMENTS: {
  id: RetroEnvironment;
  icon: string;
  label: { en: string; ru: string };
}[] = [
  { id: "loft-brick", icon: "wallpaper", label: { en: "Loft brick", ru: "Кирпичный лофт" } },
  { id: "forest-hideout", icon: "park", label: { en: "Forest", ru: "Лес" } },
  { id: "lakeside-night", icon: "nightlight", label: { en: "Night lake", ru: "Ночное озеро" } },
  { id: "rooftop-city", icon: "location_city", label: { en: "Rooftop", ru: "Крыша" } },
  { id: "junkyard-stack", icon: "delete", label: { en: "TV junkyard", ru: "Свалка ТВ" } },
  { id: "neon-arcade", icon: "casino", label: { en: "Arcade", ru: "Неон" } },
];

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

const SPEED_RANGE = SPEED_MAX - SPEED_MIN;
const DEFAULT_SPEED_RATIO = 0.65;
const DEFAULT_SPEED = Math.min(
  SPEED_MAX,
  Math.max(SPEED_MIN, SPEED_MIN + SPEED_RANGE * DEFAULT_SPEED_RATIO),
);

const STYLE_PRESET_LABELS: Record<string, MainTranslationKey> = {
  neon: "presetNeon",
  classic: "presetClassic",
  minimal: "presetMinimal",
  nature: "presetNature",
  romantic: "presetRomantic",
  retro: "presetRetro",
  cyber: "presetCyber",
};

const RETRO_SCENE_BUTTONS: { id: RetroScene; icon: string; label: { en: string; ru: string } }[] = [
  { id: "loft", icon: "styler", label: { en: "Loft brick", ru: "Кирпичный лофт" } },
  { id: "forest", icon: "park", label: { en: "Forest", ru: "Лес" } },
  { id: "lake-night", icon: "night_shelter", label: { en: "Lake night", ru: "Ночной берег" } },
  { id: "rooftop", icon: "apartment", label: { en: "Rooftop", ru: "Крыша" } },
  { id: "junkyard", icon: "recycling", label: { en: "Junkyard", ru: "Свалка" } },
  { id: "arcade", icon: "auto_awesome", label: { en: "Arcade", ru: "Аркада" } },
];

type ClockProps = {
  clockStyle: ClockStyle;
  language: Language;
  backgroundColor: Rgb;
};

// Memoized to prevent unnecessary re-renders when parent updates
const Clock = memo(({ clockStyle, language, backgroundColor }: ClockProps) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const date = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();
  const day = dayNames[language][now.getDay()];

  if (clockStyle === "modern") {
    return (
      <div className="clock modern">
        <div className="time">
          {hours}
          <span className="blink">:</span>
          {minutes}
        </div>
      </div>
    );
  }

  if (clockStyle === "full") {
    return (
      <div className="clock full">
        <div className="time-fixed-container">
          <div className="time-fixed">
            <span className="digit">{hours[0]}</span>
            <span className="digit">{hours[1]}</span>
            <span className="separator">:</span>
            <span className="digit">{minutes[0]}</span>
            <span className="digit">{minutes[1]}</span>
            <span className="separator">:</span>
            <span className="digit">{seconds[0]}</span>
            <span className="digit">{seconds[1]}</span>
          </div>
        </div>
        <div className="date">
          {date}.{month}.{year}
        </div>
        <div className="day">{day}</div>
      </div>
    );
  }

  if (clockStyle === "minimal") {
    return (
      <div className="clock minimal">
        <div className="time">
          <span className="hours">{hours}</span>
          <span className="minutes">{minutes}</span>
        </div>
      </div>
    );
  }

  return null;
});

// Add display name for debugging
Clock.displayName = "Clock";

type TextDisplayProps = {
  text: string;
  fontSize: TextFontSize;
  fontFamily: string;
  styles: { bold: boolean; italic: boolean; underline: boolean };
  color: string;
  outline: { enabled: boolean; color: string; width: number };
  alignment: TextAlignment;
  translation: (key: MainTranslationKey) => string;
};

// Memoized to prevent unnecessary re-renders
const TextDisplay = memo(({
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
});

// Add display name for debugging
TextDisplay.displayName = "TextDisplay";

type TextOptionsPanelProps = {
  visible: boolean;
  translation: (key: MainTranslationKey) => string;
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

const TextOptionsPanel = memo(({
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
        <label>{translation("stylePresets")}</label>
        <div className="preset-chips">
          {Object.keys(presets).map((preset) => (
            <div
              key={preset}
              className={`preset-chip ${preset}`}
              onClick={() => onApplyPreset(preset)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onApplyPreset(preset);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Apply ${STYLE_PRESET_LABELS[preset] ? translation(STYLE_PRESET_LABELS[preset]) : preset} preset`}
            >
              {STYLE_PRESET_LABELS[preset]
                ? translation(STYLE_PRESET_LABELS[preset])
                : preset.charAt(0).toUpperCase() + preset.slice(1)}
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
            aria-label={`${translation("fontSize")}: ${translation("small")}`}
          >
            {translation("small")}
          </button>
          <button
            type="button"
            className={`option-button ${fontSize === "medium" ? "active" : ""}`}
            onClick={() => onFontSizeChange("medium")}
            aria-label={`${translation("fontSize")}: ${translation("medium")}`}
          >
            {translation("medium")}
          </button>
          <button
            type="button"
            className={`option-button ${fontSize === "large" ? "active" : ""}`}
            onClick={() => onFontSizeChange("large")}
            aria-label={`${translation("fontSize")}: ${translation("large")}`}
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
          style={{ fontFamily: fontFamilies[fontFamily] ?? "'Inter', sans-serif" }}
        >
          {fontOptions.map((font) => (
            <option
              key={font}
              value={font}
              style={{ fontFamily: fontFamilies[font] ?? "'Inter', sans-serif" }}
            >
              {font}
            </option>
          ))}
        </select>
      </div>
      <div className="text-option-group">
        <label>{translation("textColor")}</label>
        <input
          type="color"
          value={textColor}
          onChange={(event) => onTextColorChange(event.target.value)}
          className="color-picker"
        />
      </div>
      <div className="text-option-group">
        <label>{translation("textOutline")}</label>
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
            <span>{translation("outlineEnable")}</span>
          </div>
          <div
            className={`stroke-options ${outline.enabled ? "" : "disabled"}`}
          >
            <div className="stroke-option">
              <label>{translation("outlineColor")}</label>
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
              <label>
                {translation("outlineWidth")}: {outline.width}px
              </label>
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
            aria-label="Align left"
          >
            <i className="material-symbols-outlined">format_align_left</i>
          </button>
          <button
            type="button"
            className={`option-button ${alignment === "center" ? "active" : ""}`}
            onClick={() => onAlignmentChange("center")}
            aria-label="Align center"
          >
            <i className="material-symbols-outlined">format_align_center</i>
          </button>
          <button
            type="button"
            className={`option-button ${alignment === "right" ? "active" : ""}`}
            onClick={() => onAlignmentChange("right")}
            aria-label="Align right"
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
            aria-label="Toggle bold"
            aria-pressed={styles.bold}
          >
            <i className="material-symbols-outlined">format_bold</i>
          </button>
          <button
            type="button"
            className={`option-button ${styles.italic ? "active" : ""}`}
            onClick={() => onToggleStyle("italic")}
            aria-label="Toggle italic"
            aria-pressed={styles.italic}
          >
            <i className="material-symbols-outlined">format_italic</i>
          </button>
          <button
            type="button"
            className={`option-button ${styles.underline ? "active" : ""}`}
            onClick={() => onToggleStyle("underline")}
            aria-label="Toggle underline"
            aria-pressed={styles.underline}
          >
            <i className="material-symbols-outlined">format_underlined</i>
          </button>
        </div>
      </div>
    </div>
  );
});

// Add display name for debugging
TextOptionsPanel.displayName = "TextOptionsPanel";

type FavoritesPanelProps = {
  favorites: string[];
  translation: (key: MainTranslationKey) => string;
  hintsEnabled: boolean;
  showHint: boolean;
  onCloseHint: () => void;
  onAddFavorite: () => void;
  onClearFavorites: () => void;
  onSelectFavorite: (hex: string) => void;
  onRemoveFavorite: (hex: string) => void;
  interfaceHidden: boolean;
  visible: boolean;
};

const FavoritesPanel = memo(({
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
  visible,
}: FavoritesPanelProps) => {
  if (!visible) return null;

  return (
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
            aria-label={translation("close")}
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>
      )}
      <div className="favorite-buttons">
        <div
          className="add-to-favorites-button"
          onClick={onAddFavorite}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onAddFavorite();
            }
          }}
          title={translation("addToFavorites")}
          role="button"
          tabIndex={0}
          aria-label={translation("addToFavorites")}
        >
          <i className="material-symbols-outlined">favorite</i>
        </div>
        <div
          className="clear-favorites-button"
          onClick={onClearFavorites}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClearFavorites();
            }
          }}
          title={translation("clearFavorites")}
          role="button"
          tabIndex={0}
          aria-label={translation("clearFavorites")}
        >
          <i className="material-symbols-outlined">delete_forever</i>
        </div>
      </div>
      {favorites.map((favorite, index) => (
        <div key={favorite} className="saved-color-container">
          <div
            className="saved-color"
            style={{ backgroundColor: favorite }}
            onClick={() => onSelectFavorite(favorite)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectFavorite(favorite);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Select color ${favorite}`}
          />
          <div
            className="delete-color"
            onClick={(event) => {
              event.stopPropagation();
              onRemoveFavorite(favorite);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onRemoveFavorite(favorite);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Remove color ${favorite}`}
          >
            <i className="material-symbols-outlined" style={{ fontSize: "12px" }}>
              close
            </i>
          </div>
        </div>
      ))}
    </div>
  );
});

// Add display name for debugging
FavoritesPanel.displayName = "FavoritesPanel";

type PickerHintProps = {
  visible: boolean;
  translation: (key: MainTranslationKey) => string;
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

// MetaTags component removed - using Next.js Metadata API in layout.tsx instead

type MainExperienceProps = {
  visualizerMode?: boolean;
  visualizerSlug?: string;
  visualizerCategory?: "audio" | "ambient";
  iframeRef?: React.RefObject<HTMLIFrameElement>;
  initialMode?: ModeKey;
  videoMode?: boolean;
  videoSlug?: string;
  videoEffect?: string;
  onEffectChange?: (effect: string) => void;
  onInterfaceVisibilityChange?: (visible: boolean) => void;
  tvRef?: React.RefObject<RetroTVRef | null>;
};

const MainExperience = ({
  visualizerMode = false,
  visualizerSlug,
  visualizerCategory,
  iframeRef,
  initialMode,
  videoMode = false,
  videoSlug,
  videoEffect = 'none',
  onEffectChange,
  onInterfaceVisibilityChange,
  tvRef,
  environment,
  onEnvironmentChange,
}: MainExperienceProps = {}) => {
  const [tvViewMode, setTvViewMode] = useState<'full' | 'closeup'>('full');
  const [tvEnvironment, setTvEnvironment] = useState<RetroEnvironmentId>('loft-brick');
  const router = useRouter();
  const [languageSetting, setLanguageSetting] =
    useState<LanguageSetting>("auto");
  const [detectedLanguage, setDetectedLanguage] = useState<Language>("en");

  // Use useLocalStorage hook for persistent state
  const [rgb, setRgb] = useLocalStorage<Rgb>(STORAGE_KEY.MAIN_RGB, DEFAULTS.RGB);
  const [favorites, setFavorites] = useLocalStorage<string[]>(STORAGE_KEY.FAVORITES, INITIAL_FAVORITES);
  const [speed, setSpeed] = useLocalStorage<number>(STORAGE_KEY.SPEED, DEFAULT_SPEED);
  const [activeModes, setActiveModes] = useLocalStorage<ModeKey[]>(
    STORAGE_KEY.ACTIVE_MODES,
    initialMode ? [initialMode] : ["oneColor"]
  );
  const [clockStyle, setClockStyle] = useLocalStorage<ClockStyle>(STORAGE_KEY.CLOCK_STYLE, "modern");

  // Derive currentHex from rgb using useMemo (no duplicate state)
  const currentHex = useMemo(() => rgbToHex(rgb), [rgb]);

  const [showShades, setShowShades] = useState(true);
  const [showRgbPanel, setShowRgbPanel] = useState(true);
  const [showFavorites, setShowFavorites] = useState(true);
  const [interfaceHidden, setInterfaceHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [pickerActive, setPickerActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showColorsHint, setShowColorsHint] = useState(true);
  const [showShadesHint, setShowShadesHint] = useState(true);
  const [showPickerHint, setShowPickerHint] = useState(true);
  const [uiHydrated, setUiHydrated] = useState(false);
  const [showVisualizerModal, setShowVisualizerModal] = useState(false);
  
  const [textOptionsOpen, setTextOptionsOpen] = useState(initialMode === "text");
  const [textValue, setTextValue] = useState("ScreenSavy");
  const [fontSize, setFontSize] = useState<TextFontSize>("medium");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [alignment, setAlignment] = useState<TextAlignment>("center");
  const [textStyles, setTextStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [outline, setOutline] = useState({
    enabled: false,
    color: "#000000",
    width: 1,
  });
  const [showTextHint, setShowTextHint] = useState(true);
  const [restoreColorChange, setRestoreColorChange] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const colorChangeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionIndexRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const nextColorRef = useRef<Rgb | null>(null);
  const animationFrame = useAnimationFrame();

  useEffect(() => {
    if (environment) {
      setRetroEnvironment(environment);
    }
  }, [environment]);

  const handleEnvironmentChange = useCallback(
    (value: RetroEnvironment) => {
      setRetroEnvironment(value);
      onEnvironmentChange?.(value);
    },
    [onEnvironmentChange]
  );

  const activeEnvironment = environment ?? retroEnvironment;

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      setUiHydrated(true);
      return;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY.MAIN_UI);
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as Partial<{
        showShades: boolean;
        showRgbPanel: boolean;
        showFavorites: boolean;
        menuOpen: boolean;
        hintsEnabled: boolean;
        aboutOpen: boolean;
        clockStyle: ClockStyle;
        textOptionsOpen: boolean;
      }>;

      if (typeof parsed.showShades === "boolean") {
        setShowShades(parsed.showShades);
      }
      if (typeof parsed.showRgbPanel === "boolean") {
        setShowRgbPanel(parsed.showRgbPanel);
      }
      if (typeof parsed.showFavorites === "boolean") {
        setShowFavorites(parsed.showFavorites);
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
      // clockStyle is now handled by useLocalStorage, not MAIN_UI
      if (typeof parsed.textOptionsOpen === "boolean" && !initialMode) {
        setTextOptionsOpen(parsed.textOptionsOpen);
      }
    } catch (error) {
      console.error("Failed to restore main UI state", error);
    } finally {
      setUiHydrated(true);
    }
  }, [initialMode]);

  useEffect(() => {
    if (videoMode && videoSlug === "retro-tv" && tvRef?.current?.setEnvironment) {
      tvRef.current.setEnvironment(retroScene);
    }
  }, [videoMode, videoSlug, retroScene, tvRef]);

  const getText = useCallback(
    (key: MainTranslationKey) =>
      getTranslation(languageSetting, detectedLanguage, key),
    [languageSetting, detectedLanguage],
  );

  const getCommonText = useCallback(
    (key: MainTranslationKey | TextTranslationKey) =>
      getText(key as MainTranslationKey),
    [getText],
  );

  useEffect(() => {
    setDetectedLanguage(detectBrowserLanguage());
  }, []);

  // Removed: localStorage initialization is now handled by useLocalStorage hook

  useEffect(() => {
    if (languageSetting !== "auto") return;
    setDetectedLanguage(detectBrowserLanguage());
  }, [languageSetting]);

  // Removed: localStorage saving is now handled by useLocalStorage hook

  // Color change mode - smooth step-by-step RGB transitions
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

    nextColorRef.current = next;

    const totalDelay = getSpeedDelay(speed);
    let totalSteps = Math.max(
      Math.abs(next.r - current.r),
      Math.abs(next.g - current.g),
      Math.abs(next.b - current.b),
      1,
    );
    let stepDelay = totalDelay / totalSteps;
    let stepIndex = Math.round(transitionProgressRef.current * totalSteps);
    if (stepIndex >= totalSteps) {
      stepIndex = 0;
      transitionProgressRef.current = 0;
    }

    const step = () => {
      stepIndex += 1;
      let progress = stepIndex / totalSteps;
      if (progress > 1) {
        progress = 1;
      }

      transitionProgressRef.current = progress;
      if (!current || !next) {
        return;
      }
      const interpolated: Rgb = {
        r: Math.round(current.r + progress * (next.r - current.r)),
        g: Math.round(current.g + progress * (next.g - current.g)),
        b: Math.round(current.b + progress * (next.b - current.b)),
      };

      setRgb(interpolated);

      if (progress >= 1) {
        transitionIndexRef.current =
          (transitionIndexRef.current + 1) % favorites.length;
        current = hexToRgb(favorites[transitionIndexRef.current]) ?? current;
        next =
          hexToRgb(
            favorites[(transitionIndexRef.current + 1) % favorites.length],
          ) ?? next;
        nextColorRef.current = next;

        totalSteps = Math.max(
          Math.abs(next.r - current.r),
          Math.abs(next.g - current.g),
          Math.abs(next.b - current.b),
          1,
        );
        stepDelay = totalDelay / totalSteps;
        stepIndex = 0;
        transitionProgressRef.current = 0;
      }

      colorChangeTimerRef.current = setTimeout(step, stepDelay);
    };

    colorChangeTimerRef.current = setTimeout(step, stepDelay);

    return () => {
      if (colorChangeTimerRef.current) {
        clearTimeout(colorChangeTimerRef.current);
        colorChangeTimerRef.current = null;
      }
    };
  }, [activeModes, favorites, speed, setRgb]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const visited = localStorage.getItem(STORAGE_KEY.WELCOME_SHOWN);
    if (visited) {
      setShowWelcome(false);
      setShowPickerHint(false);
      setShowColorsHint(false);
      setShowShadesHint(false);
    } else {
      localStorage.setItem(STORAGE_KEY.WELCOME_SHOWN, "true");
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
        const nextColor = { r, g, b };
        setRgb(nextColor);
        // currentHex is now derived from rgb automatically
      });
    };

    const handleClick = () => {
      setPickerActive(false);
    };

    element.addEventListener("mousemove", handleMove);
    element.addEventListener("click", handleClick);

    return () => {
      element.removeEventListener("mousemove", handleMove);
      element.removeEventListener("click", handleClick);
      animationFrame.cancel();
    };
  }, [pickerActive, animationFrame, setRgb]);

  useEffect(() => {
    if (!uiHydrated || typeof window === "undefined") {
      return;
    }

    const uiState = {
      showShades,
      showRgbPanel,
      showFavorites,
      menuOpen,
      hintsEnabled,
      aboutOpen,
      textOptionsOpen,
    };

    const isDefault =
      uiState.showShades === MAIN_UI_DEFAULTS.showShades &&
      uiState.showRgbPanel === MAIN_UI_DEFAULTS.showRgbPanel &&
      uiState.showFavorites === MAIN_UI_DEFAULTS.showFavorites &&
      uiState.menuOpen === MAIN_UI_DEFAULTS.menuOpen &&
      uiState.hintsEnabled === MAIN_UI_DEFAULTS.hintsEnabled &&
      uiState.aboutOpen === MAIN_UI_DEFAULTS.aboutOpen &&
      uiState.textOptionsOpen === MAIN_UI_DEFAULTS.textOptionsOpen;

    if (isDefault) {
      window.localStorage.removeItem(STORAGE_KEY.MAIN_UI);
    } else {
      window.localStorage.setItem(
        STORAGE_KEY.MAIN_UI,
        JSON.stringify(uiState),
      );
    }
  }, [
    aboutOpen,
    hintsEnabled,
    menuOpen,
    showFavorites,
    showRgbPanel,
    showShades,
    textOptionsOpen,
    uiHydrated,
  ]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

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

  useEffect(() => {
    if (visualizerMode && visualizerCategory === "audio") {
      setShowVisualizerModal(true);
    }
  }, [visualizerMode, visualizerCategory]);

  // Notify parent when interface visibility changes
  useEffect(() => {
    if (onInterfaceVisibilityChange) {
      onInterfaceVisibilityChange(!interfaceHidden);
    }
  }, [interfaceHidden, onInterfaceVisibilityChange]);

  const handleStartMicrophone = useCallback(async (deviceId: string) => {
    if (iframeRef?.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: "START_AUDIO",
        source: "microphone",
        deviceId
      }, window.location.origin);
    }
    setShowVisualizerModal(false);
  }, [iframeRef]);

  const handleStartSystem = useCallback(async () => {
    if (iframeRef?.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: "START_AUDIO",
        source: "system"
      }, window.location.origin);
    }
    setShowVisualizerModal(false);
  }, [iframeRef]);

  const handleHexChange = useCallback((value: string) => {
    if (!/^#?[0-9A-Fa-f]{0,6}$/.test(value)) return;
    const normalized = value.startsWith("#")
      ? value.toUpperCase()
      : `#${value.toUpperCase()}`;
    // Only update RGB if we have a complete hex value
    // currentHex will be derived from rgb automatically
    if (/^#[0-9A-F]{6}$/i.test(normalized)) {
      const parsed = hexToRgb(normalized);
      if (parsed) {
        setRgb(parsed);
      }
    }
  }, [setRgb]);

  const handleChannelChange = useCallback(
    (channel: SliderChannel, value: number) => {
      setRgb((previous) => {
        const next = { ...previous, [channel]: clampChannel(value) } as Rgb;
        // currentHex is now derived from rgb automatically
        return next;
      });
    },
    [setRgb],
  );

  const handleAddFavorite = useCallback(() => {
    setFavorites((current) =>
      current.includes(currentHex) ? current : [...current, currentHex],
    );
  }, [currentHex, setFavorites]);

  const handleRemoveFavorite = useCallback((hex: string) => {
    setFavorites((current) => current.filter((value) => value !== hex));
  }, [setFavorites]);

  const handleSelectFavorite = useCallback((hex: string) => {
    const parsed = hexToRgb(hex);
    if (parsed) {
      setRgb(parsed);
      // currentHex will be derived from rgb automatically
    }
  }, [setRgb]);

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
    if (typeof document === "undefined") return;
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
    setHintsEnabled((previous) => {
      const next = !previous;
      if (!next) {
        setShowWelcome(false);
        setShowPickerHint(false);
        setShowColorsHint(false);
        setShowShadesHint(false);
      } else {
        setShowWelcome(true);
        setShowPickerHint(true);
        setShowColorsHint(true);
        setShowShadesHint(true);
      }
      return next;
    });
  }, []);

  const toggleMode = useCallback((mode: ModeKey) => {
    setMenuOpen(false);
    setActiveModes((current) => {
      if (current.includes(mode)) {
        const filtered = current.filter((value) => value !== mode);
        return filtered.length === 0 ? ["oneColor"] : filtered;
      }
      if (mode === "oneColor") {
        return ["oneColor"];
      }
      if (mode === "text" || mode === "clock") {
        const withoutTextAndClock = current.filter(
          (value) => value !== "text" && value !== "clock" && value !== "oneColor"
        );
        return [...withoutTextAndClock, mode];
      }
      return current.includes("oneColor")
        ? [...current.filter((value) => value !== "oneColor"), mode]
        : [...current, mode];
    });
  }, [setActiveModes]);

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
  }, [activeModes, restoreColorChange, setActiveModes]);

  const handleTextChange = useCallback((value: string, caret: number | null) => {
    setTextValue(value);
    if (caret !== null && textInputRef.current) {
      requestAnimationFrame(() => {
        if (textInputRef.current) {
          textInputRef.current.setSelectionRange(caret, caret);
        }
      });
    }
  }, []);

  const handleToggleStyle = useCallback((style: "bold" | "italic" | "underline") => {
    setTextStyles((prev) => ({ ...prev, [style]: !prev[style] }));
  }, []);

  const applyPreset = useCallback((name: string) => {
    const preset = STYLE_PRESETS[name];
    if (preset) {
      setFontFamily(preset.font);
      setFontSize(preset.size);
      setTextColor(preset.color);
      setOutline(preset.stroke);
      setTextStyles(preset.styles);
    }
  }, []);

  const handleAddToBookmarks = useCallback(() => {
    try {
      const { sidebar } = window as typeof window & {
        sidebar?: {
          addPanel?: (title: string, url: string, panel?: string) => void;
        };
      };

      if (sidebar && typeof sidebar.addPanel === "function") {
        sidebar.addPanel(document.title, window.location.href, "");
      } else if (
        typeof window.external === "object" &&
        window.external &&
        "AddFavorite" in window.external
      ) {
        // @ts-expect-error legacy IE API
        window.external.AddFavorite(window.location.href, document.title);
      } else {
        alert(getText("bookmarkError"));
      }
      setMenuOpen(false);
    } catch {
      alert(getText("bookmarkError"));
    }
  }, [getText]);

  const activeLanguage =
    languageSetting === "auto" ? detectedLanguage : languageSetting;

  // Memoize toolbar buttons to prevent unnecessary re-renders
  const toolbarButtons: Record<ToolbarButtonKey, ToolbarButtonState> = useMemo(() => ({
    menu: {
      icon: "menu",
      onClick: () => setMenuOpen((value) => !value),
      title: activeLanguage === "ru" ? "Меню" : "Menu",
      active: menuOpen,
    },
    randomColor: {
      icon: "cached",
      onClick: () => {
        const random = {
          r: Math.floor(Math.random() * 256),
          g: Math.floor(Math.random() * 256),
          b: Math.floor(Math.random() * 256),
        };
        setRgb(random);
        // currentHex is now derived from rgb automatically
      },
      title: activeLanguage === "ru" ? "Случайный цвет" : "Random color",
    },
    toggleShades: {
      icon: "palette",
      onClick: () => setShowShades((value) => !value),
      title:
        activeLanguage === "ru"
          ? "Палитра оттенков"
          : "Color palette",
      active: showShades,
    },
    toggleRgb: {
      icon: "",
      label: "RGB",
      onClick: () => setShowRgbPanel((value) => !value),
      title: activeLanguage === "ru" ? "RGB настройки" : "RGB settings",
      active: showRgbPanel,
    },
    toggleFavorites: {
      icon: "favorite",
      onClick: () => setShowFavorites((value) => !value),
      title: getText(showFavorites ? "hideFavorites" : "showFavorites"),
      active: showFavorites,
    },
    picker: {
      icon: "web_traffic",
      onClick: () => {
        setPickerActive((value) => !value);
        if (!pickerActive) {
          setShowPickerHint(true);
        }
      },
      title:
        activeLanguage === "ru"
          ? "Режим выбора цвета"
          : "Color picker mode",
      active: pickerActive,
    },
    textOptions: {
      icon: "text_fields",
      onClick: toggleTextOptions,
      title: getText("textOptions"),
      active: textOptionsOpen,
      hidden: !activeModes.includes("text"),
    },
    toggleHints: {
      icon: "help",
      onClick: toggleHints,
      title: getText("toggleHints"),
      active: hintsEnabled,
    },
  }), [
    activeLanguage,
    menuOpen,
    showShades,
    showRgbPanel,
    showFavorites,
    pickerActive,
    textOptionsOpen,
    activeModes,
    hintsEnabled,
    getText,
    toggleTextOptions,
    toggleHints,
    setRgb,
  ]);

  const backgroundStyle = {
    backgroundColor: (visualizerMode || videoMode) ? "transparent" : currentHex,
    minHeight: "100vh",
    width: "100%",
    position: "relative" as const,
    overflow: "hidden",
    transition: "background-color 0.3s ease",
    cursor: pickerActive ? "crosshair" : "default",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  };

  return (
    <div
      ref={rootRef}
      style={backgroundStyle}
      className={(visualizerMode || videoMode) ? "visualizer-mode-root" : ""}
    >
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-5DXQTQ6C"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      <WelcomeNotification
        visible={hintsEnabled && showWelcome}
        translation={getCommonText}
        onClose={() => setShowWelcome(false)}
      />
      <AboutModal
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        translation={getText}
        languageSetting={languageSetting}
        detected={detectedLanguage}
      />
      {!(visualizerMode || videoMode) && activeModes.includes("clock") && (
        <Clock
          clockStyle={clockStyle}
          language={activeLanguage}
          backgroundColor={rgb}
        />
      )}
        {!(visualizerMode || videoMode) && activeModes.includes("text") && (
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
        )}
        {!(visualizerMode || videoMode) && activeModes.includes("colorChange") &&
          !interfaceHidden &&
          favorites.length > 1 && (
            <SpeedControl speed={speed} onChange={setSpeed} />
          )}
        {!(visualizerMode || videoMode) && activeModes.includes("text") && (
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
        )}
        {!(visualizerMode || videoMode) && (
          <>
            <ShadesPanel
              rgb={rgb}
              visible={showShades && !interfaceHidden}
              hintsEnabled={hintsEnabled}
              showHint={showShadesHint}
              translation={getCommonText}
              onCloseHint={() => setShowShadesHint(false)}
              onSelectShade={(hex) => {
                const parsed = hexToRgb(hex);
                if (parsed) setRgb(parsed);
                // currentHex is now derived from rgb automatically
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
          </>
        )}
        <div
          className="top-buttons"
          style={{
            opacity: interfaceHidden ? 0 : 1,
            pointerEvents: interfaceHidden ? "none" : "auto",
          }}
        >
          <div className="top-buttons-row">
            {TOP_TOOLBAR_BUTTONS.map((key) => {
              const button = toolbarButtons[key];
              const hideInVisualizerMode = visualizerMode && [
                "randomColor",
                "toggleShades",
                "toggleRgb",
                "toggleFavorites",
                "picker",
              ].includes(key);

              const hideInVideoMode = videoMode && [
                "randomColor",
                "toggleShades",
                "toggleRgb",
                "toggleFavorites",
                "picker",
                "textOptions",
              ].includes(key);

              if (hideInVisualizerMode || hideInVideoMode) return null;

              return (
                <IconButton
                  key={key}
                  icon={button.icon}
                  label={button.label}
                  onClick={button.onClick}
                  title={button.title}
                  active={button.active}
                  disabled={button.disabled}
                  hidden={button.hidden}
                  aria-label={button.title}
                />
              );
            })}
          </div>
        </div>
        <div className="right-buttons">
          <div
            className="right-buttons-group"
            style={{
              opacity: interfaceHidden ? 0 : 1,
              pointerEvents: interfaceHidden ? "none" : "auto",
            }}
          >
            <IconButton
              icon={isFullscreen ? "fullscreen_exit" : "fullscreen"}
              onClick={toggleFullscreen}
              title={getText(isFullscreen ? "exitFullscreen" : "fullscreen")}
              aria-label={getText(isFullscreen ? "exitFullscreen" : "fullscreen")}
            />
          </div>
          <IconButton
            icon={interfaceHidden ? "lightbulb" : "light_off"}
            onClick={() => setInterfaceHidden((value) => !value)}
            title={getText(interfaceHidden ? "showInterface" : "hideInterface")}
            active={interfaceHidden}
            className={interfaceHidden ? "interface-toggle--inactive" : undefined}
            aria-label={getText(interfaceHidden ? "showInterface" : "hideInterface")}
          />
        </div>
        {!(visualizerMode || videoMode) && (
          <div
            className={`clock-control-row ${activeModes.includes("clock") && !interfaceHidden ? "active" : ""}`}
          >
            <IconButton
              icon="schedule"
              onClick={() => setClockStyle("modern")}
              title={getText("modernClock")}
              active={clockStyle === "modern"}
              aria-label={getText("modernClock")}
            />
            <IconButton
              icon="calendar_clock"
              onClick={() => setClockStyle("full")}
              title={getText("fullClock")}
              active={clockStyle === "full"}
              aria-label={getText("fullClock")}
            />
            <IconButton
              icon="history_toggle_off"
              onClick={() => setClockStyle("minimal")}
              title={getText("minimalClock")}
              active={clockStyle === "minimal"}
              aria-label={getText("minimalClock")}
            />
          </div>
        )}
        {visualizerMode && !interfaceHidden && (
          <div className="visualizer-control-row active">
            <IconButton
              icon="auto_awesome"
              onClick={() => router.push('/modes/visualizers/celestial')}
              title="Celestial Weaver"
              active={typeof window !== 'undefined' && window.location.pathname === '/modes/visualizers/celestial'}
              aria-label="Celestial Weaver visualizer"
            />
            <IconButton
              icon="flare"
              onClick={() => router.push('/modes/visualizers/supernova')}
              title="Super Nova"
              active={typeof window !== 'undefined' && window.location.pathname === '/modes/visualizers/supernova'}
              aria-label="Super Nova visualizer"
            />
            <IconButton
              icon="rocket_launch"
              onClick={() => router.push('/modes/visualizers/voyager')}
              title="Voyager"
              active={typeof window !== 'undefined' && window.location.pathname === '/modes/visualizers/voyager'}
              aria-label="Voyager visualizer"
            />
            <IconButton
              icon="water_drop"
              onClick={() => router.push('/modes/visualizers/lava-lamp')}
              title="Lava Lamp"
              active={typeof window !== 'undefined' && window.location.pathname === '/modes/visualizers/lava-lamp'}
              aria-label="Lava Lamp visualizer"
            />
            <IconButton
              icon="gradient"
              onClick={() => router.push('/modes/visualizers/rgb-lava')}
              title="RGB Lava"
              active={typeof window !== 'undefined' && window.location.pathname === '/modes/visualizers/rgb-lava'}
              aria-label="RGB Lava visualizer"
            />
          </div>
        )}
        {videoMode && !interfaceHidden && videoSlug === 'retro-tv' && tvRef && (
          <>
            <div
              className="video-control-row active"
              style={{ marginBottom: '8px', position: 'relative', zIndex: 2 }}
            >
              {RETRO_TV_ENVIRONMENTS.map((option) => (
                <IconButton
                  key={option.id}
                  icon={option.icon}
                  onClick={() => handleEnvironmentChange(option.id)}
                  title={activeLanguage === 'ru' ? option.label.ru : option.label.en}
                  active={activeEnvironment === option.id}
                  aria-label={activeLanguage === 'ru' ? option.label.ru : option.label.en}
                />
              ))}
            </div>
            {/* Retro TV View Mode Buttons */}
            <div className="video-control-row active" style={{ marginBottom: '10px' }}>
              <IconButton
                icon="fit_screen"
                onClick={() => {
                  setTvViewMode('full');
                  tvRef.current?.setViewMode('full');
                }}
                title={activeLanguage === 'ru' ? 'Полный вид' : 'Full View'}
                active={tvViewMode === 'full'}
                aria-label={activeLanguage === 'ru' ? 'Полный вид' : 'Full View'}
              />
              <IconButton
                icon="fullscreen"
                onClick={() => {
                  setTvViewMode('closeup');
                  tvRef.current?.setViewMode('closeup');
                }}
                title={activeLanguage === 'ru' ? 'Крупный план' : 'Closeup'}
                active={tvViewMode === 'closeup'}
                aria-label={activeLanguage === 'ru' ? 'Крупный план' : 'Closeup'}
              />
            </div>
            <div className="video-control-row active">
              {RETRO_ENVIRONMENTS.map((environment) => (
                <IconButton
                  key={environment.id}
                  icon={environment.icon}
                  onClick={() => {
                    setTvEnvironment(environment.id);
                    tvRef.current?.setEnvironment?.(environment.id);
                  }}
                  title={activeLanguage === 'ru' ? environment.nameRu : environment.name}
                  active={tvEnvironment === environment.id}
                  aria-label={activeLanguage === 'ru' ? environment.nameRu : environment.name}
                />
              ))}
            </div>
          </>
        )}
        {videoMode && !interfaceHidden && videoSlug !== 'retro-tv' && (
          <>
            {/* Video Players Navigation */}
            <div className="video-control-row active" style={{ marginBottom: '10px' }}>
              {videoPlayers.map((player) => (
                <IconButton
                  key={player.slug}
                  icon={
                    player.type === 'youtube' ? 'play_circle' :
                    player.type === 'local' ? 'folder_open' :
                    'videocam'
                  }
                  onClick={() => router.push(`/modes/video/${player.slug}`)}
                  title={activeLanguage === 'ru' ? player.nameRu : player.name}
                  active={typeof window !== 'undefined' && window.location.pathname === `/modes/video/${player.slug}`}
                  aria-label={activeLanguage === 'ru' ? player.nameRu : player.name}
                />
              ))}
            </div>
            {/* Video Effects */}
            <div className="video-control-row active">
              {videoEffects.map((effect) => (
                <IconButton
                  key={effect.id}
                  icon={effect.icon}
                  onClick={() => onEffectChange?.(effect.id)}
                  title={activeLanguage === 'ru' ? effect.nameRu : effect.name}
                  active={videoEffect === effect.id}
                  aria-label={activeLanguage === 'ru' ? effect.nameRu : effect.name}
                />
              ))}
            </div>
          </>
        )}
        {menuOpen && (
          <div className="menu-container">
            <div className="menu-logo">
              <div className="menu-logo-left">
                <div className="menu-logo-image">
                  <Image
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
              className={`menu-item ${activeModes.includes("oneColor") ? "active" : ""}`}
              onClick={() => {
                if (visualizerMode) {
                  setMenuOpen(false);
                  router.push("/?mode=oneColor");
                } else {
                  toggleMode("oneColor");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (visualizerMode) {
                    setMenuOpen(false);
                    router.push("/?mode=oneColor");
                  } else {
                    toggleMode("oneColor");
                  }
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={getText("oneColor")}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">colors</i>
              </div>
              {getText("oneColor")}
            </div>
            <div
              className={`menu-item ${activeModes.includes("colorChange") ? "active" : ""}`}
              onClick={() => {
                if (visualizerMode) {
                  setMenuOpen(false);
                  router.push("/?mode=colorChange");
                } else {
                  toggleMode("colorChange");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (visualizerMode) {
                    setMenuOpen(false);
                    router.push("/?mode=colorChange");
                  } else {
                    toggleMode("colorChange");
                  }
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={getText("colorChange")}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">model_training</i>
              </div>
              {getText("colorChange")}
            </div>
            <div className="menu-separator" />
            <div
              className={`menu-item ${activeModes.includes("text") ? "active" : ""}`}
              onClick={() => {
                if (visualizerMode) {
                  setMenuOpen(false);
                  router.push("/?mode=text");
                } else {
                  toggleMode("text");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (visualizerMode) {
                    setMenuOpen(false);
                    router.push("/?mode=text");
                  } else {
                    toggleMode("text");
                  }
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={getText("textMode")}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">text_fields</i>
              </div>
              {getText("textMode")}
            </div>
            <div
              className={`menu-item ${activeModes.includes("clock") ? "active" : ""}`}
              onClick={() => {
                if (visualizerMode) {
                  setMenuOpen(false);
                  router.push("/?mode=clock");
                } else {
                  toggleMode("clock");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (visualizerMode) {
                    setMenuOpen(false);
                    router.push("/?mode=clock");
                  } else {
                    toggleMode("clock");
                  }
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={getText("clock")}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">schedule</i>
              </div>
              {getText("clock")}
            </div>
            <div className="menu-separator" />
            <div className="menu-section-title">{getText("audioVisualizers")}</div>
            <div
              className="menu-item"
              onClick={() => {
                setMenuOpen(false);
                router.push("/modes/visualizers/celestial");
              }}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">auto_awesome</i>
              </div>
              Celestial Weaver
            </div>
            <div
              className="menu-item"
              onClick={() => {
                setMenuOpen(false);
                router.push("/modes/visualizers/supernova");
              }}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">wb_sunny</i>
              </div>
              Super Nova
            </div>
            <div
              className="menu-item"
              onClick={() => {
                setMenuOpen(false);
                router.push("/modes/visualizers/voyager");
              }}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">rocket_launch</i>
              </div>
              Voyager
            </div>
            <div className="menu-section-title">{getText("ambientVisualizers")}</div>
            <div
              className="menu-item"
              onClick={() => {
                setMenuOpen(false);
                router.push("/modes/visualizers/lava-lamp");
              }}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">water_drop</i>
              </div>
              Lava Lamp
            </div>
            <div
              className="menu-item"
              onClick={() => {
                setMenuOpen(false);
                router.push("/modes/visualizers/rgb-lava");
              }}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">blur_on</i>
              </div>
              RGB Lava
            </div>
            <div className="menu-separator" />
            <div className="menu-section-title">
              {activeLanguage === 'ru' ? 'Видеоплееры' : 'Video Players'}
            </div>
            {videoPlayers.map((player) => (
              <div
                key={player.slug}
                className="menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/modes/video/${player.slug}`);
                }}
                role="button"
                tabIndex={0}
                aria-label={activeLanguage === 'ru' ? player.nameRu : player.name}
              >
                <div className="menu-item-icon">
                  <i className="material-symbols-outlined">
                    {player.type === 'retro' ? 'tv_gen' :
                     player.type === 'youtube' ? 'play_circle' :
                     player.type === 'local' ? 'folder_open' :
                     'videocam'}
                  </i>
                </div>
                {activeLanguage === 'ru' ? player.nameRu : player.name}
              </div>
            ))}
            <div className="menu-separator" />
            <div className="menu-item disabled">
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">publish</i>
              </div>
              <div className="menu-item-content">
                <div>{getText("createOwnMode")}</div>
                <span className="coming-soon-badge">
                  {getText("comingSoon")}
                </span>
              </div>
            </div>
            <div className="menu-separator" />
            <div
              className="menu-item"
              onClick={toggleLanguage}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleLanguage();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={getText("language")}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">language</i>
              </div>
              {getText("language")}:{" "}
              {languageSetting === "auto"
                ? detectedLanguage === "ru"
                  ? "Русский (auto)"
                  : "English (auto)"
                : languageSetting === "ru"
                  ? "Русский"
                  : "English"}
            </div>
            <div
              className="menu-item"
              onClick={() => setAboutOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setAboutOpen(true);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={getText("about")}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">info</i>
              </div>
              {getText("about")}
            </div>
          </div>
        )}
        {!(visualizerMode || videoMode) && (
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
            visible={showFavorites}
          />
        )}
        {!(visualizerMode || videoMode) && (
          <PickerHint
            visible={
              pickerActive && !interfaceHidden && hintsEnabled && showPickerHint
            }
            translation={getText}
            onClose={() => setShowPickerHint(false)}
          />
        )}
        {visualizerMode && showVisualizerModal && visualizerSlug && (
          <VisualizerSetupModal
            visualizerSlug={visualizerSlug}
            visualizerName={visualizerSlug}
            visualizerNameRu={visualizerSlug}
            onStartMicrophone={handleStartMicrophone}
            onStartSystem={handleStartSystem}
            language={activeLanguage}
          />
        )}
    </div>
  );
};

export default MainExperience;
