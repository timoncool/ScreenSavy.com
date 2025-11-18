'use client';

import { Suspense, useRef, useState, useCallback } from 'react';
import RetroTV from '@/components/screensavy/RetroTV';
import MainExperience from '@/components/screensavy/MainExperience';

export default function RetroTVPage() {
  const tvRef = useRef<{ setVideoId: (id: string) => void }>(null);
  const [inputValue, setInputValue] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(true);

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
            zIndex: 0,
          }}
        >
          <RetroTV ref={tvRef} />
        </div>

        {/* URL Input Panel - only show when showUrlInput is true */}
        {showUrlInput && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 900,
            pointerEvents: 'auto',
          }}>
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              gap: '10px',
              background: 'rgba(0, 0, 0, 0.85)',
              padding: '15px 20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="YouTube URL or Video ID..."
                style={{
                  minWidth: '400px',
                  padding: '12px 16px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'monospace',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7cfc00';
                  e.target.style.boxShadow = '0 0 15px rgba(124, 252, 0, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button type="submit" style={{
                padding: '12px 24px',
                background: '#7cfc00',
                border: 'none',
                borderRadius: '8px',
                color: '#000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(124, 252, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#6ae000';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 252, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#7cfc00';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 252, 0, 0.3)';
              }}>
                <i className="material-symbols-outlined" style={{ fontSize: '20px' }}>play_arrow</i>
              </button>
              <button type="button" onClick={() => setShowUrlInput(false)} style={{
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}>
                <i className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</i>
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
            visualizerMode={true}
            visualizerSlug="retro-tv"
            onInterfaceVisibilityChange={(visible) => {
              setShowUrlInput(visible);
            }}
          />
        </div>
      </div>
    </Suspense>
  );
}
