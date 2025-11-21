'use client';

import { Suspense, useRef, useState, useCallback } from 'react';
import RetroTV, { RetroTVRef } from '@/components/screensavy/RetroTV';
import MainExperience from '@/components/screensavy/MainExperience';

export default function RetroTVPage() {
  const tvRef = useRef<RetroTVRef>(null);
  const [inputValue, setInputValue] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(true);
  const [environment, setEnvironment] = useState<RetroEnvironment>('loft-brick');

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
    if (videoId && tvRef.current) {
      tvRef.current.setVideoId(videoId);
    }
  }, [inputValue, extractVideoId]);

  return (
    <Suspense fallback={
      <div style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        Загрузка...
      </div>
    }>
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        {/* Retro TV - lowest z-index */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // zIndex: 0,
          }}
        >
          <RetroTV ref={tvRef} environment={environment} />
        </div>

        {/* URL Input Panel - only show when showUrlInput is true */}
        {showUrlInput && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 900,
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
                placeholder="YouTube URL..."
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

        {/* MainExperience overlay - highest z-index but pointer-events only on specific elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1000,
            pointerEvents: 'none', // Don't block TV controls
          }}
        >
          <MainExperience
            videoMode={true}
            videoSlug="retro-tv"
            onInterfaceVisibilityChange={(visible) => {
              setShowUrlInput(visible);
            }}
            tvRef={tvRef}
            environment={environment}
            onEnvironmentChange={setEnvironment}
          />
        </div>
      </div>
    </Suspense>
  );
}
