"use client";

import { useState, useEffect } from "react";
import { getVideoPlayerBySlug } from "@/lib/videoPlayers";
import { detectBrowserLanguage } from "./shared";
import MainExperience from "./MainExperience";
import YouTubePlayerWithEffects from "../video/YouTubePlayerWithEffects";
import LocalVideoPlayer from "../video/LocalVideoPlayer";

type VideoPlayerWithOverlayProps = {
  slug: string;
};

const VideoPlayerWithOverlay = ({ slug }: VideoPlayerWithOverlayProps) => {
  const [currentEffect, setCurrentEffect] = useState('none');
  const [loading, setLoading] = useState(true);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'ru'>('en');
  const [interfaceVisible, setInterfaceVisible] = useState(true);

  const player = getVideoPlayerBySlug(slug);

  useEffect(() => {
    setActiveLanguage(detectBrowserLanguage());
  }, []);

  if (!player) {
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
        Video player not found
      </div>
    );
  }

  const handleReady = () => {
    setLoading(false);
  };

  const renderPlayer = () => {
    switch (player.type) {
      case 'youtube':
        return (
          <YouTubePlayerWithEffects
            effect={currentEffect}
            activeLanguage={activeLanguage}
            interfaceVisible={interfaceVisible}
          />
        );

      case 'local':
        return <LocalVideoPlayer effect={currentEffect} activeLanguage={activeLanguage} interfaceVisible={interfaceVisible} />;

      case 'vk':
        // VK player можно добавить позже
        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            color: '#fff',
            background: '#000',
          }}>
            VK Player - Coming Soon
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* Video Player */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        {renderPlayer()}
      </div>

      {/* Overlay with controls */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1000,
          pointerEvents: "none",
        }}
      >
        <MainExperience
          videoMode={true}
          videoSlug={slug}
          videoEffect={currentEffect}
          onEffectChange={setCurrentEffect}
          onInterfaceVisibilityChange={setInterfaceVisible}
        />
      </div>

    </div>
  );
};

export default VideoPlayerWithOverlay;
