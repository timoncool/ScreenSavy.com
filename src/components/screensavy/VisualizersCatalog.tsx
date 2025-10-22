"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { visualizers, type VisualizerCategory } from "@/lib/visualizers";
import type { Language, MainTranslationKey } from "./translations";
import { mainTranslations } from "./translations";
import { detectBrowserLanguage } from "./shared";

type VisualizersCatalogProps = {
  activeCategory: VisualizerCategory;
  language: Language;
  translation: (key: MainTranslationKey) => string;
  onSelectCategory: (category: VisualizerCategory) => void;
  onSelectVisualizer: (slug: string) => void;
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
  activeCategory,
  language,
  translation,
  onSelectCategory,
  onSelectVisualizer,
  showLanguageToggle = false,
  onToggleLanguage,
  standalone = false,
}: VisualizersCatalogProps) => {
  const filteredVisualizers = useMemo(
    () => visualizers.filter((item) => item.category === activeCategory),
    [activeCategory],
  );

  const containerClasses = [
    "visualizers-catalog",
    standalone ? "visualizers-catalog--standalone" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={containerClasses} aria-label={translation("visualizers")}>
      <div className="visualizers-catalog-toolbar">
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
      </div>
      <div className="visualizer-grid visualizers-catalog-grid">
        {filteredVisualizers.map((visualizer) => {
          const localizedName =
            visualizer.displayName[language] ?? visualizer.displayName.en;
          return (
            <article
              key={visualizer.slug}
              className="visualizer-card visualizer-card--compact"
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
              </div>
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
      </div>
    </section>
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
        standalone
        activeCategory={activeCategory}
        language={language}
        translation={translation}
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
