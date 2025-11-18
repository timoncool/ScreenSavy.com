"use client";

import { useRef, useState } from 'react';
import VideoEffectControls, { EffectSettings, defaultEffectSettings } from './VideoEffectControls';

interface LocalVideoPlayerProps {
  effect: string;
  activeLanguage?: string;
  interfaceVisible?: boolean;
}

const LocalVideoPlayer = ({ effect, activeLanguage = 'en', interfaceVisible = true }: LocalVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showEffectControls, setShowEffectControls] = useState(false);
  const [effectSettings, setEffectSettings] = useState<EffectSettings>(defaultEffectSettings);

  const t = {
    uploadTitle: activeLanguage === 'ru' ? 'Загрузить Видео' : 'Upload Video File',
    dropHere: activeLanguage === 'ru' ? 'Перетащите видео сюда' : 'Drop video file here',
    dragDrop: activeLanguage === 'ru' ? 'Перетащите или выберите файл' : 'Drag & drop or click to select',
    selectVideo: activeLanguage === 'ru' ? 'Выбрать Видео' : 'Select Video',
    supported: activeLanguage === 'ru' ? 'Поддерживается: MP4, WebM, OGG, MOV' : 'Supported: MP4, WebM, OGG, MOV',
    changeVideo: activeLanguage === 'ru' ? 'Сменить Видео' : 'Change Video',
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoFile(url);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.src = url;
          videoRef.current.load();
          videoRef.current.play().catch(err => {
            console.log('Autoplay prevented:', err);
          });
        }
      }, 100);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const getEffectClassName = () => {
    if (!videoFile || effect === 'none') return '';
    return `effect-${effect}`;
  };

  const getEffectStyles = () => {
    if (!videoFile || effect === 'none') return {};

    const settings = effectSettings[effect as keyof EffectSettings];
    if (!settings) return {};

    const styles: any = {};

    switch (effect) {
      case 'vhs': {
        const s = settings as EffectSettings['vhs'];
        styles['--scanline-intensity'] = s.scanlineIntensity / 100;
        styles['--rgb-shift'] = `${s.rgbShift}px`;
        styles['--distortion'] = `${s.distortion}px`;
        styles['--flicker-speed'] = s.flickerSpeed === 'slow' ? '0.3s' : s.flickerSpeed === 'fast' ? '0.08s' : '0.15s';
        break;
      }
      case 'glitch': {
        const s = settings as EffectSettings['glitch'];
        styles['--glitch-intensity'] = s.intensity / 100;
        styles['--rgb-split'] = `${s.rgbSplit}px`;
        styles['--hue-shift'] = `${s.hueShift}deg`;
        styles['--glitch-frequency'] = s.frequency === 'slow' ? '0.5s' : s.frequency === 'fast' ? '0.15s' : '0.25s';
        break;
      }
      case 'vintage': {
        const s = settings as EffectSettings['vintage'];
        styles['--sepia'] = s.sepia / 100;
        styles['--grain'] = s.grain / 100;
        styles['--vignette'] = s.vignette / 100;
        styles['--warmth'] = s.warmth === 'cool' ? '-20deg' : s.warmth === 'warm' ? '20deg' : '0deg';
        break;
      }
      case 'noir': {
        const s = settings as EffectSettings['noir'];
        styles['--contrast'] = s.contrast / 100;
        styles['--brightness'] = s.brightness / 100;
        styles['--vignette'] = s.vignette / 100;
        styles['--grain'] = s.grain / 100;
        break;
      }
      case 'neon': {
        const s = settings as EffectSettings['neon'];
        styles['--saturation'] = s.saturation / 100;
        styles['--glow'] = s.glow / 100;
        styles['--color-shift'] = `${s.colorShift}deg`;
        styles['--pulse-speed'] = s.pulseSpeed === 'slow' ? '3s' : s.pulseSpeed === 'fast' : '0.8s' : '1.6s';
        break;
      }
      case 'grain': {
        const s = settings as EffectSettings['grain'];
        styles['--grain-amount'] = s.amount / 100;
        styles['--grain-size'] = s.size === 'fine' ? '0.7' : s.size === 'coarse' ? '1.3' : '1.0';
        styles['--grain-speed'] = s.animationSpeed === 'slow' ? '1s' : s.animationSpeed === 'fast' ? '0.3s' : '0.5s';
        break;
      }
      case 'cinematic': {
        const s = settings as EffectSettings['cinematic'];
        styles['--teal'] = s.tealIntensity / 1000;
        styles['--orange'] = s.orangeIntensity / 1000;
        styles['--contrast'] = s.contrast / 100;
        styles['--saturation'] = s.saturation / 100;
        break;
      }
      case 'nightvision': {
        const s = settings as EffectSettings['nightvision'];
        styles['--green-tint'] = s.greenTint / 1000;
        styles['--scanlines'] = s.scanlines / 1000;
        styles['--brightness'] = s.brightness / 100;
        styles['--noise'] = s.noise / 1000;
        break;
      }
      case 'underwater': {
        const s = settings as EffectSettings['underwater'];
        styles['--blue-tint'] = s.blueTint / 1000;
        styles['--caustics'] = s.caustics / 1000;
        styles['--depth'] = s.depthDarkening / 1000;
        styles['--wave-speed'] = s.waveSpeed === 'slow' ? '10s' : s.waveSpeed === 'fast' ? '3s' : '6s';
        break;
      }
      case 'anaglyph': {
        const s = settings as EffectSettings['anaglyph'];
        styles['--separation'] = `${s.separation}px`;
        styles['--depth'] = s.depthIntensity / 100;
        styles['--anim-speed'] = s.animationSpeed === 'slow' ? '5s' : s.animationSpeed === 'fast' ? '1.5s' : '3s';
        break;
      }
    }

    return styles;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {!videoFile ? (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#fff',
            padding: '40px',
            border: isDragging ? '3px dashed #7cfc00' : '2px dashed #666',
            borderRadius: '20px',
            background: isDragging ? 'rgba(124, 252, 0, 0.1)' : 'rgba(0, 0, 0, 0.5)',
            transition: 'all 0.3s ease',
            minWidth: '400px',
          }}
        >
          <i className="material-symbols-outlined" style={{ fontSize: '64px', marginBottom: '20px' }}>video_file</i>
          <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>
            {isDragging ? t.dropHere : t.uploadTitle}
          </h2>
          <p style={{ marginBottom: '20px', color: '#999' }}>
            {t.dragDrop}
          </p>
          <label
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#7cfc00',
              color: '#000',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#6de100';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#7cfc00';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {t.selectVideo}
            <input
              type="file"
              accept="video/*"
              onChange={handleInputChange}
              style={{ display: 'none' }}
            />
          </label>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            {t.supported}
          </p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            loop
            autoPlay
            muted
            playsInline
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />

          {interfaceVisible && (
            <label
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '6px',
                cursor: 'pointer',
                zIndex: 1100,
                pointerEvents: 'auto',
                fontSize: '13px',
                fontWeight: 500,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(20px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <i className="material-symbols-outlined" style={{ fontSize: '18px' }}>video_file</i>
              {t.changeVideo}
              <input
                type="file"
                accept="video/*"
                onChange={handleInputChange}
                style={{ display: 'none' }}
              />
            </label>
          )}

          {interfaceVisible && effect !== 'none' && (
            <button
              onClick={() => setShowEffectControls(!showEffectControls)}
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                padding: '10px',
                background: showEffectControls ? 'rgba(124, 252, 0, 0.2)' : 'rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${showEffectControls ? '#7cfc00' : 'rgba(255, 255, 255, 0.2)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                zIndex: 1100,
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                if (!showEffectControls) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (!showEffectControls) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              title={activeLanguage === 'ru' ? 'Настройки эффекта' : 'Effect Settings'}
            >
              <i className="material-symbols-outlined" style={{ fontSize: '22px' }}>tune</i>
            </button>
          )}

          <VideoEffectControls
            effect={effect}
            settings={effectSettings[effect as keyof EffectSettings]}
            onSettingsChange={(newSettings) => {
              setEffectSettings(prev => ({
                ...prev,
                [effect]: newSettings,
              }));
            }}
            visible={showEffectControls && interfaceVisible}
            activeLanguage={activeLanguage}
          />
        </>
      )}

      {videoFile && (
        <div
          className={`video-effect-overlay ${getEffectClassName()}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10,
            ...getEffectStyles(),
          }}
        />
      )}

      <style jsx>{`
        /* VHS Effect */
        .effect-vhs {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, calc(var(--scanline-intensity, 0.4) * 0.2)),
            rgba(0, 0, 0, calc(var(--scanline-intensity, 0.4) * 0.2)) 1px,
            transparent 1px,
            transparent 2px
          );
          animation: vhsFlicker var(--flicker-speed, 0.15s) infinite, vhsDistort 0.4s infinite;
        }

        .effect-vhs::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 0, 0, calc(var(--rgb-shift, 8) / 100)) 0%,
            rgba(0, 255, 0, calc(var(--rgb-shift, 8) / 100)) 50%,
            rgba(0, 0, 255, calc(var(--rgb-shift, 8) / 100)) 100%
          );
          mix-blend-mode: overlay;
          animation: vhsShift 2.5s infinite;
        }

        @keyframes vhsFlicker {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }

        @keyframes vhsDistort {
          0%, 100% { transform: translateX(0) scaleX(1); }
          33% { transform: translateX(calc(var(--distortion, 5) * -0.2px)) scaleX(1.005); }
          66% { transform: translateX(calc(var(--distortion, 5) * 0.2px)) scaleX(0.995); }
        }

        @keyframes vhsShift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(calc(var(--rgb-shift, 8) / 4)); }
        }

        /* Glitch Effect */
        .effect-glitch {
          animation: glitchAnim var(--glitch-frequency, 0.25s) infinite;
        }

        .effect-glitch::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          mix-blend-mode: screen;
          animation: glitchRGB 0.35s infinite;
        }

        @keyframes glitchAnim {
          0%, 100% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          10% {
            transform: translate(calc(var(--rgb-split, 10) * -0.3px), calc(var(--rgb-split, 10) * 0.2px)) skew(calc(var(--glitch-intensity, 0.5) * 2deg));
            filter: hue-rotate(var(--hue-shift, 60deg)) saturate(calc(1 + var(--glitch-intensity, 0.5)));
          }
          20% {
            transform: translate(calc(var(--rgb-split, 10) * 0.2px), calc(var(--rgb-split, 10) * -0.2px)) skew(calc(var(--glitch-intensity, 0.5) * -2deg));
            filter: hue-rotate(calc(var(--hue-shift, 60deg) * -1)) invert(calc(var(--glitch-intensity, 0.5) * 0.1));
          }
        }

        @keyframes glitchRGB {
          0%, 100% {
            opacity: calc(var(--glitch-intensity, 0.5) * 0.12);
          }
          25% {
            opacity: calc(var(--glitch-intensity, 0.5) * 0.4);
            filter:
              drop-shadow(calc(var(--rgb-split, 10) * 0.25px) 0 0 red)
              drop-shadow(calc(var(--rgb-split, 10) * -0.25px) 0 0 cyan);
          }
        }

        /* Vintage Effect */
        .effect-vintage {
          filter: sepia(var(--sepia, 0.6)) contrast(1.08) brightness(0.97) saturate(0.9) hue-rotate(var(--warmth, 0deg));
        }

        .effect-vintage::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="n"><feTurbulence baseFrequency="0.65" numOctaves="2"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.15"/></svg>');
          mix-blend-mode: multiply;
          opacity: var(--grain, 0.4);
        }

        .effect-vintage::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            ellipse at center,
            transparent calc(100% - var(--vignette, 0.5) * 70%),
            rgba(101, 67, 33, calc(var(--vignette, 0.5) * 0.8)) 100%
          );
        }

        /* Film Noir Effect */
        .effect-noir {
          filter: grayscale(1) contrast(var(--contrast, 1.8)) brightness(var(--brightness, 0.8));
        }

        .effect-noir::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(0, 0, 0, calc(var(--grain, 0.3) * 0.4)) 1px,
            rgba(0, 0, 0, calc(var(--grain, 0.3) * 0.4)) 2px
          );
          mix-blend-mode: overlay;
        }

        .effect-noir::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            ellipse at center,
            transparent calc(100% - var(--vignette, 0.65) * 40%),
            rgba(0, 0, 0, calc(var(--vignette, 0.65))) 100%
          );
          box-shadow: inset 0 0 160px rgba(0, 0, 0, calc(var(--vignette, 0.65)));
        }

        /* Neon Effect */
        .effect-neon {
          filter: saturate(var(--saturation, 2)) contrast(1.4) brightness(1.1) hue-rotate(var(--color-shift, 5deg));
          animation: neonPulse var(--pulse-speed, 1.6s) ease-in-out infinite;
        }

        .effect-neon::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            linear-gradient(
              45deg,
              rgba(255, 0, 255, calc(var(--glow, 0.5) * 0.4)) 0%,
              rgba(0, 255, 255, calc(var(--glow, 0.5) * 0.4)) 50%,
              rgba(255, 255, 0, calc(var(--glow, 0.5) * 0.4)) 100%
            ),
            radial-gradient(
              circle at 30% 30%,
              rgba(255, 0, 128, calc(var(--glow, 0.5) * 0.3)) 0%,
              transparent 60%
            );
          mix-blend-mode: screen;
          animation: neonGlow 2s ease-in-out infinite;
        }

        @keyframes neonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
        }

        @keyframes neonGlow {
          0%, 100% {
            opacity: calc(var(--glow, 0.5) * 0.7);
            transform: scale(1);
          }
          50% {
            opacity: var(--glow, 0.5);
            transform: scale(1.01);
          }
        }

        /* Film Grain Effect */
        .effect-grain {
          filter: contrast(1.05) brightness(0.98);
        }

        .effect-grain::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="3"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.1"/></svg>');
          background-size: calc(100px * var(--grain-size, 1)) calc(100px * var(--grain-size, 1));
          mix-blend-mode: overlay;
          opacity: var(--grain-amount, 0.5);
          animation: grainMove var(--grain-speed, 0.5s) steps(8) infinite;
        }

        @keyframes grainMove {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
        }

        /* Cinematic Effect */
        .effect-cinematic {
          filter: saturate(var(--saturation, 1.15)) contrast(var(--contrast, 1.1)) brightness(1.02);
        }

        .effect-cinematic::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            180deg,
            rgba(0, 150, 150, var(--teal, 0.08)) 0%,
            transparent 50%,
            rgba(255, 140, 70, var(--orange, 0.08)) 100%
          );
          mix-blend-mode: color;
        }

        /* Night Vision Effect */
        .effect-nightvision {
          filter: saturate(0.5) brightness(var(--brightness, 1.25)) contrast(1.2) hue-rotate(90deg);
        }

        .effect-nightvision::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            repeating-linear-gradient(
              0deg,
              rgba(0, 255, 0, var(--scanlines, 0.03)),
              rgba(0, 255, 0, var(--scanlines, 0.03)) 2px,
              transparent 2px,
              transparent 4px
            ),
            radial-gradient(
              circle at center,
              transparent 0%,
              rgba(0, 0, 0, 0.3) 100%
            );
          mix-blend-mode: overlay;
        }

        .effect-nightvision::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 255, 0, var(--green-tint, 0.08));
          mix-blend-mode: screen;
          animation: nvFlicker 0.15s infinite;
        }

        @keyframes nvFlicker {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        /* Underwater Effect */
        .effect-underwater {
          filter: saturate(1.2) hue-rotate(180deg) brightness(0.92);
        }

        .effect-underwater::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(
              ellipse at 30% 20%,
              rgba(0, 200, 255, var(--caustics, 0.15)) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at 70% 80%,
              rgba(0, 150, 200, calc(var(--caustics, 0.15) * 0.7)) 0%,
              transparent 50%
            );
          mix-blend-mode: overlay;
          animation: caustics var(--wave-speed, 6s) ease-in-out infinite;
        }

        .effect-underwater::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 100, 150, var(--blue-tint, 0.1));
          mix-blend-mode: multiply;
        }

        @keyframes caustics {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(10px, -10px) scale(1.05);
            opacity: 0.8;
          }
        }

        /* Anaglyph 3D Effect */
        .effect-anaglyph {
          position: relative;
        }

        .effect-anaglyph::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          mix-blend-mode: screen;
          filter:
            drop-shadow(var(--separation, 10px) 0 0 rgba(255, 0, 0, var(--depth, 0.6)))
            drop-shadow(calc(var(--separation, 10px) * -1) 0 0 rgba(0, 255, 255, var(--depth, 0.6)));
          animation: anaglyphShift var(--anim-speed, 3s) ease-in-out infinite;
        }

        @keyframes anaglyphShift {
          0%, 100% {
            filter:
              drop-shadow(var(--separation, 10px) 0 0 rgba(255, 0, 0, var(--depth, 0.6)))
              drop-shadow(calc(var(--separation, 10px) * -1) 0 0 rgba(0, 255, 255, var(--depth, 0.6)));
          }
          50% {
            filter:
              drop-shadow(calc(var(--separation, 10px) * 1.2) 0 0 rgba(255, 0, 0, calc(var(--depth, 0.6) * 1.1)))
              drop-shadow(calc(var(--separation, 10px) * -1.2) 0 0 rgba(0, 255, 255, calc(var(--depth, 0.6) * 1.1)));
          }
        }
      `}</style>
    </div>
  );
};

export default LocalVideoPlayer;
