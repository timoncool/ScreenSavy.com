import type { Language, LanguageSetting } from './translations';

export type TextTranslationKey =
  | 'welcome'
  | 'welcomeMessage'
  | 'close'
  | 'got_it'
  | 'oneColor'
  | 'colorChange'
  | 'text'
  | 'about'
  | 'language'
  | 'pickerHint'
  | 'colorsHint'
  | 'shadesHint'
  | 'textHint'
  | 'fullscreen'
  | 'exitFullscreen'
  | 'aboutTitle'
  | 'textOptions'
  | 'stylePresets'
  | 'fontFamily'
  | 'fontSize'
  | 'textAlign'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'enterText'
  | 'textDefault'
  | 'small'
  | 'medium'
  | 'large'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'textColor'
  | 'textOutline'
  | 'outlineEnable'
  | 'outlineColor'
  | 'outlineWidth'
  | 'presetNeon'
  | 'presetClassic'
  | 'presetMinimal'
  | 'presetNature'
  | 'presetRomantic'
  | 'presetRetro'
  | 'presetCyber'
  | 'hideInterface'
  | 'showInterface'
  | 'addToFavorites'
  | 'bookmarkSite'
  | 'toggleHints'
  | 'bookmarkError'
  | 'clearFavorites'
  | 'hideFavorites'
  | 'showFavorites';

export const textTranslations: Record<Language, Record<TextTranslationKey, string>> = {
  ru: {
    welcome: 'Добро пожаловать в ScreenSavy Text!',
    welcomeMessage:
      'ScreenSavy Text - режим для отображения вашего текста на цветном фоне. Вы можете:\n\n• Ввести любой текст для отображения\n\n• Настроить размер, шрифт и стиль текста\n\n• Выбрать цвет фона\n\n• Сохранять любимые цвета в избранное\n\nИспользуйте панель настроек текста, чтобы персонализировать ваше сообщение.',
    close: 'Закрыть',
    got_it: 'Понятно',
    oneColor: 'Один цвет',
    colorChange: 'Смена цветов',
    text: 'Текст',
    about: 'О проекте',
    language: 'Язык',
    pickerHint: 'Перемещайте курсор для выбора цвета, кликните для закрепления',
    colorsHint: 'Сохраняйте цвета в избранное, чтобы использовать их позже',
    shadesHint: 'Выберите оттенок цвета из палитры ниже',
    textHint: 'Настройте текст, его размер и стиль с помощью панели опций',
    fullscreen: 'Полный экран',
    exitFullscreen: 'Выход из полного экрана',
    aboutTitle: 'О проекте ScreenSavy.com',
    textOptions: 'Настройки текста',
    stylePresets: 'Готовые стили',
    fontFamily: 'Шрифт',
    fontSize: 'Размер',
    textAlign: 'Выравнивание',
    bold: 'Жирный',
    italic: 'Курсив',
    underline: 'Подчеркнутый',
    enterText: 'Введите текст...',
    textDefault: 'Ваш текст здесь',
    small: 'Маленький',
    medium: 'Средний',
    large: 'Большой',
    alignLeft: 'По левому краю',
    alignCenter: 'По центру',
    alignRight: 'По правому краю',
    textColor: 'Цвет текста',
    textOutline: 'Контур текста',
    outlineEnable: 'Включить контур',
    outlineColor: 'Цвет контура',
    outlineWidth: 'Толщина контура',
    presetNeon: 'Неон',
    presetClassic: 'Классика',
    presetMinimal: 'Минимализм',
    presetNature: 'Природа',
    presetRomantic: 'Романтика',
    presetRetro: 'Ретро',
    presetCyber: 'Кибер',
    hideInterface: 'Скрыть интерфейс',
    showInterface: 'Показать интерфейс',
    addToFavorites: 'Добавить в избранное',
    bookmarkSite: 'Добавить в закладки',
    toggleHints: 'Показать/скрыть подсказки',
    bookmarkError: 'Используйте Ctrl+D (или Command+D для Mac) чтобы добавить эту страницу в закладки',
    clearFavorites: 'Очистить избранное',
    hideFavorites: 'Скрыть избранные цвета',
    showFavorites: 'Показать избранные цвета'
  },
  en: {
    welcome: 'Welcome to ScreenSavy Text!',
    welcomeMessage:
      'ScreenSavy Text is a mode for displaying your text on a colored background. You can:\n\n• Enter any text to display\n\n• Adjust the size, font, and style of the text\n\n• Choose the background color\n\n• Save your favorite colors\n\nUse the text settings panel to personalize your message.',
    close: 'Close',
    got_it: 'Got it',
    oneColor: 'One Color',
    colorChange: 'Color Change',
    text: 'Text',
    about: 'About',
    language: 'Language',
    pickerHint: 'Move the cursor to select a color, click to set it',
    colorsHint: 'Save colors to favorites to use them later',
    shadesHint: 'Select a shade of color from the palette below',
    textHint: 'Customize text, size and style using the options panel',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    aboutTitle: 'About ScreenSavy.com',
    textOptions: 'Text Options',
    stylePresets: 'Style Presets',
    fontFamily: 'Font',
    fontSize: 'Size',
    textAlign: 'Alignment',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    enterText: 'Enter text...',
    textDefault: 'Your custom text here',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    alignLeft: 'Left',
    alignCenter: 'Center',
    alignRight: 'Right',
    textColor: 'Text Color',
    textOutline: 'Text Outline',
    outlineEnable: 'Enable Outline',
    outlineColor: 'Outline Color',
    outlineWidth: 'Outline Width',
    presetNeon: 'Neon',
    presetClassic: 'Classic',
    presetMinimal: 'Minimal',
    presetNature: 'Nature',
    presetRomantic: 'Romantic',
    presetRetro: 'Retro',
    presetCyber: 'Cyber',
    hideInterface: 'Hide Interface',
    showInterface: 'Show Interface',
    addToFavorites: 'Add to favorites',
    bookmarkSite: 'Bookmark site',
    toggleHints: 'Show/hide hints',
    bookmarkError: 'Press Ctrl+D (or Command+D for Mac) to bookmark this page',
    clearFavorites: 'Clear favorites',
    hideFavorites: 'Hide favorite colors',
    showFavorites: 'Show favorite colors'
  }
};

export const getTextTranslation = (
  setting: LanguageSetting,
  detected: Language,
  key: TextTranslationKey
) => {
  const language = setting === 'auto' ? detected : setting;
  return textTranslations[language][key] ?? textTranslations.en[key];
};
