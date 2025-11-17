'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamic import for MainExperience - reduces initial bundle size by ~70KB
const MainExperience = dynamic(
  () => import('@/components/screensavy/MainExperience'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: '100%',
          height: '100vh',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'system-ui'
        }}
      >
        Loading...
      </div>
    ),
  }
);

function PageContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as 'oneColor' | 'colorChange' | 'clock' | 'text' | null;

  return <MainExperience initialMode={mode || undefined} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ width: '100%', height: '100vh', backgroundColor: '#000' }} />}>
      <PageContent />
    </Suspense>
  );
}
