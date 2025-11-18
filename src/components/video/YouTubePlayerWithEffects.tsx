"use client";

import { useEffect, useRef, useState } from 'react';

interface YouTubePlayerProps {
  videoUrl: string;
  effect: string;
  onReady?: () => void;
}

const YouTubePlayerWithEffects = ({ videoUrl, effect, onReady }: YouTubePlayerProps) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Extract video ID from URL
  const getVideoId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      const videoId = getVideoId(videoUrl);
      // @ts-ignore
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          loop: 1,
          playlist: videoId, // Required for loop
        },
        events: {
          onReady: () => {
            setIsReady(true);
            onReady?.();
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoUrl, onReady]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* YouTube Player */}
      <div
        id="youtube-player"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
        }}
      />

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
        /* VHS Effect */
        .effect-vhs {
          background: repeating-linear-gradient(
            0deg,
            rgba(255, 0, 0, 0.03),
            rgba(255, 0, 0, 0.03) 2px,
            transparent 2px,
            transparent 4px
          );
          animation: vhsFlicker 0.15s infinite;
        }

        @keyframes vhsFlicker {
          0%, 100% { opacity: 0.93; transform: translateY(0); }
          50% { opacity: 0.98; transform: translateY(2px); }
        }

        /* CRT Effect */
        .effect-crt {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.05) 2px,
            rgba(255, 255, 255, 0.05) 4px
          );
          animation: crtScan 8s linear infinite;
        }

        .effect-crt::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            rgba(0, 0, 0, 0.3) 100%
          );
        }

        @keyframes crtScan {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }

        /* Glitch Effect */
        .effect-glitch {
          animation: glitchAnim 0.3s infinite;
        }

        @keyframes glitchAnim {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
          40% { transform: translate(2px, -2px); filter: hue-rotate(-90deg); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(2px, 2px); }
        }

        /* Vintage Effect */
        .effect-vintage {
          background: rgba(255, 235, 205, 0.1);
          mix-blend-mode: multiply;
        }

        .effect-vintage::after {
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
              rgba(0, 0, 0, 0.02) 1px,
              rgba(0, 0, 0, 0.02) 2px
            ),
            radial-gradient(
              ellipse at center,
              transparent 0%,
              rgba(101, 67, 33, 0.2) 100%
            );
        }

        /* Film Noir Effect */
        .effect-noir {
          background: rgba(0, 0, 0, 0.3);
          filter: grayscale(1) contrast(1.3) brightness(0.8);
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
            transparent 30%,
            rgba(0, 0, 0, 0.7) 100%
          );
        }

        /* Neon Effect */
        .effect-neon {
          filter: saturate(2) contrast(1.5) brightness(1.2);
          animation: neonPulse 2s ease-in-out infinite;
        }

        @keyframes neonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        /* Chromatic Aberration */
        .effect-chromatic {
          filter:
            drop-shadow(2px 0 0 rgba(255, 0, 0, 0.5))
            drop-shadow(-2px 0 0 rgba(0, 255, 255, 0.5));
        }

        /* Original - No Effect */
        .effect-none {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default YouTubePlayerWithEffects;
