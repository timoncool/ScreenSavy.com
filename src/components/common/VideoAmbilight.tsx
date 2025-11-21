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

    const mainPlayerContainerRef = useRef<HTMLDivElement>(null);
    const ambilightPlayerContainerRef = useRef<HTMLDivElement>(null);

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
        if (!mainPlayerContainerRef.current || !ambilightPlayerContainerRef.current) return;

        const playerOptions = {
            videoId,
            playerVars: {
                controls: 0,
                rel: 0,
                modestbranding: 1,
                playsinline: 1,
            } as any,
        };

        // Create temporary divs for the players to replace
        // This prevents React from losing track of the refs or dealing with replaced elements
        const mainDiv = document.createElement('div');
        const ambilightDiv = document.createElement('div');

        // Clear containers just in case
        mainPlayerContainerRef.current.innerHTML = '';
        ambilightPlayerContainerRef.current.innerHTML = '';

        mainPlayerContainerRef.current.appendChild(mainDiv);
        ambilightPlayerContainerRef.current.appendChild(ambilightDiv);

        let main: any;
        let ambilight: any;

        try {
            main = YouTubePlayer(mainDiv, playerOptions);
            ambilight = YouTubePlayer(ambilightDiv, playerOptions);
            setMainPlayer(main);
            setAmbilightPlayer(ambilight);
        } catch (error) {
            console.error('Failed to initialize YouTube player:', error);
        }

        return () => {
            try {
                if (main && typeof main.destroy === 'function') main.destroy();
                if (ambilight && typeof ambilight.destroy === 'function') ambilight.destroy();
            } catch (e) {
                console.error('Error destroying player:', e);
            }
            // The destroy method might remove the iframe, but we should ensure containers are clean
            if (mainPlayerContainerRef.current) mainPlayerContainerRef.current.innerHTML = '';
            if (ambilightPlayerContainerRef.current) ambilightPlayerContainerRef.current.innerHTML = '';
        };
    }, [videoId]);

    // Use refs to store the latest callbacks so we can use them in the stable event listeners
    const onMainPlayerStateChangeRef = useRef(onMainPlayerStateChange);
    const onAmbilightPlayerReadyRef = useRef(onAmbilightPlayerReady);
    const onAmbilightPlayerStateChangeRef = useRef(onAmbilightPlayerStateChange);

    useEffect(() => {
        onMainPlayerStateChangeRef.current = onMainPlayerStateChange;
        onAmbilightPlayerReadyRef.current = onAmbilightPlayerReady;
        onAmbilightPlayerStateChangeRef.current = onAmbilightPlayerStateChange;
    }, [onMainPlayerStateChange, onAmbilightPlayerReady, onAmbilightPlayerStateChange]);

    useEffect(() => {
        if (!mainPlayer || !ambilightPlayer) return;

        const handleMainStateChange = (e: any) => onMainPlayerStateChangeRef.current(e);
        const handleAmbilightReady = (e: any) => onAmbilightPlayerReadyRef.current(e);
        const handleAmbilightStateChange = (e: any) => onAmbilightPlayerStateChangeRef.current(e);

        mainPlayer.on('stateChange', handleMainStateChange);
        ambilightPlayer.on('ready', handleAmbilightReady);
        ambilightPlayer.on('stateChange', handleAmbilightStateChange);

        // We rely on player.destroy() to clean up listeners
    }, [mainPlayer, ambilightPlayer]);

    return (
        <>
            <div className={`video-wrapper ${className} ${classNames.videoWrapper}`}>
                <div className={`ambilight-wrapper ${classNames.ambilightWrapper}`}>
                    <div className={`aspect-ratio ${classNames.aspectRatio}`}>
                        <div ref={ambilightPlayerContainerRef} className={`ambilight ${classNames.ambilight}`} />
                        <div ref={mainPlayerContainerRef} className={`ambilight-video ${classNames.ambilightVideo}`} />
                    </div>
                </div>
            </div>
            <style jsx>{`
                .video-wrapper {
                    position: relative;
                    width: 100%;
                    height: 0;
                    padding-bottom: 56.25%; /* 16:9 aspect ratio */
                }
                .ambilight-wrapper {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                .aspect-ratio {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                .ambilight {
                    position: absolute;
                    top: -10%;
                    left: -10%;
                    width: 120%;
                    height: 120%;
                    filter: blur(20px) brightness(1.5);
                    z-index: 1;
                }
                .ambilight-video {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 2;
                }
            `}</style>
        </>
    );
});

VideoAmbilight.displayName = 'VideoAmbilight';

export default VideoAmbilight;
