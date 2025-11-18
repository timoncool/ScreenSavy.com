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
        /* VHS Effect - Тонкий и стильный */
        .effect-vhs {
          background:
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.15),
              rgba(0, 0, 0, 0.15) 1px,
              transparent 1px,
              transparent 2px
            );
          animation: vhsFlicker 0.12s infinite, vhsDistort 0.3s infinite;
          filter: saturate(0.85) contrast(1.15) brightness(0.92) hue-rotate(-2deg);
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
            rgba(255, 0, 0, 0.12) 0%,
            rgba(0, 255, 0, 0.12) 50%,
            rgba(0, 0, 255, 0.12) 100%
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

        /* CRT Effect - Тонкий и стильный */
        .effect-crt {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.2),
            rgba(0, 0, 0, 0.2) 2px,
            transparent 2px,
            transparent 4px
          );
          animation: crtScan 6s linear infinite;
          filter: contrast(1.3) brightness(1.08) saturate(1.1);
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
          box-shadow: inset 0 0 60px rgba(0, 255, 100, 0.08);
        }

        .effect-crt::after {
          content: '';
          position: absolute;
          top: -60%;
          left: 0;
          width: 100%;
          height: 60%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: crtScanline 7s linear infinite;
        }

        @keyframes crtScan {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }

        @keyframes crtScanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(300vh); }
        }

        /* Glitch Effect - Тонкий и стильный */
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
            transform: translate(-5px, 4px) skew(2deg);
            filter: hue-rotate(90deg) saturate(2);
          }
          20% {
            transform: translate(4px, -4px) skew(-2deg);
            filter: hue-rotate(-90deg) invert(0.1);
          }
          30% {
            transform: translate(-4px, -4px) scaleY(1.05);
            filter: contrast(2);
          }
          40% {
            transform: translate(5px, 4px) scaleX(1.05);
            filter: brightness(1.4);
          }
          50% {
            transform: translate(0, 0) scale(1.03) rotate(0.3deg);
            filter: invert(0.15) hue-rotate(45deg);
          }
          60% {
            transform: translate(-4px, 3px) skew(1.5deg);
            filter: saturate(3);
          }
          70% {
            transform: translate(4px, -4px) skew(-1.5deg);
            filter: contrast(1.5);
          }
          80% {
            transform: translate(0) scaleY(1.06);
            filter: hue-rotate(-45deg);
          }
        }

        @keyframes glitchRGB {
          0%, 100% {
            opacity: 0.1;
          }
          25% {
            opacity: 0.35;
            filter:
              drop-shadow(4px 0 0 red)
              drop-shadow(-4px 0 0 cyan)
              drop-shadow(0 4px 0 lime);
          }
          50% {
            opacity: 0.45;
            filter:
              drop-shadow(-3px 0 0 red)
              drop-shadow(3px 0 0 cyan)
              drop-shadow(0 -3px 0 yellow);
          }
          75% {
            opacity: 0.35;
            filter:
              drop-shadow(5px 0 0 red)
              drop-shadow(-5px 0 0 cyan)
              drop-shadow(0 5px 0 magenta);
          }
        }

        /* Vintage Effect - Тонкий и стильный */
        .effect-vintage {
          filter: sepia(0.6) contrast(1.15) brightness(0.95) saturate(0.85);
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
              rgba(0, 0, 0, 0.12) 1px,
              rgba(0, 0, 0, 0.12) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.12) 1px,
              rgba(0, 0, 0, 0.12) 2px
            ),
            url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="n"><feTurbulence baseFrequency="0.75" numOctaves="2"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.2"/></svg>');
          mix-blend-mode: multiply;
          opacity: 0.4;
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
              rgba(139, 69, 19, 0.4) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 70%,
              rgba(101, 67, 33, 0.4) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at center,
              transparent 30%,
              rgba(101, 67, 33, 0.5) 100%
            );
          animation: vintagePulse 4s ease-in-out infinite;
        }

        @keyframes vintagePulse {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 0.9; }
        }

        /* Film Noir Effect - Тонкий и стильный */
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
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 70px,
              rgba(255, 255, 255, 0.03) 70px,
              rgba(255, 255, 255, 0.03) 71px
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
            rgba(0, 0, 0, 0.75) 100%
          );
          box-shadow:
            inset 0 0 200px rgba(0, 0, 0, 0.85),
            inset 0 0 100px rgba(0, 0, 0, 0.75),
            inset 0 0 50px rgba(0, 0, 0, 0.65);
        }

        /* Neon Effect - Тонкий и стильный */
        .effect-neon {
          filter: saturate(3) contrast(1.7) brightness(1.2) hue-rotate(8deg);
          animation: neonPulse 1.4s ease-in-out infinite;
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
              rgba(255, 0, 255, 0.3) 0%,
              rgba(0, 255, 255, 0.3) 50%,
              rgba(255, 255, 0, 0.3) 100%
            ),
            radial-gradient(
              circle at 30% 30%,
              rgba(255, 0, 128, 0.25) 0%,
              transparent 55%
            ),
            radial-gradient(
              circle at 70% 70%,
              rgba(0, 255, 200, 0.25) 0%,
              transparent 55%
            );
          mix-blend-mode: screen;
          animation: neonGlow 1.8s ease-in-out infinite;
        }

        @keyframes neonPulse {
          0%, 100% {
            opacity: 1;
            filter: saturate(3) contrast(1.7) brightness(1.2) hue-rotate(8deg);
          }
          33% {
            opacity: 0.9;
            filter: saturate(3.3) contrast(1.9) brightness(1.3) hue-rotate(16deg);
          }
          66% {
            opacity: 0.95;
            filter: saturate(3.15) contrast(1.8) brightness(1.25) hue-rotate(-8deg);
          }
        }

        @keyframes neonGlow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }

        /* Chromatic Aberration - Тонкий и стильный */
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
            drop-shadow(6px 0 0 rgba(255, 0, 0, 0.7))
            drop-shadow(-6px 0 0 rgba(0, 255, 255, 0.7))
            drop-shadow(0 6px 0 rgba(0, 255, 0, 0.35));
          animation: chromaticShift 2s ease-in-out infinite;
        }

        @keyframes chromaticShift {
          0%, 100% {
            filter:
              drop-shadow(6px 0 0 rgba(255, 0, 0, 0.7))
              drop-shadow(-6px 0 0 rgba(0, 255, 255, 0.7))
              drop-shadow(0 6px 0 rgba(0, 255, 0, 0.35));
          }
          25% {
            filter:
              drop-shadow(8px 2px 0 rgba(255, 0, 0, 0.75))
              drop-shadow(-8px -2px 0 rgba(0, 255, 255, 0.75))
              drop-shadow(2px -8px 0 rgba(0, 255, 0, 0.4));
          }
          50% {
            filter:
              drop-shadow(5px -2px 0 rgba(255, 0, 0, 0.65))
              drop-shadow(-5px 2px 0 rgba(0, 255, 255, 0.65))
              drop-shadow(-2px 5px 0 rgba(0, 255, 0, 0.3));
          }
          75% {
            filter:
              drop-shadow(9px 0 0 rgba(255, 0, 0, 0.75))
              drop-shadow(-9px 0 0 rgba(0, 255, 255, 0.75))
              drop-shadow(0 9px 0 rgba(0, 255, 0, 0.45));
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
