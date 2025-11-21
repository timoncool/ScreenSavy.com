'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle, type CSSProperties } from 'react';
import { RETRO_ENVIRONMENTS, type RetroEnvironmentId } from '@/lib/retroEnvironments';

export type RetroScene = 'loft' | 'forest' | 'lake-night' | 'rooftop' | 'junkyard' | 'arcade';

export interface RetroTVRef {
  setVideoId: (id: string) => void;
  setViewMode: (mode: 'full' | 'closeup') => void;
  setEnvironment: (id: RetroEnvironmentId) => void;
}

interface RetroTVProps {
  viewMode?: 'full' | 'closeup';
  environment?: RetroEnvironment;
}

type EnvironmentStyle = {
  wallBaseColor: string;
  wallBackground: string;
  wallSize?: string;
  wallPosition?: string;
  wallRepeat?: string;
  wallShadow?: string;
  wallFilter?: string;
  graffitiText?: string;
  graffitiColor?: string;
  graffitiShadow?: string;
  graffitiRotation?: string;
  baseboardBackground?: string;
  baseboardOpacity?: string;
  floorBackground: string;
  floorSize?: string;
  floorPosition?: string;
  floorFilter?: string;
  floorOpacity?: string;
};

const environmentStyles: Record<RetroEnvironmentId, EnvironmentStyle> = {
  'loft-brick': {
    wallBaseColor: '#20100c',
    wallBackground: `
      linear-gradient(180deg, rgba(12, 8, 6, 0.82), rgba(12, 8, 6, 0.55)),
      url('https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80'),
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 62px,
        rgba(34, 16, 10, 0.6) 62px,
        rgba(34, 16, 10, 0.6) 66px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(184, 104, 70, 0.75) 0px,
        rgba(184, 104, 70, 0.75) 10px,
        rgba(126, 61, 38, 0.85) 10px,
        rgba(126, 61, 38, 0.85) 135px,
        rgba(184, 104, 70, 0.75) 135px,
        rgba(184, 104, 70, 0.75) 142px,
        rgba(90, 44, 30, 0.8) 142px,
        rgba(90, 44, 30, 0.8) 146px
      )
    `,
    wallSize: '100% 100%, cover, 260px 70px, 140px 72px',
    wallPosition: '0 0, center, 0 0, 0 36px',
    graffitiText: `'RETRO WAVE'`,
    graffitiColor: 'rgba(255, 255, 255, 0.18)',
    graffitiShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)',
    graffitiRotation: '-8deg',
    baseboardBackground:
      'linear-gradient(90deg, #4a3428 0%, #3d2a1f 50%, #4a3428 100%), repeating-linear-gradient(90deg, #5a4438 0px, #5a4438 100px, #4a3428 100px, #4a3428 102px)',
    floorBackground: `
      linear-gradient(180deg, rgba(40, 24, 16, 0.9), rgba(16, 10, 6, 0.95)),
      url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=70')
    `,
    floorSize: '120% 120%, cover',
    floorFilter: 'saturate(0.9)',
  },
  'forest-night': {
    wallBaseColor: '#0a0f15',
    wallBackground: `
      linear-gradient(180deg, rgba(4, 8, 12, 0.82), rgba(4, 8, 12, 0.45)),
      url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80')
    `,
    wallSize: '100% 100%, cover',
    wallPosition: 'center',
    wallShadow: '0 10px 20px rgba(0, 0, 0, 0.85)',
    wallFilter: 'saturate(0.95)',
    graffitiText: `''`,
    baseboardOpacity: '0',
    floorBackground: `
      linear-gradient(180deg, rgba(9, 16, 12, 0.85), rgba(3, 6, 5, 0.95)),
      url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=70')
    `,
    floorSize: 'cover',
    floorFilter: 'saturate(0.8)',
  },
  'lake-moonlight': {
    wallBaseColor: '#0b1019',
    wallBackground: `
      linear-gradient(180deg, rgba(7, 11, 20, 0.82), rgba(7, 11, 20, 0.5)),
      url('https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80')
    `,
    wallSize: '100% 100%, cover',
    wallPosition: 'center',
    graffitiText: `'chillwave'`,
    graffitiColor: 'rgba(173, 216, 230, 0.22)',
    graffitiShadow: '1px 1px 8px rgba(0, 0, 0, 0.9)',
    graffitiRotation: '-2deg',
    baseboardOpacity: '0.2',
    floorBackground: `
      linear-gradient(180deg, rgba(10, 14, 22, 0.92), rgba(6, 8, 14, 0.97)),
      url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1400&q=70')
    `,
    floorSize: '110% 110%, cover',
    floorFilter: 'saturate(0.75)',
  },
  'city-rooftop': {
    wallBaseColor: '#0e0d12',
    wallBackground: `
      linear-gradient(180deg, rgba(8, 7, 12, 0.8), rgba(8, 7, 12, 0.55)),
      url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80')
    `,
    wallSize: '100% 100%, cover',
    wallPosition: 'center',
    wallShadow: '0 12px 18px rgba(0, 0, 0, 0.9)',
    graffitiText: `'CITY LIGHTS'`,
    graffitiColor: 'rgba(255, 255, 255, 0.14)',
    graffitiRotation: '-10deg',
    baseboardOpacity: '0.25',
    floorBackground: `
      linear-gradient(180deg, rgba(22, 22, 26, 0.92), rgba(8, 8, 10, 0.98)),
      url('https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=70')
    `,
    floorSize: '120% 120%, cover',
    floorFilter: 'saturate(0.7)',
  },
  'junkyard-stack': {
    wallBaseColor: '#120d0a',
    wallBackground: `
      linear-gradient(180deg, rgba(14, 10, 8, 0.8), rgba(14, 10, 8, 0.55)),
      url('https://images.unsplash.com/photo-1529429617124-aee35369a5c2?auto=format&fit=crop&w=1600&q=80')
    `,
    wallSize: '100% 100%, cover',
    wallPosition: 'center',
    wallShadow: '0 12px 22px rgba(0, 0, 0, 0.85)',
    graffitiText: `'TV GRAVEYARD'`,
    graffitiColor: 'rgba(255, 255, 255, 0.12)',
    graffitiShadow: '2px 2px 10px rgba(0, 0, 0, 0.9)',
    graffitiRotation: '-4deg',
    baseboardOpacity: '0.15',
    floorBackground: `
      linear-gradient(180deg, rgba(22, 16, 12, 0.9), rgba(8, 6, 5, 0.97)),
      url('https://images.unsplash.com/photo-1493655430214-3dd771846cfd?auto=format&fit=crop&w=1400&q=70')
    `,
    floorSize: '110% 110%, cover',
    floorFilter: 'saturate(0.65)',
  },
  'neon-arcade': {
    wallBaseColor: '#0d0613',
    wallBackground: `
      linear-gradient(180deg, rgba(10, 4, 18, 0.85), rgba(10, 4, 18, 0.55)),
      url('https://images.unsplash.com/photo-1527863280616-35ae4851d2c3?auto=format&fit=crop&w=1600&q=80')
    `,
    wallSize: '100% 100%, cover',
    wallPosition: 'center',
    wallFilter: 'saturate(1.15)',
    graffitiText: `'NEON DREAMS'`,
    graffitiColor: 'rgba(255, 111, 210, 0.3)',
    graffitiShadow: '0 0 12px rgba(255, 0, 110, 0.4)',
    graffitiRotation: '6deg',
    baseboardOpacity: '0.3',
    floorBackground: `
      radial-gradient(circle at 50% 0%, rgba(255, 0, 110, 0.25), transparent 45%),
      linear-gradient(180deg, rgba(6, 4, 10, 0.92), rgba(5, 3, 8, 0.98)),
      repeating-linear-gradient(90deg, rgba(0, 255, 200, 0.12) 0px, rgba(0, 255, 200, 0.12) 2px, transparent 2px, transparent 24px)
    `,
    floorSize: '100% 100%, 100% 100%, 22px 22px',
    floorPosition: 'center',
    floorFilter: 'saturate(1.1)',
  },
};

const defaultEnvironment: RetroEnvironmentId = RETRO_ENVIRONMENTS[0].id;

const RetroTV = forwardRef<RetroTVRef, RetroTVProps>(({ viewMode = 'full' }, ref) => {
  const [currentVideoId, setCurrentVideoId] = useState('jfKfPfyJRdk');
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [internalViewMode, setInternalViewMode] = useState<'full' | 'closeup'>(viewMode);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [volume, setVolume] = useState(50);
  const [environment, setEnvironment] = useState<RetroEnvironmentId>(defaultEnvironment);
  const playerRef = useRef<any>(null);

  const fallbackEnvironment = environmentStyles[defaultEnvironment];
  const activeEnvironment = environmentStyles[environment] || fallbackEnvironment;

  const environmentCssVars: CSSProperties = {
    ['--wall-base-color' as string]: activeEnvironment.wallBaseColor ?? fallbackEnvironment.wallBaseColor,
    ['--wall-background' as string]: activeEnvironment.wallBackground ?? fallbackEnvironment.wallBackground,
    ['--wall-background-size' as string]: activeEnvironment.wallSize ?? fallbackEnvironment.wallSize ?? 'cover',
    ['--wall-background-position' as string]:
      activeEnvironment.wallPosition ?? fallbackEnvironment.wallPosition ?? 'center',
    ['--wall-background-repeat' as string]:
      activeEnvironment.wallRepeat ?? fallbackEnvironment.wallRepeat ?? 'no-repeat',
    ['--wall-shadow' as string]: activeEnvironment.wallShadow ?? '0 8px 10px rgba(0, 0, 0, 0.8)',
    ['--wall-filter' as string]: activeEnvironment.wallFilter ?? 'none',
    ['--wall-graffiti-text' as string]:
      activeEnvironment.graffitiText ?? fallbackEnvironment.graffitiText ?? "''",
    ['--wall-graffiti-color' as string]:
      activeEnvironment.graffitiColor ?? fallbackEnvironment.graffitiColor ?? 'rgba(255, 255, 255, 0.1)',
    ['--wall-graffiti-shadow' as string]:
      activeEnvironment.graffitiShadow ?? fallbackEnvironment.graffitiShadow ?? '2px 2px 4px rgba(0, 0, 0, 0.6)',
    ['--wall-graffiti-rotation' as string]:
      activeEnvironment.graffitiRotation ?? fallbackEnvironment.graffitiRotation ?? '-6deg',
    ['--wall-baseboard-background' as string]:
      activeEnvironment.baseboardBackground ?? fallbackEnvironment.baseboardBackground ?? 'none',
    ['--wall-baseboard-opacity' as string]:
      activeEnvironment.baseboardOpacity ?? fallbackEnvironment.baseboardOpacity ?? '1',
    ['--floor-background' as string]: activeEnvironment.floorBackground ?? fallbackEnvironment.floorBackground,
    ['--floor-background-size' as string]: activeEnvironment.floorSize ?? fallbackEnvironment.floorSize ?? '100% 100%',
    ['--floor-background-position' as string]:
      activeEnvironment.floorPosition ?? fallbackEnvironment.floorPosition ?? 'center',
    ['--floor-filter' as string]: activeEnvironment.floorFilter ?? fallbackEnvironment.floorFilter ?? 'none',
    ['--floor-opacity' as string]: activeEnvironment.floorOpacity ?? fallbackEnvironment.floorOpacity ?? '1',
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    setVideoId: (id: string) => {
      setCurrentVideoId(id);
      setIsPoweredOn(true);
    },
    setViewMode: (mode: 'full' | 'closeup') => {
      setInternalViewMode(mode);
    },
    setEnvironment: (id: RetroEnvironmentId) => {
      setEnvironment(id);
    }
  }));

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ((window as any).YT && (window as any).YT.Player) {
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  // Initialize YouTube player
  useEffect(() => {
    if (!currentVideoId || typeof window === 'undefined' || !isPoweredOn) {
      if (playerRef.current && !isPoweredOn) {
        playerRef.current.pauseVideo?.();
      }
      return;
    }

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.loadVideoById(currentVideoId);
        playerRef.current.playVideo?.();
        return;
      }

      if ((window as any).YT && (window as any).YT.Player) {
        playerRef.current = new (window as any).YT.Player('youtube-player', {
          videoId: currentVideoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            disablekb: 1,
          },
          events: {
            onReady: (event: any) => {
              event.target.playVideo();
              event.target.setVolume(volume);
            }
          }
        });
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }
  }, [currentVideoId, isPoweredOn, volume]);

  useEffect(() => {
    if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  const handlePlay = () => {
    playerRef.current?.playVideo();
  };

  const handlePause = () => {
    playerRef.current?.pauseVideo();
  };

  const handleNext = () => {
    playerRef.current?.playVideo();
  };

  // Calculate effects based on sliders
  const isCloseup = internalViewMode === 'closeup';
  const filterStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
  };

  return (
    <div className={`retro-tv-container env-${environment}`} style={environmentCssVars}>
      <div className="gradient" />
      <div className="scene-backdrop" />
      <div className="wood-floor" />

      <div
        className={`old-tv ${!isPoweredOn ? 'powered-off' : ''} ${isCloseup ? 'closeup-mode' : ''}`}
      >
        <div className="antenna" />
        <main>
          <div className="error-noise">
            <div className="error-effect">
              <div
                className="old-tv-content"
                style={filterStyle}
              >
                {currentVideoId && isPoweredOn ? (
                  <div id="youtube-player" className="youtube-container" />
                ) : (
                  <div className="static-noise" />
                )}
              </div>
            </div>
          </div>
        </main>
        <div className="right-panel">
          <div className="speaker" />
          <div className="control-panel">
            <div className="slider-group">
              <label>Brightness</label>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                className="control-slider"
                onChange={(e) => setBrightness(Number(e.target.value))}
              />
            </div>
            <div className="slider-group">
              <label>Contrast</label>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                className="control-slider"
                onChange={(e) => setContrast(Number(e.target.value))}
              />
            </div>
            <div className="slider-group">
              <label>Saturation</label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                className="control-slider"
                onChange={(e) => setSaturation(Number(e.target.value))}
              />
            </div>
            <div className="slider-group">
              <label>Volume</label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                className="control-slider"
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        <div className="playback-row">
          <div className="power-button-area">
            <button onClick={() => setIsPoweredOn(!isPoweredOn)} type="button" className="power-button" />
            <div className="indicator-panel">
              <div className="indicator">
                <div className="indicator-light power-light" data-on={isPoweredOn} />
                <div className="indicator-label">Power</div>
              </div>
            </div>
          </div>
          <div className="playback-controls">
            <button onClick={handlePlay} className="control-button">Play</button>
            <button onClick={handlePause} className="control-button">Pause</button>
            <button onClick={handleNext} className="control-button">Next</button>
          </div>
        </div>
        <footer />
      </div>

      <div id="table-tv" className={isCloseup ? 'closeup-mode' : ''}>
        <div className="scene" style={{ transform: 'rotateX(-12deg) rotateY(0deg)' }}>
          <div className="shape cuboid-1 cub-1">
            <div className="face ft" style={{ boxShadow: 'inset 0 1px rgba(255,255,255,0.2)' }} />
            <div className="face bk" />
            <div className="face rt" />
            <div className="face lt" />
            <div className="face bm" />
            <div className="face tp" style={{ boxShadow: 'inset 0 100px 20px rgba(0,0,0,0.3), inset 0 300px rgba(0,0,0,0.3)' }} />
          </div>
          <div className="shape cuboid-3 cub-3">
            <div className="face ft" style={{ boxShadow: 'inset 0 300px rgba(0,0,0,0.6), 10px 2px 10px rgba(0,0,0,0.8)' }} />
            <div className="face bk" />
            <div className="face rt" />
            <div className="face lt" style={{ boxShadow: 'inset 0 300px rgba(0,0,0,0.8)' }} />
            <div className="face bm" />
            <div className="face tp" />
          </div>
          <div className="shape cuboid-4 cub-4">
            <div className="face ft" style={{ boxShadow: 'inset 0 20px 5px rgba(0,0,0,0.6), 5px 2px 8px rgba(0,0,0,0.4)' }} />
            <div className="face bk" />
            <div className="face rt" />
            <div className="face lt" style={{ boxShadow: 'inset 0 300px rgba(0,0,0,0.3)' }} />
            <div className="face bm" />
            <div className="face tp" />
          </div>
          <div className="shape cuboid-5 cub-5">
            <div className="face ft" style={{ boxShadow: 'inset 0 300px rgba(0,0,0,0.6), -10px 2px 10px rgba(0,0,0,0.8)' }} />
            <div className="face bk" />
            <div className="face rt" style={{ boxShadow: 'inset 0 300px rgba(0,0,0,0.8)' }} />
            <div className="face lt" />
            <div className="face bm" />
            <div className="face tp" />
          </div>
          <div className="shape cuboid-6 cub-6">
            <div className="face ft" style={{ boxShadow: 'inset 0 20px 5px rgba(0,0,0,0.6), -5px 2px 8px rgba(0,0,0,0.4)' }} />
            <div className="face bk" />
            <div className="face rt" style={{ boxShadow: 'inset 0 300px rgba(0,0,0,0.3)' }} />
            <div className="face lt" />
            <div className="face bm" />
            <div className="face tp" />
          </div>
          <div className="shape cuboid-2 cub-2">
            <div className="face ft" style={{ boxShadow: 'inset 0 1px rgba(255,255,255,0.2)' }} />
            <div className="face bk" />
            <div className="face rt" />
            <div className="face lt" />
            <div className="face bm" />
            <div className="face tp" style={{ boxShadow: 'inset 0 50px 20px rgba(0,0,0,0.5), inset 0 150px rgba(0,0,0,0.4)' }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .retro-tv-container {
          position: relative;
          width: 100%;
          height: 100vh;
          background: #000;
          --table-height: 320px;
          --table-scale: 1.05;
          --table-bottom: 10px;
          --table-closeup-scale: 1.25;
          --table-closeup-bottom: -70px;
          --tv-scale: 0.82;
          --tv-lift-factor: 1.5;
          --tv-bottom: 190px;
          --tv-closeup-bottom: 150px;
          --tv-closeup-scale: 1.7;
          --tv-closeup-lift-factor: 1.05;
          --wall-base-color: #20100c;
          --wall-background: none;
          --wall-background-size: cover;
          --wall-background-position: center;
          --wall-background-repeat: no-repeat;
          --wall-shadow: 0 8px 10px rgba(0, 0, 0, 0.8);
          --wall-filter: none;
          --wall-graffiti-text: '';
          --wall-graffiti-color: rgba(255, 255, 255, 0.14);
          --wall-graffiti-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
          --wall-graffiti-rotation: -6deg;
          --wall-baseboard-background: none;
          --wall-baseboard-opacity: 1;
          --floor-background: none;
          --floor-background-size: 100% 100%;
          --floor-background-position: center;
          --floor-filter: none;
          --floor-opacity: 1;
        }

        body {
          padding: 0;
          margin: 0;
        }

        .gradient {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: linear-gradient(
              to left,
              rgba(0, 0, 0, 0.8) 0%,
              transparent 20%,
              transparent 80%,
              rgba(0, 0, 0, 0.8) 100%
            ),
            var(--ambient-glow),
            radial-gradient(transparent 50%, rgba(0, 0, 0, 0.8));
          z-index: 400;
          pointer-events: none;
        }

        .gradient::before {
          position: absolute;
          content: " ";
          width: 2500px;
          height: 300px;
          bottom: 5px;
          left: 50%;
          margin-left: -1250px;
          background: radial-gradient(rgba(0, 0, 0, 0.5) 25%, transparent 50%);
        }

        .gradient::after {
          position: absolute;
          content: " ";
          width: 2000px;
          height: 1500px;
          bottom: -300px;
          left: 50%;
          margin-left: -1000px;
          background: radial-gradient(rgba(0, 0, 0, 0.6) 30%, transparent 50%);
        }

        .scene-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 140px;
          background-color: var(--wall-base-color);
          background-image: var(--wall-background);
          background-size: var(--wall-background-size);
          background-position: var(--wall-background-position);
          background-repeat: var(--wall-background-repeat);
          box-shadow: var(--wall-shadow, 0 8px 10px rgba(0, 0, 0, 0.8));
          filter: var(--wall-filter, none);
          z-index: 100;
          overflow: hidden;
        }

        .brick-wall::after {
          content: var(--wall-graffiti-text);
          position: absolute;
          top: 15%;
          right: 20%;
          font-family: 'Brush Script MT', 'Lucida Handwriting', cursive;
          font-size: 46px;
          font-weight: bold;
          color: var(--wall-graffiti-color);
          text-shadow: var(--wall-graffiti-shadow);
          transform: rotate(var(--wall-graffiti-rotation));
          letter-spacing: 1px;
          z-index: 1;
        }

        .brick-wall::after {
          content: "";
          position: absolute;
          content: " ";
          bottom: 0;
          width: 100%;
          height: 30px;
          background: var(--wall-baseboard-background);
          opacity: var(--wall-baseboard-opacity);
          box-shadow: inset 0 2px rgba(255, 255, 255, 0.2),
            inset 0 -5px 5px rgba(0, 0, 0, 0.2), 0 -1px 4px rgba(0, 0, 0, 0.9);
        }

        .wood-floor {
          position: absolute;
          width: 100%;
          height: 170px;
          bottom: 0;
          left: 0;
          perspective: 300px;
          overflow: hidden;
          z-index: 50;
        }

        .wood-floor::before {
          position: absolute;
          content: " ";
          top: -100%;
          left: -25%;
          width: 150%;
          height: 250%;
          background: var(--floor-background);
          background-size: var(--floor-background-size);
          background-position: var(--floor-background-position);
          transform: rotateX(60deg);
          filter: var(--floor-filter, none);
          opacity: var(--floor-opacity, 1);
          box-shadow: inset 0 -50px 100px rgba(0, 0, 0, 0.5);
        }

        .old-tv * {
          outline: none;
        }

        .old-tv {
          position: absolute;
          width: 890px;
          aspect-ratio: 16 / 9;
          height: auto;
          --active-tv-bottom: var(--tv-bottom);
          --active-tv-scale: var(--tv-scale);
          bottom: var(--active-tv-bottom);
          left: 50%;
          margin-left: -445px;
          background: #333;
          background-image: url(data:image/png;base64,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);
          padding: 12px 14px 10px;
          border-radius: 8px;
          border-bottom: 2px #222 solid;
          transform: scale(var(--active-tv-scale));
          z-index: 600;
          pointer-events: auto;
          transition: box-shadow 0.5s ease, transform 0.5s ease, bottom 0.5s ease;
        }

        .old-tv::after {
          display: none;
        }

        @keyframes screen {
          0% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.8;
          }
        }

        .old-tv .antenna {
          position: absolute;
          width: 200px;
          height: 20px;
          background: #222;
          top: -20px;
          left: 240px;
          border-top-left-radius: 50%;
          border-top-right-radius: 50%;
          box-shadow: inset 0 5px #444, inset 0 -2px 5px #000;
        }

        .old-tv .antenna:before {
          content: " ";
          position: absolute;
          bottom: 8px;
          left: 40px;
          width: 12px;
          height: 250px;
          background-color: #444;
          background-image: linear-gradient(rgba(255, 255, 255, 0.1), transparent);
          transform: rotate(-20deg);
          border-top-left-radius: 40%;
          border-top-right-radius: 40%;
          box-shadow: inset -1px 1px rgba(255, 255, 255, 0.4),
            inset 5px 0 5px rgba(0, 0, 0, 0.5), -8px 5px 15px rgba(0, 0, 0, 0.5);
          z-index: -1;
        }

        .old-tv .antenna:after {
          content: " ";
          position: absolute;
          bottom: 8px;
          left: 150px;
          width: 12px;
          height: 250px;
          background: #444;
          background-image: linear-gradient(rgba(255, 255, 255, 0.1), transparent);
          transform: rotate(20deg);
          border-top-left-radius: 40%;
          border-top-right-radius: 40%;
          box-shadow: inset -1px 1px rgba(255, 255, 255, 0.4),
            inset 5px 0 5px rgba(0, 0, 0, 0.5), -10px 5px 15px rgba(0, 0, 0, 0.5);
          z-index: -1;
        }

        .old-tv main {
          position: absolute;
          left: 20px;
          top: 14px;
          width: calc(100% - 200px);
          aspect-ratio: 16 / 9;
          height: auto;
          padding: 6px;
          border-radius: 8px;
          background: #444;
          border: 2px #aaa solid;
          box-shadow: 0 10px 8px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .old-tv main::before {
          content: " ";
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border-radius: 9px;
          border-style: solid;
          border-width: 18px 20px 12px 20px;
          border-color: rgba(0, 0, 0, 0.4) rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0)
            rgba(0, 0, 0, 0.2);
          z-index: 1;
          pointer-events: none;
        }

        .old-tv main::after {
          content: " ";
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(0, 0, 0, 0.1) 10%, transparent);
          z-index: 2;
          pointer-events: none;
        }

        .controls {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .control-button {
          background-color: #333;
          background-image: linear-gradient(rgba(255, 255, 255, 0.05), transparent);
          border: 2px solid #222;
          color: #ccc;
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: inset 1px 1px rgba(255, 255, 255, 0.1), inset -1px -1px rgba(0, 0, 0, 0.3), 1px 1px 2px rgba(0,0,0,0.5);
          transition: all 0.1s ease-in-out;
          font-family: 'Bebas Neue', sans-serif;
          text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
          font-size: 14px;
        }

        .control-button:active {
          box-shadow: inset -1px -1px rgba(255, 255, 255, 0.1), inset 1px 1px rgba(0, 0, 0, 0.3);
          background-image: linear-gradient(transparent, rgba(255, 255, 255, 0.05));
          transform: translateY(1px);
        }

        .right-panel {
          position: absolute;
          right: 12px;
          top: 32px;
          bottom: 38px;
          width: 160px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
          justify-content: flex-start;
          z-index: 10;
        }

        .old-tv .speaker {
          position: relative;
          width: 110px;
          height: 110px;
          padding: 10px;
          box-sizing: border-box;
          margin-top: 6px;
          z-index: 1;
          pointer-events: none;
        }

        .control-panel {
          position: relative;
          width: 110px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 10px;
          z-index: 11;
        }

        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .slider-group label {
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
          color: #ccc;
          text-shadow: 1px 1px #000;
          text-align: center;
        }

        .old-tv .speaker::before {
          content: " ";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.6) 0px,
            rgba(0, 0, 0, 0.6) 2px,
            transparent 2px,
            transparent 6px
          );
          border-radius: 8px;
          border: 2px #111 solid;
          box-shadow: inset 0 2px 2px rgba(0,0,0,0.5), inset 0 -2px 2px rgba(255,255,255,0.1);
          z-index: 2;
        }

        .playback-row {
          position: absolute;
          left: 30px;
          bottom: 26px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 14px;
          z-index: 11;
        }

        .playback-controls {
          position: relative;
          display: flex;
          gap: 6px;
          justify-content: flex-start;
          z-index: 11;
        }

        .old-tv input[type="range"] {
          -webkit-appearance: none;
          width: 88%;
          background: transparent;
          cursor: pointer;
        }

        .old-tv input[type="range"]:focus {
          outline: none;
        }

        .control-slider {
          margin: 4px 0;
        }

        .old-tv input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 5px;
          cursor: pointer;
          box-shadow: inset 1px 1px 2px rgba(0,0,0,0.8), inset -1px -1px 2px rgba(255,255,255,0.1);
          background: #222;
          border-radius: 4px;
        }

        .old-tv input[type="range"]::-webkit-slider-thumb {
          height: 15px;
          width: 8px;
          border-radius: 2px;
          background-color: #555;
          background-image: linear-gradient(rgba(255, 255, 255, 0.1), transparent);
          box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.2),
            1px 1px 5px rgba(0, 0, 0, 1);
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -6px;
        }

        .power-button {
          width: 44px;
          height: 42px;
          background-color: #444;
          background-image: linear-gradient(rgba(255, 255, 255, 0.1), transparent);
          border-radius: 50%;
          box-shadow: inset 2px 2px 2px rgba(255, 255, 255, 0.1),
            inset -2px -2px 2px rgba(0, 0, 0, 0.5), 2px 2px 5px rgba(0,0,0,0.8);
          border: 3px #222 solid;
          cursor: pointer;
          transition: all 0.1s ease-in-out;
        }

        .power-button:hover {
          background-color: #555;
          box-shadow: inset 2px 2px 2px rgba(255, 255, 255, 0.15),
            inset -2px -2px 2px rgba(0, 0, 0, 0.6), 2px 2px 8px rgba(0,0,0,0.9);
        }

        .power-button:active {
          transform: translateY(1px);
          box-shadow: inset -2px -2px 2px rgba(255, 255, 255, 0.1),
            inset 2px 2px 2px rgba(0, 0, 0, 0.5);
        }

        .power-button-area {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          margin-bottom: 0;
        }

        .indicator-panel {
          display: flex;
          flex-direction: row;
          gap: 6px;
          padding: 4px 7px;
          background: #2a2a2a;
          border-radius: 4px;
          border: 2px solid #1a1a1a;
        }

        .indicator {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .indicator-light {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1a1a1a;
          border: 1px solid #000;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        .indicator-light[data-on="true"].power-light {
          background: #7cfc00;
          box-shadow: 0 0 8px #7cfc00, 0 0 4px #7cfc00;
        }

        .indicator-light[data-on="true"].standby-light {
          background: #ff4444;
          box-shadow: 0 0 8px #ff4444, 0 0 4px #ff4444;
        }

        .indicator-label {
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          color: #aaa;
          text-shadow: 1px 1px #000;
        }

        .old-tv footer {
          position: absolute;
          height: 16px;
          bottom: -20px;
          left: 15px;
          right: 15px;
          background: #222;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          box-shadow: inset 0 5px 5px rgba(0, 0, 0, 0.8),
            0 2px 5px rgba(0, 0, 0, 0.5), 0 10px 25px rgba(0, 0, 0, 1);
          border-bottom: 3px #000 solid;
          z-index: -1;
        }

        .error-noise {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          height: auto;
          max-height: 100%;
          overflow: hidden;
          border-radius: 15px;
          z-index: 0;
        }

        .error-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 15px;
          background: #111;
          background-image: url(data:image/png;base64,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);
          background-size: 80%;
          animation: noise 200ms infinite linear;
        }

        .error-effect::before {
          content: " ";
          position: absolute;
          width: 100%;
          height: 20%;
          background: rgba(255, 255, 255, 0.2);
          animation: noiseeffect 4000ms infinite linear;
          border-radius: 15px;
          pointer-events: none;
        }

        .error-effect::after {
          content: " ";
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(transparent 50%, rgba(0, 0, 0, 0.8)),
            linear-gradient(rgba(255, 255, 255, 0.4) 10%, transparent);
          box-shadow: inset 0 5px 25px rgba(255, 255, 255, 0.2),
            inset 5px 0 15px rgba(255, 255, 255, 0.2),
            inset -5px 0 15px rgba(255, 255, 255, 0.1), 0 0 10px rgba(0, 0, 0, 1),
            inset 0 200px 5px rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          pointer-events: none;
        }

        .old-tv-content {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: transparent;
          border-radius: 15px;
          animation: crt-image 20ms alternate infinite;
          transition: filter 0.2s ease;
          overflow: hidden;
        }

        .youtube-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          overflow: hidden;
        }

        .youtube-container :global(iframe) {
          width: 100%;
          height: 100%;
          border: none;
        }

        .static-noise {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(0deg, transparent 50%, rgba(255, 255, 255, 0.1) 50%),
            linear-gradient(90deg, transparent 50%, rgba(255, 255, 255, 0.05) 50%);
          background-size: 2px 2px, 3px 3px;
          animation: static 0.05s infinite;
          opacity: 0.9;
          filter: contrast(200%) brightness(150%);
        }

        .static-noise::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          animation: flicker 0.1s infinite;
        }

        .static-noise::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.3) 10%, transparent 10%),
            radial-gradient(circle, rgba(255,255,255,0.2) 15%, transparent 15%);
          background-size: 8px 8px, 12px 12px;
          background-position: 0 0, 4px 4px;
          animation: staticDots 0.08s infinite;
        }

        @keyframes static {
          0% {
            background-position: 0 0, 0 0;
            filter: contrast(200%) brightness(150%) hue-rotate(0deg);
          }
          25% {
            background-position: -2px 2px, 3px -1px;
            filter: contrast(220%) brightness(140%) hue-rotate(5deg);
          }
          50% {
            background-position: 1px -1px, -2px 2px;
            filter: contrast(180%) brightness(160%) hue-rotate(-5deg);
          }
          75% {
            background-position: -1px -2px, 1px 3px;
            filter: contrast(210%) brightness(145%) hue-rotate(3deg);
          }
          100% {
            background-position: 2px 1px, -1px -2px;
            filter: contrast(200%) brightness(150%) hue-rotate(0deg);
          }
        }

        @keyframes flicker {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }

        @keyframes staticDots {
          0% {
            transform: translate(0, 0);
            opacity: 0.6;
          }
          33% {
            transform: translate(-2px, 2px);
            opacity: 0.8;
          }
          66% {
            transform: translate(2px, -1px);
            opacity: 0.7;
          }
          100% {
            transform: translate(-1px, 1px);
            opacity: 0.6;
          }
        }

        .old-tv-content::after {
          content: " ";
          position: absolute;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(0, #fff, #fff 2px, transparent 4px);
          opacity: 0.15;
          border-radius: 15px;
          animation: crt-pixels 20ms alternate infinite;
          pointer-events: none;
        }

        @keyframes crt-image {
          0% {
            transform: translateY(-1px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes crt-pixels {
          0% {
            transform: translateY(-3px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes noise {
          0% {
            background-position: 0px 1000px;
          }
          50% {
            background-position: -1000px;
          }
          100% {
            background-position: 100px 0px;
          }
        }

        @keyframes noiseeffect {
          0% {
            top: -20%;
            opacity: 0;
          }
          20% {
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          80% {
            opacity: 0;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }

        #table-tv {
          perspective: 800px;
          position: absolute;
          overflow: hidden;
          width: 600px;
          height: var(--table-height);
          left: 50%;
          --active-table-scale: var(--table-scale);
          --active-table-bottom: var(--table-bottom);
          bottom: var(--active-table-bottom);
          margin-left: -300px;
          background: transparent;
          font-size: 250%;
          z-index: 500;
          pointer-events: none;
          transform: scale(var(--active-table-scale));
          transition: transform 0.5s ease, bottom 0.5s ease;
        }

        .face {
          background-image: url(https://levelhard.com.br/jobs/jobs/site_television/images/table-wood-texture.jpg);
          background-size: 100%;
        }

        .scene,
        .shape,
        .face,
        .face-wrapper,
        .cr {
          position: absolute;
          transform-style: preserve-3d;
        }

        .scene {
          width: 80em;
          height: 80em;
          top: 50%;
          left: 50%;
          margin: -38em 0 0 -40em;
        }

        .shape {
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          transform-origin: 50%;
        }

        .face,
        .face-wrapper {
          overflow: hidden;
          transform-origin: 0 0;
          backface-visibility: hidden;
        }

        .face {
          background-size: 100% 100% !important;
          background-position: center;
        }

        .side {
          left: 50%;
        }

        .cr,
        .cr .side {
          height: 100%;
        }

        [class*="cuboid"] .ft,
        [class*="cuboid"] .bk {
          width: 100%;
          height: 100%;
        }

        [class*="cuboid"] .bk {
          left: 100%;
        }

        [class*="cuboid"] .rt {
          transform: rotateY(-90deg) translateX(-50%);
        }

        [class*="cuboid"] .lt {
          transform: rotateY(90deg) translateX(-50%);
        }

        [class*="cuboid"] .tp {
          transform: rotateX(90deg) translateY(-50%);
        }

        [class*="cuboid"] .bm {
          transform: rotateX(-90deg) translateY(-50%);
        }

        [class*="cuboid"] .lt {
          left: 100%;
        }

        [class*="cuboid"] .bm {
          top: 100%;
        }

        .cub-1 {
          transform: translate3D(0em, -5em, 0em) rotateX(0deg) rotateY(0deg)
            rotateZ(0deg);
          opacity: 1;
          width: 12em;
          height: 0.2em;
          margin: -0.1em 0 0 -6em;
        }

        .cub-1 .ft {
          transform: translateZ(2.625em);
        }

        .cub-1 .bk {
          transform: translateZ(-2.625em) rotateY(180deg);
        }

        .cub-1 .rt,
        .cub-1 .lt {
          width: 5.25em;
          height: 0.2em;
        }

        .cub-1 .tp,
        .cub-1 .bm {
          width: 12em;
          height: 5.25em;
        }

        .cub-1 .face {
          background-color: #ffffff;
        }

        .cub-3 {
          transform: translate3D(-4.0625em, -2.5em, -2.125em) rotateX(0deg)
            rotateY(0deg) rotateZ(12deg);
          opacity: 1;
          width: 0.2em;
          height: 5em;
          margin: -2.5em 0 0 -0.1em;
        }

        .cub-3 .ft {
          transform: translateZ(0.1em);
        }

        .cub-3 .bk {
          transform: translateZ(-0.1em) rotateY(180deg);
        }

        .cub-3 .rt,
        .cub-3 .lt {
          width: 0.2em;
          height: 5em;
        }

        .cub-3 .tp,
        .cub-3 .bm {
          width: 0.2em;
          height: 0.2em;
        }

        .cub-3 .face {
          background-color: #ffffff;
        }

        .cub-4 {
          transform: translate3D(-4.125em, -2.5em, 2.125em) rotateX(0deg)
            rotateY(0deg) rotateZ(12deg);
          opacity: 1;
          width: 0.2em;
          height: 5em;
          margin: -2.5em 0 0 -0.1em;
        }

        .cub-4 .ft {
          transform: translateZ(0.1em);
        }

        .cub-4 .bk {
          transform: translateZ(-0.1em) rotateY(180deg);
        }

        .cub-4 .rt,
        .cub-4 .lt {
          width: 0.2em;
          height: 5em;
        }

        .cub-4 .tp,
        .cub-4 .bm {
          width: 0.2em;
          height: 0.2em;
        }

        .cub-4 .face {
          background-color: #ffffff;
        }

        .cub-5 {
          transform: translate3D(4em, -2.5em, -2.125em) rotateX(0deg) rotateY(0deg)
            rotateZ(-13deg);
          opacity: 1;
          width: 0.2em;
          height: 5em;
          margin: -2.5em 0 0 -0.1em;
        }

        .cub-5 .ft {
          transform: translateZ(0.1em);
        }

        .cub-5 .bk {
          transform: translateZ(-0.1em) rotateY(180deg);
        }

        .cub-5 .rt,
        .cub-5 .lt {
          width: 0.2em;
          height: 5em;
        }

        .cub-5 .tp,
        .cub-5 .bm {
          width: 0.2em;
          height: 0.2em;
        }

        .cub-5 .face {
          background-color: #ffffff;
        }

        .cub-6 {
          transform: translate3D(4em, -2.5em, 2.125em) rotateX(0deg) rotateY(0deg)
            rotateZ(-13deg);
          opacity: 1;
          width: 0.2em;
          height: 5em;
          margin: -2.5em 0 0 -0.1em;
        }

        .cub-6 .ft {
          transform: translateZ(0.1em);
        }

        .cub-6 .bk {
          transform: translateZ(-0.1em) rotateY(180deg);
        }

        .cub-6 .rt,
        .cub-6 .lt {
          width: 0.2em;
          height: 5em;
        }

        .cub-6 .tp,
        .cub-6 .bm {
          width: 0.2em;
          height: 0.2em;
        }

        .cub-6 .face {
          background-color: #ffffff;
        }

        .cub-2 {
          transform: translate3D(0em, -3.5em, 0em) rotateX(0deg) rotateY(0deg)
            rotateZ(0deg);
          opacity: 1;
          width: 10em;
          height: 0.2em;
          margin: -0.1em 0 0 -5em;
        }

        .cub-2 .ft {
          transform: translateZ(2.625em);
        }

        .cub-2 .bk {
          transform: translateZ(-2.625em) rotateY(180deg);
        }

        .cub-2 .rt,
        .cub-2 .lt {
          width: 5.25em;
          height: 0.2em;
        }

        .cub-2 .tp,
        .cub-2 .bm {
          width: 10em;
          height: 5.25em;
        }

        .cub-2 .face {
          background-color: #ffffff;
        }

        .old-tv.closeup-mode {
          --active-table-scale: var(--table-closeup-scale);
          --active-table-bottom: var(--table-closeup-bottom);
          --active-tv-lift-factor: var(--tv-closeup-lift-factor);
          --active-tv-bottom: var(--tv-closeup-bottom);
          --active-tv-scale: var(--tv-closeup-scale);
          transform: scale(var(--active-tv-scale));
          transform-origin: 50% 100%;
          z-index: 800;
        }

        .old-tv.powered-off .old-tv-content {
          opacity: 0.3;
          filter: brightness(0.2) !important;
        }

        .old-tv.powered-off .youtube-container {
          display: none;
        }

        #table-tv.closeup-mode {
          --active-table-scale: var(--table-closeup-scale);
          --active-table-bottom: var(--table-closeup-bottom);
          transform: scale(var(--active-table-scale)) translateY(80px);
          bottom: var(--active-table-bottom);
          opacity: 0;
        }

        .scene-backdrop {
          transition: opacity 0.5s ease;
        }

        .closeup-mode ~ .scene-backdrop {
          opacity: 0.3;
        }

        @media (max-width: 1200px) {
          .retro-tv-container {
            --table-scale: 1.05;
            --table-closeup-scale: 1.1;
            --table-closeup-bottom: -90px;
            --tv-scale: 0.6;
            --tv-lift-factor: 0.92;
            --tv-closeup-scale: 1.5;
            --tv-closeup-lift-factor: 0.45;
          }
        }
      `}</style>
    </div>
  );
});

RetroTV.displayName = 'RetroTV';

export default RetroTV;
