"use client";

import { useRef, useState } from 'react';

interface LocalVideoPlayerProps {
  effect: string;
  activeLanguage?: string;
}

const LocalVideoPlayer = ({ effect, activeLanguage = 'en' }: LocalVideoPlayerProps) => {
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

        /* Original - No Effect */
        .effect-none {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default LocalVideoPlayer;
