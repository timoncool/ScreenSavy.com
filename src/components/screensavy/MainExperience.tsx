"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  clampChannel,
  getSpeedDelay,
  hexToRgb,
  rgbToHex,
  type Rgb,
} from "@/lib/color";
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

type ModeKey = "oneColor" | "colorChange" | "clock";
type ClockStyle = "modern" | "full" | "minimal";

const MAIN_UI_STORAGE_KEY = "screensavy-main-ui";
const MAIN_UI_DEFAULTS = {
  showShades: true,
  showRgbPanel: true,
  showFavorites: true,
  menuOpen: false,
  hintsEnabled: true,
  aboutOpen: false,
  clockStyle: "modern" as ClockStyle,
};

type ClockProps = {
  clockStyle: ClockStyle;
  language: Language;
};

const Clock = ({ clockStyle, language }: ClockProps) => {
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
};

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
  visible,
}: FavoritesPanelProps) => (
  visible ? (
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
  ) : null
);

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

const MetaTags = ({ language }: { language: Language }) => {
  const title =
    language === "ru"
      ? "ScreenSavy.com - Интерактивные заставки для экрана"
      : "ScreenSavy.com - Interactive Screen Backgrounds";

  const description =
    language === "ru"
      ? "ScreenSavy.com - веб-платформа для создания цветовых фонов, заставок и скринсейверов. Настраивайте цвета экрана, анимации и часы для любого устройства."
      : "ScreenSavy.com - web platform for creating color backgrounds, screensavers and visual effects. Customize screen colors, animations and clocks for any device.";

  const keywords =
    language === "ru"
      ? "скринсейвер, заставка экрана, цветовой фон, цветовой пикер, подсветка комнаты, часы для экрана, анимация экрана, фон для монитора, RGB цвета, тестирование монитора"
      : "screensaver, screen background, color picker, room lighting, screen clock, screen animation, monitor background, RGB colors, monitor testing, color utility";

  const ogDescription =
    language === "ru"
      ? "Создавайте красивые цветовые фоны, заставки и визуальные эффекты для вашего экрана"
      : "Create beautiful color backgrounds, screensavers and visual effects for your screen";

  return (
    <Helmet>
      <script>
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5DXQTQ6C');`}
      </script>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet="UTF-8" />
      <link rel="canonical" href="https://screensavy.com" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.svg" />
      <link rel="icon" type="image/svg+xml" sizes="32x32" href="/favicon.svg" />
      <link rel="icon" type="image/svg+xml" sizes="16x16" href="/favicon.svg" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#10B981" />
      <meta name="msapplication-TileColor" content="#10B981" />
      <meta name="theme-color" content="#10B981" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://screensavy.com" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content="https://screensavy.com/og-image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:locale"
        content={language === "ru" ? "ru_RU" : "en_US"}
      />
      <meta property="og:site_name" content="ScreenSavy.com" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://screensavy.com" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={ogDescription} />
      <meta
        name="twitter:image"
        content="https://screensavy.com/twitter-image.jpg"
      />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "ScreenSavy",
            "url": "https://screensavy.com",
            "description": "${language === "ru" ? "Веб-платформа для создания цветовых фонов, заставок и скринсейверов." : "Web platform for creating color backgrounds, screensavers and visual effects."}",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        `}
      </script>
      <meta name="author" content="Nerual Dreming" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="generator" content="React" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />
    </Helmet>
  );
};

type MainExperienceProps = {
  visualizerMode?: boolean;
  visualizerSlug?: string;
  visualizerCategory?: "audio" | "ambient";
  iframeRef?: React.RefObject<HTMLIFrameElement>;
};

const MainExperience = ({ 
  visualizerMode = false,
  visualizerSlug,
  visualizerCategory,
  iframeRef
}: MainExperienceProps = {}) => {
  const router = useRouter();
  const [languageSetting, setLanguageSetting] =
    useState<LanguageSetting>("auto");
  const [detectedLanguage, setDetectedLanguage] = useState<Language>("en");
  const [currentHex, setCurrentHex] = useState("#5508FD");
  const [rgb, setRgb] = useState<Rgb>({ r: 85, g: 8, b: 253 });
  const [showShades, setShowShades] = useState(true);
  const [showRgbPanel, setShowRgbPanel] = useState(true);
  const [showFavorites, setShowFavorites] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(INITIAL_FAVORITES);
  const [interfaceHidden, setInterfaceHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModes, setActiveModes] = useState<ModeKey[]>(["oneColor"]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [clockStyle, setClockStyle] = useState<ClockStyle>("modern");
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

  const rootRef = useRef<HTMLDivElement | null>(null);
  const colorChangeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionIndexRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const nextColorRef = useRef<Rgb | null>(null);
  const animationFrame = useAnimationFrame();

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      setUiHydrated(true);
      return;
    }

    try {
      const stored = window.localStorage.getItem(MAIN_UI_STORAGE_KEY);
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
      if (
        parsed.clockStyle === "modern" ||
        parsed.clockStyle === "full" ||
        parsed.clockStyle === "minimal"
      ) {
        setClockStyle(parsed.clockStyle);
      }
    } catch (error) {
      console.error("Failed to restore main UI state", error);
    } finally {
      setUiHydrated(true);
    }
  }, []);

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedHex = localStorage.getItem("screensavy-main-color");
    if (storedHex) {
      setCurrentHex(storedHex);
      const parsed = hexToRgb(storedHex);
      if (parsed) {
        setRgb(parsed);
      }
    }

    const storedRgb = localStorage.getItem("screensavy-main-rgb");
    if (storedRgb) {
      try {
        const parsed = JSON.parse(storedRgb) as Rgb;
        if (
          typeof parsed?.r === "number" &&
          typeof parsed?.g === "number" &&
          typeof parsed?.b === "number"
        ) {
          setRgb(parsed);
          setCurrentHex(rgbToHex(parsed));
        }
      } catch (error) {
        console.warn("Failed to parse stored RGB", error);
      }
    }

    const storedFavorites = localStorage.getItem("screensavy-main-favorites");
    if (storedFavorites) {
      try {
        const parsed = JSON.parse(storedFavorites);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
          setFavorites(parsed);
        }
      } catch (error) {
        console.warn("Failed to parse stored favorites", error);
      }
    }
  }, []);

  useEffect(() => {
    if (languageSetting !== "auto") return;
    setDetectedLanguage(detectBrowserLanguage());
  }, [languageSetting]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("screensavy-main-color", currentHex);
  }, [currentHex]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("screensavy-main-rgb", JSON.stringify(rgb));
  }, [rgb]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("screensavy-main-favorites", JSON.stringify(favorites));
  }, [favorites]);

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
        nextColorRef.current = next;
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
    const visited = localStorage.getItem("screensavy-visited");
    if (visited) {
      setShowWelcome(false);
      setShowPickerHint(false);
      setShowColorsHint(false);
      setShowShadesHint(false);
    } else {
      localStorage.setItem("screensavy-visited", "true");
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
        setCurrentHex(rgbToHex(nextColor));
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
  }, [pickerActive, animationFrame]);

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
      clockStyle,
    };

    const isDefault =
      uiState.showShades === MAIN_UI_DEFAULTS.showShades &&
      uiState.showRgbPanel === MAIN_UI_DEFAULTS.showRgbPanel &&
      uiState.showFavorites === MAIN_UI_DEFAULTS.showFavorites &&
      uiState.menuOpen === MAIN_UI_DEFAULTS.menuOpen &&
      uiState.hintsEnabled === MAIN_UI_DEFAULTS.hintsEnabled &&
      uiState.aboutOpen === MAIN_UI_DEFAULTS.aboutOpen &&
      uiState.clockStyle === MAIN_UI_DEFAULTS.clockStyle;

    if (isDefault) {
      window.localStorage.removeItem(MAIN_UI_STORAGE_KEY);
    } else {
      window.localStorage.setItem(
        MAIN_UI_STORAGE_KEY,
        JSON.stringify(uiState),
      );
    }
  }, [
    aboutOpen,
    clockStyle,
    hintsEnabled,
    menuOpen,
    showFavorites,
    showRgbPanel,
    showShades,
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

  const handleStartMicrophone = useCallback(async (deviceId: string) => {
    if (iframeRef?.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: "START_AUDIO",
        source: "microphone",
        deviceId
      }, "*");
    }
    setShowVisualizerModal(false);
  }, [iframeRef]);

  const handleStartSystem = useCallback(async () => {
    if (iframeRef?.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: "START_AUDIO",
        source: "system"
      }, "*");
    }
    setShowVisualizerModal(false);
  }, [iframeRef]);

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
      setRgb((previous) => {
        const next = { ...previous, [channel]: clampChannel(value) } as Rgb;
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
      return current.includes("oneColor")
        ? [...current.filter((value) => value !== "oneColor"), mode]
        : [...current, mode];
    });
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

  const toolbarButtons: Record<ToolbarButtonKey, ToolbarButtonState> = {
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
        setCurrentHex(rgbToHex(random));
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
      icon: "webhook",
      onClick: () => {},
      title:
        activeLanguage === "ru"
          ? "Настройки текста недоступны"
          : "Text options unavailable",
      disabled: true,
      hidden: true,
    },
    toggleHints: {
      icon: "help",
      onClick: toggleHints,
      title: getText("toggleHints"),
      active: hintsEnabled,
    },
  };

  const backgroundStyle = {
    backgroundColor: visualizerMode ? "transparent" : currentHex,
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
    <HelmetProvider>
      <div 
        ref={rootRef} 
        style={backgroundStyle}
        className={visualizerMode ? "visualizer-mode-root" : ""}
      >
        <MetaTags language={activeLanguage} />
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
        {!visualizerMode && activeModes.includes("clock") && !interfaceHidden && (
          <Clock clockStyle={clockStyle} language={activeLanguage} />
        )}
        {!visualizerMode && activeModes.includes("colorChange") &&
          !interfaceHidden &&
          favorites.length > 1 && (
            <SpeedControl speed={speed} onChange={setSpeed} />
          )}
        {!visualizerMode && (
          <>
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
              
              if (hideInVisualizerMode) return null;
              
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
            />
          </div>
          <IconButton
            icon={interfaceHidden ? "lightbulb" : "light_off"}
            onClick={() => setInterfaceHidden((value) => !value)}
            title={getText(interfaceHidden ? "showInterface" : "hideInterface")}
            active={interfaceHidden}
            className={interfaceHidden ? "interface-toggle--inactive" : undefined}
          />
        </div>
        {!visualizerMode && (
          <div
            className={`clock-control-row ${activeModes.includes("clock") && !interfaceHidden ? "active" : ""}`}
          >
            <IconButton
              icon="schedule"
              onClick={() => setClockStyle("modern")}
              title={getText("modernClock")}
              active={clockStyle === "modern"}
            />
            <IconButton
              icon="calendar_clock"
              onClick={() => setClockStyle("full")}
              title={getText("fullClock")}
              active={clockStyle === "full"}
            />
            <IconButton
              icon="history_toggle_off"
              onClick={() => setClockStyle("minimal")}
              title={getText("minimalClock")}
              active={clockStyle === "minimal"}
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
            />
            <IconButton
              icon="flare"
              onClick={() => router.push('/modes/visualizers/supernova')}
              title="Super Nova"
              active={typeof window !== 'undefined' && window.location.pathname === '/modes/visualizers/supernova'}
            />
            <IconButton
              icon="rocket_launch"
              onClick={() => router.push('/modes/visualizers/voyager')}
              title="Voyager"
              active={typeof window !== 'undefined' && window.location.pathname === '/modes/visualizers/voyager'}
            />
            <IconButton
              icon="water_drop"
              onClick={() => router.push('/modes/visualizers/lava-lamp')}
              title="Lava Lamp"
              active={typeof window !== 'undefined' && window.location.pathname === '/modes/visualizers/lava-lamp'}
            />
            <IconButton
              icon="gradient"
              onClick={() => router.push('/modes/visualizers/rgb-lava')}
              title="RGB Lava"
              active={typeof window !== 'undefined' && window.location.pathname === '/modes/visualizers/rgb-lava'}
            />
          </div>
        )}
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
              className="menu-item"
              onClick={() => {
                setMenuOpen(false);
                router.push("/modes/text");
              }}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">text_fields</i>
              </div>
              {getText("textMode")}
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
            <div
              className={`menu-item ${activeModes.includes("clock") ? "active" : ""}`}
              onClick={() => toggleMode("clock")}
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
                <i className="material-symbols-outlined">flare</i>
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
                <i className="material-symbols-outlined">gradient</i>
              </div>
              RGB Lava
            </div>
            <div className="menu-separator" />
            <div className="menu-item disabled">
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">tv_gen</i>
              </div>
              <div className="menu-item-content">
                <div>{getText("playerMode")}</div>
                <span className="coming-soon-badge">
                  {getText("comingSoon")}
                </span>
              </div>
            </div>
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
            <div className="menu-item" onClick={toggleLanguage}>
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
            <div className="menu-item" onClick={() => setAboutOpen(true)}>
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">info</i>
              </div>
              {getText("about")}
            </div>
          </div>
        )}
        {!visualizerMode && (
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
        {!visualizerMode && (
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
    </HelmetProvider>
  );
};

export default MainExperience;
