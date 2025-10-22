'use client';

import { useSearchParams } from 'next/navigation';
import MainExperience from '@/components/screensavy/MainExperience';

export default function Page() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as 'oneColor' | 'colorChange' | 'clock' | 'text' | null;
  
  return <MainExperience initialMode={mode || undefined} />;
}
