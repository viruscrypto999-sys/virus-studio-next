/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
Complete 5-Phase Verification Checklist
Requirement	File(s)	Status
Design Tokens & Light/Dark Zero-Flash	app/globals.css, tailwind.config.ts, app/layout.tsx	Verified
Session-Once <1.4s Skippable Intro	components/layout/IntroSequence.tsx	Verified
60fps WebGL Liquid-Metal + 50fps Auto-Downgrade	components/hero/LiquidMetalCanvas.tsx, HeroSection.tsx	Verified
Condensing Glass Navbar + Mobile Bottom-Sheet	components/layout/Navbar.tsx	Verified
Cmd/Ctrl+K Command Palette (All 54 Items)	components/layout/CommandPalette.tsx	Verified
10 Reusable UI Primitives (3D Tilt, Roll, etc.)	components/ui/Primitives.tsx, ViewTransitionLink.tsx	Verified
Home Page (Pinned Story, Bento, Drag Rail, Stats)	app/page.tsx, components/home/*	Verified
30 Realistic Seed Apps + 8 Taxonomies	lib/seed-apps.ts (26 + 4 patch = 30/30)	Verified
Apps Directory, 3-Way Compare, Detail, Categories	app/apps/**, components/apps/*	Verified
24 Primary News Articles + SWR RSS/API Adapter	lib/seed-news.ts (24/24), lib/news-adapter.ts	Verified
News Ticker, Masonry Feed, Reader + Live TOC	app/news/**, components/news/*	Verified
Dynamic OG Images, JSON-LD, Sitemap, Robots, 404, Footer	app/opengraph-image.tsx, sitemap.ts, robots.ts, Footer.tsx	Verified
