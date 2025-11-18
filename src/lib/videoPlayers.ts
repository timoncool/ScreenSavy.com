export type VideoPlayer = {
  slug: string;
  name: string;
  nameRu: string;
  type: 'youtube' | 'vk' | 'local' | 'retro';
  defaultUrl?: string;
  supportsEffects: boolean;
};

export const videoPlayers: VideoPlayer[] = [
  {
    slug: 'retro-tv',
    name: 'Retro TV',
    nameRu: 'Ретро ТВ',
    type: 'retro',
    defaultUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    supportsEffects: false,
  },
  {
    slug: 'youtube-effects',
    name: 'YouTube Effects',
    nameRu: 'YouTube с Эффектами',
    type: 'youtube',
    defaultUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    supportsEffects: true,
  },
  {
    slug: 'local-player',
    name: 'Local Files',
    nameRu: 'Локальные Файлы',
    type: 'local',
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
  { id: 'none', name: 'Original', nameRu: 'Оригинал', icon: 'visibility' },
  { id: 'vhs', name: 'VHS Tape', nameRu: 'VHS Кассета', icon: 'videocam' },
  { id: 'glitch', name: 'Digital Glitch', nameRu: 'Цифровой Глитч', icon: 'auto_fix_high' },
  { id: 'vintage', name: 'Vintage Film', nameRu: 'Винтажная Пленка', icon: 'photo_camera' },
  { id: 'noir', name: 'Film Noir', nameRu: 'Нуар', icon: 'theaters' },
  { id: 'neon', name: 'Neon Glow', nameRu: 'Неоновое Свечение', icon: 'wb_twilight' },
  { id: 'grain', name: 'Film Grain', nameRu: 'Кинозерно', icon: 'grain' },
  { id: 'cinematic', name: 'Cinematic', nameRu: 'Кинематограф', icon: 'movie_filter' },
  { id: 'nightvision', name: 'Night Vision', nameRu: 'Ночное Видение', icon: 'nightlight' },
  { id: 'underwater', name: 'Underwater', nameRu: 'Подводный', icon: 'water' },
  { id: 'anaglyph', name: 'Anaglyph 3D', nameRu: '3D Анаглиф', icon: '3d_rotation' },
];
