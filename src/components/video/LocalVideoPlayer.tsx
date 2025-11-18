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
        /* VHS Effect - Едва заметный */
        .effect-vhs {
          background:
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.08),
              rgba(0, 0, 0, 0.08) 1px,
              transparent 1px,
              transparent 2px
            );
          animation: vhsFlicker 0.15s infinite, vhsDistort 0.4s infinite;
          filter: saturate(0.92) contrast(1.08) brightness(0.96) hue-rotate(-1deg);
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
            rgba(255, 0, 0, 0.08) 0%,
            rgba(0, 255, 0, 0.08) 50%,
            rgba(0, 0, 255, 0.08) 100%
          );
          mix-blend-mode: overlay;
          animation: vhsShift 2.5s infinite;
        }

        @keyframes vhsFlicker {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }

        @keyframes vhsDistort {
          0%, 100% { transform: translateX(0) scaleX(1); }
          33% { transform: translateX(-1px) scaleX(1.005); }
          66% { transform: translateX(1px) scaleX(0.995); }
        }

        @keyframes vhsShift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(2px); }
        }

        /* CRT Effect - Едва заметный */
        .effect-crt {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.12),
            rgba(0, 0, 0, 0.12) 2px,
            transparent 2px,
            transparent 4px
          );
          animation: crtScan 8s linear infinite;
          filter: contrast(1.15) brightness(1.04) saturate(1.05);
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
            transparent 50%,
            rgba(0, 0, 0, 0.4) 100%
          );
          border-radius: 8% / 4%;
          box-shadow: inset 0 0 40px rgba(0, 255, 100, 0.05);
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
            rgba(255, 255, 255, 0.06),
            transparent
          );
          animation: crtScanline 8s linear infinite;
        }

        @keyframes crtScan {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }

        @keyframes crtScanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(250vh); }
        }

        /* Glitch Effect - Едва заметный */
        .effect-glitch {
          animation: glitchAnim 0.25s infinite;
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
          animation: glitchRGB 0.35s infinite;
        }

        @keyframes glitchAnim {
          0%, 100% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          10% {
            transform: translate(-3px, 2px) skew(1deg);
            filter: hue-rotate(60deg) saturate(1.5);
          }
          20% {
            transform: translate(2px, -2px) skew(-1deg);
            filter: hue-rotate(-60deg) invert(0.05);
          }
          30% {
            transform: translate(-2px, -2px) scaleY(1.02);
            filter: contrast(1.5);
          }
          40% {
            transform: translate(3px, 2px) scaleX(1.02);
            filter: brightness(1.2);
          }
          50% {
            transform: translate(0, 0) scale(1.015) rotate(0.2deg);
            filter: invert(0.08) hue-rotate(30deg);
          }
          60% {
            transform: translate(-2px, 2px) skew(0.8deg);
            filter: saturate(2);
          }
          70% {
            transform: translate(2px, -2px) skew(-0.8deg);
            filter: contrast(1.3);
          }
          80% {
            transform: translate(0) scaleY(1.03);
            filter: hue-rotate(-30deg);
          }
        }

        @keyframes glitchRGB {
          0%, 100% {
            opacity: 0.06;
          }
          25% {
            opacity: 0.2;
            filter:
              drop-shadow(2.5px 0 0 red)
              drop-shadow(-2.5px 0 0 cyan)
              drop-shadow(0 2.5px 0 lime);
          }
          50% {
            opacity: 0.28;
            filter:
              drop-shadow(-2px 0 0 red)
              drop-shadow(2px 0 0 cyan)
              drop-shadow(0 -2px 0 yellow);
          }
          75% {
            opacity: 0.2;
            filter:
              drop-shadow(3px 0 0 red)
              drop-shadow(-3px 0 0 cyan)
              drop-shadow(0 3px 0 magenta);
          }
        }

        /* Vintage Effect - Едва заметный */
        .effect-vintage {
          filter: sepia(0.4) contrast(1.08) brightness(0.97) saturate(0.9);
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
              rgba(0, 0, 0, 0.08) 1px,
              rgba(0, 0, 0, 0.08) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.08) 1px,
              rgba(0, 0, 0, 0.08) 2px
            ),
            url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="n"><feTurbulence baseFrequency="0.65" numOctaves="2"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.15"/></svg>');
          mix-blend-mode: multiply;
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
              transparent 55%
            ),
            radial-gradient(
              circle at 80% 70%,
              rgba(101, 67, 33, 0.3) 0%,
              transparent 55%
            ),
            radial-gradient(
              ellipse at center,
              transparent 35%,
              rgba(101, 67, 33, 0.4) 100%
            );
          animation: vintagePulse 4.5s ease-in-out infinite;
        }

        @keyframes vintagePulse {
          0%, 100% { opacity: 0.65; }
          50% { opacity: 0.8; }
        }

        /* Film Noir Effect - Едва заметный */
        .effect-noir {
          filter: grayscale(1) contrast(1.5) brightness(0.8);
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
              rgba(0, 0, 0, 0.12) 1px,
              rgba(0, 0, 0, 0.12) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 80px,
              rgba(255, 255, 255, 0.02) 80px,
              rgba(255, 255, 255, 0.02) 81px
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
            transparent 25%,
            rgba(0, 0, 0, 0.65) 100%
          );
          box-shadow:
            inset 0 0 160px rgba(0, 0, 0, 0.75),
            inset 0 0 80px rgba(0, 0, 0, 0.65),
            inset 0 0 40px rgba(0, 0, 0, 0.55);
        }

        /* Neon Effect - Едва заметный */
        .effect-neon {
          filter: saturate(2) contrast(1.4) brightness(1.1) hue-rotate(5deg);
          animation: neonPulse 1.6s ease-in-out infinite;
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
              rgba(0, 255, 255, 0.2) 50%,
              rgba(255, 255, 0, 0.2) 100%
            ),
            radial-gradient(
              circle at 30% 30%,
              rgba(255, 0, 128, 0.15) 0%,
              transparent 60%
            ),
            radial-gradient(
              circle at 70% 70%,
              rgba(0, 255, 200, 0.15) 0%,
              transparent 60%
            );
          mix-blend-mode: screen;
          animation: neonGlow 2s ease-in-out infinite;
        }

        @keyframes neonPulse {
          0%, 100% {
            opacity: 1;
            filter: saturate(2) contrast(1.4) brightness(1.1) hue-rotate(5deg);
          }
          33% {
            opacity: 0.92;
            filter: saturate(2.2) contrast(1.5) brightness(1.15) hue-rotate(10deg);
          }
          66% {
            opacity: 0.96;
            filter: saturate(2.1) contrast(1.45) brightness(1.12) hue-rotate(-5deg);
          }
        }

        @keyframes neonGlow {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.01);
          }
        }

        /* Chromatic Aberration - Едва заметный */
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
            drop-shadow(4px 0 0 rgba(255, 0, 0, 0.5))
            drop-shadow(-4px 0 0 rgba(0, 255, 255, 0.5))
            drop-shadow(0 4px 0 rgba(0, 255, 0, 0.25));
          animation: chromaticShift 2.2s ease-in-out infinite;
        }

        @keyframes chromaticShift {
          0%, 100% {
            filter:
              drop-shadow(4px 0 0 rgba(255, 0, 0, 0.5))
              drop-shadow(-4px 0 0 rgba(0, 255, 255, 0.5))
              drop-shadow(0 4px 0 rgba(0, 255, 0, 0.25));
          }
          25% {
            filter:
              drop-shadow(5px 1.5px 0 rgba(255, 0, 0, 0.55))
              drop-shadow(-5px -1.5px 0 rgba(0, 255, 255, 0.55))
              drop-shadow(1.5px -5px 0 rgba(0, 255, 0, 0.28));
          }
          50% {
            filter:
              drop-shadow(3.5px -1.5px 0 rgba(255, 0, 0, 0.45))
              drop-shadow(-3.5px 1.5px 0 rgba(0, 255, 255, 0.45))
              drop-shadow(-1.5px 3.5px 0 rgba(0, 255, 0, 0.22));
          }
          75% {
            filter:
              drop-shadow(6px 0 0 rgba(255, 0, 0, 0.55))
              drop-shadow(-6px 0 0 rgba(0, 255, 255, 0.55))
              drop-shadow(0 6px 0 rgba(0, 255, 0, 0.3));
          }
        }

        /* Film Grain Effect - Едва заметный */
        .effect-grain {
          filter: contrast(1.05) brightness(0.98);
        }

        .effect-grain::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="3"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.1"/></svg>');
          mix-blend-mode: overlay;
          opacity: 0.15;
          animation: grainMove 0.5s steps(8) infinite;
        }

        @keyframes grainMove {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
        }

        /* Cinematic Teal-Orange - Едва заметный */
        .effect-cinematic {
          filter: saturate(1.15) contrast(1.1) brightness(1.02);
        }

        .effect-cinematic::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            180deg,
            rgba(0, 150, 150, 0.08) 0%,
            transparent 50%,
            rgba(255, 140, 70, 0.08) 100%
          );
          mix-blend-mode: color;
        }

        /* Duotone Effect - Едва заметный */
        .effect-duotone {
          filter: saturate(1.2) contrast(1.15);
        }

        .effect-duotone::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            45deg,
            rgba(138, 43, 226, 0.15) 0%,
            rgba(255, 215, 0, 0.15) 100%
          );
          mix-blend-mode: color;
        }

        /* Night Vision Effect - Едва заметный */
        .effect-nightvision {
          filter: saturate(0.5) brightness(1.1) contrast(1.2) hue-rotate(90deg);
        }

        .effect-nightvision::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            repeating-linear-gradient(
              0deg,
              rgba(0, 255, 0, 0.03),
              rgba(0, 255, 0, 0.03) 2px,
              transparent 2px,
              transparent 4px
            ),
            radial-gradient(
              circle at center,
              transparent 0%,
              rgba(0, 0, 0, 0.3) 100%
            );
          mix-blend-mode: overlay;
        }

        .effect-nightvision::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 255, 0, 0.08);
          mix-blend-mode: screen;
          animation: nvFlicker 0.15s infinite;
        }

        @keyframes nvFlicker {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        /* Surveillance/CCTV Effect - Едва заметный */
        .effect-surveillance {
          filter: saturate(0.7) contrast(1.2) brightness(0.95);
        }

        .effect-surveillance::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.1),
              rgba(0, 0, 0, 0.1) 2px,
              transparent 2px,
              transparent 4px
            );
          animation: scanlineMove 8s linear infinite;
        }

        .effect-surveillance::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 100, 200, 0.08);
          mix-blend-mode: multiply;
        }

        @keyframes scanlineMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }

        /* Vaporwave Effect - Едва заметный */
        .effect-vaporwave {
          filter: saturate(1.4) brightness(1.05) contrast(1.1) hue-rotate(-10deg);
        }

        .effect-vaporwave::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            180deg,
            rgba(255, 0, 255, 0.12) 0%,
            rgba(0, 255, 255, 0.12) 50%,
            rgba(255, 105, 180, 0.12) 100%
          );
          mix-blend-mode: screen;
          animation: vaporShift 4s ease-in-out infinite;
        }

        @keyframes vaporShift {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.7; }
        }

        /* Underwater Effect - Едва заметный */
        .effect-underwater {
          filter: saturate(1.2) hue-rotate(180deg) brightness(0.92);
        }

        .effect-underwater::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(
              ellipse at 30% 20%,
              rgba(0, 200, 255, 0.15) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at 70% 80%,
              rgba(0, 150, 200, 0.1) 0%,
              transparent 50%
            );
          mix-blend-mode: overlay;
          animation: caustics 6s ease-in-out infinite;
        }

        .effect-underwater::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 100, 150, 0.1);
          mix-blend-mode: multiply;
        }

        @keyframes caustics {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(10px, -10px) scale(1.05);
            opacity: 0.8;
          }
        }

        /* Anaglyph 3D Effect - Едва заметный */
        .effect-anaglyph {
          position: relative;
        }

        .effect-anaglyph::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          mix-blend-mode: screen;
          filter:
            drop-shadow(3px 0 0 rgba(255, 0, 0, 0.4))
            drop-shadow(-3px 0 0 rgba(0, 255, 255, 0.4));
          animation: anaglyphShift 3s ease-in-out infinite;
        }

        @keyframes anaglyphShift {
          0%, 100% {
            filter:
              drop-shadow(3px 0 0 rgba(255, 0, 0, 0.4))
              drop-shadow(-3px 0 0 rgba(0, 255, 255, 0.4));
          }
          50% {
            filter:
              drop-shadow(4px 0 0 rgba(255, 0, 0, 0.45))
              drop-shadow(-4px 0 0 rgba(0, 255, 255, 0.45));
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
