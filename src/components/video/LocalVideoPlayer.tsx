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
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.load();
        videoRef.current.play();
      }
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
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '12px 20px',
              background: 'rgba(0, 0, 0, 0.85)',
              color: '#fff',
              borderRadius: '8px',
              cursor: 'pointer',
              zIndex: 900,
              pointerEvents: 'auto',
              fontSize: '14px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(124, 252, 0, 0.2)';
              e.currentTarget.style.borderColor = '#7cfc00';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.85)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <i className="material-symbols-outlined" style={{ fontSize: '20px' }}>video_file</i>
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

export default LocalVideoPlayer;
