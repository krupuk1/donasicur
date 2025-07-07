'use client';

import { Hero } from '@/components/Home/Hero';
import { FeaturedCampaigns } from '@/components/Home/FeaturedCampaigns';
import { Categories } from '@/components/Home/Categories';
import { Stats } from '@/components/Home/Stats';
import { HowItWorks } from '@/components/Home/HowItWorks';
import { Testimonials } from '@/components/Home/Testimonials';
import { CTA } from '@/components/Home/CTA';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Stats />
      <FeaturedCampaigns />
      <Categories />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </div>
  );
}