'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

export type BackgroundScene = 'loft' | 'forest' | 'lake-night' | 'rooftop' | 'tv-dump' | 'desert' | 'city-alley' | 'mountain-view' | 'ocean-sunset' | 'city-skyline' | 'space-stars';

export interface RetroTVRef {
  setVideoId: (id: string) => void;
  setViewMode: (mode: 'full' | 'closeup') => void;
  setBackground: (scene: BackgroundScene) => void;
}

interface RetroTVProps {
  viewMode?: 'full' | 'closeup';
  initialBackground?: BackgroundScene;
}

const RetroTV = forwardRef<RetroTVRef, RetroTVProps>(({ viewMode = 'full', initialBackground = 'loft' }, ref) => {
  const [currentVideoId, setCurrentVideoId] = useState('jfKfPfyJRdk');
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [internalViewMode, setInternalViewMode] = useState<'full' | 'closeup'>(viewMode);
  const [currentBackground, setCurrentBackground] = useState<BackgroundScene>(initialBackground);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [volume, setVolume] = useState(50);
  const playerRef = useRef<any>(null);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    setVideoId: (id: string) => {
      setCurrentVideoId(id);
      setIsPoweredOn(true);
    },
    setViewMode: (mode: 'full' | 'closeup') => {
      setInternalViewMode(mode);
    },
    setBackground: (scene: BackgroundScene) => {
      setCurrentBackground(scene);
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
    <div className="retro-tv-container">
      <div className="gradient" />
      <div className={`background-wall ${currentBackground}`} />
      <div className={`background-floor ${currentBackground}`} />

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
          --table-height: 300px;
          --table-scale: 1;
          --table-bottom: -12px;
          --table-closeup-scale: 1.2;
          --table-closeup-bottom: -90px;
          --tv-scale: 0.8;
          --tv-lift-factor: 1.35;
          --tv-bottom: 220px;
          --tv-closeup-bottom: 200px;
          --tv-closeup-scale: 1.7;
          --tv-closeup-lift-factor: 0.95;
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

        .background-wall {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 140px;
          z-index: 100;
          transition: opacity 0.5s ease;
        }

        /* LOFT - Simple brick wall */
        .background-wall.loft {
          background-color: #8b4d3a;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 60px,
              #3a2318 60px,
              #3a2318 64px
            ),
            repeating-linear-gradient(
              90deg,
              #a0522d 0px,
              #a0522d 8px,
              #8b4513 8px,
              #8b4513 120px,
              #a0522d 120px,
              #a0522d 128px,
              #6b3d2e 128px,
              #6b3d2e 130px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 65px,
              #3a2318 65px,
              #3a2318 68px,
              transparent 68px,
              transparent 130px
            ),
            linear-gradient(
              180deg,
              rgba(139, 69, 19, 0.3) 0%,
              rgba(107, 61, 46, 0.5) 50%,
              rgba(74, 38, 24, 0.7) 100%
            );
          background-size: 100% 100%, 260px 64px, 130px 64px, 100% 100%;
          background-position: 0 0, 0 0, 0 32px, 0 0;
          box-shadow: 0 8px 10px rgba(0, 0, 0, 0.8), inset 0 0 100px rgba(0, 0, 0, 0.3);
        }

        .background-wall.loft::after {
          content: "";
          pointer-events: none;
        }

        .background-wall.loft::before {
          position: absolute;
          content: " ";
          bottom: 0;
          width: 100%;
          height: 30px;
          background:
            linear-gradient(90deg, #4a3428 0%, #3d2a1f 50%, #4a3428 100%),
            repeating-linear-gradient(90deg, #5a4438 0px, #5a4438 100px, #4a3428 100px, #4a3428 102px);
          box-shadow: inset 0 2px rgba(255, 255, 255, 0.2),
            inset 0 -5px 5px rgba(0, 0, 0, 0.2), 0 -1px 4px rgba(0, 0, 0, 0.9);
        }

        /* FOREST - Dense dark forest with moonlight */
        .background-wall.forest {
          background:
            /* Moonlight rays */
            radial-gradient(ellipse at 50% 15%, rgba(180, 200, 220, 0.08) 0%, transparent 35%),
            radial-gradient(ellipse at 30% 20%, rgba(60, 80, 70, 0.15) 0%, transparent 40%),
            radial-gradient(ellipse at 70% 25%, rgba(50, 70, 60, 0.12) 0%, transparent 45%),
            /* Fog layers */
            linear-gradient(90deg, transparent 0%, rgba(40, 60, 50, 0.15) 20%, transparent 40%, rgba(50, 70, 60, 0.12) 60%, transparent 80%),
            /* Base gradient */
            linear-gradient(180deg, #1a3a2e 0%, #143228 20%, #0f2a22 50%, #0a1f1a 100%);
          box-shadow:
            inset 0 0 250px rgba(0, 0, 0, 0.7),
            inset 0 100px 150px rgba(0, 0, 0, 0.5);
        }

        .background-wall.forest::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            /* Tree trunks - more detailed */
            radial-gradient(ellipse at 18% 35%, rgba(20, 30, 20, 0.95) 1%, rgba(15, 25, 15, 0.7) 2%, transparent 3.5%),
            radial-gradient(ellipse at 25% 30%, rgba(25, 35, 25, 0.9) 1.5%, rgba(20, 30, 20, 0.6) 2.5%, transparent 4%),
            radial-gradient(ellipse at 42% 28%, rgba(18, 28, 18, 0.9) 1.2%, rgba(15, 25, 15, 0.65) 2%, transparent 3.2%),
            radial-gradient(ellipse at 58% 32%, rgba(22, 32, 22, 0.85) 1.3%, rgba(18, 28, 18, 0.6) 2.2%, transparent 3.8%),
            radial-gradient(ellipse at 72% 26%, rgba(20, 30, 20, 0.9) 1.4%, rgba(16, 26, 16, 0.65) 2.3%, transparent 3.5%),
            radial-gradient(ellipse at 85% 30%, rgba(25, 35, 25, 0.88) 1.1%, rgba(20, 30, 20, 0.6) 2%, transparent 3.3%),
            /* Mid-ground trees */
            radial-gradient(ellipse at 12% 45%, rgba(25, 40, 30, 0.75) 2%, rgba(20, 35, 25, 0.5) 3.5%, transparent 5%),
            radial-gradient(ellipse at 35% 48%, rgba(22, 38, 28, 0.8) 2.5%, rgba(18, 32, 24, 0.52) 4%, transparent 6%),
            radial-gradient(ellipse at 62% 42%, rgba(28, 42, 32, 0.7) 2.2%, rgba(22, 36, 26, 0.48) 3.8%, transparent 5.5%),
            radial-gradient(ellipse at 88% 46%, rgba(24, 39, 29, 0.78) 2.4%, rgba(20, 34, 25, 0.5) 3.9%, transparent 5.8%),
            /* Branches and foliage */
            radial-gradient(circle at 30% 18%, rgba(35, 55, 40, 0.6) 3%, transparent 6%),
            radial-gradient(circle at 50% 22%, rgba(30, 50, 35, 0.55) 3.5%, transparent 7%),
            radial-gradient(circle at 75% 20%, rgba(32, 52, 37, 0.58) 4%, transparent 7.5%);
          background-size: 100% 100%;
          opacity: 0.85;
        }

        .background-wall.forest::after {
          content: "";
          position: absolute;
          top: 15%;
          left: 50%;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(220, 230, 240, 0.15) 0%, rgba(180, 200, 220, 0.08) 40%, transparent 70%);
          box-shadow: 0 0 60px rgba(220, 230, 240, 0.12);
          opacity: 0.6;
        }

        /* LAKE NIGHT - Starry night with moon reflection */
        .background-wall.lake-night {
          background:
            /* Stars - scattered across the sky */
            radial-gradient(circle at 15% 12%, rgba(255, 255, 255, 0.9) 0.08%, transparent 0.15%),
            radial-gradient(circle at 28% 8%, rgba(255, 255, 255, 0.8) 0.06%, transparent 0.12%),
            radial-gradient(circle at 42% 15%, rgba(255, 255, 255, 0.85) 0.07%, transparent 0.14%),
            radial-gradient(circle at 58% 10%, rgba(255, 255, 255, 0.75) 0.05%, transparent 0.1%),
            radial-gradient(circle at 72% 14%, rgba(255, 255, 255, 0.9) 0.09%, transparent 0.16%),
            radial-gradient(circle at 85% 9%, rgba(255, 255, 255, 0.7) 0.06%, transparent 0.11%),
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.65) 0.05%, transparent 0.09%),
            radial-gradient(circle at 35% 22%, rgba(255, 255, 255, 0.8) 0.07%, transparent 0.13%),
            radial-gradient(circle at 65% 18%, rgba(255, 255, 255, 0.75) 0.06%, transparent 0.12%),
            radial-gradient(circle at 78% 25%, rgba(255, 255, 255, 0.7) 0.05%, transparent 0.1%),
            radial-gradient(circle at 90% 20%, rgba(255, 255, 255, 0.85) 0.08%, transparent 0.14%),
            /* Moon glow */
            radial-gradient(ellipse at 62% 8%, rgba(150, 170, 200, 0.15) 0%, transparent 25%),
            radial-gradient(ellipse at 62% 8%, rgba(120, 145, 180, 0.12) 0%, transparent 35%),
            /* Atmospheric layers */
            linear-gradient(180deg,
              #0c1a30 0%,
              #12233e 15%,
              #162845 30%,
              #0f1f38 50%,
              #0b1628 70%,
              #08090d 100%
            );
          box-shadow:
            inset 0 150px 200px rgba(0, 0, 0, 0.6),
            inset 0 0 300px rgba(8, 12, 28, 0.5);
        }

        .background-wall.lake-night::before {
          content: "";
          position: absolute;
          top: 8%;
          left: 62%;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 35% 35%, rgba(255, 255, 245, 0.95) 0%, rgba(240, 240, 230, 0.85) 30%, rgba(220, 225, 235, 0.7) 50%, rgba(200, 210, 225, 0.4) 70%, transparent 100%);
          box-shadow:
            0 0 50px rgba(240, 240, 230, 0.6),
            0 0 100px rgba(220, 225, 235, 0.4),
            inset -8px -8px 20px rgba(180, 190, 210, 0.3);
        }

        .background-wall.lake-night::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            /* Twinkling stars */
            radial-gradient(circle at 25% 30%, rgba(255, 255, 255, 0.6) 0.04%, transparent 0.08%),
            radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.7) 0.05%, transparent 0.1%),
            radial-gradient(circle at 75% 28%, rgba(255, 255, 255, 0.5) 0.03%, transparent 0.07%),
            radial-gradient(circle at 12% 40%, rgba(255, 255, 255, 0.65) 0.04%, transparent 0.09%),
            radial-gradient(circle at 88% 38%, rgba(255, 255, 255, 0.6) 0.05%, transparent 0.08%);
          animation: twinkle 4s ease-in-out infinite;
          opacity: 0.8;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        /* ROOFTOP - Simple night city view */
        .background-wall.rooftop {
          background:
            radial-gradient(ellipse at 50% 100%, rgba(255, 180, 80, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f1420 100%);
          box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.5);
        }

        .background-wall.rooftop::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 35%;
          background:
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 25px,
              rgba(255, 200, 100, 0.3) 25px,
              rgba(255, 200, 100, 0.3) 26px,
              transparent 26px,
              transparent 50px
            );
        }

        .background-wall.rooftop::after {
          content: "";
          position: absolute;
          bottom: 20%;
          left: 0;
          right: 0;
          height: 18%;
          background:
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 18px,
              rgba(255, 220, 120, 0.4) 18px,
              rgba(255, 220, 120, 0.4) 19px,
              transparent 19px,
              transparent 35px
            );
          box-shadow: 0 -20px 40px rgba(255, 180, 80, 0.1);
        }

        /* TV DUMP - Detailed junkyard with old TVs */
        .background-wall.tv-dump {
          background:
            /* Rust spots */
            radial-gradient(ellipse at 15% 20%, rgba(120, 60, 30, 0.15) 0%, transparent 8%),
            radial-gradient(ellipse at 75% 35%, rgba(110, 55, 25, 0.12) 0%, transparent 6%),
            radial-gradient(ellipse at 40% 65%, rgba(130, 65, 35, 0.14) 0%, transparent 7%),
            linear-gradient(135deg,
              #2a2520 0%,
              #221f1a 25%,
              #1a1510 60%,
              #120f0a 85%,
              #0a0805 100%
            );
          box-shadow:
            inset 0 0 250px rgba(0, 0, 0, 0.8),
            inset 30px 30px 100px rgba(0, 0, 0, 0.5);
        }

        .background-wall.tv-dump::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            /* Old TV sets shapes */
            radial-gradient(ellipse at 18% 28%, rgba(65, 60, 55, 0.45) 3%, rgba(50, 45, 40, 0.25) 5%, transparent 8%),
            radial-gradient(rect at 25% 35%, rgba(55, 50, 45, 0.5) 2.5%, rgba(45, 40, 35, 0.3) 4.5%, transparent 7%),
            radial-gradient(ellipse at 42% 25%, rgba(60, 55, 50, 0.4) 3.5%, rgba(48, 43, 38, 0.22) 5.5%, transparent 9%),
            radial-gradient(ellipse at 68% 38%, rgba(70, 65, 60, 0.48) 4%, rgba(55, 50, 45, 0.28) 6%, transparent 10%),
            radial-gradient(ellipse at 32% 58%, rgba(62, 57, 52, 0.42) 3.8%, rgba(50, 45, 40, 0.24) 5.8%, transparent 9.5%),
            radial-gradient(ellipse at 58% 68%, rgba(58, 53, 48, 0.46) 3.2%, rgba(46, 41, 36, 0.26) 5.2%, transparent 8.5%),
            radial-gradient(ellipse at 78% 62%, rgba(64, 59, 54, 0.44) 2.8%, rgba(52, 47, 42, 0.25) 4.8%, transparent 7.8%),
            radial-gradient(ellipse at 88% 30%, rgba(56, 51, 46, 0.38) 3%, rgba(44, 39, 34, 0.2) 5%, transparent 8%),
            /* Debris and metal scraps */
            radial-gradient(circle at 12% 45%, rgba(80, 75, 70, 0.25) 1%, transparent 2.5%),
            radial-gradient(circle at 48% 52%, rgba(75, 70, 65, 0.3) 1.2%, transparent 2.8%),
            radial-gradient(circle at 72% 55%, rgba(78, 73, 68, 0.28) 0.8%, transparent 2.2%);
          opacity: 0.75;
        }

        .background-wall.tv-dump::after {
          content: "";
          position: absolute;
          top: 30%;
          left: 22%;
          width: 100px;
          height: 75px;
          background:
            linear-gradient(135deg, rgba(40, 35, 30, 0.6) 0%, rgba(25, 20, 15, 0.4) 100%);
          border: 2px solid rgba(60, 55, 50, 0.3);
          border-radius: 8px;
          box-shadow:
            inset 5px 5px 15px rgba(0, 0, 0, 0.5),
            3px 3px 10px rgba(0, 0, 0, 0.6);
          transform: rotate(-12deg);
          opacity: 0.4;
        }

        /* DESERT - Hot desert with sand dunes */
        .background-wall.desert {
          background:
            /* Heat haze effect */
            radial-gradient(ellipse at 50% 40%, rgba(255, 220, 180, 0.08) 0%, transparent 40%),
            /* Sand dunes - layers */
            radial-gradient(ellipse at 20% 85%, rgba(200, 160, 110, 0.35) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 90%, rgba(190, 150, 100, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 88%, rgba(210, 170, 120, 0.32) 0%, transparent 48%),
            /* Horizon heat shimmer */
            radial-gradient(ellipse at 50% 100%, rgba(139, 90, 43, 0.35) 0%, transparent 55%),
            /* Sky to sand gradient */
            linear-gradient(180deg,
              #e8c896 0%,
              #dcb882 15%,
              #d4a574 30%,
              #c9994d 50%,
              #b8885a 65%,
              #a67c52 80%,
              #8b6f47 100%
            );
          box-shadow:
            inset 0 0 180px rgba(139, 90, 43, 0.4),
            inset 0 100px 120px rgba(255, 200, 120, 0.15);
        }

        .background-wall.desert::before {
          content: "";
          position: absolute;
          top: 12%;
          right: 28%;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 40% 40%,
              rgba(255, 230, 140, 0.95) 0%,
              rgba(255, 210, 120, 0.85) 25%,
              rgba(255, 190, 100, 0.75) 45%,
              rgba(255, 170, 80, 0.6) 65%,
              rgba(255, 150, 60, 0.4) 80%,
              transparent 100%
            );
          box-shadow:
            0 0 70px rgba(255, 210, 120, 0.5),
            0 0 130px rgba(255, 190, 100, 0.3),
            inset -15px -15px 30px rgba(255, 150, 60, 0.3);
        }

        .background-wall.desert::after {
          content: "";
          position: absolute;
          bottom: 28%;
          right: 18%;
          width: 80px;
          height: 140px;
          background:
            linear-gradient(180deg, transparent 0%, rgba(80, 100, 60, 0.5) 15%, rgba(70, 90, 50, 0.6) 40%, rgba(60, 80, 45, 0.55) 100%);
          clip-path: polygon(50% 0%, 55% 20%, 65% 25%, 60% 45%, 70% 50%, 65% 75%, 55% 80%, 50% 100%, 45% 80%, 35% 75%, 30% 50%, 40% 45%, 35% 25%, 45% 20%);
          filter: drop-shadow(3px 3px 8px rgba(0, 0, 0, 0.4));
          opacity: 0.6;
        }

        /* CITY ALLEY - Dark alley with neon lights and atmospheric glow */
        .background-wall.city-alley {
          background:
            /* Ambient neon glow from signs */
            radial-gradient(ellipse at 88% 20%, rgba(80, 140, 200, 0.12) 0%, transparent 35%),
            radial-gradient(ellipse at 12% 30%, rgba(200, 60, 90, 0.1) 0%, transparent 30%),
            radial-gradient(ellipse at 50% 60%, rgba(120, 80, 180, 0.08) 0%, transparent 40%),
            /* Subtle depth layers */
            linear-gradient(90deg,
              rgba(10, 10, 15, 0.95) 0%,
              rgba(15, 15, 20, 0.8) 10%,
              transparent 30%,
              transparent 70%,
              rgba(15, 15, 20, 0.8) 90%,
              rgba(10, 10, 15, 0.95) 100%
            ),
            /* Main atmospheric gradient */
            linear-gradient(180deg,
              #1a1a28 0%,
              #18182a 25%,
              #14141f 50%,
              #101018 75%,
              #0c0c12 100%
            );
          box-shadow:
            inset 60px 0 120px rgba(0, 0, 0, 0.9),
            inset -60px 0 120px rgba(0, 0, 0, 0.9),
            inset 0 0 200px rgba(0, 0, 0, 0.7),
            inset 0 80px 100px rgba(0, 0, 0, 0.5);
        }

        .background-wall.city-alley::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            /* Blue neon sign - right side */
            radial-gradient(ellipse at 88% 18%, rgba(120, 200, 255, 0.4) 0%, transparent 8%),
            linear-gradient(180deg,
              transparent 0%,
              transparent 15%,
              rgba(100, 180, 255, 0.35) 18%,
              rgba(100, 180, 255, 0.35) 22%,
              transparent 25%,
              transparent 100%
            ),
            /* Red/pink neon - left side */
            radial-gradient(ellipse at 12% 28%, rgba(255, 100, 120, 0.35) 0%, transparent 7%),
            linear-gradient(180deg,
              transparent 0%,
              transparent 25%,
              rgba(255, 80, 110, 0.3) 28%,
              rgba(255, 80, 110, 0.3) 35%,
              transparent 38%,
              transparent 100%
            ),
            /* Purple neon glow - middle distance */
            radial-gradient(ellipse at 50% 45%, rgba(180, 100, 255, 0.15) 0%, transparent 15%),
            /* Green neon - far left */
            radial-gradient(ellipse at 8% 52%, rgba(100, 255, 150, 0.25) 0%, transparent 5%);
          background-size: 100% 100%;
        }

        .background-wall.city-alley::after {
          content: "NEON";
          position: absolute;
          top: 22%;
          right: 8%;
          font-family: 'Impact', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: rgba(120, 200, 255, 0.7);
          text-shadow:
            0 0 10px rgba(120, 200, 255, 0.9),
            0 0 20px rgba(100, 180, 255, 0.6),
            0 0 30px rgba(80, 160, 255, 0.4),
            2px 2px 4px rgba(0, 0, 0, 0.8);
          letter-spacing: 3px;
          transform: rotate(-3deg);
          opacity: 0.85;
          animation: neonFlicker 5s ease-in-out infinite;
        }

        @keyframes neonFlicker {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 0.95; }
          75% { opacity: 0.75; }
        }

        /* PHOTO BACKGROUNDS - Using reliable image URLs */

        /* MOUNTAIN VIEW - Scenic mountain landscape */
        .background-wall.mountain-view {
          background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.3) 100%),
            url('https://picsum.photos/id/1036/1920/1080') center center / cover no-repeat;
        }

        /* OCEAN SUNSET - Peaceful ocean view */
        .background-wall.ocean-sunset {
          background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.25) 100%),
            url('https://picsum.photos/id/1015/1920/1080') center center / cover no-repeat;
        }

        /* CITY SKYLINE - Modern urban view */
        .background-wall.city-skyline {
          background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.35) 100%),
            url('https://picsum.photos/id/1034/1920/1080') center center / cover no-repeat;
        }

        /* SPACE STARS - Starry night sky */
        .background-wall.space-stars {
          background:
            radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.015) 0%, transparent 40%),
            radial-gradient(ellipse at 70% 60%, rgba(255, 255, 255, 0.02) 0%, transparent 35%),
            url('https://picsum.photos/id/1025/1920/1080') center center / cover no-repeat,
            linear-gradient(180deg, #0a0a12 0%, #050508 100%);
        }

        .background-floor {
          position: absolute;
          width: 100%;
          height: 140px;
          bottom: 0;
          left: 0;
          perspective: 300px;
          overflow: hidden;
          z-index: 50;
          transition: opacity 0.5s ease;
        }

        /* LOFT - Wood floor */
        .background-floor.loft::before {
          position: absolute;
          content: " ";
          top: -100%;
          left: -25%;
          width: 150%;
          height: 250%;
          background:
            repeating-linear-gradient(
              90deg,
              #5a3d2e 0px,
              #5a3d2e 120px,
              #4a2d1e 120px,
              #4a2d1e 122px
            ),
            linear-gradient(180deg, #6a4d3e 0%, #4a2d1e 100%);
          background-size: 100% 100%;
          transform: rotateX(60deg);
          box-shadow: inset 0 -50px 100px rgba(0, 0, 0, 0.5);
        }

        /* FOREST - Grass/dirt floor */
        .background-floor.forest::before {
          position: absolute;
          content: " ";
          top: -100%;
          left: -25%;
          width: 150%;
          height: 250%;
          background:
            repeating-linear-gradient(
              90deg,
              #2a4a2a 0px,
              #2a4a2a 100px,
              #1a3a1a 100px,
              #1a3a1a 102px
            ),
            linear-gradient(180deg, #3a5a3a 0%, #1a2a1a 100%);
          background-size: 100% 100%;
          transform: rotateX(60deg);
          box-shadow: inset 0 -50px 100px rgba(0, 0, 0, 0.7);
        }

        /* LAKE NIGHT - Water reflection */
        .background-floor.lake-night::before {
          position: absolute;
          content: " ";
          top: -100%;
          left: -25%;
          width: 150%;
          height: 250%;
          background:
            repeating-linear-gradient(
              90deg,
              rgba(10, 20, 35, 0.8) 0px,
              rgba(10, 20, 35, 0.8) 80px,
              rgba(15, 25, 40, 0.9) 80px,
              rgba(15, 25, 40, 0.9) 82px
            ),
            linear-gradient(180deg, rgba(20, 30, 45, 0.6) 0%, rgba(5, 10, 15, 0.9) 100%);
          background-size: 100% 100%;
          transform: rotateX(60deg);
          box-shadow: inset 0 -50px 100px rgba(0, 0, 0, 0.8);
          opacity: 0.7;
        }

        /* ROOFTOP - Concrete */
        .background-floor.rooftop::before {
          position: absolute;
          content: " ";
          top: -100%;
          left: -25%;
          width: 150%;
          height: 250%;
          background:
            repeating-linear-gradient(
              90deg,
              #3a3a4a 0px,
              #3a3a4a 150px,
              #2a2a3a 150px,
              #2a2a3a 152px
            ),
            linear-gradient(180deg, #4a4a5a 0%, #2a2a3a 100%);
          background-size: 100% 100%;
          transform: rotateX(60deg);
          box-shadow: inset 0 -50px 100px rgba(0, 0, 0, 0.6);
        }

        /* TV DUMP - Junk/dirt */
        .background-floor.tv-dump::before {
          position: absolute;
          content: " ";
          top: -100%;
          left: -25%;
          width: 150%;
          height: 250%;
          background:
            repeating-linear-gradient(
              90deg,
              #3a3530 0px,
              #3a3530 90px,
              #2a2520 90px,
              #2a2520 92px
            ),
            linear-gradient(180deg, #4a4035 0%, #2a2520 100%);
          background-size: 100% 100%;
          transform: rotateX(60deg);
          box-shadow: inset 0 -50px 100px rgba(0, 0, 0, 0.7);
        }

        /* DESERT - Sand */
        .background-floor.desert::before {
          position: absolute;
          content: " ";
          top: -100%;
          left: -25%;
          width: 150%;
          height: 250%;
          background:
            repeating-linear-gradient(
              90deg,
              #c9a86a 0px,
              #c9a86a 110px,
              #b9985a 110px,
              #b9985a 112px
            ),
            linear-gradient(180deg, #d9b87a 0%, #a9886a 100%);
          background-size: 100% 100%;
          transform: rotateX(60deg);
          box-shadow: inset 0 -50px 100px rgba(139, 90, 43, 0.4);
        }

        /* CITY ALLEY - Asphalt */
        .background-floor.city-alley::before {
          position: absolute;
          content: " ";
          top: -100%;
          left: -25%;
          width: 150%;
          height: 250%;
          background:
            repeating-linear-gradient(
              90deg,
              #2a2a30 0px,
              #2a2a30 200px,
              #1a1a20 200px,
              #1a1a20 202px
            ),
            linear-gradient(180deg, #3a3a40 0%, #1a1a20 100%);
          background-size: 100% 100%;
          transform: rotateX(60deg);
          box-shadow: inset 0 -50px 100px rgba(0, 0, 0, 0.8);
        }

        /* PHOTO BACKGROUNDS - Neutral wood floor for all photo modes */
        .background-floor.mountain-view::before,
        .background-floor.ocean-sunset::before,
        .background-floor.city-skyline::before,
        .background-floor.space-stars::before {
          position: absolute;
          content: " ";
          top: -100%;
          left: -25%;
          width: 150%;
          height: 250%;
          background:
            repeating-linear-gradient(
              90deg,
              #5a4d3e 0px,
              #5a4d3e 130px,
              #4a3d2e 130px,
              #4a3d2e 132px
            ),
            linear-gradient(180deg, #6a5d4e 0%, #3a2d1e 100%);
          background-size: 100% 100%;
          transform: rotateX(60deg);
          box-shadow: inset 0 -50px 100px rgba(0, 0, 0, 0.6);
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
          height: 300px;
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

        .brick-wall {
          transition: opacity 0.5s ease;
        }

        .closeup-mode ~ .brick-wall {
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
