"use client";

import { useState } from 'react';

export interface EffectSettings {
  vhs: {
    scanlineIntensity: number; // 0-100
    rgbShift: number; // 0-20
    flickerSpeed: 'slow' | 'medium' | 'fast';
    distortion: number; // 0-10
  };
  glitch: {
    intensity: number; // 0-100
    rgbSplit: number; // 0-20
    frequency: 'slow' | 'medium' | 'fast';
    hueShift: number; // 0-360
  };
  vintage: {
    sepia: number; // 0-100
    grain: number; // 0-100
    vignette: number; // 0-100
    warmth: 'cool' | 'neutral' | 'warm';
  };
  noir: {
    contrast: number; // 100-300
    brightness: number; // 50-150
    vignette: number; // 0-100
    grain: number; // 0-100
  };
  neon: {
    saturation: number; // 100-300
    glow: number; // 0-100
    colorShift: number; // 0-360
    pulseSpeed: 'slow' | 'medium' | 'fast';
  };
  grain: {
    size: 'fine' | 'medium' | 'coarse';
    amount: number; // 0-100
    animationSpeed: 'slow' | 'medium' | 'fast';
  };
  cinematic: {
    tealIntensity: number; // 0-100
    orangeIntensity: number; // 0-100
    contrast: number; // 100-200
    saturation: number; // 80-150
  };
  nightvision: {
    greenTint: number; // 0-100
    scanlines: number; // 0-100
    brightness: number; // 100-150
    noise: number; // 0-100
  };
  underwater: {
    blueTint: number; // 0-100
    caustics: number; // 0-100
    waveSpeed: 'slow' | 'medium' | 'fast';
    depthDarkening: number; // 0-100
  };
  anaglyph: {
    separation: number; // 0-20
    depthIntensity: number; // 0-100
    animationSpeed: 'slow' | 'medium' | 'fast';
  };
}

export const defaultEffectSettings: EffectSettings = {
  vhs: { scanlineIntensity: 40, rgbShift: 8, flickerSpeed: 'medium', distortion: 5 },
  glitch: { intensity: 50, rgbSplit: 10, frequency: 'medium', hueShift: 60 },
  vintage: { sepia: 60, grain: 40, vignette: 50, warmth: 'warm' },
  noir: { contrast: 180, brightness: 80, vignette: 65, grain: 30 },
  neon: { saturation: 200, glow: 50, colorShift: 180, pulseSpeed: 'medium' },
  grain: { size: 'medium', amount: 50, animationSpeed: 'medium' },
  cinematic: { tealIntensity: 40, orangeIntensity: 40, contrast: 140, saturation: 120 },
  nightvision: { greenTint: 70, scanlines: 40, brightness: 125, noise: 30 },
  underwater: { blueTint: 60, caustics: 50, waveSpeed: 'medium', depthDarkening: 40 },
  anaglyph: { separation: 10, depthIntensity: 60, animationSpeed: 'medium' },
};

interface VideoEffectControlsProps {
  effect: string;
  settings: EffectSettings[keyof EffectSettings];
  onSettingsChange: (settings: EffectSettings[keyof EffectSettings]) => void;
  visible: boolean;
  activeLanguage?: string;
}

const VideoEffectControls = ({
  effect,
  settings,
  onSettingsChange,
  visible,
  activeLanguage = 'en',
}: VideoEffectControlsProps) => {
  if (!visible || effect === 'none') return null;

  const t = {
    effectSettings: activeLanguage === 'ru' ? 'Настройки Эффекта' : 'Effect Settings',
    reset: activeLanguage === 'ru' ? 'Сброс' : 'Reset',
  };

  const renderVHSControls = () => {
    const s = settings as EffectSettings['vhs'];
    return (
      <>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Сканлайны' : 'Scanlines'}: {s.scanlineIntensity}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.scanlineIntensity}
            onChange={(e) => onSettingsChange({ ...s, scanlineIntensity: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'RGB Сдвиг' : 'RGB Shift'}: {s.rgbShift}px</label>
          <input
            type="range"
            min="0"
            max="20"
            value={s.rgbShift}
            onChange={(e) => onSettingsChange({ ...s, rgbShift: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Искажение' : 'Distortion'}: {s.distortion}px</label>
          <input
            type="range"
            min="0"
            max="10"
            value={s.distortion}
            onChange={(e) => onSettingsChange({ ...s, distortion: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Скорость Мерцания' : 'Flicker Speed'}</label>
          <select
            value={s.flickerSpeed}
            onChange={(e) => onSettingsChange({ ...s, flickerSpeed: e.target.value as any })}
          >
            <option value="slow">{activeLanguage === 'ru' ? 'Медленно' : 'Slow'}</option>
            <option value="medium">{activeLanguage === 'ru' ? 'Средне' : 'Medium'}</option>
            <option value="fast">{activeLanguage === 'ru' ? 'Быстро' : 'Fast'}</option>
          </select>
        </div>
      </>
    );
  };

  const renderGlitchControls = () => {
    const s = settings as EffectSettings['glitch'];
    return (
      <>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Интенсивность' : 'Intensity'}: {s.intensity}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.intensity}
            onChange={(e) => onSettingsChange({ ...s, intensity: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'RGB Разделение' : 'RGB Split'}: {s.rgbSplit}px</label>
          <input
            type="range"
            min="0"
            max="20"
            value={s.rgbSplit}
            onChange={(e) => onSettingsChange({ ...s, rgbSplit: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Сдвиг Оттенка' : 'Hue Shift'}: {s.hueShift}°</label>
          <input
            type="range"
            min="0"
            max="360"
            value={s.hueShift}
            onChange={(e) => onSettingsChange({ ...s, hueShift: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Частота' : 'Frequency'}</label>
          <select
            value={s.frequency}
            onChange={(e) => onSettingsChange({ ...s, frequency: e.target.value as any })}
          >
            <option value="slow">{activeLanguage === 'ru' ? 'Медленно' : 'Slow'}</option>
            <option value="medium">{activeLanguage === 'ru' ? 'Средне' : 'Medium'}</option>
            <option value="fast">{activeLanguage === 'ru' ? 'Быстро' : 'Fast'}</option>
          </select>
        </div>
      </>
    );
  };

  const renderVintageControls = () => {
    const s = settings as EffectSettings['vintage'];
    return (
      <>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Сепия' : 'Sepia'}: {s.sepia}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.sepia}
            onChange={(e) => onSettingsChange({ ...s, sepia: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Зерно' : 'Grain'}: {s.grain}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.grain}
            onChange={(e) => onSettingsChange({ ...s, grain: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Виньетка' : 'Vignette'}: {s.vignette}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.vignette}
            onChange={(e) => onSettingsChange({ ...s, vignette: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Теплота' : 'Warmth'}</label>
          <select
            value={s.warmth}
            onChange={(e) => onSettingsChange({ ...s, warmth: e.target.value as any })}
          >
            <option value="cool">{activeLanguage === 'ru' ? 'Холодная' : 'Cool'}</option>
            <option value="neutral">{activeLanguage === 'ru' ? 'Нейтральная' : 'Neutral'}</option>
            <option value="warm">{activeLanguage === 'ru' ? 'Теплая' : 'Warm'}</option>
          </select>
        </div>
      </>
    );
  };

  const renderNoirControls = () => {
    const s = settings as EffectSettings['noir'];
    return (
      <>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Контраст' : 'Contrast'}: {s.contrast}%</label>
          <input
            type="range"
            min="100"
            max="300"
            value={s.contrast}
            onChange={(e) => onSettingsChange({ ...s, contrast: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Яркость' : 'Brightness'}: {s.brightness}%</label>
          <input
            type="range"
            min="50"
            max="150"
            value={s.brightness}
            onChange={(e) => onSettingsChange({ ...s, brightness: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Виньетка' : 'Vignette'}: {s.vignette}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.vignette}
            onChange={(e) => onSettingsChange({ ...s, vignette: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Зерно' : 'Grain'}: {s.grain}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.grain}
            onChange={(e) => onSettingsChange({ ...s, grain: Number(e.target.value) })}
          />
        </div>
      </>
    );
  };

  const renderNeonControls = () => {
    const s = settings as EffectSettings['neon'];
    return (
      <>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Насыщенность' : 'Saturation'}: {s.saturation}%</label>
          <input
            type="range"
            min="100"
            max="300"
            value={s.saturation}
            onChange={(e) => onSettingsChange({ ...s, saturation: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Свечение' : 'Glow'}: {s.glow}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.glow}
            onChange={(e) => onSettingsChange({ ...s, glow: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Сдвиг Цвета' : 'Color Shift'}: {s.colorShift}°</label>
          <input
            type="range"
            min="0"
            max="360"
            value={s.colorShift}
            onChange={(e) => onSettingsChange({ ...s, colorShift: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Скорость Пульсации' : 'Pulse Speed'}</label>
          <select
            value={s.pulseSpeed}
            onChange={(e) => onSettingsChange({ ...s, pulseSpeed: e.target.value as any })}
          >
            <option value="slow">{activeLanguage === 'ru' ? 'Медленно' : 'Slow'}</option>
            <option value="medium">{activeLanguage === 'ru' ? 'Средне' : 'Medium'}</option>
            <option value="fast">{activeLanguage === 'ru' ? 'Быстро' : 'Fast'}</option>
          </select>
        </div>
      </>
    );
  };

  const renderGrainControls = () => {
    const s = settings as EffectSettings['grain'];
    return (
      <>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Количество' : 'Amount'}: {s.amount}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.amount}
            onChange={(e) => onSettingsChange({ ...s, amount: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Размер Зерна' : 'Grain Size'}</label>
          <select
            value={s.size}
            onChange={(e) => onSettingsChange({ ...s, size: e.target.value as any })}
          >
            <option value="fine">{activeLanguage === 'ru' ? 'Мелкое' : 'Fine'}</option>
            <option value="medium">{activeLanguage === 'ru' ? 'Среднее' : 'Medium'}</option>
            <option value="coarse">{activeLanguage === 'ru' ? 'Крупное' : 'Coarse'}</option>
          </select>
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Скорость Анимации' : 'Animation Speed'}</label>
          <select
            value={s.animationSpeed}
            onChange={(e) => onSettingsChange({ ...s, animationSpeed: e.target.value as any })}
          >
            <option value="slow">{activeLanguage === 'ru' ? 'Медленно' : 'Slow'}</option>
            <option value="medium">{activeLanguage === 'ru' ? 'Средне' : 'Medium'}</option>
            <option value="fast">{activeLanguage === 'ru' ? 'Быстро' : 'Fast'}</option>
          </select>
        </div>
      </>
    );
  };

  const renderCinematicControls = () => {
    const s = settings as EffectSettings['cinematic'];
    return (
      <>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Бирюзовый' : 'Teal'}: {s.tealIntensity}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.tealIntensity}
            onChange={(e) => onSettingsChange({ ...s, tealIntensity: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Оранжевый' : 'Orange'}: {s.orangeIntensity}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.orangeIntensity}
            onChange={(e) => onSettingsChange({ ...s, orangeIntensity: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Контраст' : 'Contrast'}: {s.contrast}%</label>
          <input
            type="range"
            min="100"
            max="200"
            value={s.contrast}
            onChange={(e) => onSettingsChange({ ...s, contrast: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Насыщенность' : 'Saturation'}: {s.saturation}%</label>
          <input
            type="range"
            min="80"
            max="150"
            value={s.saturation}
            onChange={(e) => onSettingsChange({ ...s, saturation: Number(e.target.value) })}
          />
        </div>
      </>
    );
  };

  const renderNightVisionControls = () => {
    const s = settings as EffectSettings['nightvision'];
    return (
      <>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Зеленый Оттенок' : 'Green Tint'}: {s.greenTint}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.greenTint}
            onChange={(e) => onSettingsChange({ ...s, greenTint: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Сканлайны' : 'Scanlines'}: {s.scanlines}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.scanlines}
            onChange={(e) => onSettingsChange({ ...s, scanlines: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Яркость' : 'Brightness'}: {s.brightness}%</label>
          <input
            type="range"
            min="100"
            max="150"
            value={s.brightness}
            onChange={(e) => onSettingsChange({ ...s, brightness: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Шум' : 'Noise'}: {s.noise}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.noise}
            onChange={(e) => onSettingsChange({ ...s, noise: Number(e.target.value) })}
          />
        </div>
      </>
    );
  };

  const renderUnderwaterControls = () => {
    const s = settings as EffectSettings['underwater'];
    return (
      <>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Синий Оттенок' : 'Blue Tint'}: {s.blueTint}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.blueTint}
            onChange={(e) => onSettingsChange({ ...s, blueTint: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Каустика' : 'Caustics'}: {s.caustics}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.caustics}
            onChange={(e) => onSettingsChange({ ...s, caustics: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Затемнение Глубины' : 'Depth Darkening'}: {s.depthDarkening}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.depthDarkening}
            onChange={(e) => onSettingsChange({ ...s, depthDarkening: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Скорость Волн' : 'Wave Speed'}</label>
          <select
            value={s.waveSpeed}
            onChange={(e) => onSettingsChange({ ...s, waveSpeed: e.target.value as any })}
          >
            <option value="slow">{activeLanguage === 'ru' ? 'Медленно' : 'Slow'}</option>
            <option value="medium">{activeLanguage === 'ru' ? 'Средне' : 'Medium'}</option>
            <option value="fast">{activeLanguage === 'ru' ? 'Быстро' : 'Fast'}</option>
          </select>
        </div>
      </>
    );
  };

  const renderAnaglyphControls = () => {
    const s = settings as EffectSettings['anaglyph'];
    return (
      <>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Разделение' : 'Separation'}: {s.separation}px</label>
          <input
            type="range"
            min="0"
            max="20"
            value={s.separation}
            onChange={(e) => onSettingsChange({ ...s, separation: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Глубина' : 'Depth Intensity'}: {s.depthIntensity}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={s.depthIntensity}
            onChange={(e) => onSettingsChange({ ...s, depthIntensity: Number(e.target.value) })}
          />
        </div>
        <div className="control-group">
          <label>{activeLanguage === 'ru' ? 'Скорость Анимации' : 'Animation Speed'}</label>
          <select
            value={s.animationSpeed}
            onChange={(e) => onSettingsChange({ ...s, animationSpeed: e.target.value as any })}
          >
            <option value="slow">{activeLanguage === 'ru' ? 'Медленно' : 'Slow'}</option>
            <option value="medium">{activeLanguage === 'ru' ? 'Средне' : 'Medium'}</option>
            <option value="fast">{activeLanguage === 'ru' ? 'Быстро' : 'Fast'}</option>
          </select>
        </div>
      </>
    );
  };

  const renderControls = () => {
    switch (effect) {
      case 'vhs': return renderVHSControls();
      case 'glitch': return renderGlitchControls();
      case 'vintage': return renderVintageControls();
      case 'noir': return renderNoirControls();
      case 'neon': return renderNeonControls();
      case 'grain': return renderGrainControls();
      case 'cinematic': return renderCinematicControls();
      case 'nightvision': return renderNightVisionControls();
      case 'underwater': return renderUnderwaterControls();
      case 'anaglyph': return renderAnaglyphControls();
      default: return null;
    }
  };

  const handleReset = () => {
    onSettingsChange(defaultEffectSettings[effect as keyof EffectSettings]);
  };

  return (
    <div className="video-effect-controls">
      <div className="controls-header">
        <h3>{t.effectSettings}</h3>
        <button onClick={handleReset} className="reset-button">
          <i className="material-symbols-outlined">restart_alt</i>
          {t.reset}
        </button>
      </div>
      <div className="controls-body">
        {renderControls()}
      </div>

      <style jsx>{`
        .video-effect-controls {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 16px;
          min-width: 280px;
          max-width: 320px;
          z-index: 1050;
          color: rgba(255, 255, 255, 0.9);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .controls-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .controls-header h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
        }

        .reset-button {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reset-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .reset-button i {
          font-size: 16px;
        }

        .controls-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 60vh;
          overflow-y: auto;
          padding-right: 8px;
        }

        .controls-body::-webkit-scrollbar {
          width: 6px;
        }

        .controls-body::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .controls-body::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .controls-body::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .control-group label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }

        .control-group input[type="range"] {
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.15);
          outline: none;
          -webkit-appearance: none;
        }

        .control-group input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #7cfc00;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .control-group input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #7cfc00;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .control-group select {
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 12px;
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .control-group select:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .control-group select:focus {
          border-color: #7cfc00;
        }
      `}</style>
    </div>
  );
};

export default VideoEffectControls;
