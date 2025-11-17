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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&family=Montserrat:wght@300;400;700&family=Playfair+Display:wght@400;700&family=Oswald:wght@300;400;700&family=Raleway:wght@300;400;700&family=Lobster&family=Pacifico&family=Dancing+Script:wght@400;700&family=Caveat:wght@400;700&family=Bebas+Neue&family=Comfortaa:wght@300;400;700&family=Unbounded:wght@300;400;700&family=Russo+One&family=Philosopher:wght@400;700&family=PT+Sans:wght@400;700&family=Amatic+SC:wght@400;700&family=Bad+Script&family=El+Messiri:wght@400;700&family=Neucha&family=Marck+Script&family=Poiret+One&family=Press+Start+2P&family=Kelly+Slab&family=Yeseva+One&display=swap"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
