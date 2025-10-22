"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  getVisualizerBySlug,
  visualizers,
  type VisualizerActionType,
  type VisualizerCategory,
} from "@/lib/visualizers";
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
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};

const ACTION_LABELS: Record<VisualizerActionType, MainTranslationKey> = {
  microphone: "visualizerStartWithMic",
  systemAudio: "visualizerStartWithSystem",
  ambient: "visualizerStartAmbient",
};

type VisualizerInlineOverlayProps = {
  slug: string;
  language: Language;
  translation: (key: MainTranslationKey) => string;
  onClose: () => void;
};

const VisualizerInlineOverlay = ({
  slug,
  language,
  translation,
  onClose,
}: VisualizerInlineOverlayProps) => {
  const visualizer = useMemo(() => getVisualizerBySlug(slug), [slug]);
  const [isOverlayCollapsed, setIsOverlayCollapsed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setIsOverlayCollapsed(false);
  }, [slug]);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [slug]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!visualizer) {
    return null;
  }

  const categoryLabel = translation(
    visualizer.category === "audio"
      ? "visualizerCategoryAudio"
      : "visualizerCategoryAmbient",
  );

  const handleActionFocus = () => {
    iframeRef.current?.focus();
  };

  const overlayTitleId = `visualizer-inline-title-${visualizer.slug}`;
  const closeLabel = language === "ru" ? "Закрыть" : "Close";

  return (
    <div
      className="visualizer-inline-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={overlayTitleId}
    >
      <div
        className="visualizer-inline-overlay-backdrop"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="visualizer-inline-overlay-content" role="document">
        <header className="visualizer-inline-header">
          <div className="visualizer-inline-header-info">
            <span
              className={`visualizer-card-tag visualizer-card-tag--${visualizer.category}`}
            >
              {categoryLabel}
            </span>
            <h2 id={overlayTitleId}>
              {visualizer.displayName[language] ?? visualizer.displayName.en}
            </h2>
          </div>
          <div className="visualizer-inline-header-actions">
            <button
              type="button"
              className="visualizer-overlay-toggle"
              aria-expanded={!isOverlayCollapsed}
              aria-label={
                isOverlayCollapsed
                  ? translation("visualizerShowDetails")
                  : translation("visualizerHideDetails")
              }
              title={
                isOverlayCollapsed
                  ? translation("visualizerShowDetails")
                  : translation("visualizerHideDetails")
              }
              onClick={() =>
                setIsOverlayCollapsed((current) => !current)
              }
            >
              <i className="material-symbols-outlined">
                {isOverlayCollapsed ? "menu" : "menu_open"}
              </i>
            </button>
            <button
              type="button"
              className="visualizer-inline-close"
              onClick={onClose}
              aria-label={closeLabel}
              title={closeLabel}
              ref={closeButtonRef}
            >
              <i className="material-symbols-outlined">close</i>
            </button>
          </div>
        </header>
        <div className="visualizer-inline-body">
          <div
            className={`visualizer-detail-content${
              isOverlayCollapsed ? " visualizer-detail-content--collapsed" : ""
            }`}
          >
            {!isOverlayCollapsed && (
              <aside className="visualizer-overlay-panel">
                <header className="visualizer-overlay-header">
                  <span
                    className={`visualizer-card-tag visualizer-card-tag--${visualizer.category}`}
                  >
                    {categoryLabel}
                  </span>
                  <h1>
                    {visualizer.displayName[language] ??
                      visualizer.displayName.en}
                  </h1>
                  <p className="visualizer-summary">
                    {visualizer.summary[language] ?? visualizer.summary.en}
                  </p>
                </header>
                <section className="visualizer-overlay-section">
                  <h2>{translation("visualizerLaunchGuide")}</h2>
                  <p>
                    {visualizer.overlay.description[language] ??
                      visualizer.overlay.description.en}
                  </p>
                </section>
                {visualizer.overlay.highlights && (
                  <section className="visualizer-overlay-section">
                    <h3>{translation("visualizerHighlights")}</h3>
                    <ul>
                      {visualizer.overlay.highlights[language]?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                )}
                {visualizer.overlay.steps && (
                  <section className="visualizer-overlay-section">
                    <h3>{translation("visualizerHowToStart")}</h3>
                    <ol>
                      {visualizer.overlay.steps.map((step) => (
                        <li key={step.title.en}>
                          <strong>
                            {step.title[language] ?? step.title.en}
                          </strong>
                          <span>
                            {step.body[language] ?? step.body.en}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}
                {visualizer.overlay.actions.length > 0 && (
                  <section className="visualizer-overlay-section">
                    <div className="visualizer-action-group">
                      {visualizer.overlay.actions.map((action) => (
                        <button
                          key={`${visualizer.slug}-${action.type}`}
                          type="button"
                          className={`visualizer-action-button visualizer-action-button--${action.type}`}
                          onClick={handleActionFocus}
                        >
                          <span>{translation(ACTION_LABELS[action.type])}</span>
                          {action.helper?.[language] && (
                            <small>{action.helper[language]}</small>
                          )}
                        </button>
                      ))}
                    </div>
                  </section>
                )}
                {visualizer.overlay.notes && (
                  <section className="visualizer-overlay-section">
                    <h3>{translation("visualizerCallouts")}</h3>
                    <ul>
                      {visualizer.overlay.notes[language]?.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </aside>
            )}
            <section className="visualizer-frame">
              <iframe
                ref={iframeRef}
                src={visualizer.iframeSrc}
                title={
                  visualizer.displayName[language] ??
                  visualizer.displayName.en
                }
                allow="microphone; display-capture; autoplay; fullscreen"
                allowFullScreen
                loading="lazy"
                tabIndex={-1}
              />
            </section>
          </div>
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
  const [selectedVisualizerSlug, setSelectedVisualizerSlug] = useState<
    string | null
  >(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

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
      setSelectedVisualizerSlug(null);
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
        onSelectVisualizer={(slug) => {
          if (typeof document !== "undefined") {
            previousFocusRef.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
          }
          setSelectedVisualizerSlug(slug);
        }}
        showLanguageToggle
        onToggleLanguage={handleToggleLanguage}
      />
      {selectedVisualizerSlug && (
        <VisualizerInlineOverlay
          slug={selectedVisualizerSlug}
          language={language}
          translation={translation}
          onClose={() => {
            setSelectedVisualizerSlug(null);
            previousFocusRef.current?.focus();
            previousFocusRef.current = null;
          }}
        />
      )}
    </div>
  );
};

export default VisualizersCatalog;
