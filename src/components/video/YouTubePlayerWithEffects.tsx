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
        /* VHS Effect - ЭКСТРЕМАЛЬНО УСИЛЕННЫЙ */
        .effect-vhs {
          background:
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.35),
              rgba(0, 0, 0, 0.35) 1px,
              transparent 1px,
              transparent 2px
            );
          animation: vhsFlicker 0.08s infinite, vhsDistort 0.2s infinite;
          filter: saturate(0.6) contrast(1.5) brightness(0.85) hue-rotate(-5deg);
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
            rgba(255, 0, 0, 0.25) 0%,
            rgba(0, 255, 0, 0.25) 50%,
            rgba(0, 0, 255, 0.25) 100%
          );
          mix-blend-mode: overlay;
          animation: vhsShift 1.5s infinite;
        }

        @keyframes vhsFlicker {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @keyframes vhsDistort {
          0%, 100% { transform: translateX(0) scaleX(1); }
          33% { transform: translateX(-5px) scaleX(1.03); }
          66% { transform: translateX(5px) scaleX(0.97); }
        }

        @keyframes vhsShift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }

        /* CRT Effect - ЭКСТРЕМАЛЬНО УСИЛЕННЫЙ */
        .effect-crt {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.4),
            rgba(0, 0, 0, 0.4) 2px,
            transparent 2px,
            transparent 4px
          );
          animation: crtScan 4s linear infinite;
          filter: contrast(1.6) brightness(1.2) saturate(1.2);
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
            transparent 30%,
            rgba(0, 0, 0, 0.8) 100%
          );
          border-radius: 15% / 8%;
          box-shadow: inset 0 0 100px rgba(0, 255, 100, 0.15);
        }

        .effect-crt::after {
          content: '';
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: crtScanline 5s linear infinite;
        }

        @keyframes crtScan {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }

        @keyframes crtScanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(400vh); }
        }

        /* Glitch Effect - ЭКСТРЕМАЛЬНО УСИЛЕННЫЙ */
        .effect-glitch {
          animation: glitchAnim 0.15s infinite;
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
          animation: glitchRGB 0.2s infinite;
        }

        @keyframes glitchAnim {
          0%, 100% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          10% {
            transform: translate(-12px, 8px) skew(5deg);
            filter: hue-rotate(180deg) saturate(3);
          }
          20% {
            transform: translate(10px, -10px) skew(-5deg);
            filter: hue-rotate(-180deg) invert(0.2);
          }
          30% {
            transform: translate(-8px, -8px) scaleY(1.1);
            filter: contrast(3);
          }
          40% {
            transform: translate(12px, 8px) scaleX(1.1);
            filter: brightness(2);
          }
          50% {
            transform: translate(0, 0) scale(1.08) rotate(1deg);
            filter: invert(0.3) hue-rotate(90deg);
          }
          60% {
            transform: translate(-10px, 6px) skew(3deg);
            filter: saturate(5);
          }
          70% {
            transform: translate(8px, -8px) skew(-3deg);
            filter: contrast(2);
          }
          80% {
            transform: translate(0) scaleY(1.12);
            filter: hue-rotate(-90deg);
          }
        }

        @keyframes glitchRGB {
          0%, 100% {
            opacity: 0.2;
          }
          25% {
            opacity: 0.6;
            filter:
              drop-shadow(8px 0 0 red)
              drop-shadow(-8px 0 0 cyan)
              drop-shadow(0 8px 0 lime);
          }
          50% {
            opacity: 0.8;
            filter:
              drop-shadow(-6px 0 0 red)
              drop-shadow(6px 0 0 cyan)
              drop-shadow(0 -6px 0 yellow);
          }
          75% {
            opacity: 0.6;
            filter:
              drop-shadow(10px 0 0 red)
              drop-shadow(-10px 0 0 cyan)
              drop-shadow(0 10px 0 magenta);
          }
        }

        /* Vintage Effect - ЭКСТРЕМАЛЬНО УСИЛЕННЫЙ */
        .effect-vintage {
          filter: sepia(0.9) contrast(1.4) brightness(0.85) saturate(0.7);
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
              transparent 1px,
              rgba(0, 0, 0, 0.25) 1px,
              rgba(0, 0, 0, 0.25) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.25) 1px,
              rgba(0, 0, 0, 0.25) 2px
            ),
            url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="3"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.4"/></svg>');
          mix-blend-mode: multiply;
          opacity: 0.6;
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
              rgba(139, 69, 19, 0.6) 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at 80% 70%,
              rgba(101, 67, 33, 0.6) 0%,
              transparent 40%
            ),
            radial-gradient(
              ellipse at center,
              transparent 20%,
              rgba(101, 67, 33, 0.7) 100%
            );
          animation: vintagePulse 3s ease-in-out infinite;
        }

        @keyframes vintagePulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }

        /* Film Noir Effect - ЭКСТРЕМАЛЬНО УСИЛЕННЫЙ */
        .effect-noir {
          filter: grayscale(1) contrast(2.5) brightness(0.5);
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
              rgba(0, 0, 0, 0.4) 1px,
              rgba(0, 0, 0, 0.4) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              rgba(255, 255, 255, 0.05) 50px,
              rgba(255, 255, 255, 0.05) 51px
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
            transparent 10%,
            rgba(0, 0, 0, 0.9) 100%
          );
          box-shadow:
            inset 0 0 300px rgba(0, 0, 0, 1),
            inset 0 0 150px rgba(0, 0, 0, 0.9),
            inset 0 0 50px rgba(0, 0, 0, 0.8);
        }

        /* Neon Effect - ЭКСТРЕМАЛЬНО УСИЛЕННЫЙ */
        .effect-neon {
          filter: saturate(5) contrast(2.5) brightness(1.5) hue-rotate(15deg);
          animation: neonPulse 1s ease-in-out infinite;
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
              rgba(255, 0, 255, 0.5) 0%,
              rgba(0, 255, 255, 0.5) 50%,
              rgba(255, 255, 0, 0.5) 100%
            ),
            radial-gradient(
              circle at 30% 30%,
              rgba(255, 0, 128, 0.4) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 70% 70%,
              rgba(0, 255, 200, 0.4) 0%,
              transparent 50%
            );
          mix-blend-mode: screen;
          animation: neonGlow 1.5s ease-in-out infinite;
        }

        @keyframes neonPulse {
          0%, 100% {
            opacity: 1;
            filter: saturate(5) contrast(2.5) brightness(1.5) hue-rotate(15deg);
          }
          33% {
            opacity: 0.85;
            filter: saturate(6) contrast(3) brightness(1.7) hue-rotate(30deg);
          }
          66% {
            opacity: 0.9;
            filter: saturate(5.5) contrast(2.8) brightness(1.6) hue-rotate(-15deg);
          }
        }

        @keyframes neonGlow {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        /* Chromatic Aberration - ЭКСТРЕМАЛЬНО УСИЛЕННЫЙ */
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
            drop-shadow(12px 0 0 rgba(255, 0, 0, 1))
            drop-shadow(-12px 0 0 rgba(0, 255, 255, 1))
            drop-shadow(0 12px 0 rgba(0, 255, 0, 0.6));
          animation: chromaticShift 1.5s ease-in-out infinite;
        }

        @keyframes chromaticShift {
          0%, 100% {
            filter:
              drop-shadow(12px 0 0 rgba(255, 0, 0, 1))
              drop-shadow(-12px 0 0 rgba(0, 255, 255, 1))
              drop-shadow(0 12px 0 rgba(0, 255, 0, 0.6));
          }
          25% {
            filter:
              drop-shadow(15px 5px 0 rgba(255, 0, 0, 1))
              drop-shadow(-15px -5px 0 rgba(0, 255, 255, 1))
              drop-shadow(5px -15px 0 rgba(0, 255, 0, 0.7));
          }
          50% {
            filter:
              drop-shadow(8px -5px 0 rgba(255, 0, 0, 0.9))
              drop-shadow(-8px 5px 0 rgba(0, 255, 255, 0.9))
              drop-shadow(-5px 8px 0 rgba(0, 255, 0, 0.5));
          }
          75% {
            filter:
              drop-shadow(18px 0 0 rgba(255, 0, 0, 1))
              drop-shadow(-18px 0 0 rgba(0, 255, 255, 1))
              drop-shadow(0 18px 0 rgba(0, 255, 0, 0.8));
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
