import { notFound } from 'next/navigation';
import VisualizerDetail from '@/components/screensavy/VisualizerDetail';
import { getVisualizerBySlug } from '@/lib/visualizers';

type PageProps = {
  params: {
    slug: string;
  };
};

export default function VisualizerDetailPage({ params }: PageProps) {
  const visualizer = getVisualizerBySlug(params.slug);

  if (!visualizer) {
    notFound();
  }

  return <VisualizerDetail slug={visualizer.slug} />;
}
