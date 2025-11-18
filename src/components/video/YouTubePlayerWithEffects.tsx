"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface YouTubePlayerWithEffectsProps {
  effect: string;
  activeLanguage?: string;
  interfaceVisible?: boolean;
}

const YouTubePlayerWithEffects = ({ effect, activeLanguage = 'en', interfaceVisible = true }: YouTubePlayerWithEffectsProps) => {
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
    // Check if YouTube API is already loaded
    // @ts-ignore
    if (window.YT && window.YT.Player) {
      // API already loaded, create player immediately
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
    } else {
      // Load YouTube API
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
    }

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
      {showUrlInput && interfaceVisible && (
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
        /* VHS Effect - Заметный и стильный */
        .effect-vhs {
          background:
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.25),
              rgba(0, 0, 0, 0.25) 1px,
              transparent 1px,
              transparent 2px
            );
          animation: vhsFlicker 0.1s infinite, vhsDistort 0.25s infinite;
          filter: saturate(0.7) contrast(1.3) brightness(0.88) hue-rotate(-3deg);
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
            rgba(255, 0, 0, 0.18) 0%,
            rgba(0, 255, 0, 0.18) 50%,
            rgba(0, 0, 255, 0.18) 100%
          );
          mix-blend-mode: overlay;
          animation: vhsShift 1.8s infinite;
        }

        @keyframes vhsFlicker {
          0%, 100% { opacity: 0.78; }
          50% { opacity: 1; }
        }

        @keyframes vhsDistort {
          0%, 100% { transform: translateX(0) scaleX(1); }
          33% { transform: translateX(-3px) scaleX(1.02); }
          66% { transform: translateX(3px) scaleX(0.98); }
        }

        @keyframes vhsShift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }

        /* CRT Effect - Заметный и стильный */
        .effect-crt {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.3),
            rgba(0, 0, 0, 0.3) 2px,
            transparent 2px,
            transparent 4px
          );
          animation: crtScan 5s linear infinite;
          filter: contrast(1.5) brightness(1.15) saturate(1.15);
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
            transparent 35%,
            rgba(0, 0, 0, 0.7) 100%
          );
          border-radius: 12% / 6%;
          box-shadow: inset 0 0 80px rgba(0, 255, 100, 0.12);
        }

        .effect-crt::after {
          content: '';
          position: absolute;
          top: -80%;
          left: 0;
          width: 100%;
          height: 80%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 255, 255, 0.15),
            transparent
          );
          animation: crtScanline 6s linear infinite;
        }

        @keyframes crtScan {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }

        @keyframes crtScanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(350vh); }
        }

        /* Glitch Effect - Заметный и стильный */
        .effect-glitch {
          animation: glitchAnim 0.18s infinite;
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
          animation: glitchRGB 0.25s infinite;
        }

        @keyframes glitchAnim {
          0%, 100% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          10% {
            transform: translate(-8px, 6px) skew(3deg);
            filter: hue-rotate(120deg) saturate(2.5);
          }
          20% {
            transform: translate(7px, -7px) skew(-3deg);
            filter: hue-rotate(-120deg) invert(0.15);
          }
          30% {
            transform: translate(-6px, -6px) scaleY(1.08);
            filter: contrast(2.5);
          }
          40% {
            transform: translate(8px, 6px) scaleX(1.08);
            filter: brightness(1.7);
          }
          50% {
            transform: translate(0, 0) scale(1.05) rotate(0.5deg);
            filter: invert(0.2) hue-rotate(60deg);
          }
          60% {
            transform: translate(-7px, 5px) skew(2deg);
            filter: saturate(4);
          }
          70% {
            transform: translate(6px, -6px) skew(-2deg);
            filter: contrast(1.8);
          }
          80% {
            transform: translate(0) scaleY(1.09);
            filter: hue-rotate(-60deg);
          }
        }

        @keyframes glitchRGB {
          0%, 100% {
            opacity: 0.15;
          }
          25% {
            opacity: 0.5;
            filter:
              drop-shadow(6px 0 0 red)
              drop-shadow(-6px 0 0 cyan)
              drop-shadow(0 6px 0 lime);
          }
          50% {
            opacity: 0.65;
            filter:
              drop-shadow(-5px 0 0 red)
              drop-shadow(5px 0 0 cyan)
              drop-shadow(0 -5px 0 yellow);
          }
          75% {
            opacity: 0.5;
            filter:
              drop-shadow(7px 0 0 red)
              drop-shadow(-7px 0 0 cyan)
              drop-shadow(0 7px 0 magenta);
          }
        }

        /* Vintage Effect - Заметный и стильный */
        .effect-vintage {
          filter: sepia(0.75) contrast(1.25) brightness(0.9) saturate(0.75);
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
              rgba(0, 0, 0, 0.18) 1px,
              rgba(0, 0, 0, 0.18) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.18) 1px,
              rgba(0, 0, 0, 0.18) 2px
            ),
            url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="n"><feTurbulence baseFrequency="0.85" numOctaves="2"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.3"/></svg>');
          mix-blend-mode: multiply;
          opacity: 0.5;
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
              rgba(139, 69, 19, 0.5) 0%,
              transparent 45%
            ),
            radial-gradient(
              circle at 80% 70%,
              rgba(101, 67, 33, 0.5) 0%,
              transparent 45%
            ),
            radial-gradient(
              ellipse at center,
              transparent 25%,
              rgba(101, 67, 33, 0.6) 100%
            );
          animation: vintagePulse 3.5s ease-in-out infinite;
        }

        @keyframes vintagePulse {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }

        /* Film Noir Effect - Заметный и стильный */
        .effect-noir {
          filter: grayscale(1) contrast(2.1) brightness(0.6);
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
              rgba(0, 0, 0, 0.3) 1px,
              rgba(0, 0, 0, 0.3) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 60px,
              rgba(255, 255, 255, 0.04) 60px,
              rgba(255, 255, 255, 0.04) 61px
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
            transparent 15%,
            rgba(0, 0, 0, 0.85) 100%
          );
          box-shadow:
            inset 0 0 250px rgba(0, 0, 0, 0.95),
            inset 0 0 120px rgba(0, 0, 0, 0.85),
            inset 0 0 60px rgba(0, 0, 0, 0.75);
        }

        /* Neon Effect - Заметный и стильный */
        .effect-neon {
          filter: saturate(4) contrast(2.1) brightness(1.4) hue-rotate(12deg);
          animation: neonPulse 1.2s ease-in-out infinite;
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
              rgba(255, 0, 255, 0.4) 0%,
              rgba(0, 255, 255, 0.4) 50%,
              rgba(255, 255, 0, 0.4) 100%
            ),
            radial-gradient(
              circle at 30% 30%,
              rgba(255, 0, 128, 0.35) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 70% 70%,
              rgba(0, 255, 200, 0.35) 0%,
              transparent 50%
            );
          mix-blend-mode: screen;
          animation: neonGlow 1.6s ease-in-out infinite;
        }

        @keyframes neonPulse {
          0%, 100% {
            opacity: 1;
            filter: saturate(4) contrast(2.1) brightness(1.4) hue-rotate(12deg);
          }
          33% {
            opacity: 0.88;
            filter: saturate(4.5) contrast(2.4) brightness(1.55) hue-rotate(24deg);
          }
          66% {
            opacity: 0.94;
            filter: saturate(4.2) contrast(2.2) brightness(1.48) hue-rotate(-12deg);
          }
        }

        @keyframes neonGlow {
          0%, 100% {
            opacity: 0.65;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.03);
          }
        }

        /* Chromatic Aberration - Заметный и стильный */
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
            drop-shadow(9px 0 0 rgba(255, 0, 0, 0.9))
            drop-shadow(-9px 0 0 rgba(0, 255, 255, 0.9))
            drop-shadow(0 9px 0 rgba(0, 255, 0, 0.5));
          animation: chromaticShift 1.8s ease-in-out infinite;
        }

        @keyframes chromaticShift {
          0%, 100% {
            filter:
              drop-shadow(9px 0 0 rgba(255, 0, 0, 0.9))
              drop-shadow(-9px 0 0 rgba(0, 255, 255, 0.9))
              drop-shadow(0 9px 0 rgba(0, 255, 0, 0.5));
          }
          25% {
            filter:
              drop-shadow(11px 3px 0 rgba(255, 0, 0, 0.95))
              drop-shadow(-11px -3px 0 rgba(0, 255, 255, 0.95))
              drop-shadow(3px -11px 0 rgba(0, 255, 0, 0.6));
          }
          50% {
            filter:
              drop-shadow(7px -3px 0 rgba(255, 0, 0, 0.85))
              drop-shadow(-7px 3px 0 rgba(0, 255, 255, 0.85))
              drop-shadow(-3px 7px 0 rgba(0, 255, 0, 0.45));
          }
          75% {
            filter:
              drop-shadow(13px 0 0 rgba(255, 0, 0, 0.95))
              drop-shadow(-13px 0 0 rgba(0, 255, 255, 0.95))
              drop-shadow(0 13px 0 rgba(0, 255, 0, 0.65));
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
