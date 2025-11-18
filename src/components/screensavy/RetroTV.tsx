'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface RetroTVProps {
  videoId?: string;
  onVideoIdChange?: (id: string) => void;
}

export default function RetroTV({ videoId, onVideoIdChange }: RetroTVProps) {
  const [inputValue, setInputValue] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState(videoId || '');
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const playerRef = useRef<any>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  // Extract video ID from YouTube URL
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

  // Handle video ID submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractVideoId(inputValue);
    if (videoId) {
      setCurrentVideoId(videoId);
      onVideoIdChange?.(videoId);
    }
  }, [inputValue, extractVideoId, onVideoIdChange]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if API is already loaded
    if ((window as any).YT && (window as any).YT.Player) {
      return;
    }

    // Load the IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  // Initialize YouTube player when video ID changes
  useEffect(() => {
    if (!currentVideoId || typeof window === 'undefined') return;

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.loadVideoById(currentVideoId);
        return;
      }

      if ((window as any).YT && (window as any).YT.Player) {
        playerRef.current = new (window as any).YT.Player('youtube-player', {
          videoId: currentVideoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
          },
        });
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }
  }, [currentVideoId]);

  return (
    <div className="retro-tv-container">
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

      <div className={`old-tv ${!isPoweredOn ? 'powered-off' : ''}`}>
        {/* TV Antenna */}
        <div className="antenna">
          <div className="antenna-left" />
          <div className="antenna-right" />
        </div>

        {/* TV Screen */}
        <main className="tv-screen" ref={iframeContainerRef}>
          <div className="screen-content">
            {currentVideoId ? (
              <div id="youtube-player" className="youtube-container" />
            ) : (
              <div className="no-video-message">
                <i className="material-symbols-outlined">tv</i>
                <p>Вставьте ссылку на YouTube видео выше</p>
              </div>
            )}
          </div>
          <div className="scanlines" />
          <div className="screen-noise" />
        </main>

        {/* TV Body */}
        <div className="tv-body">
          {/* Speaker */}
          <div className="speaker">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="speaker-line" />
            ))}
          </div>

          {/* Controls */}
          <div className="tv-controls">
            <button
              className="power-button"
              onClick={() => setIsPoweredOn(!isPoweredOn)}
              title={isPoweredOn ? 'Выключить' : 'Включить'}
            >
              <i className="material-symbols-outlined">
                {isPoweredOn ? 'power_settings_new' : 'power_off'}
              </i>
            </button>
          </div>
        </div>

        {/* TV Brand */}
        <div className="tv-brand">ScreenSavy</div>
      </div>

      <style jsx>{`
        .retro-tv-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          padding: 40px 20px;
          perspective: 1000px;
        }

        .tv-input-panel {
          margin-bottom: 40px;
          z-index: 100;
        }

        .tv-url-form {
          display: flex;
          gap: 10px;
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .tv-url-input {
          flex: 1;
          min-width: 400px;
          padding: 12px 20px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.3);
          color: white;
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
        }

        .tv-url-input:focus {
          border-color: #4a9eff;
          box-shadow: 0 0 20px rgba(74, 158, 255, 0.3);
        }

        .tv-url-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .tv-url-submit {
          padding: 12px 24px;
          background: #4a9eff;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .tv-url-submit:hover {
          background: #357abd;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(74, 158, 255, 0.4);
        }

        .old-tv {
          position: relative;
          width: 800px;
          height: 600px;
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          border-radius: 40px 40px 20px 20px;
          padding: 40px;
          box-shadow:
            0 50px 100px rgba(0, 0, 0, 0.5),
            inset 0 2px 4px rgba(255, 255, 255, 0.1),
            inset 0 -2px 4px rgba(0, 0, 0, 0.5);
          transform: rotateX(2deg);
          transition: all 0.3s ease;
        }

        .old-tv:hover {
          transform: rotateX(0deg) scale(1.02);
        }

        .old-tv.powered-off .tv-screen {
          background: #0a0a0a;
        }

        .old-tv.powered-off .screen-content,
        .old-tv.powered-off .scanlines {
          opacity: 0;
        }

        .old-tv.powered-off .screen-noise {
          opacity: 0.05;
        }

        .antenna {
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 60px;
        }

        .antenna-left,
        .antenna-right {
          position: absolute;
          width: 3px;
          height: 50px;
          background: linear-gradient(to bottom, #666, #333);
          border-radius: 2px;
        }

        .antenna-left {
          left: 20px;
          transform: rotate(-25deg);
          transform-origin: bottom;
        }

        .antenna-right {
          right: 20px;
          transform: rotate(25deg);
          transform-origin: bottom;
        }

        .tv-screen {
          position: relative;
          width: 100%;
          height: 400px;
          background: #000;
          border-radius: 15px;
          overflow: hidden;
          box-shadow:
            inset 0 0 50px rgba(0, 0, 0, 0.8),
            inset 0 0 100px rgba(0, 100, 200, 0.1);
        }

        .screen-content {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .youtube-container {
          width: 100%;
          height: 100%;
        }

        .youtube-container :global(iframe) {
          width: 100%;
          height: 100%;
          border: none;
        }

        .no-video-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #4a9eff;
          text-align: center;
        }

        .no-video-message i {
          font-size: 80px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .no-video-message p {
          font-size: 18px;
          opacity: 0.7;
        }

        .scanlines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 2;
          animation: scanline 8s linear infinite;
        }

        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }

        .screen-noise {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEUAAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///9qiQlgAAAAG3RSTlMABQ4VGh0eKSssLi8xMjU4Pj9AQ0RFS0xPUFJTfWHBLAAAAHBJREFUeNrtz7kNgAAMBMG1xE0x5F8qIKCPgOyVwc7M7AAA+BfPhfQwLr5JqiWXmTVVGsszFaorVVpFV0hOW0hrMzNUq4naaTGzU9RJsxmqFXWizsxQp6gT9WaF6kV1UaTqRVWd/m7lnfy0AfADL+YKIcI7K+kAAAAASUVORK5CYII=");
          opacity: 0.03;
          pointer-events: none;
          z-index: 3;
          animation: noise 0.2s infinite;
        }

        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }

        .tv-body {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .speaker {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 4px;
          padding: 10px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          width: 300px;
        }

        .speaker-line {
          width: 100%;
          height: 20px;
          background: linear-gradient(90deg, #333, #222);
          border-radius: 2px;
        }

        .tv-controls {
          display: flex;
          gap: 15px;
        }

        .power-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid #333;
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          color: #4a9eff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow:
            0 4px 8px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.1);
        }

        .power-button:hover {
          background: linear-gradient(145deg, #333, #222);
          box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.1),
            0 0 20px rgba(74, 158, 255, 0.3);
        }

        .power-button:active {
          transform: scale(0.95);
        }

        .tv-brand {
          position: absolute;
          bottom: 15px;
          right: 30px;
          color: #666;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        @media (max-width: 900px) {
          .old-tv {
            width: 90vw;
            height: auto;
            aspect-ratio: 4/3;
          }

          .tv-url-input {
            min-width: 250px;
          }

          .tv-url-form {
            flex-direction: column;
          }

          .speaker {
            width: 200px;
          }
        }
      `}</style>
    </div>
  );
}
