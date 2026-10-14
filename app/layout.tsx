import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import { SmoothScrollAndCursor } from '@/components/providers/SmoothScrollAndCursor';
import { IntroSequence } from '@/components/layout/IntroSequence';
import { Navbar } from '@/components/layout/Navbar';
import { CommandPalette } from '@/components/layout/CommandPalette';

export const metadata: Metadata = {
 metadataBase: new URL('https://virus.studio'),
 title: {
   default: 'Virus Studio — Spatial Directory for Autonomous AI Tools & Dispatches',
   template: '%s · Virus Studio',
 },
 description:
   'Designed in 3050, shipping in 2026. The definitive two-pillar intelligence index for benchmarked AI applications and primary-source research journalism.',
 openGraph: {
   title: 'Virus Studio — Apps & AI Tools + Frontier AI News',
   description:
     'Calm, spatial, benchmark-driven directory of autonomous systems and primary AI dispatches.',
   type: 'website',
   locale: 'en_US',
   siteName: 'Virus Studio',
 },
 twitter: {
   card: 'summary_large_image',
   title: 'Virus Studio',
   description: 'Apps & AI Tools Directory + Frontier AI Dispatches.',
 },
};

export const viewport: Viewport = {
 themeColor: [
   { media: '(prefers-color-scheme: dark)', color: '#06070A' },
   { media: '(prefers-color-scheme: light)', color: '#F4F3EF' },
 ],
 width: 'device-width',
 initialScale: 1,
};

const THEME_INIT_SCRIPT = `
(function() {
 try {
   var saved = localStorage.getItem('vs_theme');
   var theme = (saved === 'light' || saved === 'dark') ? saved : 'dark';
   document.documentElement.setAttribute('data-theme', theme);
 } catch (e) {
   document.documentElement.setAttribute('data-theme', 'dark');
 }
})();
`;

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
   <html
     lang="en"
     data-theme="dark"
     suppressHydrationWarning
     className={`font-sans-loaded`}
   >
     <head>
       <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
     </head>
     <body className="font-sans bg-bg text-text antialiased selection:bg-accent/20">
       {/* Skip to main content link for full WCAG AA keyboard flow */}
       <a
         href="#main-content"
         className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-r10 focus:bg-raised focus:px-4 focus:py-2 focus:text-xs focus:font-mono focus:text-accent"
       >
         Skip to main content
       </a>

       {/* 3% Film Grain Overlay */}
       <div aria-hidden="true" className="film-grain-overlay" />

       <AppProviders>
         <SmoothScrollAndCursor />
         <IntroSequence />
         <Navbar />
         <CommandPalette />
         <main id="main-content" className="relative min-h-dvh">
           {children}
         </main>
       </AppProviders>
     </body>
   </html>
 );
}
