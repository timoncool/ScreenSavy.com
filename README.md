# ScreenSavy.com

ScreenSavy.com is a curated home for movie and television discovery experiences. The project currently focuses on a streamlined
single-page experience built with Next.js 14 and React 18, but the broader vision extends toward companion tooling for critics,
curators, and casual viewers.

## Product vision

- **Personalized discovery** – provide dynamic content modules that surface films and series based on mood, availability, and
  viewing history.
- **Seamless modes** – offer alternative consumption modes (such as text-only and accessibility-first layouts) that adapt the
  core experience to any context.
- **Community insights** – lay the foundation for critic capsules, user lists, and editorial spotlights that help audiences make
  confident decisions quickly.

## Core features

- **Hero carousel** showcasing highlighted titles and editorial picks.
- **Content rails** for trending films, fresh releases, and curated collections sourced from partner APIs.
- **Text mode** interface available at `/modes/text` for a lightweight, accessibility-friendly exploration path.
- **Responsive layout system** tuned for large-format displays down to mobile breakpoints using Tailwind CSS.

## Current limitations

- **Limited data sources** – content is populated from mocked or cached fixtures until external API integrations are finalized.
- **Minimal personalization** – user-specific recommendations and profiles are not yet implemented.
- **Basic analytics** – event tracking is stubbed; meaningful engagement metrics still need instrumentation.
- **No authentication** – browsing is anonymous; account creation and syncing across devices are future enhancements.

## Getting started

### Requirements

- Node.js 18.17 or newer (Next.js 14 requirement)
- npm 9 or newer

### Installation

Install dependencies once Node.js and npm are available:

```bash
npm install
```

> **Note:** The development environment used to create this project did not have external npm registry access. If you encounter
> installation issues ensure the registry is reachable from your network.

### Development

Start the development server with hot reloading:

```bash
npm run dev
```

By default the app serves on [http://localhost:3000](http://localhost:3000). Navigate to `/` for the main experience or
`/modes/text` for the text mode interface.

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

- **API integrations:** connect to external catalog services (e.g., TMDB) for live data feeds.
- **Personalization:** introduce user accounts, watchlists, and tailored recommendations.
- **Editorial tooling:** build internal dashboards for curators to manage spotlights and seasonal collections.
- **Accessibility:** expand keyboard navigation, ARIA coverage, and alternative modes beyond text-only.
- **Analytics & insights:** add privacy-aware tracking to understand feature engagement and inform future iterations.

## Assets

Static assets (favicons, manifest, mask icons) live under the `public/` directory and are automatically served by Next.js.
