export type Language = 'ru' | 'en';
export type LanguageSetting = Language | 'auto';

export type MainTranslationKey =
  | 'welcome'
  | 'welcomeMessage'
  | 'close'
  | 'got_it'
  | 'oneColor'
  | 'colorChange'
  | 'clock'
  | 'about'
  | 'language'
  | 'pickerHint'
  | 'colorsHint'
  | 'shadesHint'
  | 'fullscreen'
  | 'exitFullscreen'
  | 'aboutTitle'
  | 'aboutDescription'
  | 'author'
  | 'authorName'
  | 'founder'
  | 'donate'
  | 'subscription'
  | 'youtube'
  | 'github'
  | 'hideInterface'
  | 'showInterface'
  | 'addToFavorites'
  | 'bookmarkSite'
  | 'toggleHints'
  | 'bookmarkError'
  | 'clearFavorites'
  | 'hideFavorites'
  | 'showFavorites'
  | 'modernClock'
  | 'fullClock'
  | 'minimalClock'
  | 'comingSoon'
  | 'textMode'
  | 'playerMode'
  | 'animationMode'
  | 'createOwnMode'
  | 'visualizers'
  | 'audioVisualizers'
  | 'ambientVisualizers'
  | 'textHint'
  | 'textOptions'
  | 'enterText'
  | 'stylePresets'
  | 'fontSize'
  | 'small'
  | 'medium'
  | 'large'
  | 'fontFamily'
  | 'textColor'
  | 'textOutline'
  | 'outlineEnable'
  | 'outlineColor'
  | 'outlineWidth'
  | 'textAlign'
  | 'presetNeon'
  | 'presetClassic'
  | 'presetMinimal'
  | 'presetNature'
  | 'presetRomantic'
  | 'presetRetro'
  | 'presetCyber';

export const mainTranslations: Record<Language, Record<MainTranslationKey, string>> = {
  ru: {
    welcome: 'Добро пожаловать в ScreenSavy.com!',
    welcomeMessage:
      'ScreenSavy.com — это инструмент для создания красивого фона и заставки на экране. В нём доступны режимы:\n\n• Один цвет — мгновенно задаёт единый оттенок для всего экрана\n\n• Смена цветов — плавные переходы между избранными цветами с регулировкой скорости\n\n• Часы — отображение времени в минималистичном, полном и современном стилях\n\n• Текст — создавайте надписи, выбирайте шрифты, цвета, размеры и пресеты оформления\n\n• Видеоплеер — запускайте любимые ролики прямо в заставке\n\n• Анимации — коллекция динамичных сцен для расслабления и вдохновения\n\n• Визуализаторы — аудио и эмбиент сцены, включая Celestial, Supernova, Voyager, Lava Lamp и RGB Lava\n\n• Добавить свою — подключайте собственные сцены и визуалы\n\nИспользуйте RGB-панель, пипетку и палитру оттенков; сохраняйте цвета и режимы в избранном, сортируйте и очищайте подборки; включайте полноэкранный режим, скрывайте интерфейс и подсказки и переключайтесь между аудио и эмбиент визуализаторами через обновлённое меню.',
    close: 'Закрыть',
    got_it: 'Понятно',
    oneColor: 'Один цвет',
    colorChange: 'Смена цветов',
    clock: 'Часы',
    about: 'О проекте',
    language: 'Язык',
    pickerHint: 'Перемещайте курсор для выбора цвета, кликните для закрепления',
    colorsHint: 'Сохраняйте цвета в избранное, чтобы использовать их позже',
    shadesHint: 'Выберите оттенок цвета из палитры ниже',
    fullscreen: 'Полный экран',
    exitFullscreen: 'Выход из полного экрана',
    aboutTitle: 'О проекте ScreenSavy.com',
    aboutDescription:
      '\n        <p>Проект ScreenSavy.com был придуман, когда я не нашёл удобного способа просто выставить цвет себе на мнитор во время просмотра фильма.</p>\n        <p>ScreenSavy.com — веб-платформа, возрождающая концепцию скринсейверов для современного использования. Проект объединяет цветовые утилиты и коллекцию интерактивных визуальных эффектов, предлагая новый взгляд на использование экрана устройства в пассивном режиме.</p>\n        <p>Вы можете использовать ScreenSavy.com для:</p>\n        <ul>\n          <li>Создания приятного фона во время просмотра фильмов</li>\n          <li>Тестирования цветопередачи монитора</li>\n          <li>Отображения часов на неиспользуемом экране</li>\n          <li>Подбора цветовых схем для дизайн-проектов</li>\n          <li>Создания приятной атмосферы в помещении</li>\n          <li>Настройки света для фотосессии через планшет или телевизор</li>\n        </ul>\n        <p>Сайт можно открыть на любом устройстве - компьютере, смартфоне, планшете или смарт-телевизоре, что делает его идеальным инструментом для создания нужной атмосферы в любой ситуации.</p>\n      ',
    author: 'Автор',
    authorName: 'Nerual Dreming',
    founder: 'Основатель ArtGeneration.me, техноблогер и нейро-евангелист',
    donate: 'Отправить донат',
    subscription: 'Поддержать на Boosty',
    youtube: 'YouTube канал',
    github: 'GitHub',
    hideInterface: 'Скрыть интерфейс',
    showInterface: 'Показать интерфейс',
    addToFavorites: 'Добавить в избранное',
    bookmarkSite: 'Добавить в закладки',
    toggleHints: 'Показать/скрыть подсказки',
    bookmarkError: 'Используйте Ctrl+D (или Command+D для Mac) чтобы добавить эту страницу в закладки',
    clearFavorites: 'Очистить избранное',
    hideFavorites: 'Скрыть избранные цвета',
    showFavorites: 'Показать избранные цвета',
    modernClock: 'Современный стиль часов',
    fullClock: 'Полный стиль с датой',
    minimalClock: 'Минималистичный стиль часов',
    comingSoon: 'Скоро',
    textMode: 'Текст',
    playerMode: 'Видеоплеер',
    animationMode: 'Анимации',
    createOwnMode: 'Добавить свою',
    visualizers: 'Визуализаторы',
    audioVisualizers: 'Аудио визуализаторы',
    ambientVisualizers: 'Эмбиент визуализаторы',
    textHint: 'Настройте текст, его размер и стиль с помощью панели опций',
    textOptions: 'Настройки текста',
    enterText: 'Введите текст',
    stylePresets: 'Стили',
    fontSize: 'Размер шрифта',
    small: 'Маленький',
    medium: 'Средний',
    large: 'Большой',
    fontFamily: 'Шрифт',
    textColor: 'Цвет текста',
    textOutline: 'Обводка текста',
    outlineEnable: 'Включить обводку',
    outlineColor: 'Цвет обводки',
    outlineWidth: 'Толщина обводки',
    textAlign: 'Выравнивание',
    presetNeon: 'Неон',
    presetClassic: 'Классика',
    presetMinimal: 'Минимализм',
    presetNature: 'Природа',
    presetRomantic: 'Романтика',
    presetRetro: 'Ретро',
    presetCyber: 'Кибер'
  },
  en: {
    welcome: 'Welcome to ScreenSavy.com!',
    welcomeMessage:
      'ScreenSavy.com is a toolkit for crafting beautiful backgrounds and screensavers. Our modes include:\n\n• One Color — instantly fill the display with a single hue\n\n• Color Change — smooth transitions between favorite shades with adjustable speed\n\n• Clock — show the time in minimal, full, or modern layouts\n\n• Text — design captions with fonts, colors, sizes, and curated presets\n\n• Video Player — loop or play your favorite clips right in the scene\n\n• Animations — a collection of calming and inspiring motion backgrounds\n\n• Visualizers — audio-reactive and ambient scenes, including Celestial, Supernova, Voyager, Lava Lamp, and RGB Lava\n\n• Add Your Own — plug in custom scenes and visuals\n\nUse the RGB panel, picker, and shade palette for precise colors; bookmark colors and modes, organize and clear favorites; toggle fullscreen, hide the interface and helper hints, and switch between audio and ambient visualizers through the refreshed menu.',
    close: 'Close',
    got_it: 'Got it',
    oneColor: 'One Color',
    colorChange: 'Color Change',
    clock: 'Clock',
    about: 'About',
    language: 'Language',
    pickerHint: 'Move the cursor to select a color, click to set it',
    colorsHint: 'Save colors to favorites to use them later',
    shadesHint: 'Select a shade of color from the palette below',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    aboutTitle: 'About ScreenSavy.com',
    aboutDescription:
      "\n        <p>The ScreenSavy.com project was conceived when I couldn't find a convenient way to set a simple color on my monitor while watching a movie.</p>\n        <p>ScreenSavy.com is a web platform that revives the concept of screensavers for modern use. The project combines color utilities and a collection of interactive visual effects, offering a new perspective on using device screens in passive mode.</p>\n        <p>You can use ScreenSavy.com for:</p>\n        <ul>\n          <li>Creating a pleasant background while watching movies</li>\n          <li>Testing monitor color reproduction</li>\n          <li>Displaying a clock on an unused screen</li>\n          <li>Selecting color schemes for design projects</li>\n          <li>Creating a pleasant atmosphere in a room</li>\n          <li>Setting up lighting for photo sessions using a tablet or TV</li>\n        </ul>\n        <p>The site can be opened on any device - computer, smartphone, tablet, or smart TV, making it an ideal tool for creating the right atmosphere in any situation.</p>\n      ",
    author: 'Author',
    authorName: 'Nerual Dreming',
    founder: 'Founder of ArtGeneration.me, tech blogger and neuro-evangelist',
    donate: 'Send donation',
    subscription: 'Support on Boosty',
    youtube: 'YouTube Channel',
    github: 'GitHub',
    hideInterface: 'Hide Interface',
    showInterface: 'Show Interface',
    addToFavorites: 'Add to favorites',
    bookmarkSite: 'Bookmark site',
    toggleHints: 'Show/hide hints',
    bookmarkError: 'Press Ctrl+D (or Command+D for Mac) to bookmark this page',
    clearFavorites: 'Clear favorites',
    hideFavorites: 'Hide favorite colors',
    showFavorites: 'Show favorite colors',
    modernClock: 'Modern clock style',
    fullClock: 'Full style with date',
    minimalClock: 'Minimalistic clock style',
    comingSoon: 'Coming Soon',
    textMode: 'Text',
    playerMode: 'Video player',
    animationMode: 'Animations',
    createOwnMode: 'Add your own',
    visualizers: 'Visualizers',
    audioVisualizers: 'Audio Visualizers',
    ambientVisualizers: 'Ambient Visualizers',
    textHint: 'Customize text, size and style using the options panel',
    textOptions: 'Text Options',
    enterText: 'Enter text',
    stylePresets: 'Style Presets',
    fontSize: 'Font Size',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    fontFamily: 'Font Family',
    textColor: 'Text Color',
    textOutline: 'Text Outline',
    outlineEnable: 'Enable Outline',
    outlineColor: 'Outline Color',
    outlineWidth: 'Outline Width',
    textAlign: 'Text Alignment',
    presetNeon: 'Neon',
    presetClassic: 'Classic',
    presetMinimal: 'Minimal',
    presetNature: 'Nature',
    presetRomantic: 'Romantic',
    presetRetro: 'Retro',
    presetCyber: 'Cyber'
  }
};

export const getTranslation = (
  setting: LanguageSetting,
  detected: Language,
  key: MainTranslationKey
) => {
  const language = setting === 'auto' ? detected : setting;
  return mainTranslations[language][key] ?? mainTranslations.en[key];
};
