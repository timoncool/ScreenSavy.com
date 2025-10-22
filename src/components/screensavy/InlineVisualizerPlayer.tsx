"use client";

import { useMemo } from "react";
import { getVisualizerBySlug } from "@/lib/visualizers";
import type { Language, MainTranslationKey } from "./translations";

export type InlineVisualizerPlayerProps = {
  slug: string;
  language: Language;
  translation: (key: MainTranslationKey) => string;
  onClose: () => void;
};

const InlineVisualizerPlayer = ({
  slug,
  language,
  translation,
  onClose,
}: InlineVisualizerPlayerProps) => {
  const visualizer = useMemo(() => getVisualizerBySlug(slug), [slug]);

  if (!visualizer) {
    return null;
  }

  const localizedName =
    visualizer.displayName[language] ?? visualizer.displayName.en;
  const localizedSummary =
    visualizer.summary[language] ?? visualizer.summary.en;
  const categoryLabel = translation(
    visualizer.category === "audio"
      ? "visualizerCategoryAudio"
      : "visualizerCategoryAmbient",
  );

  return (
    <div className="inline-visualizer">
      <header className="inline-visualizer-header">
        <div className="inline-visualizer-info">
          <span
            className={`visualizer-card-tag visualizer-card-tag--${visualizer.category}`}
          >
            {categoryLabel}
          </span>
          <div className="inline-visualizer-titles">
            <h2>{localizedName}</h2>
            <p>{localizedSummary}</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-visualizer-close"
          onClick={onClose}
          aria-label={translation("close")}
        >
          <i className="material-symbols-outlined">close</i>
        </button>
      </header>
      <div className="inline-visualizer-frame">
        <iframe
          src={visualizer.iframeSrc}
          title={localizedName}
          allow="microphone; display-capture; autoplay; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default InlineVisualizerPlayer;
