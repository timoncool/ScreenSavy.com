export type VideoPlayer = {
  slug: string;
  name: string;
  nameRu: string;
  type: 'youtube' | 'vk' | 'local';
  defaultUrl?: string;
  supportsEffects: boolean;
};

export const videoPlayers: VideoPlayer[] = [
  {
    slug: 'youtube-effects',
    name: 'YouTube Player',
    nameRu: 'YouTube Плеер',
    type: 'youtube',
    defaultUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', // lofi hip hop radio
    supportsEffects: true,
  },
  {
    slug: 'local-player',
    name: 'Local Files',
    nameRu: 'Локальные Файлы',
    type: 'local',
    supportsEffects: true,
  },
  {
    slug: 'vk-player',
    name: 'VK Video',
    nameRu: 'VK Видео',
    type: 'vk',
    supportsEffects: true,
  },
];

export const getVideoPlayerBySlug = (slug: string): VideoPlayer | undefined => {
  return videoPlayers.find(v => v.slug === slug);
};

export type VideoEffect = {
  id: string;
  name: string;
  nameRu: string;
  icon: string;
};

export const videoEffects: VideoEffect[] = [
  { id: 'none', name: 'Original', nameRu: 'Оригинал', icon: '🎬' },
  { id: 'vhs', name: 'VHS', nameRu: 'VHS', icon: '📼' },
  { id: 'crt', name: 'CRT Monitor', nameRu: 'ЭЛТ Монитор', icon: '🖥️' },
  { id: 'glitch', name: 'Glitch', nameRu: 'Глитч', icon: '⚡' },
  { id: 'vintage', name: 'Vintage', nameRu: 'Винтаж', icon: '📷' },
  { id: 'noir', name: 'Film Noir', nameRu: 'Черно-белый', icon: '🎞️' },
  { id: 'neon', name: 'Neon', nameRu: 'Неон', icon: '💜' },
  { id: 'chromatic', name: 'Chromatic', nameRu: 'Хроматический', icon: '🌈' },
];
