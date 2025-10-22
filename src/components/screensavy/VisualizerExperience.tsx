"use client";

import { useEffect, useState } from "react";
import { getVisualizerFile } from "@/lib/visualizers";

type VisualizerExperienceProps = {
  slug: string;
};

const VisualizerExperience = ({ slug }: VisualizerExperienceProps) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  );
};

export default VisualizerExperience;
