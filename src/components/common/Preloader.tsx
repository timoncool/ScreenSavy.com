'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import './Preloader.css';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Проверяем sessionStorage - если уже загружали в этой сессии, пропускаем прелоадер
    const hasLoaded = sessionStorage.getItem('screensavy_loaded');

    if (hasLoaded) {
      setIsLoading(false);
      return;
    }

    // Простая задержка для показа прелоадера пока все загрузится
    const minDisplayTime = 800;
    const startTime = Date.now();

    const hidePreloader = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem('screensavy_loaded', 'true');
        }, 800);
      }, remaining);
    };

    // Ждем полной загрузки страницы
    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader);
      return () => window.removeEventListener('load', hidePreloader);
    }
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`preloader ${fadeOut ? 'fade-out' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-logo">
          <Image
            src="/favicon.svg"
            alt="ScreenSavy"
            width={80}
            height={80}
            priority
          />
        </div>

        <div className="preloader-title">
          <span className="preloader-title-main">ScreenSavy</span>
          <span className="preloader-title-domain">.com</span>
        </div>

        <div className="preloader-animation">
          <div className="color-wave">
            <div className="wave-segment wave-red"></div>
            <div className="wave-segment wave-green"></div>
            <div className="wave-segment wave-blue"></div>
          </div>
        </div>

        <div className="preloader-tagline">
          Immersive Color Experiences
        </div>
      </div>
    </div>
  );
}
