// src/components/common/VideoAmbilight.tsx
"use client";
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import YouTubePlayer from 'youtube-player';

// Define PlayerState enum
export enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    VIDEO_CUED = 5,
}

// Define props interface
interface VideoAmbilightProps {
    videoId: string;
    className?: string;
    classNames?: {
        videoWrapper?: string;
        ambilightWrapper?: string;
        aspectRatio?: string;
        ambilight?: string;
        ambilightVideo?: string;
    };
}

// Define exposed methods interface
export interface VideoAmbilightRef {
    playVideo: () => void;
    pauseVideo: () => void;
    setVolume: (volume: number) => void;
}

const VideoAmbilight = forwardRef<VideoAmbilightRef, VideoAmbilightProps>(({ videoId, className, classNames = {} }, ref) => {
    const [mainPlayer, setMainPlayer] = useState<any>(null);
    const [ambilightPlayer, setAmbilightPlayer] = useState<any>(null);

    const mainPlayerId = `youtube-player-${videoId}-main`;
    const ambilightPlayerId = `youtube-player-${videoId}-ambilight`;

    // Expose player controls to parent component
    useImperativeHandle(ref, () => ({
        playVideo: () => {
            mainPlayer?.playVideo();
        },
        pauseVideo: () => {
            mainPlayer?.pauseVideo();
        },
        setVolume: (volume: number) => {
            mainPlayer?.setVolume(volume);
        },
    }));

    // Animation frame handling for synchronization
    const animationFrameRef = useRef<number>();
    const lastTimeRef = useRef<number>();

    const animate = useCallback((time: number) => {
        if (lastTimeRef.current != null) {
            const deltaTime = time - lastTimeRef.current;
            // Sync logic can be added here if needed
        }
        lastTimeRef.current = time;
        animationFrameRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [animate]);

    // Player event handlers
    const onMainPlayerStateChange = useCallback((event: any) => {
        switch (event.data) {
            case PlayerState.PLAYING:
                ambilightPlayer?.seekTo(event.target.getCurrentTime(), true);
                ambilightPlayer?.playVideo();
                break;
            case PlayerState.PAUSED:
                ambilightPlayer?.seekTo(event.target.getCurrentTime(), true);
                ambilightPlayer?.pauseVideo();
                break;
        }
    }, [ambilightPlayer]);

    const onAmbilightPlayerReady = useCallback((event: any) => {
        const availableQualityLevels = event.target.getAvailableQualityLevels();
        event.target.mute();
        if (availableQualityLevels?.length > 0) {
            availableQualityLevels.reverse();
            const bestQuality = availableQualityLevels.find((q: string) => q !== 'auto');
            if (bestQuality) {
                event.target.setPlaybackQuality(bestQuality);
            }
        }
    }, []);

    const onAmbilightPlayerStateChange = useCallback((event: any) => {
        if (event.data === PlayerState.PLAYING || event.data === PlayerState.BUFFERING) {
            onAmbilightPlayerReady(event);
        }
    }, [onAmbilightPlayerReady]);

    // Initialize players
    useEffect(() => {
        const main = YouTubePlayer(mainPlayerId, { videoId });
        const ambilight = YouTubePlayer(ambilightPlayerId, { videoId });

        setMainPlayer(main);
        setAmbilightPlayer(ambilight);

        return () => {
            main.destroy();
            ambilight.destroy();
        };
    }, [videoId, mainPlayerId, ambilightPlayerId]);

    // Attach event listeners
    useEffect(() => {
        if (mainPlayer) {
            mainPlayer.on('stateChange', onMainPlayerStateChange);
        }
        if (ambilightPlayer) {
            ambilightPlayer.on('ready', onAmbilightPlayerReady);
            ambilightPlayer.on('stateChange', onAmbilightPlayerStateChange);
        }

        return () => {
            mainPlayer?.off('stateChange', onMainPlayerStateChange);
            ambilightPlayer?.off('ready', onAmbilightPlayerReady);
            ambilightPlayer?.off('stateChange', onAmbilightPlayerStateChange);
        }
    }, [mainPlayer, ambilightPlayer, onMainPlayerStateChange, onAmbilightPlayerReady, onAmbilightPlayerStateChange]);

    return (
        <div className={`video-wrapper ${className} ${classNames.videoWrapper}`}>
            <div className={`ambilight-wrapper ${classNames.ambilightWrapper}`}>
                <div className={`aspect-ratio ${classNames.aspectRatio}`}>
                    <div id={ambilightPlayerId} className={`ambilight ${classNames.ambilight}`} />
                    <div id={mainPlayerId} className={`ambilight-video ${classNames.ambilightVideo}`} />
                </div>
            </div>
        </div>
    );
});

VideoAmbilight.displayName = 'VideoAmbilight';

export default VideoAmbilight;
