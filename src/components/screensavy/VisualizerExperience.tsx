"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getVisualizerFile, visualizers } from "@/lib/visualizers";

type VisualizerExperienceProps = {
  slug: string;
};

const VisualizerExperience = ({ slug }: VisualizerExperienceProps) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const router = useRouter();

  const currentVisualizer = visualizers.find((v) => v.slug === slug);
  const audioVisualizers = visualizers.filter((v) => v.category === "audio");
  const ambientVisualizers = visualizers.filter((v) => v.category === "ambient");

  useEffect(() => {
    const fileName = getVisualizerFile(slug);
    if (!fileName) {
      setError("Visualizer not found");
      setLoading(false);
      return;
    }

    fetch(`/visualizers/${fileName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load visualizer");
        }
        return response.text();
      })
      .then((html) => {
        setHtmlContent(html);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <div className="visualizer-overlay">
        <button
          className="visualizer-overlay-toggle"
          onClick={() => setOverlayVisible(!overlayVisible)}
          title={overlayVisible ? "Hide controls" : "Show controls"}
        >
          <i className="material-symbols-outlined">
            {overlayVisible ? "close" : "menu"}
          </i>
        </button>
        {overlayVisible && (
          <div className="visualizer-overlay-panel">
            <div className="visualizer-overlay-header">
              <h3>{currentVisualizer?.name || "Visualizer"}</h3>
              <button
                className="visualizer-overlay-close"
                onClick={() => setOverlayVisible(false)}
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>
            <div className="visualizer-overlay-section">
              <h4>Audio Visualizers</h4>
              <div className="visualizer-overlay-buttons">
                {audioVisualizers.map((v) => (
                  <button
                    key={v.slug}
                    className={`visualizer-overlay-button ${v.slug === slug ? "active" : ""}`}
                    onClick={() => router.push(`/modes/visualizers/${v.slug}`)}
                  >
                    <i className="material-symbols-outlined">graphic_eq</i>
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="visualizer-overlay-section">
              <h4>Ambient Visualizers</h4>
              <div className="visualizer-overlay-buttons">
                {ambientVisualizers.map((v) => (
                  <button
                    key={v.slug}
                    className={`visualizer-overlay-button ${v.slug === slug ? "active" : ""}`}
                    onClick={() => router.push(`/modes/visualizers/${v.slug}`)}
                  >
                    <i className="material-symbols-outlined">blur_on</i>
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="visualizer-overlay-section">
              <button
                className="visualizer-overlay-button visualizer-overlay-home"
                onClick={() => router.push("/")}
              >
                <i className="material-symbols-outlined">home</i>
                Back to Main
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VisualizerExperience;
