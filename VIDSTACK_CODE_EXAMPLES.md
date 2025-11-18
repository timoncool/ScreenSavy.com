# ПРИМЕРЫ КОДА: VIDSTACK ДЛЯ SCREENSAVY.COM

## ПРИМЕР 1: МИГРАЦИЯ RETROTV НА VIDSTACK

### Текущая реализация (YouTube IFrame API)
```jsx
// src/components/screensavy/RetroTV.tsx (ТЕКУЩАЯ)
useEffect(() => {
  if ((window as any).YT && (window as any).YT.Player) {
    playerRef.current = new (window as any).YT.Player('youtube-player', {
      videoId: currentVideoId,
      playerVars: { autoplay: 1, controls: 1 },
    });
  }
}, [currentVideoId, isPoweredOn]);
```

### Новая реализация с Vidstack
```jsx
// src/components/screensavy/RetroTV.tsx (VIDSTACK)
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useMediaState, useMediaStore } from '@vidstack/react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

interface RetroTVProps {
  videoId?: string;
  onVideoIdChange?: (id: string) => void;
}

export default function RetroTV({ videoId, onVideoIdChange }: RetroTVProps) {
  const [inputValue, setInputValue] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState(videoId || '');
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const playerRef = useRef<any>(null);
  
  // Использование Vidstack hooks
  const isPaused = useMediaState('paused');
  const store = useMediaStore();

  const extractVideoId = useCallback((url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractVideoId(inputValue);
    if (videoId) {
      setCurrentVideoId(videoId);
      onVideoIdChange?.(videoId);
      setIsPoweredOn(true);
    }
  }, [inputValue, extractVideoId, onVideoIdChange]);

  const handlePowerToggle = useCallback(() => {
    setIsPoweredOn(prev => !prev);
    if (isPoweredOn) {
      store.pause(); // Пауза при выключении
    }
  }, [isPoweredOn, store]);

  return (
    <>
      {/* Фоновые элементы */}
      <div className="gradient" />
      <div className="brick-wall" />
      <div className="wood-floor" />

      {/* Панель ввода */}
      <div className="tv-input-panel">
        <form onSubmit={handleSubmit} className="tv-url-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Вставьте ссылку на YouTube или ID видео..."
            className="tv-url-input"
          />
          <button type="submit" className="tv-url-submit">
            <i className="material-symbols-outlined">play_arrow</i>
          </button>
        </form>
      </div>

      {/* TV набор */}
      <div className={`old-tv ${!isPoweredOn ? 'powered-off' : ''}`}>
        <div className="antenna" />
        <main>
          <div className="error-noise">
            <div className="error-effect">
              <div className="old-tv-content">
                {currentVideoId && isPoweredOn ? (
                  <MediaPlayer
                    ref={playerRef}
                    src={`https://www.youtube.com/watch?v=${currentVideoId}`}
                    title="YouTube Video"
                    autoplay
                    className="youtube-player-vidstack"
                  >
                    <MediaProvider />
                  </MediaPlayer>
                ) : null}
              </div>
            </div>
          </div>
        </main>
        
        <div className="speaker" />
        
        <div className="volume">
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="50"
            onChange={(e) => {
              if (store) store.volume = (parseInt(e.target.value) / 100);
            }}
          />
        </div>
        
        <nav className="channel">
          <input type="range" min="0" max="100" defaultValue="50" />
        </nav>
        
        <nav className="power">
          <button onClick={handlePowerToggle} type="button" />
        </nav>
        
        <nav />
        <footer />
      </div>

      {/* 3D стол */}
      <div id="table-tv">{/* ... */}</div>

      <style jsx>{`
        /* Видео плеер стили для Vidstack */
        .youtube-player-vidstack {
          width: 100%;
          height: 100%;
          border-radius: 50% / 5%;
          overflow: hidden;
        }

        [media-player] {
          /* Скрытие контролов плеера */
          --media-control-display: none;
        }

        /* CRT эффект */
        [media-player][data-paused='false'] {
          filter: grayscale(0) brightness(1.1) contrast(1.2);
        }

        [media-player][data-paused='true'] {
          filter: grayscale(1) brightness(0.5);
          opacity: 0.1;
        }

        /* Сканирующие линии */
        .youtube-player-vidstack::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.15) 4px
          );
          pointer-events: none;
          animation: crt-scan 20ms alternate infinite;
        }

        @keyframes crt-scan {
          0% { transform: translateY(-1px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </>
  );
}
```

---

## ПРИМЕР 2: КАСТОМНЫЙ ПЛЕЕР С КАСТОМНЫМИ КОНТРОЛАМИ

```jsx
// src/components/screensavy/CustomVidstackPlayer.tsx
'use client';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useMediaState, useMediaStore, useMediaRemote } from '@vidstack/react';
import { useEffect, useRef } from 'react';

export function CustomVidstackPlayer() {
  const store = useMediaStore();
  const remote = useMediaRemote();
  
  // Подписка на состояния
  const isPaused = useMediaState('paused');
  const currentTime = useMediaState('currentTime');
  const duration = useMediaState('duration');
  const buffered = useMediaState('buffered');
  const volume = useMediaState('volume');
  const isMuted = useMediaState('muted');
  const isPlaying = useMediaState('playing');
  const playbackRate = useMediaState('playbackRate');

  const handlePlayPause = () => {
    remote.togglePaused();
  };

  const handleVolumeChange = (value: number) => {
    remote.setVolume(value / 100);
  };

  const handleSeek = (value: number) => {
    remote.seek((value / 100) * duration);
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="custom-player-wrapper">
      <MediaPlayer 
        src="https://example.com/video.mp4"
        title="Custom Player"
        playbackRate={playbackRate}
      >
        <MediaProvider />
        
        {/* Кастомный UI */}
        <div className="player-ui">
          {/* Видео контейнер */}
          <div className="video-container">
            {/* Видео будет здесь */}
          </div>

          {/* Контролы */}
          <div className="controls">
            {/* Play/Pause кнопка */}
            <button 
              className="control-btn play-btn"
              onClick={handlePlayPause}
            >
              {isPaused ? '▶' : '⏸'}
            </button>

            {/* Progress bar */}
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <input 
                type="range"
                min="0"
                max="100"
                value={(currentTime / duration) * 100 || 0}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="slider"
              />
            </div>

            {/* Время */}
            <span className="time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Громкость */}
            <div className="volume-control">
              <button 
                className="control-btn mute-btn"
                onClick={() => remote.toggleMuted()}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              <input 
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="slider"
              />
            </div>

            {/* Скорость проигрывания */}
            <select 
              value={playbackRate}
              onChange={(e) => remote.setPlaybackRate(parseFloat(e.target.value))}
              className="control-select"
            >
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>

            {/* Fullscreen */}
            <button className="control-btn fullscreen-btn">
              ⛶
            </button>
          </div>
        </div>
      </MediaPlayer>

      <style jsx>{`
        .custom-player-wrapper {
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }

        .player-ui {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .video-container {
          flex: 1;
          background: #1a1a1a;
        }

        .controls {
          background: rgba(0, 0, 0, 0.9);
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .control-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .control-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          position: relative;
          cursor: pointer;
        }

        .progress-fill {
          height: 100%;
          background: #7cfc00;
          border-radius: 3px;
          transition: width 0.1s;
        }

        .slider {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          cursor: pointer;
          opacity: 0;
          z-index: 10;
        }

        .time {
          color: white;
          font-size: 12px;
          font-family: monospace;
          min-width: 100px;
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .volume-control .slider {
          width: 80px;
          height: 4px;
          opacity: 1;
        }

        .control-select {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
```

---

## ПРИМЕР 3: ВИДЕОПЛЕЕР С ВИЗУАЛИЗАТОРОМ

```jsx
// src/components/screensavy/PlayerWithVisualizer.tsx
'use client';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useMediaStore, useMediaState } from '@vidstack/react';
import { useEffect, useRef } from 'react';

export function PlayerWithVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  
  const store = useMediaStore();
  const currentTime = useMediaState('currentTime');

  useEffect(() => {
    // Инициализация Web Audio API
    const setupAudioContext = () => {
      if (!audioContextRef.current && store.provider?.media) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        const source = audioContext.createMediaElementAudioSource(store.provider.media);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        // Запуск визуализации
        drawVisualizer();
      }
    };

    const drawVisualizer = () => {
      const canvas = canvasRef.current;
      const analyser = analyserRef.current;
      
      if (!canvas || !analyser) {
        animationRef.current = requestAnimationFrame(drawVisualizer);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Градиент цвет
        const hue = (i / bufferLength) * 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth;
      }

      animationRef.current = requestAnimationFrame(drawVisualizer);
    };

    setupAudioContext();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [store.provider]);

  return (
    <div className="player-with-visualizer">
      <MediaPlayer 
        src="https://example.com/audio.mp3"
        title="Music with Visualizer"
      >
        <MediaProvider />
      </MediaPlayer>

      <canvas 
        ref={canvasRef}
        className="visualizer"
        width={800}
        height={200}
      />

      <style jsx>{`
        .player-with-visualizer {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .visualizer {
          width: 100%;
          height: 200px;
          background: linear-gradient(to bottom, #0a0a0a, #1a1a1a);
          border-radius: 8px;
          border: 1px solid rgba(124, 252, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
```

---

## ПРИМЕР 4: ВИДЕОПЛЕЕР С ТЕМИЗАЦИЕЙ

```jsx
// src/components/screensavy/ThemedVidstackPlayer.tsx
'use client';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

interface Theme {
  brand: string;
  bg: string;
  text: string;
  borderColor: string;
}

interface ThemedPlayerProps {
  theme: 'retro' | 'modern' | 'dark' | 'neon';
}

const themes: Record<string, Theme> = {
  retro: {
    brand: '#7cfc00',
    bg: '#333',
    text: '#fff',
    borderColor: 'rgba(124, 252, 0, 0.5)',
  },
  modern: {
    brand: '#ff0080',
    bg: '#1a1a1a',
    text: '#fff',
    borderColor: '#ff0080',
  },
  dark: {
    brand: '#00d4ff',
    bg: '#0a0a0a',
    text: '#fff',
    borderColor: '#00d4ff',
  },
  neon: {
    brand: '#00ff00',
    bg: '#000',
    text: '#00ff00',
    borderColor: '#00ff00',
  },
};

export function ThemedVidstackPlayer({ theme }: ThemedPlayerProps) {
  const selectedTheme = themes[theme];

  return (
    <>
      <MediaPlayer
        src="https://example.com/video.mp4"
        title="Themed Video"
        className={`themed-player theme-${theme}`}
      >
        <MediaProvider />
        <DefaultVideoLayout 
          icons={defaultLayoutIcons}
          thumbnails="https://example.com/thumbnails.vtt"
        />
      </MediaPlayer>

      <style jsx>{`
        :global([media-player].themed-player) {
          --media-brand: ${selectedTheme.brand};
          --media-text-color: ${selectedTheme.text};
          --media-bg: ${selectedTheme.bg};
          --media-focus-ring-color: ${selectedTheme.brand};
          --media-focus-ring-opacity: 0.5;
          
          --media-control-hover-bg: rgba(${hexToRgb(selectedTheme.brand)}, 0.2);
          --media-control-focus-bg: rgba(${hexToRgb(selectedTheme.brand)}, 0.3);
          
          --media-slider-track-bg: rgba(255, 255, 255, 0.2);
          --media-slider-progress-bg: ${selectedTheme.brand};
          --media-slider-thumb-bg: ${selectedTheme.brand};
          
          --media-tooltip-bg: ${selectedTheme.bg};
          --media-tooltip-text-color: ${selectedTheme.text};
          
          border: 2px solid ${selectedTheme.borderColor};
          border-radius: 8px;
        }

        :global([media-player].theme-retro) {
          filter: grayscale(0) brightness(1.05) contrast(1.2);
        }

        :global([media-player].theme-neon) {
          filter: drop-shadow(0 0 10px ${selectedTheme.brand});
        }
      `}</style>
    </>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}
```

---

## ПРИМЕР 5: КОНФИГУРАЦИЯ NEXT.JS

```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Tree-shake оптимизация для Vidstack
    config.optimization.sideEffects = false;
    
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '*.vimeocdn.com',
      },
    ],
  },
};

export default nextConfig;
```

```json
// tsconfig.json (добавить)
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

---

## ПРИМЕР 6: УСТАНОВКА И ИМПОРТЫ

```bash
# Установка
npm install @vidstack/react

# Или с yarn
yarn add @vidstack/react

# Или с pnpm
pnpm add @vidstack/react
```

```typescript
// src/globals.css или layout.tsx
// Основные стили
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';

// Или отдельно для видео/аудио
```

---

## ПРИМЕР 7: ТИПИЗАЦИЯ ДЛЯ TYPESCRIPT

```typescript
// src/types/vidstack.ts
import type { MediaPlayer as VidstackMediaPlayer } from '@vidstack/react';

export interface PlayerConfig {
  src: string;
  title?: string;
  autoplay?: boolean;
  playbackRate?: number;
  muted?: boolean;
  volume?: number;
}

export interface PlayerState {
  isPaused: boolean;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  volume: number;
  playbackRate: number;
  isPlaying: boolean;
}

export type MediaPlayerRef = VidstackMediaPlayer;
```

---

## ПРОИЗВОДИТЕЛЬНОСТЬ И ОПТИМИЗАЦИЯ

```jsx
// Ленивая загрузка плеера
import { lazy, Suspense } from 'react';

const LazyVidstackPlayer = lazy(() => 
  import('./VidstackPlayer').then(mod => ({ default: mod.VidstackPlayer }))
);

export function OptimizedPlayer() {
  return (
    <Suspense fallback={<div>Loading player...</div>}>
      <LazyVidstackPlayer src="..." />
    </Suspense>
  );
}
```

