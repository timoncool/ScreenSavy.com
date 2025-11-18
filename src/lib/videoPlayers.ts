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
  { id: 'vhs', name: 'VHS', nameRu: 'VHS', icon: 'videocam' },
  { id: 'crt', name: 'CRT Monitor', nameRu: 'ЭЛТ Монитор', icon: 'tv' },
  { id: 'glitch', name: 'Glitch', nameRu: 'Глитч', icon: 'auto_fix_high' },
  { id: 'vintage', name: 'Vintage', nameRu: 'Винтаж', icon: 'photo_camera' },
  { id: 'noir', name: 'Film Noir', nameRu: 'Черно-белый', icon: 'theaters' },
  { id: 'neon', name: 'Neon', nameRu: 'Неон', icon: 'wb_twilight' },
  { id: 'chromatic', name: 'Chromatic', nameRu: 'Хроматический', icon: 'palette' },
];
