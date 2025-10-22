# Contributing to ScreenSavy.com

[English](#english) | [Русский](#русский)

---

## English

Thank you for your interest in contributing to ScreenSavy! This document provides guidelines and instructions for contributing to the project.

### Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ScreenSavy.com.git
   cd ScreenSavy.com
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

1. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

2. **Make your changes** following our code guidelines (see below)

3. **Test your changes**:
   - Test in multiple browsers (Chrome, Firefox, Safari)
   - Test on different screen sizes
   - Ensure all existing modes still work correctly
   - Run the linter: `npm run lint`

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub with:
   - Clear description of changes
   - Screenshots/videos for UI changes
   - Reference to related issues (if any)

### Areas for Contribution

#### 1. New Visualizers
Create new audio or ambient visualizations:
- Add HTML file to `public/visualizers/`
- Create page component in `app/modes/visualizers/your-visualizer/`
- Add entry to `src/lib/visualizers.ts`
- Add icon to toolbar and menu in `MainExperience.tsx`

#### 2. UI/UX Improvements
- Enhance existing modes
- Improve accessibility
- Add new features to MainExperience
- Optimize mobile experience

#### 3. Internationalization
Add translations for new languages:
- Update `src/components/screensavy/translations.ts`
- Add language detection logic
- Test all UI elements in new language

#### 4. Performance Optimization
- Optimize rendering performance
- Reduce bundle size
- Improve animation smoothness
- Optimize localStorage usage

#### 5. Documentation
- Improve README
- Add code comments
- Create tutorials
- Document component APIs

### Code Guidelines

#### General Principles
- **Follow existing patterns**: Study the codebase before making changes
- **Keep it simple**: Prefer clarity over cleverness
- **Be consistent**: Match the existing code style
- **Write readable code**: Use meaningful variable and function names

#### React/TypeScript Guidelines
- Use functional components with hooks
- Use TypeScript types for all props and state
- Prefer `const` over `let`
- Use meaningful component and variable names
- Extract reusable logic into custom hooks
- Keep components focused and single-purpose

#### Styling Guidelines
- Use Tailwind CSS classes when possible
- Follow existing class naming patterns
- Ensure responsive design (mobile, tablet, desktop)
- Test in dark and light environments
- Maintain consistent spacing and sizing

#### State Management
- Use React hooks (`useState`, `useCallback`, `useEffect`, etc.)
- Persist important state to localStorage
- Keep state as local as possible
- Use refs for values that don't trigger re-renders

#### Performance
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback`
- Avoid unnecessary re-renders
- Use `requestAnimationFrame` for animations
- Lazy load heavy components when possible

### Testing Checklist

Before submitting a PR, ensure:

- [ ] Code passes `npm run lint` without errors
- [ ] All existing modes work correctly
- [ ] Changes work in Chrome, Firefox, and Safari
- [ ] Changes work on mobile devices
- [ ] No console errors or warnings
- [ ] localStorage persistence works correctly
- [ ] Translations work in both Russian and English
- [ ] Full-screen mode works correctly
- [ ] Interface hints display correctly
- [ ] Color transitions are smooth
- [ ] No performance regressions

### Project Structure

```
ScreenSavy.com/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Main page (MainExperience)
│   └── modes/
│       ├── text/page.tsx        # Text mode
│       └── visualizers/         # Visualizers
│           ├── celestial/
│           ├── supernova/
│           ├── voyager/
│           ├── lava-lamp/
│           └── rgb-lava/
├── src/
│   └── components/
│       └── screensavy/
│           ├── MainExperience.tsx      # Main component (all modes)
│           ├── VisualizerExperience.tsx # Visualizer wrapper
│           ├── shared.tsx              # Shared components and utilities
│           ├── translations.ts         # Translations (RU/EN)
│           └── textTranslations.ts     # Additional text translations
├── public/
│   ├── visualizers/             # Visualizer HTML files
│   └── [static assets]
└── [configuration files]
```

### Key Components

#### MainExperience.tsx
The main component that handles:
- All color modes (oneColor, colorChange)
- Clock mode with multiple styles
- Text mode with full customization
- Favorites and color management
- UI state and localStorage persistence
- Menu and toolbar
- Hints system

#### shared.tsx
Shared utilities and components:
- IconButton component
- Color utilities (RGB/HSL conversion)
- localStorage helpers
- Translation utilities
- Common types and interfaces

#### translations.ts
Bilingual translations (Russian/English) for all UI elements.

### Getting Help

- **Questions?** Open a [GitHub Discussion](https://github.com/timoncool/ScreenSavy.com/discussions)
- **Bug reports?** Open a [GitHub Issue](https://github.com/timoncool/ScreenSavy.com/issues)
- **Feature requests?** Open a [GitHub Issue](https://github.com/timoncool/ScreenSavy.com/issues) with the "enhancement" label

### License

By contributing to ScreenSavy, you agree that your contributions will be licensed under the MIT License.

---

## Русский

Спасибо за ваш интерес к участию в разработке ScreenSavy! Этот документ содержит рекомендации и инструкции по внесению вклада в проект.

### Кодекс поведения

Участвуя в этом проекте, вы соглашаетесь поддерживать уважительную и инклюзивную среду для всех участников.

### Начало работы

1. **Форкните репозиторий** на GitHub
2. **Клонируйте ваш форк** локально:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ScreenSavy.com.git
   cd ScreenSavy.com
   ```
3. **Установите зависимости**:
   ```bash
   npm install
   ```
4. **Создайте feature-ветку**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Рабочий процесс разработки

1. **Запустите сервер разработки**:
   ```bash
   npm run dev
   ```
   Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

2. **Внесите изменения**, следуя нашим рекомендациям по коду (см. ниже)

3. **Протестируйте ваши изменения**:
   - Тестируйте в нескольких браузерах (Chrome, Firefox, Safari)
   - Тестируйте на разных размерах экрана
   - Убедитесь, что все существующие режимы работают корректно
   - Запустите линтер: `npm run lint`

4. **Закоммитьте ваши изменения**:
   ```bash
   git add .
   git commit -m "feat: описание новой функции"
   ```
   
   Используйте conventional commit messages:
   - `feat:` для новых функций
   - `fix:` для исправления багов
   - `docs:` для изменений в документации
   - `style:` для изменений форматирования
   - `refactor:` для рефакторинга кода
   - `test:` для добавления тестов
   - `chore:` для задач обслуживания

5. **Запушьте в ваш форк**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Создайте Pull Request** на GitHub с:
   - Чётким описанием изменений
   - Скриншотами/видео для изменений UI
   - Ссылкой на связанные issue (если есть)

### Области для вклада

#### 1. Новые визуализаторы
Создавайте новые аудио или ambient визуализации:
- Добавьте HTML-файл в `public/visualizers/`
- Создайте компонент страницы в `app/modes/visualizers/your-visualizer/`
- Добавьте запись в `src/lib/visualizers.ts`
- Добавьте иконку в тулбар и меню в `MainExperience.tsx`

#### 2. Улучшения UI/UX
- Улучшайте существующие режимы
- Улучшайте доступность
- Добавляйте новые функции в MainExperience
- Оптимизируйте мобильный опыт

#### 3. Интернационализация
Добавляйте переводы для новых языков:
- Обновите `src/components/screensavy/translations.ts`
- Добавьте логику определения языка
- Протестируйте все элементы UI на новом языке

#### 4. Оптимизация производительности
- Оптимизируйте производительность рендеринга
- Уменьшайте размер бандла
- Улучшайте плавность анимаций
- Оптимизируйте использование localStorage

#### 5. Документация
- Улучшайте README
- Добавляйте комментарии в код
- Создавайте туториалы
- Документируйте API компонентов

### Рекомендации по коду

#### Общие принципы
- **Следуйте существующим паттернам**: Изучите кодовую базу перед внесением изменений
- **Держите это простым**: Предпочитайте ясность хитроумию
- **Будьте последовательны**: Соответствуйте существующему стилю кода
- **Пишите читаемый код**: Используйте осмысленные имена переменных и функций

#### Рекомендации по React/TypeScript
- Используйте функциональные компоненты с хуками
- Используйте TypeScript типы для всех props и state
- Предпочитайте `const` вместо `let`
- Используйте осмысленные имена компонентов и переменных
- Извлекайте переиспользуемую логику в кастомные хуки
- Держите компоненты сфокусированными и однозадачными

#### Рекомендации по стилизации
- Используйте классы Tailwind CSS когда возможно
- Следуйте существующим паттернам именования классов
- Обеспечивайте адаптивный дизайн (мобильные, планшеты, десктоп)
- Тестируйте в тёмных и светлых окружениях
- Поддерживайте консистентные отступы и размеры

#### Управление состоянием
- Используйте React хуки (`useState`, `useCallback`, `useEffect`, и т.д.)
- Сохраняйте важное состояние в localStorage
- Держите состояние максимально локальным
- Используйте refs для значений, которые не вызывают ре-рендеры

#### Производительность
- Мемоизируйте дорогие вычисления с `useMemo`
- Мемоизируйте коллбэки с `useCallback`
- Избегайте ненужных ре-рендеров
- Используйте `requestAnimationFrame` для анимаций
- Ленивая загрузка тяжёлых компонентов когда возможно

### Чеклист тестирования

Перед отправкой PR убедитесь:

- [ ] Код проходит `npm run lint` без ошибок
- [ ] Все существующие режимы работают корректно
- [ ] Изменения работают в Chrome, Firefox и Safari
- [ ] Изменения работают на мобильных устройствах
- [ ] Нет ошибок или предупреждений в консоли
- [ ] Сохранение в localStorage работает корректно
- [ ] Переводы работают на русском и английском
- [ ] Полноэкранный режим работает корректно
- [ ] Подсказки интерфейса отображаются корректно
- [ ] Цветовые переходы плавные
- [ ] Нет регрессий производительности

### Получение помощи

- **Вопросы?** Откройте [GitHub Discussion](https://github.com/timoncool/ScreenSavy.com/discussions)
- **Сообщения о багах?** Откройте [GitHub Issue](https://github.com/timoncool/ScreenSavy.com/issues)
- **Запросы функций?** Откройте [GitHub Issue](https://github.com/timoncool/ScreenSavy.com/issues) с меткой "enhancement"

### Лицензия

Внося вклад в ScreenSavy, вы соглашаетесь, что ваш вклад будет лицензирован под лицензией MIT.
