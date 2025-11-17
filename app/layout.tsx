import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Roboto_Mono } from 'next/font/google';
import '../src/styles/variables.css';
import '../src/styles/animations.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ScreenSavy.com - Immersive Color Experiences',
  description:
    'ScreenSavy.com is a web platform for creating immersive color backgrounds, screensavers, text layouts, and visual experiences for any display.',
  keywords: ['color', 'screensaver', 'background', 'RGB', 'color picker', 'display', 'visual experience'],
  authors: [{ name: 'ScreenSavy Team' }],
  openGraph: {
    title: 'ScreenSavy.com - Immersive Color Experiences',
    description: 'Create vibrant color backgrounds and visual experiences for any display',
    type: 'website',
    url: 'https://screensavy.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScreenSavy.com',
    description: 'Create vibrant color backgrounds and visual experiences',
  },
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
