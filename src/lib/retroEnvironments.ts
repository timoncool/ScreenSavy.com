export type RetroEnvironmentId =
  | 'loft-brick'
  | 'forest-night'
  | 'lake-moonlight'
  | 'city-rooftop'
  | 'junkyard-stack'
  | 'neon-arcade';

export type RetroEnvironmentOption = {
  id: RetroEnvironmentId;
  icon: string;
  name: string;
  nameRu: string;
};

export const RETRO_ENVIRONMENTS: RetroEnvironmentOption[] = [
  {
    id: 'loft-brick',
    icon: 'home',
    name: 'Loft brick',
    nameRu: 'Лофт кирпич',
  },
  {
    id: 'forest-night',
    icon: 'forest',
    name: 'Forest night',
    nameRu: 'Ночной лес',
  },
  {
    id: 'lake-moonlight',
    icon: 'dark_mode',
    name: 'Moonlit lake',
    nameRu: 'Озеро ночью',
  },
  {
    id: 'city-rooftop',
    icon: 'location_city',
    name: 'City rooftop',
    nameRu: 'Крыша и город',
  },
  {
    id: 'junkyard-stack',
    icon: 'delete',
    name: 'TV junkyard',
    nameRu: 'Свалка телевизоров',
  },
  {
    id: 'neon-arcade',
    icon: 'stadia_controller',
    name: 'Neon arcade',
    nameRu: 'Неоновый зал',
  },
];
