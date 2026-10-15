'use client';

import React, { useEffect, useState } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-hairline'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg"
            style={{
              background: 'linear-gradient(135deg, #ff1e1e, #8a0400)',
              boxShadow: '0 0 20px rgba(225,6,0,0.5)',
            }}
          >
            V
          </span>
          <span className="font-black tracking-tight text-lg uppercase">
            Virus<span className="text-accent">Studio</span>
          </span>
        </a>

        <div className="hidden sm:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          <a href="#apps" className="hover:text-text transition-colors">
            Apps
          </a>
          <a href="#about" className="hover:text-text transition-colors">
            About
          </a>
        </div>

        <a href="#apps" className="btn-red rounded-r16 px-5 py-2.5 text-[11px] uppercase">
          Download
        </a>
      </nav>
    </header>
  );
}
