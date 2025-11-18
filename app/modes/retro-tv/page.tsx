'use client';

import { Suspense } from 'react';
import RetroTV from '@/components/screensavy/RetroTV';

export default function RetroTVPage() {
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
      <RetroTV />
    </Suspense>
  );
}
