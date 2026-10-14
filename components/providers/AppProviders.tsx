'use client';

import React, {
 createContext,
 useCallback,
 useContext,
 useEffect,
 useMemo,
 useRef,
 useState,
} from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

export type ThemeMode = 'dark' | 'light';

export interface ToastMessage {
 id: string;
 title: string;
 description?: string;
 tone?: 'default' | 'accent';
}

interface AppContextValue {
 theme: ThemeMode;
 toggleTheme: () => void;
 soundEnabled: boolean;
 toggleSound: () => void;
 playTick: (freq?: number) => void;
 isCmdOpen: boolean;
 cmdInitialQuery: string;
 openCommandPalette: (initialQuery?: string) => void;
 closeCommandPalette: () => void;
 bookmarkedApps: string[];
 toggleAppBookmark: (slug: string, name?: string) => void;
 bookmarkedNews: string[];
 toggleNewsBookmark: (slug: string, title?: string) => void;
 compareSlugs: string[];
 toggleCompareApp: (slug: string, name?: string) => void;
 clearCompareApps: () => void;
 cursorLabel: string | null;
 setCursorLabel: (label: string | null) => void;
 pushToast: (title: string, description?: string, tone?: 'default' | 'accent') => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useAppStore(): AppContextValue {
 const ctx = useContext(AppContext);
 if (!ctx) {
   throw new Error('useAppStore must be used within AppProviders');
 }
 return ctx;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
 const [theme, setTheme] = useState<ThemeMode>('dark');
 const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
 const [isCmdOpen, setIsCmdOpen] = useState<boolean>(false);
 const [cmdInitialQuery, setCmdInitialQuery] = useState<string>('');
 const [bookmarkedApps, setBookmarkedApps] = useState<string[]>([]);
 const [bookmarkedNews, setBookmarkedNews] = useState<string[]>([]);
 const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
 const [cursorLabel, setCursorLabel] = useState<string | null>(null);
 const [toasts, setToasts] = useState<ToastMessage[]>([]);

 const audioCtxRef = useRef<AudioContext | null>(null);

 // Hydrate client preferences once on mount
 useEffect(() => {
   try {
     const savedTheme = localStorage.getItem('vs_theme') as ThemeMode | null;
     if (savedTheme === 'light' || savedTheme === 'dark') {
       setTheme(savedTheme);
       document.documentElement.setAttribute('data-theme', savedTheme);
     }

     const savedSound = localStorage.getItem('vs_sound');
     if (savedSound === 'true') setSoundEnabled(true);

     const savedApps = localStorage.getItem('vs_bookmarks_apps');
     if (savedApps) setBookmarkedApps(JSON.parse(savedApps));

     const savedNews = localStorage.getItem('vs_bookmarks_news');
     if (savedNews) setBookmarkedNews(JSON.parse(savedNews));

     const savedCompare = localStorage.getItem('vs_compare_apps');
     if (savedCompare) setCompareSlugs(JSON.parse(savedCompare));
   } catch {
     // Ignore storage access errors in restricted frames
   }
 }, []);

 // Synthesize ultra-subtle 6ms acoustic UI tick via Web Audio API (zero external asset downloads)
 const playTick = useCallback(
   (freq = 1480) => {
     if (!soundEnabled || typeof window === 'undefined') return;
     try {
       const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
       if (!AudioCtx) return;
       if (!audioCtxRef.current) {
         audioCtxRef.current = new AudioCtx();
       }
       const ctx = audioCtxRef.current;
       if (ctx.state === 'suspended') {
         ctx.resume();
       }
       const osc = ctx.createOscillator();
       const gain = ctx.createGain();
       osc.type = 'sine';
       osc.frequency.setValueAtTime(freq, ctx.currentTime);
       gain.gain.setValueAtTime(0.018, ctx.currentTime);
       gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.018);

       osc.connect(gain);
       gain.connect(ctx.destination);
       osc.start();
       osc.stop(ctx.currentTime + 0.02);
     } catch {
       // Ignore audio errors on un-interacted pages
     }
   },
   [soundEnabled]
 );

 const pushToast = useCallback(
   (title: string, description?: string, tone: 'default' | 'accent' = 'default') => {
     const id = `{Math.random().toString(36).slice(2, 6)}`;
     setToasts((prev) => [...prev.slice(-2), { id, title, description, tone }]);
     window.setTimeout(() => {
       setToasts((prev) => prev.filter((item) => item.id !== id));
     }, 3200);
   },
   []
 );

 const toggleTheme = useCallback(() => {
   setTheme((prev) => {
     const next = prev === 'dark' ? 'light' : 'dark';
     document.documentElement.setAttribute('data-theme', next);
     try {
       localStorage.setItem('vs_theme', next);
     } catch {}
     return next;
   });
   playTick(1320);
 }, [playTick]);

 const toggleSound = useCallback(() => {
   setSoundEnabled((prev) => {
     const next = !prev;
     try {
       localStorage.setItem('vs_sound', String(next));
     } catch {}
     return next;
   });
 }, []);

 const openCommandPalette = useCallback(
   (initialQuery = '') => {
     setCmdInitialQuery(initialQuery);
     setIsCmdOpen(true);
     playTick(1620);
   },
   [playTick]
 );

 const closeCommandPalette = useCallback(() => {
   setIsCmdOpen(false);
   playTick(1100);
 }, [playTick]);

 // Global keyboard shortcut Cmd/Ctrl+K
 useEffect(() => {
   const onKeyDown = (e: KeyboardEvent) => {
     if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
       e.preventDefault();
       setIsCmdOpen((prev) => !prev);
     }
   };
   window.addEventListener('keydown', onKeyDown);
   return () => window.removeEventListener('keydown', onKeyDown);
 }, []);

 const toggleAppBookmark = useCallback(
   (slug: string, name?: string) => {
     setBookmarkedApps((prev) => {
       const exists = prev.includes(slug);
       const next = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
       try {
         localStorage.setItem('vs_bookmarks_apps', JSON.stringify(next));
       } catch {}
       pushToast(
         exists ? 'Removed from Saved Tools' : 'Saved to Workspace',
         name ? `${name} ${exists ? 'removed from' : 'added to'} your persistent library.` : undefined,
         exists ? 'default' : 'accent'
       );
       return next;
     });
     playTick(1740);
   },
   [playTick, pushToast]
 );

 const toggleNewsBookmark = useCallback(
   (slug: string, title?: string) => {
     setBookmarkedNews((prev) => {
       const exists = prev.includes(slug);
       const next = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
       try {
         localStorage.setItem('vs_bookmarks_news', JSON.stringify(next));
       } catch {}
       pushToast(
         exists ? 'Dispatch Removed' : 'Dispatch Bookmarked',
         title ? title.slice(0, 64) : undefined,
         exists ? 'default' : 'accent'
       );
       return next;
     });
     playTick(1740);
   },
   [playTick, pushToast]
 );

 const toggleCompareApp = useCallback(
   (slug: string, name?: string) => {
     setCompareSlugs((prev) => {
       if (prev.includes(slug)) {
         const next = prev.filter((s) => s !== slug);
         try {
           localStorage.setItem('vs_compare_apps', JSON.stringify(next));
         } catch {}
         return next;
       }
       if (prev.length >= 3) {
         pushToast(
           'Comparison Matrix Full (3/3)',
           'Remove one tool before adding another to side-by-side comparison.',
           'default'
         );
         return prev;
       }
       const next = [...prev, slug];
       try {
         localStorage.setItem('vs_compare_apps', JSON.stringify(next));
       } catch {}
       pushToast(
         `Added to Compare (${next.length}/3)`,
         name ? `${name} ready for side-by-side benchmark inspection.` : undefined,
         'accent'
       );
       return next;
     });
     playTick(1520);
   },
   [playTick, pushToast]
 );

 const clearCompareApps = useCallback(() => {
   setCompareSlugs([]);
   try {
     localStorage.removeItem('vs_compare_apps');
   } catch {}
 }, []);

 const value = useMemo<AppContextValue>(
   () => ({
     theme,
     toggleTheme,
     soundEnabled,
     toggleSound,
     playTick,
     isCmdOpen,
     cmdInitialQuery,
     openCommandPalette,
     closeCommandPalette,
     bookmarkedApps,
     toggleAppBookmark,
     bookmarkedNews,
     toggleNewsBookmark,
     compareSlugs,
     toggleCompareApp,
     clearCompareApps,
     cursorLabel,
     setCursorLabel,
     pushToast,
   }),
   [
     theme,
     toggleTheme,
     soundEnabled,
     toggleSound,
     playTick,
     isCmdOpen,
     cmdInitialQuery,
     openCommandPalette,
     closeCommandPalette,
     bookmarkedApps,
     toggleAppBookmark,
     bookmarkedNews,
     toggleNewsBookmark,
     compareSlugs,
     toggleCompareApp,
     clearCompareApps,
     cursorLabel,
     pushToast,
   ]
 );

 return (
   <LazyMotion features={domAnimation} strict>
     <AppContext.Provider value={value}>
       {children}

       {/* Hardware-accelerated Toast Stack (Transform + Opacity only) */}
       <div
         aria-live="polite"
         aria-atomic="true"
         className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
       >
         {toasts.map((t) => (
           <div
             key={t.id}
             className="pointer-events-auto spatial-glass rounded-r16 px-4 py-3.5 transition-all duration-ui ease-expo-out translate-y-0 opacity-100"
           >
             <div className="flex items-center justify-between gap-3">
               <span className="text-xs font-medium tracking-wide uppercase text-accent">
                 {t.tone === 'accent' ? 'System · Confirmed' : 'System · Notice'}
               </span>
               <span className="h-1.5 w-1.5 rounded-full bg-accent" />
             </div>
             <p className="mt-1 text-sm font-medium text-text">{t.title}</p>
             {t.description && (
               <p className="mt-0.5 text-xs text-muted leading-relaxed">{t.description}</p>
             )}
           </div>
         ))}
       </div>
     </AppContext.Provider>
   </LazyMotion>
 );
}
