'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {
  clampChannel,
  generateShadeSets,
  getSpeedDelay,
  hexToRgb,
  rgbToHex,
  type Rgb
} from '@/lib/color';
import {
  getTranslation,
  type Language,
  type LanguageSetting,
  type MainTranslationKey
} from './translations';

const INITIAL_FAVORITES = [
  '#000000',
  '#FFFFFF',
  '#808080',
  '#FF0000',
  '#0000FF',
  '#00FF00',
  '#FFC107',
  '#3F51B5',
  '#E91E63',
  '#5508FD'
];

type ModeKey = 'oneColor' | 'colorChange' | 'clock';
type ClockStyle = 'modern' | 'full' | 'minimal';

type SliderChannel = keyof Rgb;

const dayNames: Record<Language, string[]> = {
  ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};

const detectBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const raw = navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage || 'en';
  const base = raw.split('-')[0].toLowerCase();
  const slavic: Language[] = ['ru'];
  return slavic.includes(base as Language) ? 'ru' : 'en';
};



const IconButton = ({ icon, onClick, title, active, label }: IconButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`icon-button${active ? ' active' : ''}`}
    title={title}
  >
    {label ? <span className="text-button">{label}</span> : <i className="material-symbols-outlined">{icon}</i>}
  </button>
);

const useAnimationFrame = () => {
  const frameRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const request = useCallback((callback: FrameRequestCallback) => {
    cancel();
    frameRef.current = requestAnimationFrame(callback);
  }, [cancel]);

  useEffect(() => cancel, [cancel]);

  return { request, cancel };
};

type RgbSliderProps = {
  channel: SliderChannel;
  value: number;
  color: string;
  onChange: (channel: SliderChannel, value: number) => void;
};

const RgbSlider = ({ channel, value, color, onChange }: RgbSliderProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const relative = clampChannel(((clientX - rect.left) / rect.width) * 255);
      onChange(channel, relative);
    },
    [channel, onChange]
  );

  useEffect(() => {
    if (!dragging) return;

    const onPointerMove = (event: PointerEvent) => {
      handleClientX(event.clientX);
    };

    const stop = () => {
      setDragging(false);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stop, { once: true });
    window.addEventListener('pointercancel', stop, { once: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [dragging, handleClientX]);

  return (
    <div className="slider-container">
      <div className="channel-indicator" style={{ backgroundColor: color }} />
      <div
        className="slider-track"
        ref={trackRef}
        onPointerDown={(event) => {
          event.preventDefault();
          setDragging(true);
          handleClientX(event.clientX);
        }}
      >
        <div
          className="slider-fill"
          style={{ width: `${(value / 255) * 100}%`, backgroundColor: color }}
        />
        <div
          className="slider-thumb"
          style={{ left: `${(value / 255) * 100}%` }}
        />
      </div>
      <input
        type="number"
        min={0}
        max={255}
        value={value}
        className="channel-value"
        onChange={(event) => onChange(channel, clampChannel(Number(event.target.value)))}
      />
    </div>
  );
};

type SpeedControlProps = {
  speed: number;
  onChange: (value: number) => void;
};

const SpeedControl = ({ speed, onChange }: SpeedControlProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const next = Math.round(ratio * 9) + 1;
      onChange(next);
    },
    [onChange]
  );

  useEffect(() => {
    if (!dragging) return;

    const onPointerMove = (event: PointerEvent) => handleClientX(event.clientX);
    const stop = () => setDragging(false);

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stop, { once: true });
    window.addEventListener('pointercancel', stop, { once: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [dragging, handleClientX]);

  const percentage = ((speed - 1) / 9) * 100;

  return (
    <div className="speed-control">
      <div className="speed-icon slow" style={{ opacity: speed <= 3 ? 1 : 0.7 }}>
        <i className="material-symbols-outlined">speed</i>
      </div>
      <div
        className="slider-track"
        ref={trackRef}
        onPointerDown={(event) => {
          event.preventDefault();
          setDragging(true);
          handleClientX(event.clientX);
        }}
      >
        <div className="slider-fill" style={{ width: `${percentage}%` }} />
        <div className="slider-thumb" style={{ left: `${percentage}%` }} />
      </div>
      <div className="speed-icon fast" style={{ opacity: speed >= 8 ? 1 : 0.7 }}>
        <i className="material-symbols-outlined">history_toggle_off</i>
      </div>
    </div>
  );
};

type RgbPanelProps = {
  hexValue: string;
  rgb: Rgb;
  show: boolean;
  onHexChange: (value: string) => void;
  onChannelChange: (channel: SliderChannel, value: number) => void;
  onCopyHex: () => void;
  copySuccess: boolean;
};

const RgbPanel = ({
  hexValue,
  rgb,
  show,
  onHexChange,
  onChannelChange,
  onCopyHex,
  copySuccess
}: RgbPanelProps) => (
  <div className={`rgb-panel${show ? ' active' : ''}`}>
    <RgbSlider channel="r" value={rgb.r} color="#FF5252" onChange={onChannelChange} />
    <RgbSlider channel="g" value={rgb.g} color="#4CAF50" onChange={onChannelChange} />
    <RgbSlider channel="b" value={rgb.b} color="#2196F3" onChange={onChannelChange} />
    <div className="hex-input-container">
      <div className="hex-input-wrapper">
        <input
          type="text"
          value={hexValue}
          onChange={(event) => onHexChange(event.target.value)}
          className="hex-input"
        />
        <button
          type="button"
          onClick={onCopyHex}
          className="copy-button"
          style={{ background: copySuccess ? 'rgba(75, 181, 67, 0.5)' : 'rgba(255, 255, 255, 0.15)' }}
        >
          <i className="material-symbols-outlined">{copySuccess ? 'check_small' : 'content_copy'}</i>
        </button>
      </div>
    </div>
  </div>
);

type ShadesPanelProps = {
  rgb: Rgb;
  visible: boolean;
  hintsEnabled: boolean;
  showHint: boolean;
  translation: (key: MainTranslationKey) => string;
  onCloseHint: () => void;
  onSelectShade: (hex: string) => void;
};

const ShadesPanel = ({
  rgb,
  visible,
  hintsEnabled,
  showHint,
  translation,
  onCloseHint,
  onSelectShade
}: ShadesPanelProps) => {
  const shadeSets = useMemo(() => generateShadeSets(rgb), [rgb]);

  if (!visible) return null;

  return (
    <div className="shades-panel">
      {hintsEnabled && showHint && (
        <div className="shades-hint hint">
          <p>{translation('shadesHint')}</p>
          <button type="button" className="hint-close-button" onClick={onCloseHint}>
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>
      )}
      <div className="shade-container">
        {[shadeSets.baseHexShades, shadeSets.saturationHexShades, shadeSets.adjacentHexShades].map(
          (row, rowIndex) => (
            <div className="shade-row" key={`row-${rowIndex}`}>
              {row.map((shade, index) => (
                <div
                  key={`${rowIndex}-${index}`}
                  className="shade-box"
                  style={{ backgroundColor: shade }}
                  onClick={() => onSelectShade(shade)}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

type WelcomeNotificationProps = {
  visible: boolean;
  translation: (key: MainTranslationKey) => string;
  onClose: () => void;
};

const WelcomeNotification = ({ visible, translation, onClose }: WelcomeNotificationProps) => {
  if (!visible) return null;
  return (
    <div className="welcome-notification">
      <div className="welcome-content">
        <div className="welcome-icon">
          <div className="menu-logo-image">
            <div className="menu-logo-inner" />
          </div>
        </div>
        <div className="welcome-text">
          <h3>{translation('welcome')}</h3>
          <p style={{ whiteSpace: 'pre-line' }}>{translation('welcomeMessage')}</p>
        </div>
        <button type="button" className="welcome-close-button" onClick={onClose}>
          {translation('got_it')}
        </button>
      </div>
    </div>
  );
};

type SupportLink = {
  href: string;
  icon: string;
  labelKey: MainTranslationKey;
  className: string;
};

const SUPPORT_LINKS: SupportLink[] = [
  {
    href: 'https://www.donationalerts.com/r/nerual_dreming',
    icon: 'paid',
    labelKey: 'donate',
    className: 'support-button donate-button'
  },
  {
    href: 'https://boosty.to/neuro_art',
    icon: 'loyalty',
    labelKey: 'subscription',
    className: 'support-button subscription-button'
  },
  {
    href: 'https://www.youtube.com/@nerual_dreming/',
    icon: 'subscriptions',
    labelKey: 'youtube',
    className: 'support-button youtube-button'
  }
];

type AboutModalProps = {
  open: boolean;
  languageSetting: LanguageSetting;
  detected: Language;
  translation: (key: MainTranslationKey) => string;
  onClose: () => void;
};

const AboutModal = ({ open, translation, languageSetting, detected, onClose }: AboutModalProps) => {
  if (!open) return null;

  const language = languageSetting === 'auto' ? detected : languageSetting;
  const founderText = language === 'ru'
    ? (
        <>
          Основатель{' '}
          <a href="https://artgeneration.me" target="_blank" rel="noopener noreferrer">
            ArtGeneration.me
          </a>
          , техноблогер и нейро-евангелист
        </>
      )
    : (
        <>
          Founder of{' '}
          <a href="https://artgeneration.me" target="_blank" rel="noopener noreferrer">
            ArtGeneration.me
          </a>
          , tech blogger and neuro-evangelist
        </>
      );

  return (
    <div className="modal about-modal">
      <div className="modal-content about-content">
        <div className="modal-header">
          <div className="modal-logo">
            <img src="/favicon.svg" alt="ScreenSavy Logo" className="logo-image" width={24} height={24} />
            <h2>{translation('aboutTitle')}</h2>
          </div>
          <button type="button" className="modal-close-button" onClick={onClose}>
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: translation('aboutDescription') }} />
        <div className="author-block">
          <h3>{translation('author')}</h3>
          <p>
            <strong>
              <a href="https://t.me/neuro_art0" target="_blank" rel="noopener noreferrer">
                {translation('authorName')}
              </a>
            </strong>
          </p>
          <p>{founderText}</p>
        </div>
        <div className="support-links">
          {SUPPORT_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={link.className}
            >
              <i className="material-symbols-outlined">{link.icon}</i>
              {translation(link.labelKey)}
            </a>
          ))}
        </div>
        <button type="button" className="modal-button" onClick={onClose}>
          {translation('close')}
        </button>
      </div>
    </div>
  );
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

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const date = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  const day = dayNames[language][now.getDay()];

  if (clockStyle === 'modern') {
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

  if (clockStyle === 'full') {
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

  if (clockStyle === 'minimal') {
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
  interfaceHidden
}: FavoritesPanelProps) => (
  <div
    className="saved-colors"
    style={{ opacity: interfaceHidden ? 0 : 1, pointerEvents: interfaceHidden ? 'none' : 'auto' }}
  >
    {hintsEnabled && showHint && (
      <div className="colors-hint hint">
        <p>{translation('colorsHint')}</p>
        <button type="button" className="hint-close-button" onClick={onCloseHint}>
          <i className="material-symbols-outlined">close</i>
        </button>
      </div>
    )}
    <div className="favorite-buttons">
      <div
        className="add-to-favorites-button"
        onClick={onAddFavorite}
        title={translation('addToFavorites')}
        role="button"
      >
        <i className="material-symbols-outlined">favorite</i>
      </div>
      <div
        className="clear-favorites-button"
        onClick={onClearFavorites}
        title={translation('clearFavorites')}
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
        <div className="delete-color" onClick={(event) => {
          event.stopPropagation();
          onRemoveFavorite(favorite);
        }}>
          <i className="material-symbols-outlined" style={{ fontSize: '12px' }}>
            close
          </i>
        </div>
      </div>
    ))}
  </div>
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
      <p>{translation('pickerHint')}</p>
      <button type="button" className="hint-close-button" onClick={onClose}>
        <i className="material-symbols-outlined">close</i>
      </button>
    </div>
  );
};

const MetaTags = ({ language }: { language: Language }) => {
  const title = language === 'ru'
    ? 'ScreenSavy.com - Интерактивные заставки для экрана'
    : 'ScreenSavy.com - Interactive Screen Backgrounds';

  const description = language === 'ru'
    ? 'ScreenSavy.com - веб-платформа для создания цветовых фонов, заставок и скринсейверов. Настраивайте цвета экрана, анимации и часы для любого устройства.'
    : 'ScreenSavy.com - web platform for creating color backgrounds, screensavers and visual effects. Customize screen colors, animations and clocks for any device.';

  const keywords = language === 'ru'
    ? 'скринсейвер, заставка экрана, цветовой фон, цветовой пикер, подсветка комнаты, часы для экрана, анимация экрана, фон для монитора, RGB цвета, тестирование монитора'
    : 'screensaver, screen background, color picker, room lighting, screen clock, screen animation, monitor background, RGB colors, monitor testing, color utility';

  const ogDescription = language === 'ru'
    ? 'Создавайте красивые цветовые фоны, заставки и визуальные эффекты для вашего экрана'
    : 'Create beautiful color backgrounds, screensavers and visual effects for your screen';

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
      <meta property="og:locale" content={language === 'ru' ? 'ru_RU' : 'en_US'} />
      <meta property="og:site_name" content="ScreenSavy.com" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://screensavy.com" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content="https://screensavy.com/twitter-image.jpg" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "ScreenSavy",
            "url": "https://screensavy.com",
            "description": "${language === 'ru' ? 'Веб-платформа для создания цветовых фонов, заставок и скринсейверов.' : 'Web platform for creating color backgrounds, screensavers and visual effects.'}",
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
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />
    </Helmet>
  );
};

const MainExperience = () => {
  const [languageSetting, setLanguageSetting] = useState<LanguageSetting>('auto');
  const [detectedLanguage, setDetectedLanguage] = useState<Language>('en');
  const [currentHex, setCurrentHex] = useState('#5508FD');
  const [rgb, setRgb] = useState<Rgb>({ r: 85, g: 8, b: 253 });
  const [showShades, setShowShades] = useState(true);
  const [showRgbPanel, setShowRgbPanel] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(INITIAL_FAVORITES);
  const [interfaceHidden, setInterfaceHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModes, setActiveModes] = useState<ModeKey[]>(['oneColor']);
  const [copySuccess, setCopySuccess] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [clockStyle, setClockStyle] = useState<ClockStyle>('modern');
  const [pickerActive, setPickerActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showColorsHint, setShowColorsHint] = useState(true);
  const [showShadesHint, setShowShadesHint] = useState(true);
  const [showPickerHint, setShowPickerHint] = useState(true);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const colorChangeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionIndexRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const nextColorRef = useRef<Rgb | null>(null);
  const animationFrame = useAnimationFrame();

  const getText = useCallback(
    (key: MainTranslationKey) => getTranslation(languageSetting, detectedLanguage, key),
    [languageSetting, detectedLanguage]
  );

  useEffect(() => {
    setDetectedLanguage(detectBrowserLanguage());
  }, []);

  useEffect(() => {
    if (languageSetting !== 'auto') return;
    setDetectedLanguage(detectBrowserLanguage());
  }, [languageSetting]);

  useEffect(() => {
    if (!activeModes.includes('colorChange') || favorites.length <= 1) {
      if (colorChangeTimerRef.current) {
        clearTimeout(colorChangeTimerRef.current);
        colorChangeTimerRef.current = null;
      }
      return;
    }

    let current = hexToRgb(favorites[transitionIndexRef.current]);
    let next = hexToRgb(favorites[(transitionIndexRef.current + 1) % favorites.length]);
    if (!current || !next) return;

    nextColorRef.current = next;

    const step = () => {
      transitionProgressRef.current += 0.01;
      if (transitionProgressRef.current >= 1) {
        transitionIndexRef.current = (transitionIndexRef.current + 1) % favorites.length;
        current = hexToRgb(favorites[transitionIndexRef.current]) ?? current;
        next = hexToRgb(favorites[(transitionIndexRef.current + 1) % favorites.length]) ?? next;
        transitionProgressRef.current = 0;
        nextColorRef.current = next;
      }

      const progress = transitionProgressRef.current;
      const interpolated: Rgb = {
        r: Math.round(current.r + progress * (next.r - current.r)),
        g: Math.round(current.g + progress * (next.g - current.g)),
        b: Math.round(current.b + progress * (next.b - current.b))
      };

      setRgb(interpolated);
      setCurrentHex(rgbToHex(interpolated));

      colorChangeTimerRef.current = setTimeout(step, getSpeedDelay(speed) / 100);
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
    if (typeof window === 'undefined') return;
    const visited = localStorage.getItem('screensavy-visited');
    if (visited) {
      setShowWelcome(false);
      setShowPickerHint(false);
      setShowColorsHint(false);
      setShowShadesHint(false);
    } else {
      localStorage.setItem('screensavy-visited', 'true');
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

    element.addEventListener('mousemove', handleMove);
    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('click', handleClick);
      animationFrame.cancel();
    };
  }, [pickerActive, animationFrame]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange as EventListener);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange as EventListener);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange as EventListener);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange as EventListener);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange as EventListener);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange as EventListener);
    };
  }, []);

  const handleHexChange = useCallback((value: string) => {
    if (!/^#?[0-9A-Fa-f]{0,6}$/.test(value)) return;
    const normalized = value.startsWith('#') ? value.toUpperCase() : `#${value.toUpperCase()}`;
    setCurrentHex(normalized);
    if (/^#[0-9A-F]{6}$/i.test(normalized)) {
      const parsed = hexToRgb(normalized);
      if (parsed) {
        setRgb(parsed);
      }
    }
  }, []);

  const handleChannelChange = useCallback((channel: SliderChannel, value: number) => {
    setRgb((previous) => {
      const next = { ...previous, [channel]: clampChannel(value) } as Rgb;
      setCurrentHex(rgbToHex(next));
      return next;
    });
  }, []);

  const handleAddFavorite = useCallback(() => {
    setFavorites((current) => (current.includes(currentHex) ? current : [...current, currentHex]));
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
      console.error('Failed to copy:', error);
    }
  }, [currentHex]);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageSetting((previous) => {
      if (previous === 'auto') {
        return detectedLanguage === 'ru' ? 'en' : 'ru';
      }
      return previous === 'ru' ? 'en' : 'ru';
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
        return filtered.length === 0 ? ['oneColor'] : filtered;
      }
      if (mode === 'oneColor') {
        return ['oneColor'];
      }
      return current.includes('oneColor')
        ? [...current.filter((value) => value !== 'oneColor'), mode]
        : [...current, mode];
    });
  }, []);

  const handleAddToBookmarks = useCallback(() => {
    try {
      if (window.sidebar && typeof window.sidebar.addPanel === 'function') {
        window.sidebar.addPanel(document.title, window.location.href, '');
      } else if (window.external && 'AddFavorite' in window.external) {
        // @ts-expect-error legacy IE API
        window.external.AddFavorite(window.location.href, document.title);
      } else {
        alert(getText('bookmarkError'));
      }
      setMenuOpen(false);
    } catch {
      alert(getText('bookmarkError'));
    }
  }, [getText]);

  const activeLanguage = languageSetting === 'auto' ? detectedLanguage : languageSetting;

  const backgroundStyle = {
    backgroundColor: currentHex,
    height: '100vh',
    width: '100vw',
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'background-color 0.3s ease',
    cursor: pickerActive ? 'crosshair' : 'default',
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
  };

  return (
    <HelmetProvider>
      <div ref={rootRef} style={backgroundStyle}>
        <MetaTags language={activeLanguage} />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5DXQTQ6C"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <WelcomeNotification
          visible={hintsEnabled && showWelcome}
          translation={getText}
          onClose={() => setShowWelcome(false)}
        />
        <AboutModal
          open={aboutOpen}
          onClose={() => setAboutOpen(false)}
          translation={getText}
          languageSetting={languageSetting}
          detected={detectedLanguage}
        />
        {activeModes.includes('clock') && !interfaceHidden && (
          <Clock clockStyle={clockStyle} language={activeLanguage} />
        )}
        {activeModes.includes('colorChange') && !interfaceHidden && favorites.length > 1 && (
          <SpeedControl speed={speed} onChange={setSpeed} />
        )}
        <ShadesPanel
          rgb={rgb}
          visible={showShades && !interfaceHidden}
          hintsEnabled={hintsEnabled}
          showHint={showShadesHint}
          translation={getText}
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
          style={{ opacity: interfaceHidden ? 0 : 1, pointerEvents: interfaceHidden ? 'none' : 'auto' }}
        >
          <div className="top-buttons-row">
            <IconButton
              icon="menu"
              onClick={() => setMenuOpen((value) => !value)}
              title={activeLanguage === 'ru' ? 'Меню' : 'Menu'}
              active={menuOpen}
            />
            <IconButton
              icon="cached"
              onClick={() => {
                const random = {
                  r: Math.floor(Math.random() * 256),
                  g: Math.floor(Math.random() * 256),
                  b: Math.floor(Math.random() * 256)
                };
                setRgb(random);
                setCurrentHex(rgbToHex(random));
              }}
              title={activeLanguage === 'ru' ? 'Случайный цвет' : 'Random color'}
            />
            <IconButton
              icon="palette"
              onClick={() => setShowShades((value) => !value)}
              title={activeLanguage === 'ru' ? 'Палитра оттенков' : 'Color palette'}
              active={showShades}
            />
            <IconButton
              icon=""
              label="RGB"
              onClick={() => setShowRgbPanel((value) => !value)}
              title={activeLanguage === 'ru' ? 'RGB настройки' : 'RGB settings'}
              active={showRgbPanel}
            />
            <IconButton
              icon="web_traffic"
              onClick={() => {
                setPickerActive((value) => !value);
                if (!pickerActive) {
                  setShowPickerHint(true);
                }
              }}
              title={activeLanguage === 'ru' ? 'Режим выбора цвета' : 'Color picker mode'}
              active={pickerActive}
            />
            <IconButton
              icon="help"
              onClick={toggleHints}
              title={getText('toggleHints')}
              active={hintsEnabled}
            />
          </div>
        </div>
        <div
          className="right-buttons"
          style={{ opacity: interfaceHidden ? 0 : 1, pointerEvents: interfaceHidden ? 'none' : 'auto' }}
        >
          <IconButton
            icon={isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            onClick={toggleFullscreen}
            title={getText(isFullscreen ? 'exitFullscreen' : 'fullscreen')}
          />
          <IconButton
            icon={interfaceHidden ? 'lightbulb' : 'light_off'}
            onClick={() => setInterfaceHidden((value) => !value)}
            title={getText(interfaceHidden ? 'showInterface' : 'hideInterface')}
            active={interfaceHidden}
          />
        </div>
        <div className={`clock-control-row ${activeModes.includes('clock') && !interfaceHidden ? 'active' : ''}`}>
          <IconButton
            icon="schedule"
            onClick={() => setClockStyle('modern')}
            title={getText('modernClock')}
            active={clockStyle === 'modern'}
          />
          <IconButton
            icon="calendar_clock"
            onClick={() => setClockStyle('full')}
            title={getText('fullClock')}
            active={clockStyle === 'full'}
          />
          <IconButton
            icon="history_toggle_off"
            onClick={() => setClockStyle('minimal')}
            title={getText('minimalClock')}
            active={clockStyle === 'minimal'}
          />
        </div>
        {menuOpen && (
          <div className="menu-container">
            <div className="menu-logo">
              <div className="menu-logo-left">
                <div className="menu-logo-image">
                  <img src="/favicon.svg" alt="ScreenSavy Logo" width={24} height={24} />
                </div>
                <span className="menu-logo-text">
                  ScreenSavy
                  <span className="menu-logo-domain">.com</span>
                </span>
              </div>
              <button type="button" className="bookmark-button" onClick={handleAddToBookmarks} title={getText('bookmarkSite')}>
                <i className="material-symbols-outlined favorite-filled">favorite</i>
              </button>
            </div>
            <div className="menu-separator" />
            <div
              className={`menu-item ${activeModes.includes('oneColor') ? 'active' : ''}`}
              onClick={() => toggleMode('oneColor')}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">colors</i>
              </div>
              {getText('oneColor')}
            </div>
            <div
              className={`menu-item ${activeModes.includes('colorChange') ? 'active' : ''}`}
              onClick={() => toggleMode('colorChange')}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">model_training</i>
              </div>
              {getText('colorChange')}
            </div>
            <div
              className={`menu-item ${activeModes.includes('clock') ? 'active' : ''}`}
              onClick={() => toggleMode('clock')}
            >
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">schedule</i>
              </div>
              {getText('clock')}
            </div>
            <Link href="/modes/text" className="menu-item" onClick={() => setMenuOpen(false)}>
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">text_fields</i>
              </div>
              {getText('textMode')}
            </Link>
            <div className="menu-item disabled">
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">tv_gen</i>
              </div>
              <div className="menu-item-content">
                <div>{getText('playerMode')}</div>
                <span className="coming-soon-badge">{getText('comingSoon')}</span>
              </div>
            </div>
            <div className="menu-item disabled">
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">animation</i>
              </div>
              <div className="menu-item-content">
                <div>{getText('animationMode')}</div>
                <span className="coming-soon-badge">{getText('comingSoon')}</span>
              </div>
            </div>
            <div className="menu-item disabled">
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">publish</i>
              </div>
              <div className="menu-item-content">
                <div>{getText('createOwnMode')}</div>
                <span className="coming-soon-badge">{getText('comingSoon')}</span>
              </div>
            </div>
            <div className="menu-separator" />
            <div className="menu-item" onClick={toggleLanguage}>
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">language</i>
              </div>
              {getText('language')}: {languageSetting === 'auto' ? (detectedLanguage === 'ru' ? 'Русский (auto)' : 'English (auto)') : languageSetting === 'ru' ? 'Русский' : 'English'}
            </div>
            <div className="menu-item" onClick={() => setAboutOpen(true)}>
              <div className="menu-item-icon">
                <i className="material-symbols-outlined">info</i>
              </div>
              {getText('about')}
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
          visible={pickerActive && !interfaceHidden && hintsEnabled && showPickerHint}
          translation={getText}
          onClose={() => setShowPickerHint(false)}
        />
      </div>
    </HelmetProvider>
  );
};

export default MainExperience;
