import React from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import { HowItWorksStory } from '@/components/home/HowItWorksStory';
import { TrendingAppsBento } from '@/components/home/TrendingAppsBento';
import { NewsHorizontalRail } from '@/components/home/NewsHorizontalRail';
import { SpotlightAndNewsletter } from '@/components/home/SpotlightAndNewsletter';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksStory />
      <TrendingAppsBento />
      <NewsHorizontalRail />
      <SpotlightAndNewsletter />
    </>
  );
}
