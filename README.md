# ScreenSavy.com

ScreenSavy.com is a web experience for transforming any display into an ambient screen background. The app revives the nostalgia of classic screensavers and pairs it with modern controls so you can stage color washes, animated transitions, or functional overlays like clocks and typography on laptops, TVs, projectors, or tablets.

The project is actively developed in Russian and English and focuses on lightweight, offline-friendly visuals that run directly in the browser. ScreenSavy is ideal for mood lighting, photo shoots, home theater ambience, and creative workspaces where a tuned backdrop supports the moment.

## Core experiences

- **One Color mode** – set a single RGB tone across the entire screen. Perfect for monitor calibration, ambient lighting, or color therapy.
- **Color Change mode** – build a palette of favorite shades and let ScreenSavy cycle through them with adjustable speed controls.
- **Clock mode** – display modern, full, or minimal time readouts with automatic locale-aware day and date formatting.
- **Favorites & palettes** – capture swatches to reuse later, explore tonal variations with the Shades panel, and fine-tune channels with numeric sliders.
- **Text mode (/modes/text)** – craft typography-first layouts with adjustable fonts, weights, alignments, and color pairings for signage or event screens.
- **Interface ergonomics** – toggle full-screen, hide controls for a clean presentation, and rely on contextual hints that guide first-time visitors.

## Why people use ScreenSavy

ScreenSavy surfaced on [ProductRadar](https://productradar.ru/product/screensavy-com/) as a utility for:

_Support the project: [endorse the ProductRadar listing](https://productradar.ru/product/screensavy-com/) to help more creators discover ScreenSavy._

- Setting the mood during movie nights without needing additional lighting equipment.
- Verifying monitor color reproduction or comparing palettes for design projects.
- Turning spare displays into dynamic clocks or informational panels.
- Preparing backgrounds for photography and video shoots using a phone, tablet, or smart TV.
- Creating atmospheric lighting in studios, classrooms, or hospitality spaces.

## Technology stack

- **Framework** – Next.js 14 with React 18 for a hybrid static/interactive experience.
- **Styling** – Tailwind CSS alongside handcrafted utility classes tuned for full-screen layouts.
- **State & storage** – Client-side React state with localStorage persistence for favorites, UI preferences, and animation settings.
- **Internationalization** – Built-in Russian and English translations with automatic browser language detection.

## Getting started

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

### Production build

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

1. Fork the repository and create a feature branch from `main`.
2. Install dependencies and ensure `npm run lint` passes locally.
3. Provide clear descriptions in pull requests, including screenshots for UI changes when practical.
4. Ensure commits use meaningful messages and reference related issues when available.
5. Request review from a project maintainer before merging.

## Roadmap highlights

- **Expanded visual modes:** add gradients, particle systems, and sound-reactive scenes.
- **Scheduling:** plan scene changes or timers for events and working sessions.
- **Remote control:** mirror settings across devices and enable quick adjustments from a phone.
- **Advanced typography:** presets for lyric videos, prompts, or workshop signage.
- **Accessibility:** richer keyboard navigation, ARIA coverage, and high-contrast presets.

## Assets

Static assets (favicons, manifest, mask icons) live under the `public/` directory and are automatically served by Next.js.
