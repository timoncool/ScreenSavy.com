# ScreenSavy.com

**English** | [Русский](README.ru.md)

**Live Demo:** [https://www.screensavy.com/](https://www.screensavy.com/)

ScreenSavy.com is a web experience for transforming any display into an ambient screen background. The app revives the nostalgia of classic screensavers and pairs it with modern controls so you can stage color washes, animated transitions, or functional overlays like clocks and typography on laptops, TVs, projectors, or tablets.

The project is actively developed in Russian and English and focuses on lightweight, offline-friendly visuals that run directly in the browser. ScreenSavy is ideal for mood lighting, photo shoots, home theater ambience, and creative workspaces where a tuned backdrop supports the moment.

## Core Experiences

- **One Color mode** – set a single RGB tone across the entire screen. Perfect for monitor calibration, ambient lighting, or color therapy.
- **Color Change mode** – build a palette of favorite shades and let ScreenSavy cycle through them with adjustable speed controls.
- **Clock mode** – display modern, full, or minimal time readouts with automatic locale-aware day and date formatting.
- **Text mode** – craft typography-first layouts with adjustable fonts (28 options), sizes, alignments, colors, and styles for signage or event screens.
- **Favorites & palettes** – capture swatches to reuse later, explore tonal variations with the Shades panel, and fine-tune channels with numeric sliders.
- **Visualizers** – interactive audio and ambient visualizations:
  - **Audio Visualizers:** Celestial Weaver, Super Nova, Voyager
  - **Ambient Visualizers:** Lava Lamp, RGB Lava
- **Interface ergonomics** – toggle full-screen, hide controls for a clean presentation, and rely on contextual hints that guide first-time visitors.

## Why People Use ScreenSavy

ScreenSavy surfaced on [ProductRadar](https://productradar.ru/product/screensavy-com/) as a utility for:

_Support the project: [endorse the ProductRadar listing](https://productradar.ru/product/screensavy-com/) to help more creators discover ScreenSavy._

- Setting the mood during movie nights without needing additional lighting equipment.
- Verifying monitor color reproduction or comparing palettes for design projects.
- Turning spare displays into dynamic clocks or informational panels.
- Preparing backgrounds for photography and video shoots using a phone, tablet, or smart TV.
- Creating atmospheric lighting in studios, classrooms, or hospitality spaces.

## Technology Stack

- **Framework** – Next.js 14 with React 18 for a hybrid static/interactive experience.
- **Styling** – Tailwind CSS alongside handcrafted utility classes tuned for full-screen layouts.
- **State & storage** – Client-side React state with localStorage persistence for favorites, UI preferences, and animation settings.
- **Internationalization** – Built-in Russian and English translations with automatic browser language detection.

## Portable Windows release

ScreenSavy ships with two helper scripts — `start.bat` and `update.bat` — that allow you to bundle the app together with a portable copy of Node.js for Windows users. The scripts live in the repository root and expect the following structure inside the release archive:

```text
ScreenSavy.com-portable/
├─ node/          (portable Node.js extracted from the official ZIP)
├─ .next/         (prebuilt production output)
├─ node_modules/  (dependencies installed with `npm install --omit=dev`)
├─ start.bat      (launches the local Next.js server)
└─ update.bat     (downloads or pulls the latest project version)
```

* `start.bat` looks for the portable runtime in `node/`, installs dependencies on the first run if they are missing, builds the production bundle when necessary, and then starts the server at `http://127.0.0.1:3000` while launching the default browser.
* `update.bat` works both with Git clones and clean portable folders. It either executes `git pull` or downloads the latest ZIP from GitHub, reinstalls dependencies, removes the stale `.next` folder, and rebuilds the app.

See [`docs/PORTABLE_RELEASE.md`](docs/PORTABLE_RELEASE.md) for the full, step-by-step checklist that the release maintainer can follow to produce the archive that gets published on the Releases page.

## Project Structure

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

## Getting Started

### Requirements

- Node.js 18.17 or newer (Next.js 14 requirement)
- npm 9 or newer

### Installation

Install dependencies once Node.js and npm are available:

```bash
npm install
```

> **Note:** The development environment used to create this project did not have external npm registry access. If you encounter installation issues ensure the registry is reachable from your network.

### Development

Start the development server with hot reloading:

```bash
npm run dev
```

By default the app serves on [http://localhost:3000](http://localhost:3000). Navigate to `/` for the main color experience or `/modes/text` for the text mode interface.

### Production Build

Generate an optimized production build and start it locally:

```bash
npm run build
npm start
```

The `npm start` command runs `next start` which serves the pre-built application.

### Linting

Run ESLint using the Next.js configuration:

```bash
npm run lint
```

Resolve any reported issues before committing changes.

## Contributing

We welcome contributions to ScreenSavy! Here's how you can help:

### Quick Start

1. Fork the repository and create a feature branch from `main`.
2. Install dependencies and ensure `npm run lint` passes locally.
3. Provide clear descriptions in pull requests, including screenshots for UI changes when practical.
4. Ensure commits use meaningful messages and reference related issues when available.
5. Request review from a project maintainer before merging.

### Areas for Contribution

- **New Visualizers:** Create new audio or ambient visualizations
- **UI/UX Improvements:** Enhance existing modes or add new features
- **Internationalization:** Add translations for new languages
- **Performance:** Optimize rendering and animations
- **Documentation:** Improve README, code comments, or create tutorials
- **Bug Fixes:** Help identify and fix issues

### Code Guidelines

- Follow existing code patterns and style
- Write clean, readable code with meaningful variable names
- Add comments for complex logic
- Test your changes across different browsers and screen sizes
- Ensure all modes work correctly after your changes

## Roadmap Highlights

- **Expanded visual modes:** add gradients, particle systems, and sound-reactive scenes.
- **Scheduling:** plan scene changes or timers for events and working sessions.
- **Remote control:** mirror settings across devices and enable quick adjustments from a phone.
- **Advanced typography:** presets for lyric videos, prompts, or workshop signage.
- **Accessibility:** richer keyboard navigation, ARIA coverage, and high-contrast presets.

## License

This project is open-source and available under the MIT License.

## Links

- **Live Demo:** [https://www.screensavy.com/](https://www.screensavy.com/)
- **ProductRadar:** [https://productradar.ru/product/screensavy-com/](https://productradar.ru/product/screensavy-com/)
- **GitHub:** [https://github.com/timoncool/ScreenSavy.com](https://github.com/timoncool/ScreenSavy.com)

---

Made with ❤️ for creators, designers, and everyone who appreciates beautiful ambient screens.
