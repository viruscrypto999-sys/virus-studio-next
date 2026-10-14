'use client';

import React, { useEffect, useState } from 'react';

/**
* Plays once per browser session (<1.25s total).
* Skippable immediately on click or Escape/Space.
* Animates ONLY transform and opacity. Automatically bypassed on prefers-reduced-motion.
*/
export function IntroSequence() {
 const [visible, setVisible] = useState(false);
 const [stage, setStage] = useState<'enter' | 'lift'>('enter');

 useEffect(() => {
   try {
     const prefersReduced = window.matchMedia(
       '(prefers-reduced-motion: reduce)'
     ).matches;
     const alreadySeen = sessionStorage.getItem('vs_intro_seen') === '1';

     if (prefersReduced || alreadySeen) {
       return;
     }

     sessionStorage.setItem('vs_intro_seen', '1');
     setVisible(true);

     const liftTimer = window.setTimeout(() => {
       setStage('lift');
     }, 680);

     const doneTimer = window.setTimeout(() => {
       setVisible(false);
     }, 1220);

     return () => {
       window.clearTimeout(liftTimer);
       window.clearTimeout(doneTimer);
     };
   } catch {
     setVisible(false);
   }
 }, []);

 if (!visible) return null;

 const skipIntro = () => setVisible(false);

 return (
   <div
     role="dialog"
     aria-label="Virus Studio initialization"
     onClick={skipIntro}
     className={`fixed inset-0 z-[70] flex flex-col items-center justify-between bg-bg px-6 py-8 select-none cursor-pointer transition-all duration-500 ease-expo-out ${
       stage === 'lift'
         ? '-translate-y-full opacity-0 pointer-events-none'
         : 'translate-y-0 opacity-100'
     }`}
   >
     <div className="w-full max-w-[1440px] flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-muted">
       <span>VIRUS STUDIO // SYS.3050</span>
       <button
         type="button"
         onClick={skipIntro}
         className="text-muted hover:text-text transition-colors"
       >
         [SKIP INTRO]
       </button>
     </div>

     <div className="w-full max-w-xl flex flex-col items-center text-center">
       <div className="overflow-hidden py-1">
         <p className="font-serif italic text-3xl sm:text-5xl tracking-tight text-text transition-transform duration-500 ease-expo-out translate-y-0">
           Virus <span className="font-sans not-italic font-medium tracking-tighter">Studio</span>
         </p>
       </div>

       {/* 1px Hairline Draw Across via scaleX */}
       <div className="mt-5 h-[1px] w-full bg-hairline overflow-hidden">
         <div
           className="h-full w-full bg-accent origin-left transition-transform duration-500 ease-expo-out"
           style={{
             transform: stage === 'enter' ? 'scaleX(0.88)' : 'scaleX(1)',
           }}
         />
       </div>

       <div className="mt-3 flex items-center justify-between w-full text-[11px] font-mono text-muted tabular-nums">
         <span>PILLAR 01 · APPS & TOOLS</span>
         <span>PILLAR 02 · AI DISPATCHES</span>
       </div>
     </div>

     <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted">
       CALIBRATING SPATIAL OPTICS
     </div>
   </div>
 );
}
