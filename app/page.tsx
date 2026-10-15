import React from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
// APK garage hidden until fixed build is ready (owner order Oct 15)
// import { AppsSection } from '@/components/sections/AppsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div id="top">
      <HeroSection />
      {/* <AppsSection /> */}
      <AboutSection />
      <Footer />
    </div>
  );
}
