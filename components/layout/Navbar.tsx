'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/components/providers/AppProviders';

export function Navbar() {
 const pathname = usePathname();
 const {
   theme,
   toggleTheme,
   openCommandPalette,
   bookmarkedApps,
   bookmarkedNews,
   compareSlugs,
 } = useAppStore();

 const [condensed, setCondensed] = useState(false);
 const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

 const totalSaved = bookmarkedApps.length + bookmarkedNews.length;

 // Passive RAF scroll listener to toggle condensed state without layout thrashing
 useEffect(() => {
   let rafId = 0;
   let ticking = false;

   const checkScroll = () => {
     ticking = false;
     const shouldCondense = window.scrollY > 36;
     setCondensed((prev) => (prev !== shouldCondense ? shouldCondense : prev));
   };

   const onScroll = () => {
     if (!ticking) {
       ticking = true;
       rafId = window.requestAnimationFrame(checkScroll);
     }
   };

   window.addEventListener('scroll', onScroll, { passive: true });
   checkScroll();

   return () => {
     window.removeEventListener('scroll', onScroll);
     window.cancelAnimationFrame(rafId);
   };
 }, []);

 // Close mobile bottom-sheet when route changes
 useEffect(() => {
   setMobileSheetOpen(false);
 }, [pathname]);

 const navLinks = [
   { href: '/', label: 'Index', code: '00' },
   { href: '/apps', label: 'Apps & AI Tools', code: '01' },
   { href: '/news', label: 'AI News', code: '02' },
 ];

 return (
   <>
     <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none px-3 sm:px-6 pt-3 sm:pt-4">
       <div
         className={`mx-auto max-w-[1440px] pointer-events-auto spatial-glass rounded-r24 px-4 sm:px-6 py-3 transition-transform duration-ui ease-expo-out ${
           condensed ? 'scale-[0.985] -translate-y-0.5' : 'scale-100 translate-y-0'
         }`}
       >
         <nav
           aria-label="Primary spatial navigation"
           className="flex items-center justify-between gap-4"
         >
           {/* Brand Wordmark */}
           <Link
             href="/"
             className="group flex items-center gap-3 focus:outline-none"
           >
             <span className="relative flex h-7 w-7 items-center justify-center rounded-r10 border border-hairline bg-raised text-xs font-mono font-medium text-text">
               V
               <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
             </span>
             <div className="flex items-baseline gap-1.5">
               <span className="text-sm sm:text-base font-medium tracking-tight text-text">
                 Virus
               </span>
               <span className="font-serif italic text-base sm:text-lg text-muted group-hover:text-text transition-colors">
                 Studio
               </span>
             </div>
           </Link>

           {/* Center Pillar Links (Desktop) */}
           <div className="hidden md:flex items-center gap-1 rounded-r16 border border-hairline bg-bg/50 p-1">
             {navLinks.map((item) => {
               const isActive =
                 item.href === '/'
                   ? pathname === '/'
                   : pathname?.startsWith(item.href);

               return (
                 <Link
                   key={item.href}
                   href={item.href}
                   className={`relative flex items-center gap-2 rounded-r10 px-3.5 py-1.5 text-xs font-medium transition-colors duration-micro ${
                     isActive
                       ? 'bg-raised text-text border border-hairline'
                       : 'text-muted hover:text-text'
                   }`}
                 >
                   <span className="font-mono text-[10px] text-accent opacity-80">
                     {item.code}
                   </span>
                   <span>{item.label}</span>
                 </Link>
               );
             })}
           </div>

           {/* Right Actions: Command Palette, Saved Counter, Theme, Mobile Trigger */}
           <div className="flex items-center gap-2">
             <button
               type="button"
               onClick={() => openCommandPalette('')}
               aria-label="Open Command Palette (Command + K)"
               className="flex items-center gap-3 rounded-r10 border border-hairline bg-raised/75 px-3 py-1.5 text-xs text-muted hover:text-text hover:border-accent/40 transition-colors"
             >
               <span className="flex items-center gap-1.5">
                 <svg
                   className="h-3.5 w-3.5 text-accent"
                   viewBox="0 0 24 24"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="1.75"
                 >
                   <circle cx="11" cy="11" r="7" />
                   <path d="M20 20l-3.5-3.5" />
                 </svg>
                 <span className="hidden sm:inline">Search index...</span>
               </span>
               <kbd className="hidden sm:inline-block rounded border border-hairline bg-bg px-1.5 py-0.5 font-mono text-[10px] text-muted">
                 ⌘K
               </kbd>
             </button>

             {compareSlugs.length > 0 && (
               <Link
                 href="/apps?compare=open"
                 className="hidden sm:flex items-center gap-1.5 rounded-r10 border border-accent/40 bg-accent/10 px-2.5 py-1.5 text-xs font-mono text-text tabular-nums"
                 title="Compare selected AI tools"
               >
                 <span>Compare</span>
                 <span className="text-accent">{compareSlugs.length}/3</span>
               </Link>
             )}

             {totalSaved > 0 && (
               <Link
                 href="/apps?filter=saved"
                 className="hidden sm:flex items-center gap-1.5 rounded-r10 border border-hairline bg-raised px-2.5 py-1.5 text-xs font-mono text-muted hover:text-text tabular-nums"
                 title="Saved bookmarks"
               >
                 <span>Saved</span>
                 <span className="text-accent">{totalSaved}</span>
               </Link>
             )}

             {/* Theme Toggle */}
             <button
               type="button"
               onClick={toggleTheme}
               aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
               className="flex h-8 w-8 items-center justify-center rounded-r10 border border-hairline bg-raised/75 text-muted hover:text-text transition-colors"
             >
               {theme === 'dark' ? (
                 <svg
                   className="h-3.5 w-3.5"
                   viewBox="0 0 24 24"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="1.75"
                 >
                   <circle cx="12" cy="12" r="4" />
                   <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                 </svg>
               ) : (
                 <svg
                   className="h-3.5 w-3.5"
                   viewBox="0 0 24 24"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="1.75"
                 >
                   <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                 </svg>
               )}
             </button>

             {/* Mobile Bottom-Sheet Trigger */}
             <button
               type="button"
               onClick={() => setMobileSheetOpen(true)}
               aria-expanded={mobileSheetOpen}
               aria-label="Open navigation menu"
               className="flex md:hidden h-8 w-8 items-center justify-center rounded-r10 border border-hairline bg-raised text-text"
             >
               <svg
                 className="h-4 w-4"
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="1.75"
               >
                 <path d="M4 8h16M4 16h16" />
               </svg>
             </button>
           </div>
         </nav>
       </div>
     </header>

     {/* Mobile Bottom-Sheet Navigation (Transform & Opacity only) */}
     <div
       aria-hidden={!mobileSheetOpen}
       className={`fixed inset-0 z-50 md:hidden transition-opacity duration-ui ease-expo-out ${
         mobileSheetOpen
           ? 'opacity-100 pointer-events-auto'
           : 'opacity-0 pointer-events-none'
       }`}
     >
       <div
         onClick={() => setMobileSheetOpen(false)}
         className="absolute inset-0 bg-black/60"
       />
       <div
         role="dialog"
         aria-modal="true"
         aria-label="Mobile Navigation Sheet"
         className={`absolute bottom-0 left-0 right-0 rounded-t-r24 border-t border-hairline bg-surface p-6 transition-transform duration-ui ease-expo-out ${
           mobileSheetOpen ? 'translate-y-0' : 'translate-y-full'
         }`}
       >
         <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-hairline" />
         <div className="flex items-center justify-between pb-4 border-b border-hairline">
           <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
             Navigation Matrix
           </span>
           <button
             type="button"
             onClick={() => setMobileSheetOpen(false)}
             className="text-xs font-mono text-muted hover:text-text"
           >
             [CLOSE]
           </button>
         </div>

         <div className="mt-4 flex flex-col gap-2">
           {navLinks.map((item) => (
             <Link
               key={item.href}
               href={item.href}
               className="flex items-center justify-between rounded-r16 border border-hairline bg-raised px-4 py-3.5 text-base font-medium text-text"
             >
               <span>{item.label}</span>
               <span className="font-mono text-xs text-accent">{item.code}</span>
             </Link>
           ))}
         </div>

         <div className="mt-4 grid grid-cols-2 gap-2 pt-4 border-t border-hairline">
           <button
             type="button"
             onClick={() => {
               setMobileSheetOpen(false);
               openCommandPalette('');
             }}
             className="rounded-r16 border border-hairline bg-bg px-4 py-3 text-left text-xs font-mono text-text"
           >
             Search Index (⌘K)
           </button>
           <button
             type="button"
             onClick={toggleTheme}
             className="rounded-r16 border border-hairline bg-bg px-4 py-3 text-left text-xs font-mono text-text"
           >
             Theme: {theme.toUpperCase()}
           </button>
         </div>
       </div>
     </div>
   </>
 );
}
