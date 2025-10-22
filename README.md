# ScreenSavy.com (Next.js)

This repository contains the ScreenSavy.com single-page experiences rebuilt with Next.js 14 and React 18. The main experience is available at the root route (`/`) and text mode is exposed at `/modes/text`.

## Requirements

- Node.js 18.17 or newer (Next.js 14 requirement)
- npm 9 or newer

## Installation

Install dependencies once Node.js and npm are available:

```bash
npm install
```

> **Note:** The development environment used to create this project did not have external npm registry access. If you encounter installation issues ensure the registry is reachable from your network.

## Development

Start the development server with hot reloading:

```bash
npm run dev
```

By default the app serves on [http://localhost:3000](http://localhost:3000). Navigate to `/` for the main experience or `/modes/text` for the text mode interface.

## Production build

Generate an optimized production build and start it locally:

```bash
npm run build
npm start
```

The `npm start` command runs `next start` which serves the pre-built application.

## Linting

Run ESLint using the Next.js configuration:

```bash
npm run lint
```

Resolve any reported issues before committing changes.

## Assets

Static assets (favicons, manifest, mask icons) live under the `public/` directory and are automatically served by Next.js.
