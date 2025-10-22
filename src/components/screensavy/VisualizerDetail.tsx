"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  getVisualizerBySlug,
  type VisualizerActionType,
  type VisualizerDefinition,
} from "@/lib/visualizers";
import type { Language, MainTranslationKey } from "./translations";
import { mainTranslations } from "./translations";
import { detectBrowserLanguage } from "./shared";

const ACTION_LABELS: Record<VisualizerActionType, MainTranslationKey> = {
  microphone: "visualizerStartWithMic",
  systemAudio: "visualizerStartWithSystem",
  ambient: "visualizerStartAmbient",
};

type VisualizerDetailProps = {
  slug: string;
};

const VisualizerDetail = ({ slug }: VisualizerDetailProps) => {
  const [language, setLanguage] = useState<Language>("en");
  const [isOverlayCollapsed, setIsOverlayCollapsed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setLanguage(detectBrowserLanguage());
  }, []);

  useEffect(() => {
    setIsOverlayCollapsed(false);
  }, [slug]);

  const visualizer = useMemo<VisualizerDefinition | undefined>(
    () => getVisualizerBySlug(slug),
    [slug],
  );

  const translation = useCallback(
    (key: MainTranslationKey) =>
      mainTranslations[language]?.[key] ?? mainTranslations.en[key],
    [language],
  );

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

  return (
    <HelmetProvider>
      <div className="visualizer-detail-page">
        <Helmet>
          <title>
            {`${visualizer.displayName[language]} — ${translation("visualizers")}`}
          </title>
          <meta name="description" content={visualizer.summary[language]} />
          <meta name="robots" content="index,follow" />
        </Helmet>
        <header className="visualizers-header visualizer-detail-header">
          <Link href="/modes/visualizers" className="visualizer-back-link">
            <i className="material-symbols-outlined">arrow_back</i>
            <span>{translation("visualizerBack")}</span>
          </Link>
          <div className="visualizer-header-actions">
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
              className="visualizer-language-toggle"
              onClick={() =>
                setLanguage((current) => (current === "ru" ? "en" : "ru"))
              }
            >
              <i className="material-symbols-outlined">language</i>
              <span>{language === "ru" ? "Русский" : "English"}</span>
            </button>
          </div>
        </header>
        <main
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
                <h1>{visualizer.displayName[language]}</h1>
                <p className="visualizer-summary">{visualizer.summary[language]}</p>
              </header>
              <section className="visualizer-overlay-section">
                <h2>{translation("visualizerLaunchGuide")}</h2>
                <p>{visualizer.overlay.description[language]}</p>
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
                      <li key={step.title[language]}>
                        <strong>{step.title[language]}</strong>
                        <span>{step.body[language]}</span>
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
              title={visualizer.displayName[language]}
              allow="microphone; display-capture; autoplay; fullscreen"
              allowFullScreen
              loading="lazy"
              tabIndex={-1}
            />
          </section>
        </main>
      </div>
    </HelmetProvider>
  );
};

export default VisualizerDetail;
