'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MainExperience from '@/components/screensavy/MainExperience';

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
