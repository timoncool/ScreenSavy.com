'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import VideoAmbilight, { VideoAmbilightRef } from '../common/VideoAmbilight';

export interface RetroTVRef {
  setVideoId: (id: string) => void;
  setViewMode: (mode: 'full' | 'closeup') => void;
}

interface RetroTVProps {
  viewMode?: 'full' | 'closeup';
}

const RetroTV = forwardRef<RetroTVRef, RetroTVProps>(({ viewMode = 'full' }, ref) => {
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [internalViewMode, setInternalViewMode] = useState<'full' | 'closeup'>(viewMode);

  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);

  const playerRef = useRef<VideoAmbilightRef>(null);

  useImperativeHandle(ref, () => ({
    setVideoId: (id: string) => {
      setCurrentVideoId(id);
      setIsPoweredOn(true);
    },
    setViewMode: (mode: 'full' | 'closeup') => {
      setInternalViewMode(mode);
    }
  }));

  const handlePlay = () => playerRef.current?.playVideo();
  const handlePause = () => playerRef.current?.pauseVideo();
  const handleNext = () => (playerRef.current as any)?.nextVideo?.();

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    playerRef.current?.setVolume(newVolume);
  };

  const isCloseup = internalViewMode === 'closeup';

  const brightnessEffect = 1.0 + (brightness / 100) * 0.5;
  const contrastEffect = 1.0 + (contrast / 100) * 1.0;

  return (
    <div className="retro-tv-container">
      <div className="gradient" />
      <div className="brick-wall" />
      <div className="wood-floor" />

      <div className={`old-tv ${!isPoweredOn ? 'powered-off' : ''} ${isCloseup ? 'closeup-mode' : ''}`}>
        <div className="antenna" />
        <main>
          <div className="error-noise">
            <div className="error-effect">
              <div
                className="old-tv-content"
                style={{
                  filter: `brightness(${brightnessEffect}) contrast(${contrastEffect})`,
                }}
              >
                {currentVideoId && isPoweredOn ? (
                  <VideoAmbilight key={currentVideoId} ref={playerRef} videoId={currentVideoId} />
                ) : (
                  <div className="static-noise" />
                )}
              </div>
            </div>
          </div>
        </main>

        <div className="speaker" />

        <div className="power-section">
          <button onClick={() => setIsPoweredOn(!isPoweredOn)} className="power-button" />
          <div className={`power-indicator ${isPoweredOn ? 'on' : 'standby'}`} />
        </div>

        <div className="control-panel">
          <div className="playback-controls">
            <button onClick={handlePlay}>▶</button>
            <button onClick={handlePause}>❚❚</button>
            <button onClick={handleNext}>❯❯</button>
          </div>
          <div className="sliders-section">
            <div className="slider-group">
              <label>Volume</label>
              <input type="range" min="0" max="100" value={volume} onChange={(e) => handleVolumeChange(Number(e.target.value))} />
            </div>
            <div className="slider-group">
              <label>Brightness</label>
              <input type="range" min="0" max="100" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
            </div>
            <div className="slider-group">
              <label>Contrast</label>
              <input type="range" min="0" max="100" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} />
            </div>
          </div>
        </div>
        <footer />
      </div>

      <div id="table-tv" className={isCloseup ? 'closeup-mode' : ''}>
        <div className="scene" style={{ transform: 'rotateX(-12deg) rotateY(0deg)' }}>
          <div className="shape cuboid-1 cub-1"><div className="face ft"></div><div className="face bk"></div><div className="face rt"></div><div className="face lt"></div><div className="face bm"></div><div className="face tp"></div></div>
          <div className="shape cuboid-3 cub-3"><div className="face ft"></div><div className="face bk"></div><div className="face rt"></div><div className="face lt"></div><div className="face bm"></div><div className="face tp"></div></div>
          <div className="shape cuboid-4 cub-4"><div className="face ft"></div><div className="face bk"></div><div className="face rt"></div><div className="face lt"></div><div className="face bm"></div><div className="face tp"></div></div>
          <div className="shape cuboid-5 cub-5"><div className="face ft"></div><div className="face bk"></div><div className="face rt"></div><div className="face lt"></div><div className="face bm"></div><div className="face tp"></div></div>
          <div className="shape cuboid-6 cub-6"><div className="face ft"></div><div className="face bk"></div><div className="face rt"></div><div className="face lt"></div><div className="face bm"></div><div className="face tp"></div></div>
          <div className="shape cuboid-2 cub-2"><div className="face ft"></div><div className="face bk"></div><div className="face rt"></div><div className="face lt"></div><div className="face bm"></div><div className="face tp"></div></div>
        </div>
      </div>

      <style jsx>{`
        /* --- Base & Environment --- */
        .retro-tv-container { position: relative; width: 100%; height: 100vh; background: #000; overflow: hidden; }
        .gradient { position: absolute; width: 100%; height: 100%; top: 0; left: 0; background: linear-gradient(to left, rgba(0,0,0,0.8) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.8) 100%), radial-gradient(transparent 50%, rgba(0,0,0,0.8)); z-index: 700; pointer-events: none; }
        .brick-wall { position: absolute; top: 0; left: 0; right: 0; bottom: 140px; background-color: #8b4d3a; background-image: repeating-linear-gradient(0deg, transparent 0px, transparent 60px, #3a2318 60px, #3a2318 64px), repeating-linear-gradient(90deg, #a0522d 0px, #a0522d 8px, #8b4513 8px, #8b4513 120px, #a0522d 120px, #a0522d 128px, #6b3d2e 128px, #6b3d2e 130px), repeating-linear-gradient(90deg, transparent 0px, transparent 65px, #3a2318 65px, #3a2318 68px, transparent 68px, transparent 130px), linear-gradient(180deg, rgba(139,69,19,0.3) 0%, rgba(107,61,46,0.5) 50%, rgba(74,38,24,0.7) 100%); background-size: 100% 100%, 260px 64px, 130px 64px, 100% 100%; background-position: 0 0, 0 0, 0 32px, 0 0; box-shadow: 0 8px 10px rgba(0,0,0,0.8), inset 0 0 100px rgba(0,0,0,0.3); z-index: 100; transition: opacity 0.5s ease; }
        .wood-floor { position: absolute; width: 100%; height: 140px; bottom: 0; left: 0; perspective: 300px; overflow: hidden; z-index: 50; }
        .wood-floor::before { position: absolute; content: " "; top: -100%; left: -25%; width: 150%; height: 250%; background: repeating-linear-gradient(90deg, #5a3d2e 0px, #5a3d2e 120px, #4a2d1e 120px, #4a2d1e 122px), linear-gradient(180deg, #6a4d3e 0%, #4a2d1e 100%); transform: rotateX(60deg); box-shadow: inset 0 -50px 100px rgba(0,0,0,0.5); }

        /* --- TV Body --- */
        .old-tv { position: absolute; width: 870px; height: 465px; bottom: 160px; left: 50%; margin-left: -435px; background: #333; background-image: url(data:image/png;base64,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); padding: 20px; border-radius: 8px; border-bottom: 4px #222 solid; z-index: 600; pointer-events: auto; transition: transform 0.5s ease, bottom 0.5s ease, box-shadow 0.5s ease; }
        .old-tv * { outline: none; }
        .old-tv.closeup-mode { transform: scale(1.3); bottom: 250px; z-index: 800; }
        .old-tv .antenna { position: absolute; width: 200px; height: 20px; background: #222; top: -20px; left: 240px; border-top-left-radius: 50%; border-top-right-radius: 50%; box-shadow: inset 0 5px #444, inset 0 -2px 5px #000; }
        .old-tv .antenna:before, .old-tv .antenna:after { content: " "; position: absolute; bottom: 8px; width: 12px; height: 250px; background-color: #444; background-image: linear-gradient(rgba(255,255,255,0.1), transparent); border-top-left-radius: 40%; border-top-right-radius: 40%; box-shadow: inset -1px 1px rgba(255,255,255,0.4), inset 5px 0 5px rgba(0,0,0,0.5), -8px 5px 15px rgba(0,0,0,0.5); z-index: -1; }
        .old-tv .antenna:before { left: 40px; transform: rotate(-20deg); }
        .old-tv .antenna:after { left: 150px; transform: rotate(20deg); }
        .old-tv main { position: relative; display: inline-block; padding: 20px; border-radius: 8px; background: #444; border: 3px #aaa solid; box-shadow: 0 10px 8px rgba(0,0,0,0.4); vertical-align: top; }
        .old-tv main::before { content: " "; position: absolute; top: 0; left: 0; box-sizing: border-box; width: 100%; height: 100%; border-radius: 8px; border-style: solid; border-width: 80px 90px 40px 90px; border-color: rgba(0,0,0,0.4) rgba(0,0,0,0.2) rgba(0,0,0,0) rgba(0,0,0,0.2); z-index: 1; pointer-events: none; }
        .old-tv footer { position: absolute; height: 15px; bottom: -22px; left: 15px; right: 15px; background: #222; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; box-shadow: inset 0 5px 5px rgba(0,0,0,0.8), 0 2px 5px rgba(0,0,0,0.5), 0 10px 25px rgba(0,0,0,1); border-bottom: 3px #000 solid; z-index: -1; }

        /* --- Speaker --- */
        .old-tv .speaker { position: absolute; width: 140px; height: 200px; top: 50px; right: 40px; padding: 10px; box-sizing: border-box; }
        .old-tv .speaker::before { content: " "; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, rgba(0,0,0,0.2) 5px, rgba(0,0,0,0.2) 6px, transparent 6px, transparent 10px); border-radius: 20px; border: 2px #111 solid; box-shadow: 0 1px 3px rgba(255,255,255,0.5), 0 4px 15px rgba(0,0,0,0.6); }

        /* --- Control Panel & Power Button --- */
        .control-panel { position: absolute; bottom: 30px; right: 20px; width: 160px; height: auto; background: #2a2a2a; border-radius: 8px; border: 2px solid #1a1a1a; box-shadow: inset 1px 1px 2px rgba(255,255,255,0.1), inset -1px -1px 2px rgba(0,0,0,0.5), 2px 2px 5px rgba(0,0,0,0.5); padding: 15px; display: flex; flex-direction: column; gap: 15px; font-family: 'Arial', sans-serif; color: #ccc; }
        .power-section { position: absolute; bottom: 30px; left: 40px; display: flex; align-items: center; gap: 10px; }
        .power-button { width: 25px; height: 25px; border-radius: 4px; background: #555; border: 1px solid #222; box-shadow: inset 0 1px 1px rgba(255,255,255,0.2), 0 2px 3px rgba(0,0,0,0.4); cursor: pointer; transition: all 0.1s ease; }
        .power-button:active { transform: translateY(1px); background: #4a4a4a; }
        .power-indicator { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #111; transition: all 0.3s ease; }
        .power-indicator.on { background: #7cfc00; box-shadow: 0 0 8px #7cfc00, 0 0 4px #7cfc00; }
        .power-indicator.standby { background: #ff4444; box-shadow: 0 0 8px #ff4444, 0 0 4px #ff4444; }
        .playback-controls { display: flex; justify-content: space-around; gap: 8px; }
        .playback-controls button { background: #444; border: 1px solid #222; color: #eee; width: 30px; height: 30px; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 2px rgba(0,0,0,0.4); transition: all 0.1s ease; font-size: 14px; }
        .playback-controls button:active { transform: translateY(1px); background: #3a3a3a; }
        .sliders-section { display: flex; flex-direction: column; gap: 10px; }
        .slider-group { display: flex; flex-direction: column; gap: 5px; }
        .slider-group label { font-size: 12px; text-align: center; color: #aaa; text-transform: uppercase; }
        input[type="range"] { -webkit-appearance: none; background: transparent; width: 100%; cursor: pointer; }
        input[type="range"]::-webkit-slider-runnable-track { height: 4px; background: #111; border-radius: 2px; border: 1px solid #000; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 8px; background: #888; border-radius: 2px; border: 1px solid #555; margin-top: -7px; box-shadow: 1px 1px 3px rgba(0,0,0,0.5); }

        /* --- Screen Effects & Content --- */
        .error-noise { position: relative; width: 580px; height: 326px; overflow: hidden; border-radius: 15px; z-index: 3; }
        .error-effect { position: absolute; width: 100%; height: 100%; border-radius: 15px; background: #111; background-image: url(data:image/png;base64,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); padding: 20px; border-radius: 8px; border-bottom: 4px #222 solid; z-index: 600; pointer-events: auto; transition: transform 0.5s ease, bottom 0.5s ease, box-shadow 0.5s ease; }
        .old-tv * { outline: none; }
        .old-tv.closeup-mode { transform: scale(1.3); bottom: 250px; z-index: 800; }
        .old-tv .antenna { position: absolute; width: 200px; height: 20px; background: #222; top: -20px; left: 240px; border-top-left-radius: 50%; border-top-right-radius: 50%; box-shadow: inset 0 5px #444, inset 0 -2px 5px #000; }
        .old-tv .antenna:before, .old-tv .antenna:after { content: " "; position: absolute; bottom: 8px; width: 12px; height: 250px; background-color: #444; background-image: linear-gradient(rgba(255,255,255,0.1), transparent); border-top-left-radius: 40%; border-top-right-radius: 40%; box-shadow: inset -1px 1px rgba(255,255,255,0.4), inset 5px 0 5px rgba(0,0,0,0.5), -8px 5px 15px rgba(0,0,0,0.5); z-index: -1; }
        .old-tv .antenna:before { left: 40px; transform: rotate(-20deg); }
        .old-tv .antenna:after { left: 150px; transform: rotate(20deg); }
        .old-tv main { position: relative; display: inline-block; padding: 20px; border-radius: 8px; background: #444; border: 3px #aaa solid; box-shadow: 0 10px 8px rgba(0,0,0,0.4); vertical-align: top; }
        .old-tv main::before { content: " "; position: absolute; top: 0; left: 0; box-sizing: border-box; width: 100%; height: 100%; border-radius: 8px; border-style: solid; border-width: 80px 90px 40px 90px; border-color: rgba(0,0,0,0.4) rgba(0,0,0,0.2) rgba(0,0,0,0) rgba(0,0,0,0.2); z-index: 1; pointer-events: none; }
        .old-tv footer { position: absolute; height: 15px; bottom: -22px; left: 15px; right: 15px; background: #222; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; box-shadow: inset 0 5px 5px rgba(0,0,0,0.8), 0 2px 5px rgba(0,0,0,0.5), 0 10px 25px rgba(0,0,0,1); border-bottom: 3px #000 solid; z-index: -1; }

        /* --- Speaker --- */
        .old-tv .speaker { position: absolute; width: 140px; height: 200px; top: 50px; right: 40px; padding: 10px; box-sizing: border-box; }
        .old-tv .speaker::before { content: " "; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, rgba(0,0,0,0.2) 5px, rgba(0,0,0,0.2) 6px, transparent 6px, transparent 10px); border-radius: 20px; border: 2px #111 solid; box-shadow: 0 1px 3px rgba(255,255,255,0.5), 0 4px 15px rgba(0,0,0,0.6); }

        /* --- Control Panel --- */
        .control-panel { position: absolute; bottom: 30px; right: 20px; width: 160px; height: auto; background: #2a2a2a; border-radius: 8px; border: 2px solid #1a1a1a; box-shadow: inset 1px 1px 2px rgba(255,255,255,0.1), inset -1px -1px 2px rgba(0,0,0,0.5), 2px 2px 5px rgba(0,0,0,0.5); padding: 15px; display: flex; flex-direction: column; gap: 15px; font-family: 'Arial', sans-serif; color: #ccc; }
        .power-section { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; }
        .power-button { width: 25px; height: 25px; border-radius: 4px; background: #555; border: 1px solid #222; box-shadow: inset 0 1px 1px rgba(255,255,255,0.2), 0 2px 3px rgba(0,0,0,0.4); cursor: pointer; transition: all 0.1s ease; }
        .power-button:active { transform: translateY(1px); background: #4a4a4a; }
        .power-indicator { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #111; transition: all 0.3s ease; }
        .power-indicator.on { background: #7cfc00; box-shadow: 0 0 8px #7cfc00, 0 0 4px #7cfc00; }
        .power-indicator.standby { background: #ff4444; box-shadow: 0 0 8px #ff4444, 0 0 4px #ff4444; }
        .playback-controls { display: flex; justify-content: space-around; gap: 8px; }
        .playback-controls button { background: #444; border: 1px solid #222; color: #eee; width: 30px; height: 30px; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 2px rgba(0,0,0,0.4); transition: all 0.1s ease; font-size: 14px; }
        .playback-controls button:active { transform: translateY(1px); background: #3a3a3a; }
        .sliders-section { display: flex; flex-direction: column; gap: 10px; }
        .slider-group { display: flex; flex-direction: column; gap: 5px; }
        .slider-group label { font-size: 12px; text-align: center; color: #aaa; text-transform: uppercase; }
        input[type="range"] { -webkit-appearance: none; background: transparent; width: 100%; cursor: pointer; }
        input[type="range"]::-webkit-slider-runnable-track { height: 4px; background: #111; border-radius: 2px; border: 1px solid #000; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 8px; background: #888; border-radius: 2px; border: 1px solid #555; margin-top: -7px; box-shadow: 1px 1px 3px rgba(0,0,0,0.5); }

        /* --- Screen Effects & Content --- */
        .error-noise { position: relative; width: 580px; height: 326px; overflow: hidden; border-radius: 15px; z-index: 3; }
        .error-effect { position: absolute; width: 100%; height: 100%; border-radius: 15px; background: #111; background-image: url(data:image/png;base64,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); padding: 20px; border-radius: 8px; border-bottom: 4px #222 solid; z-index: 600; pointer-events: auto; transition: transform 0.5s ease, bottom 0.5s ease, box-shadow 0.5s ease; }
        .old-tv * { outline: none; }
        .old-tv.closeup-mode { transform: scale(1.3); bottom: 250px; z-index: 800; }
        .old-tv .antenna { position: absolute; width: 200px; height: 20px; background: #222; top: -20px; left: 240px; border-top-left-radius: 50%; border-top-right-radius: 50%; box-shadow: inset 0 5px #444, inset 0 -2px 5px #000; }
        .old-tv .antenna:before, .old-tv .antenna:after { content: " "; position: absolute; bottom: 8px; width: 12px; height: 250px; background-color: #444; background-image: linear-gradient(rgba(255,255,255,0.1), transparent); border-top-left-radius: 40%; border-top-right-radius: 40%; box-shadow: inset -1px 1px rgba(255,255,255,0.4), inset 5px 0 5px rgba(0,0,0,0.5), -8px 5px 15px rgba(0,0,0,0.5); z-index: -1; }
        .old-tv .antenna:before { left: 40px; transform: rotate(-20deg); }
        .old-tv .antenna:after { left: 150px; transform: rotate(20deg); }
        .old-tv main { position: relative; display: inline-block; padding: 20px; border-radius: 8px; background: #444; border: 3px #aaa solid; box-shadow: 0 10px 8px rgba(0,0,0,0.4); vertical-align: top; }
        .old-tv main::before { content: " "; position: absolute; top: 0; left: 0; box-sizing: border-box; width: 100%; height: 100%; border-radius: 8px; border-style: solid; border-width: 80px 90px 40px 90px; border-color: rgba(0,0,0,0.4) rgba(0,0,0,0.2) rgba(0,0,0,0) rgba(0,0,0,0.2); z-index: 1; pointer-events: none; }
        .old-tv footer { position: absolute; height: 15px; bottom: -22px; left: 15px; right: 15px; background: #222; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; box-shadow: inset 0 5px 5px rgba(0,0,0,0.8), 0 2px 5px rgba(0,0,0,0.5), 0 10px 25px rgba(0,0,0,1); border-bottom: 3px #000 solid; z-index: -1; }

        /* --- Speaker --- */
        .old-tv .speaker { position: absolute; width: 140px; height: 200px; top: 50px; right: 40px; padding: 10px; box-sizing: border-box; }
        .old-tv .speaker::before { content: " "; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, rgba(0,0,0,0.2) 5px, rgba(0,0,0,0.2) 6px, transparent 6px, transparent 10px); border-radius: 20px; border: 2px #111 solid; box-shadow: 0 1px 3px rgba(255,255,255,0.5), 0 4px 15px rgba(0,0,0,0.6); }

        /* --- Table --- */
        #table-tv { perspective: 800px; position: absolute; overflow: hidden; width: 600px; height: 300px; left: 50%; bottom: 0; margin-left: -300px; z-index: 500; pointer-events: none; transition: transform 0.5s ease, bottom 0.5s ease, opacity 0.5s ease; }
        #table-tv.closeup-mode { display: none; }
        .face { background-image: url(https://levelhard.com.br/jobs/jobs/site_television/images/table-wood-texture.jpg); background-size: 100%; }
        .scene, .shape, .face { position: absolute; transform-style: preserve-3d; }
        .scene { width: 80em; height: 80em; top: 50%; left: 50%; margin: -38em 0 0 -40em; }
        .shape { top: 50%; left: 50%; width: 0; height: 0; transform-origin: 50%; }
        .face { overflow: hidden; transform-origin: 0 0; backface-visibility: hidden; }
        [class*="cuboid"] .ft, [class*="cuboid"] .bk { width: 100%; height: 100%; }
        [class*="cuboid"] .bk { left: 100%; }
        [class*="cuboid"] .rt { transform: rotateY(-90deg) translateX(-50%); }
        [class*="cuboid"] .lt { transform: rotateY(90deg) translateX(-50%); left: 100%; }
        [class*="cuboid"] .tp { transform: rotateX(90deg) translateY(-50%); }
        [class*="cuboid"] .bm { transform: rotateX(-90deg) translateY(-50%); top: 100%; }
        .cub-1 { transform: translate3D(0em, -5em, 0em); width: 12em; height: 0.2em; margin: -0.1em 0 0 -6em; } .cub-1 .ft { transform: translateZ(2.625em); } .cub-1 .bk { transform: translateZ(-2.625em) rotateY(180deg); } .cub-1 .rt, .cub-1 .lt { width: 5.25em; height: 0.2em; } .cub-1 .tp, .cub-1 .bm { width: 12em; height: 5.25em; }
        .cub-2 { transform: translate3D(0em, -3.5em, 0em); width: 10em; height: 0.2em; margin: -0.1em 0 0 -5em; } .cub-2 .ft { transform: translateZ(2.625em); } .cub-2 .bk { transform: translateZ(-2.625em) rotateY(180deg); } .cub-2 .rt, .cub-2 .lt { width: 5.25em; height: 0.2em; } .cub-2 .tp, .cub-2 .bm { width: 10em; height: 5.25em; }
        .cub-3 { transform: translate3D(-4.0625em, -2.5em, -2.125em) rotateZ(12deg); width: 0.2em; height: 5em; margin: -2.5em 0 0 -0.1em; } .cub-3 .ft { transform: translateZ(0.1em); } .cub-3 .bk { transform: translateZ(-0.1em) rotateY(180deg); } .cub-3 .rt, .cub-3 .lt { width: 0.2em; height: 5em; } .cub-3 .tp, .cub-3 .bm { width: 0.2em; height: 0.2em; }
        .cub-4 { transform: translate3D(-4.125em, -2.5em, 2.125em) rotateZ(12deg); width: 0.2em; height: 5em; margin: -2.5em 0 0 -0.1em; } .cub-4 .ft { transform: translateZ(0.1em); } .cub-4 .bk { transform: translateZ(-0.1em) rotateY(180deg); } .cub-4 .rt, .cub-4 .lt { width: 0.2em; height: 5em; } .cub-4 .tp, .cub-4 .bm { width: 0.2em; height: 0.2em; }
        .cub-5 { transform: translate3D(4em, -2.5em, -2.125em) rotateZ(-13deg); width: 0.2em; height: 5em; margin: -2.5em 0 0 -0.1em; } .cub-5 .ft { transform: translateZ(0.1em); } .cub-5 .bk { transform: translateZ(-0.1em) rotateY(180deg); } .cub-5 .rt, .cub-5 .lt { width: 0.2em; height: 5em; } .cub-5 .tp, .cub-5 .bm { width: 0.2em; height: 0.2em; }
        .cub-6 { transform: translate3D(4em, -2.5em, 2.125em) rotateZ(-13deg); width: 0.2em; height: 5em; margin: -2.5em 0 0 -0.1em; } .cub-6 .ft { transform: translateZ(0.1em); } .cub-6 .bk { transform: translateZ(-0.1em) rotateY(180deg); } .cub-6 .rt, .cub-6 .lt { width: 0.2em; height: 5em; } .cub-6 .tp, .cub-6 .bm { width: 0.2em; height: 0.2em; }

        /* --- Media Queries --- */
        @media (max-width: 1200px) {
          .old-tv { transform: scale(0.7); bottom: 325px; }
          .old-tv.closeup-mode { transform: scale(1.2); bottom: 180px; }
          #table-tv { transform: scale(1.4); bottom: 70px; }
        }
      `}</style>
    </div>
  );
});

RetroTV.displayName = 'RetroTV';

export default RetroTV;
