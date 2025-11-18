"use client";

import { useRef, useState } from 'react';

interface LocalVideoPlayerProps {
  effect: string;
  activeLanguage?: string;
  interfaceVisible?: boolean;
}

const LocalVideoPlayer = ({ effect, activeLanguage = 'en', interfaceVisible = true }: LocalVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

      // Auto-play after loading
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.src = url;
          videoRef.current.load();
          videoRef.current.play().catch(err => {
            console.log('Autoplay prevented:', err);
            // Autoplay was prevented, user will need to click play
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

          {/* Change Video Button */}
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
        </>
      )}

      {/* Effects Overlay */}
      {videoFile && (
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
      )}

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

export default LocalVideoPlayer;
