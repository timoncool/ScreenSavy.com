// src/components/common/VideoAmbilight.tsx
"use client";
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import YouTube from 'react-youtube';

// Exposed methods interface
export interface VideoAmbilightRef {
    playVideo: () => void;
    pauseVideo: () => void;
    setVolume: (volume: number) => void;
}

// Props interface
interface VideoAmbilightProps {
    videoId: string;
}

const VideoAmbilight = forwardRef<VideoAmbilightRef, VideoAmbilightProps>(({ videoId }, ref) => {
    const playerRef = useRef<any>(null);

    // Expose player controls
    useImperativeHandle(ref, () => ({
        playVideo: () => playerRef.current?.internalPlayer.playVideo(),
        pauseVideo: () => playerRef.current?.internalPlayer.pauseVideo(),
        setVolume: (volume: number) => playerRef.current?.internalPlayer.setVolume(volume),
    }));

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            controls: 0,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            loop: 1,
        },
    };

    return (
        <div className="video-container">
            <div className="ambilight-backdrop">
                <YouTube videoId={videoId} opts={opts} />
            </div>
            <div className="main-video">
                <YouTube videoId={videoId} opts={opts} ref={playerRef} />
            </div>
            <style jsx>{`
                .video-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #000;
                    overflow: hidden;
                }
                .ambilight-backdrop {
                    position: absolute;
                    top: -25%;
                    left: -25%;
                    width: 150%;
                    height: 150%;
                    z-index: 1;
                    filter: blur(40px) brightness(0.9) saturate(1.5);
                    opacity: 0.7;
                    transform: scale(1.1);
                }
                .main-video {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 2;
                    border-radius: 15px; /* Ensure main video has rounded corners */
                    overflow: hidden; /* Clip content to rounded corners */
                }
            `}</style>
        </div>
    );
});

VideoAmbilight.displayName = 'VideoAmbilight';

export default VideoAmbilight;
