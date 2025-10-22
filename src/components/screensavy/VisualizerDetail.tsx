"use client";

import { useMemo } from "react";
import { getVisualizerBySlug } from "@/lib/visualizers";

type VisualizerDetailProps = {
  slug: string;
};

const VisualizerDetail = ({ slug }: VisualizerDetailProps) => {
  const visualizer = useMemo(() => getVisualizerBySlug(slug), [slug]);

  if (!visualizer) {
    return null;
  }

  const title =
    visualizer.displayName.en ??
    Object.values(visualizer.displayName)[0] ??
    visualizer.slug;

  return (
    <div className="visualizer-embed">
      <iframe
        src={visualizer.iframeSrc}
        title={title}
        allow="microphone; display-capture; autoplay; fullscreen"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

export default VisualizerDetail;
