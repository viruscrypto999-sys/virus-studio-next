import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import { SmoothScrollAndCursor } from '@/components/providers/SmoothScrollAndCursor';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  metadataBase: new URL('https://virus-studio.vercel.app'),
  title: {
    default: 'VIRUS STUDIO — Apps. Games. Future.',
    template: '%s · VIRUS STUDIO',
  },
  description:
    'VIRUS STUDIO by iTzVirus. Download Virus Arrows Pro and more. Apps. Games. Future.',
  openGraph: {
    title: 'VIRUS STUDIO — Apps. Games. Future.',
    description: 'Download Virus Arrows Pro. Built by iTzVirus.',
    type: 'website',
    locale: 'en_US',
    siteName: 'VIRUS STUDIO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIRUS STUDIO',
    description: 'Apps. Games. Future. By iTzVirus.',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="font-sans bg-bg text-text antialiased">
        <div aria-hidden="true" className="film-grain-overlay" />
        <AppProviders>
          <SmoothScrollAndCursor />
          <Navbar />
          <main id="main-content" className="relative min-h-dvh">
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
