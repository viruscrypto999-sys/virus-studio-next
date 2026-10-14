'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAppStore } from '@/components/providers/AppProviders';

// Lazy-load WebGL canvas only after initial paint so First Contentful Paint is never blocked
const LazyLiquidMetalCanvas = dynamic(() => import('./LiquidMetalCanvas'), {
 ssr: false,
});

export function HeroSection() {
 const { openCommandPalette, setCursorLabel } = useAppStore();
 const [mountShader, setMountShader] = useState(false);
 const [engineStatus, setEngineStatus] = useState('INITIALIZING OPTICS');

 useEffect(() => {
   const timer = window.setTimeout(() => {
     setMountShader(true);
   }, 80);
   return () => window.clearTimeout(timer);
 }, []);

 const quickQueries = [
   { label: 'Autonomous Coding IDEs', query: 'Kinetix' },
   { label: 'Formal Math Reasoners', query: 'Veritas' },
   { label: '4D World Simulators', query: 'Chronos' },
   { label: 'Sub-Quadratic Models', query: 'Sub-Quadratic' },
 ];

 return (
   <section
     aria-labelledby="hero-heading"
     className="relative min-h-[94dvh] flex flex-col justify-between pt-28 pb-12 sm:pt-36 sm:pb-16 px-4 sm:px-8 overflow-hidden border-b border-hairline"
   >
     {/* Lazy WebGL Liquid-Metal Background */}
     {mountShader && (
       <LazyLiquidMetalCanvas onEngineStatusChange={setEngineStatus} />
     )}

     {/* Top Spatial Telemetry Bar */}
     <div className="relative z-10 mx-auto w-full max-w-[1440px] flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4 text-[11px] font-mono uppercase tracking-[0.16em] text-muted">
       <div className="flex items-center gap-2.5">
         <span className="h-2 w-2 rounded-full bg-accent" />
         <span>VIRUS STUDIO // INTELLIGENCE INDEX 2026–3050</span>
       </div>
       <div className="flex items-center gap-6 tabular-nums">
         <span className="hidden sm:inline">TWO PILLARS: APPS + DISPATCHES</span>
         <span className="text-accent">{engineStatus}</span>
       </div>
     </div>

     {/* Main Editorial Display Headline + Command Trigger */}
     <div className="relative z-10 mx-auto w-full max-w-[1440px] my-auto py-12 sm:py-16">
       <div className="max-w-6xl">
         <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
           [ARCHITECTURAL DIRECTORY & PRIMARY RESEARCH WIRE]
         </p>

         <h1
           id="hero-heading"
           className="display-hero font-medium tracking-tight text-text"
         >
           <span className="block overflow-hidden pb-1">
             <span className="block">The spatial index for</span>
           </span>
           <span className="block overflow-hidden pb-2">
             <span className="font-serif italic font-normal text-accent">
               autonomous
             </span>{' '}
             <span>machines &</span>{' '}
             <span className="font-serif italic font-normal">frontier</span>{' '}
             <span>dispatches.</span>
           </span>
         </h1>

         <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted leading-relaxed">
           Zero hype. Zero synthetic noise. Virus Studio curates two strictly verified
           pillars: benchmarked AI applications and primary-source research
           journalism.
         </p>

         {/* Interactive Command Search Bar Trigger */}
         <div className="mt-9 max-w-2xl">
           <div
             onMouseEnter={() => setCursorLabel('Search')}
             onMouseLeave={() => setCursorLabel(null)}
             onClick={() => openCommandPalette('')}
             role="button"
             tabIndex={0}
             onKeyDown={(e) => {
               if (e.key === 'Enter' || e.key === ' ') {
                 e.preventDefault();
                 openCommandPalette('');
               }
             }}
             aria-label="Open interactive command palette search"
             className="group spatial-card flex items-center justify-between gap-4 rounded-r24 px-5 py-4 cursor-pointer hover:border-accent/45"
           >
             <div className="flex items-center gap-3.5 min-w-0">
               <svg
                 className="h-4 w-4 text-accent shrink-0 transition-transform duration-micro group-hover:scale-110"
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="1.75"
               >
                 <circle cx="11" cy="11" r="7" />
                 <path d="M20 20l-3.5-3.5" />
               </svg>
               <span className="truncate text-sm sm:text-base text-muted group-hover:text-text transition-colors">
                 Query 30 verified AI systems, latency benchmarks, or research briefs...
               </span>
             </div>
             <div className="flex items-center gap-2 shrink-0">
               <kbd className="rounded-r10 border border-hairline bg-raised px-2.5 py-1 font-mono text-xs text-accent">
                 ⌘K
               </kbd>
             </div>
           </div>

           {/* Instant Filter Chips */}
           <div className="mt-3.5 flex flex-wrap items-center gap-2">
             <span className="font-mono text-[11px] uppercase tracking-wider text-muted mr-1">
               Direct probes:
             </span>
             {quickQueries.map((q) => (
               <button
                 key={q.label}
                 type="button"
                 onClick={() => openCommandPalette(q.query)}
                 className="rounded-r10 border border-hairline bg-surface/80 px-2.5 py-1 text-xs text-muted hover:text-text hover:border-accent/40 transition-colors"
               >
                 {q.label}
               </button>
             ))}
           </div>
         </div>
       </div>
     </div>

     {/* Bottom Two-Pillar Architectural Entry Matrix */}
     <div className="relative z-10 mx-auto w-full max-w-[1440px] grid grid-cols-1 md:grid-cols-12 gap-4 pt-6 border-t border-hairline">
       <div className="md:col-span-5 flex flex-col justify-between">
         <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
           STRICT DUAL-PILLAR ARCHITECTURE
         </p>
         <p className="mt-1 text-xs text-muted max-w-md">
           Every entry is stress-tested for token throughput, deterministic accuracy,
           and operational longevity.
         </p>
       </div>

       <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
         <Link
           href="/apps"
           onMouseEnter={() => setCursorLabel('Open')}
           onMouseLeave={() => setCursorLabel(null)}
           className="spatial-card rounded-r16 p-4 flex items-center justify-between group"
         >
           <div>
             <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
               PILLAR 01 // DIRECTORY
             </span>
             <h2 className="mt-1 text-base font-medium text-text">
               Apps & AI Tools
             </h2>
             <p className="text-xs text-muted mt-0.5 tabular-nums">
               30 Systems · Side-by-Side Compare
             </p>
           </div>
           <span className="h-8 w-8 rounded-r10 border border-hairline bg-raised flex items-center justify-center text-text transition-transform duration-ui ease-expo-out group-hover:translate-x-1">
             →
           </span>
         </Link>

         <Link
           href="/news"
           onMouseEnter={() => setCursorLabel('Read')}
           onMouseLeave={() => setCursorLabel(null)}
           className="spatial-card rounded-r16 p-4 flex items-center justify-between group"
         >
           <div>
             <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
               PILLAR 02 // EDITORIAL
             </span>
             <h2 className="mt-1 text-base font-medium text-text">
               AI News & Dispatches
             </h2>
             <p className="text-xs text-muted mt-0.5 tabular-nums">
               24 Briefs · Live TL;DR Synthesis
             </p>
           </div>
           <span className="h-8 w-8 rounded-r10 border border-hairline bg-raised flex items-center justify-center text-text transition-transform duration-ui ease-expo-out group-hover:translate-x-1">
             →
           </span>
         </Link>
       </div>
     </div>
   </section>
 );
}
