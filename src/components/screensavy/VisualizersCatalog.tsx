"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { visualizers, type VisualizerCategory } from "@/lib/visualizers";
import type { Language, MainTranslationKey } from "./translations";
import { mainTranslations } from "./translations";
import { detectBrowserLanguage } from "./shared";

type VisualizersCatalogProps = {
  open: boolean;
  activeCategory: VisualizerCategory;
  language: Language;
  translation: (key: MainTranslationKey) => string;
  onClose: () => void;
  onSelectCategory: (category: VisualizerCategory) => void;
  onSelectVisualizer: (slug: string) => void;
  activeSlug?: string | null;
  showLanguageToggle?: boolean;
  onToggleLanguage?: () => void;
  standalone?: boolean;
};

type CategoryTab = {
  id: VisualizerCategory;
  icon: string;
};

const CATEGORY_TABS: CategoryTab[] = [
  { id: "audio", icon: "graphic_eq" },
  { id: "ambient", icon: "blur_on" },
];

const VisualizersCatalog = ({
  open,
  activeCategory,
  language,
  translation,
  onClose,
  onSelectCategory,
  onSelectVisualizer,
  activeSlug,
  showLanguageToggle = false,
  onToggleLanguage,
  standalone = false,
}: VisualizersCatalogProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const filteredVisualizers = useMemo(
    () => visualizers.filter((item) => item.category === activeCategory),
    [activeCategory],
  );

  if (!open && !standalone) {
    return null;
  }

  const categoryDescriptionKey =
    activeCategory === "audio"
      ? "visualizerAudioCategoryDescription"
      : "visualizerAmbientCategoryDescription";

  const containerClasses = [
    "visualizers-overlay",
    standalone ? "visualizers-overlay--standalone" : "",
    open ? "open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={containerClasses}
      role={standalone ? undefined : "dialog"}
      aria-modal={standalone ? undefined : true}
    >
      <div className="visualizers-overlay-panel">
        <header className="visualizers-overlay-header">
          <div className="visualizers-overlay-title">
            <div className="visualizers-overlay-title-icon">
              <i className="material-symbols-outlined">animation</i>
            </div>
            <div className="visualizers-overlay-title-text">
              <h2>{translation("visualizerCatalogHeading")}</h2>
              <p>{translation("visualizerCatalogSubheading")}</p>
            </div>
          </div>
          <div className="visualizers-overlay-actions">
            {showLanguageToggle && onToggleLanguage && (
              <button
                type="button"
                className="visualizer-language-toggle"
                onClick={onToggleLanguage}
              >
                <i className="material-symbols-outlined">language</i>
                <span>{language === "ru" ? "Русский" : "English"}</span>
              </button>
            )}
            <button
              type="button"
              className="visualizers-overlay-close"
              onClick={onClose}
              aria-label={translation("close")}
            >
              <i className="material-symbols-outlined">close</i>
            </button>
          </div>
        </header>
        <div className="visualizers-overlay-body">
          <div className="visualizer-tabs">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`visualizer-tab${
                  tab.id === activeCategory ? " active" : ""
                }`}
                onClick={() => onSelectCategory(tab.id)}
              >
                <i className="material-symbols-outlined">{tab.icon}</i>
                <span>
                  {translation(
                    tab.id === "audio"
                      ? "visualizerCategoryAudio"
                      : "visualizerCategoryAmbient",
                  )}
                </span>
              </button>
            ))}
          </div>
          <p className="visualizer-category-description">
            {translation(categoryDescriptionKey)}
          </p>
          <section className="visualizer-grid">
            {filteredVisualizers.map((visualizer) => {
              const isActive = activeSlug === visualizer.slug;
              const localizedName =
                visualizer.displayName[language] ?? visualizer.displayName.en;
              const localizedSummary =
                visualizer.summary[language] ?? visualizer.summary.en;
              const highlights =
                visualizer.overlay.highlights?.[language] ??
                visualizer.overlay.highlights?.en;
              return (
                <article
                  key={visualizer.slug}
                  className={`visualizer-card${
                    isActive ? " visualizer-card--active" : ""
                  }`}
                >
                  <div className="visualizer-card-header">
                    <span
                      className={`visualizer-card-tag visualizer-card-tag--${visualizer.category}`}
                    >
                      {translation(
                        visualizer.category === "audio"
                          ? "visualizerCategoryAudio"
                          : "visualizerCategoryAmbient",
                      )}
                    </span>
                    <h3>{localizedName}</h3>
                    <p>{localizedSummary}</p>
                  </div>
                  {highlights && (
                    <ul className="visualizer-card-highlights">
                      {highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    className="visualizer-card-button"
                    onClick={() => onSelectVisualizer(visualizer.slug)}
                  >
                    <span>{translation("visualizerOpenScene")}</span>
                    <i className="material-symbols-outlined">open_in_new</i>
                  </button>
                </article>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
};

export const VisualizersCatalogStandalone = ({
  initialCategory,
}: {
  initialCategory?: VisualizerCategory;
}) => {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");
  const [activeCategory, setActiveCategory] = useState<VisualizerCategory>(
    initialCategory ?? "audio",
  );

  useEffect(() => {
    setLanguage(detectBrowserLanguage());
  }, []);

  useEffect(() => {
    if (!initialCategory) return;
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const translation = useCallback(
    (key: MainTranslationKey) =>
      mainTranslations[language]?.[key] ?? mainTranslations.en[key],
    [language],
  );

  const handleSelectCategory = useCallback(
    (category: VisualizerCategory) => {
      setActiveCategory(category);
      router.replace(
        category === "audio"
          ? "/modes/visualizers"
          : `/modes/visualizers?category=${category}`,
        { scroll: false },
      );
    },
    [router],
  );

  const handleToggleLanguage = useCallback(() => {
    setLanguage((current) => (current === "ru" ? "en" : "ru"));
  }, []);

  return (
    <div className="visualizers-page">
      <VisualizersCatalog
        open
        standalone
        activeCategory={activeCategory}
        language={language}
        translation={translation}
        onClose={() => router.push("/")}
        onSelectCategory={handleSelectCategory}
        onSelectVisualizer={(slug) =>
          router.push(`/modes/visualizers/${slug}`)
        }
        showLanguageToggle
        onToggleLanguage={handleToggleLanguage}
      />
    </div>
  );
};

export default VisualizersCatalog;
