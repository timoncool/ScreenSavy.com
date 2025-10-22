import { VisualizersCatalogStandalone } from '@/components/screensavy/VisualizersCatalog';
import type { VisualizerCategory } from '@/lib/visualizers';

type PageProps = {
  searchParams?: {
    category?: string;
  };
};

const isVisualizerCategory = (
  value: string | undefined,
): value is VisualizerCategory => value === 'audio' || value === 'ambient';

export default function VisualizersPage({ searchParams }: PageProps) {
  const categoryParam = searchParams?.category;
  const initialCategory = isVisualizerCategory(categoryParam)
    ? categoryParam
    : undefined;

  return <VisualizersCatalogStandalone initialCategory={initialCategory} />;
}
