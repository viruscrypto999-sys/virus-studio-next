'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/components/providers/AppProviders';
import {
 buildHighlightSegments,
 fuzzyMatch,
 INITIAL_QUICK_INDEX,
} from '@/lib/utils';
import { SearchableQuickItem } from '@/lib/types';

interface CommandPaletteProps {
 extraItems?: SearchableQuickItem[];
}

export function CommandPalette({ extraItems = [] }: CommandPaletteProps) {
 const router = useRouter();
 const {
   isCmdOpen,
   cmdInitialQuery,
   closeCommandPalette,
   theme,
   toggleTheme,
   soundEnabled,
   toggleSound,
   playTick,
 } = useAppStore();

 const [rawQuery, setRawQuery] = useState('');
 const [debouncedQuery, setDebouncedQuery] = useState('');
 const [activeIndex, setActiveIndex] = useState(0);
 const inputRef = useRef<HTMLInputElement | null>(null);

 // Sync initial query when opened from Hero search bar
 useEffect(() => {
   if (isCmdOpen) {
     setRawQuery(cmdInitialQuery);
     setDebouncedQuery(cmdInitialQuery);
     setActiveIndex(0);
     window.requestAnimationFrame(() => {
       inputRef.current?.focus();
     });
   }
 }, [isCmdOpen, cmdInitialQuery]);

 // 120ms debounce per Performance-First rules
 useEffect(() => {
   const timer = window.setTimeout(() => {
     setDebouncedQuery(rawQuery);
     setActiveIndex(0);
   }, 120);
   return () => window.clearTimeout(timer);
 }, [rawQuery]);

 const combinedPool = useMemo(() => {
   const map = new Map<string, SearchableQuickItem>();
   for (const item of [...INITIAL_QUICK_INDEX, ...extraItems]) {
     map.set(item.id, item);
   }
   return Array.from(map.values());
 }, [extraItems]);

 const results = useMemo(() => {
   if (!debouncedQuery.trim()) {
     return combinedPool.slice(0, 8).map((item) => ({
       item,
       matchedIndices: [] as number[],
       score: 1,
     }));
   }

   const scored: Array<{
     item: SearchableQuickItem;
     matchedIndices: number[];
     score: number;
   }> = [];

   for (const item of combinedPool) {
     const titleMatch = fuzzyMatch(item.title, debouncedQuery);
     const subMatch = fuzzyMatch(item.subtitle, debouncedQuery);
     if (titleMatch) {
       scored.push({
         item,
         matchedIndices: titleMatch.matchedIndices,
         score: titleMatch.score + 20,
       });
     } else if (subMatch) {
       scored.push({
         item,
         matchedIndices: [],
         score: subMatch.score,
       });
     }
   }

   return scored.sort((a, b) => b.score - a.score).slice(0, 8);
 }, [combinedPool, debouncedQuery]);

 // Keyboard navigation inside Command Palette
 useEffect(() => {
   if (!isCmdOpen) return;

   const handleKeyDown = (e: KeyboardEvent) => {
     if (e.key === 'Escape') {
       e.preventDefault();
       closeCommandPalette();
     } else if (e.key === 'ArrowDown') {
       e.preventDefault();
       setActiveIndex((prev) =>
         results.length > 0 ? (prev + 1) % results.length : 0
       );
       playTick(1560);
     } else if (e.key === 'ArrowUp') {
       e.preventDefault();
       setActiveIndex((prev) =>
         results.length > 0 ? (prev - 1 + results.length) % results.length : 0
       );
       playTick(1440);
     } else if (e.key === 'Enter' && results[activeIndex]) {
       e.preventDefault();
       const target = results[activeIndex].item;
       closeCommandPalette();
       router.push(target.href);
     }
   };

   window.addEventListener('keydown', handleKeyDown);
   return () => window.removeEventListener('keydown', handleKeyDown);
 }, [isCmdOpen, results, activeIndex, closeCommandPalette, router, playTick]);

 if (!isCmdOpen) return null;

 return (
   <div
     role="dialog"
     aria-modal="true"
     aria-label="Global Command Palette"
     className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4"
   >
     {/* Backdrop */}
     <div
       onClick={closeCommandPalette}
       className="fixed inset-0 bg-black/65 transition-opacity duration-micro"
     />

     {/* Palette Container */}
     <div className="relative z-10 w-full max-w-2xl spatial-glass rounded-r24 overflow-hidden shadow-2xl transition-all duration-ui ease-expo-out">
       {/* Search Input Header */}
       <div className="flex items-center gap-3 border-b border-hairline px-5 py-4">
         <svg
           className="h-4 w-4 text-accent shrink-0"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           strokeWidth="1.75"
         >
           <circle cx="11" cy="11" r="7" />
           <path d="M20 20l-3.5-3.5" />
         </svg>
         <input
           ref={inputRef}
           type="text"
           value={rawQuery}
           onChange={(e) => setRawQuery(e.target.value)}
           placeholder="Search 30 AI tools, 24 research dispatches, or jump to pillar..."
           aria-label="Search apps, news, and commands"
           className="w-full bg-transparent text-sm sm:text-base text-text placeholder:text-muted focus:outline-none"
         />
         {rawQuery && (
           <button
             type="button"
             onClick={() => setRawQuery('')}
             className="rounded border border-hairline px-1.5 py-0.5 font-mono text-[10px] text-muted hover:text-text"
           >
             CLEAR
           </button>
         )}
         <button
           type="button"
           onClick={closeCommandPalette}
           className="rounded border border-hairline bg-raised px-2 py-0.5 font-mono text-[10px] text-muted hover:text-text"
         >
           ESC
         </button>
       </div>

       {/* Results List */}
       <div className="max-h-[56vh] overflow-y-auto p-2.5 divide-y divide-hairline">
         <div className="pb-2">
           <div className="px-3 py-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted">
             <span>Index Matches ({results.length})</span>
             <span>↑↓ Navigate · ↵ Open</span>
           </div>

           {results.length === 0 ? (
             <div className="py-12 text-center">
               <p className="text-sm text-text font-medium">
                 No direct match for “{debouncedQuery}”
               </p>
               <p className="mt-1 text-xs text-muted">
                 Try searching for “Astra”, “Code”, “Spatial”, or “Models”.
               </p>
             </div>
           ) : (
             <ul role="listbox" className="space-y-1 mt-1">
               {results.map(({ item, matchedIndices }, idx) => {
                 const isSelected = idx === activeIndex;
                 const segments = buildHighlightSegments(
                   item.title,
                   matchedIndices
                 );

                 return (
                   <li
                     key={item.id}
                     role="option"
                     aria-selected={isSelected}
                   >
                     <button
                       type="button"
                       onMouseEnter={() => setActiveIndex(idx)}
                       onClick={() => {
                         closeCommandPalette();
                         router.push(item.href);
                       }}
                       className={`w-full flex items-center justify-between gap-4 rounded-r16 px-3.5 py-3 text-left transition-colors duration-micro ${
                         isSelected
                           ? 'bg-raised border border-accent/35'
                           : 'border border-transparent hover:bg-raised/50'
                       }`}
                     >
                       <div className="min-w-0">
                         <div className="flex items-center gap-2">
                           <span className="rounded border border-hairline bg-bg px-1.5 py-0.5 font-mono text-[10px] uppercase text-accent">
                             {item.type}
                           </span>
                           <p className="truncate text-sm font-medium text-text">
                             {segments.map((seg, i) =>
                               seg.highlight ? (
                                 <mark
                                   key={i}
                                   className="bg-accent/25 text-text rounded-sm px-0.5"
                                 >
                                   {seg.text}
                                 </mark>
                               ) : (
                                 <span key={i}>{seg.text}</span>
                               )
                             )}
                           </p>
                         </div>
                         <p className="mt-1 truncate text-xs text-muted">
                           {item.subtitle}
                         </p>
                       </div>
                       <span className="shrink-0 font-mono text-[11px] text-muted tabular-nums">
                         {item.meta} →
                       </span>
                     </button>
                   </li>
                 );
               })}
             </ul>
           )}
         </div>

         {/* System Quick Toggles */}
         <div className="pt-2.5 px-2 flex flex-wrap items-center justify-between gap-2 text-xs">
           <div className="flex items-center gap-2">
             <button
               type="button"
               onClick={toggleTheme}
               className="rounded-r10 border border-hairline bg-raised px-3 py-1.5 font-mono text-[11px] text-muted hover:text-text"
             >
               Toggle Theme ({theme === 'dark' ? 'Warm Paper' : 'Graphite Void'})
             </button>
             <button
               type="button"
               onClick={toggleSound}
               className="rounded-r10 border border-hairline bg-raised px-3 py-1.5 font-mono text-[11px] text-muted hover:text-text"
             >
               UI Audio Ticks: {soundEnabled ? 'ON' : 'OFF'}
             </button>
           </div>
           <span className="font-mono text-[10px] text-muted">
             VIRUS STUDIO COMMAND // v2026.4
           </span>
         </div>
       </div>
     </div>
   </div>
 );
}
