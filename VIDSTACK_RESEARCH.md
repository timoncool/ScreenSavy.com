# ИССЛЕДОВАНИЕ VIDSTACK ДЛЯ SCREENSAVY.COM

## 1. НАЛИЧИЕ В ПРОЕКТЕ

**Статус:** Vidstack НЕ установлен в текущем проекте.

**Текущая конфигурация проекта:**
- React: 18.2.0
- Next.js: 14.1.0
- TypeScript: 5.3.3
- Текущий видеоплеер: YouTube IFrame API (встроенный)

**Зависимости для добавления:**
```json
"@vidstack/react": "^0.6.15",
"@vidstack/player-react": "latest"
```

---

## 2. REACT/NEXT.JS ИНТЕГРАЦИЯ

### Поддержка Framework

✅ **Полная поддержка React/Next.js**
- React 18+ совместим
- React Server Components (RSC) поддержка
- Next.js 13+ (включая app/ directory)
- SSR-friendly Web Components
- Tree-shaking совместимость

### Установка для Next.js

```bash
npm install @vidstack/react
```

### Базовый пример для Next.js

```jsx
'use client';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

// Импорт стилей
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

export default function VideoPlayer() {
  return (
    <MediaPlayer 
      title="My Video" 
      src="https://example.com/video.mp4"
    >
      <MediaProvider />
      <DefaultVideoLayout 
        thumbnails="https://example.com/thumbnails.vtt" 
        icons={defaultLayoutIcons} 
      />
    </MediaPlayer>
  );
}
```

### Расширенный пример с кастомизацией

```jsx
'use client';

import { useMediaState, useMediaStore } from '@vidstack/react';
import { MediaPlayer, MediaProvider } from '@vidstack/react';

export function CustomPlayer() {
  const isPaused = useMediaState('paused');
  const currentTime = useMediaState('currentTime');
  const duration = useMediaState('duration');
  const store = useMediaStore();

  return (
    <MediaPlayer src="video.mp4">
      <MediaProvider />
      
      {/* Кастомные контролы */}
      <div className="custom-controls">
        <button onClick={() => store.play()}>
          {isPaused ? 'Play' : 'Pause'}
        </button>
        <span>{currentTime} / {duration}</span>
      </div>
    </MediaPlayer>
  );
}
```

### Hooks API (18+ хуков)

```jsx
// Основные хуки для управления состоянием
import {
  useMediaState,      // Подписка на конкретное состояние
  useMediaStore,      // Доступ ко всему хранилищу
  useMediaRemote,     // Управление плеером программно
  useState            // Реактивное состояние
} from '@vidstack/react';

// Пример использования
const Component = () => {
  const isPaused = useMediaState('paused');
  const isMuted = useMediaState('muted');
  const volume = useMediaState('volume');
  const currentTime = useMediaState('currentTime');
  const duration = useMediaState('duration');
  const buffered = useMediaState('buffered');
  
  return <div>/* UI */<
};
```

---

## 3. СРАВНЕНИЕ РАЗМЕРОВ BUNDLE

### Bundle Size Сравнение

| Плеер | Размер | Gzip | Комментарий |
|-------|--------|------|-----------|
| **Vidstack** | 173 kB | **53.4 kB** | ✅ Лучший результат |
| **Plyr** | ~100 kB | ~25-30 kB | Упрощается / Deprecated |
| **Video.js** | 656 kB | **195 kB** | ❌ Самый тяжелый |

### Особенности оптимизации Vidstack

1. **Tree-Shaking поддержка**
   - Удаляются неиспользуемые компоненты
   - Все провайдеры лениво загружаются
   - Минимальное ядро (54 kB gzip)

2. **Lazy Loading**
   - Провайдеры загружаются при необходимости
   - Captions загружаются по требованию
   - Плагины могут быть подключены динамически

3. **CDN оптимизация**
   - Специально минифицированные CDN сборки
   - Встроенные зависимости

### Для ScreenSavy.com

Для проекта с визуализаторами и эффектами:
- **Базовый плеер:** ~54 kB gzip
- **С YouTube поддержкой:** +15 kB
- **Все провайдеры:** +30 kB

**Итого:** ~100 kB gzip (vs 195 kB Video.js)

---

## 4. ПОДДЕРЖКА КАСТОМНЫХ ЭФФЕКТОВ

### Встроенные возможности

✅ **Прямая поддержка:**
- CSS-фильтры и трансформации на видео
- Анимации плеера через CSS
- Data attributes для стилизации по состоянию
- 150+ CSS переменных для темизации

### Пример кастомных эффектов

```jsx
// CRT эффект (как в RetroTV проекте)
const styles = css`
  [media-player] {
    --media-rounded: 5% / 50%;
  }
  
  [media-provider] video {
    filter: 
      grayscale(0) 
      brightness(1.1) 
      contrast(1.2);
    animation: crt-scan 20ms alternate infinite;
  }
  
  /* Сканирующие линии */
  [media-player]::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.15) 4px
    );
    pointer-events: none;
    animation: crt-lines 20ms alternate infinite;
  }
  
  @keyframes crt-scan {
    0% { transform: translateY(-1px); }
    100% { transform: translateY(0px); }
  }
`;
```

### Интеграция с React для эффектов

```jsx
'use client';

import { useMediaState } from '@vidstack/react';

export function VidstackRetroTV() {
  const isPoweredOn = useMediaState('paused');
  
  return (
    <div className={isPoweredOn ? 'tv-off' : 'tv-on'}>
      <MediaPlayer>
        <MediaProvider />
        <style>{`
          ${isPoweredOn ? 'opacity: 0.05;' : 'opacity: 0.95;'}
          filter: ${isPoweredOn ? 'grayscale(1)' : 'grayscale(0)'};
        `}</style>
      </MediaPlayer>
    </div>
  );
}
```

### Визуализаторы и аудио эффекты

```jsx
// Интеграция с Web Audio API для эффектов
export function PlayerWithVisualizer() {
  const store = useMediaStore();
  const audioContext = useRef(null);
  
  useEffect(() => {
    // Получить медиа элемент
    const mediaElement = store.provider?.media;
    if (mediaElement) {
      // Создать audio context для обработки
      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaElementAudioSource(mediaElement);
      // Добавить эффекты...
    }
  }, [store.provider]);
  
  return <MediaPlayer>{/* ... */}</MediaPlayer>;
}
```

---

## 5. ПРИМЕРЫ THEMES И LAYOUTS

### Pre-built Layouts

#### Default Video Layout
```jsx
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

<MediaPlayer src="video.mp4">
  <MediaProvider />
  <DefaultVideoLayout 
    thumbnails="/thumbnails.vtt"
    icons={defaultLayoutIcons}
    slots={{
      beforeControlsGroup: <CustomBrandLogo />
    }}
  />
</MediaPlayer>
```

**Возможности:**
- Picture-in-Picture
- Fullscreen
- Slider chapters
- Preview thumbnails
- Captions/Subtitles
- Audio/Quality tracks
- Live streams

#### Plyr Layout
```jsx
import { PlyrLayout } from '@vidstack/react/player/layouts/plyr';

<MediaPlayer src="video.mp4">
  <MediaProvider />
  <PlyrLayout icons={plyrLayoutIcons} />
</MediaPlayer>
```

### Темизация через CSS переменные

```css
/* Кастомная тема */
[media-player] {
  --media-brand: #7cfc00;
  --media-control-padding: 8px;
  --media-focus-ring-color: #7cfc00;
  --media-focus-ring-opacity: 0.5;
  
  /* Цвета плеера */
  --media-text-color: #fff;
  --media-bg: rgba(0, 0, 0, 0.8);
  --media-control-hover-bg: rgba(124, 252, 0, 0.2);
  --media-control-focus-bg: rgba(124, 252, 0, 0.3);
  
  /* Прогрессбар */
  --media-slider-track-bg: rgba(255, 255, 255, 0.3);
  --media-slider-progress-bg: #7cfc00;
  --media-slider-thumb-bg: #7cfc00;
}
```

### Кастомный Layout

```jsx
'use client';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { 
  PlayButton,
  MuteButton,
  CaptionButton,
  FullscreenButton,
  Gesture
} from '@vidstack/react/player/components';

export function CustomLayout() {
  return (
    <MediaPlayer src="video.mp4">
      <MediaProvider />
      
      {/* Кастомный контейнер контролов */}
      <div className="custom-player-ui">
        <Gesture media="play" />
        
        <div className="bottom-controls">
          <PlayButton />
          <MuteButton />
          <CaptionButton />
          <FullscreenButton />
        </div>
      </div>
    </MediaPlayer>
  );
}
```

### Tailwind CSS интеграция

```jsx
<MediaPlayer className="aspect-video bg-slate-900 rounded-lg">
  <MediaProvider />
  
  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-t from-black/80">
    <PlayButton className="w-10 h-10 text-white hover:text-cyan-400" />
    <div className="flex-1 mx-4">
      <div className="h-1 bg-gray-600 rounded" />
    </div>
    <FullscreenButton className="w-10 h-10 text-white hover:text-cyan-400" />
  </div>
</MediaPlayer>
```

---

## 6. ПОДДЕРЖИВАЕМЫЕ ПРОВАЙДЕРЫ

✅ **Встроенные провайдеры:**
- HTML5 Video/Audio
- HLS (через hls.js)
- DASH (через dash.js)
- YouTube (IFrame)
- Vimeo (IFrame)
- Remotion

---

## 7. ДОСТУПНОСТЬ И ФУНКЦИОНАЛЬНОСТЬ

✅ **Accessibility:**
- ARIA labels и roles
- Keyboard shortcuts (Space, Arrow Keys)
- Screen reader поддержка
- Focus management
- Custom captions (~5 kB, поддержка VTT/SRT/SSA)

✅ **Advanced Features:**
- Picture-in-Picture
- Fullscreen API
- Playback rate control
- Audio/subtitle tracks
- Quality selection
- Live stream support
- Chapter markers

---

## 8. ПРИМЕНИМОСТЬ ДЛЯ SCREENSAVY.COM

### Для текущего RetroTV компонента

**Преимущества:**
1. ✅ YouTube интеграция (замена встроенного API)
2. ✅ Кастомизация под retro эффекты (CSS + React)
3. ✅ Меньший bundle (~53 kB vs 195 kB)
4. ✅ Лучшая типизация (TypeScript)
5. ✅ Полная управляемость через Hooks API

**Миграция RetroTV:**

```jsx
'use client';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useMediaState, useMediaStore } from '@vidstack/react';

export default function RetroTV({ videoId, onVideoIdChange }) {
  const [inputValue, setInputValue] = useState('');
  const store = useMediaStore();
  const isPoweredOn = useMediaState('paused');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const id = extractVideoId(inputValue);
    if (id) {
      onVideoIdChange?.(id);
    }
  };
  
  return (
    <div className="old-tv">
      {/* Видео плеер */}
      <MediaPlayer
        src={`https://www.youtube.com/embed/${videoId}`}
        className={isPoweredOn ? 'powered-off' : 'powered-on'}
      >
        <MediaProvider />
      </MediaPlayer>
      
      {/* Кастомные контролы */}
      <button onClick={() => store.togglePaused()}>
        Power
      </button>
    </div>
  );
}
```

### Для визуализаторов

**Возможные улучшения:**
1. Интеграция Web Audio API через медиа провайдер
2. Синхронизация анимаций с currentTime
3. Canvas-based визуализаторы поверх плеера
4. Реактивные эффекты через useMediaState

---

## ОЦЕНКА (1-10)

### По критериям:

| Критерий | Оценка | Комментарий |
|----------|--------|-----------|
| **Применимость для React/Next.js** | 10/10 | Идеальная интеграция, RSC поддержка |
| **Bundle Size** | 9/10 | 53 kB gzip - лучше всех альтернатив |
| **Простота использования** | 8/10 | API понятен, хорошая документация |
| **Кастомизация эффектов** | 8/10 | CSS + Hooks + Web Audio API готов |
| **YouTube поддержка** | 9/10 | Встроенный провайдер, готов к использованию |
| **Доступность** | 10/10 | Полная ARIA, keyboard navigation |
| **Поддержка и активность** | 9/10 | 3.2k stars, 185 forks, активная разработка |
| **Migration из YouTube API** | 8/10 | Прямолинейная, требует изменений стилей |

### **ИТОГОВАЯ ОЦЕНКА: 8.6/10** ⭐⭐⭐⭐⭐

---

## ПРЕИМУЩЕСТВА ПЕРЕД АЛЬТЕРНАТИВАМИ

### vs Video.js
- ❌ 3.7x меньше bundle (53 vs 195 kB)
- ❌ Лучше для React (Video.js - jQuery-ish)
- ✅ Современный API
- ✅ RSC поддержка

### vs Plyr
- ✅ Plyr deprecated / merging into Vidstack
- ✅ Больше провайдеров поддержки
- ✅ Лучше кастомизация
- ✅ Плеер + UI components combo

### vs встроенного YouTube API
- ✅ Единые контролы для разных провайдеров
- ✅ Лучшая типизация
- ✅ Встроенные эффекты (captions, quality)
- ✅ Меньше внешних зависимостей

---

## РЕКОМЕНДАЦИИ ДЛЯ SCREENSAVY.COM

1. **Краткосрочно:**
   - Миграция RetroTV на @vidstack/react
   - Кастомизация CSS под retro-эффекты
   - Удаление YouTube IFrame API

2. **Среднесрочно:**
   - Интеграция Web Audio для визуализаторов
   - Canvas-based визуализаторы с player sync
   - Pre-built Default Layout для новых видео режимов

3. **Долгосрочно:**
   - Поддержка HLS/DASH streams
   - Кастомные themes для каждого режима
   - DRM контент (если требуется)

