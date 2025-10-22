"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { visualizers, type VisualizerCategory } from "@/lib/visualizers";
import type { Language, MainTranslationKey } from "./translations";
import { mainTranslations } from "./translations";
import { detectBrowserLanguage } from "./shared";

type VisualizersCatalogProps = {
  initialCategory?: VisualizerCategory;
};

type CategoryTab = {
  id: VisualizerCategory;
  icon: string;
};

const CATEGORY_TABS: CategoryTab[] = [
  { id: "audio", icon: "graphic_eq" },
  { id: "ambient", icon: "blur_on" },
];

const VisualizersCatalog = ({ initialCategory }: VisualizersCatalogProps) => {
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

  const filteredVisualizers = useMemo(
    () => visualizers.filter((item) => item.category === activeCategory),
    [activeCategory],
  );

  const handleTabChange = (nextCategory: VisualizerCategory) => {
    setActiveCategory(nextCategory);
    router.replace(
      nextCategory === "audio"
        ? "/modes/visualizers"
        : `/modes/visualizers?category=${nextCategory}`,
      { scroll: false },
    );
  };

  const categoryDescriptionKey =
    activeCategory === "audio"
      ? "visualizerAudioCategoryDescription"
      : "visualizerAmbientCategoryDescription";

  return (
    <HelmetProvider>
      <div className="visualizers-page">
        <Helmet>
          <title>
            {`${translation("visualizers")} — ScreenSavy`}
          </title>
          <meta
            name="description"
            content={translation("visualizerCatalogSubheading")}
          />
          <meta name="robots" content="index,follow" />
        </Helmet>
        <div className="visualizers-shell">
          <header className="visualizers-header">
            <Link href="/" className="visualizer-back-link">
              <i className="material-symbols-outlined">arrow_back</i>
              <span>{translation("visualizerBack")}</span>
            </Link>
            <button
              type="button"
              className="visualizer-language-toggle"
              onClick={() =>
                setLanguage((current) => (current === "ru" ? "en" : "ru"))
              }
            >
              <i className="material-symbols-outlined">language</i>
              <span>{language === "ru" ? "Русский" : "English"}</span>
            </button>
          </header>
          <section className="visualizers-intro">
            <h1>{translation("visualizerCatalogHeading")}</h1>
            <p>{translation("visualizerCatalogSubheading")}</p>
            <div className="visualizer-tabs">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`visualizer-tab${
                    tab.id === activeCategory ? " active" : ""
                  }`}
                  onClick={() => handleTabChange(tab.id)}
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
          </section>
          <section className="visualizer-grid">
            {filteredVisualizers.map((visualizer) => (
              <article key={visualizer.slug} className="visualizer-card">
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
                  <h2>{visualizer.displayName[language]}</h2>
                  <p>{visualizer.summary[language]}</p>
                </div>
                {visualizer.overlay.highlights && (
                  <ul className="visualizer-card-highlights">
                    {visualizer.overlay.highlights[language]?.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                <Link
                  href={`/modes/visualizers/${visualizer.slug}`}
                  className="visualizer-card-button"
                >
                  <span>{translation("visualizerOpenScene")}</span>
                  <i className="material-symbols-outlined">open_in_new</i>
                </Link>
              </article>
            ))}
          </section>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default VisualizersCatalog;
