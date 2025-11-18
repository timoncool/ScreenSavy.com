"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface YouTubePlayerWithEffectsProps {
  effect: string;
  activeLanguage?: string;
}

const YouTubePlayerWithEffects = ({ effect, activeLanguage = 'en' }: YouTubePlayerWithEffectsProps) => {
  const playerRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(true);
  const [currentVideoId, setCurrentVideoId] = useState('jfKfPfyJRdk'); // default lofi

  const getVideoId = useCallback((url: string): string | null => {
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
    const videoId = getVideoId(inputValue);
    if (videoId) {
      setCurrentVideoId(videoId);
      if (playerRef.current && playerRef.current.loadVideoById) {
        playerRef.current.loadVideoById(videoId);
      }
    }
  }, [inputValue, getVideoId]);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      // @ts-ignore
      playerRef.current = new window.YT.Player('youtube-effects-player', {
        videoId: currentVideoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          loop: 1,
          playlist: currentVideoId,
        },
      });
    };

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [currentVideoId]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* YouTube Player */}
      <div
        id="youtube-effects-player"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
        }}
      />

      {/* URL Input Panel */}
      {showUrlInput && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1100,
          pointerEvents: 'auto',
        }}>
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '10px 14px',
            borderRadius: '8px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={activeLanguage === 'ru' ? 'YouTube URL...' : 'YouTube URL...'}
              style={{
                minWidth: '300px',
                padding: '8px 12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.target.style.background = 'rgba(255, 255, 255, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
            />
            <button type="submit" style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'rgba(255, 255, 255, 0.9)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}>
              <i className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '4px' }}>play_arrow</i>
              Play
            </button>
          </form>
        </div>
      )}

      {/* Effects Overlay */}
      <div
        className={`video-effect-overlay effect-${effect}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      <style jsx>{`
        /* VHS Effect - Усиленный */
        .effect-vhs {
          background:
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.15),
              rgba(0, 0, 0, 0.15) 1px,
              transparent 1px,
              transparent 2px
            );
          animation: vhsFlicker 0.1s infinite, vhsDistort 0.3s infinite;
          filter: saturate(0.8) contrast(1.2) brightness(0.9);
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
            rgba(255, 0, 0, 0.1) 0%,
            rgba(0, 255, 0, 0.1) 50%,
            rgba(0, 0, 255, 0.1) 100%
          );
          mix-blend-mode: overlay;
          animation: vhsShift 2s infinite;
        }

        @keyframes vhsFlicker {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }

        @keyframes vhsDistort {
          0%, 100% { transform: translateX(0) scaleX(1); }
          33% { transform: translateX(-2px) scaleX(1.01); }
          66% { transform: translateX(2px) scaleX(0.99); }
        }

        @keyframes vhsShift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }

        /* CRT Effect - Усиленный */
        .effect-crt {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.2),
            rgba(0, 0, 0, 0.2) 2px,
            transparent 2px,
            transparent 4px
          );
          animation: crtScan 6s linear infinite;
          filter: contrast(1.3) brightness(1.1);
        }

        .effect-crt::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            ellipse at center,
            transparent 40%,
            rgba(0, 0, 0, 0.6) 100%
          );
          border-radius: 10% / 5%;
        }

        .effect-crt::after {
          content: '';
          position: absolute;
          top: -50%;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 255, 255, 0.1)
          );
          animation: crtScanline 8s linear infinite;
        }

        @keyframes crtScan {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }

        @keyframes crtScanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(300vh); }
        }

        /* Glitch Effect - Усиленный */
        .effect-glitch {
          animation: glitchAnim 0.2s infinite;
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
          animation: glitchRGB 0.3s infinite;
        }

        @keyframes glitchAnim {
          0%, 100% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          10% {
            transform: translate(-5px, 5px) skew(2deg);
            filter: hue-rotate(90deg);
          }
          20% {
            transform: translate(5px, -5px) skew(-2deg);
            filter: hue-rotate(-90deg);
          }
          30% { transform: translate(-5px, -5px); }
          40% { transform: translate(5px, 5px); }
          50% {
            transform: translate(0, 0) scaleX(1.05);
            filter: invert(0.1);
          }
          60% { transform: translate(-3px, 3px); }
          70% { transform: translate(3px, -3px); }
          80% { transform: translate(0) scaleY(1.05); }
        }

        @keyframes glitchRGB {
          0%, 100% {
            opacity: 0;
          }
          25% {
            opacity: 0.3;
            filter:
              drop-shadow(3px 0 0 red)
              drop-shadow(-3px 0 0 cyan);
          }
          50% {
            opacity: 0.5;
            filter:
              drop-shadow(-2px 0 0 red)
              drop-shadow(2px 0 0 cyan);
          }
          75% {
            opacity: 0.3;
            filter:
              drop-shadow(4px 0 0 red)
              drop-shadow(-4px 0 0 cyan);
          }
        }

        /* Vintage Effect - Усиленный */
        .effect-vintage {
          filter: sepia(0.6) contrast(1.1) brightness(0.95);
        }

        .effect-vintage::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.1) 2px,
              rgba(0, 0, 0, 0.1) 3px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.1) 2px,
              rgba(0, 0, 0, 0.1) 3px
            );
          mix-blend-mode: overlay;
          opacity: 0.3;
        }

        .effect-vintage::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(
              circle at 20% 30%,
              rgba(139, 69, 19, 0.3) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 70%,
              rgba(101, 67, 33, 0.3) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at center,
              transparent 30%,
              rgba(101, 67, 33, 0.4) 100%
            );
          animation: vintagePulse 4s ease-in-out infinite;
        }

        @keyframes vintagePulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        /* Film Noir Effect - Усиленный */
        .effect-noir {
          filter: grayscale(1) contrast(1.8) brightness(0.7);
        }

        .effect-noir::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.2) 1px,
              rgba(0, 0, 0, 0.2) 2px
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
            transparent 20%,
            rgba(0, 0, 0, 0.8) 100%
          );
          box-shadow:
            inset 0 0 200px rgba(0, 0, 0, 0.9),
            inset 0 0 100px rgba(0, 0, 0, 0.6);
        }

        /* Neon Effect - Усиленный */
        .effect-neon {
          filter: saturate(3) contrast(1.8) brightness(1.3) hue-rotate(10deg);
          animation: neonPulse 1.5s ease-in-out infinite;
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
              rgba(255, 0, 255, 0.2) 0%,
              rgba(0, 255, 255, 0.2) 100%
            );
          mix-blend-mode: screen;
          animation: neonGlow 2s ease-in-out infinite;
        }

        @keyframes neonPulse {
          0%, 100% {
            opacity: 1;
            filter: saturate(3) contrast(1.8) brightness(1.3) hue-rotate(10deg);
          }
          50% {
            opacity: 0.8;
            filter: saturate(3.5) contrast(2) brightness(1.5) hue-rotate(20deg);
          }
        }

        @keyframes neonGlow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }

        /* Chromatic Aberration - Усиленный */
        .effect-chromatic {
          position: relative;
        }

        .effect-chromatic::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          mix-blend-mode: screen;
          filter:
            drop-shadow(5px 0 0 rgba(255, 0, 0, 0.8))
            drop-shadow(-5px 0 0 rgba(0, 255, 255, 0.8));
          animation: chromaticShift 2s ease-in-out infinite;
        }

        @keyframes chromaticShift {
          0%, 100% {
            filter:
              drop-shadow(5px 0 0 rgba(255, 0, 0, 0.8))
              drop-shadow(-5px 0 0 rgba(0, 255, 255, 0.8));
          }
          25% {
            filter:
              drop-shadow(7px 2px 0 rgba(255, 0, 0, 0.9))
              drop-shadow(-7px -2px 0 rgba(0, 255, 255, 0.9));
          }
          50% {
            filter:
              drop-shadow(3px -2px 0 rgba(255, 0, 0, 0.7))
              drop-shadow(-3px 2px 0 rgba(0, 255, 255, 0.7));
          }
          75% {
            filter:
              drop-shadow(8px 0 0 rgba(255, 0, 0, 0.9))
              drop-shadow(-8px 0 0 rgba(0, 255, 255, 0.9));
          }
        }

        .effect-none {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default YouTubePlayerWithEffects;
