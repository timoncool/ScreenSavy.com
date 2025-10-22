export type Visualizer = {
  slug: string;
  name: string;
  nameRu: string;
  category: 'audio' | 'ambient';
};

export const visualizers: Visualizer[] = [
  {
    slug: 'celestial',
    name: 'Celestial Weaver',
    nameRu: 'Небесный Ткач',
    category: 'audio',
  },
  {
    slug: 'supernova',
    name: 'Super Nova',
    nameRu: 'Супер Нова',
    category: 'audio',
  },
  {
    slug: 'voyager',
    name: 'Voyager',
    nameRu: 'Вояджер',
    category: 'audio',
  },
  {
    slug: 'lava-lamp',
    name: 'Lava Lamp',
    nameRu: 'Лава Лампа',
    category: 'ambient',
  },
  {
    slug: 'rgb-lava',
    name: 'RGB Lava',
    nameRu: 'RGB Лава',
    category: 'ambient',
  },
];

export const getVisualizerFile = (slug: string): string => {
  const fileMap: Record<string, string> = {
    'celestial': 'CELESTIAL.html',
    'supernova': 'SUPER_NOVA.html',
    'voyager': 'VOYAGER.html',
    'lava-lamp': 'optimized-lava-lamp.html',
    'rgb-lava': 'Final_RGB_lava.html',
  };
  return fileMap[slug] || '';
};

export const getVisualizerBySlug = (slug: string): Visualizer | undefined => {
  return visualizers.find(v => v.slug === slug);
};

export type VisualizerCategory = 'audio' | 'ambient';
