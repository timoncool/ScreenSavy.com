import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScreenSavy.com',
  description:
    'ScreenSavy.com is a web platform for creating immersive color backgrounds, screensavers, text layouts, and visual experiences for any display.'
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
