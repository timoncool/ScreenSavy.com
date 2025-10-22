"use client";

import { useEffect, useState, useRef } from "react";
import { getVisualizerFile, getVisualizerBySlug } from "@/lib/visualizers";
import MainExperience from "./MainExperience";

type VisualizerWithOverlayProps = {
  slug: string;
};

const VisualizerWithOverlay = ({ slug }: VisualizerWithOverlayProps) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const visualizer = getVisualizerBySlug(slug);

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
  }, [slug, visualizer]);


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
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <iframe
        ref={iframeRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          zIndex: 0,
        }}
        srcDoc={htmlContent}
        title="Visualizer"
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <MainExperience 
          visualizerMode={true}
          visualizerSlug={slug}
          visualizerCategory={visualizer?.category}
          iframeRef={iframeRef}
        />
      </div>
    </div>
  );
};

export default VisualizerWithOverlay;
