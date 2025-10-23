"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Rgb } from "@/lib/color";
import {
  SPEED_MAX,
  SPEED_MIN,
  clampChannel,
  generateShadeSets,
} from "@/lib/color";
import type {
  Language,
  LanguageSetting,
  MainTranslationKey,
} from "./translations";
import type { TextTranslationKey } from "./textTranslations";

export type CommonTranslationKey = MainTranslationKey | TextTranslationKey;

export const INITIAL_FAVORITES = [
  "#000000",
  "#FFFFFF",
  "#808080",
  "#FF0000",
  "#0000FF",
  "#00FF00",
  "#FFC107",
  "#3F51B5",
  "#E91E63",
  "#5508FD",
];

export const dayNames: Record<Language, string[]> = {
  ru: [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ],
  en: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
};

const SLAVIC_LANGUAGES: Language[] = ["ru"];

export const detectBrowserLanguage = (): Language => {
  if (typeof navigator === "undefined") {
    return "en";
  }

  const raw =
    navigator.language ||
    (navigator as unknown as { userLanguage?: string }).userLanguage ||
    "en";
  const base = raw.split("-")[0].toLowerCase();
  return SLAVIC_LANGUAGES.includes(base as Language) ? "ru" : "en";
};

export type IconButtonProps = {
  icon: string;
  onClick: () => void;
  title: string;
  active?: boolean;
  label?: string;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
};

export const IconButton = ({
  icon,
  onClick,
  title,
  active,
  label,
  disabled,
  hidden,
  className,
}: IconButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`icon-button${active ? " active" : ""}${hidden ? " hidden" : ""}${className ? ` ${className}` : ""}`}
    title={title}
    disabled={disabled}
  >
    {label ? (
      <span className="text-button">{label}</span>
    ) : (
      <i className="material-symbols-outlined">{icon}</i>
    )}
  </button>
);

export type ToolbarButtonKey =
  | "menu"
  | "randomColor"
  | "toggleShades"
  | "toggleRgb"
  | "toggleFavorites"
  | "picker"
  | "textOptions"
  | "toggleHints";

export type ToolbarButtonState = {
  icon: string;
  title: string;
  onClick: () => void;
  active?: boolean;
  label?: string;
  disabled?: boolean;
  hidden?: boolean;
};

export const TOP_TOOLBAR_BUTTONS: ToolbarButtonKey[] = [
  "menu",
  "randomColor",
  "toggleShades",
  "toggleRgb",
  "toggleFavorites",
  "picker",
  "textOptions",
  "toggleHints",
];

export const useAnimationFrame = () => {
  const frameRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const request = useCallback(
    (callback: FrameRequestCallback) => {
      cancel();
      frameRef.current = requestAnimationFrame(callback);
    },
    [cancel],
  );

  useEffect(() => cancel, [cancel]);

  return { request, cancel };
};

export type SliderChannel = keyof Rgb;

export type RgbSliderProps = {
  channel: SliderChannel;
  value: number;
  color: string;
  onChange: (channel: SliderChannel, value: number) => void;
};

export const RgbSlider = ({
  channel,
  value,
  color,
  onChange,
}: RgbSliderProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(
        Math.max((clientX - rect.left) / rect.width, 0),
        1,
      );
      const nextValue = clampChannel(ratio * 255);
      onChange(channel, nextValue);
    },
    [channel, onChange],
  );

  useEffect(() => {
    if (!dragging) return;

    const onPointerMove = (event: PointerEvent) => handleClientX(event.clientX);
    const stop = () => setDragging(false);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stop, { once: true });
    window.addEventListener("pointercancel", stop, { once: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
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
        onChange={(event) =>
          onChange(channel, clampChannel(Number(event.target.value)))
        }
      />
    </div>
  );
};

export type SpeedControlProps = {
  speed: number;
  onChange: (value: number) => void;
};

const SPEED_RANGE = SPEED_MAX - SPEED_MIN;
const LOW_SPEED_THRESHOLD = SPEED_MIN + SPEED_RANGE * 0.3;
const HIGH_SPEED_THRESHOLD = SPEED_MAX - SPEED_RANGE * 0.2;

export const SpeedControl = ({ speed, onChange }: SpeedControlProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(
        Math.max((clientX - rect.left) / rect.width, 0),
        1,
      );
      const rawSpeed = SPEED_MIN + ratio * SPEED_RANGE;
      const nextSpeed = Math.round(rawSpeed * 10) / 10;
      onChange(nextSpeed);
    },
    [onChange],
  );

  useEffect(() => {
    if (!dragging) return;

    const onPointerMove = (event: PointerEvent) => handleClientX(event.clientX);
    const stop = () => setDragging(false);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stop, { once: true });
    window.addEventListener("pointercancel", stop, { once: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [dragging, handleClientX]);

  const clampedSpeed = Math.min(Math.max(speed, SPEED_MIN), SPEED_MAX);
  const percentage =
    SPEED_RANGE === 0
      ? 0
      : ((clampedSpeed - SPEED_MIN) / SPEED_RANGE) * 100;

  return (
    <div className="speed-control">
      <div
        className="speed-icon slow"
        style={{ opacity: clampedSpeed <= LOW_SPEED_THRESHOLD ? 1 : 0.7 }}
      >
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
      <div
        className="speed-icon fast"
        style={{ opacity: clampedSpeed >= HIGH_SPEED_THRESHOLD ? 1 : 0.7 }}
      >
        <i className="material-symbols-outlined">history_toggle_off</i>
      </div>
    </div>
  );
};

export type RgbPanelProps = {
  hexValue: string;
  rgb: Rgb;
  show: boolean;
  onHexChange: (value: string) => void;
  onChannelChange: (channel: SliderChannel, value: number) => void;
  onCopyHex: () => void;
  copySuccess: boolean;
};

export const RgbPanel = ({
  hexValue,
  rgb,
  show,
  onHexChange,
  onChannelChange,
  onCopyHex,
  copySuccess,
}: RgbPanelProps) => (
  <div className={`rgb-panel${show ? " active" : ""}`}>
    <RgbSlider
      channel="r"
      value={rgb.r}
      color="#FF5252"
      onChange={onChannelChange}
    />
    <RgbSlider
      channel="g"
      value={rgb.g}
      color="#4CAF50"
      onChange={onChannelChange}
    />
    <RgbSlider
      channel="b"
      value={rgb.b}
      color="#2196F3"
      onChange={onChannelChange}
    />
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
          style={{
            background: copySuccess
              ? "rgba(75, 181, 67, 0.5)"
              : "rgba(255, 255, 255, 0.15)",
          }}
        >
          <i className="material-symbols-outlined">
            {copySuccess ? "check_small" : "content_copy"}
          </i>
        </button>
      </div>
    </div>
  </div>
);

export type ShadesPanelProps = {
  rgb: Rgb;
  visible: boolean;
  hintsEnabled: boolean;
  showHint: boolean;
  translation: (key: CommonTranslationKey) => string;
  onCloseHint: () => void;
  onSelectShade: (hex: string) => void;
};

export const ShadesPanel = ({
  rgb,
  visible,
  hintsEnabled,
  showHint,
  translation,
  onCloseHint,
  onSelectShade,
}: ShadesPanelProps) => {
  const shadeSets = useMemo(() => generateShadeSets(rgb), [rgb]);

  if (!visible) return null;

  return (
    <div className="shades-panel">
      {hintsEnabled && showHint && (
        <div className="shades-hint hint">
          <p>{translation("shadesHint")}</p>
          <button
            type="button"
            className="hint-close-button"
            onClick={onCloseHint}
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>
      )}
      <div className="shade-container">
        {[
          shadeSets.baseHexShades,
          shadeSets.saturationHexShades,
          shadeSets.adjacentHexShades,
        ].map((row, rowIndex) => (
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
        ))}
      </div>
    </div>
  );
};

export type WelcomeNotificationProps = {
  visible: boolean;
  translation: (key: CommonTranslationKey) => string;
  onClose: () => void;
};

export const WelcomeNotification = ({
  visible,
  translation,
  onClose,
}: WelcomeNotificationProps) => {
  if (!visible) return null;

  return (
    <div className="welcome-notification">
      <div className="welcome-content">
        <div className="welcome-icon">
          <div className="menu-logo-image">
            <img
              src="/favicon.svg"
              alt="ScreenSavy Logo"
              width={24}
              height={24}
            />
          </div>
        </div>
        <div className="welcome-text">
          <h3>{translation("welcome")}</h3>
          <p style={{ whiteSpace: "pre-line" }}>
            {translation("welcomeMessage")}
          </p>
        </div>
        <button
          type="button"
          className="welcome-close-button"
          onClick={onClose}
        >
          {translation("got_it")}
        </button>
      </div>
    </div>
  );
};

export type SupportLink<TKey extends string = MainTranslationKey> = {
  href: string;
  icon: string;
  labelKey: TKey;
  className?: string;
};

export const SUPPORT_LINKS: SupportLink[] = [
  {
    href: "https://www.donationalerts.com/r/nerual_dreming",
    icon: "paid",
    labelKey: "donate",
    className: "support-button donate-button",
  },
  {
    href: "https://boosty.to/neuro_art",
    icon: "loyalty",
    labelKey: "subscription",
    className: "support-button subscription-button",
  },
  {
    href: "https://www.youtube.com/@nerual_dreming/",
    icon: "subscriptions",
    labelKey: "youtube",
    className: "support-button youtube-button",
  },
  {
    href: "https://github.com/timoncool/ScreenSavy.com",
    icon: "code",
    labelKey: "github",
    className: "support-button github-button",
  },
];

const ABOUT_TRANSLATION_KEYS: MainTranslationKey[] = [
  "aboutTitle",
  "aboutDescription",
  "author",
  "authorName",
  "founder",
  "donate",
  "subscription",
  "youtube",
  "close",
];

type AboutTranslationKey = (typeof ABOUT_TRANSLATION_KEYS)[number];

type AboutModalProps = {
  open: boolean;
  languageSetting: LanguageSetting;
  detected: Language;
  translation: (key: AboutTranslationKey) => string;
  onClose: () => void;
};

export const AboutModal = ({
  open,
  languageSetting,
  detected,
  translation,
  onClose,
}: AboutModalProps) => {
  if (!open) return null;

  const language = languageSetting === "auto" ? detected : languageSetting;
  const founderText =
    language === "ru" ? (
      <>
        Основатель{" "}
        <a
          href="https://artgeneration.me"
          target="_blank"
          rel="noopener noreferrer"
        >
          ArtGeneration.me
        </a>
        , техноблогер и нейро-евангелист
      </>
    ) : (
      <>
        Founder of{" "}
        <a
          href="https://artgeneration.me"
          target="_blank"
          rel="noopener noreferrer"
        >
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
            <img
              src="/favicon.svg"
              alt="ScreenSavy Logo"
              className="logo-image"
              width={24}
              height={24}
            />
            <h2>{translation("aboutTitle")}</h2>
          </div>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: translation("aboutDescription") }}
        />
        <div className="author-block">
          <h3>{translation("author")}</h3>
          <p>
            <strong>
              <a
                href="https://t.me/nerual_dreming"
                target="_blank"
                rel="noopener noreferrer"
              >
                {translation("authorName")}
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
              className={
                link.className ?? `support-button ${link.labelKey}-button`
              }
            >
              <i className="material-symbols-outlined">{link.icon}</i>
              {translation(link.labelKey)}
            </a>
          ))}
        </div>
        <button type="button" className="modal-button" onClick={onClose}>
          {translation("close")}
        </button>
      </div>
    </div>
  );
};

export type VisualizerSetupModalProps = {
  visualizerSlug: string;
  visualizerName: string;
  visualizerNameRu: string;
  onStartMicrophone: (deviceId: string) => void;
  onStartSystem: () => void;
  language: "ru" | "en";
};

export const VisualizerSetupModal = ({
  visualizerSlug,
  visualizerName,
  visualizerNameRu,
  onStartMicrophone,
  onStartSystem,
  language,
}: VisualizerSetupModalProps) => {
  const [step, setStep] = React.useState<"initial" | "selectDevice">("initial");
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const handleInitMicrophone = async () => {
    try {
      setError("");
      const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      tempStream.getTracks().forEach(track => track.stop());
      
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = allDevices.filter(d => d.kind === 'audioinput');
      
      if (audioDevices.length === 0) {
        setError(language === "ru" ? "Микрофоны не найдены" : "No microphones found");
        return;
      }
      
      setDevices(audioDevices);
      setSelectedDeviceId(audioDevices[0].deviceId);
      setStep("selectDevice");
    } catch (err) {
      setError(language === "ru" 
        ? `Ошибка доступа к микрофону: ${(err as Error).message}` 
        : `Microphone access error: ${(err as Error).message}`);
    }
  };

  const handleConfirmMicrophone = () => {
    onStartMicrophone(selectedDeviceId);
  };

  const handleStartSystem = () => {
    onStartSystem();
  };

  const displayName = language === "ru" ? visualizerNameRu : visualizerName;

  return (
    <div style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 40,
      pointerEvents: "auto"
    }}>
      <div className="modal-content" style={{ maxWidth: "600px" }}>
        <div className="modal-header">
          <h2>{displayName}</h2>
        </div>
        
        {step === "initial" && (
          <>
            <div style={{ marginBottom: "1.5em", lineHeight: "1.6" }}>
              <p>
                {language === "ru" 
                  ? "Интерактивный аудио-визуализатор, который в реальном времени преобразует звук в динамическую визуализацию."
                  : "Interactive audio visualizer that transforms sound into dynamic visualization in real-time."}
              </p>
            </div>
            
            <div style={{ marginBottom: "1.5em", lineHeight: "1.6", fontSize: "0.95em" }}>
              <h3 style={{ marginTop: "2em", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "0.5em" }}>
                {language === "ru" ? "Инструкция" : "Instructions"}
              </h3>
              <p>
                <strong>{language === "ru" ? "1. Микрофон:" : "1. Microphone:"}</strong>{" "}
                {language === "ru" 
                  ? 'Нажмите "Начать с микрофона". Браузер запросит доступ. Выберите устройство и нажмите "Подтвердить".'
                  : 'Click "Start with microphone". Browser will request access. Select device and click "Confirm".'}
              </p>
              <p>
                <strong>{language === "ru" ? "2. Звук системы/вкладки:" : "2. System/tab audio:"}</strong>{" "}
                {language === "ru" 
                  ? 'Нажмите кнопку и в окне браузера обязательно поставьте галочку "Поделиться звуком".'
                  : 'Click the button and make sure to check "Share audio" in the browser dialog.'}
              </p>
            </div>

            {error && (
              <div style={{ 
                padding: "1em", 
                marginBottom: "1em", 
                background: "rgba(255,100,100,0.2)", 
                border: "1px solid rgba(255,100,100,0.5)",
                borderRadius: "8px",
                color: "#ffcccc"
              }}>
                {error}
              </div>
            )}

            <button 
              type="button" 
              className="modal-button" 
              onClick={handleInitMicrophone}
              style={{ marginBottom: "1em" }}
            >
              {language === "ru" ? "Начать с микрофона" : "Start with microphone"}
            </button>
            
            <hr style={{ borderColor: "#444", margin: "2em 0" }} />
            
            <button 
              type="button" 
              className="modal-button" 
              onClick={handleStartSystem}
            >
              {language === "ru" ? "Начать со звука системы" : "Start with system audio"}
            </button>
          </>
        )}

        {step === "selectDevice" && (
          <>
            <p style={{ marginBottom: "1em" }}>
              {language === "ru" ? "Выберите устройство:" : "Select device:"}
            </p>
            
            <select 
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              style={{
                width: "100%",
                padding: "0.8em",
                marginBottom: "1em",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
                fontSize: "1em",
                fontFamily: "inherit"
              }}
            >
              {devices.map((device, index) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `${language === "ru" ? "Микрофон" : "Microphone"} ${index + 1}`}
                </option>
              ))}
            </select>
            
            <button 
              type="button" 
              className="modal-button" 
              onClick={handleConfirmMicrophone}
            >
              {language === "ru" ? "Подтвердить и запустить" : "Confirm and start"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
