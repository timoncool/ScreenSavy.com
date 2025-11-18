'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

export interface RetroTVRef {
  setVideoId: (id: string) => void;
}

const RetroTV = forwardRef<RetroTVRef>((props, ref) => {
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [volume, setVolume] = useState(50);
  const [channel, setChannel] = useState(50);
  const playerRef = useRef<any>(null);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    setVideoId: (id: string) => {
      setCurrentVideoId(id);
      setIsPoweredOn(true);
    }
  }));

  // Calculate effects based on sliders
  const brightness = 0.8 + (volume / 100) * 0.4; // 0.8 to 1.2
  const contrast = 1.0 + (channel / 100) * 0.5; // 1.0 to 1.5

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ((window as any).YT && (window as any).YT.Player) {
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  // Initialize YouTube player
  useEffect(() => {
    if (!currentVideoId || typeof window === 'undefined' || !isPoweredOn) {
      if (playerRef.current && !isPoweredOn) {
        playerRef.current.pauseVideo?.();
      }
      return;
    }

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.loadVideoById(currentVideoId);
        playerRef.current.playVideo?.();
        return;
      }

      if ((window as any).YT && (window as any).YT.Player) {
        playerRef.current = new (window as any).YT.Player('youtube-player', {
          videoId: currentVideoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            disablekb: 1,
          },
          events: {
            onReady: (event: any) => {
              event.target.playVideo();
            }
          }
        });
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }
  }, [currentVideoId, isPoweredOn]);

  return (
    <>
      <div className="gradient" />
      <div className="brick-wall" />
      <div className="wood-floor" />

      <div className={`old-tv ${!isPoweredOn ? 'powered-off' : ''}`}>
        <div className="antenna" />
        <main>
          <div className="error-noise">
            <div className="error-effect">
              <div
                className="old-tv-content"
                style={{
                  filter: `brightness(${brightness}) contrast(${contrast})`,
                }}
              >
                {currentVideoId && isPoweredOn ? (
                  <div id="youtube-player" className="youtube-container" />
                ) : (
                  <div className="static-noise" />
                )}
              </div>
            </div>
          </div>
        </main>
        <div className="speaker" />
        <div className="volume">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
        <nav className="channel">
          <input
            type="range"
            min="0"
            max="100"
            value={channel}
            onChange={(e) => setChannel(Number(e.target.value))}
          />
        </nav>
        <nav className="power">
          <button onClick={() => setIsPoweredOn(!isPoweredOn)} type="button" />
        </nav>
        <nav />
        <footer />
      </div>

      <div id="table-tv">
        <div className="scene" style={{ transform: 'rotateX(-12deg) rotateY(0deg)' }}>
          <div className="shape cuboid-1 cub-1">
            <div className="face ft" style={{ boxShadow: 'inset 0 1px rgba(255,255,255,0.2)' }} />
            <div className="face bk" />
            <div className="face rt" />
            <div className="face lt" />
            <div className="face bm" />
            <div className="face tp" style={{ boxShadow: 'inset 0 100px 20px rgba(0,0,0,0.3), inset 0 300px rgba(0,0,0,0.3)' }} />
          </div>
          <div className="shape cuboid-3 cub-3">
            <div className="face ft" style={{ boxShadow: 'inset 0 300px rgba(0,0,0,0.6), 10px 2px 10px rgba(0,0,0,0.8)' }} />
            <div className="face bk" />
            <div className="face rt" />
            <div className="face lt" style={{ boxShadow: 'inset 0 300px rgba(0,0,0,0.8)' }} />
            <div className="face bm" />
            <div className="face tp" />
          </div>
          <div className="shape cuboid-4 cub-4">
            <div className="face ft" style={{ boxShadow: 'inset 0 20px 5px rgba(0,0,0,0.6), 5px 2px 8px rgba(0,0,0,0.4)' }} />
            <div className="face bk" />
            <div className="face rt" />
            <div className="face lt" style={{ boxShadow: 'inset 0 300px rgba(0,0,0,0.3)' }} />
            <div className="face bm" />
            <div className="face tp" />
          </div>
          <div className="shape cuboid-5 cub-5">
            <div className="face ft" style={{ boxShadow: 'inset 0 300px rgba(0,0,0,0.6), -10px 2px 10px rgba(0,0,0,0.8)' }} />
            <div className="face bk" />
            <div className="face rt" style={{ boxShadow: 'inset 0 300px rgba(0,0,0,0.8)' }} />
            <div className="face lt" />
            <div className="face bm" />
            <div className="face tp" />
          </div>
          <div className="shape cuboid-6 cub-6">
            <div className="face ft" style={{ boxShadow: 'inset 0 20px 5px rgba(0,0,0,0.6), -5px 2px 8px rgba(0,0,0,0.4)' }} />
            <div className="face bk" />
            <div className="face rt" style={{ boxShadow: 'inset 0 300px rgba(0,0,0,0.3)' }} />
            <div className="face lt" />
            <div className="face bm" />
            <div className="face tp" />
          </div>
          <div className="shape cuboid-2 cub-2">
            <div className="face ft" style={{ boxShadow: 'inset 0 1px rgba(255,255,255,0.2)' }} />
            <div className="face bk" />
            <div className="face rt" />
            <div className="face lt" />
            <div className="face bm" />
            <div className="face tp" style={{ boxShadow: 'inset 0 50px 20px rgba(0,0,0,0.5), inset 0 150px rgba(0,0,0,0.4)' }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        body {
          padding: 0;
          margin: 0;
        }

        .gradient {
          position: fixed;
          content: " ";
          width: 100%;
          height: 100%;
          background: linear-gradient(
              to left,
              rgba(0, 0, 0, 0.8) 0%,
              transparent 20%,
              transparent 80%,
              rgba(0, 0, 0, 0.8) 100%
            ),
            radial-gradient(transparent 50%, rgba(0, 0, 0, 0.8));
          z-index: 5;
          pointer-events: none;
        }

        .gradient::before {
          position: fixed;
          content: " ";
          width: 2500px;
          height: 300px;
          bottom: 5px;
          left: 50%;
          margin-left: -1250px;
          background: radial-gradient(rgba(0, 0, 0, 0.5) 25%, transparent 50%);
        }

        .gradient::after {
          position: fixed;
          content: " ";
          width: 2000px;
          height: 1500px;
          bottom: -300px;
          left: 50%;
          margin-left: -1000px;
          background: radial-gradient(rgba(0, 0, 0, 0.6) 30%, transparent 50%);
        }

        .brick-wall {
          position: fixed;
          content: " ";
          top: 0;
          left: 0;
          right: 0;
          bottom: 140px;
          background: url(https://levelhard.com.br/jobs/jobs/site_television/images/wall_brick_texture.jpg);
          background-size: 400px;
          box-shadow: 0 8px 10px rgba(0, 0, 0, 0.8);
          z-index: 2;
        }

        .brick-wall:before {
          position: absolute;
          content: " ";
          bottom: 0;
          width: 100%;
          height: 30px;
          background: url(https://levelhard.com.br/jobs/jobs/site_television/images/footer_wood_texture.jpg);
          background-size: 200px;
          box-shadow: inset 0 2px rgba(255, 255, 255, 0.2),
            inset 0 -5px 5px rgba(0, 0, 0, 0.2), 0 -1px 4px rgba(0, 0, 0, 0.9);
        }

        .wood-floor {
          position: fixed;
          content: " ";
          width: 100%;
          height: 140px;
          bottom: 0;
          left: 0;
          perspective: 300px;
          overflow: hidden;
          z-index: 1;
        }

        .wood-floor::before {
          position: absolute;
          content: " ";
          top: -100%;
          left: -25%;
          width: 150%;
          height: 250%;
          background: url(https://levelhard.com.br/jobs/jobs/site_television/images/wood_floor_texture.jpg);
          background-size: 400px;
          transform: rotateX(60deg);
        }

        .old-tv * {
          outline: none;
        }

        .old-tv {
          position: absolute;
          width: 870px;
          height: 465px;
          bottom: 450px;
          left: 50%;
          margin-left: -455px;
          background: #333;
          background-image: url(data:image/png;base64,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);
          padding: 20px;
          border-radius: 8px;
          border-bottom: 4px #222 solid;
          box-shadow: inset 0 -220px 200px rgba(0, 0, 0, 0.5),
            50px 2px 20px rgba(0, 0, 0, 0.4), -50px 2px 20px rgba(0, 0, 0, 0.4);
          transform: scale(0.8);
          z-index: 600;
        }

        .old-tv::after {
          content: " ";
          position: absolute;
          top: 54px;
          left: 52px;
          width: 600px;
          height: 400px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 5% / 50%;
          filter: blur(30px);
          z-index: 100;
          animation: screen 800ms infinite linear;
          pointer-events: none;
        }

        @keyframes screen {
          0% {
            transform: scale(1.03);
          }
          50% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.03);
          }
        }

        .old-tv .antenna {
          position: absolute;
          width: 200px;
          height: 20px;
          background: #222;
          top: -20px;
          left: 240px;
          border-top-left-radius: 50%;
          border-top-right-radius: 50%;
          box-shadow: inset 0 5px #444, inset 0 -2px 5px #000;
        }

        .old-tv .antenna:before {
          content: " ";
          position: absolute;
          bottom: 8px;
          left: 40px;
          width: 12px;
          height: 250px;
          background-color: #444;
          background-image: linear-gradient(rgba(255, 255, 255, 0.1), transparent);
          transform: rotate(-20deg);
          border-top-left-radius: 40%;
          border-top-right-radius: 40%;
          box-shadow: inset -1px 1px rgba(255, 255, 255, 0.4),
            inset 5px 0 5px rgba(0, 0, 0, 0.5), -8px 5px 15px rgba(0, 0, 0, 0.5);
          z-index: -1;
        }

        .old-tv .antenna:after {
          content: " ";
          position: absolute;
          bottom: 8px;
          left: 150px;
          width: 12px;
          height: 250px;
          background: #444;
          background-image: linear-gradient(rgba(255, 255, 255, 0.1), transparent);
          transform: rotate(20deg);
          border-top-left-radius: 40%;
          border-top-right-radius: 40%;
          box-shadow: inset -1px 1px rgba(255, 255, 255, 0.4),
            inset 5px 0 5px rgba(0, 0, 0, 0.5), -10px 5px 15px rgba(0, 0, 0, 0.5);
          z-index: -1;
        }

        .old-tv main {
          position: relative;
          display: inline-block;
          padding: 30px;
          border-radius: 8px;
          background: #444;
          border: 3px #aaa solid;
          box-shadow: 0 10px 8px rgba(0, 0, 0, 0.4);
          vertical-align: top;
        }

        .old-tv main::before {
          content: " ";
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border-radius: 8px;
          border-style: solid;
          border-width: 80px 90px 77px 90px;
          border-color: rgba(0, 0, 0, 0.4) rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0)
            rgba(0, 0, 0, 0.2);
          z-index: 1;
          pointer-events: none;
        }

        .old-tv main::after {
          content: " ";
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          background: radial-gradient(rgba(0, 0, 0, 0.7) 50%, transparent 100%),
            linear-gradient(rgba(0, 0, 0, 0.1) 10%, transparent);
          z-index: 2;
          pointer-events: none;
        }

        .old-tv .speaker {
          position: absolute;
          width: 200px;
          height: 260px;
          top: 20px;
          right: 20px;
          padding: 10px;
          box-sizing: border-box;
        }

        .old-tv .speaker::before {
          content: " ";
          position: absolute;
          top: 0%;
          left: 15px;
          right: 0%;
          bottom: 0%;
          background: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.1) 0px,
            rgba(0, 0, 0, 0.2) 5px,
            rgba(0, 0, 0, 0.2) 6px,
            rgba(0, 0, 0, 0) 5px,
            rgba(0, 0, 0, 0.6) 10px
          );
          border-radius: 20px;
          border: 2px #111 solid;
          box-shadow: 0 1px 3px rgba(255, 255, 255, 0.5),
            0 4px 15px rgba(0, 0, 0, 0.6);
          z-index: 2;
        }

        .old-tv .speaker::after {
          content: " ";
          position: absolute;
          height: 200px;
          left: 50px;
          right: 38px;
          bottom: 30px;
          background: #222;
          border-radius: 100% / 100%;
          box-shadow: inset 0 1px rgba(0, 0, 0, 1);
          opacity: 0.1;
          z-index: 1;
        }

        .old-tv .volume {
          position: absolute;
          width: 180px;
          height: 40px;
          right: 20px;
          bottom: 145px;
          border-radius: 4px;
          box-shadow: inset 2px 2px rgba(255, 255, 255, 0.1),
            inset -2px -2px rgba(0, 0, 0, 0.3), 0 1px 1px rgba(255, 255, 255, 0.2),
            0 4px 10px rgba(0, 0, 0, 0.4);
          border: 2px #000 solid;
        }

        .old-tv .channel {
          position: absolute;
          width: 180px;
          height: 40px;
          right: 20px;
          bottom: 90px;
          border-radius: 4px;
          box-shadow: inset 2px 2px rgba(255, 255, 255, 0.1),
            inset -2px -2px rgba(0, 0, 0, 0.3), 0 1px 1px rgba(255, 255, 255, 0.2),
            0 4px 10px rgba(0, 0, 0, 0.4);
          border: 2px #000 solid;
        }

        .old-tv input[type="range"] {
          -webkit-appearance: none;
          position: absolute;
          width: 80%;
          left: 10%;
          box-sizing: border-box;
          background: none;
          margin: 18px 0;
          cursor: pointer;
        }

        .old-tv input[type="range"]:focus {
          outline: none;
        }

        .old-tv input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 5px;
          cursor: pointer;
          box-shadow: 1px 1px 1px rgba(255, 255, 255, 0.2);
          background: #000;
          border-radius: 1.3px;
        }

        .old-tv input[type="range"]::-webkit-slider-thumb {
          height: 25px;
          width: 10px;
          border-radius: 2px;
          background-color: #444;
          background-image: linear-gradient(rgba(255, 255, 255, 0.1), transparent);
          box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.2),
            1px 1px 6px rgba(0, 0, 0, 1);
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -10px;
        }

        .old-tv .power {
          position: absolute;
          width: 180px;
          height: 60px;
          right: 20px;
          bottom: 15px;
          border-radius: 4px;
          box-shadow: inset 2px 2px rgba(255, 255, 255, 0.1),
            inset -2px -2px rgba(0, 0, 0, 0.3), 0 1px 1px rgba(255, 255, 255, 0.2),
            0 4px 10px rgba(0, 0, 0, 0.4);
          border: 2px #000 solid;
        }

        .old-tv .power > button {
          position: relative;
          width: 70px;
          height: 40px;
          top: 10px;
          left: 10px;
          background-color: #333;
          background-image: linear-gradient(rgba(255, 255, 255, 0.05), transparent);
          border-radius: 4px;
          box-shadow: inset 1px 1px rgba(255, 255, 255, 0.1),
            inset 1px 1px rgba(255, 255, 255, 0.1),
            inset -1px -1px rgba(0, 0, 0, 0.3), 0 1px 1px rgba(255, 255, 255, 0.2);
          border: 2px #000 solid;
          cursor: pointer;
        }

        .old-tv .power::after {
          content: " Power ";
          position: absolute;
          font-family: Arial;
          font-size: 10px;
          color: #ccc;
          width: 5px;
          height: 5px;
          top: 18px;
          left: 100px;
          bottom: 30px;
          background: ${isPoweredOn ? '#7cfc00' : '#a52a2a'};
          box-shadow: ${isPoweredOn ? '0 0 10px #7cfc00, 0 0 5px #7cfc00' : 'none'};
          border: 1px ${isPoweredOn ? '#7cfc00' : '#111'} solid;
          border-radius: 50%;
          line-height: 5px;
          text-indent: 12px;
          text-shadow: 0 1px #000;
        }

        .old-tv .power::before {
          content: " Standby ";
          position: absolute;
          font-family: Arial;
          font-size: 10px;
          color: #ccc;
          width: 5px;
          height: 5px;
          top: 38px;
          left: 100px;
          bottom: 30px;
          background: ${!isPoweredOn ? '#ff4444' : '#a52a2a'};
          box-shadow: ${!isPoweredOn ? '0 0 10px #ff4444, 0 0 5px #ff4444' : 'none'};
          border: 1px ${!isPoweredOn ? '#ff4444' : '#111'} solid;
          border-radius: 50%;
          line-height: 5px;
          text-indent: 12px;
          text-shadow: 0 1px #000;
        }

        .old-tv footer {
          position: absolute;
          height: 15px;
          bottom: -22px;
          left: 15px;
          right: 15px;
          background: #222;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          box-shadow: inset 0 5px 5px rgba(0, 0, 0, 0.8),
            0 2px 5px rgba(0, 0, 0, 0.5), 0 10px 25px rgba(0, 0, 0, 1);
          border-bottom: 3px #000 solid;
          z-index: -1;
        }

        .error-noise {
          position: relative;
          width: 600px;
          height: 400px;
          overflow: hidden;
          border-radius: 5% / 50%;
          z-index: 3;
        }

        .error-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50% / 5%;
          background: #111;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c8TV1mAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAFVklEQVR4XpWWB67c2BUFb3g557T/hRo9/WUMZHlgr4Bg8Z4qQgQJlHI4A8SzFVrapvmTF9O7dmYRFZ60YiBhJRCgh1FYhiLAmdvX0CzTOpNE77ME0Zty/nWWzchDtiqrmQDeuv3powQ5ta2eN0FY0InkqDD73lT9c9lEzwUNqgFHs9VQce3TVClFCQrSTfOiYkVJQBmpbq2L6iZavPnAPcoU0dSw0SUTqz/GtrGuXfbyyBniKykOWQWGqwwMA7QiYAxi+IlPdqo+hYHnUt5ZPfnsHJyNiDtnpJyayNBkF6cWoYGAMY92U2hXHF/C1M8uP/ZtYdiuj26UdAdQQSXQErwSOMzt/XWRWAz5GuSBIkwG1H3FabJ2OsUOUhGC6tK4EMtJO0ttC6IBD3kM0ve0tJwMdSfjZo+EEISaeTr9P3wYrGjXqyC1krcKdhMpxEnt5JetoulscpyzhXN5FRpuPHvbeQaKxFAEB6EN+cYN6xD7RYGpXpNndMmZgM5Dcs3YSNFDHUo2LGfZuukSWyUYirJAdYbF3MfqEKmjM+I2EfhA94iG3L7uKrR+GdWD73ydlIB+6hgref1QTlmgmbM3/LeX5GI1Ux1RWpgxpLuZ2+I+IjzZ8wqE4nilvQdkUdfhzI5QDWy+kw5Wgg2pGpeEVeCCA7b85BO3F9DzxB3cdqvBzWcmzbyMiqhzuYqtHRVG2y4x+KOlnyqla8AoWWpuBoYRxzXrfKuILl6SfiWCbjxoZJUaCBj1CjH7GIaDbc9kqBY3W/Rgjda1iqQcOJu2WW+76pZC9QG7M00dffe9hNnseupFL53r8F7YHSwJWUKP2q+k7RdsxyOB11n0xtOvnW4irMMFNV4H0uqwS5ExsmP9AxbDTc9JwgneAT5vTiUSm1E7BSflSt3bfa1tv8Di3R8n3Af7MNWzs49hmauE2wP+ttrq+AsWpFG2awvsuOqbipWHgtuvuaAE+A1Z/7gC9hesnr+7wqCwG8c5yAg3AL1fm8T9AZtp/bbJGwl1pNrE7RuOX7PeMRUERVaPpEs+yqeoSmuOlokqw49pgomjLeh7icHNlG19yjs6XXOMedYm5xH2YxpV2tc0Ro2jJfxC50ApuxGob7lMsxfTbeUv07TyYxpeLucEH1gNd4IKH2LAg5TdVhlCafZvpskfncCfx8pOhJzd76bJWeYFnFciwcYfubRc12Ip/ppIhA1/mSZ/RxjFDrJC5xifFjJpY2Xl5zXdguFqYyTR1zSp1Y9p+tktDYYSNflcxI0iyO4TPBdlRcpeqjK/piF5bklq77VSEaA+z8qmJTFzIWiitbnzR794USKBUaT0NTEsVjZqLaFVqJoPN9ODG70IPbfBHKK+/q/AWR0tJzYHRULOa4MP+W/HfGadZUbfw177G7j/OGbIs8TahLyynl4X4RinF793Oz+BU0saXtUHrVBFT/DnA3ctNPoGbs4hRIjTok8i+algT1lTHi4SxFvONKNrgQFAq2/gFnWMXgwffgYMJpiKYkmW3tTg3ZQ9Jq+f8XN+A5eeUKHWvJWJ2sgJ1Sop+wwhqFVijqWaJhwtD8MNlSBeWNNWTa5Z5kPZw5+LbVT99wqTdx29lMUH4OIG/D86ruKEauBjvH5xy6um/Sfj7ei6UUVk4AIl3MyD4MSSTOFgSwsH/QJWaQ5as7ZcmgBZkzjjU1UrQ74ci1gWBCSGHtuV1H2mhSnO3Wp/3fEV5a+4wz//6qy8JxjZsmxxy5+4w9CDNJY09T072iKG0EnOS0arEYgXqYnXcYHwjTtUNAcMelOd4xpkoqiTYICWFq0JSiPfPDQdnt+4/wuqcXY47QILbgAAAABJRU5ErkJggg==);
          background-size: 80%;
          animation: noise 200ms infinite linear;
        }

        .error-effect::before {
          content: " ";
          position: absolute;
          width: 100%;
          height: 20%;
          background: rgba(255, 255, 255, 0.2);
          animation: noiseeffect 4000ms infinite linear;
          border-radius: 50% / 5%;
          pointer-events: none;
        }

        .error-effect::after {
          content: " ";
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(transparent 50%, rgba(0, 0, 0, 0.8)),
            linear-gradient(rgba(255, 255, 255, 0.4) 10%, transparent);
          box-shadow: inset 0 5px 25px rgba(255, 255, 255, 0.2),
            inset 5px 0 15px rgba(255, 255, 255, 0.2),
            inset -5px 0 15px rgba(255, 255, 255, 0.1), 0 0 10px rgba(0, 0, 0, 1),
            inset 0 200px 5px rgba(255, 255, 255, 0.05);
          border-radius: 50% / 5%;
          pointer-events: none;
        }

        .old-tv-content {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: transparent;
          border-radius: 50% / 5%;
          animation: crt-image 20ms alternate infinite;
          transition: filter 0.2s ease;
        }

        .youtube-container {
          position: absolute;
          width: 120%;
          height: 120%;
          top: -10%;
          left: -10%;
          border-radius: 50% / 5%;
          overflow: hidden;
        }

        .youtube-container :global(iframe) {
          width: 100%;
          height: 100%;
          border: none;
        }

        .static-noise {
          position: absolute;
          width: 100%;
          height: 100%;
          background: repeating-radial-gradient(
            circle at 50% 50%,
            #fff 0%,
            #000 0.0001%,
            #fff 0.0002%
          );
          animation: static 0.1s infinite steps(10);
          opacity: 0.8;
        }

        @keyframes static {
          0% { background-position: 0 0; }
          10% { background-position: -5% -10%; }
          20% { background-position: -15% 5%; }
          30% { background-position: 7% -25%; }
          40% { background-position: 20% 25%; }
          50% { background-position: -25% 10%; }
          60% { background-position: 15% -20%; }
          70% { background-position: -10% 15%; }
          80% { background-position: 25% -5%; }
          90% { background-position: -20% 20%; }
          100% { background-position: 10% -15%; }
        }

        .old-tv-content::after {
          content: " ";
          position: absolute;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(0, #fff, #fff 2px, transparent 4px);
          opacity: 0.15;
          border-radius: 50% / 5%;
          animation: crt-pixels 20ms alternate infinite;
          pointer-events: none;
        }

        @keyframes crt-image {
          0% {
            transform: translateY(-1px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes crt-pixels {
          0% {
            transform: translateY(-3px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes noise {
          0% {
            background-position: 0px 1000px;
          }
          50% {
            background-position: -1000px;
          }
          100% {
            background-position: 100px 0px;
          }
        }

        @keyframes noiseeffect {
          0% {
            top: -20%;
            opacity: 0;
          }
          20% {
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          80% {
            opacity: 0;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }

        #table-tv {
          perspective: 800px;
          position: absolute;
          overflow: hidden;
          width: 600px;
          height: 300px;
          left: 50%;
          bottom: 90px;
          margin-left: -300px;
          background: transparent;
          font-size: 250%;
          transform: scale(2);
          z-index: 500;
          pointer-events: none;
        }

        .face {
          background-image: url(https://levelhard.com.br/jobs/jobs/site_television/images/table-wood-texture.jpg);
          background-size: 100%;
        }

        .scene,
        .shape,
        .face,
        .face-wrapper,
        .cr {
          position: absolute;
          transform-style: preserve-3d;
        }

        .scene {
          width: 80em;
          height: 80em;
          top: 50%;
          left: 50%;
          margin: -38em 0 0 -40em;
        }

        .shape {
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          transform-origin: 50%;
        }

        .face,
        .face-wrapper {
          overflow: hidden;
          transform-origin: 0 0;
          backface-visibility: hidden;
        }

        .face {
          background-size: 100% 100% !important;
          background-position: center;
        }

        .side {
          left: 50%;
        }

        .cr,
        .cr .side {
          height: 100%;
        }

        [class*="cuboid"] .ft,
        [class*="cuboid"] .bk {
          width: 100%;
          height: 100%;
        }

        [class*="cuboid"] .bk {
          left: 100%;
        }

        [class*="cuboid"] .rt {
          transform: rotateY(-90deg) translateX(-50%);
        }

        [class*="cuboid"] .lt {
          transform: rotateY(90deg) translateX(-50%);
        }

        [class*="cuboid"] .tp {
          transform: rotateX(90deg) translateY(-50%);
        }

        [class*="cuboid"] .bm {
          transform: rotateX(-90deg) translateY(-50%);
        }

        [class*="cuboid"] .lt {
          left: 100%;
        }

        [class*="cuboid"] .bm {
          top: 100%;
        }

        .cub-1 {
          transform: translate3D(0em, -5em, 0em) rotateX(0deg) rotateY(0deg)
            rotateZ(0deg);
          opacity: 1;
          width: 12em;
          height: 0.2em;
          margin: -0.1em 0 0 -6em;
        }

        .cub-1 .ft {
          transform: translateZ(2.625em);
        }

        .cub-1 .bk {
          transform: translateZ(-2.625em) rotateY(180deg);
        }

        .cub-1 .rt,
        .cub-1 .lt {
          width: 5.25em;
          height: 0.2em;
        }

        .cub-1 .tp,
        .cub-1 .bm {
          width: 12em;
          height: 5.25em;
        }

        .cub-1 .face {
          background-color: #ffffff;
        }

        .cub-3 {
          transform: translate3D(-4.0625em, -2.5em, -2.125em) rotateX(0deg)
            rotateY(0deg) rotateZ(12deg);
          opacity: 1;
          width: 0.2em;
          height: 5em;
          margin: -2.5em 0 0 -0.1em;
        }

        .cub-3 .ft {
          transform: translateZ(0.1em);
        }

        .cub-3 .bk {
          transform: translateZ(-0.1em) rotateY(180deg);
        }

        .cub-3 .rt,
        .cub-3 .lt {
          width: 0.2em;
          height: 5em;
        }

        .cub-3 .tp,
        .cub-3 .bm {
          width: 0.2em;
          height: 0.2em;
        }

        .cub-3 .face {
          background-color: #ffffff;
        }

        .cub-4 {
          transform: translate3D(-4.125em, -2.5em, 2.125em) rotateX(0deg)
            rotateY(0deg) rotateZ(12deg);
          opacity: 1;
          width: 0.2em;
          height: 5em;
          margin: -2.5em 0 0 -0.1em;
        }

        .cub-4 .ft {
          transform: translateZ(0.1em);
        }

        .cub-4 .bk {
          transform: translateZ(-0.1em) rotateY(180deg);
        }

        .cub-4 .rt,
        .cub-4 .lt {
          width: 0.2em;
          height: 5em;
        }

        .cub-4 .tp,
        .cub-4 .bm {
          width: 0.2em;
          height: 0.2em;
        }

        .cub-4 .face {
          background-color: #ffffff;
        }

        .cub-5 {
          transform: translate3D(4em, -2.5em, -2.125em) rotateX(0deg) rotateY(0deg)
            rotateZ(-13deg);
          opacity: 1;
          width: 0.2em;
          height: 5em;
          margin: -2.5em 0 0 -0.1em;
        }

        .cub-5 .ft {
          transform: translateZ(0.1em);
        }

        .cub-5 .bk {
          transform: translateZ(-0.1em) rotateY(180deg);
        }

        .cub-5 .rt,
        .cub-5 .lt {
          width: 0.2em;
          height: 5em;
        }

        .cub-5 .tp,
        .cub-5 .bm {
          width: 0.2em;
          height: 0.2em;
        }

        .cub-5 .face {
          background-color: #ffffff;
        }

        .cub-6 {
          transform: translate3D(4em, -2.5em, 2.125em) rotateX(0deg) rotateY(0deg)
            rotateZ(-13deg);
          opacity: 1;
          width: 0.2em;
          height: 5em;
          margin: -2.5em 0 0 -0.1em;
        }

        .cub-6 .ft {
          transform: translateZ(0.1em);
        }

        .cub-6 .bk {
          transform: translateZ(-0.1em) rotateY(180deg);
        }

        .cub-6 .rt,
        .cub-6 .lt {
          width: 0.2em;
          height: 5em;
        }

        .cub-6 .tp,
        .cub-6 .bm {
          width: 0.2em;
          height: 0.2em;
        }

        .cub-6 .face {
          background-color: #ffffff;
        }

        .cub-2 {
          transform: translate3D(0em, -3.5em, 0em) rotateX(0deg) rotateY(0deg)
            rotateZ(0deg);
          opacity: 1;
          width: 10em;
          height: 0.2em;
          margin: -0.1em 0 0 -5em;
        }

        .cub-2 .ft {
          transform: translateZ(2.625em);
        }

        .cub-2 .bk {
          transform: translateZ(-2.625em) rotateY(180deg);
        }

        .cub-2 .rt,
        .cub-2 .lt {
          width: 5.25em;
          height: 0.2em;
        }

        .cub-2 .tp,
        .cub-2 .bm {
          width: 10em;
          height: 5.25em;
        }

        .cub-2 .face {
          background-color: #ffffff;
        }

        @media (max-width: 1200px) {
          .old-tv {
            transform: scale(0.6);
          }
        }
      `}</style>
    </>
  );
});

RetroTV.displayName = 'RetroTV';

export default RetroTV;
